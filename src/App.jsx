import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from '@/components/Layout';
import { LanguageProvider } from '@/lib/LanguageContext';
import Home from '@/pages/Home';
import MemoryGame from '@/pages/MemoryGame';
import LogicPuzzle from '@/pages/LogicPuzzle';
import NumberQuiz from '@/pages/NumberQuiz';
import Progress from '@/pages/Progress';
import FlagQuiz from '@/pages/FlagQuiz';

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
        <Route path="/numbers" element={<NumberQuiz />} />
        <Route path="/flags" element={<FlagQuiz />} />
        <Route path="/progress" element={<Progress />} />
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
          <LanguageProvider>
            <AuthenticatedApp />
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App