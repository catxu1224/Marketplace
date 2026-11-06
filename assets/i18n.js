(() => {
  'use strict';

  const translations = window.MARKETPLACE_TRANSLATIONS;
  if (!translations) return;

  const storageKey = 'marketplace.language';
  const validLanguage = value => value === 'en' || value === 'cn';
  const pageURL = new URL(window.location.href);
  let savedLanguage;
  try { savedLanguage = window.localStorage.getItem(storageKey); } catch (_) { /* Storage may be disabled. */ }
  let language = validLanguage(pageURL.searchParams.get('lang'))
    ? pageURL.searchParams.get('lang')
    : validLanguage(savedLanguage) ? savedLanguage : 'cn';

  // Keep original text nodes, including whitespace and nested markup, for lossless switching.
  const textRecords = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style, .language-switch, .play-toggle')) continue;
    const key = node.nodeValue.trim();
    if (Object.prototype.hasOwnProperty.call(translations, key)) {
      textRecords.push({ node, key, original: node.nodeValue });
    }
  }

  const attributeRecords = [];
  document.querySelectorAll('[aria-label], [alt], [title], meta[name="description"]').forEach(element => {
    if (element.closest('.language-switch')) return;
    ['aria-label', 'alt', 'title', 'content'].forEach(attribute => {
      if (attribute === 'content' && !element.matches('meta[name="description"]')) return;
      const key = element.getAttribute(attribute);
      if (key && Object.prototype.hasOwnProperty.call(translations, key.trim())) {
        attributeRecords.push({ element, attribute, key: key.trim() });
      }
    });
  });

  const translate = key => translations[key]?.[language] || key;
  const animationButtons = document.querySelectorAll('.play-toggle');
  const languageSwitches = document.querySelectorAll('.language-switch');

  function refreshAnimationButton(button) {
    const stage = document.getElementById(button.dataset.target);
    if (!stage) return;
    const paused = stage.classList.contains('paused');
    button.textContent = translate(paused ? '▶ 播放动画' : 'Ⅱ 暂停动画');
    button.setAttribute('aria-pressed', String(!paused));
    button.setAttribute('aria-controls', stage.id);
  }

  function updateLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const destination = new URL(href, window.location.href);
      if (destination.origin !== pageURL.origin || !destination.pathname.endsWith('.html')) return;
      destination.searchParams.set('lang', language);
      // Relative links continue to work when the website is hosted under a subdirectory or opened from disk.
      link.setAttribute('href', destination.pathname.split('/').pop() + destination.search + destination.hash);
    });
  }

  function applyLanguage(nextLanguage, updateURL = true) {
    if (!validLanguage(nextLanguage)) return;
    language = nextLanguage;
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.documentElement.dataset.language = language;

    textRecords.forEach(({ node, key, original }) => {
      node.nodeValue = original.replace(key, () => translate(key));
    });
    attributeRecords.forEach(({ element, attribute, key }) => {
      element.setAttribute(attribute, translate(key));
    });
    document.querySelectorAll('.df-sheet').forEach(sheet => {
      sheet.dataset.evidenceLabel = language === 'en' ? 'EVIDENCE' : '分析依据';
    });
    document.querySelectorAll('img[data-src-cn][data-src-en]').forEach(img => {
      const source = language === 'en' ? img.dataset.srcEn : img.dataset.srcCn;
      if (img.getAttribute('src') !== source) img.setAttribute('src', source);
    });
    animationButtons.forEach(refreshAnimationButton);
    languageSwitches.forEach(group => {
      group.setAttribute('aria-label', language === 'en' ? 'Website language' : '网站语言');
      group.querySelectorAll('button[data-language]').forEach(button => {
        const selected = button.dataset.language === language;
        button.setAttribute('aria-pressed', String(selected));
        button.setAttribute('aria-label', button.dataset.language === 'en' ? 'Switch to English' : '切换到中文');
      });
    });
    updateLinks();
    try { window.localStorage.setItem(storageKey, language); } catch (_) { /* URL also carries the preference. */ }
    if (updateURL) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      try { window.history.replaceState(null, '', url.href); } catch (_) { /* file:// may restrict history. */ }
    }
  }

  languageSwitches.forEach(group => group.addEventListener('click', event => {
    const button = event.target.closest('button[data-language]');
    if (button && group.contains(button)) applyLanguage(button.dataset.language);
  }));
  // Existing animation handlers own playback; this listener only updates the translated label.
  animationButtons.forEach(button => button.addEventListener('click', () => refreshAnimationButton(button)));
  window.addEventListener('popstate', () => {
    const requested = new URL(window.location.href).searchParams.get('lang');
    if (validLanguage(requested)) applyLanguage(requested, false);
  });
  applyLanguage(language, false);
})();
