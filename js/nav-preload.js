const navigationEntry = performance.getEntriesByType("navigation")[0];
const isReload = navigationEntry?.type === "reload";
const hasSeenNav = sessionStorage.getItem("navAnimated");

if (!hasSeenNav || isReload) {
    document.documentElement.classList.add("nav-entrance-pending");
}
