/**
 * Synchronously reads and applies all Rebrain user settings from localStorage
 * BEFORE React mounts to prevent flash of incorrect theme, font size, or direction.
 */
export function initRebrainSettings() {
  try {
    // 1. Language & Direction
    const lang = localStorage.getItem('rebrain_lang') || 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';

    // 2. Theme (Light / Dark / System)
    const theme = localStorage.getItem('rebrain_theme') || 'system';
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 3. Font Size (small / medium / large / xlarge)
    const fontSize = localStorage.getItem('rebrain_fontsize') || 'large';
    const fontSizeClasses = ['font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge'];
    document.documentElement.classList.remove(...fontSizeClasses);
    document.documentElement.classList.add(`font-size-${fontSize}`);
    document.documentElement.setAttribute('data-fontsize', fontSize);

    // 4. Sound Preference Check
    const sound = localStorage.getItem('rebrain_sound');
    if (sound === null) {
      localStorage.setItem('rebrain_sound', 'true');
    }
  } catch (e) {
    console.warn('Failed to initialize Rebrain settings from localStorage:', e);
  }
}

// Execute immediately at script evaluation time
initRebrainSettings();