import React, { useState } from "react";
import "./cardmodal.css";

const CardModal = ({ onClose, onPaymentComplete }) => {
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!cardNumber || !expiryDate || !cvv) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            await onPaymentComplete(cardNumber, expiryDate, cvv);
        } catch (error) {
            console.error("카드 결제 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-modal-overlay">
            <div className="card-modal-content">
                <h3>카드 결제</h3>
                <input
                    type="text"
                    placeholder="카드 번호 (16자리)"
                    maxLength="16"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="만료일 (MM/YY)"
                    maxLength="5"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="CVV (3자리)"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                />
                <div className="card-modal-buttons">
                    <button onClick={onClose} disabled={loading}>취소</button>
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? "처리 중..." : "결제"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardModal;
