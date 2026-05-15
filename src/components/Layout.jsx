import { Outlet, Link, useLocation } from 'react-router-dom';
import { Brain, Grid3X3, Calculator, Puzzle, Home } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/memory', label: 'Memory', icon: Grid3X3 },
  { path: '/logic', label: 'Logic', icon: Puzzle },
  { path: '/numbers', label: 'Numbers', icon: Calculator },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 md:py-5 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Brain className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">MindFit</h1>
            <p className="text-sm md:text-base text-muted-foreground">Keep Your Mind Sharp</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation - large touch targets */}
      <nav className="bg-card border-t border-border px-2 py-2 md:py-3 sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto flex justify-around">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[72px]
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-sm md:text-base font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}