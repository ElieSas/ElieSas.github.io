/**
 * article-lang.js — sélecteur de langue partagé pour tous les articles techniques
 * Traduit : nav, meta-tags, légendes, footer.
 * Le corps technique (paragraphes, code) reste en français — standard en embarqué.
 */

const ARTICLE_I18N = {
  fr: {
    'nav.back':        '← Retour aux ressources',
    'nav.resources':   'ES · Ressources',
    'meta.article':    'Article',
    'meta.guide':      'Guide',
    'meta.code':       'Code',
    'meta.ref':        'Référence',
    'meta.read':       'min de lecture',
    'footer.credit':   'Elie SASPORTES · 2026',
  },
  en: {
    'nav.back':        '← Back to resources',
    'nav.resources':   'ES · Resources',
    'meta.article':    'Article',
    'meta.guide':      'Guide',
    'meta.code':       'Code',
    'meta.ref':        'Reference',
    'meta.read':       'min read',
    'footer.credit':   'Elie SASPORTES · 2026',
  },
  he: {
    'nav.back':        '← חזרה למשאבים',
    'nav.resources':   'ES · משאבים',
    'meta.article':    'מאמר',
    'meta.guide':      'מדריך',
    'meta.code':       'קוד',
    'meta.ref':        'עזר',
    'meta.read':       'דקות קריאה',
    'footer.credit':   'אלי ספורטס · 2026',
  }
};

// Inject the language switcher UI into the nav
function injectLangSwitcher() {
  const nav = document.querySelector('nav');
  if (!nav || document.querySelector('.art-lang-switcher')) return;

  const sw = document.createElement('div');
  sw.className = 'art-lang-switcher';
  sw.innerHTML = `
    <button class="art-lang-btn active" data-lang="fr">FR</button>
    <button class="art-lang-btn" data-lang="en">EN</button>
    <button class="art-lang-btn" data-lang="he">עב</button>
  `;
  nav.appendChild(sw);

  sw.querySelectorAll('.art-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setArticleLang(lang);
      sw.querySelectorAll('.art-lang-btn').forEach(b => b.classList.toggle('active', b === btn));
      localStorage.setItem('es-lang', lang);
    });
  });
}

function setArticleLang(lang) {
  const t = ARTICLE_I18N[lang] || ARTICLE_I18N.fr;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');

  // Nav
  const navBack = document.querySelector('.nav-back');
  const navLogo = document.querySelector('.nav-logo');
  if (navBack) navBack.textContent = t['nav.back'];
  if (navLogo) navLogo.textContent = t['nav.resources'];

  // Footer nav links (prev/next)
  document.querySelectorAll('.pf-nav a').forEach(a => {
    const txt = a.textContent;
    if (lang === 'he') {
      if (txt.startsWith('←')) a.textContent = txt.replace('←', '→').replace(' →', ' ←');
    }
  });

  // data-i18n elements inside articles
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  // Footer credit
  document.querySelectorAll('.pf-left').forEach(el => {
    el.textContent = t['footer.credit'];
  });
}

// Boot: restore saved language preference
document.addEventListener('DOMContentLoaded', () => {
  injectLangSwitcher();
  const saved = localStorage.getItem('es-lang') || 'fr';
  setArticleLang(saved);
  // Mark the right button active
  document.querySelectorAll('.art-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === saved);
  });
});
