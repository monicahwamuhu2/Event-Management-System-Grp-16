import AuthPage from './pages/auth/AuthPage';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="App w-screen h-screen bg-gray-300 dark:bg-gray-900 dark:text-white transition-colors duration-300">     
      <AuthPage />
      <ThemeToggle />
    </div>
  );
}

export default App;
