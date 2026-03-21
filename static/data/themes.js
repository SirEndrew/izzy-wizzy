// ══════════════════════════════════════════════════════════
// THEMES — визуальные темы приложения
// ══════════════════════════════════════════════════════════

window.THEMES = {
  parchment: {
    name: '📜 Пергамент (D&D)', id: 'parchment',
    vars: {
      '--bg': '#090604',
      '--parchment': '#f4e4c1',
      '--parchment-dark': '#e6d0a0',
      '--parchment-deep': '#d4b87a',
      '--ink': '#1c0e00',
      '--ink-mid': '#3d2310',
      '--ink-light': '#7a5535',
      '--blood': '#7a0000',
      '--blood-mid': '#a00000',
      '--gold': '#c9a227',
      '--gold-light': '#f0c84a',
      '--gold-dim': '#8a6b1a',
      '--border': '#6b4420',
      '--card-bg': 'rgba(244,228,193,0.92)',
      '--input-bg': 'rgba(255,255,255,0.55)',
      '--text-primary': '#1c0e00',
      '--accent': '#7a0000',
      '--accent2': '#c9a227',
      '--font-heading': "'Cinzel', serif",
      '--font-body': "'Crimson Text', serif",
      '--radius': '0px',
      '--shadow': '0 6px 40px rgba(0,0,0,0.6)',
    }
  },
  lss: {
    name: '⚡ LongStoryShort', id: 'lss',
    vars: {
      '--bg': '#0d1117',
      '--parchment': '#161b22',
      '--parchment-dark': '#1c2128',
      '--parchment-deep': '#21262d',
      '--ink': '#e6edf3',
      '--ink-mid': '#b1bac4',
      '--ink-light': '#8b949e',
      '--blood': '#58a6ff',
      '--blood-mid': '#79c0ff',
      '--gold': '#ffa657',
      '--gold-light': '#ffbd6f',
      '--gold-dim': '#d29922',
      '--border': '#30363d',
      '--card-bg': '#161b22',
      '--input-bg': '#0d1117',
      '--text-primary': '#e6edf3',
      '--accent': '#58a6ff',
      '--accent2': '#ffa657',
      '--font-heading': "'JetBrains Mono', 'Courier New', monospace",
      '--font-body': "'Inter', 'Segoe UI', sans-serif",
      '--radius': '6px',
      '--shadow': '0 0 0 1px #30363d, 0 8px 32px rgba(0,0,0,0.4)',
    }
  },
  dndbeyond: {
    name: '🐉 D&D Beyond', id: 'dndbeyond',
    vars: {
      '--bg': '#f5f5f0',
      '--parchment': '#ffffff',
      '--parchment-dark': '#f0f0eb',
      '--parchment-deep': '#e8e8e0',
      '--ink': '#211f1e',
      '--ink-mid': '#4a4845',
      '--ink-light': '#767472',
      '--blood': '#c53131',
      '--blood-mid': '#e03232',
      '--gold': '#b89a58',
      '--gold-light': '#d4b578',
      '--gold-dim': '#8a7040',
      '--border': '#c7c6c1',
      '--card-bg': '#ffffff',
      '--input-bg': '#fafaf7',
      '--text-primary': '#211f1e',
      '--accent': '#c53131',
      '--accent2': '#b89a58',
      '--font-heading': "'Scala Sans', 'Trebuchet MS', sans-serif",
      '--font-body': "'Scala Sans', 'Trebuchet MS', sans-serif",
      '--radius': '4px',
      '--shadow': '0 2px 8px rgba(0,0,0,0.12)',
    }
  },
  dark: {
    name: '🌑 Тёмная', id: 'dark',
    vars: {
      '--bg': '#0a0a0f',
      '--parchment': '#111118',
      '--parchment-dark': '#16161e',
      '--parchment-deep': '#1e1e28',
      '--ink': '#cdd6f4',
      '--ink-mid': '#a6adc8',
      '--ink-light': '#7f849c',
      '--blood': '#cba6f7',
      '--blood-mid': '#d5acf9',
      '--gold': '#f9e2af',
      '--gold-light': '#fab387',
      '--gold-dim': '#e5c890',
      '--border': '#313244',
      '--card-bg': '#1e1e2e',
      '--input-bg': '#181825',
      '--text-primary': '#cdd6f4',
      '--accent': '#cba6f7',
      '--accent2': '#f9e2af',
      '--font-heading': "'Inter', system-ui, sans-serif",
      '--font-body': "'Inter', system-ui, sans-serif",
      '--radius': '8px',
      '--shadow': '0 4px 24px rgba(0,0,0,0.5)',
    }
  },
  light: {
    name: '☀️ Светлая', id: 'light',
    vars: {
      '--bg': '#f0f4f8',
      '--parchment': '#ffffff',
      '--parchment-dark': '#f7fafc',
      '--parchment-deep': '#edf2f7',
      '--ink': '#1a202c',
      '--ink-mid': '#4a5568',
      '--ink-light': '#718096',
      '--blood': '#3182ce',
      '--blood-mid': '#4299e1',
      '--gold': '#d69e2e',
      '--gold-light': '#ecc94b',
      '--gold-dim': '#b7791f',
      '--border': '#e2e8f0',
      '--card-bg': '#ffffff',
      '--input-bg': '#f7fafc',
      '--text-primary': '#1a202c',
      '--accent': '#3182ce',
      '--accent2': '#d69e2e',
      '--font-heading': "'Inter', system-ui, sans-serif",
      '--font-body': "'Inter', system-ui, sans-serif",
      '--radius': '8px',
      '--shadow': '0 1px 3px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05)',
    }
  },
  dndsu: {
    name: '🎲 dnd.su', id: 'dndsu',
    vars: {
      '--bg': '#1a1a2e',
      '--parchment': '#16213e',
      '--parchment-dark': '#0f3460',
      '--parchment-deep': '#0a2540',
      '--ink': '#e0e0e0',
      '--ink-mid': '#b0b0b0',
      '--ink-light': '#808080',
      '--blood': '#e94560',
      '--blood-mid': '#ff6b81',
      '--gold': '#f5a623',
      '--gold-light': '#ffc555',
      '--gold-dim': '#c8841c',
      '--border': '#0f3460',
      '--card-bg': '#16213e',
      '--input-bg': '#0f3460',
      '--text-primary': '#e0e0e0',
      '--accent': '#e94560',
      '--accent2': '#f5a623',
      '--font-heading': "'Oswald', 'Arial Narrow', sans-serif",
      '--font-body': "'Roboto', 'Arial', sans-serif",
      '--radius': '4px',
      '--shadow': '0 4px 20px rgba(0,0,0,0.4)',
    }
  },
};

window.applyTheme = function(themeId) {
  const theme = window.THEMES[themeId];
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('dnd-theme', themeId);
  // Update font families in head
  const hf = theme.vars['--font-heading'];
  const bf = theme.vars['--font-body'];
  let styleEl = document.getElementById('theme-fonts');
  if (!styleEl) { styleEl = document.createElement('style'); styleEl.id='theme-fonts'; document.head.appendChild(styleEl); }
  styleEl.textContent = `
    .font-heading, h1, h2, h3, .section-title, .nav-btn, .stat-label, .stat-val,
    label, .inner-tab, .cli-name, .step-indicator, .ability-pb-name, .char-name-display,
    .ability-pb-total, .ability-pb-base, .aname, .ascore, .amod, .skill-mod, .proficiency-badge,
    .slot-level, .cli-level, .spell-dc-item b, .cond-pill, .src-chip, .site-header h1 { font-family: ${hf} !important; }
    body, input, select, textarea, .cli-meta, .char-meta-line, .note-text, .info-box,
    .opt-name, .opt-desc, .skill-row, .inv-row, .feature-text { font-family: ${bf} !important; }
  `;
};

window.getSavedTheme = () => localStorage.getItem('dnd-theme') || 'parchment';
