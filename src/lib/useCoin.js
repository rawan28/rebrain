// Hook to award/deduct coins and trigger UI animation
import { addCoin, removeCoin } from '@/lib/coinsStore';
import { notifyCoinChange } from '@/components/CoinDisplay';

export function awardCoin(correct) {
  if (correct) {
    addCoin();
  } else {
    removeCoin();
  }
  notifyCoinChange();
  window.dispatchEvent(new CustomEvent('coin-event', { detail: { positive: correct } }));
}