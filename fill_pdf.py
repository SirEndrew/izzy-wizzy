"""
fill_pdf.py — fills the DnD 5e Russian character sheet PDF.
Uses pypdfium2 raw API with FPDFText_SetText (UTF-16LE) for correct Cyrillic.
Merges overlay onto template via pypdf.
No reportlab required.
"""
import io, ctypes
from pathlib import Path
from pypdf import PdfReader, PdfWriter
import pypdfium2 as pdfium

_FPDF_FONT_TRUETYPE = 2
_HERE = Path(__file__).parent

def _font_path():
    for p in [_HERE/"static"/"DejaVuSans.ttf",
              Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
              Path("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"),
              Path("/usr/share/fonts/truetype/freefont/FreeSans.ttf")]:
        if p.exists(): return str(p)
    raise RuntimeError("No Cyrillic font found. Put DejaVuSans.ttf in the static/ folder.")

def fmt_mod(m): return f"+{m}" if m >= 0 else str(m)

import re as _re
_LSS_AB = {"STR":"СИЛ","DEX":"ЛОВ","CON":"ТЕЛ","INT":"ИНТ","WIS":"МДР","CHA":"ХАР",
           "PROF":"МАЕТ","LVL":"УР"}

def _clean_dmg(s):
    """Translate LSS [DEX]/[STR] placeholders to Russian [ЛОВ]/[СИЛ]."""
    def _sub(m):
        key = m.group(1).upper()
        return f"[{_LSS_AB.get(key, key)}]"
    return _re.sub(r'\[(\w+)\]', _sub, str(s or ""))
def get_mod(s): return (s - 10) // 2
def prof_b(lv): return 1 + ((lv - 1) // 4 + 1)

SLOT_TABLE = {
    1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0],
    4:[4,3,0,0,0,0,0,0,0], 5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0],
    7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0], 9:[4,3,3,3,1,0,0,0,0],
    10:[4,3,3,3,2,0,0,0,0],11:[4,3,3,3,2,1,0,0,0],12:[4,3,3,3,2,1,0,0,0],
    13:[4,3,3,3,2,1,1,0,0],14:[4,3,3,3,2,1,1,0,0],15:[4,3,3,3,2,1,1,1,0],
    16:[4,3,3,3,2,1,1,1,0],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],
    19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1],
}
SKILL_ABILITY = {
    "Акробатика":"ЛОВ","Магия":"ИНТ","Атлетика":"СИЛ","Обман":"ХАР",
    "История":"ИНТ","Проницательность":"МДР","Запугивание":"ХАР",
    "Расследование":"ИНТ","Медицина":"МДР","Природа":"ИНТ",
    "Восприятие":"МДР","Выступление":"ХАР","Убеждение":"ХАР",
    "Религия":"ИНТ","Ловкость рук":"ЛОВ","Скрытность":"ЛОВ",
    "Выживание":"МДР","Уход за животными":"МДР",
}
AB_MAP = {"str":"СИЛ","dex":"ЛОВ","int":"ИНТ","wis":"МДР","cha":"ХАР","con":"ТЕЛ"}
SKILL_RECTS = {
    "Акробатика":[112,462,126,470],"Уход за животными":[112,448,126,457],
    "Атлетика":[112,421,126,430],"Магия":[112,434,126,443],
    "Обман":[112,408,126,416],"История":[112,394,126,403],
    "Проницательность":[112,381,126,389],"Запугивание":[112,367,126,376],
    "Расследование":[112,354,126,362],"Медицина":[112,340,126,349],
    "Природа":[112,327,126,335],"Восприятие":[112,313,126,322],
    "Выступление":[112,300,126,308],"Убеждение":[112,286,126,295],
    "Религия":[112,273,126,281],"Ловкость рук":[112,259,126,268],
    "Скрытность":[112,246,126,254],"Выживание":[112,232,126,241],
}

# ── Core drawing ──────────────────────────────────────────────────────────────

def _utf16(text: str) -> ctypes.Array:
    enc = str(text).encode('utf-16-le') + b'\x00\x00'
    n   = len(enc) // 2
    return (ctypes.c_ushort * n)(*[int.from_bytes(enc[i*2:i*2+2],'little') for i in range(n)])

