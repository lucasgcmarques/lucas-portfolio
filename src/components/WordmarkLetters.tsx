"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroWordmark.module.css";

// Quanto a letra mais próxima do mouse cresce, nos eixos da Anybody variável.
// Eixos da JRK Olho Negro: wght 100–900, wdth 70–600, desc 0–100 (cada letra
// drena de um lado e incha no outro).
const REST = { size: 300, wght: 720, wdth: 400, desc: 0 };
const PEAK = { size: 345, wght: 900, wdth: 600, desc: 100 };
const AXES = { wght: [100, 900], wdth: [70, 600], desc: [0, 100] } as const;
// Distância (em unidades do viewBox) em que o efeito some.
const RADIUS = 400;

// Altura do desenho e posição das linhas. OLHO fica presa pela base e cresce
// para cima; NEGRO fica presa pelo topo (baseline "hanging") e cresce para
// baixo, então as duas palavras podem ficar bem próximas sem se encostar.
const HEIGHT = 540;
// Quanto do topo da caixa é cortado. As letras do OLHO, ao crescer, passam
// desse limite e têm o topo cortado pela borda de cima.
const CROP_TOP = 50;
// Se mudar HEIGHT ou CROP_TOP, atualize o aspect-ratio de .stage no CSS.
const OLHO_BASELINE = 258;
const NEGRO_TOP = 282;

// Mola de cada letra: pouco amortecimento faz a letra passar do ponto e
// quicar algumas vezes antes de parar, principalmente ao tirar o mouse.
const STIFFNESS = 140;
const DAMPING = 7;

// Pixelização do vídeo em volta do mouse: tamanho do bloco (px) e raio do
// círculo que acompanha o cursor, com borda em fade. O mesmo círculo revela o
// contorno fino das letras.
const PIXEL = 14;
const LENS_RADIUS = 220;

type Spring = { value: number; velocity: number; target: number };

/**
 * As letras da máscara do hero. Cada letra é um <tspan> com uma mola própria;
 * ao passar o mouse, as letras próximas ganham tamanho, peso e largura. O
 * textLength da linha mantém a palavra na mesma largura, então as vizinhas se
 * comprimem para abrir espaço.
 */
