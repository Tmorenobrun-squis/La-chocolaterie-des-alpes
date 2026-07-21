// Nav solid state on scroll (skipped on pages where the nav is already static)
const nav = document.getElementById('site-nav');
if (nav && !nav.classList.contains('nav-static')) {
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('nav-solid');
    else nav.classList.remove('nav-solid');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (menuToggle && mobileMenu) {
  let menuOpen = false;
  const setMenu = (open) => {
    menuOpen = open;
    mobileMenu.setAttribute('data-open', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuToggle.addEventListener('click', () => setMenu(!menuOpen));
  document.querySelectorAll('#mobile-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
}

// Scroll reveal — also drives [data-stagger] containers, whose direct
// children cascade in via CSS nth-child transition-delay (see style.css).
const revealEls = document.querySelectorAll('[data-reveal], [data-stagger]');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => io.observe(el));
}

// Sticky category sub-navigation (Créations page only)
const subnav = document.getElementById('subnav');
if (subnav) {
  const subnavOnScroll = () => {
    if (window.scrollY > 40) subnav.classList.add('subnav-solid');
    else subnav.classList.remove('subnav-solid');
  };
  document.addEventListener('scroll', subnavOnScroll, { passive: true });
  subnavOnScroll();

  const subnavLinks = Array.from(subnav.querySelectorAll('.subnav-link'));
  const categorySections = subnavLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        subnavLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  categorySections.forEach((section) => spy.observe(section));
}

// Floating "Nous contacter" shortcut — shown once the visitor has scrolled
// past the hero/banner, hidden again near the very top.
const floatingContact = document.getElementById('floating-contact');
if (floatingContact) {
  const onScrollFloat = () => {
    if (window.scrollY > 500) floatingContact.classList.add('is-shown');
    else floatingContact.classList.remove('is-shown');
  };
  document.addEventListener('scroll', onScrollFloat, { passive: true });
  onScrollFloat();
}

// Contact form (La Boutique) — not wired to a real destination yet.
// TODO: connect to an email address or form service before going live.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const status = document.getElementById('contact-status');
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (status) {
      status.textContent = 'Module de contact en cours de configuration — merci de nous rendre visite ou de nous écrire directement en attendant.';
    }
  });
}
