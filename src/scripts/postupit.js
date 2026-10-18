// Поступление: the budget/paid switch on the calendar, day ↔ list highlighting, the checklist memory.
(() => {
  const d = document;

  /* ---------- calendar ---------- */
  const cal = d.querySelector('[data-cal]');
  const lists = [...d.querySelectorAll('[data-cal-list]')];
  const switches = [...d.querySelectorAll('[data-cal-set]')];
  if (cal) {
    cal.querySelectorAll('.cal-day').forEach((el, i) => el.style.setProperty('--d', i));
    switches.forEach((btn) => btn.addEventListener('click', () => {
      const set = btn.dataset.calSet;
      switches.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      cal.classList.add('is-switching');
      cal.dataset.set = set;
      lists.forEach((l) => { l.hidden = l.dataset.calList !== set; });
      setTimeout(() => cal.classList.remove('is-switching'), 900);
    }));

    // Pointing at a day lights its line in the list, and the other way round.
    const light = (date, on) => {
      d.querySelectorAll(`[data-date="${date}"]`).forEach((el) => el.classList.toggle('is-lit', on));
    };
    const bind = (el) => {
      el.addEventListener('pointerenter', () => light(el.dataset.date, true));
      el.addEventListener('pointerleave', () => light(el.dataset.date, false));
    };
    cal.querySelectorAll('.cal-day[title]').forEach(bind);
    d.querySelectorAll('.cal-event').forEach(bind);
  }

  /* ---------- checklist ---------- */
  const box = d.querySelector('[data-checklist]');
  if (box) {
    const KEY = 'urfu-checklist-2026';
    const inputs = [...box.querySelectorAll('[data-step]')];
    const meter = box.querySelector('[data-meter]');
    const count = box.querySelector('[data-count]');
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
    inputs.forEach((i) => { i.checked = saved.includes(Number(i.dataset.step)); });
    const update = () => {
      const done = inputs.filter((i) => i.checked).map((i) => Number(i.dataset.step));
      meter.style.setProperty('--done', done.length / inputs.length);
      meter.setAttribute('aria-valuenow', String(done.length));
      count.textContent = done.length === inputs.length ? 'Всё готово. Ждём вас в сентябре.' : `Сделано ${done.length} из ${inputs.length}`;
      try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
    };
    inputs.forEach((i) => i.addEventListener('change', update));
    update();
  }
})();
