import React from "react";
import "./tableOptionsModal.css"
import axios from "axios";

function TableOptionsModal({table, onClose, onUpdate, onDelete, position}){
    if(!table) return null;

    // const handleColorChange = async(color) => {
    //     const updatedTable = {...table, tableColor: color};

    //     try {
    //         const response = await axios.post(`${BASE_URL}/saveDining`, table);
    //     }
    // }

    return (
        <div className="table-options-modal"
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