import { useLang } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
      <button
        onClick={() => setLang('he')}
        className={`px-3 py-1.5 rounded-lg text-base font-semibold transition-all
          ${lang === 'he' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        עב
      </button>
      <button
        onClick={() => setLang('ar')}
        className={`px-3 py-1.5 rounded-lg text-base font-semibold transition-all
          ${lang === 'ar' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        عر
      </button>
    </div>
  );
}