import React, { useContext, useState } from "react";
import "./dining.css";
import { useNavigate } from "react-router-dom";
import SettingDropDown  from "./SettingsDropDown";
import { TableContext } from "./TableContext";
import AlertBar from "./AlertBar";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Dining 화면

function Dining() {
    const {tables, fetchTables} = useContext(TableContext);
    
    // Alert 상태
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const [isMovingTable, setIsMovingTable] = useState(false); // 테이블 이동 상태 추가
    const [selectedTables, setSelectedTables] = useState([]); // 선택된 테이블 번호

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000); // 3초후 메시지사라짐
    };

    // 테이블 이동 모드 설정
    const startTableMove = () => {
        setIsMovingTable(true);
        setSelectedTables([]);
        showAlert("이동할 첫 번째 테이블을 선택하세요.");
    };

    // 테이블 이동 완료 후 백엔드로 요청 보내기
    const handleTableMove = async (sourceTableNo, targetTableNo) => {
        try {
            await axios.post(`${BASE_URL}/dining/move`, {
                sourceTableNo,
                targetTableNo,
            });
            showAlert(`테이블 ${sourceTableNo}번이 ${targetTableNo}번으로 이동되었습니다.`);
            fetchTables();
        } catch (error) {
            console.error("테이블 이동 중 오류:", error.response?.data || error.message);
            showAlert("테이블 이동에 실패했습니다.");
        }
        setIsMovingTable(false);
        setSelectedTables([]);
    };


    // 테이블 클릭 처리 함수
    const handleTableClick = (tableNo) => {
        if (isMovingTable) {
            // 자리 이동 상태일 경우
            if (selectedTables.length === 0) {
                setSelectedTables([tableNo]);
                showAlert("이동할 두 번째 테이블을 선택하세요.");
            } else if (selectedTables.length === 1 && selectedTables[0] !== tableNo) {
                handleTableMove(selectedTables[0], tableNo);
            }
        } else {
            // 자리 이동 상태가 아닐 경우 주문 페이지로 이동
            handleOrderTable(tableNo);
        }
    };


    // 테이블만들기 이동 navi
    const tableNavi = useNavigate();
    const handleCreateTable = () => {
        tableNavi("/editDining");
    };

    const handleOrderTable = (tableNo) => {
        if (!isMovingTable) {
            tableNavi(`/order/${tableNo}`);
        }
    }

    return (
        <div className="dining-container">
            <AlertBar message={alertMessage} isVisible={isAlertVisible}/>

            {tables === null || tables.length === 0 ? ( // 데이터가 없을 때 안내 메시지 표시
                <div className="no-table">
                    <p className="dining-no-table-header">아직 등록된 테이블이 없어요</p>
                    <p>우리 가게 테이블을 등록해서 사용해보세요</p>
                    <button className="create-table-button" onClick={handleCreateTable}>테이블 만들기</button>
                </div>
            ) : (
                <div className="table-list">
                    <SettingDropDown showAlert={showAlert} onTableMove={startTableMove} />
                    {tables.map((table)=> (
                        <div
                            key={table.tableNo}
                            className={`table-item ${selectedTables.includes(table.tableNo) ? "selected" : ""}`}
                            style={{
                                left: `${table.xPosition}px`,
                                top: `${table.yPosition}px`,
                                width: `${table.width}px`,
                                height: `${table.height}px`,
                                backgroundColor: table.status === "EMPTY"? "white" : table.tableColor, // 테이블이 비어있는지 아닌지에따라 색상변경
                                color: table.status === "EMPTY"? "gray": "white",
                                border: `2px solid ${table.tableColor}`,
                                position: "absolute",
                            }}
                            onClick={() => handleTableClick(table.tableNo)}
                        >
                            <div className="table-number"
                                >
                                    테이블 {table.tableNo}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dining;