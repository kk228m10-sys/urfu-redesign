// The new sign. Two strokes of the Cyrillic «У» meet and continue as one: the thin arm and the heavy
// stem keep the contrast of the current UrFU mark, redrawn with straight constructivist cuts and no tail.
// Read top-down it is two universities (УрГУ and УПИ) becoming one; bottom-up, one root that branches.
// Geometry on a 100×100 grid, both strokes slanted at the same angle (dx/dy = 0.48).
export const ARM = 'M16 0H30L47.28 36L40.3 50.6Z';
export const STEM = 'M62 0H84L36 100H14Z';

export const mark = ({ cls = '', label = '' } = {}) =>
  `<svg class="mark ${cls}" viewBox="0 0 100 100" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false"><path class="mark-arm" d="${ARM}"/><path class="mark-stem" d="${STEM}"/></svg>`;

// Header lockup: the sign and the advertising name on two lines.
export const lockup = ({ href = 'index.html', cls = '' } = {}) =>
  `<a class="brand ${cls}" href="${href}" aria-label="Уральский федеральный университет — на главную">${mark()}<span class="brand-name" aria-hidden="true">Уральский<br>федеральный</span></a>`;

// Standalone SVG files for the brand page, favicon and the PDF.
export const markFile = (fill = '#e50046', bg = null) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bg ? '-18 -18 136 136' : '0 0 100 100'}">${bg ? `<rect x="-18" y="-18" width="136" height="136" fill="${bg}"/>` : ''}<path fill="${fill}" d="${ARM}"/><path fill="${fill}" d="${STEM}"/></svg>`;
