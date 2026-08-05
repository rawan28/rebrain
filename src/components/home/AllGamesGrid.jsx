export default function AllGamesGrid({ games, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3" role="list">
      {games.map((game) => (
        <button
          key={game.route}
          onClick={() => onSelect(game.route)}
          role="listitem"
          className="flex flex-col items-center justify-center gap-2 p-3 bg-card border border-border rounded-xl hover:bg-muted/50 active:scale-95 transition-all duration-150 min-h-[96px]"
          aria-label={game.label}
        >
          <span className="text-2xl" aria-hidden="true">{game.icon}</span>
          <span className="text-sm font-medium text-center leading-tight">{game.label}</span>
        </button>
      ))}
    </div>
  );
}