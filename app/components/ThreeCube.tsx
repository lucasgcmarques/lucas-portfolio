"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

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

    // Torus
    const geometry = new THREE.TorusGeometry(1.5, 0.5, 32, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      metalness: 0.5,
      roughness: 0.3,
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Wireframe Torus
    const wireGeometry = new THREE.TorusGeometry(2, 0.4, 16, 50);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x4ecdc4,
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

      // Rotação baseada no scroll
      torus.rotation.x = scroll + Date.now() * 0.0005;
      torus.rotation.y = scroll * 1.5 + Date.now() * 0.0003;

      wireTorus.rotation.x = -scroll + Date.now() * 0.0003;
      wireTorus.rotation.y = -scroll * 1.5 + Date.now() * 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
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
