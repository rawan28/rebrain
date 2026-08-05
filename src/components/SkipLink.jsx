import { useLang } from '@/lib/LanguageContext';

export default function SkipLink() {
  const { lang } = useLang();
  const label = lang === 'ar' ? 'تخطّي إلى المحتوى' : 'דלגו לתוכן';
  return (
    <a href="#main-content" className="skip-link">
      {label}
    </a>
  );
}