import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import YieldPrediction from './pages/YieldPrediction';
import DiseasePrediction from './pages/DiseasePrediction';
import Weather from './pages/Weather';
import BottomNav from './components/BottomNav';
import GeneralChat from './pages/GeneralChat';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';

// Helper component to conditionally render Navbar/BottomNav
const Layout = ({ children }) => {
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/signup'];
  const showNav = !publicRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
      {showNav && <Navbar />}
      <main className={`flex-1 ${showNav ? 'pb-20 md:pb-12' : ''}`}>
        {children}
      </main>
      {showNav && (
        <footer className="bg-green-800 text-green-200 py-6 text-center mb-16 md:mb-0">
          <p>© 2026 Agrimate AI. Empowering Farmers with Technology.</p>
        </footer>
      )}
      {showNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/crop" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
              <Route path="/yield" element={<ProtectedRoute><YieldPrediction /></ProtectedRoute>} />
              <Route path="/disease" element={<ProtectedRoute><DiseasePrediction /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><GeneralChat /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
