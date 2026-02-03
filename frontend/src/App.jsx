import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import YieldPrediction from './pages/YieldPrediction';
import DiseasePrediction from './pages/DiseasePrediction';

import { LanguageProvider } from './context/LanguageContext';
import GeneralChat from './pages/GeneralChat';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <Navbar />
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/crop" element={<CropRecommendation />} />
              <Route path="/yield" element={<YieldPrediction />} />
              <Route path="/disease" element={<DiseasePrediction />} />
              <Route path="/chat" element={<GeneralChat />} />
            </Routes>
          </main>

          <footer className="bg-green-800 text-green-200 py-6 text-center">
            <p>© 2026 Agrimate AI. Empowering Farmers with Technology.</p>
          </footer>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
