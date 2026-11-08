
/* =====================================================
   ASIM.OS // 8070
   DIGITAL UNIVERSE — MAIN SYSTEM ENGINE
===================================================== */

import * as THREE from "three";

/* =====================================================
   01. CONFIGURATION
===================================================== */

const CONFIG = {
    starCount: 1800,
    coreColor: 0x00e5ff,
    planetColors: [
        0x00e5ff,
        0x9165ff,
        0x1677ff
    ],
    maxPixelRatio: 2
};

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const isMobile = window.matchMedia(
    "(max-width: 700px)"
).matches;


/* =====================================================
   02. SHARED HELPERS
===================================================== */
function createRenderer(canvas, options = {}) {
    const settings = {
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
        ...options
    };

    if (canvas) {
        settings.canvas = canvas;
    }

    const renderer = new THREE.WebGLRenderer(settings);

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio)
    );

    return renderer;
}

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio)
    );

    return renderer;
}

function resizeScene(canvas, camera, renderer) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

function watchResize(canvas, camera, renderer) {
    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(() => {
            resizeScene(canvas, camera, renderer);
        });

        observer.observe(canvas);
        return observer;
    }

    window.addEventListener("resize", () => {
        resizeScene(canvas, camera, renderer);
    });
}


/* =====================================================
   03. BACKGROUND STARFIELD
===================================================== */

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

    const renderer = createRenderer(null, {
        antialias: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    const positions = new Float32Array(CONFIG.starCount * 3);

    for (let i = 0; i < CONFIG.starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0x9bdcff,
        size: isMobile ? 0.07 : 0.055,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(geometry, material);

    scene.add(stars);

    function animate() {
        requestAnimationFrame(animate);

        if (!reducedMotion) {
            stars.rotation.y += 0.00015;
            stars.rotation.x += 0.00006;
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });
}


/* =====================================================
   04. ASIM CORE — 3D ENGINE
===================================================== */

function createCore() {
    const canvas = document.querySelector("#core-canvas");

    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        1,
        0.1,
        100
    );

    camera.position.set(0, 0, 6);

    const renderer = createRenderer(canvas);

    const geometry = new THREE.IcosahedronGeometry(1.35, 2);

    const material = new THREE.MeshStandardMaterial({
        color: CONFIG.coreColor,
        wireframe: true,
        emissive: 0x007caa,
        emissiveIntensity: 1.5
    });

    const core = new THREE.Mesh(geometry, material);

    scene.add(core);


    // Outer orbital rings

    const ringGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(
            1.8 + i * 0.28,
            0.009,
            8,
            120
        );

        const ringMaterial = new THREE.MeshBasicMaterial({
            color: i === 1 ? 0x9165ff : 0x00e5ff,
            transparent: true,
            opacity: 0.7
        });

        const ring = new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );

        ring.rotation.x = Math.PI / 2 + i * 0.45;
        ring.rotation.y = i * 0.65;

        ringGroup.add(ring);
    }

    scene.add(ringGroup);


    // Core lighting

    const coreLight = new THREE.PointLight(
        0x00dfff,
        30,
        15
    );

    coreLight.position.set(0, 0, 3);

    scene.add(coreLight);

    scene.add(
        new THREE.AmbientLight(0xffffff, 1.2)
    );


    // Mouse interaction

    let targetX = 0;
    let targetY = 0;

    if (!isMobile) {
        window.addEventListener("mousemove", (event) => {
            targetX = (event.clientX / window.innerWidth - 0.5) * 0.5;
            targetY = (event.clientY / window.innerHeight - 0.5) * 0.5;
        });
    }


    // Animation

    function animate() {
        requestAnimationFrame(animate);

        if (!reducedMotion) {
            core.rotation.x += 0.002;
            core.rotation.y += 0.004;

            ringGroup.rotation.y += 0.002;
            ringGroup.rotation.x += 0.001;

            core.rotation.x += (targetY - core.rotation.x) * 0.01;
            core.rotation.y += (targetX - core.rotation.y) * 0.01;
        }

        renderer.render(scene, camera);
    }

    resizeScene(canvas, camera, renderer);
    watchResize(canvas, camera, renderer);

    animate();
}


/* =====================================================
   05. DIGITAL UNIVERSE — PLANET SYSTEM
===================================================== */

