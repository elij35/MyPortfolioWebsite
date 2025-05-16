document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".site-nav a");
    const sections = document.querySelectorAll("section");
    const body = document.body;
    let mobileMenuBtn = null;
    let mobileMenu = null;
    let lastScrollTop = window.pageYOffset;
    let currentActiveLink = null;

    // Set dark theme by default
    body.setAttribute("data-theme", "dark");

    // Scroll handler for directional navigation
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        const direction = currentScroll > lastScrollTop ? "down" : "up";
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

        // Finds which section is currently in view
        let activeSection = null;
        const viewportMiddle = window.scrollY + (window.innerHeight / 2);

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
                activeSection = section.id;
            }
        });

        // Updates navigation
        if (activeSection) {
            const newActiveLink = document.querySelector(`.site-nav a[href="#${activeSection}"]`);

            if (newActiveLink && newActiveLink !== currentActiveLink) {
                // Removes all active classes
                navLinks.forEach(link => {
                    link.classList.remove("active", "scroll-down", "scroll-up");
                });

                // Add appropriate classes to new active link
                newActiveLink.classList.add("active", `scroll-${direction}`);
                currentActiveLink = newActiveLink;
            }
        }
    };

    // Throttled scroll event
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initialize active nav on load
    handleScroll();

    // Mobile menu functionality
    const createMobileMenu = () => {
        mobileMenuBtn = document.createElement("button");
        mobileMenuBtn.className = "mobile-menu-btn";
        mobileMenuBtn.innerHTML = "☰";
        mobileMenuBtn.setAttribute("aria-label", "Toggle menu");

        mobileMenu = document.createElement("div");
        mobileMenu.className = "mobile-menu";

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

        const navClone = document.querySelector(".site-nav").cloneNode(true);
        mobileMenu.appendChild(navClone);
        document.body.appendChild(mobileMenu);

        document.querySelector(".header-container").appendChild(mobileMenuBtn);

        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            document.body.classList.toggle("no-scroll");
        });

        // Close menu when clicking a link
        navClone.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                document.body.classList.remove("no-scroll");
            });
        });
    };

    // Responsive menu check
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

    // Initialize
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