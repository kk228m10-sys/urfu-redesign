// The head of every inner page: the section's colour field, a fitted title, the trail back,
// one supporting sentence on the 34% axis and the page's actions. Same grammar on every page,
// so the colour and the place of the title always say where the visitor is.
import { html, esc } from '../lib.mjs';
import { sectionById } from '../site.mjs';
import { fit } from '../fit.mjs';

export function pageHead({ section, lines, lead, actions = '', crumbs = [], aside = '', id = 'page-title', cls = '' }) {
  const s = sectionById(section);
  const em = Math.max(...lines.map((l) => fit(l))) * 1.02;
  // The section link is dropped when the trail already passes through its hub page, or when this
  // page is the hub itself (its own crumb has no href).
  const viaHub = crumbs.some((c) => c.href === s?.href) || (crumbs.length === 1 && !crumbs[0].href && s?.href === `${section}.html`);
  const trail = [{ label: 'Главная', href: 'index.html' }, s && !viaHub && { label: s.label, href: s.href }, ...crumbs].filter(Boolean);
  return html`
<header class="phead field-${s ? s.field : 'paper'} ${cls}" aria-labelledby="${id}">
  <nav class="crumbs wrap" aria-label="Вы здесь">
    <ol class="crumbs-list">
      ${trail.map((c, i) => (i === trail.length - 1 && !c.href ? html`<li aria-current="page">${esc(c.label)}</li>` : html`<li><a class="link" href="${c.href}">${esc(c.label)}</a></li>`))}
    </ol>
  </nav>
  <div class="phead-grid wrap">
    <h1 class="phead-title display lines" id="${id}" style="--fit:${em.toFixed(3)}">
      ${lines.map((l, i) => html`<span class="line"><span data-line style="--i:${i}">${esc(l)}</span></span>`)}
    </h1>
    <div class="phead-talk">
      ${lead ? html`<p class="phead-lead" data-rise style="--i:0">${lead}</p>` : ''}
      ${actions ? html`<div class="phead-actions" data-rise style="--i:1">${actions}</div>` : ''}
    </div>
    ${aside}
  </div>
</header>`;
}
