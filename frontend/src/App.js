import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Component from './components/ApiComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>홈페이지</h1>}/>
        <Route path="/data" element={<Component/>}/>
      </Routes>
    </Router>
  );
}

export default App;
