// ══════════════════════════════════════════════════════════
// REST.JS — Питание и постой (PHB + ToA)
// costGp: цена в золотых монетах (единый формат как в items.js)
// weightLbs: вес в фунтах (null = услуга, веса нет)
// ══════════════════════════════════════════════════════════

window.REST_ITEMS = [

  {
    category: 'Постоялый двор (за день)',
    icon: '🏠',
    items: [
      { name: 'Нищенское жильё',         costGp: 0.07,  weightLbs: null,  priceDisplay: '7 мм',  desc: 'Ночлег на полу в общей комнате или в конюшне' },
      { name: 'Бедное жильё',            costGp: 0.1,   weightLbs: null,  priceDisplay: '1 см',  desc: 'Общая комната, простая кровать' },
      { name: 'Скромное жильё',          costGp: 0.5,   weightLbs: null,  priceDisplay: '5 см',  desc: 'Комната на несколько человек, простая еда' },
      { name: 'Комфортное жильё',        costGp: 0.8,   weightLbs: null,  priceDisplay: '8 см',  desc: 'Своя комната, хорошая еда и обслуживание' },
      { name: 'Богатое жильё',           costGp: 2.0,   weightLbs: null,  priceDisplay: '2 зм',  desc: 'Элегантные апартаменты, изысканная кухня' },
      { name: 'Аристократическое жильё', costGp: 4.0,   weightLbs: null,  priceDisplay: '4 зм',  desc: 'Роскошные покои, прислуга, банкетный стол' },
    ],
  },

  {
    category: 'Пропитание (за день)',
    icon: '🍽',
    items: [
      { name: 'Нищенское питание',         costGp: 0.03,  weightLbs: null,  priceDisplay: '3 мм',  desc: 'Объедки и вода' },
      { name: 'Бедное питание',            costGp: 0.06,  weightLbs: null,  priceDisplay: '6 мм',  desc: 'Грубый хлеб, каша, вода' },
      { name: 'Скромное питание',          costGp: 0.3,   weightLbs: null,  priceDisplay: '3 см',  desc: 'Простая горячая еда' },
      { name: 'Комфортное питание',        costGp: 0.5,   weightLbs: null,  priceDisplay: '5 см',  desc: 'Добротная еда и напитки' },
      { name: 'Богатое питание',           costGp: 0.8,   weightLbs: null,  priceDisplay: '8 см',  desc: 'Разнообразное меню, хорошее вино' },
      { name: 'Аристократическое питание', costGp: 2.0,   weightLbs: null,  priceDisplay: '2 зм',  desc: 'Изысканная кухня, редкие деликатесы' },
    ],
  },

  {
    category: 'Еда',
    icon: '🥖',
    items: [
      // PHB даёт вес буханки хлеба ~0.5 фнт за ломоть, куска сыра ~0.5 фнт,
      // куска мяса ~1 фнт, торжественный обед — много блюд, ~5 фнт условно
      { name: 'Хлеб, ломоть',                   costGp: 0.02,  weightLbs: 0.5,  priceDisplay: '2 мм',  desc: 'Кусок свежего или чёрствого хлеба' },
      { name: 'Сыр, кусок',                      costGp: 0.1,   weightLbs: 0.5,  priceDisplay: '1 см',  desc: 'Кусок твёрдого или мягкого сыра' },
      { name: 'Мясо, кусок',                     costGp: 0.3,   weightLbs: 1,    priceDisplay: '3 см',  desc: 'Жареное или варёное мясо' },
      { name: 'Торжественный обед (на 1 едока)',  costGp: 10.0,  weightLbs: null, priceDisplay: '10 зм', desc: 'Многоблюдный пир с деликатесами — подаётся на месте' },
    ],
  },

  {
    category: 'Напитки',
    icon: '🍺',
    items: [
      // 1 галлон воды = 8.34 фнт ≈ 8 фнт в D&D.
      // Кружка ~0.5 пинты ≈ 1 фнт. Бутылка вина ~1.5 фнт. Бочка ~32 галлона ≈ 250 фнт, нереально таскать.
      { name: 'Пиво, кружка',           costGp: 0.04,  weightLbs: 1,    priceDisplay: '4 мм',   desc: '~0.5 л тёмного или светлого пива' },
      { name: 'Пиво, галлон',           costGp: 0.2,   weightLbs: 8,    priceDisplay: '2 см',   desc: '~4 литра пива — хватит на компанию' },
      { name: 'Пиво, бочка (RMR)',      costGp: 0.8,   weightLbs: 250,  priceDisplay: '8 см',   desc: 'Бочка пива (~32 галлона)' },
      { name: 'Вино обычное, кружка',   costGp: 0.2,   weightLbs: 1,    priceDisplay: '2 см',   desc: 'Кружка столового вина' },
      { name: 'Вино отличное, бутылка', costGp: 10.0,  weightLbs: 1.5,  priceDisplay: '10 зм',  desc: 'Бутылка выдержанного вина' },
      { name: 'Тэж, кружка',            costGp: 0.05,  weightLbs: 1,    priceDisplay: '5 мм',   desc: 'Медовуха из Чульта, сладкая и хмельная (ToA)' },
      { name: 'Тэж, галлон',            costGp: 0.25,  weightLbs: 8,    priceDisplay: '2,5 см', desc: '~4 литра тэжа (ToA)' },
    ],
  },

  {
    category: 'Флора и фауна (ToA)',
    icon: '🌿',
    items: [
      // Тропические плоды и коренья: от ~0.25 фнт (листья, орех) до ~1-2 фнт (крупные корни/плоды)
      { name: 'Фрукт танцующей обезьяны',  costGp: 5.0,   weightLbs: 0.5,  priceDisplay: '5 зм',  desc: 'Экзотический фрукт Чульта' },
      { name: 'Листья менги (1 унция)',     costGp: 2.0,   weightLbs: 0.06, priceDisplay: '2 зм',  desc: 'Жевательные листья, снимающие усталость' },
      { name: 'Корень райях',              costGp: 50.0,  weightLbs: 1,    priceDisplay: '50 зм', desc: 'Редкий лечебный корень' },
      { name: 'Ягоды синда (10 шт.)',       costGp: 5.0,   weightLbs: 0.25, priceDisplay: '5 зм',  desc: 'Яркие ягоды с необычными свойствами' },
      { name: 'Дикий корень',              costGp: 25.0,  weightLbs: 0.5,  priceDisplay: '25 зм', desc: 'Корень с тонизирующими свойствами' },
      { name: 'Орех вукка',               costGp: 1.0,   weightLbs: 0.25, priceDisplay: '1 зм',  desc: 'Питательный орех джунглей' },
      { name: 'Яча',                       costGp: 1.0,   weightLbs: 0.5,  priceDisplay: '1 зм',  desc: 'Экзотический плод' },
      { name: 'Забоу',                     costGp: 10.0,  weightLbs: 0.5,  priceDisplay: '10 зм', desc: 'Редкий плод с магическими свойствами' },
    ],
  },

];
