// A handful of plain stroke icons, drawn on a 24px grid. Used inside controls only.
const svg = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;

export const icon = {
  arrow: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  arrowRight: svg('<path d="M4 12h15M13 6l6 6-6 6"/>'),
  arrowDown: svg('<path d="M12 4v15M6 13l6 6 6-6"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'),
  close: svg('<path d="M5 5l14 14M19 5 5 19"/>'),
  plus: svg('<path d="M12 4v16M4 12h16"/>'),
  minus: svg('<path d="M4 12h16"/>'),
  check: svg('<path d="m4 12.5 5 5L20 6.5"/>'),
  copy: svg('<rect x="8" y="8" width="12" height="12"/><path d="M16 4H4v12"/>'),
  calendar: svg('<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  pin: svg('<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.8" r="2.3"/>'),
  eye: svg('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>'),
};
