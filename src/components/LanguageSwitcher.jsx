import { useLang } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
      <button
        onClick={() => setLang('he')}
        className={`px-2 py-1 rounded-md text-sm font-semibold transition-all
          ${lang === 'he' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        עב
      </button>
      <button
        onClick={() => setLang('ar')}
        className={`px-2 py-1 rounded-md text-sm font-semibold transition-all
          ${lang === 'ar' ? 'bg-card shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        ع
      </button>
    </div>
  );
}