import {
    logo,
    hamburger,
    navMenu,
    nav,
    navItems,
    footer,
    navBorder,
} from "../dom.js";

gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline();

const navigationEntry = performance.getEntriesByType("navigation")[0];
const isReload = navigationEntry?.type === "reload";
const hasSeenNav = sessionStorage.getItem("navAnimated");

// NAV ENTRANCE ANIMATION
if (!hasSeenNav || isReload) {
    tl.from(navBorder, {
        scaleX: 0,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
    });

    gsap.from(logo, {
        x: "-80%",
        delay: 0.2,
        duration: 0.5,
        rotation: -100,
        opacity: 0,
        ease: "power1.out",
    });

    if (hamburger) {
        gsap.from(hamburger, {
            x: 20,
            opacity: 0,
            duration: 0.4,
            delay: 0.3,
            ease: "power2.out",
        });
    }

    tl.from(
        navItems,
        {
            x: -8,
            duration: 0.4,
            opacity: 0,
            ease: "power2.out",
            stagger: 0.1,
        },
        0.3,
    );

    sessionStorage.setItem("navAnimated", "true");
} else {
    // Navigation has already animated.
    // Remove any leftover GSAP animation styles.
    gsap.set([logo, navBorder, navItems], {
        clearProps: "transform,opacity",
    });

    if (hamburger) {
        gsap.set(hamburger, {
            clearProps: "transform,opacity",
        });
    }
}

// BROWSER BACK / FORWARD
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        const navTargets = [logo, navBorder, ...navItems, hamburger].filter(
            Boolean,
        );

        tl.kill();
        gsap.killTweensOf(navTargets);
        gsap.set(navTargets, {
            clearProps: "transform,opacity",
        });
        gsap.set(navItems, { opacity: 1 });
    }
});

// FOOTER ANIMATION
if (footer) {
    gsap.to(footer, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: 1.1,
        scrollTrigger: {
            trigger: footer.closest("footer") || footer,
            start: "top bottom",
            once: true,
        },
    });
}

// LOGO HOVER
logo.addEventListener("mouseenter", () => {
    gsap.to(logo, {
        rotation: -15,
        duration: 0.3,
        ease: "power1",
    });
});

logo.addEventListener("mouseleave", () => {
    gsap.to(logo, {
        rotation: 0,
        duration: 0.5,
        ease: "power1",
    });
});

// NAV ITEM HOVER
navItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        gsap.to(item, {
            y: -1,
            duration: 0.2,
            ease: "power1",
        });
    });

    item.addEventListener("mouseleave", () => {
        gsap.to(item, {
            y: 0,
            duration: 0.3,
            ease: "power1",
        });
    });
});
