import { useState, useCallback } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { triviaQuestions } from '@/lib/triviaData';
import { Button } from '@/components/ui/button';
import { RotateCcw, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TriviaQuiz() {
  const { t, lang } = useLang();
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startGame = useCallback(() => {
    const qs = shuffle(triviaQuestions[lang] || triviaQuestions.he).slice(0, 10);
    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setStarted(true);
  }, [lang]);

  function handleAnswer(opt) {
    if (selected) return;
    setSelected(opt);
    if (opt === questions[index].answer) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex(i => i + 1);
        setSelected(null);
      }
    }, 1200);
  }

  const triviaTitle = lang === 'ar' ? 'معلومات عامة' : 'טריוויה כללית';
  const triviaDesc = lang === 'ar' ? 'اختبر معلوماتك العامة!' : 'בחן את הידע הכללי שלך!';
  const questionOf = lang === 'ar' ? `سؤال ${index + 1} من ${questions.length}` : `שאלה ${index + 1} מתוך ${questions.length}`;
  const finalMsg = lang === 'ar' ? `أجبت على ${score} من ${questions.length} صح!` : `ענית נכון על ${score} מתוך ${questions.length}!`;

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="text-center space-y-2">
          <div className="bg-yellow-100 p-4 rounded-2xl inline-block mb-2">
            <Lightbulb className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold">{triviaTitle}</h2>
          <p className="text-muted-foreground text-lg">{triviaDesc}</p>
        </div>
        <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8" onClick={startGame}>
          {t.startPlaying}
        </Button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="bg-yellow-100 p-4 rounded-2xl">
          <Lightbulb className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold">{t.excellent}</h2>
        <p className="text-xl text-muted-foreground">{finalMsg}</p>
        <div className="w-48 h-48 rounded-full border-8 border-yellow-400 flex items-center justify-center">
          <span className="text-5xl font-bold text-yellow-600">{pct}%</span>
        </div>
        <Button size="lg" className="gap-2" variant="outline" onClick={startGame}>
          <RotateCcw className="w-5 h-5" /> {t.startOver}
        </Button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{triviaTitle}</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={startGame}>
          <RotateCcw className="w-4 h-4" /> {t.startOver}
        </Button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{questionOf}</span>
        <div className="flex-1 bg-muted rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-yellow-600">{score} ✓</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="space-y-4"
        >
          <div className="bg-card border-2 border-yellow-200 rounded-2xl p-5">
            <p className="text-xl font-semibold leading-relaxed">{q.q}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map(opt => {
              const isCorrect = opt === q.answer;
              const isSelected = opt === selected;
              let cls = 'rounded-xl border-2 p-4 font-medium text-base transition-all cursor-pointer ';
              if (!selected) {
                cls += 'border-border bg-card hover:border-yellow-400 hover:bg-yellow-50';
              } else if (isCorrect) {
                cls += 'border-green-500 bg-green-50 text-green-700';
              } else if (isSelected) {
                cls += 'border-red-400 bg-red-50 text-red-700';
              } else {
                cls += 'border-border bg-card opacity-50';
              }
              return (
                <button key={opt} className={cls} onClick={() => handleAnswer(opt)}>
                  <span className="flex items-center gap-2 justify-center">
                    {selected && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />}
                    {selected && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}