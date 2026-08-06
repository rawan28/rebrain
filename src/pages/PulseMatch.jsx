import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import useDifficulty from '@/lib/useDifficulty';
import { useLang } from '@/lib/LanguageContext';
import GameStartScreen from '@/components/games/GameStartScreen';
import GameHeader from '@/components/games/GameHeader';
import FeedbackOverlay from '@/components/games/FeedbackOverlay';
import { saveSession } from '@/lib/progressStore';
import { awardCoin } from '@/lib/useCoin';
import PulseMatchGame from '@/components/games/PulseMatchGame';
import { getPulseMatchSession } from '@/lib/pulseMatchData';

export default function PulseMatch() {
  const { t, lang } = useLang();
  const difficulty = useDifficulty(1, 10, 'pulse-match');
  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' });
  const [showNext, setShowNext] = useState(false);

  const newSession = useCallback(() => {
    setSession(getPulseMatchSession(difficulty.level));
    setShowNext(false);
  }, [difficulty.level]);

  const handleComplete = useCallback((score, max) => {
    const isCorrect = score >= Math.ceil(max / 2);
    awardCoin(isCorrect);
    difficulty.recordAnswer(isCorrect);
    saveSession('pulse-match', {
      level: difficulty.level,
      streak: isCorrect ? difficulty.streak + 1 : 0,
      totalCorrect: score,
      totalAttempts: max,
    });
    const L = lang === 'ar'
      ? { correct: `أحسنت! ${score}/${max} 🎉`, wrong: `نتيجتك ${score}/${max}` }
      : { correct: `כל הכבוד! ${score}/${max} 🎉`, wrong: `התוצאה שלך ${score}/${max}` };
    setFeedback({ show: true, isCorrect, message: isCorrect ? L.correct : L.wrong });
    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setShowNext(true);
    }, 2000);
  }, [difficulty, lang]);

  const handleReset = () => { difficulty.reset(); setSession(null); };

  const title = lang === 'ar' ? 'تطابق النبض' : 'התאמת דופק';
  const desc = lang === 'ar' ? 'امسك الشكل المطابق قبل أن يختفي' : 'תפסו את הצורה התואמת לפני שתיעלם';
  const descLong = lang === 'ar'
    ? 'أشكال تتحرك عبر الشاشة — انقر على الشكل المطابق للقاعدة قبل أن يفوتك!'
    : 'צורות נעות על המסך — הקישו על הצורה התואמת לחוק לפני שתחמיץו!';
  const hint = lang === 'ar' ? 'انتبه للقاعدة: تطابق بالشكل أو باللون' : 'שימו לב לחוק: התאמה לפי צורה או צבע';
  const nextLabel = lang === 'ar' ? 'التالي' : 'הבא';

  if (!session) {
    return (
      <GameStartScreen
        title={title}
        description={descLong}
        icon={Zap}
        gradient="from-amber-400 to-orange-500"
        onStart={() => { difficulty.reset(); newSession(); }}
        startLabel={t.startPlaying}
        resumeLevel={difficulty.level}
        onResume={newSession}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title={title}
        description={desc}
        hint={hint}
        level={difficulty.level}
        streak={difficulty.streak}
        totalCorrect={difficulty.totalCorrect}
        totalAttempts={difficulty.totalAttempts}
        onReset={handleReset}
      />

      <PulseMatchGame key={session.id} data={session} lang={lang} onComplete={handleComplete} />

      {showNext && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <button onClick={newSession} className="py-4 px-10 rounded-2xl text-xl font-bold bg-primary text-primary-foreground">
            {nextLabel}
          </button>
        </motion.div>
      )}

      <FeedbackOverlay {...feedback} />
    </div>
  );
}