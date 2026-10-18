// Расписание: what is on now or next, a line at the present minute, day tabs on phones, .ics export.
(() => {
  const d = document;
  const dataEl = d.getElementById('week-data');
  if (!dataEl) return;
  const { pairs, week } = JSON.parse(dataEl.textContent);
  const days = [...d.querySelectorAll('[data-day]')];
  const tabs = [...d.querySelectorAll('[data-tab]')];
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // Monday = 0
  const mins = now.getHours() * 60 + now.getMinutes();
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  /* ---------- today, and the line at the present minute ---------- */
  if (dow < week.length) {
    days[dow].classList.add('is-today');
    const slots = [...days[dow].querySelectorAll('.slot')];
    const line = days[dow].querySelector('[data-now-line]');
    const place = () => {
      let y = null;
      pairs.forEach(([a, b], n) => {
        const el = slots[n];
        const s = toMin(a), e = toMin(b);
        if (mins >= s && mins < e) { y = el.offsetTop + el.offsetHeight * ((mins - s) / (e - s)); el.classList.add('is-now'); }
        else if (n > 0 && mins >= toMin(pairs[n - 1][1]) && mins < s) y = el.offsetTop - 4;
      });
      line.style.setProperty('--now-y', y === null ? '-999px' : `${y + slots[0].parentElement.offsetTop}px`);
    };
    place();
    addEventListener('resize', place);
  }

  /* ---------- the "now" panel ---------- */
  const flat = [];
  week.forEach((day, di) => day.items.forEach((it) => flat.push({ di, ...it, from: toMin(pairs[it.n][0]), to: toMin(pairs[it.n][1]) })));
  const current = flat.find((x) => x.di === dow && mins >= x.from && mins < x.to);
  const next = current || flat.find((x) => x.di === dow && x.from > mins) || flat.find((x) => x.di > dow) || flat[0];
  const label = d.querySelector('[data-now-label]');
  const subject = d.querySelector('[data-now-subject]');
  const meta = d.querySelector('[data-now-meta]');
  const room = d.querySelector('[data-now-room]');
  if (next) {
    const inMin = next.di === dow ? next.from - mins : null;
    label.textContent = current ? 'Сейчас идёт' : inMin !== null && inMin <= 120 ? `Через ${inMin} мин` : 'Следующая пара';
    subject.textContent = next.s;
    meta.textContent = `${week[next.di].day}, ${pairs[next.n][0]}–${pairs[next.n][1]} · ${next.t}`;
    room.querySelector('.display').textContent = next.r;
    if (/^[А-ЯЁа-яё]{1,3}-\d/.test(next.r)) room.href = `kampus.html?room=${encodeURIComponent(next.r)}`;
  }

  /* ---------- day tabs (phones) ---------- */
  const show = (i) => {
    days.forEach((el, n) => el.classList.toggle('is-shown', n === i));
    tabs.forEach((t, n) => t.setAttribute('aria-selected', String(n === i)));
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  show(dow < week.length ? dow : 0);

  /* ---------- the week into the phone's calendar ---------- */
  const ics = d.querySelector('[data-ics]');
  ics?.addEventListener('click', () => {
    const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(now.getDate() - dow);
    const stamp = (date, t) => { const [h, m] = t.split(':'); const x = new Date(date); x.setHours(+h, +m); const p = (v) => String(v).padStart(2, '0'); return `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`; };
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UrFU prototype//RU', 'CALSCALE:GREGORIAN'];
    week.forEach((day, di) => day.items.forEach((it, k) => {
      const date = new Date(monday); date.setDate(monday.getDate() + di);
      lines.push('BEGIN:VEVENT', `UID:${di}-${k}-${it.n}@urfu-prototype`, `DTSTAMP:${stamp(now, '00:00')}`, `DTSTART;TZID=Asia/Yekaterinburg:${stamp(date, pairs[it.n][0])}`, `DTEND;TZID=Asia/Yekaterinburg:${stamp(date, pairs[it.n][1])}`, 'RRULE:FREQ=WEEKLY;COUNT=16', `SUMMARY:${it.s} (${it.t})`, `LOCATION:${it.r}`, 'END:VEVENT');
    }));
    lines.push('END:VCALENDAR');
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
    const a = Object.assign(d.createElement('a'), { href: url, download: 'raspisanie-urfu.ics' });
    d.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
