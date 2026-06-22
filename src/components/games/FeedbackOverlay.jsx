import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

export default function FeedbackOverlay({ show, isCorrect, message }) {
  const { t } = useLang();

  const fireConfetti = () => {
    if (!isCorrect) return;
    import('canvas-confetti').then(({ default: confetti }) => {
      const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'];
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 }, colors, scalar: 1.1 });
      setTimeout(() => confetti({ particleCount: 50, spread: 100, origin: { y: 0.5 }, colors, scalar: 0.9 }), 200);
    });
  };

  return (
    <AnimatePresence onExitComplete={() => {}}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
          onAnimationComplete={fireConfetti}
        >
          <motion.div
            initial={{ scale: 0.5, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`relative rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4
              ${isCorrect
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300'
                : 'bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-300'}`}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.1 }}
              className={isCorrect
                ? 'absolute inset-0 rounded-3xl bg-green-400/20 blur-2xl'
                : 'absolute inset-0 rounded-3xl bg-red-400/20 blur-2xl'}
            />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <motion.div
                animate={isCorrect
                  ? { scale: [1, 1.15, 1] }
                  : { x: [0, -8, 8, -5, 5, 0] }}
                transition={{ duration: isCorrect ? 0.5 : 0.4 }}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-lg" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500 drop-shadow-lg" />
                )}
              </motion.div>
              <p className={`text-2xl md:text-3xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? t.correct : t.incorrect}
              </p>
              {message && (
                <p className="text-base md:text-lg text-muted-foreground text-center max-w-xs">{message}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}