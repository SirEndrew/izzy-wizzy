#!/usr/bin/env python3
"""
fetch_spell_descriptions.py
───────────────────────────
Читает static/data/spells.js, скачивает описание каждого заклинания
со страниц 5e14.dnd.su и добавляет поле description:'...' в каждую запись.

Использование:
    python fetch_spell_descriptions.py [--spells PATH] [--out PATH] [--workers N]

По умолчанию:
    --spells  static/data/spells.js   (относительно CWD)
    --out     static/data/spells.js   (перезаписывает исходный файл)
    --workers 8

Требует:
    pip install requests beautifulsoup4 lxml
"""

import re, time, argparse, logging
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.5",
}
TIMEOUT     = 15
RETRY       = 3
RETRY_DELAY = 2


def parse_description(html):
    """
    Извлекает описание заклинания из HTML страницы 5e14.dnd.su.

    Контейнер описания:
        <li class="subsection desc">
          <div itemprop="description">
            <p>Текст...</p>  ...
          </div>
        </li>
    Бонус «На больших уровнях»:
        <li class="subsection higher-levels">...</li>
    """
    soup = BeautifulSoup(html, "lxml")

    desc_div = soup.find("div", itemprop="description")
    if not desc_div:
        li = soup.find("li", class_="subsection desc")
        desc_div = li

    if not desc_div:
        return ""

    # Упрощаем <span class="dice"><span>2к8</span><span/></span> → «2к8»
    for span in desc_div.find_all("span", class_="dice"):
        inner = span.find("span")
        span.replace_with(inner.get_text(strip=True) if inner else "")

    paragraphs = []
    for p in desc_div.find_all("p"):
        text = p.get_text(" ", strip=True)
        if text:
            paragraphs.append(text)

    if not paragraphs:
        raw = desc_div.get_text(" ", strip=True)
        if raw:
            paragraphs.append(raw)

    description = "\n\n".join(paragraphs)

    higher_li = soup.find("li", class_=lambda c: c and "higher-levels" in c.split())
    if higher_li:
        higher_text = higher_li.get_text(" ", strip=True)
        if higher_text:
            description += "\n\n" + higher_text

    return description.strip()


def fetch_description(url, session):
    for attempt in range(1, RETRY + 1):
        try:
            r = session.get(url, headers=HEADERS, timeout=TIMEOUT)
            r.raise_for_status()
            return parse_description(r.text)
        except Exception as exc:
            log.warning("попытка %d/%d, ошибка для %s: %s", attempt, RETRY, url, exc)
            if attempt < RETRY:
                time.sleep(RETRY_DELAY * attempt)
    log.error("ОШИБКА после %d попыток: %s", RETRY, url)
    return ""


def load_js_parts(path):
    """Разделяет файл на prefix + body_array + suffix."""
    text = path.read_text(encoding="utf-8")
    m = re.search(r"(window\.SPELLS\s*=\s*\[)(.*?)(\];)", text, re.DOTALL)
    if not m:
        raise ValueError("window.SPELLS = [...]; не найден в файле")
    prefix = text[: m.start(1)] + m.group(1)
    body   = m.group(2)
    suffix = m.group(3) + text[m.end(3):]
    return prefix, body, suffix


def extract_top_level_objects(body):
    """
    Разбирает тело массива на части (строки и объекты-дикты).
    Корректно обрабатывает вложенные {} — например subclasses:[{...}].
    """
    parts     = []
    spells    = []
    depth     = 0
    obj_start = None
    gap_start = 0

    for i, ch in enumerate(body):
        if ch == '{':
            if depth == 0:
                gap = body[gap_start:i]
                if gap:
                    parts.append(gap)
                obj_start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and obj_start is not None:
                raw   = body[obj_start: i + 1]
                url_m = re.search(r"url:'(https://[^']+)'", raw)
                url   = url_m.group(1) if url_m else ""
                spell = {
                    "raw":         raw,
                    "url":         url,
                    "has_desc":    "description:" in raw,
                    "description": "",
                }
                spells.append(spell)
                parts.append(spell)
                gap_start = i + 1
                obj_start = None

    tail = body[gap_start:]
    if tail:
        parts.append(tail)

    return spells, parts


