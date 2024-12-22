import './App.css';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductManagement from './components/Product/ProductManagement';
import Main from './components/Main.js';  // 메인 페이지
import Open from './components/Open/OpenAndClose.js';  // 테이블 페이지
import Order from './components/Order/Order.js';  // 주문 페이지
import OrderHistory from './components/Order/OrderHistory.js';  // 주문 페이지
import Dining from "./components/Dining/Dining.js"; // 테이블
import EditDining from "./components/Dining/EditDining.js" // 테이블수정
import { TableProvider } from './components/Dining/TableContext.js';
import { SaleSummary } from './components/SaleSummary/SaleSummary.js'; //매출 요약
import Header from './components/Header.js';
import PaymentHistory from "./components/Pay/PaymentHistory"; // 결제 내역 페이지


function App() {
  return (
      <TableProvider>
        <Router>
          <Header />
            <Routes>
              <Route path="/" element={<Main />} /> {/* 메인 페이지 */}
              <Route path="/shop/open" element={<Open />} /> {/*영업개시*/}
              <Route path="/payment-history" element={<PaymentHistory/>}/> {/* 판매 내역역 */}
              <Route path="/order-history" element={<OrderHistory />} /> {/*테이블 ID에 따른 주문 페이지*/}
              <Route path="/order/:tableNo" element={<Order/>}/> {/* 주문내역 */}
              <Route path="/product-management" element={<ProductManagement />} />
              <Route path="/dining" element={<Dining/>}/> {/* 테이블가져오기 */}
              <Route path="/editDining" element={<EditDining/>}/> {/*테이블수정하기*/}
              <Route path="/sales-summary" element={<SaleSummary/>}/> {/* 매출 요약 */}
            </Routes>
        </Router>
      </TableProvider>
  );
}

export default App;
