// Coins store — persists coins to backend DB + localStorage cache
import { base44 } from '@/api/base44Client';

const COINS_KEY = 'rebrain_coins';

export function getCoins() {
  try {
    const val = localStorage.getItem(COINS_KEY);
    return val !== null ? Math.max(0, parseInt(val, 10)) : 0;
  } catch {
    return 0;
  }
}

function setLocalCoins(n) {
  try {
    localStorage.setItem(COINS_KEY, String(Math.max(0, n)));
  } catch {
    // ignore
  }
}

async function syncCoinsToBackend(coins) {
  try {
    const records = await base44.entities.UserCoins.filter({ created_by_id: (await base44.auth.me()).id });
    if (records.length > 0) {
      await base44.entities.UserCoins.update(records[0].id, { coins });
    } else {
      await base44.entities.UserCoins.create({ coins });
    }
  } catch {
    // Silently fail — local cache still works
  }
}

export async function syncCoinsFromBackend() {
  try {
    const me = await base44.auth.me();
    const records = await base44.entities.UserCoins.filter({ created_by_id: me.id });
    if (records.length > 0) {
      setLocalCoins(records[0].coins);
      return records[0].coins;
    }
  } catch {
    // ignore
  }
  return getCoins();
}

export function addCoin() {
  const next = getCoins() + 1;
  setLocalCoins(next);
  syncCoinsToBackend(next);
  return next;
}

export function removeCoin() {
  const next = Math.max(0, getCoins() - 1);
  setLocalCoins(next);
  syncCoinsToBackend(next);
  return next;
}