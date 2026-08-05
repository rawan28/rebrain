import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLang } from '@/lib/LanguageContext';
import { Heart } from 'lucide-react';

const LABELS = {
  he: {
    title: 'איך היה לכם? 💙',
    subtitle: 'כמה שאלות קצרות שיעזרו לנו להשתפר',
    submit: 'שליחת משוב',
    skip: 'דלג',
    thanks: 'תודה רבה על המשוב! 💙',
    commentPlaceholder: 'משהו נוסף שתרצו לספר לנו? (לא חובה)',
    scale: ['בכלל לא', 'מעט', 'בינוני', 'הרבה', 'מאוד'],
    questions: [
      'עד כמה המשחקים היו מאתגרים?',
      'עד כמה נהניתם מהחוויה?',
      'עד כמה היה נוח וקל להשתמש?',
      'עד כמה תמליצו לחברים?',
    ],
  },
  ar: {
    title: 'كيف كانت تجربتكم؟ 💙',
    subtitle: 'بضعة أسئلة قصيرة تساعدنا على التحسّن',
    submit: 'إرسال الملاحظات',
    skip: 'تخطّي',
    thanks: 'شكراً جزيلاً على ملاحظاتكم! 💙',
    commentPlaceholder: 'هل تودّون إخبارنا بشيء آخر؟ (اختياري)',
    scale: ['أبداً', 'قليلاً', 'متوسط', 'كثيراً', 'جداً'],
    questions: [
      'ما مدى صعوبة الألعاب؟',
      'ما مدى استمتاعكم بالتجربة؟',
      'ما مدى سهولة وراحة الاستخدام؟',
      'ما مدى استعدادكم للتوصية بها؟',
    ],
  },
};

const KEYS = ['challenge', 'enjoyment', 'comfort', 'recommend'];

export default function FeedbackSurvey({ open, onOpenChange }) {
  const { lang } = useLang();
  const L = LABELS[lang] || LABELS.he;
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await base44.entities.Feedback.create({ ...answers, comment: comment.trim(), lang });
      setDone(true);
      setTimeout(() => {
        onOpenChange(false);
        setDone(false);
        setAnswers({});
        setComment('');
      }, 1600);
    } catch (e) {
      setSubmitting(false);
    }
  };

  const hasAnyAnswer = Object.keys(answers).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={lang === 'ar' ? 'rtl' : 'rtl'} className="max-w-md max-h-[90vh] overflow-y-auto">
        {done ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <Heart className="w-16 h-16 text-primary fill-primary" />
            <p className="text-2xl font-bold">{L.thanks}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{L.title}</DialogTitle>
              <p className="text-base text-muted-foreground">{L.subtitle}</p>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {L.questions.map((q, qi) => (
                <div key={qi} className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">{q}</p>
                  <div className="flex gap-2 justify-between">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const active = answers[KEYS[qi]] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setAnswer(KEYS[qi], val)}
                          className={`flex-1 min-h-[52px] rounded-xl text-lg font-bold transition-all active:scale-95
                            ${active
                              ? 'bg-primary text-primary-foreground shadow-md scale-105'
                              : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                          aria-label={L.scale[val - 1]}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>{L.scale[0]}</span>
                    <span>{L.scale[4]}</span>
                  </div>
                </div>
              ))}

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={L.commentPlaceholder}
                rows={3}
                className="w-full rounded-xl border border-input bg-background p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground text-lg font-semibold active:scale-95 transition-transform"
              >
                {L.skip}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || (!hasAnyAnswer && !comment.trim())}
                className="flex-[2] py-3 rounded-xl bg-primary text-primary-foreground text-lg font-bold active:scale-95 transition-transform disabled:opacity-40"
              >
                {L.submit}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}