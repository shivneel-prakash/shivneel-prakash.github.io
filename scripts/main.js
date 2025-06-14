document.addEventListener("DOMContentLoaded", function () {




  // ======= ANIMATED SUBTITLE =======
  const subtitle = document.getElementById("animatedSubtitle");
  const subtitleTexts = [
    'console.log("Hello World");',         // JavaScript
    'print("Hello World")',                // Python
    'Console.WriteLine("Hello World");',   // C#
    'System.out.println("Hello World");',  // Java
    'echo "Hello World"',                  // Bash
    'echo "Hello World";',                 // PHP
    'puts "Hello World"',                  // Ruby
    'fmt.Println("Hello World")',          // Go
    'std::cout << "Hello World" << std::endl;' // C++
  ];
  let textIdx = 0;
  let idx = 0;
  let typingForward = true;

  function typeSubtitleLoop() {
    if (subtitle) {
      const currentText = subtitleTexts[textIdx];
      subtitle.textContent = currentText.slice(0, idx);
      if (typingForward) {
        if (idx < currentText.length) {
          idx++;
          setTimeout(typeSubtitleLoop, 40);
        } else {
          typingForward = false;
          setTimeout(typeSubtitleLoop, 1200);
        }
      } else {
        if (idx > 0) {
          idx--;
          setTimeout(typeSubtitleLoop, 20);
        } else {
          typingForward = true;
          textIdx = (textIdx + 1) % subtitleTexts.length;
          setTimeout(typeSubtitleLoop, 600);
        }
      }
    }
  }
  typeSubtitleLoop();

  // ======= CERTIFICATE IMAGE VIEWER =======
  const certList = document.querySelectorAll('#certifications .certifications-list li');
  const certImageViewer = document.getElementById('cert-image-viewer');
  const certImage = document.getElementById('cert-image');
  const closeCertBtn = document.getElementById('close-cert-image');
  const certModal = document.getElementById('cert-modal');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalClose = document.getElementById('cert-modal-close');
  const viewInModalLink = document.getElementById('viewInModalLink');
  let currentCertImgSrc = "";

// Select the first certification by default
const firstCert = document.querySelector('.certifications-list li[data-img]');
if (firstCert && certImage && certImageViewer) {
  // Remove 'active' from all, add to first
  certList.forEach(li => li.classList.remove('active'));
  firstCert.classList.add('active');
  // Set image and show viewer (desktop)
  certImage.src = firstCert.getAttribute('data-img');
  certImage.alt = firstCert.querySelector('strong')?.textContent || "Certificate";
  if (!isMobile()) {
    certImageViewer.style.display = "flex";
  }
  // Set currentCertImgSrc for modal
  currentCertImgSrc = firstCert.getAttribute('data-img');
}

  function isMobile() {
    return window.innerWidth <= 900;
  }

  // Prevent body scroll when modal is open (mobile)
  function toggleBodyScroll(disable) {
    if (disable) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  // Show certificate in viewer or modal
  certList.forEach(item => {
    item.addEventListener('click', function (e) {
      const imgSrc = this.getAttribute('data-img');
      if (!imgSrc) return;
      certList.forEach(li => li.classList.remove('active'));
      this.classList.add('active');
      currentCertImgSrc = imgSrc;
      if (isMobile()) {
        certModalImg.src = imgSrc;
        certModal.style.display = "flex";
        toggleBodyScroll(true);
      } else {
        certImage.src = imgSrc;
        certImageViewer.style.display = "flex";
      }
    });
  });

  // Desktop: View in modal link
  if (viewInModalLink) {
    viewInModalLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentCertImgSrc) {
        certModalImg.src = currentCertImgSrc;
        certModal.style.display = "flex";
        toggleBodyScroll(true);
      }
    });
  }

  // Close side viewer
  if (closeCertBtn) {
    closeCertBtn.addEventListener('click', function () {
      certImageViewer.style.display = "none";
      certList.forEach(li => li.classList.remove('active'));
      certImage.src = "";
      currentCertImgSrc = "";
    });
  }

  // Close modal
  if (certModalClose) {
    certModalClose.addEventListener('click', function () {
      certModal.style.display = "none";
      certModalImg.src = "";
      certList.forEach(li => li.classList.remove('active'));
      toggleBodyScroll(false);
    });
  }

  // Hide modal if clicking outside image
  if (certModal) {
    certModal.addEventListener('click', function (e) {
      if (e.target === certModal) {
        certModal.style.display = "none";
        certModalImg.src = "";
        certList.forEach(li => li.classList.remove('active'));
        toggleBodyScroll(false);
      }
    });
  }

  // On mobile, do not show modal or viewer unless a cert is clicked
  window.addEventListener('resize', function () {
    if (isMobile()) {
      certImageViewer.style.display = "none";
      certModal.style.display = "none";
      certImage.src = "";
      certModalImg.src = "";
      certList.forEach(li => li.classList.remove('active'));
      toggleBodyScroll(false);
    }
  });
});