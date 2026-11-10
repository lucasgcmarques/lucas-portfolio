"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo de pontinhos que flutuam pela página e são puxados pelo mouse.
 * Os pontos vivem em coordenadas do documento (não da tela): ao rolar, eles
 * sobem junto com o conteúdo, e a rolagem dá um empurrão neles.
 * Cada ponto nasce, deriva devagar, morre e renasce em outro lugar.
 */

const CFG = {
  /** Pontos por altura de tela; a quantidade cresce com o tamanho da página. */
  baseCount: 70,
  damping: 0.95,
  mouseInfluence: 0.15,
  mouseRadius: 350,
  /** O mouse só atrai a partir desta largura de tela (no celular não há cursor). */
  mouseMinWidth: 1024,
  minSize: 3,
  maxSize: 6,
  minOpacity: 0.5,
  maxOpacity: 1,
  birthFrames: 90,
  deathFrames: 60,
  minLife: 180,
  maxLife: 300,
  scrollImpulseX: 3e-4,
  scrollImpulseY: 1e-4,
  driftMin: 0.08,
  driftMax: 0.25,
  /** Opacidade da camada inteira, que entra em fade nos primeiros 2s. */
  layerOpacity: 0.9,
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // A cor vem do vermelho do site (--red), o teto de saturação.
    const color = getComputedStyle(document.documentElement).getPropertyValue("--red").trim() || "#9c1d23";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let docH = 0;
    const firstH = window.innerHeight;

    let count = 0;
    let x = new Float32Array(0);
    let y = new Float32Array(0);
    let vx = new Float32Array(0); // velocidade (mouse + rolagem), amortecida
    let vy = new Float32Array(0);
    let dx = new Float32Array(0); // deriva constante de cada ponto
    let dy = new Float32Array(0);
    let size = new Float32Array(0);
    let alpha = new Float32Array(0);
    let maxSize = new Float32Array(0);
    let maxAlpha = new Float32Array(0);
    let born = new Float32Array(0); // frames desde o nascimento
    let dying = new Float32Array(0); // -1 = vivo; >= 0 = frames morrendo
    let life = new Float32Array(0); // 1 → 0
    let lifeLen = new Float32Array(0);

    let mouseX = 0;
    let mouseY = 0;
    let mouseActive = false;
    let scrollY = window.scrollY;
    let scrollV = 0;
    let lastScrollY = scrollY;
    let lastT = 0;
    const start = performance.now();
    let raf = 0;
    let visible = !document.hidden;

    const targetCount = () => Math.round(CFG.baseCount * Math.max(1, docH / Math.max(1, firstH)));

    function spawn(i: number) {
      x[i] = rand(0, w);
      y[i] = rand(0, docH);
      vx[i] = 0;
      vy[i] = 0;
      const ang = rand(0, Math.PI * 2);
      const sp = rand(CFG.driftMin, CFG.driftMax);
      dx[i] = Math.cos(ang) * sp;
      dy[i] = Math.sin(ang) * sp;
      size[i] = 0;
      alpha[i] = 0;
      born[i] = 0;
      dying[i] = -1;
      life[i] = 1;
      lifeLen[i] = rand(CFG.minLife, CFG.maxLife);
    }

    function allocate() {
      count = targetCount();
      x = new Float32Array(count);
      y = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      dx = new Float32Array(count);
      dy = new Float32Array(count);
      size = new Float32Array(count);
      alpha = new Float32Array(count);
      maxSize = new Float32Array(count);
      maxAlpha = new Float32Array(count);
      born = new Float32Array(count);
      dying = new Float32Array(count);
      life = new Float32Array(count);
      lifeLen = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        spawn(i);
        maxSize[i] = rand(CFG.minSize, CFG.maxSize);
        maxAlpha[i] = rand(CFG.minOpacity, CFG.maxOpacity);
        if (reduced) {
          size[i] = maxSize[i];
          alpha[i] = maxAlpha[i];
          born[i] = CFG.birthFrames;
        }
      }
    }

    function measure() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      docH = Math.max(document.documentElement.scrollHeight, h);
      if (!mouseCapable()) mouseActive = false;
    }

    const mouseCapable = () => w >= CFG.mouseMinWidth;

    function step() {
      for (let i = 0; i < count; i++) {
        if (born[i] < CFG.birthFrames) {
          const t = ++born[i] / CFG.birthFrames;
          const e = 1 - Math.pow(1 - t, 3);
          size[i] = maxSize[i] * e;
          alpha[i] = maxAlpha[i] * e;
        }

        if (dying[i] >= 0) {
          const t = ++dying[i] / CFG.deathFrames;
          const e = Math.pow(1 - t, 2);
          size[i] = maxSize[i] * e;
          alpha[i] = maxAlpha[i] * e;
          if (dying[i] >= CFG.deathFrames) spawn(i);
          continue;
        }

        if (mouseActive) {
          const ox = mouseX - x[i];
          const oy = mouseY - (y[i] - scrollY);
          const d = Math.sqrt(ox * ox + oy * oy);
          if (d > 0 && d < CFG.mouseRadius) {
            const f = Math.pow(1 - d / CFG.mouseRadius, 2) * CFG.mouseInfluence;
            vx[i] += (ox / d) * f * 2;
            vy[i] += (oy / d) * f * 2;
          }
        }

        vx[i] += (Math.random() - 0.5) * Math.abs(scrollV) * w * CFG.scrollImpulseX;
        vy[i] += -scrollV * h * CFG.scrollImpulseY;
        vx[i] *= CFG.damping;
        vy[i] *= CFG.damping;
        x[i] += dx[i] + vx[i];
        y[i] += dy[i] + vy[i];

        if (x[i] < -50) x[i] = w + 50;
        if (x[i] > w + 50) x[i] = -50;

        life[i] -= 1 / lifeLen[i];
        if (life[i] <= 0 || y[i] < -100 || y[i] > docH + 100) dying[i] = 0;
      }
    }

    function draw(now: number) {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, -scrollY * dpr);
      ctx!.fillStyle = color;
      const layer = CFG.layerOpacity * (reduced ? 1 : Math.min(1, (now - start) / 2000));
      const top = scrollY - 10;
      const bottom = scrollY + h + 10;
      for (let i = 0; i < count; i++) {
        if (alpha[i] <= 0 || y[i] < top || y[i] > bottom) continue;
        ctx!.globalAlpha = alpha[i] * layer;
        ctx!.beginPath();
        ctx!.arc(x[i], y[i], size[i] / 2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    // Passo de simulação fixo em ~60 fps, independente da taxa da tela.
    const STEP = 1000 / 60;
    let acc = 0;
    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const sy = window.scrollY;
      const dt = Math.max(1, now - (lastT || now));
      scrollV = (sy - lastScrollY) / dt;
      lastScrollY = sy;
      scrollY = sy;
      acc = Math.min(acc + (lastT ? now - lastT : STEP), STEP * 4);
      lastT = now;
      while (acc >= STEP) {
        step();
        acc -= STEP;
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (raf || reduced) return;
      lastT = 0;
      raf = requestAnimationFrame(frame);
    }

    measure();
    allocate();
    if (reduced) draw(performance.now());
    startLoop();

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = mouseCapable();
    };
    const onLeave = () => {
      mouseActive = false;
    };
    const onResize = () => {
      measure();
      if (targetCount() !== count) allocate();
      if (reduced) {
        scrollY = window.scrollY;
        draw(performance.now());
      }
    };
    const onScroll = () => {
      if (!reduced) return;
      scrollY = window.scrollY;
      draw(performance.now());
    };
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) startLoop();
    };

    // A altura do documento muda quando imagens carregam ou ao trocar de página.
    const ro = new ResizeObserver(() => {
      const next = Math.max(document.documentElement.scrollHeight, h);
      if (next === docH) return;
      docH = next;
      if (targetCount() !== count) allocate();
      if (reduced) draw(performance.now());
    });
    ro.observe(document.body);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
