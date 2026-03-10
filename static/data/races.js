// ══════════════════════════════════════════════════════════
// RACES DATABASE — dnd.su compatible
// ASI types:
//   asi: {key:val}         — фиксированные бонусы
//   asiMode: 'fixed'       — только фиксированные
//   asiMode: 'choice'      — выбор: +2/+1 или +1/+1/+1 (MPMM-style)
//   asiMode: 'all+1'       — все +1 (стандартный человек)
//   asiMode: 'variant'     — вариантный человек (2 хар-ки +1, черта, навык)
//   asiMode: 'flex2'       — любые 2: одна +2 или две по +1
// ══════════════════════════════════════════════════════════

window.SOURCES = {
  'PH14': "Player's Handbook (2014)",
  'XGE':  "Xanathar's Guide to Everything",
  'AI':   "Acquisition Incorporated",
  'AM':   "Adventure with Muk",
  'RLW':  "Eberron: Rising from the Last War",
  'GGR':  "Guildmasters' Guide to Ravnica",
  'FTD':  "Fizban’s Treasury of Dragons",
  'EGtW': "Explorer’s Guide to Wildemount",
  'GHPG': "Grim Hollow: The Player's Guide",
  'MPMM': "Mordenkainen Presents: Monsters of the Multiverse",
  'MTF':  "Mordenkainen's Tome of Foes",
  'MOT':  "Mythic Odysseys of Theros",
  'SAS':  "Spelljammer: Adventures in Space",
  'TCE':  "Tasha's Cauldron of Everything",
  'VRGR': "Van Richten's Guide to Ravenloft",
  'VGM':  "Volo's Guide to Monsters",
  'SDQ':  "Dragonlance: Shadow of the Dragon Queen",
  'POA':  "Princes of the Apocalypse",
  'SCC':  "Strixhaven: A Curriculum of Chaos",
  'WBW':  "The Wild Beyound the Witchlight",
  'BGG':  "Bigby Presents: Glory of the Giants",
  'BGDA': "Baldur's Gate: Descent into Avernus",
  'GOS':  "Ghosts of Saltmarsh",
  'LR':   "Locathah Rising",
  'OGA':  "One Grung Above",
  'TCG':  "Tal’Dorei Campaign Guide",
  'TP':   "The Tortle Package",
  'SCAG': "Sword Coast Adventurer's Guide",
  'UA':   "Unearthed Arcana",
  'HB':   "Homebrew",
  'PS:A': "Plane Shift: Amonkhet",
  'PS:In':"Plane Shift: Innistrad",
  'HB:CN':   "Chronicles of Naimiria",
  'HB:HGMH': "Heliana's Guide to Monster Hunting",
  'HB:MHH':  "Midgard Heroes Handbook",
  'HB:MF':   "Mundus Forge",
  'HB:RGYR': "Ryoko's Guide to the Yokai Realms",
  'HB:SGEH': "Steinhardt's Guide to the Eldritch Hunt",
  'HB:SC':   "Sprouting Chaos ",
};

