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
    let clickPinnedWord = null;
    let clickDismissedWord = null;

    const getHoveredWord = () =>
        Array.from(codeWord).find(
            (word) => word !== clickDismissedWord && word.matches(":hover"),
        );

    const positionDescription = (word, updateText = false) => {
        const previousWordTops = new Map(
            Array.from(codeWord, (item) => [
                item,
                item.getBoundingClientRect().top,
            ]),
        );
        gsap.killTweensOf([...codeWord, specialtySentence]);
        gsap.set(codeWord, { y: 0 });
        gsap.set(specialtySentence, { y: 0 });

        if (updateText && word) {
            specialtySentence.textContent = word.dataset.description;
        }

        const isStacked = stackedSpecialties.matches && Boolean(word);
        const sentenceGap = 10;
        const layoutWordTops = new Map(
            Array.from(codeWord, (item) => [
                item,
                item.getBoundingClientRect().top,
            ]),
        );
        const sentenceTop = specialtySentence.getBoundingClientRect().top;
        const sentenceY = isStacked
            ? word.getBoundingClientRect().bottom + sentenceGap - sentenceTop
            : 0;
        gsap.set(specialtySentence, { y: sentenceY });

        const wordShift = isStacked
            ? specialtySentence.getBoundingClientRect().height + sentenceGap
            : 0;
        const activeIndex = Array.from(codeWord).indexOf(word);
        let hasWordMovement = false;
        const wordMoveDuration = 0.3;

        codeWord.forEach((item, index) => {
            const startY =
                previousWordTops.get(item) - layoutWordTops.get(item);
            const targetY = isStacked && index > activeIndex ? wordShift : 0;

            gsap.set(item, { y: startY });
            if (Math.abs(startY - targetY) > 1) {
                hasWordMovement = true;
                gsap.to(item, {
                    y: targetY,
                    duration: wordMoveDuration,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            }
        });

        return { sentenceY, hasWordMovement, wordMoveDuration };
    };

    const revealSpecialty = (word) => {
        codeWord.forEach((item) => {
            item.classList.toggle("is-active", item === word);
        });
        const { sentenceY, hasWordMovement, wordMoveDuration } =
            positionDescription(word, true);
        gsap.fromTo(
            specialtySentence,
            { opacity: 0, y: sentenceY - 8 },
            {
                opacity: 1,
                y: sentenceY,
                duration: 0.25,
                delay: hasWordMovement ? wordMoveDuration : 0,
                ease: "power2.out",
                overwrite: "auto",
            },
        );
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
        word.addEventListener("mouseenter", () => {
            clickDismissedWord = null;
            if (clickPinnedWord && clickPinnedWord !== word) {
                clickPinnedWord = null;
            }
            if (clickPinnedWord !== word) {
                revealSpecialty(word);
            }
        });
        word.addEventListener("mouseleave", () => {
            if (clickPinnedWord === word) {
                return;
            }
            if (clickDismissedWord === word) {
                clickDismissedWord = null;
            }
            hideSpecialty();
        });
        word.addEventListener("click", () => {
            if (clickPinnedWord === word) {
                clickPinnedWord = null;
                clickDismissedWord = word.matches(":hover") ? word : null;
                hideSpecialty();
            } else {
                clickPinnedWord = word;
                clickDismissedWord = null;
                revealSpecialty(word);
            }
        });
    });
}

// Only speed up the intro if they've already visited the index
if (isReturning) {
    tl.timeScale(1.2);
}

// Mark index as visited
sessionStorage.setItem("visitedIndex", "true");
