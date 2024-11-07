import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';  // 메인 페이지
import Tables from './components/Tables';  // 테이블 페이지
import Order from './components/Order';  // 주문 페이지
import OrderList from './components/OrderList';
import ProductManagement from './components/ProductManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} /> {/* 메인 페이지 */}
        <Route path="/tables" element={<Tables />} /> {/* 테이블 페이지 */}
        <Route path="/table/:tableId" element={<Order />} /> {/* 테이블 ID에 따른 주문 페이지 */}
        <Route path="/order" element={<OrderList/>}/> {/* 주문내역 */}
        <Route path="/product-management" element={<ProductManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
