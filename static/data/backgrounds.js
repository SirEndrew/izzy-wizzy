// ══════════════════════════════════════════════════════════════
// BACKGROUNDS — предыстории D&D 5e
// Данные: dnd.su
//
// ИСТОЧНИКИ:
//   PH14   — Player's Handbook (2014)
//   AI     — Acquisitions Incorporated
//   BPGG   — Bigby Presents: Glory of the Giants
//   BGDA   — Baldur's Gate: Descent into Avernus
//   BMT    — The Book of Many Things
//   EGW    — Explorer's Guide to Wildemount
//   GGR    — Guildmasters' Guide to Ravnica
//   GOS    — Ghosts of Saltmarsh
//   HDQ    — Hoard of the Dragon Queen (адаптация)
//   MOT    — Mythic Odysseys of Theros
//   OTA    — Out of the Abyss (адаптация)
//   PAM    — Planescape: Adventures in the Multiverse
//   RLW    — Eberron: Rising from the Last War
//   SAS    — Spelljammer: Adventures in Space
//   SCC    — Strixhaven: A Curriculum of Chaos
//   SCAG   — Sword Coast Adventurer's Guide
//   SDQ    — Dragonlance: Shadow of the Dragon Queen
//   TOA    — Tomb of Annihilation
//   VRGR   — Van Richten's Guide to Ravenloft
//   WBW    — The Wild Beyond the Witchlight
//
// ПОЛЯ:
//   skills[]         — фиксированные навыки
//   skillChoices     — {count, from:[...]} выбор навыков из списка
//   tools[]          — фиксированные инструменты (точные названия из tools.js)
//   toolChoice       — {count, category|from|any} выбор инструментов
//   languages        — кол-во языков на свободный выбор
//   languagesConst[] — конкретный язык, который даёт предыстория (без выбора)
//   languagesChoice  — {count, from:[...]} выбор языка из конкретного списка
//   feature          — текст особенности предыстории
//   enName           — английское название
//   url              — ссылка на dnd.su
// ══════════════════════════════════════════════════════════════

