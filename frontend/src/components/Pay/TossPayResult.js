import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios";

    const TossPayResult = () => {
        const location = useLocation();
        const navigate = useNavigate();
        const BASE_URL = process.env.REACT_APP_API_BASE_URL;


        const query = new URLSearchParams(location.search);
        const paymentKey = query.get("paymentKey");
        const orderNo = query.get("orderId");
        const amount = query.get("amount");


        const tossCardPayment = async () => {
            try {
                const res = await axios.post(`${BASE_URL}/pay/toss-payment`, {
                    orderNo,
                    paymentKey,
                    amount,
                })
                console.log("서버 응답:", res.data);

                // alert("결제가 완료되었습니다.");
                navigate("/dining", { state: { refreshTables: true } });
            } catch (error) {
                console.error("Toss 결제 확인 실패", error);
                alert("결제확인 중 문제가 발생했습니다.");
                navigate("/paymentPage");
            }
        };

        useEffect(() => {
            const path = location.pathname;

            

            if (path.includes("success")){
                tossCardPayment();
            } else if (path.includes("fail")) {
                alert("결제가 실패하거나 취소되었습니다.");
                navigate("/paymentPage");
            }
        }, [location]);
    };


export default TossPayResult;