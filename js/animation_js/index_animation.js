import {
    headingIndex,
    textIntro,
    bell,
    specialties,
    codeWord,
} from "../dom.js";

gsap.registerPlugin(ScrollTrigger);

const navigationEntry = performance.getEntriesByType("navigation")[0];
const isReload = navigationEntry?.type === "reload";

const hasVisitedIndex = sessionStorage.getItem("visitedIndex") === "true";

const isReturning = hasVisitedIndex && !isReload;

const tl = gsap.timeline();

let isSpecialtiesVisible = false;

if (specialties) {
    const specialtiesTop = specialties.getBoundingClientRect().top;
    isSpecialtiesVisible = specialtiesTop < window.innerHeight;
}

// Heading
tl.to(
    headingIndex,
    {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power1.out",
    },
    0.35,
);

// Intro text
tl.to(
    textIntro,
    {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
    },
    0.4,
);

// Bell image
tl.to(
    bell,
    {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
    },
    0.5,
);

// Specialties
if (specialties && codeWord.length > 0) {
    if (isSpecialtiesVisible) {
        tl.to(
            codeWord,
            {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                stagger: 0.1,
            },
            0.6,
        );
    } else {
        gsap.to(codeWord, {
            y: 0,
            opacity: 1,
            duration: isReturning ? 0.2 : 0.4,
            ease: "power2.out",
            stagger: isReturning ? 0.05 : 0.1,
            scrollTrigger: {
                trigger: specialties,
                start: "top 80%",
            },
        });
    }
}

// Only speed up the intro if they've already visited the index
if (isReturning) {
    tl.timeScale(1.2);
}

// Mark index as visited
sessionStorage.setItem("visitedIndex", "true");
