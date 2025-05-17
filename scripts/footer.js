document.addEventListener("DOMContentLoaded", function () {
  // Footer
  const footerHTML = `
    <footer class="glass">
      <p>© ${new Date().getFullYear()} Shiva Shivneel Prakash</p>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Floating Buttons
  const floatingBtns = `
    <button id="themeToggle" class="floating-theme-btn" aria-label="Toggle theme">🌙</button>
    <button id="goTopBtn" class="go-top-btn" aria-label="Go to top">↑</button>
  `;
  document.body.insertAdjacentHTML('afterbegin', floatingBtns);

  // Scroll to top logic
  const goTopBtn = document.getElementById('goTopBtn');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 200) {
      goTopBtn.style.display = 'block';
    } else {
      goTopBtn.style.display = 'none';
    }
  });
  goTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Theme toggle logic
  const themeToggle = document.getElementById('themeToggle');
  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      themeToggle.textContent = '🌞';
    } else {
      document.body.classList.remove('light-theme');
      themeToggle.textContent = '🌙';
    }
  }
  themeToggle.addEventListener('click', function () {
    const isLight = document.body.classList.toggle('light-theme');
    themeToggle.textContent = isLight ? '🌞' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
  // Load theme from storage
  (function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') setTheme('light');
    else setTheme('dark');
  })();
});