window.RACES = [
  {
    id: 'aarakocra', url: 'https://dnd.su/race/92-aarakocra/', name: 'Ааракокра', nameEn: 'Aarakocra', source: 'POA',
    icon: '🦅', size: 'Средний', speed: 25, flySpeed: 50,
    asiMode: 'fixed', asi: {ЛОВ:2, МДР:1},
    traits: 'Полёт, Когти',
    languages: ['Общий', 'Ааракокра', 'Ауран'],
    subraces: []
  },
  {
    id: 'aasimar', url: 'https://dnd.su/race/161-aasimar/', name: 'Аасимар', nameEn: 'Aasimar', source: 'VGM',
    icon: '😇', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ХАР:2},
    traits: 'Тёмное зрение, Небесное сопротивление, Небесный облик',
    languages: ['Общий', 'Небесный'],
    subraces: [
      { id: 'protector', name: 'Аасимар-защитник', source: 'VGM', asiMode: 'fixed', asi: {МДР: 1}, traits: 'Сияющая душа' },
      { id: 'scourge',   name: 'Аасимар-каратель', source: 'VGM', asiMode: 'fixed', asi: {ТЕЛ: 1}, traits: 'Испускание сияния' },
      { id: 'fallen',    name: 'Падший аасимар',   source: 'VGM', asiMode: 'fixed', asi: {СИЛ: 1}, traits: 'Саван смерти' },]
  },
  {
    id: 'autognome', url: 'https://dnd.su/multiverse/race/214-autognome/', name: 'Автогном', nameEn: 'Autognome', source: 'SAS',
    icon: '🤖', size: 'Маленький', speed: 30,
    asiMode: 'flex2', asi: {},
    toolChoice: {count: 2, from: 'all'},
    traits: 'Устойчивость к яду, невосприимчивость к болезням, не нужно есть/пить/дышать/спать',
    languages: ['Общий', 'Гномий'],
    subraces: []
  },
  {
    id: 'astral_elf', url: 'https://dnd.su/multiverse/race/213-astral-elf/', name: 'Астральный эльф', nameEn: 'Astral elf', source: 'SAS',
    icon: '✨', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'flex2', asi: {},
    skills: ['Восприятие'],
    traits: 'Тёмное зрение, Очарованность предком, Астральное пламя, Эльфийская родословная',
    languages: ['Общий', 'Эльфийский'],
    subraces: []
  },
  {
    id: 'bugbear', url: 'https://dnd.su/race/167-bugbear/', name: 'Багбир', nameEn: 'Bugbear', source: 'VGM',
    icon: '👹', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {СИЛ:2, ЛОВ:1},
    skills: ['Скрытность'],
    traits: 'Тёмное зрение, Долгорукий, Мощная сборка, Внезапная атака',
    languages: ['Общий', 'Гоблинский'],
    subraces: [
      { id: 'bugbearERLW', name: 'Багбир (ERLW)', source: 'RLW', traits: ''},
    ]
  },
  {
    id: 'vedalken', url: 'https://dnd.su/race/162-vedalken/', name: 'Ведалкен', nameEn: 'Vedalken', source: 'GGR',
    icon: '🔵', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ИНТ:2, МДР:1},
    skillChoices: {count: 1, from:['Выступление', 'История', 'Ловкость рук', 'Магия', 'Медицина', 'Расследование']},
    toolChoice: {count: 1, any:true},
    traits: 'Бесстрастие ведалкенов, Неустанная скрупулёзность, Частично амфибия',
    languages: ['Общий', 'Ведалкенский', 'на выбор'],
    subraces: []
  },
  {
    id: 'verdan', url: 'https://dnd.su/race/163-verdan/', name: 'Вердан', nameEn: 'Verdan', source: 'AI',
    icon: '🌱', size: 'Маленький', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:1, ХАР:2},
    skills: ['Убеждение'],
    traits: 'Телепатическое смятение, Обострённые чувства, Неполугоблин',
    languages: ['Общий', 'Гоблинский', 'на выбор'],
    subraces: []
  },
  {
    id: 'simic_hybrid', url: 'https://dnd.su/race/164-simic-hybrid/', name: 'Гибрид Симиков', nameEn: 'Simic hybrid', source: 'GGR',
    icon: '🐊', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'partial', asi: {ТЕЛ: 2}, asiChoice: {count: 1, any: true, exclude: ['ТЕЛ']},
    asiExtra: {count:1, any:true},
    traits: 'Тёмное зрение 60 фут., Усиление животного (уровни 1, 5)',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'gith', url: 'https://dnd.su/race/165-gith/', name: 'Гит', nameEn: 'Gith', source: 'MTF',
    icon: '⚔️', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ИНТ:1},
    traits: 'Психическая стойкость',
    languages: ['Общий', 'Гитский'],
    subraces: [
      { id: 'githyanki', name: 'Гитъянки',  source: 'MTF', asiMode: 'fixed', asi: {СИЛ: 2}, languages: ['на выбор'], traits: 'Боевая тренировка гитъянки, Псионика (прыжок, мисти-степ, телекинез)', skillOrToolChoice: {count: 1, any: true}, weaponProf: ['Короткий меч', 'Длинный меч', 'Копьё'], armorProf: ['Лёгкие доспехи', 'Средние доспехи'] },
      { id: 'githzerai', name: 'Гитцерай',  source: 'MTF', asiMode: 'fixed', asi: {МДР: 2},                           traits: 'Монастырская защита, Псионика (щит разума)' },
    ]
  },
  {
    id: 'giff', url: 'https://dnd.su/multiverse/race/215-giff/', name: 'Гифф', nameEn: 'Giff', source: 'SAS',
    icon: '🦛', size: 'Средний', speed: 30, swimSpeed: 30,
    asiMode: 'flex2', asi: {},
    traits: 'Амфибийность, Пушечное умение, Напористый, Мощная сборка',
    languages: ['Общий'],
    weaponProf: ['Аркебуза', 'Пистолет', 'Мушкетон'],
    subraces: []
  },
  {
    id: 'gnome', url: 'https://5e14.dnd.su/race/83-gnome/', name: 'Гном', nameEn: 'Gnome', source: 'PH14',
    icon: '🍄', size: 'Маленький', speed: 25, darkvision: 60,
    asiMode: 'fixed', asi: {ИНТ: 2},
    traits: 'Тёмное зрение 60 фут., Гномья хитрость',
    languages: ['Общий', 'Гномий'],
    subraces: [
      { id: 'forest',      name: 'Лесной гном',         source: 'PH14', asiMode: 'fixed', asi: {ЛОВ: 1},                                               traits: 'Иллюзорная хитрость, Говорить с мелкими зверями' },
      { id: 'rock',        name: 'Скальный гном',       source: 'PH14', asiMode: 'fixed', asi: {ТЕЛ: 1}, toolProf: 'Инструменты ремонтника',           traits: 'Искусственная память, Знаток механики'},
      { id: 'deep',        name: 'Глубинный гном',      source: 'SCAG', asiMode: 'fixed', asi: {СИЛ: 1}, darkvision: 120, languages: ['Подземный'],    traits: 'Превосходное тёмное зрение 120 фут., Каменный камуфляж' },
      { id: 'gnomeERLW',   name: 'Метка письма (ERLW)', source: 'RLW',                                                                                traits: '' }
    ]
  },
  {
    id: 'goblin', url: 'https://dnd.su/race/166-goblin/', name: 'Гоблин', nameEn: 'Goblin', source: 'VGM',
    icon: '👺', size: 'Маленький', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2, ТЕЛ:1},
    traits: 'Тёмное зрение, Разъяренная мелкота, Шустрый побег',
    languages: ['Общий', 'Гоблинский'],
    subraces: [
      { id: 'goblin_rlw',      name: 'Гоблин (RLW)',           source: 'RLW',                                                                traits: '' },
      { id: 'goblin_ggr',      name: 'Гоблин (GGR)',           source: 'GGR',                                                                traits: ''},
      { id: 'goblin_am',       name: 'Гоблины Данквуда (AM)',  source: 'AM',  asiMode: 'fixed', asiOverride: true, asi: {ЛОВ:2, МДР:1},      traits: 'Общение с маленькими зверями' },
    ]
  },
  {
    id: 'goliath', url: 'https://dnd.su/race/103-goliath/', name: 'Голиаф', nameEn: 'Goliath', source: 'VGM',
    icon: '🏔️', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    skills: ['Атлетика'],
    traits: 'Мощная сборка, Каменное терпение, Горная рожа',
    languages: ['Общий', 'Великаний'],
    subraces: []
  },
  {
    id: 'grung', url: 'https://dnd.su/race/169-grung/', name: 'Грунг', nameEn: 'Grung', source: 'OGA',
    icon: '🐸', size: 'Маленький', speed: 25, climbSpeed: 25,
    asiMode: 'fixed', asi: {ЛОВ:2, ТЕЛ:1},
    skills: ['Восприятие'],
    traits: 'Амфибия, Яд грунга, Прыгучесть, Лазание',
    languages: ['Общий', 'Грунг'],
    subraces: []
  },
  {
    id: 'dwarf', url: 'https://5e14.dnd.su/race/78-dwarf/', name: 'Дварф', nameEn: 'Dwarf', source: 'PH14',
    icon: '⛏️', size: 'Средний', speed: 25,
    asiMode: 'fixed', asi: {ТЕЛ: 2},
    traits: 'Тёмное зрение 60 фут., Дварфийская устойчивость, Дварфийское боевое обучение, Каменная смекалка',
    languages: ['Общий', 'Дварфийский'],
    weaponProf: ['Боевой топор', 'Ручной топор', 'Лёгкий молот', 'Боевой молот'],
    toolChoice: {count:1, from:['Инструменты кузнеца', 'Инструменты пивовара', 'Инструменты каменщика']},
    subraces: [
      { id: 'hill',         name: 'Холмовой дварф',     source: 'PH14', asiMode: 'fixed', asi: {МДР: 1}, traits: 'Дварфийская выносливость (+1 макс. ХП за уровень)' },
      { id: 'dwarf_rlw',    name: 'Метка опеки (RLW)',  source: 'RLW',  asiMode: 'fixed', asi: {ИНТ: 1}, darkvision: 60, traits: 'Обереги и печати, Заклинания метки' },
      { id: 'mountain',     name: 'Горный дварф',       source: 'PH14', asiMode: 'fixed', asi: {СИЛ: 2}, darkvision: 60, armorProf: ['Лёгкие доспехи', 'Средние доспехи'],  traits: 'Дварфийская броня'},
      { id: 'duergar',      name: 'Дуэргар (SCAG)',     source: 'SCAG', asiMode: 'fixed', asi: {СИЛ: 1}, darkvision: 120, traits: 'Дуэргарская стойкость, Увеличение, Невидимость' },
      { id: 'duergar_mtf',  name: 'Дуэргар (MTF)',      source: 'MTF',  asiMode: 'fixed', asi: {СИЛ: 1}, darkvision: 120, Languages: ['Подземный'], traits: 'Дуэргарская стойкость, Увеличение, Невидимость' },
      { id: 'duergar_mpmm', name: 'Дуэргар (MPMM)',     source: 'MPMM', asiMode: 'choice', asiOverride: true, asi: {}, darkvision: 120, traits: 'Дуэргарская стойкость, Дуэргарская магия — выберите бонус хар-к' },
    ]
  },
  {
    id: 'genasi', url: 'https://dnd.su/race/102-genasi/', name: 'Дженази', nameEn: 'Genasi', source: 'POA',
    icon: '🧞‍♂️', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2},
    traits: 'Бонус по стихии подрасы',
    languages: ['Общий', 'Первичный'],
    subraces: [
      { id: 'air',   name: 'Воздушный дженази', source: 'POA', asiMode: 'fixed', asi: {ЛОВ: 1}, traits: 'Задержка дыхания неограничено, Порыв ветра' },
      { id: 'earth', name: 'Земляной дженази',  source: 'POA', asiMode: 'fixed', asi: {СИЛ: 1}, traits: 'Слияние с камнем (скорость через землю 30)' },
      { id: 'fire',  name: 'Огненный дженази',  source: 'POA', asiMode: 'fixed', asi: {ИНТ: 1}, traits: 'Тёмное зрение 60 фут., Огненное сопротивление, Производить огонь' },
      { id: 'water', name: 'Водный дженази',    source: 'POA', asiMode: 'fixed', asi: {МДР: 1}, swimSpeed: 30, traits: 'Амфибия, Плавание 30 фут., Кислотный брызг' },
    ]
  },
  {
    id: 'dragonborn', url: 'https://5e14.dnd.su/race/82-dragonborn/', name: 'Драконорождённый', nameEn: 'Dragonborn', source: 'PH14',
    icon: '🐉', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {СИЛ: 2, ХАР: 1},
    traits: 'Драконье дыхание (линия или конус), Сопротивление элементу дракона',
    languages: ['Общий', 'Драконий'],
    subraces: [
      {id:'black',  name:'Чёрный (кислота)',  source:'PH14', traits:'Кислота, линия 5×30'},
      {id:'blue',   name:'Синий (молния)',    source:'PH14', traits:'Молния, линия 5×30'},
      {id:'brass',  name:'Латунный (огонь)',  source:'PH14', traits:'Огонь, линия 5×30'},
      {id:'bronze', name:'Бронзовый (молния)',source:'PH14', traits:'Молния, линия 5×30'},
      {id:'copper', name:'Медный (кислота)',  source:'PH14', traits:'Кислота, линия 5×30'},
      {id:'gold',   name:'Золотой (огонь)',   source:'PH14', traits:'Огонь, конус 15'},
      {id:'green',  name:'Зелёный (яд)',      source:'PH14', traits:'Яд, конус 15'},
      {id:'red',    name:'Красный (огонь)',   source:'PH14', traits:'Огонь, конус 15'},
      {id:'silver', name:'Серебряный (холод)',source:'PH14', traits:'Холод, конус 15'},
      {id:'white',  name:'Белый (холод)',     source:'PH14', traits:'Холод, конус 15'},
      {id:'dragonblood_egtw',  name:'Драконокровный (EGtW)',   source:'EGtW', asiMode: 'fixed', asiOverride: true, asi: {ИНТ:2, ХАР:1}, darkvision: 60,  traits:'Тёмное зрение, Довлеющее присутствие'},
      {id:'ravenit_egtw',      name:'Равенит (EGtW)',          source:'EGtW', asiMode: 'fixed', asiOverride: true, asi: {СИЛ:2, ТЕЛ:1}, darkvision: 60,  traits:'Тёмное зрение, Мстительное нападение'},
    ]
  },
  {
    id: 'dragonborn_ftd', url: 'https://5e14.dnd.su/race/82-dragonborn/', name: 'Драконорождённый (FTD)', nameEn: 'Dragonborn (FTD)', source: 'FTD',
    icon: '🐉', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Драконье дыхание (линия или конус), Сопротивление элементу дракона',
    languages: ['Общий', 'на выбор'],
    subraces: [
      {id:'bronze', name:'Бронзовый (Электричество)',            source:'FTD',        traits:'Электричество, конус 15'},
      {id:'gold',   name:'Золотой (огонь)',                      source:'FTD',        traits:'Огонь, конус 15'},
      {id:'brass',  name:'Латунный (огонь)',                     source:'FTD',        traits:'Огонь, конус 15'},
      {id:'copper', name:'Медный (кислота)',                     source:'FTD',        traits:'Кислота, конус 15'},
      {id:'silver', name:'Серебряный (холод)',                   source:'FTD',        traits:'Холод, конус 15'},
      
      {id:'amethist',name:'Аметистовый (силовое поле)',          source:'FTD',        traits:'Силовое поле, конус 15'},
      {id:'emerald', name:'Изумрудный (психическая энергия)',    source:'FTD',        traits:'Психическая энергия, конус 15'},
      {id:'crystall',name:'Кристаллический (излучение)',         source:'FTD',        traits:'Излучение, конус 15'},
      {id:'saphire', name:'Сапфировый (звук)',                   source:'FTD',        traits:'Звук, конус 15'},
      {id:'topaz',   name:'Топазный (некротическая энергия)',    source:'FTD',        traits:'Некротическая энергия, конус 15'},

      {id:'white',  name:'Белый (холод)',                        source:'FTD',        traits:'Холод, линия 5×30'},
      {id:'green',  name:'Зелёный (яд)',                         source:'FTD',        traits:'Яд, линия 5×30'},
      {id:'red',    name:'Красный (огонь)',                      source:'FTD',        traits:'Огонь, линия 5×30'},
      {id:'blue',   name:'Синий (электричество)',                source:'FTD',        traits:'Электричество, линия 5×30'},
      {id:'black',  name:'Чёрный (кислота)',                     source:'FTD',        traits:'Кислота, линия 5×30'},
      
    ]
  },
  {
    id: 'harengon', url: 'https://dnd.su/race/207-harengon/', name: 'Зайцегон', nameEn: 'Harengon', source: 'WBW',
    icon: '🐰', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    skills: ['Восприятие'],
    traits: 'Заячий прыжок (бонусное), Везение зайца (реакция: +бонус мастерства к AC)',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'kalashtar', url: 'https://dnd.su/race/171-kalashtar/', name: 'Калаштар', nameEn: 'Kalashtar', source: 'RLW',
    icon: '🧠', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {МДР:2, ХАР:1},
    traits: 'Двойная психика, Ментальная дисциплина, Ментальная связь',
    languages: ['Общий', 'Квори', 'на выбор'],
    subraces: []
  },
  {
    id: 'kender', url: 'https://dnd.su/race/285-kender/', name: 'Кендер', nameEn: 'Kender', source: 'SDQ',
    icon: '🎪', size: 'Маленький', speed: 30,
    asiMode: 'flex2', asi: {},
    skillChoices: {count: 1, from: ['Проницательность', 'Расследование', 'Ловкость рук', 'Скрытность', 'Выживание']},
    traits: 'Бесстрашие, Провоцирование, Кендерское везение',
    languages: ['Общий'],
    subraces: []
  },
  {
    id: 'kenku', url: 'https://dnd.su/race/172-kenku/', name: 'Кенку', nameEn: 'Kenku', source: 'VGM',
    icon: '🦜', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ЛОВ:2, МДР:1},
    skillChoices: {count: 2, from: ['Акробатика', 'Обман', 'Скрытность', 'Ловкость рук']},
    traits: 'Мастер имитации, Мастер тени (Обман и Скрытность)',
    languages: ['Общий', 'Ауран'],
    subraces: []
  },
  {
    id: 'centaur', url: 'https://dnd.su/race/173-centaur/', name: 'Кентавр', nameEn: 'Centaur', source: 'GGR',
    icon: '🐎', size: 'Средний', speed: 40,
    asiMode: 'fixed', asi: {СИЛ:2, МДР:1},
    skillChoices: {count: 1, from: ['Уход за животными', 'Медицина', 'Природа', 'Выживание']},
    traits: 'Копыта (1к4+СИЛ), Лошадиная сборка, Ставни, Природная сила',
    languages: ['Общий', 'Сильван'],
    subraces: []
  },
  {
    id: 'kobold', url: 'https://dnd.su/race/175-kobold/', name: 'Кобольд', nameEn: 'Kobold', source: 'VGM',
    icon: '🦎', size: 'Маленький', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2},
    traits: 'Чуткость к солнечному свету, Стайная тактика',
    languages: ['Общий', 'Драконий'],
    subraces: []
  },
  {
    id: 'warforged', url: 'https://dnd.su/race/174-warforged/', name: 'Кованый', nameEn: 'Warforged', source: 'RLW',
    icon: '🤖', size: 'Средний', speed: 30,
    asiMode: 'partial', asi: {ТЕЛ: 2}, asiChoice: {count: 1, any: true, exclude: ['ТЕЛ']},
    skillChoices: {count: 1, any: true},
    toolChoice: {count: 1, any: true},
    traits: 'Встроенная броня (+1 КД), Конструкт: иммунитет к болезням, нет нужды есть/дышать/спать',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'leonin', url: 'https://dnd.su/race/176-leonin/', name: 'Леонин', nameEn: 'Leonin', source: 'MOT',
    icon: '🦁', size: 'Средний', speed: 35, darkvision: 60,
    asiMode: 'fixed', asi: {ТЕЛ:2, СИЛ:1},
    skillChoices: {count: 1, from: ['Атлетика', 'Восприятие', 'Выживание', 'Запугивание']},
    traits: 'Тёмное зрение, Когти, Львиный рык',
    languages: ['Общий', 'Леонин'],
    subraces: []
  },
  {
    id: 'locathah', url: 'https://dnd.su/race/178-locathah/', name: 'Локата', nameEn: 'Locathah', source: 'LR',
    icon: '🐟', size: 'Средний', speed: 30, swimSpeed: 30,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    skills: ['Восприятие', 'Атлетика'],
    traits: 'Природный доспех, Инстинкт охотника, Амфибия, Плавание',
    languages: ['Общий', 'Акван'],
    subraces: []
  },
  {
    id: 'loxodon', url: 'https://dnd.su/race/177-loxodon/', name: 'Локсодон', nameEn: 'Loxodon', source: 'GGR',
    icon: '🐘', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2, МДР:1},
    traits: 'Хобот, Природная броня, Природная смекалка',
    languages: ['Общий', 'Локсодон'],
    subraces: []
  },
  {
    id: 'lizardfolk', url: 'https://dnd.su/race/179-lizardfolk/', name: 'Людоящер', nameEn: 'Lizardfolk', source: 'VGM',
    icon: '🦕', size: 'Средний', speed: 30, swimSpeed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2, МДР:1},
    skillChoices: {count: 2, from: ['Восприятие', 'Выживание', 'Природа', 'Скрытность', 'Уход за животными']},
    toolChoice: {count:1, from:['Инструменты кожевника', 'Инструменты корзинщика', 'Инструменты гончара']},
    traits: 'Кусание, Хитрый ремесленник, Задержка дыхания 15 мин, Природный доспех КД 13+Ловк',
    languages: ['Общий', 'Драконий'],
    subraces: []
  },
  {
    id: 'minotaur', url: 'https://dnd.su/race/181-minotaur/', name: 'Минотавр', nameEn: 'Minotaur', source: 'GGR',
    icon: '🐂', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    skillChoices: {count: 1, from: ['Запугивание', 'Убеждение']},
    traits: 'Бодание, Мощная сборка, Рогатый заряд, Лабиринтная память',
    languages: ['Общий', 'Язык Минотавров'],
    subraces: []
  },
  {
    id: 'orc', url: 'https://dnd.su/race/187-orc/', name: 'Орк', nameEn: 'Orc', source: 'VGM',
    icon: '💪', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    skillChoices: {count: 2, from: ['Восприятие', 'Выживание', 'Запугивание', 'Медицина', 'Природа', 'Проницательность', 'Уход за животными.']},
    traits: 'Тёмное зрение 60 фут., Агрессивность, Мощная сборка, Мрачная зоркость',
    languages: ['Общий', 'Орочий'],
    subraces: []
  },
  {
    id: 'plasmoid', url: 'https://dnd.su/multiverse/race/217-plasmoid/', name: 'Плазмоид', nameEn: 'Plasmoid', source: 'SAS',
    icon: '🧫', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Аморфность, Задержка дыхания, Природная устойчивость (кислота, яд), Собственное изменение',
    languages: ['Общий'],
    subraces: []
  },
  {
    id: 'half_orc', url: 'https://dnd.su/race/85-half-orc/', name: 'Полуорк', nameEn: 'Half-orc', source: 'PH14',
    icon: '🪓', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    skills: ['Запугивание'],
    traits: 'Тёмное зрение 60 фут., Угрожающий (Запугивание), Неустанная стойкость, Дикие атаки',
    languages: ['Общий', 'Орочий'],
    subraces: [
      { id: 'half_orc_rlw',    name: 'Метка поиска (RLW)',  source: 'RLW',  asiMode: 'fixed', asiOverride: true, asi: {МДР:2, ТЕЛ:1}, languages: ['Гоблинский'], traits: 'Обереги и печати, Заклинания метки' },
    ]
  },
  {
    id: 'halfling', url: 'https://5e14.dnd.su/race/80-halfling/', name: 'Полурослик', nameEn: 'Halfling', source: 'PH14',
    icon: '🍀', size: 'Маленький', speed: 25,
    asiMode: 'fixed', asi: {ЛОВ: 2},
    traits: 'Везение, Храбрость, Проворность',
    languages: ['Общий', 'Язык Полуросликов'],
    subraces: [
      { id: 'lightfoot',     name: 'Легконогий',            source: 'PH14', asiMode: 'fixed', asi: {ХАР: 1}, traits: 'Природная скрытность' },
      { id: 'stout',         name: 'Коренастый',            source: 'PH14', asiMode: 'fixed', asi: {ТЕЛ: 1}, traits: 'Крепкость (преимущество яд, устойчивость к яду)' },
      { id: 'ghostwise',     name: 'Призрачный',            source: 'SCAG', asiMode: 'fixed', asi: {МДР: 1}, traits: 'Безмолвная речь (телепатия 30 фут.)' },
      { id: 'halfling_egw',  name: 'Полурослик (EGW)',      source: 'EGtW',  asiMode: 'fixed', asi: {МДР: 1}, traits: 'Дитя леса, Блуждание по лесу' },
      { id: 'hillmark_rlw',  name: 'Метка исцеления (RLW)', source: 'RLW',  asiMode: 'fixed', asi: {МДР: 1}, traits: 'Врачебная интуиция, Исцеляющее прикосновение, Заклинания метки' },
      { id: 'guestmark_rlw', name: 'Метка исцеления (RLW)', source: 'RLW',  asiMode: 'fixed', asi: {ХАР: 1}, traits: 'Всегда гостеприимен, Магия трактирщика, Заклинания метки' },
    ]
  },
  {
    id: 'half_elf', url: 'https://dnd.su/race/84-half-elf/', name: 'Полуэльф', nameEn: 'Half-elf', source: 'PH14',
    icon: '🧝🏻', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'halfelf', asi: {ХАР:2},
    asiExtra: {count:2, any:true, excludes:['ХАР']},
    skillChoices: {count: 2, any: true},
    traits: 'Тёмное зрение 60 фут., Бонус к навыку фей, Универсальность (2 любых навыка)',
    languages: ['Общий', 'Эльфийский', 'на выбор'],
    subraces: [
      { id: 'faeroon',       name: 'Полуэльф Фаэруна (SCAG)', source: 'SCAG', traits: '' },
      { id: 'lookmark_rlw',  name: 'Метка обнаружения (RLW)', source: 'RLW',  asiMode: 'partial', asiMode: 'partial', asiOverride: true, asi: {МДР: 2}, asiChoice: {count: 1, any: true, exclude: ['МДР']}, traits: 'Дедуктивная интуиция, Магическое обнаружение, Заклинания метки' },
      { id: 'stormmark_rlw', name: 'Метка бури (RLW)',        source: 'RLW',  asiMode: 'fixed', asiOverride: true, asi: {ХАР:2, ЛОВ:1},                                                                     traits: 'Интуиция ветродела, Благословение бури, Встречные ветра, Заклинания метки' },
    ]
  },
  {
    id: 'satyr', url: 'https://dnd.su/race/182-satyr/', name: 'Сатир', nameEn: 'Satyr', source: 'MOT',
    icon: '🐐', size: 'Средний', speed: 35,
    asiMode: 'fixed', asi: {ХАР: 2, ЛОВ: 1},
    skills: ['Выступление', 'Убеждение'],
    toolChoice: {count: 1, category: 'musical'},
    traits: 'Магическое сопротивление, Рогатый удар (1к4+СИЛ), Мирское чутьё',
    languages: ['Общий', 'Сильван'], 
    subraces: []
  },
  {
    id: 'owlin', url: 'https://dnd.su/race/206-owlin/', name: 'Совлин', nameEn: 'Owlin', source: 'SCC',
    icon: '🦉', size: 'Средний', speed: 30, flySpeed: 30, darkvision: 120, 
    asiMode: 'flex2', asi: {},
    traits: 'Тёмное зрение 120 фут., Бесшумный полёт 30 фут.',
    skills: ['Скрытность'],
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'tabaxi', url: 'https://dnd.su/race/183-tabaxi/', name: 'Табакси', nameEn: 'Tabaxi', source: 'VGM',
    icon: '🐱', size: 'Средний', speed: 30, climbSpeed: 20, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2, ХАР:1},
    skills: ['Восприятие', 'Скрытность'],
    traits: 'Тёмное зрение, Кошачья ловкость, Кошачьи когти',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'tiefling', url: 'https://5e14.dnd.su/race/86-tiefling/', name: 'Тифлинг', nameEn: 'Tiefling', source: 'PH14',
    icon: '😈', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ИНТ: 1, ХАР: 2},
    traits: 'Тёмное зрение 60 фут., Инфернальное наследие (тематические заклинания), Устойчивость к огню',
    languages: ['Общий', 'Инфернальный'],
    subraces: [
      // Асмодей: базовые ИНТ+1, ХАР+2 от родительской расы
      { id: 'asmodeus',      name: 'Асмодей',          source: 'PH14', traits: 'Чудотворство (1 ур.), Адское возмездие (3 ур.), Тьма (5 ур.)' },
      // Ваалзебул: ИНТ+1, ХАР+2
      { id: 'baalzebul',     name: 'Вельзевул',        source: 'MTF',  traits: 'Чудотворство (1 ур.), Луч болезни (3 ур.), Корона безумия (5 ур.)' },
      // Диспатер: ХАР+2, ЛОВ+1 (переопределяет ИНТ+1)
      { id: 'dispater',      name: 'Диспатер',         source: 'MTF',  asiOverride: true, asi: {ХАР: 2, ЛОВ: 1}, traits: 'Чудотворство (1 ур.), Маскировка (3 ур.), Обнаружение мыслей (5 ур.)' },
      // Фиерна: МДР+1, ХАР+2 (переопределяет ИНТ+1)
      { id: 'fierna',        name: 'Фьёрна',           source: 'MTF',  asiOverride: true, asi: {МДР: 1, ХАР: 2}, traits: 'Дружба (1 ур.), Очарование личности (3 ур.), Внушение (5 ур.)' },
      // Гласья: ХАР+2, ЛОВ+1 (переопределяет ИНТ+1)
      { id: 'glasya',        name: 'Гласия',           source: 'MTF',  asiOverride: true, asi: {ХАР: 2, ЛОВ: 1}, traits: 'Малая иллюзия (1 ур.), Маскировка (3 ур.), Невидимость (5 ур.)' },
      // Левист: ТЕЛ+1, ХАР+2 (переопределяет ИНТ+1)
      { id: 'levistus',      name: 'Левистус',         source: 'MTF',  asiOverride: true, asi: {ТЕЛ: 1, ХАР: 2}, traits: 'Луч холода (1 ур.), Доспех Агатиса (3 ур.), Тьма (5 ур.)' },
      // Маммон: ИНТ+1, ХАР+2
      { id: 'mammon',        name: 'Маммон',           source: 'MTF',  traits: 'Волшебная рука (1 ур.),  Тензеров парящий диск (3 ур.), Волшебный замок (5 ур.)' },
      // Мефистофель: ИНТ+2, ХАР+1 (переопределяет)
      { id: 'mephistopheles',name: 'Мефистофель',      source: 'MTF',  asiOverride: true, asi: {ИНТ: 2, ХАР: 1}, traits: 'Волшебная рука (1 ур.), Огненные ладони (3 ур.), Горящий клинок (5 ур.)' },
      // Зариэль: СИЛ+1, ХАР+2 (переопределяет ИНТ+1)
      { id: 'zariel',        name: 'Зариэль',          source: 'MTF',  asiOverride: true, asi: {СИЛ: 1, ХАР: 2}, traits: 'Чудотворство (1 ур.), Палящая кара (3 ур.), Клеймящая кара (5 ур.)' },
      // Дикий: ЛОВ+2, ИНТ+1 (полностью заменяет)
      { id: 'feral',         name: 'Дикий',            source: 'SCAG', asiMode: 'fixed', asiOverride: true, asi: {ЛОВ: 2, ИНТ: 1}, traits: 'Дьявольский язык или Адское пламя или Крылатый' },
      { id: 'deep',          name: 'Бездна',           source: 'UA',   asiMode: 'fixed', asiOverride: true, asi: {ХАР: 2, ТЕЛ: 1}, languages: ['Язык Бездны'], traits: 'Магия Бездны, Стойкость Бездны' },
    ]
  },
  {
    id: 'tortle', url: 'https://dnd.su/race/184-tortle/', name: 'Тортл', nameEn: 'Tortle', source: 'TP',
    icon: '🐢', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {СИЛ:2, МДР:1},
    skills: ['Выживание'],
    traits: 'Природный доспех (КД=17), Когти (1к4), Внешняя раковина (Защита)',
    languages: ['Общий', 'Акван'],
    subraces: []
  },
  {
    id: 'thri_kreen', url: 'https://dnd.su/multiverse/race/218-thri-kreen/', name: 'Три-крин', nameEn: 'Thri-kreen', source: 'SAS',
    icon: '🦗', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Панцирь-хамелеон, Тёмное зрение, Множественные конечности, Псионика три-крин',
    languages: ['Общий', 'Три-крин'],
    subraces: []
  },
  {
    id: 'triton', url: 'https://dnd.su/race/188-triton/', name: 'Тритон', nameEn: 'Triton', source: 'VGM',
    icon: '🧜‍♂️', size: 'Средний', swimSpeed: 30, swimSpeed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {СИЛ:1, ТЕЛ:1, ХАР:1},
    traits: 'Управление водой (заклинания), Тёмное зрение 60 фут., Амфибийность, Плавание 30 фут.',
    languages: ['Общий', 'Первичный'],
    subraces: []
  },
  {
    id: 'firbolg', url: 'https://dnd.su/race/185-firbolg/', name: 'Фирболг', nameEn: 'Firbolg', source: 'VGM',
    icon: '🌲', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {МДР:2, СИЛ:1},
    traits: 'Фирболгская магия (Обнаружение магии, Маскировка), Скрытый шаг, Мощная сборка',
    languages: ['Общий', 'Эльфийский', 'Великаний'],
    subraces: []
  },
  {
    id: 'fairy', url: 'https://dnd.su/race/204-fairy/', name: 'Фэйри', nameEn: 'Fairy', source: 'WBW',
    icon: '🧚', size: 'Маленький', speed: 30, flySpeed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Полёт 30 фут., Фейская магия, Осколочный скачок',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'hadozee', url: 'https://dnd.su/multiverse/race/216-hadozee/', name: 'Хадози', nameEn: 'Hadozee', source: 'SAS',
    icon: '🐵', size: 'Средний', speed: 30, climbSpeed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Карабканье, Рассчитанное падение,Ловкие ступни',
    languages: ['Общий'],
    subraces: [
    ]
  },
  {
    id: 'hobgoblin', url: 'https://dnd.su/race/168-hobgoblin/', name: 'Хобгоблин', nameEn: 'Hobgoblin', source: 'VGM',
    icon: '🧟', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ТЕЛ:2, ИНТ:1},
    weaponProf: ['Два воинских оружия на выбор'],
    armorProf: ['Лёгкие доспехи'],
    traits: 'Тёмное зрение, Военная подготовка, Сохранить лицо',
    languages: ['Общий', 'Гоблинский'],
    subraces: [
      { id: 'hobgoblin_rlw', name: 'Хобгоблин (RLW)',  source: 'RLW',  traits: 'Спасение репутации' },
    ]
  },
  {
    id: 'changeling', url: 'https://dnd.su/race/170-changeling/', name: 'Чейнджлинг', nameEn: 'Changeling', source: 'RLW',
    icon: '🎭', size: 'Средний', speed: 30,
    asiMode: 'partial', asi: {ХАР: 2}, asiChoice: {count: 1, any: true, exclude: ['ХАР']},
    skillChoices: {count: 2, from: ['Запугивание', 'Обман', 'Проницательность', 'Убеждение']},
    traits: 'Перевёртыш, Инстинкты чейнджлинга',
    languages: ['Общий', 'на выбор', 'на выбор'],
    subraces: []
  },
  {
    id: 'human', url: 'https://5e14.dnd.su/race/81-human/', name: 'Человек', nameEn: 'Human', source: 'PH14',
    icon: '👤', size: 'Средний', speed: 30,
    asiMode: 'all+1', asi: {СИЛ:1,ЛОВ:1,ТЕЛ:1,ИНТ:1,МДР:1,ХАР:1},
    traits: 'Стандартный: все характеристики +1. Вариантный: 2 хар-ки +1, черта, навык.',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'standard', name: 'Стандартный',  source: 'PH14', asiMode: 'all+1', asi: {}, traits: 'Все характеристики +1' },
      { id: 'variant',  name: 'Вариантный',   source: 'PH14', asiMode: 'variant', asi: {}, skillChoices: {count:1, from: 'all'}, traits: '2 характеристики +1, 1 черта, 1 навык (по выбору)' },
      { id: 'searchmark_rlw',    name: 'Метка поиска (RLW)',  source: 'RLW',  asiMode: 'fixed',   asiOverride: true, asi: {МДР:2, ТЕЛ:1}, darkvision: 60,                                                                          traits: 'Тёмное зрение, Интуиция охотника, Магия искателя, Заклинания метки' },
      { id: 'escapemark_rlw',    name: 'Метка ухода (RLW)',   source: 'RLW',  asiMode: 'partial', asiOverride: true, asi: {МДР:2}, asiChoice: {count: 1, any: true, exclude: ['МДР']},                                             traits: 'Дикая интуиция, Первобытная связь, Чем крупнее противник..., Заклинания метки' },
      { id: 'createmark_rlw',    name: 'Метка создания (RLW)',source: 'RLW',  asiMode: 'partial', asiOverride: true, asi: {ИНТ:2}, asiChoice: {count: 1, any: true, exclude: ['ИНТ']}, toolChoice: {count:1, category: 'artisan'}, traits: 'Интуиция ремесленника, Дар творца, Кузнечная магия, Заклинания метки' },
      { id: 'overmark_rlw',      name: 'Метка прохода (RLW)', source: 'RLW',  asiMode: 'partial', asiOverride: true, asi: {ЛОВ:2}, asiChoice: {count: 1, any: true, exclude: ['ЛОВ']}, speed: 35,                                  traits: 'Скорость курьера, Интуитивное движение, Магический проход, Заклинания метки' },
      { id: 'guardianmark_rlw',  name: 'Метка стража (RLW)',  source: 'RLW',  asiMode: 'fixed',   asiOverride: true, asi: {МДР:1, ТЕЛ:2},                                                                                          traits: 'Интуиция стража, Щит стража, Бдительный страж, Заклинания метки' },
    ]
  },
  {
    id: 'shifter', url: 'https://dnd.su/race/186-shifter/', name: 'Шифтер', nameEn: 'Shifter', source: 'RLW',
    icon: '🐺', size: 'Средний', speed: 30, darkvision: 60,
    traits: 'Тёмное зрение, Смена облика',
    languages: ['Общий'],
    subraces: [
      { id: 'beasthide',  name: 'Зверошкур',       source: 'RLW', asiMode: 'fixed', asi: {ТЕЛ: 2, СИЛ:1}, skills: ['Атлетика'],    traits: 'Крепкий, Особенности смены формы' },
      { id: 'longtooth',  name: 'Длиннозуб',       source: 'RLW', asiMode: 'fixed', asi: {СИЛ: 2, ЛОВ:1}, skills: ['Запугивание'], traits: 'Жестокость, Особенности смены формы' },
      { id: 'swiftstride',name: 'Быстроног',       source: 'RLW', asiMode: 'fixed', asi: {ХАР: 1, ЛОВ:2}, skills: ['Акробатика'],  traits: 'Грация, Особенности смены формы' },
      { id: 'wildhunt',   name: 'Дикий охотник',   source: 'RLW', asiMode: 'fixed', asi: {МДР: 2, ЛОВ:1}, skills: ['Выживание'],   traits: 'Следопыт от природы, Помеченная цель, Особенности смены формы' },
    ]
  },
  {
    id: 'elf', url: 'https://5e14.dnd.su/race/79-elf/', name: 'Эльф', nameEn: 'Elf', source: 'PH14',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ: 2},
    skills: ['Восприятие'],
    traits: 'Тёмное зрение, Обострённые чувства, Наследие фей, Транс',
    languages: ['Общий', 'Эльфийский'],
    subraces: [
      { id: 'high',           name: 'Высший эльф',         source: 'PH14', asiMode: 'fixed', asi: {ИНТ: 1}, weaponProf: ['Длинный меч', 'Короткий меч', 'Короткий лук', 'Длинный лук'], languages: ['на выбор'], traits: 'Эльфийское боевое обучение, Заговор' },
      { id: 'wood',           name: 'Лесной эльф',         source: 'PH14', asiMode: 'fixed', asi: {МДР: 1}, weaponProf: ['Длинный меч', 'Короткий меч', 'Короткий лук', 'Длинный лук'], speed: 35,               traits: 'Эльфийское боевое обучение, Быстрые ноги, Маскировка в природе' },
      { id: 'dark',           name: 'Тёмный эльф (дроу)',  source: 'PH14', asiMode: 'fixed', asi: {ХАР: 1}, weaponProf: ['Рапира', 'Ручной арбалет', 'Короткий меч'],              darkvision: 120,         traits: 'Превосходное тёмное зрение, Чувствительность к солнцу, Магия дроу'},
      { id: 'pallid',         name: 'Бледный эльф',        source: 'EGtW',  asiMode: 'fixed', asi: {МДР: 1},                                                                                           traits: 'Острый ум, Благословение Лунного ткача' },
      { id: 'sea',            name: 'Морской эльф',        source: 'MTF',  asiMode: 'fixed', asi: {ТЕЛ: 1}, weaponProf: ['Копьё', 'Трезубец', 'Лёгкий арбалет', 'Сеть'], swimSpeed: 30, languages: ['Акван'], traits: 'Боевая подготовка морских эльфов, Плавание, Амфибия' },
      { id: 'shadar_kai',     name: 'Шадар-кай',           source: 'MTF',  asiMode: 'fixed', asi: {ТЕЛ: 1},                                                                                           traits: 'Некротическое сопротивление, Благословение Королевы воронов' },
      { id: 'eladrin',        name: 'Эладрин',             source: 'MTF',  asiMode: 'fixed', asi: {ХАР: 1},                                                                                           traits: 'Фейский шаг' },
      { id: 'shadowmark_rlw', name: 'Метка тени (RLW)',    source: 'RLW',  asiMode: 'fixed', asi: {ХАР: 1},                                                                                           traits: 'Интуиция лукавого, Очертания теней, Заклинания метки' },
      { id: 'avariel',        name: 'Авариэль',            source: 'UA',   flySpeed: 30, languages: ['Ауран'],                                                                                        traits: 'Полёт' },
      { id: 'grugach',        name: 'Гругач',              source: 'UA',   asiMode: 'fixed', asi: {СИЛ: 1}, weaponProf: ['Копьё', 'Короткий лук', 'Длинный лук', 'Сеть'], languages: ['Сильван'],                 traits: 'Боевая подготовка гругачей, Заговор' },
    ]
  },
  {
    id: 'yuan_ti_pureblood', url: 'https://dnd.su/race/189-yuan-ti-pureblood/', name: 'Юань-ти', nameEn: 'Yuan-ti Pureblood', source: 'VGM',
    icon: '🐍', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ИНТ:1, ХАР:2},
    traits: 'Тёмное зрение, Психика юань-ти, Магия юань-ти, Иммунитет к яду',
    languages: ['Общий', 'Драконий', 'Язык Бездны'],
    subraces: []
  },
  {
    id: 'hexblood', url: 'https://dnd.su/race/192-hexblood/', name: 'Ведьмовская кровь', nameEn: 'Hexblood', source: 'VRGR',
    icon: '🧙', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 2, any: true},
    traits: 'Тёмное зрение, Ведьмовские знаки, Ведьмовская связь',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  //======================= Происхождения =======================================================================================================================================================================================
  {
    id: 'reborn', url: 'https://dnd.su/race/193-reborn/', name: 'Возрождённый', nameEn: 'Reborn', source: 'VRGR',
    icon: '💀', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 2, any: true},
    traits: 'Неживой: нет нужды есть/дышать, иммунитет к болезни/яду',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'dhampir', url: 'https://dnd.su/race/191-dhampir/', name: 'Дампир', nameEn: 'Dhampir', source: 'VRGR',
    icon: '🧛', size: 'Средний', speed: 35, darkvision: 60, climbSpeed: 35,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 2, any: true},
    traits: 'Тёмное зрение, Укус вампира, Паучье лазание',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'custom_lineage', url: 'https://dnd.su/race/223-custom-lineage/', name: 'Своё происхождение', nameEn: 'Custom lineage', source: 'TCE',
    icon: '✨', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {},
    traits: '1 черта + тёмное зрение ИЛИ 1 навык',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  //====================== Расы Mordenkainen Presents: Monsters of the Multiverse =================================================================================================================================================
  {
    id: 'aarakocra_mpmm', url: 'https://dnd.su/multiverse/race/278-aarakocra/', name: 'Ааракокра (MPMM)', nameEn: 'Aarakocra (MPMM)', source: 'MPMM',
    icon: '🦅', size: 'Средний', speed: 30, flySpeed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Полёт, Когти, Зовущий ветер',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'aasimar_mpmm', url: 'https://dnd.su/multiverse/race/280-aasimar/', name: 'Аасимар (MPMM)', nameEn: 'Aasimar (MPMM)', source: 'MPMM',
    icon: '😇', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение 60 фут., Исцеляющие руки (1к4×уровень), Небесное Откровение (крылья/свет/тьма)',
    languages: ['Общий', 'Небесный'], 
    subraces: []
  },
  {
    id: 'bugbear_mpmm', url: 'https://dnd.su/multiverse/race/281-bugbear/', name: 'Багбир (MPMM)', nameEn: 'Bugbear (MPMM)', source: 'MPMM',
    icon: '👹', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение 60 фут., Скрытное, Удивляющий удар (+2к6 первая атака), Длинные руки (+5 фут.)',
    languages: ['Общий', 'Гоблинский'], 
    subraces: []
  },
  {
    id: 'githzerai_mpmm', url: 'https://dnd.su/multiverse/race/293-githzerai/', name: 'Гитцерай (MPMM)', nameEn: 'Githzerai (MPMM)', source: 'MPMM',
    icon: '🧘', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Психическое Предотвращение, Псионический Усилитель, Щит разума, Прыжок мистика',
    languages: ['Общий', 'Гит'],
    subraces: []
  },
  {
    id: 'githyanki_mpmm', url: 'https://dnd.su/multiverse/race/292-githyanki/', name: 'Гитъянки (MPMM)', nameEn: 'Githyanki (MPMM)', source: 'MPMM',
    icon: '⚔️', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Псионическое Определение, Псионический Усилитель, Прыжок мистика, Призыв психического клинка',
    languages: ['Общий', 'Гит'],
    subraces: []
  },
  {
    id: 'deep_gnome_mpmm', url: 'https://dnd.su/multiverse/race/286-deep-gnome/', name: 'Глубинный гном', nameEn: 'Deep Gnome', source: 'MPMM',
    icon: '⛏️', size: 'Маленький', speed: 30, darkvision: 120,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение, Дар свирфнеблина, Гномье магическое сопротивление, Камуфляж свирфнеблина',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'goblin_mpmm', url: 'https://dnd.su/multiverse/race/294-goblin/', name: 'Гоблин (MPMM)', nameEn: 'Goblin (MPMM)', source: 'MPMM',
    icon: '👺', size: 'Маленький', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение 60 фут., Ярость берсерка, Нимрово Злопамятство, Шустрый побег',
    languages: ['Общий', 'Гоблинский'], subraces: []
  },
  {
    id: 'goliath_mpmm', url: 'https://dnd.su/multiverse/race/295-goliath/', name: 'Голиаф (MPMM)', nameEn: 'Goliath (MPMM)', source: 'MPMM',
    icon: '🏔️', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    skills: 'Атлетика',
    traits: 'Маленький великан, Рождённый в горах, Выносливость камня',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'genasi_mpmm', url: 'https://dnd.su/multiverse/race/291-genasi/', name: 'Дженази (MPMM)', nameEn: 'Genasi (MPMM)', source: 'MPMM',
    icon: '🧞‍♂️', size: 'Средний', darkvision: 60, speed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'air',     name: 'Дженази воздуха',   source: 'MPMM',  speed: 35,           traits: 'Бесконечное дыхание, Сопротивление электричеству, Общение с ветром' },
      { id: 'earth',   name: 'Дженази земли',     source: 'MPMM',                       traits: 'Хождение по земле, Слияние с камнем' },
      { id: 'fire',    name: 'Дженази огня',      source: 'MPMM',                       traits: 'Сопротивление огню, Выброс пламени'},
      { id: 'water',   name: 'Дженази воды',      source: 'MPMM',  swimSpeed: 30,       traits: 'Сопротивление кислоте, Амфибия, Призыв волны' },
    ]
  },
  {
    id: 'duergar_mpmm', url: 'https://dnd.su/multiverse/race/287-duergar/', name: 'Дуэргар (MPMM)', nameEn: 'Duergar (MPMM)', source: 'MPMM',
    icon: '⛏️', size: 'Средний', speed: 25, darkvision: 120,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение 120 фут., Дуэргарская стойкость, Дуэргарская магия (увеличение/невидимость)',
    languages: ['Общий', 'Двергарский'],
    subraces: []
  },
  {
    id: 'harengon_mpmm', url: 'https://dnd.su/multiverse/race/296-harengon/', name: 'Зайцегон (MPMM)', nameEn: 'Harengon (MPMM)', source: 'MPMM',
    icon: '🐰', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    skills: ['Восприятие'],
    traits: 'Заячья резвость, Заячье чутьё, Удачный манёвр, Кроличий прыжок',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'kenku_mpmm', url: 'https://dnd.su/multiverse/race/298-kenku/', name: 'Кенку (MPMM)', nameEn: 'Kenku (MPMM)', source: 'MPMM',
    icon: '🐦', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 2, any: true},
    traits: 'Экспертная подделка, Воспоминания кенку, Имитирование',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'centaur_mpmm', url: 'https://dnd.su/multiverse/race/282-centaur/', name: 'Кентавр (MPMM)', nameEn: 'Centaur (MPMM)', source: 'MPMM',
    icon: '🐴', size: 'Средний', speed: 40,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 1, from: ['Уход за животными', 'Медицина', 'Природа', 'Выживание']},
    traits: 'Разбег, Лошадиное телосложение, Копыта, Близость с природой',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'kobold_mpmm', url: 'https://dnd.su/multiverse/race/299-kobold/', name: 'Кобольд (MPMM)', nameEn: 'Kobold (MPMM)', source: 'MPMM',
    icon: '🐉', size: 'Маленький', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение, Рёв дракона, Наследие кобольдов',
    languages: ['Общий', 'на выбор'], 
    subraces: [
      { id: 'cunning',              name: 'Хитрость',                  source: 'MPMM',  skillChoices: {count: 1, from: ['Магия', 'Расследование', 'Медицина', 'Ловкость рук', 'Выживание']},       traits: 'Владение навыком' },
      { id: 'defiance',             name: 'Неповиновение',             source: 'MPMM',                                                                                                             traits: 'Преимущество в спасбросках' },
      { id: 'dragon_witchcraft',    name: 'Драконье чародейство',      source: 'MPMM',                                                                                                             traits: 'Заговор'}, 
    ]
  },
  {
    id: 'lizardfolk_mpmm', url: 'https://dnd.su/multiverse/race/300-lizardfolk/', name: 'Людоящер (MPMM)', nameEn: 'Lizardfolk (MPMM)', source: 'MPMM',
    icon: '🦎', size: 'Средний', speed: 30, swimSpeed: 30,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 2, from: ['Уход за животными', 'Медицина', 'Природа', 'Восприятие', 'Скрытность', 'Выживание']},
    traits: 'Укус, Задерживание дыхания, Голодная пасть, Природный доспех, Природная интуиция',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'minotaur_mpmm', url: 'https://dnd.su/multiverse/race/301-minotaur/', name: 'Минотавр (MPMM)', nameEn: 'Minotaur (MPMM)', source: 'MPMM',
    icon: '🐂', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Рога, Пронзающий натиск, Сокрушительные рога, Зов лабиринта',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'sea_elf_mpmm', url: 'https://dnd.su/multiverse/race/304-sea-elf/', name: 'Морской эльф', nameEn: 'Sea Elf', source: 'MPMM',
    icon: '🌊', size: 'Средний', speed: 30, swimSpeed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    skills: ['Восприятие'],
    traits: 'Тёмное зрение, Наследие фей, Дитя морей, Друг морей, Обострённые чувства, Транс',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'orc_mpmm', url: 'https://dnd.su/multiverse/race/302-orc/', name: 'Орк (MPMM)', nameEn: 'Orc (MPMM)', source: 'MPMM',
    icon: '🐗', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение, Выброс адреналина, Мощное телосложение, Непоколебимая стойкость',
    languages: ['Общий', 'на выбор'], 
    subraces: []
  },
  {
    id: 'satyr_mpmm', url: 'https://dnd.su/multiverse/race/303-satyr/', name: 'Сатир (MPMM)', nameEn: 'Satyr (MPMM)', source: 'MPMM',
    icon: '🎷', size: 'Средний', speed: 35,
    asiMode: 'choice', asi: {},
    skills: ['Выступление', 'Убеждение'],
    toolChoice: {count: 1, category: 'musical'},
    traits: 'Таран, Сопротивление магии, Зрелищные прыжки, Гуляка',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
   {
    id: 'tabaxi_mpmm', url: 'https://dnd.su/multiverse/race/307-tabaxi/', name: 'Табакси (MPMM)', nameEn: 'Tabaxi (MPMM)', source: 'MPMM',
    icon: '🐱', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    skills: ['Восприятие', 'Скрытность'],
    traits: 'Тёмное зрение, Кошачьи когти, Кошачьи способности, Кошачье проворство',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'tortle_mpmm', url: 'https://dnd.su/multiverse/race/309-tortle/', name: 'Тортл (MPMM)', nameEn: 'Tortle (MPMM)', source: 'MPMM',
    icon: '🐢', size: 'Средний', speed: 30, 
    asiMode: 'choice', asi: {},
    skillChoices: {count: 1, from: ['Уход за животными', 'Медицина', 'Природа', 'Восприятие', 'Скрытность', 'Выживание']},
    traits: 'Когти, Задерживание дыхания, Природный доспех, Природная интуиция, Панцирная защита',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'triton_mpmm', url: 'https://dnd.su/multiverse/race/310-triton/', name: 'Тритон (MPMM)', nameEn: 'Triton (MPMM)', source: 'MPMM',
    icon: '🧜‍♂️', size: 'Средний', speed: 30, swimSpeed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение, Амфибия, Управление воздухом и водой, Посланник моря, Стражи глубин',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'firbolg_mpmm', url: 'https://dnd.su/multiverse/race/290-firbolg/', name: 'Фирболг (MPMM)', nameEn: 'Firbolg (MPMM)', source: 'MPMM',
    icon: '🌲', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Магия фирболгов, Незримая поступь, Мощное телосложение, Язык зверей и листвы',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'fairy_mpmm', url: 'https://dnd.su/multiverse/race/289-fairy/', name: 'Фэйри (MPMM)', nameEn: 'Fairy (MPMM)', source: 'MPMM',
    icon: '🧚', size: 'Маленький', speed: 30, flySpeed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Магия фей, Полёт',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'hobgoblin_mpmm', url: 'https://dnd.su/multiverse/race/297-hobgoblin/', name: 'Хобгоблин (MPMM)', nameEn: 'Hobgoblin (MPMM)', source: 'MPMM',
    icon: '👺', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение, Наследие фей, Дар фей, Удача множества',
    languages: ['Общий', 'на выбор'], 
    subraces: []
  },
  {
    id: 'changeling_mpmm', url: 'https://dnd.su/multiverse/race/283-changeling/', name: 'Чейнджлинг (MPMM)', nameEn: 'Changeling (MPMM)', source: 'MPMM',
    icon: '🎭', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 2, from: ['Запугивание', 'Обман', 'Проницательность', 'Выступление', 'Убеждение']},
    traits: 'Инстинкты чейнджлинга, Перевёртыш',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'shadar_kai_mpmm', url: 'https://dnd.su/multiverse/race/305-shadar-kai/', name: 'Шадар-кай (MPMM)', nameEn: 'Shadar-kai (MPMM)', source: 'MPMM',
    icon: '🌑', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    skills: ['Восприятие'],
    traits: 'Тёмное зрение, Наследие фей, Благословение Королевы воронов, Некротическое сопротивление, Обострённые чувства, Транс',
    languages: ['Общий', 'на выбор'], 
    subraces: []
  },
  {
    id: 'shifter_mpmm', url: 'https://dnd.su/multiverse/race/306-shifter/', name: 'Шифтер (MPMM)', nameEn: 'Shifter (MPMM)', source: 'MPMM',
    icon: '🐾', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    skillChoices: {count: 1, from: ['Акробатика', 'Атлетика', 'Запугивание', 'Выживание']},
    traits: 'Звериные инстинкты, Тёмное зрение, Смена формы',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'eladrin_mpmm', url: 'https://dnd.su/multiverse/race/288-eladrin/', name: 'Эладрин (MPMM)', nameEn: 'Eladrin (MPMM)', source: 'MPMM',
    icon: '🍂', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    skills: ['Восприятие'],
    traits: 'Тёмное зрение, Наследие фей, Фейский шаг, Обострённые чувства, Транс',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'yuan_ti_mpmm', url: 'https://dnd.su/multiverse/race/311-yuan-ti/', name: 'Юань-ти (MPMM)', nameEn: 'Yuan-Ti (MPMM)', source: 'MPMM',
    icon: '🐍', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Тёмное зрение, Сопротивление магии, Сопротивление яду, Змеиные заклинания',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
   
  //============ Расы Unearthed Arcana =========================================================================================================================================================================
  
  {
    id: 'glitchling', url: 'https://dnd.su/homebrew/race/367-glitchling/', name: 'Глючный', nameEn: 'Glitchling', source: 'UA',
    icon: '⚡', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {},
    traits: 'Бронированное покрытие, Баланс Хаоса, Живая конструкция, Упорядоченный разум, Рудиментарные крылья',
    languages: ['Общий'],
    subraces: []
  },
  {
    id: 'revenant', url: 'https://dnd.su/homebrew/race/275-revenant/', name: 'Ревенант', nameEn: 'Revenant', source: 'UA',
    icon: '💀', size: 'Средний',
    asiMode: 'fixed', asi: {ТЕЛ:1},
    traits: 'Безжалостная природа',
    languages: ['Общий'],
    subraces: []
  },
  {
    id: 'hobgoblin_of_the_feywild', url: 'https://dnd.su/homebrew/race/205-hobgoblin-of-the-feywild/', name: 'Хобгоблин из Страны Фей', nameEn: 'Hobgoblin of the Feywild', source: 'UA',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {},
    traits: 'Тёмное зрение, Наследие фей, Дары фей, Удача в толпе',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },

  //============ Расы Plane Shift: Amonkhet ================================================================================================================================================================ 
  {
    id: 'aven', url: 'https://dnd.su/homebrew/race/329-aven/', name: 'Авен', nameEn: 'Aven', source: 'PS:A',
    icon: '🦆', size: 'Средний', speed: 25, flySpeed: 30,
    asiMode: 'fixed', asi: {ЛОВ:2},
    traits: '',
    languages: ['Общий', 'Авен'],
    subraces: [
      { id: 'ibis',      name: 'Ибисоголовый',   source: 'PS:A', asiMode: 'fixed', asi: {ИНТ: 1}, traits: 'Благословение Кефнета' },
      { id: 'hawk',      name: 'Ястребоголовый',    source: 'PS:A', asiMode: 'fixed', asi: {МДР: 2}, traits: 'Глаз ястреба' }
    ]
  },
  {
    id: 'minotaur_psa', url: 'https://dnd.su/homebrew/race/328-minotaur/', name: 'Минотавр (PS:A)', nameEn: 'Minotaur (PS:A)', source: 'PS:A',
    icon: '🐂', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    skills: ['Запугивание'],
    traits: 'Естественное оружие, Угрожающий вид, Непоколебимая стойкость, Свирепые атаки',
    languages: ['Общий', 'Язык Минотавров'],
    subraces: []
  },
  {
    id: 'naga', url: 'https://dnd.su/homebrew/race/221-naga/', name: 'Нага', nameEn: 'Naga', source: 'PS:A',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2, ИНТ:1},
    toolProf: 'Инструменты отравителя',
    traits: 'Ускорение, Естественное оружие, Иммунитет к яду, Родство с ядом',
    languages: ['Общий', 'Язык Наг'],
    subraces: []
  },
  {
    id: 'khenra', url: 'https://dnd.su/homebrew/race/333-khenra/', name: 'Хенра', nameEn: 'Khenra', source: 'PS:A',
    icon: '🐺', size: 'Средний', speed: 35,
    asiMode: 'fixed', asi: {ЛОВ:2, СИЛ:1},
    traits: 'Боевая подготовка хенра, Близнецы хенра',
    languages: ['Общий', 'Хенра'],
    weaponProf: ['Хопеш', 'Копьё', 'Метательное копьё'],
    subraces: []
  },
  {
    id: 'human_psa', url: 'https://dnd.su/homebrew/race/332-human/', name: 'Человек (PS:A)', nameEn: 'Human (PS:A)', source: 'PS:A',
    icon: '👤', size: 'Средний', speed: 30,
    asiMode: 'variant', asi: {},
    skillChoices: {count: 1, any: true},
    traits: 'Навыки, Черта',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },

    //======================= Расы Plane Shift: Innistrad ================================================================================================================================================
  {
    id: 'people_of_innistrad', url: 'https://dnd.su/homebrew/race/336-people-of-innistrad/', name: 'Люди Иннистрада', nameEn: 'People of Innistrad', source: 'PS:In',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {},
    traits: 'Провинциальное происхождение',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'gevona',      name: 'Гевона',   source: 'PS:In', asiMode: 'all+1', asi: {СИЛ:1,ЛОВ:1,ТЕЛ:1,ИНТ:1,МДР:1,ХАР:1},                        traits: '' },
      { id: 'kessig',      name: 'Кессиг',   source: 'PS:In', asiMode: 'fixed', asi: {МДР: 1, ЛОВ: 1}, speed: 40, skills: ['Выживание'],           traits: 'Надёжный, Быстрая атака' },
      { id: 'nefalia',     name: 'Нефалия',  source: 'PS:In', asiMode: 'fixed', asi: {ИНТ: 1, ХАР: 1}, skillOrToolChoice: {count: 4, any: true},   traits: 'Обширность знаний'},
      { id: 'stensia',     name: 'Стенсия',  source: 'PS:In', asiMode: 'fixed', asi: {СИЛ: 1, ТЕЛ: 1}, skills: ['Запугивание'],                    traits: 'Угрожающий вид, Крепкий' }
    ]
  },
  //==================== Расы Midgard Heroes Handbook ====================================================================================================================================================
  {
    id: 'gnoll', url: 'https://dnd.su/homebrew/race/435-gnoll/', name: 'Гнолл', nameEn: 'Gnoll', source: 'HB:MHH',
    icon: '🐗', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {СИЛ: 2},
    weaponProf: ['Копьё', 'Короткий лук', 'Длинный лук', 'Лёгкий арбалет', 'Тяжёлый арбалет'],
    traits: 'Тёмное зрение, Острый нюх, Задира, Жизнь одним днём, Боевая подготовка гноллов',
    languages: ['Южный', 'Гнольский'],
    subraces: [
      { id: 'civilized', name: 'Цивилизованный',   source: 'HB:MHH', asiMode: 'fixed', asi: {ТЕЛ:1},  traits: 'Подобострастный' },
      { id: 'wild',      name: 'Дикий',            source: 'HB:MHH', asiMode: 'fixed', asi: {МДР: 1}, traits: 'Мусорщик' }
    ]
  },
   {
    id: 'gnome_mhh', url: 'https://dnd.su/homebrew/race/436-gnome/', name: 'Гном (MHH)', nameEn: 'Gnome (MHH)', source: 'HB:MHH',
    icon: '🔧', size: 'Маленький', speed: 25, darkvision: 60,
    asiMode: 'fixed', asi: {ИНТ:2, ХАР:1},
    traits: 'Тёмное зрение, Гномья хитрость, Невероятные переговорщики, Известны в аду',
    languages: ['Общий', 'Гномий', 'Инфернальный'],
    subraces: []
  },
  {
    id: 'dhampir_mhh', url: 'https://dnd.su/homebrew/race/431-dhampir/', name: 'Дампир (MHH)', nameEn: 'Dhampir (MHH)', source: 'HB:MHH',
    icon: '🧛', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ХАР:2, ЛОВ:1},
    skills: ['Убеждение'],
    traits: 'Тёмное зрение, Тёмная жажда, Обаяние хищника, Сопротивление вампира',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'dwarf_mhh', url: 'https://dnd.su/homebrew/race/432-dwarf/', name: 'Дварф (MHH)', nameEn: 'Dwarf (MHH)', source: 'HB:MHH',
    icon: '⛏️', size: 'Средний', speed: 25, darkvision: 60,
    asiMode: 'fixed', asi: {ТЕЛ:2},
    weaponProf: ['Боевой топор', 'Ручной топор', 'Лёгкий молот', 'Боевой молот'],
    toolChoice: {count: 1, from: ['Инструменты кузнеца', 'Инструменты пивовара', 'Инструменты каменщика']},
    traits: 'Тёмное зрение, Дварфская устойчивость, Дварфская боевая тренировка, Владение инструментами, Знание камня',
    languages: ['Общий', 'Дварфийский'],
    subraces: [
      { id: 'north',    name: 'Дварфы Северных земель',   source: 'HB:MHH', asiMode: 'fixed', asi: {СИЛ:2}, armorProf: ['Лёгкие доспехи', 'Средние доспехи'], traits: 'Владение доспехами дварфов' },
      { id: 'kanton',   name: 'Дварфы кантонов',          source: 'HB:MHH', asiMode: 'fixed', asi: {МДР:1},  traits: 'Дварфская выдержка' },
      { id: 'south',    name: 'Дварфы Южных земель',      source: 'HB:MHH', asiMode: 'fixed', asi: {ИНТ:1}, toolProf: ['Инструменты алхимика'], traits: 'Дварфийский мистицизм' }
    ]
  },
  {
    id: 'winterfolk_halflings', url: 'https://dnd.su/homebrew/race/444-winterfolk-halflings/', name: 'Зиморождённые полурослики', nameEn: 'Winterfolk halflings', source: 'HB:MHH',
    icon: '🧝', size: 'Маленький', speed: 25,
    asiMode: 'fixed', asi: {ЛОВ:2, ТЕЛ:1},
    traits: 'Везучий, Храбрый, Проворство полуросликов, Закалённый, Старые души',
    languages: ['Общий', 'Язык Полуросликов'],
    subraces: []
  },
  {
    id: 'centaur_mhh', url: 'https://dnd.su/homebrew/race/430-centaur/', name: 'Кентавр (MHH)', nameEn: 'Centaur (MHH)', source: 'HB:MHH',
    icon: '🐴', size: 'Большой', speed: 40,
    asiMode: 'fixed', asi: {СИЛ:2, МДР:1},
    weaponProf: ['Пика', 'Длинный лук'],
    skills: ['Медицина'],
    traits: 'Естественные атаки, Боевая подготовка кентавров, Рывок с пикой, Торс гуманоида, Четвероногий, Самодостаточность',
    languages: ['Язык Кентавров', 'на выбор'],
    subraces: []
  },
  {
    id: 'kobolds_of_midgard', url: 'https://dnd.su/homebrew/race/438-kobolds-of-midgard/', name: 'Кобольд Мидгарда', nameEn: 'Kobolds of Midgard', source: 'HB:MHH',
    icon: '👺', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2, ИНТ:1},
    toolChoice: {count:1, from:['Инструменты алхимика', 'Инструменты каменщика', 'Инструменты кузнеца', 'Инструменты жестянщика']},
    traits: 'Тёмное зрение, Исподтишка, Чувствительность к солнцу, Изобретатель',
    languages: ['Общий', 'Драконий'],
    subraces: []
  },
  {
    id: 'gearforged', url: 'https://dnd.su/homebrew/race/434-gearforged/', name: 'Кованый (HB:MHH)', nameEn: 'Gearforged (HB:MHH)', source: 'HB:MHH',
    icon: '🤖', size: 'Средний', speed: 30,
    asiMode: 'variant', asi: {},
    traits: 'Механическое тело, Стальная плоть, Прочная конструкция',
    languages: ['Общий', 'Машинная речь'],
    subraces: []
  },
  {
    id: 'human_of_midgard', url: 'https://dnd.su/homebrew/race/437-human-of-midgard/', name: 'Люди Мидгарда', nameEn: 'Human of Midgard', source: 'HB:MHH',
    icon: '🧝', size: 'Средний', speed: 30, 
    traits: '',
    skillChoices: {count:1, from: 'all'},
    subraces: [
      { id: 'elven-marked',      name: 'Отмеченный эльфами',   source: 'HB:MHH', asiMode: 'fixed', asi: {ХАР:2}, asiMode: 'variant', asi: {exclude: 'ХАР'}, darkvision: 60,           languages: ['Общий', 'Эльфийский', 'на выбор'], traits: 'Тёмное зрение, Наследие фей, Универсальность навыков' },
      { id: 'kariva-strangers',  name: 'Странники-каривы',     source: 'HB:MHH', asiMode: 'fixed', asi: {СИЛ: 1, ЛОВ: 1, ХАР: 1}, skills: ['Выступление', 'Выживание'], languages: ['Общий', 'на выбор'],               traits: 'Воины, танцоры, любовники, проклятые' }
    ]
  },
  {
    id: 'ravenfolk', url: 'https://dnd.su/homebrew/race/441-ravenfolk/', name: 'Людоворон', nameEn: 'Ravenfolk', source: 'HB:MHH',
    icon: '🐧', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ЛОВ:2, ХАР:1},
    traits: 'Внезапное нападение, Мимикрия, Обманщик',
    skills: ['Обман', 'Скрытность'],
    languages: ['Северный', 'Наречие Хугинов'],
    subraces: []
  },
  {
    id: 'ratfolk', url: 'https://dnd.su/homebrew/race/440-ratfolk/', name: 'Людокрыса', nameEn: 'Ratfolk', source: 'HB:MHH',
    icon: '🐭', size: 'Маленький', speed: 25, swimSpeed: 10, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2, ИНТ:1, СИЛ:-2},
    traits: 'Пловцы, Тёмное зрение, Проворство, Тактика стаи, Сочувствие грызунам',
    languages: ['Общий'],
    subraces: []
  },
  {
    id: 'bearfolk', url: 'https://dnd.su/homebrew/race/429-bearfolk/', name: 'Людомедведь', nameEn: 'Bearfolk', source: 'HB:MHH',
    icon: '🐻', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {СИЛ: 2},
    traits: 'Укус, Природный доспех, Мощное телосложение, Медвежьи таланты',
    skills: ['Атлетика', 'Восприятие'],
    languages: ['Общий', 'Северный', 'Теневой'],
    subraces: [
      { id: 'grey-hide',    name: 'Серошкурый',   source: 'HB:MHH', asiMode: 'fixed', asi: {ТЕЛ:1},      traits: 'Медвежье объятие, Густой мех' },
      { id: 'clean',        name: 'Чистый',       source: 'HB:MHH', asiMode: 'fixed', asi: {МДР:1},      traits: 'Дары природы, Крепкая воля' }
    ]
  },
  {
    id: 'shadow_fey', url: 'https://dnd.su/homebrew/race/442-shadow-fey/', name: 'Теневая фея', nameEn: 'Shadow fey', source: 'HB:MHH',
    icon: '🧚🏿', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2, ХАР:1},
    traits: 'Тёмное зрение, Обострённые чувства, Наследие фей, Чувствительность к солнцу, Путник во тьме, Боевая подготовка теневых фей, Путь теней, Транс',
    languages: ['Общий', 'Эльфийский', 'Теневой'],
    weaponProf: ['Рапира', 'Короткий меч', 'Короткий лук', 'Длинный лук'],
    skills: ['Восприятие'],
    subraces: []
  },
  {
    id: 'trollkin', url: 'https://dnd.su/homebrew/race/443-trollkin/', name: 'Троллеобразный', nameEn: 'Trollkin', source: 'HB:MHH',
    icon: '🗿', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ТЕЛ:2},
    skills: ['Запугивание'],
    traits: 'Тёмное зрение, Природное оружие, Нечеловеческая живучесть, Наследите страха',
    languages: ['Северный'],
    subraces: [
      { id: 'whispers-in-the-night',    name: 'Шепчущий в ночи',   source: 'HB:MHH', asiMode: 'fixed', asi: {МДР:1},      traits: 'Шепот духов' },
      { id: 'Stonehide',                name: 'Камнешкурый',       source: 'HB:MHH', asiMode: 'fixed', asi: {СИЛ:1},      traits: 'Толстая шкура' }
    ]
  },
  {
    id: 'elf_mhh', url: 'https://dnd.su/homebrew/race/433-elf/', name: 'Эльф (HB:MHH)', nameEn: 'Elf (HB:MHH)', source: 'HB:MHH',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2, ИНТ:1},
    skills: ['Восприятие'],
    weaponProf: ['Длинный меч', 'Короткий меч', 'Короткий лук', 'Длинный лук'],
    traits: 'Тёмное зрение, Обострённые чувства, Наследие фей, Транс',
    languages: ['Общий', 'Эльфийский', 'на выбор'],
    subraces: []
  },

  //================ Расы Homebrew ====================================================================================================================================================================
  {
    id: 'accursed_tiefling', url: 'https://dnd.su/homebrew/race/461-accursed-tiefling/', name: 'Анафемный тифлинг', nameEn: 'Accursed Tiefling', source: 'HB:SGEH',
    icon: '🧝', size: 'Средний', speed: 30, climbSpeed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ХАР: 2, ТЕЛ: 1},
    traits: 'Дитя Черного козла, Тёмное зрение, Потустороннее сопротивление, Наследие тысячи детей, Зов Выводка',
    languages: ['Общий', 'Глубинный'],
    subraces: []
  },
  {
    id: 'elkian', url: 'https://dnd.su/homebrew/race/405-elkian/', name: 'Вапитианец', nameEn: 'Elkian', source: 'HB',
    icon: '🧝', size: 'Средний', speed: 35, darkvision: 60,
    asiMode: 'fixed', asi: {ХАР:2, МДР:1},
    skills:['Убеждение'],
    traits: 'Благородное присутствие, Тёмное зрение, Защитник, Рога',
    languages: ['Общий', 'Эльфийский'],
    subraces: []
  },
  {
    id: 'vegepygmy', url: 'https://dnd.su/homebrew/race/112-vegepygmy/', name: 'Вегепигмей', nameEn: 'Vegepygmy', source: 'HB:SC',
    icon: '🧝', size: 'Маленький', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2, ТЕЛ:1},
    skills: ['Восприятие'],
    traits: 'Тёмное зрение, Близость к земле, Внимательный, Растительный камуфляж',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'deep_one_dwarf_yha_nthlei', url: 'https://dnd.su/homebrew/race/471-deep-one-dwarf-yha-nthlei/', name: 'Глубинный дварф (Й\'ха-нтлей)', nameEn: 'Deep One Dwarf (Y\'ha-nthlei)', source: 'HB:SGEH',
    icon: '🧝', size: 'Средний', speed: 25, swimSpeed: 25,
    asiMode: 'fixed', asi: {ТЕЛ:2, ХАР:1},
    weaponProf: ['Трезубец', 'тесак', 'огнестрельное оружие'],
    traits: 'Аберрация, Потусторонняя сопротивляемость, Иллюзорное тело, Подготовка моряка, Амфибия, Космическое знание, Путеводный свет, Проклятие Грезящего, Незримая, Дары Грезящего',
    languages: ['Общий', 'Дварфийский', 'Глубинный'],
    subraces: []
  },
  {
    id: 'gobbok', url: 'https://dnd.su/homebrew/race/581-gobbok/', name: 'Гоббок', nameEn: 'Gobbok', source: 'HB:HGMH',
    icon: '🧝', size: 'Маленький', speed: 25,
    asiMode: 'partial', asi: {ЛОВ: 2}, asiChoice: {count: 1, from: ['ХАР', 'МДР']},
    traits: 'Общение с птичьим народом, Кредо труса, Пернатые, Куриные бега, Безголовая курица',
    languages: ['Общий'],
    subraces: []
  },
  {
    id: 'golynn', url: 'https://dnd.su/homebrew/race/582-golynn/', name: 'Голинн', nameEn: 'Golynn', source: 'HB:HGMH',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2, СИЛ:1},
    traits: 'Природный доспех, Мощное телосложение, Лопатообразные руки, Дрель Дервиша, Чувство вибрации',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'graceza', url: 'https://dnd.su/homebrew/race/556-graceza/', name: 'Грацеза', nameEn: 'Graceza', source: 'HB:MF',
    icon: '🧝', size: 'Средний', speed: 30, swimSpeed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ХАР:2, ЛОВ:1},
    traits: 'Амфибия, Тёмное зрение, Голос морей, Громовой колокол, Зависимость от воды',
    languages: ['Общий', 'Первичный'],
    subraces: []
  },
  {
    id: 'dhampir_mf', url: 'https://dnd.su/homebrew/race/522-dhampir/', name: 'Дампир (MF)', nameEn: 'Dhampir (MF)', source: 'HB:MF',
    icon: '🧛', size: 'Средний', speed: 35,
    asiMode: 'fixed', asi: {ТЕЛ:1, СИЛ:1, ЛОВ:1},
    traits: 'Наследие предков, Природа нежити, Укус вампира, Кровожадность',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'drevan', url: 'https://dnd.su/homebrew/race/521-drevan/', name: 'Древан', nameEn: 'Drevan', source: 'HB:MF',
    icon: '🧝', size: 'Большой', speed: 30,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    traits: 'Укоренение, Природный доспех, Обманчивая внешность, Отдых энта',
    languages: ['Общий', 'Сильван'],
    subraces: []
  },
  {
    id: 'isetsu', url: 'https://dnd.su/homebrew/race/543-isetsu/', name: 'Исэцу', nameEn: 'Isetsu', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {СИЛ:2, ТЕЛ:1},
    skills: ['Атлетика', 'Восприятие'],
    traits: 'Хрупкий панцирь, Физиология ракообразных, Клешня, Тёмное зрение, Избранный воин, Природный доспех, Водоплавающий',
    languages: ['Общий', 'на выбор'],
    weaponProf: ['Копьё', 'Трезубец'],
    subraces: []
  },
  {
    id: 'cadaver', url: 'https://dnd.su/homebrew/race/562-cadaver/', name: 'Кадавр', nameEn: 'Cadaver', source: 'HB:MF',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'partial', asi: {ТЕЛ: 2}, asiChoice: {count: 1, any: true, exclude: ['ТЕЛ']},
    traits: 'Природа нежити, Жуткое восстановление, Наследие кадавра',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'kitsune', url: 'https://dnd.su/homebrew/race/538-kitsune/', name: 'Кицунэ', nameEn: 'Kitsune', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 35, darkvision: 60,
    asiMode: 'fixed', asi: {ХАР:2, ЛОВ:1},
    skills: ['Обман', 'Скрытность'],
    traits: 'Восходящая форма, Лисье венчание, Тёмное зрение, Коварство кицунэ, Облик зверя',
    languages: ['Общий', 'Кицуне', 'на выбор'],
    subraces: []
  },
  {
    id: 'catfolk', url: 'https://dnd.su/homebrew/race/496-catfolk/', name: 'Котовец', nameEn: 'Catfolk', source: 'HB:MF',
    icon: '🧝', size: 'Маленький', speed: 25, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2},
    skills: ['Скрытность'],
    traits: 'Тёмное зрение, Девять жизней, Рожденный в пустыне, Кошачьи способности, Разновидности',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'desert-caravaner',    name: 'Пустынный караванщик',   source: 'HB:MF', asiMode: 'fixed', asi: {МДР:1},  weaponProf: ['Скимитар', 'Сеть'],                     traits: 'Оккультизм котовцев' },
      { id: 'free-claws',          name: 'Вольный коготь',         source: 'HB:MF', asiMode: 'fixed', asi: {ХАР:1},  languages: ['на выбор'],  skills: ['Убеждение'],  traits: 'Чувство опасности, Кошачьи способности' }
    ]
  },
  {
    id: 'lipsick', url: 'https://dnd.su/homebrew/race/520-lipsick/', name: 'Липсик', nameEn: 'Lipsick', source: 'HB:MF',
    icon: '🧝', size: 'Маленький', speed: 25,
    asiMode: 'fixed', asi: {ХАР:2, ТЕЛ:1},
    toolChoice: {count: 1, category: 'musical'},
    traits: 'Владение инструментами, Общающиеся с растениями, Планирование на листочке',
    languages: ['Общий', 'Сильван'],
    subraces: []
  },
  {
    id: 'lotol', url: 'https://dnd.su/homebrew/race/583-lotol/', name: 'Лотол', nameEn: 'Lotol', source: 'HB:HGMH',
    icon: '🧝', size: 'Средний', speed: 30, climbSpeed: 20, darkvision: 60,
    asiMode: 'fixed', asi: {МДР:2, ТЕЛ:1},
    traits: 'Забвение, Скользкая кожа, Адаптивный полиморфизм',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'lion_turtle', url: 'https://dnd.su/homebrew/race/546-lion-turtle/', name: 'Львиная черепаха', nameEn: 'Lion Turtle', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ХАР: 1, СИЛ: 1, МДР: 1},
    skillChoices: {count: 1, from: ['Акробатика', 'Атлетика', 'Проницательность', 'Запугивание']},
    traits: 'Тёмное зрение, Тяжёлый панцирь, Львиное сердце, Разящие когти, Телепатическая связь, Крепкий панцирь',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'manikin', url: 'https://dnd.su/homebrew/race/460-manikin/', name: 'Манекен', nameEn: 'Manikin', source: 'HB:SGEH',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2},
    traits: 'Рождённый служить, Электрическое сердце, Живой материал, Модульное золочение',
    languages: ['Общий'],
    subraces: [
      { id: 'keeper',    name: 'Хранитель',     source: 'HB:SGEH', asiMode: 'fixed', asi: {СИЛ:1},                                                        traits: 'Искусный защитник, Мощное телосложение' },
      { id: 'tamer',     name: 'Дрессировщик',  source: 'HB:SGEH', asiMode: 'fixed', asi: {ЛОВ:1},  toolProf: 'Набор для грима', skills: ['Скрытность'],  traits: 'Неприметная внешность, Встроенное вооружение' },
      { id: 'actor',     name: 'Актёр',         source: 'HB:SGEH', asiMode: 'fixed', asi: {ХАР:1},                               skills: ['Выступление'], traits: 'Артистичная кукла, Эфемерные нити' },
    ]
  },
  {
    id: 'mycelian', url: 'https://dnd.su/homebrew/race/584-mycelian/', name: 'Мицелиан', nameEn: 'Mycelian', source: 'HB:HGMH',
    icon: '🧝', size: 'Средний', speed: 25,
    asiMode: 'partial', asi: {ТЕЛ: 2}, asiChoice: {count: 1, any: true},
    traits: 'Симбиотическая ассимиляция, Распыление спор, Воскрешение спор, При успехе новое тело восстает через 2к6 дней',
    languages: ['Общий'],
    subraces: []
  },
  {
    id: 'mousefolk', url: 'https://dnd.su/homebrew/race/494-mousefolk/', name: 'Мышинец', nameEn: 'Mousefolk', source: 'HB:MF',
    icon: '🧝', size: 'Крошечный', speed: 20, darkvision: 30,
    asiMode: 'fixed', asi: {ЛОВ:2},
    traits: 'Тёмное зрение, Мышиная незаметность, Владение инструментами, Разговор с маленькими зверями, Острый слух, Побег, Разновидности',
    skills: ['Скрытность'],
    toolProf: 'Набор травника',
    languages: ['Общий', 'Мышиный'],
    subraces: [
      { id: 'field',    name: 'Полевая Мышь',     source: 'HB:MF', asiMode: 'fixed', asi: {ТЕЛ:1},  speed: 30,                                traits: 'Быстроногий, скрытный' },
      { id: 'city',     name: 'Городская мышь',   source: 'HB:MF', asiMode: 'fixed', asi: {ИНТ:1},  climbSpeed: 20,                           traits: 'Цепкие лапы, верный спутник' },
      { id: 'rat',      name: 'Крыса',            source: 'HB:MF', asiMode: 'fixed', asi: {СИЛ:1},  toolProf: 'Инструменты отравителя',       traits: 'Отравитель, мастерство крюк-мышки' },
    ]
  },
  {
    id: 'hishikin', url: 'https://dnd.su/homebrew/race/544-hishikin/', name: 'Нисикин', nameEn: 'Hishikin', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed:30, swimSpeed: 30,
    asiMode: 'fixed', asi: {ЛОВ:1, ТЕЛ:1, МДР:1},
    traits: 'Амфибия, Благословлённые луной, Цвет нисикина, Мощное телосложение, Скользкий, Дремлющий дракон, Драконья метаморфоза',
    languages: ['Акван', 'Общий'],
    subraces: []
  },
  {
    id: 'ombrask', url: 'https://dnd.su/homebrew/race/585-ombrask/', name: 'Омбраск', nameEn: 'Ombrask', source: 'HB:HGMH',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'partial', asi: {ЛОВ: 2}, asiChoice: {count: 1, any: true},
    skills: ['Скрытность'],
    traits: 'Тёмное зрение, Исчезнуть, Заполненный светом, Бесследный, Похититель голоса',
    languages: ['Общий', 'Подземный'],
    subraces: []
  },
  {
    id: 'oniborne', url: 'https://dnd.su/homebrew/race/545-oniborne/', name: 'Онирождённый', nameEn: 'Oniborne', source: 'HB:RGYR',
    icon: '👹', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2},
    traits: 'Тип существа, Мощное телосложение, Подрасы',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'red',    name: 'Красный',   source: 'HB:RGYR', asiMode: 'fixed', asi: {МДР:1},  skills: ['Запугивание'], toolChoice: {count: 1, category: 'artisan'},    traits: 'Устрашающая фигура, Магический мародер, Плачущая магия' },
      { id: 'blue',   name: 'Синий',     source: 'HB:RGYR', asiMode: 'fixed', asi: {СИЛ:1},  skills: ['Обман'],                                                       traits: 'Сострадательное сердце, Хрустящая пасть, Великий обманщик, Укус дикаря' },
      { id: 'green',  name: 'Зеленый',   source: 'HB:RGYR', asiMode: 'fixed', asi: {ХАР:1},  skills: ['Выступление'],                                                 traits: 'Захватывающее качество, Свирепая магия, Отвратительный вид' },
    ]
  },
  {
    id: 'demidritch', url: 'https://dnd.su/homebrew/race/459-demidritch/', name: 'Полусторонний', nameEn: 'Demidritch', source: 'HB:SGEH',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 120,
    asiMode: 'fixed', asi: {ХАР:2},
    traits: 'Тёмное зрение, Осколок бесконечности, Астральное существо',
    languages: ['Общий', 'Глубинный'],
    subraces: [
      { id: 'viewer',    name: 'Зрячий',            source: 'HB:SGEH', asiMode: 'fixed', asi: {ТЕЛ:1},  skills: ['Восприятие'],  traits: 'Всевидящие глаза, Смотритель' },
      { id: 'foggy',     name: 'Туманностный',      source: 'HB:SGEH', asiMode: 'fixed', asi: {СИЛ:1},                           traits: 'Астральное притяжение, Свечение' },
    ]
  },
  {
    id: 'scourgeborne', url: 'https://dnd.su/homebrew/race/462-scourgeborne/', name: 'Порождение Бедствия', nameEn: 'Scourgeborne', source: 'HB:SGEH',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:1},
    traits: 'Смертоносные конечности, Жуткое проклятие, Рожденный безумием',
    languages: ['Общий'],
    subraces: [
      { id: 'aranea',        name: 'Аранея',        source: 'HB:SGEH', asiMode: 'partial', asi: {ИНТ: 1}, asiChoice: {count: 1, any: true, exclude: ['ИНТ']}, climbSpeed: 30,                       traits: 'Паучье лазание, Плевок паутиной' },
      { id: 'belua',         name: 'Белуа',         source: 'HB:SGEH', asiMode: 'partial', asi: {СИЛ: 1}, asiChoice: {count: 1, any: true, exclude: ['СИЛ']}, speed: 40,                            traits: 'Острый слух и тонкий нюх, олодные челюсти' },
      { id: 'cervus',        name: 'Червус',        source: 'HB:SGEH', asiMode: 'multi-choice', asiChoice: [{count: 1, from: ['МДР', 'СИЛ']},  {count: 1, any: true, exclude: ['МДР', 'СИЛ']}],     traits: 'Прыткое тело, Атака в броске' },
      { id: 'vespertilio ',  name: 'Веспертилио',   source: 'HB:SGEH', asiMode: 'partial', asi: {ЛОВ: 1}, asiChoice: {count: 1, any: true, exclude: ['ЛОВ']},  blindvision: 30,                     traits: 'Эхо-локационное зрение, Разодранные крылья' },
        ]
  },
  {
    id: 'awakened', url: 'https://dnd.su/homebrew/race/111-awakened/', name: 'Пробуждённый', nameEn: 'Awakened', source: 'HB:SC',
    icon: '🧝', size: 'Средний', speed: 30, blindvision: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2, СИЛ:1},
    traits: 'Слепые чувства, Сжимающие лозы, Природный доспех',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'cursed_blood', url: 'https://dnd.su/homebrew/race/470-cursed-blood/', name: 'Проклятокровый', nameEn: 'Cursed-Blood', source: 'HB:SGEH',
    icon: '🧝', size: 'Маленький', climbSpeed: 25,
    asiMode: 'partial', asi: {ЛОВ: 1}, asiChoice: {count: 1, any: true, exclude: ['ЛОВ']},
    traits: 'Настороженная личность, Сиамский близнец',
    languages: ['Общий', 'Драконий', 'Инфернальный'],
    subraces: [
      { id: 'sprinkled',     name: 'Окропленный',   source: 'HB:SGEH', asiMode: 'fixed', asi: {МДР:1, СИЛ:1},        traits: 'Изолированный покров' },
      { id: 'giant',         name: 'Гигантский',    source: 'HB:SGEH', asiMode: 'fixed', asi: {ТЕЛ:1},               traits: 'Каменная кожа' },
      { id: 'mirage',        name: 'Мираж',         source: 'HB:SGEH', asiMode: 'fixed', asi: {ХАР:1, ХАР:1},        traits: 'Теневая кожа' },
    ]
  },
  {
    id: 'ryujin', url: 'https://dnd.su/homebrew/race/547-ryujin/', name: 'Рюдзин', nameEn: 'Ryujin', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 30, swimSpeed: 30,
    asiMode: 'fixed', asi: {МДР:1, ЛОВ:1, ТЕЛ:1},
    traits: 'Амфибия, Облачный шаг, Цвет дракона кои, Дыхание сердца, Врожденная магия, Благословенный солнцем',
    languages: ['Акван', 'Общий'],
    subraces: []
  },
  {
    id: 'silva', url: 'https://dnd.su/homebrew/race/110-silva/', name: 'Сильва', nameEn: 'Silva', source: 'HB:SC',
    icon: '🧝', size: 'Средний', speed: 30, climbSpeed: 30,
    asiMode: 'fixed', asi: {МДР:2},
    traits: 'Фотосинтез, Зов леса, Древолаз, Разновидности',
    languages: ['Общий', 'Сильван'],
    subraces: [
      { id: 'wood',     name: 'Лесной',         source: 'HB:SC', asiMode: 'fixed', asi: {ЛОВ:1},                         traits: 'Растительный камуфляж' },
      { id: 'jungle',   name: 'Из джунглей',    source: 'HB:SC', asiMode: 'fixed', asi: {ТЕЛ:1},  darkvision: 60,        traits: 'Темное зрение' },
              ]
  },
  {
    id: 'slimee', url: 'https://dnd.su/homebrew/race/560-slimee/', name: 'Склизыш', nameEn: 'Slimee', source: 'HB:MF',
    icon: '🧝', size: 'Маленький', speed:25, swimSpeed: 25,
    asiMode: 'fixed', asi: {ЛОВ:2, ТЕЛ:1},
    skills: ['Скрытность'],
    traits: 'Древесная скрытность, Амфибия, Иммунитет к ядам, Клан склизышей, Ядовитая кожа, Прыжок с места, Зависимость от воды',
    languages: ['Общий', 'Язык Склизышей'],
    subraces: []
  },
  {
    id: 'oozekin', url: 'https://dnd.su/homebrew/race/586-oozekin/', name: 'Слизевик', nameEn: 'Oozekin', source: 'HB:HGMH',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ТЕЛ:2, СИЛ:1},
    traits: 'Тёмное зрение, Кислотная плоть, Перевоплощение',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'sticktikal', url: 'https://dnd.su/homebrew/race/561-sticktikal/', name: 'Стик\'Ти\'Кал', nameEn: 'Stick\'Ti\'Kal', source: 'HB:MF',
    icon: '🧝', size: 'Средний', speed: 30, flySpeed: 30, darkvision: 60,
    asiMode: 'fixed', asi: {ЛОВ:2},
    traits: 'Тёмное зрение, Полёт, Вторые руки',
    languages: ['Общий', 'Первичный'],
    subraces: [
      { id: 'ekklisiarkh',   name: 'Екклисиарх',   source: 'HB:MF', asiMode: 'fixed', asi: {МДР:1},                                                                             traits: 'Замедленный метаболизм, Укрепленный разум, Длань роя' },
      { id: 'kustos',        name: 'Кустос',       source: 'HB:MF', asiMode: 'fixed', asi: {СИЛ:1}, weaponProf: ['Игнифер', 'Двуручный меч', 'Длинное копьё', 'Длинный лук'],          traits: 'Хитиновая защита, Усиленный полет, Владение оружием кустосов' },
      { id: 'djakon',        name: 'Дьякон',       source: 'HB:MF', asiMode: 'fixed', asi: {ХАР:1}, skills: ['Религия'],                                                        traits: 'Первосвященник, Магия одаренного, Галлюциногенная пыльца' },
      { id: 'inferior',      name: 'Инфериор',     source: 'HB:MF', asiMode: 'fixed', asi: {ТЕЛ:1}, climbSpeed: 30,                                                             traits: 'Усиленные лапы, Анабиоз, Живучий' },
    ]
  },
  {
    id: 'cnidaran', url: 'https://dnd.su/homebrew/race/579-cnidaran/', name: 'Стрекающие', nameEn: 'Cnidaran', source: 'HB:HGMH',
    icon: '🧝', size: 'Средний', swimSpeed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2},
    traits: 'Амфибия',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'nematocist',   name: 'Нематоцист',   source: 'HB:HGMH', asiMode: 'fixed', asi: {ЛОВ:1, ТЕЛ:1},                                                                      traits: 'Нейротоксин, Токсичная адаптация' },
      { id: 'shimmerhide',  name: 'Мерцашкур',    source: 'HB:HGMH', asiMode: 'fixed', asi: {ХАР:2}, weaponProf: ['Игнифер', 'Двуручный меч', 'Длинное копьё', 'Длинный лук'],          traits: 'Стойкий хвост' },
    ]
  },
  {
    id: 'teratect', url: 'https://dnd.su/homebrew/race/475-teratect/', name: 'Тератект', nameEn: 'Teratect', source: 'HB:CN',
    icon: '🧝', size: 'Средний', speed: 30, climbSpeed: 30, darkvision: 60,
    asiMode: 'choice', asi: {},
    traits: 'Паучье лазанье, Тёмное зрение, Устойчивость тератектов, Природный доспех',
    languages: ['Общий', 'Подземный'],
    subraces: [
      { id: 'twoped',   name: 'Двуногий',       source: 'HB:CN',                                     traits: 'Вызов паутины, Облик истинного' },
      { id: 'octoped',  name: 'Восьминогий',    source: 'HB:CN', speed: 40, climbSpeed: 40,          traits: 'На половину паук, Множество ножек, Чувство паутины, Хождение по паутине, Хождение по земле, Паутина' },
    ]
  },
  {
    id: 'smoldering', url: 'https://dnd.su/homebrew/race/474-smoldering/', name: 'Тлеющий', nameEn: 'Smoldering', source: 'HB:CN',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 120,
    asiMode: 'choice', asi: {},
    skills: ['Скрытность'],
    skillChoices: {count: 1, from: [' Атлетика', 'Акробатика', 'Выживание', 'Природа', 'Восприятие']},
    traits: 'Измененная природа, Усиленные навыки, Наследие предков, Превосходное тёмное зрение, Внезапное нападение',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'stranger',   name: 'Странник',   source: 'HB:CN',       traits: '' },
      { id: 'guardian',   name: 'Страж',      source: 'HB:CN',       traits: '' },
    ]
  },
  {
    id: 'tengu', url: 'https://dnd.su/homebrew/race/548-tengu/', name: 'Тэнгу', nameEn: 'Tengu', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ЛОВ:2},
    weaponProf: ['Одно простое или воинское оружие на выбор'],
    traits: 'Смертоносные мастера',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'hanataka',   name: 'Ханатака',    source: 'HB:RGYR', asiMode: 'fixed', asi: {ХАР:1}, toolChoice: {count: 1, category: 'artisan'}, skillChoices: {count:1, from: ['Выживание', 'Магия', 'Природа', 'Религия', 'Скрытность']},     traits: 'Мастер ремесла, Страж природы, Сумеречник, Вихревой натиск'},
      { id: 'karasu',     name: 'Карасу',      source: 'HB:RGYR', asiMode: 'fixed', asi: {МДР:1}, skills: ['Обман', 'Скрытность'],                                                                                                            traits: 'Укрепленный разум, Проказник, Психическая атака, Небесный наездник' },
    ]
  },
  {
    id: 'florene', url: 'https://dnd.su/homebrew/race/466-florene/', name: 'Флорен', nameEn: 'Florene', source: 'HB:CN',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'choice', asi: {},
    traits: 'Зов, Устойчивость флоренов',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'ground',   name: 'Наземный',            source: 'HB:CN',   skills: ['Уход за животными'],                                                                                              traits: 'Растительный камуфляж, Друг животных, Природная связь'},
      { id: 'water',    name: 'Водный',              source: 'HB:CN',   swimSpeed: 30,                                                                                                              traits: 'Дитя морей, Отпечаток стихии' },
      { id: 'deep',     name: 'Глубинный',           source: 'HB:CN',   darkvision: 60, skillChoices: {count:2, from: ['Выживание', 'Восприятие', 'Природа', 'Уход за животными', 'Скрытность']},   traits: 'Тёмное зрение, Познания в выживании, Хитрость глубин' },
      { id: 'rock',     name: 'Скальный',            source: 'HB:CN',   skills: ['Атлетика'], climbSpeed: 30,                                                                                       traits: 'Жители гор, Хождение по земле' },
      { id: 'spore',    name: 'Споровый паразит',    source: 'HB:CN',                                                                                                                               traits: 'Жители пустынь, Стойкость паразита' },
    ]
  },
  {
    id: 'fuyohren', url: 'https://dnd.su/homebrew/race/540-fuyohren/', name: 'Фунаюрэй', nameEn: 'Fuyohren', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 35,
    asiMode: 'fixed', asi: {ЛОВ:2, МДР:1},
    skillChoices: {count:1, from: ['Выживание', 'Акробатика', 'Природа', 'Уход за животными', 'Выступление']},
    traits: 'Плавное движение, Грациозный шаг, Магия воды, Хранитель природы',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'hanamori', url: 'https://dnd.su/homebrew/race/541-hanamori/', name: 'Ханамори', nameEn: 'Hanamori', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ХАР:2, МДР:1},
    skillChoices: {count:1, from: ['Выживание', 'Запугивание', 'Природа', 'Медицина']},
    traits: 'Захват сущности, Огненный лик, Взгляд смерти, Прочный',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'haniwa', url: 'https://dnd.su/homebrew/race/542-haniwa/', name: 'Ханива', nameEn: 'Haniwa', source: 'HB:RGYR',
    icon: '🧝', size: 'Средний', speed: 30,
    asiMode: 'fixed', asi: {ТЕЛ:2, МДР:1},
    skills: ['Восприятие', 'Религия'],
    traits: 'Глиняный компаньон, Хранитель могил, Оболочка души, Духовный оберег, Хранитель гробниц',
    languages: ['Общий', 'на выбор'],
    subraces: []
  },
  {
    id: 'cyclopian', url: 'https://dnd.su/homebrew/race/580-cyclopian/', name: 'Циклопианец', nameEn: 'Cyclopian', source: 'HB:HGMH',
    icon: '🧝', size: 'Средний', speed: 30, darkvision: 60, climbSpeed: 20,
    asiMode: 'partial', asi: {ИНТ: 2}, asiChoice: {count: 1, from: ['ЛОВ', 'МДР']},
    skillChoices: {count: 2, from: ['Восприятие', 'История', 'Магия', 'Медицине', 'Проницательность', 'Расследование', 'Религия', 'Скрытность.']},
    traits: 'Тёмное зрение, Искатель знаний, Знаток секретов, Мысль ради еды, Верхняя полка',
    languages: ['Общий', 'Подземный', 'на выбор'],
    subraces: []
  },
  {
    id: 'enkoh', url: 'https://dnd.su/homebrew/race/539-enkoh/', name: 'Энкох', nameEn: 'Enkoh', source: 'HB:RGYR',
    icon: '🧝', 
    asiMode: 'fixed', asi: {ИНТ:2},
    traits: 'Густой мех, Подрасы',
    languages: ['Общий', 'на выбор'],
    subraces: [
      { id: 'huge',          name: 'Громадный',            source: 'HB:RGYR',   asiMode: 'fixed', asi: {ТЕЛ:1},                                                                                                              size: 'Средний',   speed: 30, climbSpeed: 30,   traits: 'Удары в грудь, Природные повара, Мощное телосложение'},
      { id: 'springtale',    name: 'Пружинохвостый',       source: 'HB:RGYR',   asiMode: 'fixed', asi: {ЛОВ:1}, skillChoices: {count:2, from: ['Акробатика', 'Выживание', 'Выступление', 'Природа', 'Уход за животными']},   size: 'Маленький', speed: 35, climbSpeed: 35,   traits: 'Звериные стражи, Умелый, Пружинящий прыжок, Стойкий хвост' },
    ]
  }

];
