import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useOrder from "./useOrder";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useOrderDetail = () => {
    const { orderNo, setOrderNo, fetchOrder } = useOrder();
    const [orderDetails, setOrderDetails] = useState([]); // 주문 상세 데이터
    const { tableNo } = useParams();

    // 주문 상세 데이터 가져오기
    const fetchOrderDetails = async () => {
        try {
            const currentOrderNo = await fetchOrder(tableNo);
            setOrderNo(currentOrderNo);
            console.log("currentOrderNo===="+currentOrderNo)
            const res = await axios.get(`${BASE_URL}/order/${currentOrderNo}/ordDetail`);
            setOrderDetails(res.data); // 서버에서 가져온 주문 상세 데이터를 상태로 저장
            return res.data;
        } catch (error) {
            console.error("주문 상세 데이터를 가져오는 중 오류 발생: ", error);
        }
    };

    // 메뉴를 선택하면 주문과 주문 상세 추가
    const addOrderDetail = async (menuId, menuName, unitPrice) => {
        try {
            // 주문상세에 메뉴를 추가하는데 기존에 존재하는 데이터가 있는지 확인
            const existingDetail = orderDetails.find((detail) => String(detail.menuId) === String(menuId));

            // 메뉴가 이미 주문상세에 존재할경우 수량과 총주문금액을 업데이트
            if(existingDetail){
                setOrderDetails((prev) => 
                        prev.map((detail) =>
                            detail.menuId === menuId
                                ? {
                                    ...detail,
                                    quantity: detail.quantity+1,
                                    totalAmount: unitPrice * (detail.quantity+1),
                                }
                                : detail
                            )    
                );
                return;
            }
            // 새로운 항목 추가
            setOrderDetails((prev) => [
                ...prev,
                {
                    menuId,
                    menuName,
                    unitPrice,
                    quantity: 1,
                    totalAmount: unitPrice,
                }
            ]);
            console.log("현재 orderDetails:", orderDetails);
            console.log("추가하려는 메뉴 ID:", menuId);
        } catch (error) {
            console.error("주문 상세 추가 중 오류 발생: ", error);
        }
    };

    // 주문상세 삭제
    const delOrderDetail = async (ordDetailNo) => {
        try {
            await axios.post(`${BASE_URL}/order/delete/ordDetail`, {
                ordDetailNo: Number(ordDetailNo),
                orderNo: orderNo,
                tableNo: Number(tableNo),
            });
            
            setOrderDetails((prev) => prev.filter((detail)=> detail.ordDetailNo !== ordDetailNo));

        } catch (error) {
            console.error("주문 상세 삭제 중 오류 발생: ", error);
        }
    }

    return {
        orderDetails,
        fetchOrderDetails,
        addOrderDetail,
        delOrderDetail,
        setOrderDetails,
    };
};

export default useOrderDetail;