function createUniverse() {
    const canvas = document.querySelector("#universe-canvas");

    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        50,
        1,
        0.1,
        100
    );

    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    const renderer = createRenderer(canvas);

    const galaxy = new THREE.Group();

    scene.add(galaxy);


    // Central planet

    const sunGeometry = new THREE.SphereGeometry(
        0.8,
        48,
        48
    );

    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0x00cfff,
        wireframe: true
    });

    const sun = new THREE.Mesh(
        sunGeometry,
        sunMaterial
    );

    galaxy.add(sun);


    // Central glow

    const glowLight = new THREE.PointLight(
        0x00cfff,
        25,
        20
    );

    galaxy.add(glowLight);


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
            emissiveIntensity: 0.8,
            wireframe: true
        });

        const planet = new THREE.Mesh(
            planetGeometry,
            planetMaterial
        );

        planet.position.x = radius;

        orbit.add(planet);

        galaxy.add(orbit);

        planets.push({
            orbit,
            planet,
            speed: 0.003 + index * 0.001
        });


        // Orbit path

        const orbitPath = new THREE.Mesh(
            new THREE.TorusGeometry(
                radius,
                0.007,
                8,
                120
            ),
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.35
            })
        );

        orbitPath.rotation.x = Math.PI / 2;

        galaxy.add(orbitPath);
    });


    // Lighting

    scene.add(
        new THREE.AmbientLight(0xffffff, 1.5)
    );


    // Animation

    function animate() {
        requestAnimationFrame(animate);

        if (!reducedMotion) {
            sun.rotation.y += 0.003;

            planets.forEach((item) => {
                item.orbit.rotation.y += item.speed;
                item.planet.rotation.x += 0.005;
            });

            galaxy.rotation.y += 0.0008;
        }

        renderer.render(scene, camera);
    }

    resizeScene(canvas, camera, renderer);
    watchResize(canvas, camera, renderer);

    animate();
}


/* =====================================================
   06. CUSTOM CURSOR
===================================================== */

function createCursor() {
    const cursor = document.querySelector(".cursor-glow");

    if (!cursor) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
        cursor.style.display = "none";
        return;
    }

    let mouseX = -200;
    let mouseY = -200;

    let currentX = -200;
    let currentY = -200;

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


/* =====================================================
   07. ACTIVE NAVIGATION
===================================================== */

function setupNavigation() {
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navLinks = document.querySelectorAll(
        ".nav-links a"
    );

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            threshold: 0.25
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
}


/* =====================================================
   08. SMOOTH SCROLL
===================================================== */

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });
}


/* =====================================================
   09. SECTION REVEAL
===================================================== */

function setupReveal() {
    const elements = document.querySelectorAll(
        ".identity, .universe, .projects, .skills, .contact"
    );

    if (!elements.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    elements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(35px)";

        element.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}


/* =========================================
   INTERACTIVE MULTIVERSE
========================================= */

function createMultiversePortals() {
    const background = document.querySelector("#space-background");

    if (!background) return;

    // Create portal container
    const container = document.createElement("div");
    container.className = "multiverse-portals";

    const dimensions = [
        { name: "UNIVERSE ALPHA", className: "portal-alpha" },
        { name: "UNIVERSE BETA", className: "portal-beta" },
        { name: "UNIVERSE GAMMA", className: "portal-gamma" }
    ];

    const portals = [];

    dimensions.forEach((dimension) => {
        const portal = document.createElement("div");
        portal.className = `dimension-portal ${dimension.className}`;

        const core = document.createElement("div");
        core.className = "portal-core";

        const label = document.createElement("span");
        label.className = "portal-label";
        label.textContent = dimension.name;

        portal.append(core, label);
        container.appendChild(portal);

        portals.push(portal);
    });

    background.appendChild(container);

    // Mouse movement interaction
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;

        window.addEventListener("mousemove", (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
        });

        function animatePortals() {
            currentX += (mouseX - currentX) * 0.035;
            currentY += (mouseY - currentY) * 0.035;

            portals.forEach((portal, index) => {
                const depth = (index + 1) * 12;

                portal.style.translate =
                    `${-currentX * depth}px ${-currentY * depth}px`;
            });

            requestAnimationFrame(animatePortals);
        }

        if (!window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches) {
            animatePortals();
        }
    }

    console.log("MULTIVERSE PORTALS: ONLINE");
}


/* =====================================================
   10. SYSTEM INITIALIZATION
===================================================== */

function initializeASIM() {
    console.log(
        "%c ASIM.OS // 8070 ",
        "background:#03050b;color:#00e5ff;font-size:22px;font-weight:bold;padding:10px;"
    );

    console.log(
        "%c SYSTEM ONLINE ",
        "color:#00ff9d;font-size:14px;font-weight:bold;"
    );

    console.log("ASIM CORE initialized.");
    console.log("Digital Universe initialized.");

    // Each 3D system initializes independently.
    // A failure in one will not stop the others.

    const systems = [
        ["STARFIELD", createStarfield],
        ["ASIM CORE", createCore],
        ["DIGITAL UNIVERSE", createUniverse]
    ];

    systems.forEach(([name, initialize]) => {
        try {
            initialize();
            console.log(`${name}: ONLINE`);
        } catch (error) {
            console.error(`${name}: FAILED`, error);
        }
    });

    createCursor();
    setupNavigation();
    setupSmoothScroll();
    setupReveal();
}


/* =====================================================
   11. START SYSTEM
===================================================== */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeASIM,
        { once: true }
    );
} else {
    initializeASIM();
}