export function WordmarkLetters({ lines }: { lines: [string, string] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const outlineRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hovering = useRef(false);
  const pixelFrame = useRef<number | null>(null);
  const springs = useRef<Spring[]>([]);
  const frame = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (pixelFrame.current !== null) cancelAnimationFrame(pixelFrame.current);
    },
    [],
  );

  function letters() {
    return [
      ...(svgRef.current?.querySelectorAll<SVGTSpanElement>("tspan") ?? []),
    ];
  }

  function outlineLetters() {
    return [
      ...(outlineRef.current?.querySelectorAll<SVGTSpanElement>("tspan") ?? []),
    ];
  }

  function render(letter: SVGTSpanElement, t: number, index: number) {
    const clamp = (n: number, min: number, max: number) =>
      Math.min(max, Math.max(min, n));
    const axis = (name: keyof typeof AXES) =>
      clamp(REST[name] + (PEAK[name] - REST[name]) * t, AXES[name][0], AXES[name][1]);
    letter.style.fontSize = `${REST.size + (PEAK.size - REST.size) * t}px`;
    letter.style.fontVariationSettings = `"wght" ${axis("wght")}, "wdth" ${axis("wdth")}, "DESC" ${axis("desc")}`;
    const outline = outlineLetters()[index];
    if (outline) {
      outline.style.fontSize = letter.style.fontSize;
      outline.style.fontVariationSettings = letter.style.fontVariationSettings;
    }
  }

  /**
   * Desenha o vídeo do fundo em blocos grandes num canvas por cima dele. O
   * canvas só aparece dentro do círculo do mouse (máscara no CSS), então a
   * pixelização surge em fade em volta do cursor. Roda só durante o hover.
   */
  function drawPixels() {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    const source = stage?.querySelector<HTMLVideoElement | HTMLImageElement>(
      "video, img",
    );
    const context = canvas?.getContext("2d");
    if (!canvas || !stage || !source || !context) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const cols = Math.ceil(width / PIXEL);
    const rows = Math.ceil(height / PIXEL);
    if (canvas.width !== cols || canvas.height !== rows) {
      canvas.width = cols;
      canvas.height = rows;
    }

    const sourceWidth =
      source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
    const sourceHeight =
      source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
    if (sourceWidth && sourceHeight) {
      // Mesmo enquadramento do object-fit: cover do vídeo.
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const cropW = width / scale;
      const cropH = height / scale;
      context.drawImage(
        source,
        (sourceWidth - cropW) / 2,
        (sourceHeight - cropH) / 2,
        cropW,
        cropH,
        0,
        0,
        cols,
        rows,
      );
    }

    if (hovering.current) {
      pixelFrame.current = requestAnimationFrame(drawPixels);
    } else {
      pixelFrame.current = null;
    }
  }

  function setLens(event: React.PointerEvent<SVGSVGElement> | null) {
    const stage = svgRef.current?.parentElement;
    if (!stage) return;
    if (!event) {
      hovering.current = false;
      delete stage.dataset.lens;
      return;
    }
    const box = stage.getBoundingClientRect();
    stage.style.setProperty("--lens-x", `${event.clientX - box.left}px`);
    stage.style.setProperty("--lens-y", `${event.clientY - box.top}px`);
    stage.style.setProperty("--lens-r", `${LENS_RADIUS}px`);
    stage.dataset.lens = "on";
    if (!hovering.current) {
      hovering.current = true;
      if (pixelFrame.current === null) drawPixels();
    }
  }

  function tick(last: number) {
    frame.current = requestAnimationFrame((now) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      let moving = false;
      letters().forEach((letter, i) => {
        const spring = springs.current[i];
        if (!spring) return;
        const force =
          STIFFNESS * (spring.target - spring.value) -
          DAMPING * spring.velocity;
        spring.velocity += force * dt;
        spring.value += spring.velocity * dt;
        if (
          Math.abs(spring.velocity) > 0.001 ||
          Math.abs(spring.target - spring.value) > 0.001
        ) {
          moving = true;
        } else {
          spring.value = spring.target;
          spring.velocity = 0;
        }
        render(letter, spring.value, i);
      });
      if (moving) tick(now);
      else frame.current = null;
    });
  }

  function apply(pointerX: number | null, pointerY: number | null) {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    letters().forEach((letter, i) => {
      let t = 0;
      if (pointerX !== null && pointerY !== null) {
        const box = letter.getBBox();
        const dx = pointerX - (box.x + box.width / 2);
        const dy = pointerY - (box.y + box.height / 2);
        t = Math.max(0, 1 - Math.hypot(dx, dy * 1.5) / RADIUS);
        t = t * t * (3 - 2 * t);
      }
      const spring = (springs.current[i] ??= {
        value: 0,
        velocity: 0,
        target: 0,
      });
      spring.target = t;
      if (reduced) {
        spring.value = t;
        spring.velocity = 0;
        render(letter, t, i);
      }
    });
    if (!reduced && frame.current === null) tick(performance.now());
  }

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    if (event.pointerType !== "mouse") return;
    setLens(event);
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    apply(point.x, point.y);
  }

  const text = lines.map((line, row) => (
    <text
      key={line}
      className={styles.letters}
      x="0"
      y={row === 0 ? OLHO_BASELINE : NEGRO_TOP}
      dominantBaseline={row === 0 ? undefined : "hanging"}
      textLength="1000"
      lengthAdjust="spacingAndGlyphs"
    >
      {[...line].map((char, i) => (
        <tspan key={i}>{char}</tspan>
      ))}
    </text>
  ));

  return (
    <>
      <canvas ref={canvasRef} className={styles.pixels} aria-hidden="true" />
      <div className={styles.cursor} aria-hidden="true" />
      <svg
        ref={svgRef}
        className={styles.mask}
        viewBox={`0 ${CROP_TOP} 1000 ${HEIGHT - CROP_TOP}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        onPointerMove={handleMove}
        onPointerLeave={() => {
          setLens(null);
          apply(null, null);
        }}
      >
        <rect y={CROP_TOP} width="1000" height={HEIGHT - CROP_TOP} fill="#000" />
        {text}
      </svg>
      <svg
        ref={outlineRef}
        className={styles.outline}
        viewBox={`0 ${CROP_TOP} 1000 ${HEIGHT - CROP_TOP}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {text}
      </svg>
    </>
  );
}
