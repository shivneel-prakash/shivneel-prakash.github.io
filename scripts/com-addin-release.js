const checklistData = [
  {
    title: "🔨 Build Verification",
    items: [
      "Development work is complete and code is committed to DevOps.",
      "Build the COM Add-in.",
      "Verify the build completed successfully.",
      "Review build logs and confirm no errors.",
      "Confirm no unexpected warnings exist."
    ]
  },
  {
    title: "🏷️ Version Updates",
    items: [
      "Verify all version numbers are consistent."
    ]
  },
  {
    title: "🔐 Digital Signing & Certificates",
    items: [
      "Verify digital signing completed successfully.",
      "Validate installer certificates.",
      "Confirm installers show valid signatures."
    ]
  },
  {
    title: "🖥️ DPI & UI Validation",
    items: [
      "Determine whether Forms/UI code changed.",
      "Perform DPI testing if Forms/UI code was modified.",
      "Verify scaling, layout and rendering behavior."
    ]
  },
  {
    title: "☁️ Package Distribution",
    items: [
      "Upload installers to S3.",
      "Verify upload completed successfully.",
      "Configure S3 permissions.",
      "Generate download links."
    ]
  },
  {
    title: "🧪 Release Validation",
    items: [
      "Verify download links are working.",
      "Confirm downloads complete successfully.",
      "Recheck signatures on downloaded installers.",
      "Perform final smoke-test installation."
    ]
  },
  {
    title: "📧 Team Communication",
    items: [
      "Confirm release package is ready.",
      "Send validated download links to the team.",
      "Include release notes and version information."
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderChecklist();
  updateProgress();
});

function renderChecklist() {
  const container = document.getElementById("checklist-container");
  let counter = 1;

  checklistData.forEach(section => {
    const card = document.createElement("div");
    card.className = "glass card checklist-section";

    const title = document.createElement("h3");
    title.textContent = section.title;
    card.appendChild(title);

    section.items.forEach(item => {
      const row = document.createElement("div");
      row.className = "checklist-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `check-${counter}`;
      checkbox.addEventListener("change", updateProgress);

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = item;

      row.appendChild(checkbox);
      row.appendChild(label);

      card.appendChild(row);
      counter++;
    });

    container.appendChild(card);
  });
}

function updateProgress() {
  const checkboxes = document.querySelectorAll(
    '#checklist-container input[type="checkbox"]'
  );

  const completed = document.querySelectorAll(
    '#checklist-container input[type="checkbox"]:checked'
  ).length;

  const total = checkboxes.length;
  const percent = Math.round((completed / total) * 100);

  document.getElementById("progress-fill").style.width = `${percent}%`;
  document.getElementById(
    "progress-text"
  ).textContent = `${percent}% Complete (${completed}/${total})`;
}