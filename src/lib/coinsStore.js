// Coins store — persists gold coins to localStorage

const COINS_KEY = 'rebrain_coins';

export function getCoins() {
  try {
    const val = localStorage.getItem(COINS_KEY);
    return val !== null ? Math.max(0, parseInt(val, 10)) : 0;
  } catch {
    return 0;
  }
}

export function addCoin() {
  const current = getCoins();
  const next = current + 1;
  localStorage.setItem(COINS_KEY, String(next));
  return next;
}

export function removeCoin() {
  const current = getCoins();
  const next = Math.max(0, current - 1);
  localStorage.setItem(COINS_KEY, String(next));
  return next;
}