/* =========================================
   ASIM.OS // 8070
   MAIN INTERACTION SYSTEM
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. SYSTEM INITIALIZATION
    // =====================================

    console.log("%c ASIM.OS // 8070 ",
        "background:#050509;color:#00e5ff;font-size:22px;font-weight:bold;padding:12px;"
    );

    console.log("%c SYSTEM ONLINE ",
        "color:#00ff9c;font-size:14px;"
    );

    console.log("Welcome to the digital universe.");


    // =====================================
    // 2. NEON CURSOR GLOW
    // =====================================

    const cursor = document.querySelector(".cursor-glow");

    if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener("mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            cursor.style.opacity = "1";
        });

        document.addEventListener("mouseleave", () => {
            cursor.style.opacity = "0";
        });

        function animateCursor() {

            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;

            cursor.style.left = currentX + "px";
            cursor.style.top = currentY + "px";

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }


    // =====================================
    // 3. NAVIGATION ACTIVE STATE
    // =====================================

    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll(
        "#home, #identity, #architecture, #work, #lab, #contact"
    );

    function updateNavigation() {

        let currentSection = "home";

        sections.forEach((section) => {

            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop <= window.innerHeight * 0.4) {
                currentSection = section.id;
            }

        });

        navLinks.forEach((link) => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }

        });

    }

    window.addEventListener("scroll", updateNavigation, {
        passive: true
    });

    updateNavigation();


    // =====================================
    // 4. SMOOTH NAVIGATION
    // =====================================

    const allNavigationLinks = document.querySelectorAll(
        '.nav-link, .brand, .hero-buttons a, .scroll-indicator'
    );

    allNavigationLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetID = link.getAttribute("href");

            if (!targetID || !targetID.startsWith("#")) return;

            const target = document.querySelector(targetID);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // =====================================
    // 5. SCROLL REVEAL SYSTEM
    // =====================================

    const revealElements = document.querySelectorAll(
        ".content-section, .hero-interface, .hero-content"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal-element");
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    // =====================================
    // 6. SYSTEM STATUS
    // =====================================

    const systemStatus = document.querySelector(".system-status");

    if (systemStatus) {

        systemStatus.setAttribute("title", "All systems operational");

    }


    // =====================================
    // 7. PROJECT LINK PROTECTION
    // =====================================

    const emptyLinks = document.querySelectorAll(
        'a[href="#"]'
    );

    emptyLinks.forEach((link) => {

        link.addEventListener("click", (event) => {
            event.preventDefault();
        });

    });


    // =====================================
    // 8. SYSTEM READY
    // =====================================

    document.body.classList.add("system-ready");

    console.log("%c ALL SYSTEMS INITIALIZED ",
        "background:#00ff9c;color:#000;padding:8px;font-weight:bold;"
    );

});
