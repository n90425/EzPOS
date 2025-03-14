import { useState } from "react";

// Alert 메세지를 띄우고, 3초후에 메세지가 사라짐
export default function useAlert(){
    // Alert 상태
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000); // 3초후 메시지사라짐
    };

    return {alertMessage, isAlertVisible, showAlert};
}