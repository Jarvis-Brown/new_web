import {
    profilePic,
    profileTextContainer,
    hrLine,
    contactTitle,
    iconLink,
    linkGroup,
} from "../dom.js";

gsap.registerPlugin(ScrollTrigger);

const currentPage = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/\.html$/i, "");

const isMePage = currentPage === "me";

if (isMePage) {
    // ----------------------------------
    // ABOUT ME TIMELINE
    // ----------------------------------

    const aboutTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".profile_group_container",
            start: "top 85%",
            once: true,
        },
    });

    // ----------------------------------
    // ABOUT ME TEXT SECTIONS
    // ----------------------------------

    profileTextContainer.forEach((group, groupIndex) => {
        const title = group.querySelector("h3");
        const paragraphs = group.querySelectorAll("p");
        const link = group.querySelector(".link_group");

        // ----------------------------------
        // TITLE
        // ----------------------------------

        if (title) {
            aboutTL.to(
                title,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    ease: "power2.out",
                },
                groupIndex === 0 ? undefined : "<0.15",
            );
        }

        // ----------------------------------
        // PROFILE PICTURE
        // Desktop: moves left/right into place
        // 768px and below: moves down into place
        // ----------------------------------

        if (groupIndex === 0 && profilePic) {
            const isTablet = window.matchMedia("(max-width: 768px)").matches;

            aboutTL.to(
                profilePic,
                {
                    opacity: 1,
                    x: isTablet ? undefined : 0,
                    y: isTablet ? 0 : undefined,
                    duration: 3,
                    ease: "power2.out",
                },
                "<",
            );
        }

        // ----------------------------------
        // PARAGRAPHS
        // Overlap one after another
        // ----------------------------------

        paragraphs.forEach((paragraph, index) => {
            aboutTL.to(
                paragraph,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.35,
                    ease: "power2.out",
                },
                index === 0 ? "<0.3" : "<0.15",
            );
        });

        // ----------------------------------
        // ANIMATION PORTFOLIO BUTTON
        // ----------------------------------

        if (link) {
            aboutTL.to(
                link,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.35,
                    ease: "power2.out",
                },
                "<0.15",
            );
        }
    });

    // ----------------------------------
    // HR
    // ----------------------------------

    if (hrLine) {
        gsap.set(hrLine, {
            opacity: 0,
            scaleX: 0,
            transformOrigin: "center",
        });

        aboutTL.to(
            hrLine,
            {
                opacity: 1,
                scaleX: 1,
                duration: 0.6,
                ease: "power2.out",
            },
            "<0.15",
        );
    }

    // ----------------------------------
    // CONTACT ME
    // ----------------------------------

    if (contactTitle) {
        gsap.set(contactTitle, {
            opacity: 0,
            y: -10,
        });

        aboutTL.to(
            contactTitle,
            {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
            },
            "<0.15",
        );
    }

    // ----------------------------------
    // ICONS
    // ----------------------------------

    if (iconLink.length > 0) {
        gsap.set(iconLink, {
            opacity: 0,
            scale: 0.8,
        });

        aboutTL.to(
            iconLink,
            {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                stagger: 0.15,
                ease: "back.out(1.5)",
            },
            "<0.15",
        );
    }

    // ----------------------------------
    // ICON HOVERS
    // ----------------------------------

    iconLink.forEach((icon) => {
        icon.addEventListener("mouseenter", () => {
            gsap.to(icon, {
                y: -2,
                scale: 1.1,
                duration: 0.15,
                ease: "power1.out",
            });
        });

        icon.addEventListener("mouseleave", () => {
            gsap.to(icon, {
                y: 0,
                scale: 1,
                duration: 0.15,
                ease: "power1.out",
            });
        });
    });

    // ----------------------------------
    // LINK HOVER
    // ----------------------------------

    if (linkGroup) {
        linkGroup.addEventListener("mouseenter", () => {
            gsap.to(linkGroup, {
                y: -4,
                duration: 0.15,
                ease: "power1.out",
            });
        });

        linkGroup.addEventListener("mouseleave", () => {
            gsap.to(linkGroup, {
                y: 0,
                duration: 0.15,
                ease: "power1.out",
            });
        });
    }

    // ----------------------------------
    // SPEED UP ENTIRE TIMELINE
    // ----------------------------------

    const targetDuration = 1.5;
    aboutTL.timeScale(aboutTL.duration() / targetDuration);
}
