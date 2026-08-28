import { headerXp, headerOneXp, headerTwoXp, resumeBtn } from "../dom.js";

gsap.registerPlugin(ScrollTrigger);

const currentPage = window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/\.html$/i, "");

const isExperiencePage = currentPage === "experience";

if (isExperiencePage) {
    // ----------------------------------
    // MAIN HEADER
    // ----------------------------------

    const headerTL = gsap.timeline();

    headerTL.to(
        headerXp,
        {
            duration: 0.15,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
        },
        0.08,
    );

    headerTL.to(
        headerOneXp,
        {
            duration: 0.15,
            y: 0,
            opacity: 1,
            ease: "power2.out",
        },
        0.12,
    );

    headerTL.to(
        headerTwoXp,
        {
            duration: 0.15,
            y: 0,
            opacity: 1,
            ease: "power2.out",
        },
        0.16,
    );

    headerTL.to(
        resumeBtn,
        {
            y: 0,
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
        },
        0.16,
    );

    // ----------------------------------
    // RESUME BUTTON HOVER
    // ----------------------------------

    resumeBtn.addEventListener("mouseenter", () => {
        gsap.to(resumeBtn, {
            y: -2,
            duration: 0.12,
            ease: "power1.out",
        });
    });

    resumeBtn.addEventListener("mouseleave", () => {
        gsap.to(resumeBtn, {
            y: 0,
            duration: 0.12,
            ease: "power1.out",
        });
    });

    // ----------------------------------
    // ALL MAIN SECTIONS
    // ----------------------------------

    const experienceSections = document.querySelectorAll("main section");

    let workExperienceTL;

    experienceSections.forEach((currentSection, sectionIndex) => {
        const heading = currentSection.querySelector("h3");

        const skillGroups = currentSection.querySelectorAll(".skills_info");

        const jobs = currentSection.querySelectorAll(".job_container");

        const directParagraphs = currentSection.querySelectorAll(":scope > p");

        const divider = currentSection.nextElementSibling;

        const isLastSection = sectionIndex === experienceSections.length - 1;

        const isSkillsSection = heading?.textContent.trim() === "Skills";

        const isWorkExperience =
            heading?.textContent.trim() === "Work Experience";

        // ----------------------------------
        // STARTING STATES
        // ----------------------------------

        if (heading) {
            gsap.set(heading, {
                opacity: 0,
                y: -10,
            });
        }

        skillGroups.forEach((group) => {
            const skillItems = group.querySelectorAll("p");

            gsap.set(skillItems, {
                opacity: 0,
                y: -10,
            });
        });

        jobs.forEach((job) => {
            const title = job.querySelector(".job_title");

            const info = job.querySelector(".job_info");

            const titleItems = title.querySelectorAll("p, a");

            const infoItems = info.querySelectorAll("p, li");

            gsap.set(title, {
                opacity: 0,
                x: 10,
            });

            gsap.set(titleItems, {
                opacity: 0,
                x: 10,
            });

            gsap.set(info, {
                opacity: 0,
                x: -10,
            });

            gsap.set(infoItems, {
                opacity: 0,
                x: -10,
            });
        });

        if (directParagraphs.length > 0) {
            gsap.set(directParagraphs, {
                opacity: 0,
                y: -10,
            });
        }

        if (divider?.classList.contains("header_hr")) {
            gsap.set(divider, {
                opacity: 0,
                scaleX: 0,
                transformOrigin: "center",
            });
        }

        // ----------------------------------
        // CREATE SECTION TIMELINE
        // ----------------------------------

        let sectionTL;

        if (isWorkExperience) {
            sectionTL = gsap.timeline({
                paused: true,
            });

            workExperienceTL = sectionTL;
        } else {
            sectionTL = gsap.timeline({
                delay: sectionIndex === 0 ? headerTL.duration() : 0,

                scrollTrigger: {
                    trigger: currentSection,
                    start: isLastSection ? "top 100%" : "top 70%",
                    once: true,
                },
            });
        }

        // ----------------------------------
        // 1. SECTION HEADING
        // ----------------------------------

        if (heading) {
            sectionTL.to(heading, {
                opacity: 1,
                y: 0,
                duration: 0.15,
                ease: "power2.out",
            });
        }

        // ----------------------------------
        // 2. SKILLS
        // ----------------------------------

        skillGroups.forEach((group, groupIndex) => {
            const skillItems = group.querySelectorAll("p");

            sectionTL.to(
                skillItems,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    stagger: 0.04,
                    ease: "power2.out",
                },
                groupIndex === 0 ? ">" : "<",
            );
        });

        // ----------------------------------
        // 3. WORK EXPERIENCE + PROJECTS
        // ----------------------------------

        jobs.forEach((job) => {
            const title = job.querySelector(".job_title");

            const info = job.querySelector(".job_info");

            const titleItems = title.querySelectorAll("p, a");

            const infoItems = info.querySelectorAll("p, li");

            // Title + info containers start together
            sectionTL.to(title, {
                opacity: 1,
                x: 0,
                duration: 0.2,
                ease: "power2.out",
            });

            sectionTL.to(
                info,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.2,
                    ease: "power2.out",
                },
                "<",
            );

            // Title + info items stagger together
            sectionTL.to(
                titleItems,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.2,
                    stagger: 0.04,
                    ease: "power2.out",
                },
                "-=0.08",
            );

            sectionTL.to(
                infoItems,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.2,
                    stagger: 0.04,
                    ease: "power2.out",
                },
                "<",
            );
        });

        // ----------------------------------
        // 4. CERTIFICATIONS + EDUCATION
        // ----------------------------------

        if (directParagraphs.length > 0) {
            sectionTL.to(directParagraphs, {
                opacity: 1,
                y: 0,
                duration: 0.2,
                stagger: 0.05,
                ease: "power2.out",
            });
        }

        // ----------------------------------
        // 5. HR LAST
        // ----------------------------------

        if (divider?.classList.contains("header_hr")) {
            sectionTL.to(divider, {
                opacity: 1,
                scaleX: 1,
                duration: 0.2,
                ease: "power2.out",

                onComplete: () => {
                    if (isSkillsSection && workExperienceTL) {
                        workExperienceTL.play();
                    }
                },
            });
        }
    });
}
