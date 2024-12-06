import React, {useEffect, useState} from "react";
import MenuList from "../Category/MenuList";
import "./orderDetail.css"; // CSS 파일 연결
import PaymentPage from "../Pay/PaymentPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useOrderDetail } from "../../hooks/useOrderDetail";


const OrderDetail = ({ orderNo, menus, tableNo, fetchOrder }) => {
    const {orderDetails, fetchOrderDetails, addOrderDetail, delOrderDetail} = useOrderDetail(); // 주문 상세 데이터
    const totalAmount = orderDetails.reduce((acc, item) => acc + item.totalAmount, 0);
    const [isPaymentPage, setIsPaymentPage] = useState(false); // 결제 페이지 여부


    // 주문번호가 변경되면 주문상세 데이터 가져오기
    useEffect(() => {
        if(!tableNo){
            console.error("테이블번호가 없습니다");
        }

        fetchOrder();
        if(orderNo){
            fetchOrderDetails(orderNo);
        }
    }, [orderNo, tableNo]);




    const handlePaymentClick = () => {
        setIsPaymentPage(true); //결제페이지로 전환
    };



    const handleBackToOrder = () => {
        setIsPaymentPage(false); //주문페이지로 돌아가기
    }



    return (
        <div className="order-detail-container">
            {isPaymentPage ? (
                <PaymentPage totalAmount={totalAmount} onBack={handleBackToOrder} />
            ) : (
                <>
                    {/* 좌측: 메뉴 리스트 */}
                    <div className="menu-list-section">
                        <h2>메뉴</h2>
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
                                    <div key={`${detail.orderNo}-${detail.ordDetailNo}`} className="order-item">
                                        <div className="order-item-info">
                                            <p>{detail.menuName}</p>
                                            <p>수량: {detail.quantity}</p>
                                            <p>가격: {detail.unitPrice.toLocaleString()}원</p>
                                        </div>
                                        <button
                                            className="delete-button"
                                            onClick={() => delOrderDetail(detail.ordDetailNo)}
                                        >
                                            <FontAwesomeIcon icon={faTimes}/>
                                        </button>
                                    </div>
                                ))}
                                <div className="total-amount">총 금액: {totalAmount.toLocaleString()}원</div>
                            </div>
                        )}
                        {/* 하단 결제 버튼 */}
                        <div className="order-footer">
                        <button className="confirm-button" onClick={handlePaymentClick}>
                                결제
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetail;
