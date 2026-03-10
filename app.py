from flask import Flask, render_template, request, jsonify, send_file
import json, os, io, time, sys
from pathlib import Path

# ── PyInstaller / dev path resolution ────────────────────────────────────────
def _resource_path(rel: str) -> Path:
    """Get absolute path — works both in dev and PyInstaller one-file bundle."""
    base = Path(getattr(sys, "_MEIPASS", Path(__file__).parent))
    return base / rel

_APP_DIR = Path(__file__).parent
if str(_APP_DIR) not in sys.path:
    sys.path.insert(0, str(_APP_DIR))

from fill_pdf import fill_character_sheet

# Flask: point templates and static to bundle paths
app = Flask(
    __name__,
    template_folder=str(_resource_path("templates")),
    static_folder=str(_resource_path("static")),
)

# Characters saved next to the exe / script — never inside the bundle
if getattr(sys, "frozen", False):
    # Running as PyInstaller exe
    _DATA_DIR = Path(sys.executable).parent
else:
    _DATA_DIR = Path(__file__).parent

SAVE_DIR = _DATA_DIR / "characters"
SAVE_DIR.mkdir(exist_ok=True)
BASE_DIR = _resource_path("")

# ── Version & update check ────────────────────────────────────────────────────
APP_VERSION = "0.9B"
GITHUB_REPO = "SirEndrew/izzy-wizzy"  # TODO: replace with real repo

@app.route("/api/version")
def get_version():
    return jsonify({"version": APP_VERSION})

@app.route("/api/check-update")
def check_update():
    import urllib.request, json as _json
    try:
        url = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"
        req = urllib.request.Request(url, headers={"User-Agent": "IzzyWizzy/" + APP_VERSION})
        with urllib.request.urlopen(req, timeout=4) as r:
            data = _json.loads(r.read())
        latest = data.get("tag_name", "").lstrip("v")
        dl_url = data.get("html_url", "")
        return jsonify({"current": APP_VERSION, "latest": latest, "url": dl_url, "has_update": latest != APP_VERSION and bool(latest)})
    except Exception:
        return jsonify({"current": APP_VERSION, "latest": None, "has_update": False})



def to_prosemirror(text: str) -> dict:
    if not text:
        return {"data": {"type": "doc", "content": [{"type": "paragraph"}]}}
    content = []
    for p in text.split('\n'):
        if p.strip():
            content.append({"type": "paragraph", "content": [{"type": "text", "text": p}]})
        else:
            content.append({"type": "paragraph"})
    return {"data": {"type": "doc", "content": content}}

def from_prosemirror(pm) -> str:
    if not pm or not isinstance(pm, dict):
        return ""
    data = pm.get("data", pm)
    if isinstance(data, dict) and "data" in data:
        data = data["data"]
    if not isinstance(data, dict):
        return ""
    lines = []
    for block in data.get("content", []):
        texts = [i.get("text","") for i in block.get("content",[]) if i.get("type")=="text"]
        lines.append("".join(texts))
    return "\n".join(lines).strip()

ABILITY_MAP = {"СИЛ":"str","ЛОВ":"dex","ТЕЛ":"con","ИНТ":"int","МДР":"wis","ХАР":"cha"}
ABILITY_MAP_REV = {v:k for k,v in ABILITY_MAP.items()}
SKILL_EN_MAP = {
    "Акробатика":"acrobatics","Уход за животными":"animal handling","Атлетика":"athletics",
    "Магия":"arcana","Обман":"deception","История":"history","Запугивание":"intimidation",
    "Расследование":"investigation","Медицина":"medicine","Природа":"nature",
    "Восприятие":"perception","Выступление":"performance","Убеждение":"persuasion",
    "Религия":"religion","Ловкость рук":"sleight of hand","Скрытность":"stealth",
    "Выживание":"survival","Проницательность":"insight"
}
SKILL_ABILITY = {
    "acrobatics":"dex","animal handling":"wis","athletics":"str","arcana":"int",
    "deception":"cha","history":"int","intimidation":"cha","investigation":"int",
    "medicine":"wis","nature":"int","perception":"wis","performance":"cha",
    "persuasion":"cha","religion":"int","sleight of hand":"dex","stealth":"dex",
    "survival":"wis","insight":"wis"
}
SLOT_TABLE = {
    1:[2,0,0,0,0,0,0,0,0],2:[3,0,0,0,0,0,0,0,0],3:[4,2,0,0,0,0,0,0,0],
    4:[4,3,0,0,0,0,0,0,0],5:[4,3,2,0,0,0,0,0,0],6:[4,3,3,0,0,0,0,0,0],
    7:[4,3,3,1,0,0,0,0,0],8:[4,3,3,2,0,0,0,0,0],9:[4,3,3,3,1,0,0,0,0],
    10:[4,3,3,3,2,0,0,0,0],11:[4,3,3,3,2,1,0,0,0],12:[4,3,3,3,2,1,0,0,0],
    13:[4,3,3,3,2,1,1,0,0],14:[4,3,3,3,2,1,1,0,0],15:[4,3,3,3,2,1,1,1,0],
    16:[4,3,3,3,2,1,1,1,0],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],
    19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1],
}


