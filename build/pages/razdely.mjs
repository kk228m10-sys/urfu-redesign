// Разделы новой структуры, которые в прототипе не свёрстаны: what each one will hold, and the way to the
// same section on the current site today (addresses taken from the navigation of urfu.ru, 2026-10-18).
// So every link of the menu leads somewhere real. The plans are proposals of the redesign, not facts.
import { html, esc } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { pageHead } from '../components/pagehead.mjs';
import { icon } from '../components/icons.mjs';
import { img, credits, isAi } from '../components/media.mjs';
import { sectionById } from '../site.mjs';
import { BUILT } from './skoro.mjs';
import { fit } from '../fit.mjs';

export const RAZDELY = [
  { slug: 'magistratura', section: 'postupit', title: 'Магистратура', lines: ['Магистратура'],
    lead: 'Магистратура и специализированное высшее образование: программы, вступительные испытания и сроки.',
    plan: ['Каталог магистерских программ с теми же фильтрами, что у бакалавриата: институт, формат, стоимость.', 'У каждой программы — вступительное испытание, даты и портфолио, которое стоит собрать заранее.', 'Подача документов онлайн и статус заявления в личном кабинете.'],
    ext: 'https://magister.urfu.ru/ru/documents/', extLabel: 'magister.urfu.ru', related: ['programmy.html', 'postupit.html'] },
  { slug: 'aspirantura', section: 'nauka', title: 'Аспирантура', lines: ['Аспирантура'],
    lead: 'Аспирантура: научные специальности, руководители и вступительные экзамены.',
    plan: ['Научные специальности с руководителями и темами лабораторий.', 'Вступительные экзамены, сроки и списки поступивших.', 'Стипендии, гранты и конференции для аспирантов.'],
    ext: 'https://postgraduate.urfu.ru/', extLabel: 'postgraduate.urfu.ru', related: ['nauka.html', 'postupit.html'] },
  { slug: 'kolledzh', section: 'postupit', title: 'Колледж (СПО)', lines: ['Колледж'],
    lead: 'Колледж УрФУ: специальности среднего профессионального образования и как поступить.',
    plan: ['Специальности колледжа с базой приёма и сроком обучения.', 'Сроки подачи документов и как считается конкурс.', 'Как после колледжа продолжить учёбу в университете.'],
    ext: 'https://urfu.ru/ru/applicant/spo-urfu/', extLabel: 'urfu.ru', related: ['postupit.html', 'programmy.html'] },
  { slug: 'inostrancam', section: 'postupit', title: 'Иностранным абитуриентам', lines: ['Иностранным', 'абитуриентам'],
    lead: 'Поступление для иностранных граждан: документы, учёба и жизнь в Екатеринбурге.',
    plan: ['Поступление по квоте и на контракт: документы и сроки по шагам.', 'Русский язык и подготовка для тех, кто только начинает.', 'Виза, общежитие и первые дни в Екатеринбурге.'],
    ext: 'https://urfu.ru/ru/international/int-admission/', extLabel: 'urfu.ru', photo: 'international', alt: 'Студенты из разных стран за одним столом', related: ['postupit.html', 'zhizn.html'] },
  { slug: 'shkolnikam', section: 'postupit', title: 'Школьникам: олимпиады и курсы', lines: ['Школьникам'],
    lead: 'Олимпиады, курсы подготовки и события для школьников.',
    plan: ['Олимпиады, которые дают льготы при поступлении, — с датами в календарь телефона.', 'Курсы подготовки к ЕГЭ: расписание и запись.', 'События для школьников — в общей афише, одним фильтром.'],
    ext: 'https://urfu.ru/ru/school/', extLabel: 'urfu.ru', extra: { href: 'index.html#podbor', label: 'Подобрать по ЕГЭ' }, related: ['afisha.html', 'index.html'] },
  { slug: 'stipendii', section: 'uchitsya', title: 'Стипендии', lines: ['Стипендии'],
    lead: 'Все стипендии университета на одной странице: кому положены и как подать заявление.',
    plan: ['Виды стипендий: академическая, социальная, повышенная и именные.', 'Калькулятор: какая стипендия положена именно тебе.', 'Сроки подачи заявлений и документы.'],
    ext: 'https://urfu.ru/ru/students/study/scholarships/', extLabel: 'urfu.ru', related: ['raspisanie.html', 'kontakty.html'] },
  { slug: 'karera', section: 'uchitsya', title: 'Практика и карьера', lines: ['Практика', 'и карьера'],
    lead: 'Практика, стажировки и работа: от первого резюме до выпуска.',
    plan: ['Вакансии и стажировки партнёров университета.', 'Как оформить практику: договор, сроки, отчёт.', 'Центр карьеры: консультации и ярмарки вакансий.'],
    ext: 'https://career.urfu.ru/ru/', extLabel: 'career.urfu.ru', related: ['programma-13-03-02.html', 'afisha.html'] },
  { slug: 'perevod', section: 'uchitsya', title: 'Перевод и восстановление', lines: ['Перевод', 'и восстановление'],
    lead: 'Перевод из другого вуза, на другую программу или на бюджет и восстановление.',
    plan: ['Свободные места для перевода по каждому направлению.', 'Порядок по шагам: заявление, аттестация, приказ.', 'Сроки и документы для каждого случая.'],
    ext: 'https://urfu.ru/sveden/vacant/', extLabel: 'urfu.ru', related: ['programmy.html', 'kontakty.html'] },
  { slug: 'mobilnost', section: 'uchitsya', title: 'Академическая мобильность', lines: ['Академическая', 'мобильность'],
    lead: 'Учёба по обмену в вузах-партнёрах и как перезачесть дисциплины.',
    plan: ['Программы обмена и включённое обучение в вузах-партнёрах.', 'Конкурсы на семестр в другом вузе.', 'Как перезачесть дисциплины после возвращения.'],
    ext: 'https://urfu.ru/ru/international/mobility/', extLabel: 'urfu.ru', related: ['raspisanie.html', 'nauka.html'] },
  { slug: 'spravki', section: 'uchitsya', title: 'Справки и документы', lines: ['Справки', 'и документы'],
    lead: 'Справки об обучении, для военкомата и для стипендии — заказ онлайн.',
    plan: ['Заказ справки в два клика из личного кабинета.', 'Статус заявки и срок готовности.', 'Где забрать документ или как получить электронную копию.'],
    ext: null, extNote: 'На действующем сайте отдельного раздела нет — контакты служб собраны в справочнике.', related: ['kontakty.html', 'raspisanie.html'] },
  { slug: 'zdorove', section: 'uchitsya', title: 'Здоровье и психологическая помощь', lines: ['Здоровье'],
    lead: 'Медицинская и психологическая помощь студентам.',
    plan: ['Поликлиника, медосмотры и прививки.', 'Психологическая служба: анонимная запись на консультацию.', 'Спорт и здоровый образ жизни — секции университета.'],
    ext: 'https://urfu.ru/ru/about/units/ppov/hp/', extLabel: 'urfu.ru', related: ['zhizn.html', 'kontakty.html'] },
  { slug: 'granty', section: 'nauka', title: 'Гранты и конкурсы', lines: ['Гранты', 'и конкурсы'],
    lead: 'Гранты и конкурсы для студентов, аспирантов и молодых учёных.',
    plan: ['Текущие конкурсы с дедлайнами — в календарь телефона одной кнопкой.', 'Гранты для студентов и молодых учёных.', 'Как подготовить и подать заявку.'],
    ext: 'https://urfu.ru/ru/science/grants/', extLabel: 'urfu.ru', extra: { href: 'nauka.html#studentam', label: 'Конкурсы этой осени' }, related: ['nauka.html', 'afisha.html'] },
  { slug: 'zhurnaly', section: 'nauka', title: 'Научные журналы', lines: ['Научные', 'журналы'],
    lead: 'Журналы университета: тематика, правила для авторов и подача статей.',
    plan: ['Каталог журналов университета по областям науки.', 'Правила для авторов и подача статьи.', 'Архив выпусков.'],
    ext: 'https://urfu.ru/ru/science/scientific-journals/', extLabel: 'urfu.ru', related: ['nauka.html', 'novosti.html'] },
  { slug: 'innovacii', section: 'nauka', title: 'Стартапы и инновации', lines: ['Стартапы', 'и инновации'],
    lead: 'Инновации университета: разработки для бизнеса и поддержка студенческих стартапов.',
    plan: ['Технологии и разработки университета для компаний.', 'Поддержка студенческих стартапов.', 'Как защитить идею и найти партнёра.'],
    ext: 'https://urfu.ru/ru/innovations/', extLabel: 'urfu.ru', related: ['nauka.html', 'novosti.html'] },
  { slug: 'volonterstvo', section: 'zhizn', title: 'Волонтёрство', lines: ['Волонтёрство'],
    lead: 'Волонтёрские проекты университета и как к ним присоединиться.',
    plan: ['Проекты и события, куда нужны волонтёры.', 'Запись в один клик и напоминание в календаре.', 'Волонтёрские часы — в портфолио студента.'],
    ext: 'https://urfu.ru/ru/students/leisure/oso/volural/', extLabel: 'urfu.ru', photo: 'news-donor', alt: 'Студенты на донорской акции, волонтёры помогают с регистрацией', related: ['zhizn.html', 'afisha.html'] },
  { slug: 'obedineniya', section: 'zhizn', title: 'Студенческие объединения', lines: ['Студенческие', 'объединения'],
    lead: 'Союз студентов, клубы и объединения по интересам.',
    plan: ['Каталог клубов и объединений с контактами.', 'Как создать своё объединение и получить поддержку.', 'Конкурс проектов студенческих объединений.'],
    ext: 'https://urfu.ru/ru/students/leisure/student-union/', extLabel: 'urfu.ru', photo: 'life-robotics', alt: 'Двое студентов собирают робота в мастерской', related: ['zhizn.html', 'afisha.html'] },
  { slug: 'poselenie', section: 'zhizn', title: 'Поселение в общежитие', lines: ['Поселение'],
    lead: 'Как подать заявку на общежитие, сроки поселения и что взять с собой.',
    plan: ['Заявка на общежитие онлайн и её статус.', 'Сроки поселения для первокурсников и старших курсов.', 'Что взять с собой и как добраться.'],
    ext: 'https://urfu.ru/ru/students/social/campus/', extLabel: 'urfu.ru', photo: 'campus-room', alt: 'Комната на двоих в общежитии', related: ['zhizn.html', 'novost-kampus.html'] },
  { slug: 'sotrudnikam', section: 'universitet', title: 'Сотрудникам', lines: ['Сотрудникам'],
    lead: 'Сервисы и документы для сотрудников университета.',
    plan: ['Внутренние сервисы и документы в одном месте.', 'Повышение квалификации и конкурсы.', 'Новости и объявления для сотрудников.'],
    ext: 'https://urfu.ru/ru/staff/', extLabel: 'urfu.ru', related: ['kontakty.html', 'novosti.html'] },
  { slug: 'partneram', section: 'universitet', title: 'Партнёрам и работодателям', lines: ['Партнёрам'],
    lead: 'Исследования, целевое обучение и практика: как компаниям работать с университетом.',
    plan: ['Как заказать исследование или разработку.', 'Целевое обучение, практика и стажировки студентов.', 'Контакты для компаний.'],
    ext: 'https://urfu.ru/ru/partners/', extLabel: 'urfu.ru', related: ['programma-13-03-02.html', 'nauka.html'] },
  { slug: 'vypusknikam', section: 'universitet', title: 'Выпускникам', lines: ['Выпускникам'],
    lead: 'Ассоциация выпускников, встречи и сервисы для тех, кто окончил университет.',
    plan: ['Ассоциация выпускников и их истории.', 'Встречи выпускников и события.', 'Дубликаты и подтверждение документов об образовании.'],
    ext: 'https://alumni.urfu.ru/ru/', extLabel: 'alumni.urfu.ru', related: ['istoriya.html', 'novosti.html'] },
];