window.BACKGROUNDS = [

{
  "id": "acolyte",
  "name": "Прислужник",
  "icon": "⛪",
  "source": "PH14",
  "skills": [
    "Проницательность",
    "Религия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 15,
  "traits": "Приют для верующих",
  "enName": "Acolyte",
  "url": "https://dnd.su/backgrounds/766-acolyte/",
  "feature": "Вы и ваши спутники можете рассчитывать на бесплатное лечение и уход в храмах, святынях и других подобных местах, посвящённых вашей вере. Вам придётся предоставить материальные компоненты для заклинаний, если таковые понадобятся. Те, кто разделяют вашу веру, могут обеспечить вам (но только вам) скромное существование. У вас также могут быть связи с каким-то конкретным храмом, посвящённым вашему божеству или пантеону, в котором у вас есть жилая комната. Пока вы находитесь с этим храмом в хороших отношениях, находясь неподалёку от него, вы можете попросить у его служителей помощи, если она не подвергнет их опасности.",
  equipment:
[
      { type: 'choice', label: "Священный символ (на выбор)", options: [
        [{ id: "book", qty: 1, note: "Молитвенник" }],
        [{ id: "prayer_wheel", qty: 1 }],
      ]},
      { type: 'choice', label: "Музыкальный инструмент (на выбор)", options: [
        [{ type: "gear_choice", filter: "Священный символ", label: "Священный символ (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "incense_stick", qty: 5 }, { id: "robe", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "charlatan",
  "name": "Шарлатан",
  "icon": "🎭",
  "source": "PH14",
  "skills": [
    "Ловкость рук",
    "Обман"
  ],
  "tools": [
    "Набор для грима",
    "Набор для фальсификации"
  ],
  "languages": 0,
  "gold": 15,
  "traits": "Поддельная личность",
  "enName": "Charlatan",
  "url": "https://dnd.su/backgrounds/769-charlatan/",
  "feature": "Вы создали себе вторую личность, включая необходимые документы, знакомства и маскировку, что позволяет вам перевоплощаться в этот образ. В дополнение к этому вы можете подделывать документы, включая официальные документы и личные письма, если ранее видели пример подобного документа или почерк, который пытаетесь скопировать.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }, { id: "kit_disguise", qty: 1 }, { id: "pouch", qty: 1 }] },
      { type: 'choice', label: "Приспособление для жульничества на выбор", options: [
        [{ id: "con_tool_bottles", qty: 1 }],
        [{ id: "con_tool_dice", qty: 1 }],
        [{ id: "con_tool_cards", qty: 1 }],
        [{ id: "con_tool_ring", qty: 1 }],
      ]},
    ]
},

{
  "id": "criminal",
  "name": "Преступник",
  "icon": "🗡️",
  "source": "PH14",
  "skills": [
    "Обман",
    "Скрытность"
  ],
  "tools": [
    "Воровские инструменты"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 0,
  "gold": 15,
  "traits": "Криминальные связи",
  "enName": "Criminal",
  "url": "https://dnd.su/backgrounds/765-criminal/",
  "feature": "У вас есть надёжное доверенное лицо, которое выступает в роли вашего связного в криминальных кругах. Вы умеете получать и отправлять сведения связному, даже через большие расстояния: например, вы знаете местных посыльных, продажных караванщиков и нечистых на руку матросов, которые могут доставить сообщение для вас.",
  equipment:
[
      { type: 'fixed', items: [{ id: "crowbar", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "entertainer",
  "name": "Артист",
  "icon": "🎪",
  "source": "PH14",
  "skills": [
    "Акробатика",
    "Выступление"
  ],
  "tools": [
    "Набор для грима"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 0,
  "gold": 15,
  "traits": "По многочисленным просьбам",
  "enName": "Entertainer",
  "url": "https://dnd.su/backgrounds/757-entertainer/",
  "feature": "Вы всегда можете найти место для выступления. Обычно это таверна или постоялый двор, но это может быть цирк, театр или даже двор знатного господина. В этом месте вы получаете бесплатный постой и еду по скромным или комфортным стандартам (в зависимости от качества заведения), если вы выступаете каждый вечер. Кроме того, ваши выступления делают вас местной знаменитостью. Когда посторонние узнают вас в городе, в котором вы давали представление, они, скорее всего, будут к вам относиться хорошо.",
  equipment:
[
      { type: 'choice', label: "Музыкальный инструмент (на выбор)", options: [
        [{ type: "tool_choice", filter: "musical", label: "Музыкальный инструмент (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "admirer_gift", qty: 1 }, { id: "clothes_costume", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "folk_hero",
  "name": "Народный герой",
  "icon": "🦸",
  "source": "PH14",
  "skills": [
    "Выживание",
    "Уход за животными"
  ],
  "tools": [
    "Транспортное средство (наземное)"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 0,
  "gold": 10,
  "traits": "Деревенское гостеприимство",
  "enName": "Folk hero",
  "url": "https://dnd.su/backgrounds/763-folk-hero/",
  "feature": "Вы сами из простого народа, и потому легко находите с ними общий язык. Вы можете найти место, чтобы спрятаться, отдохнуть или подлечиться среди обывателей, если только вы не угрожаете им. Они укроют вас от представителей закона и тех, кто ищет вас, но своими жизнями за вас они рисковать не будут.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "shovel", qty: 1 }, { id: "pot_iron", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "guild_artisan",
  "name": "Гильдейский ремесленник",
  "icon": "⚒️",
  "source": "PH14",
  "skills": [
    "Проницательность",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 1,
  "gold": 15,
  "traits": "Членство в гильдии",
  "enName": "Guild artisan",
  "url": "https://dnd.su/backgrounds/760-guild-artisan/",
  "feature": "Будучи авторитетным и уважаемым членом гильдии, вы можете пользоваться особыми преимуществами, предоставляемыми этим членством. Ваши товарищи по гильдии при необходимости предоставят вам жилище и питание, и даже оплатят ваши похороны. Для таких связей может потребоваться жертвование денег или магических предметов в казну гильдии. Каждый месяц вы должны выплачивать гильдии 5 зм. Если вы пропустите платёж, вы должны вначале оплатить все долги, и только тогда восстановите своё доброе имя в гильдии.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "guild_letter", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "hermit",
  "name": "Отшельник",
  "icon": "🧘",
  "source": "PH14",
  "skills": [
    "Медицина",
    "Религия"
  ],
  "tools": [
    "Набор травника"
  ],
  "languages": 1,
  "gold": 5,
  "traits": "Откровение",
  "enName": "Hermit",
  "url": "https://dnd.su/backgrounds/764-hermit/",
  "feature": "Тихое уединение в долгом отшельничестве дало вам доступ к великому откровению. Точная природа этого откровения зависит от характера вашего уединения. Это может быть истина о вселенной, божествах, влиятельных созданиях на внешних планах, или силах природы. Это может быть место, которое никто и никогда не видел. Придумайте вместе с Мастером детали вашего откровения и его влияние на кампанию.",
  equipment:
[
      { type: 'fixed', items: [{ id: "scroll_case_prayers", qty: 1 }, { id: "warm_blanket", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "kit_herbalism", qty: 1 }] },
    ]
},

{
  "id": "noble",
  "name": "Благородный",
  "icon": "👑",
  "source": "PH14",
  "skills": [
    "История",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 1,
  "gold": 25,
  "traits": "Привилегированность",
  "enName": "Noble",
  "url": "https://dnd.su/backgrounds/759-noble/",
  "feature": "Благодаря знатному происхождению, другие хорошо к вам относятся. Вас принимают в высшем обществе, и считается, что у вас есть право посещать любые места. Обыватели изо всех сил стараются сделать вам приятно и избежать вашего гнева, а другие высокородные считают вас своей ровней. Если нужно, вы можете получить аудиенцию местного дворянина.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }, { id: "signet_ring", qty: 1 }, { id: "genealogy_scroll", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "outlander",
  "name": "Чужеземец",
  "icon": "🗺️",
  "source": "PH14",
  "skills": [
    "Атлетика",
    "Выживание"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 1,
  "gold": 10,
  "traits": "Странник",
  "enName": "Outlander",
  "url": "https://dnd.su/backgrounds/768-outlander/",
  "feature": "Вы отлично запоминаете карты и местность, и всегда можете вспомнить общие характеристики местности, поселения, и прочие особенности в окрестностях. Кроме того, вы каждый день можете находить еду и пресную воду для себя и пяти других товарищей, при условии, что вокруг вас можно найти ягоды, дичь, воду и так далее.",
  equipment:
[
      { type: 'fixed', items: [{ id: "quarterstaff", qty: 1 }, { id: "trap_hunting", qty: 1 }, { id: "animal_trophy", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "pirate",
  "name": "Пират",
  "icon": "🏴‍☠️",
  "source": "PH14",
  "skills": [
    "Атлетика",
    "Восприятие"
  ],
  "tools": [
    "Инструменты навигатора",
    "Транспортное средство (водное)"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Дурная репутация",
  "enName": "Pirate",
  "url": "https://dnd.su/backgrounds/770-pirate/",
  "feature": "Где бы вы ни оказались, вас боятся из-за вашей репутации. Находясь в цивилизованном поселении, вы можете безнаказанно совершать небольшие преступления, такие как отказ платить за еду в таверне или выламывание двери в магазине, так как жители боятся сообщать о вас властям.",
  equipment:
[
      { type: 'fixed', items: [{ id: "club", qty: 1, note: "Кофель-нагель" }, { id: "rope_silk_50ft", qty: 1 }, { id: "talisman", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "sage",
  "name": "Мудрец",
  "icon": "📚",
  "source": "PH14",
  "skills": [
    "История",
    "Магия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Исследователь",
  "enName": "Sage",
  "url": "https://dnd.su/backgrounds/762-sage/",
  "feature": "Если вы пытаетесь изучить или вспомнить информацию, которой вы не обладаете, вы часто знаете, где и от кого её можно получить. Обычно это библиотека, скрипторий, университет, мудрец или другое образованное существо. Мастер может решить, что искомое знание является тайной и хранится в практически недоступном месте, или что оно вообще недоступно.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "quill", qty: 1 }, { id: "small_knife", qty: 1 }, { id: "letter_dead_colleague", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "sailor",
  "name": "Моряк",
  "icon": "⚓",
  "source": "PH14",
  "skills": [
    "Атлетика",
    "Восприятие"
  ],
  "tools": [
    "Инструменты навигатора",
    "Транспортное средство (водное)"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Поездка на корабле",
  "enName": "Sailor",
  "url": "https://dnd.su/backgrounds/761-sailor/",
  "feature": "Если понадобится, вы можете получить бесплатную поездку на паруснике для себя и своих спутников. Это может быть ваш старый корабль, или другой корабль, с которым вы находитесь в хороших отношениях (возможно, им командует ваш бывший напарник). В обмен на бесплатную поездку от вас и ваших спутников ожидают посильную помощь экипажу во время плавания.",
  equipment:
[
      { type: 'fixed', items: [{ id: "club", qty: 1, note: "Кофель-нагель" }, { id: "rope_silk_50ft", qty: 1 }, { id: "talisman", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "soldier",
  "name": "Солдат",
  "icon": "⚔️",
  "source": "PH14",
  "skills": [
    "Атлетика",
    "Запугивание"
  ],
  "tools": [
    "Транспортное средство (наземное)"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 0,
  "gold": 10,
  "traits": "Воинское звание",
  "enName": "Soldier",
  "url": "https://dnd.su/backgrounds/767-soldier/",
  "feature": "Будучи солдатом, вы заслужили звание. Солдаты, верные военной организации, которой вы раньше принадлежали, всё еще признают вашу власть и влияние, и они подчиняются вам, если их звание ниже вашего. С помощью своего звания вы можете оказывать влияние на других солдат и брать во временное пользование простое снаряжение или лошадей.",
  equipment:
[
      { type: 'fixed', items: [{ id: "honorary_badge", qty: 1 }, { id: "enemy_trophy", qty: 1 }] },
      { type: 'choice', label: "Игровые кости или карты", options: [
        [{ id: "game_cards", qty: 1 }],
        [{ id: "game_dice", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "urchin",
  "name": "Беспризорник",
  "icon": "🏚️",
  "source": "PH14",
  "skills": [
    "Ловкость рук",
    "Скрытность"
  ],
  "tools": [
    "Воровские инструменты",
    "Набор для грима"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Городские тайны",
  "enName": "Urchin",
  "url": "https://dnd.su/backgrounds/758-urchin/",
  "feature": "Вы знаете тайные лазы и проходы городских улиц, позволяющие пройти там, где другие не увидят пути. Вне боя вы (и ведомые вами союзники) можете перемещаться по городу вдвое быстрее обычного.",
  equipment:
[
      { type: 'fixed', items: [{ id: "small_knife", qty: 1 }, { id: "city_map", qty: 1 }, { id: "pet_mouse", qty: 1 }, { id: "parents_trinket", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "gambler",
  "name": "Азартный игрок",
  "icon": "🎲",
  "source": "AI",
  "skills": [
    "Обман",
    "Проницательность"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 1,
  "gold": 15,
  "traits": "Не говори мне о шансах",
  "enName": "Gambler",
  "url": "https://dnd.su/backgrounds/811-gambler/",
  "feature": "Шансы и вероятность — ваш хлеб с маслом. Во время простоев, связанных с азартными играми или подсчётом шансов на лучший план, вы можете получить чёткое представление о том, какой выбор, вероятно, является лучшим, а какие возможности кажутся слишком хорошими, чтобы быть правдой, по решению Мастера.",
  equipment:
[
      { type: 'choice', label: "Игровой набор (на выбор)", options: [
        [{ type: "tool_choice", filter: "gaming", label: "Игровой набор (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "talisman", qty: 1 }, { id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "plaintiff",
  "name": "Истец",
  "icon": "⚖️",
  "source": "AI",
  "skills": [
    "Медицина",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 1,
  "gold": 20,
  "traits": "Юридическая подкованность",
  "enName": "Plaintiff",
  "url": "https://dnd.su/backgrounds/812-plaintiff/",
  "feature": "Ваш опыт работы с местной правовой системой дал вам твёрдое знание всех тонкостей этой системы. Даже когда закон не на вашей стороне, вы можете использовать сложные юридические термины, чтобы напугать людей, заставив их думать, что вы знаете, о чём говорите. Простых людей, которые ничего не знают, вы можете запугать или обмануть, чтобы получить услуги или особое отношение.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }] },
    ]
},

{
  "id": "failed_merchant",
  "name": "Неудавшийся торговец",
  "icon": "💸",
  "source": "AI",
  "skills": [
    "Расследование",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 1,
  "gold": 10,
  "traits": "Цепочка поставок",
  "enName": "Failed Merchant",
  "url": "https://dnd.su/backgrounds/810-failed-merchant/",
  "feature": "Со времени работы продавцом вы поддерживаете связи с оптовиками, поставщиками и другими торговцами и предпринимателями. Вы можете обращаться к этим связям при поиске предметов или информации.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "scale_merchant", qty: 1 }, { id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "celebrity_adventurers_scion",
  "name": "Потомок знаменитого авантюриста",
  "icon": "⭐",
  "source": "AI",
  "skills": [
    "Восприятие",
    "Выступление"
  ],
  "tools": [
    "Набор для грима"
  ],
  "languages": 2,
  "gold": 30,
  "traits": "Известное имя",
  "enName": "Celebrity Adventurer",
  "url": "https://dnd.su/backgrounds/809-celebrity-adventurers-scion/",
  "feature": "Вы знаете и встречали множество влиятельных людей по всей стране, и некоторые из них, возможно, даже помнят вас. Вы можете получить небольшую помощь от крупной фигуры в кампании, на усмотрение Мастера. Кроме того, простые люди относятся к вам с почтением, а ваше наследие и истории, которые вы рассказываете, могут сгодиться для бесплатного обеда или ночлега.",
  equipment:
[
      { type: 'fixed', items: [{ id: "kit_disguise", qty: 1 }, { id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "rival_intern",
  "name": "Стажёр конкурента",
  "icon": "📋",
  "source": "AI",
  "skills": [
    "История",
    "Расследование"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 1,
  "gold": 10,
  "traits": "Информатор",
  "enName": "Rival Intern",
  "url": "https://dnd.su/backgrounds/813-rival-intern/",
  "feature": "У вас есть связи с вашим предыдущим работодателем или другими группами, с которыми вы имели дело во время вашей предыдущей работы. Вы можете связаться со своими контактами для получения информации по усмотрению Мастера.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "ledger_employer", qty: 1 }, { id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "giant_foundling",
  "name": "Великаний подкидыш",
  "icon": "🏔️",
  "source": "BPGG",
  "skills": [
    "Выживание",
    "Запугивание"
  ],
  "tools": [],
  "languages": 1,
  "languagesConst": [
    "Великаний"
  ],
  "gold": 10,
  "traits": "Удар великанов",
  "enName": "Giant foundling",
  "url": "https://dnd.su/backgrounds/820-giant-foundling/",
  "feature": "Вы получаете черту «Удар великанов».",
  equipment:
[
      { type: 'fixed', items: [{ id: "backpack", qty: 1 }, { id: "clothes_travelers", qty: 1 }] },
      { type: 'choice', label: "Маленький камень или ветка, напоминающие вам о доме", options: [
        [{ id: "stone_branch_home", qty: 1 }],
        [{ id: "branch_home", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "rune_carver",
  "name": "Резчик рун",
  "icon": "🌀",
  "source": "BPGG",
  "skills": [
    "Восприятие",
    "История"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 0,
  "languagesConst": [
    "Великаний"
  ],
  "gold": 10,
  "traits": "Ваятель рун",
  "enName": "Rune carver",
  "url": "https://dnd.su/backgrounds/822-rune-carver/",
  "feature": "Вы получаете черту «Ваятель рун».",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "small_knife", qty: 1 }, { id: "whetstone", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "rewarded",
  "name": "Награждённый",
  "icon": "🎖️",
  "source": "BMT",
  "skills": [
    "Проницательность",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 1,
  "gold": 18,
  "traits": "Улыбка фортуны",
  "enName": "Rewarded",
  "url": "https://dnd.su/backgrounds/858-rewarded/",
  "feature": "Ваша неожиданная удача отражается в незначительном благе. Вы получаете черту Везунчик, Посвящённый в магию или Одарённый (на ваш выбор).",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "ink_pen", qty: 1 }, { id: "paper_sheet", qty: 5 }] },
      { type: 'choice', label: "Игровой набор (на выбор)", options: [
        [{ type: "tool_choice", filter: "gaming", label: "Игровой набор (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "signet_ring", qty: 1 }, { id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "ruined",
  "name": "Разорённый",
  "icon": "💔",
  "source": "BMT",
  "skills": [
    "Выживание",
    "Скрытность"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 1,
  "gold": 13,
  "traits": "Я обязательно выживу",
  "enName": "Ruined",
  "url": "https://dnd.su/backgrounds/859-ruined/",
  "feature": "Вы пережили разрушительное несчастье и обладаете скрытыми резервами, которых другие не ожидают. Вы получаете черту Бдительный, Одарённый или Крепкий (на ваш выбор).",
  equipment:
[
      { type: 'fixed', items: [{ id: "cracked_hourglass", qty: 1 }, { id: "rusty_shackles", qty: 1 }, { id: "half_empty_bottle", qty: 1 }, { id: "trap_hunting", qty: 1 }] },
      { type: 'choice', label: "Игровой набор (на выбор)", options: [
        [{ type: "tool_choice", filter: "gaming", label: "Игровой набор (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "house_agent",
  "name": "Агент Дома",
  "icon": "🏠",
  "source": "RLW",
  "skills": [
    "Расследование",
    "Убеждение"
  ],
  "tools": [
    "Два инструмента из таблицы владений Дома"
  ],
  "languages": 0,
  "gold": 20,
  "traits": "Связь с домом",
  "enName": "House Agent",
  "url": "https://dnd.su/backgrounds/788-house-agent/",
  "feature": "Как агент Дома, вы всегда можете получить еду и жилье для себя и своих товарищей на территории Дома. Когда Дом назначает вам миссию, он обычно обеспечивает вас всеми необходимыми припасами и транспортом. Помимо этого, у вас есть много старых друзей, наставников и соперников в вашем доме, и вы можете столкнуться с одним из них, когда вы взаимодействуете с делами Дома.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }, { id: "signet_ring", qty: 1, note: "Перстень дома с печаткой" }, { id: "id_document", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "volstrucker_agent",
  "name": "Агент-Волстракер",
  "icon": "🕶️",
  "source": "EGW",
  "skills": [
    "Обман",
    "Скрытность"
  ],
  "tools": [
    "Инструменты отравителя"
  ],
  "languages": 1,
  "gold": 10,
  "traits": "Теневая сеть",
  "enName": "Volstrucker Agent",
  "url": "https://dnd.su/backgrounds/816-volstrucker-agent/",
  "feature": "У вас есть доступ к теневой сети Волстракеров, которая позволяет вам общаться с другими членами ордена на больших расстояниях. Если вы напишете письмо особыми тайными чернилами и бросите его в огонь, оно сгорит дотла и снова материализуется целым на агенте, которому вы его адресовали.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_common", qty: 1 }, { id: "black_hooded_cloak", qty: 1 }, { id: "tools_poisoner", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "grinner",
  "name": "Ухмылка",
  "icon": "😏",
  "source": "EGW",
  "skills": [
    "Обман",
    "Выступление"
  ],
  "tools": [
    "Воровские инструменты"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 0,
  "gold": 15,
  "traits": "Баллада об ухмыляющемся дураке",
  "enName": "Grinner",
  "url": "https://dnd.su/backgrounds/817-grinner/",
  "feature": "Как и любая Ухмылка, вы знаете, как найти убежище. В любом городе с населением 10 000 человек и более на Побережье Менажери или на землях Двендалийской Империи можно сыграть «Балладу об ухмыляющемся дураке» в крупной таверне или постоялом дворе. Член Золотых Ухмылок найдёт вас и приютит вас и любых спутников, за которых вы поручитесь.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }, { id: "kit_disguise", qty: 1 }] },
      { type: 'choice', label: "Музыкальный инструмент (на выбор)", options: [
        [{ type: "tool_choice", filter: "musical", label: "Музыкальный инструмент (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "smiley_ring", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "adaptaciia_predystorii_egw",
  "name": "Адаптация предысторий EGW",
  "icon": "📄",
  "source": "EGW",
  "skills": [],
  "tools": [],
  "languages": 0,
  "gold": 0,
  "traits": "",
  "enName": "",
  "url": "https://dnd.su/backgrounds/848-adaptaciia-predystorii-egw/",
  "feature": "",
  equipment:
[
    ]
},

{
  "id": "azorius_functionary",
  "name": "Функционер Азориусов",
  "icon": "📜",
  "source": "GGR",
  "skills": [
    "Проницательность",
    "Запугивание"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Представитель закона",
  "enName": "Azorius Functionary",
  "url": "https://dnd.su/backgrounds/799-azorius-functionary/",
  "feature": "Вы имеете право следить за исполнением законов Равники, и ваш статус вызывает у людей определённое уважение и даже страх. Окружающие ведут себя вежливо в вашем присутствии и стараются не привлекать вашего внимания; они считают, что у вас есть право ходить, где вы пожелаете.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_azorius", qty: 1 }, { id: "law_scroll", qty: 1 }, { id: "ink_bottle", qty: 1, note: "Флакон синих чернил" }, { id: "quill", qty: 1 }, { id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "boros_legionnaire",
  "name": "Легионер Боросов",
  "icon": "💂",
  "source": "GGR",
  "skills": [
    "Атлетика",
    "Запугивание"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 0,
  "languagesChoice": {
    "count": 1,
    "from": [
      "Небесный",
      "Драконий",
      "Гоблинский",
      "Язык минотавров"
    ]
  },
  "gold": 2,
  "traits": "Пункт легиона",
  "enName": "Boros Legionnaire",
  "url": "https://dnd.su/backgrounds/800-boros-legionnaire/",
  "feature": "Вы занимаете прочное место в иерархии Легиона Боросов. Вы можете реквизировать простое снаряжение для временного использования и получить доступ к любому гарнизону Боросов в Равнике, где вы сможете отдохнуть в безопасности и получить внимание медиков.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_boros", qty: 1 }, { id: "angel_feather", qty: 1 }, { id: "boros_banner_piece", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "dimir_operative",
  "name": "Оперативник Димиров",
  "icon": "🕵️",
  "source": "GGR",
  "skills": [
    "Обман",
    "Скрытность"
  ],
  "tools": [
    "Набор для грима"
  ],
  "languages": 1,
  "gold": 0,
  "traits": "Поддельная личность",
  "enName": "Dimir Operative",
  "url": "https://dnd.su/backgrounds/801-dimir-operative/",
  "feature": "У вас больше одной личности. Та, которую вы носите большую часть времени, делает вас похожим на члена гильдии, отличной от Дома Димир. У вас есть документы, установленные знакомства и маскировка, которые позволяют вам принять этот образ и вписаться во вторичную гильдию.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_dimir", qty: 1 }, { id: "small_knife", qty: 3 }, { id: "clothes_common", qty: 1 }] },
    ]
},

{
  "id": "golgari_agent",
  "name": "Агент Голгари",
  "icon": "🕷️",
  "source": "GGR",
  "skills": [
    "Выживание",
    "Природа"
  ],
  "tools": [
    "Инструменты отравителя"
  ],
  "languages": 0,
  "languagesChoice": {
    "count": 1,
    "from": [
      "Великаний",
      "Эльфийский",
      "Язык краулов"
    ]
  },
  "gold": 10,
  "traits": "Подземные ходы",
  "enName": "Golgari Agent",
  "url": "https://dnd.su/backgrounds/802-golgari-agent/",
  "feature": "Вы знаете скрытые подземные пути, которые можно использовать, чтобы обойти толпы, препятствия и наблюдателей, когда вы двигаетесь по городу. Когда вы не участвуете в бою, вы и ваши спутники можете перемещаться между любыми двумя местами в городе в два раза быстрее, чем обычно позволяет ваша скорость.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_golgari", qty: 1 }, { id: "tools_poisoner", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
      { type: 'choice', label: "Питомец жук или паук", options: [
        [{ id: "pet_spider", qty: 1 }],
        [{ id: "pet_beetle", qty: 1 }],
      ]},
    ]
},

{
  "id": "gruul_anarch",
  "name": "Анарх Груулов",
  "icon": "🔥",
  "source": "GGR",
  "skills": [
    "Атлетика",
    "Уход за животными"
  ],
  "tools": [
    "Набор травника"
  ],
  "languages": 0,
  "languagesChoice": {
    "count": 1,
    "from": [
      "Великаний",
      "Гоблинский",
      "Драконий",
      "Сильван"
    ]
  },
  "gold": 10,
  "traits": "Убежище среди руин",
  "enName": "Gruul Anarch",
  "url": "https://dnd.su/backgrounds/803-gruul-anarch/",
  "feature": "Вы хорошо знакомы с районами города, которых избегает большинство людей: разрушенные районы, где свирепствуют черви, заросшие парки, за которыми никто не ухаживал десятилетиями. Вы можете найти подходящее место для вас и ваших союзников, чтобы спрятаться или отдохнуть в этих областях.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_gruul", qty: 1 }, { id: "trap_hunting", qty: 1 }, { id: "kit_herbalism", qty: 1 }, { id: "boar_skull", qty: 1 }, { id: "animal_hide", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "izzet_engineer",
  "name": "Инженер Иззетов",
  "icon": "⚡",
  "source": "GGR",
  "skills": [
    "Магия",
    "Расследование"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 0,
  "languagesChoice": {
    "count": 1,
    "from": [
      "Ведалкен",
      "Гоблинский",
      "Драконий"
    ]
  },
  "gold": 5,
  "traits": "Городская инфраструктура",
  "enName": "Izzet Engineer",
  "url": "https://dnd.su/backgrounds/804-izzet-engineer/",
  "feature": "У вас есть базовые знания о структуре зданий, в том числе о том, что находится за стенами. Вы также можете найти чертежи конкретного здания, чтобы узнать подробности его строительства. Такие чертежи могут предоставить информацию о точках входа, структурных недостатках или секретных местах.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_izzet", qty: 1 }] },
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "burnt_experiment", qty: 1 }, { id: "hammer", qty: 1 }, { id: "block_and_tackle", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "orzhov_representative",
  "name": "Представитель Орзовов",
  "icon": "💍",
  "source": "GGR",
  "skills": [
    "Запугивание",
    "Религия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 0,
  "traits": "Рычаги давления",
  "enName": "Orzhov Representative",
  "url": "https://dnd.su/backgrounds/805-orzhov-representative/",
  "feature": "Вы можете оказывать влияние на одного или нескольких человек ниже вас в иерархии гильдии и требовать их помощи, если это необходимо. Например, вы можете передать сообщение по району, заказать короткую поездку в карете без оплаты или попросить других убрать кровавый беспорядок, который вы оставили в переулке.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_orzhov", qty: 1 }, { id: "gold_coin_chain", qty: 1 }, { id: "robe", qty: 1 }, { id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "rakdos_cultist",
  "name": "Культист Ракдосов",
  "icon": "🎠",
  "source": "GGR",
  "skills": [
    "Акробатика",
    "Выступление"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 0,
  "languagesChoice": {
    "count": 1,
    "from": [
      "Язык бездны",
      "Великаний"
    ]
  },
  "gold": 10,
  "traits": "Устрашающая репутация",
  "enName": "Rakdos Cultist",
  "url": "https://dnd.su/backgrounds/806-rakdos-cultist/",
  "feature": "Люди узнают в вас члена Культа Ракдоса и стараются не вызывать у вас гнева или насмешек. Вы можете избежать наказания за незначительные уголовные правонарушения, такие как отказ платить за еду в ресторане или выбивание двери в местном магазине, если никакие правоохранительные органы не станут свидетелями преступления.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_rakdos", qty: 1 }] },
      { type: 'choice', label: "Музыкальный инструмент (на выбор)", options: [
        [{ type: "tool_choice", filter: "musical", label: "Музыкальный инструмент (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_costume", qty: 1 }, { id: "lantern_hooded", qty: 1 }, { id: "chain_10ft", qty: 1, note: "Цепь с шипами" }, { id: "tinderbox", qty: 1 }, { id: "torch", qty: 10 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "selesnya_initiate",
  "name": "Посвящённый Селезнии",
  "icon": "🌿",
  "source": "GGR",
  "skills": [
    "Природа",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 0,
  "languagesChoice": {
    "count": 1,
    "from": [
      "Сильван",
      "Эльфийский",
      "Локсодон"
    ]
  },
  "gold": 5,
  "traits": "Убежище конклава",
  "enName": "Selesnya Initiate",
  "url": "https://dnd.su/backgrounds/807-selesnya-initiate/",
  "feature": "Как член Конклава Селезнии, вы можете рассчитывать на то, что ваши товарищи по гильдии предоставят убежище и помощь. Вы и ваши компаньоны можете найти место, чтобы спрятаться или отдохнуть в любом анклаве Селезнии в городе, если вы не представляете для них опасности.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_selesnya", qty: 1 }, { id: "kit_healer", qty: 1 }, { id: "vestment", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "simic_scientist",
  "name": "Учёный Симиков",
  "icon": "🧬",
  "source": "GGR",
  "skills": [
    "Магия",
    "Медицина"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Исследователь",
  "enName": "Simic Scientist",
  "url": "https://dnd.su/backgrounds/808-simic-scientist/",
  "feature": "Когда вы пытаетесь узнать или вспомнить магический или научный факт, если вы не знаете эту информацию, вы знаете, где и от кого её можно получить. Обычно эта информация исходит из лаборатории Симиков, а иногда из учреждения Иззетов, библиотеки, университета или от независимого учёного.",
  equipment:
[
      { type: 'fixed', items: [{ id: "insignia_simic", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "research_book", qty: 1 }, { id: "ink_quill", qty: 1 }, { id: "ink_bottle", qty: 1, note: "Бутылочка с чернилами осьминога" }, { id: "flask_oil", qty: 1 }, { id: "flask_acid", qty: 1 }, { id: "vial_fish_scales", qty: 1 }, { id: "vial_seaweed", qty: 1 }, { id: "bottle_mystery_slime", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "fisher",
  "name": "Рыбак",
  "icon": "🎣",
  "source": "GOS",
  "skills": [
    "История",
    "Выживание"
  ],
  "tools": [],
  "languages": 1,
  "gold": 10,
  "traits": "Богатый улов",
  "enName": "Fisher",
  "url": "https://dnd.su/backgrounds/783-fisher/",
  "feature": "Вы используете комплект для рыбалки с преимуществом. Если у вас есть доступ к водоёму, в котором обитает морская живность, вы можете поддерживать умеренный образ жизни, работая рыбаком, и каждый день вы можете ловить достаточное количество пищи, чтобы прокормить себя и до десяти других существ.",
  equipment:
[
      { type: 'fixed', items: [{ id: "kit_fishing_tackle", qty: 1 }, { id: "net", qty: 1 }] },
      { type: 'choice', label: "Любимая рыболовная приманка или болотные сапоги", options: [
        [{ id: "fishing_lure", qty: 1 }],
        [{ id: "oiled_leather_boots", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "marine",
  "name": "Морской пехотинец",
  "icon": "🌊",
  "source": "GOS",
  "skills": [
    "Атлетика",
    "Выживание"
  ],
  "tools": [
    "Транспортное средство (водное)",
    "Транспортное средство (наземное)"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Выносливый",
  "enName": "Marine",
  "url": "https://dnd.su/backgrounds/786-marine/",
  "feature": "Каждый день вы можете проходить в два раза больше обычного времени (до 16 часов), прежде чем на вас подействуют эффекты форсированного марша. Кроме того, если существует маршрут, позволяющий безопасно привести лодку к берегу, вы автоматически его находите.",
  equipment:
[
      { type: 'fixed', items: [{ id: "dagger", qty: 1, note: "Принадлежавший павшему товарищу кинжал" }, { id: "flag_folded", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "shipwright",
  "name": "Корабел",
  "icon": "🚢",
  "source": "GOS",
  "skills": [
    "История",
    "Восприятие"
  ],
  "tools": [
    "Инструменты плотника",
    "Транспортное средство (водное)"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Я залатаю!",
  "enName": "Shipwright",
  "url": "https://dnd.su/backgrounds/785-shipwright/",
  "feature": "Если у вас есть инструменты плотника и древесина, вы можете совершить ремонт водного транспорта. Когда вы используете это умение, вы восстанавливаете количество хитов корпуса водного транспорта, равное 5 × ваш бонус мастерства.",
  equipment:
[
      { type: 'fixed', items: [{ id: "book", qty: 1, note: "Пустая книга" }, { id: "tools_carpenter", qty: 1, note: "Любимый набор инструментов плотника" }, { id: "ink_bottle", qty: 1 }, { id: "ink_pen", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "smuggler",
  "name": "Контрабандист",
  "icon": "📦",
  "source": "GOS",
  "skills": [
    "Атлетика",
    "Обман"
  ],
  "tools": [
    "Транспортное средство (водное)"
  ],
  "languages": 0,
  "gold": 15,
  "traits": "Залечь на дно",
  "enName": "Smuggler",
  "url": "https://dnd.su/backgrounds/784-smuggler/",
  "feature": "Вы знакомы с сетью контрабандистов, готовых помочь вам выйти из трудной ситуации. Находясь в определённом поселении, городе или другом аналогичном по размеру сообществе, вы и ваши спутники можете бесплатно оставаться в убежищах. Находясь в убежище, вы можете сохранить факт своего нахождения в тайне.",
  equipment:
[
      { type: 'choice', label: "Модный кожаный жилет или пара кожаных ботинок", options: [
        [{ id: "fancy_leather_vest", qty: 1 }],
        [{ id: "leather_boots", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "adaptaciia_predystorii_hdq",
  "name": "Адаптация предысторий HDQ",
  "icon": "📄",
  "source": "HDQ",
  "skills": [],
  "tools": [],
  "languages": 0,
  "gold": 0,
  "traits": "",
  "enName": "",
  "url": "https://dnd.su/backgrounds/847-adaptaciia-predystorii-hdq/",
  "feature": "",
  equipment:
[
    ]
},

{
  "id": "athlete",
  "name": "Атлет",
  "icon": "🏅",
  "source": "MOT",
  "skills": [
    "Атлетика",
    "Акробатика"
  ],
  "tools": [
    "Транспортное средство (наземное)"
  ],
  "languages": 1,
  "gold": 10,
  "traits": "Отголоски победы",
  "enName": "Athlete",
  "url": "https://dnd.su/backgrounds/787-athlete/",
  "feature": "Вы вызвали восхищение зрителей, коллег-спортсменов и тренеров в регионе, где проходили ваши прошлые спортивные победы. При посещении любого поселения в пределах 100 миль от того места, где вы выросли, есть 50-процентная вероятность, что вы найдете там кого-нибудь, кто восхищается вами и готов предоставить информацию или временное убежище.",
  equipment:
[
      { type: 'choice', label: "Бронзовый диск или кожаный мяч", options: [
        [{ id: "bronze_disc", qty: 1 }],
        [{ id: "leather_ball", qty: 1 }],
      ]},
      { type: 'choice', label: "Талисман на удачу или трофей из прошлого", options: [
        [{ id: "lucky_talisman", qty: 1 }],
        [{ id: "past_trophy", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "adaptaciia_predystorii_ota",
  "name": "Адаптация предысторий OTA",
  "icon": "📄",
  "source": "OTA",
  "skills": [],
  "tools": [],
  "languages": 0,
  "gold": 0,
  "traits": "",
  "enName": "",
  "url": "https://dnd.su/backgrounds/846-adaptaciia-predystorii-ota/",
  "feature": "",
  equipment:
[
    ]
},

{
  "id": "planar_philosopher",
  "name": "Планарный философ",
  "icon": "🌌",
  "source": "PAM",
  "skills": [
    "Магия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Утверждение",
  "enName": "Planar philosopher",
  "url": "https://dnd.su/backgrounds/821-planar-philosopher/",
  "feature": "Вы получаете черту «Наследник Внешних Планов». Кроме того, члены организации предоставляют вам бесплатное скромное жильё и еду в любом своём владении или домах других членов фракции.",
  equipment:
[
      { type: 'fixed', items: [{ id: "portal_key", qty: 1 }, { id: "faction_manifesto", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "gate_warden",
  "name": "Хранитель врат",
  "icon": "🚪",
  "source": "PAM",
  "skills": [
    "Выживание",
    "Убеждение"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Планарное влияние",
  "enName": "Gate warden",
  "url": "https://dnd.su/backgrounds/823-gate-warden/",
  "feature": "Жизнь в городе-вратах или подобном месте приобщила вас к планарной энергии. Вы получаете черту «Наследник Внешних Планов». Кроме того, вы знаете, где можно найти бесплатное скромное жилье и еду в той общине, в которой вы выросли.",
  equipment:
[
      { type: 'fixed', items: [{ id: "key_bundle", qty: 1 }, { id: "book", qty: 1, note: "Пустая книга" }] },
      { type: 'choice', label: "Чернильная ручка или чернильное перо", options: [
        [{ id: "ink_pen", qty: 1 }],
        [{ id: "calligraphers_pen", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "astral_drifter",
  "name": "Астральный бродяга",
  "icon": "✨",
  "source": "SAS",
  "skills": [
    "Проницательность",
    "Религия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Божественный контакт",
  "enName": "Astral Drifter",
  "url": "https://dnd.su/multiverse/backgrounds/815-astral-drifter/",
  "feature": "Вы получаете черту «Посвящённый в магию» из «Книги Игрока» и должны выбрать жреца для этой черты. В Астральном море вы пересеклись со странствующим божеством. Встреча была короткой и ненасильственной, но произвела на вас неизгладимое впечатление.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }, { id: "diary", qty: 1 }, { id: "ink_pen", qty: 1 }, { id: "ink_bottle", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "wildspacer",
  "name": "Дикий космонавт",
  "icon": "🚀",
  "source": "SAS",
  "skills": [
    "Атлетика",
    "Выживание"
  ],
  "tools": [
    "Инструменты навигатора",
    "Транспортные средства (космос)"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Адаптация дикого космоса",
  "enName": "Wildspacer",
  "url": "https://dnd.su/multiverse/backgrounds/814-wildspacer/",
  "feature": "Вы получаете черту «Крепкий» из «Книги Игрока». Кроме того, вы научились адаптироваться к невесомости. Невесомость не даёт вам помехи в бросках рукопашных атак.",
  equipment:
[
      { type: 'fixed', items: [{ id: "club", qty: 1, note: "Страховочная булавка" }, { id: "clothes_travelers", qty: 1 }, { id: "grappling_hook", qty: 1 }, { id: "rope_hempen_50ft", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "clan_crafter",
  "name": "Клановый ремесленник",
  "icon": "🔨",
  "source": "SCAG",
  "skills": [
    "История",
    "Проницательность"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 0,
  "languagesConst": [
    "Дварфийский"
  ],
  "gold": 5,
  "traits": "Уважение крепкого народа",
  "enName": "Clan Crafter",
  "url": "https://dnd.su/backgrounds/773-clan-crafter/",
  "feature": "Хотя клановые ремесленники везде пользуются уважением, никто не ценит их так, как дварфы. У них всегда найдётся свободная комната и кровать в любом поселении, где обитают щитовые и золотые дварфы. Отдельные личности в таких поселениях могут даже спорить друг с другом о том, кто сможет предложить вам лучшие условия и помощь.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "special_bit", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "gem", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "cloistered_scholar",
  "name": "Учёный-затворник",
  "icon": "📖",
  "source": "SCAG",
  "skills": [
    "История"
  ],
  "skillChoices": {
    "count": 1,
    "from": [
      "Магия",
      "Природа",
      "Религия"
    ]
  },
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Доступ к библиотеке",
  "enName": "Cloistered Scholar",
  "url": "https://dnd.su/backgrounds/774-cloistered-scholar/",
  "feature": "Иные терпят обширные допросы и платят крупные суммы, чтобы получить доступ даже к наиболее распространённым архивам в библиотеке, у вас же есть свободный доступ к большей части библиотеки. В своей «альма-матер» вы знаете работников и всю бюрократию, поэтому для вас не составит труда наладить с ними связь.",
  equipment:
[
      { type: 'fixed', items: [{ id: "robe", qty: 1, note: "Ряса учёного из вашего монастыря" }, { id: "kit_scribes", qty: 1 }, { id: "study_book", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "courtier",
  "name": "Придворный",
  "icon": "🏛️",
  "source": "SCAG",
  "skills": [
    "Проницательность",
    "Убеждение"
  ],
  "tools": [],
  "languages": 2,
  "gold": 5,
  "traits": "Придворный функционер",
  "enName": "Courtier",
  "url": "https://dnd.su/backgrounds/775-courtier/",
  "feature": "Ваше знание принципов работы бюрократии даёт вам доступ к записям и внутренним работам любого королевского двора или правительства, которое вы можете повстречать. Вы знаете, кто является воротилой, к кому обратиться, чтобы удовлетворить ваше прошение, и какие на данный момент интриги плетутся.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "faction_agent",
  "name": "Представитель фракции",
  "icon": "🔰",
  "source": "SCAG",
  "skills": [
    "Проницательность"
  ],
  "skillChoices": {
    "count": 1,
    "from": [
      "Интеллект",
      "Мудрость",
      "Харизма"
    ]
  },
  "tools": [],
  "languages": 2,
  "gold": 15,
  "traits": "Убежище",
  "enName": "Faction Agent",
  "url": "https://dnd.su/backgrounds/776-faction-agent/",
  "feature": "Будучи агентом фракции, вы обладаете доступом к секретной сети людей, поддерживающих вас, которые могут предложить вам помощь в ваших приключениях. Вы знаете набор секретных знаков и паролей, которые вы можете использовать, чтобы опознать таких оперативников, которые могут предоставить доступ к секретному убежищу, свободной комнате или другому ночлегу или помочь раздобыть необходимую информацию.",
  equipment:
[
      { type: 'fixed', items: [{ id: "faction_insignia", qty: 1 }, { id: "faction_charter_copy", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "far_traveler",
  "name": "Дальний путешественник",
  "icon": "🌏",
  "source": "SCAG",
  "skills": [
    "Проницательность",
    "Восприятие"
  ],
  "toolChoice": {
    "count": 1,
    "from": [
      {
        "category": "gaming"
      },
      {
        "category": "musical"
      }
    ]
  },
  "languages": 1,
  "gold": 5,
  "traits": "Все взгляды прикованы к вам",
  "enName": "Far Traveler",
  "url": "https://dnd.su/backgrounds/777-far-traveler/",
  "feature": "Ваш акцент, манеры, обороты речи и, возможно, даже ваш внешний вид выдаёт в вас чужеземца. Любопытные взгляды всегда будут прикованы к вам, куда бы вы не отправились. Вы можете пользоваться этим вниманием для того, чтобы получать доступ к людям и местам, к которым ни у вас, ни у ваших компаньонов не было бы доступа при обычных обстоятельствах.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }] },
      { type: 'choice', label: "Музыкальный инструмент (любой)", options: [
        [{ type: "tool_choice", filter: ["musical", "gaming"], label: "Музыкальный инструмент или игровой набор, которым вы владеете", prof_only: true }],
      ]},
      { type: 'fixed', items: [{ id: "homeland_map", qty: 1 }, { id: "small_jewelry", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "inheritor",
  "name": "Наследник",
  "icon": "📜",
  "source": "SCAG",
  "skills": [
    "Выживание"
  ],
  "skillChoices": {
    "count": 1,
    "from": [
      "Магия",
      "История",
      "Религия"
    ]
  },
  "toolChoice": {
    "count": 1,
    "from": [
      {
        "category": "gaming"
      },
      {
        "category": "musical"
      }
    ]
  },
  "languages": 1,
  "gold": 15,
  "traits": "Наследие",
  "enName": "Inheritor",
  "url": "https://dnd.su/backgrounds/778-inheritor/",
  "feature": "Выберите или определите случайно, что является вашим наследием. Обсудите это со своим Мастером, чтобы определиться с деталями: почему ваше наследие такое важное, и какова его полная история? Мастер волен использовать ваше наследие как зацепку для истории, отправляя вас на задания, чтобы узнать новые детали.",
  equipment:
[
      { type: 'fixed', items: [{ id: "heritage_item", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { ref: "bg_tool_proficiency", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "knight_of_the_order",
  "name": "Рыцарь ордена",
  "icon": "⚔️",
  "source": "SCAG",
  "skills": [
    "Убеждение"
  ],
  "skillChoices": {
    "count": 1,
    "from": [
      "Магия",
      "История",
      "Природа",
      "Религия"
    ]
  },
  "toolChoice": {
    "count": 1,
    "from": [
      {
        "category": "gaming"
      },
      {
        "category": "musical"
      }
    ]
  },
  "languages": 1,
  "gold": 10,
  "traits": "Рыцарские связи",
  "enName": "Knight of the Order",
  "url": "https://dnd.su/backgrounds/779-knight-of-the-order/",
  "feature": "Вы получаете укрытие и помощь от членов вашего рыцарского ордена и от тех, кто симпатизирует его целям. Если ваш орден религиозной направленности, то вы также можете получить помощь в храмах и иных религиозных общинах вашего божества.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }, { id: "signet_ring", qty: 1 }] },
      { type: 'choice', label: "Знамя или печать, определяющие ваш ранг в ордене", options: [
        [{ id: "order_banner", qty: 1 }],
        [{ id: "order_seal", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "mercenary_veteran",
  "name": "Ветеран наёмник",
  "icon": "💰",
  "source": "SCAG",
  "skills": [
    "Атлетика",
    "Убеждение"
  ],
  "tools": [
    "Транспортное средство (наземное)"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 0,
  "gold": 10,
  "traits": "Жизнь наёмника",
  "enName": "Mercenary Veteran",
  "url": "https://dnd.su/backgrounds/780-mercenary-veteran/",
  "feature": "Вы знаете жизнь наёмника так хорошо, как только можно. Вы способны различать группы наёмников по их эмблемам, знаете понемногу про каждую из них, включая имена и репутации их командиров и лидеров, а также тех, кто был их недавними нанимателями.",
  equipment:
[
      { type: 'fixed', items: [{ id: "organization_uniform", qty: 1 }, { id: "rank_badge", qty: 1 }] },
      { type: 'choice', label: "Игровой набор (на выбор)", options: [
        [{ type: "tool_choice", filter: "gaming", label: "Игровой набор (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "urban_bounty_hunter",
  "name": "Городской охотник за головами",
  "icon": "🎯",
  "source": "SCAG",
  "skillChoices": {
    "count": 2,
    "from": [
      "Обман",
      "Проницательность",
      "Убеждение",
      "Скрытность"
    ]
  },
  "toolChoice": {
    "count": 2,
    "from": [
      {
        "category": "gaming"
      },
      {
        "category": "musical"
      },
      "Воровские инструменты"
    ]
  },
  "languages": 0,
  "gold": 20,
  "traits": "Ухо к земле",
  "enName": "Urban Bounty Hunter",
  "url": "https://dnd.su/backgrounds/781-urban-bounty-hunter/",
  "feature": "Вы часто контактируете с людьми из социального слоя, в котором обычно появляются цели, на которых вы специализируетесь. Эта связь выражается в виде контактного лица, которое может предоставить информацию о людях и местах в любом городе и его окрестностях, которые вы посещаете.",
  equipment:
[
      { type: 'fixed', items: [{ id: "bounty_hunter_outfit", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "uthgardt_tribe_member",
  "name": "Утгардтский соплеменник",
  "icon": "🐻",
  "source": "SCAG",
  "skills": [
    "Атлетика",
    "Выживание"
  ],
  "toolChoice": {
    "count": 1,
    "from": [
      {
        "category": "gaming"
      },
      {
        "category": "musical"
      }
    ]
  },
  "languages": 1,
  "gold": 10,
  "traits": "Утгардтское наследие",
  "enName": "Uthgardt Tribe Member",
  "url": "https://dnd.su/backgrounds/782-uthgardt-tribe-member/",
  "feature": "У вас превосходные знания не только территорий своего племени, но также местности и природных ресурсов остального Севера. Вы настолько хорошо знакомы с дикой природой, что находите в два раза больше еды и воды, чем при обычном поиске пропитания. Кроме того, вы всегда можете положиться на гостеприимство вашего народа.",
  equipment:
[
      { type: 'fixed', items: [{ id: "trap_hunting", qty: 1 }] },
      { type: 'choice', label: "Фигурка тотема или татуировки", options: [
        [{ id: "totem_figurine", qty: 1 }],
        [{ id: "utgardt_tattoo", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "city_watch",
  "name": "Городской стражник",
  "icon": "🛡️",
  "source": "SCAG",
  "skills": [
    "Атлетика",
    "Проницательность"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Намётанный глаз",
  "enName": "City Watch",
  "url": "https://dnd.su/backgrounds/772-city-watch/",
  "feature": "Ваш опыт блюстителя закона и общения с правонарушителями даёт вам возможность легко понять местные законы и положение дел в преступном мире. Вы можете легко найти местный опорный пункт стражи или подобной организации, и так же легко определить логово преступников в общине.",
  equipment:
[
      { type: 'fixed', items: [{ id: "unit_uniform", qty: 1 }, { id: "instrument_horn", qty: 1, note: "Рожок, которым можно позвать на помощь" }, { id: "manacles", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "waterdhavian_noble",
  "name": "Дворянин Глубоководья",
  "icon": "💧",
  "source": "SCAG",
  "skills": [
    "История",
    "Убеждение"
  ],
  "toolChoice": {
    "count": 1,
    "from": [
      {
        "category": "gaming"
      },
      {
        "category": "musical"
      }
    ]
  },
  "languages": 1,
  "gold": 20,
  "traits": "Поддержание стиля",
  "enName": "Waterdhavian Noble",
  "url": "https://dnd.su/backgrounds/771-waterdhavian-noble/",
  "feature": "Пока вы находитесь в Глубоководье или где-либо на Севере, ваш дом берёт на себя все ваши повседневные расходы. Вашего имени и печатки достаточно, чтобы покрыть большинство ваших трат; постоялые дворы, таверны и пиршественные залы часто бывают рады записать ваш долг и отправить счёт в ваше фамильное поместье.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }] },
      { type: 'choice', label: "Перстень или брошь", options: [
        [{ id: "ring", qty: 1 }],
        [{ id: "brooch", qty: 1 }],
      ]},
      { type: 'choice', label: "Бурдюк с отличным ззаром или вином", options: [
        [{ id: "wineskin_zzar", qty: 1 }],
        [{ id: "wineskin_wine", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "pedigree_scroll", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "adaptaciia_predystorii_sdq",
  "name": "Адаптация предысторий SDQ",
  "icon": "📄",
  "source": "SDQ",
  "skills": [],
  "tools": [],
  "languages": 0,
  "gold": 0,
  "traits": "",
  "enName": "",
  "url": "https://dnd.su/backgrounds/856-adaptaciia-predystorii-sdq/",
  "feature": "",
  equipment:
[
    ]
},

{
  "id": "mage_of_high_sorcery",
  "name": "Маг Высшего Волшебства",
  "icon": "🔮",
  "source": "SDQ",
  "skills": [
    "История",
    "Магия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Посвящённый в высшее волшебство",
  "enName": "Mage of High Sorcery",
  "url": "https://dnd.su/backgrounds/855-mage-of-high-sorcery/",
  "feature": "Вы получаете черту «Посвящённый в Высшее волшебство». Дополнительно, Маги Высшего волшебства предоставляют вам бесплатное скромное жилье и еду безгранично в любой своей Башне Высшего волшебства и на одну ночь в доме члена организации.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1, note: "Бутыль цветных чернил" }, { id: "calligraphers_pen", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "knight_of_solamnia",
  "name": "Соламнийский Рыцарь",
  "icon": "🏰",
  "source": "SDQ",
  "skills": [
    "Атлетика",
    "Выживание"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Оруженосец соламнии",
  "enName": "Knight of Solamnia",
  "url": "https://dnd.su/backgrounds/854-knight-of-solamnia/",
  "feature": "Вы получаете черту «Оруженосец рыцаря Соламнии». Кроме того, Соламнийские Рыцари предоставляют вам бесплатное скромное жильё и еду в любой своей крепости или лагере.",
  equipment:
[
      { type: 'fixed', items: [{ id: "solamnic_badge", qty: 1 }, { id: "game_cards", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "anthropologist",
  "name": "Антрополог",
  "icon": "🗺️",
  "source": "TOA",
  "skills": [
    "Проницательность",
    "Религия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Младший лингвист",
  "enName": "Anthropologist",
  "url": "https://dnd.su/backgrounds/756-anthropologist/",
  "feature": "Вы можете общаться с гуманоидами, которые не говорят на языках, которые вы знаете. Вы должны понаблюдать за взаимодействием гуманоида с другим гуманоидом в течение 1 дня. После этого вы научитесь основным жестам и словам, которых хватит для общения на базовом уровне.",
  equipment:
[
      { type: 'fixed', items: [{ id: "leather_journal", qty: 1 }, { id: "ink_bottle", qty: 1 }, { id: "quill", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "trinket", qty: 1, note: "Безделушка с уникальными метками" }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "archaeologist",
  "name": "Археолог",
  "icon": "⛏️",
  "source": "TOA",
  "skills": [
    "История",
    "Выживание"
  ],
  "toolChoice": {
    "count": 1,
    "from": [
      "Инструменты картографа",
      "Инструменты навигатора"
    ]
  },
  "languages": 1,
  "gold": 25,
  "traits": "Исторические знания",
  "enName": "Archaeologist",
  "url": "https://dnd.su/backgrounds/791-archaeologist/",
  "feature": "Когда вы входите в руины или подземелье, вы можете с уверенностью определить их первоначальное предназначение и создателей, если они являются представителями дварфов, эльфов, людей, юань-ти и других известных рас. Также вы можете прикинуть стоимость предмета, которому более века.",
  equipment:
[
      { type: 'fixed', items: [{ id: "wooden_case_map", qty: 1 }, { id: "lantern_bullseye", qty: 1 }, { id: "miners_pick", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "shovel", qty: 1 }, { id: "tent_two_person", qty: 1 }, { id: "trinket", qty: 1, note: "Безделушка с последних раскопок" }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "adaptaciia_predystorii_vrgr",
  "name": "Адаптация предысторий VRGR",
  "icon": "📄",
  "source": "VRGR",
  "skills": [],
  "tools": [],
  "languages": 0,
  "gold": 0,
  "traits": "",
  "enName": "",
  "url": "https://dnd.su/backgrounds/845-adaptaciia-predystorii-vrgr/",
  "feature": "",
  equipment:
[
    ]
},

{
  "id": "haunted_one",
  "name": "Преследуемый",
  "icon": "👻",
  "source": "VRGR",
  "skillChoices": {
    "count": 2,
    "from": [
      "Магия",
      "Расследование",
      "Религия",
      "Выживание"
    ]
  },
  "tools": [],
  "languages": 2,
  "gold": 0.1,
  "traits": "Сердце тьмы",
  "enName": "Haunted One",
  "url": "https://dnd.su/backgrounds/789-haunted-one/",
  "feature": "Те, кто взглянет вам в глаза, сможет увидеть, что вы встречались с невообразимым ужасом и что вам не чужда тьма. Хотя они могут бояться вас, обыватели будут вежливы и сделают всё, чтобы помочь вам.",
  equipment:
[
      { type: 'fixed', items: [{ id: "kit_monster_hunter", qty: 1 }, { id: "trinket", qty: 1, note: "Безделушка особой важности" }, { id: "clothes_common", qty: 1 }] },
    ]
},

{
  "id": "investigator",
  "name": "Следователь",
  "icon": "🔍",
  "source": "VRGR",
  "skillChoices": {
    "count": 2,
    "from": [
      "Восприятие",
      "Проницательность",
      "Расследование"
    ]
  },
  "tools": [
    "Набор для грима",
    "Воровские инструменты"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Официальный запрос",
  "enName": "Investigator",
  "url": "https://dnd.su/backgrounds/790-investigator/",
  "feature": "У вас есть опыт получения доступа к людям и местам, которые могут дать вам необходимую информацию. Благодаря сочетанию быстрой речи, решительности и документов, выглядящих официально, вы можете получить доступ к месту или лицу, имеющему отношение к расследуемому вами преступлению.",
  equipment:
[
      { type: 'fixed', items: [{ id: "magnifying_glass", qty: 1 }, { id: "investigator_clues", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "feylost",
  "name": "Потерявшийся в царстве фей",
  "icon": "🧚",
  "source": "WBW",
  "skills": [
    "Обман",
    "Выживание"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 0,
  "languagesChoice": {
    "count": 1,
    "from": [
      "Эльфийский",
      "Гномий",
      "Гоблинский",
      "Сильван"
    ]
  },
  "gold": 8,
  "traits": "Связь с царством фей",
  "enName": "Feylost",
  "url": "https://dnd.su/backgrounds/792-feylost/",
  "feature": "Жители Царства Фей считают вас своим благодаря вашим манерам и знанию обычаев фей. Дружественные феи склонны прийти вам на помощь, если вы потерялись или вам нужна помощь в Царстве Фей.",
  equipment:
[
      { type: 'choice', label: "Музыкальный инструмент (на выбор)", options: [
        [{ type: "tool_choice", filter: "musical", label: "Музыкальный инструмент (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }, { id: "trinket", qty: 3, note: "Безделушка Страны Фей" }] },
    ]
},

{
  "id": "witchlight_hand",
  "name": "Подручный Ведьмосвета",
  "icon": "🎡",
  "source": "WBW",
  "skills": [
    "Выступление",
    "Ловкость рук"
  ],
  "toolChoice": {
    "count": 2,
    "from": [
      {
        "category": "musical"
      },
      "Набор для грима"
    ]
  },
  "languages": 1,
  "gold": 8,
  "traits": "Работник карнавала",
  "enName": "Witchlight Hand",
  "url": "https://dnd.su/backgrounds/793-witchlight-hand/",
  "feature": "Карнавал Ведьмосвета предоставляет вам бесплатные скромные жилье и пищу. Вдобавок вы можете свободно передвигаться по карнавалу и бесплатно принимать участие в играх и событиях карнавала, если вы не нарушаете спокойствие и не создаёте неприятностей.",
  equipment:
[
      { type: 'choice', label: "Набор для грима или музыкальный инструмент", options: [
        [{ type: "tool_choice", filter: ["musical", "kit_disguise"], label: "Набор для грима или музыкальный инструмент" }],
      ]},
      { type: 'fixed', items: [{ id: "game_cards", qty: 1 }] },
      { type: 'choice', label: "Карнавальный костюм или униформа", options: [
        [{ id: "carnival_costume", qty: 1 }],
        [{ id: "uniform", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "trinket", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "lorehold_student",
  "name": "Студент Лорхолда",
  "icon": "🏺",
  "source": "SCC",
  "skills": [
    "История",
    "Религия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 15,
  "traits": "Поступление в Лорхолд",
  "enName": "Lorehold Student",
  "url": "https://dnd.su/backgrounds/794-lorehold-student/",
  "feature": "Вы получаете черту «Поступивший в Стриксхейвен» и обязаны выбрать для неё факультет Лорхолд.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "quill", qty: 1 }, { id: "hammer", qty: 1 }, { id: "lantern_hooded", qty: 1 }, { id: "tinderbox", qty: 1 }, { id: "history_tome", qty: 1 }, { id: "school_uniform", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "prismari_student",
  "name": "Студент Призмари",
  "icon": "🎨",
  "source": "SCC",
  "skills": [
    "Акробатика",
    "Выступление"
  ],
  "toolChoice": {
    "count": 1,
    "from": [
      {
        "category": "artisan"
      },
      {
        "category": "musical"
      }
    ]
  },
  "languages": 1,
  "gold": 10,
  "traits": "Поступивший в Призмари",
  "enName": "Prismari Student",
  "url": "https://dnd.su/backgrounds/795-prismari-student/",
  "feature": "Вы получаете черту «Поступивший в Стриксхейвен» и обязаны выбрать для неё факультет Призмари.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "school_uniform", qty: 1 }, { id: "quill", qty: 1 }] },
      { type: 'choice', label: "Музыкальный или ремесленный инструмент (на выбор)", options: [
        [{ type: "tool_choice", filter: ["musical", "artisan"], label: "Музыкальный инструмент (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "quandrix_student",
  "name": "Студент Квандрикса",
  "icon": "📐",
  "source": "SCC",
  "skills": [
    "Магия",
    "Природа"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 1,
  "gold": 15,
  "traits": "Поступивший в Квандрикс",
  "enName": "Quandrix Student",
  "url": "https://dnd.su/backgrounds/796-quandrix-student/",
  "feature": "Вы получаете черту «Поступивший в Стриксхейвен» и обязаны выбрать для неё факультет Квандрикс.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "quill", qty: 1 }, { id: "abacus", qty: 1 }, { id: "magic_theory_book", qty: 1 }, { id: "school_uniform", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "silverquill_student",
  "name": "Студент Сильверквилла",
  "icon": "🖊️",
  "source": "SCC",
  "skills": [
    "Запугивание",
    "Убеждение"
  ],
  "tools": [],
  "languages": 2,
  "gold": 15,
  "traits": "Поступивший в Сильверквилл",
  "enName": "Silverquill Student",
  "url": "https://dnd.su/backgrounds/797-silverquill-student/",
  "feature": "Вы получаете черту «Поступивший в Стриксхейвен» и обязаны выбрать для неё факультет Сильверквилл.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "quill", qty: 1 }, { id: "poetry_book", qty: 1 }, { id: "school_uniform", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "witherbloom_student",
  "name": "Студент Визерблума",
  "icon": "🌱",
  "source": "SCC",
  "skills": [
    "Природа",
    "Выживание"
  ],
  "tools": [
    "Набор травника"
  ],
  "languages": 1,
  "gold": 15,
  "traits": "Поступивший в Визерблум",
  "enName": "Witherbloom Student",
  "url": "https://dnd.su/backgrounds/798-witherbloom-student/",
  "feature": "Вы получаете черту «Поступивший в Стриксхейвен» и обязаны выбрать для неё факультет Визерблум.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "quill", qty: 1 }, { id: "plant_id_book", qty: 1 }, { id: "pot_iron", qty: 1 }, { id: "kit_herbalism", qty: 1 }, { id: "school_uniform", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "faceless",
  "name": "Безликий",
  "icon": "🎭",
  "source": "BGDA",
  "skills": [
    "Запугивание",
    "Обман"
  ],
  "tools": [
    "Набор для грима"
  ],
  "languages": 1,
  "gold": 10,
  "traits": "Две личности",
  "enName": "Faceless",
  "url": "https://dnd.su/backgrounds/833-faceless/",
  "feature": "Весь мир и большинство ваших товарищей по приключениям знают только ваш образ. Когда вы надеваете маску и ведёте себя как ваш образ, в вас не узнать вашу истинную личность. А когда вы снимаете маску и показываете настоящее лицо — в вас не узнать ваш образ.",
  equipment:
[
      { type: 'fixed', items: [{ id: "kit_disguise", qty: 1 }, { id: "clothes_costume", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_acolyte",
  "name": "Прислужник Врат Балдура",
  "icon": "⛪",
  "source": "BGDA",
  "skills": [
    "Проницательность",
    "Религия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 15,
  "traits": "Религиозная община",
  "enName": "Baldur's Gate Acolyte",
  "url": "https://dnd.su/backgrounds/840-baldurs-gate-acolyte/",
  "feature": "Вы тесно связаны с религиозной общиной Врат Балдура. Вы знаете, есть ли у божества последователи в городе, где они открыто собираются и в каких районах обычно живут.",
  equipment:
[
      { type: 'choice', label: "Священный символ (на выбор)", options: [
        [{ type: "gear_choice", filter: "Священный символ", label: "Священный символ (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "book", qty: 1 }, { id: "incense_stick", qty: 5 }, { id: "robe", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_charlatan",
  "name": "Шарлатан Врат Балдура",
  "icon": "🃏",
  "source": "BGDA",
  "skills": [
    "Ловкость рук",
    "Обман"
  ],
  "tools": [
    "Набор для грима",
    "Набор для фальсификации"
  ],
  "languages": 0,
  "gold": 15,
  "traits": "Пропавший наследник",
  "enName": "Baldur's Gate Charlatan",
  "url": "https://dnd.su/backgrounds/830-baldurs-gate-charlatan/",
  "feature": "Вы отлично владеете манерами речи и поведения балдурских патриаров и прочих благородных. Вы умеете их имитировать так хорошо, что купятся даже самые придирчивые главы семейств. Благодаря таланту самозванца у вас есть жетон Стражи, позволяющий вам в одиночку входить в Верхний Город Врат Балдура.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }, { id: "kit_disguise", qty: 1 }] },
      { type: 'choice', label: "Приспособление для жульничества на выбор", options: [
        [{ id: "con_tool_bottles", qty: 1 }],
        [{ id: "con_tool_dice", qty: 1 }],
        [{ id: "con_tool_cards", qty: 1 }],
        [{ id: "con_tool_ring", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_criminal",
  "name": "Преступник Врат Балдура",
  "icon": "🗡️",
  "source": "BGDA",
  "skills": [
    "Обман",
    "Скрытность"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 0,
  "gold": 15,
  "traits": "Преступные связи",
  "enName": "Baldur's Gate Criminal",
  "url": "https://dnd.su/backgrounds/841-baldurs-gate-criminal/",
  "feature": "Во Вратах Балдура преступность — это просто ремесло. Так что вы можете назначить встречу мелкому представителю почти любого предприятия, патриарского семейства, дружины, государственного учреждения или, конечно же, Гильдии.",
  equipment:
[
      { type: 'fixed', items: [{ id: "crowbar", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_entertainer",
  "name": "Артист Врат Балдура",
  "icon": "🎪",
  "source": "BGDA",
  "skills": [
    "Акробатика",
    "Выступление"
  ],
  "tools": [
    "Набор для грима"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 0,
  "gold": 15,
  "traits": "Пропуск за кулисы",
  "enName": "Baldur's Gate Entertainer",
  "url": "https://dnd.su/backgrounds/832-baldurs-gate-entertainer/",
  "feature": "Вы знаете, что самые важные дела в артистическом ремесле (как и в любом другом) происходят за кулисами. Вы легко угадываете, какая публика ходит в какие заведения. После успешного представления вы можете встретиться с восхищённым зрителем того рода занятий и общественного положения, какие обычно ходят в это заведение.",
  equipment:
[
      { type: 'choice', label: "Музыкальный инструмент (на выбор)", options: [
        [{ type: "tool_choice", filter: "musical", label: "Музыкальный инструмент (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "admirer_gift", qty: 1 }, { id: "clothes_costume", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_folk_hero",
  "name": "Народный герой Врат Балдура",
  "icon": "🌾",
  "source": "BGDA",
  "skills": [
    "Выживание",
    "Уход за животными"
  ],
  "tools": [
    "Транспортное средство (наземное)"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 0,
  "gold": 10,
  "traits": "Классовая месть",
  "enName": "Baldur's Gate Folk Hero",
  "url": "https://dnd.su/backgrounds/838-baldurs-gate-folk-hero/",
  "feature": "Вы всю жизнь прожили в Нижнем или Внешнем Городе Врат Балдура. Находясь в людной части Нижнего или Внешнего Города, вы можете потратить 2к10 минут и убедить 1к6 обывателей помешать бойцам Стражи, Пламенного Кулака, патриару или просто богатому на вид лицу, не нарушая закона.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "shovel", qty: 1 }, { id: "pot_iron", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_guild_artisan",
  "name": "Гильдейский ремесленник Врат Балдура",
  "icon": "⚒️",
  "source": "BGDA",
  "skills": [
    "Проницательность",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "artisan",
    "count": 1
  },
  "languages": 1,
  "gold": 15,
  "traits": "Профессиональные связи",
  "enName": "Baldur's Gate Guild Artisan",
  "url": "https://dnd.su/backgrounds/842-baldurs-gate-guild-artisan/",
  "feature": "Вы знакомы с городскими дружинами, знаете их территории и взаимоотношения. Выберите одну из трёх частей Врат Балдура: Верхний, Нижний или Внешний Город. Там вы ведёте основные свои дела.",
  equipment:
[
      { type: 'choice', label: "Ремесленные инструменты (на выбор)", options: [
        [{ type: "tool_choice", filter: "artisan", label: "Ремесленные инструменты (на выбор)" }],
      ]},
      { type: 'fixed', items: [{ id: "guild_letter", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_hermit",
  "name": "Отшельник Врат Балдура",
  "icon": "🧘",
  "source": "BGDA",
  "skills": [
    "Медицина",
    "Религия"
  ],
  "tools": [
    "Набор травника"
  ],
  "languages": 1,
  "gold": 5,
  "traits": "Настоящий город",
  "enName": "Baldur's Gate Hermit",
  "url": "https://dnd.su/backgrounds/839-baldurs-gate-hermit/",
  "feature": "Вы знаете ту часть Врат Балдура, которую не замечает большинство: мир бездомных и несчастных. Вы знаете, куда пойти в Нижнем и Внешнем Городах, чтобы остаться неузнанным. В этих трущобах и палаточных городках можно найти грязную постель и скудный ужин — зато тут меньше лезут в чужие дела и не задают вопросов.",
  equipment:
[
      { type: 'fixed', items: [{ id: "scroll_case_prayers", qty: 1 }, { id: "warm_blanket", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "kit_herbalism", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_noble",
  "name": "Благородный Врат Балдура",
  "icon": "👑",
  "source": "BGDA",
  "skills": [
    "История",
    "Убеждение"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 1,
  "gold": 25,
  "traits": "Патриар",
  "enName": "Baldur's Gate Noble",
  "url": "https://dnd.su/backgrounds/834-baldurs-gate-noble/",
  "feature": "Вы — представитель одной из знатных семей Врат Балдура. Вы можете проходить через городские ворота, не платя пошлину, вращаться в кругах городской знати, не вызывая вопросов, и производить впечатление на тех, кому нужны состоятельные покровители.",
  equipment:
[
      { type: 'fixed', items: [{ id: "clothes_fine", qty: 1 }, { id: "signet_ring", qty: 1 }, { id: "genealogy_scroll", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_outlander",
  "name": "Чужеземец Врат Балдура",
  "icon": "🌲",
  "source": "BGDA",
  "skills": [
    "Атлетика",
    "Выживание"
  ],
  "toolChoice": {
    "category": "musical",
    "count": 1
  },
  "languages": 1,
  "gold": 10,
  "traits": "Опыт иммигранта",
  "enName": "Baldur's Gate Outlander",
  "url": "https://dnd.su/backgrounds/844-baldurs-gate-outlander/",
  "feature": "Немного пожив во Вратах Балдура, вы узнали, что в городе куда больше стен и ворот, помимо тех, что патрулируются Стражей и Пламенным Кулаком. Вы познакомились с иммигрантскими диаспорами города.",
  equipment:
[
      { type: 'fixed', items: [{ id: "arcane_staff", qty: 1 }, { id: "trap_hunting", qty: 1 }, { id: "animal_trophy", qty: 1 }, { id: "clothes_travelers", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_sage",
  "name": "Мудрец Врат Балдура",
  "icon": "📚",
  "source": "BGDA",
  "skills": [
    "История",
    "Магия"
  ],
  "tools": [],
  "languages": 2,
  "gold": 10,
  "traits": "Собиратель слухов",
  "enName": "Baldur's Gate Sage",
  "url": "https://dnd.su/backgrounds/837-baldurs-gate-sage/",
  "feature": "Благодаря личным связям и статьям в «Устах Балдура» вы можете выяснить тайны многих балдурцев. Всякий раз, когда в городе происходит громкое преступление или загадочное событие, у вас уже наготове список из 1к4 подозреваемых.",
  equipment:
[
      { type: 'fixed', items: [{ id: "ink_bottle", qty: 1 }, { id: "quill", qty: 1 }, { id: "small_knife", qty: 1 }, { id: "letter_dead_colleague", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_sailor",
  "name": "Моряк Врат Балдура",
  "icon": "⚓",
  "source": "BGDA",
  "skills": [
    "Атлетика",
    "Восприятие"
  ],
  "tools": [
    "Инструменты навигатора",
    "Транспортное средство (водное)"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Чутьё контрабандиста",
  "enName": "Baldur's Gate Sailor",
  "url": "https://dnd.su/backgrounds/836-baldurs-gate-sailor/",
  "feature": "Вы хорошо знаете порт Врат Балдура, где ходят проверяющие и сборщики податей, куда текут грузы и монеты. Так что для вас легко протащить груз на берег или на борт дружественного судна, не привлекая подозрений и не платя пошлин.",
  equipment:
[
      { type: 'fixed', items: [{ id: "club", qty: 1 }, { id: "rope_silk_50ft", qty: 1 }, { id: "talisman", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_soldier",
  "name": "Солдат Врат Балдура",
  "icon": "⚔️",
  "source": "BGDA",
  "skills": [
    "Атлетика",
    "Запугивание"
  ],
  "tools": [
    "Транспортное средство (наземное)"
  ],
  "toolChoice": {
    "category": "gaming",
    "count": 1
  },
  "languages": 0,
  "gold": 10,
  "traits": "Городской стражник, Чутьё на честность",
  "enName": "Baldur's Gate Soldier",
  "url": "https://dnd.su/backgrounds/843-baldurs-gate-soldier/",
  "feature": "Вы можете выбрать, служите ли вы сейчас в Пламенном Кулаке или Страже. Вы нередко имели дело с продажными солдатами и офицерами и за версту замечаете поведение, типичное для них.",
  equipment:
[
      { type: 'fixed', items: [{ id: "honorary_badge", qty: 1 }, { id: "enemy_trophy", qty: 1 }] },
      { type: 'choice', label: "Игровые кости или карты", options: [
        [{ id: "game_cards", qty: 1 }],
        [{ id: "game_dice", qty: 1 }],
      ]},
      { type: 'fixed', items: [{ id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
},

{
  "id": "baldurs_gate_urchin",
  "name": "Беспризорник Врат Балдура",
  "icon": "🏚️",
  "source": "BGDA",
  "skills": [
    "Ловкость рук",
    "Скрытность"
  ],
  "tools": [
    "Воровские инструменты",
    "Набор для грима"
  ],
  "languages": 0,
  "gold": 10,
  "traits": "Связи с Привратниками",
  "enName": "Baldur's Gate Urchin",
  "url": "https://dnd.su/backgrounds/835-baldurs-gate-urchin/",
  "feature": "Даже если вы не состоите в дружине Привратников, вы знакомы с ними и знаете их кодовые знаки факелами. По свету, положению и типу факелов, расположенных на строении или рядом с ним, вы узнаёте, кто тут живёт или ведёт дела.",
  equipment:
[
      { type: 'fixed', items: [{ id: "small_knife", qty: 1 }, { id: "city_map", qty: 1 }, { id: "pet_mouse", qty: 1 }, { id: "parents_trinket", qty: 1 }, { id: "clothes_common", qty: 1 }, { id: "pouch", qty: 1 }] },
    ]
}

];