# LSS ability placeholder translation [DEX] -> [ЛОВ] etc.
import re as _re
_LSS_AB_RU = {"STR":"СИЛ","DEX":"ЛОВ","CON":"ТЕЛ","INT":"ИНТ","WIS":"МДР","CHA":"ХАР",
               "PROF":"МАЕТ","LVL":"УР"}
def _lss_dmg(s):
    def _sub(m):
        key = m.group(1).upper()
        return f"[{_LSS_AB_RU.get(key, key)}]"
    return _re.sub(r'\[(\w+)\]', _sub, str(s or ""))

def char_to_lss(char: dict) -> dict:
    abilities = char.get("abilities", {})
    level = char.get("level", 1)

    def stat(ru_key):
        en = ABILITY_MAP.get(ru_key, ru_key.lower())
        score = abilities.get(ru_key, 10)
        mod = (score - 10) // 2
        return {"name": en, "score": score, "modifier": mod, "label": ru_key, "check": mod}

    skill_profs = set(char.get("skillProficiencies", []))
    # skillExpertise is a dict {ruName: 0|1|2} from JS, or a list (legacy)
    _exp_raw = char.get("skillExpertise", {})
    if isinstance(_exp_raw, dict):
        skill_experts = {k for k, v in _exp_raw.items() if v == 2}
    else:
        skill_experts = set(_exp_raw)
    skills = {}
    for ru, en in SKILL_EN_MAP.items():
        entry = {"baseStat": SKILL_ABILITY.get(en, "str"), "name": en}
        if ru in skill_experts:
            entry["isProf"] = 2
        elif ru in skill_profs:
            entry["isProf"] = 1
        skills[en] = entry

    save_profs = set(char.get("savingThrows", []))
    saves = {en: {"name": en, "isProf": ru in save_profs} for ru, en in ABILITY_MAP.items()}

    slots = SLOT_TABLE.get(level, SLOT_TABLE[1])
    used_slots = char.get("usedSpellSlots", {})
    spells_obj = {}
    for i, max_s in enumerate(slots):
        if max_s > 0:
            filled = used_slots.get(str(i), 0)
            spells_obj[f"slots-{i}"] = {"value": max_s, "filled": filled}

    # Weapons
    weapons_list = []
    for i, w in enumerate(char.get("weapons", [])):
        ts = int(time.time() * 1000) + i
        atk = w.get("attackBonus", 0) or 0
        mod_val = f"+{atk}" if atk >= 0 else str(atk)
        dmg_raw = w.get("damage", "")
        dmg_type = w.get("damageType", "")
        dmg_str = f"{dmg_raw} / {dmg_type}".strip(" /") if dmg_type else dmg_raw
        entry = {
            "id": f"weapon-{ts}",
            "name": {"value": w.get("name", "")},
            "mod": {"value": mod_val, "bonus": atk},
            "dmg": {"value": dmg_str},
            "ability": ABILITY_MAP.get(w.get("ability", ""), w.get("ability", "str")),
            "isProf": w.get("isProf", True),
            "modBonus": {"value": 0},
        }
        notes_parts = []
        if w.get("range"):
            notes_parts.append(w["range"])
        if w.get("props"):
            notes_parts.append(w["props"])
        if w.get("note"):
            notes_parts.append(w["note"])
        if notes_parts:
            entry["notes"] = {"value": " · ".join(notes_parts)}
        weapons_list.append(entry)

    # Proficiencies / languages
    prof_parts = []
    if char.get("languages"):
        prof_parts.append("Языки:\n" + "\n".join(char["languages"]))
    prof_sections = []
    for key, label in [("armorProf","Доспехи"),("weaponProf","Оружие"),("toolProf","Инструменты"),("otherProf","Прочее")]:
        if char.get(key):
            prof_sections.append(f"{label}: {char[key]}")
    if prof_sections:
        prof_parts.append("Владения:\n" + "\n".join(prof_sections))
    prof_text = "\n\n".join(prof_parts)

    spell_ability_en = ABILITY_MAP.get(char.get("spellAbility", ""), "wis")

    # Resources → LSS resources dict
    resources_lss = {}
    for res in char.get("resources", []):
        rid = res.get("id") or f"resource-{int(time.time()*1000)}"
        resources_lss[rid] = {
            "id": rid,
            "name": res.get("name", ""),
            "current": res.get("current", 0),
            "max": res.get("max", 0),
            "location": "traits",
            "isShortRest": res.get("isShortRest", False),
            "isLongRest": res.get("isLongRest", False),
            "icon": "long-rest" if res.get("isLongRest") else ("short-rest" if res.get("isShortRest") else ""),
            **({"notes": res["notes"]} if res.get("notes") else {}),
        }

    # Inventory → equipment text
    inv_lines = []
    for item in char.get("inventory", []):
        if item.get("name"):
            qty = item.get("qty", 1)
            line = f"{qty}x {item['name']}" if qty and qty != 1 else item["name"]
            if item.get("description"):
                line += f" — {item['description']}"
            inv_lines.append(line)
    inv_text = "\n".join(inv_lines)

    # Notes blocks
    notes_dict = {}
    char_notes = char.get("notes", [])
    if isinstance(char_notes, str):
        notes_dict["notes-1"] = {"value": to_prosemirror(char_notes)}
    elif isinstance(char_notes, list):
        for idx, nb in enumerate(char_notes):
            key = f"notes-{idx+1}"
            entry = {"value": to_prosemirror(nb.get("content", ""))}
            if nb.get("title"):
                entry["customLabel"] = nb["title"]
            notes_dict[key] = entry
    if not notes_dict:
        notes_dict["notes-1"] = {"value": to_prosemirror("")}

    death = char.get("deathSaves", {})
    death_fails = sum(1 for x in (death.get("failures", []) or []) if x)
    death_succ  = sum(1 for x in (death.get("successes", []) or []) if x)

    inner = {
        "isDefault": True, "jsonType": "character", "template": "default",
        "name": {"value": char.get("name", "")},
        "info": {
            "charClass":    {"name": "charClass",    "value": char.get("className", "")},
            "charSubclass": {"name": "charSubclass", "value": char.get("subclass", "")},
            "level":        {"name": "level",        "value": level},
            "background":   {"name": "background",   "value": char.get("backgroundName", "")},
            "playerName":   {"name": "playerName",   "value": char.get("playerName", "")},
            "race":         {"name": "race",         "value": char.get("raceName", "")},
            "alignment":    {"name": "alignment",    "value": char.get("alignment", "")},
            "experience":   {"name": "experience",   "value": char.get("xp", 0)},
            "size": {"value": {"Средний":"medium","Маленький":"small","Большой":"large","Крошечный":"tiny","Огромный":"huge","Гигантский":"gargantuan"}.get(char.get("size","Средний"),"medium")},
        },
        "subInfo": {
            "age":    {"name": "age",    "value": str(char.get("age",    ""))},
            "height": {"name": "height", "value": str(char.get("height", ""))},
            "weight": {"name": "weight", "value": str(char.get("weight", ""))},
            "eyes":   {"name": "eyes",   "value": char.get("eyes",  "")},
            "skin":   {"name": "skin",   "value": char.get("skin",  "")},
            "hair":   {"name": "hair",   "value": char.get("hair",  "")},
        },
        "spellsInfo": {
            "base": {"name": "base", "value": "", "code": spell_ability_en},
            "save": {"name": "save", "value": "", "customModifier": char.get("spellSaveDC", 0)},
            "mod":  {"name": "mod",  "value": ""},
            "available": {"classes": [char.get("class", "")]},
        },
        "spells": spells_obj, "spellsPact": {},
        "proficiency": None,
        "proficiencyCustom": char.get("proficiencyBonus", 2),
        "stats": {en: stat(ru) for ru, en in ABILITY_MAP.items()},
        "saves": saves, "skills": skills,
        "vitality": {
            "hp-dice-current": {"value": level}, "hp-dice-multi": {},
            "speed":      {"value": char.get("speed", 30)},
            "hp-max":     {"value": char.get("hpMax", 10)},
            "hit-die":    {"value": f"d{char.get('hitDie', 8)}"},
            "isDying":    False,
            "hp-current": {"value": char.get("hpCurrent", char.get("hpMax", 10))},
            "hp-temp":    {"value": char.get("hpTemp") or 0},
            "deathFails":     death_fails,
            "deathSuccesses": death_succ,
            "shield": {"value": False},
            "ac": {"value": char.get("ac", 10)},
        },
        "attunementsList": [{"id": "attunement-0", "checked": False, "value": ""}],
        "weaponsList": weapons_list, "weapons": {},
        "text": {
            "traits":      {"value": to_prosemirror(char.get("traits", ""))},
            "personality": {"value": to_prosemirror(char.get("personality", ""))},
            "ideals":      {"value": to_prosemirror(char.get("ideals", ""))},
            "bonds":       {"value": to_prosemirror(char.get("bonds", ""))},
            "flaws":       {"value": to_prosemirror(char.get("flaws", ""))},
            "allies":      {"value": to_prosemirror(char.get("allies", ""))},
            "appearance":  {"value": to_prosemirror(char.get("appearance", ""))},
            "background":  {"value": to_prosemirror(char.get("backstory", ""))},
            "features":    {"value": to_prosemirror("\n\n".join(filter(None, [
                char.get("racialTraits", ""), char.get("classFeatures", "")])))},
            "equipment":   {"value": to_prosemirror(inv_text)},
            "prof":        {"value": to_prosemirror(prof_text)},
            "attacks":     {"value": to_prosemirror("")},
            "feats":       {"value": to_prosemirror("")},
            "quests":      {"value": to_prosemirror("")},
            **notes_dict,
        },
        "coins": {
            "gp":    {"value": char.get("currency", {}).get("gp", 0)},
            "sp":    {"value": char.get("currency", {}).get("sp", 0)},
            "cp":    {"value": char.get("currency", {}).get("cp", 0)},
            "pp":    {"value": char.get("currency", {}).get("pp", 0)},
            "ep":    {"value": char.get("currency", {}).get("ep", 0)},
            "total": {"value": char.get("currency", {}).get("gp", 0)},
        },
        "resources": resources_lss,
        "bonusesSkills": {}, "bonusesStats": {},
        "conditions": char.get("conditions", []),
        "createdAt": char.get("_created", ""),
        "inspiration": char.get("inspiration", False),
    }
    return {
        "tags": [],
        "disabledBlocks": {
            "info-left": [], "info-right": [], "subinfo-left": [],
            "subinfo-right": [], "notes-left": [], "notes-right": [],
        },
        "edition": "2014",
        "spells": {"mode": "cards", "prepared": [], "book": [], "edition": "2014"},
        "data": json.dumps(inner, ensure_ascii=False),
        "jsonType": "character",
        "version": "2",
    }

