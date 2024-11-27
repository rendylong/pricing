import React from 'react';
import PricingCalculator from './components/PricingCalculator';
import { LLMPricing } from './components/LLMPricing';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PricingCalculator />} />
        <Route path="/llm-pricing" element={<LLMPricing />} />
      </Routes>
    </Router>
  );
}

export default App; 