/** Match single and two-tone swatches to the color names in the image folders. */
export function swatchBackground(color) {
  if (color.swatches?.length > 1) {
    const count = color.swatches.length
    return `linear-gradient(135deg, ${color.swatches.map((hex, index) => `${hex} ${index * 100 / count}% ${(index + 1) * 100 / count}%`).join(', ')})`
  }
  return color.name.includes(' y ')
    ? `linear-gradient(135deg, ${color.base} 50%, ${color.accent} 50%)`
    : color.swatch || color.base
}
