import React, { useContext, useEffect, useState } from "react";
import { TableContext } from "./TableContext";
import TableOptionsModal from "./TableOptionsModal";
import axios from "axios";
import "./editDining.css";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditDining() {
    const {tables, setTables, fetchTables} = useContext(TableContext) // 화면에 배치된 테이블들의 배열
    const [isAddingTable, setIsAddingTable] = useState(false); // 현재 테이블을 추가하는중인지
    const [isDragging, setIsDragging] = useState(false); // 현재 드래그 중인지 확인
    const [selectedTable, setSelectedTable] = useState(null); // 테이블선택 모달창
    const [modalPosition, setModalPosition] = useState({top:0, left:0}); // 모달위치 초기화

    const navigate = useNavigate(); // navi 훅 추가
    const [settings, setSettings] = useState({
        backgroundColor: "light",
        textSize: "normal",
    });

    const [newTable, setNewTable] = useState(null); // 새 테이블 상태

    // 마우스를 눌렀을때 새 테이블을 생성
    const handleMouseDown = async (e) => {
        if (!isAddingTable) return; // 테이블 추가 상태가 아니면 동작하지 않음
        setIsDragging(true);

        const editor = e.currentTarget.getBoundingClientRect();
        const startX = parseFloat((e.clientX - editor.left).toFixed(2)); // 사용자가 마우스를 누른위치
        const startY = parseFloat((e.clientY - editor.top).toFixed(2)); // 소수점 2자리로 변환

        try {
            const nextTableNo = await getNextTableNo();

            const newTableData = {
                tableNo: nextTableNo,
                xPosition: startX,
                yPosition: startY,
                width: 0,
                height: 0,
                tableColor: "blue",
            };

            setNewTable(newTableData);
        } catch (error) {
            console.error("새 테이블을 추가하는중 오류발생: ", error);
        }
    };

    // 드래그 중 테이블 크기 설정
    const handleMouseMove = (e) => {
        if (!isDragging || !newTable) return;

        const editor = document.querySelector(".editor-main").getBoundingClientRect();
        const currentX = parseFloat((e.clientX - editor.left).toFixed(2)); // 사용자가 마우스를 누른위치
        const currentY = parseFloat((e.clientY - editor.top).toFixed(2)); // 소수점 2자리로 변환

        setNewTable((prevTable) => ({
            ...prevTable,
            width: Math.abs(currentX - prevTable.xPosition),
            height: Math.abs(currentY - prevTable.yPosition),
        }));
    };

    // 마우스 떼었을 때 테이블 크기 확정 및 서버 저장
    const handleMouseUp = async () => {
        if (!isDragging || !newTable) return;
        setIsDragging(false);
        setIsAddingTable(false)
    
        if (newTable.width <= 0 || newTable.height <= 0) {
            setNewTable(null); // 크기가 없는 경우 무시
        } else {
            try {
                await handleSave(newTable); // 새 테이블 저장
                setTables((prevTables) => [...prevTables, newTable]);
                setNewTable(null); // 새 테이블 초기화
            } catch (error) {
                console.error("테이블 저장 중 오류 발생:", error);
            }
        }
    };

    const getNextTableNo = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/nextTableNo`);
            return response.data;
        } catch(error) {
            console.error("빈 테이블번호를 가져오는중 에러발생 getNextTableNo: ", error);
            throw error;
        }
    }

    // 서버에 단일 테이블만 저장
    const handleSave = async (table) => {
        try {
            const response = await axios.post(`${BASE_URL}/saveDining`, table);
            return response.data
        } catch(error) {
            console.error("테이블저장중 오류발생 handleSave: ", error.response ? error.response.data : error);
            throw error;
        }
    }

    // 서버에 테이블 List형태로 전체 저장
    const handleSaveAll = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/saveDiningAll`, tables); // 리스트 형태로 전송
            console.log("테이블 저장 성공:", response.data);
            fetchTables(); // 저장후 테이블목록 새로고침
            navigate("/dining");
        } catch (error) {
            console.log(JSON.stringify(tables));
            console.error("테이블 저장 중 오류 발생 handleSaveAll: ", error.response ? error.response.data : error);
        }
    };

    // 서버에서 테이블 삭제
    const handleDelete = async (tableNo) => {
        try {
            const response = await axios.post(`${BASE_URL}/deleteDining`, { tableNo });
            console.log("테이블 삭제 성공:", response.data);
            fetchTables();
            closeModal();
        } catch (error) {
            console.error("테이블 삭제 중 오류 발생", error);
        }
    };
    


    // 테이블 클릭시 선택된 테이블의 모달위치 설정
    const handleTableclick = (table, event) => {
        setSelectedTable(table);

        const tableRect = event.currentTarget.getBoundingClientRect();
        const modalWidth = 150;
        const offset=10;

        const leftPosition = tableRect.right + offset + modalWidth > window.innerWidth
            ? window.innerWidth - modalWidth - offset
            : tableRect.right + offset;

        setModalPosition({
            top: tableRect.top + window.scrollY,
            left: leftPosition + window.scrollX
        });
        
    };

    // 모달창 닫기
    const closeModal = () => {
        setSelectedTable(null);
    }

    // 테이블 상태변경
    const handleAddTableClick = () => {
        setIsAddingTable(true);
    };


    // 테이블 위치 업데이트
    const updateTablePosition = (index, x, y) => {
        setTables((prevTables) => {
            const updatedTables = [...prevTables];
            updatedTables[index] = {
                ...updatedTables[index],
                xPosition: parseFloat((x.toFixed(2))),
                yPosition: parseFloat((y.toFixed(2))),
            };
            return updatedTables;
        });
        
    };


    return (
        <div className="dining-editor-container">
            <div className="editor-header">
                <h2>테이블 편집</h2>
                <button className="save-button" onClick={handleSaveAll}>저장하기</button>
            </div>

            <div className="tab-navigation">
                <button className="tab active">1층</button>
                <button className="tab">야외 테라스</button>
                <button className="tab">루프탑</button>
                <button className="tab">2층</button>
            </div>

            {/* isAddingTable이 활성화된 상태에서 마우스를 누르면 handleMouseDown이 호출 */}
            <div className="editor-main" 
                onMouseDown={isAddingTable ? handleMouseDown : null}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}>
                <div className={`grid-area ${settings.backgroundColor}`}>
                
                    {tables.map((table, index) => ( // tables를 순회
                        <Draggable
                            key={table.tableNo || index}
                            position={{x: table.xPosition, y:table.yPosition}}
                            bounds=".grid-area"
                            onStop={(e, data) => updateTablePosition(index, data.x, data.y)}>
                            <div
                                className={`table-item ${settings.textSize}`}
                                style={{
                                    position: "absolute",
                                    width: table.width,
                                    height: table.height,
                                    backgroundColor: table.status === "EMPTY"? "white" : table.tableColor, // 테이블이 비어있는지 아닌지에따라 색상변경
                                    color: table.status === "EMPTY"? table.tableColor: "white",
                                    border: `2px solid ${table.tableColor}`,
                                }}
                                onClick={(event)=> handleTableclick(table, event)}
                            >
                            테이블 {table.tableNo}
                            </div>
                        </Draggable>
                    ))}
                    {newTable && (
                        <div
                            className="table-item"
                            style={{
                                position: "absolute",
                                width: newTable.width,
                                height: newTable.height,
                                backgroundColor: newTable.tableColor,
                                left: newTable.xPosition,
                                top: newTable.yPosition,
                            }}
                        >
                            테이블 {newTable.tableNo}
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
                        <button className={`background-button ${settings.backgroundColor === "light" ? "selected" : ""}`}
                            onClick={() => setSettings({ ...settings, backgroundColor: "light" })}>밝은
                        </button>
                        <button className={`background-button ${settings.backgroundColor === "dark" ? "selected" : ""}`} onClick={() => setSettings({ ...settings, backgroundColor: "dark" })}>어두운</button>
                        <p>테이블 글자 크기</p>
                        <button className={`text-size-button ${settings.textSize === "normal" ? "selected" : ""}`} onClick={() => setSettings({ ...settings, textSize: "normal" })}>기본</button>
                        <button className={`text-size-button ${settings.textSize === "large" ? "selected" : ""}`} onClick={() => setSettings({ ...settings, textSize: "large" })}>큰 글씨</button>
                    </div>
                </div>

                {selectedTable && (
                    <TableOptionsModal
                        table={selectedTable}
                        onClose={closeModal}
                        onUpdate={(updatedTable) => {
                            setTables((prevTables) =>
                                prevTables.map((table) =>
                                    table.tableNo === updatedTable.tableNo
                                        ? { ...table, ...updatedTable }  : table
                                )
                            );
                            setSelectedTable(updatedTable)
                        }}
                        position={modalPosition}
                        onDelete={() => handleDelete(selectedTable.tableNo)}
                    />
                )}
            </div>
        </div>
    );
}

export default EditDining;