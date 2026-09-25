document.addEventListener("DOMContentLoaded", () => {
  // Color swatch pickers — rendered from the shared FILAMENT_COLORS palette
  // (js/filament-colors.js) so every page stays in sync with one color list.
  document.querySelectorAll(".swatch-picker").forEach((picker) => {
    const palette = FILAMENT_COLORS[picker.dataset.palette] || [];
    const region = picker.dataset.region || "color";
    const defaultName = picker.dataset.default;
    const target = document.querySelector(".region-" + region);
    const label = document.querySelector(".selected-" + region);
    const container = picker.querySelector(".swatches");
    if (!container) return;

    palette.forEach((color) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch" + (color.transparent ? " swatch-transparent" : "");
      btn.style.background = color.transparent
        ? `repeating-linear-gradient(45deg, ${color.hex} 0 4px, #ffffff 4px 8px)`
        : color.hex;
      btn.dataset.color = color.hex;
      btn.dataset.name = color.name;
      btn.setAttribute("aria-label", color.name);
      if (color.name === defaultName) btn.classList.add("selected");

      btn.addEventListener("click", () => {
        if (target) {
          if (target instanceof SVGElement) {
            target.style.fill = color.hex;
            target.style.fillOpacity = color.transparent ? 0.45 : 1;
          } else {
            target.style.backgroundColor = color.hex;
            target.style.opacity = color.transparent ? 0.45 : 1;
          }
        }
        if (label) label.textContent = color.name;
        container.querySelectorAll(".swatch").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        updateSelectionSummary();
      });

      container.appendChild(btn);
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
    document.querySelectorAll(".swatch-picker .selected-color-name").forEach((el) => {
      parts.push(el.textContent);
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
