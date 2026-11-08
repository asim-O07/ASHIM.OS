
import * as THREE from "three";

/* =========================================
   ASIM.OS // 8070
   3D SYSTEM ENGINE
========================================= */

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const clock = new THREE.Clock();

/* =========================================
   01. CREATE STARFIELD
========================================= */

function createStars(scene, count = 1800, spread = 100) {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0x9bdfff,
        size: 0.09,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    return stars;
}

/* =========================================
   02. ASIM CORE
========================================= */

const coreCanvas = document.querySelector("#core-canvas");

let coreRenderer;
let coreScene;
let coreCamera;
let coreGroup;
let coreStars;

if (coreCanvas) {
    coreScene = new THREE.Scene();

    coreCamera = new THREE.PerspectiveCamera(
        45,
        1,
        0.1,
        100
    );

    coreCamera.position.z = 7;

    coreRenderer = new THREE.WebGLRenderer({
        canvas: coreCanvas,
        alpha: true,
        antialias: true
    });

    coreRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    coreRenderer.setClearColor(0x000000, 0);

    coreGroup = new THREE.Group();
    coreScene.add(coreGroup);

    // Main energy core
    const coreGeometry = new THREE.IcosahedronGeometry(1.45, 2);

    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x071a34,
        emissive: 0x0066bb,
        emissiveIntensity: 1.1,
        metalness: 0.8,
        roughness: 0.25,
        wireframe: true
    });

    const coreMesh = new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );

    coreGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeometry = new THREE.SphereGeometry(0.85, 48, 48);

    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x073d70,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });

    const innerSphere = new THREE.Mesh(
        innerGeometry,
        innerMaterial
    );

    coreGroup.add(innerSphere);

    // Outer orbital rings
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00eaff,
        transparent: true,
        opacity: 0.7
    });

    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.05, 0.009, 8, 140),
        ringMaterial
    );

    ring1.rotation.x = 1.15;
    ring1.rotation.y = 0.35;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.006, 8, 140),
        new THREE.MeshBasicMaterial({
            color: 0x925cff,
            transparent: true,
            opacity: 0.65
        })
    );

    ring2.rotation.x = 0.4;
    ring2.rotation.y = 1.1;
    coreGroup.add(ring2);

    // Lighting
    coreScene.add(
        new THREE.AmbientLight(0x6688aa, 1.5)
    );

    const cyanLight = new THREE.PointLight(
        0x00eaff,
        18,
        20
    );

    cyanLight.position.set(3, 3, 4);
    coreScene.add(cyanLight);

    const purpleLight = new THREE.PointLight(
        0x803cff,
        12,
        20
    );

    purpleLight.position.set(-3, -2, 2);
    coreScene.add(purpleLight);

    coreStars = createStars(coreScene, 700, 30);

    function resizeCore() {
        const width = coreCanvas.clientWidth;
        const height = coreCanvas.clientHeight;

        if (!width || !height) return;

        coreRenderer.setSize(width, height, false);

        coreCamera.aspect = width / height;
        coreCamera.updateProjectionMatrix();
    }

    resizeCore();

    window.addEventListener("resize", resizeCore);
}

/* =========================================
   03. DIGITAL UNIVERSE
========================================= */

const universeCanvas = document.querySelector(
    "#universe-canvas"
);

let universeRenderer;
let universeScene;
let universeCamera;
let galaxyGroup;
let galaxyStars;
let planets = [];