def _cw(fs): return fs * 0.52   # estimated char width

class Painter:
    def __init__(self, font_bytes: bytes):
        raw = pdfium.raw
        self._raw = raw
        self._doc  = raw.FPDF_CreateNewDocument()
        self._page = raw.FPDFPage_New(self._doc, 0, 612, 792)
        n  = len(font_bytes)
        fb = (ctypes.c_ubyte * n)(*font_bytes)
        self._font = raw.FPDFText_LoadFont(
            self._doc, fb, ctypes.c_uint(n),
            ctypes.c_int(_FPDF_FONT_TRUETYPE), ctypes.c_int(1))
        self._fb = fb   # keep buffer alive

    def t(self, text: str, x: float, y: float, fs: float):
        """Draw text at (x,y) — PDF coords (y=0 at bottom)."""
        if not text: return
        raw = self._raw
        obj = raw.FPDFPageObj_CreateTextObj(self._doc, self._font, ctypes.c_float(fs))
        raw.FPDFText_SetText(obj, _utf16(text))
        raw.FPDFPageObj_Transform(obj, 1, 0, 0, 1, x, y)
        raw.FPDFPage_InsertObject(self._page, obj)

    def tc(self, text: str, cx: float, y: float, fs: float):
        """Draw text centered on cx."""
        if not text: return
        w = len(str(text)) * _cw(fs)
        self.t(text, cx - w/2, y, fs)

    def field(self, text: str, rect, fs: float, align="left"):
        """Draw text vertically centered inside rect=[x0,y0,x1,y1]."""
        if not text: return
        x0,y0,x1,y1 = rect
        y = y0 + (y1-y0-fs)/2 + 1
        if align == "center":
            self.tc(text, (x0+x1)/2, y, fs)
        else:
            self.t(text, x0+2, y, fs)

    def wrap(self, text: str, rect, fs: float):
        """Word-wrap text filling rect from top."""
        if not text: return
        x0,y0,x1,y1 = rect
        max_w = x1-x0-4
        lh    = fs + 2.2
        y     = y1-fs-2
        for para in str(text).split('\n'):
            words = para.split() if para.strip() else ['']
            line  = ''
            for wd in words:
                candidate = (line+' '+wd).strip()
                if len(candidate)*_cw(fs) <= max_w:
                    line = candidate
                else:
                    if y < y0: return
                    if line: self.t(line, x0+2, y, fs)
                    y -= lh; line = wd
            if y < y0: return
            if line: self.t(line, x0+2, y, fs)
            y -= lh

    def save(self) -> bytes:
        self._raw.FPDFPage_GenerateContent(self._page)
        buf = io.BytesIO()
        pdfium.PdfDocument(self._doc).save(buf)
        buf.seek(0)
        return buf.read()


# ── Page builders ─────────────────────────────────────────────────────────────