def lss_to_char(lss: dict) -> dict:
    try:
        inner_str = lss.get("data", "{}")
        inner = json.loads(inner_str) if isinstance(inner_str, str) else inner_str
    except:
        return None

    info      = inner.get("info", {})
    sub_info  = inner.get("subInfo", {})
    stats     = inner.get("stats", {})
    skills_lss = inner.get("skills", {})
    saves_lss  = inner.get("saves", {})
    vitality   = inner.get("vitality", {})
    text       = inner.get("text", {})
    coins      = inner.get("coins", {})

    def vget(obj, key, default=None):
        v = obj.get(key, default)
        return v.get("value", default) if isinstance(v, dict) else (v if v is not None else default)

    abilities = {ru: stats.get(en, {}).get("score", 10) for ru, en in ABILITY_MAP.items()}

    skill_profs = []
    skill_experts = {}   # {ruName: 1|2} — matches JS sheetSkillExp format
    for k, v in skills_lss.items():
        prof_level = v.get("isProf", 0)
        ru = next((r for r, e in SKILL_EN_MAP.items() if e == k), None)
        if ru and prof_level:
            skill_profs.append(ru)
            skill_experts[ru] = int(prof_level)  # 1=владение, 2=компетентность

    saving_throws = [ABILITY_MAP_REV.get(k, k.upper()) for k, v in saves_lss.items() if v.get("isProf")]

    # Parse weapons: extract damage/type/range from dmg string
    weapons = []
    for w in inner.get("weaponsList", []):
        raw_dmg = w.get("dmg", {}).get("value", "")
        dmg_part = raw_dmg
        dmg_type = ""
        # try splitting on " / " or "/"
        for sep in [" / ", "/"]:
            if sep in raw_dmg:
                parts = raw_dmg.split(sep, 1)
                dmg_part = parts[0].strip()
                dmg_type = parts[1].strip() if len(parts) > 1 else ""
                break
        dmg_part = _lss_dmg(dmg_part)  # [DEX] -> [ЛОВ]
        # Extract range hint from dmg_type if it contains digits and "/" (e.g. "Колющий 20/60")
        rng = ""
        if dmg_type and any(c.isdigit() for c in dmg_type):
            type_words = dmg_type.split()
            type_only = [t for t in type_words if not any(c.isdigit() or c == "/" for c in t)]
            rng_words  = [t for t in type_words if any(c.isdigit() for c in t)]
            dmg_type = " ".join(type_only)
            rng = " ".join(rng_words)
        # Bonus
        mod_raw = w.get("mod", {}).get("value", 0)
        if isinstance(mod_raw, str):
            try: atk = int(mod_raw.replace("+",""))
            except: atk = 0
        else:
            atk = int(mod_raw or 0)
        # mod bonus (e.g. +1 magic item)
        mod_bonus = w.get("modBonus", {}).get("value", 0) or 0
        notes_val = w.get("notes", {}).get("value", "") if isinstance(w.get("notes"), dict) else ""
        weapons.append({
            "name":        w.get("name", {}).get("value", ""),
            "attackBonus": atk,
            "damage":      dmg_part,
            "damageType":  dmg_type,
            "isProf":      w.get("isProf", True),
            "ability":     w.get("ability", "str"),
            **({"range": rng} if rng else {}),
            **({"note": notes_val} if notes_val else {}),
        })

    # Resources
    resources = []
    for rid, res in inner.get("resources", {}).items():
        resources.append({
            "id":          res.get("id", rid),
            "name":        res.get("name", ""),
            "current":     res.get("current", 0),
            "max":         res.get("max", 0),
            "isShortRest": res.get("isShortRest", False),
            "isLongRest":  res.get("isLongRest", False),
            **({"notes": res["notes"]} if res.get("notes") else {}),
        })

    # Notes blocks
    notes_list = []
    for key in sorted(text.keys()):
        if not key.startswith("notes-"):
            continue
        val = text[key]
        content = from_prosemirror(val.get("value", {}) if isinstance(val, dict) else {})
        title   = val.get("customLabel", "") if isinstance(val, dict) else ""
        if content or title:
            notes_list.append({"title": title, "content": content})

    # Death saves
    death_f = vget(vitality, "deathFails",     0) or 0
    death_s = vget(vitality, "deathSuccesses", 0) or 0
    death_saves = {
        "failures":  [i < death_f for i in range(3)],
        "successes": [i < death_s for i in range(3)],
    }

    # proficiencyBonus: prefer proficiencyCustom (manually set), then proficiency
    pb = inner.get("proficiencyCustom") or inner.get("proficiency") or 2

    spell_code = inner.get("spellsInfo", {}).get("base", {}).get("code", "")
    spell_save_dc = inner.get("spellsInfo", {}).get("save", {}).get("customModifier", 0)

    # Used spell slots: slots-N filled value → usedSpellSlots[str(N)]
    used_spell_slots = {}
    for slot_key, slot_val in inner.get("spells", {}).items():
        if slot_key.startswith("slots-"):
            n = slot_key.replace("slots-", "")
            filled = slot_val.get("filled", 0) if isinstance(slot_val, dict) else 0
            if filled:
                used_spell_slots[n] = filled

    return {
        "name":              inner.get("name", {}).get("value", "Импортированный персонаж"),
        "_system":           "DnD5e",
        "_version":          "2.0",
        "_created":          inner.get("createdAt", ""),
        "_imported_from":    "LongStoryShort",
        "race":              "",
        "raceName":          vget(info, "race", ""),
        "subrace":           "",
        "subraceName":       "",
        "class":             "",
        "className":         vget(info, "charClass", ""),
        "subclass":          vget(info, "charSubclass", ""),
        "background":        "",
        "backgroundName":    vget(info, "background", ""),
        "level":             vget(info, "level", 1),
        "xp":                vget(info, "experience", 0),
        "alignment":         vget(info, "alignment", ""),
        "playerName":        vget(info, "playerName", ""),
        "size":              {"medium":"Средний","small":"Маленький","large":"Большой","tiny":"Крошечный","huge":"Огромный","gargantuan":"Гигантский"}.get(
                                 info.get("size", {}).get("value", "medium"), "Средний"),
        "age":               vget(sub_info, "age", ""),
        "height":            vget(sub_info, "height", ""),
        "weight":            vget(sub_info, "weight", ""),
        "eyes":              vget(sub_info, "eyes", ""),
        "skin":              vget(sub_info, "skin", ""),
        "hair":              vget(sub_info, "hair", ""),
        "appearance":        from_prosemirror(text.get("appearance",  {}).get("value", {})),
        "backstory":         from_prosemirror(text.get("background",  {}).get("value", {})),
        "traits":            from_prosemirror(text.get("traits",      {}).get("value", {})),
        "personality":       from_prosemirror(text.get("personality", {}).get("value", {})),
        "ideals":            from_prosemirror(text.get("ideals",      {}).get("value", {})),
        "bonds":             from_prosemirror(text.get("bonds",       {}).get("value", {})),
        "flaws":             from_prosemirror(text.get("flaws",       {}).get("value", {})),
        "allies":            from_prosemirror(text.get("allies",      {}).get("value", {})),
        "classFeatures":     from_prosemirror(text.get("features",    {}).get("value", {})),
        "inventoryNotes":    from_prosemirror(text.get("equipment",   {}).get("value", {})),
        "abilities":         abilities,
        "abilityBases":      abilities.copy(),
        "racialBonuses":     {},
        "proficiencyBonus":  pb,
        "hpMax":             vget(vitality, "hp-max",     10),
        "hpCurrent":         vget(vitality, "hp-current", 10),
        "hpTemp":            vget(vitality, "hp-temp",    0) or 0,
        "hitDie":            int((vget(vitality, "hit-die", "d8") or "d8").replace("d", "") or 8),
        "ac":                vget(vitality, "ac",    10),
        "speed":             vget(vitality, "speed", 30),
        "flySpeed":          0,
        "initiative":        0,
        "savingThrows":      saving_throws,
        "skillProficiencies": skill_profs,
        "skillExpertise":    skill_experts,
        "armorProf":         "",
        "weaponProf":        "",
        "toolProf":          "",
        "otherProf":         "",
        "languages":         [],
        "spellAbility":      ABILITY_MAP_REV.get(spell_code, ""),
        "spellSaveDC":       spell_save_dc,
        "spells":            [],
        "usedSpellSlots":    used_spell_slots,
        "weapons":           weapons,
        "inventory":         [],
        "currency": {
            "gp": vget(coins, "gp", 0),
            "sp": vget(coins, "sp", 0),
            "cp": vget(coins, "cp", 0),
            "pp": vget(coins, "pp", 0),
            "ep": vget(coins, "ep", 0),
        },
        "racialTraits":      "",
        "inspiration":       inner.get("inspiration", False),
        "conditions":        inner.get("conditions", []),
        "deathSaves":        death_saves,
        "notes":             notes_list,
        "resources":         resources,
    }


    try:
        inner_str = lss.get("data", "{}")
        inner = json.loads(inner_str) if isinstance(inner_str, str) else inner_str
    except:
        return None

    info = inner.get("info", {})
    sub_info = inner.get("subInfo", {})
    stats = inner.get("stats", {})
    skills_lss = inner.get("skills", {})
    saves_lss = inner.get("saves", {})
    vitality = inner.get("vitality", {})
    text = inner.get("text", {})
    coins = inner.get("coins", {})

    abilities = {ru: stats.get(en,{}).get("score",10) for ru,en in ABILITY_MAP.items()}
    skill_profs = [next((ru for ru,en in SKILL_EN_MAP.items() if en==k),k)
                   for k,v in skills_lss.items() if v.get("isProf")]
    saving_throws = [ABILITY_MAP_REV.get(k,k.upper()) for k,v in saves_lss.items() if v.get("isProf")]

    def vget(obj, key, default=None):
        v = obj.get(key, default)
        return v.get("value", default) if isinstance(v, dict) else (v if v is not None else default)

    weapons = [{"name":w.get("name",{}).get("value",""), "attackBonus":0,
                "damage":w.get("dmg",{}).get("value",""), "damageType":"",
                "isProf":w.get("isProf",True), "ability":w.get("ability","str")}
               for w in inner.get("weaponsList",[])]

    return {
        "name": inner.get("name",{}).get("value","Импортированный персонаж"),
        "_system":"DnD5e","_version":"2.0","_created":inner.get("createdAt",""),
        "_imported_from":"LongStoryShort",
        "race":"","raceName":vget(info,"race",""),"subrace":"","subraceName":"",
        "class":"","className":vget(info,"charClass",""),"subclass":vget(info,"charSubclass",""),
        "background":"","backgroundName":vget(info,"background",""),
        "level":vget(info,"level",1),"xp":0,"alignment":vget(info,"alignment",""),
        "size":{"medium":"Средний","small":"Маленький","large":"Большой"}.get(
            info.get("size",{}).get("value","medium"),"Средний"),
        "age":vget(sub_info,"age",""),"height":vget(sub_info,"height",""),
        "weight":vget(sub_info,"weight",""),"eyes":vget(sub_info,"eyes",""),
        "skin":vget(sub_info,"skin",""),"hair":vget(sub_info,"hair",""),
        "appearance":from_prosemirror(text.get("appearance",{}).get("value",{})),
        "backstory":from_prosemirror(text.get("background",{}).get("value",{})),
        "traits":from_prosemirror(text.get("traits",{}).get("value",{})),
        "ideals":"","bonds":"","flaws":"",
        "abilities":abilities,"abilityBases":abilities.copy(),"racialBonuses":{},
        "proficiencyBonus":inner.get("proficiency",2),
        "hpMax":vget(vitality,"hp-max",10),"hpCurrent":vget(vitality,"hp-current",10),
        "hpTemp":vget(vitality,"hp-temp",0) or 0,
        "hitDie":int((vget(vitality,"hit-die","d8") or "d8").replace("d","") or 8),
        "ac":vget(vitality,"ac",10),"speed":vget(vitality,"speed",30),"flySpeed":0,"initiative":0,
        "savingThrows":saving_throws,"skillProficiencies":skill_profs,
        "armorProf":"","weaponProf":"","toolProf":"","otherProf":"",
        "languages":[],"spellAbility":ABILITY_MAP_REV.get(inner.get("spellsInfo",{}).get("base",{}).get("code",""),""),
        "spells":[],"usedSpellSlots":{},"weapons":weapons,"inventory":[],
        "currency":{"gp":vget(coins,"gp",0),"sp":vget(coins,"sp",0),"cp":vget(coins,"cp",0),
                    "pp":vget(coins,"pp",0),"ep":vget(coins,"ep",0)},
        "racialTraits":"","classFeatures":from_prosemirror(text.get("features",{}).get("value",{})),
        "inspiration":inner.get("inspiration",False),"conditions":[],
        "deathSaves":{"successes":[False,False,False],"failures":[False,False,False]},
        "notes":from_prosemirror(text.get("notes-1",{}).get("value",{})),"resources":[],
    }

