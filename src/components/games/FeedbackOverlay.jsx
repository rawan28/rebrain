import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function FeedbackOverlay({ show, isCorrect, message }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className={`rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col items-center gap-4
              ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
            <p className={`text-2xl md:text-3xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? 'Well Done!' : 'Not Quite'}
            </p>
            {message && (
              <p className="text-lg text-muted-foreground text-center max-w-xs">{message}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}