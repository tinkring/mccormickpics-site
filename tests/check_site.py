"""Run with python3 tests/check_site.py; no third-party packages required."""

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_DATES = [
    "2026-09-11", "2026-07-06", "2026-07-02", "2026-07-01",
    "2026-06-26", "2026-06-25", "2026-06-24", "2026-06-10",
    "2026-06-08", "2026-06-07", "2026-06-04",
]
UPLOAD_ADDRESS = "upload@mccormickpics.com"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.source = path.read_text(encoding="utf-8")
        self.ids, self.links, self.dates, self.stack = [], [], [], []
        self.update_open_states = []
        self.heading_count = 0
        self.feed(self.source)
        self.close()
        assert not self.stack, f"{path.name}: unclosed tags: {self.stack}"

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get("class", "").split()
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for attribute in ("href", "src"):
            if attribute in attrs:
                self.links.append(attrs[attribute])
        if tag == "h1":
            self.heading_count += 1
        if tag == "img":
            assert "alt" in attrs, f"{self.path.name}: image missing alt text"
        if tag == "details" and "update" in classes:
            assert self.stack and self.stack[-1][0] == "div" and (
                "updates-list" in self.stack[-1][1]
            ), "Every update must be directly visible in the main update list"
            self.update_open_states.append("open" in attrs)
        if tag == "time":
            self.dates.append(attrs["datetime"])
        if tag not in VOID:
            self.stack.append((tag, classes))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1][0] == tag, (
            f"{self.path.name}: mismatched closing tag {tag}"
        )
        self.stack.pop()


def main():
    pages = {name: Page(ROOT / name) for name in
             ("index.html", "behind-the-slideshow.html")}
    for name, page in pages.items():
        assert page.heading_count == 1, f"{name}: expected one main heading"
        duplicates = [key for key, count in Counter(page.ids).items() if count > 1]
        assert not duplicates, f"{name}: duplicate IDs: {duplicates}"
        addresses = set(re.findall(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", page.source))
        assert addresses == {UPLOAD_ADDRESS}, f"{name}: review email addresses"
        assert not re.search(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", page.source), (
            f"{name}: review machine-specific IP address"
        )
        for link in page.links:
            url = urlsplit(link)
            if url.scheme == "mailto":
                assert url.path == UPLOAD_ADDRESS, f"{name}: unexpected recipient"
                continue
            if url.scheme or url.netloc:
                continue
            path = unquote(url.path) or name
            target = ROOT / path
            assert target.is_file(), f"{name}: broken local link {link}"
            if url.fragment:
                assert path in pages, f"{name}: unknown fragment page {link}"
                assert unquote(url.fragment) in pages[path].ids, (
                    f"{name}: missing anchor {link}"
                )
        assert "Back to photo sharing" in page.source
        assert "You'll get an email reply when they arrive" not in page.source
        assert "whole collection evenly before coming back around" not in page.source
        print(f"PASS {name}: markup, IDs, image labels, local links, contact checks")

    home = pages["index.html"]
    assert home.dates == EXPECTED_DATES, "Historical update dates changed or moved"
    assert home.update_open_states == [True] + [False] * (len(EXPECTED_DATES) - 1), (
        "Show all updates with only the newest entry expanded by default"
    )
    tech = pages["behind-the-slideshow.html"]
    assert tech.source.count('class="challenge"') == 6, "Keep all six design challenges"
    print("PASS history: all 11 dates listed; only newest expanded; 6 challenges retained")


if __name__ == "__main__":
    main()
