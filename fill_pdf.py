"""
fill_pdf.py — заполняет шаблон sheet_template.pdf данными персонажа DnD 5e.
Шаблон: static/sheet_template.pdf (4 страницы, AcroForm, NeedAppearances=True)
"""
import io, re, math
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import BooleanObject, NameObject, TextStringObject

_HERE = Path(__file__).parent
_TEMPLATE = _HERE / "static" / "sheet_template.pdf"

# ── утилиты ──────────────────────────────────────────────────────────────────

def fmt_mod(m): return f"+{m}" if m >= 0 else str(m)
def get_mod(s): return (int(s) - 10) // 2
def prof_b(lv): return 1 + ((int(lv) - 1) // 4 + 1)

_HTML_BR  = re.compile(r'<br\s*/?>', re.I)
_HTML_BLK = re.compile(r'</?(p|div|li)[^>]*>', re.I)
_HTML_TAG = re.compile(r'<[^>]+>')
_ENTITIES = {'&amp;':'&','&lt;':'<','&gt;':'>','&nbsp;':' ','&quot;':'"','&#39;':"'"}
_MULTI_NL = re.compile(r'\n{3,}')
_DASH     = str.maketrans({
    '\u2014':' - ','\u2013':' - ','\u2012':' - ','\u2015':' - ',
    '\u00ab':'"','\u00bb':'"','\u2018':"'",'\u2019':"'",
    '\u201c':'"','\u201d':'"','\u2026':'...',
})

def _s(v):
    if not v: return ''
    t = str(v)
    t = _HTML_BR.sub('\n', t)
    t = _HTML_BLK.sub('\n', t)
    t = _HTML_TAG.sub('', t)
    for ent, ch in _ENTITIES.items():
        t = t.replace(ent, ch)
    t = _MULTI_NL.sub('\n\n', t)
    return t.strip().translate(_DASH)

SLOT_TABLE = {
    1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0],
    4:[4,3,0,0,0,0,0,0,0], 5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0],
    7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0], 9:[4,3,3,3,1,0,0,0,0],
    10:[4,3,3,3,2,0,0,0,0],11:[4,3,3,3,2,1,0,0,0],12:[4,3,3,3,2,1,0,0,0],
    13:[4,3,3,3,2,1,1,0,0],14:[4,3,3,3,2,1,1,0,0],15:[4,3,3,3,2,1,1,1,0],
    16:[4,3,3,3,2,1,1,1,0],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],
    19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1],
}
# Магия Договора колдуна: {уровень: (количество_ячеек, уровень_ячеек)}
WARLOCK_PACT_TABLE = {
    1:(1,1), 2:(2,1), 3:(2,2), 4:(2,2), 5:(2,3),
    6:(2,3), 7:(2,4), 8:(2,4), 9:(2,5),10:(2,5),
   11:(3,5),12:(3,5),13:(3,5),14:(3,5),15:(3,5),
   16:(3,5),17:(4,5),18:(4,5),19:(4,5),20:(4,5),
}
AB_MAP = {"str":"СИЛ","dex":"ЛОВ","int":"ИНТ","wis":"МДР","cha":"ХАР","con":"ТЕЛ"}
SKILL_AB = {
    "Акробатика":"ЛОВ","Анализ":"ИНТ","Атлетика":"СИЛ","Восприятие":"МДР",
    "Выживание":"МДР","Выступление":"ХАР","Запугивание":"ХАР","История":"ИНТ",
    "Ловкость рук":"ЛОВ","Магия":"ИНТ","Медицина":"МДР","Обман":"ХАР",
    "Природа":"ИНТ","Проницательность":"МДР","Религия":"ИНТ","Скрытность":"ЛОВ",
    "Убеждение":"ХАР","Уход за животными":"МДР",
}
# Маппинг красивых имён навыков → ключи полей шаблона
SKILL_FIELD = {
    "Акробатика":       "SkillАкробатика",
    "Анализ":           "SkillАнализ",
    "Атлетика":         "SkillАтлетика",
    "Восприятие":       "SkillВосприятие",
    "Выживание":        "SkillВыживание",
    "Выступление":      "SkillВыступление",
    "Запугивание":      "SkillЗапугивание",
    "История":          "SkillИстория",
    "Ловкость рук":     "SkillЛовкостьРук",
    "Магия":            "SkillМагия",
    "Медицина":         "SkillМедицина",
    "Обман":            "SkillОбман",
    "Природа":          "SkillПрирода",
    "Проницательность": "SkillПроницательность",
    "Религия":          "SkillРелигия",
    "Скрытность":       "SkillСкрытность",
    "Убеждение":        "SkillУбеждение",
    "Уход за животными":"SkillУходЖивотные",
}
SKILL_CHK = {k: v.replace("Skill","SKchk") for k,v in SKILL_FIELD.items()}


