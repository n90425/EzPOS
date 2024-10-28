import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Main from './components/Main';
import Table from './components/Table';
import Order from './components/Order';

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인화면 */}
        <Route path="/" element={<Main />} />
        {/* 테이블 화면 */}
        <Route path="/tables" element={<Table />} />
        {/* <Route path="/data" element={<Component/>}/> */}
        {/* 테이블 주문 화면 */}
        <Route path="/table/:tableId" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
