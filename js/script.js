document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.site-nav a');
    const path = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === path || path.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
});
