/** Match single and two-tone swatches to the color names in the image folders. */
export function swatchBackground(color) {
  return color.name.includes(' y ')
    ? `linear-gradient(135deg, ${color.base} 50%, ${color.accent} 50%)`
    : color.swatch || color.base
}
