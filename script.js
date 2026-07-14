/* ========================================================
   0. SCROLL RESTORATION FIX
   Ngăn trình duyệt tự khôi phục vị trí cuộn/hash khi reload,
   nguyên nhân gây ra hiện tượng cuộn dồn mỗi lần F5.
   ======================================================== */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}


document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. SIDEBAR
       ======================================================== */
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('close-sidebar');

    if (menuBtn && sidebar && overlay && closeBtn) {

        const openSidebar = () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        menuBtn.addEventListener('click', openSidebar);
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        document.querySelectorAll('.sidebar-content a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);

                    closeSidebar();

                    if (target) {
                        history.pushState(null, '', href);
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                    }
                } else {
                    closeSidebar();
                }
            });
        });
    }

    /* ========================================================
       2. TYPING EFFECT
       ======================================================== */
    const textElement = document.getElementById('greeting');

    if (textElement) {

        const hour = new Date().getHours();
        let greeting = "Chào buổi sáng! ☀️";
        if (hour >= 12 && hour < 18) greeting = "Chào buổi chiều! 🌤️";
        if (hour >= 18) greeting = "Chào buổi tối! 🌙";

        const phrases = [
            greeting,
            "Tôi có thể giúp gì cho bạn?",
            "Tôi là một student đam mê lập trình.",
            "Luôn sáng tạo và không ngừng học hỏi.",
            "Biến ý tưởng thành những dòng code.",
            "Cùng nhau xây dựng tương lai."
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                textElement.textContent = currentPhrase.substring(0, charIndex--);
            } else {
                textElement.textContent = currentPhrase.substring(0, charIndex++);
            }
            let speed = isDeleting ? 50 : 100;
            if (!isDeleting && charIndex === currentPhrase.length + 1) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            setTimeout(typeEffect, speed);
        }
        typeEffect();
    }

    /* ========================================================
       3. DARK / LIGHT MODE – TỰ ĐỘNG THEO HỆ THỐNG
       ======================================================== */
    const themeMeta = document.getElementById('theme-color-meta');

    function updateThemeColor(isDark) {
        if (themeMeta) {
            themeMeta.content = isDark ? '#111827' : '#F3F4F6';
        }
    }

    function applySystemTheme() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', isDark);
        document.body.classList.toggle('light-theme', !isDark);
        updateThemeColor(isDark);
    }

    applySystemTheme();

    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMedia.addEventListener('change', applySystemTheme);

    /* ========================================================
       4. SCROLL REVEAL
       ======================================================== */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        reveals.forEach(element => revealObserver.observe(element));
    }

    /* ========================================================
       5. HEADER NAME AUTO SHOW / HIDE
       ======================================================== */
    const heroName = document.getElementById('hero-name');
    const navbarName = document.getElementById('navbar-name');
    if (heroName && navbarName) {
        navbarName.style.opacity = '0';
        const headerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navbarName.style.opacity = '0';
                        navbarName.style.pointerEvents = 'none';
                        navbarName.style.transform = 'translateX(-50%) translateY(-10px)';
                    } else {
                        navbarName.style.opacity = '1';
                        navbarName.style.pointerEvents = 'auto';
                        navbarName.style.transform = 'translateX(-50%) translateY(0)';
                    }
                });
            },
            { threshold: 0.15 }
        );
        headerObserver.observe(heroName);
    }


    /* ========================================================
       6. SIDEBAR ACTIVE STATE
       ======================================================== */
    const navLinks = Array.from(document.querySelectorAll('.sidebar-content a.nav-link[data-nav]'));
    const navLinkMap = new Map(navLinks.map(link => [link.dataset.nav, link]));

    function setActiveNav(key) {
        navLinks.forEach(link => {
            const isActive = link.dataset.nav === key;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
        const activeLink = navLinkMap.get(key);
        if (activeLink) {
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    // ======== SỬA LẠI HÀM NÀY ========
    function getCurrentSectionKey() {
        // Nếu đang ở trang about-me -> active "about"
        if (location.pathname.includes('/about-me')) {
            return 'about';
        }
        // Ngược lại (trang chủ) -> luôn active "home"
        return 'home';
    }
    // ==================================

    let navRaf = 0;
    function syncActiveNav() {
        if (navRaf) return;
        navRaf = requestAnimationFrame(() => {
            navRaf = 0;
            setActiveNav(getCurrentSectionKey());
        });
    }

    syncActiveNav();
    window.addEventListener('scroll', syncActiveNav, { passive: true });
    window.addEventListener('resize', syncActiveNav);
    window.addEventListener('hashchange', syncActiveNav);
    window.addEventListener('load', syncActiveNav);

    if (window.location.hash) {
        window.addEventListener('load', () => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ block: 'start' });
            }
        }, { once: true });
    }

    /* ========================================================
       7. WORD-BY-WORD TEXT REVEAL
       Bọc từng từ trong span rồi cho xuất hiện lần lượt
       theo thứ tự khi phần tử được cuộn tới (kiểu PowerPoint),
       thay cho hiệu ứng cũ là cả khối nhảy lên một lượt.
       ======================================================== */
    function wrapWordsInPlace(el) {
        const skipTags = ['I', 'IMG', 'SVG', 'SCRIPT', 'STYLE'];

        function walk(node) {
            Array.from(node.childNodes).forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const text = child.textContent;
                    if (!text.trim()) return;

                    const frag = document.createDocumentFragment();
                    const parts = text.split(/(\s+)/);

                    parts.forEach(part => {
                        if (part === '') return;
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(part));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'reveal-word';
                            span.textContent = part;
                            frag.appendChild(span);
                        }
                    });

                    node.replaceChild(frag, child);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    if (skipTags.includes(child.tagName)) return;
                    walk(child);
                }
            });
        }

        walk(el);
    }

    const wordRevealTargets = document.querySelectorAll('.word-reveal');

    if (wordRevealTargets.length > 0) {
        wordRevealTargets.forEach(el => wrapWordsInPlace(el));

        const wordObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = entry.target.querySelectorAll('.reveal-word');
                        spans.forEach((span, i) => {
                            span.style.transitionDelay = `${Math.min(i * 45, 900)}ms`;
                        });
                        requestAnimationFrame(() => {
                            spans.forEach(span => span.classList.add('active'));
                        });
                        wordObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        wordRevealTargets.forEach(el => wordObserver.observe(el));
    }

});