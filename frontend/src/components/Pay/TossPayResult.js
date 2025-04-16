import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TossPayResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    


    const query = new URLSearchParams(location.search);
    const paymentKey = query.get("paymentKey");
    const orderNo = query.get("orderId");
    const amount = query.get("amount");


    useEffect(() => {
        const path = location.pathname;

        const tossCardPayment = async () => {
            try {
                await axios.post(`${BASE_URL}/pay/toss-payment`, {
                    orderNo,
                    paymentKey,
                    amount,
                })

                // alert("결제가 완료되었습니다.");
                navigate("/dining", { state: { refreshTables: true } });
            } catch (error) {
                console.error("Toss 결제 확인 실패", error);
                alert("결제확인 중 문제가 발생했습니다.");
                navigate("/pay");
            }
        };

        if (path.includes("success")){
            tossCardPayment();
        } else if (path.includes("fail")) {
            alert("결제가 실패하거나 취소되었습니다.");
            navigate("/pay");
        }
    }, [location, navigate, amount, orderNo, paymentKey]);
};


export default TossPayResult;