gsap.registerPlugin(ScrollTrigger);

const pageName = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/\.html$/i, "");

const animatedCaseStudies = new Set([
    "fit_for_you",
    "travel_xp",
    "honey_split",
    "pottery",
]);

if (animatedCaseStudies.has(pageName)) {
    const main = document.querySelector(".main");

    if (main) {
        const nestedGroupSelector = [
            ".list_info",
            ".group_persona",
            ".travel_persona",
            ".phone_fidelity_container",
        ].join(", ");

        const topLevelGroups = Array.from(main.children);
        const nestedGroups = Array.from(
            main.querySelectorAll(nestedGroupSelector),
        );
        const animationGroups = [...topLevelGroups, ...nestedGroups];
        const animatedElements = new Set();
        const caseStudyButtons = main.querySelectorAll(
            ".travel-proto-btn, .pottery-proto-btn, .honey-proto-btn",
        );
        const usesStackedLayout = window.matchMedia(
            "(max-width: 767px)",
        ).matches;

        // A target belongs to its nearest nested content group. This prevents
        // long sections (lists, personas, and screen collections) from
        // animating content that has not reached the viewport yet.
        const belongsToGroup = (element, group) => {
            const nestedOwner = element.closest(nestedGroupSelector);

            if (group.matches(nestedGroupSelector)) {
                return nestedOwner === group;
            }

            return !nestedOwner || !group.contains(nestedOwner);
        };

        const getTargets = (group, selector) =>
            Array.from(group.querySelectorAll(selector)).filter(
                (element) =>
                    belongsToGroup(element, group) &&
                    !animatedElements.has(element),
            );

        const caseStudyContext = gsap.context(() => {
            animationGroups.forEach((group) => {
                const listItems = getTargets(group, "li");
                const text = getTargets(
                    group,
                    "h1, h2, h3, h4, h5, h6, p, button",
                ).filter((element) => !element.closest("li"));
                const media = getTargets(
                    group,
                    "img, video, svg, .color_circle",
                );

                const targets = [...text, ...listItems, ...media];

                if (targets.length === 0) {
                    return;
                }

                targets.forEach((target) => animatedElements.add(target));

                gsap.set([...text, ...listItems], {
                    autoAlpha: 0,
                    x: -10,
                    willChange: "transform, opacity",
                });

                gsap.set(media, {
                    autoAlpha: 0,
                    scale: 0.92,
                    transformOrigin: "50% 50%",
                    willChange: "transform, opacity",
                });

                const reveal = gsap.timeline({
                    defaults: {
                        overwrite: "auto",
                    },
                    scrollTrigger: {
                        trigger: group,
                        start: "top 88%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });

                if (usesStackedLayout) {
                    const mediaTargets = new Set(media);
                    const orderedTargets = [...targets].sort((first, second) =>
                        first.compareDocumentPosition(second) &
                        Node.DOCUMENT_POSITION_FOLLOWING
                            ? -1
                            : 1,
                    );

                    // Mobile layouts place content in one column. Animate the
                    // actual DOM order so an image or button cannot enter
                    // before the text positioned above it.
                    orderedTargets.forEach((target, index) => {
                        const isMedia = mediaTargets.has(target);

                        reveal.to(
                            target,
                            {
                                autoAlpha: 1,
                                x: isMedia ? undefined : 0,
                                scale: isMedia ? 1 : undefined,
                                duration: isMedia ? 0.55 : 0.45,
                                ease: isMedia
                                    ? "back.out(1.35)"
                                    : "power2.out",
                                clearProps: "transform,willChange",
                            },
                            index === 0 ? 0 : "<0.12",
                        );
                    });
                } else if (text.length > 0) {
                    // In side-by-side layouts, text and media begin together.
                    reveal.to(
                        text,
                        {
                            autoAlpha: 1,
                            x: 0,
                            duration: 0.45,
                            stagger: 0.07,
                            ease: "power2.out",
                            clearProps: "transform,willChange",
                        },
                        0,
                    );
                }

                if (!usesStackedLayout && listItems.length > 0) {
                    reveal.to(
                        listItems,
                        {
                            autoAlpha: 1,
                            x: 0,
                            duration: 0.45,
                            stagger: 0.12,
                            ease: "power2.out",
                            clearProps: "transform,willChange",
                        },
                        0,
                    );
                }

                if (!usesStackedLayout && media.length > 0) {
                    reveal.to(
                        media,
                        {
                            autoAlpha: 1,
                            scale: 1,
                            duration: 0.55,
                            stagger: 0.09,
                            ease: "back.out(1.35)",
                            clearProps: "transform,willChange",
                        },
                        0,
                    );
                }
            });
        }, main);

        // The CSS keeps the page from flashing before these initial GSAP
        // values exist. Reveal the container only after every target is set.
        main.style.visibility = "visible";

        caseStudyButtons.forEach((button) => {
            button.addEventListener("mouseenter", () => {
                gsap.to(button, {
                    y: -4,
                    duration: 0.15,
                    ease: "power1.out",
                    overwrite: "auto",
                });
            });

            button.addEventListener("mouseleave", () => {
                gsap.to(button, {
                    y: 0,
                    duration: 0.15,
                    ease: "power1.out",
                    overwrite: "auto",
                });
            });
        });

        // Refresh after images and GIFs have their final dimensions so the
        // trigger positions remain accurate on both first load and history
        // navigation.
        window.addEventListener(
            "load",
            () => {
                ScrollTrigger.refresh();
            },
            { once: true },
        );

        window.addEventListener("pageshow", (event) => {
            if (event.persisted) {
                ScrollTrigger.refresh(true);
            }
        });

        // Browsers can preserve a half-finished animation in the back/forward
        // cache. Reverting this context before the page is stored restores the
        // natural styles, so revisiting never leaves content hidden or clipped.
        window.addEventListener(
            "pagehide",
            () => {
                caseStudyContext.revert();
            },
            { once: true },
        );
    }
}
