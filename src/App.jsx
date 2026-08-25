import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from '@/components/Layout';
import { LanguageProvider } from '@/lib/LanguageContext';
import ThemeProvider from '@/lib/ThemeProvider';
import Home from '@/pages/Home';
import MemoryGame from '@/pages/MemoryGame';
import LogicPuzzle from '@/pages/LogicPuzzle';
import NumberQuiz from '@/pages/NumberQuiz';
import Progress from '@/pages/Progress';
import FlagQuiz from '@/pages/FlagQuiz';
import WordComplete from '@/pages/WordComplete';
import TriviaQuiz from '@/pages/TriviaQuiz';
import ShapeWordGame from '@/pages/ShapeWordGame';
import NumberQuizDashboard from '@/pages/NumberQuizDashboard';
import Settings from '@/pages/Settings';
import FruitAlgebra from '@/pages/FruitAlgebra';
import WeeklyReport from '@/pages/WeeklyReport';
import ReminderSettings from '@/pages/ReminderSettings';
import DailyQuizPage from '@/pages/DailyQuizPage';
import ShapePattern from '@/pages/ShapePattern';
import MiniSudoku from '@/pages/MiniSudoku';
import WordSpell from '@/pages/WordSpell';
import ShapeSeries from '@/pages/ShapeSeries';
import Badges from '@/pages/Badges';
import Companion from '@/pages/Companion';


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/logic" element={<LogicPuzzle />} />
        <Route path="/flags" element={<FlagQuiz />} />
        <Route path="/word" element={<WordComplete />} />
        <Route path="/trivia" element={<TriviaQuiz />} />
        <Route path="/shape-word" element={<ShapeWordGame />} />
        <Route path="/numbers-dashboard" element={<NumberQuizDashboard />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/fruit-algebra" element={<FruitAlgebra />} />
        <Route path="/weekly-report" element={<WeeklyReport />} />
        <Route path="/reminder" element={<ReminderSettings />} />
        <Route path="/daily-quiz" element={<DailyQuizPage />} />
        <Route path="/shape-pattern" element={<ShapePattern />} />
        <Route path="/mini-sudoku" element={<MiniSudoku />} />
        <Route path="/word-spell" element={<WordSpell />} />
        <Route path="/shape-series" element={<ShapeSeries />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/companion" element={<Companion />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthenticatedApp />
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App