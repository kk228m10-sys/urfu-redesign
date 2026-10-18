// The sign of every institute: the same «У», its own pair of palette colours for the arm and the stem
// (the first six were on the brand page from the start). And where each institute stands: its building
// on the plan of Втузгородок (build/rooms.mjs) and a photograph of that building, when there is one.
export const INST_COLORS = {
  uralenin: ['#FECE00', '#1D1D1B'],
  irit: ['#22C278', '#1D1D1B'],
  ugi: ['#E50046', '#1D1D1B'],
  ineu: ['#1D1D1B', '#E50046'],
  hti: ['#FECE00', '#E50046'],
  fti: ['#22C278', '#E50046'],
  ienim: ['#E50046', '#22C278'],
  inmit: ['#E50046', '#FECE00'],
  isa: ['#1D1D1B', '#FECE00'],
  ifksmp: ['#22C278', '#FECE00'],
  info: ['#FECE00', '#22C278'],
  itoo: ['#1D1D1B', '#22C278'],
  upish: ['#1D1D1B', '#1D1D1B'],
};
// for the note under a sign: «штрих — жёлтый, ножка — чёрная» (masculine, feminine, plural)
export const COLOR_NAMES = {
  '#FECE00': ['жёлтый', 'жёлтая', 'жёлтые'],
  '#1D1D1B': ['чёрный', 'чёрная', 'чёрные'],
  '#E50046': ['красный', 'красная', 'красные'],
  '#22C278': ['изумрудный', 'изумрудная', 'изумрудные'],
};
// The field a page section takes for each sign colour (the yellow of the sign is the «topaz» field).
export const COLOR_FIELD = { '#FECE00': 'yellow', '#1D1D1B': 'ink', '#E50046': 'red', '#22C278': 'green' };

// room: the building on the plan, by the institute's address; photo: that building (Wikimedia Commons).
export const INST_PLACE = {
  isa: { room: 's', photo: 'bld-s', alt: 'Фасад строительного корпуса на Мира, 17 с гербом «СФ»' },
  fti: { room: 'f', photo: 'bld-f', alt: 'Портик физико-технологического корпуса на Мира, 21' },
  hti: { room: 'h', photo: 'bld-h', alt: 'Вход в корпус ХТИ и ИНМиТ на Мира, 28' },
  inmit: { room: 'mt', photo: 'bld-mt', alt: 'Корпус ХТИ и ИНМиТ на Мира, 28' },
  irit: { room: 'r', photo: 'bld-r', alt: 'Вход в корпус ИРИТ-РтФ на Мира, 32' },
  ineu: { room: 'i', photo: 'bld-i', alt: 'Колоннада корпуса И с вывеской факультета экономики и управления' },
  itoo: { room: 'guk', photo: 'guk-front', alt: 'Главный учебный корпус на Мира, 19' },
  ugi: { photo: 'urgu', alt: 'Здание на проспекте Ленина, 51' },
  ifksmp: { photo: 'bld-ifk', alt: 'Портик корпуса Института физической культуры' },
};
