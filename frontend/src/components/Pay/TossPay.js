import { ANONYMOUS, loadTossPayments} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import useOrder from "./../../hooks/useOrder"

const TOSS_CE_KEY = process.env.REACT_APP_CLIENT_KEY;

//페이호출 메서드
const TossPay = ({ onClose, orderDetails, totalAmount }) => {
    const {orderNo} = useOrder();
    const [payment, setPayment] = useState(null);
    
    useEffect(() =>{
        const fetchPayment = async() => {

            try {
                const tossPayments = await loadTossPayments(TOSS_CE_KEY);
                const payment = tossPayments.payment({ customerKey: ANONYMOUS });
                // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                await payment.requestPayment({
                    method:"CARD",
                    amount:{currency:"KRW", value:Math.round(totalAmount)},
                    orderId:orderNo,
                    orderName:"결제 테스트",
                    successUrl: window.location.origin + "/success", // 결제 요청이 성공하면 리다이렉트되는 URL
                    failUrl: window.location.origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
                // 카드 결제에 필요한 정보
                    card: {
                        useEscrow: false,
                        flowMode: "DEFAULT", // 통합결제창 여는 옵션
                        useCardPoint: false,
                        useAppCardOnly: false,
                    },
                });

                setPayment(payment);
            } catch (error) {
                console.error("Error fetching payment:", error);
                onClose?.();
            }
        }

        fetchPayment();
        
    },[orderNo, onClose, totalAmount, orderDetails])

};
    
    export default TossPay;