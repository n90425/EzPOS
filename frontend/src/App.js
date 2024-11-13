import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductManagement from './components/ProductManagement';
import Main from './components/Main.js';  // 메인 페이지
import Tables from './components/Tables.js';  // 테이블 페이지
import Order from './components/Order/Order.js';  // 주문 페이지
import OrderList from './components/Order/OrderList.js'; // 주문
import Dining from "./components/Dining/Dining.js"; // 테이블
import EditDining from "./components/Dining/EditDining.js" // 테이블수정

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} /> {/* 메인 페이지 */}
        <Route path="/tables" element={<Tables />} /> {/* 테이블 페이지 */}
        <Route path="/table/:tableId" element={<Order />} /> {/* 테이블 ID에 따른 주문 페이지 */}
        <Route path="/order" element={<OrderList/>}/> {/* 주문내역 */}
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/dining" element={<Dining/>}/> {/* 테이블가져오기 */}
        <Route path="/editDining" element={<EditDining/>}/> {/*테이블수정하기*/}
      </Routes>
    </Router>
  );
}

export default App;
