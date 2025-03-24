const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const nav = document.querySelector("nav");

// ✅ 1. RESET NAVBAR ON PAGE LOAD (Prevents persistent class issues)
window.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.innerWidth <= 425; // Check if on mobile

    // Remove active classes to reset navbar
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    nav.classList.remove("no-border");
    navMenu.classList.remove("with-border");

    // ✅ Hide menu on mobile by default
    if (isMobile) {
        navMenu.style.display = "none";
    } else {
        navMenu.style.display = "flex"; // Ensure menu is visible on larger screens
    }

    console.log("Navbar reset on page load, width:", window.innerWidth);
});

// ✅ 2. HANDLE WINDOW RESIZE (Prevents menu from staying open after resizing)
window.addEventListener("resize", () => {
    const isMobile = window.innerWidth <= 425; // Check screen width

    // Reset navbar states
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    nav.classList.remove("no-border");
    navMenu.classList.remove("with-border");

    // ✅ Hide/show menu based on screen size
    if (isMobile) {
        navMenu.style.display = "none";
    } else {
        navMenu.style.display = "flex";
    }

    console.log("Navbar adjusted after resizing, width:", window.innerWidth);
});

// ✅ 3. TOGGLE MENU ON HAMBURGER CLICK (Ensures menu shows/hides properly)
hamburger.addEventListener("click", () => {
    const isActive = hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    nav.classList.toggle("no-border");
    navMenu.classList.toggle("with-border");

    // ✅ Ensure menu appears/disappears correctly
    navMenu.style.display = isActive ? "block" : "none";

    console.log("Hamburger toggled:", isActive);
});

// ✅ 4. CLOSE MENU WHEN CLICKING A NAV LINK (Prevents it from staying open)
document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        nav.classList.remove("no-border");
        navMenu.classList.remove("with-border");

        // ✅ Ensure menu hides when a link is clicked
        navMenu.style.display = "none";

        console.log("Nav link clicked, menu closed.");
    })
);

// Scroll Button

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

/* searching for oversized elements */
[...document.querySelectorAll("*")].reduce((a, e) => {
    return e.scrollWidth > a.scrollWidth ? e : a;
});
