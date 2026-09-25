document.addEventListener("DOMContentLoaded", () => {
  // Color swatch pickers — rendered from the shared FILAMENT_COLORS palette
  // (js/filament-colors.js) so every page stays in sync with one color list.
  // regionPickers tracks each picker's swatch container + current selection so
  // paired regions (e.g. primary/secondary) can stop the same color being picked twice.
  const regionPickers = {};

  document.querySelectorAll(".swatch-picker").forEach((picker) => {
    const palette = FILAMENT_COLORS[picker.dataset.palette] || [];
    const region = picker.dataset.region || "color";
    const defaultName = picker.dataset.default;
    const target = document.querySelector(".region-" + region);
    const label = document.querySelector(".selected-" + region);
    const container = picker.querySelector(".swatches");
    if (!container) return;

    const info = { container, selectedName: defaultName };
    regionPickers[region] = info;

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
        info.selectedName = color.name;
        updateSelectionSummary();
        syncPairedPickers(region);
      });

      container.appendChild(btn);
    });
  });

  // Linked regions can't share the same color (e.g. a two-tone product where
  // primary and secondary would otherwise look identical/invisible against each other).
  const pairedRegions = [["primary", "secondary"]];

  function syncPairedPickers(changedRegion) {
    const pair = pairedRegions.find((p) => p.includes(changedRegion));
    if (!pair) return;
    const otherRegion = pair.find((r) => r !== changedRegion);
    disableMatchingSwatch(changedRegion, otherRegion);
    disableMatchingSwatch(otherRegion, changedRegion);
  }

  function disableMatchingSwatch(sourceRegion, targetRegion) {
    const source = regionPickers[sourceRegion];
    const target = regionPickers[targetRegion];
    if (!source || !target) return;
    target.container.querySelectorAll(".swatch").forEach((btn) => {
      const clash = btn.dataset.name === source.selectedName;
      btn.disabled = clash;
      btn.title = clash ? "Already selected as the other colour" : "";
    });
  }

  pairedRegions.forEach(([a, b]) => {
    if (regionPickers[a] && regionPickers[b]) {
      disableMatchingSwatch(a, b);
      disableMatchingSwatch(b, a);
    }
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
