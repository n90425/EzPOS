import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";




function CreateTable(){
    const [backgroundColor, setBackgroundColor] = useState("light");
    const [textSize, setTextSize] = useState("normal");

    const tableNavi = useNavigate();
    const handleAddTable = () => {
        // 테이블 추가 로직
        // tableNavi("/newTable")
    };

    const handleSave = () => {
        // 테이블 저장 로직
        // tableNavi("/saveTable")
    }

    return (
        <div className="createTable-container">
            <div className="edit-header">
                <h2>테이블 편집</h2>
                <button className="save-button" onClick={handleSave}>저장하기</button>
            </div>

            <div className="tab-navigation">
                <button className="tab active"></button>
            </div>

            <div className="edit-main">
                {/* Grid Area */}
                <div className={`grid-area ${backgroundColor}`}></div>
                {/* 그리드 레이아웃 짜기 */}
            </div>

            <div className="editor-sidebar">
                <button className="add-table-button" onClick={handleAddTable}>
                    <span className="add-icon">+</span>
                </button>
            </div>
        </div>
    )
}

export default CreateTable;