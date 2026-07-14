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

  document.querySelectorAll('.sidebar-content a.nav-link[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });
}

const navLinks = Array.from(document.querySelectorAll('.sidebar-content a.nav-link[data-nav]'));

function setActiveNav(key) {
  navLinks.forEach(link => {
    const isActive = link.dataset.nav === key;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
  const activeLink = navLinks.find(link => link.dataset.nav === key);
  if (activeLink) {
    activeLink.setAttribute('aria-current', 'page');
  }
}

setActiveNav('about');

/* ========================================================
   HIỆU ỨNG XUẤT HIỆN KHI CUỘN
   ======================================================== */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {

  const windowHeight = window.innerHeight;

  reveals.forEach(el => {

    const top = el.getBoundingClientRect().top;

    const visiblePoint = 120;

    if (top < windowHeight - visiblePoint) {

      el.classList.add("active");

    }

  });

}

window.addEventListener("scroll", revealOnScroll);

window.addEventListener("load", revealOnScroll);

/* ========================================================
   HIỆU ỨNG HIỆN TỪNG TỪ (giống PowerPoint)
   ======================================================== */
function wrapWordsInPlace(el) {
  const skipTags = ["I", "IMG", "SVG", "SCRIPT", "STYLE"];

  function walk(node) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        if (!text.trim()) return;

        const frag = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);

        parts.forEach(part => {
          if (part === "") return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "reveal-word";
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

const wordRevealTargets = document.querySelectorAll(".word-reveal");

if (wordRevealTargets.length > 0) {
  wordRevealTargets.forEach(el => wrapWordsInPlace(el));

  const wordObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = entry.target.querySelectorAll(".reveal-word");
          spans.forEach((span, i) => {
            span.style.transitionDelay = `${Math.min(i * 45, 900)}ms`;
          });
          requestAnimationFrame(() => {
            spans.forEach(span => span.classList.add("active"));
          });
          wordObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  wordRevealTargets.forEach(el => wordObserver.observe(el));
}