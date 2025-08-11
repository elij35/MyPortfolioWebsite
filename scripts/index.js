document.addEventListener("DOMContentLoaded", () => {
    const body = document.body,
        navLinks = document.querySelectorAll(".site-nav a"),
        sections = document.querySelectorAll("section");
    let mobileMenuBtn, mobileMenu, mobileMenuOverlay, lastScrollTop = window.pageYOffset, currentActiveLink;

    body.dataset.theme = "dark";

    const getActiveSection = () => {
        const mid = window.scrollY + window.innerHeight / 2;
        return [...sections].find(s => mid >= s.offsetTop && mid <= s.offsetTop + s.offsetHeight)?.id || null;
    };

    const updateActiveMobileLink = () => {
        if (!mobileMenu?.classList.contains('active')) return;
        const active = getActiveSection();
        if (active) {
            document.querySelectorAll('.mobile-menu-nav a').forEach(l =>
                l.classList.toggle('active', l.getAttribute('href') === `#${active}`)
            );
        }
    };

    const handleScroll = () => {
        const currentScroll = window.pageYOffset,
            direction = currentScroll > lastScrollTop ? "down" : "up";
        lastScrollTop = Math.max(currentScroll, 0);

        const active = getActiveSection();
        if (active) {
            const newActiveLink = document.querySelector(`.site-nav a[href="#${active}"]`);
            if (newActiveLink && newActiveLink !== currentActiveLink) {
                navLinks.forEach(l => l.classList.remove("active", "scroll-down", "scroll-up"));
                newActiveLink.classList.add("active", `scroll-${direction}`);
                currentActiveLink = newActiveLink;
            }
            updateActiveMobileLink();
        }
    };

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    const toggleMobileMenu = () => {
        if (!mobileMenu || !mobileMenuOverlay) return;
        mobileMenu.classList.toggle("active");
        mobileMenuOverlay.classList.toggle("active");
        body.classList.toggle("no-scroll");
        updateActiveMobileLink();
    };

    const createEl = (tag, cls, parent, html) => {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (html) el.innerHTML = html;
        if (parent) parent.appendChild(el);
        return el;
    };

    const initMobileMenu = () => {
        if (!body.classList.contains('has-mobile-menu')) return;

        mobileMenuOverlay = createEl("div", "mobile-menu-overlay", body);
        mobileMenuOverlay.addEventListener("click", toggleMobileMenu);

        mobileMenu = createEl("div", "mobile-menu", body);
        const menuContent = createEl("div", "mobile-menu-content", mobileMenu),
            menuHeader = createEl("div", "mobile-menu-header", menuContent);

        const logo = createEl("a", "mobile-menu-logo", menuHeader);
        logo.href = "#hero";
        logo.addEventListener("click", toggleMobileMenu);
        logo.append(createEl("img", "", null), createEl("span", "", null, "Eli Bowen"));
        logo.querySelector("img").src = "images/logo.png";
        logo.querySelector("img").alt = "EB logo";

        const closeBtn = createEl("button", "mobile-menu-close", menuHeader, "✕");
        closeBtn.addEventListener("click", toggleMobileMenu);

        const mobileNav = createEl("nav", "mobile-menu-nav", menuContent);
        document.querySelectorAll(".site-nav a").forEach(link => {
            const clone = link.cloneNode(true);
            clone.addEventListener("click", toggleMobileMenu);
            mobileNav.appendChild(clone);
        });

        mobileMenuBtn = createEl("button", "mobile-menu-btn", document.querySelector(".header-container"), "☰");
        mobileMenuBtn.addEventListener("click", toggleMobileMenu);
    };

    const cleanupMobileMenu = () => {
        mobileMenu?.remove(); mobileMenu = null;
        mobileMenuOverlay?.remove(); mobileMenuOverlay = null;
        mobileMenuBtn?.remove(); mobileMenuBtn = null;
        body.classList.remove("no-scroll");
    };

    const checkMobileMenu = () => {
        if (window.innerWidth <= 768 && body.classList.contains('has-mobile-menu')) {
            if (!mobileMenuBtn) initMobileMenu();
        } else cleanupMobileMenu();
    };

    checkMobileMenu();
    window.addEventListener("resize", checkMobileMenu);

    const animateOnScroll = () => {
        sections.forEach(s => {
            if (s.getBoundingClientRect().top < window.innerHeight * 0.75) {
                s.style.opacity = "1";
                s.style.transform = "translateY(0)";
            }
        });
    };
    sections.forEach(s => {
        s.style.opacity = "0";
        s.style.transform = "translateY(20px)";
        s.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll();

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const id = a.getAttribute("href");
            if (id === "#") return;
            const target = document.querySelector(id);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
            }
        });
    });

    handleScroll();
});
