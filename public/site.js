document.addEventListener('DOMContentLoaded', function () {
  const html = document.documentElement;
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.nav-links');

  // Keep theme behavior consistent across pages where theme toggle exists.
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', function () {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      themeToggle.style.transform = 'rotate(360deg) scale(1.1)';
      setTimeout(function () {
        themeToggle.style.transform = '';
      }, 300);
    });
  } else {
    // Preserve last chosen theme even on pages without theme toggle.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
    }
  }

  if (!hamburger || !nav) {
    return;
  }

  if (!hamburger.hasAttribute('aria-expanded')) {
    hamburger.setAttribute('aria-expanded', 'false');
  }

  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    body.appendChild(overlay);
  }

  function closeMenu() {
    nav.classList.remove('active');
    overlay.classList.remove('active');
    body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
  }

  function openMenu() {
    nav.classList.add('active');
    overlay.classList.add('active');
    body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
  }

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    if (nav.classList.contains('active')) {
      closeMenu();
      return;
    }
    openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
      closeMenu();
    }
  });
});
