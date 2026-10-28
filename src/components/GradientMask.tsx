"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./GradientMask.module.css";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
};

// Gradiente que corre devagar na diagonal, nas cores do site: preto, o
// vermelho da logo (o mais forte permitido) e um rosa claro e lavado. Só
// aparece onde a imagem tem pixel.
const FRAGMENT = `
precision mediump float;
uniform vec2 u_size;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_size;
  float t = u_time * 0.12;
  float wave = uv.x * 0.8 + uv.y * 0.6
    + 0.18 * sin(uv.y * 5.0 + t * 3.0)
    + 0.12 * sin(uv.x * 7.0 - t * 2.0);
  float band = 0.5 + 0.5 * sin((wave - t) * 6.2831);

  vec3 dark = vec3(0.04, 0.01, 0.01);
  vec3 red = vec3(0.612, 0.114, 0.137); // #9c1d23, o --red do site
  vec3 light = vec3(0.93, 0.78, 0.78); // rosa bem lavado, nunca mais forte
  vec3 color = band < 0.6
    ? mix(dark, red, smoothstep(0.0, 0.6, band))
    : mix(red, light, smoothstep(0.6, 1.0, band));
  gl_FragColor = vec4(color, 1.0);
}
`;

const VERTEX = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Imagem com um shader de gradiente animado por cima, recortado pela própria
 * imagem (mask-image com o mesmo PNG). O gradiente se mistura à textura em
 * vez de cobri-la. Sem WebGL, fica só a imagem.
 */
export function GradientMask({ src, alt, width, height, sizes }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      premultipliedAlpha: false,
      // O PixelLens copia este canvas para a versão pixelizada.
      preserveDrawingBuffer: true,
    });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Um retângulo cobrindo a tela inteira do canvas.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const size = gl.getUniformLocation(program, "u_size");
    const time = gl.getUniformLocation(program, "u_time");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Resolução baixa de propósito: é um gradiente suave, não precisa mais.
    const resize = () => {
      const scale = 0.5;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let frame = 0;
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced && !frame) frame = requestAnimationFrame(draw);
    });
    visibility.observe(canvas);

    const start = performance.now();
    function draw(now: number) {
      gl!.uniform2f(size, canvas!.width, canvas!.height);
      gl!.uniform1f(time, reduced ? 0 : (now - start) / 1000);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      frame = visible && !reduced ? requestAnimationFrame(draw) : 0;
    }
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrap} style={{ "--mask": `url(${src})` } as React.CSSProperties}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className={styles.image} />
      <canvas ref={canvasRef} className={styles.shader} aria-hidden="true" />
    </div>
  );
}
