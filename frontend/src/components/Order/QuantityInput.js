import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import "./queryInput.css"

export default function QuantityInput ({quantity, onClick}) {
    // 주문상세에서 수량변경 버튼클릭시 로직
    const handleChangeInput= (e) => {
        const newValue = parseInt(e.target.value, 10);
        console.log(e.target);
        if (isNaN(newValue) || newValue < 1) return
        onClick(newValue); // 부모 컴포넌트로 새로운 값 전달
        // 8-3 5, 2-5 -3
        
    };
    return (
        <div className="queryDiv">          
            <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => onClick(quantity-1)}
            >
                <FontAwesomeIcon icon={faMinus} size="1x"/>
            </button>    
            <input className="queryInput"
                min={1}
                max={999}
                value={quantity}
                onChange={handleChangeInput}
            />
            <button
                type="button"
                disabled={quantity>999}
                onClick={()=> onClick(quantity+1)}
            >
                <FontAwesomeIcon icon={faPlus} size="1x"/>
            </button>
        </div>
    );

}