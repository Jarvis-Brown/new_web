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
if (headingIndex) {
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
}

// Intro text
if (textIntro) {
    tl.to(
        textIntro,
        {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power1.out",
        },
        0.35,
    );
}

// Bell image
if (bell) {
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
}

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

const specialtySentence = document.querySelector(".specialties_sentence");
const specialtyDescription = specialtySentence?.parentElement;
const stackedSpecialties = window.matchMedia("(max-width: 426px)");

if (
    specialtySentence &&
    specialtyDescription &&
    specialties &&
    codeWord.length > 0
) {
    const getHoveredWord = () =>
        Array.from(codeWord).find((word) => word.matches(":hover"));

    const positionDescription = (word, updateText = false) => {
        gsap.killTweensOf(codeWord);
        const previousTops = new Map(
            Array.from(codeWord, (item) => [
                item,
                item.getBoundingClientRect().top,
            ]),
        );

        if (updateText && word) {
            specialtySentence.textContent = word.dataset.description;
        }

        const isInline = stackedSpecialties.matches && Boolean(word);
        specialtyDescription.classList.toggle("is-inline", isInline);

        if (isInline) {
            word.after(specialtyDescription);
        } else {
            specialties.after(specialtyDescription);
        }

        const offsets = new Map();
        codeWord.forEach((item) => {
            const offset =
                previousTops.get(item) - item.getBoundingClientRect().top;
            if (Math.abs(offset) > 1) {
                offsets.set(item, offset);
            }
        });

        if (offsets.size > 0) {
            const movedWords = Array.from(offsets.keys());
            gsap.fromTo(
                movedWords,
                { y: (index, item) => offsets.get(item) },
                {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto",
                },
            );
        }
    };

    const revealSpecialty = (word) => {
        codeWord.forEach((item) => {
            item.classList.toggle("is-active", item === word);
        });
        positionDescription(word, true);
        gsap.killTweensOf(specialtySentence);
        gsap.to(specialtySentence, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
        });
    };

    const hideSpecialty = () => {
        const activeWord = getHoveredWord();

        if (activeWord) {
            revealSpecialty(activeWord);
            return;
        }

        codeWord.forEach((word) => word.classList.remove("is-active"));
        gsap.killTweensOf(specialtySentence);
        gsap.to(specialtySentence, {
            opacity: 0,
            y: 8,
            duration: 0.18,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: () => {
                const currentWord = getHoveredWord();
                if (currentWord) {
                    revealSpecialty(currentWord);
                } else {
                    positionDescription(null);
                }
            },
        });
    };

    codeWord.forEach((word) => {
        word.addEventListener("mouseenter", () => revealSpecialty(word));
        word.addEventListener("mouseleave", hideSpecialty);
    });

    stackedSpecialties.addEventListener("change", () => {
        positionDescription(getHoveredWord());
    });
}

// Only speed up the intro if they've already visited the index
if (isReturning) {
    tl.timeScale(1.2);
}

// Mark index as visited
sessionStorage.setItem("visitedIndex", "true");
