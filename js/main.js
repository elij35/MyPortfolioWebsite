document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".site-nav a");
    const sections = document.querySelectorAll("section");
    const body = document.body;
    let mobileMenuBtn = null;
    let mobileMenu = null;
    let scrollTimeout;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const direction = currentScroll > lastScrollTop ? "down" : "up";
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

        let activeSectionId = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const offset = 150; // adjust based on header height
            if (rect.top <= offset && rect.bottom > offset) {
                activeSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active", "scroll-up", "scroll-down");

            const href = link.getAttribute("href").replace("#", "");
            if (href === activeSectionId) {
                link.classList.add("active");
                link.classList.add(direction === "down" ? "scroll-down" : "scroll-up");
            }
        });
    });

    // Set dark theme by default
    body.setAttribute("data-theme", "dark");

    // Detection for nav highlighting
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + (window.innerHeight / 3);

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

        // Create menu header with close button
        const menuHeader = document.createElement("div");
        menuHeader.className = "mobile-menu-header";

        const closeButton = document.createElement("button");
        closeButton.className = "mobile-menu-close";
        closeButton.innerHTML = "✕";
        closeButton.setAttribute("aria-label", "Close menu");
        closeButton.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            document.body.classList.remove("no-scroll");
        });

        menuHeader.appendChild(closeButton);
        mobileMenu.appendChild(menuHeader);

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
        header.appendChild(mobileMenuBtn);

        // Toggle menu on button click
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
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
    animateOnScroll();

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