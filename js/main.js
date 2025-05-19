document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".site-nav a");
    const sections = document.querySelectorAll("section");
    const body = document.body;
    let mobileMenuBtn = null;
    let mobileMenu = null;
    let mobileMenuOverlay = null;
    let lastScrollTop = window.pageYOffset;
    let currentActiveLink = null;

    // Set dark theme by default
    body.setAttribute("data-theme", "dark");

    const updateActiveMobileLink = () => {
        if (!mobileMenu || !mobileMenu.classList.contains('active')) return;

        const viewportMiddle = window.scrollY + (window.innerHeight / 2);
        let activeSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
                activeSection = section.id;
            }
        });

        if (activeSection) {
            const mobileLinks = document.querySelectorAll('.mobile-menu-nav a');
            mobileLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeSection}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        const direction = currentScroll > lastScrollTop ? "down" : "up";
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

        let activeSection = null;
        const viewportMiddle = window.scrollY + (window.innerHeight / 2);

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
                activeSection = section.id;
            }
        });

        if (activeSection) {
            const newActiveLink = document.querySelector(`.site-nav a[href="#${activeSection}"]`);

            if (newActiveLink && newActiveLink !== currentActiveLink) {
                navLinks.forEach(link => {
                    link.classList.remove("active", "scroll-down", "scroll-up");
                });
                newActiveLink.classList.add("active", `scroll-${direction}`);
                currentActiveLink = newActiveLink;
            }

            if (mobileMenu && mobileMenu.classList.contains('active')) {
                updateActiveMobileLink();
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

        if (mobileMenu && mobileMenu.classList.contains('active')) {
            updateActiveMobileLink();
        }
    });

    handleScroll();

    const toggleMobileMenu = () => {
        if (!mobileMenu || !mobileMenuOverlay) return;

        mobileMenu.classList.toggle("active");
        mobileMenuOverlay.classList.toggle("active");
        document.body.classList.toggle("no-scroll");

        if (mobileMenu.classList.contains('active')) {
            updateActiveMobileLink();
        }
    };

    const initMobileMenu = () => {
        if (!document.body.classList.contains('has-mobile-menu')) return;

        // Create overlay
        mobileMenuOverlay = document.createElement("div");
        mobileMenuOverlay.className = "mobile-menu-overlay";
        mobileMenuOverlay.addEventListener("click", toggleMobileMenu);

        // Create menu container
        mobileMenu = document.createElement("div");
        mobileMenu.className = "mobile-menu";

        // Create menu content
        const menuContent = document.createElement("div");
        menuContent.className = "mobile-menu-content";

        // Create header with logo and close button
        const menuHeader = document.createElement("div");
        menuHeader.className = "mobile-menu-header";

        // Add logo to header
        const logoContainer = document.createElement("a");
        logoContainer.className = "mobile-menu-logo";
        logoContainer.href = "index.html";

        const logoImg = document.createElement("img");
        logoImg.src = "images/logo.png";
        logoImg.alt = "EB logo";

        const logoText = document.createElement("span");
        logoText.textContent = "Eli Bowen";

        logoContainer.appendChild(logoImg);
        logoContainer.appendChild(logoText);
        menuHeader.appendChild(logoContainer);

        // Add close button
        const closeButton = document.createElement("button");
        closeButton.className = "mobile-menu-close";
        closeButton.innerHTML = "✕";
        closeButton.addEventListener("click", toggleMobileMenu);

        menuHeader.appendChild(closeButton);
        menuContent.appendChild(menuHeader);

        // Create nav element and clone links
        const mobileNav = document.createElement("nav");
        mobileNav.className = "mobile-menu-nav";

        const originalNav = document.querySelector(".site-nav");
        if (originalNav) {
            originalNav.querySelectorAll("a").forEach(link => {
                const clonedLink = link.cloneNode(true);
                clonedLink.addEventListener("click", toggleMobileMenu);
                mobileNav.appendChild(clonedLink);
            });
        }

        menuContent.appendChild(mobileNav);
        mobileMenu.appendChild(menuContent);

        // Add elements to DOM
        document.body.appendChild(mobileMenuOverlay);
        document.body.appendChild(mobileMenu);

        // Create menu button
        mobileMenuBtn = document.createElement("button");
        mobileMenuBtn.className = "mobile-menu-btn";
        mobileMenuBtn.innerHTML = "☰";
        mobileMenuBtn.addEventListener("click", toggleMobileMenu);

        const header = document.querySelector(".header-container");
        if (header) {
            header.appendChild(mobileMenuBtn);
        }
    };

    const cleanupMobileMenu = () => {
        if (mobileMenu) {
            mobileMenu.remove();
            mobileMenu = null;
        }
        if (mobileMenuOverlay) {
            mobileMenuOverlay.remove();
            mobileMenuOverlay = null;
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.remove();
            mobileMenuBtn = null;
        }
        document.body.classList.remove("no-scroll");
    };

    // Responsive check
    const checkMobileMenu = () => {
        if (window.innerWidth <= 768 && document.body.classList.contains('has-mobile-menu')) {
            if (!mobileMenuBtn) {
                initMobileMenu();
            }
        } else {
            cleanupMobileMenu();
        }
    };

    // Initialize
    checkMobileMenu();
    window.addEventListener("resize", checkMobileMenu);

    // Section animations
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

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll();

    // Smooth scroll
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

    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents the default Netlify redirect

        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const feedbackEl = document.getElementById('form-feedback');

        // Disable submit button during submission
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Submit to Netlify
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                // Success: Show message & reset form
                feedbackEl.textContent = 'Message sent successfully!';
                feedbackEl.className = 'form-feedback success';
                feedbackEl.classList.remove('hidden');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            feedbackEl.textContent = 'Error sending message. Please try again.';
            feedbackEl.className = 'form-feedback error';
            feedbackEl.classList.remove('hidden');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';

            // Hide feedback after 5 seconds
            setTimeout(() => {
                feedbackEl.classList.add('hidden');
            }, 5000);
        }
    });
});