
import * as THREE from "three";

/* =====================================
   ASIM.OS // 8070
   MAIN SYSTEM ENGINE
===================================== */

const CONFIG = {
  starCount: 1800,
  coreColor: 0x00e5ff,
  planetColors: [0x00e5ff, 0x8b5cf6, 0x2563eb]
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* =====================================
   1. STARFIELD BACKGROUND
===================================== */

function createStarfield() {
  const container = document.querySelector("#space-background");
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(CONFIG.starCount * 3);

  for (let i = 0; i < CONFIG.starCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0x8bdcff,
    size: 0.055,
    transparent: true,
    opacity: 0.8
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  function animate() {
    requestAnimationFrame(animate);

    if (!prefersReducedMotion) {
      stars.rotation.y += 0.00015;
      stars.rotation.x += 0.00008;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* =====================================
   2. ASIM CORE - 3D OBJECT
===================================== */

function createCore() {
  const canvas = document.querySelector("#core-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / Math.max(canvas.clientHeight, 1),
    0.1,
    100
  );

  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Core geometry
  const coreGeometry = new THREE.IcosahedronGeometry(1.4, 2);

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: CONFIG.coreColor,
    wireframe: true,
    emissive: 0x007caa,
    emissiveIntensity: 1.5
  });

  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(core);

  // Outer rings
  const ringGroup = new THREE.Group();

  for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(
      1.9 + i * 0.25,
      0.008,
      8,
      120
    );

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: i === 1 ? 0x8b5cf6 : 0x00e5ff,
      transparent: true,
      opacity: 0.7
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    ring.rotation.x = Math.PI / 2 + i * 0.5;
    ring.rotation.y = i * 0.7;

    ringGroup.add(ring);
  }

  scene.add(ringGroup);

  // Central light
  const light = new THREE.PointLight(0x00d9ff, 25, 15);
  light.position.set(0, 0, 3);
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  function animate() {
    requestAnimationFrame(animate);

    if (!prefersReducedMotion) {
      core.rotation.x += 0.002;
      core.rotation.y += 0.004;

      ringGroup.rotation.y += 0.002;
      ringGroup.rotation.x += 0.001;
    }

    renderer.render(scene, camera);
  }

  animate();

  new ResizeObserver(() => {
    const width = canvas.clientWidth;
    const height = Math.max(canvas.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }).observe(canvas);
}

/* =====================================
   3. DIGITAL UNIVERSE
===================================== */

function createUniverse() {
  const canvas = document.querySelector("#universe-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    canvas.clientWidth / Math.max(canvas.clientHeight, 1),
    0.1,
    100
  );

  camera.position.set(0, 3, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const galaxy = new THREE.Group();
  scene.add(galaxy);

  // Central planet
  const sunGeometry = new THREE.SphereGeometry(0.8, 48, 48);

  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0x00cfff,
    wireframe: true
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  galaxy.add(sun);

  // Orbiting planets
  const planets = [];

  CONFIG.planetColors.forEach((color, index) => {
    const orbit = new THREE.Group();

    const radius = 2 + index * 0.85;

    const planetGeometry = new THREE.SphereGeometry(
      0.18 + index * 0.06,
      24,
      24
    );

    const planetMaterial = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.7,
      wireframe: true
    });

    const planet = new THREE.Mesh(
      planetGeometry,
      planetMaterial
    );

    planet.position.x = radius;

    orbit.add(planet);
    galaxy.add(orbit);

    planets.push(orbit);

    // Orbit path
    const orbitPath = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.006, 8, 120),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35
      })
    );

    orbitPath.rotation.x = Math.PI / 2;
    galaxy.add(orbitPath);
  });

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  function animate() {
    requestAnimationFrame(animate);

    if (!prefersReducedMotion) {
      sun.rotation.y += 0.003;

      planets.forEach((planet, index) => {
        planet.rotation.y += 0.003 + index * 0.001;
      });

      galaxy.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
  }

  animate();

  new ResizeObserver(() => {
    const width = canvas.clientWidth;
    const height = Math.max(canvas.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }).observe(canvas);
}

/* =====================================
   4. CUSTOM CURSOR GLOW
===================================== */

function createCursor() {
  const cursor = document.querySelector(".cursor-glow");
  if (!cursor) return;

  if (window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = "none";
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animateCursor() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    cursor.style.transform =
      `translate3d(${currentX}px, ${currentY}px, 0)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* =====================================
   5. NAVIGATION ACTIVE SECTION
===================================== */

function setupNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      threshold: 0.25
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =====================================
   6. SMOOTH SCROLL
===================================== */

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "instant" : "smooth",
          block: "start"
        });
      }
    });
  });
}

/* =====================================
   7. REVEAL ELEMENTS ON SCROLL
===================================== */

function setupReveal() {
  const elements = document.querySelectorAll(
    ".identity, .universe, .projects, .skills, .contact"
  );

  if (!elements.length) return;

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((element) => observer.observe(element));
}

/* =====================================
   8. SYSTEM INITIALIZATION
===================================== */

function initializeASIM() {
  console.log("%c ASIM.OS // 8070 ", "color:#00e5ff;font-size:20px;font-weight:bold;");
  console.log("%c SYSTEM ONLINE ", "color:#8b5cf6;font-size:14px;");
  console.log("ASIM CORE initialized.");

  try {
    createStarfield();
    createCore();
    createUniverse();
  } catch (error) {
    console.error("3D engine initialization failed:", error);
  }

  createCursor();
  setupNavigation();
  setupSmoothScroll();
  setupReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeASIM);
} else {
  initializeASIM();
}
