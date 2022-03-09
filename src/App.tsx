import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import { DTWPage } from './pages/DTWPage';
import { ListPage } from './pages/ListPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Sandbox } from './pages/Sandbox';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<NotFoundPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/dtw" element={<DTWPage />} />
          <Route path="/sandbox" element={<Sandbox />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
