import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

export default function CustomWordsManager({ customWords, onAdd, onRemove, onClose }) {
  const { lang } = useLang();
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');

  const isRtl = lang === 'he' || lang === 'ar';
  const labels = {
    he: {
      title: 'מילים מותאמות אישית',
      wordPlaceholder: 'הכנס מילה...',
      hintPlaceholder: 'רמז (אופציונלי)...',
      add: 'הוסף מילה',
      empty: 'אין מילים עדיין',
      error: 'המילה צריכה להכיל לפחות 2 אותיות',
      done: 'סיום',
    },
    ar: {
      title: 'كلمات مخصصة',
      wordPlaceholder: 'أدخل كلمة...',
      hintPlaceholder: 'تلميح (اختياري)...',
      add: 'أضف كلمة',
      empty: 'لا توجد كلمات بعد',
      error: 'يجب أن تحتوي الكلمة على حرفين على الأقل',
      done: 'تم',
    },
  };

  const l = labels[lang] || labels.he;

  function handleAdd() {
    const trimmed = word.trim();
    if (trimmed.length < 2) { setError(l.error); return; }
    onAdd({ word: trimmed, hint: hint.trim() || trimmed });
    setWord('');
    setHint('');
    setError('');
  }

  return (
    <div className="bg-card border rounded-2xl p-5 space-y-4 shadow-md" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{l.title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Input row */}
      <div className="flex flex-col gap-2">
        <input
          value={word}
          onChange={e => { setWord(e.target.value); setError(''); }}
          placeholder={l.wordPlaceholder}
          className="border rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          dir={isRtl ? 'rtl' : 'ltr'}
        />
        <input
          value={hint}
          onChange={e => setHint(e.target.value)}
          placeholder={l.hintPlaceholder}
          className="border rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          dir={isRtl ? 'rtl' : 'ltr'}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleAdd} className="gap-2 w-full">
          <Plus className="w-4 h-4" /> {l.add}
        </Button>
      </div>

      {/* Word list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {customWords.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-2">{l.empty}</p>
        )}
        {customWords.map((w, i) => (
          <div key={i} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-2">
            <span className="font-semibold">{w.word}</span>
            {w.hint && <span className="text-muted-foreground text-sm flex-1 mx-3 truncate">💡 {w.hint}</span>}
            <button onClick={() => onRemove(i)} className="text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full" onClick={onClose}>{l.done}</Button>
    </div>
  );
}