@app.route("/favicon.ico")
def favicon():
    from flask import redirect
    return redirect("/static/img/icon.svg", code=301)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/characters", methods=["GET"])
def list_characters():
    chars = []
    for f in sorted(SAVE_DIR.glob("*.json"), key=lambda x: x.stat().st_mtime, reverse=True):
        try:
            with open(f, encoding='utf-8') as fh:
                d = json.load(fh)
            # Portrait: prefer file URL, fall back to legacy base64
            stem = f.stem
            portrait_file = SAVE_DIR / f"{stem}.jpg"
            if portrait_file.exists():
                portrait = f"/api/portrait/{stem}.jpg"
            else:
                portrait = d.get("portrait", "") or ""
                # Strip legacy base64 from list payload (still in JSON file)
                if portrait.startswith("data:image"):
                    portrait = ""  # don't send 100KB per char in list
            chars.append({"filename": f.name, "name": d.get("name","?"),
                "race": d.get("raceName", d.get("race","")), "subrace": d.get("subraceName",""),
                "class": d.get("className", d.get("class","")), "background": d.get("backgroundName",""),
                "level": d.get("level",1), "portrait": portrait})
        except: pass
    return jsonify(chars)

@app.route("/api/characters/<filename>", methods=["GET"])
def get_character(filename):
    import base64 as _b64
    path = SAVE_DIR / filename
    if not path.exists(): return jsonify({"error":"Not found"}), 404
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    stem = Path(filename).stem
    portrait_file = SAVE_DIR / f"{stem}.jpg"
    # Migrate legacy base64 portrait → .jpg file on first load
    legacy = d.get("portrait") or ""
    if isinstance(legacy, str) and legacy.startswith("data:image") and not portrait_file.exists():
        try:
            b64 = legacy.split(",", 1)[1]
            portrait_file.write_bytes(_b64.b64decode(b64))
            d.pop("portrait", None)
            # Rewrite JSON without base64
            with open(path, "w", encoding="utf-8") as fw:
                json.dump(d, fw, ensure_ascii=False, indent=2)
        except Exception:
            pass
    # Always serve URL if .jpg exists
    if portrait_file.exists():
        d["portrait"] = f"/api/portrait/{stem}.jpg"
    return jsonify(d)

