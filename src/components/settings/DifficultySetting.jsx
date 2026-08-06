import { useState } from 'react';
import { Gauge } from 'lucide-react';
import { DIFFICULTY_PREFS, getDifficultyPref, setDifficultyPref } from '@/lib/difficultyPref';

export default function DifficultySetting({ lang }) {
  const [pref, setPref] = useState(() => getDifficultyPref());

  const handleSelect = (key) => {
    setPref(key);
    setDifficultyPref(key);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Gauge className="w-5 h-5" />
        {lang === 'ar' ? 'مستوى الصعوبة' : 'רמת קושי'}
      </div>
      <p className="text-sm text-muted-foreground">
        {lang === 'ar'
          ? 'تلقائي: يتكيف المستوى مع أدائك. أو اختر مستوى ثابتًا يناسبك.'
          : 'אוטומטי: הרמה מתאימה את עצמה לביצועים שלכם. או בחרו רמה קבועה שנוחה לכם.'}
      </p>
      <div className="flex gap-3 flex-wrap">
        {DIFFICULTY_PREFS.map(({ key, he, ar }) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm min-h-[44px]
              ${pref === key
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-foreground hover:border-primary/50'}`}
          >
            {lang === 'ar' ? ar : he}
          </button>
        ))}
      </div>
    </div>
  );
}