export default function BadgeCard({ badge, lang }) {
  const L = badge[lang] || badge.he;
  const pct = Math.round((badge.progress / badge.goal) * 100);

  return (
    <div
      className={`rounded-2xl border-2 p-4 flex flex-col items-center text-center gap-2 transition-all
        ${badge.earned
          ? 'border-primary/50 bg-primary/5 shadow-sm'
          : 'border-border bg-card opacity-80'}`}
    >
      <span className={`text-4xl ${badge.earned ? '' : 'grayscale opacity-40'}`} aria-hidden="true">
        {badge.icon}
      </span>
      <p className="font-bold text-foreground leading-tight">{L.name}</p>
      <p className="text-sm text-muted-foreground leading-snug">{L.desc}</p>
      {badge.earned ? (
        <span className="text-sm font-semibold text-primary">
          {lang === 'ar' ? '✓ تم الحصول عليها' : '✓ הושג'}
        </span>
      ) : (
        <div className="w-full space-y-1">
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm text-muted-foreground">{badge.progress} / {badge.goal}</span>
        </div>
      )}
    </div>
  );
}