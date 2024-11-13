import React, { useState, useEffect } from "react";

import axios from "axios";
import "./editDining.css";
import Draggable from "react-draggable";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditDining() {
    const [backgroundColor, setBackgroundColor] = useState("light");
    const [textSize, setTextSize] = useState("normal");
    const [tables, setTables] = useState([]); // 화면에 배치된 테이블들의 배열
    const [isAddingTable, setIsAddingTable] = useState(false); // 현재 테이블을 추가하는중인지
    const [tempTable, setTempTable] = useState(null); // 추가중인 임시테이블

    const handleSave = async () => {
        const validatedTables = tables.map((table) => ({
            ...table,
            xPosition: table.xPosition !== null ? parseFloat(table.xPosition.toFixed(2)) : 0.0,
            yPosition: table.yPosition !== null ? parseFloat(table.yPosition.toFixed(2)) : 0.0,
        }));
        console.log(JSON.stringify(validatedTables))

        try {
            await axios.post(`${BASE_URL}/saveDining`, validatedTables, {
            });
        } catch (error) {
            console.error("테이블 저장 중 오류 발생", error);
        }
    };

    const handleAddTableClick = () => {
        setIsAddingTable(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (tempTable) {
                const editor = document.querySelector(".editor-main").getBoundingClientRect();
                const currentX = e.clientX - editor.left;
                const currentY = e.clientY - editor.top;

                setTempTable((prevTable) => ({
                    ...prevTable,
                    width: Math.abs(currentX - prevTable.xPosition),
                    height: Math.abs(currentY - prevTable.yPosition),
                    xPosition: Math.min(prevTable.xPosition, currentX),
                    yPosition: Math.min(prevTable.yPosition, currentY),
                }));
            }
        };

        const handleMouseUp = () => {
            if (tempTable && tempTable.width > 0 && tempTable.height > 0) {
                setTables((prevTables) => [...prevTables, tempTable]);
                console.log("테이블 추가됨:", tempTable);
            } else {
                console.log("유효하지 않은 테이블 크기입니다.");
            }
            setIsAddingTable(false);
            setTempTable(null);

            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        if (isAddingTable) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

    }, [isAddingTable, tempTable, tables]); // useEffect, isAddingTable, tempTable 상태가 변경될때마다 실행

    const handleMouseDown = (e) => {
        if (!isAddingTable) return;

        const editor = e.currentTarget.getBoundingClientRect();
        const startX = e.clientX - editor.left; // 사용자가 마우스를 누른위치
        const startY = e.clientY - editor.top;

        setTempTable({
            tableNo: tables.length + 1,
            xPosition: parseFloat(startX.toFixed(2)),
            yPosition: parseFloat(startY.toFixed(2)),
            width: 0,
            height: 0,
            tableColor: "blue",
        });
    };

    const updateTablePosition = (index, x, y) => {
        setTables((prevTables) => {
            const updatedTables = [...prevTables];
            updatedTables[index] = {
                ...updatedTables[index],
                xPosition: parseFloat(x.toFixed(2)),
                yPosition: parseFloat(y.toFixed(2)),
            };
            return updatedTables;
        });
    };


    return (
        <div className="dining-editor-container">
            <div className="editor-header">
                <h2>테이블 편집</h2>
                <button className="save-button" onClick={handleSave}>저장하기</button>
            </div>

            <div className="tab-navigation">
                <button className="tab active">1층</button>
                <button className="tab">야외 테라스</button>
                <button className="tab">루프탑</button>
                <button className="tab">2층</button>
            </div>

            {/* isAddingTable이 활성화된 상태에서 마우스를 누르면 handleMouseDown이 호출 */}
            <div className="editor-main" onMouseDown={isAddingTable ? handleMouseDown : null}>
                <div className="grid-area">
                    {tables.map((table, index) => ( // tables를 순회
                        <Draggable
                            key={table.tableNo}
                            defaultPosition={{x: table.xPosition, y:table.yPosition}}
                            onStop={(e, data) => updateTablePosition(index, data.x, data.y)}>
                            <div
                                className="table-item"
                                style={{
                                    position: "absolute",
                                    width: table.width,
                                    height: table.height,
                                    fontSize: textSize === "large" ? "1.5em" : "1em",
                                    backgroundColor: table.tableColor,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                            테이블 {table.tableNo}
                            </div>
                        </Draggable>
                    ))}
                    {tempTable && ( // 임시테이블
                        <div
                            className="table-item temp-table"
                            style={{
                                position: "absolute",
                                left: tempTable.xPosition,
                                top: tempTable.yPosition,
                                width: tempTable.width,
                                height: tempTable.height,
                                backgroundColor: tempTable.tableColor,
                                opacity: 0.5,
                            }}
                        >
                            테이블 {tempTable.tableNo}
                        </div>
                    )}
                </div>
                <div className="editor-sidebar">
                    <button className="add-table-button" onClick={handleAddTableClick}>
                        <span className="add-icon">+</span>
                        <span>테이블 추가</span>
                    </button>
                    <div className="sidebar-options">
                        <p>배경색</p>
                        <button className={`background-button ${backgroundColor === "light" ? "selected" : ""}`} onClick={() => setBackgroundColor("light")}>밝은</button>
                        <button className={`background-button ${backgroundColor === "dark" ? "selected" : ""}`} onClick={() => setBackgroundColor("dark")}>어두운</button>
                        <p>테이블 글자 크기</p>
                        <button className={`text-size-button ${textSize === "normal" ? "selected" : ""}`} onClick={() => setTextSize("normal")}>기본</button>
                        <button className={`text-size-button ${textSize === "large" ? "selected" : ""}`} onClick={() => setTextSize("large")}>큰 글씨</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditDining;