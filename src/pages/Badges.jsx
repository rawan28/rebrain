import { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { computeBadges } from '@/lib/badgesData';
import BadgeCard from '@/components/badges/BadgeCard';

export default function Badges() {
  const { lang } = useLang();
  const [badges, setBadges] = useState(null);

  useEffect(() => {
    (async () => {
      let records = [];
      try {
        records = await base44.entities.UserProgress.list('-date', 500);
      } catch {
        // not logged in / no data
      }
      setBadges(computeBadges(records));
    })();
  }, []);

  const title = lang === 'ar' ? 'الأوسمة والإنجازات' : 'תגים והישגים';
  const desc = lang === 'ar'
    ? 'اجمعوا الأوسمة من خلال التدريب اليومي وإكمال الألعاب'
    : 'אספו תגים על ידי אימון יומי והשלמת משחקים';

  if (!badges) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Award className="w-7 h-7 text-primary" />
          {title}
        </h2>
        <p className="text-muted-foreground mt-1">{desc}</p>
        <p className="text-lg font-semibold text-primary mt-2">
          {lang === 'ar' ? `${earnedCount} من ${badges.length} أوسمة` : `${earnedCount} מתוך ${badges.length} תגים`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {badges.map(b => <BadgeCard key={b.id} badge={b} lang={lang} />)}
      </div>
    </div>
  );
}