document.addEventListener("DOMContentLoaded", function () {
  
  const headerHTML = `
  <header>
    <nav class="navbar glass">
      <div class="logo"><a href="#">Shiva<span class="accent">.dev</span></a></div>
      <ul class="nav-links" id="navLinks">
        <li><a href="#about">About</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#tools">Tools</a></li>
        <li><a href="#certifications">Certifications</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle" aria-label="Open navigation">
        <svg width="32" height="32" viewBox="0 0 100 80" fill="none">
          <rect width="100" height="12" rx="6" fill="#007cf0" />
          <rect y="34" width="100" height="12" rx="6" fill="#007cf0" />
          <rect y="68" width="100" height="12" rx="6" fill="#007cf0" />
        </svg>
      </button>
    </nav>
  </header>
  `;
  // Insert header at the top of <body>
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // ======= NAVBAR SCROLL EFFECT =======
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ======= NAVBAR MOBILE TOGGLE =======
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
    // Close nav if clicking outside
    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove("open");
      }
    });
  }
});