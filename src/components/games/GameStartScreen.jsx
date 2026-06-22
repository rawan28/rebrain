import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function GameStartScreen({ title, description, icon: Icon, gradient, onStart, startLabel, children }) {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 max-w-md"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
          className={`inline-flex p-4 md:p-5 rounded-3xl shadow-lg bg-gradient-to-br ${gradient} mb-3`}
        >
          {Icon && <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />}
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{title}</h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{description}</p>
      </motion.div>

      {children}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          size="lg"
          onClick={onStart}
          className={`text-lg px-10 py-6 gap-3 shadow-lg bg-gradient-to-r ${gradient} hover:shadow-xl transition-shadow border-0`}
        >
          <Play className="w-6 h-6 text-white" />
          <span className="text-white">{startLabel}</span>
        </Button>
      </motion.div>
    </div>
  );
}