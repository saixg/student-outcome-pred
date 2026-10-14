import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Layers, Info } from 'lucide-react';

export default function ThreeStudentUniverse() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene with warm off-white fog matching Notion paper background #f6f5f4
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f5f4);
    scene.fog = new THREE.FogExp2(0xf6f5f4, 0.012);

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 18, 55);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const total = 1800;
    const gradCount = Math.floor(total * 0.499);
    const dropCount = Math.floor(total * 0.321);
    const enrolCount = total - gradCount - dropCount;

    // Notion Palette: Blue #0075de for Graduate, Coral #f64932 for Dropout, Marigold #ffb110 for Enrolled
    const clusters = [
      { name: 'Graduate', count: gradCount, color: new THREE.Color(0x0075de), center: new THREE.Vector3(16, 4, 0), radius: 13 },
      { name: 'Dropout', count: dropCount, color: new THREE.Color(0xf64932), center: new THREE.Vector3(-16, -5, 4), radius: 12 },
      { name: 'Enrolled', count: enrolCount, color: new THREE.Color(0xffb110), center: new THREE.Vector3(0, 8, -10), radius: 10 },
    ];

    const group = new THREE.Group();
    scene.add(group);

    // Subtle paper-ruled grid floor
    const gridHelper = new THREE.GridHelper(80, 24, 0xd0ccc7, 0xe4e1dd);
    gridHelper.position.y = -15;
    scene.add(gridHelper);

    // Circular particle point texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);

    clusters.forEach(c => {
      const positions = new Float32Array(c.count * 3);
      const colors = new Float32Array(c.count * 3);

      for (let i = 0; i < c.count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * c.radius;

        const sinPhi = Math.sin(phi);
        const x = c.center.x + r * sinPhi * Math.cos(theta);
        const y = c.center.y + r * sinPhi * Math.sin(theta);
        const z = c.center.z + r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const col = c.color.clone();
        col.offsetHSL((Math.random() - 0.5) * 0.04, 0, (Math.random() - 0.5) * 0.1);
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 1.6,
        vertexColors: true,
        map: texture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });

      const points = new THREE.Points(geom, mat);
      group.add(points);

      // Delicate wireframe boundary sphere
      const haloGeom = new THREE.SphereGeometry(c.radius * 0.4, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: c.color,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.position.copy(c.center);
      group.add(halo);
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    currentMount.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX * 0.4 - targetX) * 0.05;
      targetY += (mouseY * 0.25 - targetY) * 0.05;

      group.rotation.y = elapsedTime * 0.1 + targetX;
      group.rotation.x = Math.sin(elapsedTime * 0.06) * 0.05 + targetY;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] rounded-[12px] overflow-hidden notion-card border border-black/8">
      {/* Overlay header */}
      <div className="absolute top-4 left-5 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-md bg-[#e6f3fe] text-[#0075de]">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-[#000000] tracking-tight">
              3D Feature Manifold & Risk Field
            </h3>
            <p className="text-xs text-[#615d59]">
              Geometric projection of 4,424 student vectors on warm ruled canvas
            </p>
          </div>
        </div>
      </div>

      {/* Cluster Legend */}
      <div className="absolute bottom-4 left-5 z-10 flex flex-wrap gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-black/8 text-xs font-medium text-[#000000] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0075de]" />
          Graduate Cluster (49.9%)
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-black/8 text-xs font-medium text-[#000000] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffb110]" />
          Enrolled Cluster (18.0%)
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-black/8 text-xs font-medium text-[#000000] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f64932]" />
          Dropout Cluster (32.1%)
        </div>
      </div>

      {/* Hint */}
      <div className="absolute top-4 right-5 z-10 flex items-center gap-1.5 text-xs text-[#757575] bg-white px-3 py-1.5 rounded-md border border-black/8 shadow-xs">
        <Layers className="w-3.5 h-3.5 text-[#0075de]" />
        <span>Move mouse to orbit</span>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
