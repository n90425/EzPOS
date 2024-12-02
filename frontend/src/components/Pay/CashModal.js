import React, {useState} from "react";
import "./cashmodal.css";

const CashModal = ({ onClose, onSkip }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleConfirm = () => {
        if (inputValue.trim() === "") {
            alert("번호를 입력하세요!");
            return;
        }
        console.log("현금 영수증 정보:", inputValue);
        alert("현금 영수증이 발급되었습니다!");
        onclose();
    }

    return (
        <div className="cash-modal-overlay">
            <div className="cash-modal-content">
                <h3>현금 영수증을 신청할까요?</h3>
                <p>휴대폰번호 또는 사업자번호</p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="번호를 입력하세요"
                />
                <p className="cash-modal-note">
                    -고객용 키패드로도 입력할 수 있습니다.<br />
                    -현금여수증 카드인 경우 카드를 읽어주세요.
                </p>
                <div className="cash-modal-button">
                    <button onClick={onClose}>취소</button>
                    <button onClick={onSkip}>현금영수증 안하기</button>
                    <button onClick={handleConfirm}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default CashModal;