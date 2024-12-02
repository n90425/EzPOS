import React, { useState } from "react";
import CashModal from "./CashModal";

const PaymentPage = ({ totalAmount, onBack }) => {
    const [isCashModalOpen, setCashModalOpen] = useState(false);

    const handleCashClick = () => {
        setCashModalOpen(true);
    };
    const closeModal = () => {
        setCashModalOpen(false);
    };
    const skipCashReceipt = () => {
        alert("현금영수증을 발급하지 않습니다.");
        setCashModalOpen(false); // 모달 닫기
    };


    return (
        <div className="payment-page">
            <button className="back-button" onClick={onBack}> ← 뒤로가기 </button> 
            <h2> 총 결제금액 </h2>
            <p>{totalAmount.toLocaleString()}원</p>
            <div className="payment-methods">
                <button className="payment-method">신용카드</button>
                <button className="payment-method" onClick={handleCashClick}>현금</button>
                <button className="payment-method">QR결제</button>
                <button className="payment-method">계좌이체</button>
            </div>

            {/* 현금 영수증 모달 */}
            {isCashModalOpen && <CashModal onClose={closeModal} onSkip={skipCashReceipt} />}

        </div>
    );
};

export default PaymentPage;