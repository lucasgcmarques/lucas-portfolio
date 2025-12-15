"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

// Função para criar torus com geometria de quads
function createQuadTorus(radius = 2, tube = 0.6, segU = 32, segV = 16) {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segU; i++) {
    const u = (i / segU) * Math.PI * 2;
    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * Math.PI * 2;
      const x = (radius + tube * Math.cos(v)) * Math.cos(u);
      const y = (radius + tube * Math.cos(v)) * Math.sin(u);
      const z = tube * Math.sin(v);
      vertices.push(x, y, z);
    }
  }

  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * (segV + 1) + j;
      const b = (i + 1) * (segV + 1) + j;
      const c = (i + 1) * (segV + 1) + (j + 1);
      const d = i * (segV + 1) + (j + 1);
      // quad → 2 triângulos
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

export default function ThreeCube() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Cena
    const scene = new THREE.Scene();

    // Câmera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0); // Fundo transparente
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Wireframe Torus com geometria customizada
    const wireGeometry = createQuadTorus(2, 0.4, 32, 16);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x8f8f8f,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wireTorus = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireTorus);

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Scroll listener
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animação
    const animate = () => {
      requestAnimationFrame(animate);

      const scroll = scrollRef.current * 0.002;

      wireTorus.rotation.x = -scroll + Date.now() * 0.0003;
      wireTorus.rotation.y = -scroll * 1.5 + Date.now() * 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      wireGeometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
