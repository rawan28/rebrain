import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Computes the current consecutive-day streak of completed daily quizzes
export default function useDailyStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const rows = await base44.entities.UserProgress.filter({ game: "daily_quiz" }, "-date", 100);
        const dates = [...new Set(rows.map(r => r.date))].sort().reverse();
        if (dates.length === 0) return;

        const dayMs = 86400000;
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - dayMs).toISOString().split("T")[0];
        // Streak is alive only if the latest completion is today or yesterday
        if (dates[0] !== today && dates[0] !== yesterday) return;

        let count = 1;
        for (let i = 1; i < dates.length; i++) {
          const gap = (new Date(dates[i - 1]) - new Date(dates[i])) / dayMs;
          if (gap === 1) count++;
          else break;
        }
        setStreak(count);
      } catch {
        // not logged in / no data — keep 0
      }
    })();
  }, []);

  return streak;
}