import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import YieldPrediction from './pages/YieldPrediction';
import DiseasePrediction from './pages/DiseasePrediction';
import Weather from './pages/Weather';
import BottomNav from './components/BottomNav'; // Import BottomNav

import { LanguageProvider } from './context/LanguageContext';
import GeneralChat from './pages/GeneralChat';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/crop" element={<CropRecommendation />} />
              <Route path="/yield" element={<YieldPrediction />} />
              <Route path="/disease" element={<DiseasePrediction />} />
              <Route path="/chat" element={<GeneralChat />} />
              <Route path="/weather" element={<Weather />} />
            </Routes>
          </main>


          <footer className="bg-green-800 text-green-200 py-6 text-center mb-16 md:mb-0">
            <p>© 2026 Agrimate AI. Empowering Farmers with Technology.</p>
          </footer>
          <BottomNav />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
