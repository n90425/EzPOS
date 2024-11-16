import React, { useRef, useEffect } from "react";
import "./tableOptionsModal.css"

function TableOptionsModal({table, onClose, onUpdate, onDelete, position}){

    // 모달창 외부클릭시 모달닫기
    const modalRef = useRef(null); // 모달 DOM을 참조하는 useRef 생성

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // 클릭한 모달이 모달창 내부에있는지 확인하고 아닐경우 onClose 호출
            if(modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        // mousedown 이벤트를 추가하여 외부 클릭을 감지
        document.addEventListener("mousedown", handleOutsideClick);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [onClose]);
    // onClose 함수가 변경될때마다 useEffect가 다시 실행

    if(!table) return null;

    return (
        <div
            ref={modalRef} // 참조로 모달연결
            className="table-options-modal"
            style={{
                top: position.top,
                left: position.left,
                
            }}
        >
            <button className="close-button" onClick={onClose}>X</button>
            <h3>테이블 {table.tableNo} 옵션</h3>

            <div className="option-group">
                <label>테이블 색상</label>
                <div className="color-options">
                    {["orange", "blue", "red", "purple"].map((color) => (
                        <button
                            key={color}
                            style={{backgroundColor: color}}
                            className={`color-option ${table.tableColor === color ? "selected" : ""}`}
                            onClick={() => onUpdate({...table, tableColor:color })}
                        />
                    ))}
                </div>
            </div>

            <div className="option-group">
                <button onClick={() => onUpdate({...table, duplicated: true})}>복제</button>
                <button onClick={onDelete}>삭제</button>
            </div>
        </div>
    );
}

export default TableOptionsModal;