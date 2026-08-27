import {
    header,
    textArea,
    cardArea,
    cardText,
    secondaryLink,
    primaryLink,
} from "../dom.js";

gsap.registerPlugin(ScrollTrigger);

// -------------------------
// PAGE INTRO
// -------------------------

const tl = gsap.timeline();

tl.to(
    header,
    {
        y: 0,
        opacity: 1,
        duration: 0.2,
        ease: "power1.out",
    },
    0.17,
);

tl.to(
    textArea,
    {
        y: 0,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
    },
    0.2,
);

// -------------------------
// WORK CARDS
// -------------------------

ScrollTrigger.batch(cardArea, {
    start: "top 80%",
    once: true,

    onEnter: (cards) => {
        const cardTL = gsap.timeline();

        const visibleCardText = cards
            .map((card) => card.querySelector(".card_txt"))
            .filter(Boolean);

        const visibleSecondaryLinks = cards
            .map((card) => card.querySelector(".secondary-link"))
            .filter(Boolean);

        const visiblePrimaryLinks = cards
            .map((card) => card.querySelector(".primary-link"))
            .filter(Boolean);

        cardTL.to(
            cards,
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.2,
                ease: "expo.inOut",
            },
            0.2,
        );

        cardTL.to(
            visibleCardText,
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.2,
            },
            0.5,
        );

        cardTL.to(
            visibleSecondaryLinks,
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.2,
            },
            0.6,
        );

        cardTL.to(
            visiblePrimaryLinks,
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.2,
            },
            0.75,
        );
    },
});

// -------------------------
// PRIMARY LINK HOVER
// -------------------------

primaryLink.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        gsap.to(item, {
            y: -4,
            duration: 0.2,
            ease: "power1",
        });
    });

    item.addEventListener("mouseleave", () => {
        gsap.to(item, {
            y: 0,
            duration: 0.2,
            ease: "power1",
        });
    });
});

// -------------------------
// SECONDARY LINK HOVER
// -------------------------

secondaryLink.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        gsap.to(item, {
            y: -4,
            duration: 0.2,
            ease: "power1",
        });
    });

    item.addEventListener("mouseleave", () => {
        gsap.to(item, {
            y: 0,
            duration: 0.2,
            ease: "power1",
        });
    });
});
