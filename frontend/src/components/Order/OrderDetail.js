import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuList from "../Category/MenuList";
import "./orderDetail.css"; // CSS 파일 연결
import PaymentPage from "../Pay/PaymentPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrderDetail = ({ orderNo, setOrderNo, menus, tableNo, createOrGetOrder, fetchOrder }) => {
    const [orderDetails, setOrderDetails] = useState([]); // 주문 상세 데이터
    const totalAmount = orderDetails.reduce((acc, item) => acc + item.totalAmount, 0);
    const [isPaymentPage, setIsPaymentPage] = useState(false); // 결제 페이지 여부


      // 주문 상세 데이터 가져오기
    const fetchOrderDetails = async (currentOrderNo) => {
            try {
                const res = await axios.get(`${BASE_URL}/order/${currentOrderNo}/ordDetail`);
                setOrderDetails(res.data); // 서버에서 가져온 주문 상세 데이터를 상태로 저장
                console.log("Order Details: ", res.data);
            } catch (error) {
                console.error("주문 상세 데이터를 가져오는 중 오류 발생: ", error);
            }
    };

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


    // 메뉴를 선택하면 주문과 주문 상세 추가
    const addOrderDetail = async (menuId) => {
        try {
            // 주문번호가 없으면 새 주문 생성
            let currentOrderNo = orderNo;
            currentOrderNo = await createOrGetOrder();
            setOrderNo(currentOrderNo);
            

            // 주문상세 추가
            const res = await axios.post(`${BASE_URL}/order/${currentOrderNo}/ordDetail`, {
                menuId,
                quantity: 1,
            });

            // 주문상세업데이트
            setOrderDetails((prev) => [...prev, res.data]);
            fetchOrderDetails(currentOrderNo);
        } catch (error) {
            console.error("주문 상세 추가 중 오류 발생: ", error);
        }
    };

    // 주문상세 삭제
    const delOrderDetail = async (ordDetailNo) => {
        try {
            await axios.post(`${BASE_URL}/order/delete/ordDetail`, {
                ordDetailNo: Number(ordDetailNo),
                orderNo,
                tableNo: Number(tableNo),
            });

            setOrderDetails((prev) => prev.filter((detail)=> detail.ordDetailNo !== ordDetailNo));

        } catch (error) {
            console.error("주문 상세 삭제 중 오류 발생: ", error);
        }
    }

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
                                    <div key={detail.ordDetailNo} className="order-item">
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