# ── SheetFiller ───────────────────────────────────────────────────────────────

class SheetFiller:
    def __init__(self, writer: PdfWriter):
        self.writer = writer
        self._index = {}
        acro = writer._root_object.get('/AcroForm')
        if acro:
            ao = acro.get_object() if hasattr(acro, 'get_object') else acro
            for ref in ao.get('/Fields', []):
                obj = ref.get_object()
                name = str(obj.get('/T', ''))
                self._index[name] = obj

    def set(self, name: str, value):
        obj = self._index.get(name)
        if obj is None: return
        obj[NameObject('/V')] = TextStringObject(_s(str(value)))

    def check(self, name: str, checked: bool):
        obj = self._index.get(name)
        if obj is None: return
        val = NameObject('/Yes') if checked else NameObject('/Off')
        obj[NameObject('/V')]  = val
        obj[NameObject('/AS')] = val


# ── Заполнение данными персонажа ──────────────────────────────────────────────

def _build(sf: SheetFiller, char: dict):
    ab   = char.get('abilities', {})
    lv   = int(char.get('level', 1))
    pb   = int(char.get('proficiencyBonus') or prof_b(lv))
    skp  = set(char.get('skillProficiencies') or [])
    skx  = set(char.get('skillExpertise') or [])
    svp  = set(char.get('savingThrows') or [])
    half = bool(char.get('halfProficiency'))

    def sc(ru): return int(ab.get(ru, 10))
    def md(ru): return get_mod(sc(ru))

    # ══ PAGE 1 ══════════════════════════════════════════════════════════════

    # Шапка
    cls = _s(char.get('className', ''))
    sub = _s(char.get('subclass', ''))
    sf.set('ClassLevel',    f"{cls}{' (' + sub + ')' if sub else ''} {lv}")
    sf.set('Background',    char.get('backgroundName', char.get('background', '')))
    sf.set('PlayerName',    char.get('playerName', ''))
    sf.set('CharacterName', char.get('name', ''))
    sf.set('Race',          char.get('raceName', char.get('race', '')))
    sf.set('Alignment',     char.get('alignment', ''))
    sf.set('XP',            str(char.get('xp', 0) or 0))
    sf.set('Level',         str(lv))

    # Характеристики
    for ru in ['СИЛ','ЛОВ','ТЕЛ','ИНТ','МДР','ХАР']:
        sf.set(f'Score{ru}', str(sc(ru)))
        sf.set(f'Mod{ru}',   fmt_mod(md(ru)))

    # Бой
    sf.set('AC',        str(char.get('ac', 10)))
    sf.set('Initiative',fmt_mod(md('ЛОВ')))
    sf.set('Speed',     str(char.get('speed', 30)))
    sf.set('ProfBonus', fmt_mod(pb))

    # Вдохновение
    sf.check('Inspiration', bool(char.get('inspiration')))

    # Хиты
    sf.set('HPMax',    str(char.get('hpMax', 10)))
    sf.set('HPCurrent',str(char.get('hpCurrent', char.get('hpMax', 10))))
    sf.set('HPTemp',   str(char.get('hpTemp', 0) or ''))
    sf.set('HDTotal',  f"{lv}d{char.get('hitDie', 8)}")
    sf.set('HD',       f"d{char.get('hitDie', 8)}")

    # Спасброски — берём итоговые значения из листа если есть, иначе считаем
    sv_vals = char.get('savingThrowValues') or char.get('_savingThrows') or {}
    for ru in ['СИЛ','ЛОВ','ТЕЛ','ИНТ','МДР','ХАР']:
        if ru in sv_vals:
            bonus = int(sv_vals[ru])
        else:
            bonus = md(ru) + (pb if ru in svp else 0)
        sf.set(f'ST{ru}',      fmt_mod(bonus))
        sf.check(f'STchk{ru}', ru in svp)

    # skillExpertise: {name: 1} = владение, {name: 2} = экспертиза (логика app.js)
    skx_raw = char.get('skillExpertise') or {}
    if isinstance(skx_raw, list):
        # старый формат — список означает экспертизу
        skx = {k: 2 for k in skx_raw}
    else:
        skx = {k: int(v) for k, v in skx_raw.items()}

    # Спасброски — учитываем _saveOverride и _saveBonus как в app.js
    save_override = char.get('_saveOverride') or {}
    save_bonus    = char.get('_saveBonus') or {}
    for ru in ['СИЛ','ЛОВ','ТЕЛ','ИНТ','МДР','ХАР']:
        if ru in save_override and save_override[ru] is not None:
            bonus = int(save_override[ru])
        else:
            bonus = md(ru) + (pb if ru in svp else 0) + int(save_bonus.get(ru, 0))
        sf.set(f'ST{ru}',      fmt_mod(bonus))
        sf.check(f'STchk{ru}', ru in svp)

    # Навыки — exp=2→pb*2, exp=1→pb, иначе half или 0 (логика app.js строка 5528)
    for sk_name, sk_ab in SKILL_AB.items():
        exp  = skx.get(sk_name, 0)
        bonus = md(sk_ab) + (pb*2 if exp==2 else pb if exp==1 else (math.floor(pb/2) if half else 0))
        sf.set(SKILL_FIELD[sk_name],  fmt_mod(bonus))
        sf.check(SKILL_CHK[sk_name],  exp > 0)

    # Пассивное восприятие
    pv = pb if 'Восприятие' in skp else 0
    sf.set('Passive', str(10 + md('МДР') + pv))

    # Спасброски от смерти
    ds = int(char.get('deathSaveSuccesses', 0) or 0)
    df = int(char.get('deathSaveFailures',  0) or 0)
    for i in range(3):
        sf.check(f'DSsucc{i}', i < ds)
        sf.check(f'DSfail{i}', i < df)

    # Атаки + ресурсы
    weapons = char.get('weapons', []) or []
    atk_lines = []
    for ww in weapons:
        nm   = _s(ww.get('name', ''))
        abk  = AB_MAP.get(ww.get('ability', 'str'), 'СИЛ')
        abm  = md(abk)
        bns  = pb if ww.get('isProf', True) else 0
        tot  = abm + bns + int(ww.get('attackBonus', 0) or 0)
        dmg  = _s(ww.get('damage', ''))
        dtyp = _s(ww.get('damageType', ''))
        atk_lines.append(f"{nm}  {fmt_mod(tot)}  {dmg} {dtyp}".rstrip())

    # Ресурсы (cur/max — реальные имена полей в JSON)
    resources = char.get('resources') or char.get('classResources') or []
    for res in resources:
        nm      = _s(res.get('name') or '')
        cur_val = res.get('cur', res.get('current', ''))
        max_val = res.get('max', res.get('maximum', ''))
        if nm:
            line = nm
            if max_val: line += f'  {cur_val}/{max_val}'
            elif cur_val != '': line += f'  {cur_val}'
            atk_lines.append(line)

    an = _s(char.get('attacksNotes', char.get('attackNotes', '')) or '')
    if an: atk_lines.append(an)
    sf.set('AttacksNotes', '\n'.join(atk_lines))

    # Черты личности
    sf.set('Traits', char.get('traits', '') or '')
    sf.set('Ideals', char.get('ideals', '') or '')
    sf.set('Bonds',  char.get('bonds',  '') or '')
    sf.set('Flaws',  char.get('flaws',  '') or '')

    # Умения и способности (стр.1)
    feats = [_s(x) for x in [
        char.get('racialTraits',''), char.get('subraceTraits',''),
        char.get('classFeatures',''), char.get('abilitiesText', char.get('abilities_text','')),
    ] if x and _s(str(x))]
    sf.set('FeaturesTraits', '\n\n'.join(feats))

    # Монеты — порядок полей в шаблоне: CP=мм, SP=см, EP=зм, GP=эм, PP=пм
    cur = char.get('currency', {}) or {}
    sf.set('CP', str(int(float(cur.get('cp', 0) or 0))))   # мм
    sf.set('SP', str(int(float(cur.get('sp', 0) or 0))))   # см
    sf.set('EP', str(int(float(cur.get('gp', 0) or 0))))   # зм — поле EP стоит под подписью ЗМ
    sf.set('GP', str(int(float(cur.get('ep', 0) or 0))))   # эм — поле GP стоит под подписью ЭМ
    sf.set('PP', str(int(float(cur.get('pp', 0) or 0))))   # пм

    # Прочие владения и языки
    langs = char.get('languages', []) or []
    parts = []
    prof_custom = _s(char.get('_profText', '') or '')
    if prof_custom:
        parts = [prof_custom]
    else:
        if langs: parts.append('Языки: ' + ', '.join(langs))
        def _ls(v): return ', '.join(v) if isinstance(v, list) else _s(str(v or ''))
        if char.get('armorProf'):  parts.append('Доспехи: '    + _ls(char['armorProf']))
        if char.get('weaponProf'): parts.append('Оружие: '     + _ls(char['weaponProf']))
        tool = char.get('toolProf','') or char.get('otherProf','') or ''
        if isinstance(tool, list): tool = ', '.join(tool)
        if tool: parts.append('Инструменты: ' + _s(tool))
    sf.set('ProfLang', '\n'.join(parts))

    # Снаряжение — из inventory по itemClass: weapon → armor → tool → gear
    all_items = char.get('inventory', []) or []

    def weapon_line(item):
        nm = _s(item.get('name') or '').strip()
        if not nm: return None
        qty   = item.get('qty', 1)
        dmg   = _s(item.get('damageDice') or '')
        dtyp  = _s(item.get('damageType') or '')
        props = _s(item.get('_propStr') or '')
        desc  = _s(item.get('description') or '')
        parts = [p for p in [f'{dmg} {dtyp}'.strip() if dmg else '', props, desc] if p]
        suffix = f' ({", ".join(parts)})' if parts else ''
        prefix = f'{int(qty)}x ' if qty and int(qty) != 1 else ''
        return f'{prefix}{nm}{suffix}'

    def armor_line(item):
        nm = _s(item.get('name') or '').strip()
        if not nm: return None
        ac   = _s(item.get('ac') or '')
        desc = _s(item.get('description') or '')
        parts = [p for p in [f'КД: {ac}' if ac else '', desc] if p]
        suffix = f' ({", ".join(parts)})' if parts else ''
        return f'{nm}{suffix}'

    def gear_line(item):
        nm = _s(item.get('name') or '').strip()
        if not nm: return None
        qty  = item.get('qty', 1)
        desc = _s(item.get('description') or '')
        prefix = f'{int(qty)}x ' if qty and int(qty) != 1 else ''
        return f'{prefix}{nm}' + (f' - {desc}' if desc else '')

    POTION_IDS = {'potion_healing','potion_of_greater_healing','potion_of_superior_healing','potion_of_supreme_healing'}
    def effective_class(item):
        if item.get('id') in POTION_IDS: return 'potion'
        return item.get('itemClass')

    weapons_inv = [i for i in all_items if effective_class(i) == 'weapon']
    armors_inv  = [i for i in all_items if effective_class(i) == 'armor']
    tools_inv   = [i for i in all_items if effective_class(i) == 'tool']
    potions_inv = [i for i in all_items if effective_class(i) == 'potion']
    scrolls_inv = [i for i in all_items if effective_class(i) == 'scroll']
    gear_inv    = [i for i in all_items if effective_class(i) not in ('weapon','armor','tool','potion','scroll')]

    inv_blocks = []
    if weapons_inv:
        inv_blocks.append('\n'.join(l for l in [weapon_line(i) for i in weapons_inv] if l))
    if armors_inv:
        inv_blocks.append('\n'.join(l for l in [armor_line(i) for i in armors_inv] if l))
    if tools_inv:
        inv_blocks.append('\n'.join(l for l in [gear_line(i) for i in tools_inv] if l))
    if potions_inv:
        inv_blocks.append('\n'.join(l for l in [gear_line(i) for i in potions_inv] if l))
    if scrolls_inv:
        inv_blocks.append('\n'.join(l for l in [gear_line(i) for i in scrolls_inv] if l))
    if gear_inv:
        inv_blocks.append('\n'.join(l for l in [gear_line(i) for i in gear_inv] if l))
    if char.get('inventoryNotes'):
        inv_blocks.append(_s(char['inventoryNotes']))

    sf.set('Equipment', '\n\n'.join(b for b in inv_blocks if b))

    # ══ PAGE 2 ══════════════════════════════════════════════════════════════
    # Поля после переименования:
    # Portrait  (левый верх)  — текстового поля нет, портрет вставляется как изображение
    # Backstory (левый центр) — предыстория персонажа
    # Goals     (левый низ)   — цели и задачи (из noteBlock 'Цели')
    # Allies    (правый верх) — союзники и организации
    # FeatTraits2 (прав.центр)— доп. способности (внешность + черты)
    # Treasure  (прав.низ)    — сокровища (пусто)

    sf.set('CharName2', char.get('name', ''))
    sf.set('Age',    str(char.get('age',    '') or ''))
    sf.set('Height', str(char.get('height', '') or ''))
    sf.set('Weight', str(char.get('weight', '') or ''))
    sf.set('Eyes',   str(char.get('eyes',   '') or ''))
    sf.set('Skin',   str(char.get('skin',   '') or ''))
    sf.set('Hair',   str(char.get('hair',   '') or ''))

    sf.set('Backstory', char.get('backstory', '') or '')

    nbs = char.get('noteBlocks') or []
    goals_text = ''
    for nb in nbs:
        if (nb.get('title') or '').strip() in ('Цели', 'Цели и задачи'):
            goals_text = _s(nb.get('text') or '')
            break
    sf.set('Goals', goals_text)

    sf.set('Allies', char.get('allies', '') or '')

    appearance = _s(char.get('appearance', '') or '')
    feat_text  = _s(char.get('savedFeatText', '') or '')
    sf.set('FeatTraits2', '\n\n'.join(p for p in [appearance, feat_text] if p))

    sf.set('Treasure', '')

    # ══ PAGE 3 ══════════════════════════════════════════════════════════════
    sf.set('NoteName', char.get('name', ''))

    # Если заметок > 6, всё начиная с 6-й попадает в последний блок через пустую строку
    for i in range(1, 7):
        if i < 6:
            nb = nbs[i-1] if i-1 < len(nbs) else None
            if nb:
                t = _s(nb.get('title') or '').strip()
                x = _s(nb.get('text')  or '')
                sf.set(f'Note{i}', (f'{t}:\n{x}' if t else x).strip())
            else:
                sf.set(f'Note{i}', '')
        else:
            # Note6 = блоки 6, 7, 8... объединённые через пустую строку
            parts = []
            for nb in nbs[5:]:
                t = _s(nb.get('title') or '').strip()
                x = _s(nb.get('text')  or '')
                parts.append((f'{t}:\n{x}' if t else x).strip())
            sf.set('Note6', '\n\n'.join(p for p in parts if p))

    # ══ PAGE 4 ══════════════════════════════════════════════════════════════
    sabl = char.get('spellAbility', '')
    ab_m = get_mod(sc(sabl)) if sabl else 0
    sf.set('SpellClass',   char.get('className', ''))
    sf.set('SpellAbility', sabl or '')
    sf.set('SpellDC',      str(8 + pb + ab_m) if sabl else '')
    sf.set('SpellAtk',     fmt_mod(pb + ab_m) if sabl else '')

    # Ячейки заклинаний
    # Определяем базовые слоты: колдун — Pact Magic, остальные — стандартная таблица
    cls_id = (char.get('class') or '').lower()
    is_warlock = 'warlock' in cls_id or 'колдун' in (char.get('className') or '').lower()

    if is_warlock:
        pact_cnt, pact_lvl = WARLOCK_PACT_TABLE.get(lv, (1, 1))
        base_slots = {pact_lvl: pact_cnt}
    else:
        slot_counts_char = char.get('spellSlots') or char.get('slotCounts') or {}
        if slot_counts_char:
            base_slots = {int(k): int(v or 0) for k, v in slot_counts_char.items()}
        else:
            row = SLOT_TABLE.get(lv, SLOT_TABLE[1])
            base_slots = {i+1: v for i, v in enumerate(row) if v}

    # Применяем _slotOverrides (ручные поправки из диалога ячеек)
    overrides = char.get('_slotOverrides') or {}
    used = char.get('usedSpellSlots', {}) or {}

    for sl in range(1, 10):
        ov = overrides.get(sl) or overrides.get(str(sl)) or {}
        base = base_slots.get(sl, 0)
        if ov.get('override') is not None:
            mx = int(ov['override'])
        else:
            mx = base + int(ov.get('bonus') or 0)
        u = int(used.get(str(sl), 0) or 0)
        sf.set(f'SlotTotal{sl}',  str(mx) if mx else '')
        sf.set(f'SlotRemain{sl}', str(max(0, mx - u)) if mx else '')

    # Заклинания
    slmap    = char.get('_spellLevels', {}) or {}
    spells   = char.get('spells', []) or []
    prepared = set(char.get('preparedSpells', []) or [])
    by_lv    = {}
    for sp in spells:
        lv2 = slmap.get(sp, 1)
        by_lv.setdefault(lv2, []).append(sp)

    for lvl in range(0, 10):
        sp_list = by_lv.get(lvl, [])
        i = 0
        while True:
            fname = f'SP{lvl}x{i}'
            if fname not in sf._index: break
            sp = sp_list[i] if i < len(sp_list) else ''
            is_prep = bool(sp) and (sp in prepared or lvl == 0)
            sf.set(fname, sp)
            sf.check(f'SPchk{lvl}x{i}', is_prep)
            i += 1