@app.route("/api/portrait/<path:filename>")
def get_portrait(filename):
    path = SAVE_DIR / filename
    if not path.exists(): return jsonify({"error":"Not found"}), 404
    return send_file(path, mimetype="image/jpeg")

@app.route("/api/portrait/<path:stem>", methods=["POST"])
def save_portrait(stem):
    """Accept base64 JPEG, save as characters/<stem>.jpg, return URL."""
    import base64 as _b64
    data = request.json
    b64 = data.get("data","")
    if b64.startswith("data:image"):
        b64 = b64.split(",",1)[1]
    try:
        img_bytes = _b64.b64decode(b64)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    out_path = SAVE_DIR / f"{stem}.jpg"
    out_path.write_bytes(img_bytes)
    return jsonify({"url": f"/api/portrait/{stem}.jpg"})

@app.route("/api/debug")
def debug_info():
    return jsonify({
        "save_dir": str(SAVE_DIR),
        "save_dir_exists": SAVE_DIR.exists(),
        "save_dir_abs": str(SAVE_DIR.resolve()),
        "cwd": str(Path.cwd()),
        "files": [f.name for f in SAVE_DIR.glob("*.json")] if SAVE_DIR.exists() else [],
    })

@app.route("/api/characters", methods=["POST"])
def save_character():
    try:
        data = request.json
        if data is None:
            return jsonify({"status": "error", "message": "No JSON received"}), 400
        # Always stamp our format marker so the file is importable anywhere
        if "_system" not in data:
            data["_system"] = "DnD5e"
        # Strip base64 portrait from JSON — it lives as a separate .jpg file now
        if (data.get("portrait") or "").startswith("data:image"):
            data.pop("portrait", None)
        name = data.get("name","character").replace(" ","_").replace("/","_")[:60]
        filename = f"{name}.json"
        SAVE_DIR.mkdir(exist_ok=True)  # на случай если папка пропала
        with open(SAVE_DIR/filename,"w",encoding="utf-8") as f:
            json.dump(data,f,ensure_ascii=False,indent=2)
        return jsonify({"status":"saved","filename":filename})
    except Exception as e:
        import traceback
        return jsonify({"status": "error", "message": str(e), "trace": traceback.format_exc()}), 500


