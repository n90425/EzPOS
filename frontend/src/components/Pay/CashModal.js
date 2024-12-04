import React, { useState } from "react";
import "./cashmodal.css";

const CashModal = ({ onClose, onSkip, onPaymentComplete }) => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // 확인버튼 클릭 시 실행
    const handleConfirm = async () => {
        if (inputValue.trim() === "") {
            alert("번호를 입력하세요!");
            return;
        }

        // 입력값 유효성 검사 (휴대폰번호 또는 사업자번호 형식)
        const isPhone = inputValue.startsWith("010") && inputValue.length === 11;
        const isBusiness = !isPhone && inputValue.length === 10; // 사업자번호는 10자리로 가정

        if (!isPhone && !isBusiness) {
            alert("유효한 휴대폰번호 또는 사업자번호를 입력하세요.");
            return;
        }

        setLoading(true); // 로딩 상태 활성화
        try {
            await onPaymentComplete(
                inputValue, // 영수증 번호
                isPhone ? "PHONE" : "BUSINESS" // 유형 판별
            );
        } catch (error) {
            console.error("현금 영수증 발급 실패:", error);
        } finally {
            setLoading(false); // 로딩 상태 비활성화
        }
    };

    return (
        <div className="cash-modal-overlay">
            <div className="cash-modal-content">
                <h3>현금 영수증을 신청할까요?</h3>
                <p>휴대폰번호 또는 사업자번호를 입력하세요</p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="번호를 입력하세요"
                    maxLength="11" // 입력값 제한 (휴대폰번호 최대 11자리)
                />
                <p className="cash-modal-note">
                    - 고객용 키패드로도 입력할 수 있습니다.<br />
                    - 현금영수증 카드인 경우 카드를 읽어주세요.
                </p>
                <div className="cash-modal-button">
                    <button onClick={onClose} disabled={loading}>
                        취소
                    </button>
                    <button onClick={onSkip} disabled={loading}>
                        현금영수증 안하기
                    </button>
                    <button onClick={handleConfirm} disabled={loading}>
                        {loading ? "처리 중..." : "확인"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CashModal;
