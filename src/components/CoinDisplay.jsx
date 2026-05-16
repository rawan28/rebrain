import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCoins } from '@/lib/coinsStore';

// Global event system so any component can trigger a coin update
const listeners = new Set();
export function notifyCoinChange() {
  listeners.forEach(fn => fn());
}

export default function CoinDisplay() {
  const [coins, setCoins] = useState(getCoins);
  const [flyingCoins, setFlyingCoins] = useState([]); // [{id, positive}]

  const refresh = useCallback(() => {
    setCoins(getCoins());
  }, []);

  useEffect(() => {
    listeners.add(refresh);
    return () => listeners.delete(refresh);
  }, [refresh]);

  // Listen for coin animation events
  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      setFlyingCoins(prev => [...prev, { id, positive: e.detail.positive }]);
      setTimeout(() => setFlyingCoins(prev => prev.filter(c => c.id !== id)), 900);
    };
    window.addEventListener('coin-event', handler);
    return () => window.removeEventListener('coin-event', handler);
  }, []);

  return (
    <div className="relative flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5 select-none">
      <span className="text-xl">🪙</span>
      <motion.span
        key={coins}
        initial={{ scale: 1.4, color: '#ca8a04' }}
        animate={{ scale: 1, color: '#854d0e' }}
        transition={{ duration: 0.3 }}
        className="font-bold text-base text-yellow-800 min-w-[1.5rem] text-center"
      >
        {coins}
      </motion.span>

      {/* Flying coin animations */}
      <AnimatePresence>
        {flyingCoins.map(c => (
          <motion.div
            key={c.id}
            initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            animate={{ opacity: 0, y: -40, x: c.positive ? 10 : -10, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-1 left-4 pointer-events-none text-lg font-bold"
            style={{ color: c.positive ? '#16a34a' : '#dc2626' }}
          >
            {c.positive ? '+🪙' : '-🪙'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}