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

  // Add-on toggle (e.g. dispenser tube) also feeds into the selection summary
  // and the Snipcart cart fields below, so mark it as a "part" when checked.
  document.querySelectorAll(".add-on-toggle input").forEach((checkbox) => {
    const note = document.querySelector("." + checkbox.dataset.note);
    checkbox.addEventListener("change", () => {
      if (note) note.classList.toggle("visible", checkbox.checked);
      updateSelectionSummary();
    });
  });

  function currentSelectionParts() {
    const parts = [];
    document.querySelectorAll(".option-selector select").forEach((select) => {
      parts.push(select.options[select.selectedIndex].text);
    });
    document.querySelectorAll(".swatch-picker .selected-color-name").forEach((el) => {
      parts.push(el.textContent);
    });
    document.querySelectorAll(".add-on-toggle input:checked").forEach((checkbox) => {
      parts.push(checkbox.parentElement.textContent.trim());
    });
    return parts;
  }

  function updateSelectionSummary() {
    const parts = currentSelectionParts();
    const selectionText = parts.join(", ");

    const summary = document.querySelector(".selection-summary");
    if (summary) {
      summary.textContent = "Selected: " + selectionText + " — mention this in your Etsy/eBay order.";
    }

    updateCartItemFields();
  }

  // Snipcart "Add to Cart" support.
  // A product page's .snipcart-add-item button carries the fixed
  // id/name/price/url/image as static data-item-* attributes in the HTML.
  // Here we additionally sync the customer's live colour/dropdown/add-on
  // picks into Snipcart's data-item-customN-name/value pairs (it supports
  // up to 5 per item), so whatever they chose shows up as line-item detail
  // in the cart, checkout, and your Snipcart order dashboard — no retyping
  // needed on their end.
  function updateCartItemFields() {
    const btn = document.querySelector(".snipcart-add-item");
    if (!btn) return;

    let n = 1;
    const setField = (name, value) => {
      if (n > 5 || !name || !value) return;
      btn.dataset["itemCustom" + n + "Name"] = name;
      btn.dataset["itemCustom" + n + "Value"] = value;
      n++;
    };

    document.querySelectorAll(".option-selector").forEach((selector) => {
      const label = selector.querySelector("label");
      const select = selector.querySelector("select");
      if (label && select) {
        setField(label.textContent.trim(), select.options[select.selectedIndex].text);
      }
    });

    document.querySelectorAll(".swatch-picker").forEach((picker) => {
      const h4 = picker.querySelector("h4");
      const valueEl = picker.querySelector(".selected-color-name");
      if (!h4 || !valueEl) return;
      const firstNode = h4.childNodes[0];
      const labelText = (firstNode ? firstNode.textContent : "Colour").replace(/:\s*$/, "").trim();
      setField(labelText, valueEl.textContent);
    });

    document.querySelectorAll(".add-on-toggle input:checked").forEach((checkbox) => {
      setField(checkbox.parentElement.textContent.trim(), "Yes");
    });
  }

  updateSelectionSummary();
});
