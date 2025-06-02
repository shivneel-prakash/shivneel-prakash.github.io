document.addEventListener("DOMContentLoaded", function () {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

  // Elements
  const lengthSlider = document.getElementById('pw-length');
  const lengthValue = document.getElementById('pw-length-value');
  const pwLower = document.getElementById('pw-lower');
  const pwUpper = document.getElementById('pw-upper');
  const pwNum = document.getElementById('pw-num');
  const pwSpecial = document.getElementById('pw-special');
  const pwOutput = document.getElementById('pwgen-output');
  const pwCopy = document.getElementById('pwgen-copy');
  const pwGenerate = document.getElementById('pwgen-generate');
  const pwStrengthBar = document.getElementById('pwgen-strength-bar-inner');
  const pwStrengthLabel = document.getElementById('pwgen-strength-label');
  const pwStats = document.getElementById('pwgen-stats');
  const pwError = document.getElementById('pwgen-error');

  // Update slider value display
  function updateSliderValue() {
    lengthValue.textContent = lengthSlider.value;
  }
  lengthSlider.addEventListener('input', updateSliderValue);
  updateSliderValue();

  // Validation
  function validate() {
    if (!pwLower.checked && !pwUpper.checked && !pwNum.checked && !pwSpecial.checked) {
      pwError.textContent = "Please select at least one character set.";
      pwError.style.display = "block";
      return false;
    }
    pwError.style.display = "none";
    return true;
  }
  [pwLower, pwUpper, pwNum, pwSpecial].forEach(cb => cb.addEventListener('change', validate));

  // Password generator
function generatePassword(length, sets) {
  let chars = "";
  if (sets.lower) chars += lower;
  if (sets.upper) chars += upper;
  if (sets.numbers) chars += numbers;
  if (sets.special) chars += special;
  if (!chars) return "";

  // Collect selected sets
  const selectedSets = [];
  if (sets.lower) selectedSets.push(lower);
  if (sets.upper) selectedSets.push(upper);
  if (sets.numbers) selectedSets.push(numbers);
  if (sets.special) selectedSets.push(special);

  let password = "";

  // If length is less than number of sets, just pick random chars from the pool
  if (length < selectedSets.length) {
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  }

  // Add one from each set first
  for (let set of selectedSets) {
    password += set[Math.floor(Math.random() * set.length)];
  }
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

  // Password strength estimation (zxcvbn if available, else fallback)
  function getStrength(password) {
    if (window.zxcvbn) {
      const result = zxcvbn(password);
      return {
        score: result.score,
        crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
        feedback: result.feedback.suggestions.join(' ')
      };
    } else {
      // Fallback: estimate entropy
      let charset = 0;
      if (/[a-z]/.test(password)) charset += 26;
      if (/[A-Z]/.test(password)) charset += 26;
      if (/[0-9]/.test(password)) charset += 10;
      if (/[^a-zA-Z0-9]/.test(password)) charset += 32;
      const entropy = password.length * Math.log2(charset || 1);
      let score = 0;
      if (entropy > 80) score = 4;
      else if (entropy > 60) score = 3;
      else if (entropy > 40) score = 2;
      else if (entropy > 25) score = 1;
      else score = 0;
      // Crack time estimate (very rough)
      const guesses = Math.pow(charset, password.length);
      const crackSeconds = guesses / 1e4; // 10k/sec
      let crackTime = '';
      if (crackSeconds < 60) crackTime = 'less than a minute';
      else if (crackSeconds < 3600) crackTime = `${Math.round(crackSeconds / 60)} minutes`;
      else if (crackSeconds < 86400) crackTime = `${Math.round(crackSeconds / 3600)} hours`;
      else if (crackSeconds < 31536000) crackTime = `${Math.round(crackSeconds / 86400)} days`;
      else crackTime = `${Math.round(crackSeconds / 31536000)} years`;
      return { score, crackTime, feedback: '' };
    }
  }

  // Update strength bar and stats
  function updateStrength(password) {
    if (!password || password === "Please select at least one character set.") {
      pwStrengthBar.style.width = "0";
      pwStrengthBar.style.background = "#23272e";
      pwStrengthLabel.textContent = "";
      pwStats.textContent = "";
      return;
    }
    const { score, crackTime, feedback } = getStrength(password);
    const colors = [
      "#ff4d6d", // very weak
      "#ffb347", // weak
      "#ffe347", // fair
      "#00ffe7", // strong
      "#00ff87"  // very strong
    ];
    const labels = [
      "Very Weak",
      "Weak",
      "Fair",
      "Strong",
      "Very Strong"
    ];
    pwStrengthBar.style.width = ((score + 1) * 20) + "%";
    pwStrengthBar.style.background = colors[score];
    pwStrengthLabel.textContent = labels[score];
    pwStats.textContent = `Estimated crack time: ${crackTime || "N/A"}` + (feedback ? ` (${feedback})` : "");
  }

  // Generate password and update UI
  function handleGenerate() {
    if (!validate()) {
      pwOutput.value = "";
      updateStrength("");
      return;
    }
    const length = parseInt(lengthSlider.value, 10);
    const sets = {
      lower: pwLower.checked,
      upper: pwUpper.checked,
      numbers: pwNum.checked,
      special: pwSpecial.checked
    };
    const pw = generatePassword(length, sets);
    pwOutput.value = pw;
    updateStrength(pw);
  }

  // Plus/minus buttons for slider
  const pwMinus = document.getElementById('pwgen-minus');
  const pwPlus = document.getElementById('pwgen-plus');
  pwMinus.addEventListener('click', () => {
    let val = parseInt(lengthSlider.value, 10);
    if (val > parseInt(lengthSlider.min, 10)) {
      lengthSlider.value = val - 1;
      updateSliderValue();
      handleGenerate();
    }
  });
  pwPlus.addEventListener('click', () => {
    let val = parseInt(lengthSlider.value, 10);
    if (val < parseInt(lengthSlider.max, 10)) {
      lengthSlider.value = val + 1;
      updateSliderValue();
      handleGenerate();
    }
  });


  // Auto-generate on slider or checkbox change
  lengthSlider.addEventListener('input', () => {
    updateSliderValue();
    handleGenerate();
  });
  [pwLower, pwUpper, pwNum, pwSpecial].forEach(cb =>
    cb.addEventListener('change', handleGenerate)
  );

  pwGenerate.addEventListener('click', handleGenerate);


  pwGenerate.addEventListener('click', handleGenerate);

  // Copy to clipboard
  pwCopy.addEventListener('click', function () {
    if (!pwOutput.value || pwOutput.value === "Please select at least one character set.") return;
    pwOutput.select();
    pwOutput.setSelectionRange(0, 999);
    document.execCommand('copy');
    this.textContent = "Copied!";
    setTimeout(() => { this.textContent = "Copy"; }, 1200);
  });

  // Update strength as user changes output (for manual edits)
  pwOutput.addEventListener('input', function () {
    updateStrength(pwOutput.value);
  });

  // Generate on load for demo
  handleGenerate();

    // Fetch real-time breach stats from HaveIBeenPwned homepage
  fetch("https://haveibeenpwned.com/")
    .then(response => response.text())
    .then(html => {
      // Extract the total pwned accounts from the homepage
      const match = html.match(/<span class="h3">([\d,]+)<\/span> accounts/);
      if (match && match[1]) {
        const statGrid = document.getElementById("pwgen-stats-grid");
        if (statGrid) {
          statGrid.children[0].innerHTML = `
            <span class="pwgen-stat-icon">🌐</span>
            <span class="pwgen-stat-label"><strong>${match[1]}</strong> accounts breached globally</span>
          `;
        }
      }
    })
    .catch(() => {
      // Fallback if fetch fails
      const statGrid = document.getElementById("pwgen-stats-grid");
      if (statGrid) {
        statGrid.children[0].innerHTML = `
          <span class="pwgen-stat-icon">🌐</span>
          <span class="pwgen-stat-label">6.5+ billion accounts breached globally</span>
        `;
      }
    });
});