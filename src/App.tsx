import React from 'react';
import PricingCalculator from './components/PricingCalculator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Enterprise RAG Knowledge Base</h1>
      </header>
      <main className="App-main">
        <PricingCalculator />
      </main>
      <footer className="App-footer">
        <p>© 2024 Enterprise RAG. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App; 