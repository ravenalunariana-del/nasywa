/**
 * space-3d.js - Modul Efek 3D Interaktif untuk Portofolio Nasywa Ayyatul Husna
 * Menggunakan Three.js & CSS 3D Transforms:
 * 1. Latar Belakang Bintang & Partikel 3D (Background Starfield)
 * 2. Planet 3D Interaktif dengan Cincin & Satelit Berputar (Hero 3D Planet)
 * 3. Globe / Satelit Cyber 3D pada Halaman Kontak
 * 4. Efek 3D Tilt Parallax pada Kartu Konten saat Hover Kursor
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    init3DCardTilt();
    if (typeof THREE !== "undefined") {
      initBackground3DStars();
      initHero3DPlanet();
      initContact3DGlobe();
    } else {
      console.warn("Three.js belum termuat. Menjalankan fallback efek 3D CSS.");
    }
  });

  /* ==========================================================
     1. LATAR BELAKANG 3D: STARFIELD & COSMIC DUST
     ========================================================== */
  function initBackground3DStars() {
    const bgContainer = document.getElementById("space-3d-bg");
    if (!bgContainer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bgContainer.appendChild(renderer.domElement);

    // Partikel Bintang 3D
    const starCount = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    // Palet warna bintang pastel lembut untuk tema terang (Light Theme)
    const colorPalette = [
      new THREE.Color("#6366F1"), // Indigo
      new THREE.Color("#38BDF8"), // Sky Blue
      new THREE.Color("#A855F7"), // Purple
      new THREE.Color("#F59E0B"), // Gold
      new THREE.Color("#94A3B8"), // Slate
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 250;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Material partikel bulat lembut
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.7)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    // Gerakan kamera halus mengikuti pergerakan mouse (Parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    function animate() {
      requestAnimationFrame(animate);

      // Rotasi pelan partikel luar angkasa
      starField.rotation.y += 0.0004;
      starField.rotation.x += 0.0002;

      // Parallax easing
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ==========================================================
     2. HERO 3D PLANET: PLANET BERCINCIN INTERAKTIF
     ========================================================== */
  function initHero3DPlanet() {
    const container = document.getElementById("hero-3d-planet-container");
    if (!container) return;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 28);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group utama planet
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // 1. Bola Planet Utama
    const sphereGeo = new THREE.SphereGeometry(6, 64, 64);
    
    // Shader gradien lembut (Sky Blue ke Indigo pastel)
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: 0x1e1b4b,
      specular: 0x93c5fd,
      shininess: 40,
      flatShading: false,
    });
    const planetSphere = new THREE.Mesh(sphereGeo, sphereMat);
    planetGroup.add(planetSphere);

    // 2. Lapisan Atmosfer Berkilau (Atmospheric Wireframe Glow)
    const atmosphereGeo = new THREE.SphereGeometry(6.25, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    planetGroup.add(atmosphere);

    // 3. Cincin Planet 3D (Saturn Ring)
    const ringGeo = new THREE.RingGeometry(8.2, 13, 64);
    
    // Sesuaikan orientasi UV cincin agar miring estetik
    const pos = ringGeo.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      ringGeo.attributes.uv.setXY(i, v3.length() < 10 ? 0 : 1, 1);
    }

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      roughness: 0.4,
      metalness: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.42;
    ring.rotation.y = -Math.PI * 0.12;
    planetGroup.add(ring);

    // Cincin partikel halus sekunder
    const outerRingGeo = new THREE.RingGeometry(13.4, 14.2, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI * 0.42;
    outerRing.rotation.y = -Math.PI * 0.12;
    planetGroup.add(outerRing);

    // 4. Satelit / Bulan Kecil yang Mengorbit
    const moonPivot = new THREE.Group();
    planetGroup.add(moonPivot);

    const moonGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x0284c7,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(16, 2, 0);
    moonPivot.add(moon);

    // Lintasan Orbit Putus-putus
    const orbitTrackGeo = new THREE.BufferGeometry();
    const orbitTrackPoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      orbitTrackPoints.push(Math.cos(theta) * 16, Math.sin(theta) * 2, Math.sin(theta) * 16);
    }
    orbitTrackGeo.setAttribute("position", new THREE.Float32BufferAttribute(orbitTrackPoints, 3));
    const orbitTrackMat = new THREE.LineDashedMaterial({
      color: 0x94a3b8,
      dashSize: 1,
      gapSize: 0.8,
      transparent: true,
      opacity: 0.45,
    });
    const orbitTrackLine = new THREE.Line(orbitTrackGeo, orbitTrackMat);
    orbitTrackLine.computeLineDistances();
    moonPivot.add(orbitTrackLine);

    // 5. Pencahayaan 3D (Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(15, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 0.8);
    dirLight2.position.set(-20, -10, -15);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x38bdf8, 1, 50);
    pointLight.position.set(0, 10, 15);
    scene.add(pointLight);

    // 6. Interaksi Drag & Putar Menggunakan Mouse / Touch
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.003, y: 0.006 };
    let isUserInteracting = false;

    const domElement = renderer.domElement;
    domElement.style.cursor = "grab";

    domElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      isUserInteracting = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      domElement.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        domElement.style.cursor = "grab";
        setTimeout(() => {
          isUserInteracting = false;
        }, 1200);
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      planetGroup.rotation.y += deltaX * 0.008;
      planetGroup.rotation.x += deltaY * 0.008;

      rotationVelocity = {
        x: deltaY * 0.0015,
        y: deltaX * 0.0015,
      };

      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    // Touch Support untuk HP/Tablet
    domElement.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        isUserInteracting = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener("touchend", () => {
      isDragging = false;
      setTimeout(() => {
        isUserInteracting = false;
      }, 1000);
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      planetGroup.rotation.y += deltaX * 0.01;
      planetGroup.rotation.x += deltaY * 0.01;

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    // Tombol Reset Rotasi jika ada
    const resetBtn = document.getElementById("reset-3d-planet");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        planetGroup.rotation.set(0.15, 0, 0);
        rotationVelocity = { x: 0.002, y: 0.005 };
      });
    }

    // Loop Animasi
    function animatePlanet() {
      requestAnimationFrame(animatePlanet);

      if (!isDragging) {
        if (!isUserInteracting) {
          planetGroup.rotation.y += 0.004;
          planetGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.12;
        } else {
          // Inertia perlahan
          planetGroup.rotation.y += rotationVelocity.y;
          planetGroup.rotation.x += rotationVelocity.x;
          rotationVelocity.x *= 0.95;
          rotationVelocity.y *= 0.95;
        }
      }

      // Rotasi satelit/bulan mengelilingi planet
      moonPivot.rotation.y += 0.012;
      moon.rotation.y += 0.02;

      // Rotasi halus atmosfer
      atmosphere.rotation.y -= 0.0015;

      renderer.render(scene, camera);
    }
    animatePlanet();

    // Resize container
    window.addEventListener("resize", () => {
      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 400;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
  }

  /* ==========================================================
     3. KONTAK 3D: GLOBE KOMUNIKASI & GELOMBANG SINYAL 3D
     ========================================================== */
  function initContact3DGlobe() {
    const container = document.getElementById("contact-3d-globe-container");
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Geodesic / Icosahedron Globe Wireframe
    const globeGeo = new THREE.IcosahedronGeometry(7, 3);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    group.add(globe);

    // Inti bercahaya (Inner Glow Core)
    const coreGeo = new THREE.SphereGeometry(5.5, 32, 32);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      emissive: 0x1e1b4b,
      transparent: true,
      opacity: 0.85,
      shininess: 80,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Cincin Gelombang Sinyal Pulsa
    const signalRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(7.5 + i * 1.8, 7.8 + i * 1.8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x6366f1 : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5 - i * 0.12,
      });
      const sRing = new THREE.Mesh(ringGeo, ringMat);
      sRing.rotation.x = Math.PI * 0.35 + i * 0.2;
      sRing.rotation.y = i * 0.3;
      group.add(sRing);
      signalRings.push(sRing);
    }

    // Node Satelit Sinyal
    const nodesGroup = new THREE.Group();
    group.add(nodesGroup);
    for (let i = 0; i < 8; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      const phi = Math.acos(-1 + (2 * i) / 8);
      const theta = Math.sqrt(8 * Math.PI) * phi;
      nodeMesh.position.setFromSphericalCoords(7.2, phi, theta);
      nodesGroup.add(nodeMesh);
    }

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0x6366f1, 1.2);
    dir.position.set(10, 15, 20);
    scene.add(dir);

    // Interaktivitas Mouse Drag
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      renderer.domElement.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      renderer.domElement.style.cursor = "grab";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      group.rotation.y += dx * 0.008;
      group.rotation.x += dy * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    function animateContact() {
      requestAnimationFrame(animateContact);
      if (!isDragging) {
        group.rotation.y += 0.006;
        group.rotation.x += 0.002;
      }
      signalRings.forEach((r, idx) => {
        r.rotation.z += 0.005 * (idx + 1);
      });
      renderer.render(scene, camera);
    }
    animateContact();

    window.addEventListener("resize", () => {
      const newW = container.clientWidth || 360;
      const newH = container.clientHeight || 360;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
  }

  /* ==========================================================
     4. EFEK 3D TILT PARALLAX PADA KARTU (CSS 3D TRANSFORMS)
     ========================================================== */
  function init3DCardTilt() {
    const cards = document.querySelectorAll(".card-3d-tilt, .card-hover-lift");

    cards.forEach((card) => {
      // Pastikan parent mendukung perspective 3D
      card.style.transformStyle = "preserve-3d";
      card.style.transition = "transform 0.15s ease-out, box-shadow 0.25s ease-out";

      // Tambahkan specular glare element
      let glare = card.querySelector(".glare-3d");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "glare-3d";
        glare.style.position = "absolute";
        glare.style.inset = "0";
        glare.style.borderRadius = "inherit";
        glare.style.pointerEvents = "none";
        glare.style.opacity = "0";
        glare.style.transition = "opacity 0.25s ease";
        glare.style.background =
          "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)";
        glare.style.zIndex = "20";
        card.appendChild(glare);
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12; // derajat kemiringan vertikal
        const rotateY = ((x - centerX) / centerX) * 12; // derajat kemiringan horizontal

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
          2
        )}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;

        // Posisikan glare
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 65%)`;
        glare.style.opacity = "1";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease";
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        glare.style.opacity = "0";
      });

      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.15s ease-out, box-shadow 0.25s ease-out";
      });
    });
  }
})();
