export default function QuickPlayCard({ game, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-36 rounded-xl p-4 bg-gradient-to-br ${game.color} text-white shadow-md text-start min-h-[120px] hover:scale-105 active:scale-95 transition-transform duration-150`}
      aria-label={game.label}
    >
      <span className="text-3xl block mb-2" aria-hidden="true">{game.icon}</span>
      <span className="font-bold text-lg block leading-tight">{game.label}</span>
      <span className="text-sm opacity-85 mt-1 block">{game.difficulty}</span>
    </button>
  );
}