@app.route("/api/characters/<filename>", methods=["DELETE"])
def delete_character(filename):
    path = SAVE_DIR/filename
    if path.exists(): path.unlink()
    # Also remove portrait file
    portrait = SAVE_DIR / f"{Path(filename).stem}.jpg"
    if portrait.exists(): portrait.unlink()
    return jsonify({"status":"deleted"})

@app.route("/api/export/lss/<filename>")
def export_lss(filename):
    path = SAVE_DIR/filename
    if not path.exists(): return jsonify({"error":"Not found"}), 404
    with open(path,encoding='utf-8') as f:
        char = json.load(f)
    lss = char_to_lss(char)
    name = char.get("name","Character").replace(" ","_")
    buf = io.BytesIO(json.dumps(lss,ensure_ascii=False,indent=2).encode('utf-8'))
    buf.seek(0)
    return send_file(buf,as_attachment=True,download_name=f"{name}___Long_Story_Short.json",mimetype='application/json')

@app.route("/api/export/raw/<filename>")
def export_raw(filename):
    path = SAVE_DIR/filename
    if not path.exists(): return jsonify({"error":"Not found"}), 404
    return send_file(path,as_attachment=True)

@app.route("/api/import", methods=["POST"])
def import_character():
    try:
        payload = request.json
        data = payload.get("data",{})
        # LSS format: jsonType=="character" + nested data string
        if "jsonType" in data and data.get("jsonType") == "character" and "data" in data:
            char = lss_to_char(data)
            if not char: return jsonify({"error": "Не удалось прочитать LongStoryShort"}), 400
        # Our native format: has name + any structural marker
        elif "name" in data and ("_system" in data or "abilities" in data
                                   or "weapons" in data or "className" in data
                                   or "raceName" in data or "_imported_from" in data):
            char = data
            if "_system" not in char:
                char["_system"] = "DnD5e"
        else:
            return jsonify({"error": "Неизвестный формат. Ожидается наш JSON или LongStoryShort JSON."}), 400
        name = char.get("name","import").replace(" ","_").replace("/","_")[:60]
        filename = f"{name}.json"
        with open(SAVE_DIR/filename,"w",encoding='utf-8') as f:
            json.dump(char,f,ensure_ascii=False,indent=2)
        return jsonify({"status":"imported","filename":filename,"name":char.get("name","")})
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@app.route("/api/export/pdf", methods=["POST"])
def export_pdf_direct():
    """Accept character JSON in body, return filled PDF."""
    try:
        char = request.json
        if not char:
            return jsonify({"error": "No data"}), 400

        # Build spell levels map from embedded spells data file
        spell_levels = {}
        for spells_js_path in [BASE_DIR / "static/data/spells.js", BASE_DIR / "static/js/spells.js"]:
            if spells_js_path.exists():
                import re
                raw = spells_js_path.read_text(encoding='utf-8')
                for match in re.finditer(
                    r"\{level\s*:\s*(\d+)[^}]*?name\s*:\s*['\"]([^'\"]+)['\"]", raw
                ):
                    spell_levels[match.group(2)] = int(match.group(1))
                if spell_levels:
                    break
        char["_spellLevels"] = spell_levels

        template_path = str(_resource_path("static/sheet_template.pdf"))
        pdf_bytes = fill_character_sheet(char, template_path)

        name = (char.get("name") or "Character").replace(" ", "_")
        buf = io.BytesIO(pdf_bytes)
        buf.seek(0)
        return send_file(
            buf,
            as_attachment=True,
            download_name=f"{name}_DnD5e.pdf",
            mimetype="application/pdf"
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/export/pdf/<filename>")
def export_pdf(filename):
    path = SAVE_DIR / filename
    if not path.exists():
        return jsonify({"error": "Not found"}), 404
    with open(path, encoding='utf-8') as f:
        char = json.load(f)

    # Attach spell levels from SPELLS data for PDF filling
    spell_levels = {}
    for spells_js_path in [BASE_DIR / "static/data/spells.js", BASE_DIR / "static/js/spells.js"]:
        if spells_js_path.exists():
            import re
            raw = spells_js_path.read_text(encoding='utf-8')
            # Each spell is on one line: {level:N, name:'...', ...}
            for match in re.finditer(r"\{level\s*:\s*(\d+)[^}]*?name\s*:\s*['\"]([^'\"]+)['\"]", raw):
                spell_levels[match.group(2)] = int(match.group(1))
            if spell_levels:
                break
    char["_spellLevels"] = spell_levels

    template_path = str(_resource_path("static/sheet_template.pdf"))
    try:
        pdf_bytes = fill_character_sheet(char, template_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    name = char.get("name", "Character").replace(" ", "_")
    buf = io.BytesIO(pdf_bytes)
    buf.seek(0)
    return send_file(
        buf,
        as_attachment=True,
        download_name=f"{name}_DnD5e.pdf",
        mimetype="application/pdf"
    )


if __name__ == "__main__":
    import threading
    import argparse

    PORT = 5000
    is_frozen = getattr(sys, "frozen", False)

    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--browser", action="store_true", help="Open in browser instead of app window")
    args, _ = parser.parse_known_args()
    use_browser = args.browser

    def _start_flask():
        app.run(host="127.0.0.1", port=PORT, debug=False, use_reloader=False, threaded=True)

    def _open_browser():
        import time as _t; _t.sleep(1.2)
        import webbrowser
        webbrowser.open(f"http://localhost:{PORT}")

    if use_browser:
        # Явно запрошен браузер
        threading.Thread(target=_open_browser, daemon=True).start()
        print(f"Izzy Wizzy: http://localhost:{PORT}")
        app.run(host="127.0.0.1", port=PORT,
                debug=not is_frozen, use_reloader=not is_frozen)
    else:
        # Пробуем открыть в своём окне через pywebview
        try:
            import webview  # ImportError если не установлен

            flask_thread = threading.Thread(target=_start_flask, daemon=True)
            flask_thread.start()
            import time as _t; _t.sleep(0.8)

            webview.create_window(
                "Izzy Wizzy",
                f"http://localhost:{PORT}",
                width=1280,
                height=820,
                min_size=(900, 600),
                resizable=True,
            )
            webview.start()
            sys.exit(0)

        except Exception:
            # pywebview не установлен ИЛИ WebView2 Runtime отсутствует —
            # Flask может уже быть запущен в треде, просто открываем браузер
            running = any(t.name == "flask" for t in threading.enumerate())
            if not running:
                t = threading.Thread(target=_start_flask, daemon=True, name="flask")
                t.start()
            threading.Thread(target=_open_browser, daemon=True).start()
            print(f"Izzy Wizzy: http://localhost:{PORT}")
            # Держим процесс живым — Flask работает в daemon-треде
            import time as _t
            try:
                while True:
                    _t.sleep(1)
            except KeyboardInterrupt:
                pass