# ── Публичный API ─────────────────────────────────────────────────────────────

def _insert_portrait_pikepdf(doc, portrait_src: str, portrait_file: Path = None):
    """
    Вставляет портрет на страницу 2 через pikepdf (корректная запись XObject).
    Источники (в порядке приоритета):
      1. portrait_file — Path к файлу на диске (любой формат, конвертируется в JPEG)
      2. portrait_src  — base64 data URL
    """
    import base64, struct, io as _io, pikepdf

    img_bytes = None

    # 1. Файл на диске
    if portrait_file and Path(portrait_file).exists():
        img_bytes = Path(portrait_file).read_bytes()

    # 2. base64 data URL
    if img_bytes is None and portrait_src and portrait_src.startswith('data:image'):
        try:
            _, b64 = portrait_src.split(',', 1)
            img_bytes = base64.b64decode(b64)
        except Exception:
            return

    if not img_bytes:
        return

    # Конвертируем в JPEG через Pillow — PDF поддерживает только DCTDecode/FlateDecode.
    # Файл может быть WebP, PNG и т.д. даже с расширением .jpg.
    try:
        from PIL import Image as _PIL
        pil = _PIL.open(_io.BytesIO(img_bytes))
        if pil.mode not in ('RGB', 'L'):
            pil = pil.convert('RGB')
        img_w, img_h = pil.size
        buf = _io.BytesIO()
        pil.save(buf, format='JPEG', quality=92)
        img_bytes = buf.getvalue()
    except Exception:
        return

    # Позиция поля Portrait на странице 2: [38, 507, 206, 721]
    x0, y0, x1, y1 = 38.0, 507.0, 206.0, 721.0
    w_box = x1 - x0   # 168 pt
    h_box = y1 - y0   # 214 pt

    # Fill + clip: заполняем бокс целиком, центрируем, обрезаем лишнее
    img_ratio = img_w / img_h
    box_ratio = w_box / h_box
    if img_ratio > box_ratio:
        draw_h = h_box;  draw_w = h_box * img_ratio
    else:
        draw_w = w_box;  draw_h = w_box / img_ratio
    draw_x = x0 + (w_box - draw_w) / 2
    draw_y = y0 + (h_box - draw_h) / 2

    page = doc.pages[1]

    # Image XObject через pikepdf
    img_xobj = pikepdf.Stream(doc, img_bytes)
    img_xobj['/Type']             = pikepdf.Name('/XObject')
    img_xobj['/Subtype']          = pikepdf.Name('/Image')
    img_xobj['/Width']            = img_w
    img_xobj['/Height']           = img_h
    img_xobj['/ColorSpace']       = pikepdf.Name('/DeviceRGB')
    img_xobj['/BitsPerComponent'] = 8
    img_xobj['/Filter']           = pikepdf.Name('/DCTDecode')

    if '/XObject' not in page['/Resources']:
        page['/Resources']['/XObject'] = pikepdf.Dictionary()
    page['/Resources']['/XObject']['/Img0'] = img_xobj

    # Content stream: клиппинг по боксу + отрисовка
    ops = (
        f'q '
        f'{x0:.4f} {y0:.4f} {w_box:.4f} {h_box:.4f} re W n '
        f'{draw_w:.4f} 0 0 {draw_h:.4f} {draw_x:.4f} {draw_y:.4f} cm '
        f'/Img0 Do '
        f'Q\n'
    ).encode('latin-1')
    cs = pikepdf.Stream(doc, ops)

    existing = page['/Contents']
    page['/Contents'] = pikepdf.Array([existing, cs])