def _page1(char: dict, font_bytes: bytes) -> bytes:
    p   = Painter(font_bytes)
    ab  = char.get("abilities",{})
    lv  = int(char.get("level",1))
    pb  = int(char.get("proficiencyBonus") or prof_b(lv))
    skp = set(char.get("skillProficiencies") or [])
    svp = set(char.get("savingThrows") or [])
    hp  = bool(char.get("halfProficiency"))

    def score(ru): return ab.get(ru,10)
    def mod(ru):   return get_mod(score(ru))

    cls = char.get("className",""); sub = char.get("subclass","")
    p.field(f"{cls}{' ('+sub+')' if sub else ''} {lv}", [270,728,376,744], 7)
    p.field(char.get("backgroundName",char.get("background","")), [384,728,470,744], 7)
    p.field(char.get("name",""), [48,710,221,731], 10)
    p.field(char.get("raceName",char.get("race","")), [269,702,376,718], 7)
    p.field(char.get("alignment",""), [384,702,474,718], 7)
    p.field(str(char.get("xp",0) or 0), [480,702,570,718], 7)

    p.field(str(char.get("ac",10)),    [234,626,261,651], 15, "center")
    p.field(fmt_mod(mod("ЛОВ")),       [286,618,322,651], 12, "center")
    p.field(str(char.get("speed",30)), [344,618,380,651], 12, "center")
    p.field(fmt_mod(pb),               [97,606,118,623],  10, "center")
    if char.get("inspiration"): p.field("*", [97,644,118,661], 12, "center")

    p.field(str(char.get("hpMax",10)), [291,585,380,595], 8)
    p.field(str(char.get("hpCurrent",char.get("hpMax",10))), [231,549,380,579], 16, "center")
    tmp = char.get("hpTemp",0) or 0
    if tmp: p.field(str(tmp), [231,497,380,528], 14, "center")
    p.field(f"d{char.get('hitDie',8)}", [232,440,295,461], 12, "center")
    p.field(f"{lv}d{char.get('hitDie',8)}", [247,464,295,474], 7)

    for ru, y_sc, y_mod in [("СИЛ",625,599),("ЛОВ",553,527),("ТЕЛ",482,456),
                              ("ИНТ",410,384),("МДР",338,312),("ХАР",267,241)]:
        p.tc(str(score(ru)), 57, y_sc, 14)
        p.tc(fmt_mod(mod(ru)), 57, y_mod, 9)

    for ru, y in [("СИЛ",581),("ЛОВ",567),("ТЕЛ",553),("ИНТ",540),("МДР",526),("ХАР",513)]:
        bonus = pb if ru in svp else 0
        p.tc(fmt_mod(mod(ru)+bonus), 120, y, 7)

    for sk, rect in SKILL_RECTS.items():
        is_p  = sk in skp
        bonus = pb if is_p else (pb//2 if hp else 0)
        p.field(fmt_mod(mod(SKILL_ABILITY.get(sk,"СИЛ"))+bonus), rect, 7, "center")

    pb_p = pb if "Восприятие" in skp else 0
    p.field(str(10+mod("МДР")+pb_p), [32,184,54,201], 9, "center")

    weapons = char.get("weapons",[]) or []
    for i, ww in enumerate(weapons[:3]):
        nr,ar,dr = [([224,385,286,399],[292,385,322,399],[328,385,389,399]),
                    ([224,365,286,379],[292,365,322,379],[328,365,389,379]),
                    ([224,344,286,358],[292,344,322,358],[328,344,389,358])][i]
        am  = mod(AB_MAP.get(ww.get("ability","str"),"СИЛ"))
        atk = int(ww.get("attackBonus",0) or 0)
        pp  = pb if ww.get("isProf",True) else 0
        p.field(ww.get("name",""), nr, 7)
        p.field(fmt_mod(am+atk+pp), ar, 7, "center")
        raw_dmg = _clean_dmg(ww.get('damage',''))
        p.field(f"{raw_dmg} {ww.get('damageType','')}".strip(), dr, 6)

    xl = [f"{ww.get('name','')}  {fmt_mod(int(ww.get('attackBonus',0) or 0))}  {_clean_dmg(ww.get('damage',''))} {ww.get('damageType','')}" + (f"  {ww.get('range','')}" if ww.get('range') else "") for ww in weapons[3:]]
    atk_note = char.get("attacksNotes", char.get("attackNotes","")) or ""
    p.wrap("\n".join(filter(None, xl+([atk_note] if atk_note else []))), [224,224,389,338], 6)

    p.wrap(char.get("traits","") or "", [419,603,572,651], 7)
    p.wrap(char.get("ideals","") or "", [419,548,572,582], 7)
    p.wrap(char.get("bonds","")  or "", [419,492,572,527], 7)
    p.wrap(char.get("flaws","")  or "", [419,438,572,472], 7)

    cur = char.get("currency",{}) or {}
    for coin, rect in [("cp",[230,175,259,193]),("sp",[230,149,259,167]),
                        ("ep",[230,123,259,141]),("gp",[230,98,259,115]),
                        ("pp",[230,72,259,89])]:
        p.field(str(cur.get(coin,0) or 0), rect, 8, "center")

    langs = char.get("languages",[]) or []
    parts = []
    if langs: parts.append("Языки: "+", ".join(langs))
    def _str(v): return ", ".join(v) if isinstance(v, list) else str(v or "")
    if char.get("armorProf"): parts.append("Доспехи: "+_str(char["armorProf"]))
    if char.get("weaponProf"): parts.append("Оружие: "+_str(char["weaponProf"]))
    tool = char.get("toolProf","") or char.get("otherProf","") or ""
    if isinstance(tool, list): tool = ", ".join(tool)
    if tool: parts.append("Инструменты: "+tool)
    p.wrap("\n".join(parts), [34,36,200,165], 6)

    inv = []
    for item in char.get("inventory",[]) or []:
        nm = (item.get("name") or "").strip()
        if not nm: continue
        qty = item.get("qty",1); desc = (item.get("description") or "").strip()
        ln  = f"{qty}x {nm}" if qty!=1 else nm
        if desc: ln += f" - {desc}"
        inv.append(ln)
    p.wrap("\n".join(inv), [269,36,389,199], 6)

    fp = [x for x in [char.get("racialTraits",""),char.get("classFeatures",""),
                       char.get("abilities_text","")] if x and x.strip()]
    p.wrap("\n\n".join(fp), [412,36,578,405], 6)
    return p.save()


def _page2(char: dict, font_bytes: bytes) -> bytes:
    p = Painter(font_bytes)
    p.field(char.get("name",""),             [48,706,256,727], 10)
    p.field(str(char.get("age","") or ""),   [266,725,372,741], 8)
    p.field(str(char.get("height","") or ""),[379,725,465,741], 8)
    p.field(str(char.get("weight","") or ""),[475,725,573,741], 8)
    p.field(str(char.get("eyes","") or ""),  [265,699,372,715], 8)
    p.field(str(char.get("skin","") or ""),  [379,699,469,715], 8)
    p.field(str(char.get("hair","") or ""),  [475,699,573,715], 8)
    p.wrap(char.get("backstory","") or "",   [35,37,200,407],   6)

    # notes: new format is noteBlocks list, legacy is plain string
    note_blocks = char.get("noteBlocks") or []
    if note_blocks:
        notes_text = "\n\n".join(
            ((nb.get("title","") + ":\n" if nb.get("title") else "") + (nb.get("text","") or "")).strip()
            for nb in note_blocks
        )
    else:
        notes_text = char.get("notes","") or ""
    p.wrap(notes_text, [224,213,578,417], 6)

    # allies / appearance on page 2 right column
    p.wrap(char.get("allies","") or "",      [224,37,578,202],  6)
    return p.save()


def _page3(char: dict, font_bytes: bytes) -> bytes:
    p    = Painter(font_bytes)
    ab   = char.get("abilities",{})
    lv   = int(char.get("level",1))
    pb   = int(char.get("proficiencyBonus") or prof_b(lv))
    sabl = char.get("spellAbility","")

    if not sabl:
        return p.save()

    ab_m = get_mod(ab.get(sabl,10))
    p.field(char.get("className",""), [48,706,256,727],  9)
    p.field(sabl,                     [284,711,349,736], 10, "center")
    p.field(str(8+pb+ab_m),           [384,711,449,736], 11, "center")
    p.field(fmt_mod(pb+ab_m),         [488,711,553,736], 11, "center")

    slot_counts = SLOT_TABLE.get(lv, SLOT_TABLE[1])
    used = char.get("usedSpellSlots",{}) or {}
    slot_rects = {
        1:([52,457,91,478],  [103,457,196,478]),
        2:([52,229,91,250],  [103,229,196,250]),
        3:([241,625,280,646],[292,625,385,646]),
        4:([241,400,280,421],[292,400,385,421]),
        5:([241,173,280,194],[292,173,385,194]),
        6:([428,625,467,646],[479,625,572,646]),
        7:([428,455,467,476],[479,455,572,476]),
        8:([428,286,467,306],[479,286,572,306]),
        9:([428,145,467,166],[479,145,572,166]),
    }
    for sl in range(1,10):
        mx = slot_counts[sl-1] if sl<=len(slot_counts) else 0
        if mx <= 0: continue
        u = int(used.get(str(sl),0) or 0)
        tr,rr = slot_rects[sl]
        p.field(str(mx),          tr, 9, "center")
        p.field(str(max(0,mx-u)), rr, 9, "center")

    slmap  = char.get("_spellLevels",{}) or {}
    spells = char.get("spells",[]) or []
    can    = [s for s in spells if slmap.get(s,1)==0]
    lv1    = [s for s in spells if slmap.get(s,1)==1]
    by_lv  = {i:[s for s in spells if slmap.get(s,1)==i] for i in range(2,10)}

    def sp(name, x, y): p.t(str(name)[:40], x+3, y+2, 6.5)

    for i,s in enumerate(can[:8]):
        sp(s, 40, [607,594,580,566,552,538,524,510][i])
    lv1_y = [422,408,394,380,366,352,338,324,310,296,282,268,
             195,181,167,153,139,125,111,97,83,69,55,41]
    for i,s in enumerate(lv1[:len(lv1_y)]): sp(s,40,lv1_y[i])
    c2={2:[606,592,578,564,550,536,522,508,494,480,466,452,438,424],
        3:[380,366,352,338,324,310,297,283,269,254,241,227,213],
        4:[154,140,126,112,98,84,70,56,42]}
    c3={5:[606,592,578,564,550,536,522,508,494],
        6:[436,422,408,394,380,366,352],
        7:[266,252,238,224,211,197,183],
        8:[126,112,98,84,70,56,42],
        9:[126,112,98,84,70,56,42]}
    for lv2,ys in c2.items():
        for i,s in enumerate(by_lv.get(lv2,[])[:len(ys)]): sp(s,230,ys[i])
    for lv2,ys in c3.items():
        for i,s in enumerate(by_lv.get(lv2,[])[:len(ys)]): sp(s,417,ys[i])
    return p.save()


# ── Checkbox maps ─────────────────────────────────────────────────────────────

SAVE_CHECKBOXES = {
    'СИЛ': 'Check Box 11',
    'ЛОВ': 'Check Box 18',
    'ТЕЛ': 'Check Box 19',
    'ИНТ': 'Check Box 20',
    'МДР': 'Check Box 21',
    'ХАР': 'Check Box 22',
}

SKILL_CHECKBOXES = {
    'Акробатика':       'Check Box 23',
    'Уход за животными':'Check Box 24',
    'Магия':            'Check Box 25',
    'Атлетика':         'Check Box 26',
    'Обман':            'Check Box 27',
    'История':          'Check Box 28',
    'Проницательность': 'Check Box 29',
    'Запугивание':      'Check Box 30',
    'Расследование':    'Check Box 31',
    'Медицина':         'Check Box 32',
    'Природа':          'Check Box 33',
    'Восприятие':   'Check Box 34',
    'Выступление':      'Check Box 35',
    'Убеждение':        'Check Box 36',
    'Религия':          'Check Box 37',
    'Ловкость рук':     'Check Box 38',
    'Скрытность':       'Check Box 39',
    'Выживание':        'Check Box 40',
}

# ── Public API ────────────────────────────────────────────────────────────────

def fill_character_sheet(char: dict, template_path: str) -> bytes:
    font_bytes = open(_font_path(), "rb").read()
    builders   = [_page1, _page2, _page3]

    # ── Step 1: fill checkboxes on template (preserves AcroForm) ──
    sv_profs = set(char.get("savingThrows") or [])
    sk_profs = set(char.get("skillProficiencies") or [])
    checkbox_values = {}
    for ru, field in SAVE_CHECKBOXES.items():
        checkbox_values[field] = '/Yes' if ru in sv_profs else '/Off'
    for sk, field in SKILL_CHECKBOXES.items():
        checkbox_values[field] = '/Yes' if sk in sk_profs else '/Off'

    tpl_reader = PdfReader(template_path)
    tpl_writer = PdfWriter()
    tpl_writer.append(tpl_reader)
    for page in tpl_writer.pages:
        tpl_writer.update_page_form_field_values(page, checkbox_values, auto_regenerate=False)
    tpl_buf = io.BytesIO()
    tpl_writer.write(tpl_buf)
    tpl_buf.seek(0)

    # ── Step 2: merge text overlays on top ──
    filled_tpl = PdfReader(tpl_buf)
    writer     = PdfWriter()
    writer.append(filled_tpl)   # keep AcroForm
    for pg_idx, builder in enumerate(builders):
        ovr_bytes = builder(char, font_bytes)
        ovr_page  = PdfReader(io.BytesIO(ovr_bytes)).pages[0]
        writer.pages[pg_idx].merge_page(ovr_page)

    out = io.BytesIO()
    writer.write(out)
    out.seek(0)
    return out.read()
