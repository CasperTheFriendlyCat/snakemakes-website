document.addEventListener("DOMContentLoaded", () => {
  // Color swatch pickers (primary/secondary live SVG preview)
  document.querySelectorAll(".color-configurator").forEach((configurator) => {
    configurator.querySelectorAll(".swatch-picker").forEach((picker) => {
      const region = picker.dataset.region;
      const target = configurator.querySelector(".region-" + region);
      const label = configurator.querySelector(".selected-" + region);
      picker.querySelectorAll(".swatch").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (target) target.style.fill = btn.dataset.color;
          if (label) label.textContent = btn.dataset.name;
          picker.querySelectorAll(".swatch").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
        });
      });
    });
  });

  // Dropdown option selectors (pack size, thickness, height) with a live summary line
  document.querySelectorAll(".option-selector select").forEach((select) => {
    select.addEventListener("change", updateSelectionSummary);
  });

  function updateSelectionSummary() {
    const summary = document.querySelector(".selection-summary");
    if (!summary) return;
    const parts = [];
    document.querySelectorAll(".option-selector select").forEach((select) => {
      parts.push(select.options[select.selectedIndex].text);
    });
    summary.textContent = "Selected: " + parts.join(", ") + " — mention this in your Etsy/eBay order.";
  }

  // Add-on toggle (e.g. dispenser tube) shows/hides a note
  document.querySelectorAll(".add-on-toggle input").forEach((checkbox) => {
    const note = document.querySelector("." + checkbox.dataset.note);
    checkbox.addEventListener("change", () => {
      if (note) note.classList.toggle("visible", checkbox.checked);
    });
  });
});
