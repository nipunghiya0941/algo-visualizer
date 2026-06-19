import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Visualizer from './pages/visualizer';
import RaceMode from './pages/RaceMode';
import DpVisualizer from './pages/DpVisualizer';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === 'sorting' && <Visualizer category="sorting" />}
      {currentPage === 'searching' && <Visualizer category="searching" />}
      {currentPage === 'graph' && <Visualizer category="graph" />}
      {currentPage === 'tree' && <Visualizer category="tree" />}
      {currentPage === 'ds' && <Visualizer category="ds" />}
      {currentPage === 'race' && <RaceMode />}
      {currentPage === 'dp' && <DPVisualizer />}
    </div>
  );
};

export default App;
