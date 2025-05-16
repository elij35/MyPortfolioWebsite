document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const scrollProgress = document.getElementById("scrollProgress");
    const navLinks = document.querySelectorAll(".site-nav a");
    const sections = document.querySelectorAll("section");
    const body = document.body;

    // Set dark theme by default
    body.setAttribute("data-theme", "dark");

    // Scroll progress indicator
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (scrollTop / docHeight) * 100 + "%";
    });

    // Improved section detection for nav highlighting
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 100;

        // Reset all active states
        navLinks.forEach(link => link.classList.remove("active"));

        // Find the section in view
        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.id;
            }
        });

        // Set active state on corresponding nav link
        if (activeSection) {
            const activeLink = document.querySelector(`.site-nav a[href="#${activeSection}"]`);
            if (activeLink) activeLink.classList.add("active");
        }
    };

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 50);
    });

    // Initialize active nav on load
    updateActiveNav();

    // Create mobile menu for smaller screens
    const createMobileMenu = () => {
        // Create menu button
        mobileMenuBtn = document.createElement("button");
        mobileMenuBtn.className = "mobile-menu-btn";
        mobileMenuBtn.innerHTML = "☰";
        mobileMenuBtn.setAttribute("aria-label", "Toggle menu");

        // Create mobile menu
        mobileMenu = document.createElement("div");
        mobileMenu.className = "mobile-menu";

        // Clone navigation links
        const navClone = document.querySelector(".site-nav").cloneNode(true);
        navClone.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                document.body.classList.remove("no-scroll");
            });
        });

        mobileMenu.appendChild(navClone);
        document.body.appendChild(mobileMenu);

        // Insert button in header
        const header = document.querySelector(".header-container");
        header.appendChild(mobileMenuBtn); // Changed from insertBefore since theme toggle is removed

        // Toggle menu on button click
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
            mobileMenuBtn.innerHTML = mobileMenu.classList.contains("active") ? "✕" : "☰";
        });
    };

    // Check screen width and initialize mobile menu if needed
    const checkScreenSize = () => {
        if (window.innerWidth <= 768 && !mobileMenuBtn) {
            createMobileMenu();
        } else if (window.innerWidth > 768 && mobileMenuBtn) {
            mobileMenuBtn.remove();
            mobileMenu.remove();
            mobileMenuBtn = null;
            mobileMenu = null;
        }
    };

    // Initial check and window resize listener
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Add fade-in animation to sections when they come into view
    const animateOnScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = "1";
                section.style.transform = "translateY(0)";
            }
        });
    };

    // Initialize section animations
    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll(); // Run once on load

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });
});