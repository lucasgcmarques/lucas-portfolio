"use client";

import { useEffect, useRef } from "react";
import styles from "./PixelLens.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Contorno fino da caixa revelado pelo círculo. Desligue em PNGs recortados. */
  border?: boolean;
  /** Raio do círculo e distância (px) a partir da qual o efeito começa. */
  radius?: number;
  /** Tamanho do bloco da pixelização, em px de tela. */
  pixel?: number;
};

type Media = HTMLImageElement | HTMLVideoElement;

/**
 * Mesmo efeito do hero, para qualquer caixa de imagem: quando o mouse se
 * aproxima, um círculo com borda em fade acompanha o cursor. Dentro dele a
 * imagem (ou vídeo) aparece pixelizada e o contorno da caixa se acende.
 */
export function PixelLens({ children, className, border = true, radius = 180, pixel = 12 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!wrap || !canvas || !context) return;

    let active = false;
    let frame = 0;
    let last: { x: number; y: number } | null = null;

    // Onde a mídia aparece de fato dentro da caixa, respeitando object-fit e
    // object-position (cover nos cards, contain nas artes recortadas).
    function layout(media: Media) {
      const natW = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
      const natH = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
      if (!natW || !natH) return null;
      const box = media.getBoundingClientRect();
      const wrapBox = wrap!.getBoundingClientRect();
      const style = getComputedStyle(media);
      const fit = style.objectFit;
      const scale =
        fit === "cover"
          ? Math.max(box.width / natW, box.height / natH)
          : fit === "none"
            ? 1
            : Math.min(box.width / natW, box.height / natH);
      const drawW = fit === "fill" ? box.width : natW * scale;
      const drawH = fit === "fill" ? box.height : natH * scale;
      const [px, py] = style.objectPosition.split(" ").map((v) => parseFloat(v) / 100);
      const x = box.left - wrapBox.left + (box.width - drawW) * (Number.isNaN(px) ? 0.5 : px);
      const y = box.top - wrapBox.top + (box.height - drawH) * (Number.isNaN(py) ? 0.5 : py);
      return { natW, natH, x, y, drawW, drawH };
    }

    function draw() {
      const media = wrap!.querySelector<Media>("img, video");
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      const cols = Math.max(1, Math.ceil(w / pixel));
      const rows = Math.max(1, Math.ceil(h / pixel));
      if (canvas!.width !== cols || canvas!.height !== rows) {
        canvas!.width = cols;
        canvas!.height = rows;
      }
      context!.clearRect(0, 0, cols, rows);
      // Em fotos, cada bloco é a média da área. Em recortes (sem contorno), a
      // média espalhava blocos cinzas no preto em volta do desenho; amostrar
      // sem suavização mantém o bloco ou cheio ou vazio.
      context!.imageSmoothingEnabled = border;
      const place = media ? layout(media) : null;
      if (media && place) {
        const drawMedia = () =>
          context!.drawImage(
            media,
            0,
            0,
            place.natW,
            place.natH,
            place.x / pixel,
            place.y / pixel,
            place.drawW / pixel,
            place.drawH / pixel,
          );
        drawMedia();
        // Se houver um shader por cima da imagem (GradientMask), a versão
        // pixelizada leva a mesma cor, recortada pelo desenho da imagem.
        const tint = [...wrap!.querySelectorAll("canvas")].find((c) => c !== canvas);
        if (tint && tint.width > 0) {
          const box = tint.getBoundingClientRect();
          const wrapBox = wrap!.getBoundingClientRect();
          context!.globalCompositeOperation = "multiply";
          context!.drawImage(
            tint,
            (box.left - wrapBox.left) / pixel,
            (box.top - wrapBox.top) / pixel,
            box.width / pixel,
            box.height / pixel,
          );
          context!.globalCompositeOperation = "destination-in";
          drawMedia();
          context!.globalCompositeOperation = "source-over";
        }
        // Recortes têm sombra semitransparente em volta; ela virava blocos
        // escuros no preto. Cada bloco fica cheio ou vazio.
        if (!border) {
          try {
            const data = context!.getImageData(0, 0, cols, rows);
            for (let i = 3; i < data.data.length; i += 4) data.data[i] = data.data[i] < 160 ? 0 : 255;
            context!.putImageData(data, 0, 0);
          } catch {
            // Imagem de outra origem: fica sem o corte.
          }
        }
      }
      frame = active ? requestAnimationFrame(draw) : 0;
    }

    function update() {
      if (!last) return;
      const box = wrap!.getBoundingClientRect();
      const x = last.x - box.left;
      const y = last.y - box.top;
      // Distância do cursor até a caixa (0 quando está dentro dela).
      const dx = Math.max(-x, 0, x - box.width);
      const dy = Math.max(-y, 0, y - box.height);
      const near = Math.hypot(dx, dy) < radius;

      if (near) {
        wrap!.style.setProperty("--lens-x", `${x}px`);
        wrap!.style.setProperty("--lens-y", `${y}px`);
        if (!active) {
          active = true;
          wrap!.dataset.lens = "on";
          if (!frame) frame = requestAnimationFrame(draw);
        }
      } else if (active) {
        active = false;
        delete wrap!.dataset.lens;
      }
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      last = { x: event.clientX, y: event.clientY };
      update();
    }

    // No toque, o círculo segue o dedo enquanto ele está na tela.
    function onTouch(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      last = { x: touch.clientX, y: touch.clientY };
      update();
    }

    function onTouchEnd() {
      last = null;
      if (active) {
        active = false;
        delete wrap!.dataset.lens;
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, [radius, pixel, border]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.lens} ${className ?? ""}`}
      style={{ "--lens-r": `${radius}px` } as React.CSSProperties}
    >
      {children}
      <canvas ref={canvasRef} className={styles.pixels} aria-hidden="true" />
      {border ? <span className={styles.border} aria-hidden="true" /> : null}
    </div>
  );
}
