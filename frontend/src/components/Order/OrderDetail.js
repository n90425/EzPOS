import React, {useEffect, useState, use} from "react";
import MenuList from "../Category/MenuList";
import "./orderDetail.css"; // CSS 파일 연결
import PaymentPage from "../Pay/PaymentPage";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";



const OrderDetail = ({ orderNo, menus, tableNo, fetchOrder }) => {
    const {orderDetails, fetchOrderDetails, addOrderDetail, delOrderDetail} = useOrderDetail(); // 주문 상세 데이터
    const totalAmount = orderDetails.reduce((acc, item) => acc + item.totalAmount, 0);
    const [isPaymentPage, setIsPaymentPage] = useState(false); // 결제 페이지 여부
    const navigate = useNavigate();

    // 주문번호가 변경되면 주문상세 데이터 가져오기
    useEffect(() => {
        if(!tableNo){
            console.error("테이블번호가 없습니다");
        }

        fetchOrder(tableNo);
        if(orderNo){
            fetchOrderDetails(orderNo);
        }
    }, [orderNo, tableNo]);

    const handlePaymentClick = () => {
        setIsPaymentPage(true); //결제페이지로 전환
        navigate("/pay", { state: { orderDetails, totalAmount } }); // 상태 전달
    };


    return (
        <div className="order-detail-container">
            {isPaymentPage ? (
                <PaymentPage totalAmount={totalAmount} orderDetails={orderDetails} />
            ) : (
                <>
                    {/* 좌측: 메뉴 리스트 */}
                    <div className="menu-list-section">
                        <MenuList menus={menus} onAddToOrder={addOrderDetail} />
                    </div>
                    {/* 주문 상세 리스트 */}
                    <div className="order-detail-section">
                        <h2>주문 목록</h2>
                        {orderDetails.length === 0 ? (
                            <p>주문이 없습니다</p>
                        ) : (
                            <div className="order-items">
                                {orderDetails.map((detail) => (
                                    <div key={`${detail.orderNo}-${detail.ordDetailNo}`} className="payment-order-item">

                            
                                        <div className="order-main">
                                            <div className="payment-orderdetail-continer">
                                                <p>{detail.menuName}</p>
                                                <p><FontAwesomeIcon icon={faXmark} size="1x"/></p>
                                                <p>{detail.quantity}</p>
                                            </div>
                                            <div className="payment-price-container">
                                                <p>{(detail.unitPrice*detail.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="delete-button"
                                            onClick={() => delOrderDetail(detail.ordDetailNo)}
                                        >삭제</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* 하단 결제 버튼 */}
                        <div className="order-footer">
                            <button className="confirm-button" onClick={handlePaymentClick}>
                                {totalAmount.toLocaleString()}원 결제
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetail;
