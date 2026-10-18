// Letter codes of buildings as they appear in the timetable ("Р-237" = building Р, floor 2, room 37).
// The buildings, their letters and the passages between them follow the campus map the author sent
// (2026-10-18); its outlines are traced in build/campus-plan.mjs, and «where» is read off that map.
// Addresses: urfu.ru/ru/instituty and programs.edu.urfu.ru/ru/9980 (rooms Э-205, Т-209 at Мира, 19).
// Who works where: the 2011 list of UrFU buildings («ауд. Э» electrical engineering, «М» mechanical
// engineering, «И» economics, «Мт» metallurgy…) under today's institute names. СП is on the map
// without a known owner. All of it is listed in the README for checking against the timetable.
// Each building is painted in its own Ural gem (gem, color), on the plan, its card and the answer card.
// Photos: Wikimedia Commons, credits in assets/images.json.
export const ROOMS = [
  { id: 'guk', code: 'ГУК', name: 'Главный учебный корпус', address: 'Мира, 19', who: 'ректорат, приёмная комиссия', where: 'фасадом на площадь Кирова', gem: 'рубин', color: '#e50046', photo: 'guk-2022', alt: 'Главный учебный корпус: колоннада и надпись на фронтоне' },
  { id: 'e', code: 'Э', name: 'Электротехнический корпус', address: 'Мира, 19', who: 'УралЭНИН', where: 'вплотную к ГУК с севера, переход в СП', gem: 'яшма', color: '#c0502a' },
  { id: 'm', code: 'М', name: 'Механический корпус', address: '', who: 'ИНМиТ', where: 'вплотную к ГУК с северо-востока', gem: 'лазурит', color: '#2b4cc0' },
  { id: 'sp', code: 'СП', name: 'Корпус СП', address: '', who: '', where: 'между С и Э, переходы в оба корпуса', gem: 'дымчатый кварц', color: '#6b5444' },
  { id: 's', code: 'С', name: 'Строительный корпус', address: 'Мира, 17', who: 'ИСА', where: 'на Мира севернее площади Кирова, переход в СП', gem: 'тигровый глаз', color: '#9c6a22', photo: 'bld-s', alt: 'Фасад строительного корпуса с гербом «СФ»' },
  { id: 'i', code: 'И', name: 'Корпус И', address: 'Мира, 19', who: 'ИнЭУ', where: 'вплотную к ГУК с юга, переходы в Т и Ф', gem: 'бирюза', color: '#12a4b4', photo: 'bld-i', alt: 'Колоннада корпуса И с вывеской факультета экономики и управления' },
  { id: 't', code: 'Т', name: 'Корпус Т', address: 'Мира, 19', who: 'УралЭНИН', where: 'вдоль улицы Софьи Ковалевской, переход в И', gem: 'малахит', color: '#0b7a5e', photo: 'bld-t', alt: 'Многоэтажное здание УралЭНИН' },
  { id: 'f', code: 'Ф', name: 'Физико-технологический корпус', address: 'Мира, 21', who: 'ФТИ', where: 'южнее площади Кирова, переходы в И и через Мира в Мт', gem: 'гематит', color: '#45555e', photo: 'bld-f', alt: 'Портик физико-технологического корпуса' },
  { id: 'h', code: 'Х', name: 'Химический корпус', address: 'Мира, 28', who: 'ХТИ', where: 'на западной стороне Мира, рядом с Мт', gem: 'изумруд', color: '#22c278', photo: 'bld-h', alt: 'Вход в корпус ХТИ и ИНМиТ на Мира, 28' },
  { id: 'mt', code: 'Мт', name: 'Металлургический корпус', address: 'Мира, 28', who: 'ИНМиТ', where: 'на западной стороне Мира, переход в Ф', gem: 'янтарь', color: '#f4a51a', photo: 'bld-mt', alt: 'Корпус ХТИ и ИНМиТ сбоку, Мира, 28' },
  { id: 'r', code: 'Р', name: 'Корпус радиофака', address: 'Мира, 32', who: 'ИРИТ-РтФ', where: 'на западной стороне Мира, южнее Мт', gem: 'аметист', color: '#7b4fc4', photo: 'bld-r', alt: 'Вход в корпус ИРИТ-РтФ' },
];

// "Р-237", "р237", "Р 237", "ГУК-100". Two-letter codes come first in the pattern, so "СП-201" is not
// read as building С; "Фт" is the old spelling of Ф. kampus.js and site.js carry the same rule.
export const ROOM_ALIASES = { гук: 'ГУК', мт: 'Мт', сп: 'СП', фт: 'Ф' };
export const ROOM_PATTERN = '^\\s*(ГУК|МТ|СП|ФТ|[А-ЯЁ])\\s*-?\\s*(\\d{3,4})\\s*$';
