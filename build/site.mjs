// The new information architecture: five task-based sections instead of eight audience tabs,
// fourteen topic links and a two-hundred-item "all sections" menu. Each section owns one colour,
// so the colour of a page header always tells the visitor where they are.

export const SECTIONS = [
  {
    id: 'postupit',
    label: 'Поступить',
    field: 'red',
    href: 'postupit.html',
    lead: 'Программы, сроки, баллы и общежитие — всё для поступления в одном месте.',
    links: [
      { label: 'Подбор программы по ЕГЭ', href: 'index.html#podbor', built: true },
      { label: 'Каталог программ', href: 'programmy.html', built: true },
      { label: 'Бакалавриат и специалитет', href: 'postupit.html', built: true },
      { label: 'Сроки приёма 2026', href: 'postupit.html#sroki', built: true },
      { label: 'Магистратура', razdel: 'magistratura' },
      { label: 'Аспирантура', razdel: 'aspirantura' },
      { label: 'Колледж (СПО)', razdel: 'kolledzh' },
      { label: 'Иностранным абитуриентам', razdel: 'inostrancam' },
      { label: 'Стоимость и скидки', href: 'postupit.html#stoimost', built: true },
      { label: 'Общежития', href: 'zhizn.html#obshchezhitiya', built: true },
      { label: 'Школьникам: олимпиады и курсы', razdel: 'shkolnikam' },
      { label: 'Вопросы и ответы', href: 'postupit.html#voprosy', built: true },
    ],
  },
  {
    id: 'uchitsya',
    label: 'Учиться',
    field: 'green',
    href: 'raspisanie.html',
    lead: 'Расписание, сервисы и поддержка для тех, кто уже учится.',
    links: [
      { label: 'Расписание', href: 'raspisanie.html', built: true },
      { label: 'Где аудитория', href: 'kampus.html', built: true },
      { label: 'Личный кабинет', ext: 'https://istudent.urfu.ru/' },
      { label: 'Стипендии', razdel: 'stipendii' },
      { label: 'Библиотека', ext: 'http://lib.urfu.ru/' },
      { label: 'Практика и карьера', razdel: 'karera' },
      { label: 'Перевод и восстановление', razdel: 'perevod' },
      { label: 'Академическая мобильность', razdel: 'mobilnost' },
      { label: 'Справки и документы', razdel: 'spravki' },
      { label: 'Здоровье и психологическая помощь', razdel: 'zdorove' },
    ],
  },
  {
    id: 'nauka',
    label: 'Наука',
    field: 'ink',
    href: 'nauka.html',
    lead: 'Лаборатории, аспирантура, гранты и студенческая наука.',
    links: [
      { label: 'Направления исследований', href: 'nauka.html', built: true },
      { label: 'Лаборатории', href: 'nauka.html#laboratorii', built: true },
      { label: 'Студенческая наука', href: 'nauka.html#studentam', built: true },
      { label: 'Аспирантура', razdel: 'aspirantura' },
      { label: 'Гранты и конкурсы', razdel: 'granty' },
      { label: 'Научные журналы', razdel: 'zhurnaly' },
      { label: 'Стартапы и инновации', razdel: 'innovacii' },
    ],
  },
  {
    id: 'zhizn',
    label: 'Жизнь',
    field: 'yellow',
    href: 'zhizn.html',
    lead: 'Общежития, спорт, творчество и всё, что после пар.',
    links: [
      { label: 'Студенческая жизнь', href: 'zhizn.html', built: true },
      { label: 'Общежития', href: 'zhizn.html#obshchezhitiya', built: true },
      { label: 'Карта кампуса', href: 'kampus.html', built: true },
      { label: 'Афиша', href: 'afisha.html', built: true },
      { label: 'Спорт', href: 'zhizn.html#sport', built: true },
      { label: 'Творчество', href: 'zhizn.html#tvorchestvo', built: true },
      { label: 'Волонтёрство', razdel: 'volonterstvo' },
      { label: 'Студенческие объединения', razdel: 'obedineniya' },
    ],
  },
  {
    id: 'universitet',
    label: 'Университет',
    field: 'paper',
    href: 'istoriya.html',
    lead: 'История, институты, новости и контакты.',
    links: [
      { label: 'История с 1920 года', href: 'istoriya.html', built: true },
      { label: 'Институты', href: 'index.html#instituty', built: true },
      { label: 'Новости', href: 'novosti.html', built: true },
      { label: 'Фирменный стиль', href: 'brand.html', built: true },
      { label: 'Концепция редизайна', href: 'koncepciya.html', built: true },
      { label: 'Контакты', href: 'kontakty.html', built: true },
      { label: 'Сотрудникам', razdel: 'sotrudnikam' },
      { label: 'Партнёрам и работодателям', razdel: 'partneram' },
      { label: 'Выпускникам', razdel: 'vypusknikam' },
      { label: 'Сведения об образовательной организации', ext: 'https://urfu.ru/sveden/' },
    ],
  },
];

// Every link goes somewhere real: a page of the prototype, a «how it will be» page for a section that
// is not drawn yet (with the way to that section on the current site), or straight to a university
// service that lives on its own (the personal account, the library, the sections required by law).
export const hrefOf = (link) => link.href ?? link.ext ?? `razdel-${link.razdel}.html`;
export const isExternal = (href) => /^https?:/.test(href);
// target and rel for a link that leaves the prototype
export const outAttrs = (href) => (isExternal(href) ? ' target="_blank" rel="noopener"' : '');

export const SERVICES = {
  cabinet: 'https://istudent.urfu.ru/',
  sveden: 'https://urfu.ru/sveden/',
  anticorruption: 'https://security.urfu.ru/ru/anti-corruption/',
};
// One address for every page of a programme of the catalogue.
export const programHref = (code) => `programma-${code.replace(/\./g, '-')}.html`;

export const sectionById = (id) => SECTIONS.find((s) => s.id === id);

export const CONTACT = {
  phone: '8 800 100-50-44',
  phoneHref: 'tel:+78001005044',
  email: 'contact@urfu.ru',
  admissionsPhone: '+7 343 375-44-74',
  admissionsAddress: 'Екатеринбург, ул. Мира, 19, ГУК-100',
};
