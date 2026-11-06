"""Dependency-free coverage and deployment checks for every static page."""
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / 'assets/locales.js').read_text()
TRANSLATIONS = json.loads(SOURCE[SOURCE.index('{'):].rstrip().removesuffix(';'))
BRANDS = {'D.FRisk', 'D.FCP', 'RegLens', 'RegWiki', 'RegInsights', 'AIGovCube', 'D.QRM'}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.words = []
        self.assets = []
        self.local_links = []
        self.scripts = []
        self.switch_languages = []
        self.skip = 0
        self.feed(path.read_text())

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'script' and 'src' in attrs:
            self.scripts.append(attrs['src'])
        if tag == 'button' and 'data-language' in attrs:
            self.switch_languages.append(attrs['data-language'])
        for key in ('alt', 'title', 'aria-label'):
            if key in attrs:
                self.words.append(attrs[key])
        if tag == 'meta' and attrs.get('name') == 'description':
            self.words.append(attrs['content'])
        for key in ('src', 'data-src-cn', 'data-src-en'):
            if key in attrs and not attrs[key].startswith('data:'):
                self.assets.append(attrs[key])
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.assets.append(attrs['href'])
        if tag == 'a' and attrs.get('href', '').endswith('.html'):
            self.local_links.append(attrs['href'])
        if tag == 'img' and 'data-src-cn' in attrs:
            assert attrs['data-src-cn'] != attrs['data-src-en'], 'Language image variants must differ'

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip -= 1

    def handle_data(self, text):
        if not self.skip and text.strip():
            self.words.append(text.strip())


class LocalizationTests(unittest.TestCase):
    def test_all_nine_pages_have_complete_translations_and_assets(self):
        pages = list(ROOT.glob('*.html'))
        self.assertEqual(len(pages), 9)
        control_labels = {'EN', 'CN', '网站语言', 'Switch to English', '切换到中文'}
        for path in pages:
            with self.subTest(page=path.name):
                page = Page(path)
                self.assertEqual(page.switch_languages, ['en', 'cn'])
                self.assertEqual(page.scripts, ['assets/locales.js', 'assets/i18n.js', 'assets/trial-dialog.js'])
                missing = [word for word in page.words
                           if re.search(r'[A-Za-z\u4e00-\u9fff]', word)
                           and word not in control_labels and word not in TRANSLATIONS]
                self.assertEqual(missing, [])
                for asset in page.assets + page.local_links:
                    self.assertTrue((ROOT / asset).is_file(), asset)

    def test_translations_are_complete_and_english_has_no_chinese(self):
        for key, variants in TRANSLATIONS.items():
            with self.subTest(key=key[:40]):
                self.assertTrue(variants['cn'].strip())
                self.assertTrue(variants['en'].strip())
                self.assertIsNone(re.search(r'[\u4e00-\u9fff]', variants['en']))
                if key in BRANDS:
                    self.assertEqual(variants['cn'], key)
                    self.assertEqual(variants['en'], key)
        self.assertIn('▶ 播放动画', TRANSLATIONS)
        self.assertIn('Ⅱ 暂停动画', TRANSLATIONS)

    def test_image_pairs_and_container_assets(self):
        image_pairs = json.loads((ROOT / 'assets/image-localization.json').read_text())
        self.assertEqual(len(image_pairs), 2)
        for variants in image_pairs.values():
            for language in ('cn', 'en'):
                self.assertTrue((ROOT / variants[language]).is_file())
            self.assertNotEqual((ROOT / variants['cn']).read_bytes(), (ROOT / variants['en']).read_bytes())
        self.assertIn('COPY assets/ /usr/share/nginx/html/assets/', (ROOT / 'Dockerfile').read_text())

    def test_overview_alias_stays_in_sync(self):
        self.assertEqual((ROOT / 'index.html').read_bytes(),
                         (ROOT / 'financial_solutions_first_concept.html').read_bytes())

    def test_trial_entries_use_local_dialog_instead_of_live_product_urls(self):
        for path in ROOT.glob('*.html'):
            with self.subTest(page=path.name):
                text = path.read_text()
                self.assertEqual(text.count('data-trial-dialog'), 1)
                self.assertIn('data-trial aria-haspopup="dialog"', text)
                self.assertIn('src="assets/trial-qr-reference.png"', text)
                self.assertNotRegex(text, r'<a\b[^>]*href="https?://[^>]*>\s*进入产品体验')
                if path.name in ('index.html', 'financial_solutions_first_concept.html'):
                    self.assertEqual(text.count('data-trial aria-haspopup="dialog"'), 7)


if __name__ == '__main__':
    unittest.main(verbosity=2)
