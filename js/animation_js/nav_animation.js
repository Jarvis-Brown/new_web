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

const shouldAnimateNav = document.documentElement.classList.contains(
    "nav-entrance-pending",
);

// NAV ENTRANCE ANIMATION
if (shouldAnimateNav) {
    gsap.set(navBorder, { scaleX: 0, opacity: 0 });
    gsap.set(logo, { x: "-80%", rotation: -100, opacity: 0 });
    gsap.set(navItems, { x: -8, opacity: 0 });
    if (hamburger) {
        gsap.set(hamburger, { x: 20, opacity: 0 });
    }

    tl.to(navBorder, {
        scaleX: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
    });

    gsap.to(logo, {
        x: 0,
        rotation: 0,
        opacity: 1,
        delay: 0.2,
        duration: 0.5,
        ease: "power1.out",
    });

    if (hamburger) {
        gsap.to(hamburger, {
            x: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.3,
            ease: "power2.out",
        });
    }

    tl.to(
        navItems,
        {
            x: 0,
            duration: 0.4,
            opacity: 1,
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

document.documentElement.classList.remove("nav-entrance-pending");

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

export function animateFooter() {
    if (!footer) {
        return;
    }

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

animateFooter();

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