if (universeCanvas) {
    universeScene = new THREE.Scene();

    universeCamera = new THREE.PerspectiveCamera(
        50,
        1,
        0.1,
        100
    );

    universeCamera.position.set(0, 2, 9);
    universeCamera.lookAt(0, 0, 0);

    universeRenderer = new THREE.WebGLRenderer({
        canvas: universeCanvas,
        alpha: true,
        antialias: true
    });

    universeRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    universeRenderer.setClearColor(0x000000, 0);

    galaxyGroup = new THREE.Group();
    universeScene.add(galaxyGroup);

    // Central galaxy
    const sunGeometry = new THREE.SphereGeometry(
        0.75,
        48,
        48
    );

    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0x00bfff,
        wireframe: true
    });

    const sun = new THREE.Mesh(
        sunGeometry,
        sunMaterial
    );

    galaxyGroup.add(sun);

    // Central glow
    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x176cff,
            transparent: true,
            opacity: 0.12
        })
    );

    galaxyGroup.add(glow);

    // Orbital planets
    const planetData = [
        {
            radius: 0.2,
            distance: 1.8,
            color: 0x00eaff,
            speed: 0.7
        },
        {
            radius: 0.3,
            distance: 2.7,
            color: 0x9561ff,
            speed: 0.4
        },
        {
            radius: 0.14,
            distance: 3.5,
            color: 0x4a9eff,
            speed: 0.25
        }
    ];

    planetData.forEach((data, index) => {
        const orbit = new THREE.Group();
        galaxyGroup.add(orbit);

        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(
                data.radius,
                24,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: data.color,
                emissive: data.color,
                emissiveIntensity: 0.6,
                metalness: 0.6,
                roughness: 0.3
            })
        );

        planet.position.x = data.distance;
        orbit.add(planet);

        const orbitLine = new THREE.Mesh(
            new THREE.TorusGeometry(
                data.distance,
                0.004,
                4,
                120
            ),
            new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.25
            })
        );

        orbitLine.rotation.x = Math.PI / 2;
        galaxyGroup.add(orbitLine);

        planets.push({
            orbit,
            planet,
            speed: data.speed,
            index
        });
    });

    universeScene.add(
        new THREE.AmbientLight(0xffffff, 1.8)
    );

    const galaxyLight = new THREE.PointLight(
        0x00aaff,
        20,
        30
    );

    galaxyLight.position.set(2, 3, 4);
    universeScene.add(galaxyLight);

    galaxyStars = createStars(
        universeScene,
        1000,
        35
    );

    function resizeUniverse() {
        const width = universeCanvas.clientWidth;
        const height = universeCanvas.clientHeight;

        if (!width || !height) return;

        universeRenderer.setSize(width, height, false);

        universeCamera.aspect = width / height;
        universeCamera.updateProjectionMatrix();
    }

    resizeUniverse();

    window.addEventListener("resize", resizeUniverse);
}

/* =========================================
   04. MOUSE INTERACTION
========================================= */

const mouse = {
    x: 0,
    y: 0
};

window.addEventListener("pointermove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

/* =========================================
   05. CURSOR GLOW
========================================= */

const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow) {
    window.addEventListener("pointermove", (event) => {
        cursorGlow.style.left = `${event.clientX - 150}px`;
        cursorGlow.style.top = `${event.clientY - 150}px`;
    });
}

/* =========================================
   06. NAVIGATION HIGHLIGHT
========================================= */

const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                    ) {
                        link.classList.add("active");
                    }
                });
            }
        });
    },
    {
        threshold: 0.35
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});

/* =========================================
   07. MAIN ANIMATION LOOP
========================================= */

function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // ASIM CORE
    if (coreRenderer && coreGroup) {
        if (!reducedMotion) {
            coreGroup.rotation.y = elapsed * 0.15;
            coreGroup.rotation.x =
                Math.sin(elapsed * 0.3) * 0.12;

            coreGroup.rotation.y += mouse.x * 0.001;

            coreStars.rotation.y = elapsed * 0.008;
        }

        coreRenderer.render(coreScene, coreCamera);
    }

    // DIGITAL UNIVERSE
    if (universeRenderer && galaxyGroup) {
        if (!reducedMotion) {
            galaxyGroup.rotation.y = elapsed * 0.08;
            galaxyGroup.rotation.x =
                Math.sin(elapsed * 0.2) * 0.08;

            galaxyStars.rotation.y = -elapsed * 0.01;

            planets.forEach((item) => {
                item.orbit.rotation.y =
                    elapsed * item.speed;

                item.planet.rotation.y =
                    elapsed * 0.6;
            });
        }

        universeRenderer.render(
            universeScene,
            universeCamera
        );
    }
}

animate();

/* =========================================
   08. SYSTEM INITIALIZATION
========================================= */

console.log(
    "%c ASIM.OS // 8070 ",
    "background:#03050b;color:#00eaff;font-size:20px;font-weight:bold;padding:12px;"
);

console.log("SYSTEM ONLINE");
console.log("3D ENGINE INITIALIZED");
console.log("WELCOME TO THE DIGITAL UNIVERSE");