const shots = Object.fromEntries(BUILT.map(([href, title, note]) => [href, { title, note }]));
const PANELS = ['yellow', 'ink', 'green'];

function razdelPage(r) {
  const s = sectionById(r.section);
  const bandField = s.field === 'paper' ? 'ink' : s.field;
  const out = r.ext ? html`<a class="btn btn-ink" href="${r.ext}" target="_blank" rel="noopener">Открыть на ${r.extLabel} ↗</a>` : html`<a class="btn btn-ink" href="kontakty.html">Справочник служб ${icon.arrow}</a>`;
  const body = html`
${pageHead({
  section: r.section,
  lines: r.lines,
  lead: esc(r.lead),
  crumbs: [{ label: r.title }],
  actions: html`${out}${r.extra ? html`<a class="btn btn-paper" href="${r.extra.href}">${r.extra.label}</a>` : ''}`,
  aside: r.photo ? html`<figure class="phead-photo" data-rise style="--i:2">${img(r.photo, { alt: r.alt, sizes: '(min-width: 48em) 24vw, 70vw', cls: 'cover', eager: true })}${isAi(r.photo) ? html`<figcaption class="photo-note">Иллюстрация</figcaption>` : ''}</figure>` : '',
})}

<section class="sec field-paper rz-plan" aria-labelledby="plan-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="plan-title" data-reveal>Что здесь будет</h2>
      <p class="sec-note" data-reveal style="--i:1">Раздел есть в новой структуре сайта, но в конкурсный прототип не свёрстан. Вот что в нём будет.</p>
    </div>
    <ul class="rz-panels" role="list">
      ${r.plan.map((t, i) => html`<li class="rz-panel field-${PANELS[i]}" data-reveal style="--i:${i}"><p>${esc(t)}</p></li>`)}
    </ul>
  </div>
</section>

<a class="band field-${bandField}" href="${r.ext || 'kontakty.html'}"${r.ext ? ' target="_blank" rel="noopener"' : ''}>
  <span class="band-note" data-reveal>${r.ext ? `Пока раздел работает на действующем сайте университета — ${esc(r.extLabel)}.` : esc(r.extNote)}</span>
  <span class="band-arrow" aria-hidden="true">${icon.arrow}</span>
  <span class="band-word giant" data-reveal style="--i:1;--fit:${fit(r.ext ? 'Открыть' : 'Службы').toFixed(3)}">${r.ext ? 'Открыть' : 'Службы'}</span>
</a>

<section class="sec field-paper" aria-labelledby="built-title">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="sec-title" id="built-title" data-reveal>Уже в прототипе</h2>
      <p class="sec-note" data-reveal style="--i:1">Страницы рядом по смыслу, которые можно посмотреть вживую.</p>
    </div>
    <ul class="stub-list rz-related" role="list">
      ${r.related.map((href, i) => html`<li data-reveal style="--i:${i}"><a class="stub-link" href="${href}"><img class="stub-shot" src="img/shots/${href.replace('.html', '.jpg')}" alt="" width="1440" height="900" loading="lazy"><span class="stub-link-title">${esc(shots[href]?.title || href)}</span><span class="stub-link-note">${esc(shots[href]?.note || '')}</span>${icon.arrow}</a></li>`)}
    </ul>
  </div>
</section>`;

  return {
    file: `razdel-${r.slug}.html`,
    html: page({
      id: 'razdel',
      title: `${r.title} — УрФУ`,
      description: `${r.lead} Раздел новой структуры сайта УрФУ.`,
      section: r.section,
      body,
      styles: ['stub.css', 'razdel.css'],
      credits: credits(r.photo ? [r.photo] : []),
    }),
  };
}

export default () => RAZDELY.map(razdelPage);
