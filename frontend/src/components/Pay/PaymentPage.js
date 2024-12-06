import React, { useState } from "react";
import CashModal from "./CashModal";
import CardModal from "./CardModal";
import { useNavigate } from "react-router-dom";
import useOrder from "./../../hooks/useOrder"; // useOrder 훅
import axios from "axios";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentPage = ({ totalAmount, onBack }) => {
    const [isCashModalOpen, setCashModalOpen] = useState(false);
    const [isCardModalOpen, setCardModalOpen] = useState(false);
    const navigate = useNavigate();
    const { createOrGetOrder } = useOrder();

    // 현금 결제 클릭 시 모달 열기
    const handleCashClick = () => {
        setCashModalOpen(true);
    };
    // 모달 닫기
    const closeModal = () => {
        setCashModalOpen(false);
    };


    // 현금 영수증 발급 없이 결제 완료
    const skipCashReceipt = async () => {
        console.log("Skip Cash Receipt: Sending totalAmount =", totalAmount); // totalAmount 로그
        console.log("Rounded Amount:", Math.round(totalAmount)); // Math.round 로그
        try {
            const orderNo = await createOrGetOrder(); //주문번호 생성

            const res = await axios.post(`${BASE_URL}/pay/cash-receipt`, {
                orderNo,
                receiptNumber: null,
                receiptType: null,
                amount: Math.round(totalAmount), // 정수로 변환
            });
            console.log("Server Response:", res.data); // 로그 추가
            alert(res.data.message || "결제가 완료되었습니다!");
            setCashModalOpen(false);
            navigate("/dining", { state: { refreshTables: true }});
        } catch (error) {
            console.error("현금 결제 실패:", error.response?.data || error.message);
            alert("결제 처리에 실패했습니다. 다시 시도해주세요.");
        }
    };
    
    // 현금 영수증 발급 및 결제 완료
    const handlePaymentComplete = async (receiptNumber, receiptType) => {
        try {
            const orderNo = await createOrGetOrder();
            // 서버에 현금 영수증 발급 요청
            const response = await axios.post("http://localhost:8080/api/pay/cash-receipt", {
                orderNo, 
                receiptNumber,
                receiptType,
            });

            alert(response.data.message); // 서버 응답 메시지
            setCashModalOpen(false);      // 모달 닫기
            navigate("/dining", { state: { refreshTables: true }});           // 테이블 페이지로 이동
        } catch (error) {
            console.error("현금 영수증 발급 실패:", error.response?.data || error.message);
            alert("현금 영수증 발급에 실패했습니다. 다시 시도해주세요.");
        }
    };



     // 카드 결제 클릭 시 모달 열기
    const handleCardClick = () => {
        setCardModalOpen(true);
    };

    // 카드 결제 완료 처리
    const handleCardPayment = async (cardNumber, expiryDate, cvv) => {
        try {
            const orderNo = await createOrGetOrder();
            const response = await axios.post("http://localhost:8080/api/pay/card-payment", {
                orderNo,
                totalAmount: Math.round(totalAmount),
                cardNumber,
                expiryDate,
                cvv,
            });
            alert(response.data.message || "카드 결제가 완료되었습니다!");
            setCardModalOpen(false);
            navigate("/dining", { state: { refreshTables: true }});
        } catch (error) {
            console.error("카드 결제 실패:", error.response?.data || error.message);
            alert("카드 결제 처리에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="payment-page">
            <button className="back-button" onClick={onBack}> ← 뒤로가기 </button> 
            <h2> 총 결제금액 </h2>
            {/* <p>{totalAmount.toLocaleString()}원</p> */}
            <p>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalAmount)}</p>
            <div className="payment-methods">
                <button className="payment-method" onClick={handleCardClick}>신용카드</button>
                <button className="payment-method" onClick={handleCashClick}>현금</button>
                <button className="payment-method">QR결제</button>
                <button className="payment-method">계좌이체</button>
            </div>

            {/* 현금 영수증 모달 */}
            {isCashModalOpen && (
                <CashModal 
                    onClose={closeModal} 
                    onSkip={skipCashReceipt}
                    onPaymentComplete={handlePaymentComplete} 
                />
            )}

            {/* 카드결제 모달 */}
            {isCardModalOpen && (
                <CardModal 
                    onClose={() => setCardModalOpen(false)} 
                    onPaymentComplete={handleCardPayment} 
                />
            )}
        </div>
    );
};

export default PaymentPage;