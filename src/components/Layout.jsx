import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Grid3X3, Calculator, Puzzle, Home, BarChart2, Flag, PenLine, Lightbulb, Shapes, Hexagon, CalendarRange, BellRing, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const isRoot = location.pathname === '/';
  const isRtl = t.dir === 'rtl';
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  // Persist scroll positions per route
  const scrollPositions = useRef({});
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    const prev = prevPath.current;
    const current = location.pathname;
    if (prev !== current) {
      scrollPositions.current[prev] = window.scrollY;
      const saved = scrollPositions.current[current] ?? 0;
      requestAnimationFrame(() => window.scrollTo(0, saved));
      prevPath.current = current;
    }
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: t.navHome, icon: Home },
    { path: '/memory', label: t.navMemory, icon: Grid3X3 },
    { path: '/logic', label: t.navLogic, icon: Puzzle },
    { path: '/numbers', label: t.navNumbers, icon: Calculator },
    { path: '/flags', label: t.navFlags, icon: Flag },
    { path: '/word', label: t.navWord, icon: PenLine },
    { path: '/trivia', label: t.triviaTitle, icon: Lightbulb },
    { path: '/shape-word', label: t.shapeWordTitle, icon: Shapes },
    { path: '/shape-pattern', label: t.shapePatternTitle || 'דפוסי צורות', icon: Hexagon },
    { path: '/weekly-report', label: t.navWeekly, icon: CalendarRange },
    { path: '/reminder', label: t.navReminder, icon: BellRing },
    { path: '/progress', label: t.navProgress, icon: BarChart2 },
  ];

  const isInGame = !isRoot && location.pathname !== '/progress' && location.pathname !== '/settings';

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={t.dir} lang={lang}>
      {/* Header with safe-area top */}
      <header
        className="bg-card border-b border-border px-4 py-4 md:py-5 shadow-sm"
        style={{ paddingTop: `max(1rem, calc(1rem + env(safe-area-inset-top)))` }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          {/* Back button - only on non-root pages (desktop) */}
          {!isRoot && (
            <button
              onClick={() => navigate(-1)}
              className="hidden md:flex p-3 rounded-xl hover:bg-muted transition-colors select-none text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] items-center justify-center"
              aria-label="Back"
            >
              <BackIcon className="w-6 h-6" />
            </button>
          )}

          {/* Mobile: Home button when in a game */}
          {isInGame && (
            <Link
              to="/"
              className="flex md:hidden p-3 rounded-xl hover:bg-muted transition-colors select-none text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] items-center justify-center"
              aria-label="Home"
            >
              <Home className="w-6 h-6" />
            </Link>
          )}

          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Brain className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{t.appName}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t.appSubtitle}</p>
          </div>
          <Link
            to="/settings"
            className="p-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t.settingsTitle || 'הגדרות'}
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:py-8 md:pb-36">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Disclaimer — visible only on the home page */}
      <AnimatePresence>
        {isRoot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/60 border-t border-border px-4 py-3 text-center md:mb-20"
          >
            <p className="text-sm text-muted-foreground">
              {isRtl
                ? 'האפליקציה נוצרה למטרות אישיות. כל שימוש בה הוא באחריות המשתמש בלבד.'
                : "This app was created for personal purposes. Any use of it is solely at the user's own responsibility."}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">© Rawan Awadieh 2026</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - desktop only */}
      <nav
        className="hidden md:block bg-card border-t border-border px-2 py-2 md:py-3 fixed bottom-0 left-0 right-0 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] safe-bottom"
      >
        <div className="max-w-5xl mx-auto flex justify-around overflow-x-auto">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all min-w-[64px] min-h-[56px] justify-center select-none
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs md:text-sm font-medium ${isActive ? 'font-semibold' : ''} whitespace-nowrap`}>
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