def rebuild_body(parts):
    out = []
    for item in parts:
        if isinstance(item, str):
            out.append(item)
        else:
            s = item
            if s["has_desc"]:
                out.append(s["raw"])
            else:
                esc = s["description"].replace("\\", "\\\\").replace("'", "\\'")
                out.append(s["raw"][:-1] + f", description:'{esc}'")
                out.append("}")
    return "".join(out)


def main():
    ap = argparse.ArgumentParser(
        description="Добавляет поле description к каждому заклинанию в spells.js"
    )
    ap.add_argument("--spells",  default="static/data/spells.js",
                    help="Путь к spells.js")
    ap.add_argument("--out",     default=None,
                    help="Куда сохранить (по умолчанию — перезаписать --spells)")
    ap.add_argument("--workers", type=int, default=8,
                    help="Число параллельных запросов")
    ap.add_argument("--delay",   type=float, default=0.05,
                    help="Задержка между запросами (сек)")
    args = ap.parse_args()

    spells_path = Path(args.spells)
    out_path    = Path(args.out) if args.out else spells_path

    if not spells_path.exists():
        log.error("Файл не найден: %s", spells_path)
        return

    log.info("Читаем %s …", spells_path)
    prefix, body, suffix = load_js_parts(spells_path)
    spells, parts = extract_top_level_objects(body)

    to_fetch = [s for s in spells if not s["has_desc"] and s["url"]]
    already  = sum(1 for s in spells if s["has_desc"])
    no_url   = sum(1 for s in spells if not s["url"])

    log.info(
        "Всего: %d  |  уже есть description: %d  |  нет url: %d  |  скачиваем: %d",
        len(spells), already, no_url, len(to_fetch),
    )

    if not to_fetch:
        log.info("Всё уже заполнено — ничего делать не нужно.")
        return

    session = requests.Session()
    done = errors = 0

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        future_to_spell = {
            pool.submit(fetch_description, s["url"], session): s
            for s in to_fetch
        }
        for future in as_completed(future_to_spell):
            s = future_to_spell[future]
            try:
                desc = future.result()
            except Exception as exc:
                desc = ""
                log.error("Исключение для %s: %s", s["url"], exc)

            s["description"] = desc
            done += 1

            name_m = re.search(r"name:'([^']+)'", s["raw"])
            name   = name_m.group(1) if name_m else s["url"].rstrip("/").split("/")[-1]

            if desc:
                log.info("[%d/%d] ✓  %-32s %d симв.", done, len(to_fetch), name[:32], len(desc))
            else:
                errors += 1
                log.warning("[%d/%d] ✗  ПУСТОЕ  %s", done, len(to_fetch), name[:32])

            if args.delay > 0:
                time.sleep(args.delay)

    new_prefix = prefix.replace(
        "//        duration, classes, source, url  [+ concentration, ritual]",
        "//        duration, classes, source, url, description  [+ concentration, ritual]",
    )
    new_body = rebuild_body(parts)
    result   = new_prefix + new_body + suffix

    out_path.write_text(result, encoding="utf-8")
    file_kb = len(result.encode("utf-8")) // 1024

    filled = sum(1 for s in spells if s.get("description"))
    empty  = sum(1 for s in spells if not s.get("description") and not s["has_desc"])

    log.info("─" * 60)
    log.info("Сохранено → %s  (%d КБ)", out_path, file_kb)
    log.info("Заполнено: %d  |  пустых: %d  |  было ранее: %d  |  ошибок: %d",
             filled, empty, already, errors)


if __name__ == "__main__":
    main()
