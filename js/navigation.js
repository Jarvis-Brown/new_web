import { refreshDomReferences } from "./dom.js";
import { animateFooter } from "./animation_js/nav_animation.js";

const pageAnimations = [
    "./animation_js/index_animation.js",
    "./animation_js/work_animation.js",
    "./animation_js/experience_animation.js",
    "./animation_js/me_animation.js",
    "./animation_js/case_study_animation.js",
];

let navigationId = 0;
let navigationQueue = Promise.resolve();
let scrollToTopButton;
let renderedUrl = new URL(window.location.href);

const updateScrollToTopButton = () => {
    scrollToTopButton?.classList.toggle("show", window.scrollY > 300);
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

const setupScrollToTop = () => {
    scrollToTopButton?.removeEventListener("click", scrollToTop);
    scrollToTopButton = document.getElementById("scrollToTopBtn");
    scrollToTopButton?.addEventListener("click", scrollToTop);
    updateScrollToTopButton();
};

window.addEventListener("scroll", updateScrollToTopButton);
setupScrollToTop();

const getPageStylesheets = (page, baseUrl) =>
    Array.from(page.querySelectorAll('link[rel="stylesheet"]'), (link) => ({
        href: new URL(link.getAttribute("href"), baseUrl).href,
        media: link.media || "all",
    }));

const loadPageStylesheets = async (stylesheets) => {
    const currentLinks = new Set(
        Array.from(document.querySelectorAll('link[rel="stylesheet"]'), (link) =>
            new URL(link.href).href,
        ),
    );
    const addedLinks = [];

    await Promise.all(
        stylesheets.map(
            ({ href }) =>
                new Promise((resolve, reject) => {
                    if (currentLinks.has(href)) {
                        resolve();
                        return;
                    }

                    const link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = href;
                    link.media = "print";
                    link.onload = () => resolve();
                    link.onerror = () =>
                        reject(new Error(`Unable to load stylesheet: ${href}`));
                    addedLinks.push(link);
                    document.head.append(link);
                }),
        ),
    );

    return addedLinks;
};

const navigateTo = async (url, { addHistoryEntry, scrollY = 0 } = {}) => {
    const currentUrl = new URL(window.location.href);

    if (
        url.pathname === renderedUrl.pathname &&
        url.search === renderedUrl.search
    ) {
        if (url.hash) {
            document.querySelector(url.hash)?.scrollIntoView();
        } else if (addHistoryEntry) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.scrollTo(0, scrollY);
        }
        return;
    }

    let response;
    try {
        response = await fetch(url.href, {
            headers: { Accept: "text/html" },
        });
    } catch (error) {
        console.error("Could not load the requested page without reloading.", error);
        window.location.assign(url.href);
        return;
    }

    if (!response.ok) {
        console.error(
            `Navigation request failed with status ${response.status}: ${url.href}`,
        );
        window.location.assign(url.href);
        return;
    }

    const finalUrl = new URL(response.url);
    if (finalUrl.origin !== window.location.origin) {
        window.location.assign(url.href);
        return;
    }

    const nextPage = new DOMParser().parseFromString(
        await response.text(),
        "text/html",
    );
    const persistentNav = document.querySelector(".nav-bar");

    if (!nextPage.body || !nextPage.querySelector(".nav-bar") || !persistentNav) {
        console.error(`The requested page is missing its shared navbar: ${url.href}`);
        window.location.assign(url.href);
        return;
    }

    const stylesheets = getPageStylesheets(nextPage, finalUrl);
    let addedStylesheets;
    try {
        addedStylesheets = await loadPageStylesheets(stylesheets);
    } catch (error) {
        console.error("Could not load styles for the requested page.", error);
        window.location.assign(url.href);
        return;
    }

    const nextBodyContent = Array.from(nextPage.body.childNodes)
        .filter(
            (node) =>
                node.nodeType !== Node.ELEMENT_NODE ||
                !node.matches("script, .nav-bar"),
        )
        .map((node) => document.importNode(node, true));

    if (addHistoryEntry) {
        history.replaceState(
            { ...history.state, scrollY: window.scrollY },
            "",
            currentUrl.href,
        );
        history.pushState({ scrollY: 0 }, "", url.href);
    }

    ScrollTrigger.killAll();
    const oldPageNodes = Array.from(document.body.childNodes).filter(
        (node) => node !== persistentNav,
    );
    const oldPageElements = oldPageNodes.flatMap((node) =>
        node.nodeType === Node.ELEMENT_NODE
            ? [node, ...node.querySelectorAll("*")]
            : [],
    );
    gsap.killTweensOf(oldPageElements);
    document.body.replaceChildren(persistentNav, ...nextBodyContent);
    renderedUrl = new URL(url.href);

    document.title = nextPage.title;
    const nextDescription = nextPage.querySelector('meta[name="description"]');
    let description = document.querySelector('meta[name="description"]');
    if (nextDescription && description) {
        description.content = nextDescription.content;
    } else if (nextDescription) {
        description = document.createElement("meta");
        description.name = "description";
        description.content = nextDescription.content;
        document.head.append(description);
    } else {
        description?.remove();
    }

    const nextStylesheetHrefs = new Set(stylesheets.map(({ href }) => href));
    document
        .querySelectorAll('link[rel="stylesheet"]')
        .forEach((link) => {
            if (!nextStylesheetHrefs.has(new URL(link.href).href)) {
                link.remove();
            }
        });
    addedStylesheets.forEach((link) => {
        const stylesheet = stylesheets.find(({ href }) => href === link.href);
        link.media = stylesheet?.media || "all";
    });

    refreshDomReferences();
    setupScrollToTop();
    window.scrollTo(0, scrollY);

    const currentNavigationId = ++navigationId;
    await Promise.all(
        pageAnimations.map((path) =>
            import(`${path}?navigation=${currentNavigationId}`),
        ),
    );
    animateFooter();
    ScrollTrigger.refresh();

    if (url.hash) {
        document.querySelector(url.hash)?.scrollIntoView();
    }
};

const queueNavigation = (url, options) => {
    navigationQueue = navigationQueue
        .then(() => navigateTo(url, options))
        .catch((error) => {
            console.error("Internal page navigation failed.", error);
            window.location.assign(url.href);
        });
};

document.addEventListener("click", (event) => {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
    ) {
        return;
    }

    const link = event.target.closest("a[href]");
    if (
        !link ||
        link.target && link.target !== "_self" ||
        link.hasAttribute("download")
    ) {
        return;
    }

    const url = new URL(link.href, window.location.href);
    if (
        url.origin !== window.location.origin ||
        !(/\.html$/i.test(url.pathname) || url.pathname.endsWith("/"))
    ) {
        return;
    }

    if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
    ) {
        return;
    }

    event.preventDefault();
    queueNavigation(url, { addHistoryEntry: true });
});

window.addEventListener("popstate", (event) => {
    queueNavigation(new URL(window.location.href), {
        addHistoryEntry: false,
        scrollY: event.state?.scrollY || 0,
    });
});
