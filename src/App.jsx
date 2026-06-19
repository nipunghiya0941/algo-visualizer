import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Visualizer from './pages/visualizer';
import RaceMode from './pages/RaceMode';
<<<<<<< HEAD
import DPVisualizer from './pages/DpVisualizer';
=======
import DpVisualizer from './pages/DpVisualizer';
>>>>>>> db5f5f455e35bcd3402e46f9a0346cad4308af93

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