def fill_character_sheet(char: dict, template_path: str = None,
                         portrait_path: Path = None) -> bytes:
    """
    portrait_path: явный путь к JPEG файлу портрета (опционально).
    Если не передан, пытается найти {stem}.jpg рядом с template или из char['portrait'].
    """
    path = template_path or str(_TEMPLATE)
    reader = PdfReader(path)
    writer = PdfWriter()
    writer.append(reader)

    acro = writer._root_object.get('/AcroForm')
    if acro:
        ao = acro.get_object() if hasattr(acro, 'get_object') else acro
        ao[NameObject('/NeedAppearances')] = BooleanObject(True)

    sf = SheetFiller(writer)
    _build(sf, char)

    # Определяем источник портрета
    portrait_src  = char.get('portrait', '') or ''
    portrait_file = portrait_path  # явно переданный путь

    # Если портрет — URL вида /api/portrait/{stem}.jpg, ищем файл рядом с template
    if not portrait_file and portrait_src and not portrait_src.startswith('data:image'):
        stem = Path(portrait_src.split('/')[-1]).stem  # берём имя файла без расширения
        candidates = [
            Path(path).parent / f'{stem}.jpg',          # рядом с шаблоном
            _HERE / 'characters' / f'{stem}.jpg',       # папка characters
            _HERE / f'{stem}.jpg',
        ]
        for c in candidates:
            if c.exists():
                portrait_file = c
                break

    has_portrait = portrait_file or (portrait_src and portrait_src.startswith('data:image'))

    # pypdf записывает заполненные поля
    out = io.BytesIO()
    writer.write(out)
    out.seek(0)

    if has_portrait:
        # pikepdf корректно вставляет XObject с портретом
        import pikepdf
        doc = pikepdf.open(out)
        _insert_portrait_pikepdf(doc, portrait_src, portrait_file)
        result = io.BytesIO()
        doc.save(result)
        result.seek(0)
        return result.read()

    return out.read()
