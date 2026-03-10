// ══════════════════════════════════════════════════════════
// D&D CHARACTER FORGE — Main App v2
// ══════════════════════════════════════════════════════════

const ABILITY_KEYS = ['СИЛ','ЛОВ','ТЕЛ','ИНТ','МДР','ХАР'];
const ABILITY_FULL = {СИЛ:'Сила',ЛОВ:'Ловкость',ТЕЛ:'Телосложение',ИНТ:'Интеллект',МДР:'Мудрость',ХАР:'Харизма'};
const ABILITY_EN   = {СИЛ:'str',ЛОВ:'dex',ТЕЛ:'con',ИНТ:'int',МДР:'wis',ХАР:'cha'};

const SKILLS_DATA = [
  {name:'Акробатика',         ability:'ЛОВ', en:'acrobatics'},
  {name:'Уход за животными',  ability:'МДР', en:'animal handling'},
  {name:'Атлетика',           ability:'СИЛ', en:'athletics'},
  {name:'Магия',              ability:'ИНТ', en:'arcana'},
  {name:'Обман',              ability:'ХАР', en:'deception'},
  {name:'История',            ability:'ИНТ', en:'history'},
  {name:'Запугивание',        ability:'ХАР', en:'intimidation'},
  {name:'Расследование',      ability:'ИНТ', en:'investigation'},
  {name:'Медицина',           ability:'МДР', en:'medicine'},
  {name:'Природа',            ability:'ИНТ', en:'nature'},
  {name:'Восприятие',         ability:'МДР', en:'perception'},
  {name:'Выступление',        ability:'ХАР', en:'performance'},
  {name:'Убеждение',          ability:'ХАР', en:'persuasion'},
  {name:'Религия',            ability:'ИНТ', en:'religion'},
  {name:'Ловкость рук',       ability:'ЛОВ', en:'sleight of hand'},
  {name:'Скрытность',         ability:'ЛОВ', en:'stealth'},
  {name:'Выживание',          ability:'МДР', en:'survival'},
  {name:'Проницательность',   ability:'МДР', en:'insight'},
];

const CONDITIONS = ['Отравлен','Испуган','Очарован','Ошеломлён','Истощён 1','Истощён 2',
  'Истощён 3','Истощён 4','Истощён 5','Слепой','Глухой','Схвачен',
  'Лежачий','Невидимый','Парализован','Окаменелый','Опрокинутый'];

const SLOT_TABLE = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0],
  4:[4,3,0,0,0,0,0,0,0], 5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0],
  7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0], 9:[4,3,3,3,1,0,0,0,0],
  10:[4,3,3,3,2,0,0,0,0],11:[4,3,3,3,2,1,0,0,0],12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0],14:[4,3,3,3,2,1,1,0,0],15:[4,3,3,3,2,1,1,1,0],
  16:[4,3,3,3,2,1,1,1,0],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],
  19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1],
};

// Магия Договора колдуна: [количество_ячеек, уровень_ячеек]
// PHB таблица: уровень колдуна → [слотов, уровень слотов]
const WARLOCK_PACT_TABLE = {
   1:[1,1],  2:[2,1],  3:[2,2],  4:[2,2],  5:[2,3],
   6:[2,3],  7:[2,4],  8:[2,4],  9:[2,5], 10:[2,5],
  11:[3,5], 12:[3,5], 13:[3,5], 14:[3,5], 15:[3,5],
  16:[3,5], 17:[4,5], 18:[4,5], 19:[4,5], 20:[4,5],
};

// Возвращает true если персонаж — колдун (Магия Договора)
function isWarlockChar(char) {
  const cls = (char?.className || char?.class || '').toLowerCase();
  return cls.includes('колдун') || cls.includes('warlock');
}

// Костяная стоимость для point buy
const PB_COST = {8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};

// ── ГЛОБАЛЬНОЕ СОСТОЯНИЕ ──
let enabledSources = new Set(['PH14']);
let currentStep    = 0;
const TOTAL_STEPS  = 8; // +1 для заклинаний
const STEP_NAMES   = ['Информация','Раса','Класс','Предыстория','Характеристики','Навыки','Заклинания','Снаряжение'];

let wiz            = makeEmptyWiz();
let currentChar    = null;
let currentFilename= null;
let sheetSkillExp  = {}; // {skillName: 0|1|2} (0=нет,1=владение,2=компетентность)
let sheetUsedSlots = {};

// ── ТЕМА ──
const THEMES = {
  dndsu:  {label:'ДНД.СУ',   '--bg':'#0d0d1a','--blood':'#4a90d9','--gold':'#a8d8ea','--parchment':'#1a1a2e'},
  lss:    {label:'LongStoryShort','--bg':'#f8f7f2','--blood':'#2d4a3e','--gold':'#8b7355','--parchment':'#fff','--ink':'#2c2c2c'},
  ddbeyond:{label:'D&D Beyond','--bg':'#1a1a1a','--blood':'#c53030','--gold':'#d4af37','--parchment':'#242424'},
  light:  {label:'Светлая',   '--bg':'#f5f0e8','--blood':'#8b0000','--gold':'#c9a227','--parchment':'#fff8ef'},
  dark:   {label:'Тёмная',    '--bg':'#0a0a0a','--blood':'#9b0000','--gold':'#b8922a','--parchment':'#141414'},
};
let currentTheme = localStorage.getItem('dnd_theme') || 'dark';


// ── Нормализация строк для поиска: е/ё взаимозаменяемы ───────────────────
function normalizeRu(s) {
  return (s || '').toLowerCase().replace(/ё/g, 'е');
}
function applyTheme(name) {
  currentTheme = name;
  localStorage.setItem('dnd_theme', name);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === name));
  // Light theme override
  if (name === 'light') {
    document.documentElement.style.setProperty('--bg','#f0f2f5');
    document.documentElement.style.setProperty('--bg2','#ffffff');
    document.documentElement.style.setProperty('--surface','#ffffff');
    document.documentElement.style.setProperty('--surface2','#f5f7fa');
    document.documentElement.style.setProperty('--surface3','#e8ecf0');
    document.documentElement.style.setProperty('--text','#1a202c');
    document.documentElement.style.setProperty('--text2','#4a5568');
    document.documentElement.style.setProperty('--text3','#718096');
    document.documentElement.style.setProperty('--border','rgba(0,0,0,.1)');
    document.documentElement.style.setProperty('--border2','rgba(0,0,0,.15)');
  } else {
    // Reset to dark defaults
    document.documentElement.style.setProperty('--bg','#12131a');
    document.documentElement.style.setProperty('--bg2','#1a1c26');
    document.documentElement.style.setProperty('--surface','#1e2132');
    document.documentElement.style.setProperty('--surface2','#252840');
    document.documentElement.style.setProperty('--surface3','#2d3250');
    document.documentElement.style.setProperty('--text','#e2e8f0');
    document.documentElement.style.setProperty('--text2','#a0aec0');
    document.documentElement.style.setProperty('--text3','#718096');
    document.documentElement.style.setProperty('--border','rgba(255,255,255,.08)');
    document.documentElement.style.setProperty('--border2','rgba(255,255,255,.14)');
    if (name === 'dndsu') {
      document.documentElement.style.setProperty('--accent','#4a6fa5');
    }
  }
}

// ── УТИЛИТЫ ──
const getMod  = s => Math.floor((s - 10) / 2);
const fmtMod  = m => (m >= 0 ? '+' : '') + m;
const clamp   = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const profBonus = lvl => Math.ceil(lvl / 4) + 1;

// ── ВСПЛЫВАЮЩИЕ ПОДСКАЗКИ С ССЫЛКАМИ dnd.su ──
window._tooltipEl = null;
window._tooltipTimer = null;
window._tooltipShowTimer = null;

function showDndTooltip(el) {
  clearTimeout(window._tooltipTimer);
  clearTimeout(window._tooltipShowTimer);
  const name = el.dataset.tooltip;
  const url  = el.dataset.url;
  if (!name) return;
  window._tooltipShowTimer = setTimeout(() => {
    if (!window._tooltipEl) {
      window._tooltipEl = document.createElement('div');
      window._tooltipEl.id = 'dnd-tooltip';
      window._tooltipEl.style.cssText = 'position:fixed;z-index:9999;background:var(--surface2);border:1px solid var(--accent);border-radius:8px;padding:.5rem .8rem;font-size:.8rem;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.7);max-width:240px;color:var(--text);transition:opacity .2s;font-family:var(--font);user-select:none';
      document.body.appendChild(window._tooltipEl);
    }
    window._tooltipEl.innerHTML = `<div style="font-weight:700;margin-bottom:.22rem;color:var(--text)">${name}</div><span style="color:var(--accent2);font-size:.73rem;pointer-events:none;text-decoration:none;display:block">📖 ${url}</span>`;
    window._tooltipEl.style.opacity = '1';
    const rect = el.getBoundingClientRect();
    let top = rect.bottom + 6;
    let left = rect.left;
    if (left + 240 > window.innerWidth) left = window.innerWidth - 250;
    if (top + 80 > window.innerHeight) top = rect.top - 80;
    window._tooltipEl.style.top  = top  + 'px';
    window._tooltipEl.style.left = left + 'px';
  }, 2000);
}

function hideDndTooltip() {
  clearTimeout(window._tooltipShowTimer);
  window._tooltipTimer = setTimeout(() => {
    if (window._tooltipEl) { window._tooltipEl.style.opacity='0'; }
  }, 1300);
}

// Немедленно скрывать тултип при клике/скролле в любом месте
function _hideTooltipNow() {
  clearTimeout(window._tooltipShowTimer);
  clearTimeout(window._tooltipTimer);
  if (window._tooltipEl) { window._tooltipEl.style.opacity='0'; }
}
document.addEventListener('click',      _hideTooltipNow, true);
document.addEventListener('scroll',     _hideTooltipNow, true);
document.addEventListener('touchstart', _hideTooltipNow, true);
document.addEventListener('keydown',    _hideTooltipNow, true);
// При смене вкладки визарда или листа
document.addEventListener('mousedown', (e) => {
  // Если клик не по самой карточке с тултипом — скрывать немедленно
  if (!e.target.closest('[data-tooltip]')) _hideTooltipNow();
}, true);

function toast(msg, type = 'info', duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'toast show ' + type;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), duration);
}

function makeEmptyWiz() {
  return {
    name:'', level:1, xp:0, alignment:'', appearance:'',
    backstory:'', traits:'', ideals:'', bonds:'', flaws:'', allies:'',
    age:'', height:'', weight:'', eyes:'', skin:'', hair:'',
    race:null, subrace:null, cls:null, subclass:'', fightingStyle:'',
    abilities:{СИЛ:8,ЛОВ:8,ТЕЛ:8,ИНТ:8,МДР:8,ХАР:8},
    racialBonuses:{},
    // ASI choices для сложных рас
    asiMode:'fixed',          // fixed|variant|choice|all+1|flex2|select|partial|multi-choice
    asiVariantPicks:[],       // [key, key] для вариантного человека
    asiChoicePick:'ab2ab1',   // 'ab2ab1' или 'ab1ab1ab1' для choice
    asiFlexPick:{},           // для flex2 { 'ЛОВ': 2, 'ИНТ': 1 }
    asiFlexMode:'2+1',        // '2+1' или '1+1+1'
    pointBuyMode:'pointbuy',
    rollValues: {СИЛ:8,ЛОВ:8,ТЕЛ:8,ИНТ:8,МДР:8,ХАР:8},
    skillProfs: new Set(),
    langChoices: [],
    toolChoices: [],
    racialSkillChoice: null,  // для вариантного человека
    hasFeat: false,
    spellAbility:'', spells:[], selectedCantrips:[], selectedSpells:[],
    weapons:[], inventory:[],
    currency:{gp:0,sp:0,cp:0,ep:0,pp:0},
    equipmentChoice: null,    // null | 'kit' | 'gold'  (null = не выбрано)
    startGold: 0,
    notes:'',
    dupReplacements: {},   // { 'оригинал' → 'замена' } для дублирующихся владений
    bgToolChoices:   {},   // { idx → название } выбранные инструменты из toolChoice предыстории
    clsToolChoices:  {},   // { idx → название } выбранные инструменты из toolChoice класса
    bgLangChoices:   {},   // { idx → язык } выбранные языки из languagesChoice предыстории
    bgSkillChoices:  [],   // выбранные навыки из skillChoices предыстории
    // Состояние выборов от подкласса
    subclassToolChoices: {},  // { idx → название } выбранные инструменты от подкласса
    subclassSkillChoices: [], // выбранные навыки от подкласса (из skillChoices)
    subclassLangChoices: {},  // { idx → язык } свободные языки от подкласса
    subclassLangListChoices: {}, // { idx → язык } из languagesChoice (из списка)
    subclassSkillOrToolChoices: {}, // выбор навык-или-инструмент от подкласса
  };
}

// ══════════════════════════════════════════════════════════
// ИСТОЧНИКИ
// ══════════════════════════════════════════════════════════
// Источники, используемые на каждом шаге
function getStepSources() {
  const step = currentStep;
  if (step === 1) {
    const s = new Set();
    (window.RACES || []).forEach(r => {
      if (r.source) s.add(r.source);
      (r.subraces || []).forEach(sr => { if (sr.source) s.add(sr.source); });
    });
    return s;
  }
  if (step === 2) {
    const s = new Set();
    (window.CLASSES || []).forEach(c => {
      if (c.source) s.add(c.source);
      (c.subclasses || []).forEach(sc => { if (sc.source) s.add(sc.source); });
    });
    return s;
  }
  if (step === 3) {
    const s = new Set();
    (window.BACKGROUNDS || []).forEach(b => { if (b.source) s.add(b.source); });
    return s;
  }
  if (step === 6) {
    const s = new Set();
    (window.SPELLS || []).forEach(sp => { if (sp.source) s.add(sp.source); });
    return s;
  }
  return null;
}

function buildSourceFilters() {
  const bar = document.getElementById('source-bar');
  if (!bar) return;
  const stepSources = getStepSources();
  if (!stepSources) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';

  const defined = window.SOURCES || {};
  const visible = [...stepSources].filter(s => defined[s]).sort((a,b) => {
    if (a === 'PH14') return -1; if (b === 'PH14') return 1;
    const aHB = a.startsWith('HB'), bHB = b.startsWith('HB');
    if (aHB && !bHB) return 1; if (!aHB && bHB) return -1;
    return a.localeCompare(b);
  });
  const mainKeys = visible.filter(k => !k.startsWith('HB'));
  const hbKeys   = visible.filter(k =>  k.startsWith('HB'));
  const allActive   = visible.every(k => enabledSources.has(k));
  const allHbActive = hbKeys.length > 0 && hbKeys.every(k => enabledSources.has(k));

  const chipHtml = (k) =>
    `<label class="src-chip ${enabledSources.has(k) ? 'active' : ''}" title="${defined[k]||k}"><input type="checkbox" value="${k}" ${enabledSources.has(k)?'checked':''} onchange="toggleSource('${k}',this.checked);autoSave()">${k}</label>`;

  const c = document.getElementById('source-filters');
  let html = `<div class="source-bar-inner">
    <button class="src-chip-all ${allActive?'active':''}" onclick="toggleAllSources()">ВСЕ</button>
    ${mainKeys.map(chipHtml).join('')}
  </div>`;
  if (hbKeys.length) {
    html += `<div class="source-bar-inner">
      <button class="src-chip-all ${allHbActive?'active':''}" onclick="toggleAllHbSources()">Все HB</button>
      ${hbKeys.map(chipHtml).join('')}
    </div>`;
  }
  c.innerHTML = html;
}

function toggleAllSources() {
  const stepSources = getStepSources();
  if (!stepSources) return;
  const defined = window.SOURCES || {};
  const visible = [...stepSources].filter(s => defined[s]);
  const allActive = visible.every(k => enabledSources.has(k));
  if (allActive) { enabledSources = new Set(['PH14']); }
  else { visible.forEach(k => enabledSources.add(k)); }
  buildSourceFilters();
  rebuildCurrentStep();
}

function toggleAllHbSources() {
  const stepSources = getStepSources();
  if (!stepSources) return;
  const defined = window.SOURCES || {};
  const hbKeys = [...stepSources].filter(s => defined[s] && s.startsWith('HB'));
  const allHbActive = hbKeys.every(k => enabledSources.has(k));
  if (allHbActive) { hbKeys.forEach(k => enabledSources.delete(k)); }
  else { hbKeys.forEach(k => enabledSources.add(k)); }
  buildSourceFilters();
  rebuildCurrentStep();
}

function toggleSource(src, on) {
  on ? enabledSources.add(src) : enabledSources.delete(src);
  buildSourceFilters();
  rebuildCurrentStep();
}

function rebuildCurrentStep() {
  [null,renderStep1,renderStep2,renderStep3,renderStep4,null,renderStep6Spells,null][currentStep]?.();
}

// ══════════════════════════════════════════════════════════
// НАВИГАЦИЯ
// ══════════════════════════════════════════════════════════
function showView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + v).classList.add('active');
  // Немедленно скрываем тултип при смене страницы
  clearTimeout(window._tooltipShowTimer); clearTimeout(window._tooltipTimer);
  if (window._tooltipEl) { window._tooltipEl.style.opacity='0'; window._tooltipEl.remove(); window._tooltipEl=null; }
  ['list','create','sheet'].forEach(name => {
    document.getElementById('nav-' + name)?.classList.toggle('active', name === v);
  });
  if (v === 'create') { /* buildSourceFilters и initWizard — ниже */ }
  else { const bar = document.getElementById('source-bar'); if (bar) bar.style.display = 'none'; }
  // Show sheet actions in navbar only when sheet is active
  const sheetAct = document.getElementById('nav-sheet-actions');
  const gearSheetItems = document.getElementById('gear-sheet-items');
  const gear = document.getElementById('nav-sheet-gear');
  if (sheetAct) { sheetAct.style.display = v === 'sheet' ? 'flex' : 'none'; }
  if (gearSheetItems) { gearSheetItems.style.display = v === 'sheet' ? '' : 'none'; }
  // Gear pushes right only when sheet-actions are hidden
  if (gear) { gear.style.marginLeft = v === 'sheet' ? '0' : 'auto'; }
  if (v === 'list')   { loadCharList(); window.scrollTo({ top: 0, behavior: 'instant' }); }
  if (v === 'create') initWizard();
  if (v === 'sheet' && !currentChar) { showView('list'); return; }
}

// ── Таблица опыта (из Опыт.xlsx) ──
const XP_TABLE = [
  { xp:      0, level:  1, pb: 2 },
  { xp:    300, level:  2, pb: 2 },
  { xp:    900, level:  3, pb: 2 },
  { xp:   2700, level:  4, pb: 2 },
  { xp:   6500, level:  5, pb: 3 },
  { xp:  14000, level:  6, pb: 3 },
  { xp:  23000, level:  7, pb: 3 },
  { xp:  34000, level:  8, pb: 3 },
  { xp:  48000, level:  9, pb: 4 },
  { xp:  64000, level: 10, pb: 4 },
  { xp:  85000, level: 11, pb: 4 },
  { xp: 100000, level: 12, pb: 4 },
  { xp: 120000, level: 13, pb: 5 },
  { xp: 140000, level: 14, pb: 5 },
  { xp: 165000, level: 15, pb: 5 },
  { xp: 195000, level: 16, pb: 5 },
  { xp: 225000, level: 17, pb: 6 },
  { xp: 265000, level: 18, pb: 6 },
  { xp: 305000, level: 19, pb: 6 },
  { xp: 355000, level: 20, pb: 6 },
];

function xpForLevel(lvl) {
  const row = XP_TABLE.find(r => r.level === lvl);
  return row ? row.xp : 355000;
}
function levelForXp(xp) {
  let lvl = 1;
  for (const row of XP_TABLE) { if (xp >= row.xp) lvl = row.level; }
  return Math.min(lvl, 20);
}
function pbForLevel(lvl) {
  const row = XP_TABLE.find(r => r.level === lvl);
  return row ? row.pb : 2;
}

function updateCedXpBar() {
  const xp  = parseInt(document.getElementById('ced-xp')?.value)||0;
  const lvl = parseInt(document.getElementById('ced-level')?.value)||1;
  const curFloor = xpForLevel(lvl);
  const nextCeil = lvl >= 20 ? xpForLevel(20) : xpForLevel(lvl + 1);
  const pct = lvl >= 20 ? 100 : Math.min(100, Math.round((xp - curFloor) / (nextCeil - curFloor) * 100));
  const bar  = document.getElementById('ced-xp-bar');
  const info = document.getElementById('ced-xp-info');
  const hint = document.getElementById('ced-levelup-hint');
  if (bar)  bar.style.width = Math.max(0, pct) + '%';
  if (info) info.textContent = lvl >= 20
    ? `${xp.toLocaleString()} XP — максимальный уровень`
    : `${xp.toLocaleString()} / ${nextCeil.toLocaleString()} XP (ещё ${Math.max(0, nextCeil - xp).toLocaleString()})`;
}

function showLevelUpEffect(newLevel) {
  // Вспышка хедера
  const header = document.getElementById('sheet-header');
  if (header) {
    header.classList.remove('levelup-flash');
    void header.offsetWidth; // reflow
    header.classList.add('levelup-flash');
    setTimeout(() => header.classList.remove('levelup-flash'), 1400);
  }
  // Всплывающий текст
  const popup = document.createElement('div');
  popup.className = 'levelup-popup';
  popup.textContent = `⬆ Уровень ${newLevel}!`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1900);
}

function gainXpDialog() {
  const gainEl = document.getElementById('ced-xp-gain');
  const xpEl   = document.getElementById('ced-xp');
  const lvlEl  = document.getElementById('ced-level');
  const gain = parseInt(gainEl?.value)||0;
  if (!gain || gain <= 0) return;
  let xp  = (parseInt(xpEl?.value)||0) + gain;
  let lvl = parseInt(lvlEl?.value)||1;
  const oldLvl = lvl;
  // Автоповышение уровня
  while (lvl < 20 && xp >= xpForLevel(lvl + 1)) lvl++;
  xpEl.value  = xp;
  lvlEl.value = lvl;
  if (gainEl) gainEl.value = '';
  updateCedXpBar();
  if (lvl > oldLvl) {
    // Применяем к персонажу сразу и показываем эффект
    if (currentChar) {
      currentChar.xp    = xp;
      currentChar.level = lvl;
      currentChar.proficiencyBonus = pbForLevel(lvl);
      renderSheet(currentChar);
    }
    showLevelUpEffect(lvl);
  }
}

function openCharEditDialog() {
  if (!currentChar) return;
  const o = document.getElementById('char-edit-overlay');
  if (!o) return;
  document.getElementById('ced-name').value  = currentChar.name||'';
  document.getElementById('ced-race').value  = currentChar.raceName||'';
  document.getElementById('ced-class').value = currentChar.className||'';
  document.getElementById('ced-level').value = currentChar.level||1;
  document.getElementById('ced-xp').value    = currentChar.xp||0;
  const gainEl = document.getElementById('ced-xp-gain');
  if (gainEl) gainEl.value = '';
  updateCedXpBar();
  o.classList.remove('hidden');
}
function closeCharEditDialog() {
  const o = document.getElementById('char-edit-overlay');
  if (o) o.classList.add('hidden');
}
function saveCharEditDialog() {
  if (!currentChar) return;
  const newName      = document.getElementById('ced-name').value.trim();
  const newRace      = document.getElementById('ced-race').value.trim();
  const newClassName = document.getElementById('ced-class').value.trim();
  const newLevel     = parseInt(document.getElementById('ced-level').value)||1;
  const newXp        = parseInt(document.getElementById('ced-xp').value)||0;

  if (newName)  currentChar.name      = newName;
  if (newRace)  currentChar.raceName  = newRace;
  currentChar.level = newLevel;
  currentChar.xp    = newXp;
  currentChar.proficiencyBonus = pbForLevel(newLevel);

  // Если класс изменился — ищем в базе и обновляем зависимые поля
  if (newClassName && newClassName !== currentChar.className) {
    currentChar.className = newClassName;
    const allClasses = window.CLASSES || [];
    const found = allClasses.find(c =>
      c.name === newClassName ||
      (c.nameEn && c.nameEn.toLowerCase() === newClassName.toLowerCase()) ||
      c.id === newClassName.toLowerCase()
    );
    if (found) {
      currentChar.class         = found.id;
      currentChar.className     = found.name;
      currentChar.hitDie        = found.hitDie;
      currentChar.hitDieOverride= null;
      currentChar.spellAbility  = found.spellcasting?.ability || null;

      currentChar.savingThrows  = found.savingThrows || [];
      currentChar.armorProf     = found.armorProf || '';
      currentChar.weaponProf    = found.weaponProf || '';
      const conMod = getMod(currentChar.abilities?.['ТЕЛ']||10);
      const hd = found.hitDie;
      currentChar.hpMax     = hd + conMod + Math.max(0, newLevel-1) * (Math.floor(hd/2)+1+conMod);
      currentChar.hpCurrent = Math.min(currentChar.hpCurrent||currentChar.hpMax, currentChar.hpMax);
      showToast(`Класс изменён на ${found.name} (к${hd}, ${found.spellcasting ? 'заклинатель: '+found.spellcasting.ability : 'не заклинатель'})`, 'success');
    } else {
      showToast(`Класс "${newClassName}" не найден в базе — сохранено как есть`, 'warn');
    }
  }

  closeCharEditDialog();
  renderSheet(currentChar);
  saveSheet();
}

// ── Иконки-заглушки по классам (emoji SVG-стиль) ──
const CLASS_ICONS = {
  bard:'🎵', barbarian:'🪓', fighter:'⚔️', wizard:'🧙', cleric:'✝️',
  rogue:'🗡️', ranger:'🏹', paladin:'⚜️', druid:'🌿', monk:'👊',
  sorcerer:'🔮', warlock:'📜', artificer:'⚙️', 'blood hunter':'🩸',
};
function getClassIcon(char) {
  if (!char) return '🧙';
  // First try live CLASSES data (matches card icons exactly)
  const fromData = (window.CLASSES || []).find(c =>
    c.id === (char.class || '') || c.name === char.className
  );
  if (fromData?.icon) return fromData.icon;
  const id = char.class || '';
  return CLASS_ICONS[id] || CLASS_ICONS[char.className?.toLowerCase()] || '⚔️';
}

function triggerPortraitUpload() {
  document.getElementById('portrait-file-input')?.click();
}
let _cropTarget = 'wizard'; // 'wizard' | 'sheet'

function onPortraitFileSelected(input) {
  const file = input.files?.[0];
  if (!file) return;
  _cropTarget = 'sheet';
  const reader = new FileReader();
  reader.onload = e => openCropDialog(e.target.result);
  reader.readAsDataURL(file);
  input.value = '';
}
function renderPortrait(char) {
  const portEl = document.getElementById('s-portrait');
  if (!portEl) return;
  if (char?.portrait) {
    // Сохраняем оверлей
    portEl.innerHTML = `<img src="${char.portrait}" alt="portrait"><div class="portrait-overlay">📷<br>Фото</div>`;
  } else {
    const icon = getClassIcon(char);
    portEl.innerHTML = `<span style="font-size:2.4rem;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))">${icon}</span><div class="portrait-overlay">📷<br>Фото</div>`;
  }
  // Зеркалируем в Личность
  const spPort = document.getElementById('sp-portrait-box');
  if (spPort) {
    if (char?.portrait) {
      spPort.innerHTML = `<img src="${char.portrait}" alt="portrait"><div class="portrait-overlay">📷<br>Фото</div>`;
    } else {
      const icon = getClassIcon(char);
      spPort.innerHTML = `<span style="font-size:3.5rem;line-height:1">${icon}</span><div class="portrait-overlay">📷<br>Фото</div>`;
    }
  }
}

function showInner(tab, panelId) {
  // Немедленно отменяем отложенный показ тултипа при смене вкладки
  clearTimeout(window._tooltipShowTimer);
  if (window._tooltipEl) { window._tooltipEl.style.opacity = '0'; }
  // support both old wizard inner-tabs and new sheet-tabs
  const parent = tab.closest('.inner-tabs, .sheet-tabs') || document;
  parent.querySelectorAll('.inner-tab, .sheet-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.inner-panel, .sheet-panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ══════════════════════════════════════════════════════════
// МАСТЕР СОЗДАНИЯ
// ══════════════════════════════════════════════════════════
function initWizard() {
  // Clean up any leftover confirm dialog from previous session
  document.getElementById('wiz-confirm-dialog')?.remove();
  wiz = makeEmptyWiz();
  currentStep = 0;
  buildStepIndicators();
  buildSourceFilters();
  applyTheme(currentTheme);
  updateWizardNav();

  // ── Сброс портрета ──
  const _prev    = document.getElementById('portrait-preview');
  const _ph      = document.getElementById('portrait-placeholder');
  const _hint    = document.getElementById('portrait-hint');
  const _drop    = document.getElementById('portrait-drop');
  const _pfile   = document.getElementById('portrait-file');
  if (_prev)  { _prev.src = ''; _prev.style.display = 'none'; }
  if (_ph)    { _ph.style.display = ''; _ph.textContent = '🧙'; }
  if (_hint)  _hint.style.display = '';
  if (_drop)  _drop.classList.remove('has-image');
  if (_pfile) _pfile.value = '';

  // ── Полный сброс всех UI-элементов мастера ──
  // Шаг 0: базовые поля
  syncStep0();

  // Шаг 1: раса
  const raceGrid = document.getElementById('race-grid');
  if (raceGrid) raceGrid.innerHTML = '';
  const subraceContainer = document.getElementById('subrace-container');
  if (subraceContainer) subraceContainer.innerHTML = '';

  // Шаг 2: класс
  const classGrid = document.getElementById('class-grid');
  if (classGrid) classGrid.innerHTML = '';
  const classDetails = document.getElementById('class-details');
  if (classDetails) classDetails.innerHTML = '';

  // Шаг 3: предыстория
  const bgGrid = document.getElementById('background-grid');
  if (bgGrid) bgGrid.innerHTML = '';
  const bgDetails = document.getElementById('background-details');
  if (bgDetails) bgDetails.innerHTML = '';

  // Шаг 4: характеристики / расовый ASI
  const racialAsi = document.getElementById('racial-asi-section');
  if (racialAsi) racialAsi.innerHTML = '';

  // Шаг 5: навыки/инструменты
  const skillsStep = document.getElementById('skills-step');
  if (skillsStep) skillsStep.innerHTML = '';

  // Шаг 6: заклинания — сбрасываем контейнер страницы
  const spellsPage = document.getElementById('wpage-6');
  if (spellsPage) spellsPage.innerHTML = '';

  // Шаг 7: снаряжение
  const equipChoices = document.getElementById('equipment-choices');
  if (equipChoices) equipChoices.innerHTML = '';

  // Сразу рендерим первый шаг
  renderCurrentStep();
}

// ══════════════════════════════════════════════════════════
// ДИАЛОГ «СОХРАНИТЬ ИЗМЕНЕНИЯ?» (при переходе с листа)
// ══════════════════════════════════════════════════════════
let _saveConfirmCallback = null; // функция, вызываемая после решения пользователя

// Автосохранение активно — диалог подтверждения не нужен.
// _guardedActionFromSheet просто вызывает action() немедленно.
function _guardedActionFromSheet(action) {
  if (currentChar) saveSheet();
  action();
}


function buildStepIndicators() {
  document.getElementById('step-indicators').innerHTML =
    STEP_NAMES.map((n, i) =>
      `<div class="step-indicator" id="si-${i}" onclick="jumpToStep(${i})">${i+1}. ${n}</div>`
    ).join('');
}

function jumpToStep(i) {
  if (i > currentStep && !validateStep()) return;
  currentStep = i;
  updateWizardNav();
  renderCurrentStep();
  buildSourceFilters();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateWizardNav() {
  document.querySelectorAll('.wizard-page').forEach((p, i) =>
    p.classList.toggle('active', i === currentStep));
  document.querySelectorAll('.step-indicator').forEach((s, i) => {
    s.className = 'step-indicator' +
      (i < currentStep ? ' done' : i === currentStep ? ' current' : '');
  });
  const btnPrev       = document.getElementById('btn-prev');
  const btnNext       = document.getElementById('btn-next');
  const btnNextRandom = document.getElementById('btn-next-random');
  if (btnPrev) btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
  if (btnNext) btnNext.textContent = currentStep === TOTAL_STEPS - 1 ? '✅ Создать' : 'Далее →';
  if (btnNextRandom) btnNextRandom.style.display = currentStep === TOTAL_STEPS - 1 ? 'none' : '';
  const lbl = document.getElementById('step-label');
  if (lbl) lbl.textContent = `${currentStep + 1} / ${TOTAL_STEPS}`;
}

function wizardNext() {
  if (!validateStep()) return;

  // ── Шаг 5: навыки — проверить незаполненные языки/инструменты ──
  if (currentStep === 5) {
    let hasUnfilledLang = false, hasUnfilledTool = false;
    try { hasUnfilledLang = _hasUnfilledLangChoices(); } catch(e) { console.warn('lang check error:', e); }
    try { hasUnfilledTool = _hasUnfilledToolChoices(); } catch(e) { console.warn('tool check error:', e); }
    if (hasUnfilledLang || hasUnfilledTool) {
      const what = [hasUnfilledLang && 'языки', hasUnfilledTool && 'владения инструментами'].filter(Boolean).join(' и ');
      _showConfirmDialog(
        `Вы не выбрали ${what}. Можно вписать их вручную в лист персонажа позже — или выбрать сейчас.`,
        [
          { label: 'Продолжить', action: () => { _wizAdvance(); } },
          { label: 'Выбрать сейчас', action: null, secondary: true }
        ]
      );
      return;
    }
  }

  // ── Шаг 7 (последний): снаряжение — если ничего не выбрано ──
  if (currentStep === TOTAL_STEPS - 1) {
    if (!wiz.equipmentChoice) {
      _showConfirmDialog(
        'Вы не выбрали снаряжение. Вы получите 4к4 золотых монет.',
        [
          { label: 'OK', action: () => {
            let gold = 0;
            for (let i=0;i<4;i++) gold += Math.ceil(Math.random()*4);
            wiz.currency.gp = (wiz.currency.gp||0) + gold; wiz.startGold = gold;
            const el = document.getElementById('w-gold'); if(el) el.value = wiz.currency.gp;
            createCharacter();
          }},
          { label: 'Отмена', action: null, secondary: true }
        ]
      );
      return;
    }
    createCharacter();
    return;
  }

  _wizAdvance();
}

function _wizAdvance() {
  currentStep++;
  updateWizardNav();
  renderCurrentStep();
  buildSourceFilters();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function _hasUnfilledLangChoices() {
  // Free language slots (race free-choice + bg numeric + subclass)
  const totalFree = _countFreeLangSlots();
  if (totalFree > 0) {
    const filled = (wiz.langChoices||[]).filter(Boolean).length;
    if (filled < totalFree) return true;
  }
  // Background languagesChoice: list-based choice ({count, from:[...]})
  // Field name in backgrounds.js is 'languagesChoice' (not 'languageChoices')
  const bg = wiz.background;
  const bgLangChoice = bg?.languagesChoice;  // {count, from:[...]}
  if (bgLangChoice?.count > 0) {
    const filled = Object.values(wiz.bgLangChoices||{}).filter(Boolean).length;
    if (filled < bgLangChoice.count) return true;
  }
  return false;
}

function _countFreeLangSlots() {
  // Mirrors logic in buildLangToolChoices — count free lang slots
  const race = wiz.race;
  const bg   = wiz.background;
  const subP = _getSubclassProfs(wiz.cls, wiz.subclass, wiz.level||1);
  let totalFree = 0;
  // Race languages: array of strings, count entries containing "выбор"
  const allRaceLangs = [
    ...(Array.isArray(race?.languages) ? race.languages : []),
    ...(Array.isArray(wiz.subrace?.languages) ? wiz.subrace.languages : []),
  ];
  totalFree += allRaceLangs.filter(l => l.toLowerCase().includes('выбор')).length;
  // Background languages: NUMBER (how many free choices)
  const bgLangCount = typeof bg?.languages === 'number' ? bg.languages : 0;
  totalFree += bgLangCount;
  totalFree += (subP.languagesFree||0);
  return totalFree;
}

function _hasUnfilledToolChoices() {
  // Background toolChoice (singular) = {count, category|from|any}
  const bg = wiz.background;
  const bgTC = bg?.toolChoice;  // singular — matches backgrounds.js field name
  const bgChoiceCount = bgTC?.count || 0;
  if (bgChoiceCount > 0) {
    const filled = Object.values(wiz.bgToolChoices||{}).filter(Boolean).length;
    if (filled < bgChoiceCount) return true;
  }
  // Class toolChoice
  const cls = wiz.cls;
  const clsTC = cls?.toolChoice;
  const clsToolCount = clsTC?.count || (Array.isArray(clsTC) ? clsTC.length : 0);
  if (clsToolCount > 0) {
    const filled = Object.values(wiz.clsToolChoices||{}).filter(Boolean).length;
    if (filled < clsToolCount) return true;
  }
  return false;
}

function _showConfirmDialog(message, buttons) {
  // Remove existing dialog if any
  document.getElementById('wiz-confirm-dialog')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'wiz-confirm-dialog';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
  const box = document.createElement('div');
  box.style.cssText = 'background:#272e43;border:1px solid #606b85;border-radius:8px;padding:1.4rem 1.6rem;max-width:420px;width:92vw;box-shadow:0 8px 48px rgba(0,0,0,.7);animation:dialogIn .18s ease';
  box.innerHTML = `<p style="margin:0 0 1.1rem;font-size:.93rem;line-height:1.5;color:var(--text)">${message}</p>
    <div style="display:flex;gap:.5rem;justify-content:flex-end">
      ${buttons.map((b,i) => `<button class="btn btn-secondary" style="${b.secondary?'':'color:var(--accent2);border-color:var(--accent2)'}" data-idx="${i}">${b.label}</button>`).join('')}
    </div>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  box.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.remove();
      const action = buttons[parseInt(btn.dataset.idx)]?.action;
      if (action) action();
    });
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function wizardPrev() {
  if (currentStep > 0) {
    currentStep--;
    updateWizardNav();
    renderCurrentStep();
    buildSourceFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function renderCurrentStep() {
  const fns = [syncStep0, renderStep1, renderStep2, renderStep3,
               renderStep4, renderStep5, renderStep6Spells, renderStep7];
  fns[currentStep]?.();
}

/**
 * Возвращает строку с ошибкой если не все ASI-выборы заполнены,
 * иначе null.
 */
function _validateRacialAsi() {
  const race = wiz.race;
  const sub  = wiz.subrace;
  if (!race) return null;  // раса не выбрана — шаг 1 поймает это раньше

  const mode = sub?.asiMode || race?.asiMode || 'fixed';

  if (mode === 'halfelf') {
    const picks = wiz.halfElfPicks || [];
    const unfilled = picks.filter(p => !p.key).length;
    if (unfilled) return `Выберите ${unfilled} характеристику для бонуса полуэльфа`;
  }

  if (mode === 'variant') {
    const picks = wiz.variantHumanPicks || [];
    const unfilled = picks.filter(p => !p.key).length;
    if (unfilled) return `Выберите ${unfilled} характеристику для вариантного человека`;
  }

  if (mode === 'choice') {
    const modeChoice = wiz.asiChoiceMode || '2+1';
    const needed = modeChoice === '1+1+1' ? 3 : 2;
    const picks = wiz.asiChoicePicks || {};
    const filled = Object.keys(picks).length;
    if (filled < needed) return `Выберите все ${needed} характеристики для ASI`;
  }

  if (mode === 'flex2') {
    const modeChoice = wiz.flex2Mode || '2+1';
    const needed = modeChoice === '1+1+1' ? 3 : modeChoice === '2only' ? 1 : 2;
    const picks = wiz.flex2Picks || {};
    const filled = Object.keys(picks).length;
    if (filled < needed) return `Выберите все ${needed} характеристики для ASI`;
  }

  if (mode === 'partial') {
    const src2 = (sub?.asiOverride ? sub : null) || sub || race;
    const ch = src2?.asiChoice;
    if (ch?.count > 0) {
      const picks = wiz.asiPartialPicks || {};
      const filled = Object.values(picks).filter(p => p?.key).length;
      if (filled < ch.count) return `Выберите ${ch.count - filled} характеристику для ASI`;
    }
  }

  if (mode === 'multi-choice') {
    const src3 = sub || race;
    const steps = src3?.asiChoice || [];
    const picks = wiz.asiMultiPicks || [];
    const unfilled = steps.filter((_, i) => !picks[i]?.key).length;
    if (unfilled) return `Выберите ${unfilled} характеристику для ASI`;
  }

  return null;
}

function validateStep() {
  if (currentStep === 0) { collectStep0(); if (!wiz.name) { toast('⚠️ Введите имя','error'); return false; } }
  if (currentStep === 1 && !wiz.race)  { toast('⚠️ Выберите расу','error'); return false; }
  if (currentStep === 2 && !wiz.cls)   { toast('⚠️ Выберите класс','error'); return false; }
  if (currentStep === 4) {
    collectAbilities();
    // Проверяем расовые ASI-выборы (дропдауны на шаге 4)
    const _asiErr = _validateRacialAsi();
    if (_asiErr) { toast('⚠️ ' + _asiErr, 'error'); return false; }
  }
  // Шаг 5 — навыки: проверяем, что выбрано нужное количество
  if (currentStep === 5) {
    try {
      const cls = wiz.cls;
      const bgSkills = getBgSkills();
      const available = cls?.skillChoices === 'all'
        ? SKILLS_DATA.map(s => s.name)
        : (cls?.skillChoices || []);
      const classCount    = cls?.skillCount || 2;
      // Ensure skillProfs is always a Set (guard against corruption)
      if (!(wiz.skillProfs instanceof Set)) {
        wiz.skillProfs = new Set(Array.isArray(wiz.skillProfs) ? wiz.skillProfs : []);
      }
      const classSelected = [...wiz.skillProfs].filter(s => available.includes(s) && !bgSkills.includes(s));
      if (classSelected.length < classCount) {
        toast(`⚠️ Выберите ещё ${classCount - classSelected.length} навык(а) от класса`, 'error');
        return false;
      }
    } catch(err) {
      console.error('validateStep 5 error:', err);
      toast('⚠️ Ошибка проверки навыков. Попробуйте ещё раз.', 'error');
      return false;
    }
  }
  // Шаг 7 — снаряжение: все дропдауны должны быть выбраны
  if (currentStep === 7 && wiz.equipmentChoice !== 'gold') {
    const emptySelects = document.querySelectorAll('#equipment-choices select');
    const unempty = [...emptySelects].filter(s => s.value === '');
    if (unempty.length > 0) {
      unempty[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      unempty[0].style.borderColor = '#e05555';
      setTimeout(() => { unempty[0].style.borderColor = ''; }, 1500);
      toast(`⚠️ Выберите все варианты снаряжения (не выбрано: ${unempty.length})`, 'error');
      return false;
    }
  }
  return true;
}

// ── ШАГ 0: Информация ──
function syncStep0() {
  const s = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  s('w-name',wiz.name); s('w-level',wiz.level); s('w-xp',wiz.xp);
  s('w-alignment',wiz.alignment); s('w-appearance',wiz.appearance);
  s('w-age',wiz.age); s('w-height',wiz.height); s('w-weight',wiz.weight);
  s('w-eyes',wiz.eyes); s('w-skin',wiz.skin); s('w-hair',wiz.hair);
  s('w-traits',wiz.traits); s('w-ideals',wiz.ideals); s('w-bonds',wiz.bonds);
  s('w-flaws',wiz.flaws); s('w-backstory',wiz.backstory);
}
function collectStep0() {
  const g = id => document.getElementById(id)?.value || '';
  wiz.name=g('w-name').trim(); wiz.level=parseInt(g('w-level'))||1; wiz.xp=parseInt(g('w-xp'))||0;
  wiz.alignment=g('w-alignment'); wiz.appearance=g('w-appearance');
  wiz.age=g('w-age'); wiz.height=g('w-height'); wiz.weight=g('w-weight');
  wiz.eyes=g('w-eyes'); wiz.skin=g('w-skin'); wiz.hair=g('w-hair');
  wiz.traits=g('w-traits'); wiz.ideals=g('w-ideals'); wiz.bonds=g('w-bonds');
  wiz.flaws=g('w-flaws'); wiz.backstory=g('w-backstory');
}

// ── ПОРТРЕТ ──
// ── PORTRAIT CROP ENGINE ──
const _crop = {
  img: null, scale: 1, minScale: 1,
  ox: 0, oy: 0,          // image offset relative to viewport
  dragStartX: 0, dragStartY: 0,
  dragging: false,
  vw: 0,                 // viewport size (square)
  naturalW: 0, naturalH: 0,
};

function handlePortraitUpload(input) {
  const file = input.files[0];
  if (!file) return;
  _cropTarget = 'wizard';
  const reader = new FileReader();
  reader.onload = e => openCropDialog(e.target.result);
  reader.readAsDataURL(file);
  input.value = '';
}

function openCropDialog(src) {
  const overlay  = document.getElementById('crop-overlay');
  const imgEl    = document.getElementById('crop-img');
  const viewport = document.getElementById('crop-viewport');
  if (!overlay || !imgEl || !viewport) return;

  overlay.classList.remove('hidden');
  imgEl.src = src;
  imgEl.onload = () => {
    const vsize = viewport.clientWidth;
    _crop.vw = vsize;
    _crop.naturalW = imgEl.naturalWidth;
    _crop.naturalH = imgEl.naturalHeight;

    // Минимальный масштаб: изображение должно покрывать весь квадрат
    const minScale = Math.max(vsize / imgEl.naturalWidth, vsize / imgEl.naturalHeight);
    _crop.minScale = minScale;
    _crop.scale = minScale;

    // Центрируем
    _crop.ox = (vsize - imgEl.naturalWidth * minScale) / 2;
    _crop.oy = (vsize - imgEl.naturalHeight * minScale) / 2;

    const zoomInput = document.getElementById('crop-zoom');
    if (zoomInput) {
      zoomInput.min  = minScale;
      zoomInput.max  = minScale * 5;
      zoomInput.step = minScale * 0.01;
      zoomInput.value = minScale;
    }
    _cropApplyTransform();
  };
}

function closeCropDialog() {
  document.getElementById('crop-overlay')?.classList.add('hidden');
}

function _cropApplyTransform() {
  const imgEl = document.getElementById('crop-img');
  if (!imgEl) return;
  // Clamp offset so image always covers the viewport
  const dispW = _crop.naturalW * _crop.scale;
  const dispH = _crop.naturalH * _crop.scale;
  const vw = _crop.vw;
  _crop.ox = Math.min(0, Math.max(_crop.ox, vw - dispW));
  _crop.oy = Math.min(0, Math.max(_crop.oy, vw - dispH));
  imgEl.style.transform = `translate(${_crop.ox}px, ${_crop.oy}px) scale(${_crop.scale})`;
  imgEl.style.transformOrigin = '0 0';
  imgEl.style.width  = _crop.naturalW + 'px';
  imgEl.style.height = _crop.naturalH + 'px';
}

function cropZoomChange(val) {
  const vw = _crop.vw;
  const oldScale = _crop.scale;
  const newScale = parseFloat(val);
  // Zoom relative to center of viewport
  const cx = vw / 2, cy = vw / 2;
  _crop.ox = cx - (cx - _crop.ox) * (newScale / oldScale);
  _crop.oy = cy - (cy - _crop.oy) * (newScale / oldScale);
  _crop.scale = newScale;
  _cropApplyTransform();
}

// Drag logic
document.addEventListener('DOMContentLoaded', () => {
  const vp = document.getElementById('crop-viewport');
  if (!vp) return;

  const onDown = e => {
    if (document.getElementById('crop-overlay')?.classList.contains('hidden')) return;
    e.preventDefault();
    _crop.dragging = true;
    vp.classList.add('dragging');
    const pt = e.touches ? e.touches[0] : e;
    _crop.dragStartX = pt.clientX - _crop.ox;
    _crop.dragStartY = pt.clientY - _crop.oy;
  };
  const onMove = e => {
    if (!_crop.dragging) return;
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    _crop.ox = pt.clientX - _crop.dragStartX;
    _crop.oy = pt.clientY - _crop.dragStartY;
    _cropApplyTransform();
  };
  const onUp = () => { _crop.dragging = false; vp.classList.remove('dragging'); };

  vp.addEventListener('mousedown',  onDown);
  vp.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('mousemove',  onMove);
  document.addEventListener('touchmove',  onMove, { passive: false });
  document.addEventListener('mouseup',    onUp);
  document.addEventListener('touchend',   onUp);

  // Pinch-to-zoom
  let lastDist = 0;
  vp.addEventListener('touchstart', e => { if (e.touches.length === 2) lastDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY); }, { passive: true });
  vp.addEventListener('touchmove', e => {
    if (e.touches.length !== 2) return;
    const dist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
    const delta = dist / lastDist;
    lastDist = dist;
    const newScale = Math.max(_crop.minScale, Math.min(_crop.minScale * 5, _crop.scale * delta));
    const zoomInput = document.getElementById('crop-zoom');
    if (zoomInput) zoomInput.value = newScale;
    cropZoomChange(newScale);
  }, { passive: true });

  // Scroll to zoom
  vp.addEventListener('wheel', e => {
    if (document.getElementById('crop-overlay')?.classList.contains('hidden')) return;
    e.preventDefault();
    const delta   = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(_crop.minScale, Math.min(_crop.minScale * 5, _crop.scale * delta));
    const zoomInput = document.getElementById('crop-zoom');
    if (zoomInput) zoomInput.value = newScale;
    cropZoomChange(newScale);
  }, { passive: false });
});

function applyCrop() {
  const imgEl = document.getElementById('crop-img');
  if (!imgEl) return;
  const vw = _crop.vw;

  // Render crop to canvas
  const canvas = document.createElement('canvas');
  const size   = 400; // output size px
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Map viewport square back to original image coordinates
  const srcX = -_crop.ox / _crop.scale;
  const srcY = -_crop.oy / _crop.scale;
  const srcS =  vw / _crop.scale;

  ctx.drawImage(imgEl, srcX, srcY, srcS, srcS, 0, 0, size, size);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

  if (_cropTarget === 'sheet') {
    // Upload to server → save as characters/<name>.jpg
    if (currentChar && currentFilename) {
      const stem = currentFilename.replace(/\.json$/i, '');
      fetch(`/api/portrait/${stem}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: dataUrl})
      }).then(r => r.json()).then(res => {
        if (res.url) {
          currentChar.portrait = res.url + '?t=' + Date.now(); // cache-bust
          renderPortrait(currentChar);
          saveSheet();
        }
      }).catch(() => {
        // Fallback: store base64 if server unavailable
        currentChar.portrait = dataUrl;
        renderPortrait(currentChar);
        saveSheet();
      });
    }
  } else {
    // Wizard: keep base64 in memory until character is saved, then upload
    wiz.portrait = dataUrl;
    const preview     = document.getElementById('portrait-preview');
    const placeholder = document.getElementById('portrait-placeholder');
    const hint        = document.getElementById('portrait-hint');
    const drop        = document.getElementById('portrait-drop');
    if (preview)     { preview.src = dataUrl; preview.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
    if (hint)        hint.style.display = 'none';
    if (drop)        drop.classList.add('has-image');
  }
  closeCropDialog();
}

// ── ШАГ 1: Раса ──
function renderStep1() {
  const filtered = (window.RACES||[]).filter(r => enabledSources.has(r.source));
  const grid = document.getElementById('race-grid');
  if (!filtered.length) {
    grid.innerHTML = '<p class="note-text" style="grid-column:1/-1">Нет рас для выбранных источников.</p>';
    return;
  }
  grid.innerHTML = filtered.map(r => {
    const asiPreview = getRaceAsiPreview(r);
    const url = r.url || `https://5e14.dnd.su/race/${r.id}/`;
    // Вставляем мягкий перенос в длинные слова (Драконорождённый → Драконо­рождённый)
    const displayName = r.name
      .replace('Драконорождённый (FTD)', 'Драконо\u00ADрождённый (FTD)')
      .replace(/^Драконорождённый$/, 'Драконо\u00ADрождённый');
    return `<div class="option-card ${wiz.race?.id===r.id?'selected':''}" onclick="selectRace('${r.id}')"
      data-tooltip="${r.nameEn||r.name}" data-url="${url}"
      onmouseenter="showDndTooltip(this)" onmouseleave="hideDndTooltip()">
      <span class="icon">${r.icon}</span>
      <div class="opt-name">${displayName}</div>
      <div class="opt-desc">${asiPreview}</div>
      <div class="src-badge">${r.source}</div>
    </div>`;
  }).join('');
  renderSubraceBlock();
}

function getRaceAsiPreview(r) {
  if (r.asiMode === 'all+1')       return 'Все хар-ки +1';
  if (r.asiMode === 'variant')     return '2 хар-ки +1 / черта';
  if (r.asiMode === 'flex2')       return 'Вариативный ASI';
  if (r.asiMode === 'choice')      return '(по выбору)';
  if (r.asiMode === 'select') {
    // asi — массив вариантов: [{ИНТ:2,МДР:1},{ИНТ:1,МДР:2}]
    const opts = (r.asi||[]).map(opt =>
      Object.entries(opt).map(([k,v])=>`${k}+${v}`).join('/')
    );
    return 'Выбор: ' + opts.join(' или ');
  }
  if (r.asiMode === 'partial') {
    // asi — фиксированная часть, asiChoice — выбор
    const fixed = Object.entries(r.asi||{}).map(([k,v])=>`${k}+${v}`).join(', ');
    const ch = r.asiChoice;
    const choiceStr = ch ? (ch.any ? `+${ch.bonus||1} к любой` : `+${ch.bonus||1} к ${(ch.from||[]).join('/')}`) : '';
    return [fixed, choiceStr].filter(Boolean).join(' + ');
  }
  if (r.asiMode === 'multi-choice') return 'Составной выбор ASI';
  return Object.entries(r.asi||{}).filter(([k])=>!k.includes('выбор'))
    .map(([k,v])=>`${k} ${v>0?'+':''}${v}`).join(', ') || 'вариативно';
}

function selectRace(id) {
  wiz.race     = (window.RACES||[]).find(r => r.id === id);
  if (!wiz.race) return;
  wiz.subrace  = null;
  wiz.asiMode  = wiz.race.asiMode || 'fixed';
  wiz.asiVariantPicks = [];
  wiz.asiFlexPick = {};
  wiz.halfElfPicks = [{key:'',bonus:1},{key:'',bonus:1}];
  wiz.variantHumanPicks = [{key:'',bonus:1},{key:'',bonus:1}];
  wiz.asiChoicePicks = {};
  wiz.asiSelectIdx = 0;
  wiz.asiPartialPicks = {};
  wiz.asiMultiPicks = [];
  wiz.raceToolChoices = {};
  wiz.skillOrToolChoices = {};
  recalcRacialBonuses();
  document.querySelectorAll('#race-grid .option-card').forEach(c =>
    c.classList.toggle('selected', c.getAttribute('onclick')?.includes(`'${id}'`)));
  document.getElementById('w-size').value = wiz.race.size || 'Средний';
  renderSubraceBlock();
}

function renderSubraceBlock() {
  const c = document.getElementById('subrace-container');
  if (!wiz.race) { c.innerHTML=''; return; }
  const subs = (wiz.race.subraces||[]).filter(s => enabledSources.has(s.source));
  let html = '';
  if (subs.length) {
    const sub = wiz.subrace;
    // Subrace ASI text
    let subAsiText = '';
    if (sub) {
      if (sub.asiOverride && sub.asi) {
        subAsiText = `ASI (замена расовых): ${Object.entries(sub.asi).map(([k,v])=>`${ABILITY_FULL[k]} +${v}`).join(', ')}`;
      } else if (sub.asi && Object.keys(sub.asi).length) {
        subAsiText = `ASI: ${Object.entries(sub.asi).map(([k,v])=>`${ABILITY_FULL[k]} +${v}`).join(', ')}`;
      } else if (sub.asiMode === 'flex2') {
        subAsiText = 'ASI: вариативный (+2/+1 или +1/+1/+1 — выбор на шаге Характеристики)';
      } else if (sub.asiMode === 'choice') {
        subAsiText = 'ASI: гибкий (MPMM) — выбор на шаге Характеристики';
      }
    }
    html += `<div class="form-group" style="max-width:350px;margin-top:.9rem"><label>Подраса</label>
      <select onchange="selectSubrace(this.value);autoSave()">
        <option value="">— выбрать подрасу —</option>
        ${subs.map(s=>`<option value="${s.id}" ${wiz.subrace?.id===s.id?'selected':''}>${s.name}</option>`).join('')}
      </select>
      ${wiz.subrace?`<div class="note-text" style="margin-top:.35rem">${wiz.subrace.traits||''}</div>`:''}
      ${(()=>{
        const r = wiz.race; const s = wiz.subrace;
        const lines = [];
        const wpArr = _mergeWeaponProfs(r?.weaponProf, s?.weaponProf);
        const wp = wpArr.join(', ');
        const ap = [r?.armorProf,  s?.armorProf ].map(_cleanProf).filter(Boolean).join(', ');
        const tp = [r?.toolProf,   s?.toolProf  ].map(_cleanProf).filter(Boolean).join(', ');
        if (wp) lines.push(`⚔️ <b>Оружие:</b> ${wp}`);
        if (ap) lines.push(`🛡️ <b>Доспехи:</b> ${ap}`);
        if (tp) lines.push(`🔧 <b>Инструменты:</b> ${tp}`);
        return lines.length ? `<div class="proficiency-badge" style="margin-top:.4rem;display:block;line-height:1.6">${lines.join('<br>')}</div>` : '';
      })()}
      ${subAsiText?`<div class="proficiency-badge" style="margin-top:.3rem;display:inline-block">${subAsiText}</div>`:''}
    </div>`;
  }
  html += renderAsiOptions();
  c.innerHTML = html;
}

function renderAsiOptions() {
  const mode = wiz.asiMode;
  if (mode === 'fixed' || mode === 'all+1') return '';

  const note = `<div class="note-text" style="margin-top:.3rem;font-style:italic">🎯 Выбор бонусов характеристик — на шаге «Характеристики»</div>`;

  if (mode === 'halfelf') {
    return `<div class="info-box" style="margin-top:.8rem">
      <b>Полуэльф:</b> ХАР +2 (фиксированно) + 2 любые характеристики по +1 (кроме ХАР)
      ${note}
    </div>`;
  }
  if (mode === 'variant') {
    return `<div class="info-box" style="margin-top:.8rem">
      <b>Вариантный человек:</b> 2 характеристики +1 + черта + дополнительный навык
      ${note}
    </div>`;
  }
  if (mode === 'flex2') {
    return `<div class="info-box" style="margin-top:.8rem">
      <b>Вариативный ASI (TCE):</b> +2/+1 или +1/+1/+1 к любым характеристикам
      ${note}
    </div>`;
  }
  if (mode === 'choice') {
    return `<div class="info-box" style="margin-top:.8rem">
      <b>Гибкий ASI (MPMM):</b> +2/+1 или +1/+1/+1 к любым характеристикам
      ${note}
    </div>`;
  }
  if (mode === 'select') {
    const race = wiz.subrace || wiz.race;
    const opts = (race?.asi||[]).map((opt,i) =>
      `<label style="display:flex;align-items:center;gap:.4rem;cursor:pointer">
        <input type="radio" name="asi-select" value="${i}"
          ${wiz.asiSelectIdx===i?'checked':''}
          onchange="setAsiSelectOption(${i});autoSave()">
        ${Object.entries(opt).map(([k,v])=>`${ABILITY_FULL[k]} +${v}`).join(', ')}
      </label>`
    ).join('');
    return `<div class="info-box" style="margin-top:.8rem">
      <b>Выберите один вариант ASI:</b>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-top:.4rem">${opts}</div>
    </div>`;
  }
  if (mode === 'partial') {
    const race = wiz.subrace || wiz.race;
    const fixed = Object.entries(race?.asi||{}).map(([k,v])=>`${ABILITY_FULL[k]} +${v}`).join(', ');
    const ch = race?.asiChoice;
    if (!ch) return '';
    const pool = ch.any ? ABILITY_KEYS : (ch.from||[]);
    const taken = new Set(Object.keys(race?.asi||{}));
    const picks = wiz.asiPartialPicks||{};
    const selects = Array.from({length:ch.count||1},(_,i)=>{
      const opts = pool.map(k=>{
        const disabled = taken.has(k) || (Object.entries(picks).some(([,v])=>v.idx!==i&&v.key===k));
        return '<option value="'+k+'" '+(picks[i]?.key===k?'selected':'')+' '+(disabled?'disabled':'')+'>'+ABILITY_FULL[k]+(disabled?' ✓':'')+'</option>';
      }).join('');
      return '<div class="form-group" style="max-width:260px;margin-bottom:.35rem">'
        +'<label>+1 к характеристике (выбор '+(i+1)+')</label>'
        +'<select onchange="setAsiPartialPick('+i+',this.value);autoSave()">'
        +'<option value="">— выбрать —</option>'
        +opts
        +'</select></div>';
    }).join('');
    return '<div class="info-box" style="margin-top:.8rem">'
      +'<b>Частичный ASI:</b> '+fixed+' (фиксированно)'
      +'</div>'+selects;
  }
  if (mode === 'multi-choice') {
    const race = wiz.subrace || wiz.race;
    const steps = race?.asiChoice||[];
    if (!steps.length) return '';
    const picks = wiz.asiMultiPicks||[];
    return '<div class="info-box" style="margin-top:.8rem"><b>Составной выбор ASI:</b></div>'
    + steps.map((step,i)=>{
      const pool = step.any ? ABILITY_KEYS.filter(k=>!step.exclude||!picks.some((p,pi)=>pi<i&&p.key===k)) : (step.from||[]);
      const cur = picks[i]||{};
      const opts = pool.map(k=>'<option value="'+k+'" '+(cur.key===k?'selected':'')+'>'+ABILITY_FULL[k]+'</option>').join('');
      return '<div class="form-group" style="max-width:260px;margin-bottom:.35rem">'
        +'<label>+'+(step.bonus||1)+' к характеристике (шаг '+(i+1)+')</label>'
        +'<select onchange="setAsiMultiPick('+i+',this.value,'+(step.bonus||1)+');autoSave()">'
        +'<option value="">— выбрать —</option>'
        +opts
        +'</select></div>';
    }).join('');
  }
  return '';
}

function renderFlexPicks() {
  const count = wiz.asiFlexMode === '1+1+1' ? 3 : 2;
  const bonuses = wiz.asiFlexMode === '2+1' ? [2,1] : [1,1,1];
  return `<div class="form-row" style="margin-top:.5rem;max-width:550px">
    ${bonuses.map((b,i)=>`
      <div class="form-group"><label>Хар-ка ${i+1} (+${b})</label>
        <select onchange="setFlexPick(${i},${b},this.value);autoSave()">
          <option value="">—</option>
          ${ABILITY_KEYS.map(k=>`<option value="${k}">${ABILITY_FULL[k]}</option>`).join('')}
        </select>
      </div>`).join('')}
  </div>`;
}

function setVariantPick(idx, key) {
  wiz.asiVariantPicks[idx] = key;
  recalcRacialBonuses();
  renderSubraceBlock();
}

function setFlexMode(mode) {
  wiz.asiFlexMode = mode;
  wiz.asiFlexPick = {};
  recalcRacialBonuses();
  renderSubraceBlock();
}

function setFlexPick(idx, bonus, key) {
  // Remove old assignment at this index
  const keys = Object.entries(wiz.asiFlexPick).filter(([k,v])=>v===idx);
  keys.forEach(([k])=>delete wiz.asiFlexPick[k]);
  if (key) wiz.asiFlexPick[key] = {idx, bonus};
  recalcRacialBonuses();
  updateAbilityDisplay();
}

function selectSubrace(id) {
  const sub = wiz.race?.subraces?.find(s => s.id === id) || null;
  wiz.subrace = sub;
  if (sub) {
    wiz.asiMode = sub.asiMode || wiz.race?.asiMode || 'fixed';
    wiz.asiFlexMode = '2+1';
    wiz.asiFlexPick = {};
    wiz.asiSelectIdx = 0;
    wiz.asiPartialPicks = {};
    wiz.asiMultiPicks = [];
    wiz.raceToolChoices = {};
    wiz.skillOrToolChoices = {};
  }
  recalcRacialBonuses();
  renderSubraceBlock();
  updateAbilityDisplay();
}

function recalcRacialBonuses() {
  const race = wiz.race;
  const sub  = wiz.subrace;
  const mode = sub?.asiMode || race?.asiMode || 'fixed';
  wiz.asiMode = mode;
  const bon = {};

  if (mode === 'fixed' || mode === 'all+1') {
    if (sub?.asiOverride) {
      Object.entries(sub.asi||{}).forEach(([k,v]) => { bon[k]=(bon[k]||0)+v; });
    } else {
      Object.entries(race?.asi||{}).forEach(([k,v]) => { bon[k]=(bon[k]||0)+v; });
      Object.entries(sub?.asi||{}).forEach(([k,v])  => { bon[k]=(bon[k]||0)+v; });
    }
  } else if (mode === 'halfelf') {
    // ХАР+2 фиксированно от расы
    Object.entries(race?.asi||{}).forEach(([k,v]) => { bon[k]=(bon[k]||0)+v; });
    // + 2 выборных +1 (кроме ХАР)
    (wiz.halfElfPicks||[]).forEach(pick => {
      if (pick.key && pick.key !== 'ХАР') bon[pick.key]=(bon[pick.key]||0)+1;
    });
  } else if (mode === 'variant') {
    // 2 выборных +1 для вариантного человека
    (wiz.variantHumanPicks||[]).forEach(pick => {
      if (pick.key) bon[pick.key]=(bon[pick.key]||0)+1;
    });
  } else if (mode === 'flex2' || mode === 'choice') {
    const picks = wiz.asiChoicePicks || wiz.asiFlexPick || {};
    Object.entries(picks).forEach(([k,v]) => {
      if (k && v?.bonus) bon[k]=(bon[k]||0)+v.bonus;
    });
  } else if (mode === 'select') {
    // asi — массив вариантов, asiSelectIdx — выбранный индекс
    const src = wiz.subrace || wiz.race;
    const opts = src?.asi||[];
    const chosen = opts[wiz.asiSelectIdx ?? 0] || opts[0] || {};
    Object.entries(chosen).forEach(([k,v]) => { bon[k]=(bon[k]||0)+v; });
  } else if (mode === 'partial') {
    // Фиксированная часть из asi + выбранные из asiPartialPicks
    const src = wiz.subrace || wiz.race;
    // Фиксированные — если asiOverride берём только подрасу, иначе раса + подраса
    if (wiz.subrace?.asiOverride) {
      Object.entries(wiz.subrace.asi||{}).forEach(([k,v]) => { bon[k]=(bon[k]||0)+v; });
    } else {
      Object.entries(race?.asi||{}).forEach(([k,v]) => { bon[k]=(bon[k]||0)+v; });
      Object.entries(wiz.subrace?.asi||{}).forEach(([k,v]) => { bon[k]=(bon[k]||0)+v; });
    }
    // Выбранная часть
    Object.values(wiz.asiPartialPicks||{}).forEach(p => {
      if (p?.key) bon[p.key]=(bon[p.key]||0)+(p.bonus||1);
    });
  } else if (mode === 'multi-choice') {
    // Все шаги выбора
    (wiz.asiMultiPicks||[]).forEach(p => {
      if (p?.key) bon[p.key]=(bon[p.key]||0)+(p.bonus||1);
    });
  }
  wiz.racialBonuses = bon;
  updateAbilityDisplay();
}

// ── ШАГ 2: Класс ──
function renderStep2() {
  const filtered = (window.CLASSES||[]).filter(c => enabledSources.has(c.source));
  document.getElementById('class-grid').innerHTML = filtered.map(c => {
    const url = c.url || `https://5e14.dnd.su/class/${c.id}/`;
    return `<div class="option-card ${wiz.cls?.id===c.id?'selected':''}" onclick="selectClass('${c.id}')"
      data-tooltip="${c.nameEn||c.name}" data-url="${url}"
      onmouseenter="showDndTooltip(this)" onmouseleave="hideDndTooltip()">
      <span class="icon">${c.icon}</span>
      <div class="opt-name">${c.name}</div>
      <div class="opt-desc">d${c.hitDie} · ${c.spellcasting?'🔮':'⚔️'}</div>
      <div class="src-badge">${c.source}</div>
    </div>`;
  }).join('');
  // Sync placeholder icon with selected class
  const ph = document.getElementById('portrait-placeholder');
  if (ph && wiz.cls?.icon && !(document.getElementById('portrait-preview')?.src)) {
    ph.textContent = wiz.cls.icon;
  }
  if (wiz.cls) renderClassDetails();
}

function selectClass(id) {
  wiz.cls = (window.CLASSES||[]).find(c => c.id === id);
  if (!wiz.cls) return;
  wiz.clsToolChoices = {};  // сброс выбора инструментов при смене класса
  if (wiz.cls.spellcasting) wiz.spellAbility = wiz.cls.spellcasting.ability;
  document.querySelectorAll('#class-grid .option-card').forEach(c =>
    c.classList.toggle('selected', c.getAttribute('onclick')?.includes(`'${id}'`)));
  // Обновляем иконку-заглушку портрета
  const ph = document.getElementById('portrait-placeholder');
  if (ph && !document.getElementById('portrait-preview')?.style.display?.includes('block')) {
    ph.textContent = wiz.cls.icon || '🧙';
  }
  renderClassDetails();
}

function renderClassDetails() {
  const cls = wiz.cls;
  if (!cls) return;
  const availSubs = (cls.subclasses||[]).filter(s =>
    !s.source || enabledSources.has(s.source)
  );
  const styles = window.FIGHTING_STYLES?.[cls.id] || [];
  const level = wiz.level || 1;
  const subclassLevel = cls.subclassLevel ?? 1;
  const subclassAvailable = level >= subclassLevel;

  // Числительное для уровня
  const levelName = ['первого','второго','третьего','четвёртого','пятого',
    'шестого','седьмого','восьмого','девятого','десятого'][subclassLevel-1] || `${subclassLevel}-го`;

  // Подсказка по владениям подкласса под дропдауном
  function subProfHint(s) {
    if (!s || typeof s !== 'object') return '';
    const minLvl = s.profMinLevel ?? subclassLevel;
    const parts = [];
    if (s.armorProf)  parts.push(`🛡 ${s.armorProf}`);
    if (s.weaponProf) parts.push(`⚔️ ${Array.isArray(s.weaponProf)?s.weaponProf.join(', '):s.weaponProf}`);
    if (s.toolProf)   parts.push(`🔧 ${s.toolProf}`);
    if (!parts.length) return '';
    const lvlNote = minLvl > 1 ? ` <span style="opacity:.65">(с ${minLvl} ур.)</span>` : '';
    return `<div class="note-text" style="margin-top:.35rem;font-size:.79rem">${parts.join(' · ')}${lvlNote}</div>`;
  }

  // Способности/описание подкласса
  function subFeaturesBlock(s) {
    if (!s || typeof s !== 'object') return '';
    const lines = [];
    if (s.features) lines.push(s.features);
    if (s.traits)   lines.push(s.traits);
    if (!lines.length) return '';
    return `<p class="note-text" style="margin:.5rem 0 0;font-size:.82rem;line-height:1.55">${lines.join('<br>')}</p>`;
  }

  const selSub = availSubs.find(s => (s.name||s) === wiz.subclass);
  const selSubProfs = selSub && typeof selSub === 'object'
    ? _getSubclassProfs(cls, wiz.subclass, level) : {};
  const hasSelProfs = Object.keys(selSubProfs).length > 0;
  const minLvlSel = selSub?.profMinLevel ?? subclassLevel;

  const profNote = (val, hasProf) => !hasProf ? '' :
    ` + <span style="color:var(--gold)">${Array.isArray(val)?val.join(', '):val}</span>` +
    (minLvlSel > 1 ? ` <span style="opacity:.6;font-size:.8em">(с ${minLvlSel} ур.)</span>` : '');

  document.getElementById('class-details').innerHTML = `
    <hr class="ornate">
    <div class="form-row">
      <div class="form-group">
        <label>Подкласс${subclassAvailable ? ` (${availSubs.length} доступно)` : ''}</label>
        ${subclassAvailable ? `
          <select onchange="wiz.subclass=this.value; wiz.subclassSkillChoices=[]; wiz.subclassLangChoices={}; wiz.subclassLangListChoices={}; wiz.subclassToolChoices={}; wiz.subclassSkillOrToolChoices={}; renderStep2();autoSave()">
            <option value="">— выбрать позже —</option>
            ${availSubs.map(s=>{
              const sn = s.name||s;
              const src = (typeof s==='object'&&s.source) ? ` [${s.source}]` : '';
              return `<option value="${sn}" ${wiz.subclass===sn?'selected':''}>${sn}${src}</option>`;
            }).join('')}
          </select>
          ${selSub && typeof selSub==='object' ? subProfHint(selSub) : ''}
          ${selSub && typeof selSub==='object' ? subFeaturesBlock(selSub) : ''}
        ` : `
          <div class="subclass-unavailable">
            🔒 Подклассы ${cls.name === 'Монах' || cls.name === 'Маг' ? cls.name+'а' :
               cls.name === 'Жрец' ? 'Жреца' :
               cls.name === 'Друид' ? 'Друида' :
               cls.name === 'Варвар' ? 'Варвара' :
               cls.name === 'Бард' ? 'Барда' :
               cls.name === 'Воин' ? 'Воина' :
               cls.name === 'Паладин' ? 'Паладина' :
               cls.name === 'Следопыт' ? 'Следопыта' :
               cls.name === 'Плут' ? 'Плута' :
               cls.name === 'Чародей' ? 'Чародея' :
               cls.name === 'Колдун' ? 'Колдуна' :
               cls.name === 'Искусник' ? 'Искусника' :
               cls.name} доступны только с ${levelName} уровня
          </div>
        `}
      </div>
      ${styles.length?`<div class="form-group"><label>Боевой стиль</label>
        <select onchange="wiz.fightingStyle=this.value;autoSave()">
          <option value="">—</option>
          ${styles.map(s=>`<option ${wiz.fightingStyle===s?'selected':''}>${s}</option>`).join('')}
        </select></div>`:''}
    </div>
    <div class="info-box">
      <div><b>Спасброски:</b> ${cls.savingThrows?.join(', ')||'—'}</div>
      <div><b>Доспехи:</b> ${_cleanProf(cls.armorProf)||'—'}${profNote(selSubProfs.armorProf, hasSelProfs&&selSubProfs.armorProf)}</div>
      <div><b>Оружие:</b> ${Array.isArray(cls.weaponProf)?cls.weaponProf.join(', '):(cls.weaponProf||'—')}${profNote(selSubProfs.weaponProf, hasSelProfs&&selSubProfs.weaponProf)}</div>
      <div><b>Инструменты:</b> ${_cleanProf(cls.toolProf)||'—'}${profNote(selSubProfs.toolProf, hasSelProfs&&selSubProfs.toolProf)}</div>
      <div><b>Навыки:</b> выбрать ${cls.skillCount} из ${cls.skillChoices==='all'?'любых':cls.skillChoices?.join(', ')}</div>
      ${cls.spellcasting?`<div><b>Заклинательная хар-ка:</b> ${ABILITY_FULL[cls.spellcasting.ability]}</div>`:''}
    </div>
    <p class="note-text" style="margin-top:.6rem">${cls.features||''}</p>`;
}

// ── ШАГ 3: Предыстория ──
function renderStep3() {
  const filtered = (window.BACKGROUNDS||[]).filter(b => enabledSources.has(b.source));
  document.getElementById('background-grid').innerHTML = filtered.map(b => {
    const url = b.url || `https://5e14.dnd.su/backgrounds/${b.id}/`;
    const skills = Array.isArray(b.skills) ? b.skills.join(', ') : (b.skills||'');
    return `<div class="option-card ${wiz.background?.id===b.id?'selected':''}" onclick="selectBackground('${b.id}')"
      data-tooltip="${b.name}" data-url="${url}"
      onmouseenter="showDndTooltip(this)" onmouseleave="hideDndTooltip()">
      <span class="icon">${b.icon||'📜'}</span>
      <div class="opt-name">${b.name}</div>
      <div class="opt-desc">${skills}</div>
      <div class="src-badge">${b.source}</div>
    </div>`;
  }).join('');
  if (wiz.background) renderBackgroundDetails();
}

function selectBackground(id) {
  wiz.background = (window.BACKGROUNDS||[]).find(b => b.id === id);
  if (!wiz.background) return;
  document.querySelectorAll('#background-grid .option-card').forEach(c =>
    c.classList.toggle('selected', c.getAttribute('onclick')?.includes(`'${id}'`)));
  // Сброс предыдущих выборов предыстории
  wiz.bgToolChoices  = {};
  wiz.bgLangChoices  = {};
  wiz.bgSkillChoices = [];
  // Авто-навыки от предыстории (только фиксированные skills:[])
  const bgSkills = Array.isArray(wiz.background.skills)
    ? wiz.background.skills
    : (wiz.background.skills||'').split(',').map(s=>s.trim()).filter(Boolean);
  bgSkills.forEach(s => wiz.skillProfs.add(s));
  renderBackgroundDetails();
}

function renderBackgroundDetails() {
  const bg = wiz.background;
  if (!bg) return;

  // ── Навыки ──
  const fixedSkills = Array.isArray(bg.skills) ? bg.skills : [];
  const skillChoiceLabel = bg.skillChoices
    ? `+ ${bg.skillChoices.count} из: ${(bg.skillChoices.from||[]).join(', ')}`
    : '';
  const skillsDisplay = [fixedSkills.join(', '), skillChoiceLabel].filter(Boolean).join('; ') || '—';

  // ── Инструменты ──
  const fixedTools = Array.isArray(bg.tools) && bg.tools.length ? bg.tools.join(', ') : '';
  const tcLabel = bg.toolChoice ? _toolChoiceLabel(bg.toolChoice) : '';
  const toolsDisplay = [fixedTools, tcLabel].filter(Boolean).join(', ') || '—';

  // ── Языки ──
  const langParts = [];
  if (bg.languagesConst?.length) langParts.push(bg.languagesConst.join(', '));
  if (bg.languagesChoice) langParts.push(`+ ${bg.languagesChoice.count} из: ${bg.languagesChoice.from.join(', ')}`);
  if (bg.languages > 0)   langParts.push(`+ ${bg.languages} на свободный выбор`);
  const langDisplay = langParts.join('; ') || '—';

  document.getElementById('background-details').innerHTML = `
    <div class="info-box" style="margin-top:.6rem">
      <div><b>Навыки:</b> ${skillsDisplay}</div>
      <div><b>Инструменты:</b> ${toolsDisplay}</div>
      <div><b>Языки:</b> ${langDisplay}</div>
      <div><b>Золото:</b> ${bg.gold||0} зм</div>
      <div><b>Снаряжение:</b> ${_bgEquipSummary(bg)}</div>
      ${bg.traits ? `<div style="margin-top:.35rem"><b>Особенность:</b> ${bg.traits}</div>` : ''}
      ${bg.feature ? `<div style="margin-top:.4rem;color:var(--text-muted);font-size:.8rem"><b>Черта предыстории:</b> ${bg.feature}</div>` : ''}
    </div>`;
}

// Краткий текстовый список снаряжения предыстории (для превью на шаге выбора)
function _bgEquipSummary(bg) {
  if (!Array.isArray(bg.equipment) || !bg.equipment.length) return '—';
  const parts = [];
  for (const slot of bg.equipment) {
    if (slot.type === 'fixed') {
      for (const it of slot.items) {
        if (it.id) {
          const found = window.findItemById?.(it.id);
          const nm = found ? found.name : it.id;
          parts.push(it.qty > 1 ? `${nm} ×${it.qty}` : nm);
        } else if (it.ref) {
          parts.push(it.label || 'Инструмент');
        }
      }
    } else if (slot.type === 'choice') {
      parts.push(`[${slot.label || 'выбор'}]`);
    }
  }
  return parts.join(', ') || '—';
}

// Читаемая метка для toolChoice
function _toolChoiceLabel(tc) {
  if (!tc) return '';
  const catNames = {artisan:'ремесленника', gaming:'игровой набор', musical:'муз. инструмент', other:'прочий'};
  if (tc.category) return `+ ${tc.count||1} × ${catNames[tc.category]||tc.category}`;
  if (tc.any)      return `+ ${tc.count||1} любой инструмент`;
  if (tc.from) {
    const parts = tc.from.map(x =>
      (typeof x==='object' && x.category) ? catNames[x.category]||x.category : x
    );
    return `+ ${tc.count||1} из: ${parts.join(' / ')}`;
  }
  return '';
}

// ── ШАГ 4: Характеристики ──
function renderStep4() {
  updateAbilityDisplay();
  buildRacialAsiSection();
}

function calcTotalSpent() {
  return ABILITY_KEYS.reduce((s,k) => s + (PB_COST[wiz.abilities[k]||8]||0), 0);
}

function updateAbilityDisplay() {
  const spent = calcTotalSpent();
  const rem   = 27 - spent;
  const remEl = document.getElementById('points-remaining');
  if (remEl) remEl.textContent = rem;
  const bar = document.getElementById('points-bar');
  if (bar) {
    bar.style.width  = Math.max(0,(rem/27)*100)+'%';
    bar.style.background = rem<0?'#8b0000':rem<5?'#8b5000':'#2a6a2a';
  }

  const mode = wiz.pointBuyMode;
  ABILITY_KEYS.forEach(key => {
    const base   = wiz.abilities[key]||8;
    const racial  = (wiz.racialBonuses||{})[key]||0;
    const total   = base + racial;
    const nextCost = (PB_COST[base+1]??99) - (PB_COST[base]??0);

    const setEl = (id, val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
    setEl(`ab-${key}`,       base);
    setEl(`ab-racial-${key}`, racial>0?'+'+racial:racial<0?racial:'—');
    setEl(`ab-total-${key}`,  total);
    setEl(`ab-mod-${key}`,    fmtMod(getMod(total)));
    setEl(`ab-cost-${key}`,   `стоим.: ${PB_COST[base]??'?'}`);

    const upBtn = document.getElementById(`ab-up-${key}`);
    const dnBtn = document.getElementById(`ab-dn-${key}`);
    if (upBtn) upBtn.disabled = base>=15 || rem<nextCost;
    if (dnBtn) dnBtn.disabled = base<=8;
    const ctrl  = document.getElementById(`ab-ctrl-${key}`);
    const manWr = document.getElementById(`ab-manual-wrap-${key}`);
    if (ctrl)  ctrl.style.display  = mode==='manual'?'none':'flex';
    if (manWr) {
      manWr.style.display = mode==='manual'?'block':'none';
      const inp = document.getElementById(`ab-manual-${key}`);
      if (inp) inp.value = base;
    }

    // Drag-n-drop value display for roll mode
    const rollSel = document.getElementById(`ab-roll-sel-${key}`);
    if (rollSel) rollSel.style.display = mode==='roll'?'block':'none';
  });
}

function changeAbility(key, delta) {
  const cur  = wiz.abilities[key]||8;
  const next = cur+delta;
  if (next<8||next>15) return;
  const diff = (PB_COST[next]||0)-(PB_COST[cur]||0);
  if (delta>0 && (27-calcTotalSpent())<diff) { toast('Не хватает очков!','error'); return; }
  wiz.abilities[key]=next;
  updateAbilityDisplay();
}

function setManualAbility(key, val) {
  wiz.abilities[key] = clamp(parseInt(val)||8, 3, 20);
  updateAbilityDisplay();
}

function setAbilityMode(mode) {
  wiz.pointBuyMode = mode;
  document.querySelectorAll('.mode-btn[data-amode]').forEach(b =>
    b.classList.toggle('active', b.dataset.amode===mode));
  if (mode==='standard') {
    const arr=[15,14,13,12,10,8];
    ABILITY_KEYS.forEach((k,i)=>{wiz.abilities[k]=arr[i];});
  } else if (mode==='roll') {
    rollAllDice();
  } else if (mode==='pointbuy') {
    ABILITY_KEYS.forEach(k=>{wiz.abilities[k]=8;});
  }
  updateAbilityDisplay();
  renderRollSection();
}

function rollAllDice() {
  const results = [];
  for (let i=0;i<6;i++) {
    const d = Array.from({length:4},()=>Math.ceil(Math.random()*6)).sort((a,b)=>b-a);
    const kept = d.slice(0,3);
    const val  = kept.reduce((s,v)=>s+v,0);
    results.push({ val, kept, dropped: d[3] });
  }
  const sorted = results.sort((a,b)=>b.val-a.val);
  wiz.rollValues = {_pool: sorted.map(r=>r.val), _detail: sorted};
  // Автоназначить
  ABILITY_KEYS.forEach((k,i)=>{wiz.abilities[k]=wiz.rollValues._pool[i]||8;});
  // Show in roll stack
  sorted.forEach((r, i) => {
    const ab = ABILITY_KEYS[i];
    const FULL = {СИЛ:'Сила',ЛОВ:'Ловк.',ТЕЛ:'Тело',ИНТ:'Инт.',МДР:'Мудр.',ХАР:'Хар.'};
    pushRoll(`Характеристика: ${FULL[ab]||ab}`, r.val,
      `4к6: [${r.kept.join('+')}] (сброшено ${r.dropped})`);
  });
}

function renderRollSection() {
  const c = document.getElementById('roll-section');
  if (!c) return;
  if (wiz.pointBuyMode !== 'roll') { c.innerHTML=''; return; }
  const pool = wiz.rollValues?._pool || [];
  c.innerHTML = `
    <div class="info-box" style="margin-top:.8rem">
      <b>Распределите кубики по характеристикам:</b>
      <div class="roll-pool" style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.6rem 0">
        ${pool.map((v,i)=>`<div class="roll-die" draggable="true" ondragstart="startDrag(${i})"
          style="font-family:'Cinzel',serif;font-size:1.1rem;font-weight:900;padding:.35rem .7rem;
          border:2px solid var(--gold-dim);background:var(--ink);color:var(--gold);cursor:grab">${v}</div>`).join('')}
      </div>
      <div class="form-row">
        ${ABILITY_KEYS.map(k=>`
          <div class="form-group">
            <label>${ABILITY_FULL[k]}</label>
            <select onchange="assignRoll('${k}',parseInt(this.value));autoSave()" id="ab-roll-sel-${k}">
              ${pool.map(v=>`<option value="${v}" ${wiz.abilities[k]===v?'selected':''}>${v}</option>`).join('')}
            </select>
          </div>`).join('')}
      </div>
      <button class="dice-btn" onclick="rollAllDice();renderRollSection();updateAbilityDisplay()">🎲 Перебросить всё</button>
    </div>`;
}

let dragIdx = null;
function startDrag(i) { dragIdx = i; }
function assignRoll(key, val) {
  wiz.abilities[key] = val;
  updateAbilityDisplay();
}

function collectAbilities() {
  if (wiz.pointBuyMode==='manual') {
    ABILITY_KEYS.forEach(k=>{
      const inp = document.getElementById(`ab-manual-${k}`);
      if (inp) wiz.abilities[k]=clamp(parseInt(inp.value)||8,3,20);
    });
  }
}

// ── ШАГ 5: Навыки ──
function renderStep5() {
  // Guard: ensure skillProfs is always a Set
  if (!(wiz.skillProfs instanceof Set)) {
    wiz.skillProfs = new Set(Array.isArray(wiz.skillProfs) ? wiz.skillProfs : []);
  }
  // Сбрасываем навыки класса при каждом входе на шаг
  const bgSkills  = getBgSkills();
  const available = wiz.cls?.skillChoices === 'all'
    ? SKILLS_DATA.map(s => s.name)
    : (wiz.cls?.skillChoices || []);
  // Оставляем навыки предыстории + расовый выбор (вариантный человек)
  const newProfs  = new Set([...wiz.skillProfs].filter(s =>
    bgSkills.includes(s) || s === wiz.racialSkillChoice
  ));
  wiz.skillProfs  = newProfs;

  buildSkillGrid();
  buildSubclassExtras(); // навыки/языки/инструменты от подкласса
  buildLangToolChoices();
  buildRacialExtras();
}


// Собирает все навыки выбранные из дропдаунов (не от класса и не от предыстории)
// Возвращает Map: skillName → метка ('РС'|'ПК'|'РБ'|...)
function _getExtraChosenSkills() {
  const map = new Map(); // name → badge label

  // Расовый навык (вариантный человек)
  if (wiz.racialSkillChoice) map.set(wiz.racialSkillChoice, 'РС');

  // Навыки от подкласса (skillChoices — чекбоксы)
  (wiz.subclassSkillChoices||[]).forEach(s => { if (s) map.set(s, 'ПК'); });

  // Навык или инструмент от подкласса (skillOrToolChoice дропдаун)
  Object.values(wiz.subclassSkillOrToolChoices||{}).forEach(v => {
    if (v && SKILLS_DATA.find(s => s.name === v)) map.set(v, 'ПК');
  });

  // Навык или инструмент от расы (skillOrToolChoice дропдаун)
  Object.values(wiz.skillOrToolChoices||{}).forEach(v => {
    if (v && SKILLS_DATA.find(s => s.name === v)) map.set(v, 'РС');
  });

  // Навыки от предыстории по выбору (bgSkillChoices)
  (wiz.bgSkillChoices||[]).forEach(s => {
    if (s) map.set(s, 'ПД');
  });

  return map;
}

function buildSkillGrid() {
  const cls      = wiz.cls;
  const bgSkills = getBgSkills();
  const available = cls?.skillChoices==='all'
    ? SKILLS_DATA.map(s=>s.name)
    : (cls?.skillChoices||[]);
  const classCount    = cls?.skillCount||2;
  const classSelected = [...wiz.skillProfs].filter(s=>available.includes(s)&&!bgSkills.includes(s)&&s!==wiz.racialSkillChoice);
  const extraSkills = _getExtraChosenSkills(); // badge-метки для всех дополнительных навыков

  // Порядок и русские названия характеристик
  const ABILITY_ORDER = ['СИЛ','ЛОВ','ТЕЛ','ИНТ','МДР','ХАР'];
  const ABILITY_FULL_RU = {СИЛ:'Сила',ЛОВ:'Ловкость',ТЕЛ:'Телосложение',ИНТ:'Интеллект',МДР:'Мудрость',ХАР:'Харизма'};

  // Текущие значения статов (из визарда)
  const abilities = wiz.abilities||{};
  const racialBon = wiz.racialBonuses||{};
  const getScore  = ab => (abilities[ab]||8) + (racialBon[ab]||0);
  const getMod_   = sc => Math.floor((sc-10)/2);
  const fmtMod_   = m  => (m>=0?'+':'')+m;

  // Группируем навыки по характеристике
  const grouped = {};
  ABILITY_ORDER.forEach(ab => { grouped[ab] = []; });
  SKILLS_DATA.forEach(s => { if (grouped[s.ability]) grouped[s.ability].push(s); });

  // Строим колонки по характеристикам (пропускаем ТЕЛ — у него нет навыков)
  const columns = ABILITY_ORDER.filter(ab => grouped[ab].length > 0).map(ab => {
    const score = getScore(ab);
    const mod   = getMod_(score);
    const skillRows = grouped[ab].map(s => {
      const isBg      = bgSkills.includes(s.name);
      const extraBadge = extraSkills.get(s.name); // 'РС'|'ПК'|'ПД'|undefined
      const isExtra   = !!extraBadge;
      const isProf    = wiz.skillProfs.has(s.name) && !isExtra;
      const canChk    = available.includes(s.name) && !isBg && !isExtra;
      const unavail   = !canChk && !isBg && !isExtra;
      const extraTitle = extraBadge==='РС'?'Расовый навык':extraBadge==='ПК'?'Навык от подкласса':extraBadge==='ПД'?'Навык от предыстории (выбор)':'';
      return `<label class="skill-choice-label ${isBg||isExtra?'skill-from-bg':''} ${unavail?'skill-unavail':''}" title="${extraTitle}">
        <input type="checkbox"
          ${isBg||isExtra?'checked disabled':''}
          ${unavail?'disabled':''}
          onchange="toggleWizSkill('${s.name}',this.checked,${classCount});autoSave()">
        <span style="flex:1">${s.name}</span>
        ${isBg?'<span class="proficiency-badge" style="font-size:.48rem;padding:.1rem .3rem">ПР</span>':''}
        ${isExtra?`<span class="proficiency-badge" style="font-size:.48rem;padding:.1rem .3rem">${extraBadge}</span>`:''}
      </label>`;
    }).join('');

    return `<div class="skill-ability-col">
      <div class="skill-ability-header">
        <span class="skill-ability-name">${ABILITY_FULL_RU[ab]}</span>
        <span class="skill-ability-score">${score}<span class="skill-ability-mod">${fmtMod_(mod)}</span></span>
      </div>
      <div class="skill-ability-list">${skillRows}</div>
    </div>`;
  }).join('');

  document.getElementById('skills-step').innerHTML = `
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.5rem;flex-wrap:wrap;gap:.4rem">
      <div class="section-title sm" style="margin:0">Навыки от класса — выбрать ${classCount}
        <span class="note-text" style="margin-left:.5rem">Выбрано: <b id="class-skill-count">${classSelected.length}</b> / ${classCount}</span>
      </div>
      ${bgSkills.length ? `<div style="display:flex;flex-wrap:wrap;gap:.3rem">${bgSkills.map(s=>`<span class="proficiency-badge">✦ ${s}</span>`).join('')}</div>` : ''}
    </div>
    <div class="skill-ability-grid">${columns}</div>`;
}

function getBgSkills() {
  const bg = wiz.background;
  if (!bg) return [];
  return Array.isArray(bg.skills) ? bg.skills : (bg.skills||'').split(',').map(s=>s.trim()).filter(Boolean);
}

function toggleWizSkill(name, checked, maxClass) {
  if (_getExtraChosenSkills().has(name)) return; // заблокирован дополнительным источником
  const bgSkills  = getBgSkills();
  const available = wiz.cls?.skillChoices==='all'
    ? SKILLS_DATA.map(s=>s.name)
    : (wiz.cls?.skillChoices||[]);
  const classSelected = [...wiz.skillProfs].filter(s=>available.includes(s)&&!bgSkills.includes(s)&&s!==wiz.racialSkillChoice);
  if (checked) {
    if (classSelected.length>=maxClass) {
      toast(`Максимум ${maxClass} навыка от класса`,'error');
      setTimeout(()=>{
        document.querySelectorAll('.skill-choice-label input').forEach(inp=>{
          if (!inp.disabled && inp.closest('label')?.textContent.includes(name)) inp.checked=false;
        });
      },0);
      return;
    }
    wiz.skillProfs.add(name);
  } else { wiz.skillProfs.delete(name); }
  const newCnt = [...wiz.skillProfs].filter(s=>available.includes(s)&&!bgSkills.includes(s)&&s!==wiz.racialSkillChoice).length;
  const el=document.getElementById('class-skill-count');
  if(el) el.textContent=newCnt;
  // Перерисовываем все секции зависящие от выбранных навыков
  buildSubclassExtras(); // подклассовый skillOrToolChoice
  buildLangToolChoices(); // расовый skillOrToolChoice
  buildRacialExtras();
}

// ── Бонусы подкласса: навыки / языки / инструменты (шаг 5) ───────────
function buildSubclassExtras() {
  const c = document.getElementById('subclass-extras-section');
  if (!c) return;

  const cls   = wiz.cls;
  const level = wiz.level || 1;
  const subP  = _getSubclassProfs(cls, wiz.subclass, level);

  // Нет ни одного бонуса — скрываем секцию
  const hasAny = subP.skills?.length || subP.skillChoices || subP.skillOrToolChoice ||
                 subP.languagesConst?.length || subP.languagesChoice || subP.languages > 0 ||
                 subP.toolChoice || subP.darkvision || subP.speedUp;
  if (!hasAny || !wiz.subclass) { c.innerHTML = ''; return; }

  const subName = wiz.subclass;
  let html = `<hr class="ornate"><div class="section-title sm">🎓 Бонусы подкласса «${subName}»</div>`;

  // ── Фикс. навыки ──
  if (subP.skills?.length) {
    if (!wiz.subclassSkillChoices) wiz.subclassSkillChoices = [];
    // Авто-добавляем в wiz.skillProfs
    subP.skills.forEach(s => wiz.skillProfs.add(s));
    html += `<div class="section-title sm">Навыки (автоматически)</div>
    <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.7rem">
      ${subP.skills.map(s=>`<span class="proficiency-badge" style="background:rgba(180,120,255,.15);border-color:rgba(180,120,255,.4)">✦ ${s}</span>`).join('')}
    </div>`;
  }

  // ── Навыки на выбор ──
  if (subP.skillChoices) {
    const sc = subP.skillChoices;
    if (!wiz.subclassSkillChoices) wiz.subclassSkillChoices = [];
    const pool = sc.any
      ? SKILLS_DATA.map(s=>s.name)
      : (sc.from || []);
    const takenFixed = new Set([...getBgSkills(), ...(subP.skills||[])]);
    html += `<div class="section-title sm">Навыки от подкласса — выбрать ${sc.count}</div>
    <div class="note-text" style="margin-bottom:.5rem">Выбрано: <b id="sub-skill-count">${(wiz.subclassSkillChoices||[]).length}</b> / ${sc.count}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:.1rem;margin-bottom:.8rem">
      ${pool.map(sname => {
        const isFixed   = takenFixed.has(sname);
        const isChosen  = (wiz.subclassSkillChoices||[]).includes(sname);
        const isClassP  = wiz.skillProfs.has(sname) && !isFixed && !isChosen;
        const maxed     = (wiz.subclassSkillChoices||[]).length >= sc.count;
        const disabled  = isFixed || isClassP || (!isChosen && maxed);
        return `<label class="skill-choice-label \${isFixed||isClassP?'skill-from-bg':''}" style="\${disabled&&!isChosen?'opacity:.45':''}">
          <input type="checkbox" \${isChosen?'checked':''} \${disabled?'disabled':''}
            onchange="setSubclassSkillChoice('\${sname}',this.checked,\${sc.count});autoSave()">
          \${sname}\${isFixed?' ✓ (авто)':isClassP?' ✓ (класс)':''}
        </label>`;
      }).join('')}
    </div>`;
  }

  // ── Навык или инструмент на выбор ──
  if (subP.skillOrToolChoice) {
    const sot = subP.skillOrToolChoice;
    if (!wiz.subclassSkillOrToolChoices) wiz.subclassSkillOrToolChoices = {};
    const allTools = (window.TOOLS_ALL||[]).map(t=>t.name||t).filter(Boolean);
    const allSkills = SKILLS_DATA.map(s=>s.name);
    const pool = [...allSkills, ...allTools];
    html += `<div class="section-title sm">Навык или инструмент от подкласса</div>`;
    for (let i = 0; i < (sot.count||1); i++) {
      const cur = (wiz.subclassSkillOrToolChoices||{})[i]||'';
      const renderSubOpt = n => {
        const owned = _buildSubSoTOwned(i);
        const blocked = cur!==n && owned.has(n);
        return `<option value="${n}" ${cur===n?'selected':''} ${blocked?'disabled':''} style="${blocked?'opacity:.35;color:var(--text3)':''}">${n}${blocked?' ✓':''}</option>`;
      };
      html += `<select style="min-width:260px;margin-bottom:.4rem;display:block"
        onchange="setSubclassSkillOrToolChoice(${i},this.value);autoSave()">
        <option value="">— выбрать навык или инструмент —</option>
        <optgroup label="Навыки">${allSkills.map(renderSubOpt).join('')}</optgroup>
        <optgroup label="Инструменты">${allTools.map(renderSubOpt).join('')}</optgroup>
      </select>`;
    }
  }

  // ── Фикс. языки ──
  if (subP.languagesConst?.length) {
    html += `<div class="section-title sm">Языки от подкласса</div>
    <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.7rem">
      ${subP.languagesConst.map(l=>`<span class="proficiency-badge" style="background:rgba(100,180,255,.12);border-color:rgba(100,180,255,.35)">${l}</span>`).join('')}
    </div>`;
  }

  // ── Языки из списка ──
  if (subP.languagesChoice) {
    const lc = subP.languagesChoice;
    if (!wiz.subclassLangListChoices) wiz.subclassLangListChoices = {};
    html += `<div class="section-title sm">Язык от подкласса (из списка)</div>`;
    for (let i = 0; i < lc.count; i++) {
      const cur = (wiz.subclassLangListChoices||{})[i]||'';
      const taken = Object.entries(wiz.subclassLangListChoices||{}).filter(([k])=>+k!==i).map(([,v])=>v);
      html += `<select style="min-width:220px;margin-bottom:.3rem;display:block"
        onchange="setSubclassLangListChoice(${i},this.value);autoSave()">
        <option value="">— выбрать язык —</option>
        ${lc.from.map(l=>{
          const isTaken = taken.includes(l);
          return `<option value="${l}" ${cur===l?'selected':''} ${isTaken?'disabled':''} style="${isTaken?'opacity:.35':''}">${l}</option>`;
        }).join('')}
      </select>`;
    }
    html += '<div style="margin-bottom:.5rem"></div>';
  }

  // ── Свободные языки ──
  if (subP.languages > 0) {
    if (!wiz.subclassLangChoices) wiz.subclassLangChoices = {};
    const langPool = ALL_LANGS.filter(Boolean);
    html += `<div class="section-title sm">Язык от подкласса (свободный выбор, ${subP.languages} шт.)</div>`;
    for (let i = 0; i < subP.languages; i++) {
      const cur   = (wiz.subclassLangChoices||{})[i]||'';
      const taken = Object.entries(wiz.subclassLangChoices||{}).filter(([k])=>+k!==i).map(([,v])=>v);
      html += `<select style="min-width:220px;margin-bottom:.3rem;display:block"
        onchange="setSubclassLangChoice(${i},this.value);autoSave()">
        <option value="">— выбрать язык —</option>
        ${langPool.map(l=>{
          const isTaken = taken.includes(l);
          return `<option value="${l}" ${cur===l?'selected':''} ${isTaken?'disabled':''} style="${isTaken?'opacity:.35':''}">${l}</option>`;
        }).join('')}
      </select>`;
    }
    html += '<div style="margin-bottom:.5rem"></div>';
  }

  // ── Инструменты на выбор ──
  if (subP.toolChoice) {
    const tc = subP.toolChoice;
    if (!wiz.subclassToolChoices) wiz.subclassToolChoices = {};
    const pool = _resolveToolPool(tc);
    html += `<div class="section-title sm">Инструмент от подкласса</div>`;
    for (let i = 0; i < (tc.count||1); i++) {
      const cur = (wiz.subclassToolChoices||{})[i]||'';
      const taken = Object.entries(wiz.subclassToolChoices).filter(([k])=>+k!==i).map(([,v])=>v);
      html += `<select style="min-width:260px;margin-bottom:.3rem;display:block"
        onchange="setSubclassToolChoice(${i},this.value);autoSave()">
        <option value="">— выбрать инструмент —</option>
        ${pool.map(t=>{
          const isTaken = taken.includes(t);
          return `<option value="${t}" ${cur===t?'selected':''} ${isTaken?'disabled':''} style="${isTaken?'opacity:.35':''}">${t}</option>`;
        }).join('')}
      </select>`;
    }
    html += '<div style="margin-bottom:.5rem"></div>';
  }

  // ── Спецхар-ки (darkvision, speedUp) ──
  if (subP.darkvision || subP.speedUp) {
    html += `<div class="info-box" style="margin-bottom:.7rem">`;
    if (subP.darkvision) html += `<div>👁 <b>Тёмное зрение:</b> ${subP.darkvision} фут. (от подкласса)</div>`;
    if (subP.speedUp)    html += `<div>💨 <b>Скорость:</b> +${subP.speedUp} фут. (от подкласса)</div>`;
    html += `</div>`;
  }

  c.innerHTML = html;
}

// ── Обработчики выборов подкласса ──
function setSubclassSkillChoice(skill, checked, max) {
  if (!wiz.subclassSkillChoices) wiz.subclassSkillChoices = [];
  if (checked) {
    if (wiz.subclassSkillChoices.length < max) {
      wiz.subclassSkillChoices.push(skill);
      wiz.skillProfs.add(skill);
    }
  } else {
    wiz.subclassSkillChoices = wiz.subclassSkillChoices.filter(s=>s!==skill);
    wiz.skillProfs.delete(skill);
  }
  document.getElementById('sub-skill-count').textContent = (wiz.subclassSkillChoices||[]).length;
  buildSubclassExtras(); // другие слоты подклассового SoT
  buildLangToolChoices(); // расовый SoT
  buildSkillGrid();
  buildRacialExtras();
}

function setSubclassSkillOrToolChoice(idx, val) {
  if (!wiz.subclassSkillOrToolChoices) wiz.subclassSkillOrToolChoices = {};
  wiz.subclassSkillOrToolChoices[idx] = val;
  buildSubclassExtras(); // другие слоты подклассового SoT
  buildLangToolChoices(); // расовый SoT + инструментальные дропдауны
  buildSkillGrid();
  buildRacialExtras();
}

function setSubclassToolChoice(idx, val) {
  if (!wiz.subclassToolChoices) wiz.subclassToolChoices = {};
  wiz.subclassToolChoices[idx] = val;
  buildSubclassExtras();
  buildLangToolChoices();
  buildRacialExtras();
}

function setSubclassLangChoice(idx, val) {
  if (!wiz.subclassLangChoices) wiz.subclassLangChoices = {};
  wiz.subclassLangChoices[idx] = val;
}

function setSubclassLangListChoice(idx, val) {
  if (!wiz.subclassLangListChoices) wiz.subclassLangListChoices = {};
  wiz.subclassLangListChoices[idx] = val;
}



// Все выбранные инструменты из всех источников (для кросс-блокировки дропдаунов)
// excludeSource: 'bg'|'cls'|'race'|'skillOrTool'|'subclass' — источник текущего слота
// excludeIdx: индекс слота внутри источника
function _allChosenTools(excludeSource, excludeIdx) {
  const result = new Set();
  Object.entries(wiz.bgToolChoices||{}).forEach(([k,v]) => {
    if (excludeSource==='bg' && parseInt(k)===excludeIdx) return;
    if (v) result.add(v);
  });
  Object.entries(wiz.clsToolChoices||{}).forEach(([k,v]) => {
    if (excludeSource==='cls' && parseInt(k)===excludeIdx) return;
    if (v) result.add(v);
  });
  Object.entries(wiz.raceToolChoices||{}).forEach(([k,v]) => {
    if (excludeSource==='race' && parseInt(k)===excludeIdx) return;
    if (v) result.add(v);
  });
  Object.entries(wiz.skillOrToolChoices||{}).forEach(([k,v]) => {
    if (excludeSource==='skillOrTool' && parseInt(k)===excludeIdx) return;
    if (v && !SKILLS_DATA.find(s=>s.name===v)) result.add(v);
  });
  Object.entries(wiz.subclassToolChoices||{}).forEach(([k,v]) => {
    if (excludeSource==='subclass' && parseInt(k)===excludeIdx) return;
    if (v) result.add(v);
  });
  return result;
}


// Все выбранные инструменты из всех choice-источников кроме текущего слота
// source: 'bg'|'cls'|'race'|'skillOrTool'|'subclassSoT'  idx: индекс слота
function _allChosenTools(source, idx) {
  return _allChosenSoT(source, idx, false);
}

// Все выбранные навыки И инструменты из всех choice-дропдаунов кроме текущего слота
// onlyTools=false → и навыки и инструменты; onlyTools=true → только инструменты
function _allChosenSoT(source, idx, onlyTools) {
  const result = new Set();

  // Инструментальные дропдауны (только инструменты)
  const addTools = (obj, src) => Object.entries(obj||{}).forEach(([k,v]) => {
    if (src===source && parseInt(k)===idx) return;
    if (v) result.add(v);
  });
  addTools(wiz.bgToolChoices,       'bg');
  addTools(wiz.clsToolChoices,      'cls');
  addTools(wiz.raceToolChoices,     'race');
  addTools(wiz.subclassToolChoices, 'subclass');

  // SkillOrTool дропдауны (навыки + инструменты)
  const addSoT = (obj, src) => Object.entries(obj||{}).forEach(([k,v]) => {
    if (src===source && parseInt(k)===idx) return;
    if (!v) return;
    const isSkill = !!SKILLS_DATA.find(s=>s.name===v);
    if (!onlyTools || !isSkill) result.add(v);
  });
  addSoT(wiz.skillOrToolChoices,         'skillOrTool');
  addSoT(wiz.subclassSkillOrToolChoices, 'subclassSoT');

  return result;
}

function buildLangToolChoices() {
  const race = wiz.race;
  const bg   = wiz.background;

  // Языки от расы и подрасы
  const allRaceLangs = [
    ...(race?.languages||[]),
    ...(wiz.subrace?.languages||[]),
  ];
  const raceLangs    = allRaceLangs.filter(l => !l.includes('выбор'));
  const raceLangFree = allRaceLangs.filter(l =>  l.includes('выбор')).length;
  const bgLangCount  = typeof bg?.languages === 'number' ? bg.languages : 0;
  const totalFree    = raceLangFree + bgLangCount;

  // Инструменты от предыстории — теперь tools[] содержит готовые строки
  const bgTools     = Array.isArray(bg?.tools) ? bg.tools : [];
  const bgToolChoice = bg?.toolChoice || null;  // {category, count} или {any, count}
  const clsToolStr  = wiz.cls?.toolProf || '';

  const bgToolPool    = _resolveToolPool(bgToolChoice);
  const bgChoiceCount = bgToolChoice?.count || 0;

  // Языки от предыстории: фиксированные (languagesConst) + выбор из списка (languagesChoice) + свободный выбор (languages)
  const bgLangConst    = bg?.languagesConst || [];
  const bgLangChoice   = bg?.languagesChoice || null;

  // Все фиксированные языки (раса + предыстория)
  const allFixedLangs  = [...raceLangs, ...bgLangConst];

  // Метки и слоты для свободного выбора
  const langSlotLabels = [
    ...Array(raceLangFree).fill(null).map((_, i) => {
      const raceHas = (race?.languages||[]).filter(l=>l.includes('выбор')).length;
      return i < raceHas ? `от ${race?.name||'расы'}` : `от ${wiz.subrace?.name||'подрасы'}`;
    }),
    ...Array(bgLangCount).fill('от предыстории'),
  ];

  // Навыки по выбору от предыстории (skillChoices)
  const bgSC = bg?.skillChoices || null;
  const bgSCCount = bgSC?.count || 0;
  const bgSCPool  = bgSC?.from || [];

  // Навыки — какие уже выбраны через bgSkillChoices
  if (!wiz.bgSkillChoices) wiz.bgSkillChoices = [];
  if (!wiz.bgLangChoices)  wiz.bgLangChoices  = {};

  document.getElementById('lang-tool-section').innerHTML = `
    <hr class="ornate">

    ${bgSCCount>0?`
    <div class="section-title sm">Навыки от предыстории (выбор)</div>
    <div class="form-group" style="max-width:340px;margin-bottom:.7rem">
      <label>Выбрать ${bgSCCount} из: ${bgSCPool.join(', ')}</label>
      ${bgSCPool.map(skill => {
        const isFixed     = (Array.isArray(bg?.skills)?bg.skills:[]).includes(skill);
        const isChosen    = (wiz.bgSkillChoices||[]).includes(skill);
        const chosenCount = (wiz.bgSkillChoices||[]).length;
        const disabled    = isFixed || (!isChosen && chosenCount >= bgSCCount);
        return `<label class="skill-choice-label" style="display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem;${isFixed?'opacity:.45':''}">
          <input type="checkbox" ${isFixed||isChosen?'checked':''} ${disabled||isFixed?'disabled':''}
            onchange="setBgSkillChoice('${skill}',this.checked,${bgSCCount});autoSave()">
          ${skill}
        </label>`;
      }).join('')}
    </div>`:''}

    <div class="section-title sm">Языки</div>
    <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.7rem">
      ${allFixedLangs.map(l=>`<span class="proficiency-badge">${l}</span>`).join('')||'<span class="note-text">—</span>'}
    </div>

    ${bgLangChoice?`<div class="form-group" style="max-width:340px;margin-bottom:.5rem">
      <label>Языки от предыстории (${bgLangChoice.count} из списка)</label>
      ${Array.from({length:bgLangChoice.count},(_,i)=>{
        const pool = bgLangChoice.from;
        const cur  = (wiz.bgLangChoices||{})[i]||'';
        const takenInPool = pool.filter((_,j)=>j!==i && (wiz.bgLangChoices||{})[j]);
        return `<select style="min-width:220px;margin-bottom:.3rem;display:block"
          onchange="setBgLangChoice(${i},this.value);autoSave()">
          <option value="">— выбрать язык —</option>
          ${pool.map(l=>{
            const taken = takenInPool.includes(l) || allFixedLangs.includes(l);
            return `<option value="${l}" ${cur===l?'selected':''} ${taken&&cur!==l?'disabled':''} style="${taken&&cur!==l?'opacity:.35':''}">${l}${taken&&cur!==l?' ✓':''}</option>`;
          }).join('')}
        </select>`;
      }).join('')}
    </div>`:''}

    ${totalFree>0?`<div class="form-group" style="max-width:340px">
      <label>Языки (${totalFree} свободный выбор)</label>
      ${Array.from({length:totalFree},(_,i)=>{
        const taken = new Set([
          ...allFixedLangs,
          ...Object.values(wiz.bgLangChoices||{}),
          ...(wiz.langChoices||[]).filter((_,j)=>j!==i&&Boolean(wiz.langChoices[j]))
        ]);
        return `<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem">
          <select style="flex:1" onchange="setLangChoice(${i},this.value);autoSave()">
            <option value="">— выбрать язык —</option>
            ${ALL_LANGS.map(l=>{
              const isTaken = taken.has(l) && wiz.langChoices[i]!==l;
              return `<option value="${l}" ${wiz.langChoices[i]===l?'selected':''} ${isTaken?'disabled':''} style="${isTaken?'opacity:.35':''}">${l}${isTaken?' ✓':''}</option>`;
            }).join('')}
          </select>
          <span class="note-text" style="white-space:nowrap;font-size:.72rem">${langSlotLabels[i]||''}</span>
        </div>`;
      }).join('')}
    </div>`:''}

    ${bgTools.length||bgChoiceCount>0?`
    <div class="section-title sm">Инструменты от предыстории</div>
    <div style="display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin-bottom:.4rem">
      ${bgTools.map(t=>`<span class="proficiency-badge">${t}</span>`).join('')}
    </div>
    ${bgChoiceCount>0?`<div style="margin-top:.35rem">
      ${Array.from({length:bgChoiceCount},(_,i)=>{
        const cur = (wiz.bgToolChoices||{})[i]||'';
        // Что занято в других слотах этого же выбора
        const takenOther = new Set(Object.entries(wiz.bgToolChoices||{}).filter(([k])=>parseInt(k)!==i).map(([,v])=>v).filter(Boolean));
        // Что уже есть у персонажа (кроме самого bgToolChoice)
        const owned = new Set([
          ...bgTools,
          ...(_cleanProf(wiz.cls?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean),
          ...(_cleanProf(wiz.race?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean),
          ...(_cleanProf(wiz.subrace?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean),
          ...Object.values(wiz.raceToolChoices||{}).filter(Boolean),
          ...Object.values(wiz.skillOrToolChoices||{}).filter(Boolean),
        ]);
        return `<select style="min-width:240px;margin-bottom:.3rem;display:block"
          onchange="setBgToolChoice(${i},this.value);autoSave()">
          <option value="">— выбрать инструмент —</option>
          ${bgToolPool.map(t=>{
            const _ct=_allChosenTools('bg',i);
            const isOwned = cur!==t && (owned.has(t) || takenOther.has(t) || _ct.has(t));
            return `<option value="${t}" ${cur===t?'selected':''} ${isOwned?'disabled':''} style="${isOwned?'opacity:.35;color:var(--text3)':''}">${t}${isOwned?' ✓':''}</option>`;
          }).join('')}
        </select>`;
      }).join('')}
    </div>`:''}
    `:''}
    ${clsToolStr&&clsToolStr!=='—'?`<div class="note-text" style="margin-top:.4rem">Инструменты от класса (фикс.): <b>${clsToolStr}</b></div>`:''}
    ${(()=>{
      const clsTc = wiz.cls?.toolChoice;
      if (!clsTc) return '';
      const pool = _resolveToolPool(clsTc);
      const count = clsTc.count || 1;
      if (!wiz.clsToolChoices) wiz.clsToolChoices = {};
      // Что уже есть у персонажа (без clsToolChoices)
      const ownedFixed = new Set([
        ...bgTools,
        ...(_cleanProf(clsToolStr)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean),
        ...(_cleanProf(wiz.race?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean),
        ...(_cleanProf(wiz.subrace?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean),
        ...Object.values(wiz.bgToolChoices||{}).filter(Boolean),
        ...Object.values(wiz.raceToolChoices||{}).filter(Boolean),
        ...Object.values(wiz.skillOrToolChoices||{}).filter(v=>v&&!SKILLS_DATA.find(s=>s.name===v)),
      ]);
      const selects = Array.from({length:count},(_,i)=>{
        const cur = wiz.clsToolChoices[i]||'';
        const takenOther = new Set(Object.entries(wiz.clsToolChoices).filter(([k])=>parseInt(k)!==i).map(([,v])=>v).filter(Boolean));
        return `<select style="min-width:240px;margin-bottom:.3rem;display:block" onchange="setClsToolChoice(${i},this.value);autoSave()">
          <option value="">— выбрать инструмент —</option>
          ${pool.map(t=>{
            const _ct=_allChosenTools('cls',i);
            const isOwned = cur!==t && (ownedFixed.has(t)||takenOther.has(t)||_ct.has(t));
            return `<option value="${t}" ${cur===t?'selected':''} ${isOwned?'disabled':''} style="${isOwned?'opacity:.35;color:var(--text3)':''}">${t}${isOwned?' ✓':''}</option>`;
          }).join('')}
        </select>`;
      }).join('');
      return `<div style="margin-top:.8rem"><div class="section-title sm">Инструменты от класса (выбор)</div>${selects}</div>`;
    })()}
    ${buildRaceToolChoiceHtml()}
    ${buildSkillOrToolChoiceHtml()}`;
}

function setClsToolChoice(idx, val) {
  if (!wiz.clsToolChoices) wiz.clsToolChoices = {};
  wiz.clsToolChoices[idx] = val;
  buildSubclassExtras();
  buildLangToolChoices();
  buildRacialExtras();
}

function setBgSkillChoice(skill, checked, maxCount) {
  if (!wiz.bgSkillChoices) wiz.bgSkillChoices = [];
  if (checked) {
    if (!wiz.bgSkillChoices.includes(skill) && wiz.bgSkillChoices.length < maxCount) {
      wiz.bgSkillChoices.push(skill);
      wiz.skillProfs.add(skill);
    }
  } else {
    wiz.bgSkillChoices = wiz.bgSkillChoices.filter(s => s !== skill);
    wiz.skillProfs.delete(skill);
  }
  buildLangToolChoices();
  buildSubclassExtras();
  buildLangToolChoices();
  buildSkillGrid();
  buildRacialExtras();
}

function setBgLangChoice(idx, val) {
  if (!wiz.bgLangChoices) wiz.bgLangChoices = {};
  wiz.bgLangChoices[idx] = val;
  buildLangToolChoices();
}

function setBgToolChoice(idx, val) {
  if (!wiz.bgToolChoices) wiz.bgToolChoices = {};
  wiz.bgToolChoices[idx] = val;
  buildSubclassExtras();
  buildLangToolChoices();
  buildRacialExtras();
}

// Вспомогательная функция: разворачивает toolChoice в массив инструментов.
// from может содержать строки и/или объекты {category:'...'} для раскрытия категорий.
function _resolveToolPool(tc) {
  const _cat = window.TOOLS_BY_CATEGORY || {};
  const _all = window.TOOLS_ALL || [];
  if (!tc) return _all;
  if (tc.any) return _all;
  if (tc.category) return _cat[tc.category] || _all;
  if (tc.from) {
    const pool = [];
    const seen = new Set();
    for (const item of tc.from) {
      const tools = (typeof item === 'object' && item.category)
        ? (_cat[item.category] || [])
        : [item];
      for (const t of tools) {
        if (!seen.has(t)) { seen.add(t); pool.push(t); }
      }
    }
    return pool;
  }
  return _all;
}

// Расовый выбор инструментов (toolChoice)
function buildRaceToolChoiceHtml() {
  const race = wiz.race;
  const sub  = wiz.subrace;
  const tc = sub?.toolChoice || race?.toolChoice;
  if (!tc) return '';

  const pool = _resolveToolPool(tc);

  if (!wiz.raceToolChoices) wiz.raceToolChoices = {};
  const count = tc.count || 1;

  // Что уже есть у персонажа
  const allProfs = getAllProfsBySource();
  const alreadyOwned = new Set(allProfs.keys());

  const selects = Array.from({length: count}, (_, i) => {
    const curVal = wiz.raceToolChoices[i] || '';
    const takenInOtherSlots = new Set(
      Object.entries(wiz.raceToolChoices)
        .filter(([k]) => parseInt(k) !== i)
        .map(([,v]) => v)
        .filter(Boolean)
    );
    return `<select style="min-width:220px;margin-bottom:.3rem"
      onchange="setRaceToolChoice(${i},this.value);autoSave()">
      <option value="">— выбрать инструмент —</option>
      ${pool.map(t => {
        const _ct=_allChosenTools('race',i);
        const ownedElsewhere = curVal !== t && (alreadyOwned.has(t) || takenInOtherSlots.has(t) || _ct.has(t));
        return `<option value="${t}" ${curVal===t?'selected':''} ${ownedElsewhere?'disabled':''} style="${ownedElsewhere?'opacity:.35;color:var(--text3)':''}">${t}${ownedElsewhere?' ✓':''}</option>`;
      }).join('')}
    </select>`;
  }).join('');

  return `<div style="margin-top:.8rem">
    <div class="section-title sm">Инструменты от расы</div>
    ${selects}
  </div>`;
}

function setRaceToolChoice(idx, val) {
  if (!wiz.raceToolChoices) wiz.raceToolChoices = {};
  wiz.raceToolChoices[idx] = val;
  buildSubclassExtras();
  buildLangToolChoices();
  buildRacialExtras();
}

// Расовый выбор навык-или-инструмент (skillOrToolChoice)

// Полный набор всех владений (навыки + инструменты) из всех источников
// excludeSotSlot: индекс слота skillOrToolChoices расы который исключить (-1 = не исключать)
// excludeSubSotSlot: индекс слота subclassSkillOrToolChoices который исключить
function _buildSubSoTOwned(excludeSlot) {
  return _buildFullOwnedSet(-1, excludeSlot);
}

function _buildFullOwnedSet(excludeSotSlot, excludeSubSotSlot) {
  const s = new Set();
  const bgS = getBgSkills();
  // Навыки предыстории фикс.
  bgS.forEach(x => s.add(x));
  // Навыки предыстории по выбору
  (wiz.bgSkillChoices||[]).forEach(x => { if (x) s.add(x); });
  // Навыки от класса
  const clsPool = wiz.cls?.skillChoices==='all' ? SKILLS_DATA.map(sk=>sk.name) : (wiz.cls?.skillChoices||[]);
  [...(wiz.skillProfs instanceof Set ? wiz.skillProfs : [])].filter(x => clsPool.includes(x) && !bgS.includes(x) && x!==wiz.racialSkillChoice).forEach(x => s.add(x));
  // Навыки от подкласса
  (wiz.subclassSkillChoices||[]).forEach(x => { if (x) s.add(x); });
  // Расовый навык
  if (wiz.racialSkillChoice) s.add(wiz.racialSkillChoice);
  // Фикс. инструменты
  const bgTools = Array.isArray(wiz.background?.tools) ? wiz.background.tools : [];
  bgTools.forEach(x => s.add(x));
  ;(_cleanProf(wiz.cls?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean).forEach(x=>s.add(x));
  ;(_cleanProf(wiz.race?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean).forEach(x=>s.add(x));
  ;(_cleanProf(wiz.subrace?.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean).forEach(x=>s.add(x));
  // Дропдауны
  const addObj = (obj, excKey, excIdx) => Object.entries(obj||{}).forEach(([k,v]) => {
    if (excKey!==null && parseInt(k)===excIdx) return;
    if (v) s.add(v);
  });
  addObj(wiz.bgToolChoices,              null, -1);
  addObj(wiz.clsToolChoices,             null, -1);
  addObj(wiz.raceToolChoices,            null, -1);
  addObj(wiz.subclassToolChoices,        null, -1);
  addObj(wiz.skillOrToolChoices,         'sot', excludeSotSlot);
  addObj(wiz.subclassSkillOrToolChoices, 'sub', excludeSubSotSlot);
  return s;
}

function buildSkillOrToolChoiceHtml() {
  const race = wiz.race;
  const sub  = wiz.subrace;
  const sotc = sub?.skillOrToolChoice || race?.skillOrToolChoice;
  if (!sotc) return '';

  const allSkillNames = SKILLS_DATA.map(s => s.name);
  const allToolNames  = (window.TOOLS_ALL || []).map(t => typeof t === 'string' ? t : (t.name||'')).filter(Boolean);
  const allOptions    = sotc.any ? [...allSkillNames, ...allToolNames] : (sotc.from || []);

  if (!wiz.skillOrToolChoices) wiz.skillOrToolChoices = {};
  const count = sotc.count || 1;

  const selects = Array.from({length: count}, (_, i) => {
    const curVal = wiz.skillOrToolChoices[i] || '';
    const owned = _buildFullOwnedSet(i, -1);
    const renderOpt = o => {
      const blocked = curVal !== o && owned.has(o);
      return `<option value="${o}" ${curVal===o?'selected':''} ${blocked?'disabled':''} style="${blocked?'opacity:.35;color:var(--text3)':''}">
              ${o}${blocked?' ✓':''}</option>`;
    };
    const poolSkills = sotc.any ? allSkillNames : allOptions.filter(o => allSkillNames.includes(o));
    const poolTools  = sotc.any ? allToolNames  : allOptions.filter(o => !allSkillNames.includes(o));
    return `<select style="min-width:240px;margin-bottom:.3rem"
      onchange="setSkillOrToolChoice(${i},this.value);autoSave()">
      <option value="">— навык или инструмент —</option>
      ${poolSkills.length ? `<optgroup label="Навыки">${poolSkills.map(renderOpt).join('')}</optgroup>` : ''}
      ${poolTools.length  ? `<optgroup label="Инструменты">${poolTools.map(renderOpt).join('')}</optgroup>` : ''}
    </select>`;
  }).join('');

  return `<div style="margin-top:.8rem">
    <div class="section-title sm">Навыки или инструменты (от расы)</div>
    <div class="note-text" style="margin-bottom:.4rem">Выбрать ${count} из навыков или инструментов на ваш выбор</div>
    ${selects}
  </div>`;
}

function setSkillOrToolChoice(idx, val) {
  if (!wiz.skillOrToolChoices) wiz.skillOrToolChoices = {};
  wiz.skillOrToolChoices[idx] = val;
  buildSubclassExtras();
  buildLangToolChoices();
  buildSkillGrid();
  buildRacialExtras();
}

// Возвращает инструменты, допустимые для текущей предыстории и класса
function getFilteredTools() {
  const bgId  = wiz.background?.id;
  const clsId = wiz.cls?.id;
  const getForId = id => window.getToolsForSource ? window.getToolsForSource(id) : (window.TOOLS_ALL||[]);
  const bgTools  = bgId  ? getForId(bgId)  : (window.TOOLS_ALL||[]);
  const clsTools = clsId ? getForId(clsId) : (window.TOOLS_ALL||[]);
  // Пересечение если оба заданы, иначе - доступный список
  if (bgId && clsId) {
    const set = new Set(bgTools);
    const intersect = clsTools.filter(t => set.has(t));
    return intersect.length ? intersect : bgTools;
  }
  return bgTools.length ? bgTools : (clsTools.length ? clsTools : (window.TOOLS_ALL||[]));
}

function setLangChoice(idx, val) {
  if (!wiz.langChoices) wiz.langChoices = [];
  wiz.langChoices[idx] = val;
  // Перерисовываем — чтобы взятые языки стали недоступны в других слотах
  buildLangToolChoices();
}

function setToolChoice(idx, val) {
  if (!wiz.toolChoices) wiz.toolChoices = [];
  wiz.toolChoices[idx] = val;
  buildRacialExtras();
}

function buildRacialExtras() {
  const c = document.getElementById('racial-extras-section');
  if (!c) return;
  const race = wiz.race;
  const sub  = wiz.subrace;
  const mode = sub?.asiMode||race?.asiMode||'fixed';
  let html   = '';

  // Вариантный человек: выбор навыка (и черта)
  if (mode==='variant') {
    // Собрать все занятые навыки из всех источников
    const takenSkills = new Set([
      ...getBgSkills(),
      ...[...wiz.skillProfs].filter(s => s !== wiz.racialSkillChoice),
      // Навыки из skillOrToolChoice дропдаунов
      ...Object.values(wiz.subclassSkillOrToolChoices||{}).filter(v => v && SKILLS_DATA.find(s=>s.name===v)),
      ...Object.values(wiz.skillOrToolChoices||{}).filter(v => v && SKILLS_DATA.find(s=>s.name===v)),
      ...(wiz.subclassSkillChoices||[]).filter(Boolean),
      ...(wiz.bgSkillChoices||[]).filter(Boolean),
    ]);
    html += `<hr class="divider">
    <div class="section-title">Вариантный человек — дополнительный навык</div>
    <div class="form-group" style="max-width:300px">
      <label>1 навык на выбор (расовый) —<br>недоступны навыки уже выбранные от класса и предыстории</label>
      <select onchange="setRacialSkillChoice(this.value);autoSave()">
        <option value="">— выбрать —</option>
        ${SKILLS_DATA.map(s=>{
          const taken = takenSkills.has(s.name);
          return `<option value="${s.name}" ${wiz.racialSkillChoice===s.name?'selected':''} ${taken?'disabled':''} style="${taken?'opacity:.4':''}">
            ${s.name}${taken?' (уже есть)':''}
          </option>`;
        }).join('')}
      </select>
    </div>
    <div class="info-box"><b>Черта:</b> <span class="proficiency-badge badge-blue">«Выберите черту» — отмечено во владениях</span></div>`;
  }

  // ── Дублирующиеся владения: навыки ──
  html += buildDuplicateProfHtml();

  c.innerHTML = html;
}

// ══════════════════════════════════════════════════════════
// ДУБЛИРУЮЩИЕСЯ ВЛАДЕНИЯ — замена при совпадении источников
// ══════════════════════════════════════════════════════════

/**
 * Собирает все конкретные владения (навыки и инструменты) по источникам.
 * Возвращает Map: название → [источник1, источник2, ...]
 */
function getAllProfsBySource() {
  const map = new Map(); // name → ['Раса','Предыстория','Класс',...]

  const add = (name, src) => {
    if (!name) return;
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(src);
  };

  const race = wiz.race;
  const sub  = wiz.subrace;
  const cls  = wiz.cls;
  const bg   = wiz.background;

  // Навыки от предыстории
  getBgSkills().forEach(s => add(s, 'Предыстория'));

  // Навыки от класса (уже выбранные; расовый выбор вариантного человека не считается классовым)
  const clsPool = cls?.skillChoices === 'all'
    ? SKILLS_DATA.map(s => s.name)
    : (cls?.skillChoices || []);
  [...wiz.skillProfs]
    .filter(s => clsPool.includes(s) && !getBgSkills().includes(s) && s !== wiz.racialSkillChoice)
    .forEach(s => add(s, 'Класс'));

  // Расовый навык (вариантный человек)
  if (wiz.racialSkillChoice) add(wiz.racialSkillChoice, 'Раса');

  // Инструменты от предыстории — теперь tools[] содержит готовые строки
  const bgTools = Array.isArray(bg?.tools) ? bg.tools : [];
  bgTools.forEach(t => { if (t) add(t, 'Предыстория'); });

  // Выбранные инструменты из bgToolChoice
  Object.values(wiz.bgToolChoices||{}).forEach(t => { if (t) add(t, 'Предыстория'); });

  // Инструменты от класса (строка, разбиваем по «,» и «;»)
  if (cls?.toolProf && !_isNone(cls.toolProf)) {
    (_cleanProf(cls.toolProf)||'').split(/[,;]/).map(t=>t.trim()).filter(Boolean)
      .forEach(t => add(t, 'Класс'));
  }

  // Инструменты от расы/подрасы (фиксированные)
  [race?.toolProf, sub?.toolProf].forEach(tp => {
    if (tp) tp.split(/[,;]/).map(t=>t.trim()).filter(Boolean)
      .forEach(t => add(t, 'Раса'));
  });

  // Расовый toolChoice (конкретные выбранные инструменты)
  Object.values(wiz.raceToolChoices||{}).forEach(t => { if (t) add(t, 'Раса'); });

  // Инструменты класса (выбор)
  Object.values(wiz.clsToolChoices||{}).forEach(t => { if (t) add(t, 'Класс'); });

  // skillOrToolChoice (раса)
  Object.values(wiz.skillOrToolChoices||{}).forEach(t => { if (t) add(t, 'Раса'); });

  // Подкласс: фикс. навыки и инструменты
  const subP = _getSubclassProfs(wiz.cls, wiz.subclass, wiz.level||1);
  (subP.skills||[]).forEach(s => add(s, 'Подкласс'));
  (wiz.subclassSkillChoices||[]).forEach(s => add(s, 'Подкласс'));
  Object.values(wiz.subclassSkillOrToolChoices||{}).forEach(v => { if (v) add(v, 'Подкласс'); });
  Object.values(wiz.subclassToolChoices||{}).forEach(t => { if (t) add(t, 'Подкласс'); });
  // Фиксированные инструменты от подкласса (строка или массив)
  if (subP.toolProf) {
    const arr = Array.isArray(subP.toolProf)
      ? subP.toolProf
      : String(subP.toolProf).split(/[,;]/).map(t => t.trim()).filter(Boolean);
    arr.forEach(t => { if (t) add(t, 'Подкласс'); });
  }

  return map;
}

/**
 * Строит UI для замены дублирующихся владений.
 */
function buildDuplicateProfHtml() {
  const map = getAllProfsBySource();
  const duplicates = [...map.entries()].filter(([,srcs]) => srcs.length > 1);
  if (!duplicates.length) return '';

  if (!wiz.dupReplacements) wiz.dupReplacements = {};

  const allSkillNames = SKILLS_DATA.map(s => s.name);
  const _cat  = window.TOOLS_BY_CATEGORY || {};
  const _all  = window.TOOLS_ALL || [];

  const rows = duplicates.map(([name, srcs]) => {
    const isSkill = allSkillNames.includes(name);
    const takenProfs = new Set([...map.keys()]);
    takenProfs.delete(name);

    const getPool = (alreadyPicked) => {
      const usedRepl = new Set(alreadyPicked.filter(Boolean));
      if (isSkill) {
        const clsPool = wiz.cls?.skillChoices === 'all'
          ? allSkillNames : (wiz.cls?.skillChoices || allSkillNames);
        const fromClass = srcs.includes('Класс');
        return (fromClass ? clsPool : allSkillNames)
          .filter(s => !takenProfs.has(s) && !usedRepl.has(s));
      } else {
        return _all.filter(t => !takenProfs.has(t) && !usedRepl.has(t));
      }
    };

    // Количество замен = количество лишних источников
    const replCount = srcs.length - 1;
    const srcLabel = srcs.join(' + ');
    const selects = Array.from({length: replCount}, (_, i) => {
      const key = replCount === 1 ? name : `${name}__${i}`;
      // Уже выбранные в других слотах этого же дубля
      const otherPicked = Array.from({length: replCount}, (_, j) => {
        if (j === i) return null;
        const k2 = replCount === 1 ? name : `${name}__${j}`;
        return wiz.dupReplacements[k2] || null;
      });
      const pool = getPool(otherPicked);
      const cur = wiz.dupReplacements[key] || '';
      const label = replCount > 1 ? `Замена ${i+1} из ${replCount}` : 'Замена';
      return `<div style="margin-top:.35rem">
        <div class="note-text" style="margin-bottom:.2rem">${label}</div>
        <select style="max-width:300px;width:100%" onchange="setDupReplacement('${key.replace(/'/g,'\'\"\'')}',this.value);autoSave()">
          <option value="">— оставить дубль —</option>
          ${pool.map(p=>`<option value="${p.replace(/"/g,'&quot;')}" ${cur===p?'selected':''}>${p}</option>`).join('')}
        </select>
      </div>`;
    }).join('');

    return `<div class="form-group" style="max-width:340px;margin-bottom:.7rem">
      <label style="color:var(--gold)">
        ⚠ «${name}» — дубль (${srcLabel})
        <span class="note-text" style="font-weight:normal"> → выберите ${replCount > 1 ? replCount + ' замены' : 'замену'}</span>
      </label>
      ${selects}
    </div>`;
  }).join('');

  return `<hr class="divider">
    <div class="section-title" style="color:var(--gold)">⚠ Дублирующиеся владения</div>
    <div class="note-text" style="margin-bottom:.7rem">
      Если вы получаете одно и то же владение из двух источников — выберите другое взамен.
    </div>
    ${rows}`;
}

function setDupReplacement(original, replacement) {
  if (!wiz.dupReplacements) wiz.dupReplacements = {};
  if (replacement) wiz.dupReplacements[original] = replacement;
  else delete wiz.dupReplacements[original];
  // Пересобираем UI — дублей может стать меньше
  buildRacialExtras();
}

/**
 * Применяет замены к массиву владений.
 * Если 'Воровские инструменты' → 'Лютня', заменяет одно вхождение.
 */
// ── Слияние владений оружием из нескольких источников ──
// Правила:
// ── Все бонусы подкласса с учётом уровня ──────────────────────────────
// Возвращает все поля подкласса (владения, навыки, языки, darkvision, speedUp),
// если уровень персонажа >= порогу (profMinLevel или subclassLevel класса).
function _getSubclassProfs(cls, subclassName, level) {
  if (!cls || !subclassName) return {};
  const sub = (cls.subclasses || []).find(
    s => (s.name || s) === subclassName
  );
  if (!sub || typeof sub !== 'object') return {};

  const minLevel = sub.profMinLevel ?? cls.subclassLevel ?? 1;
  if ((level || 1) < minLevel) return {}; // уровень ниже порога

  const result = {};
  // Владения (оружие/доспехи/инструменты)
  if (sub.armorProf)        result.armorProf        = sub.armorProf;
  if (sub.weaponProf)       result.weaponProf       = sub.weaponProf;
  if (sub.toolProf)         result.toolProf         = sub.toolProf;
  if (sub.toolChoice)       result.toolChoice       = sub.toolChoice;
  // Навыки
  if (sub.skills?.length)      result.skills            = sub.skills;
  if (sub.skillChoices)        result.skillChoices      = sub.skillChoices;
  if (sub.skillOrToolChoice)   result.skillOrToolChoice = sub.skillOrToolChoice;
  // Языки
  if (sub.languagesConst?.length) result.languagesConst = sub.languagesConst;
  if (sub.languagesChoice)        result.languagesChoice = sub.languagesChoice;
  if (sub.languages > 0)          result.languages = sub.languages;
  // Спецхарактеристики
  if (sub.darkvision > 0) result.darkvision = sub.darkvision;
  if (sub.speedUp    > 0) result.speedUp    = sub.speedUp;
  return result;
}

// 1. Убираем дубликаты (одинаковые строки)
// 2. Если в итоге есть «Простое оружие» — убираем все элементы простого оружия
// 3. Если в итоге есть «Воинское оружие» — убираем все элементы воинского оружия
//    (и можно убрать «Простое оружие», т.к. воинское включает все)
function _mergeWeaponProfs(...sources) {
  const SIMPLE = new Set(['Боевой посох','Булава','Дубинка','Кинжал','Копьё','Лёгкий молот',
    'Метательное копьё','Палица','Ручной топор','Серп','Духовая трубка',
    'Дротик','Короткий лук','Праща','Лёгкий арбалет']);
  const MARTIAL = new Set(['Алебарда','Боевая кирка','Боевой молот','Боевой топор','Глефа',
    'Двуручный меч','Длинное копьё','Длинный меч','Кнут','Короткий меч',
    'Молот','Моргенштерн','Пика','Рапира','Секира','Скимитар','Трезубец','Цеп',
    'Ручной арбалет','Тяжёлый арбалет','Длинный лук','Сеть']);

  // Собираем все элементы из всех источников
  const combined = [];
  for (const src of sources) {
    if (!src) continue;
    const items = Array.isArray(src) ? src : [src];
    combined.push(...items);
  }

  // Дедупликация (с сохранением порядка)
  const seen = new Set();
  const deduped = combined.filter(w => { if (!w || seen.has(w)) return false; seen.add(w); return true; });

  const hasSimple  = deduped.includes('Простое оружие');
  const hasMartial = deduped.includes('Воинское оружие');

  // По правилам D&D: «Простое» и «Воинское» — независимые типы.
  // Воинское НЕ включает простое автоматически.
  return deduped.filter(w => {
    // Если есть «Воинское оружие» — убираем перечисленные воинские виды по отдельности
    if (hasMartial && MARTIAL.has(w)) return false;
    // Если есть «Простое оружие» — убираем перечисленные простые виды по отдельности
    if (hasSimple  && SIMPLE.has(w))  return false;
    return true;
  });
}

// Проверяет, является ли значение владения пустым («нет», «Нет», ': Нет' и т.п.)
function _isNone(v) {
  if (!v) return true;
  if (Array.isArray(v)) return v.length === 0;
  return /^\s*:?\s*н[еЕ][тТ]\s*$/i.test(v.trim());
}
// Очищает строку владения от «нет» — возвращает '' если пустая/нет
function _cleanProf(v) { return _isNone(v) ? '' : v; }

function _applyDupReplacementsToList(list, replacements) {
  if (!Object.keys(replacements).length) return list;
  const result = [...list];
  // Группируем замены по оригиналу (поддержка name__0, name__1)
  const byOrig = {};
  for (const [key, repl] of Object.entries(replacements)) {
    if (!repl) continue;
    const orig = key.includes('__') ? key.split('__')[0] : key;
    if (!byOrig[orig]) byOrig[orig] = [];
    byOrig[orig].push(repl);
  }
  for (const [orig, repls] of Object.entries(byOrig)) {
    // Заменяем первое вхождение orig → repls[0], второе → repls[1], и т.д.
    let replacedCount = 0;
    for (let i = 0; i < result.length && replacedCount < repls.length; i++) {
      if (result[i] === orig) {
        result[i] = repls[replacedCount++];
      }
    }
  }
  return result;
}

/**
 * Применяет замены к строке владений (разделённой «; » или «, »).
 */
function _applyDupReplacementsToString(str, replacements) {
  if (!str || !Object.keys(replacements).length) return str || '';
  let result = str;
  for (const [orig, repl] of Object.entries(replacements)) {
    if (!repl) continue;
    // Заменяем точное совпадение слова/фразы в строке
    result = result.replace(orig, repl);
  }
  return result;
}

// ── Расовые бонусы ASI (на шаге 4 — Характеристики) ──
function buildRacialAsiSection() {
  const c = document.getElementById('racial-asi-section');
  if (!c) return;
  const race = wiz.race;
  const sub  = wiz.subrace;
  if (!race) { c.innerHTML = ''; return; }

  const mode = sub?.asiMode||race?.asiMode||'fixed';

  // Фиксированная часть ASI: зависит от режима
  // - fixed: раса + подраса (или только подраса если asiOverride)
  // - all+1: отдельный info-box ниже, бейджи не нужны
  // - halfelf: раса.asi фиксировано (ХАР+2), остальное через выборы
  // - partial: фиксированная часть + выборная — бейджи рисуются ВНУТРИ блока partial
  // - variant/choice/flex2/select/multi-choice: только выборная часть, нет фиксированных бейджей
  const showFixedBadges = (mode === 'fixed' || mode === 'halfelf');
  let fixedAsi = {};
  if (showFixedBadges) {
    if (sub?.asiOverride) {
      fixedAsi = sub.asi || {};
    } else {
      fixedAsi = {...(race.asi||{}), ...(sub?.asi||{})};
    }
  }

  let html = `<hr class="ornate"><div class="section-title sm">📊 Расовые бонусы характеристик</div>`;

  // Показываем фиксированные бонусы только для fixed и halfelf
  if (showFixedBadges && Object.keys(fixedAsi).length > 0) {
    html += `<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.6rem">
      ${Object.entries(fixedAsi).map(([k,v])=>`<span class="proficiency-badge" style="background:rgba(100,180,100,.15);border-color:rgba(100,180,100,.4)">
        ${ABILITY_FULL[k]} +${v}
      </span>`).join('')}
    </div>`;
  }

  // Полуэльф: ХАР+2 фиксированно + 2 любые по +1 (кроме ХАР)
  if (mode === 'halfelf') {
    if (!wiz.halfElfPicks) wiz.halfElfPicks = [{key:'',bonus:1},{key:'',bonus:1}];
    const taken = new Set(wiz.halfElfPicks.map(p=>p.key).filter(Boolean));
    html += `<div class="info-box" style="margin-bottom:.6rem">
      <b>Полуэльф:</b> ХАР +2 (фиксированно) + 2 характеристики по +1 на выбор (кроме ХАР)
    </div>
    ${wiz.halfElfPicks.map((pick,i)=>`<div class="form-group" style="max-width:260px;margin-bottom:.4rem">
      <label>Выбор ${i+1}: +1 к характеристике</label>
      <select onchange="setHalfElfPick(${i},this.value);autoSave()">
        <option value="">— выбрать —</option>
        ${ABILITY_KEYS.filter(k=>k!=='ХАР').map(k=>{
          const disabled = taken.has(k) && pick.key!==k;
          return `<option value="${k}" ${pick.key===k?'selected':''} ${disabled?'disabled':''} style="${disabled?'opacity:.4':''}">
            ${ABILITY_FULL[k]}${disabled?' (уже выбрано)':''}
          </option>`;
        }).join('')}
      </select>
    </div>`).join('')}`;
  }

  // Вариантный человек: 2 характеристики +1
  else if (mode === 'variant') {
    if (!wiz.variantHumanPicks) wiz.variantHumanPicks = [{key:'',bonus:1},{key:'',bonus:1}];
    const taken = new Set(wiz.variantHumanPicks.map(p=>p.key).filter(Boolean));
    html += `<div class="info-box" style="margin-bottom:.6rem">
      <b>Вариантный человек:</b> 2 характеристики по +1 на выбор
    </div>
    ${wiz.variantHumanPicks.map((pick,i)=>`<div class="form-group" style="max-width:260px;margin-bottom:.4rem">
      <label>Выбор ${i+1}: +1</label>
      <select onchange="setVariantHumanPick(${i},this.value);autoSave()">
        <option value="">— выбрать —</option>
        ${ABILITY_KEYS.map(k=>{
          const disabled = taken.has(k) && pick.key!==k;
          return `<option value="${k}" ${pick.key===k?'selected':''} ${disabled?'disabled':''} style="${disabled?'opacity:.4':''}">
            ${ABILITY_FULL[k]}${disabled?' (уже выбрано)':''}
          </option>`;
        }).join('')}
      </select>
    </div>`).join('')}`;
  }

  // MPMM choice mode: +2/+1 или +1/+1/+1 к любым
  else if (mode === 'choice') {
    if (!wiz.asiChoiceMode) wiz.asiChoiceMode = '2+1';
    if (!wiz.asiChoicePicks) wiz.asiChoicePicks = {};
    html += `<div class="info-box" style="margin-bottom:.6rem">
      <b>MPMM/гибкий ASI:</b> выберите схему
    </div>
    <div style="display:flex;gap:.5rem;margin-bottom:.6rem">
      <button class="mode-btn ${wiz.asiChoiceMode==='2+1'?'active':''}" onclick="setAsiChoiceMode('2+1')">+2 и +1</button>
      <button class="mode-btn ${wiz.asiChoiceMode==='1+1+1'?'active':''}" onclick="setAsiChoiceMode('1+1+1')">+1 +1 +1</button>
    </div>
    ${buildAsiChoiceSelects()}`;
  }

  // flex2: любые 2 — одна +2 или две по +1
  else if (mode === 'flex2') {
    if (!wiz.flex2Mode) wiz.flex2Mode = '2+1';
    if (!wiz.flex2Picks) wiz.flex2Picks = {};
    html += `<div style="display:flex;gap:.5rem;margin-bottom:.6rem">
      <button class="mode-btn ${wiz.flex2Mode==='2+1'?'active':''}" onclick="setFlex2Mode('2+1')">+2 и +1</button>
      <button class="mode-btn ${wiz.flex2Mode==='1+1+1'?'active':''}" onclick="setFlex2Mode('1+1+1')">+1 +1 +1</button>
      <button class="mode-btn ${wiz.flex2Mode==='2only'?'active':''}" onclick="setFlex2Mode('2only')">+2 к одной</button>
    </div>
    ${buildFlex2Selects()}`;
  }

  // all+1: все +1 (стандартный человек)
  else if (mode === 'all+1') {
    html += `<div class="info-box"><b>Стандартный человек:</b> все характеристики получают +1</div>`;
  }

  // select: выбор одного из N готовых наборов ASI
  else if (mode === 'select') {
    const src = sub || race;
    const opts = Array.isArray(src?.asi) ? src.asi : [];
    if (opts.length) {
      if (wiz.asiSelectIdx === undefined) wiz.asiSelectIdx = 0;
      html += `<div class="info-box" style="margin-bottom:.6rem">
        <b>Выберите один вариант бонусов:</b>
      </div>
      <div style="display:flex;flex-direction:column;gap:.4rem">
        ${opts.map((opt,i)=>`
          <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;padding:.35rem .5rem;border-radius:6px;
            background:${wiz.asiSelectIdx===i?'rgba(180,140,60,.15)':'transparent'};border:1px solid ${wiz.asiSelectIdx===i?'rgba(180,140,60,.4)':'transparent'}">
            <input type="radio" name="asi-select" value="${i}"
              ${wiz.asiSelectIdx===i?'checked':''}
              onchange="setAsiSelectOption(${i});autoSave()" style="flex-shrink:0">
            <span>${Object.entries(opt).map(([k,v])=>`${ABILITY_FULL[k]} <b>+${v}</b>`).join(', ')}</span>
          </label>`).join('')}
      </div>`;
    }
  }

  // partial: фиксированный ASI + выбор из указанного пула
  else if (mode === 'partial') {
    const src = sub?.asiOverride ? sub : null;
    const fixedAsiSrc = src || race;
    const fixedPart = fixedAsiSrc?.asi || {};
    const ch = (sub || race)?.asiChoice;
    if (ch) {
      if (!wiz.asiPartialPicks) wiz.asiPartialPicks = {};
      const pool = ch.any ? ABILITY_KEYS : (ch.from||[]);
      const takenKeys = new Set(Object.keys(fixedPart));
      html += `<div class="info-box" style="margin-bottom:.6rem">
        <b>Фиксированные бонусы:</b>
        ${Object.entries(fixedPart).map(([k,v])=>`<span class="proficiency-badge">${ABILITY_FULL[k]} +${v}</span>`).join(' ')}
      </div>`;
      html += Array.from({length:ch.count||1},(_,i)=>{
        const alreadyPickedFn = k => Object.entries(wiz.asiPartialPicks||{}).some(([pi,p])=>Number(pi)!==i&&p.key===k);
        const opts = pool.map(k=>{
          const disabled = takenKeys.has(k) || alreadyPickedFn(k);
          return '<option value="'+k+'" '+(wiz.asiPartialPicks[i]?.key===k?'selected':'')+' '+(disabled?'disabled':'')+'>'+ABILITY_FULL[k]+(disabled?' ✓':'')+'</option>';
        }).join('');
        return '<div class="form-group" style="max-width:260px;margin-bottom:.4rem">'
          +'<label>+'+(ch.bonus||1)+' к характеристике (выбор '+(i+1)+')</label>'
          +'<select onchange="setAsiPartialPick('+i+',this.value,'+(ch.bonus||1)+');autoSave()">'
          +'<option value="">— выбрать —</option>'
          +opts
          +'</select></div>';
      }).join('');
    }
  }

  // multi-choice: несколько независимых шагов выбора
  else if (mode === 'multi-choice') {
    const src = sub || race;
    const steps = src?.asiChoice||[];
    if (!wiz.asiMultiPicks) wiz.asiMultiPicks = [];
    html += `<div class="info-box" style="margin-bottom:.6rem"><b>Выберите бонусы характеристик:</b></div>`;
    html += steps.map((step,i)=>{
      const prevKeys = new Set((wiz.asiMultiPicks||[]).filter((_,pi)=>pi<i).map(p=>p?.key).filter(Boolean));
      const pool = step.any
        ? ABILITY_KEYS.filter(k => !(step.excludePrevious && prevKeys.has(k)) && !(step.exclude||[]).includes(k))
        : (step.from||[]);
      const cur = wiz.asiMultiPicks[i]||{};
      const opts2 = pool.map(k=>'<option value="'+k+'" '+(cur.key===k?'selected':'')+'>'+ABILITY_FULL[k]+'</option>').join('');
      return '<div class="form-group" style="max-width:260px;margin-bottom:.4rem">'
        +'<label>+'+(step.bonus||1)+' к характеристике (шаг '+(i+1)+(step.from?': '+step.from.join('/'):'')+')</label>'
        +'<select onchange="setAsiMultiPick('+i+',this.value,'+(step.bonus||1)+');autoSave()">'
        +'<option value="">— выбрать —</option>'
        +opts2
        +'</select></div>';
    }).join('');
  }

  c.innerHTML = html;
}

function setHalfElfPick(idx, key) {
  if (!wiz.halfElfPicks) wiz.halfElfPicks = [{key:'',bonus:1},{key:'',bonus:1}];
  wiz.halfElfPicks[idx].key = key;
  recalcRacialBonuses();
  buildRacialAsiSection();
}

function setVariantHumanPick(idx, key) {
  if (!wiz.variantHumanPicks) wiz.variantHumanPicks = [{key:'',bonus:1},{key:'',bonus:1}];
  wiz.variantHumanPicks[idx].key = key;
  recalcRacialBonuses();
  buildRacialAsiSection();
}

function setAsiChoiceMode(m) {
  wiz.asiChoiceMode = m;
  wiz.asiChoicePicks = {};
  recalcRacialBonuses();
  buildRacialAsiSection();
}

function setFlex2Mode(m) {
  wiz.flex2Mode = m;
  wiz.flex2Picks = {};
  recalcRacialBonuses();
  buildRacialAsiSection();
}

function buildAsiChoiceSelects() {
  const mode = wiz.asiChoiceMode || '2+1';
  const picks = wiz.asiChoicePicks || {};
  const slots = mode === '2+1'
    ? [{bonus:2,label:'+2'},{bonus:1,label:'+1'}]
    : [{bonus:1,label:'+1'},{bonus:1,label:'+1'},{bonus:1,label:'+1'}];
  const taken = new Set(Object.keys(picks));
  return slots.map((slot,i)=>`
    <div class="form-group" style="max-width:260px;margin-bottom:.4rem">
      <label>${slot.label} к характеристике ${i+1}</label>
      <select onchange="setAsiChoicePick(${i},this.value,${slot.bonus});autoSave()">
        <option value="">— выбрать —</option>
        ${ABILITY_KEYS.map(k=>{
          const isMe = Object.entries(picks).find(([,v])=>v.idx===i&&k===Object.keys(picks).find(pk=>picks[pk]?.idx===i));
          const disabled = taken.has(k) && !isMe;
          return `<option value="${k}" ${Object.entries(picks).some(([pk,pv])=>pk===k&&pv.idx===i)?'selected':''} ${disabled?'disabled':''}>
            ${ABILITY_FULL[k]}${disabled?' ✓':''}
          </option>`;
        }).join('')}
      </select>
    </div>`).join('');
}

function buildFlex2Selects() {
  return buildAsiChoiceSelects(); // same logic
}

function setAsiChoicePick(idx, key, bonus) {
  if (!wiz.asiChoicePicks) wiz.asiChoicePicks = {};
  Object.keys(wiz.asiChoicePicks).forEach(k=>{ if(wiz.asiChoicePicks[k]?.idx===idx) delete wiz.asiChoicePicks[k]; });
  if (key) wiz.asiChoicePicks[key] = {idx, bonus};
  recalcRacialBonuses();
}

function setFlex2Pick(idx, key, bonus) {
  if (!wiz.flex2Picks) wiz.flex2Picks = {};
  Object.keys(wiz.flex2Picks).forEach(k=>{ if(wiz.flex2Picks[k]?.idx===idx) delete wiz.flex2Picks[k]; });
  if (key) wiz.flex2Picks[key] = {idx, bonus};
  recalcRacialBonuses();
}


function setRacialSkillChoice(val) {
  if (wiz.racialSkillChoice) wiz.skillProfs.delete(wiz.racialSkillChoice);
  wiz.racialSkillChoice = val;
  if (val) wiz.skillProfs.add(val);
  buildSkillGrid();
  buildSubclassExtras(); // подклассовый SoT
  buildLangToolChoices(); // расовый SoT
}

function setExtraAsi(idx, key, bonus) {
  if (!wiz.asiFlexPick) wiz.asiFlexPick={};
  // Remove previous at this index
  Object.keys(wiz.asiFlexPick).forEach(k=>{
    if(wiz.asiFlexPick[k]?.idx===idx) delete wiz.asiFlexPick[k];
  });
  if (key) wiz.asiFlexPick[key] = {idx, bonus};
  recalcRacialBonuses();
}

// select: выбор одного из готовых наборов
function setAsiSelectOption(idx) {
  wiz.asiSelectIdx = idx;
  recalcRacialBonuses();
  buildRacialAsiSection();
}

// partial: выбор дополнительной характеристики к фиксированной части
function setAsiPartialPick(idx, key, bonus) {
  if (!wiz.asiPartialPicks) wiz.asiPartialPicks = {};
  if (key) wiz.asiPartialPicks[idx] = {key, bonus: bonus||1};
  else delete wiz.asiPartialPicks[idx];
  recalcRacialBonuses();
  buildRacialAsiSection();
}

// multi-choice: несколько независимых шагов выбора
function setAsiMultiPick(idx, key, bonus) {
  if (!wiz.asiMultiPicks) wiz.asiMultiPicks = [];
  if (key) wiz.asiMultiPicks[idx] = {key, bonus: bonus||1};
  else wiz.asiMultiPicks[idx] = null;
  recalcRacialBonuses();
  buildRacialAsiSection();
}

// ── Карточка заклинания ──
function renderSpellCard(s, type, max, showLevel) {
  const checked  = type==='cantrip' ? wiz.selectedCantrips.includes(s.name) : wiz.selectedSpells.includes(s.name);
  const isSub    = s.isSubclassSpell;
  const srcLabel = s.source ? (window.SOURCES?.[s.source] || s.source) : '';

  const lvlColours=['#a0a0c0','#7ab3e8','#6dcf7a','#f0c040','#e07050','#c060e0','#e05080','#40c0e0','#ff8040','#ff4060'];
  const lvlCol   = s.level !== undefined ? (lvlColours[s.level]||'var(--text2)') : 'var(--text3)';
  const lvlDisp  = s.level === 0 ? '0' : (s.level ?? '?');
  const schoolStr= (s.school||'').replace(/\s*\(.*$/,'').trim();
  const ctxName  = s.name.replace(/'/g, "\\'");
  const safeName = s.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");

  return `<div class="wiz-spell-card ${checked?'selected':''} ${isSub?'spell-subclass':''}"
    onclick="wizToggleSpell(this,'${type}','${safeName}',${max})"
    oncontextmenu="openSpellCtxMenu(event,'${ctxName}');event.preventDefault()">
    <div style="min-width:1.6rem;text-align:center;flex-shrink:0">
      <div style="font-size:.5rem;color:var(--text3);line-height:1">ур.</div>
      <div style="font-size:.78rem;font-weight:800;font-family:'PT Mono',monospace;color:${lvlCol};line-height:1.2">${lvlDisp}</div>
    </div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:baseline;gap:.3rem;flex-wrap:wrap">
        <span style="font-size:.84rem;font-weight:700;color:var(--text)">${s.name}</span>
        ${schoolStr?`<span style="font-size:.62rem;color:var(--text3);font-style:italic">${schoolStr}</span>`:''}
        ${isSub?'<span style="font-size:.6rem;color:var(--gold)">⭐</span>':''}
        ${s.concentration?'<span style="font-size:.65rem;font-weight:900;color:#f0c040">К</span>':''}
        ${s.ritual?'<span style="font-size:.65rem;font-weight:900;color:#70a0d0">Р</span>':''}
      </div>
      <div style="font-size:.62rem;color:var(--text3);margin-top:.04rem;display:flex;gap:.3rem;flex-wrap:wrap">
        ${s.cast?`<span>⏱ ${s.cast}</span>`:''}${s.range?`<span>📏 ${s.range}</span>`:''}${s.duration?`<span>⌛ ${s.duration}</span>`:''}
      </div>
    </div>
    ${srcLabel?`<span style="font-size:.58rem;color:var(--text3);background:rgba(255,255,255,.06);border:1px solid #3d4a65;border-radius:3px;padding:.05rem .25rem;white-space:nowrap;flex-shrink:0">${s.source}</span>`:''}
    <div class="wiz-spell-check">✓</div>
  </div>`;
}

// Клик по карточке заклинания в визарде — управляет выделением вручную
function wizToggleSpell(cardEl, type, name, max) {
  // cardEl — это сам div.wiz-spell-card (передаётся через this)
  const arr    = type==='cantrip' ? wiz.selectedCantrips : wiz.selectedSpells;
  const dispId = type==='cantrip' ? 'cantrip-count-display' : 'spell-count-display';
  const idx    = arr.indexOf(name);
  if (idx >= 0) {
    arr.splice(idx, 1);
  } else {
    if (arr.length >= max) {
      toast(`Максимум ${max} ${type==='cantrip'?'заговоров':'заклинаний'}`, 'error');
      return;
    }
    arr.push(name);
  }
  const dispEl = document.getElementById(dispId);
  if (dispEl) dispEl.textContent = arr.length;
  // Обновляем класс напрямую на переданном элементе
  cardEl.classList.toggle('selected', arr.includes(name));
  autoSave();
}

// ── ШАГ 6: Заклинания ──
function renderStep6Spells() {
  const cls = wiz.cls;
  const c   = document.getElementById('wpage-6');
  if (!c) return;
  if (!cls?.spellcasting) {
    c.innerHTML = `<div class="section-title">🔮 Заклинания</div>
      <div class="info-box"><b>${cls?.name||'Этот класс'}</b> не является заклинателем.</div>
      <p class="note-text" style="margin-top:.5rem">Заклинания недоступны для данного класса.</p>`;
    return;
  }

  const sc    = cls.spellcasting;
  const level = wiz.level||1;
  const pb    = profBonus(level);
  const abilVal = (wiz.abilities[sc.ability]||10) + ((wiz.racialBonuses||{})[sc.ability]||0);
  const spellMod = getMod(abilVal);
  const dc    = 8 + pb + spellMod;
  const atk   = fmtMod(pb + spellMod);

  // Вычислить максимальный уровень доступных заклинаний
  const levelTable = window.MAX_SPELL_LEVEL_BY_CLASS_LEVEL?.[sc.type] || window.MAX_SPELL_LEVEL_BY_CLASS_LEVEL?.full || [];
  const maxSpellLevel = levelTable[level] || 1;

  // Количество заговоров по уровню персонажа
  const cantripCount = level === 1
    ? (sc.cantrips || 0)
    : (sc.cantripsByLevel ? sc.cantripsByLevel[level - 2] || sc.cantrips : sc.cantrips || 0);

  // Количество известных заклинаний
  let spellCount = 0;
  let isPrepared = false;
  if (sc.spellsByLevel === 'prepared') {
    isPrepared = true;
    // Подготавливаемых = мод хар-ки + уровень (или ½ уровня)
    const halfLevel = (sc.type==='half'||sc.type==='half_up') ? Math.ceil(level/2) : level;
    spellCount = Math.max(1, spellMod + halfLevel);
  } else if (Array.isArray(sc.spellsByLevel)) {
    spellCount = level === 1 ? sc.spells1 : (sc.spellsByLevel[level - 2] || sc.spells1);
  } else {
    spellCount = sc.spells1 || 0;
  }

  // Все заклинания для данного класса из включённых источников
  const classKey = cls.id;
  const allSpells = (window.SPELLS||[]).filter(s => s.classes?.includes(classKey) && enabledSources.has(s.source||'PH14'));

  // Подкласс из wiz (нормализуем к нижнему регистру для сравнения)
  const subclassName     = (wiz.subclass || '').toLowerCase().trim();
  const subclassNameFull = wiz.subclass || '';

  // Функция: является ли заклинание заклинанием текущего подкласса
  function isSubclassSpell(sp) {
    if (!subclassName) return false;
    if (!Array.isArray(sp.subclasses) || sp.subclasses.length === 0) return false;
    return sp.subclasses.some(sc =>
      sc.class === classKey && sc.name.toLowerCase().trim() === subclassName
    );
  }

  // Заклинания подкласса из spells.subclasses[], которых НЕТ в classes[] класса
  // (например "Огонь фей" для Колдуна-архифеи: classes=['bard','druid'], subclasses=[{class:'warlock',name:'архифея'}])
  const extraSubclassSpells = subclassName
    ? (window.SPELLS||[]).filter(s =>
        !s.classes?.includes(classKey) &&       // не в базовом пуле класса
        enabledSources.has(s.source||'PH14') &&  // из активных источников
        isSubclassSpell(s)                        // принадлежит подклассу
      ).map(s => ({...s, isSubclassSpell: true}))
    : [];

  // Объединяем базовый пул и дополнительные заклинания подкласса
  const allClassAndSubSpells = [...allSpells, ...extraSubclassSpells];

  const cantripsAvail = allClassAndSubSpells.filter(s => s.level === 0);

  // Заклинания доступных уровней
  const spellsAvail = allClassAndSubSpells.filter(s => s.level > 0 && s.level <= maxSpellLevel);

  // Также учитываем cls.subclassSpells (для колдуна — покровительские заклинания)
  const legacySubclassSpells = cls.subclassSpells?.[subclassNameFull] || [];

  // Опциональные заклинания Таши
  const tashaSpells = (enabledSources.has('TCE') && cls.optionalSpells?.tasha) || [];

  // Помечаем заклинания подкласса флагом isSubclassSpell (extraSubclassSpells уже помечены)
  const cantripsAvailMapped = cantripsAvail.map(s =>
    (s.isSubclassSpell || isSubclassSpell(s)) ? {...s, isSubclassSpell: true} : s
  );
  const anySubclassCantrip = cantripsAvailMapped.some(s => s.isSubclassSpell);

  // Аббревиатуры для отображения характеристики
  const ABIL_RU = {ИНТ:'ИНТ',МДР:'МДР',ХАР:'ХАР',СИЛ:'СИЛ',ЛОВ:'ЛОВ',ТЕЛ:'ТЕЛ',
    INT:'ИНТ',WIS:'МДР',CHA:'ХАР',STR:'СИЛ',DEX:'ЛОВ',CON:'ТЕЛ'};
  const abilDisplay = ABIL_RU[sc.ability] || sc.ability;

  let html = `
    <div class="section-title">🔮 Заклинания</div>
    <div class="spell-meta-bar" style="margin-bottom:1rem">
      <div class="spell-meta-item">
        <span class="spell-meta-label">Спасбросок заклинаний</span>
        <span class="spell-meta-val">${dc}</span>
      </div>
      <div class="spell-meta-item">
        <span class="spell-meta-label">Бонус атаки</span>
        <span class="spell-meta-val">${atk}</span>
      </div>
      <div class="spell-meta-item">
        <span class="spell-meta-label">Хар-ка</span>
        <span class="spell-meta-val">${abilDisplay}</span>
      </div>
      <div class="spell-meta-item">
        <span class="spell-meta-label">Макс. ур. заклинаний</span>
        <span class="spell-meta-val">${maxSpellLevel}</span>
      </div>
    </div>`;

  // Заговоры
  if (cantripCount > 0) {
    html += `
    <div class="section-title sm">Заговоры — выбрать ${cantripCount}</div>
    ${anySubclassCantrip ? `<div class="note-text" style="margin-bottom:.3rem">⭐ Заклинания вашего подкласса <b>${subclassNameFull}</b></div>` : ''}
    <div class="note-text" style="margin-bottom:.5rem">Выбрано: <b id="cantrip-count-display">${wiz.selectedCantrips.length}</b> / ${cantripCount}</div>
    <div class="spell-list" style="max-height:320px;overflow-y:auto;margin-bottom:1rem">
      ${cantripsAvailMapped.length ? cantripsAvailMapped.map(s=>renderSpellCard(s,'cantrip',cantripCount,false)).join('') : '<div class="note-text">Нет заговоров для выбранных источников.</div>'}
    </div>`;
  }

  // Заклинания (известные или подготавливаемые)
  if (isPrepared) {
    // Подготавливаемые: только сообщение — список на листе персонажа
    const prepCount = Math.max(1, spellMod + ((sc.type==='half'||sc.type==='half_up') ? Math.ceil(level/2) : level));
    html += `
    <div class="info-box" style="margin-top:.5rem;margin-bottom:.5rem;border-color:rgba(150,210,150,.3)">
      <div style="font-size:1.1rem;margin-bottom:.4rem">📖</div>
      <b>${cls.name} подготавливает заклинания каждое утро.</b><br>
      <span style="color:var(--text2)">Выбирать заклинания на этом этапе не нужно — вы сможете подготовить до <b>${prepCount}</b> заклинаний
      (уровень ${level} + мод. ${abilDisplay} ${spellMod >= 0 ? '+' + spellMod : spellMod})
      прямо на листе персонажа через контекстное меню заклинания.</span>
    </div>`;
  } else if (spellCount > 0) {
    // Для известных заклинаний — помечаем подкласс-заклинания (extraSubclassSpells уже помечены)
    let combinedSpells = spellsAvail.map(s =>
      (s.isSubclassSpell || isSubclassSpell(s)) ? {...s, isSubclassSpell: true} : s
    );

    // legacy subclassSpells (из cls.subclassSpells) — для колдуна
    legacySubclassSpells.forEach(spName => {
      if (!combinedSpells.find(s => s.name === spName)) {
        const spData = (window.SPELLS||[]).find(s=>s.name===spName);
        combinedSpells.push(spData
          ? {...spData, isSubclassSpell:true}
          : {name: spName, level: 1, school: 'покровитель', source:'', isSubclassSpell: true});
      } else {
        const idx = combinedSpells.findIndex(s=>s.name===spName);
        if (idx>=0) combinedSpells[idx] = {...combinedSpells[idx], isSubclassSpell:true};
      }
    });

    // Сортируем: сначала по уровню, потом по названию
    combinedSpells.sort((a,b)=>((a.level||0)-(b.level||0))||a.name.localeCompare(b.name));
    const anySubclass = combinedSpells.some(s => s.isSubclassSpell);

    if (combinedSpells.length > 0) {
      html += `
      <div class="section-title sm">Заклинания (1–${maxSpellLevel} ур.) — выбрать ${spellCount}</div>
      ${anySubclass ? `<div class="note-text" style="margin-bottom:.4rem">⭐ Заклинания подкласса <b>${subclassNameFull}</b> помечены звёздочкой.</div>` : ''}
      <div class="note-text" style="margin-bottom:.5rem">Выбрано: <b id="spell-count-display">${wiz.selectedSpells.length}</b> / ${spellCount}</div>
      <div class="spell-list" style="max-height:400px;overflow-y:auto;margin-bottom:1rem">
        ${combinedSpells.map(s=>renderSpellCard(s,'spell',spellCount,true)).join('')}
      </div>`;
    }
  }

  // Опциональные заклинания Таши
  if (tashaSpells.length > 0) {
    html += `
    <div class="info-box" style="margin-bottom:.8rem;border-color:rgba(150,120,50,.4)">
      <b>✨ Опциональные заклинания (TCE / Котёл Таши):</b>
      <div style="margin-top:.3rem;display:flex;flex-wrap:wrap;gap:.3rem">
        ${tashaSpells.map(sp=>`<span class="proficiency-badge">${sp}</span>`).join('')}
      </div>
      <div class="note-text" style="margin-top:.3rem">Доступны при включённом источнике TCE.</div>
    </div>`;
  }

  html += `
    <hr class="ornate" style="margin-top:1.5rem;margin-bottom:1.2rem">
    <div class="form-group">
      <label>Дополнительные заклинания вручную (по одному на строку)</label>
      <textarea id="w-spells-manual" rows="3" placeholder="Волшебная стрела — 1 ур.&#10;Огненный шар — 3 ур.">${wiz.spells.join('\n')}</textarea>
    </div>`;

  c.innerHTML = html;
}

function toggleSpell(type, name, checked, max) {
  const arr    = type==='cantrip' ? wiz.selectedCantrips : wiz.selectedSpells;
  const dispId = type==='cantrip' ? 'cantrip-count-display' : 'spell-count-display';
  if (checked) {
    if (arr.length>=max) { toast(`Максимум ${max} ${type==='cantrip'?'заговоров':'заклинаний'}`,'error');
      setTimeout(()=>{
        document.querySelectorAll(`input[value="${name}"]`).forEach(inp=>{ if(inp.checked) inp.checked=false; });
      },0);
      return;
    }
    if (!arr.includes(name)) arr.push(name);
  } else {
    const i=arr.indexOf(name); if(i!==-1) arr.splice(i,1);
  }
  const el=document.getElementById(dispId); if(el) el.textContent=arr.length;
}

// ── ШАГ 7: Снаряжение ──
function renderStep7() {
  buildEquipmentSection();
  buildWeaponsList();
  buildInventoryList();
}

// ── Resolve item id → display name ───────────────────────────────────────
function itemName(id) {
  if (!id) return id;
  const it = window.findItemById?.(id) || window.ITEMS_KITS?.find(k=>k.id===id);
  return it ? it.name : id;
}

// ── Get parsed equipment slots for current class ──────────────────────────
function getClassEq() {
  const id = wiz.cls?.id;
  if (!id || !window.CLASSES) return null;
  const cls = window.CLASSES.find(c => c.id === id);
  return cls?.equipment ? { name: cls.name, slots: cls.equipment } : null;
}
function getBgEq() {
  const id = wiz.background?.id;
  if (!id || !window.BACKGROUNDS) return null;
  const bg = window.BACKGROUNDS.find(b => b.id === id);
  return bg?.equipment ? { name: bg.name, gold: bg.gold || 0, slots: bg.equipment } : null;
}

// ── Render one item/choice token as HTML ──────────────────────────────────

// Тултип для набора снаряжения (ITEMS_KITS)
function _kitTooltipHtml(itemId) {
  const kit = (window.ITEMS_KITS||[]).find(k => k.id === itemId);
  if (!kit?.items?.length) return '';
  const lines = kit.items.map(it => {
    const nm = it.note || itemName(it.itemId) || it.itemId;
    return `<div>• ${nm}${it.qty>1?' ×'+it.qty:''}</div>`;
  }).join('');
  return `<span class="kit-tooltip-anchor"><span class="kit-tooltip-box"><b>${kit.name}</b>${lines}</span></span>`;
}

// Оборачивает span с именем набора в тултип-якорь если это набор
function _kitWrap(itemId, label) {
  const isKit = (window.ITEMS_KITS||[]).some(k => k.id === itemId);
  if (!isKit) return label;
  const kit = (window.ITEMS_KITS||[]).find(k => k.id === itemId);
  const lines = (kit?.items||[]).map(it => {
    const nm = it.note || itemName(it.itemId) || it.itemId;
    return `<div>• ${nm}${it.qty>1?' ×'+it.qty:''}</div>`;
  }).join('');
  return `<span class="kit-tooltip-anchor" style="text-decoration:underline dotted;text-underline-offset:2px;cursor:help">${label}<span class="kit-tooltip-box"><b>${kit.name}</b>${lines}</span></span>`;
}

function renderEquipToken(it) {
  if (!it) return '';
  if (it.ref === 'bg_tool_proficiency' || it.ref === 'cls_tool_proficiency') {
    // Resolve the actual tool name from wiz picks
    const name = _resolveToolRef(it.ref);
    const label = name || it.label || 'Инструмент из владений';
    const qty = it.qty > 1 ? ` ×${it.qty}` : '';
    const style = name ? '' : ' style="color:#f0c04099"';
    return `<span class="equip-fixed-item"${style}>✓ ${label}${qty}</span>`;
  }
  if (it.id) {
    const nm = it.note || itemName(it.id);
    const qty = it.qty > 1 ? ` ×${it.qty}` : '';
    const label = _kitWrap(it.id, nm);
    return `<span class="equip-fixed-item">✓ ${label}${qty}</span>`;
  }
  if (it.unknown) return `<span class="equip-fixed-item" style="color:#aaa">? ${it.unknown}</span>`;
  return '';
}

// Resolve tool ref → display name from wiz picks
function _resolveToolRef(ref) {
  if (!wiz) return null;
  if (ref === 'bg_tool_proficiency') {
    // bgToolChoices stores name strings; take the first one
    const picks = wiz.bgToolChoices || {};
    return Object.values(picks).find(Boolean) || null;
  }
  if (ref === 'cls_tool_proficiency') {
    const picks = wiz.clsToolChoices || {};
    return Object.values(picks).find(Boolean) || null;
  }
  return null;
}

// All tool proficiency names the character currently has (for prof_only filtering)
function _getAllToolProfNames() {
  if (!wiz) return new Set();
  const names = new Set();
  const add = v => v && String(v).split(/[,;]/).map(t => t.trim()).filter(Boolean).forEach(t => names.add(t));
  add(wiz.background?.tools?.join(', '));
  add(wiz.cls?.toolProf);
  add(wiz.race?.toolProf);
  add(wiz.subrace?.toolProf);
  Object.values(wiz.bgToolChoices   || {}).filter(Boolean).forEach(t => names.add(t));
  Object.values(wiz.clsToolChoices  || {}).filter(Boolean).forEach(t => names.add(t));
  Object.values(wiz.raceToolChoices || {}).filter(Boolean).forEach(t => names.add(t));
  Object.values(wiz.skillOrToolChoices || {}).filter(Boolean).forEach(t => names.add(t));
  return names;
}

// ── Populate dropdown for a choice slot ──────────────────────────────────
function _choiceOptions(ch) {
  const type   = ch.type;
  const filter = ch.filter || '';
  let items = [];

  if (type === 'weapon_choice') {
    items = (window.ITEMS_WEAPONS || []).filter(w =>
      !filter || w.category === filter || w.subcategory === filter
    );
  } else if (type === 'armor_choice') {
    items = (window.ITEMS_ARMOR || []).filter(a =>
      !filter || a.category === filter
    );
  } else if (type === 'tool_choice') {
    // Build full list filtered by category
    const filters = Array.isArray(filter) ? filter : (filter ? [filter] : []);
    items = (window.ITEMS_TOOLS || []).filter(t =>
      !filters.length || filters.includes('all') ||
      filters.includes(t.categoryId) || filters.includes(t.category)
    );
    // prof_only: restrict to tools the character already has proficiency in
    if (ch.prof_only && wiz) {
      const profNames = _getAllToolProfNames();
      items = items.filter(t => profNames.has(t.name));
    }
  } else if (type === 'gear_choice') {
    items = (window.ITEMS_GEAR || []).filter(g =>
      !filter || g.category === filter
    );
  } else if (type === 'gear_fixed') {
    // Single fixed item wrapped as choice (e.g. component_pouch)
    const it = window.findItemById?.(ch.id);
    return it ? [{ value: ch.id, label: it.name }] : [];
  }
  return items.map(i => ({ value: i.id, label: i.name }));
}

// ── Render one choice slot as a labeled select ───────────────────────────
function renderChoiceSlot(slotIdx, optionSets, isBg) {
  // Each option set is an array of items (the whole "bundle" you get on picking that option)
  const prefix = isBg ? 'bg' : 'cls';
  const savedPick = wiz.equipPicks?.[`${prefix}_${slotIdx}`];

  // ── SINGLE-BUNDLE SHORTCUT ───────────────────────────────────────────
  // If there is exactly one option bundle, there is nothing to choose at the
  // top level: the bundle is implicitly selected.
  //   • Fixed-only bundle  → items already rendered in the fixed row; skip entirely.
  //   • Bundle with inner choices (tool/weapon/etc.) → auto-select bundle 0
  //     and render only the inner selects, without a wrapping "Выбор N" dropdown.
  if (optionSets.length === 1) {
    const bundle = optionSets[0];
    const innerItems = bundle.filter(it => it.type);
    if (innerItems.length === 0) return ''; // all fixed → already in fixed row

    // Auto-fix bundle = 0 in state so collectEquipmentItems works correctly
    if (!wiz.equipPicks) wiz.equipPicks = {};
    const key = `${prefix}_${slotIdx}`;
    if (!wiz.equipPicks[key]) wiz.equipPicks[key] = { bundle: 0, inner: {} };
    else wiz.equipPicks[key].bundle = 0;
    const sp = wiz.equipPicks[key];

    let html = '';
    bundle.forEach((it, k) => {
      if (!it.type) return;
      const opts2 = _choiceOptions(it);
      const savedInner = sp.inner?.[k] || '';
      const opts2Html = opts2.map(o =>
        `<option value="${o.value}" ${savedInner===o.value?'selected':''}>${o.label}</option>`
      ).join('');
      html += `<div class="form-group" style="margin-bottom:.4rem;max-width:360px">
        <label>${it.label}</label>
        <select onchange="setEquipSlotPick('${prefix}',${slotIdx},0,${k},this.value);autoSave()">
          <option value="">— выбрать —</option>${opts2Html}
        </select>
      </div>`;
    });
    return html;
  }

  // ── MULTI-BUNDLE (normal path) ───────────────────────────────────────
  const bundleLabels = optionSets.map(bundle => {
    return bundle.map(it => {
      if (it.id) {
        const nm = it.note || itemName(it.id);
        const qty = it.qty>1 ? ` ×${it.qty}` : '';
        return _kitWrap(it.id, nm) + qty;
      }
      if (it.type)    return it.label || it.type;
      if (it.unknown) return it.unknown;
      return '?';
    }).join(' + ');
  });

  const hasInnerChoice = optionSets.some(bundle => bundle.some(it => it.type));

  if (!hasInnerChoice) {
    // Simple bundle dropdown — nothing inside, just pick which bundle
    // Для <option> нельзя вставить HTML — показываем тултип через title на самом select
    // и подсказку под дропдауном при выборе набора
    const opts = optionSets.map((bundle, i) => {
      const kitItem = bundle.find(it => it.id && (window.ITEMS_KITS||[]).some(k=>k.id===it.id));
      const kitTip = kitItem ? (() => {
        const k=(window.ITEMS_KITS||[]).find(k=>k.id===kitItem.id);
        return k?.items?.map(it=>(it.note||itemName(it.itemId)||it.itemId)+(it.qty>1?' ×'+it.qty:'')).join(', ')||'';
      })() : '';
      const plainLabel = bundle.map(it => {
        if (it.id) return (it.note || itemName(it.id)) + (it.qty>1?` ×${it.qty}`:'');
        if (it.type) return it.label || it.type;
        return it.unknown || '?';
      }).join(' + ');
      return `<option value="${i}" ${savedPick?.bundle == i ? 'selected' : ''} title="${kitTip}">${plainLabel}</option>`;
    }).join('');
    const selBundle = savedPick?.bundle != null ? optionSets[savedPick.bundle] : null;
    const kitHint = selBundle ? (() => {
      const kitItem = selBundle.find(it => it.id && (window.ITEMS_KITS||[]).some(k=>k.id===it.id));
      if (!kitItem) return '';
      const k=(window.ITEMS_KITS||[]).find(k=>k.id===kitItem.id);
      if (!k?.items?.length) return '';
      return `<div class="note-text" style="margin-top:.2rem;font-size:.72rem">📦 ${k.name}: ${k.items.map(it=>(it.note||itemName(it.itemId)||it.itemId)+(it.qty>1?' ×'+it.qty:'')).join(', ')}</div>`;
    })() : '';
    return `<div class="form-group equip-choice-row" style="margin-bottom:.5rem">
      <label>Выбор ${slotIdx+1}</label>
      <select onchange="setEquipSlotPick('${prefix}',${slotIdx},parseInt(this.value),null,null);autoSave()">
        <option value="">— выбрать —</option>${opts}
      </select>${kitHint}
    </div>`;
  }

  // Bundles with inner weapon/tool choices: show bundle selector first
  const bundleOpts = optionSets.map((bundle, i) => {
    const kitItem = bundle.find(it => it.id && (window.ITEMS_KITS||[]).some(k=>k.id===it.id));
    const kitTip = kitItem ? (() => {
      const k=(window.ITEMS_KITS||[]).find(k=>k.id===kitItem.id);
      return k?.items?.map(it=>(it.note||itemName(it.itemId)||it.itemId)+(it.qty>1?' ×'+it.qty:'')).join(', ')||'';
    })() : '';
    const plainLabel = bundle.map(it => {
      if (it.id) return (it.note || itemName(it.id)) + (it.qty>1?` ×${it.qty}`:'');
      if (it.type) return it.label || it.type;
      return it.unknown || '?';
    }).join(' + ');
    return `<option value="${i}" ${savedPick?.bundle == i ? 'selected' : ''} title="${kitTip}">${plainLabel}</option>`;
  }).join('');
  const pickedBundle = savedPick?.bundle != null ? optionSets[savedPick.bundle] : null;

  let innerHtml = '';
  if (pickedBundle) {
    pickedBundle.forEach((it, k) => {
      if (!it.type) return;
      const opts2 = _choiceOptions(it);
      const savedInner = savedPick?.inner?.[k] || '';
      const opts2Html = opts2.map(o =>
        `<option value="${o.value}" ${savedInner===o.value?'selected':''}>${o.label}</option>`
      ).join('');
      innerHtml += `<div class="form-group" style="margin-bottom:.4rem;max-width:360px">
        <label>${it.label}</label>
        <select onchange="setEquipSlotPick('${prefix}',${slotIdx},${savedPick.bundle},${k},this.value);autoSave()">
          <option value="">— выбрать —</option>${opts2Html}
        </select>
      </div>`;
    });
  }

  return `<div class="form-group equip-choice-row" style="margin-bottom:.5rem">
    <label>Выбор ${slotIdx+1}</label>
    <select onchange="setEquipSlotPick('${prefix}',${slotIdx},parseInt(this.value),null,null);autoSave()">
      <option value="">— выбрать —</option>${bundleOpts}
    </select>
  </div>${innerHtml}`;
}

// ── Save a pick ───────────────────────────────────────────────────────────
function setEquipSlotPick(prefix, slotIdx, bundleIdx, innerIdx, innerVal) {
  if (!wiz.equipPicks) wiz.equipPicks = {};
  const key = `${prefix}_${slotIdx}`;
  if (!wiz.equipPicks[key]) wiz.equipPicks[key] = { bundle: bundleIdx, inner: {} };
  wiz.equipPicks[key].bundle = bundleIdx;
  if (innerIdx !== null && innerVal !== null) {
    wiz.equipPicks[key].inner = wiz.equipPicks[key].inner || {};
    wiz.equipPicks[key].inner[innerIdx] = innerVal;
  } else {
    wiz.equipPicks[key].inner = {};
  }
  // Re-render to show inner choices
  document.getElementById('equip-details').innerHTML = renderEquipDetails();
}

function buildEquipmentSection() {
  const cls = wiz.cls;
  const c   = document.getElementById('equipment-choices');
  const startGoldTable = {barbarian:'2к4×10',bard:'5к4',cleric:'5к4',druid:'2к4×10',
    fighter:'5к4×10',monk:'5к4',paladin:'5к4×10',ranger:'5к4×10',rogue:'4к4×10',
    sorcerer:'3к4×10',warlock:'4к4×10',wizard:'4к4×10',artificer:'5к4×10'};
  const goldStr = startGoldTable[cls?.id]||'5к4';
  if (!wiz.equipmentChoice) wiz.equipmentChoice = 'kit';

  c.innerHTML = `
    <div class="section-title sm">Стартовое снаряжение</div>
    <div class="mode-row">
      <button class="mode-btn ${wiz.equipmentChoice==='gold'?'':'active'}" onclick="setEquipChoice('kit')">📦 Классовый набор</button>
      <button class="mode-btn ${wiz.equipmentChoice==='gold'?'active':''}" onclick="setEquipChoice('gold')">🪙 Начать с золота (${goldStr} зм)</button>
    </div>
    <div id="equip-details">${renderEquipDetails()}</div>`;
}

function setEquipChoice(mode) {
  wiz.equipmentChoice = mode;
  if (mode === 'gold') {
    const tables = {barbarian:[2,4,10],bard:[5,4,1],cleric:[5,4,1],druid:[2,4,10],
      fighter:[5,4,10],monk:[5,4,1],paladin:[5,4,10],ranger:[5,4,10],rogue:[4,4,10],
      sorcerer:[3,4,10],warlock:[4,4,10],wizard:[4,4,10]};
    const [n,d,mult] = tables[wiz.cls?.id] || [5,4,1];
    let gold = 0;
    for (let i=0;i<n;i++) gold += Math.ceil(Math.random()*d);
    gold *= mult;
    wiz.startGold = gold;
    wiz.currency.gp = gold;
    const el = document.getElementById('w-gold'); if(el) el.value = gold;
    toast(`🎲 Выпало ${gold} золотых монет!`, 'success');
  } else {
    wiz.startGold = 0; wiz.currency.gp = 0;
    const el = document.getElementById('w-gold'); if(el) el.value = 0;
  }
  document.querySelectorAll('.mode-btn[onclick*="setEquipChoice"]').forEach(b =>
    b.classList.toggle('active', b.getAttribute('onclick')?.includes(mode)));
  document.getElementById('equip-details').innerHTML = renderEquipDetails();
}

function renderEquipDetails() {
  if (wiz.equipmentChoice === 'gold') {
    return `<div class="form-group" style="max-width:220px;margin-top:.8rem">
      <label>Стартовое золото (зм)</label>
      <input type="number" id="w-start-gold" value="${wiz.startGold||0}" min="0"
        oninput="wiz.startGold=parseInt(this.value)||0;wiz.currency.gp=wiz.startGold;document.getElementById('w-gold').value=this.value;autoSave()">
    </div>`;
  }

  /**
   * Render a list of slots so that ALL fixed items appear in a single row
   * at the top, followed by choice slots in their original order.
   * isBg=true uses the background index offset for renderChoiceSlot.
   */
  function renderSlotsGrouped(slots, isBg) {
    let html = '';
    // 1. Collect all tokens from every fixed slot into one row
    const allFixedTokens = slots
      .filter(s => s.type === 'fixed')
      .flatMap(s => s.items.map(renderEquipToken).filter(Boolean));
    if (allFixedTokens.length) {
      html += `<div class="equip-fixed-row" style="margin-bottom:.4rem;flex-wrap:wrap">
        ${allFixedTokens.join(' ')}
      </div>`;
    }
    // 2. Choice slots in original order
    slots.forEach((slot, i) => {
      if (slot.type !== 'fixed') {
        html += renderChoiceSlot(i, slot.options, isBg);
      }
    });
    return html;
  }

  let html = '<div style="margin-top:.6rem">';

  // ── Class equipment ───────────────────────────────────────────────────
  const clsEq = getClassEq();
  if (clsEq?.slots?.length) {
    html += `<div class="equip-section-label" style="font-size:.75rem;color:#7bafd4;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.4rem">
      Снаряжение класса</div>`;
    html += renderSlotsGrouped(clsEq.slots, false);
  } else {
    html += '<p class="note-text" style="margin-top:.4rem">Нет данных о снаряжении класса.</p>';
  }

  // ── Background equipment ──────────────────────────────────────────────
  const bgEq = getBgEq();
  if (bgEq?.slots?.length) {
    html += `<div class="equip-section-label" style="font-size:.75rem;color:#f0c040;text-transform:uppercase;letter-spacing:.05em;margin:.8rem 0 .4rem">
      Снаряжение предыстории · ${bgEq.name}</div>`;
    html += renderSlotsGrouped(bgEq.slots, true);
    if (bgEq.gold) {
      html += `<div class="equip-fixed-row" style="margin-bottom:.3rem"><span class="equip-fixed-item">💰 ${bgEq.gold} зм</span></div>`;
    }
  }

  html += '</div>';
  return html;
}

// Legacy stub (no longer used but kept for safety)
function setEquipPick(idx, val) {
  if (!wiz.equipPicks) wiz.equipPicks = {};
  wiz.equipPicks[idx] = val;
}

// ── Collect all equipment into inventory items array ─────────────────────
// Returns array of rich inventory items with all properties from ITEMS_ALL
function collectEquipmentItems(useGold) {
  const items = [];
  if (useGold) return items;

  function pushItem(id, qty, noteOverride) {
    const src = window.findItemById?.(id);
    if (!src) {
      items.push({ id, name: noteOverride || id, qty: qty || 1, weight: 0, costGp: null, description: '' });
      return;
    }
    // Build rich item — include all relevant fields from the source
    const item = {
      id:          src.id,
      name:        noteOverride || src.name,
      qty:         qty || 1,
      weight:      src.weightLbs  ?? 0,
      costGp:      src.costGp     ?? null,
      itemClass:   src.itemClass  || null,
      description: src.description || '',
    };
    // Type-specific extras
    if (src.itemClass === 'weapon' || src.itemClass === 'firearm') {
      item.damageDice  = src.damageDice  || null;
      item.damageType  = src.damageType  || null;
      item.properties  = src.properties  || [];
      item.category    = src.category    || null;
      item.subcategory = src.subcategory || null;
    }
    if (src.itemClass === 'armor') {
      item.ac           = src.ac          ?? null;
      item.stealthDisadv= src.stealthDisadv ?? false;
      item.strReq       = src.strReq      ?? null;
      item.category     = src.category    || null;
    }
    if (src.itemClass === 'tool') {
      item.category    = src.category    || null;
      item.categoryId  = src.categoryId  || null;
    }
    if (src.itemClass === 'gear') {
      item.category    = src.category    || null;
      item.capacity    = src.capacity    || null;
    }
    if (src.itemClass === 'ammo') {
      item.stackSize   = src.stackSize   ?? 1;
      item.category    = src.category    || null;
    }
    items.push(item);
  }

  // Expand kit into its constituent items
  function pushKit(id, qty) {
    const kit = window.ITEMS_KITS?.find(k => k.id === id);
    if (!kit) { pushItem(id, qty); return; }
    (kit.items || []).forEach(entry => {
      pushItem(entry.itemId, (entry.qty || 1) * (qty || 1));
    });
  }

  // Push tool from proficiency picks (name → resolve via findItem)
  function _pushToolRef(ref, qty) {
    const name = _resolveToolRef(ref);
    if (!name) return;
    const found = window.findItem?.(name);
    if (found) {
      pushItem(found.id, qty);
    } else {
      items.push({ id: null, name, qty: qty || 1, weight: 0, costGp: null,
                   itemClass: 'tool', description: 'Инструмент' });
    }
  }

  // Resolve one item-or-kit: kits get expanded, regular items get pushed
  function pushResolved(id, qty, note) {
    if (window.ITEMS_KITS?.some(k => k.id === id)) pushKit(id, qty);
    else pushItem(id, qty, note);
  }

  // ── Class equipment ───────────────────────────────────────────────────
  const clsEq = getClassEq();
  if (clsEq?.slots) {
    clsEq.slots.forEach((slot, i) => {
      if (slot.type === 'fixed') {
        slot.items.forEach(it => {
          if (it.id)  pushResolved(it.id, it.qty, it.note || null);
          else if (it.ref) _pushToolRef(it.ref, it.qty);
        });
      } else {
        const pick = wiz.equipPicks?.[`cls_${i}`];
        if (pick != null && pick.bundle != null) {
          const bundle = slot.options[pick.bundle] || [];
          bundle.forEach((it, k) => {
            if (it.id) {
              pushResolved(it.id, it.qty);
            } else if (it.ref) {
              _pushToolRef(it.ref, it.qty);
            } else if (it.type) {
              const innerVal = pick.inner?.[k];
              if (innerVal) {
                pushResolved(innerVal, it.qty || 1);
                (it.extra || []).forEach(eid => pushResolved(eid, 1));
              }
            }
          });
        }
      }
    });
  }

  // ── Background equipment ──────────────────────────────────────────────
  const bgEq = getBgEq();
  if (bgEq?.slots) {
    bgEq.slots.forEach((slot, i) => {
      if (slot.type === 'fixed') {
        slot.items.forEach(it => {
          if (it.id)  pushResolved(it.id, it.qty, it.note || null);
          else if (it.ref) _pushToolRef(it.ref, it.qty);
        });
      } else {
        const pick = wiz.equipPicks?.[`bg_${i}`];
        if (pick != null && pick.bundle != null) {
          const bundle = slot.options[pick.bundle] || [];
          bundle.forEach((it, k) => {
            if (it.id) {
              pushResolved(it.id, it.qty);
            } else if (it.type || it.choice) {
              const ch = it.choice || it;
              const innerVal = pick.inner?.[k];
              if (innerVal) pushResolved(innerVal, ch.qty || 1);
            }
          });
        }
      }
    });
  }

  return items;
}

// Random equipment pick for _buildAndSave / wizardNextRandom
function randomEquipPicks() {
  if (!wiz.equipPicks) wiz.equipPicks = {};
  const clsEq = getClassEq();
  if (clsEq?.slots) {
    clsEq.slots.forEach((slot, i) => {
      if (slot.type === 'choice' && slot.options?.length) {
        const bundleIdx = Math.floor(Math.random() * slot.options.length);
        const bundle = slot.options[bundleIdx];
        const inner = {};
        bundle.forEach((it, k) => {
          if (it.type) {
            const opts = _choiceOptions(it);
            if (opts.length) inner[k] = opts[Math.floor(Math.random()*opts.length)].value;
          }
        });
        wiz.equipPicks[`cls_${i}`] = { bundle: bundleIdx, inner };
      }
    });
  }
  const bgEq = getBgEq();
  if (bgEq?.slots) {
    bgEq.slots.forEach((slot, i) => {
      if (slot.type === 'choice' && slot.options?.length) {
        const bundleIdx = Math.floor(Math.random() * slot.options.length);
        const bundle = slot.options[bundleIdx];
        const inner = {};
        bundle.forEach((it, k) => {
          const ch = it.choice || (it.type ? it : null);
          if (ch) {
            const opts = _choiceOptions(ch);
            if (opts.length) inner[k] = opts[Math.floor(Math.random() * opts.length)].value;
          }
        });
        wiz.equipPicks[`bg_${i}`] = { bundle: bundleIdx, inner };
      }
    });
  }
}

function buildWeaponsList() {
  const c=document.getElementById('weapons-list');
  c.innerHTML = wiz.weapons.length
    ? wiz.weapons.map((w,i)=>`
      <div class="inv-row" style="flex-wrap:wrap;gap:.4rem">
        <input type="text" placeholder="Название" value="${w.name||''}" oninput="wiz.weapons[${i}].name=this.value;autoSave()" style="flex:2;min-width:110px">
        <input type="text" placeholder="Урон" value="${w.damage||''}" oninput="wiz.weapons[${i}].damage=this.value;autoSave()" style="width:75px;flex:none">
        <input type="text" placeholder="Тип" value="${w.damageType||''}" oninput="wiz.weapons[${i}].damageType=this.value;autoSave()" style="width:90px;flex:none">
        <select onchange="wiz.weapons[${i}].ability=this.value;autoSave()" style="width:85px;flex:none">
          ${ABILITY_KEYS.map(k=>`<option value="${ABILITY_EN[k]||k}" ${wiz.weapons[i].ability===ABILITY_EN[k]?'selected':''}>${k}</option>`).join('')}
        </select>
        <label style="font-family:inherit;text-transform:none;font-size:.85rem;white-space:nowrap">
          <input type="checkbox" ${w.isProf?'checked':''} onchange="wiz.weapons[${i}].isProf=this.checked;autoSave()"> Вл.
        </label>
        <span class="inv-del" onclick="wiz.weapons.splice(${i},1);buildWeaponsList()">✕</span>
      </div>`).join('')
    : '<p class="note-text">Оружие не добавлено.</p>';
}

function addWeapon() {
  wiz.weapons.push({name:'',damage:'1к6',damageType:'рубящий',attackBonus:0,isProf:true,ability:'str'});
  buildWeaponsList();
}

function buildInventoryList() {
  const c=document.getElementById('wizard-inv-list');
  c.innerHTML = wiz.inventory.length
    ? wiz.inventory.map((item,i)=>`
      <div class="inv-row">
        <input type="text" placeholder="Предмет" value="${item.name||''}" oninput="wiz.inventory[${i}].name=this.value;autoSave()">
        <input type="number" class="inv-qty" value="${item.qty||1}" min="0" oninput="wiz.inventory[${i}].qty=parseInt(this.value)||1;autoSave()">
        <input type="text" placeholder="Описание" value="${item.description||''}" oninput="wiz.inventory[${i}].description=this.value;autoSave()" style="flex:1.5">
        <span class="inv-del" onclick="wiz.inventory.splice(${i},1);buildInventoryList()">✕</span>
      </div>`).join('')
    : '<p class="note-text">Инвентарь пуст.</p>';
}

function addWizardItem() {
  wiz.inventory.push({name:'',qty:1,description:''});
  buildInventoryList();
}

// ── СОЗДАТЬ ПЕРСОНАЖА ──
function createCharacter() {
  collectStep0();
  collectAbilities();
  const spellsManual = document.getElementById('w-spells-manual')?.value.split('\n').filter(s=>s.trim())||[];
  wiz.spells = [...new Set([...wiz.selectedCantrips,...wiz.selectedSpells,...spellsManual])];
  wiz.notes  = document.getElementById('w-notes')?.value||'';
  wiz.currency.gp = parseInt(document.getElementById('w-gold')?.value)||wiz.currency.gp;
  wiz.currency.sp = parseInt(document.getElementById('w-silver')?.value)||0;
  wiz.currency.cp = parseInt(document.getElementById('w-copper')?.value)||0;

  const level  = wiz.level||1;
  const pb     = profBonus(level);
  const totAbi = {};
  ABILITY_KEYS.forEach(k=>{ totAbi[k]=(wiz.abilities[k]||8)+((wiz.racialBonuses||{})[k]||0); });
  const conMod = getMod(totAbi['ТЕЛ']||10);
  const hd     = wiz.cls?.hitDie||8;
  const hpMax  = Math.max(1, hd + conMod + (level-1)*(Math.floor(hd/2)+1+conMod));

  // Собрать инвентарь: классовое снаряжение + снаряжение предыстории
  const inventoryItems = [...(wiz.inventory||[])];
  const bg = wiz.background;

  if (wiz.equipmentChoice === 'kit') {
    collectEquipmentItems(false).forEach(it => inventoryItems.push(it));
  }

  // Золото предыстории
  const bgGold = getBgEq()?.gold || bg?.gold || 0;
  const finalGold = (wiz.currency.gp||0) + bgGold;

  // Заклинания
  const manualSpellsRaw = document.getElementById('w-spells-manual')?.value||'';
  const manualSpells = manualSpellsRaw.split('\n').map(s=>s.trim()).filter(Boolean);
  const allSelectedSpells = [...wiz.selectedCantrips, ...wiz.selectedSpells, ...manualSpells];

  const char = {
    name:wiz.name, _system:'DnD5e', _version:'2.1', _created:new Date().toISOString(),
    race:wiz.race?.id||'human',         raceName:wiz.race?.name||'Человек',
    subrace:wiz.subrace?.id||'',        subraceName:wiz.subrace?.name||'',
    class:wiz.cls?.id||'fighter',       className:wiz.cls?.name||'Воин',
    subclass:wiz.subclass||'',          fightingStyle:wiz.fightingStyle||'',
    background:wiz.background?.id||'', backgroundName:wiz.background?.name||'',
    level, xp:wiz.xp||0, alignment:wiz.alignment,
    size:document.getElementById('w-size')?.value||wiz.race?.size||'Средний',
    age:wiz.age, height:wiz.height, weight:wiz.weight,
    eyes:wiz.eyes, skin:wiz.skin, hair:wiz.hair, appearance:wiz.appearance,
    backstory:wiz.backstory, traits:wiz.traits, ideals:wiz.ideals, bonds:wiz.bonds, flaws:wiz.flaws, allies:wiz.allies||'',
    abilities:totAbi, abilityBases:{...wiz.abilities}, racialBonuses:{...wiz.racialBonuses},
    proficiencyBonus:pb,
    hpMax:Math.max(1,hpMax), hpCurrent:Math.max(1,hpMax), hpTemp:0, hitDie:hd,
    ac:10,
    speed: (()=>{
      const base = wiz.race?.speed||30;
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      let spd = wiz.subrace?.speed !== undefined ? wiz.subrace.speed : base + (wiz.subrace?.speedBonus||0);
      return spd + (subP.speedUp||0);
    })(),
    flySpeed: wiz.subrace?.flySpeed ?? wiz.race?.flySpeed ?? 0,
    swimSpeed: wiz.subrace?.swimSpeed ?? wiz.race?.swimSpeed ?? 0,
    climbSpeed: wiz.subrace?.climbSpeed ?? wiz.race?.climbSpeed ?? 0,
    darkvision: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      return Math.max(wiz.subrace?.darkvision??0, wiz.race?.darkvision??0, subP.darkvision??0);
    })(),
    initiative:0,
    savingThrows:wiz.cls?.savingThrows||[],
    armorProf: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      const _flatArmor = (v) => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter(Boolean);
        return String(v).split(/[,;]/).map(s=>s.trim()).filter(Boolean);
      };
      const raw = [
        ..._flatArmor(wiz.cls?.armorProf),
        ..._flatArmor(wiz.race?.armorProf),
        ..._flatArmor(wiz.subrace?.armorProf),
        ..._flatArmor(subP.armorProf),
      ];
      return [...new Set(raw)].join(', ') || '';
    })(),
    armorRestriction: wiz.cls?.armorRestriction || '',
    weaponProf: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      return _mergeWeaponProfs(wiz.cls?.weaponProf, wiz.race?.weaponProf, wiz.subrace?.weaponProf, subP.weaponProf);
    })(),
    toolProf: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      // НЕ применяем dupReplacements к toolProf — это «первичный» источник,
      // замена применяется только к дублирующему источнику в otherProf.
      return [wiz.cls?.toolProf, wiz.race?.toolProf, wiz.subrace?.toolProf, subP.toolProf]
        .map(_cleanProf).filter(Boolean).join('; ');
    })(),
    otherProf: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      // Инструменты от предыстории (фиксированные)
      const _bgTools = Array.isArray(wiz.background?.tools) ? wiz.background.tools : [];
      // Инструменты от предыстории (выбор) — пустой слот → плейсхолдер
      const _bgTC    = wiz.background?.toolChoice;
      const _bgTCCnt = _bgTC ? (_bgTC.count||1) : 0;
      const _bgToolVals = Array.from({length:_bgTCCnt}, (_,i) => {
        const v = (wiz.bgToolChoices||{})[i];
        if (v) return v;
        if (_bgTC?.category) return `Инструменты (${_bgTC.category}) на выбор`;
        return 'Ремесленный инструмент на выбор';
      });
      // Классовые выборы инструментов — пустой слот → плейсхолдер
      const _clsTC    = wiz.cls?.toolChoice;
      const _clsTCCnt = _clsTC ? (_clsTC.count||1) : 0;
      const _clsToolVals = Array.from({length:_clsTCCnt}, (_,i) => {
        const v = (wiz.clsToolChoices||{})[i];
        return v || 'Инструмент на выбор (классовый)';
      });
      // Инструменты от расы (выбор) — пустой слот → плейсхолдер
      const _raceTC    = wiz.race?.toolChoice;
      const _raceTCCnt = _raceTC ? (_raceTC.count||1) : 0;
      const _raceToolVals = Array.from({length:_raceTCCnt}, (_,i) => {
        const v = (wiz.raceToolChoices||{})[i];
        return v || 'Инструмент на выбор (расовый)';
      });
      // Навык или инструмент по выбору — пустой слот → плейсхолдер
      const _soTC    = wiz.race?.skillOrToolChoice || wiz.subrace?.skillOrToolChoice;
      const _soTCCnt = _soTC ? (_soTC.count||1) : 0;
      const _soToolVals = Array.from({length:_soTCCnt}, (_,i) => {
        const v = (wiz.skillOrToolChoices||{})[i];
        return v || 'Навык или инструмент на выбор';
      });
      // Схлопываем незаполненные слоты инструментов в "N инструментов на выбор"
      const _collapseTools = (vals, label) => {
        const chosen = vals.filter(v => v && !v.includes('на выбор'));
        const empty  = vals.filter(v => !v || v.includes('на выбор')).length;
        const result = [...chosen];
        if (empty === 1) result.push(`Инструмент на выбор (${label})`);
        else if (empty === 2) result.push(`2 инструмента на выбор (${label})`);
        else if (empty === 3 || empty === 4) result.push(`${empty} инструмента на выбор (${label})`);
        else if (empty > 4) result.push(`${empty} инструментов на выбор (${label})`);
        return result;
      };

      const _subclsToolVals = Array.from(
        {length: Object.keys(wiz.subclassToolChoices||{}).length || 0},
        (_, i) => (wiz.subclassToolChoices||{})[i] || ''
      );
      // Count expected subclass tool slots from subP
      const _subclsTCCnt = subP.toolChoice ? (subP.toolChoice.count||1) : 0;
      const _subclsToolFull = Array.from({length: _subclsTCCnt}, (_, i) =>
        (wiz.subclassToolChoices||{})[i] || ''
      );

      const items = [
        ..._bgTools,
        ..._collapseTools(_bgToolVals, 'предыстория'),
        ..._collapseTools(_clsToolVals, 'класс'),
        ..._collapseTools(_raceToolVals, 'раса'),
        ..._collapseTools(_soToolVals, 'на выбор'),
        ..._collapseTools(_subclsToolFull, 'подкласс'),
        // skillOrToolChoice от подкласса — только инструменты (не навыки)
        ...Object.values(wiz.subclassSkillOrToolChoices||{}).filter(v =>
          v && !SKILLS_DATA.find(s=>s.name===v)
        ),
      ].filter(Boolean);
      return _applyDupReplacementsToList(items, wiz.dupReplacements||{}).join(', ');
    })(),
    hasFeat:wiz.hasFeat, racialSkillChoice:wiz.racialSkillChoice,
    skillProficiencies: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      const all = new Set([...wiz.skillProfs, ...(subP.skills||[])]);
      // Добавляем навыки из выборов подкласса
      (wiz.subclassSkillChoices||[]).forEach(s => all.add(s));
      Object.values(wiz.subclassSkillOrToolChoices||{}).forEach(v => {
        if (v && SKILLS_DATA.find(s=>s.name===v)) all.add(v);
      });
      return _applyDupReplacementsToList([...all], wiz.dupReplacements||{});
    })(),
    skillExpertise:{},
    languages:(()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      // Фиксированные расовые языки (без «выбор»)
      const _raceLangs = [
        ...(wiz.race?.languages||[]),
        ...(wiz.subrace?.languages||[])
      ].filter(l=>!l.includes('выбор'));
      // bgLangChoices: выбор из конкретного списка предыстории
      const _bgLangChoice = wiz.background?.languagesChoice || null;
      const _bgLangCnt = _bgLangChoice ? (_bgLangChoice.count||0) : 0;
      const _bgLangVals = Array.from({length:_bgLangCnt}, (_,i) => {
        const v = (wiz.bgLangChoices||{})[i];
        if (v) return v;
        const pool = _bgLangChoice?.from||[];
        return pool.length ? `Язык на выбор (из: ${pool.join(', ')})` : 'Язык на выбор';
      });
      // langChoices: свободный выбор языков
      const _allRaceLangStrs = [...(wiz.race?.languages||[]), ...(wiz.subrace?.languages||[])];
      const _raceLangFree = _allRaceLangStrs.filter(l=>l.includes('выбор')).length;
      const _bgLangFree   = typeof wiz.background?.languages === 'number' ? wiz.background.languages : 0;
      const _totalFree    = _raceLangFree + _bgLangFree;
      const _freeVals = Array.from({length:_totalFree}, (_,i) => {
        const v = (wiz.langChoices||[])[i];
        return v || 'Язык на выбор';
      });
      // Языки от подкласса (свободные) — пустой → плейсхолдер
      const _subclassLangFree = subP.languagesFree||0;
      const _subclassFreeVals = Array.from({length:_subclassLangFree}, (_,i) => {
        const v = (wiz.subclassLangChoices||{})[i];
        return v || 'Язык на выбор (подкласс)';
      });
      // Языки из списка подкласса — пустой → плейсхолдер
      const _subclassListTC = subP.languagesChoice;
      const _subclassListCnt = _subclassListTC ? (_subclassListTC.count||0) : 0;
      const _subclassListVals = Array.from({length:_subclassListCnt}, (_,i) => {
        const v = (wiz.subclassLangListChoices||{})[i];
        if (v) return v;
        const pool = _subclassListTC?.from||[];
        return pool.length ? `Язык на выбор (из: ${pool.join(', ')})` : 'Язык на выбор (подкласс)';
      });
      // Собираем финальный список
      const _rawLangs = [
        ..._raceLangs,
        ...(subP.languagesConst||[]),
        ..._bgLangVals,
        ..._freeVals,
        ..._subclassFreeVals,
        ..._subclassListVals,
      ];
      // Схлопываем множественные «Язык на выбор» в одну строку «N языков на выбор»
      const _realLangs = _rawLangs.filter(l => l && !l.startsWith('Язык на выбор'));
      const _freeCnt   = _rawLangs.filter(l => l && l.startsWith('Язык на выбор')).length;
      const _freeLabel = _freeCnt === 1 ? 'Язык на выбор'
                       : _freeCnt === 2 ? '2 языка на выбор'
                       : _freeCnt === 3 ? '3 языка на выбор'
                       : _freeCnt > 3   ? `${_freeCnt} языка на выбор` : null;
      const _allLangs = [..._realLangs, ...(_freeLabel ? [_freeLabel] : [])];
      return _allLangs.filter((v,i,a) => a.indexOf(v) === i); // дедупликация фиксированных
    })(),
    spellAbility:wiz.cls?.spellcasting?.ability||null,
    spells: allSelectedSpells,
    usedSpellSlots:{},
    weapons:wiz.weapons, inventory: inventoryItems, currency:{...wiz.currency, gp: finalGold},
    racialTraits:wiz.race?.traits||'', classFeatures:wiz.cls?.features||'',
    subclassFeatures:(()=>{
      const sub=(wiz.cls?.subclasses||[]).find(s=>(s.name||s)===wiz.subclass);
      return (typeof sub==='object'&&sub.features)||'';
    })(),
    backgroundFeature:wiz.background?.feature||'',
    climbSpeed:wiz.race?.climbSpeed||(()=>{const r=wiz.race;const s=wiz.subrace;return r?.climbSpeed||s?.climbSpeed||0;})(),
    swimSpeed:(()=>{const r=wiz.race;const s=wiz.subrace;const subP=_getSubclassProfs(wiz.cls,wiz.subclass,wiz.level||1);return r?.swimSpeed||s?.swimSpeed||0;})(),
    flySpeed:(()=>{const r=wiz.race;const s=wiz.subrace;return r?.flySpeed||s?.flySpeed||0;})(),
    darkvision:(()=>{
      const subP=_getSubclassProfs(wiz.cls,wiz.subclass,wiz.level||1);
      const raceDv=wiz.race?.darkvision||wiz.subrace?.darkvision||0;
      const subclsDv=subP.darkvision||0;
      return Math.max(raceDv,subclsDv);
    })(),
    inspiration:false, conditions:[], deathSaves:{successes:[false,false,false],failures:[false,false,false]},
    notes:wiz.notes, resources:[],
    halfProficiency: false,
    remarkableAthlete: false,
    portrait: wiz.portrait || null,
  };
  saveCharacter(char);
}

// ══════════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════════
async function saveCharacter(char) {
  const res  = await fetch('/api/characters',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(char)});
  const data = await res.json();
  currentFilename = data.filename;
  currentChar = char;

  // Upload wizard portrait now that we have a filename
  if (wiz.portrait && wiz.portrait.startsWith('data:image')) {
    const stem = data.filename.replace(/\.json$/i, '');
    try {
      const pr = await fetch(`/api/portrait/${stem}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: wiz.portrait})
      });
      const pres = await pr.json();
      if (pres.url) currentChar.portrait = pres.url + '?t=' + Date.now();
    } catch(e) {
      currentChar.portrait = wiz.portrait; // fallback
    }
    wiz.portrait = null;
  }

  document.getElementById('nav-sheet').style.display='inline-block';
  toast('✅ Персонаж создан!','success');
  renderSheet(char);
  showView('sheet');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Auto-save: debounced 600ms, completely silent ─────────────────────────
let _saveTimer = null;


// ══════════════════════════════════════════════════════════════════════
// RICH TEXT EDITOR ENGINE
// Конвертирует textarea.rte-source в div[contenteditable] с тулбаром
// ══════════════════════════════════════════════════════════════════════

let _rteActive = null;       // активный rte-body div
let _rteLinkRange = null;    // сохранённый range для вставки ссылки

// ── Инициализация: конвертирует textarea.rte-source → div[contenteditable] ──
function initRteFields() {
  document.querySelectorAll('textarea.rte-source:not([data-rte-init])').forEach(ta => {
    ta.dataset.rteInit = '1';
    ta.style.display = 'none';

    const div = document.createElement('div');
    div.className = 'rte-body' + (ta.dataset.rteClass ? ' ' + ta.dataset.rteClass : '');
    div.contentEditable = 'true';
    div.dataset.placeholder = ta.placeholder || '';
    div.dataset.rteTaid = ta.id || '';
    // Копируем min-height из стиля textarea
    const cs = window.getComputedStyle(ta);
    div.style.minHeight = ta.style.minHeight || cs.minHeight || '100px';
    if (ta.style.fontSize) div.style.fontSize = ta.style.fontSize;
    // Значение
    div.innerHTML = ta.value || '';

    // Вставляем сразу после textarea (ta уже скрыта)
    ta.parentNode.insertBefore(div, ta.nextSibling);

    // Синхронизируем изменения → textarea → существующие oninput/onchange
    div.addEventListener('input', () => {
      ta.value = div.innerHTML;
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
    });

    div.addEventListener('mouseup',  _rteCheckSel);
    div.addEventListener('keyup',    _rteCheckSel);
    div.addEventListener('focus',    () => { _rteActive = div; });
    // Клик по ссылке — открываем в новой вкладке
    div.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a && a.href) { e.preventDefault(); window.open(a.href, '_blank', 'noopener'); }
    });
    div.addEventListener('keydown',  (e) => {
      // Ctrl+B/I/U — браузер обрабатывает сам, мы только синхронизируем
      if ((e.ctrlKey || e.metaKey) && ['b','i','u'].includes(e.key.toLowerCase())) {
        setTimeout(() => { _syncRte(div); _rteUpdateBtns(); }, 10);
      }
      // Enter внутри checklist li → новый li с чекбоксом
      if (e.key === 'Enter' && !e.shiftKey) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          let node = sel.getRangeAt(0).startContainer;
          while (node && node !== div) {
            if (node.nodeName === 'LI' && node.closest('ul.rte-checklist')) {
              e.preventDefault();
              const newLi = document.createElement('li');
              newLi.innerHTML = '<input type="checkbox"> ';
              node.parentNode.insertBefore(newLi, node.nextSibling);
              // Ставим курсор в новый li после чекбокса
              const textNode = newLi.lastChild.nodeType === Node.TEXT_NODE
                ? newLi.lastChild
                : newLi.appendChild(document.createTextNode(''));
              const r = document.createRange();
              r.setStart(textNode, textNode.length);
              r.collapse(true);
              sel.removeAllRanges();
              sel.addRange(r);
              setTimeout(() => _syncRte(div), 10);
              break;
            }
            node = node.parentNode;
          }
        }
      }
    });
  });
}

function _rteCheckSel(e) {
  _rteActive = e.currentTarget;
  setTimeout(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) { _rteHide(); return; }
    const rng = sel.getRangeAt(0);
    if (!_rteActive.contains(rng.commonAncestorContainer)) { _rteHide(); return; }
    _rteShow();
    _rteUpdateBtns();
  }, 10);
}

function _rteShow() {
  const tb = document.getElementById('rte-toolbar');
  if (!tb) return;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  tb.style.display = 'flex';
  // Позиция: над выделением, или под если нет места
  let top  = rect.top + window.scrollY - tb.offsetHeight - 10;
  let left = rect.left + window.scrollX;
  if (top < window.scrollY + 4) top = rect.bottom + window.scrollY + 8;
  left = Math.max(4, Math.min(left, window.innerWidth - 400));
  tb.style.top  = top  + 'px';
  tb.style.left = left + 'px';
}

function _rteHide() {
  const tb = document.getElementById('rte-toolbar');
  if (tb) tb.style.display = 'none';
}

function _rteUpdateBtns() {
  ['bold','italic','underline','strikeThrough'].forEach(cmd => {
    const btn = document.getElementById('rtb-' + cmd);
    if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
  });
}

function _syncRte(div) {
  const taId = div.dataset.rteTaid;
  if (!taId) return;
  const ta = document.getElementById(taId);
  if (ta) {
    ta.value = div.innerHTML;
    ta.dispatchEvent(new Event('input', {bubbles:true}));
    ta.dispatchEvent(new Event('change', {bubbles:true}));
  }
}

// ── Команда форматирования (вызывается из тулбара через onmousedown) ──
function rteCmd(cmd, val) {
  if (!_rteActive) return;
  _rteActive.focus();
  document.execCommand(cmd, false, val || null);
  _syncRte(_rteActive);
  _rteUpdateBtns();
}

// ── Чекбокс-список ──
function rteInsertChecklist() {
  if (!_rteActive) return;
  _rteActive.focus();
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);

  // Клонируем фрагмент и извлекаем строки
  const frag = range.cloneContents();
  const tmp = document.createElement('div');
  tmp.appendChild(frag);
  const raw = tmp.innerHTML
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n').replace(/<\/div>/gi, '\n').replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  const lines = raw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  const items = lines.length ? lines : ['Пункт'];

  // Удаляем выделенное
  range.deleteContents();

  // Строим ul
  const ul = document.createElement('ul');
  ul.className = 'rte-checklist';
  items.forEach(t => {
    const li = document.createElement('li');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    li.appendChild(cb);
    li.appendChild(document.createTextNode(' ' + t));
    ul.appendChild(li);
  });

  range.insertNode(ul);

  // Курсор после списка
  const r = document.createRange();
  r.setStartAfter(ul);
  r.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r);

  _syncRte(_rteActive);
  _rteHide();
}

// ── Ссылка ──
function rteInsertLink() {
  if (!_rteActive) return;
  const sel = window.getSelection();
  if (sel && sel.rangeCount) _rteLinkRange = sel.getRangeAt(0).cloneRange();
  // Текущая ссылка?
  let existing = '';
  let node = sel?.getRangeAt(0)?.startContainer;
  while (node) { if (node.tagName === 'A') { existing = node.href; break; } node = node.parentNode; }
  document.getElementById('rte-link-url').value = existing || 'https://';
  const tb  = document.getElementById('rte-toolbar');
  const pop = document.getElementById('rte-link-popup');
  pop.style.display = 'flex';
  const tbTop  = parseInt(tb.style.top  || 0);
  const tbLeft = parseInt(tb.style.left || 0);
  pop.style.top  = (tbTop  + tb.offsetHeight + 6) + 'px';
  pop.style.left = tbLeft + 'px';
  setTimeout(() => document.getElementById('rte-link-url').focus(), 50);
}

function rteLinkApply() {
  const url = document.getElementById('rte-link-url').value.trim();
  document.getElementById('rte-link-popup').style.display = 'none';
  _rteHide();
  if (!_rteLinkRange || !_rteActive) return;
  _rteActive.focus();
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(_rteLinkRange);
  if (url && url !== 'https://') {
    document.execCommand('createLink', false, url);
    _rteActive.querySelectorAll('a').forEach(a => {
      a.target = '_blank';
      a.rel    = 'noopener';
      if (!a.dataset.rteLinked) {
        a.dataset.rteLinked = '1';
        a.style.cursor = 'pointer';
        a.addEventListener('click', _rteLinkClick);
      }
    });
  } else {
    document.execCommand('unlink', false, null);
  }
  _syncRte(_rteActive);
}

function rteLinkCancel() {
  document.getElementById('rte-link-popup').style.display = 'none';
}

// ── Публичные: set/get value по id textarea ──
function rteSetValue(taId, html) {
  const ta  = document.getElementById(taId);
  const div = document.querySelector(`.rte-body[data-rte-taid="${taId}"]`);
  if (ta)  ta.value      = html;
  if (div) div.innerHTML = html;
}

function rteGetValue(taId) {
  const div = document.querySelector(`.rte-body[data-rte-taid="${taId}"]`);
  return div ? div.innerHTML : (document.getElementById(taId)?.value || '');
}

// ── Скрывать тулбар при клике вне ──
document.addEventListener('mousedown', e => {
  const tb  = document.getElementById('rte-toolbar');
  const pop = document.getElementById('rte-link-popup');
  if (!tb || !pop) return;
  if (!tb.contains(e.target) && !pop.contains(e.target) && !e.target.closest('.rte-body')) {
    _rteHide();
    pop.style.display = 'none';
  }
});

// ── Защита overlay от закрытия при drag (mousedown внутри → mouseup снаружи) ──
// Вместо onclick="if(event.target===this)close()" все overlay используют data-dlg-close
// и этот механизм: закрытие только если и mousedown, и mouseup были на самом overlay.
let _dlgMouseDownOnOverlay = false;
document.addEventListener('mousedown', e => {
  // Если нажали на overlay (сам фон, не на дочерний элемент) — помечаем
  _dlgMouseDownOnOverlay = e.target.hasAttribute('data-dlg-close') && e.target === e.currentTarget || false;
  // Более точно: цель — сам overlay (не его потомок)
  const overlay = e.target.closest('[data-dlg-close]');
  _dlgMouseDownOnOverlay = overlay !== null && e.target === overlay;
}, true);
document.addEventListener('mouseup', e => {
  if (!_dlgMouseDownOnOverlay) return;
  _dlgMouseDownOnOverlay = false;
  const overlay = e.target.closest('[data-dlg-close]');
  if (!overlay) return;
  // mouseup тоже на overlay — это чистый клик мимо диалога
  const fn = overlay.getAttribute('data-dlg-close');
  if (fn && typeof window[fn] === 'function') window[fn]();
  else if (fn === '_hide') overlay.classList.add('hidden');
  else if (fn === '_hide_open') { overlay.classList.remove('open'); overlay.style.display = 'none'; }
}, true);

// ── Первичная инициализация ──
document.addEventListener('DOMContentLoaded', () => setTimeout(initRteFields, 200));

function autoSave() {
  if (!currentChar || !currentFilename) return;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => saveSheet(), 600);
}


// ══════════════════════════════════════════════════════════════
// NOTE BLOCKS
// ══════════════════════════════════════════════════════════════

function _defaultNoteBlocks() {
  return [
    { id: 'nb_1', title: 'Цели',    text: '', collapsed: false },
    { id: 'nb_2', title: 'Заметки', text: '', collapsed: false },
  ];
}

function _noteId() {
  return 'nb_' + Date.now() + '_' + Math.floor(Math.random()*1000);
}

function renderNoteBlocks() {
  const char = currentChar;
  if (!char) return;
  if (!char.noteBlocks || !char.noteBlocks.length) {
    char.noteBlocks = _defaultNoteBlocks();
  }
  const container = document.getElementById('note-blocks-container');
  if (!container) return;

  container.innerHTML = char.noteBlocks.map((nb, i) => {
    const isFirst = i === 0;
    const isLast  = i === char.noteBlocks.length - 1;
    const upAttr  = isFirst ? 'disabled style="opacity:.25"' : '';
    const dnAttr  = isLast  ? 'disabled style="opacity:.25"' : '';
    return `<div class="pers-open-field${nb.collapsed ? ' collapsed' : ''}" data-nb-id="${nb.id}" style="margin-bottom:.6rem">
      <div class="pers-open-field-head">
        <input class="pers-open-label" value="${_esc(nb.title)}"
          style="background:transparent;border:none;outline:none;font-family:inherit;cursor:text;flex:1;min-width:0;color:var(--text3);font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:0"
          onclick="event.stopPropagation()"
          oninput="_noteBlockSaveTitle('${nb.id}',this.value)"
          placeholder="ЗАГОЛОВОК">
        <div style="display:flex;align-items:center;gap:.1rem;flex-shrink:0">
          <button class="pers-open-toggle" title="Вверх" ${upAttr}
            onclick="event.stopPropagation();_noteBlockMove('${nb.id}',-1)">↑</button>
          <button class="pers-open-toggle" title="Вниз" ${dnAttr}
            onclick="event.stopPropagation();_noteBlockMove('${nb.id}',+1)">↓</button>
          <button class="pers-open-toggle" title="Удалить"
            style="color:var(--text3)"
            onmouseover="this.style.color='#e05555'" onmouseout="this.style.color='var(--text3)'"
            onclick="event.stopPropagation();_noteBlockDel('${nb.id}')">✕</button>
          <button class="pers-open-toggle" title="${nb.collapsed ? 'Развернуть' : 'Свернуть'}"
            onclick="event.stopPropagation();_noteBlockToggle('${nb.id}',null,true)">∧</button>
        </div>
      </div>
      <div class="pers-open-body">
        <textarea class="pers-textarea rte-source"
          id="nb-text-${nb.id}"
          data-rte-class="rte-plain"
          rows="4"
          placeholder="Заметки..."
          oninput="_noteBlockSaveText('${nb.id}',this.value)">${nb.text||''}</textarea>
      </div>
    </div>`;
  }).join('');
  // Дать DOM обновиться, затем инициализировать RTE
  setTimeout(initRteFields, 0);
}

function _esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addNoteBlock() {
  if (!currentChar) return;
  if (!currentChar.noteBlocks) currentChar.noteBlocks = _defaultNoteBlocks();
  currentChar.noteBlocks.push({ id: _noteId(), title: 'Заметка', text: '', collapsed: false });
  renderNoteBlocks();
  setTimeout(initRteFields, 50); // статичные rte-source (attacks-notes, abilities-text)
  autoSave();
}

function _noteBlockToggle(id, e, fromBtn) {
  if (!fromBtn && e && e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON')) return;
  const nb = currentChar?.noteBlocks?.find(b => b.id === id);
  if (!nb) return;
  nb.collapsed = !nb.collapsed;
  renderNoteBlocks();
  autoSave();
}

function _noteBlockMove(id, dir) {
  const arr = currentChar?.noteBlocks;
  if (!arr) return;
  const idx = arr.findIndex(b => b.id === id);
  if (idx < 0) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= arr.length) return;

  const container = document.getElementById('note-blocks-container');
  if (!container) { arr.splice(newIdx, 0, arr.splice(idx, 1)[0]); renderNoteBlocks(); autoSave(); return; }

  // Собираем все блоки и их позиции ДО перемещения (FLIP: First)
  const nodes = [...container.querySelectorAll('[data-nb-id]')];
  const before = new Map(nodes.map(n => [n, n.getBoundingClientRect().top]));

  // Двигаем в данных
  arr.splice(newIdx, 0, arr.splice(idx, 1)[0]);

  // Двигаем DOM без ре-рендера
  const elA = container.querySelector(`[data-nb-id="${arr[newIdx].id}"]`);
  const elB = container.querySelector(`[data-nb-id="${arr[idx].id}"]`);
  if (!elA || !elB) { renderNoteBlocks(); autoSave(); return; }

  if (dir < 0) {
    container.insertBefore(elA, elB);
  } else {
    container.insertBefore(elB, elA);
  }

  // Обновляем disabled на кнопках ↑↓
  _updateNoteBlockButtons();

  // FLIP: Last → Invert → Play
  nodes.forEach(n => {
    const dy = before.get(n) - n.getBoundingClientRect().top;
    if (Math.abs(dy) < 1) return;
    n.style.transition = 'none';
    n.style.transform = `translateY(${dy}px)`;
    void n.offsetWidth; // reflow
    n.style.transition = 'transform .28s cubic-bezier(.4,0,.2,1)';
    n.style.transform = '';
    n.addEventListener('transitionend', () => { n.style.transition = ''; n.style.transform = ''; }, { once: true });
  });

  autoSave();
}

function _updateNoteBlockButtons() {
  const container = document.getElementById('note-blocks-container');
  if (!container) return;
  const nodes = [...container.querySelectorAll('[data-nb-id]')];
  nodes.forEach((n, i) => {
    const upBtn = n.querySelector('button[title="Вверх"]');
    const dnBtn = n.querySelector('button[title="Вниз"]');
    if (upBtn) upBtn.disabled = i === 0;
    if (dnBtn) dnBtn.disabled = i === nodes.length - 1;
    if (upBtn) upBtn.style.opacity = i === 0 ? '.25' : '';
    if (dnBtn) dnBtn.style.opacity = i === nodes.length - 1 ? '.25' : '';
  });
}

function _noteBlockDel(id) {
  if (!currentChar?.noteBlocks) return;
  const nb = currentChar.noteBlocks.find(b => b.id === id);
  const title = nb?.title || 'заметку';
  _confirmDel('Удалить заметку?', `Удалить «${title}»? Это действие нельзя отменить.`, () => {
    currentChar.noteBlocks = currentChar.noteBlocks.filter(b => b.id !== id);
    renderNoteBlocks();
    autoSave();
  });
}

function _noteBlockSaveTitle(id, val) {
  const nb = currentChar?.noteBlocks?.find(b => b.id === id);
  if (nb) { nb.title = val; autoSave(); }
}

function _noteBlockSaveText(id, val) {
  const nb = currentChar?.noteBlocks?.find(b => b.id === id);
  if (nb) { nb.text = val; autoSave(); }
}

async function saveSheet() {
  if (!currentChar||!currentFilename) return;
  // noteBlocks saved inline via _noteBlockSaveTitle/_noteBlockSaveText; legacy notes preserved
  // currentChar.notes is no longer the primary field
  currentChar.skillProficiencies = Object.keys(sheetSkillExp).filter(k=>sheetSkillExp[k]>0);
  currentChar.skillExpertise   = {...sheetSkillExp};
  currentChar.usedSpellSlots   = sheetUsedSlots;
  currentChar.hpCurrent        = parseInt(document.getElementById('s-hp-cur')?.value)||0;
  currentChar.hpMax            = Math.min(10000, parseInt(document.getElementById('s-hp-max')?.value)||10);
  currentChar.hpTemp           = parseInt(document.getElementById('s-hp-tmp')?.value)||0;
  // Level & XP also live in topbar now
  const _lvlEl = document.getElementById('s-level-input');
  const _xpEl  = document.getElementById('s-xp-input');
  if (_lvlEl && _lvlEl.value) currentChar.level = parseInt(_lvlEl.value)||currentChar.level||1;
  if (_xpEl  && _xpEl.value !== undefined) currentChar.xp = parseInt(_xpEl.value)||0;
  // Истощение из select
  const _exhEl = document.getElementById('s-exhaustion');
  if (_exhEl) currentChar.exhaustion = parseInt(_exhEl.value)||0;
  // Владения из Б3-textarea
  const _profEl = document.getElementById('s-proficiencies');
  if (_profEl) currentChar._profText = _profEl.value;
  // s-ac-input is a plain div — don't read it back (ac is managed by toggleShield/_updateAcDisplay)
  const speedEl = document.getElementById('s-speed-input');
  if (speedEl) currentChar.speed = parseInt(speedEl?.isContentEditable ? speedEl.textContent : speedEl?.value) || currentChar.speed || 30;
  const _lvlEl2 = document.getElementById('s-level-input');
  if (_lvlEl2 && _lvlEl2.value) currentChar.level = parseInt(_lvlEl2.value) || currentChar.level || 1;
  currentChar.halfProficiency  = document.getElementById('opt-half-prof')?.checked||false;
  currentChar.remarkableAthlete = document.getElementById('opt-remarkable-athlete')?.checked||false;
  // Save ability edits from sheet
  ABILITY_KEYS.forEach(k=>{
    const el=document.getElementById(`s-ab-${k}`);
    if(el) currentChar.abilities[k]=parseInt(el.value ?? el.textContent)||10;
  });
  // Заметки к атакам
  const _atkNotes = document.getElementById('s-attacks-notes');
  if (_atkNotes) currentChar.attacksNotes = _atkNotes.value;
  const _invNotes = document.getElementById('s-inv-notes');
  if (_invNotes) currentChar.inventoryNotes = _invNotes.value;
  _reapplyAcFormula();
  await fetch('/api/characters',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(currentChar)});
  // Silent save — no toast, no re-render (caller handles UI)
}
/** Re-evaluates currentChar.acFormula and updates acBase/ac if formula is set */
function _reapplyAcFormula() {
  if (!currentChar?.acFormula) return;
  const shield = currentChar.shieldEquipped ? 2 : 0;
  const bonus  = parseInt(document.getElementById('acd-bonus')?.value) || 0; // usually 0 after apply
  const baseVal = _evalAcFormula(currentChar.acFormula, currentChar);
  const newAC   = baseVal + shield;
  if (newAC !== currentChar.ac) {
    currentChar.acBase = baseVal;
    currentChar.ac     = newAC;
    _updateAcDisplay();
  }
}



// ── Global auto-save listener ─────────────────────────────────────────────
// Catches ALL input/change events on the sheet view — covers static form fields
document.addEventListener('input',  _globalSheetChange, true);
document.addEventListener('change', _globalSheetChange, true);

function _globalSheetChange(e) {
  if (!currentChar || !currentFilename) return;
  const sheet = document.getElementById('view-sheet');
  if (!sheet || !sheet.contains(e.target)) return;
  // Skip elements that already fire their own saveSheet/renderInventorySheet
  const skip = ['inv-qty', 's-hp-cur', 's-hp-max', 's-hp-tmp'];
  if (skip.some(cls => e.target.classList.contains(cls))) return;
  autoSave();
}

async function loadCharList() {
  const res  = await fetch('/api/characters');
  const chars= await res.json();
  const c=document.getElementById('char-list-container');
  if (!chars.length) {
    c.innerHTML=`<div style="max-width:860px;margin:1.5rem auto;padding:1rem">
      <div class="empty-state">
        <span class="big-icon">📜</span>
        Персонажей пока нет. Создайте первого героя!
      </div></div>`; return;
  }
  c.innerHTML=`<div style="max-width:860px;margin:1.5rem auto;padding:1rem">`+
    chars.map(ch=>{
      const cls=(window.CLASSES||[]).find(c=>c.name===ch.class||c.id===ch.class);
      // API отдаёт: ch.race, ch.subrace, ch.class, ch.background, ch.portrait
      let portraitInner;
      if (ch.portrait) {
        portraitInner = `<img src="${ch.portrait}" alt="portrait">`;
      } else {
        // Нет портрета — эмодзи класса крупным шрифтом
        portraitInner = `<span class="cli-portrait-placeholder">${cls?.icon||'🧙'}</span>`;
      }
      const raceClass = [ch.race, ch.subrace, ch.class].filter(Boolean).join(' · ');
      const bgLine    = ch.background || '';
      return `<div class="char-list-item" onclick="loadChar('${ch.filename}')">
        <div class="cli-portrait">${portraitInner}</div>
        <div class="cli-divider"></div>
        <div class="cli-body">
          <div class="cli-name">${ch.name}</div>
          ${raceClass ? `<div class="cli-race-class">${raceClass}</div>` : ''}
          ${bgLine    ? `<div class="cli-meta">${bgLine}</div>` : ''}
        </div>
        <div class="cli-right" onclick="event.stopPropagation()">
          <div class="cli-level" onclick="loadChar('${ch.filename}')">Ур. ${ch.level}</div>
          <div class="cli-actions">
            <button class="dice-btn" onclick="exportCharLSS('${ch.filename}')" title="LSS">📤</button>
            <button class="dice-btn" onclick="exportCharRaw('${ch.filename}')" title="JSON">📋</button>
            <button class="dice-btn" style="color:var(--red2)" onclick="deleteChar('${ch.filename}')">🗑️</button>
          </div>
        </div>
      </div>`;
    }).join('')+'</div>';
}

async function loadChar(filename) {
  const res=await fetch('/api/characters/'+filename);
  const char=await res.json();
  currentChar=char; currentFilename=filename;
  document.getElementById('nav-sheet').style.display='inline-block';
  renderSheet(char);
  showView('sheet');
}

async function exportCharLSS(filename) { window.open('/api/export/lss/'+filename,'_blank'); }
async function exportCharRaw(filename) { window.open('/api/export/raw/'+filename,'_blank'); }
function exportSheet() { if(currentFilename) exportCharLSS(currentFilename); }
function exportRaw()   { if(currentFilename) exportCharRaw(currentFilename); }

async function exportPdf() {
  if (!currentChar) return;
  const btn = document.getElementById('btn-export-pdf');
  if (btn) { btn.textContent = '⏳ PDF'; btn.disabled = true; }

  try {
    // Build spell levels map from loaded SPELLS
    const spellLevels = {};
    (window.SPELLS || []).forEach(sp => {
      if (sp.name !== undefined) spellLevels[sp.name] = sp.level ?? 1;
    });

    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...currentChar, _spellLevels: spellLevels})
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${currentChar.name || 'character'}_DnD5e.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast('📄 PDF скачан!', 'success');
  } catch(e) {
    toast(`❌ Ошибка PDF: ${e.message}`, 'error');
    console.error('exportPdf error:', e);
  } finally {
    if (btn) { btn.textContent = '📄 PDF'; btn.disabled = false; }
  }
}

async function deleteChar(filename) {
  if (!confirm('Удалить персонажа?')) return;
  await fetch('/api/characters/'+filename,{method:'DELETE'});
  if (currentFilename===filename) {
    currentChar=null; currentFilename=null;
    document.getElementById('nav-sheet').style.display='none';
  }
  loadCharList();
  toast('🗑️ Персонаж удалён');
}

async function importChar() {
  const input=document.createElement('input');
  input.type='file'; input.accept='.json';
  input.onchange=async e=>{
    const file=e.target.files[0]; if(!file) return;
    try {
      const text=await file.text();
      const data=JSON.parse(text);
      const res=await fetch('/api/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data,filename:file.name})});
      const result=await res.json();
      if (result.status==='imported') { toast('✅ Импортировано: '+result.name,'success'); loadCharList(); }
      else toast('❌ Ошибка: '+result.error,'error');
    } catch(err) { toast('❌ Не удалось прочитать JSON','error'); }
  };
  input.click();
}

// ══════════════════════════════════════════════════════════
// ЛИСТ ПЕРСОНАЖА
// ══════════════════════════════════════════════════════════
function renderSheet(char) {
  // _spellAbilityOverride всегда заполнен — если нет, берём из spellAbility
  if (!char._spellAbilityOverride) {
    char._spellAbilityOverride = char.spellAbility || null;
  }
  // Init skill exp from saved data
  sheetSkillExp   = {...(char.skillExpertise||{})};
  // Back-compat: fill from proficiencies
  (char.skillProficiencies||[]).forEach(s=>{ if(!sheetSkillExp[s]) sheetSkillExp[s]=1; });
  sheetUsedSlots  = char.usedSpellSlots||{};

  const pb = char.proficiencyBonus||profBonus(char.level||1);
  const halfProf = char.halfProficiency||false;
  const remarkableAthlete = char.remarkableAthlete||false;

  // Header
  document.getElementById('s-name').textContent = char.name||'—';
  document.getElementById('s-meta').textContent = [
    char.raceName, '—', char.className
  ].filter(Boolean).join(' ');

  // Editable combat stats (now in topbar, including level & xp)
  setInputVal('s-ac-input',    char.ac||10);
  setInputVal('s-speed-input', char.speed||30);
  setInputVal('s-level-input', char.level||1);
  setInputVal('s-xp-input',    char.xp||0);
  setInputVal('s-hp-cur',      char.hpCurrent??char.hpMax??10);
  setInputVal('s-hp-max',      char.hpMax||10);
  setInputVal('s-hp-tmp',      char.hpTemp||0);
  updateHpDisplay();

  const dexMod = getMod(char.abilities?.['ЛОВ']||10);
  // Инициатива теперь в квикстат-баре через updateQuickstatBar()
  // s-init-val — удалён из шапки
  document.getElementById('s-prof-val').textContent  = '+'+pb;
  // Inspiration icon
  const hitDieEl = document.getElementById('s-hit-die');
  if (hitDieEl) {
    const hdVal = char.hitDieOverride || ('d'+(char.hitDie||8));
    if (hitDieEl.isContentEditable) hitDieEl.textContent = hdVal;
    else hitDieEl.value = hdVal;
  }

  // Shield state — diamond + SVG glow
  const diamond = document.getElementById('shield-diamond');
  const wrap    = document.getElementById('ac-shield-wrap');
  const path    = document.getElementById('ac-shield-path');
  const shOn    = !!char.shieldEquipped;
  if (diamond) diamond.classList.toggle('on', shOn);
  if (wrap)    wrap.classList.toggle('shield-on', shOn);
  if (path)    path.setAttribute('stroke', shOn ? 'rgba(200,160,50,0.9)' : 'rgba(255,255,255,0.75)');

  // Пассивные чувства рендерятся внутри renderAbilitiesSheet (ячейка Б3)

  // Death saves
  const ds=char.deathSaves||{};
  document.querySelectorAll('.success-pip').forEach((p,i)=>p.classList.toggle('filled',(ds.successes||[])[i]||false));
  document.querySelectorAll('.fail-pip').forEach((p,i)=>p.classList.toggle('filled',(ds.failures||[])[i]||false));

  // Optional features
  const optHalf = document.getElementById('opt-half-prof');
  const optRA   = document.getElementById('opt-remarkable-athlete');
  if (optHalf) optHalf.checked = halfProf;
  if (optRA) optRA.checked = remarkableAthlete;

  renderAbilitiesSheet(char);
  renderSkillsSheet(char, pb, halfProf, remarkableAthlete);
  // renderConditionsSheet — теперь состояния в квикстат-баре
  renderWeaponsSheet(char, pb);
  renderResourcesSheet(char);
  const _atkNotesEl = document.getElementById('s-attacks-notes');
  if (_atkNotesEl) {
    _atkNotesEl.value = char.attacksNotes || '';
    rteSetValue('s-attacks-notes', char.attacksNotes || '');
    _atkNotesEl.oninput = () => { if(currentChar) { currentChar.attacksNotes = _atkNotesEl.value; autoSave(); } };
  }
  renderSpellsSheet(char, pb);
  renderInventorySheet(char);
  renderFeaturesSheet(char);

  renderNoteBlocks();
  // Currency → update header gold counter, hide from inventory
  const cur=char.currency||{};
  const curEl = document.getElementById('s-currency');
  if (curEl) curEl.innerHTML = ''; // currency now shown in header
  _updateHeaderGold(cur);
  // Portrait + class icon fallback
  // Синхронизировать квикстат-панель
  updateQuickstatBar();

  // Истощение
  const exhSelEl = document.getElementById('s-exhaustion');
  if (exhSelEl) exhSelEl.value = char.exhaustion||0;

  renderPortrait(char);

  // Update XP progress bar in header
  (function(){
    const lvl = char.level||1, xp = char.xp||0;
    const curFloor = xpForLevel(lvl);
    const nextCeil = lvl >= 20 ? xpForLevel(20) : xpForLevel(lvl + 1);
    const pct = lvl >= 20 ? 100 : Math.min(100, Math.round((xp - curFloor) / (nextCeil - curFloor) * 100));
    const bar = document.getElementById('s-xp-bar');
    if (bar) bar.style.width = Math.max(0,pct) + '%';
    const lbl = document.getElementById('s-xp-label');
    if (lbl) lbl.textContent = lvl + ' УР';
    const xpVal = document.getElementById('s-xp-val');
    if (xpVal) xpVal.textContent = xp.toLocaleString();
    const nextLvl = document.getElementById('s-xp-nextlvl');
    if (nextLvl) nextLvl.textContent = lvl >= 20 ? '∞' : lvl + 1;
  })();
  const profEl = document.getElementById('s-proficiencies');
  if (profEl) {
    const autoText = computeProfText(char);
    if (autoText !== null) { profEl.value = autoText; rteSetValue('s-proficiencies', autoText); }
    profEl.oninput = () => { char.savedProfText = profEl.value; char._profTextEdited = true; };
  }
  // Abilities text tab — auto-computed unless user edited manually
  const abText = document.getElementById('s-abilities-text');
  if (abText) {
    const autoAb = computeAbilitiesText(char);
    if (autoAb !== null) {
      abText.value = autoAb;
      char.abilitiesText = autoAb;
      rteSetValue('s-abilities-text', autoAb);
    } else {
      abText.value = char.abilitiesText || '';
      rteSetValue('s-abilities-text', char.abilitiesText || '');
    }
    abText.oninput = () => { char.abilitiesText = abText.value; char._abilitiesTextEdited = true; };
  }
  // Features tab — now a textarea
  const featEl = document.getElementById('s-features');
  if (featEl && featEl.tagName === 'TEXTAREA') {
    if (!char._featTextEdited) featEl.value = char.savedFeatText ?? char.features ?? '';
    featEl.oninput = () => { char.savedFeatText = featEl.value; char._featTextEdited = true; };
  }

  // ── Personality tab ──
  const setP = (id, val) => { const el = document.getElementById(id); if (el) { if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') el.value = val||''; else if (el.tagName === 'SELECT') el.value = val||''; else el.textContent = val||'—'; } };
  setP('sp-background',  char.backgroundName);
  setP('sp-alignment',   char.alignment);
  setP('sp-subrace',     char.subraceName);
  setP('sp-subclass',    char.subclass);
  setP('sp-appearance',  char.appearance);
  setP('sp-backstory',   char.backstory);
  setP('sp-traits',      char.traits);
  setP('sp-ideals',      char.ideals);
  setP('sp-bonds',       char.bonds);
  setP('sp-flaws',       char.flaws);
  setP('sp-allies',      char.allies);
  setP('sp-age',         char.age);
  setP('sp-height',      char.height);
  setP('sp-weight',      char.weight);
  setP('sp-eyes',        char.eyes);
  setP('sp-skin',        char.skin);
  setP('sp-hair',        char.hair);
  const _invNotesEl = document.getElementById('s-inv-notes');
  if (_invNotesEl) { _invNotesEl.value = char.inventoryNotes || ''; }
}

function setInputVal(id, v) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.isContentEditable || el.tagName === 'DIV' || el.tagName === 'SPAN') el.textContent = v;
  else el.value = v;
}

/**
 * Вычисляет текст блока «Владения и языки» из полей персонажа.
 * Вызывается из renderAbilitiesSheet и renderSheet.
 */
/**
 * Автоматически генерирует текст вкладки «Черты и способности»
 * из полей персонажа (расовые черты, черты класса/подкласса, предыстория,
 * скорости, тёмное зрение). Вызывается из renderSheet и renderAbilitiesSheet.
 * Возвращает null, если пользователь уже редактировал поле вручную.
 */
function computeAbilitiesText(char) {
  if (char._abilitiesTextEdited) return null;
  const lines = [];

  // ── Движение ──
  const speeds = [];
  if (char.speed && char.speed !== 30) speeds.push(`Скорость: ${char.speed} фт.`);
  else if (char.speed) speeds.push(`Скорость: ${char.speed} фт.`);
  if (char.climbSpeed)  speeds.push(`Лазание: ${char.climbSpeed} фт.`);
  if (char.swimSpeed)   speeds.push(`Плавание: ${char.swimSpeed} фт.`);
  if (char.flySpeed)    speeds.push(`Полёт: ${char.flySpeed} фт.`);
  if (char.darkvision)  speeds.push(`Тёмное зрение: ${char.darkvision} фт.`);
  if (speeds.length) lines.push(speeds.join(' | '));

  // ── Расовые черты ──
  if (char.racialTraits) {
    lines.push(`▶ Расовые черты (${char.raceName || 'Раса'})`);
    lines.push(char.racialTraits);
  }

  // ── Черты класса ──
  if (char.classFeatures) {
    lines.push(`▶ Черты класса (${char.className || 'Класс'})`);
    lines.push(char.classFeatures);
  }

  // ── Черты подкласса ──
  if (char.subclassFeatures) {
    lines.push(`▶ ${char.subclass || 'Подкласс'}`);
    lines.push(char.subclassFeatures);
  }

  // ── Черты предыстории ──
  if (char.backgroundFeature) {
    lines.push(`▶ Особенность предыстории (${char.backgroundName || 'Предыстория'})`);
    lines.push(char.backgroundFeature);
  }

  return lines.join('\n');
}

function computeProfText(char) {
  if (char._profTextEdited) return null; // пользователь редактировал — не перезаписывать
  const lines = [];
  if (char.languages?.length) lines.push(`Языки: ${char.languages.join(', ')}`);
  const _armorVal = Array.isArray(char.armorProf)
    ? char.armorProf.filter(Boolean).join(', ')
    : (char.armorProf||'').trim();
  if (_armorVal) {
    const _restriction = char.armorRestriction ? ` (${char.armorRestriction})` : '';
    lines.push(`Доспехи${_restriction}: ${_armorVal}`);
  }
  if (char.weaponProf) {
    const wp = Array.isArray(char.weaponProf) ? char.weaponProf.join(', ') : char.weaponProf;
    if (wp) lines.push(`Оружие: ${wp}`);
  }

  const musical    = new Set(window.TOOLS_BY_CATEGORY?.musical    || []);
  const artisan    = new Set(window.TOOLS_BY_CATEGORY?.artisan    || []);
  const gaming     = new Set(window.TOOLS_BY_CATEGORY?.gaming     || []);
  const otherSet   = new Set(window.TOOLS_BY_CATEGORY?.other      || []);
  const transportS = new Set(window.TOOLS_BY_CATEGORY?.transport  || [
    'Транспортное средство (наземное)', 'Транспортное средство (водное)'
  ]);

  const getCategory = t => {
    const name = t.trim();
    // Транспорт — всегда в «Прочее»
    if (transportS.has(name) || /транспорт/i.test(name)) return 'Прочее';
    // Музыкальные — по словарю или по ключевым словам (для выбора/плейсхолдера)
    if (musical.has(name)) return 'Музыкальные инструменты';
    if (/^(муз\.?\s*инструмент|лютня|виола|флейта|барабан|рожок|волынка|лира|скрипка|гобой|цитра|бубен|рог)/i.test(name))
      return 'Музыкальные инструменты';
    // Ремесленные, игровые, прочие специальные → «Инструменты»
    if (artisan.has(name) || gaming.has(name) || otherSet.has(name)) return 'Инструменты';
    // Fallback по ключевым словам
    if (/инструмент|набор\s+для|набор\s+трав/i.test(name)) return 'Инструменты';
    return 'Прочее';
  };

  // Собираем инструменты из обоих полей без дубликатов
  const allToolItems = [
    ...(char.toolProf  || '').split(/[;,]/).map(t => t.trim()).filter(t => t && !/^н[еЕ][тТ]$/i.test(t)),
    ...(char.otherProf || '').split(/[;,]/).map(t => t.trim()).filter(t => t && !/^н[еЕ][тТ]$/i.test(t)),
  ];
  const seen = new Set();
  const deduped = allToolItems.filter(t => { if (seen.has(t)) return false; seen.add(t); return true; });

  const grouped = {};
  deduped.forEach(t => {
    const cat = getCategory(t);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  });

  // Порядок вывода: Инструменты → Музыкальные инструменты → Прочее
  ['Инструменты', 'Музыкальные инструменты', 'Прочее'].forEach(cat => {
    if (grouped[cat]?.length) lines.push(`${cat}: ${grouped[cat].join(', ')}`);
  });
  // Всё, что не попало в основные три категории
  Object.entries(grouped).forEach(([cat, items]) => {
    if (!['Инструменты', 'Музыкальные инструменты', 'Прочее'].includes(cat))
      lines.push(`${cat}: ${items.join(', ')}`);
  });
  return lines.join('\n');
}

function renderAbilitiesSheet(char) {
  const pb = char.proficiencyBonus || profBonus(char.level||1);
  const saveProfs = new Set(char.savingThrows||[]);
  const halfProf  = char.halfProficiency||false;
  const remarkableAthlete = char.remarkableAthlete||false;
  const raAbilities = new Set(['СИЛ','ЛОВ','ТЕЛ']);

  const skillsByAbility = {};
  SKILLS_DATA.forEach(s => {
    if (!skillsByAbility[s.ability]) skillsByAbility[s.ability] = [];
    skillsByAbility[s.ability].push(s);
  });

  const FULL = { СИЛ:'СИЛА', ЛОВ:'ЛОВКОСТЬ', ТЕЛ:'ТЕЛОСЛОЖЕНИЕ', ИНТ:'ИНТЕЛЛЕКТ', МДР:'МУДРОСТЬ', ХАР:'ХАРИЗМА' };

  const cardHtml = (a) => {
    const score = Math.min(30, char.abilities?.[a] || 10);
    const mod   = getMod(score);
    const isSave = saveProfs.has(a);
    const saveBonus = char._saveOverride?.[a] != null
      ? char._saveOverride[a]
      : mod + (isSave ? pb : 0) + (char._saveBonus?.[a] || 0);
    const skills = skillsByAbility[a] || [];

    const skillRows = skills.map(s => {
      const exp = sheetSkillExp[s.name] || 0;
      const isRA = remarkableAthlete && raAbilities.has(a) && exp === 0;
      const bonus = exp===2 ? (pb*2) : exp===1 ? pb : (halfProf||isRA ? Math.floor(pb/2) : 0);
      const extraBonus = char._skillBonus?.[s.name] || 0;
      const total = char._skillOverride?.[s.name] != null
        ? char._skillOverride[s.name]
        : mod + bonus + extraBonus;
      const dotCls = exp===2 ? 'exp' : exp===1 ? 'prof' : '';
      const rowCls = exp===2 ? 'has-exp' : exp===1 ? 'has-prof' : '';
      const hasCustom = (char._skillOverride?.[s.name] != null || extraBonus !== 0) ? ' skill-custom' : '';
      return `<div class="ab-skill-row ${rowCls}${hasCustom}" onclick="openSkillDialog('${s.name}')">
        <div class="ab-skill-dot ${dotCls}" onclick="event.stopPropagation();cycleSkillExp('${s.name}',this)" title="Нажмите для смены владения"></div>
        <span class="ab-skill-name">${s.name}</span>
        <span class="ab-skill-val" onclick="event.stopPropagation();rollSkillCheck('${s.name}')" title="Бросить проверку" style="cursor:pointer">${fmtMod(total)}</span>
      </div>`;
    }).join('');

    return `<div class="ab-card">
      <div class="ab-card-header" onclick="openAbilityDialog('${a}')" style="cursor:pointer" title="Редактировать стат">
        <span class="ab-card-name">${FULL[a]||a}</span>
        <span class="ab-card-name-line"></span>
        <span class="ab-card-score" id="s-ab-${a}">${score}</span>
      </div>
      <div class="ab-badges">
        <div class="ab-badge" onclick="rollAbilityCheck('${a}')" style="cursor:pointer" title="Проверка ${FULL[a]||a}">
          <span>Проверка</span>
          <span class="ab-badge-val">${fmtMod(mod)}</span>
        </div>
        <div class="ab-save-wrap" style="cursor:pointer">
          <div class="ab-save-dot ${isSave?'active':''}" data-ability="${a}" onclick="event.stopPropagation();toggleSaveProf('${a}',this)" title="Переключить владение"></div>
          <div class="ab-badge ${isSave?'save-active':''}">
            <span>Спасбросок</span>
            <span class="ab-badge-val" onclick="rollSaveCheck('${a}')" style="cursor:pointer" title="Спасбросок ${FULL[a]||a}">${fmtMod(saveBonus)}</span>
          </div>
        </div>
      </div>
      ${skillRows ? `<div class="ab-skills">${skillRows}</div>` : ''}
    </div>`;
  };

  // ── Пассивные чувства + владения (ячейка Б3) ──
  const wisMod  = getMod(char.abilities?.['МДР']||10);
  const intMod  = getMod(char.abilities?.['ИНТ']||10);
  const percExp = sheetSkillExp['Восприятие']||0;
  const percBon = percExp===2?(pb*2):percExp===1?pb:(halfProf?Math.floor(pb/2):0);
  const insiExp = sheetSkillExp['Проницательность']||0;
  const insiBon = insiExp===2?(pb*2):insiExp===1?pb:(halfProf?Math.floor(pb/2):0);
  const inveExp = sheetSkillExp['Анализ']||0;
  const inveBon = inveExp===2?(pb*2):inveExp===1?pb:(halfProf?Math.floor(pb/2):0);
  const passivePerc   = 10 + wisMod + percBon;
  const passiveInsi   = 10 + wisMod + insiBon;
  const passiveInve   = 10 + intMod + inveBon;

  // Вычисляем текст владений (пересчёт каждый раз, если пользователь не редактировал вручную)
  const profVal = char._profTextEdited
    ? (char._profText || '')
    : (computeProfText(char) ?? char._profText ?? '');

  const b3Html = `
    <div class="passive-box">
      <div class="section-title" style="margin-bottom:.4rem">Пассивные чувства</div>
      <div class="passive-row">
        <span class="passive-val" id="s-passive">${passivePerc}</span>
        <span class="passive-label">Мудрость (Восприятие)</span>
      </div>
      <div class="passive-row">
        <span class="passive-val" id="s-passive-insight">${passiveInsi}</span>
        <span class="passive-label">Мудрость (Проницательность)</span>
      </div>
      <div class="passive-row">
        <span class="passive-val" id="s-passive-invest">${passiveInve}</span>
        <span class="passive-label">Интеллект (Анализ)</span>
      </div>
    </div>
    <div class="b3-prof-box">
      <div class="b3-prof-title">Владения и языки</div>
      <textarea class="b3-prof-textarea rte-source" id="s-proficiencies"
        data-rte-class="rte-plain"
        placeholder="Языки, доспехи, оружие, инструменты..."
        onchange="if(currentChar)currentChar._profTextEdited=true;autoSave()">${profVal}</textarea>
    </div>`;

  // ── Сетка 2×3: размещаем по ячейкам ──
  // А1: СИЛ + ТЕЛ | Б1: ЛОВ
  // А2: ИНТ        | Б2: МДР
  // А3: ХАР        | Б3: пассивные+владения
  document.getElementById('s-abilities').innerHTML = `
    <div class="ab-cell-a1">
      ${cardHtml('СИЛ')}
      ${cardHtml('ТЕЛ')}
    </div>
    <div class="ab-cell-b1">${cardHtml('ЛОВ')}</div>
    <div class="ab-cell-a2">${cardHtml('ИНТ')}</div>
    <div class="ab-cell-b2">${cardHtml('МДР')}</div>
    <div class="ab-cell-a3">${cardHtml('ХАР')}</div>
    <div class="ab-cell-b3">${b3Html}</div>
  `;
  renderJumpBlock(char);
}

function renderJumpBlock(char) {
  const el = document.getElementById('s-jump-block');
  if (!el) return;
  const silScore = char?.abilities?.['СИЛ'] || 10;
  const silMod   = getMod(silScore);
  const longRun   = silScore;
  const longStand = Math.floor(silScore / 2);
  const highRun   = 3 + silMod;
  const highStand = Math.max(0, Math.floor((3 + silMod) / 2));
  el.innerHTML = `
    <div class="jump-bar">
      <div class="jump-item" title="С разбега: ${longRun} фт · Без разбега: ${longStand} фт">
        <span class="jump-icon">↔</span>
        <div class="jump-body">
          <span class="jump-label">Прыжок в длину</span>
          <span class="jump-vals">
            <span class="jump-val">${longRun} фт</span>
            <span class="jump-divider">/</span>
            <span class="jump-val dim">${longStand} фт</span>
          </span>
        </div>
      </div>
      <div class="jump-sep"></div>
      <div class="jump-item" title="С разбега: ${highRun} фт · Без разбега: ${highStand} фт">
        <span class="jump-icon">↕</span>
        <div class="jump-body">
          <span class="jump-label">Прыжок в высоту</span>
          <span class="jump-vals">
            <span class="jump-val">${highRun} фт</span>
            <span class="jump-divider">/</span>
            <span class="jump-val dim">${highStand} фт</span>
          </span>
        </div>
      </div>
      <span class="jump-hint">с разбега / без разбега</span>
    </div>`;
}

function renderSavesSheet(char, pb) {
  const saveProfs=new Set(char.savingThrows||[]);
  const el = document.getElementById('s-saves');
  if (!el) return;
  el.innerHTML = ABILITY_KEYS.map(a=>{
    const score=char.abilities?.[a]||10;
    const isP=saveProfs.has(a);
    const total=getMod(score)+(isP?pb:0);
    return `<div class="ability-save-row">
      <div class="save-prof-dot ${isP?'active':''}" onclick="toggleSaveProf('${a}',this)"></div>
      <span class="save-name">${ABILITY_FULL[a]}</span>
      <span class="save-val">${fmtMod(total)}</span>
    </div>`;
  }).join('');
}

function toggleSaveProf(a, el) {
  if (!currentChar) return;
  const saves = new Set(currentChar.savingThrows||[]);
  if (saves.has(a)) { saves.delete(a); } else { saves.add(a); }
  currentChar.savingThrows = [...saves];
  renderAbilitiesSheet(currentChar);
  autoSave();
}

// 3-state skill cycle: 0=нет, 1=владение, 2=компетентность
function renderSkillsSheet(char, pb, halfProf=false, remarkableAthlete=false) {
  // skills are now rendered inside renderAbilitiesSheet, just update s-skills if it exists
  const container = document.getElementById('s-skills');
  if (!container) return;
  const raAbilities = new Set(['СИЛ','ЛОВ','ТЕЛ']);
  container.innerHTML = SKILLS_DATA.map(s=>{
    const score=char.abilities?.[s.ability]||10;
    const exp = sheetSkillExp[s.name]||0;
    const isRA = remarkableAthlete && raAbilities.has(s.ability) && exp === 0;
    const bonus = exp===2?(pb*2):exp===1?pb:(halfProf||isRA?Math.floor(pb/2):0);
    const total = getMod(score)+bonus;
    const icons = ['○','●','◉'];
    return `<div class="skill-row">
      <div class="skill-exp-toggle" data-skill="${s.name}" data-state="${exp}"
        onclick="cycleSkillExp('${s.name}',this)">${icons[exp]}</div>
      <span class="skill-mod">${fmtMod(total)}${isRA?'<sup style="font-size:.5rem;color:var(--gold)">ВА</sup>':''}</span>
      <span class="skill-name">${s.name}</span>
      <span class="skill-ability-tag">${s.ability}</span>
    </div>`;
  }).join('');
}

function cycleSkillExp(name, el) {
  const cur  = sheetSkillExp[name] || 0;
  const next = (cur + 1) % 3;
  sheetSkillExp[name] = next;

  // Обновляем класс точки
  el.classList.remove('prof','exp');
  if (next === 1) el.classList.add('prof');
  if (next === 2) el.classList.add('exp');
  el.title = ['','владение','компетентность'][next];

  if (!currentChar) return;
  currentChar.skillExpertise     = {...sheetSkillExp};
  currentChar.skillProficiencies = Object.keys(sheetSkillExp).filter(k=>sheetSkillExp[k]>0);

  // Перерисовываем всю карточку способности (обновляет значение навыка)
  renderAbilitiesSheet(currentChar);
  autoSave();

  // Обновляем пассивные чувства
  const pb  = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  const halfProf = currentChar.halfProficiency||false;
  const wisMod = getMod(currentChar.abilities?.['МДР']||10);
  const intMod = getMod(currentChar.abilities?.['ИНТ']||10);

  const calc = (skill, baseMod) => {
    const exp = sheetSkillExp[skill]||0;
    const bonus = exp===2?(pb*2):exp===1?pb:(halfProf?Math.floor(pb/2):0);
    return 10 + baseMod + bonus;
  };
  const el1 = document.getElementById('s-passive');
  const el2 = document.getElementById('s-passive-insight');
  const el3 = document.getElementById('s-passive-invest');
  if (el1) el1.textContent = calc('Восприятие', wisMod);
  if (el2) el2.textContent = calc('Проницательность', wisMod);
  if (el3) el3.textContent = calc('Анализ', intMod);
}

function renderConditionsSheet(char) {
  // Состояния теперь отображаются в квикстат-панели (updateQuickstatBar)
  updateQuickstatBar();
}

let _weEditIdx = -1;

function renderWeaponsSheet(char, pb) {
  const abMods={str:getMod(char.abilities?.['СИЛ']||10),dex:getMod(char.abilities?.['ЛОВ']||10),
    cha:getMod(char.abilities?.['ХАР']||10),int:getMod(char.abilities?.['ИНТ']||10),
    wis:getMod(char.abilities?.['МДР']||10),con:getMod(char.abilities?.['ТЕЛ']||10)};
  const weapons=char.weapons||[];
  if (!weapons.length) {
    document.getElementById('s-weapons').innerHTML='<p class="note-text">Оружие не добавлено.</p>';
    return;
  }
  document.getElementById('s-weapons').innerHTML = `<div class="weapon-cards">` +
    weapons.map((w,i) => {
      const am  = abMods[w.ability] ?? abMods.str;
      const atk = fmtMod((w.attackBonus||0) + (w.isProf?pb:0) + am);
      // Дистанция: ищем по id, затем по name в ITEMS_ALL
      const wSrc = (window.ITEMS_ALL||[]).find(it=> (w.id && it.id===w.id) || (!w.id && it.name===w.name));
      const wProps = wSrc?.properties || [];
      const autoRange = (wProps.find(p=>p.id==='ammunition')||wProps.find(p=>p.id==='thrown'))?.range || '';
      const wRange = (w.range !== undefined && w.range !== '') ? w.range : autoRange;
      const wRangeShort = wRange || '—';
      const propTags = w.props
        ? w.props.split('·').map(p=>p.trim()).filter(Boolean)
            .map(p=>`<span class="weapon-card-prop-tag">${p}</span>`).join('')
        : '';
      return `<div class="weapon-card" oncontextmenu="openWeaponCtxMenu(event,${i})" onclick="openWeaponEdit(${i})">
        <div class="weapon-card-main">
          <div class="weapon-card-name">${w.name||'—'}</div>
          ${propTags ? `<div class="weapon-card-props" onclick="event.stopPropagation()">${propTags}</div>` : ''}
          ${w.note ? `<div class="weapon-card-note">${w.note}</div>` : ''}
        </div>
        <span class="weapon-card-sep"></span>
        <span class="weapon-card-range" title="${wRange||'Нет дистанции'}">${wRangeShort}</span>
        <span class="weapon-card-sep"></span>
        <span class="weapon-card-atk" onclick="event.stopPropagation();rollWeaponAtk(${i})" title="Бросок атаки">${atk}</span>
        <span class="weapon-card-sep"></span>
        <span class="weapon-card-dmg" onclick="event.stopPropagation();rollWeaponDmg(${i})" title="Бросок урона">${w.damage||'—'}</span>
        <span class="weapon-card-sep"></span>
        <span class="weapon-card-type">${w.damageType||''}</span>
        <span class="weapon-card-del" onclick="event.stopPropagation();_wDel(${i})" title="Удалить">✕</span>
      </div>`;
    }).join('') + `</div>`;
}


// ══════════════════════════════════════════════════════════════
// WEAPON CONTEXT MENU
// ══════════════════════════════════════════════════════════════
let _wCtxIdx = -1;


// Умное позиционирование контекстного меню: не вылезает за края viewport
function _positionCtxMenu(menu, clientX, clientY) {
  menu.classList.remove('visible');

  // Показываем в верхнем углу документа — offsetHeight гарантированно реален
  menu.style.visibility = 'hidden';
  menu.style.display    = 'block';
  menu.style.left       = '0px';
  menu.style.top        = '0px';
  menu.style.bottom     = '';

  const menuW = menu.offsetWidth;
  const menuH = menu.offsetHeight;
  const winW  = window.innerWidth;
  const winH  = window.innerHeight;

  // Координаты клика → позиция в документе
  let x = clientX + window.scrollX;
  let y = clientY + window.scrollY;

  // Корректировка по горизонтали
  if (clientX + menuW > winW - 4) {
    x = window.scrollX + winW - menuW - 4;
  }
  // Корректировка по вертикали
  if (clientY + menuH > winH - 4) {
    y = window.scrollY + winH - menuH - 4;
  }

  menu.style.left       = x + 'px';
  menu.style.top        = y + 'px';
  menu.style.visibility = '';

  requestAnimationFrame(() => menu.classList.add('visible'));
}
function openWeaponCtxMenu(e, idx) {
  e.preventDefault();
  e.stopPropagation();
  _wCtxIdx = idx;
  const w = currentChar?.weapons?.[idx];
  if (!w) return;

  document.getElementById('wctx-name').textContent = w.name || '—';
  const meta = [w.damage, w.damageType].filter(Boolean).join(' · ');
  document.getElementById('wctx-meta').textContent = meta;

  const menu = document.getElementById('weapon-ctx-menu');
  if (!menu) return;
  menu.classList.remove('visible');
  menu.style.left = '-9999px'; menu.style.top = '-9999px';
  _positionCtxMenu(menu, e.clientX, e.clientY);

  const close = (ev) => {
    if (!menu.contains(ev.target)) { menu.classList.remove('visible'); document.removeEventListener('mousedown', close); }
  };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}

function weaponCtxAction(action) {
  const menu = document.getElementById('weapon-ctx-menu');
  if (menu) menu.classList.remove('visible');
  if (_wCtxIdx < 0) return;
  if (action === 'edit') { openWeaponEdit(_wCtxIdx); _wCtxIdx = -1; }
  if (action === 'del')  { _wDel(_wCtxIdx); _wCtxIdx = -1; }
  if (action === 'copy') {
    const w = currentChar?.weapons?.[_wCtxIdx];
    if (w) {
      const copy = Object.assign({}, w, { name: w.name + ' (копия)' });
      currentChar.weapons.splice(_wCtxIdx + 1, 0, copy);
      const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
      renderWeaponsSheet(currentChar, pb);
      autoSave();
      toast('📋 Атака скопирована', 'success');
    }
    _wCtxIdx = -1;
  }
}

function openWeaponEdit(idx) {
  _weEditIdx = idx;
  const w = currentChar?.weapons?.[idx];
  if (!w) return;
  document.getElementById('we-name').value    = w.name || '';
  document.getElementById('we-damage').value  = w.damage || '';
  document.getElementById('we-dmgtype').value = w.damageType || '';
  document.getElementById('we-bonus').value   = w.attackBonus || 0;
  const weRange = document.getElementById('we-range');
  if (weRange) {
    // Показываем сохранённое значение или автоматическое из базы
    const wSrc = (window.ITEMS_ALL||[]).find(it=> (w.id && it.id===w.id) || (!w.id && it.name===w.name));
    const wProps = wSrc?.properties || [];
    const autoRange = (wProps.find(p=>p.id==='ammunition')||wProps.find(p=>p.id==='thrown'))?.range || '';
    weRange.value = w.range !== undefined ? w.range : autoRange;
    weRange.placeholder = autoRange || '5 фт · 20/60 фт';
  }
  document.getElementById('we-ability').value = w.ability || 'str';
  document.getElementById('we-prof').checked  = !!w.isProf;
  const weProps = document.getElementById('we-props');
  if (weProps) weProps.value = w.props || '';
  const weNote = document.getElementById('we-note');
  if (weNote) weNote.value = w.note || '';
  document.getElementById('weapon-edit-overlay').classList.remove('hidden');
}

function closeWeaponEdit() {
  document.getElementById('weapon-edit-overlay').classList.add('hidden');
  _weEditIdx = -1;
}

function applyWeaponEdit() {
  if (_weEditIdx < 0 || !currentChar?.weapons?.[_weEditIdx]) return;
  const w = currentChar.weapons[_weEditIdx];
  w.name        = document.getElementById('we-name').value.trim() || w.name;
  w.damage      = document.getElementById('we-damage').value.trim();
  w.damageType  = document.getElementById('we-dmgtype').value;
  w.attackBonus = parseInt(document.getElementById('we-bonus').value) || 0;
  w.range       = document.getElementById('we-range')?.value.trim() ?? w.range;
  w.ability     = document.getElementById('we-ability').value;
  w.isProf      = document.getElementById('we-prof').checked;
  w.props       = document.getElementById('we-props')?.value.trim() || '';
  w.note        = document.getElementById('we-note')?.value.trim() || '';
  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  renderWeaponsSheet(currentChar, pb);
  saveSheet();
  closeWeaponEdit();
}

function _wDel(idx) {
  if (!currentChar?.weapons) return;
  const name = currentChar.weapons[idx]?.name || 'эту атаку';
  _confirmDel('Удалить атаку?', `Удалить «${name}»? Это действие нельзя отменить.`, () => {
    currentChar.weapons.splice(idx, 1);
    const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
    renderWeaponsSheet(currentChar, pb);
    saveSheet();
  });
}

function openWeaponDialog() {
  const el = document.getElementById('weapon-dialog-overlay');
  if (!el) return;
  // Reset fields
  document.getElementById('wd-name').value = '';
  document.getElementById('wd-damage').value = '';
  document.getElementById('wd-dmgtype').value = '';
  document.getElementById('wd-bonus').value = '0';
  document.getElementById('wd-ability').value = 'str';
  document.getElementById('wd-prof').checked = true;
  const propsEl = document.getElementById('wd-props');
  if (propsEl) propsEl.value = '';
  const noteEl = document.getElementById('wd-note');
  if (noteEl) noteEl.value = '';
  el.classList.remove('hidden');
  setTimeout(() => document.getElementById('wd-name').focus(), 80);
}

function closeWeaponDialog() {
  document.getElementById('weapon-dialog-overlay')?.classList.add('hidden');
}

function confirmAddWeapon() {
  if (!currentChar) return;
  const name = document.getElementById('wd-name').value.trim();
  if (!name) { document.getElementById('wd-name').focus(); return; }
  const damage    = document.getElementById('wd-damage').value.trim() || '—';
  const damageType = document.getElementById('wd-dmgtype').value;
  const attackBonus = parseInt(document.getElementById('wd-bonus').value) || 0;
  const ability   = document.getElementById('wd-ability').value;
  const isProf    = document.getElementById('wd-prof').checked;
  const note      = document.getElementById('wd-note')?.value.trim() || '';
  if (!currentChar.weapons) currentChar.weapons = [];
  const props = document.getElementById('wd-props')?.value.trim() || '';
  currentChar.weapons.push({ name, damage, damageType, ability, isProf, attackBonus, props, note });
  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  renderWeaponsSheet(currentChar, pb);
  closeWeaponDialog();
}

function addSheetWeapon() { openWeaponDialog(); }


// Классы с подготовкой заклинаний
function isPreparedCaster(char) {
  const cls = (char.className || char.class || '').toLowerCase();
  const PREP = ['волшебник','wizard','жрец','cleric','друид','druid','паладин','paladin'];
  if (PREP.some(c => cls.includes(c))) return true;
  // Проверяем через classes.js
  const clsData = (window.CLASSES_ALL || []).find(c =>
    c.name?.toLowerCase() === cls || c.id === cls
  );
  return clsData?.spellcasting?.spellsByLevel === 'prepared';
}

// Вычислить дефолтное количество подготавливаемых заклинаний
function calcDefaultPrepCount(char) {
  const cls = (window.CLASSES_ALL || []).find(c =>
    c.name?.toLowerCase() === (char.className||char.class||'').toLowerCase() || c.id === (char.className||char.class||'')
  );
  const sc = cls?.spellcasting;
  const pb = char.proficiencyBonus || profBonus(char.level||1);
  const abilMod = getMod(char.abilities?.[getSpellAbility(char)]||10);
  const level = char.level || 1;
  const halfLevel = (sc?.type==='half'||sc?.type==='half_up') ? Math.ceil(level/2) : level;
  return Math.max(1, abilMod + halfLevel);
}

// Активная заклинательная характеристика — всегда из _spellAbilityOverride
function getSpellAbility(char) {
  return char._spellAbilityOverride || null;
}
function renderSpellsSheet(char, pb) {
  if (!getSpellAbility(char)) {
    document.getElementById('s-spell-meta').innerHTML='<p class="note-text" style="margin-bottom:.4rem">Нет характеристики заклинателя — слоты недоступны. Особые способности и заклинания можно добавить вручную.</p>';
    document.getElementById('s-spell-slots').innerHTML='';
    // Still render spells list for non-casters (homebrew / racial spells)
    const spells = char.spells || [];
    if (!spells.length) {
      document.getElementById('s-spells-list').innerHTML = '<p class="note-text">Заклинания не добавлены.</p>';
      return;
    }
    // fall through to render spell cards below
  }
  if (getSpellAbility(char)) {
    const abilMod = getMod(char.abilities?.[getSpellAbility(char)]||10);
    const baseDC  = 8 + pb + abilMod;
    const baseAtk = pb + abilMod;
    // Применяем кастомные оверрайды
    const dc  = char._spellSaveOverride  != null ? char._spellSaveOverride  : baseDC  + (char._spellSaveBonus  || 0);
    const atk = char._spellAtkOverride   != null ? char._spellAtkOverride   : baseAtk + (char._spellAtkBonus   || 0);
    // Подготовка
    const showPrep = char._spellPrepEnabled != null ? !!char._spellPrepEnabled : isPreparedCaster(char);
    const prepDefault = calcDefaultPrepCount(char);
    const prep = char._spellPrepOverride != null ? char._spellPrepOverride : prepDefault + (char._spellPrepBonus || 0);
    const prepItem = showPrep
      ? `<div class="spell-meta-item" style="cursor:pointer" onclick="openSpellMetaDialog()">
          <span class="spell-meta-label">Подготовка</span>
          <span class="spell-meta-val">${prep}</span>
        </div>` : '';
    document.getElementById('s-spell-meta').innerHTML=`
      <div class="spell-meta-bar" style="margin-bottom:.65rem;cursor:pointer" onclick="openSpellMetaDialog()">
        <div class="spell-meta-item">
          <span class="spell-meta-label">Спасбросок заклинаний</span>
          <span class="spell-meta-val">${dc}</span>
        </div>
        <div class="spell-meta-item">
          <span class="spell-meta-label">Бонус атаки</span>
          <span class="spell-meta-val">${fmtMod(atk)}</span>
        </div>
        <div class="spell-meta-item">
          <span class="spell-meta-label">Хар-ка</span>
          <span class="spell-meta-val">${getSpellAbility(char)||'—'}</span>
        </div>
        ${prepItem}
      </div>`;
    // Колдун: Магия Договора — все ячейки одного уровня
    if (isWarlockChar(char)) {
      const [pactCount, pactLvl] = WARLOCK_PACT_TABLE[char.level||1] || [1,1];
      const used = sheetUsedSlots[pactLvl] || 0;
      document.getElementById('s-spell-slots').innerHTML =
        '<div class="spell-slot-grid" oncontextmenu="openSlotCtxMenu(event)">' +
        `<div class="spell-slot-box">
          <div class="slot-level">${pactLvl}</div>
          <div class="slot-pips">${Array.from({length:pactCount},(_,j)=>
            `<div class="slot-pip ${j<used?'used':''}" onclick="toggleSlot(${pactLvl},${j},${pactCount})"></div>`
          ).join('')}</div>
        </div>` +
        '</div>';
    } else {
      const slots=SLOT_TABLE[char.level||1]||SLOT_TABLE[1];
      const _slotOvs = char._slotOverrides || {};
      document.getElementById('s-spell-slots').innerHTML=
        '<div class="spell-slot-grid" oncontextmenu="openSlotCtxMenu(event)">'+
        slots.map((baseMax,i)=>{
          const lvl=i+1;
          const ov = _slotOvs[lvl] || {};
          const max = ov.override != null ? ov.override : baseMax + (ov.bonus||0);
          if(!max) return '';
          const used=sheetUsedSlots[lvl]||0;
          const compact = lvl>=6 ? ' slot-box-compact' : '';
          return `<div class="spell-slot-box${compact}">
            <div class="slot-level">${lvl}</div>
            <div class="slot-pips">${Array.from({length:max},(_,j)=>
              `<div class="slot-pip ${j<used?'used':''}" onclick="toggleSlot(${lvl},${j})"></div>`
            ).join('')}</div>
          </div>`;
        }).join('')+'</div>';
    }
  }

  const spells=char.spells||[];
  const _spellAtkBonus = getSpellAbility(char)
    ? fmtMod(pb + getMod(char.abilities?.[getSpellAbility(char)]||10))
    : null;

  const makeSpellCard = (name, idx) => {
    const sp    = (window.SPELLS||[]).find(s=>s.name===name || s.ruName===name);
    const url   = sp?.url || null;
    const lvlNum= sp?.level !== undefined ? (sp.level===0?'0':sp.level) : '?';
    const school= (sp?.school||'').replace(/\s*\(.*$/,'').trim();
    const cast  = sp?.cast || '';
    const range = sp?.range || '';
    const dur   = sp?.duration || '';
    const conc  = sp?.concentration;
    const ritual= sp?.ritual;

    // Длительность: убираем слово "Концентрация, " из строки длительности
    const durDisplay = conc
      ? dur.replace(/^Концентрация,?\s*/i, '').trim()
      : dur;

    // colour level badge
    const lvlColours=['#a0a0c0','#7ab3e8','#6dcf7a','#f0c040','#e07050','#c060e0','#e05080','#40c0e0','#ff8040','#ff4060'];
    const lvlCol = sp?.level !== undefined ? (lvlColours[sp.level]||'var(--text2)') : 'var(--text3)';
    const _ctxSpName = name.replace(/'/g, "\'");

    // Колонки: дистанция, атака, урон
    const rangeShort = range
      .replace(/\s*\([^)]*\)/g,'')  // убираем скобки типа (30-foot cone)
      .replace('футов','фт').replace('фут','фт')
      .replace('Касание','касан.')
      .replace('Неограниченная','∞')
      .trim();
    const atkVal  = sp?.hasAtk ? (_spellAtkBonus || '—') : '—';
    const dmgVal  = sp?.dmg || '—';

    // Per-spell overrides for dmg and atkbonus
    const ovr      = (currentChar?._spellOverrides || {})[idx] || {};
    const dmgFinal = ovr.dmg  !== undefined ? ovr.dmg  : (sp?.dmg  || null);
    const atkExtra = ovr.atkbonus !== undefined ? ovr.atkbonus : null;

    // Effective atk value shown in card
    let atkDisplay = '—';
    if (sp?.hasAtk && _spellAtkBonus) {
      if (atkExtra) {
        const { total: extraVal } = resolveFormula(String(atkExtra), currentChar);
        const base = pb + getMod(char.abilities?.[getSpellAbility(char)]||10);
        atkDisplay = fmtMod(base + extraVal);
      } else {
        atkDisplay = _spellAtkBonus;
      }
    }
    const saveVal  = sp?.save || null;
    const hasAtk   = !!sp?.hasAtk;
    const hasDmg   = !!dmgFinal;
    const hasSave  = !!saveVal;

    const _isPrepared = (currentChar?.preparedSpells||[]).includes(name);
    return `<div class="weapon-card sc-card${_isPrepared?' spell-prepared':''}" oncontextmenu="openSpellCtxMenu(event,'${_ctxSpName}')" onclick="openSpellDetail(${idx})">
      <div class="sc-level" style="color:${lvlCol}">${lvlNum}</div>
      <div class="sc-body">
        <div class="sc-name-row">
          <span class="sc-name">${name}</span>
          ${school ? `<span class="sc-school">${school}</span>` : ''}
          ${conc   ? `<span class="sc-badge sc-badge-conc" title="Концентрация">К</span>` : ''}
          ${ritual ? `<span class="sc-badge sc-badge-rit"  title="Ритуал">Р</span>` : ''}
        </div>
        <div class="sc-meta">
          ${cast       ? `<span>⏱ ${cast}</span>` : ''}
          ${durDisplay ? `<span>⌛ ${durDisplay}</span>` : ''}
        </div>
      </div>
      <div class="sc-sep"></div>
      <div class="sc-col sc-col-range">
        <span class="sc-col-val">${rangeShort}</span>
      </div>
      <div class="sc-sep"></div>
      <div class="sc-col sc-col-save ${hasSave ? 'sc-col-clickable' : ''}"
           onclick="event.stopPropagation();${hasSave ? `rollSpellSave(${idx})` : ''}"
           title="${hasSave ? 'Спасбросок: ' + saveVal : 'Нет спасброска'}">
        <span class="sc-col-val ${hasSave ? 'sc-val-save' : 'sc-val-dim'}">${saveVal || '—'}</span>
      </div>
      <div class="sc-sep"></div>
      <div class="sc-col sc-col-atk ${hasAtk ? 'sc-col-clickable' : ''}"
           onclick="event.stopPropagation();${hasAtk ? `rollSpellAtk(${idx})` : ''}"
           title="${hasAtk ? 'Бросок атаки заклинанием' : 'Нет броска атаки'}">
        <span class="sc-col-val ${hasAtk ? 'sc-val-atk' : 'sc-val-dim'}">${atkDisplay}</span>
      </div>
      <div class="sc-sep"></div>
      <div class="sc-col sc-col-dmg ${hasDmg ? 'sc-col-clickable' : ''}"
           onclick="event.stopPropagation();${hasDmg ? `rollSpellDmg(${idx})` : ''}"
           title="${hasDmg ? 'Бросок урона' : 'Нет урона'}">
        <span class="sc-col-val ${hasDmg ? '' : 'sc-val-dim'}">${dmgFinal || '—'}</span>
      </div>
      <span class="weapon-card-del" onclick="event.stopPropagation();_spellDel(${idx})" title="Удалить">✕</span>
    </div>`;
  };
  // Group by level
  const byLevel = {};
  spells.forEach((name,i) => {
    const found = (window.SPELLS||[]).find(sp=>sp.name===name);
    const lvl = found?.level ?? 99;
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push({name,i});
  });
  const LNAMES=['Заговоры','1 уровень','2 уровень','3 уровень','4 уровень','5 уровень','6 уровень','7 уровень','8 уровень','9 уровень'];
  let spellHtml = '';
  Object.keys(byLevel).sort((a,b)=>a-b).forEach(lvl => {
    const grpName = parseInt(lvl) < 10 ? (LNAMES[parseInt(lvl)]||`${lvl} ур.`) : 'Прочее';
    spellHtml += `<div class="sc-group-header">
      <span class="sc-gh-label">${grpName}</span>
      <div class="sc-gh-cols">
        <span class="sc-gh-col">Дист.</span>
        <span class="sc-gh-col">Спасбр.</span>
        <span class="sc-gh-col">Атака</span>
        <span class="sc-gh-col">Урон</span>
      </div>
      <span class="sc-gh-act"></span>
    </div>`;
    spellHtml += `<div class="weapon-cards">`;
    byLevel[lvl].forEach(({name,i}) => { spellHtml += makeSpellCard(name,i); });
    spellHtml += `</div>`;
  });
  document.getElementById('s-spells-list').innerHTML = spells.length
    ? spellHtml
    : '<p class="note-text">Заклинания не добавлены. Нажмите «+ Заклинание».</p>';
  // Сохраняем заметки
  const notesEl = document.getElementById('s-spells-notes');
  if (notesEl && char.spellsNotes) { notesEl.value = char.spellsNotes; rteSetValue('s-spells-notes', char.spellsNotes); }
  if (notesEl) notesEl.oninput = () => { if(currentChar) { currentChar.spellsNotes = notesEl.value; autoSave(); } };
}

function _spellDel(idx) {
  if (!currentChar?.spells) return;
  const name = currentChar.spells[idx] || 'это заклинание';
  _confirmDel('Удалить заклинание?', `Удалить «${name}»? Это действие нельзя отменить.`, () => {
    currentChar.spells.splice(idx, 1);
    // Shift overrides
    if (currentChar._spellOverrides) {
      const shifted = {};
      Object.entries(currentChar._spellOverrides).forEach(([k,v]) => {
        const ki = parseInt(k);
        if (ki < idx) shifted[ki] = v;
        else if (ki > idx) shifted[ki-1] = v;
      });
      currentChar._spellOverrides = shifted;
    }
    const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
    renderSpellsSheet(currentChar, pb);
    saveSheet();
  });
}

function toggleSlot(level, index, maxOverride) {
  if(!sheetUsedSlots[level]) sheetUsedSlots[level]=0;
  const max = maxOverride !== undefined
    ? maxOverride
    : (SLOT_TABLE[currentChar?.level||1]||SLOT_TABLE[1])[level-1];
  if(index<sheetUsedSlots[level]) sheetUsedSlots[level]=Math.max(0,sheetUsedSlots[level]-1);
  else sheetUsedSlots[level]=Math.min(max,sheetUsedSlots[level]+1);
  if(currentChar) currentChar.usedSpellSlots=sheetUsedSlots;
  const pb=currentChar?(currentChar.proficiencyBonus||profBonus(currentChar.level||1)):2;
  renderSpellsSheet(currentChar, pb);
  autoSave();
}

// ── Грузоподъёмность ─────────────────────────────────────────────────────
function getCarryCapacity(char) {
  const str = char.abilities?.['СИЛ'] ?? char.abilities?.str ?? 10;
  const size = char.size || 'Средний';
  const SIZE_MULT = {
    'Крошечный':    0.5,
    'Маленький':    1,
    'Средний':      1,
    'Большой':      2,
    'Огромный':     4,
    'Гигантский':   8,
  };
  const mult = SIZE_MULT[size] ?? 1;
  const base = Math.round(str * 15 * mult);
  // Override completely, or add bonus
  const capacity = char.carryOverride != null
    ? char.carryOverride
    : base + (char.carryBonus || 0);
  const pushPull   = Math.round(capacity * 2);
  const encumbered = Math.round(capacity * (5/15));
  const heavyEnc   = Math.round(capacity * (10/15));
  return { capacity, pushPull, encumbered, heavyEnc, size, str, mult,
           base, bonus: char.carryBonus||0, override: char.carryOverride??null };
}


// ── Диалог настройки грузоподъёмности ────────────────────────────────
function openCarryDialog() {
  if (!currentChar) return;
  const cc = getCarryCapacity(currentChar);
  document.getElementById('carry-dlg-base').textContent  = cc.base + ' фнт.';
  document.getElementById('carry-dlg-bonus').value       = cc.bonus || 0;
  document.getElementById('carry-dlg-override').value    = cc.override != null ? cc.override : '';
  _updateCarryDialogPreview();
  document.getElementById('carry-dialog-overlay').classList.remove('hidden');
}

function closeCarryDialog() {
  document.getElementById('carry-dialog-overlay').classList.add('hidden');
}

function _updateCarryDialogPreview() {
  const cc   = getCarryCapacity(currentChar);
  const bonus = parseInt(document.getElementById('carry-dlg-bonus')?.value) || 0;
  const ovStr = document.getElementById('carry-dlg-override')?.value.trim();
  const ov    = ovStr !== '' ? parseInt(ovStr) : null;
  const result = ov != null ? ov : (cc.base + bonus);
  const el = document.getElementById('carry-dlg-preview');
  if (el) {
    const diff = result - cc.capacity;
    el.textContent = `Итого: ${result} фнт. (~${(result*0.453592).toFixed(0)} кг)`;
    el.style.color = ov != null ? '#f0c040' : diff > 0 ? '#7fd480' : diff < 0 ? '#e07070' : 'var(--text2)';
  }
}

function applyCarryDialog() {
  if (!currentChar) return;
  const bonus = parseInt(document.getElementById('carry-dlg-bonus')?.value) || 0;
  const ovStr = document.getElementById('carry-dlg-override')?.value.trim();
  const ov    = ovStr !== '' ? parseInt(ovStr) : null;
  if (!isNaN(bonus)) currentChar.carryBonus    = bonus || 0;
  if (ov != null)    currentChar.carryOverride  = ov;
  else               delete currentChar.carryOverride;
  closeCarryDialog();
  renderInventorySheet(currentChar);
  saveSheet();
  toast(`⚖️ Грузоподъёмность: ${getCarryCapacity(currentChar).capacity} фнт.`, 'success');
}

function calcTotalWeight(char) {
  return (char.inventory || []).reduce((sum, it) => {
    const qty = it.qty || 1;
    // Try to find weight from items library
    let wt = it.weight ?? it.weightLbs ?? 0;
    if (!wt && it.id && window.findItemById) {
      const found = window.findItemById(it.id);
      if (found) wt = found.weightLbs || 0;
    }
    return sum + (parseFloat(wt) || 0) * qty;
  }, 0);
}


// ── Сортировка инвентаря ─────────────────────────────────────────────────
// key: 'name'|'qty'|'wt'|'cost'   dir: 1=asc, -1=desc
let _invSort = { key: null, dir: 1 };
function setInvSort(key) {
  if (_invSort.key === key) {
    _invSort.dir *= -1;
  } else {
    _invSort.key = key;
    _invSort.dir = key === 'name' ? 1 : -1; // числовые — сразу по убыванию
  }
  if (currentChar) renderInventorySheet(currentChar);
}
function renderInventorySheet(char) {
  const items = char.inventory || [];

  // ── Carry capacity block ─────────────────────────────────────────────
  const cc  = getCarryCapacity(char);
  const tw  = calcTotalWeight(char);
  const pct = cc.capacity > 0 ? Math.min(1, tw / cc.capacity) : 0;
  const kg  = (tw * 0.453592).toFixed(1);
  const capKg = (cc.capacity * 0.453592).toFixed(0);

  // Color: green → yellow → red
  const barColor = pct < 0.5 ? '#4caf7d' : pct < 0.85 ? '#f0c040' : '#e05555';
  const statusLabel = pct >= 1       ? '⛔ Перегружен'
                    : pct >= 10/15   ? '🔴 Тяжёлый штраф'  // > 10×STR
                    : pct >= 5/15    ? '🟡 Лёгкий штраф'   // > 5×STR
                    : '🟢 Норма';

  const sizeNote = cc.mult !== 1
    ? ` <span style="color:#7bafd4;font-size:.72rem">(размер: ${cc.size}, ×${cc.mult})</span>`
    : '';

  const carryModNote = cc.override != null
    ? ` <span style="color:#f0c040;font-size:.7rem" title="Жёсткое значение">(★ ${cc.override} фнт.)</span>`
    : cc.bonus ? ` <span style="color:#7fd480;font-size:.7rem">(+${cc.bonus} фнт.)</span>`
    : '';

  const carryHtml = `
    <div class="carry-block" onclick="openCarryDialog()" style="cursor:pointer" title="Настроить грузоподъёмность">
      <div class="carry-header">
        <span class="carry-title">Грузоподъёмность</span>
        ${sizeNote}${carryModNote}
        <span class="carry-status">${statusLabel}</span>
      </div>
      <div class="carry-bar-wrap">
        <div class="carry-bar" style="width:${(pct*100).toFixed(1)}%;background:${barColor}"></div>
        <div class="carry-markers">
          <div class="carry-marker" style="left:${(5/15*100).toFixed(1)}%" title="Лёгкий штраф (${cc.encumbered} фнт.)"></div>
          <div class="carry-marker" style="left:${(10/15*100).toFixed(1)}%" title="Тяжёлый штраф (${cc.heavyEnc} фнт.)"></div>
        </div>
      </div>
      <div class="carry-stats">
        <span><b>${tw.toFixed(1)}</b> / <b>${cc.capacity}</b> фнт.
          <span style="color:#8899bb">(${kg} / ~${capKg} кг)</span>
        </span>
        <span style="color:#8899bb;font-size:.75rem">
          Толкать/тащить: ${cc.pushPull} фнт. &nbsp;·&nbsp;
          СИЛ ${cc.str} × 15${cc.mult!==1?' × '+cc.mult:''}
        </span>
      </div>
    </div>`;

  // ── Inventory list ────────────────────────────────────────────────────
  const TYPE_ORDER  = ['weapon','firearm','ammo','firearm_ammo','explosive','armor','tool','gear','kit',null,''];
  const TYPE_LABELS = {
    weapon:'⚔️ Оружие', firearm:'🔫 Огнестрел', ammo:'🏹 Боеприпасы', firearm_ammo:'🔫 Огнестрельные боеприпасы',
    explosive:'💣 Взрывчатка', armor:'🛡 Доспехи', gear:'🎒 Снаряжение',
    tool:'🔧 Инструменты', kit:'📦 Наборы', special:'✨ Прочее',
  };

  function resolveItem(item) {
    const src = item.id ? window.findItemById?.(item.id) : null;
    let cls = item.itemClass || src?.itemClass || null;
    // 'special' items display in the Gear section (no separate block)
    if (cls === 'special') cls = 'gear';
    // Свойства оружия в подпись
    const props = src?.properties || [];
    const PROP_LBL = {
      'two-handed':'Двуручное','versatile':'Универсальное','finesse':'Фехтовальное',
      'light':'Лёгкое','heavy':'Тяжёлое','reach':'Досягаемость',
      'thrown':'Метательное','loading':'Перезарядка','special':'Особое',
    };
    const propParts = [];
    props.forEach(p => {
      if (PROP_LBL[p.id]) {
        propParts.push(PROP_LBL[p.id]);
        if ((p.id === 'thrown' || p.id === 'ammunition') && p.range)
          propParts.push(p.range);
      }
    });
    return {
      cls,
      wt:        item.weight  ?? src?.weightLbs ?? null,
      cost:      item.costGp  ?? src?.costGp    ?? null,
      dmg:       item.damageDice || src?.damageDice || null,
      dmgType:   item.damageType || src?.damageType || null,
      ac:        item.ac      ?? src?.ac         ?? null,
      category:  item.category || src?.category || null,
      stackSize: item.stackSize ?? src?.stackSize ?? null,
      propTags:  propParts.join(' · ') || null,
    };
  }

  // Sort by type, keep original indices for mutations
  const indexed = items.map((item, i) => ({ item, i, r: resolveItem(item) }));
  indexed.sort((a, b) => {
    // Первичная сортировка — всегда по категории
    const ca = a.r.cls, cb = b.r.cls;
    const ia = TYPE_ORDER.indexOf(ca); const ib = TYPE_ORDER.indexOf(cb);
    const typeDiff = (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    if (typeDiff !== 0) return typeDiff;
    // Вторичная — по выбранному столбцу
    const k = _invSort.key, d = _invSort.dir;
    if (!k) return 0;
    if (k === 'name') {
      return d * (a.item.name || '').localeCompare(b.item.name || '', 'ru');
    }
    if (k === 'qty') {
      return d * ((a.item.qty || 1) - (b.item.qty || 1));
    }
    if (k === 'wt') {
      const wa = (a.r.wt ?? -Infinity) * (a.item.qty || 1);
      const wb = (b.r.wt ?? -Infinity) * (b.item.qty || 1);
      return d * (wa - wb);
    }
    if (k === 'cost') {
      const ca2 = (a.r.cost ?? -Infinity) * (a.item.qty || 1);
      const cb2 = (b.r.cost ?? -Infinity) * (b.item.qty || 1);
      return d * (ca2 - cb2);
    }
    return 0;
  });

  let listHtml = '';
  if (!indexed.length) {
    listHtml = '<p class="note-text">Инвентарь пуст.</p>';
  } else {
    let lastCls = '__none__';
    for (const { item, i, r } of indexed) {
      const cls = r.cls || 'special';

      // ── Section divider with column headers ──────────────────────────
      if (cls !== lastCls) {
        lastCls = cls;
        const _ghSortArrow = (k) => {
          if (_invSort.key !== k) return '<span class="inv-gh-sort-arrow">⇅</span>';
          return `<span class="inv-gh-sort-arrow active">${_invSort.dir > 0 ? '↑' : '↓'}</span>`;
        };
        listHtml += `<div class="inv-group-header">`
          + `<span class="inv-gh-label inv-gh-name-btn" onclick="setInvSort('name')" title="Сортировать по названию">`
          + `${TYPE_LABELS[cls] || '📦 Прочее'}${_invSort.key==='name' ? ' '+(_invSort.dir>0?'↑':'↓') : ''}`
          + `</span>`
          + `<div class="inv-gh-cols">`
          + `<span class="inv-gh-col inv-gh-sortbtn" onclick="setInvSort('qty')" title="Сортировать по количеству">Кол.${_ghSortArrow('qty')}</span>`
          + `<span class="inv-gh-col inv-gh-sortbtn" onclick="setInvSort('wt')" title="Сортировать по весу">Вес${_ghSortArrow('wt')}</span>`
          + `<span class="inv-gh-col inv-gh-sortbtn" onclick="setInvSort('cost')" title="Сортировать по стоимости">Стоим.${_ghSortArrow('cost')}</span>`
          + `</div><span class="inv-gh-act"></span></div>`;
      }

      const qty     = item.qty || 1;
      const wtVal   = r.wt  ?? null;
      const costVal = r.cost ?? null;

      // Total weight: integer → no decimals, float → 1 decimal
      const totalWtNum = wtVal != null ? wtVal * qty : null;
      const totalWtStr = totalWtNum != null
        ? (Number.isInteger(totalWtNum) ? String(totalWtNum) : totalWtNum.toFixed(1))
        : '—';
      // Total cost = unit cost × qty; show integer if whole, else up to 2 decimals
      const totalCostNum = costVal != null ? costVal * qty : null;
      const costStr = totalCostNum != null
        ? (Number.isInteger(totalCostNum) ? String(totalCostNum) : parseFloat(totalCostNum.toFixed(2)).toString())
        : '—';

      // Key stat badge
      let keyStat = '';
      if ((cls === 'weapon' || cls === 'firearm') && r.dmg)
        keyStat = `<span class="inv-key-stat inv-stat-dmg">${r.dmg}${r.dmgType ? ' ' + r.dmgType : ''}</span>`;
      else if (cls === 'armor' && r.ac != null)
        keyStat = `<span class="inv-key-stat inv-stat-ac">КД ${r.ac}</span>`;

      listHtml += `
      <div class="inv-row" oncontextmenu="openInvCtxMenu(event,${i})" onclick="openInvItemDetail(${i})">
        <div class="inv-main">
          <div class="inv-name-row">
            <span class="inv-item-name">${item.name || '<em style="opacity:.4">без названия</em>'}</span>
            ${keyStat}
          </div>
          ${r.category ? `<div class="inv-subinfo">${r.category}${r.propTags ? ' · '+r.propTags : ''}</div>` : ''}
        </div>
        <div class="inv-stats-row">
          <div class="inv-qty-cell">
            <button class="inv-qty-btn" onclick="event.stopPropagation();invQtyAdj(${i},-1)">−</button>
            <input type="number" class="inv-qty" value="${qty}" min="0"
              onclick="event.stopPropagation()"
              oninput="currentChar.inventory[${i}].qty=parseInt(this.value)||0;renderInventorySheet(currentChar);autoSave()">
            <button class="inv-qty-btn" onclick="event.stopPropagation();invQtyAdj(${i},+1)">+</button>
          </div>
          <div class="inv-stat-val">${totalWtStr}</div>
          <div class="inv-stat-val ${costVal != null ? 'inv-cost-val' : ''}">${costStr}</div>
        </div>
        <div class="inv-actions">
          <span class="inv-del" onclick="event.stopPropagation();_invDel(${i})" title="Продать / Выбросить">✕</span>
        </div>
      </div>`;
    }
  }

  const invBtnsHtml = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:.5rem;position:relative;margin-top:.4rem">
      <button class="dice-btn" onclick="openRestBrowser()" style="margin-right:.4rem">🍖 Питание и постой</button>
      <button class="dice-btn" onclick="openAddItemMenu(this)">+ Предмет ▾</button>
      <div id="add-item-menu" style="display:none;position:absolute;top:100%;right:0;z-index:500;
        background:#1e2740;border:1px solid #3a4a66;border-radius:6px;min-width:170px;
        box-shadow:0 4px 16px rgba(0,0,0,.45);overflow:hidden;margin-top:3px">
        <button onclick="closeAddItemMenu();openCreateItemDialog()"
          style="display:block;width:100%;text-align:left;background:none;border:none;
            padding:.5rem .9rem;color:var(--text);font-size:.86rem;cursor:pointer"
          onmouseover="this.style.background='rgba(255,255,255,.07)'"
          onmouseout="this.style.background='none'">✏️ Создать новый</button>
        <button onclick="closeAddItemMenu();openItemsBrowser()"
          style="display:block;width:100%;text-align:left;background:none;border:none;
            padding:.5rem .9rem;color:var(--text);font-size:.86rem;cursor:pointer"
          onmouseover="this.style.background='rgba(255,255,255,.07)'"
          onmouseout="this.style.background='none'">📦 Выбрать стандартное</button>
      </div>
    </div>`;
  document.getElementById('s-inventory').innerHTML = carryHtml + invBtnsHtml + listHtml;
}

function addSheetItem() { openCreateItemDialog(); }

function renderFeaturesSheet(char) {
  const featEl = document.getElementById('s-features');
  if (!featEl) return;
  // If user already edited the textarea, don't overwrite
  if (char._featTextEdited) return;
  const p=[];
  if(char.racialTraits)  p.push(`РАСОВЫЕ ЧЕРТЫ (${char.raceName})\n${char.racialTraits}`);
  if(char.classFeatures) p.push(`\nЧЕРТЫ КЛАССА (${char.className})\n${char.classFeatures}`);
  if(char.subclass)      p.push(`\nПОДКЛАСС: ${char.subclass}`);
  if(char.fightingStyle) p.push(`\nБОЕВОЙ СТИЛЬ: ${char.fightingStyle}`);
  if(char.hasFeat)       p.push(`\nЧЕРТА: [Выберите черту персонажа]`);
  if(char.traits)        p.push(`\nЧЕРТЫ ХАРАКТЕРА: ${char.traits}`);
  if(char.ideals)        p.push(`\nИДЕАЛЫ: ${char.ideals}`);
  if(char.bonds)         p.push(`\nПРИВЯЗАННОСТИ: ${char.bonds}`);
  if(char.flaws)         p.push(`\nСЛАБОСТИ: ${char.flaws}`);
  if(char.backstory)     p.push(`\nИСТОРИЯ: ${char.backstory}`);
  const featVal = char.savedFeatText ?? (p.join('\n') || '');
  featEl.value = featVal;
  rteSetValue('s-features', featVal);
  featEl.oninput = () => { char.savedFeatText = featEl.value; char._featTextEdited = true; };
}

// ── ДЕЙСТВИЯ НА ЛИСТЕ ──
function updateHpDisplay() {
  const cur = parseInt(document.getElementById('s-hp-cur')?.value)||0;
  const max = Math.min(10000, parseInt(document.getElementById('s-hp-max')?.value)||1);
  const tmp = parseInt(document.getElementById('s-hp-tmp')?.value)||0;
  if (currentChar) { currentChar.hpCurrent = cur; currentChar.hpTemp = tmp; }

  // Цвет по порогу (LSS: good / tolerable / bad)
  const pct = max > 0 ? cur / max : 0;
  const cls = pct > 2/3 ? 'full' : pct > 1/3 ? 'medium' : 'low';
  const barColor = cls === 'full' ? 'var(--c-health)' : cls === 'medium' ? 'var(--c-yellow-6)' : 'var(--c-red-6)';

  // HP bar
  const bar = document.getElementById('hp-bar');
  if (bar) {
    bar.style.width = (max > 0 ? Math.max(0, Math.min(1, cur/max)) * 100 : 0) + '%';
    bar.style.background = barColor;
  }

  // Обновляем видимые спаны в шапке
  const curDisp = document.getElementById('hp-cur-disp');
  const maxDisp = document.getElementById('hp-max-disp');
  const heart   = document.getElementById('hp-heart');
  if (curDisp) { curDisp.textContent = cur; curDisp.style.color = barColor; }
  if (maxDisp) maxDisp.textContent = max;
  if (heart)   heart.style.color   = barColor;
  // Tmp HP inline: "10/18(+5)"
  const tmpInl = document.getElementById('hp-tmp-inline');
  if (tmpInl) {
    if (tmp > 0) { tmpInl.textContent = '(+'+tmp+')'; tmpInl.classList.remove('hidden'); }
    else { tmpInl.textContent = ''; tmpInl.classList.add('hidden'); }
  }

  // Цвет числа текущих хитов в скрытом input
  const curEl = document.getElementById('s-hp-cur');
  if (curEl) curEl.style.color = barColor;

  // Синхроним диалог если открыт
  const curBig = document.getElementById('hpd-cur-big');
  const maxBig = document.getElementById('hpd-max-big');
  const tmpBig = document.getElementById('hpd-tmp-big');
  if (curBig) { curBig.textContent = cur; curBig.className = 'hp-'+cls; }
  if (maxBig) maxBig.textContent = max;
  if (tmpBig) { if (tmp>0){tmpBig.textContent='(+'+tmp+' врем.)';tmpBig.style.display='inline';}else{tmpBig.style.display='none';} }
  // Show/hide death saves panel
  if (typeof _syncDeathSavesVisibility === 'function') _syncDeathSavesVisibility();
}

// Алиас для обратной совместимости
function updateHpBar() { updateHpDisplay(); }

function healDamage(type) {
  const amt = parseInt(document.getElementById('adj-amount')?.value)||0;
  const curEl = document.getElementById('s-hp-cur');
  const maxEl = document.getElementById('s-hp-max');
  const tmpEl = document.getElementById('s-hp-tmp');
  const cur = parseInt(curEl?.value)||0;
  const max = Math.min(10000, parseInt(maxEl?.value)||10);
  const tmp = parseInt(tmpEl?.value)||0;
  if (type === 'heal') {
    if (curEl) curEl.value = Math.min(max, cur + amt);
  } else {
    let remaining = amt;
    const newTmp = Math.max(0, tmp - remaining);
    remaining = Math.max(0, remaining - tmp);
    if (tmpEl) tmpEl.value = newTmp;
    if (curEl) curEl.value = Math.max(0, cur - remaining);
  }
  const amtEl = document.getElementById('adj-amount');
  if (amtEl) amtEl.value = 0;
  updateHpDisplay();
}

function toggleInspiration() {
  if (!currentChar) return;
  currentChar.inspiration = !currentChar.inspiration;
  updateQuickstatBar();
}

// ── КВИКСТАТ-ПАНЕЛЬ ──────────────────────────────────────────────

const CONDITIONS_LIST = [
  'Ослеплён','Очарован','Оглушён','Испуган','Схвачен','Недееспособен',
  'Невидим','Отравлен','Лежит','Обездвижен','Оглушён','Без сознания',
  'Истощён','Окаменел'
];

function updateQuickstatBar() {
  if (!currentChar) return;

  // Инициатива
  const dexMod = getMod(currentChar.abilities?.['ЛОВ']||10);
  const initVal = currentChar._initOverride != null
    ? currentChar._initOverride
    : dexMod + (currentChar.initiative||0);
  const qsInit = document.getElementById('qs-init-val');
  if (qsInit) qsInit.textContent = fmtMod(initVal);

  // Вдохновение
  const on = !!currentChar.inspiration;
  const starEl = document.getElementById('s-insp-icon');
  if (starEl) { starEl.textContent = on ? '★' : '☆'; starEl.classList.toggle('on', on); }
  const inspBox = document.getElementById('qs-insp-box');
  if (inspBox) inspBox.classList.toggle('on', on);

  // Истощение
  const exh = currentChar.exhaustion || 0;
  const exhSel = document.getElementById('s-exhaustion');
  if (exhSel) exhSel.value = exh;
  const exhBox = document.getElementById('qs-exh-box');
  if (exhBox) {
    exhBox.classList.toggle('ex-active', exh >= 1 && exh <= 2);
    exhBox.classList.toggle('ex-high',   exh >= 3);
  }

  // Состояния
  const conds = currentChar.conditions || [];
  const condText = document.getElementById('qs-cond-text');
  if (condText) {
    if (conds.length === 0) {
      condText.textContent = 'нет'; condText.className = 'qs-cond-text empty';
    } else {
      const displayConds = conds.map(c => c.startsWith('__custom__') ? c.replace('__custom__', '') : c);
      condText.textContent = displayConds.join(', '); condText.className = 'qs-cond-text';
    }
  }
}

function setExhaustion(val) {
  if (!currentChar) return;
  currentChar.exhaustion = parseInt(val)||0;
  updateQuickstatBar();
}

function openConditionsDialog() {
  const overlay = document.getElementById('cond-dialog-overlay');
  if (!overlay) return;
  const grid = document.getElementById('cond-check-grid');
  const active = new Set(currentChar?.conditions||[]);
  if (grid) {
    grid.innerHTML = CONDITIONS_LIST.map(c => {
      const chk = active.has(c);
      return `<label class="cond-check-label ${chk?'checked':''}" id="cond-lbl-${c.replace(/[^а-яёa-z]/gi,'_')}">
        <input type="checkbox" ${chk?'checked':''} onchange="toggleCondition('${c}',this);autoSave()">
        ${c}
      </label>`;
    }).join('');
  }
  // Populate custom input
  const customEl = document.getElementById('cond-custom-input');
  if (customEl) {
    const customVal = (currentChar?.conditions || [])
      .find(c => c.startsWith('__custom__'));
    customEl.value = customVal ? customVal.replace('__custom__', '') : '';
  }
  overlay.classList.remove('hidden');
}

function closeConditionsDialog() {
  document.getElementById('cond-dialog-overlay')?.classList.add('hidden');
}

function toggleCondition(name, el) {
  if (!currentChar) return;
  if (!currentChar.conditions) currentChar.conditions = [];
  const label = el.closest('.cond-check-label');
  if (el.checked) {
    if (!currentChar.conditions.includes(name)) currentChar.conditions.push(name);
    if (label) label.classList.add('checked');
  } else {
    currentChar.conditions = currentChar.conditions.filter(c => c !== name);
    if (label) label.classList.remove('checked');
  }
  updateQuickstatBar();
}

function setCustomCondition(val) {
  if (!currentChar) return;
  const key = '__custom__';
  if (!currentChar.conditions) currentChar.conditions = [];
  // Remove old custom entry
  currentChar.conditions = currentChar.conditions.filter(c => !c.startsWith(key));
  if (val.trim()) currentChar.conditions.push(key + val.trim());
  updateQuickstatBar();
}

// ── shared AC display updater ─────────────────────────────────────────────
function _updateAcDisplay() {
  const el = document.getElementById('s-ac-input');
  if (el) el.textContent = currentChar.ac || 10;
}

// ── AC dialog (right-click on shield) ────────────────────────────────────
function openAcDialog(e, prefillFormula) {
  if (e) e.preventDefault();
  const overlay = document.getElementById('ac-dialog-overlay');
  if (!overlay) return;
  document.getElementById('acd-bonus').value    = 0;
  // Pre-fill override with existing formula or prefill from armor equip
  const formula = prefillFormula || currentChar.acFormula || '';
  document.getElementById('acd-override').value = formula;
  document.getElementById('acd-current-display').textContent = currentChar.ac || 10;
  updateAcDialogPreview();
  overlay.classList.remove('hidden');
}

function closeAcDialog() {
  document.getElementById('ac-dialog-overlay')?.classList.add('hidden');
}

function updateAcDialogPreview() {
  const shield   = currentChar.shieldEquipped ? 2 : 0;
  const bonus    = parseInt(document.getElementById('acd-bonus')?.value) || 0;
  const override = document.getElementById('acd-override')?.value.trim();
  const prev     = currentChar.ac || 10;
  const base     = currentChar.acBase || currentChar.ac || 10;

  let next;
  if (override !== '') {
    // Try formula first (may contain [ЛОВ] etc.), fallback to plain int
    const fromFormula = _evalAcFormula(override, currentChar);
    next = fromFormula + shield + bonus;
  } else {
    next = base + shield + bonus;
  }

  const el = document.getElementById('acd-preview');
  if (el) {
    const overrideVal = document.getElementById('acd-override')?.value.trim();
    const hint = overrideVal ? ` (${overrideVal})` : '';
    if (next === prev && !bonus) {
      el.textContent = '';
    } else {
      el.textContent = `КБ: ${prev} → ${next}${hint}`;
      el.style.color = next > prev ? '#4cbe80' : next < prev ? '#e05858' : 'var(--text3)';
    }
  }
}

function applyAcDialog() {
  const bonus    = parseInt(document.getElementById('acd-bonus')?.value) || 0;
  const override = document.getElementById('acd-override')?.value.trim();
  const shield   = currentChar.shieldEquipped ? 2 : 0;

  if (override !== '') {
    // Save formula string so it can be re-evaluated when abilities change
    currentChar.acFormula = override;
    const baseVal = _evalAcFormula(override, currentChar);
    currentChar.acBase = baseVal + bonus;
    currentChar.ac     = currentChar.acBase + shield;
  } else if (bonus !== 0) {
    currentChar.acFormula = '';  // no formula when using raw bonus
    currentChar.acBase = (currentChar.acBase || currentChar.ac || 10) + bonus;
    currentChar.ac     = currentChar.acBase + shield;
  }

  _updateAcDisplay();
  closeAcDialog();
  saveSheet();
  toast(`🛡 КБ обновлён: ${currentChar.ac}`, 'success');
}

// ── INITIATIVE DIALOG (right-click) ──────────────────────────────────────
function openInitDialog(e) {
  if (e) e.preventDefault();
  const overlay = document.getElementById('init-dialog-overlay');
  if (!overlay) return;
  const dexMod = getMod(currentChar.abilities?.['ЛОВ'] || 10);
  const currentInit = dexMod + (currentChar.initiative || 0);
  document.getElementById('initd-bonus').value = 0;
  document.getElementById('initd-override').value = currentChar._initOverride != null ? currentChar._initOverride : '';
  document.getElementById('initd-current-display').textContent = fmtMod(currentInit);
  updateInitDialogPreview();
  overlay.classList.remove('hidden');
}

function closeInitDialog() {
  document.getElementById('init-dialog-overlay')?.classList.add('hidden');
}

function updateInitDialogPreview() {
  const dexMod  = getMod(currentChar.abilities?.['ЛОВ'] || 10);
  const bonus   = parseInt(document.getElementById('initd-bonus')?.value) || 0;
  const overStr = document.getElementById('initd-override')?.value.trim();
  const prev    = dexMod + (currentChar.initiative || 0);

  let next;
  if (overStr !== '') {
    const v = parseInt(overStr);
    next = isNaN(v) ? prev : v + bonus;
  } else {
    next = prev + bonus;
  }

  const el = document.getElementById('initd-preview');
  if (el) {
    if (next === prev && !bonus && overStr === '') {
      el.textContent = '';
    } else {
      const hint = overStr ? ` (жёстко: ${overStr})` : '';
      el.textContent = `Инициатива: ${fmtMod(prev)} → ${fmtMod(next)}${hint}`;
      el.style.color = next > prev ? '#4cbe80' : next < prev ? '#e05858' : 'var(--text3)';
    }
  }
}

function applyInitDialog() {
  const bonus   = parseInt(document.getElementById('initd-bonus')?.value) || 0;
  const overStr = document.getElementById('initd-override')?.value.trim();

  if (overStr !== '') {
    const v = parseInt(overStr);
    if (!isNaN(v)) {
      currentChar._initOverride = v + bonus;
      currentChar.initiative = 0; // override takes full control
    }
  } else {
    currentChar._initOverride = null;
    currentChar.initiative = (currentChar.initiative || 0) + bonus;
  }

  _updateQuickStats();
  closeInitDialog();
  saveSheet();
  const dexMod = getMod(currentChar.abilities?.['ЛОВ'] || 10);
  const total = currentChar._initOverride != null
    ? currentChar._initOverride
    : dexMod + (currentChar.initiative || 0);
  toast(`⚡ Инициатива обновлена: ${fmtMod(total)}`, 'success');
}

function toggleShield() {
  if (!currentChar) return;
  currentChar.shieldEquipped = !currentChar.shieldEquipped;
  const on = currentChar.shieldEquipped;
  // Diamond toggle
  const diamond = document.getElementById('shield-diamond');
  if (diamond) diamond.classList.toggle('on', on);
  // SVG wrap glow
  const wrap = document.getElementById('ac-shield-wrap');
  if (wrap) wrap.classList.toggle('shield-on', on);
  // SVG stroke colour
  const path = document.getElementById('ac-shield-path');
  if (path) path.setAttribute('stroke', on ? 'rgba(200,160,50,0.9)' : 'rgba(255,255,255,0.75)');
  // Recalc AC
  if (!currentChar.acBase) currentChar.acBase = currentChar.ac || 10;
  currentChar.ac = currentChar.acBase + (on ? 2 : 0);
  _updateAcDisplay();
  saveSheet();
}


// ── HP DIALOG ──
function openHpDialog() {
  const o = document.getElementById('hp-dialog-overlay');
  if (!o) return;
  updateHpDisplay(); // синхронизирует big числа
  document.getElementById('hpd-amount').value = '';
  document.getElementById('hpd-tmp-add').value = '';
  // Prefill max override field
  const maxEl = document.getElementById('s-hp-max');
  const overrideEl = document.getElementById('hpd-max-override');
  if (overrideEl && maxEl) overrideEl.value = maxEl.value || '';
  _syncDeathSavesVisibility();
  _refreshLevelUpLabel();
  o.classList.remove('hidden');
}
function closeHpDialog() {
  const o = document.getElementById('hp-dialog-overlay');
  if (o) o.classList.add('hidden');
}
function applyHpChange(sign) {
  const amt = parseInt(document.getElementById('hpd-amount')?.value)||0;
  if (!amt) return;
  const curEl = document.getElementById('s-hp-cur');
  const maxEl = document.getElementById('s-hp-max');
  const tmpEl = document.getElementById('s-hp-tmp');
  const cur = parseInt(curEl?.value)||0;
  const max = Math.min(10000, parseInt(maxEl?.value)||10);
  const tmp = parseInt(tmpEl?.value)||0;
  if (!sign) sign = amt >= 0 ? 1 : -1;
  const absAmt = Math.abs(amt);
  if (sign > 0) {
    curEl.value = Math.min(max, cur + absAmt);
  } else {
    let rem = absAmt;
    tmpEl.value = Math.max(0, tmp - rem);
    rem = Math.max(0, rem - tmp);
    curEl.value = Math.max(0, cur - rem);
  }
  document.getElementById('hpd-amount').value = '';
  updateHpDisplay();
  if (currentChar) saveSheet();
}
function applyTmpHp() {
  const add = parseInt(document.getElementById('hpd-tmp-add')?.value)||0;
  if (!add) return;
  const tmpEl = document.getElementById('s-hp-tmp');
  const cur = parseInt(tmpEl?.value)||0;
  // Временные хиты не складываются — берём большее
  tmpEl.value = Math.max(cur, add);
  document.getElementById('hpd-tmp-add').value = '';
  updateHpDisplay();
  if (currentChar) saveSheet();
}
function rollDice(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
}
// Карта: (diceCount,bonus) → id предмета и название зелья
const _POTION_MAP = {
  '2_2':  { id: 'potion_healing',             name: 'Зелье лечения' },
  '4_4':  { id: 'potion_of_greater_healing',  name: 'Зелье большого лечения' },
  '8_8':  { id: 'potion_of_superior_healing', name: 'Зелье отличного лечения' },
  '10_20':{ id: 'potion_of_supreme_healing',  name: 'Зелье превосходного лечения' },
};

function _applyPotionHeal(diceCount, diceSides, bonus, potionName) {
  const rolled = rollDice(diceCount, diceSides);
  const heal   = rolled + bonus;

  const max = Math.min(10000, currentChar.hpMax || 10);
  const cur = currentChar.hpCurrent || 0;
  const newHp = Math.min(max, cur + heal);
  currentChar.hpCurrent = newHp;

  const curEl = document.getElementById('s-hp-cur');
  if (curEl) curEl.value = newHp;
  updateHpDisplay();
  saveSheet();

  pushRoll(`Зелье (${diceCount}к${diceSides}+${bonus})`, heal, `${rolled}+${bonus} (${diceCount}к${diceSides}+${bonus})`);
  const msg = potionName
    ? `🧪 Вы восстановили ${heal} здоровья, из инвентаря списано: ${potionName}`
    : `🧪 Зелье: +${heal} хитов`;
  toast(msg, 'success', 6000);
}

function drinkPotion(diceCount, diceSides, bonus) {
  const key    = `${diceCount}_${bonus}`;
  const potion = _POTION_MAP[key];

  // Ищем зелье в инвентаре
  const inv   = currentChar?.inventory || [];
  const idx   = potion ? inv.findIndex(it => it.id === potion.id || it.name === potion.name) : -1;
  const found = idx !== -1 ? inv[idx] : null;

  if (found) {
    if ((found.qty || 1) > 1) {
      found.qty = (found.qty || 1) - 1;
    } else {
      inv.splice(idx, 1);
    }
    renderInventorySheet?.(currentChar);
    _applyPotionHeal(diceCount, diceSides, bonus, potion.name);
  } else {
    const potionName = potion?.name || `Зелье (${diceCount}к${diceSides}+${bonus})`;
    _showConfirmDialog(
      `В инвентаре нет: «${potionName}».<br>Всё равно выпить?`,
      [
        { label: 'Отмена', secondary: true },
        { label: 'Всё равно выпить', action: () => _applyPotionHeal(diceCount, diceSides, bonus) }
      ]
    );
  }
}
// Тултип зелья — задержка 2 сек
let potionTooltipTimer = null;
function startPotionTooltip(btn) {
  potionTooltipTimer = setTimeout(() => btn.classList.add('tooltip-visible'), 2000);
}
function clearPotionTooltip(btn) {
  clearTimeout(potionTooltipTimer);
  btn.classList.remove('tooltip-visible');
}

function toggleDS(el) {
  el.classList.toggle('filled');
  if(!currentChar) return;
  if(!currentChar.deathSaves) currentChar.deathSaves={successes:[false,false,false],failures:[false,false,false]};
  document.querySelectorAll('.success-pip').forEach((p,i)=>currentChar.deathSaves.successes[i]=p.classList.contains('filled'));
  document.querySelectorAll('.fail-pip').forEach((p,i)=>currentChar.deathSaves.failures[i]=p.classList.contains('filled'));
}

function onSheetStatChange(field, el) {
  if(!currentChar) return;
  const v=parseInt(el.value)||0;
  currentChar[field]=v;
  if(field==='ac'){
    // Reset base AC and reapply shield
    currentChar.acBase = currentChar.shieldEquipped ? v - 2 : v;
    _updateAcDisplay();
  }
  if(field==='level'){
    currentChar.proficiencyBonus=profBonus(v);
    renderSheet(currentChar);
  }
  autoSave();
}

// ── ПЕРЕКЛЮЧЕНИЕ ТЕМ ──
function openSettings() {
  const m=document.getElementById('settings-modal');
  if(m) m.style.display='flex';
}
function closeSettings() {
  const m=document.getElementById('settings-modal');
  if(m) m.style.display='none';
}

// ══════════════════════════════════════════════════════════
// 🎲 СЛУЧАЙНЫЙ ПЕРСОНАЖ
// ══════════════════════════════════════════════════════════

const ALL_LANGS = [
  'Акван','Аурал','Ведалкенский','Великаний','Воронечный',
  'Гигантский','Гитский','Глубинный','Гноллский','Гномий',
  'Гоблинский','Дварфийский','Драконий','Змеиный','Инфернальный',
  'Квори','Леонин','Локсодон','Минотаврий','Небесный',
  'Общий','Орочий','Первичный','Подземный','Полурослячий',
  'Примордиальный','Северный','Сильван','Теневой','Эльфийский',
  'Южный',
];

const RANDOM_NAMES_M = [
  'Арен','Кейдар','Торвин','Лирел','Занир','Браун','Фелин','Дарос','Эмон',
  'Вирен','Нальдо','Таэлин','Сирус','Бранд','Ралик','Зефир','Аэлар','Горм',
  'Хейдар','Волдрик','Сиф','Каэлин','Дракус','Тэорин','Малар','Раван','Эвис',
];
const RANDOM_NAMES_F = [
  'Арья','Лирия','Сель','Нэра','Тэви','Зора','Эйлин','Карис','Варра','Миэль',
  'Тали','Руна','Аэрин','Синэ','Бэйн','Эндра','Лиора','Нарис','Фалья','Даэри',
  'Кирра','Вэйла','Зенна','Иора','Сэллин','Тарис','Элайра',
];
const RANDOM_SURNAMES = [
  'Светлый','Теневой','Каменный','Железный','Лесной','Огненный','Тихий',
  'Быстрый','Древний','Серебряный','Золотой','Мрачный','Бурный','Морской',
  'Горный','Ночной','Буревой','Стальной','Пепельный','Звёздный','Кровавый',
];

function _rnd(arr)         { return arr[Math.floor(Math.random() * arr.length)]; }
function _rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function _roll4d6()        { return [1,2,3,4].map(()=>_rndInt(1,6)).sort((a,b)=>b-a).slice(0,3).reduce((s,v)=>s+v,0); }

function randomCharacter() {
  // ── Полный сброс (как initWizard) ──
  wiz = makeEmptyWiz();
  wiz.raceToolChoices        = {};
  wiz.clsToolChoices         = {};
  wiz.bgToolChoices          = {};
  wiz.subclassToolChoices    = {};
  wiz.subclassSkillOrToolChoices = {};
  wiz.skillOrToolChoices     = {};
  wiz.langChoices            = [];
  wiz.bgLangChoices          = {};
  wiz.subclassLangChoices    = {};
  wiz.subclassLangListChoices= {};
  wiz.dupReplacements        = {};
  wiz.asiSelectIdx           = 0;
  wiz.asiPartialPicks        = {};
  wiz.asiMultiPicks          = [];
  wiz.currency               = {gp:0,sp:0,cp:0,ep:0,pp:0};
  wiz.startGold              = 0;

  // ── Имя ──
  const female   = Math.random() < 0.5;
  wiz.name       = `${_rnd(female ? RANDOM_NAMES_F : RANDOM_NAMES_M)} ${_rnd(RANDOM_SURNAMES)}`;
  wiz.level      = _rndInt(1, 5);
  wiz.alignment  = _rnd([
    'Законный добрый','Нейтральный добрый','Хаотичный добрый',
    'Законный нейтральный','Истинно нейтральный','Хаотичный нейтральный',
    'Законный злой','Нейтральный злой','Хаотичный злой',
  ]);

  // ── Раса ──
  const races = (window.RACES || []).filter(r => r.id && enabledSources.has(r.source));
  if (!races.length) { toast('⚠️ Нет доступных рас','error'); return; }
  const race = _rnd(races);
  wiz.race    = race;

  // Подраса
  const subs = (race.subraces || []).filter(s => enabledSources.has(s.source));
  const sub  = subs.length ? _rnd(subs) : null;
  wiz.subrace = sub;

  // ASI-режим
  wiz.asiMode = (sub?.asiMode || race.asiMode || 'fixed');

  // ── Класс ──
  const classes = (window.CLASSES || []).filter(c => c.id && enabledSources.has(c.source));
  if (!classes.length) { toast('⚠️ Нет доступных классов','error'); return; }
  const cls = _rnd(classes);
  wiz.cls = cls;
  if (cls.spellcasting) wiz.spellAbility = cls.spellcasting.ability;

  // Подкласс
  const availSubs = (cls.subclasses || []).filter(s => !s.source || enabledSources.has(s.source));
  if (availSubs.length) wiz.subclass = (_rnd(availSubs).name || '');

  // Боевой стиль
  const styles = window.FIGHTING_STYLES?.[cls.id] || [];
  if (styles.length) wiz.fightingStyle = _rnd(styles);

  // ── Предыстория ──
  const bgs = (window.BACKGROUNDS || []).filter(b => b.id && enabledSources.has(b.source));
  wiz.background = bgs.length ? _rnd(bgs) : null;

  // ── Характеристики ──
  wiz.pointBuyMode = _randAbilityMode;
  // Приоритет: сначала основная хар-ка класса и спасброски
  const primary = [];
  if (cls.spellcasting?.ability) primary.push(cls.spellcasting.ability);
  (cls.savingThrows || []).forEach(k => { if (!primary.includes(k)) primary.push(k); });
  ABILITY_KEYS.forEach(k => { if (!primary.includes(k)) primary.push(k); });

  if (_randAbilityMode === 'roll') {
    const rolls = ABILITY_KEYS.map(() => _roll4d6()).sort((a,b)=>b-a);
    primary.forEach((k, i) => { wiz.abilities[k] = rolls[i] || 10; });
    wiz.rollValues = { _pool: rolls };
  } else {
    // Закупка очков: стандартный массив 15,14,13,12,10,8 — распределяем по приоритету
    const standard = [15, 14, 13, 12, 10, 8];
    primary.forEach((k, i) => { wiz.abilities[k] = standard[i] ?? 8; });
    wiz.rollValues = {};
  }

  // ── ASI: случайно по режиму ──
  _randomAsi(race, sub);

  // ── Навыки ──
  _randomSkills();

  // ── Языки ──
  const allRaceLangs2 = [...(race.languages||[]), ...(sub?.languages||[])];
  const fixedLangs    = allRaceLangs2.filter(l => !l.includes('выбор'));
  const freeCount     = allRaceLangs2.filter(l =>  l.includes('выбор')).length
                      + (typeof wiz.background?.languages === 'number' ? wiz.background.languages : 0);
  const langPool    = ALL_LANGS.filter(l => !fixedLangs.includes(l));
  wiz.langChoices   = [];
  for (let i = 0; i < freeCount; i++) {
    const avail = langPool.filter(l => !wiz.langChoices.includes(l));
    if (avail.length) wiz.langChoices.push(_rnd(avail));
  }

  // ── Инструменты ──
  _randomTools();

  // ── Заклинания: выбираем случайные заговоры и 1-го уровня ──
  _randomSpells();

  // ── Пересчёт бонусов ──
  recalcRacialBonuses();
  collectAbilities();

  // ── Сохраняем ──
  _buildAndSave();
  toast(`🎲 ${wiz.name} · ${race.name}${sub?' ('+sub.name+')':''} · ${cls.name} ${wiz.level} ур.`, 'success');
}

// ── Случайный ASI ──
function _randomAsi(race, sub) {
  const mode = wiz.asiMode;
  const src  = sub || race;

  if (mode === 'select') {
    const opts = Array.isArray(src?.asi) ? src.asi : [];
    wiz.asiSelectIdx = opts.length ? _rndInt(0, opts.length - 1) : 0;

  } else if (mode === 'choice' || mode === 'flex2') {
    wiz.asiChoiceMode  = Math.random() < 0.5 ? '2+1' : '1+1+1';
    wiz.asiChoicePicks = {};
    const slots = wiz.asiChoiceMode === '2+1'
      ? [{b:2,i:0},{b:1,i:1}]
      : [{b:1,i:0},{b:1,i:1},{b:1,i:2}];
    const used = new Set();
    slots.forEach(({b, idx}) => {
      const avail = ABILITY_KEYS.filter(k => !used.has(k));
      if (!avail.length) return;
      const k = _rnd(avail);
      used.add(k);
      wiz.asiChoicePicks[k] = {idx: idx ?? 0, bonus: b};
    });

  } else if (mode === 'halfelf') {
    wiz.halfElfPicks = [{key:'',bonus:1},{key:'',bonus:1}];
    const pool = ABILITY_KEYS.filter(k => k !== 'ХАР');
    const used = new Set();
    wiz.halfElfPicks.forEach(pick => {
      const avail = pool.filter(k => !used.has(k));
      const k = _rnd(avail); used.add(k); pick.key = k;
    });

  } else if (mode === 'variant') {
    wiz.variantHumanPicks = [{key:'',bonus:1},{key:'',bonus:1}];
    const used = new Set();
    wiz.variantHumanPicks.forEach(pick => {
      const avail = ABILITY_KEYS.filter(k => !used.has(k));
      const k = _rnd(avail); used.add(k); pick.key = k;
    });

  } else if (mode === 'partial') {
    const ch = src?.asiChoice;
    if (ch) {
      const pool  = ch.any ? ABILITY_KEYS : (ch.from || []);
      const fixed = new Set(Object.keys(src?.asi || {}));
      const used  = new Set();
      wiz.asiPartialPicks = {};
      for (let i = 0; i < (ch.count || 1); i++) {
        const avail = pool.filter(k => !fixed.has(k) && !used.has(k));
        if (avail.length) { const k = _rnd(avail); used.add(k); wiz.asiPartialPicks[i] = {key:k, bonus:ch.bonus||1}; }
      }
    }

  } else if (mode === 'multi-choice') {
    const steps = src?.asiChoice || [];
    wiz.asiMultiPicks = [];
    const used = new Set();
    steps.forEach((step, i) => {
      const pool  = step.any
        ? ABILITY_KEYS.filter(k => !(step.excludePrevious && used.has(k)) && !(step.exclude||[]).includes(k))
        : (step.from || []);
      const avail = pool.filter(k => !used.has(k));
      if (avail.length) { const k = _rnd(avail); used.add(k); wiz.asiMultiPicks[i] = {key:k, bonus:step.bonus||1}; }
    });
  }
  // fixed / all+1 — выбирать нечего
}

// ── Случайные навыки ──
function _randomSkills() {
  wiz.skillProfs = new Set();
  const cls = wiz.cls;
  if (!cls) return;

  // Навыки от предыстории
  getBgSkills().forEach(s => wiz.skillProfs.add(s));

  // Навыки от класса
  const pool = cls.skillChoices === 'all'
    ? SKILLS_DATA.map(s => s.name)
    : (cls.skillChoices || []);
  const avail = pool.filter(s => !wiz.skillProfs.has(s));
  const count = cls.skillCount || 2;
  for (let i = 0; i < count && avail.length; i++) {
    const idx = _rndInt(0, avail.length - 1);
    wiz.skillProfs.add(avail.splice(idx, 1)[0]);
  }

  // Вариантный человек — дополнительный навык
  if (wiz.asiMode === 'variant') {
    const pool2 = SKILLS_DATA.map(s=>s.name).filter(s => !wiz.skillProfs.has(s));
    if (pool2.length) { wiz.racialSkillChoice = _rnd(pool2); wiz.skillProfs.add(wiz.racialSkillChoice); }
  }
}

// ── Случайные инструменты ──
function _resolveToolPoolAll() {
  const artisan = window.TOOLS_BY_CATEGORY?.artisan || [];
  const musical = window.TOOLS_BY_CATEGORY?.musical || [];
  const gaming  = window.TOOLS_BY_CATEGORY?.gaming  || [];
  const other   = window.TOOLS_BY_CATEGORY?.other   || [];
  return [...artisan, ...musical, ...gaming, ...other];
}

function _pickFromToolChoice(tc, usedSet) {
  if (!tc) return {};
  const pool = _resolveToolPool(tc);
  const result = {};
  for (let i = 0; i < (tc.count || 1); i++) {
    const avail = pool.filter(t => !usedSet.has(t));
    if (avail.length) { const t = _rnd(avail); usedSet.add(t); result[i] = t; }
  }
  return result;
}

function _randomTools() {
  const bg   = wiz.background;
  const race = wiz.race;
  const sub  = wiz.subrace;
  const cls  = wiz.cls;

  // Набор уже выбранных инструментов (для избежания дублей)
  const used = new Set([
    ...(Array.isArray(bg?.tools) ? bg.tools : []),
    ...(cls?.toolProf ? String(cls.toolProf).split(/[,;]/).map(s=>s.trim()).filter(Boolean) : []),
  ]);

  // Инструменты предыстории (выбор)
  wiz.bgToolChoices = _pickFromToolChoice(bg?.toolChoice || null, used);

  // Классовые инструменты (выбор) — например, муз. инструменты у Барда
  wiz.clsToolChoices = {};
  const clsTc = cls?.toolChoice;
  if (clsTc) {
    const clsPool = _resolveToolPool(clsTc);
    const clsUsed = new Set(used);
    for (let i = 0; i < (clsTc.count || 1); i++) {
      const avail = clsPool.filter(t => !clsUsed.has(t));
      if (avail.length) { const t = _rnd(avail); clsUsed.add(t); wiz.clsToolChoices[i] = t; }
    }
  }

  // Расовый toolChoice
  wiz.raceToolChoices = _pickFromToolChoice(sub?.toolChoice || race?.toolChoice || null, used);

  // skillOrToolChoice (раса/подраса)
  const sotc = sub?.skillOrToolChoice || race?.skillOrToolChoice;
  wiz.skillOrToolChoices = {};
  if (sotc) {
    const pool = sotc.any
      ? [...SKILLS_DATA.map(s=>s.name), ..._resolveToolPool(sotc)]
      : _resolveToolPool(sotc);
    const sotcUsed = new Set(used);
    for (let i = 0; i < (sotc.count || 1); i++) {
      const avail = pool.filter(t => !sotcUsed.has(t));
      if (avail.length) { const t = _rnd(avail); sotcUsed.add(t); wiz.skillOrToolChoices[i] = t; }
    }
  }

  // Инструменты подкласса (выбор)
  wiz.subclassToolChoices = {};
  const subP = _getSubclassProfs(cls, wiz.subclass, wiz.level || 1);
  if (subP.toolChoice) {
    const subTcUsed = new Set(used);
    const subTcPool = _resolveToolPool(subP.toolChoice);
    for (let i = 0; i < (subP.toolChoice.count || 1); i++) {
      const avail = subTcPool.filter(t => !subTcUsed.has(t));
      if (avail.length) { const t = _rnd(avail); subTcUsed.add(t); wiz.subclassToolChoices[i] = t; }
    }
  }
}

// ── Случайные заклинания (с enabledSources и правильным подсчётом) ──
function _randomSpells() {
  const cls = wiz.cls;
  if (!cls?.spellcasting) return;
  const sc    = cls.spellcasting;
  const level = wiz.level || 1;

  // Правильный подсчёт заговоров по уровню
  const cantripCount = level === 1
    ? (sc.cantrips || 0)
    : (sc.cantripsByLevel ? sc.cantripsByLevel[level - 2] ?? sc.cantrips : sc.cantrips || 0);

  // Правильный подсчёт заклинаний по уровню
  const pb       = profBonus(level);
  const abilVal  = (wiz.abilities[sc.ability]||10) + ((wiz.racialBonuses||{})[sc.ability]||0);
  const spellMod = getMod(abilVal);
  let spellCount = 0;
  let isPrepared = false;
  if (sc.spellsByLevel === 'prepared') {
    isPrepared = true;
    const halfLevel = (sc.type==='half'||sc.type==='half_up') ? Math.ceil(level/2) : level;
    spellCount = Math.max(1, spellMod + halfLevel);
  } else if (Array.isArray(sc.spellsByLevel)) {
    spellCount = level === 1 ? sc.spells1 : (sc.spellsByLevel[level - 2] || sc.spells1 || 0);
  } else {
    spellCount = sc.spells1 || 0;
  }

  // Максимальный уровень заклинаний
  const levelTable = window.MAX_SPELL_LEVEL_BY_CLASS_LEVEL?.[sc.type] || window.MAX_SPELL_LEVEL_BY_CLASS_LEVEL?.full || [];
  const maxSpellLevel = levelTable[level] || 1;

  // Пул заклинаний с учётом enabledSources
  const classKey  = cls.id;
  const subclassNameRnd = (wiz.subclass || '').toLowerCase().trim();
  const allSpells = (window.SPELLS || []).filter(s =>
    s.classes?.includes(classKey) && enabledSources.has(s.source || 'PH14')
  );

  // Добавляем заклинания подкласса из spells.subclasses[], которых нет в classes[] класса
  const subclassExtra = subclassNameRnd
    ? (window.SPELLS || []).filter(s =>
        !s.classes?.includes(classKey) &&
        enabledSources.has(s.source || 'PH14') &&
        Array.isArray(s.subclasses) &&
        s.subclasses.some(sc => sc.class === classKey && sc.name.toLowerCase().trim() === subclassNameRnd)
      )
    : [];
  const allPool = [...allSpells, ...subclassExtra];

  // Случайные заговоры
  wiz.selectedCantrips = [];
  if (cantripCount > 0) {
    const pool = allPool.filter(s => s.level === 0);
    const bag  = [...pool];
    for (let i = 0; i < cantripCount && bag.length; i++) {
      wiz.selectedCantrips.push(bag.splice(_rndInt(0, bag.length - 1), 1)[0].name);
    }
  }

  // Случайные заклинания
  wiz.selectedSpells = [];
  if (spellCount > 0) {
    const pool = allPool.filter(s => s.level > 0 && s.level <= maxSpellLevel);
    const bag  = [...pool];
    for (let i = 0; i < spellCount && bag.length; i++) {
      wiz.selectedSpells.push(bag.splice(_rndInt(0, bag.length - 1), 1)[0].name);
    }
  }
}

// ══════════════════════════════════════════════════════════
// ДАЛЕЕ СЛУЧАЙНО — заполняет все оставшиеся шаги случайно
// сохраняя уже введённые данные
// ══════════════════════════════════════════════════════════
function wizardNextRandom() {
  // Сохраняем текущий шаг
  if (!validateStep()) return;

  const step = currentStep;

  // Шаг 0: имя/уровень уже есть, collectStep0 уже вызван в validateStep
  // Заполняем то, чего ещё нет

  // ── Раса (если шаг 1 ещё не заполнен) ──
  if (!wiz.race) {
    const races = (window.RACES || []).filter(r => r.id && enabledSources.has(r.source));
    if (!races.length) { toast('⚠️ Нет доступных рас','error'); return; }
    const race = _rnd(races);
    wiz.race = race;
    wiz.asiMode = race.asiMode || 'fixed';
    const subs = (race.subraces || []).filter(s => enabledSources.has(s.source));
    wiz.subrace = subs.length ? _rnd(subs) : null;
    if (wiz.subrace) wiz.asiMode = wiz.subrace.asiMode || wiz.asiMode;
    wiz.raceToolChoices    = {};
    wiz.skillOrToolChoices = {};
    wiz.asiSelectIdx  = 0; wiz.asiPartialPicks = {}; wiz.asiMultiPicks = [];
  }

  // ── Класс (если шаг 2 ещё не заполнен) ──
  if (!wiz.cls) {
    const classes = (window.CLASSES || []).filter(c => c.id && enabledSources.has(c.source));
    if (!classes.length) { toast('⚠️ Нет доступных классов','error'); return; }
    wiz.cls = _rnd(classes);
    if (wiz.cls.spellcasting) wiz.spellAbility = wiz.cls.spellcasting.ability;
    wiz.clsToolChoices = {};
  }
  // Подкласс — всегда можно дополнить случайно
  if (!wiz.subclass) {
    const availSubs = (wiz.cls.subclasses || []).filter(s => !s.source || enabledSources.has(s.source));
    if (availSubs.length) wiz.subclass = (_rnd(availSubs).name || '');
    const styles = window.FIGHTING_STYLES?.[wiz.cls.id] || [];
    if (!wiz.fightingStyle && styles.length) wiz.fightingStyle = _rnd(styles);
  }

  // ── Предыстория (если шаг 3 ещё не заполнен) ──
  if (!wiz.background) {
    const bgs = (window.BACKGROUNDS || []).filter(b => b.id && enabledSources.has(b.source));
    wiz.background = bgs.length ? _rnd(bgs) : null;
  }

  // ── Характеристики ──
  if (step < 4) {
    const cls = wiz.cls;
    const rolls = ABILITY_KEYS.map(() => _roll4d6()).sort((a,b) => b-a);
    const primary = [];
    if (cls.spellcasting?.ability) primary.push(cls.spellcasting.ability);
    (cls.savingThrows || []).forEach(k => { if (!primary.includes(k)) primary.push(k); });
    ABILITY_KEYS.forEach(k => { if (!primary.includes(k)) primary.push(k); });
    primary.forEach((k, i) => { wiz.abilities[k] = rolls[i] || 10; });
    wiz.pointBuyMode = 'roll';
    wiz.rollValues   = { _pool: rolls };
    _randomAsi(wiz.race, wiz.subrace);
  }

  // ── Навыки и инструменты ──
  if (step < 5) {
    recalcRacialBonuses();
    collectAbilities();
    _randomSkills();
    _randomTools();

    // Языки
    const race = wiz.race, sub = wiz.subrace;
    const allRaceLangs = [...(race.languages||[]), ...(sub?.languages||[])];
    const fixedLangs   = allRaceLangs.filter(l => !l.includes('выбор'));
    const freeCount    = allRaceLangs.filter(l => l.includes('выбор')).length
                       + (typeof wiz.background?.languages === 'number' ? wiz.background.languages : 0);
    const langPool  = ALL_LANGS.filter(l => !fixedLangs.includes(l));
    if (!wiz.langChoices?.length) {
      wiz.langChoices = [];
      for (let i = 0; i < freeCount; i++) {
        const avail = langPool.filter(l => !wiz.langChoices.includes(l));
        if (avail.length) wiz.langChoices.push(_rnd(avail));
      }
    }
  }

  // ── Заклинания ──
  if (step < 6) {
    _randomSpells();
  }

  // ── Снаряжение ──
  if (!wiz.equipmentChoice) wiz.equipmentChoice = 'kit';
  if (step < 7) {
    randomEquipPicks();
  }

  // ── Выравнивание и имя (если не заполнены) ──
  if (!wiz.alignment) {
    wiz.alignment = _rnd([
      'Законный добрый','Нейтральный добрый','Хаотичный добрый',
      'Законный нейтральный','Истинно нейтральный','Хаотичный нейтральный',
      'Законный злой','Нейтральный злой','Хаотичный злой',
    ]);
  }
  if (!wiz.name) {
    const female = Math.random() < 0.5;
    wiz.name = `${_rnd(female ? RANDOM_NAMES_F : RANDOM_NAMES_M)} ${_rnd(RANDOM_SURNAMES)}`;
  }
  if (!wiz.level) wiz.level = 1;

  // Финальный пересчёт и создание
  recalcRacialBonuses();
  collectAbilities();
  createCharacter();
  toast(`🎲 Остальные шаги заполнены случайно!`, 'success');
}

// ══════════════════════════════════════════════════════════
// ДИАЛОГ ВЫБОРА ИСТОЧНИКОВ ДЛЯ "СЛУЧАЙНЫЙ"
// ══════════════════════════════════════════════════════════
let _randDialogSources = new Set(['PH14']);
let _randAbilityMode = 'roll'; // 'roll' | 'pointbuy'

function setRandAbilityMode(mode) {
  _randAbilityMode = mode;
  document.querySelectorAll('#rand-ability-mode-row .src-chip').forEach(b => {
    b.classList.toggle('active', b.id === 'rand-mode-' + mode);
  });
}

function openRandDialog() {
  _randDialogSources = new Set(['PH14']); // сброс к умолчанию
  _randAbilityMode = 'roll';
  setTimeout(() => {
    document.querySelectorAll('#rand-ability-mode-row .src-chip').forEach(b => {
      b.classList.toggle('active', b.id === 'rand-mode-roll');
    });
  }, 0);
  _buildRandDialogSources();
  document.getElementById('rand-dialog').style.display = 'flex';
}

function closeRandDialog() {
  document.getElementById('rand-dialog').style.display = 'none';
}

function _buildRandDialogSources() {
  const defined = window.SOURCES || {};
  // Берём все источники из всех файлов данных
  const allSrcs = new Set();
  (window.RACES       || []).forEach(r => { if (r.source) allSrcs.add(r.source); (r.subraces||[]).forEach(s=>s.source&&allSrcs.add(s.source)); });
  (window.CLASSES     || []).forEach(c => { if (c.source) allSrcs.add(c.source); (c.subclasses||[]).forEach(s=>s.source&&allSrcs.add(s.source)); });
  (window.BACKGROUNDS || []).forEach(b => { if (b.source) allSrcs.add(b.source); });

  const visible = [...allSrcs].filter(s => defined[s]).sort((a,b) => {
    if (a==='PH14') return -1; if (b==='PH14') return 1;
    const aHB=a.startsWith('HB'), bHB=b.startsWith('HB');
    if (aHB&&!bHB) return 1; if (!aHB&&bHB) return -1;
    return a.localeCompare(b);
  });
  const mainKeys = visible.filter(k => !k.startsWith('HB'));
  const hbKeys   = visible.filter(k =>  k.startsWith('HB'));

  const chip = (k) => {
    const on = _randDialogSources.has(k);
    return `<button class="src-chip ${on?'active':''}" title="${defined[k]||k}" onclick="toggleRandSrc('${k}')">${k}</button>`;
  };

  const allOn    = visible.every(k => _randDialogSources.has(k));
  const allHbOn  = hbKeys.length > 0 && hbKeys.every(k => _randDialogSources.has(k));

  let html = `<div class="rand-dialog-row">
    <button class="src-chip-all ${allOn?'active':''}" onclick="toggleRandAllSrc()">ВСЕ</button>
    ${mainKeys.map(chip).join('')}
  </div>`;
  if (hbKeys.length) {
    html += `<div class="rand-dialog-row">
      <button class="src-chip-all ${allHbOn?'active':''}" onclick="toggleRandAllHbSrc()">Все HB</button>
      ${hbKeys.map(chip).join('')}
    </div>`;
  }
  document.getElementById('rand-src-rows').innerHTML = html;
}

function toggleRandSrc(k) {
  if (_randDialogSources.has(k)) { _randDialogSources.delete(k); if (_randDialogSources.size===0) _randDialogSources.add('PH14'); }
  else _randDialogSources.add(k);
  _buildRandDialogSources();
}

function _getAllRandSrcKeys() {
  const defined = window.SOURCES || {};
  const allSrcs = new Set();
  (window.RACES       || []).forEach(r => { if (r.source) allSrcs.add(r.source); (r.subraces||[]).forEach(s=>s.source&&allSrcs.add(s.source)); });
  (window.CLASSES     || []).forEach(c => { if (c.source) allSrcs.add(c.source); (c.subclasses||[]).forEach(s=>s.source&&allSrcs.add(s.source)); });
  (window.BACKGROUNDS || []).forEach(b => { if (b.source) allSrcs.add(b.source); });
  return [...allSrcs].filter(s => defined[s]);
}

function toggleRandAllSrc() {
  const visible = _getAllRandSrcKeys();
  const allOn = visible.every(k => _randDialogSources.has(k));
  if (allOn) { _randDialogSources = new Set(['PH14']); }
  else { visible.forEach(k => _randDialogSources.add(k)); }
  _buildRandDialogSources();
}

function toggleRandAllHbSrc() {
  const hbKeys = _getAllRandSrcKeys().filter(s => s.startsWith('HB'));
  const allOn = hbKeys.every(k => _randDialogSources.has(k));
  if (allOn) { hbKeys.forEach(k => _randDialogSources.delete(k)); if (_randDialogSources.size===0) _randDialogSources.add('PH14'); }
  else { hbKeys.forEach(k => _randDialogSources.add(k)); }
  _buildRandDialogSources();
}

function confirmRandDialog() {
  closeRandDialog();
  // Временно подменяем enabledSources на выбранные в диалоге
  const prevSources = enabledSources;
  enabledSources = new Set(_randDialogSources);
  randomCharacter();
  enabledSources = prevSources;
}


// ── Сборка char и сохранение (без wizard UI) ──
function _buildAndSave() {
  const level = wiz.level || 1;
  const pb    = profBonus(level);
  const totAbi = {};
  ABILITY_KEYS.forEach(k => { totAbi[k] = (wiz.abilities[k]||8) + ((wiz.racialBonuses||{})[k]||0); });
  const conMod = getMod(totAbi['ТЕЛ'] || 10);
  const hd     = wiz.cls?.hitDie || 8;
  const hpMax  = Math.max(1, hd + conMod + (level-1)*(Math.floor(hd/2)+1+conMod));

  // Инвентарь: снаряжение ИЛИ золото (взаимоисключающие)
  const _useGold = Math.random() < 0.5;
  randomEquipPicks();
  const inventoryItems = collectEquipmentItems(_useGold);

  const bg       = wiz.background;
  const race     = wiz.race;
  const sub      = wiz.subrace;
  const allSpells = [...wiz.selectedCantrips, ...wiz.selectedSpells];

  const char = {
    name:wiz.name, _system:'DnD5e', _version:'2.1', _created:new Date().toISOString(),
    race:race?.id||'human',      raceName:race?.name||'Человек',
    subrace:sub?.id||'',         subraceName:sub?.name||'',
    class:wiz.cls?.id||'fighter',className:wiz.cls?.name||'Воин',
    subclass:wiz.subclass||'',   fightingStyle:wiz.fightingStyle||'',
    background:bg?.id||'',       backgroundName:bg?.name||'',
    level, xp:0, alignment:wiz.alignment,
    size:sub?.size||race?.size||'Средний',
    abilities:totAbi, abilityBases:{...wiz.abilities}, racialBonuses:{...wiz.racialBonuses},
    proficiencyBonus:pb,
    hpMax:Math.max(1,hpMax), hpCurrent:Math.max(1,hpMax), hpTemp:0, hitDie:hd,
    ac:10,
    speed:(()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      const base = race?.speed||30;
      let spd = sub?.speed!==undefined ? sub.speed : base+(sub?.speedBonus||0);
      return spd + (subP.speedUp||0);
    })(),
    flySpeed:   sub?.flySpeed   ?? race?.flySpeed   ?? 0,
    swimSpeed:  sub?.swimSpeed  ?? race?.swimSpeed  ?? 0,
    climbSpeed: sub?.climbSpeed ?? race?.climbSpeed ?? 0,
    darkvision:(()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      return Math.max(sub?.darkvision??0, race?.darkvision??0, subP.darkvision??0);
    })(),
    initiative:0,
    savingThrows:wiz.cls?.savingThrows||[],
    armorProf: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      return [wiz.cls?.armorProf, race?.armorProf, sub?.armorProf, subP.armorProf]
        .map(_cleanProf).filter(Boolean).join('; ')||'';
    })(),
    weaponProf: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      return _mergeWeaponProfs(wiz.cls?.weaponProf, race?.weaponProf, sub?.weaponProf, subP.weaponProf);
    })(),
    toolProf: (()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      return [wiz.cls?.toolProf, race?.toolProf, sub?.toolProf, subP.toolProf]
        .map(_cleanProf).filter(Boolean).join('; ')||'';
    })(),
    otherProf: (()=>{
      return [
        ...(Array.isArray(wiz.background?.tools) ? wiz.background.tools : []),
        ...Object.values(wiz.bgToolChoices||{}),
        ...Object.values(wiz.clsToolChoices||{}),
        ...Object.values(wiz.raceToolChoices||{}),
        ...Object.values(wiz.skillOrToolChoices||{}),
        ...Object.values(wiz.subclassToolChoices||{}),
        ...Object.values(wiz.subclassSkillOrToolChoices||{}).filter(v =>
          v && !SKILLS_DATA.find(s=>s.name===v)
        ),
      ].filter(Boolean).join(', ');
    })(),
    racialSkillChoice:wiz.racialSkillChoice||null,
    hasFeat:false,
    skillProficiencies:(()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      const all = new Set([...wiz.skillProfs, ...(subP.skills||[])]);
      return [...all];
    })(),
    skillExpertise:{},
    languages:(()=>{
      const subP = _getSubclassProfs(wiz.cls, wiz.subclass, level);
      return [
        ...(race?.languages||[]).filter(l=>!l.includes('выбор')),
        ...(sub?.languages||[]).filter(l=>!l.includes('выбор')),
        ...(subP.languagesConst||[]),
        ...(wiz.langChoices||[]).filter(Boolean),
      ].filter((v,i,a)=>a.indexOf(v)===i);
    })(),
    spellAbility:wiz.cls?.spellcasting?.ability||null,
    spells:allSpells, usedSpellSlots:{},
    weapons:[], inventory:inventoryItems,
    currency:(()=>{
      // _useGold определён выше при построении инвентаря
      let gp = bg?.gold || 0;
      if (_useGold) {
        const tables = {barbarian:[2,4,10],bard:[5,4,1],cleric:[5,4,1],druid:[2,4,10],
          fighter:[5,4,10],monk:[5,4,1],paladin:[5,4,10],ranger:[5,4,10],rogue:[4,4,10],
          sorcerer:[3,4,10],warlock:[4,4,10],wizard:[4,4,10],artificer:[5,4,10]};
        const [n,d,mult] = tables[wiz.cls?.id] || [5,4,1];
        let rolled = 0;
        for (let i=0; i<n; i++) rolled += Math.ceil(Math.random()*d);
        gp = rolled * mult + (bg?.gold || 0);
      }
      return {gp, sp:0, cp:0, ep:0, pp:0};
    })(),
    racialTraits:race?.traits||'', classFeatures:wiz.cls?.features||'',
    armorRestriction: wiz.cls?.armorRestriction || '',
    subclassFeatures:(()=>{
      const sub=(wiz.cls?.subclasses||[]).find(s=>(s.name||s)===wiz.subclass);
      return (typeof sub==='object'&&sub.features)||'';
    })(),
    backgroundFeature:wiz.background?.feature||bg?.feature||'',
    climbSpeed:race?.climbSpeed||0,
    swimSpeed:race?.swimSpeed||0,
    flySpeed:race?.flySpeed||0,
    darkvision:(()=>{
      const subP=_getSubclassProfs(wiz.cls,wiz.subclass,wiz.level||1);
      return Math.max(race?.darkvision||0, subP.darkvision||0);
    })(),
    inspiration:false, conditions:[],
    deathSaves:{successes:[false,false,false],failures:[false,false,false]},
    notes:'', resources:[],
    halfProficiency:false, remarkableAthlete:false,
    portrait:null,
  };
  saveCharacter(char);
}

// ── ИНИЦИАЛИЗАЦИЯ ──
applyTheme(currentTheme);
showView('list');

// Проверка обновлений — тихо, через 3 сек после запуска
setTimeout(async () => {
  try {
    const r = await fetch('/api/check-update');
    const d = await r.json();
    if (d.has_update && d.latest) {
      const msg = document.createElement('div');
      msg.id = 'update-banner';
      msg.innerHTML = `
        <span>🎉 Доступна новая версия <strong>${d.latest}</strong></span>
        <a href="${d.url}" target="_blank" rel="noopener">Скачать</a>
        <button onclick="document.getElementById('update-banner').remove()">✕</button>`;
      document.body.appendChild(msg);
    }
  } catch(e) { /* тихо игнорируем */ }
}, 3000);

// ══════════════════════════════════════════════════════════
// SPELL BROWSER
// ══════════════════════════════════════════════════════════
let _sbSort      = 'level';   // 'level' | 'alpha' | 'school'
let _sbSelected  = new Set(); // spell names currently on char
let _sbOriginal  = new Set(); // spell names when dialog opened

function openSpellBrowser() {
  if (!currentChar) return;
  // Populate filter dropdowns once
  _sbPopulateFilters();

  // Current char spells
  _sbOriginal = new Set(currentChar.spells || []);
  _sbSelected = new Set(_sbOriginal);

  document.getElementById('sb-search').value = '';
  document.getElementById('sb-level').value  = '';
  document.getElementById('sb-school').value = '';
  // Default class to current char class if available
  const sbClsSel = document.getElementById('sb-class');
  if (sbClsSel) {
    const charCls = currentChar?.class || '';
    sbClsSel.value = charCls && [...sbClsSel.options].some(o=>o.value===charCls) ? charCls : '';
  }
  // Deselect all sources
  const sbSrcSel = document.getElementById('sb-source');
  if (sbSrcSel) [...sbSrcSel.options].forEach(o => o.selected = false);
  sbSetSort('level', true);

  document.getElementById('spell-browser-overlay').classList.remove('hidden');
  sbRender();
}

function closeSpellBrowser() {
  document.getElementById('spell-browser-overlay').classList.add('hidden');
}

function applySpellBrowser() {
  if (!currentChar) return;
  currentChar.spells = [..._sbSelected];
  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  renderSpellsSheet(currentChar, pb);
  saveSheet();
  closeSpellBrowser();
}

function sbSetSort(mode, silent) {
  _sbSort = mode;
  document.querySelectorAll('.spell-sort-btn').forEach(b => b.classList.toggle('active', b.id === 'sbs-' + mode));
  if (!silent) sbRender();
}

function _sbPopulateFilters() {
  const spells = window.SPELLS || [];
  // Always rebuild filters (avoid stale state)
  const classSet = new Set();
  spells.forEach(sp => {
    if (Array.isArray(sp.classes)) sp.classes.forEach(c => classSet.add(c));
  });
  const clsSel = document.getElementById('sb-class');
  clsSel.innerHTML = '<option value="">Все классы</option>';
  const clsMap = {};
  (window.CLASSES||[]).forEach(c => { clsMap[c.id] = c.name; });
  // Only base spellcasting classes (no subclasses - those are strings not ids)
  const baseClasses = [...classSet].filter(c => clsMap[c]).sort((a,b) => (clsMap[a]||a).localeCompare(clsMap[b]||b,'ru'));
  baseClasses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = clsMap[c] || c;
    clsSel.appendChild(opt);
  });

  // schools — canonicalize: strip parenthetical
  const schoolSet = new Set();
  spells.forEach(sp => { if (sp.school) schoolSet.add(sp.school.replace(/\s*\(.*$/, '').trim()); });
  const schSel = document.getElementById('sb-school');
  schSel.innerHTML = '<option value="">Все школы</option>';
  [...schoolSet].sort((a,b)=>a.localeCompare(b,'ru')).forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
    schSel.appendChild(opt);
  });

  // sources — simple dropdown with "All" option
  const srcSet = new Set();
  spells.forEach(sp => { if (sp.source) srcSet.add(sp.source); });
  const srcSel = document.getElementById('sb-source');
  srcSel.innerHTML = '<option value="">Все источники</option>';
  [...srcSet].sort().forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    srcSel.appendChild(opt);
  });
  // Reset to "All" on open
  srcSel.value = '';
}

function sbRender() {
  const spells   = window.SPELLS || [];
  const q        = normalizeRu(document.getElementById('sb-search')?.value || '').trim();
  const fLevel   = document.getElementById('sb-level')?.value;
  const fClass   = document.getElementById('sb-class')?.value;
  const fSchool  = document.getElementById('sb-school')?.value;
  const fSource  = document.getElementById('sb-source')?.value || '';

  let filtered = spells.filter(sp => {
    if (q && !normalizeRu(sp.name).includes(q) && !normalizeRu(sp.nameEn).includes(q)) return false;
    if (fLevel !== '' && fLevel !== undefined && sp.level !== parseInt(fLevel)) return false;
    if (fClass) {
      const spCls = Array.isArray(sp.classes) ? sp.classes : (sp.classes ? [sp.classes] : []);
      if (!spCls.includes(fClass)) return false;
    }
    if (fSchool && !normalizeRu(sp.school?.replace(/\s*\(.*$/,'')).includes(normalizeRu(fSchool))) return false;
    if (fSource && sp.source !== fSource) return false;
    return true;
  });

  // Sort
  if (_sbSort === 'alpha') {
    filtered.sort((a,b) => (a.name||'').localeCompare(b.name||'', 'ru'));
  } else if (_sbSort === 'school') {
    filtered.sort((a,b) => {
      const sa = (a.school||'').replace(/\s*\(.*$/,'');
      const sb2 = (b.school||'').replace(/\s*\(.*$/,'');
      return sa.localeCompare(sb2,'ru') || (a.level||0)-(b.level||0);
    });
  } else {
    filtered.sort((a,b) => (a.level||0)-(b.level||0) || (a.name||'').localeCompare(b.name||'','ru'));
  }

  document.getElementById('sb-count').textContent = `${filtered.length} заклинаний`;

  const LEVEL_NAMES = ['Заговор','1 уровень','2 уровень','3 уровень','4 уровень','5 уровень','6 уровень','7 уровень','8 уровень','9 уровень'];

  let html = '';
  let lastGroup = null;

  filtered.forEach(sp => {
    const sel = _sbSelected.has(sp.name);
    // Group headers
    if (_sbSort === 'level') {
      const grp = LEVEL_NAMES[sp.level||0] || String(sp.level);
      if (grp !== lastGroup) {
        html += `<div class="sbl-lvl-header">${grp}</div>`;
        lastGroup = grp;
      }
    } else if (_sbSort === 'school') {
      const grp = (sp.school||'').replace(/\s*\(.*$/,'');
      if (grp !== lastGroup) {
        html += `<div class="sbl-lvl-header">${grp.charAt(0).toUpperCase()+grp.slice(1)}</div>`;
        lastGroup = grp;
      }
    }
    const lvlTxt = sp.level === 0 ? '0' : sp.level;
    const meta = [sp.cast, sp.range].filter(Boolean).join(' · ');
    const lvlColours=['#a0a0c0','#7ab3e8','#6dcf7a','#f0c040','#e07050','#c060e0','#e05080','#40c0e0','#ff8040','#ff4060'];
    const lvlCol = sp.level !== undefined ? (lvlColours[sp.level]||'var(--text2)') : 'var(--text3)';
    const school = (sp.school||'').replace(/\s*\(.*$/,'').trim();
    const concBadge = sp.concentration ? '<span style="font-size:.7rem;font-weight:900;color:#f0c040" title="Концентрация">К</span>' : '';
    const ritBadge  = sp.ritual ? '<span style="font-size:.7rem;font-weight:900;color:#70a0d0" title="Ритуал">Р</span>' : '';
    const srcLabel  = sp.source ? `<span style="font-size:.58rem;color:var(--text3);background:rgba(255,255,255,.06);border:1px solid #3d4a65;border-radius:3px;padding:.05rem .3rem;white-space:nowrap;flex-shrink:0">${sp.source}</span>` : '';
    html += `<div class="sbl-item ${sel?'selected':''}" data-spell="${sp.name.replace(/"/g,'&quot;')}" onclick="sbToggle('${sp.name.replace(/'/g,"\\'")}')" oncontextmenu="openSpellCtxMenu(event,'${sp.name.replace(/'/g,"\\'")}')">
      <div style="min-width:1.6rem;text-align:center;flex-shrink:0">
        <div style="font-size:.52rem;color:var(--text3);line-height:1">ур.</div>
        <div style="font-size:.78rem;font-weight:800;font-family:'PT Mono',monospace;color:${lvlCol};line-height:1.2">${lvlTxt}</div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:baseline;gap:.3rem;flex-wrap:wrap">
          <span style="font-size:.84rem;font-weight:700;color:var(--text)">${sp.name}</span>
          ${school ? `<span style="font-size:.62rem;color:var(--text3);font-style:italic">${school}</span>` : ''}
          ${concBadge}${ritBadge}
        </div>
        <div style="font-size:.64rem;color:var(--text3);margin-top:.05rem;display:flex;gap:.35rem;flex-wrap:wrap">
          ${sp.cast  ? `<span>⏱ ${sp.cast}</span>`  : ''}
          ${sp.range ? `<span>📏 ${sp.range}</span>` : ''}
          ${sp.duration ? `<span>⌛ ${sp.duration}</span>` : ''}
        </div>
      </div>
      ${srcLabel}
      <div class="sbl-check">✓</div>
    </div>`;
  });

  document.getElementById('sb-list').innerHTML = html || '<p class="note-text" style="padding:.5rem">Ничего не найдено.</p>';
  document.getElementById('sb-sel-count').textContent = `Выбрано: ${_sbSelected.size} заклинаний`;
}

function sbToggle(name) {
  if (_sbSelected.has(name)) _sbSelected.delete(name);
  else _sbSelected.add(name);
  // Update just that item's class without full re-render
  document.querySelectorAll('.sbl-item[data-spell]').forEach(el => {
    if (el.dataset.spell === name) el.classList.toggle('selected', _sbSelected.has(name));
  });
  document.getElementById('sb-sel-count').textContent = `Выбрано: ${_sbSelected.size} заклинаний`;
}

// ══════════════════════════════════════════════════════════
// SPELL DETAIL / EDIT DIALOG
// ══════════════════════════════════════════════════════════
let _sdIdx = -1; // index in currentChar.spells

/** Build readable description HTML from a spell's description field */
function _spellDescHtml(sp) {
  if (!sp?.description) return '';
  const raw = String(sp.description).replace(/\\n/g, '\n').trim();
  if (!raw) return '';
  return raw;
}

function openSpellDetail(idx) {
  if (!currentChar?.spells) return;
  _sdIdx = idx;
  const name = currentChar.spells[idx];
  const sp   = (window.SPELLS||[]).find(s => s.name === name);
  // Merge with any saved overrides
  const ovr  = (currentChar._spellOverrides || {})[idx] || {};
  const get  = (field) => ovr[field] !== undefined ? ovr[field] : (sp?.[field] ?? '');

  // Title
  document.getElementById('sd-title').textContent = get('name') || name;

  // Badges
  const lvl    = get('level');
  const school = (get('school')||'').replace(/\s*\(.*$/,'').trim();
  const conc   = sp?.concentration || ovr.concentration;
  const ritual = sp?.ritual || ovr.ritual;
  const source = sp?.source || '';
  const lvlLabel = lvl === 0 ? 'Заговор' : lvl !== '' ? `${lvl} уровень` : '';
  document.getElementById('sd-badges').innerHTML = [
    lvlLabel   ? `<span class="spell-detail-badge" style="color:var(--gold)">${lvlLabel}</span>` : '',
    school     ? `<span class="spell-detail-badge">${school.charAt(0).toUpperCase()+school.slice(1)}</span>` : '',
    conc       ? `<span class="spell-detail-badge" style="color:#e07050">⚡ Концентрация</span>` : '',
    ritual     ? `<span class="spell-detail-badge" style="color:#70a0d0">📖 Ритуал</span>` : '',
    source     ? `<span class="spell-detail-badge" style="opacity:.6">${source}</span>` : '',
  ].filter(Boolean).join('');

  // Info fields — только классы и URL, убраны cast/range/duration/components
  const fields = [
    ['Классы', Array.isArray(sp?.classes) ? sp.classes.map(c => {
      const cl = (window.CLASSES||[]).find(x=>x.id===c); return cl?.name||c;
    }).join(', ') : (sp?.classes||'')],
    ['URL', sp?.url ? `<a href="${sp.url}" target="_blank" rel="noopener" style="color:var(--accent2);word-break:break-all">${sp.url}</a>` : '—'],
  ];
  document.getElementById('sd-fields').innerHTML = fields.map(([label, val]) =>
    val ? `<div class="spell-detail-field">
      <div class="spell-detail-label">${label}</div>
      <div class="spell-detail-val">${val}</div>
    </div>` : ''
  ).filter(Boolean).join('');

  // Edit inputs
  document.getElementById('sd-e-name').value       = get('name') || name;
  document.getElementById('sd-e-level').value      = lvl !== '' ? lvl : '';
  document.getElementById('sd-e-cast').value       = get('cast');
  document.getElementById('sd-e-range').value      = get('range');
  document.getElementById('sd-e-duration').value   = get('duration');
  document.getElementById('sd-e-components').value = get('components');
  document.getElementById('sd-e-dmg').value        = ovr.dmg      !== undefined ? ovr.dmg      : (sp?.dmg || '');
  document.getElementById('sd-e-atkbonus').value   = ovr.atkbonus !== undefined ? ovr.atkbonus : '';
  document.getElementById('sd-e-notes').value      = (currentChar._spellNotes || {})[idx] || '';

  // ── Описание из библиотеки ──────────────────────────────────────────
  const descBlock = document.getElementById('sd-desc-block');
  const descEl    = document.getElementById('sd-desc');
  const descText  = _spellDescHtml(sp);
  if (descBlock && descEl) {
    if (descText) {
      descEl.className = 'spell-detail-desc';
      descEl.textContent = descText;
      descBlock.style.display = '';
    } else {
      descBlock.style.display = 'none';
    }
  }

  // ── Заклинательная характеристика (только на листе персонажа) ────────
  const saRow = document.getElementById('sd-e-spellability-row');
  const saSel = document.getElementById('sd-e-spellability');
  if (saRow && saSel) {
    saRow.style.display = '';
    // Per-spell override → character default → empty
    const savedAbility = (currentChar._spellAbilities || {})[idx];
    const defaultAbility = currentChar.spellAbility || '';
    saSel.value = savedAbility !== undefined ? savedAbility : defaultAbility;
  }

  document.getElementById('spell-detail-overlay').classList.remove('hidden');
}

function closeSpellDetail() {
  document.getElementById('spell-detail-overlay').classList.add('hidden');
  _sdIdx = -1;
}

function saveSpellDetail() {
  if (_sdIdx < 0 || !currentChar) return;
  if (!currentChar._spellOverrides) currentChar._spellOverrides = {};
  if (!currentChar._spellNotes)     currentChar._spellNotes = {};

  const newName = document.getElementById('sd-e-name').value.trim();
  const ovr = {
    name:       newName || currentChar.spells[_sdIdx],
    level:      parseInt(document.getElementById('sd-e-level').value) || 0,
    cast:       document.getElementById('sd-e-cast').value.trim(),
    range:      document.getElementById('sd-e-range').value.trim(),
    duration:   document.getElementById('sd-e-duration').value.trim(),
    components: document.getElementById('sd-e-components').value.trim(),
    dmg:        document.getElementById('sd-e-dmg').value.trim() || undefined,
    atkbonus:   document.getElementById('sd-e-atkbonus').value.trim() || undefined,
  };
  // Remove undefined keys
  Object.keys(ovr).forEach(k => ovr[k] === undefined && delete ovr[k]);
  currentChar._spellOverrides[_sdIdx] = ovr;
  currentChar._spellNotes[_sdIdx]     = document.getElementById('sd-e-notes').value;
  // Per-spell spellcasting ability override
  if (!currentChar._spellAbilities) currentChar._spellAbilities = {};
  const saVal = document.getElementById('sd-e-spellability')?.value || '';
  if (saVal) {
    currentChar._spellAbilities[_sdIdx] = saVal;
  } else {
    delete currentChar._spellAbilities[_sdIdx];
  }
  // Update name in spells list if changed
  if (newName && newName !== currentChar.spells[_sdIdx]) {
    currentChar.spells[_sdIdx] = newName;
  }
  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  renderSpellsSheet(currentChar, pb);
  saveSheet();
  closeSpellDetail();
}

// ══════════════════════════════════════════════════════════
// RESOURCES (Ресурсы персонажа)
// ══════════════════════════════════════════════════════════
let _resEditIdx = -1;

const RES_TYPE_ICONS = {
  ammo:'🏹', scroll:'📜', potion:'⚗️', ki:'☯️',
  spell:'🔮', ability:'⭐', charge:'⚡', other:'🎯'
};


// ══════════════════════════════════════════════════════════════
// RESOURCE CONTEXT MENU
// ══════════════════════════════════════════════════════════════
let _rCtxIdx = -1;

function openResCtxMenu(e, idx) {
  e.preventDefault();
  e.stopPropagation();
  _rCtxIdx = idx;
  const r = currentChar?.resources?.[idx];
  if (!r) return;

  document.getElementById('rctx-name').textContent = r.name || '—';
  const metaParts = [r.cur + '/' + r.max];
  if (r.restShort) metaParts.push('Корот. отдых');
  if (r.restLong)  metaParts.push('Длит. отдых');
  document.getElementById('rctx-meta').textContent = metaParts.join(' · ');

  const menu = document.getElementById('res-ctx-menu');
  if (!menu) return;
  menu.classList.remove('visible');
  menu.style.left = '-9999px'; menu.style.top = '-9999px';
  _positionCtxMenu(menu, e.clientX, e.clientY);

  const close = (ev) => {
    if (!menu.contains(ev.target)) { menu.classList.remove('visible'); document.removeEventListener('mousedown', close); }
  };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}

function resCtxAction(action) {
  const menu = document.getElementById('res-ctx-menu');
  if (menu) menu.classList.remove('visible');
  if (_rCtxIdx < 0) return;
  if (action === 'edit') { openResDialog(_rCtxIdx); _rCtxIdx = -1; }
  if (action === 'del')  { _resDel(_rCtxIdx); _rCtxIdx = -1; }
  if (action === 'copy') {
    const r = currentChar?.resources?.[_rCtxIdx];
    if (r) {
      const copy = Object.assign({}, r, { name: r.name + ' (копия)' });
      currentChar.resources.splice(_rCtxIdx + 1, 0, copy);
      renderResourcesSheet(currentChar);
      autoSave();
      toast('📋 Ресурс скопирован', 'success');
    }
    _rCtxIdx = -1;
  }
}

function openResDialog(editIdx) {
  _resEditIdx = editIdx !== undefined ? editIdx : -1;
  const r = _resEditIdx >= 0 ? (currentChar?.resources || [])[_resEditIdx] : null;
  document.getElementById('res-dialog-title').textContent = r ? '✏️ Редактировать ресурс' : '🎯 Добавить ресурс';
  document.getElementById('res-name').value  = r?.name || '';
  document.getElementById('res-cur').value   = r?.cur !== undefined ? r.cur : 0;
  document.getElementById('res-max').value   = r?.max || 1;
  document.getElementById('res-type').value  = r?.type || 'other';
  document.getElementById('res-short').checked = !!(r?.restShort);
  document.getElementById('res-long').checked  = !!(r?.restLong);
  document.getElementById('res-note').value  = r?.note || '';
  document.getElementById('res-dialog-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('res-name').focus(), 60);
}

function closeResDialog() {
  document.getElementById('res-dialog-overlay').classList.add('hidden');
  _resEditIdx = -1;
}

function applyResDialog() {
  if (!currentChar) return;
  const name = document.getElementById('res-name').value.trim();
  if (!name) { document.getElementById('res-name').focus(); return; }
  const resource = {
    name,
    cur:       parseInt(document.getElementById('res-cur').value) || 0,
    max:       Math.max(1, parseInt(document.getElementById('res-max').value) || 1),
    type:      document.getElementById('res-type').value,
    restShort: document.getElementById('res-short').checked,
    restLong:  document.getElementById('res-long').checked,
    note:      document.getElementById('res-note').value.trim(),
  };
  resource.cur = Math.min(resource.cur, resource.max);
  if (!currentChar.resources) currentChar.resources = [];
  if (_resEditIdx >= 0) {
    currentChar.resources[_resEditIdx] = resource;
  } else {
    currentChar.resources.push(resource);
  }
  renderResourcesSheet(currentChar);
  closeResDialog();
}

function renderResourcesSheet(char) {
  const el = document.getElementById('s-resources');
  if (!el) return;
  const res = char?.resources || [];
  if (!res.length) { el.innerHTML = '<p class="note-text" style="margin:.2rem 0">Ресурсы не добавлены.</p>'; return; }

  el.innerHTML = '<div class="resource-cards">' + res.map((r, i) => {
    const icon = RES_TYPE_ICONS[r.type] || '🎯';
    const restTags = [
      r.restShort ? '<span class="resource-card-tag">Корот.</span>' : '',
      r.restLong  ? '<span class="resource-card-tag">Длит.</span>'  : '',
    ].filter(Boolean).join('');

    // Pips (up to 5 shown as pips, more as numeric spinner)
    let trackHtml;
    if (r.max <= 5) {
      trackHtml = '<div class="resource-pips">' +
        Array.from({length: r.max}, (_, j) =>
          `<div class="resource-pip ${j < r.cur ? 'used' : ''}" onclick="_resTogglePip(${i},${j})"></div>`
        ).join('') + '</div>';
    } else {
      trackHtml = `<div style="display:flex;align-items:center;gap:.3rem">
        <button style="background:none;border:1px solid #3d4a65;color:var(--text2);border-radius:3px;padding:0 .4rem;cursor:pointer;font-size:.8rem" onclick="_resAdj(${i},-1)">−</button>
        <input type="number" min="0" max="${r.max}" value="${r.cur}"
          style="width:3rem;text-align:center;background:#1e2438;border:1px solid #3d4a65;border-radius:3px;color:var(--text);font-size:.85rem;padding:.1rem .2rem"
          onchange="_resSetCur(${i},parseInt(this.value)||0);autoSave()"
          oninput="this.value=Math.max(0,Math.min(${r.max},parseInt(this.value)||0));autoSave()">
        <span style="color:var(--text3);font-size:.78rem">/${r.max}</span>
        <button style="background:none;border:1px solid #3d4a65;color:var(--text2);border-radius:3px;padding:0 .4rem;cursor:pointer;font-size:.8rem" onclick="_resAdj(${i},+1)">+</button>
      </div>`;
    }

    return `<div class="resource-card" onclick="openResDialog(${i})" oncontextmenu="openResCtxMenu(event,${i})" style="cursor:pointer">
      <div style="display:flex;align-items:center;gap:.45rem;flex:1;min-width:0;padding:.0 0">
        <span style="font-size:.9rem;flex-shrink:0">${icon}</span>
        <span class="resource-card-name" title="${r.note||''}">${r.name}${r.note ? ' <span style="font-size:.65rem;color:var(--text3);font-weight:400">'+r.note+'</span>' : ''}</span>
        <div class="resource-card-tags">${restTags}</div>
        <div onclick="event.stopPropagation()" style="flex-shrink:0">${trackHtml}</div>
        ${r.max <= 5 ? `<span class="resource-card-count" style="flex-shrink:0">${r.cur}/${r.max}</span>` : ''}
      </div>
      <span class="weapon-card-del" onclick="event.stopPropagation();_resDel(${i})" title="Удалить">✕</span>
    </div>`;
  }).join('') + '</div>';
}

function _resTogglePip(resIdx, pipIdx) {
  if (!currentChar?.resources?.[resIdx]) return;
  const r = currentChar.resources[resIdx];
  // Click used pip → reduce; click empty pip → fill to that pip
  if (pipIdx < r.cur) r.cur = pipIdx;
  else r.cur = pipIdx + 1;
  renderResourcesSheet(currentChar);
}

function _resAdj(resIdx, delta) {
  if (!currentChar?.resources?.[resIdx]) return;
  const r = currentChar.resources[resIdx];
  r.cur = Math.max(0, Math.min(r.max, r.cur + delta));
  renderResourcesSheet(currentChar);
}

function _resSetCur(resIdx, val) {
  if (!currentChar?.resources?.[resIdx]) return;
  const r = currentChar.resources[resIdx];
  r.cur = Math.max(0, Math.min(r.max, val));
  saveSheet();
}

function _resDel(idx) {
  if (!currentChar?.resources) return;
  const name = currentChar.resources[idx]?.name || 'этот ресурс';
  _confirmDel('Удалить ресурс?', `Удалить «${name}»? Это действие нельзя отменить.`, () => {
    currentChar.resources.splice(idx, 1);
    renderResourcesSheet(currentChar);
    saveSheet();
  });
}

// ══════════════════════════════════════════════════════════
// CURRENCY SYSTEM
// ══════════════════════════════════════════════════════════

function _updateHeaderGold(cur) {
  const gp = cur?.gp || 0;
  const sp = cur?.sp || 0;
  const cp = cur?.cp || 0;
  // Total in gold: 1 gp = 10 sp = 100 cp
  const total = Math.floor(gp + sp / 10 + cp / 100);
  const el = document.getElementById('hs-gold-display');
  if (el) el.textContent = total;
}

function openCurrencyDialog() {
  if (!currentChar) return;
  const cur = currentChar.currency || {gp:0, sp:0, cp:0};
  document.getElementById('cur-gp-cur').textContent = cur.gp || 0;
  document.getElementById('cur-sp-cur').textContent = cur.sp || 0;
  document.getElementById('cur-cp-cur').textContent = cur.cp || 0;
  document.getElementById('cur-gp-amt').value = 1;
  document.getElementById('cur-sp-amt').value = 1;
  document.getElementById('cur-cp-amt').value = 1;
  _refreshCurTotal();
  document.getElementById('currency-dialog-overlay').classList.remove('hidden');
}

function closeCurrencyDialog() {
  document.getElementById('currency-dialog-overlay').classList.add('hidden');
}

function curAdj(coin, dir) {
  if (!currentChar) return;
  if (!currentChar.currency) currentChar.currency = {gp:0,sp:0,cp:0};
  const amt = Math.max(0, parseInt(document.getElementById('cur-'+coin+'-amt').value) || 0);
  currentChar.currency[coin] = Math.max(0, (currentChar.currency[coin]||0) + dir * amt);
  document.getElementById('cur-'+coin+'-cur').textContent = currentChar.currency[coin];
  _refreshCurTotal();
  _updateHeaderGold(currentChar.currency);
  saveSheet();
}

function _refreshCurTotal() {
  if (!currentChar?.currency) return;
  const cur = currentChar.currency;
  const total = Math.floor((cur.gp||0) + (cur.sp||0)/10 + (cur.cp||0)/100);
  const el = document.getElementById('cur-total-gp');
  if (el) el.textContent = total + ' зм';
}

// ══ ДИАЛОГ РЕДАКТИРОВАНИЯ СТАТА ══
let _abilityDialogKey = null;

function openAbilityDialog(a) {
  if (!currentChar) return;
  _abilityDialogKey = a;
  const FULL = { СИЛ:'СИЛА', ЛОВ:'ЛОВКОСТЬ', ТЕЛ:'ТЕЛОСЛОЖЕНИЕ', ИНТ:'ИНТЕЛЛЕКТ', МДР:'МУДРОСТЬ', ХАР:'ХАРИЗМА' };
  document.getElementById('ability-dialog-title').textContent = FULL[a] || a;
  document.getElementById('ability-dialog-score').value = Math.min(30, currentChar.abilities?.[a] || 10);
  const sb = currentChar._saveBonus?.[a];
  document.getElementById('ability-dialog-save-bonus').value = sb != null ? sb : '';
  const so = currentChar._saveOverride?.[a];
  document.getElementById('ability-dialog-save-override').value = so != null ? so : '';
  document.getElementById('ability-dialog-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('ability-dialog-score').focus(), 50);
}

function closeAbilityDialog() {
  document.getElementById('ability-dialog-overlay').classList.add('hidden');
  _abilityDialogKey = null;
}

function applyAbilityDialog() {
  if (!currentChar || !_abilityDialogKey) return;
  const a = _abilityDialogKey;
  const score = Math.min(30, Math.max(1, parseInt(document.getElementById('ability-dialog-score').value) || 10));
  if (!currentChar.abilities) currentChar.abilities = {};
  currentChar.abilities[a] = score;

  const sbRaw = document.getElementById('ability-dialog-save-bonus').value.trim();
  if (!currentChar._saveBonus) currentChar._saveBonus = {};
  if (sbRaw === '' || sbRaw === '0') delete currentChar._saveBonus[a];
  else currentChar._saveBonus[a] = parseInt(sbRaw) || 0;

  const soRaw = document.getElementById('ability-dialog-save-override').value.trim();
  if (!currentChar._saveOverride) currentChar._saveOverride = {};
  if (soRaw === '') delete currentChar._saveOverride[a];
  else currentChar._saveOverride[a] = parseInt(soRaw) || 0;

  closeAbilityDialog();
  renderSheet(currentChar);
  saveSheet();
}

// ══ ДИАЛОГ РЕДАКТИРОВАНИЯ НАВЫКА ══
let _skillDialogName = null;

function openSkillDialog(name) {
  if (!currentChar) return;
  _skillDialogName = name;
  document.getElementById('skill-dialog-title').textContent = name;
  const bonus = currentChar._skillBonus?.[name];
  document.getElementById('skill-dialog-bonus').value = bonus != null ? bonus : '';
  const override = currentChar._skillOverride?.[name];
  document.getElementById('skill-dialog-override').value = override != null ? override : '';
  document.getElementById('skill-dialog-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('skill-dialog-bonus').focus(), 50);
}

function closeSkillDialog() {
  document.getElementById('skill-dialog-overlay').classList.add('hidden');
  _skillDialogName = null;
}

function applySkillDialog() {
  if (!currentChar || !_skillDialogName) return;
  const name = _skillDialogName;

  const bonusRaw = document.getElementById('skill-dialog-bonus').value.trim();
  if (!currentChar._skillBonus) currentChar._skillBonus = {};
  if (bonusRaw === '' || bonusRaw === '0') delete currentChar._skillBonus[name];
  else currentChar._skillBonus[name] = parseInt(bonusRaw) || 0;

  const overrideRaw = document.getElementById('skill-dialog-override').value.trim();
  if (!currentChar._skillOverride) currentChar._skillOverride = {};
  if (overrideRaw === '') delete currentChar._skillOverride[name];
  else {
    const v = Math.max(-50, Math.min(50, parseInt(overrideRaw) || 0));
    currentChar._skillOverride[name] = v;
  }

  closeSkillDialog();
  renderAbilitiesSheet(currentChar);
  saveSheet();
}

// ══ SHEET SETTINGS ══
// ══════════════════════════════════════════════════════════
// НАСТРОЙКИ БРОСКОВ (Discord webhook)
// ══════════════════════════════════════════════════════════

const RS_STORAGE_KEY = 'izzy_roll_settings';

function _loadRollSettings() {
  try { return JSON.parse(localStorage.getItem(RS_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function _saveRollSettingsToStorage(rs) {
  localStorage.setItem(RS_STORAGE_KEY, JSON.stringify(rs));
}

function getRollSettings() {
  return _loadRollSettings();
}

function openRollSettingsDialog() {
  const rs = _loadRollSettings();
  const urlEl    = document.getElementById('rs-webhook-url');
  const nameEl   = document.getElementById('rs-bot-name');
  const enEl     = document.getElementById('rs-enabled');
  const critsEl  = document.getElementById('rs-crits-only');
  if (urlEl)   urlEl.value    = rs.webhookUrl || '';
  if (nameEl)  nameEl.value   = rs.botName    || '';
  if (enEl)    enEl.checked   = !!rs.enabled;
  if (critsEl) critsEl.checked = !!rs.critsOnly;
  const statusEl = document.getElementById('rs-status');
  if (statusEl) { statusEl.textContent = ''; statusEl.className = 'roll-settings-status'; }
  document.getElementById('roll-settings-overlay')?.classList.remove('hidden');
}

function closeRollSettingsDialog() {
  document.getElementById('roll-settings-overlay')?.classList.add('hidden');
}

function _rsMarkDirty() {
  const statusEl = document.getElementById('rs-status');
  if (statusEl && statusEl.textContent && !statusEl.classList.contains('err')) {
    statusEl.textContent = ''; statusEl.className = 'roll-settings-status';
  }
}

function saveRollSettings() {
  const rs = {
    webhookUrl: document.getElementById('rs-webhook-url')?.value.trim() || '',
    botName:    document.getElementById('rs-bot-name')?.value.trim()    || '',
    enabled:    document.getElementById('rs-enabled')?.checked           || false,
    critsOnly:  document.getElementById('rs-crits-only')?.checked        || false,
  };
  _saveRollSettingsToStorage(rs);
  closeRollSettingsDialog();
  toast('✅ Настройки бросков сохранены', 'success');
}

async function testDiscordWebhook() {
  const url = document.getElementById('rs-webhook-url')?.value.trim();
  const name = document.getElementById('rs-bot-name')?.value.trim() || 'Izzy Wizzy';
  const statusEl = document.getElementById('rs-status');
  const testBtn  = document.getElementById('rs-test-btn');
  if (!url) {
    if (statusEl) { statusEl.textContent = '⚠ Укажите URL вебхука'; statusEl.className = 'roll-settings-status err'; }
    return;
  }
  if (testBtn) testBtn.classList.add('testing');
  if (statusEl) { statusEl.textContent = 'Отправка…'; statusEl.className = 'roll-settings-status'; }
  try {
    const charName  = currentChar?.name || 'Персонаж';
    const testResult = Math.ceil(Math.random()*20);
    const payload = {
      username: name,
      embeds: [{
        author: { name: charName },
        title: 'Тест · d20',
        description: `**${testResult}**
\`1к20\``,
        color: 0x7c6b9e,
      }]
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (resp.ok || resp.status === 204) {
      if (statusEl) { statusEl.textContent = '✓ Сообщение отправлено!'; statusEl.className = 'roll-settings-status ok'; }
    } else {
      const txt = await resp.text().catch(() => resp.status);
      if (statusEl) { statusEl.textContent = `✗ Ошибка ${resp.status}: ${String(txt).slice(0,60)}`; statusEl.className = 'roll-settings-status err'; }
    }
  } catch(e) {
    if (statusEl) { statusEl.textContent = `✗ ${e.message}`; statusEl.className = 'roll-settings-status err'; }
  } finally {
    if (testBtn) testBtn.classList.remove('testing');
  }
}

/**
 * Отправить бросок в Discord (вызывается из pushRoll).
 * Выполняется только если настройки включены и url задан.
 */
async function _sendRollToDiscord(label, result, math, opts = {}) {
  const rs = _loadRollSettings();
  if (!rs.enabled || !rs.webhookUrl) return;
  if (rs.critsOnly && !opts.crit && !opts.critFail) return;

  const charName  = currentChar?.name || 'Персонаж';
  const portrait  = currentChar?.portrait || null;  // base64 data URL (jpeg)
  const isCrit    = opts.crit;
  const isFail    = opts.critFail;
  const color     = isCrit ? 0x4caf7d : isFail ? 0xc0392b : 0x7c6b9e;

  // Discord embed: ## heading = large bold text (≈2× normal size)
  const descParts = [`## ${result}`];
  if (math) descParts.push('`' + math + '`');

  const embed = {
    author: { name: charName },
    title: label,
    description: descParts.join('\n'),
    color,
  };

  // Portrait: convert base64 data URL → Blob → send as multipart attachment
  // Discord supports attachment://filename.jpg as thumbnail url
  const hasPortrait = portrait && portrait.startsWith('data:image');

  if (hasPortrait) {
    embed.thumbnail = { url: 'attachment://portrait.jpg' };
  }

  const payloadJson = JSON.stringify({
    username: rs.botName || 'Izzy Wizzy',
    embeds: [embed],
  });

  try {
    if (hasPortrait) {
      // Convert base64 → Blob
      const base64 = portrait.split(',')[1];
      const binary = atob(base64);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'image/jpeg' });

      const form = new FormData();
      form.append('payload_json', payloadJson);
      form.append('files[0]', blob, 'portrait.jpg');

      await fetch(rs.webhookUrl, { method: 'POST', body: form });
    } else {
      await fetch(rs.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadJson,
      });
    }
  } catch { /* тихо игнорируем ошибки отправки */ }
}

function openSheetSettings() {
  const overlay = document.getElementById('sheet-settings-overlay');
  const menu    = document.getElementById('sheet-settings-menu');
  if (!overlay || !menu) return;
  // Sync checkboxes
  const hpEl = document.getElementById('opt-half-prof');
  const raEl = document.getElementById('opt-remarkable-athlete');
  const faEl = document.getElementById('opt-allow-firearms');
  if (hpEl && currentChar) hpEl.checked = !!currentChar.halfProficiency;
  if (raEl && currentChar) raEl.checked = !!currentChar.remarkableAthlete;
  if (faEl && currentChar) faEl.checked = !!currentChar.allowFirearms;
  // Position below the gear button, right-aligned to it
  const btn = document.getElementById('nav-sheet-gear');
  if (btn) {
    const r = btn.getBoundingClientRect();
    menu.style.top   = (r.bottom + 4) + 'px';
    menu.style.right = 'auto';
    // Measure actual menu width after making it visible but off-screen
    menu.style.left = '-9999px';
    menu.style.display = 'block';
    const mw = menu.offsetWidth;
    menu.style.left = Math.max(4, r.right - mw) + 'px';
  }
  overlay.style.display = 'block';
  menu.style.display    = 'block';
}
function closeSheetSettings() {
  document.getElementById('sheet-settings-overlay').style.display = 'none';
  document.getElementById('sheet-settings-menu').style.display    = 'none';
}

function openSpecialAbilitiesDialog() {
  if (!currentChar) return;
  const hpEl = document.getElementById('opt-half-prof');
  const raEl = document.getElementById('opt-remarkable-athlete');
  const faEl = document.getElementById('opt-allow-firearms');
  if (hpEl) hpEl.checked = !!currentChar.halfProficiency;
  if (raEl) raEl.checked = !!currentChar.remarkableAthlete;
  if (faEl) faEl.checked = !!currentChar.allowFirearms;
  document.getElementById('special-abilities-overlay').classList.remove('hidden');
}
function closeSpecialAbilitiesDialog() {
  document.getElementById('special-abilities-overlay').classList.add('hidden');
}

function openAboutDialog() {
  document.getElementById('about-overlay').classList.remove('hidden');
}
function closeAboutDialog() {
  document.getElementById('about-overlay').classList.add('hidden');
}

// ══ HP MAX OVERRIDE ══
function applyHpMaxOverride() {
  if (!currentChar) return;
  const val = Math.min(10000, Math.max(1, parseInt(document.getElementById('hpd-max-override')?.value) || 0));
  if (!val) return;
  currentChar.hpMax = val;
  // Update hidden input
  const el = document.getElementById('s-hp-max');
  if (el) el.value = val;
  // Clamp current HP
  if ((currentChar.hpCurrent || 0) > val) {
    currentChar.hpCurrent = val;
    const curEl = document.getElementById('s-hp-cur');
    if (curEl) curEl.value = val;
  }
  updateHpDisplay();
  _syncDeathSavesVisibility();
  saveSheet();
}

// ══ DEATH SAVES IN HP DIALOG ══
function _syncDeathSavesVisibility() {
  const cur = parseInt(document.getElementById('s-hp-cur')?.value) || 0;
  const panel = document.getElementById('hpd-death-saves');
  if (!panel) return;
  panel.style.display = cur <= 0 ? 'block' : 'none';
  if (cur <= 0) _renderDS2();
}

function _renderDS2() {
  if (!currentChar) return;
  const ds = currentChar.deathSaves || { successes:[false,false,false], failures:[false,false,false] };
  for (let i = 0; i < 3; i++) {
    const sp = document.getElementById(`ds2-succ-${i}`);
    const fp = document.getElementById(`ds2-fail-${i}`);
    if (sp) sp.classList.toggle('filled', !!(ds.successes||[])[i]);
    if (fp) fp.classList.toggle('filled', !!(ds.failures||[])[i]);
  }
  document.getElementById('ds2-result-msg').textContent = '';
}

function toggleDS2(type, idx) {
  if (!currentChar) return;
  if (!currentChar.deathSaves) currentChar.deathSaves = { successes:[false,false,false], failures:[false,false,false] };
  const arr = type === 'succ' ? currentChar.deathSaves.successes : currentChar.deathSaves.failures;
  arr[idx] = !arr[idx];
  _renderDS2();
  _checkDeathSaveOutcome();
  saveSheet();
}

function rollDeathSave() {
  if (!currentChar) return;
  const roll = Math.floor(Math.random() * 20) + 1;
  const die = document.getElementById('ds2-die');
  const msg = document.getElementById('ds2-result-msg');

  if (!currentChar.deathSaves) currentChar.deathSaves = { successes:[false,false,false], failures:[false,false,false] };

  let resultText = `Выпало ${roll}: `;
  let glowColor = '';

  if (roll === 20) {
    // Критический успех — встаём с 1 HP
    resultText = `🎉 Критический успех (20)! Встаёте с 1 ХП!`;
    glowColor = 'drop-shadow(0 0 12px rgba(46,204,113,1))';
    currentChar.deathSaves.successes = [false,false,false];
    currentChar.deathSaves.failures  = [false,false,false];
    setTimeout(() => {
      currentChar.hpCurrent = 1;
      const curEl = document.getElementById('s-hp-cur');
      if (curEl) curEl.value = 1;
      updateHpDisplay();
      _syncDeathSavesVisibility();
      saveSheet();
    }, 1200);
  } else if (roll === 1) {
    // Критический провал — 2 провала
    resultText = `💀 Критический провал (1)! +2 провала`;
    glowColor = 'drop-shadow(0 0 12px rgba(192,57,43,1))';
    const fails = currentChar.deathSaves.failures;
    let added = 0;
    for (let i = 0; i < 3 && added < 2; i++) { if (!fails[i]) { fails[i] = true; added++; } }
  } else if (roll >= 10) {
    // Успех
    resultText = `✅ Успех (${roll})`;
    glowColor = 'drop-shadow(0 0 10px rgba(46,204,113,.9))';
    const succs = currentChar.deathSaves.successes;
    for (let i = 0; i < 3; i++) { if (!succs[i]) { succs[i] = true; break; } }
  } else {
    // Провал
    resultText = `❌ Провал (${roll})`;
    glowColor = 'drop-shadow(0 0 10px rgba(192,57,43,.9))';
    const fails = currentChar.deathSaves.failures;
    for (let i = 0; i < 3; i++) { if (!fails[i]) { fails[i] = true; break; } }
  }

  // Animate die
  if (die) {
    die.style.transform = 'scale(1.3) rotate(15deg)';
    die.style.filter = glowColor;
    setTimeout(() => {
      die.style.transform = 'scale(1)';
      die.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,.25))';
    }, 600);
  }
  if (msg) msg.textContent = resultText;

  // Push to roll stack
  pushRoll('Спасбросок от смерти', roll, `1к20=${roll}`,
    { crit: roll===20, critFail: roll===1 });

  _renderDS2();
  _checkDeathSaveOutcome();
  saveSheet();
}

function _checkDeathSaveOutcome() {
  if (!currentChar?.deathSaves) return;
  const ds = currentChar.deathSaves;
  const msg = document.getElementById('ds2-result-msg');
  // 3 successes — stabilize
  if ((ds.successes||[]).every(Boolean)) {
    if (msg) msg.textContent = '💚 Стабилизирован! Восстановление с 1 ХП...';
    setTimeout(() => {
      currentChar.hpCurrent = 1;
      currentChar.deathSaves = { successes:[false,false,false], failures:[false,false,false] };
      const curEl = document.getElementById('s-hp-cur');
      if (curEl) curEl.value = 1;
      updateHpDisplay();
      _syncDeathSavesVisibility();
      saveSheet();
    }, 1500);
  }
  // 3 failures — dead
  if ((ds.failures||[]).every(Boolean)) {
    if (msg) msg.textContent = '💀 Персонаж погиб...';
    setTimeout(() => {
      if (msg && msg.textContent.includes('погиб')) msg.style.opacity = '0.4';
    }, 2000);
  }
}

// ══════════════════════════════════════════════════════════
// REST DIALOG
// ══════════════════════════════════════════════════════════

let _restHdSelected = 0;   // number of hit dice selected for short rest

function openRestDialog() {
  if (!currentChar) return;
  _restHdSelected = 0;
  switchRestTab('short');
  _buildRestHdPips();
  document.getElementById('rest-dialog-overlay').classList.remove('hidden');
}

function closeRestDialog() {
  document.getElementById('rest-dialog-overlay').classList.add('hidden');
}

function switchRestTab(tab) {
  document.getElementById('rest-tab-short').classList.toggle('active', tab==='short');
  document.getElementById('rest-tab-long').classList.toggle('active',  tab==='long');
  document.getElementById('rest-panel-short').style.display = tab==='short' ? '' : 'none';
  document.getElementById('rest-panel-long').style.display  = tab==='long'  ? '' : 'none';
}

function _buildRestHdPips() {
  if (!currentChar) return;
  const lv    = currentChar.level || 1;
  const hd    = currentChar.hitDieOverride || ('d'+(currentChar.hitDie||8));
  const used  = currentChar.usedHitDice || 0;          // how many spent since last long rest
  const avail = Math.max(0, lv - used);

  document.getElementById('rest-hd-type').textContent = hd;
  _restHdSelected = Math.min(_restHdSelected, avail);

  const pipsEl = document.getElementById('rest-hd-pips');
  pipsEl.innerHTML = '';
  for (let i = 0; i < lv; i++) {
    const pip = document.createElement('div');
    pip.className = 'rest-hd-pip' + (i >= avail ? ' used' : (i < _restHdSelected ? ' selected' : ''));
    pip.textContent = hd;
    if (i < avail) {
      const idx = i;
      pip.onclick = () => {
        _restHdSelected = (idx < _restHdSelected) ? idx : idx + 1;
        _buildRestHdPips();
      };
    }
    pipsEl.appendChild(pip);
  }
  _updateRestHdInfo();
}

function _updateRestHdInfo() {
  const infoEl = document.getElementById('rest-hd-info');
  if (!infoEl) return;
  if (_restHdSelected === 0) {
    infoEl.textContent = 'Выберите кости хитов для восстановления.';
    return;
  }
  const hd     = currentChar.hitDie || 8;
  const conMod = getMod((currentChar.abilities?.['ТЕЛ']) || 10);
  const minHp  = _restHdSelected * Math.max(1, 1 + conMod);
  const maxHp  = _restHdSelected * (hd + conMod);
  infoEl.textContent = `Восстановит ${_restHdSelected}${currentChar.hitDieOverride||'d'+hd}+${conMod>=0?'+':''}${_restHdSelected*conMod} ХП (${minHp}–${maxHp})`;
}

function doShortRest() {
  if (!currentChar) return;

  // 1. Roll hit dice and restore HP
  if (_restHdSelected > 0) {
    const hd     = currentChar.hitDie || 8;
    const conMod = getMod((currentChar.abilities?.['ТЕЛ']) || 10);
    let heal = 0;
    const hdStr = currentChar.hitDieOverride || `d${hd}`;
    const sign  = conMod >= 0 ? `+${conMod}` : `${conMod}`;
    for (let i = 0; i < _restHdSelected; i++) {
      const raw = Math.ceil(Math.random() * hd);
      const got = Math.max(1, raw + conMod);
      heal += got;
      pushRoll(`Кость хитов (${hdStr})`, got,
        `${hdStr}=${raw}${conMod !== 0 ? sign : ''}`);
    }
    const newHp = Math.min(currentChar.hpMax || 10, (currentChar.hpCurrent || 0) + heal);
    currentChar.hpCurrent = newHp;
    const curEl = document.getElementById('s-hp-cur');
    if (curEl) curEl.value = newHp;
    updateHpDisplay();
    // Track used hit dice
    currentChar.usedHitDice = (currentChar.usedHitDice || 0) + _restHdSelected;
    toast(`⚡ Короткий отдых: восстановлено ${heal} ХП`, 'success');
  } else {
    toast('⚡ Короткий отдых завершён.', 'info');
  }

  // 2. Restore resources marked restShort
  (currentChar.resources || []).forEach(r => {
    if (r.restShort) r.cur = r.max;
  });

  // 3. Restore warlock pact magic slots on short rest
  if (isWarlockChar(currentChar)) {
    if (!currentChar.usedSpellSlots) currentChar.usedSpellSlots = {};
    const [, pactLvl] = WARLOCK_PACT_TABLE[currentChar.level||1] || [1,1];
    currentChar.usedSpellSlots[String(pactLvl)] = 0;
    sheetUsedSlots = {...currentChar.usedSpellSlots};
    const _pbShort = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
    renderSpellsSheet(currentChar, _pbShort);
  }

  renderResourcesSheet(currentChar);
  saveSheet();
  closeRestDialog();
}

function doLongRest() {
  if (!currentChar) return;

  // 1. Restore all HP
  currentChar.hpCurrent = currentChar.hpMax || 10;
  const curEl = document.getElementById('s-hp-cur');
  if (curEl) curEl.value = currentChar.hpCurrent;
  updateHpDisplay();

  // 2. Restore all spell slots
  currentChar.usedSpellSlots = {};
  sheetUsedSlots = {};

  // 3. Restore all resources marked restLong
  (currentChar.resources || []).forEach(r => {
    if (r.restLong) r.cur = r.max;
  });

  // 4. Recover half spent hit dice (min 1)
  const lv   = currentChar.level || 1;
  const used = currentChar.usedHitDice || 0;
  const recover = Math.max(1, Math.floor(lv / 2));
  currentChar.usedHitDice = Math.max(0, used - recover);

  // 5. Reset death saves
  if (currentChar.deathSaves) {
    currentChar.deathSaves = { successes:[false,false,false], failures:[false,false,false] };
  }

  // 6. Reduce exhaustion by 1 (min 0)
  if (currentChar.exhaustion > 0) {
    currentChar.exhaustion = Math.max(0, (currentChar.exhaustion || 0) - 1);
    const exhEl = document.getElementById('s-exhaustion');
    if (exhEl) exhEl.value = currentChar.exhaustion;
  }

  const _pbLong = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  renderSpellsSheet(currentChar, _pbLong);
  renderResourcesSheet(currentChar);
  saveSheet();
  toast('🌙 Продолжительный отдых: все ХП и ячейки заклинаний восстановлены!', 'success');
  closeRestDialog();
}

// ══════════════════════════════════════════════════════════
// ROLL STACK — стопка результатов бросков
// ══════════════════════════════════════════════════════════

const ROLL_MAX_STACK   = 5;
const ROLL_SESSION_KEY = 'dnd_roll_history';
let   _rollStack       = [];   // [{label, result, math, crit}]

function _rollHistory() {
  try { return JSON.parse(sessionStorage.getItem(ROLL_SESSION_KEY) || '[]'); }
  catch { return []; }
}
function _pushRollHistory(entry) {
  const h = _rollHistory();
  h.unshift(entry);
  sessionStorage.setItem(ROLL_SESSION_KEY, JSON.stringify(h.slice(0, 200)));
}

/**
 * pushRoll(label, result, math, opts)
 *   label  — название броска, например "Акробатика" или "Булава — атака"
 *   result — итоговое число
 *   math   — строка вроде "(1к20)+3" или "2к6+4"
 *   opts   — { crit: bool, critFail: bool }
 */
let _rollHideTimer = null;

function pushRoll(label, result, math, opts = {}) {
  const entry = { label, result, math,
    crit: !!opts.crit, critFail: !!opts.critFail,
    ts: Date.now() };
  _rollStack.unshift(entry);
  if (_rollStack.length > ROLL_MAX_STACK) _rollStack.pop();
  _pushRollHistory(entry);
  _renderRollStack();
  _sendRollToDiscord(label, result, math, opts);
}

function _renderRollStack() {
  const stack = document.getElementById('roll-stack');
  const ctrls = document.getElementById('roll-stack-controls');
  if (!stack) return;
  if (_rollStack.length === 0) {
    stack.style.display = 'none';
    if (ctrls) ctrls.style.display = 'none';
    return;
  }
  stack.style.display = 'flex';

  stack.innerHTML = _rollStack.map((r, i) => {
    if (i === 0) {
      const resCls = r.crit ? ' crit' : r.critFail ? ' fail' : '';
      return `<div class="roll-card roll-card-latest">
        <div class="roll-card-label">${_esc(r.label)}</div>
        <div class="roll-card-result${resCls}">${r.result}</div>
        <div class="roll-card-math">${_esc(r.math)}</div>
      </div>`;
    } else {
      const col = r.crit ? 'color:#4caf72' : r.critFail ? 'color:#c0392b' : '';
      return `<div class="roll-card roll-card-compact">
        <div class="roll-card-compact-row">
          <span class="roll-card-compact-label">${_esc(r.label)}</span>
          <span class="roll-card-compact-val" style="${col}">${r.result}</span>
        </div>
      </div>`;
    }
  }).join('');

  // Position controls to right of latest (bottom) card
  if (ctrls) {
    ctrls.style.display = 'flex';
    requestAnimationFrame(() => {
      const stackRect = stack.getBoundingClientRect();
      ctrls.style.left   = (stackRect.right + 6) + 'px';
      ctrls.style.bottom = '1.1rem';
    });
  }
}

function clearRollStack() {
  _rollStack = [];
  _renderRollStack();
}

function openRollHistory() {
  const hist = _rollHistory();
  const list = document.getElementById('roll-history-list');
  if (!list) return;
  if (hist.length === 0) {
    list.innerHTML = '<div style="color:var(--text3);font-size:.8rem;text-align:center;padding:1rem">Бросков ещё не было</div>';
  } else {
    list.innerHTML = hist.map(r => {
      const col = r.crit ? 'color:#4caf72' : r.critFail ? 'color:#c0392b' : '';
      return `<div class="roll-hist-row">
        <div style="flex:1">
          <div class="roll-hist-label">${_esc(r.label)}</div>
          <div class="roll-hist-math">${_esc(r.math)}</div>
        </div>
        <div class="roll-hist-val" style="${col}">${r.result}</div>
      </div>`;
    }).join('');
  }
  document.getElementById('roll-history-overlay').classList.remove('hidden');
}

function closeRollHistory() {
  document.getElementById('roll-history-overlay').classList.add('hidden');
}

function clearRollHistory() {
  sessionStorage.removeItem(ROLL_SESSION_KEY);
  openRollHistory();
}

function _esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Roll helpers (used by weapon/skill/save click handlers) ──

function rollD20Check(label, bonus, opts = {}) {
  const d20    = Math.floor(Math.random() * 20) + 1;
  const total  = d20 + bonus;
  const isCrit = d20 === 20;
  const isFail = d20 === 1;
  const sign   = bonus >= 0 ? `+${bonus}` : `${bonus}`;
  const math   = bonus !== 0 ? `(1к20=${d20})${sign}` : `1к20=${d20}`;
  pushRoll(label, total, math, { crit: isCrit, critFail: isFail, ...opts });
  return { d20, total, isCrit, isFail };
}

/**
 * resolveFormula(formula, char)
 * Заменяет переменные (СИЛ)/(STR) и т.д. на числовые значения модификаторов.
 * Понимает кости вида NкD и NdD (любой регистр).
 * Возвращает { total, mathStr, formulaNorm }
 */
function resolveFormula(formula, char) {
  if (!formula) return { total: 0, mathStr: '0', formulaNorm: '0' };
  const ab = char?.abilities || {};
  const getMd = k => { const v = ab[k]||10; return Math.floor((v-10)/2); };
  // Ability mod map — both RU and EN variants
  const VARS = {
    'СИЛ': getMd('СИЛ'), 'STR': getMd('СИЛ'),
    'ЛОВ': getMd('ЛОВ'), 'DEX': getMd('ЛОВ'),
    'ТЕЛ': getMd('ТЕЛ'), 'CON': getMd('ТЕЛ'),
    'ИНТ': getMd('ИНТ'), 'INT': getMd('ИНТ'),
    'МДР': getMd('МДР'), 'WIS': getMd('МДР'),
    'ХАР': getMd('ХАР'), 'CHA': getMd('ХАР'),
    'УР':  char?.level  || 1, 'LVL': char?.level  || 1,
    'МАС': char?.proficiencyBonus || profBonus(char?.level||1),
    'PROF': char?.proficiencyBonus || profBonus(char?.level||1),
  };

  // Normalise dice notation: NdD → NкD (keep к as canonical)
  let f = formula.replace(/([0-9])[dD]([0-9])/g, '$1к$2')
                 .replace(/^[dD]([0-9])/g, '1к$1');

  // Resolve variable tokens like (СИЛ) [STR] {STR}
  // Normalize mixed-script names: map visually similar Cyrillic to Latin
  const CYRL_TO_LAT = {'А':'A','В':'B','С':'C','Е':'E','Н':'H','К':'K','М':'M',
                        'О':'O','Р':'P','Т':'T','У':'U','Х':'X','а':'a','е':'e',
                        'о':'o','р':'p','с':'c','у':'u','х':'x'};
  const normKey = s => s.toUpperCase().split('').map(c => CYRL_TO_LAT[c] || c).join('');

  f = f.replace(/[([{]([A-ZА-ЯЁa-zа-яё]+)[)\]}]/g, (_, name) => {
    const keyDirect = name.toUpperCase();
    const keyNorm   = normKey(name);
    const val = VARS[keyDirect] ?? VARS[keyNorm];
    if (val !== undefined) return String(val);
    return _; // unknown var — leave as-is
  });

  // Tokenise: split into dice groups (NкD) and flat numbers/operators
  // We'll build a list of segments, roll dice, and sum everything
  const parts = [];
  const mathParts = [];
  let remaining = f.replace(/\s+/g, '');

  // Parse full expression left-to-right
  // Token pattern: optional sign, optional count, к, sides   OR   optional sign, integer
  const TOKEN = /([+-]?)([0-9]*)к([0-9]+)|([+-]?[0-9]+)/gi;
  let lastIndex = 0;
  let match;
  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      // gap — ignore non-numeric junk
    }
    lastIndex = TOKEN.lastIndex;

    if (match[3] !== undefined) {
      // Dice group
      const sign = match[1] === '-' ? -1 : 1;
      const n    = parseInt(match[2]) || 1;
      const d    = parseInt(match[3]);
      const rolls = Array.from({length: n}, () => Math.floor(Math.random()*d)+1);
      const sum   = rolls.reduce((a,b)=>a+b,0) * sign;
      parts.push(sum);
      const rollStr = rolls.length > 1 ? `(${rolls.join('+')})` : `${rolls[0]}`;
      mathParts.push(`${match[1]==='-'?'-':''}${rollStr}[${n}к${d}]`);
    } else if (match[4] !== undefined) {
      // Flat number
      const val = parseInt(match[4]);
      parts.push(val);
      if (val !== 0) mathParts.push(String(val));
    }
  }

  const total = parts.reduce((a,b)=>a+b, 0);
  const mathStr = mathParts.join('+').replace(/\+-/g,'-') || '0';
  return { total, mathStr, formulaNorm: f };
}

function rollDamage(label, formula, bonusOverride) {
  // bonusOverride: legacy flat bonus added on top (e.g. ability mod from rollWeaponDmg)
  // If formula already contains variable tokens, bonusOverride should be 0
  if (!formula) { pushRoll(label, bonusOverride||0, String(bonusOverride||0)); return bonusOverride||0; }

  // Add flat bonus to formula string if provided and non-zero
  const fullFormula = (bonusOverride && bonusOverride !== 0)
    ? `${formula}${bonusOverride > 0 ? '+' : ''}${bonusOverride}`
    : formula;

  const { total, mathStr } = resolveFormula(fullFormula, currentChar);
  const math = `${mathStr} = ${total}`;
  pushRoll(label, total, math);
  return total;
}

// ── Initiative roll ──
function rollInitiative() {
  if (!currentChar) return;
  const dexMod = getMod(currentChar.abilities?.['ЛОВ'] || 10);
  const initBonus = currentChar._initOverride != null
    ? currentChar._initOverride
    : dexMod + (currentChar.initiative || 0);
  rollD20Check('Инициатива', initBonus);
}

// ── Weapon card roll — attack only ──

// ══════════════════════════════════════════════════════════════
// SPELL CARD ROLLS
// ══════════════════════════════════════════════════════════════

function _getSpellRollData(idx) {
  if (!currentChar) return null;
  const name = currentChar.spells?.[idx];
  if (!name) return null;
  const sp   = (window.SPELLS||[]).find(s => s.name === name);
  const ovr  = (currentChar._spellOverrides || {})[idx] || {};
  const pb   = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  // Per-spell ability override → character default
  const saKey = (currentChar._spellAbilities || {})[idx] || currentChar.spellAbility || null;
  const abMod = saKey ? getMod(currentChar.abilities?.[saKey] || 10) : 0;
  const baseAtkBonus = pb + abMod;
  // Extra bonus from override (formula or flat)
  const atkExtra = ovr.atkbonus
    ? (resolveFormula(String(ovr.atkbonus), currentChar).total || 0)
    : 0;
  const totalAtkBonus = baseAtkBonus + atkExtra;
  const dmgFormula = ovr.dmg !== undefined ? ovr.dmg : (sp?.dmg || null);
  return { name, sp, ovr, pb, abMod, baseAtkBonus, atkExtra, totalAtkBonus, dmgFormula };
}

function rollSpellAtk(idx) {
  const d = _getSpellRollData(idx);
  if (!d || !d.sp?.hasAtk) return;
  rollD20Check(`${d.name} — атака`, d.totalAtkBonus);
}

function rollSpellDmg(idx) {
  const d = _getSpellRollData(idx);
  if (!d || !d.dmgFormula) return;
  rollDamage(`${d.name} — урон`, d.dmgFormula, 0);
}

function rollSpellSave(idx) {
  // Just show the DC as an info roll (d20 for reference) — DM uses this value
  const d = _getSpellRollData(idx);
  if (!d || !d.sp?.save) return;
  const dc = 8 + d.baseAtkBonus; // 8 + pb + abMod
  pushRoll(`${d.name} — Спасбросок ${d.sp.save}`, dc, `СЗ ${dc} (8 + ${d.pb} + ${d.abMod})`);
}

function rollWeaponAtk(idx) {
  if (!currentChar?.weapons?.[idx]) return;
  const w  = currentChar.weapons[idx];
  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  const AB_MAP = {str:'СИЛ',dex:'ЛОВ',int:'ИНТ',wis:'МДР',cha:'ХАР',con:'ТЕЛ'};
  const abKey  = AB_MAP[w.ability||'str'] || 'СИЛ';
  const abMod  = getMod(currentChar.abilities?.[abKey] || 10);
  const atkBonus = (w.attackBonus||0) + (w.isProf?pb:0) + abMod;
  rollD20Check(`${w.name} — атака`, atkBonus);
}

// ── Weapon card roll — damage only ──
function rollWeaponDmg(idx) {
  if (!currentChar?.weapons?.[idx]) return;
  const w  = currentChar.weapons[idx];
  const AB_MAP = {str:'СИЛ',dex:'ЛОВ',int:'ИНТ',wis:'МДР',cha:'ХАР',con:'ТЕЛ'};
  const abKey  = AB_MAP[w.ability||'str'] || 'СИЛ';
  const abMod  = getMod(currentChar.abilities?.[abKey] || 10);
  if (w.damage) {
    const dmgBonus = abMod + (w.attackBonus||0);
    rollDamage(`${w.name} — урон`, w.damage, dmgBonus);
  }
}

// ── Weapon card roll (attack + damage) ──
function rollWeapon(idx) {
  rollWeaponAtk(idx);
  rollWeaponDmg(idx);
}

// ── Skill check roll ──
function rollSkillCheck(skillName) {
  if (!currentChar) return;
  const SKILL_AB = {
    'Акробатика':'ЛОВ','Магия':'ИНТ','Атлетика':'СИЛ','Обман':'ХАР',
    'История':'ИНТ','Проницательность':'МДР','Запугивание':'ХАР',
    'Расследование':'ИНТ','Медицина':'МДР','Природа':'ИНТ',
    'Внимательность':'МДР','Выступление':'ХАР','Убеждение':'ХАР',
    'Религия':'ИНТ','Ловкость рук':'ЛОВ','Скрытность':'ЛОВ',
    'Выживание':'МДР','Уход за животными':'МДР','Анализ':'ИНТ',
    'Восприятие':'МДР',
  };
  const pb  = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  const ab  = SKILL_AB[skillName] || 'СИЛ';
  const mod = getMod(currentChar.abilities?.[ab] || 10);
  const exp = sheetSkillExp?.[skillName] || 0;
  const bonus = exp===2?(pb*2):exp===1?pb:(currentChar.halfProficiency?Math.floor(pb/2):0);
  const extra = currentChar._skillOverride?.[skillName] != null
    ? (currentChar._skillOverride[skillName] - mod - bonus)
    : (currentChar._skillBonus?.[skillName] || 0);
  const total  = currentChar._skillOverride?.[skillName] != null
    ? currentChar._skillOverride[skillName]
    : mod + bonus + extra;
  // total is the final bonus — pass as bonus to d20 roll
  rollD20Check(skillName, total);
}

// ── Ability check roll ──
function rollAbilityCheck(abKey) {
  if (!currentChar) return;
  const FULL = {СИЛ:'Сила',ЛОВ:'Ловкость',ТЕЛ:'Телосложение',ИНТ:'Интеллект',МДР:'Мудрость',ХАР:'Харизма'};
  const mod = getMod(currentChar.abilities?.[abKey] || 10);
  rollD20Check(`Проверка: ${FULL[abKey]||abKey}`, mod);
}

// ── Saving throw roll ──
function rollSaveCheck(abKey) {
  if (!currentChar) return;
  const FULL = {СИЛ:'Сила',ЛОВ:'Ловкость',ТЕЛ:'Телосложение',ИНТ:'Интеллект',МДР:'Мудрость',ХАР:'Харизма'};
  const pb  = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  const mod = getMod(currentChar.abilities?.[abKey] || 10);
  const isP = (currentChar.savingThrows||[]).includes(abKey);
  const over = currentChar._saveOverride?.[abKey];
  const bonus = over != null ? over : mod + (isP?pb:0) + (currentChar._saveBonus?.[abKey]||0);
  rollD20Check(`Спасбросок: ${FULL[abKey]||abKey}`, bonus);
}

// ══ LEVEL UP HP ══
function levelUpHp() {
  if (!currentChar) return;
  const hd     = currentChar.hitDie || 8;
  const conMod = getMod((currentChar.abilities?.['ТЕЛ']) || 10);
  const roll   = Math.ceil(Math.random() * hd);
  const gain   = Math.max(1, roll + conMod);
  const newMax = Math.min(10000, (currentChar.hpMax || 10) + gain);
  currentChar.hpMax = newMax;
  const maxEl = document.getElementById('s-hp-max');
  if (maxEl) maxEl.value = newMax;
  const overrideEl = document.getElementById('hpd-max-override');
  if (overrideEl) overrideEl.value = newMax;
  const signCon = conMod >= 0 ? `+${conMod}` : `${conMod}`;
  pushRoll(`Повышение макс. ХП (к${hd})`, gain, `к${hd}=${roll}${conMod !== 0 ? signCon : ''}`);
  toast(`⬆ +${gain} к максимуму ХП`, 'success');
  updateHpDisplay();
  saveSheet();
}

function _refreshLevelUpLabel() {
  if (!currentChar) return;
  const hd     = currentChar.hitDie || 8;
  const conMod = getMod((currentChar.abilities?.['ТЕЛ']) || 10);
  const el = document.getElementById('hpd-levelup-label');
  if (el) el.textContent = `d${hd}${conMod >= 0 ? '+' : ''}${conMod}`;
}

// ══════════════════════════════════════════════════════════
// CONFIRM DELETE DIALOG
// ══════════════════════════════════════════════════════════
let _confirmDelCallback = null;

function _confirmDel(title, msg, callback) {
  document.getElementById('confirm-del-title').textContent = title;
  document.getElementById('confirm-del-msg').textContent   = msg;
  _confirmDelCallback = callback;
  document.getElementById('confirm-del-overlay').classList.remove('hidden');
}
function _closeConfirmDel() {
  document.getElementById('confirm-del-overlay').classList.add('hidden');
  _confirmDelCallback = null;
}
function _execConfirmDel() {
  const cb = _confirmDelCallback;
  _closeConfirmDel();
  if (cb) cb();
}

// ══════════════════════════════════════════════════════════
// CUSTOM SPELL DIALOG
// ══════════════════════════════════════════════════════════
function openCustomSpellDialog() {
  // Clear fields
  ['cs-name','cs-cast','cs-range','cs-components','cs-duration','cs-desc','cs-notes']
    .forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('cs-level').value = '1';
  document.getElementById('cs-school').value = '';
  document.getElementById('cs-concentration').checked = false;
  document.getElementById('cs-ritual').checked = false;
  document.getElementById('custom-spell-overlay').classList.remove('hidden');
}

function closeCustomSpellDialog() {
  document.getElementById('custom-spell-overlay').classList.add('hidden');
}

function saveCustomSpell() {
  const name = document.getElementById('cs-name').value.trim();
  if (!name) { toast('⚠️ Введите название заклинания', 'error'); return; }

  // Build spell object and register in window.SPELLS (local session)
  const spell = {
    name,
    level:         parseInt(document.getElementById('cs-level').value) || 0,
    school:        document.getElementById('cs-school').value,
    cast:          document.getElementById('cs-cast').value.trim(),
    range:         document.getElementById('cs-range').value.trim(),
    components:    document.getElementById('cs-components').value.trim(),
    duration:      document.getElementById('cs-duration').value.trim(),
    concentration: document.getElementById('cs-concentration').checked,
    ritual:        document.getElementById('cs-ritual').checked,
    description:   document.getElementById('cs-desc').value.trim(),
    _customNotes:  document.getElementById('cs-notes').value.trim(),
    source:        'Homebrew',
    _isCustom:     true,
  };

  // Add to global SPELLS if not already present
  if (!window.SPELLS) window.SPELLS = [];
  if (!window.SPELLS.find(s => s.name === name)) {
    window.SPELLS.push(spell);
  } else {
    // Update existing custom spell
    const idx = window.SPELLS.findIndex(s => s.name === name);
    window.SPELLS[idx] = spell;
  }

  // Add to current char
  if (currentChar) {
    if (!currentChar.spells) currentChar.spells = [];
    if (!currentChar.spells.includes(name)) currentChar.spells.push(name);
    // Store notes/overrides
    const spellIdx = currentChar.spells.indexOf(name);
    if (!currentChar._spellOverrides) currentChar._spellOverrides = {};
    currentChar._spellOverrides[spellIdx] = spell;
    const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
    renderSpellsSheet(currentChar, pb);
    saveSheet();
  }

  closeCustomSpellDialog();
  closeSpellBrowser();
  toast(`✨ Заклинание «${name}» добавлено`, 'success');
}

function _invDel(idx) {
  if (!currentChar?.inventory?.[idx]) return;
  const item = currentChar.inventory[idx];
  const name = item.name?.trim() || 'предмет';
  const cost = item.costGp ?? (item.id ? (window.findItemById?.(item.id)?.costGp ?? null) : null);
  const halfPrice = cost != null ? parseFloat((cost * (item.qty || 1) / 2).toFixed(2)) : null;
  const textEl  = document.getElementById('inv-del-text');
  const sellBtn = document.getElementById('inv-del-sell-btn');
  const dropBtn = document.getElementById('inv-del-drop-btn');
  if (textEl) {
    const priceNote = halfPrice != null
      ? ` за <b>${halfPrice} зм</b> (полцены)` : ' (стоимость неизвестна — ничего не получите)';
    textEl.innerHTML = `Вы точно хотите продать <b>«${name}»</b>${priceNote} или выбросить?<br>
      <span style="font-size:.78rem;color:var(--text3)">Это действие нельзя отменить.</span>`;
  }
  if (sellBtn) sellBtn.onclick = () => { _invSell(idx, halfPrice); };
  if (dropBtn) dropBtn.onclick = () => { _invDrop(idx); };
  const ov = document.getElementById('inv-del-overlay');
  if (ov) ov.classList.remove('hidden');
}

// ── SELL / DROP helpers ────────────────────────────────────────────────
function closeInvDelDialog() {
  const ov = document.getElementById('inv-del-overlay');
  if (ov) ov.classList.add('hidden');
}
function _invSell(idx, halfPrice) {
  if (!currentChar?.inventory?.[idx]) return;
  if (halfPrice != null && halfPrice > 0) {
    if (!currentChar.currency) currentChar.currency = {};
    currentChar.currency.gp = parseFloat(((parseFloat(currentChar.currency.gp)||0) + halfPrice).toFixed(4));
    if(currentChar) _updateHeaderGold(currentChar.currency);
  }
  currentChar.inventory.splice(idx, 1);
  closeInvDelDialog();
  renderInventorySheet(currentChar);
  saveSheet();
}
function _invDrop(idx) {
  if (!currentChar?.inventory?.[idx]) return;
  currentChar.inventory.splice(idx, 1);
  closeInvDelDialog();
  renderInventorySheet(currentChar);
  saveSheet();
}

// ── ADD ITEM MENU ──────────────────────────────────────────────────────
function openAddItemMenu(btn) {
  const menu = document.getElementById('add-item-menu');
  if (!menu) return;
  if (menu.style.display === 'block') { menu.style.display = 'none'; return; }
  menu.style.display = 'block';
  const close = e => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.style.display = 'none';
      document.removeEventListener('click', close);
    }
  };
  setTimeout(() => document.addEventListener('click', close), 10);
}
function closeAddItemMenu() {
  const m = document.getElementById('add-item-menu');
  if (m) m.style.display = 'none';
}

// ── CREATE ITEM DIALOG ─────────────────────────────────────────────────
function openCreateItemDialog() {
  const ov = document.getElementById('create-item-overlay');
  if (ov) ov.classList.remove('hidden');
  renderCreateItemFields();
}
function closeCreateItemDialog() {
  const ov = document.getElementById('create-item-overlay');
  if (ov) ov.classList.add('hidden');
}
const CI_FIELDS = {
  gear:   [['name','Название','text'],['qty','Количество','number'],['costGp','Стоимость (зм)','number'],['weight','Вес (фунты)','number'],['description','Описание / заметки','text']],
  weapon: [['name','Название','text'],['qty','Количество','number'],['damageDice','Кость урона (напр. 1к8)','text'],['damageType','Тип урона','text'],['costGp','Стоимость (зм)','number'],['weight','Вес (фунты)','number'],['description','Описание','text']],
  armor:  [['name','Название','text'],['qty','Количество','number'],['ac','КД (напр. 14 + мод.Ловк.)','text'],['costGp','Стоимость (зм)','number'],['weight','Вес (фунты)','number'],['description','Описание','text']],
  tool:   [['name','Название','text'],['qty','Количество','number'],['costGp','Стоимость (зм)','number'],['weight','Вес (фунты)','number'],['description','Описание','text']],
  kit:    [['name','Название','text'],['qty','Количество','number'],['costGp','Стоимость (зм)','number'],['weight','Вес (фунты)','number'],['description','Содержимое','text']],
};
function renderCreateItemFields() {
  const type = document.getElementById('ci-type')?.value || 'gear';
  const container = document.getElementById('ci-fields');
  if (!container) return;
  container.innerHTML = (CI_FIELDS[type] || CI_FIELDS.gear).map(([id, label, itype]) => `
    <div>
      <label style="font-size:.73rem;color:var(--text3);display:block;margin-bottom:.2rem">${label}</label>
      <input id="ci-${id}" type="${itype}" placeholder="${label}"
        style="width:100%;padding:.3rem .5rem;background:#0e1525;border:1px solid #3a4a66;
               border-radius:4px;color:var(--text);font-size:.84rem;box-sizing:border-box"
        ${itype === 'number' ? 'min="0" step="any"' : ''}>
    </div>`).join('');
  const qtyEl = document.getElementById('ci-qty');
  if (qtyEl && !qtyEl.value) qtyEl.value = 1;
}
function saveCreatedItem() {
  if (!currentChar) return;
  const type = document.getElementById('ci-type')?.value || 'gear';
  const get  = id => { const el = document.getElementById('ci-'+id); return el ? el.value.trim() : ''; };
  const getN = id => { const v = parseFloat(get(id)); return isNaN(v) ? null : v; };
  const name = get('name');
  if (!name) { alert('Укажите название предмета'); return; }
  const item = {
    id: null, name, qty: Math.max(1, parseInt(get('qty'))||1),
    itemClass: type, weight: getN('weight') ?? 0,
    costGp: getN('costGp'), description: get('description') || '',
  };
  if (type === 'weapon') { item.damageDice = get('damageDice'); item.damageType = get('damageType'); }
  if (type === 'armor')  { item.ac = get('ac'); }
  if (!currentChar.inventory) currentChar.inventory = [];
  currentChar.inventory.push(item);
  closeCreateItemDialog();
  renderInventorySheet(currentChar);
  saveSheet();
}

// ── ITEMS BROWSER ──────────────────────────────────────────────────────
let _ibSelected = {};

// ══════════════════════════════════════════════════════════════
// REST BROWSER — Питание и постой
// ══════════════════════════════════════════════════════════════

let _rbSelected = null; // { name, costGp, priceDisplay, desc }

function openRestBrowser() {
  _rbSelected = null;
  // Заполнить категории в select
  const catSel = document.getElementById('rb-cat');
  if (catSel) {
    catSel.innerHTML = '<option value="">Все категории</option>' +
      (window.REST_ITEMS || []).map(g =>
        `<option value="${g.category}">${g.icon} ${g.category}</option>`
      ).join('');
  }
  const s = document.getElementById('rb-search'); if (s) s.value = '';
  if (catSel) catSel.value = '';
  _rbUpdateButtons();
  _rbRender();
  const ov = document.getElementById('rest-browser-overlay');
  if (ov) ov.classList.remove('hidden');
}

function closeRestBrowser() {
  const ov = document.getElementById('rest-browser-overlay');
  if (ov) ov.classList.add('hidden');
  _rbSelected = null;
}

function _rbRender() {
  const container = document.getElementById('rb-list');
  if (!container) return;
  const q   = normalizeRu(document.getElementById('rb-search')?.value || '');
  const cat = document.getElementById('rb-cat')?.value || '';
  let html  = '';
  for (const group of (window.REST_ITEMS || [])) {
    if (cat && group.category !== cat) continue;
    const filtered = group.items.filter(it => !q || normalizeRu(it.name).includes(q));
    if (!filtered.length) continue;
    html += `<div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;
      color:var(--text3);padding:.4rem .5rem .15rem;opacity:.7">${group.icon} ${group.category}</div>`;
    for (const it of filtered) {
      const sel = _rbSelected?.name === it.name;
      html += `<div class="ib-item${sel ? ' ib-item-sel' : ''}" data-rbname="${it.name.replace(/"/g,'&quot;')}"
        onclick="_rbSelect(this)">
        <div style="flex:1;min-width:0;pointer-events:none">
          <div style="font-size:.84rem;font-weight:600;color:var(--text)">${it.name}</div>
          ${it.desc ? `<div style="font-size:.7rem;color:var(--text3)">${it.desc}</div>` : ''}
        </div>
        <div style="text-align:right;font-size:.75rem;color:#c8aa60;flex-shrink:0;pointer-events:none;white-space:nowrap">
          ${it.priceDisplay}
        </div>
      </div>`;
    }
  }
  if (!html) html = '<p class="note-text">Ничего не найдено.</p>';
  container.innerHTML = html;
  _rbUpdateTotal();
}

function _rbSelect(row) {
  const name = row.dataset.rbname;
  // Найти объект
  let found = null;
  for (const group of (window.REST_ITEMS || []))
    for (const it of group.items)
      if (it.name === name) { found = it; break; }
  if (!found) return;
  _rbSelected = _rbSelected?.name === name ? null : found;
  _rbRender();
  _rbUpdateButtons();
}

function _rbUpdateTotal() {
  const qty = parseInt(document.getElementById('rb-qty')?.value) || 1;
  const el  = document.getElementById('rb-total-price');
  const nm  = document.getElementById('rb-selected-name');
  if (_rbSelected) {
    const total = (_rbSelected.costGp * qty).toFixed(2);
    if (el) el.textContent = `Итого: ${total} зм`;
    if (nm) nm.textContent = _rbSelected.name + (qty > 1 ? ` × ${qty}` : '');
  } else {
    if (el) el.textContent = '';
    if (nm) nm.textContent = '';
  }
}

function _rbUpdateButtons() {
  const on = !!_rbSelected;
  const cb = document.getElementById('rb-consume-btn');
  const bb = document.getElementById('rb-buy-btn');
  if (cb) cb.disabled = !on;
  if (bb) bb.disabled = !on;
  // qty oninput → обновлять итог
  const qtyEl = document.getElementById('rb-qty');
  if (qtyEl) qtyEl.oninput = () => { _rbUpdateTotal(); };
}

function _rbDeductGold(totalGp) {
  if (!currentChar) return false;
  if (!currentChar.currency) currentChar.currency = {};
  const curGp = parseFloat(currentChar.currency.gp) || 0;
  if (totalGp > curGp) {
    // Показать диалог нехватки золота
    const ov  = document.getElementById('gold-confirm-overlay');
    const txt = document.getElementById('gold-confirm-text');
    const btn = document.getElementById('gold-confirm-ok');
    if (ov && txt && btn) {
      txt.innerHTML = `Нужно: <b style="color:#c8aa60">${totalGp.toFixed(2)} зм</b><br>В кошельке: <b>${curGp.toFixed(2)} зм</b>`;
      btn.onclick = null; // просто показываем, без принудительного продолжения
      ov.classList.remove('hidden');
    }
    return false;
  }
  currentChar.currency.gp = parseFloat((curGp - totalGp).toFixed(4));
  _updateHeaderGold(currentChar.currency);
  return true;
}

// Употребить: списать деньги, не добавлять в инвентарь
function restConsume() {
  if (!currentChar || !_rbSelected) return;
  const qty    = Math.max(1, parseInt(document.getElementById('rb-qty')?.value) || 1);
  const total  = _rbSelected.costGp * qty;
  if (!_rbDeductGold(total)) return;
  closeRestBrowser();
  autoSave();
  toast(`🍽 ${_rbSelected.name}${qty > 1 ? ' × ' + qty : ''} — употреблено (−${total.toFixed(2)} зм)`, 'success');
}

// Купить: списать деньги И добавить в инвентарь
function restBuy() {
  if (!currentChar || !_rbSelected) return;
  const qty   = Math.max(1, parseInt(document.getElementById('rb-qty')?.value) || 1);
  const total = _rbSelected.costGp * qty;
  if (!_rbDeductGold(total)) return;
  if (!currentChar.inventory) currentChar.inventory = [];
  currentChar.inventory.push({
    name:      _rbSelected.name,
    qty,
    weight:    _rbSelected.weightLbs ?? 0,
    costGp:    _rbSelected.costGp,
    itemClass: 'gear',
    description: _rbSelected.desc || '',
  });
  closeRestBrowser();
  renderInventorySheet(currentChar);
  autoSave();
  toast(`🛒 ${_rbSelected.name}${qty > 1 ? ' × ' + qty : ''} куплено (−${total.toFixed(2)} зм)`, 'success');
}

function openItemsBrowser() {
  _ibSelected = {};
  const ov = document.getElementById('items-browser-overlay');
  if (ov) ov.classList.remove('hidden');
  const s = document.getElementById('ib-search'); if (s) s.value = '';
  const t = document.getElementById('ib-type');   if (t) t.value = '';
  const so= document.getElementById('ib-sort');   if (so) so.value = 'type';
  _ibSyncFirearmsOptions();
  renderItemsBrowserList();
}
function closeItemsBrowser() {
  const ov = document.getElementById('items-browser-overlay');
  if (ov) ov.classList.add('hidden');
  _ibSelected = {};
}
function _ibAllItems() {
  const allowFirearms = !!(currentChar?.allowFirearms);
  const BLOCKED = ['special'];
  if (!allowFirearms) BLOCKED.push('firearm','firearm_ammo','explosive');
  // 'ammo' items (arrows etc.) always visible regardless of firearms setting
  const kits = (window.ITEMS_KITS||[]).map(k => ({...k, itemClass:'kit'}));
  return [...(window.ITEMS_ALL||[]), ...kits].filter(it => !BLOCKED.includes(it.itemClass));
}

/** Sync firearms-related <option> visibility in #ib-type dropdown */
function _ibSyncFirearmsOptions() {
  const allow = !!(currentChar?.allowFirearms);
  ['firearm','firearm_ammo','explosive'].forEach(val => {
    const opt = document.querySelector(`#ib-type option[value="${val}"]`);
    if (opt) opt.style.display = allow ? '' : 'none';
  });
  // If currently selected option is now hidden, reset to ""
  const sel = document.getElementById('ib-type');
  if (sel && !allow && ['firearm','firearm_ammo','explosive'].includes(sel.value)) {
    sel.value = '';
    renderItemsBrowserList();
  }
}
function renderItemsBrowserList() {
  const container = document.getElementById('ib-list');
  if (!container) return;
  const q    = normalizeRu(document.getElementById('ib-search')?.value||'');
  const type = document.getElementById('ib-type')?.value||'';
  const sort = document.getElementById('ib-sort')?.value||'type';
  const TYPE_RU = {weapon:'Оружие',armor:'Доспех',gear:'Снаряжение',tool:'Инструмент',
    kit:'Набор',firearm:'Огнестрел',ammo:'Боеприпасы',firearm_ammo:'Огнестрельные боеприпасы',explosive:'Взрывчатка'};
  let items = _ibAllItems().filter(it => (!type||it.itemClass===type)&&(!q||normalizeRu(it.name).includes(q)));
  const ORDER = ['weapon','firearm','ammo','firearm_ammo','explosive','armor','gear','tool','kit'];
  if (sort==='alpha')  items.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
  else if (sort==='cost')   items.sort((a,b)=>(a.costGp??Infinity)-(b.costGp??Infinity));
  else if (sort==='weight') items.sort((a,b)=>(a.weightLbs??0)-(b.weightLbs??0));
  else items.sort((a,b)=>{ const ai=ORDER.indexOf(a.itemClass),bi=ORDER.indexOf(b.itemClass); return ai!==bi?ai-bi:a.name.localeCompare(b.name,'ru'); });
  if (!items.length) { container.innerHTML='<p class="note-text">Ничего не найдено.</p>'; return; }
  let html='', lastType=null;
  for (const it of items) {
    const key = it.id || it.name;
    const sel = _ibSelected[key] != null;
    const qty = _ibSelected[key] || 1;
    if (sort==='type' && it.itemClass!==lastType) {
      lastType=it.itemClass;
      html+=`<div style="font-size:.6rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);padding:.4rem .5rem .15rem;opacity:.7">${TYPE_RU[it.itemClass]||it.itemClass}</div>`;
    }
    const sub=[it.damageDice||'', it.ac?`КД ${it.ac}`:'', it.category||''].filter(Boolean).join(' · ');
    const safeKey = key.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    const qtyInput = sel
      ? `<div class="ib-qty-wrap" onclick="event.stopPropagation()">
          <span style="font-size:.7rem;color:var(--text3)">×</span>
          <input type="number" min="1" value="${qty}" onclick="event.stopPropagation()"
            oninput="ibSetQty(this.dataset.key,parseInt(this.value)||1);autoSave()" data-key="${safeKey}"
            style="width:44px;padding:.15rem .3rem;background:#0e1525;border:1px solid #3a4a66;
                   border-radius:3px;color:var(--text);font-size:.82rem;text-align:center">
        </div>` : '';
    html+=`<div class="ib-item${sel?' ib-item-sel':''}" data-ibkey="${safeKey}">
      <div style="flex:1;min-width:0;pointer-events:none">
        <div style="font-size:.84rem;font-weight:600;color:var(--text)">${it.name}</div>
        ${sub?`<div style="font-size:.7rem;color:var(--text3)">${sub}</div>`:''}
      </div>
      <div style="text-align:right;font-size:.75rem;color:var(--text3);flex-shrink:0;pointer-events:none">
        ${it.costGp!=null?`<div style="color:#c8aa60">${it.costGp} зм</div>`:''}
        ${it.weightLbs!=null?`<div>${it.weightLbs} фнт.</div>`:''}
      </div>
      ${qtyInput}
    </div>`;
  }
  container.innerHTML=html;
  _updateIbSummary();
}
function ibToggle(key) {
  if (_ibSelected[key]!=null) delete _ibSelected[key]; else _ibSelected[key]=1;
  renderItemsBrowserList();
}
// Delegated click on the list container
function _ibListClick(e) {
  const row = e.target.closest('.ib-item');
  if (!row) return;
  // Don't toggle if click was inside qty input
  if (e.target.closest('.ib-qty-wrap')) return;
  const key = row.dataset.ibkey;
  if (key !== undefined) ibToggle(key);
}
function ibSetQty(key,qty) { if(qty>0) _ibSelected[key]=qty; _updateIbSummary(); }
function _updateIbSummary() {
  const el=document.getElementById('ib-selected-summary');
  if(el) el.textContent=Object.keys(_ibSelected).length?`Выбрано: ${Object.keys(_ibSelected).length} позиц.`:'';
}
function _buildSelectedItems() {
  return Object.entries(_ibSelected).map(([key,qty])=>{
    const src=(window.ITEMS_ALL||[]).find(i=>(i.id||i.name)===key)||(window.ITEMS_KITS||[]).find(k=>(k.id||k.name)===key);
    if(!src) return null;
    const item={id:src.id||null,name:src.name,qty,weight:src.weightLbs??0,costGp:src.costGp??null,itemClass:src.itemClass||'gear',description:src.description||''};
    if(src.damageDice){item.damageDice=src.damageDice;item.damageType=src.damageType;item.properties=src.properties;}
    if(src.ac!=null){item.ac=src.ac;item.stealthDisadv=src.stealthDisadv;}
    if(src.category) item.category=src.category;
    return item;
  }).filter(Boolean);
}
function takeSelectedItems() {
  if(!currentChar) return;
  const items=_buildSelectedItems();
  if(!items.length){closeItemsBrowser();return;}
  if(!currentChar.inventory) currentChar.inventory=[];
  items.forEach(it=>currentChar.inventory.push(it));
  closeItemsBrowser(); renderInventorySheet(currentChar); saveSheet();
}
function buySelectedItems() {
  if(!currentChar) return;
  const items=_buildSelectedItems();
  if(!items.length){closeItemsBrowser();return;}
  const totalCost=items.reduce((s,it)=>s+(it.costGp??0)*(it.qty||1),0);
  const curGold=parseFloat(currentChar.currency?.gp)||0;
  const hasCost=items.some(i=>i.costGp!=null);
  if(hasCost&&totalCost>curGold) {
    // Show styled dialog
    const ov = document.getElementById('gold-confirm-overlay');
    const txt = document.getElementById('gold-confirm-text');
    const btn = document.getElementById('gold-confirm-ok');
    if (ov && txt && btn) {
      txt.innerHTML = `Нужно: <b style="color:#c8aa60">${totalCost.toFixed(2)} зм</b><br>В кошельке: <b>${curGold.toFixed(2)} зм</b>`;
      btn.onclick = () => {
        ov.classList.add('hidden');
        _executeBuyItems(items, 0);
      };
      ov.classList.remove('hidden');
    }
    return;
  } else if(hasCost) {
    if(!currentChar.currency) currentChar.currency={};
    currentChar.currency.gp=parseFloat((curGold-totalCost).toFixed(4));
    if(currentChar) _updateHeaderGold(currentChar.currency);
  }
  _executeBuyItems(items, 0);
}

function _executeBuyItems(items, _unused) {
  if (!currentChar || !items?.length) return;
  if (!currentChar.inventory) currentChar.inventory = [];
  items.forEach(it => currentChar.inventory.push(it));
  _ibSelected = {};
  closeItemsBrowser();
  renderInventorySheet(currentChar);
  saveSheet();
  toast(`🛒 Добавлено ${items.length} позиц.`, 'success');
}

// ── ITEM DETAIL / EDIT DIALOG ─────────────────────────────────────────
let _invDetailIdx = null;

function openInvItemDetail(idx) {
  if (!currentChar?.inventory?.[idx]) return;
  _invDetailIdx = idx;
  _renderInvDetail(idx);
  const ov = document.getElementById('inv-detail-overlay');
  if (ov) ov.classList.remove('hidden');
}
function closeInvItemDetail() {
  const ov = document.getElementById('inv-detail-overlay');
  if (ov) ov.classList.add('hidden');
  _invDetailIdx = null;
}
function _renderInvDetail(idx) {
  const item = currentChar?.inventory?.[idx];
  if (!item) return;
  const src = item.id ? window.findItemById?.(item.id) : null;
  const cls = item.itemClass || src?.itemClass || 'gear';

  const TYPE_NAMES = {
    weapon:'Оружие', firearm:'Огнестрел', ammo:'Боеприпасы', firearm_ammo:'Огнестрельные боеприпасы',
    explosive:'Взрывчатка', armor:'Доспех', gear:'Снаряжение',
    tool:'Инструмент', kit:'Набор', special:'Предмет',
  };

  const get = (field, fallback='') => item[field] ?? src?.[field] ?? fallback;
  const fv  = v => v != null && v !== '' ? v : '—';

  // Static info rows (from library source)
  const staticRows = [];
  if (src?.description) staticRows.push(['Описание',src.description]);
  if (src?.properties?.length) {
    const propStr = src.properties
      .map(p => {
        if (typeof p === 'string') return p;
        let s = p.label || p.id || '';
        if (p.range)     s += ` (${p.range})`;
        if (p.altDamage) s += ` [${p.altDamage}]`;
        return s;
      })
      .filter(Boolean)
      .join(', ');
    if (propStr) staticRows.push(['Свойства', propStr]);
  }
  if (src?.subcategory) staticRows.push(['Подкатегория', src.subcategory]);
  if (src?.strReq) staticRows.push(['Треб. СИЛ', src.strReq]);
  if (src?.stealthDisadv) staticRows.push(['Помеха скрытности', 'Да']);
  if (src?.url) staticRows.push(['Источник', `<a href="${src.url}" target="_blank" rel="noopener" style="color:var(--accent)">${src.source||'ссылка'}</a>`]);

  const staticHtml = staticRows.length
    ? staticRows.map(([l,v]) => `
      <div class="id-row">
        <span class="id-label">${l}</span>
        <span class="id-val">${v}</span>
      </div>`).join('')
    : '';

  document.getElementById('inv-detail-content').innerHTML = `
    <div class="id-header">
      <div>
        <div class="id-name">${item.name || '(без названия)'}</div>
        <div class="id-type">${TYPE_NAMES[cls] || cls}</div>
      </div>
    </div>

    <!-- Editable fields -->
    <div class="id-section-label">Редактировать</div>
    <div class="id-edit-grid">
      <div class="id-edit-cell">
        <label>Название</label>
        <input type="text" value="${(item.name||'').replace(/"/g,'&quot;')}"
          oninput="currentChar.inventory[${idx}].name=this.value;autoSave()"
          style="width:100%">
      </div>
      <div class="id-edit-cell">
        <label>Количество</label>
        <input type="number" min="0" value="${item.qty||1}"
          oninput="currentChar.inventory[${idx}].qty=parseInt(this.value)||0;autoSave()">
      </div>
      <div class="id-edit-cell">
        <label>Вес (фнт.)</label>
        <input type="number" min="0" step="0.1" value="${get('weight',get('weightLbs',''))}"
          placeholder="${fv(src?.weightLbs)}"
          oninput="currentChar.inventory[${idx}].weight=parseFloat(this.value)||0;autoSave()">
      </div>
      <div class="id-edit-cell">
        <label>Стоимость (зм)</label>
        <input type="number" min="0" step="0.01" value="${get('costGp','')}"
          placeholder="${fv(src?.costGp)}"
          oninput="currentChar.inventory[${idx}].costGp=parseFloat(this.value)||null;autoSave()">
      </div>
      ${cls==='weapon'||cls==='firearm' ? `
      <div class="id-edit-cell">
        <label>Урон</label>
        <input type="text" value="${get('damageDice','')}" placeholder="${fv(src?.damageDice)}"
          oninput="currentChar.inventory[${idx}].damageDice=this.value;autoSave()">
      </div>
      <div class="id-edit-cell">
        <label>Тип урона</label>
        <input type="text" value="${get('damageType','')}" placeholder="${fv(src?.damageType)}"
          oninput="currentChar.inventory[${idx}].damageType=this.value;autoSave()">
      </div>
      <div class="id-edit-cell">
        <label>Подкатегория</label>
        <input type="text" value="${(item.subcategory||src?.subcategory||'').replace(/"/g,'&quot;')}" placeholder="${fv(src?.subcategory)}"
          oninput="currentChar.inventory[${idx}].subcategory=this.value;autoSave()">
      </div>
      <div class="id-edit-cell" style="grid-column:1/-1">
        <label>Свойства (через запятую)</label>
        <input type="text"
          value="${(item._propStr !== undefined ? item._propStr : (src?.properties||[]).map(p=>{let s=p.label||p.id;if(p.range)s+=' ('+p.range+')';if(p.altDamage)s+=' ['+p.altDamage+']';return s;}).join(', ')).replace(/"/g,'&quot;')}"
          placeholder="напр. Лёгкое, Метательное (20/60)"
          oninput="currentChar.inventory[${idx}]._propStr=this.value;autoSave()">
      </div>` : ''}
      ${cls==='armor' ? `
      <div class="id-edit-cell">
        <label>КД</label>
        <input type="text" value="${get('ac','')}" placeholder="${fv(src?.ac)}"
          oninput="currentChar.inventory[${idx}].ac=this.value;autoSave()">
      </div>` : ''}
      <div class="id-edit-cell" style="grid-column:1/-1">
        <label>Заметки</label>
        <input type="text" value="${(item.description||'').replace(/"/g,'&quot;')}" placeholder="—"
          oninput="currentChar.inventory[${idx}].description=this.value;autoSave()">
      </div>
    </div>

    ${staticHtml ? `<div class="id-section-label">Из библиотеки</div><div class="id-static">${staticHtml}</div>` : ''}
  `;
}
function saveInvItemDetail() {
  closeInvItemDetail();
  renderInventorySheet(currentChar);
  saveSheet();
}

// ══════════════════════════════════════════════════════════════════════
// SPELL CONTEXT MENU
// ══════════════════════════════════════════════════════════════════════
let _spellCtxData = null;  // { spell: {...}, source: 'sheet'|'browser'|'wizard' }

/**
 * spellSummaryShort(sp)
 * Компактная сводка одной строкой — для быстрого копирования.
 */
function spellSummaryShort(sp) {
  if (!sp) return '';
  const level   = sp.level === 0 ? 'Заговор' : `${sp.level} ур.`;
  const school  = sp.school ? ` · ${sp.school.replace(/\s*\(.*$/, '')}` : '';
  const conc    = sp.concentration ? ' [Концентрация]' : '';
  const ritual  = sp.ritual ? ' [Ритуал]' : '';
  const flags   = conc + ritual;
  const parts   = [
    `${sp.name}${sp.nameEn ? ` (${sp.nameEn})` : ''}`,
    `${level}${school}${flags}`,
  ];
  if (sp.cast)       parts.push(`Время накладывания: ${sp.cast}`);
  if (sp.range)      parts.push(`Дистанция: ${sp.range}`);
  if (sp.components) parts.push(`Компоненты: ${sp.components}`);
  if (sp.duration)   parts.push(`Длительность: ${sp.duration}`);
  return parts.join('\n');
}

/**
 * spellSummaryFull(sp)
 * Полная сводка с описанием.
 */
function spellSummaryFull(sp) {
  if (!sp) return '';
  let text = spellSummaryShort(sp);
  if (sp.description) {
    // \n\n = paragraph breaks in description
    text += '\n\n' + sp.description.replace(/\\n/g, '\n');
  }
  if (sp.url) {
    text += `

Источник: ${sp.url}`;
  }
  return text;
}

/**
 * _resolveSpellByName(name)
 * Ищет заклинание в window.SPELLS по имени.
 */
function _resolveSpellByName(name) {
  if (!name || !window.SPELLS) return null;
  return window.SPELLS.find(s => s.name === name || s.nameEn === name) || null;
}

/**
 * openSpellCtxMenu(e, spellNameOrObj)
 * Показывает кастомное контекстное меню для заклинания.
 * spellNameOrObj — строка (имя) или объект заклинания.
 */
function openSpellCtxMenu(e, spellNameOrObj) {
  e.preventDefault();
  e.stopPropagation();

  const sp = typeof spellNameOrObj === 'string'
    ? _resolveSpellByName(spellNameOrObj)
    : spellNameOrObj;

  _spellCtxData = sp || null;

  const menu = document.getElementById('spell-ctx-menu');
  if (!menu) return;

  // Populate header
  const nameEl = document.getElementById('sctx-spell-name');
  const metaEl = document.getElementById('sctx-spell-meta');
  if (nameEl) nameEl.textContent = sp?.name || '—';
  if (metaEl) {
    const level  = sp?.level === 0 ? 'Заговор' : (sp?.level ? `${sp.level} ур.` : '');
    const school = sp?.school ? sp.school.replace(/\s*\(.*$/, '') : '';
    const parts  = [level, school].filter(Boolean);
    metaEl.textContent = parts.join(' · ');
  }

  // Show/hide URL item
  const urlItem = document.getElementById('sctx-open-url');
  if (urlItem) urlItem.style.display = sp?.url ? '' : 'none';

  // Show/hide full description item
  const fullItem = document.getElementById('sctx-copy-full');
  if (fullItem) fullItem.style.display = sp?.description ? '' : 'none';

  // Пункт "Подготовить" — только для листа персонажа с подготовкой
  const prepItem = document.getElementById('sctx-prepare');
  const prepCb   = document.getElementById('sctx-prepare-cb');
  const showPrep = currentChar && (
    currentChar._spellPrepEnabled != null
      ? !!currentChar._spellPrepEnabled
      : isPreparedCaster(currentChar)
  );
  if (prepItem) prepItem.style.display = showPrep ? '' : 'none';
  if (prepCb && sp) {
    const prepList = currentChar?.preparedSpells || [];
    prepCb.checked = prepList.includes(sp.name);
  }

  // Position menu — keep inside viewport
  menu.classList.remove('visible');
  menu.style.left = '-9999px';
  menu.style.top  = '-9999px';
  menu.style.display = 'block';

  _positionCtxMenu(menu, e.clientX, e.clientY);
}

/**
 * _openSpellLibraryPreview(sp)
 * Shows the spell detail overlay pre-filled with library data
 * when the spell is not yet on the character sheet.
 */
function _openSpellLibraryPreview(sp) {
  if (!sp) return;
  // Temporarily inject spell into spells array at index 0 override slot
  const _tempIdx = -999;
  // Use the detail overlay in read-only mode by faking index -1
  // We populate sd elements directly
  const lvl    = sp.level;
  const school = (sp.school||'').replace(/\s*\(.*$/,'').trim();
  const conc   = sp.concentration;
  const ritual = sp.ritual;
  const lvlLabel = lvl === 0 ? 'Заговор' : lvl != null ? `${lvl} уровень` : '';

  const nameEl = document.getElementById('sd-title');
  if (nameEl) nameEl.textContent = sp.name;

  const lvlColours=['#a0a0c0','#7ab3e8','#6dcf7a','#f0c040','#e07050','#c060e0','#e05080','#40c0e0','#ff8040','#ff4060'];
  const lvlCol = lvl != null ? (lvlColours[lvl]||'var(--text2)') : 'var(--text3)';

  const badges = document.getElementById('sd-badges');
  if (badges) badges.innerHTML = [
    lvlLabel ? `<span class="spell-detail-badge" style="color:${lvlCol}">${lvlLabel}</span>` : '',
    school   ? `<span class="spell-detail-badge">${school.charAt(0).toUpperCase()+school.slice(1)}</span>` : '',
    conc     ? `<span class="spell-detail-badge" style="color:#e07050">⚡ Концентрация</span>` : '',
    ritual   ? `<span class="spell-detail-badge" style="color:#70a0d0">📖 Ритуал</span>` : '',
    sp.source? `<span class="spell-detail-badge" style="opacity:.6">${sp.source}</span>` : '',
  ].filter(Boolean).join('');

  const fields = document.getElementById('sd-fields');
  if (fields) {
    const rows = [
      ['Время каста',  sp.cast],
      ['Дистанция',    sp.range],
      ['Компоненты',   sp.components],
      ['Длительность', sp.duration],
      ['Классы', Array.isArray(sp.classes) ? sp.classes.map(c => {
        const cl = (window.CLASSES||[]).find(x=>x.id===c); return cl?.name||c;
      }).join(', ') : (sp.classes||'')],
      ['URL', sp.url ? `<a href="${sp.url}" target="_blank" rel="noopener" style="color:var(--accent2);word-break:break-all">${sp.url}</a>` : ''],
    ];
    fields.innerHTML = rows.filter(([,v])=>v).map(([l,v]) =>
      `<div class="spell-detail-field"><div class="spell-detail-label">${l}</div><div class="spell-detail-val">${v}</div></div>`
    ).join('');
  }

  // Description now handled via sd-desc-block (populated below)

  // ── Описание из библиотеки ──────────────────────────────────────────
  const descBlock2 = document.getElementById('sd-desc-block');
  const descEl2    = document.getElementById('sd-desc');
  const descText2  = _spellDescHtml(sp);
  if (descBlock2 && descEl2) {
    if (descText2) {
      descEl2.className = 'spell-detail-desc';
      descEl2.textContent = descText2;
      descBlock2.style.display = '';
    } else {
      descBlock2.style.display = 'none';
    }
  }

  // Заклинательная хар-ка — скрыть в режиме библиотеки (нет персонажа)
  const saRow2 = document.getElementById('sd-e-spellability-row');
  if (saRow2) saRow2.style.display = 'none';

  // Editable inputs — blank (read-only preview, no saving)
  ['sd-e-name','sd-e-level','sd-e-cast','sd-e-range','sd-e-duration','sd-e-components','sd-e-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const nameInput = document.getElementById('sd-e-name');
  if (nameInput) nameInput.value = sp.name;

  // Mark as library preview (no save button needed)
  _sdIdx = -1;
  document.getElementById('spell-detail-overlay')?.classList.remove('hidden');
}

function closeSpellCtxMenu() {
  const menu = document.getElementById('spell-ctx-menu');
  if (!menu) return;
  menu.classList.remove('visible');
}

function spellCtxAction(action) {
  const sp = _spellCtxData;

  if (action === 'prepare') {
    if (!currentChar || !sp) { closeSpellCtxMenu(); return; }
    const name = sp.name;
    if (!currentChar.preparedSpells) currentChar.preparedSpells = [];
    const list = currentChar.preparedSpells;
    const idx  = list.indexOf(name);
    const pb   = currentChar.proficiencyBonus || profBonus(currentChar.level||1);

    // Вычисляем лимит подготовки
    const abilMod    = getMod(currentChar.abilities?.[getSpellAbility(currentChar)]||10);
    const clsData    = (window.CLASSES_ALL||[]).find(cl =>
      cl.name?.toLowerCase() === (currentChar.className||'').toLowerCase() || cl.id === (currentChar.class||'')
    );
    const sc         = clsData?.spellcasting;
    const level      = currentChar.level || 1;
    const halfLevel  = (sc?.type==='half'||sc?.type==='half_up') ? Math.ceil(level/2) : level;
    const prepDefault= Math.max(1, abilMod + halfLevel);
    const prepLimit  = currentChar._spellPrepOverride != null
      ? currentChar._spellPrepOverride
      : prepDefault + (currentChar._spellPrepBonus || 0);

    if (idx >= 0) {
      // Снимаем подготовку
      list.splice(idx, 1);
    } else {
      // Добавляем — проверяем лимит
      if (list.length >= prepLimit) {
        toast(`⚠️ Достигнут лимит подготовки (${prepLimit})`, 'warn');
        // Обновляем чекбокс обратно — не закрываем меню
        const cb = document.getElementById('sctx-prepare-cb');
        if (cb) cb.checked = false;
        return;
      }
      list.push(name);
    }
    // Обновляем чекбокс
    const cb = document.getElementById('sctx-prepare-cb');
    if (cb) cb.checked = idx < 0; // idx<0 значит только что добавили

    // Перерисовываем карточки
    renderSpellsSheet(currentChar, pb);
    autoSave();
    return; // НЕ закрываем меню — пользователь видит новое состояние чекбокса
  }

  closeSpellCtxMenu();

  if (action === 'view') {
    if (!sp) return;
    openSpellViewDialog(sp);
    return;
  }

  if (action === 'copy-full') {
    const text = spellSummaryFull(sp);
    _copyToClipboard(text, document.getElementById('sctx-copy-full'));
  } else if (action === 'open-url') {
    if (sp?.url) window.open(sp.url, '_blank', 'noopener');
  }
}

function _copyToClipboard(text, btnEl) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    toast('📋 Скопировано!', 'success');
  }).catch(() => {
    // Fallback for non-secure context
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast('📋 Скопировано!', 'success');
  });
}

// Close on outside click or Escape
document.addEventListener('click', e => {
  const menu = document.getElementById('spell-ctx-menu');
  if (menu && !menu.contains(e.target) && menu.classList.contains('visible')) {
    closeSpellCtxMenu();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSpellCtxMenu();
});


// ══════════════════════════════════════════════════════════════════════
// INVENTORY CONTEXT MENU
// ══════════════════════════════════════════════════════════════════════
let _invCtxIdx = -1;  // current inventory item index

/**
 * openInvCtxMenu(e, idx)
 * Opens context menu for inventory item at index idx.
 * Only shown for weapon / firearm / armor / firearm_ammo types.
 */
function openInvCtxMenu(e, idx) {
  if (!currentChar?.inventory?.[idx]) return;
  e.preventDefault();
  e.stopPropagation();

  _invCtxIdx = idx;
  const item = currentChar.inventory[idx];
  const src  = item.id ? window.findItemById?.(item.id) : null;
  const cls  = item.itemClass || src?.itemClass || '';

  // Only show for equippable types
  // Все типы предметов редактируемы

  // Populate header
  document.getElementById('ictx-name').textContent = item.name || '—';
  const TYPE_RU = {weapon:'Оружие', firearm:'Огнестрел', armor:'Доспехи', ammo:'Боеприпасы', firearm_ammo:'Огнестрельные боеприпасы'};
  let meta = TYPE_RU[cls] || cls;
  const r = item.damageDice || src?.damageDice;
  const a = item.ac ?? src?.ac;
  if (r) meta += ` · ${r}`;
  if (a != null) meta += ` · КД ${a}`;
  document.getElementById('ictx-meta').textContent = meta;

  // Equip label by type
  const equipLabels = {
    weapon:       '⚔️ Добавить к атакам',
    firearm:      '🔫 Добавить к атакам',
    armor:        '🛡 Экипировать доспех',
    ammo:         '🎯 Добавить к ресурсам',
    firearm_ammo: '🎯 Добавить к ресурсам',
  };
  const equipEl = document.getElementById('ictx-equip');
  const EQUIP_TYPES = ['weapon','firearm','armor','ammo','firearm_ammo'];
  if (equipEl) {
    if (EQUIP_TYPES.includes(cls)) {
      equipEl.style.display = '';
      const parts = (equipLabels[cls] || 'Экипировать').split(' ');
      document.querySelector('#ictx-equip .sctx-item-icon').textContent = parts[0];
      document.getElementById('ictx-equip-label').textContent = parts.slice(1).join(' ');
    } else {
      equipEl.style.display = 'none';
    }
  }

  // Position
  const menu = document.getElementById('inv-ctx-menu');
  if (!menu) return;
  menu.classList.remove('visible');
  menu.style.left = '-9999px';
  menu.style.top  = '-9999px';

  _positionCtxMenu(menu, e.clientX, e.clientY);
}

function closeInvCtxMenu() {
  const menu = document.getElementById('inv-ctx-menu');
  if (!menu) return;
  menu.classList.remove('visible');
}

function invCtxAction(action) {
  const idx = _invCtxIdx;
  closeInvCtxMenu();
  if (idx < 0 || !currentChar?.inventory?.[idx]) return;

  if (action === 'view') {
    openInvItemDetail(idx);
    return;
  }

  if (action === 'equip') {
    _invEquipItem(idx);
    return;
  }
}

/**
 * _invEquipItem(idx)
 * Equips inventory item based on its type:
 *   weapon / firearm  → adds to currentChar.weapons (attacks page)
 *   armor             → sets currentChar.ac based on armor AC value
 *   firearm_ammo      → adds to currentChar.resources (attacks page resources)
 */
function _invEquipItem(idx) {
  if (!currentChar?.inventory?.[idx]) return;
  const item = currentChar.inventory[idx];
  const src  = item.id ? window.findItemById?.(item.id) : null;
  const cls  = item.itemClass || src?.itemClass || '';

  if (cls === 'weapon' || cls === 'firearm') {
    _invEquipWeapon(item, src, cls);
  } else if (cls === 'armor') {
    _invEquipArmor(item, src);
  } else if (cls === 'ammo' || cls === 'firearm_ammo') {
    _invEquipAmmo(item, src);
  } else {
    toast('Этот тип предметов нельзя экипировать', 'info');
  }
}

function _invEquipWeapon(item, src, cls) {
  if (!currentChar.weapons) currentChar.weapons = [];

  const name       = item.name || 'Оружие';
  // Копируем полную формулу урона из поля damage (может содержать СИЛ, ЛОВ, УР и т.д.)
  // damageDice хранит полную формулу (например '1к8+[СИЛ]+2')
  const damage     = item.damageDice || src?.damageDice || '1к6';
  const damageType = item.damageType || src?.damageType || '';
  const ab         = src?.properties?.some(p => (p.id||p) === 'finesse') ? 'dex' : 'str';
  const isRanged   = cls === 'firearm' ||
    src?.properties?.some(p => ['thrown','ranged','ammunition'].includes(p.id||p));
  const ability    = (isRanged && cls !== 'firearm') ? 'dex' : ab;

  // Дубли разрешены — одно оружие можно добавить несколько раз

  const PROP_LBL2 = {
    'two-handed':'Двуручное','versatile':'Универсальное','finesse':'Фехтовальное',
    'light':'Лёгкое','heavy':'Тяжёлое','reach':'Досягаемость',
    'thrown':'Метательное','loading':'Перезарядка','special':'Особое','ammunition':'Боеприпасы',
  };
  const weapProps = (src?.properties || []).map(p => PROP_LBL2[p.id||p]).filter(Boolean).join(' · ');

  currentChar.weapons.push({
    name,
    damage,
    damageType,
    ability,
    isProf:      true,
    attackBonus: 0,
    props:       weapProps || '',
    note:        item.description || src?.description || '',
  });

  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level || 1);
  renderWeaponsSheet(currentChar, pb);
  saveSheet();
  toast(`⚔️ «${name}» добавлено к атакам`, 'success');
}

/**
 * _armorAcToFormula(acStr)
 * Normalises an AC string to a formula using [ЛОВ].
 * New items.js already stores formulas like "12+[ЛОВ]" or "13+min([ЛОВ],2)".
 * Legacy strings like "12 + мод. Ловк." are also handled for backwards compat.
 */
function _armorAcToFormula(acStr) {
  const s = String(acStr).trim();
  // Already a formula (new items.js format) — use directly
  if (s.includes('[ЛОВ]') || s.includes('min(')) return s;
  const base = parseInt(s) || 10;
  // Legacy: "N + мод. Ловк. (макс. N)" or "N + мод. Ловк."
  const hasLov = /ловк/i.test(s);
  if (!hasLov) return String(base);
  const capMatch = s.match(/макс\.?\s*(\d+)/i);
  if (capMatch) return `${base}+min([ЛОВ],${parseInt(capMatch[1])})`;
  return `${base}+[ЛОВ]`;
}

/**
 * _evalAcFormula(formula, char)
 * Evaluates an AC formula string like "12+[ЛОВ]" or "13+min([ЛОВ],2)"
 * Returns integer AC value.
 */
function _evalAcFormula(formula, char) {
  if (!formula) return 10;
  const dexMod = getMod((char?.abilities?.['ЛОВ']) || 10);

  // Replace min([ЛОВ], N) first
  let f = formula.replace(/min\(\[ЛОВ\]\s*,\s*(\d+)\)/g, (_, cap) =>
    String(Math.min(dexMod, parseInt(cap)))
  );
  // Replace plain [ЛОВ]
  f = f.replace(/\[ЛОВ\]/g, String(dexMod));
  // Evaluate the remaining arithmetic (only +/- with integers, safe)
  try {
    // Allow only digits, +, -, spaces
    if (/^[\d\s+\-]+$/.test(f)) return parseInt(Function(`"use strict";return(${f})`)()) || 10;
  } catch (_) {}
  return parseInt(f) || 10;
}

function _invEquipArmor(item, src) {
  const name  = item.name || 'Доспех';
  const acRaw = item.ac ?? src?.ac ?? null;

  if (acRaw == null) {
    toast(`У «${name}» не указано значение КД`, 'info');
    return;
  }

  const formula = _armorAcToFormula(String(acRaw));
  const prevAC  = currentChar.ac || 10;

  // Store formula so it can be re-evaluated when abilities change
  currentChar.acFormula = formula;

  // Open AC dialog pre-filled with this formula — user sees and confirms
  openAcDialog(null, formula);

  toast(`🛡 «${name}» — формула КБ: ${formula}`, 'success');
}

function _invEquipAmmo(item, src) {
  if (!currentChar.resources) currentChar.resources = [];
  const name = item.name || 'Боеприпасы';
  const invQty = item.qty || 1;

  // stackSize: how many units are in one inventory item (e.g. 20 for "Стрелы (20)")
  // Stored on the item or its source definition; defaults to 1 for non-stacked items
  const stackSize = item.stackSize ?? src?.stackSize ?? 1;
  const totalUnits = invQty * stackSize;

  // Check for existing resource with same name — add to max
  const existing = currentChar.resources.find(r => r.name === name);
  if (existing) {
    existing.max = (existing.max || 0) + totalUnits;
    existing.cur = Math.min(existing.cur || 0, existing.max);
    renderResourcesSheet(currentChar);
    saveSheet();
    toast(`🎯 «${name}» обновлён: ${existing.max} шт.`, 'success');
    return;
  }

  currentChar.resources.push({
    name,
    cur:       totalUnits,
    max:       totalUnits,
    type:      'ammo',
    restShort: false,
    restLong:  false,
    note:      (item.description || src?.description || '').trim(),
  });

  renderResourcesSheet(currentChar);
  saveSheet();
  toast(`🎯 «${name}» (${totalUnits} шт.) добавлено к ресурсам`, 'success');
}

// Close on outside click or Escape
document.addEventListener('click', e => {
  const menu = document.getElementById('inv-ctx-menu');
  if (menu && menu.classList.contains('visible') && !menu.contains(e.target)) {
    closeInvCtxMenu();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeInvCtxMenu();
});


// ══════════════════════════════════════════════════════════════════════
// DICE PANEL — vertical strip, expands in place
// ══════════════════════════════════════════════════════════════════════
let _diceCounts    = {};
let _dicePanelOpen = false;
let _diceAutoTimer = null;
const DICE_AUTO_CLOSE_MS = 10000;

function _dpShiftAnchor() {
  // When panel opens: d100 appears above d20.
  // The panel is a single flex-column starting at anchor top.
  // anchor.top = 50vh, transform was translateY(-50%).
  // After opening, total height = dp-die * (1 top + 1 d20 + ...).
  // We want d20 (2nd slot, index 1) to remain at 50vh.
  // d20 offset from panel top = 1 * dp-die = 75px.
  // So anchor needs to move UP by 75px extra beyond the -50% centring.
  const dpDie = parseInt(getComputedStyle(document.documentElement)
                  .getPropertyValue('--dp-die')) || 75;
  const anchor = document.querySelector('.dice-panel-anchor');
  if (anchor) anchor.style.transform = `translateY(calc(-50% - ${dpDie}px))`;
}

function toggleDicePanel(e) {
  if (e) e.stopPropagation();
  _dicePanelOpen ? _closeDicePanel() : _openDicePanel();
}

function _openDicePanel() {
  _dicePanelOpen = true;
  const panel = document.getElementById('dice-panel');
  if (panel) panel.classList.add('open');
  // Shift anchor up by one die-slot so d20 stays at viewport centre
  _dpShiftAnchor();
  _resetDiceAutoClose();
  // Close when clicking outside
  setTimeout(() => document.addEventListener('click', _diceOutsideClick), 10);
}

function _closeDicePanel() {
  _dicePanelOpen = false;
  const panel = document.getElementById('dice-panel');
  if (panel) panel.classList.remove('open');
  // Restore anchor to default centre position
  const anchor = document.querySelector('.dice-panel-anchor');
  if (anchor) anchor.style.transform = 'translateY(-50%)';
  clearTimeout(_diceAutoTimer);
  document.removeEventListener('click', _diceOutsideClick);
}

function _diceOutsideClick(e) {
  const panel = document.getElementById('dice-panel');
  if (panel && !panel.contains(e.target)) {
    _closeDicePanel();
  }
}

function _resetDiceAutoClose() {
  clearTimeout(_diceAutoTimer);
  _diceAutoTimer = setTimeout(() => {
    if (_dicePanelOpen) _closeDicePanel();
  }, DICE_AUTO_CLOSE_MS);
}

function diceAdd(sides, slotEl) {
  _diceCounts[sides] = (_diceCounts[sides] || 0) + 1;
  _resetDiceAutoClose();  // reset timer on interaction

  // Badge update
  const badge = document.getElementById(`dp-cnt-${sides}`);
  const count = _diceCounts[sides];
  if (badge) badge.textContent = count;

  // Slot active state
  const slot = slotEl || document.querySelector(`.dp-slot[data-sides="${sides}"]`);
  if (slot) slot.classList.toggle('dp-active', count > 0);

  // Click animation removed — hover only

  // Sync visible d20 badge (dp-cnt-20-vis on the always-visible slot)
  if (sides === 20) {
    const visBadge = document.getElementById('dp-cnt-20-vis');
    if (visBadge) {
      visBadge.textContent = count;
      visBadge.style.display = count > 0 ? 'flex' : 'none';
    }
    document.getElementById('dp-d20-slot')?.classList.toggle('dp-active', count > 0);
  }

  _updateDicePanelFormula();
}

function _updateDicePanelFormula() {
  const parts = [100,20,12,10,8,6,4]
    .filter(s => (_diceCounts[s] || 0) > 0)
    .map(s => `${_diceCounts[s]}к${s}`);

  const formulaEl = document.getElementById('dp-formula');
  if (formulaEl) formulaEl.textContent = parts.join('+') || '';

  const rollBtn = document.getElementById('dp-roll-btn');
  if (rollBtn) {
    const hasAny = parts.length > 0;
    rollBtn.toggleAttribute('disabled', !hasAny);
    rollBtn.style.opacity = hasAny ? '1' : '0.3';
    rollBtn.style.pointerEvents = hasAny ? '' : 'none';
  }
}

function diceRoll() {
  const sides = [100,20,12,10,8,6,4].filter(s => (_diceCounts[s]||0) > 0);
  if (!sides.length) return;

  let total = 0;
  const groups = [];
  for (const s of sides) {
    const n = _diceCounts[s];
    const rolls = Array.from({length: n}, () => Math.floor(Math.random() * s) + 1);
    const sum   = rolls.reduce((a,b) => a+b, 0);
    total += sum;
    groups.push({ n, s, rolls, sum });
  }

  const label = groups.map(g => `${g.n}к${g.s}`).join('+');
  const math  = groups.map(g =>
    g.n === 1 ? `[${g.rolls[0]}]` : `[${g.rolls.join('+')}]`
  ).join('+') + ` = ${total}`;

  const isSingleD20 = sides.length === 1 && sides[0] === 20 && _diceCounts[20] === 1;
  pushRoll(label, total, math, {
    crit:     isSingleD20 && total === 20,
    critFail: isSingleD20 && total === 1,
  });

  // Flash roll button
  const rollBtn = document.getElementById('dp-roll-btn');
  if (rollBtn) {
    rollBtn.classList.remove('flash');
    void rollBtn.offsetWidth;
    rollBtn.classList.add('flash');
    rollBtn.addEventListener('animationend', () => rollBtn.classList.remove('flash'), {once:true});
  }

  // Flash d20 img


  // Reset counts
  _diceCounts = {};
  [100,20,12,10,8,6,4].forEach(s => {
    const b = document.getElementById(`dp-cnt-${s}`);
    if (b) b.textContent = '';
    document.querySelector(`.dp-slot[data-sides="${s}"]`)?.classList.remove('dp-active');
  });
  // Сброс видимого значка d100-vis и d20-slot
  const visBadge = document.getElementById('dp-cnt-100-vis');
  if (visBadge) { visBadge.textContent = ''; visBadge.style.display = 'none'; }
  const d20vis = document.getElementById('dp-cnt-20-vis');
  if (d20vis)  { d20vis.textContent = ''; d20vis.style.display = 'none'; }
  document.getElementById('dp-d20-slot')?.classList.remove('dp-active');
  _updateDicePanelFormula();
  _resetDiceAutoClose();
}

function invQtyAdj(idx, delta) {
  if (!currentChar?.inventory?.[idx]) return;
  const cur = currentChar.inventory[idx].qty || 1;
  currentChar.inventory[idx].qty = Math.max(0, cur + delta);
  renderInventorySheet(currentChar);
  saveSheet();
}

// ══════════════════════════════════════════════════════════════════════
// SPELL META DIALOG
// ══════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════
// SPELL META DIALOG
// ══════════════════════════════════════════════════════════════════════
function _setNumField(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = (val === '' || val == null) ? '' : val;
}
function _getNumField(id) {
  const el = document.getElementById(id);
  if (!el || el.value.trim() === '') return null;
  const n = parseFloat(el.value);
  return isNaN(n) ? null : n;
}
function _togglePrepFields(show) {
  const el = document.getElementById('smd-prep-fields');
  if (el) el.style.display = show ? 'grid' : 'none';
}


// Живое обновление панели пока диалог открыт — НЕ читает поля если диалог закрыт

// ══════════════════════════════════════════════════════════════════════
// SPELL VIEW DIALOG — read-only библиотечный просмотр
// ══════════════════════════════════════════════════════════════════════
function openSpellViewDialog(sp) {
  if (!sp) return;
  const lvlColours=['#a0a0c0','#7ab3e8','#6dcf7a','#f0c040','#e07050','#c060e0','#e05080','#40c0e0','#ff8040','#ff4060'];
  const lvl      = sp.level;
  const school   = (sp.school||'').replace(/\s*\(.*$/,'').trim();
  const lvlLabel = lvl === 0 ? 'Заговор' : lvl != null ? `${lvl} уровень` : '';
  const lvlCol   = lvl != null ? (lvlColours[lvl]||'var(--text2)') : 'var(--text3)';

  document.getElementById('svd-title').textContent = sp.name || '—';

  const badges = document.getElementById('svd-badges');
  badges.innerHTML = [
    lvlLabel ? `<span class="spell-detail-badge" style="color:${lvlCol}">${lvlLabel}</span>` : '',
    school   ? `<span class="spell-detail-badge">${school.charAt(0).toUpperCase()+school.slice(1)}</span>` : '',
    sp.concentration ? `<span class="spell-detail-badge" style="color:#e07050">⚡ Концентрация</span>` : '',
    sp.ritual        ? `<span class="spell-detail-badge" style="color:#70a0d0">📖 Ритуал</span>` : '',
    sp.source        ? `<span class="spell-detail-badge" style="opacity:.6">${sp.source}</span>` : '',
  ].filter(Boolean).join('');

  const rows = [
    ['Время каста',  sp.cast],
    ['Дистанция',    sp.range],
    ['Компоненты',   sp.components],
    ['Длительность', sp.duration],
    ['Спасбросок',   sp.save],
    ['Урон',         sp.dmg],
    ['Классы', Array.isArray(sp.classes) ? sp.classes.map(c => {
      const cl = (window.CLASSES||[]).find(x=>x.id===c); return cl?.name||c;
    }).join(', ') : (sp.classes||'')],
    ['Ссылка', sp.url ? `<a href="${sp.url}" target="_blank" rel="noopener" style="color:var(--accent2)">${sp.url}</a>` : ''],
  ];
  document.getElementById('svd-fields').innerHTML = rows
    .filter(([,v])=>v)
    .map(([l,v])=>`<div><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3)">${l}</div><div style="color:var(--text2)">${v}</div></div>`)
    .join('');

  const descText = _spellDescHtml ? _spellDescHtml(sp) : (sp.description||'');
  const descBlock = document.getElementById('svd-desc-block');
  const descEl    = document.getElementById('svd-desc');
  if (descText) {
    descEl.textContent = descText;
    descBlock.style.display = '';
  } else {
    descBlock.style.display = 'none';
  }

  // Закрываем старый диалог деталей на случай если он открыт
  document.getElementById('spell-detail-overlay')?.classList.add('hidden');
  document.getElementById('spell-view-overlay').classList.remove('hidden');
}

function closeSpellViewDialog() {
  document.getElementById('spell-view-overlay').classList.add('hidden');
}

function openSpellMetaDialog() {
  if (!currentChar) return;
  const c = currentChar;
  // _spellAbilityOverride всегда заполнен после renderSheet
  document.getElementById('smd-ability').value = c._spellAbilityOverride || '';
  _setNumField('smd-atk-bonus',    c._spellAtkBonus);
  _setNumField('smd-atk-override', c._spellAtkOverride);
  _setNumField('smd-save-bonus',   c._spellSaveBonus);
  _setNumField('smd-save-override',c._spellSaveOverride);
  const isPrep = c._spellPrepEnabled != null ? !!c._spellPrepEnabled : isPreparedCaster(c);
  document.getElementById('smd-prep-enabled').checked = isPrep;
  _togglePrepFields(isPrep);
  _setNumField('smd-prep-bonus',    c._spellPrepBonus);
  _setNumField('smd-prep-override', c._spellPrepOverride);
  document.getElementById('spell-meta-dialog-overlay').classList.remove('hidden');
}

function closeSpellMetaDialog() {
  document.getElementById('spell-meta-dialog-overlay').classList.add('hidden');
}

// onchange дропдауна: сразу пишем в _spellAbilityOverride и перерисовываем панель
function smdLiveUpdate() {
  if (!currentChar) return;
  const overlay = document.getElementById('spell-meta-dialog-overlay');
  if (!overlay || overlay.classList.contains('hidden')) return;
  const c = currentChar;

  // Дропдаун — напрямую в override
  c._spellAbilityOverride = document.getElementById('smd-ability')?.value || c.spellAbility || null;

  // Чекбокс — обновляем видимость и рендерим
  const prepEnabled = document.getElementById('smd-prep-enabled')?.checked;
  _togglePrepFields(prepEnabled);
  const savedPrep = c._spellPrepEnabled;
  c._spellPrepEnabled = prepEnabled;
  const pb = c.proficiencyBonus || profBonus(c.level||1);
  renderSpellsSheet(c, pb);
  c._spellPrepEnabled = savedPrep;
}

function resetSpellMetaDialog() {
  if (!currentChar) return;
  const c = currentChar;
  // Сброс: _spellAbilityOverride = базовая характеристика класса
  c._spellAbilityOverride = c.spellAbility || null;
  c._spellAtkBonus = c._spellAtkOverride = null;
  c._spellSaveBonus = c._spellSaveOverride = null;
  c._spellPrepEnabled = null;
  c._spellPrepBonus = c._spellPrepOverride = null;
  // Обновляем поля диалога
  document.getElementById('smd-ability').value = c._spellAbilityOverride || '';
  ['smd-atk-bonus','smd-atk-override','smd-save-bonus','smd-save-override',
   'smd-prep-bonus','smd-prep-override'].forEach(id => _setNumField(id, null));
  const isPrep = isPreparedCaster(c);
  document.getElementById('smd-prep-enabled').checked = isPrep;
  _togglePrepFields(isPrep);
  const pb = c.proficiencyBonus || profBonus(c.level||1);
  renderSpellsSheet(c, pb);
  autoSave();
}

function saveSpellMetaDialog() {
  if (!currentChar) return;
  const c = currentChar;
  // _spellAbilityOverride уже актуален (писался при каждом onchange)
  // Но перепишем ещё раз на случай если пользователь не менял дропдаун
  c._spellAbilityOverride = document.getElementById('smd-ability')?.value || c.spellAbility || null;
  c._spellAtkBonus     = _getNumField('smd-atk-bonus');
  c._spellAtkOverride  = _getNumField('smd-atk-override');
  c._spellSaveBonus    = _getNumField('smd-save-bonus');
  c._spellSaveOverride = _getNumField('smd-save-override');
  const prepEnabled    = document.getElementById('smd-prep-enabled')?.checked;
  c._spellPrepEnabled  = prepEnabled;
  c._spellPrepBonus    = _getNumField('smd-prep-bonus');
  c._spellPrepOverride = _getNumField('smd-prep-override');
  closeSpellMetaDialog();
  const pb = c.proficiencyBonus || profBonus(c.level||1);
  renderSpellsSheet(c, pb);
  renderSheetStats(c);
  autoSave();
}


// ══════════════════════════════════════════════════════════════════════
// SLOT OVERRIDE CONTEXT MENU
// ══════════════════════════════════════════════════════════════════════
function openSlotCtxMenu(e) {
  if (!currentChar) return;
  e.preventDefault();
  e.stopPropagation();
  const menu = document.getElementById('slot-ctx-menu');
  _positionCtxMenu(menu, e.clientX, e.clientY);
}
function closeSlotCtxMenu() {
  const menu = document.getElementById('slot-ctx-menu');
  if (menu) menu.classList.remove('visible');
}
document.addEventListener('click', e => {
  const m = document.getElementById('slot-ctx-menu');
  if (m && m.classList.contains('visible') && !m.contains(e.target)) closeSlotCtxMenu();
});

// ══════════════════════════════════════════════════════════════════════
// SLOT OVERRIDE DIALOG
// ══════════════════════════════════════════════════════════════════════
function openSlotDialog() {
  if (!currentChar) return;
  const char = currentChar;
  const isWarlock = isWarlockChar(char);
  const baseSlots = isWarlock
    ? (() => { const [cnt,lvl]=WARLOCK_PACT_TABLE[char.level||1]||[1,1]; const o={}; o[lvl]=cnt; return o; })()
    : (SLOT_TABLE[char.level||1]||SLOT_TABLE[1]).reduce((o,v,i)=>{ if(v) o[i+1]=v; return o; }, {});

  const overrides = char._slotOverrides || {};
  let rows = '';
  for (let lvl = 1; lvl <= 9; lvl++) {
    const base = baseSlots[lvl] || 0;
    if (!base && !overrides[lvl]) continue;
    const ov = overrides[lvl] || {};
    rows += `<div class="slot-ctx-row">
      <label>${lvl}</label>
      <input type="number" id="slotov-bonus-${lvl}" placeholder="+0" value="${ov.bonus != null ? ov.bonus : ''}">
      <input type="number" id="slotov-override-${lvl}" placeholder="${base||'авто'}" value="${ov.override != null ? ov.override : ''}">
    </div>`;
  }
  document.getElementById('slot-dialog-rows').innerHTML = rows;
  document.getElementById('slot-dialog-overlay').classList.remove('hidden');
}
function closeSlotDialog() {
  document.getElementById('slot-dialog-overlay').classList.add('hidden');
}
function saveSlotOverrides() {
  if (!currentChar) return;
  const overrides = {};
  for (let lvl = 1; lvl <= 9; lvl++) {
    const bonusEl    = document.getElementById(`slotov-bonus-${lvl}`);
    const overrideEl = document.getElementById(`slotov-override-${lvl}`);
    if (!bonusEl && !overrideEl) continue;
    const bonus    = bonusEl?.value.trim()    !== '' ? parseInt(bonusEl.value)    : null;
    const override = overrideEl?.value.trim() !== '' ? parseInt(overrideEl.value) : null;
    if (bonus != null || override != null) overrides[lvl] = { bonus, override };
  }
  currentChar._slotOverrides = Object.keys(overrides).length ? overrides : null;
  closeSlotDialog();
  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  renderSpellsSheet(currentChar, pb);
  autoSave();
}

// ══════════════════════════════════════════════════════════════════════
// SLOT OVERRIDE DIALOG
// ══════════════════════════════════════════════════════════════════════
function openSlotDialog() {
  if (!currentChar) return;
  const char = currentChar;
  const isWarlock = isWarlockChar(char);
  const baseSlots = isWarlock
    ? (() => { const [cnt,lvl]=WARLOCK_PACT_TABLE[char.level||1]||[1,1]; const o={}; o[lvl]=cnt; return o; })()
    : (SLOT_TABLE[char.level||1]||SLOT_TABLE[1]).reduce((o,v,i)=>{ if(v) o[i+1]=v; return o; }, {});

  const overrides = char._slotOverrides || {};
  let rows = '';
  for (let lvl = 1; lvl <= 9; lvl++) {
    const base = baseSlots[lvl] || 0;
    if (!base && !overrides[lvl]) continue;
    const ov = overrides[lvl] || {};
    rows += `<div class="slot-ctx-row">
      <label>${lvl}</label>
      <input type="number" id="slotov-bonus-${lvl}" placeholder="+0" value="${ov.bonus != null ? ov.bonus : ''}">
      <input type="number" id="slotov-override-${lvl}" placeholder="${base||'авто'}" value="${ov.override != null ? ov.override : ''}">
    </div>`;
  }
  document.getElementById('slot-dialog-rows').innerHTML = rows;
  document.getElementById('slot-dialog-overlay').classList.remove('hidden');
}

function closeSlotDialog() {
  document.getElementById('slot-dialog-overlay').classList.add('hidden');
}

function saveSlotOverrides() {
  if (!currentChar) return;
  const overrides = {};
  for (let lvl = 1; lvl <= 9; lvl++) {
    const bonusEl    = document.getElementById(`slotov-bonus-${lvl}`);
    const overrideEl = document.getElementById(`slotov-override-${lvl}`);
    if (!bonusEl && !overrideEl) continue;
    const bonus    = bonusEl?.value.trim()    !== '' ? parseInt(bonusEl.value)    : null;
    const override = overrideEl?.value.trim() !== '' ? parseInt(overrideEl.value) : null;
    if (bonus != null || override != null) overrides[lvl] = { bonus, override };
  }
  currentChar._slotOverrides = Object.keys(overrides).length ? overrides : null;
  closeSlotDialog();
  const pb = currentChar.proficiencyBonus || profBonus(currentChar.level||1);
  renderSpellsSheet(currentChar, pb);
  autoSave();
}
