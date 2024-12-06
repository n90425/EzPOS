import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useOrder = () => {
    const [orderNo, setOrderNo] = useState(null);
    const { tableNo } = useParams();

    // 오더 전체 가져오기
    const fetchOrders = useCallback(async (startDate, endDate, status) => {
        try {
            const res = await axios.get(`${BASE_URL}/order/all`, {
                params: {
                    startDate: startDate || null,
                    endDate: endDate || null,
                    status: status || null,
                },
            });
            if(res.data) {
                setOrderNo(res.data);
            }
            console.log(res.data);
        } catch(error) {
            console.error("주문조회 중 오류 발생", error);
        }
    }, []);
    

    // 테이블번호와 연결된 주문 가져오기
    const fetchOrder = async () => {
        try {
        const res = await axios.get(`${BASE_URL}/order/${tableNo}`);
        if(res.data) {
            setOrderNo(res.data);
        }
        return res.data;
        } catch (error) {
        console.error("주문조회중 오류발생", error);
        }
    };

    // 테이블 번호로 주문 생성 또는 기존 주문 조회
    const createOrGetOrder = async () => {
        try {
        const res = await axios.post(`${BASE_URL}/order/${tableNo}`);
        setOrderNo(res.data);
        console.log("ORDER NO: ", res.data);
        return res.data;
        } catch (error) {
        console.log(error.data);
        console.error("주문 생성 또는 조회 중 오류 발생: ", error);
        }
    };

    return { orderNo, setOrderNo, fetchOrders, fetchOrder, createOrGetOrder }
};

export default useOrder;