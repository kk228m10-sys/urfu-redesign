// One honest stub for every link that leads outside the prototype, with the map of what is built.
import { html, esc } from '../lib.mjs';
import { page } from '../components/layout.mjs';
import { SECTIONS } from '../site.mjs';
import { icon } from '../components/icons.mjs';

export const BUILT = [
  ['index.html', 'Главная', 'подбор по ЕГЭ, институты, жизнь, как поступить'],
  ['postupit.html', 'Поступление', 'сроки 2026, шаги, документы, вопросы'],
  ['programmy.html', 'Каталог программ', 'фильтры по ЕГЭ и стоимости'],
  ['programma-13-03-02.html', 'Программа', 'Электроэнергетика и электротехника'],
  ['institut-uralenin.html', 'Институт', 'Уральский энергетический институт'],
  ['novosti.html', 'Новости', 'лента с превью'],
  ['novost-kampus.html', 'Статья', 'лонгрид о новом кампусе'],
  ['afisha.html', 'Афиша', 'календарь событий'],
  ['kampus.html', 'Карта кампуса', 'где корпус и аудитория'],
  ['raspisanie.html', 'Расписание', 'неделя группы'],
  ['istoriya.html', 'История', 'с 1920 года до слияния'],
  ['zhizn.html', 'Жизнь', 'общежития, спорт, творчество'],
  ['nauka.html', 'Наука', 'лаборатории и студенческая наука'],
  ['kontakty.html', 'Контакты', 'службы и как добраться'],
  ['brand.html', 'Фирменный стиль', 'новый знак и правила'],
  ['koncepciya.html', 'Концепция', 'описание для жюри'],
];

export default function () {
  const body = html`
<section class="stub field-yellow">
  <div class="wrap stub-wrap">
    <h1 class="display stub-title lines"><span class="line"><span data-line style="--i:0">Этого нет</span></span><span class="line"><span data-line style="--i:1">в прототипе</span></span></h1>
    <p class="lead stub-lead" data-rise style="--i:0">Страница <strong data-stub-name>из меню</strong> входит в новую структуру сайта, но в конкурсный прототип не свёрстана. Вот что можно посмотреть вживую.</p>
    <ul class="stub-list" role="list">
      ${BUILT.map(([href, title, note], i) => html`<li data-rise style="--i:${1 + (i % 6)}"><a class="stub-link" href="${href}"><img class="stub-shot" src="img/shots/${href.replace('.html', '.jpg')}" alt="" width="1440" height="900" loading="lazy"><span class="stub-link-title">${title}</span><span class="stub-link-note">${note}</span>${icon.arrow}</a></li>`)}
    </ul>
  </div>
</section>
<script>(()=>{const p=new URLSearchParams(location.search).get('p');if(p){const el=document.querySelector('[data-stub-name]');el.textContent='«'+p+'»';document.title=p+' — нет в прототипе · УрФУ';}})();</script>
`;
  return {
    file: 'skoro.html',
    html: page({ id: 'stub', title: 'Нет в прототипе — УрФУ', description: 'Страница входит в новую структуру сайта УрФУ, но не свёрстана в прототипе.', body, styles: ['stub.css'] }),
  };
}
