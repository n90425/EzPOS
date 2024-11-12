import React, { useState } from "react";
import NewDining from "./NewDining";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./editDining.css"

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditDining(){
    const [backgroundColor, setBackgroundColor] = useState("light"); // 백그라운드설정
    const [textSize, setTextSize] = useState("normal"); // 텍스트사이즈설정
    const [tables, setTables] = useState([]); // 테이블목록상태


    const handleSave = async() => {
        // 테이블 저장 로직
        try {
            await axios.post(`${BASE_URL}/saveDining`, tables);
        } catch (error){
            console.error("테이블저장중 오류발생", error)
        }
    }

    return (
        <div className="dining-editor-container">
            {/* Header */}
            <div className="editor-header">
                <h2>테이블 편집</h2>
                <button className="save-button" onClick={handleSave}>저장하기</button>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button className="tab active">1층</button>
                <button className="tab">야외 테라스</button>
                <button className="tab">루프탑</button>
                <button className="tab">2층</button>
            </div>

            {/* Main Content */}
            <div className="editor-main">
                {/* NewDining 컴포넌트를 사용하여 그리드 영역 관리 */}
                <NewDining tables={tables} setTables={setTables} textSize={textSize} />

                {/* Sidebar */}
                <div className="editor-sidebar">
                    <div className="sidebar-options">
                        <p>배경색</p>
                        <button
                            className={`background-button ${backgroundColor === "light" ? "selected" : ""}`}
                            onClick={() => setBackgroundColor("light")}
                        >
                            밝은
                        </button>
                        <button
                            className={`background-button ${backgroundColor === "dark" ? "selected" : ""}`}
                            onClick={() => setBackgroundColor("dark")}
                        >
                            어두운
                        </button>
                        <p>테이블 글자 크기</p>
                        <button
                            className={`text-size-button ${textSize === "normal" ? "selected" : ""}`}
                            onClick={() => setTextSize("normal")}
                        >
                            기본
                        </button>
                        <button
                            className={`text-size-button ${textSize === "large" ? "selected" : ""}`}
                            onClick={() => setTextSize("large")}
                        >
                            큰 글씨
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditDining;