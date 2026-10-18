# Промпты для картинок — редизайн УрФУ

## Как работать

1. Подойдёт любой генератор: GPT / ChatGPT, Midjourney, Nano Banana, Kandinsky, Шедеврум, Flux и т. д. Промпты на английском — их понимают все, русскоязычные тоже.
2. Копируй блок промпта **целиком**: стиль уже вшит внутрь, ничего добавлять не надо.
3. Ставь указанные пропорции (3:2, 16:9, 1:1, 2:3) и максимальное качество (от 2K по длинной стороне).
4. Делай 2–4 варианта и выбирай лучший. Смотри на **руки и лица**: лишние пальцы и «плывущие» глаза сразу в брак.
5. Если генератор умеет «референс стиля» (style reference, image prompt), после первой удачной картинки подавай её как референс для остальных. Так вся серия будет выглядеть как одна фотосъёмка.
6. Сохраняй с **именем** из таблицы и кидай в папку (лишнее в названии не мешает: «### hero-stairs.jpg — 32.png» тоже найдётся):
   `assets/incoming/` в папке проекта
   Можно и просто в чат. Обработку (ч/б, зерно, кадрирование, вырезание фона, сжатие в WebP/AVIF) сделаю сам.
7. Если генератор поддерживает **негативный промпт**, вставляй туда:
   `color, sepia, toned, text, letters, logo, watermark, border, frame, cartoon, illustration, 3d render, cgi, extra fingers, deformed hands, distorted face, blurry`

**Почему всё чёрно-белое.** Это фотомонтаж в духе 1920-х: цвет дают плоские плашки сайта (красный УрФУ, изумруд, жёлтый), а фото работают как вырезки из газеты. Плюс в ч/б не видно, что кадры из разных генераций, и меньше заметны артефакты AI.

**Чего не делаем:** реальные здания УрФУ, реальных людей и исторические кадры я беру из настоящих архивов (Wikimedia). AI-подделка истории на конкурсе вуза — плохая идея, жюри узнает свой корпус. Никаких звёзд, серпов, флагов и плакатной пропаганды: конструктивизм тут про композицию, а не про символы.

---

## Волна 1 — главная (нужна первой)

| Файл | Пропорции | Где на сайте | Статус |
|---|---|---|---|
| `hero-stairs.jpg` | 3:2 | первый экран | готово |
| `showcase-hall.jpg` | 16:9 | фон блока «Подбор по ЕГЭ» | готово |
| `life-sport.jpg` | 1:1 | плитки «Жизнь после пар» | готово |
| `life-stage.jpg` | 1:1 | плитки | готово |
| `life-dorm.jpg` | 1:1 | плитки | готово |
| `life-winter.jpg` | 1:1 | плитки | готово |
| `life-robotics.jpg` | 1:1 | плитки | готово |
| `cutout-applicant.png` | 2:3 | вырезанная фигура для блоков «Поступай» | готово |

### hero-stairs.jpg — 3:2

```
Low-angle black-and-white documentary photograph of three university students walking up wide stone stairs toward a monumental building with tall square columns. The camera is close to the steps, so the stairs cut a strong diagonal across the frame. One student turns back laughing, one carries a laptop under her arm, one is mid-stride. Clear winter afternoon light, long hard shadows. Very high contrast, deep blacks, bright highlights, natural 35mm film grain, crisp focus. Composition in the spirit of 1920s avant-garde photography with a bold diagonal and a dramatic angle, but contemporary people and clothes. No text, no letters, no logos, no watermark, no border. Aspect ratio 3:2.
```

### showcase-hall.jpg — 16:9

```
High-angle black-and-white documentary photograph looking down into a large university reading hall: long wooden tables in rows, about twenty students working with laptops, notebooks and printed papers, tall windows on the left throwing bright stripes of daylight across the tables. The upper third of the frame is calmer (ceiling, window light) and the lower part is busy with people and desks. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, strong geometric rhythm of tables and light, in the spirit of 1920s avant-garde photography, contemporary people. No text, no letters, no logos, no watermark, no border. Aspect ratio 16:9.
```

### life-sport.jpg — 1:1

```
Black-and-white action photograph of a student volleyball player frozen at the top of a jump, arm raised to spike the ball, shot from a very low angle against the high ceiling of a sports hall with bright overhead lights. Motion frozen, sweat and tension visible. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, dramatic diagonal composition in the spirit of 1920s avant-garde sports photography, contemporary sportswear without logos. No text, no letters, no logos, no watermark. Square 1:1.
```

### life-stage.jpg — 1:1

```
Black-and-white photograph of a student dance or theatre performance on a dark stage: one performer in a single hard spotlight mid-leap, others as silhouettes in the background, dust visible in the light beam. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, bold geometric composition in the spirit of 1920s avant-garde photography, contemporary costumes. No text, no letters, no logos, no watermark. Square 1:1.
```

### life-dorm.jpg — 1:1

```
Black-and-white candid documentary photograph of four students cooking together in a small shared dormitory kitchen at night, laughing, one stirring a pot, one cutting bread, steam rising, a window with city lights behind them. Warm, honest, unposed moment. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, slightly high camera angle, contemporary clothes. No text, no letters, no logos, no watermark. Square 1:1.
```

### life-winter.jpg — 1:1

```
Black-and-white photograph of students in winter coats and scarves walking quickly through heavy falling snow across a wide open square, seen from a high window so the figures and their footprints form diagonal lines in the white snow. Dusk, street lamps just turned on. Very high contrast, natural 35mm film grain, crisp focus, graphic composition in the spirit of 1920s avant-garde photography, contemporary clothes. No text, no letters, no logos, no watermark. Square 1:1.
```

### life-robotics.jpg — 1:1

```
Black-and-white documentary photograph of two students building a robot in a university workshop: one solders a circuit board under a desk lamp, the other holds a small robotic arm, cables and tools on the table, safety glasses. Shot close and slightly from below, hands and faces in focus. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, contemporary clothes. No text, no letters, no logos, no watermark. Square 1:1.
```

### cutout-applicant.png — 2:3, вырезанная фигура

```
Black-and-white photograph of a cheerful 17-year-old high-school graduate jumping with joy, arms raised, holding a smartphone in one hand, full body in frame with space around it, casual contemporary clothes and sneakers, isolated on a plain pure white seamless background, even soft light on the figure, no shadow on the background, clean sharp edges. High contrast, natural 35mm film grain. No text, no logos, no watermark. Aspect ratio 2:3.
```

Если генератор умеет **прозрачный фон** (у GPT это «transparent background»), включи его. Если нет — белый фон я уберу сам.

---

## Волна 2 — внутренние страницы

| Файл | Пропорции | Страница | Статус |
|---|---|---|---|
| `program-hv-lab.jpg` | 3:2 | программа «Электроэнергетика и электротехника» | готово |
| `program-panel-hands.jpg` | 1:1 | та же программа | готово |
| `program-powerlines.jpg` | 16:9 | та же программа | готово |
| `institute-turbine.jpg` | 16:9 | страница института (УралЭНИН) | готово |
| `science-laser.jpg` | 3:2 | «Наука» | готово |
| `science-microscope.jpg` | 1:1 | «Наука» | готово |
| `science-observatory.jpg` | 16:9 | «Наука» | готово |
| `news-datacenter.jpg` | 3:2 | новости | готово |
| `news-voice.jpg` | 3:2 | новости | готово |
| `news-donor.jpg` | 3:2 | новости | готово |
| `campus-new.jpg` | 16:9 | лонгрид о новом кампусе | готово |
| `campus-room.jpg` | 3:2 | лонгрид, общежития | готово |
| `campus-cafe.jpg` | 3:2 | лонгрид | готово |
| `library.jpg` | 3:2 | «Учиться» | готово |
| `international.jpg` | 3:2 | «Иностранным абитуриентам» | готово |
| `cutout-lost.png` | 2:3 | страница 404 | готово |
| `program-renewables.jpg` | 3:2 | программа, «Установки на ВИЭ» | готово |
| `program-drive.jpg` | 3:2 | программа, «Электропривод и автоматика» | готово |

### program-hv-lab.jpg — 3:2

```
Black-and-white documentary photograph of a university high-voltage laboratory: a student in safety glasses and a lab coat stands next to tall ribbed ceramic insulators and a large high-voltage generator, a small bright electric arc between two electrodes, the student's face lit by it. Shot from a low angle to show the scale of the equipment. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, in the spirit of 1920s avant-garde industrial photography, contemporary people. No text, no letters, no logos, no watermark. Aspect ratio 3:2.
```

### program-panel-hands.jpg — 1:1

```
Black-and-white close-up photograph of two hands wiring an electrical control cabinet: rows of circuit breakers, terminal blocks, neatly bundled cables, a screwdriver in one hand. Shallow depth of field, hard side light. Very high contrast, deep blacks, natural 35mm film grain, crisp focus on the fingertips. No text, no letters, no logos, no labels on equipment, no watermark. Square 1:1.
```

### program-powerlines.jpg — 16:9

```
Black-and-white photograph of tall steel high-voltage transmission towers marching across a snowy hilly landscape of low worn mountains covered with pine forest, shot from a very low angle at the foot of the nearest tower so the steel lattice forms dramatic diagonals against a pale winter sky. Very high contrast, natural 35mm film grain, crisp focus, constructivist geometric composition. No text, no letters, no logos, no watermark. Aspect ratio 16:9.
```

### institute-turbine.jpg — 16:9

```
Black-and-white photograph of a vast power-plant turbine hall: huge steam turbines in a row, steel catwalks, high windows letting in shafts of light, and one small human figure of a young engineer walking along the hall to show the enormous scale. Symmetrical deep perspective. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, in the spirit of 1920s avant-garde industrial photography. No text, no letters, no logos, no watermark. Aspect ratio 16:9.
```

### science-laser.jpg — 3:2

```
Black-and-white photograph of a young researcher in an optics laboratory adjusting a mirror on an optical table, thin bright laser beams crossing the dark room as straight white lines, faint haze making the beams visible. The beams form a sharp geometric pattern. Very high contrast, deep blacks, natural 35mm film grain, crisp focus. No text, no letters, no logos, no watermark. Aspect ratio 3:2.
```

### science-microscope.jpg — 1:1

```
Black-and-white photograph of a female scientist looking into a large modern electron microscope column, her face partly lit by a monitor, hands on the controls, dark laboratory around her. Shot from a slightly low angle. Very high contrast, deep blacks, natural 35mm film grain, crisp focus. No text on screens, no letters, no logos, no watermark. Square 1:1.
```

### science-observatory.jpg — 16:9

```
Black-and-white night photograph of a small white astronomical observatory dome with its slit open, standing in a clearing of a dense pine forest in the Ural mountains, a telescope barely visible inside, the sky full of stars with the Milky Way rising diagonally. Long exposure, sharp stars, deep blacks, natural film grain. No text, no letters, no logos, no watermark. Aspect ratio 16:9.
```

### news-datacenter.jpg — 3:2

```
Black-and-white photograph of a long narrow corridor between tall server racks in a data center, rows of tiny status lights forming dotted lines that converge in deep perspective, a single engineer with a laptop standing at the far end. Very high contrast, deep blacks, natural 35mm film grain, crisp focus, strong geometric perspective. No text, no letters, no logos, no watermark. Aspect ratio 3:2.
```

### news-voice.jpg — 3:2

```
Black-and-white candid photograph of a teenage girl in a university hallway speaking into her smartphone held close to her mouth, as if asking a voice assistant a question, curious expression, other students blurred in the background. Shallow depth of field, side window light. High contrast, natural 35mm film grain. No text on the screen, no letters, no logos, no watermark. Aspect ratio 3:2.
```

### news-donor.jpg — 3:2

```
Black-and-white documentary photograph of university students sitting in a row in a bright hall at a volunteer donor registration event, sleeves rolled up, one student smiling and showing a small cotton bandage on the inner elbow, volunteers in plain t-shirts helping. Honest, friendly mood. High contrast, natural 35mm film grain, crisp focus. No text, no letters, no logos, no medical brand names, no watermark. Aspect ratio 3:2.
```

### campus-new.jpg — 16:9

```
Black-and-white architectural photograph of a modern university campus at dusk: several new buildings of glass and pale concrete with large lit windows, wide pedestrian walkways, a few students crossing with backpacks, young trees, a light layer of snow. Strong diagonal perspective from a low angle. Very high contrast, natural 35mm film grain, crisp focus. No text, no signs, no letters, no logos, no watermark. Aspect ratio 16:9.
```

### campus-room.jpg — 3:2

```
Black-and-white photograph of a tidy modern two-person student dormitory room: two beds, two desks with laptops and lamps, a large window with snowy view, one student sitting cross-legged on the bed with headphones reading, posters without text on the wall. Natural window light. High contrast, natural 35mm film grain. No text, no letters, no logos, no watermark. Aspect ratio 3:2.
```

### campus-cafe.jpg — 3:2

```
Black-and-white candid photograph of a busy modern university canteen at lunch: long tables, students talking, trays with soup and bread, big windows, one student in the foreground laughing with a spoon in hand. Shot at table height. High contrast, natural 35mm film grain, crisp focus. No text, no menu boards with letters, no logos, no watermark. Aspect ratio 3:2.
```

### library.jpg — 3:2

```
Black-and-white photograph of a student climbing a tall wooden library ladder between floor-to-ceiling bookshelves, reaching for a book on the top shelf, shot from below so the shelves rise into deep perspective. Soft window light, dust in the air. Very high contrast, natural 35mm film grain, crisp focus, in the spirit of 1920s avant-garde photography. No readable text on book spines, no logos, no watermark. Aspect ratio 3:2.
```

### international.jpg — 3:2

```
Black-and-white candid photograph of six international university students of different ethnicities (East Asian, Central Asian, African, South Asian, Latin American, Slavic) sitting around one table in a student lounge, laughing at a story one of them tells, laptops and tea cups on the table. Natural light, honest unposed moment. High contrast, natural 35mm film grain, crisp focus. No text, no letters, no flags, no logos, no watermark. Aspect ratio 3:2.
```

### program-renewables.jpg — 3:2

```
Black-and-white photograph of two engineering students in winter jackets and hard hats inspecting a row of solar panels and a small wind turbine on a snowy field at the edge of a pine forest, one of them holding a tablet, shot from a low angle so the turbine blades cut a diagonal across a pale winter sky. Very high contrast, natural 35mm film grain, crisp focus, constructivist composition. No text, no letters, no logos, no watermark. Aspect ratio 3:2.
```

### program-drive.jpg — 3:2

```
Black-and-white documentary photograph of a student in safety glasses at an electric drive test bench in a university laboratory: a large industrial electric motor coupled to a load machine, a control cabinet with a frequency converter, thick cables, an oscilloscope screen glowing, the student adjusting a dial. Shot close from a slightly low angle, hard side light. Very high contrast, deep blacks, natural 35mm film grain, crisp focus. No readable text on screens or labels, no logos, no watermark. Aspect ratio 3:2.
```

### cutout-lost.png — 2:3, вырезанная фигура

```
Black-and-white photograph of a confused young student holding a large unfolded paper map upside down, scratching his head, full body in frame with space around it, backpack, contemporary casual clothes, isolated on a plain pure white seamless background, even soft light, no shadow on the background, clean sharp edges. High contrast, natural 35mm film grain. No text, no letters on the map, no logos, no watermark. Aspect ratio 2:3.
```

---

## Волна 3 — видео (по желанию)

Если генератор умеет видео (Kling, Veo, Sora, Seedance и т. п.), одна петля оживит главную. Без неё обойдусь медленным движением фото.

| Файл | Формат | Где | Статус |
|---|---|---|---|
| `loop-snow.mp4` | 16:9, 5–8 с, без звука | главная, блок «Жизнь» | готово: квадрат слева, справа генератор нарисовал штатив |

```
Slow-motion black-and-white video: heavy snow falling in front of tall square stone columns of a monumental building at dusk, a few students in winter coats walk past left to right, static camera on a tripod, no camera movement, soft street lamp light, natural film grain, high contrast. Seamless loop. No text, no logos. 16:9, 6 seconds.
```
