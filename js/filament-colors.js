// Single source of truth for filament colors used across all product pages.
// Add/remove/rename colors here and every color picker on the site updates.
const FILAMENT_COLORS = {
  pla: [
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#f5f5f5" },
    { name: "Silver", hex: "#c0c0c0" },
    { name: "Red", hex: "#e2231a" },
    { name: "Orange", hex: "#f2793a" },
    { name: "Gold", hex: "#d4af37" },
    { name: "Yellow", hex: "#ffd400" },
    { name: "Lime Green", hex: "#8bc53f" },
    { name: "Blue", hex: "#2f6fbf" },
    { name: "Light Blue", hex: "#8ecae6" },
    { name: "Purple", hex: "#8e44ad" },
    { name: "Magenta", hex: "#ec008c" },
    { name: "Baby Pink", hex: "#f7b8c4" }
  ],
  petg: [
    { name: "White", hex: "#f5f5f5" },
    { name: "Black", hex: "#1a1a1a" },
    { name: "Clear", hex: "#eaf4f7", transparent: true },
    { name: "Clear Blue", hex: "#bfe3f2", transparent: true }
  ]
};
