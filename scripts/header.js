document.addEventListener("DOMContentLoaded", function () {

  const headerHTML = `
  <header>
    <nav class="navbar glass">
      <div class="logo"><a href="/index.html">Shiva<span class="accent">.dev</span></a></div>
      <ul class="nav-links" id="navLinks">
        <li><a href="/index.html#about">About</a></li>
        <li><a href="/index.html#education">Education</a></li>
        <li><a href="/index.html#experience">Experience</a></li>
        <li><a href="/index.html#projects">Projects</a></li>
        <li class="dropdown">
          <a href="/index.html#tools" class="dropdown-toggle">Tools ▼</a>
          <ul class="dropdown-menu">
            <li><a href="/tools/passwordgen.html">🔐 NoMore123</a></li>
            <!-- Add more tools here if needed -->
          </ul>
        </li>
        <li><a href="/index.html#certifications">Certifications</a></li>
        <li><a href="/index.html#skills">Skills</a></li>
        <li><a href="/index.html#contact">Contact</a></li>
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

    // Dropdown click support
  const dropdown = document.querySelector('.nav-links .dropdown');
  const dropdownToggle = dropdown?.querySelector('.dropdown-toggle');
  if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

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