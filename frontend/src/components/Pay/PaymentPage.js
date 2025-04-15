import React, { useState } from "react";
import CashModal from "./CashModal";
import TossPay from "./TossPay";
import "./paymentPage.css"
import { useNavigate, useLocation } from "react-router-dom";
import useOrder from "./../../hooks/useOrder"; // useOrder 훅
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faSackDollar, faQrcode, faBuildingColumns, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentPage = () => {
    const [isCashModalOpen, setCashModalOpen] = useState(false);
    const [isTossModalOpen, setTossModalOpen] = useState(false);

    const { orderNo } = useOrder();
    const location = useLocation();
    const navigate = useNavigate();

    // OrderDetail에서 전달한 데이터 받기
    const { orderDetails, totalAmount } = location.state || { orderDetails: [], totalAmount: 0 };

    console.log("totalAmount", totalAmount)
    console.log("orderDetails====", orderDetails)

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
        try {
            // const orderNo = await createOrGetOrder(); //주문번호 생성


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
            // 서버에 현금 영수증 발급 요청
            const response = await axios.post(`${BASE_URL}/pay/cash-receipt`, {
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
        setTossModalOpen(true);
        console.log(isTossModalOpen);
    };

    // 카드 결제 완료 처리
    const handleCardPayment = async (cardNumber, expiryDate, cvv) => {
        try {
            const response = await axios.post(`${BASE_URL}/pay/card-payment`, {
                orderNo,
                totalAmount: Math.round(totalAmount),
                cardNumber,
                expiryDate,
                cvv,
            });
            alert(response.data.message || "카드 결제가 완료되었습니다!");
            setTossModalOpen(false);
            navigate("/dining", { state: { refreshTables: true }});
        } catch (error) {
            console.error("카드 결제 실패:", error.response?.data || error.message);
            alert("카드 결제 처리에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-section">
                <h2> 총 결제금액 </h2>
                <p>{totalAmount.toLocaleString()}원을 결제할게요.</p>
                {/* <p>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalAmount)}</p> */}
                <div className="payment-methods">
                    <button className="payment-method" onClick={handleCardClick}>
                        <FontAwesomeIcon icon={faCreditCard} color="#4674DC" size="2x"/>
                        <div>신용카드</div>
                    </button>
                    <button className="payment-method" onClick={handleCashClick}>
                        <FontAwesomeIcon icon={faSackDollar} color="#FFAE00" size="2x"/>
                        <div>현금</div>
                    </button>
                    <button className="payment-method">
                    <FontAwesomeIcon icon={faQrcode} color="#4674DC" size="2x"/>
                        <div>QR결제</div>
                    </button>
                    <button className="payment-method">
                        <FontAwesomeIcon icon={faBuildingColumns} color="#4674DC" size="2x"/>
                        <div>계좌이체</div>
                    </button>
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
                {isTossModalOpen && 
                    <TossPay 
                    onClose={() => setTossModalOpen(false)} 
                    orderDetails={orderDetails} 
                    totalAmount={totalAmount}
                    />
                }
            </div>
            <div className="payment-detail-section">
                <div>
                    <div className="title">
                        <FontAwesomeIcon icon={faPen} size="1x"/>
                        <div>주문내역</div>
                    </div>
                    <div className="payment-orderdetail">
                        {orderDetails.map((detail) => (
                            <div key={`${detail.orderNo}-${detail.ordDetailNo}`} className="payment-order-item">
                                <div className="payment-orderdetail-continer">
                                    <p>{detail.menuName}</p>
                                    <p><FontAwesomeIcon icon={faXmark} size="1x"/></p>
                                    <p>{detail.quantity}</p>
                                </div>
                                <div className="payment-price-container">
                                    <p>{(detail.unitPrice*detail.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="payment-total">
                    <div className="payment-total-amount">
                        <div>총</div>
                        <div className="payment-length">{orderDetails.length}</div>
                        <div>개</div>
                    </div>
                    <div className="payment-total-payamount">{totalAmount.toLocaleString()}원</div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;