import React, { useContext, useState } from "react";
import "./dining.css";
import { useNavigate } from "react-router-dom";
import SettingDropDown  from "./SettingsDropDown";
import MoveTableModal from "./MoveTableModal";
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

     // 테이블 이동 모달 상태
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000); // 3초후 메시지사라짐
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
    };


    // 테이블만들기 이동 navi
    const tableNavi = useNavigate();
    const handleCreateTable = () => {
        tableNavi("/editDining");
    };

    const handleOrderTable = (tableNo) => {
        tableNavi(`/order/${tableNo}`);
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
                    <SettingDropDown showAlert={showAlert} onTableMove={() => setIsMoveModalOpen(true)} />
                    {tables.map((table)=> (
                        <div
                            key={table.tableNo}
                            className="table-item"
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
                            onClick={() => handleOrderTable(table.tableNo)}
                        >
                            <div className="table-number"
                                >
                                    테이블 {table.tableNo}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* 테이블 이동 모달 */}
            {isMoveModalOpen && (
                <MoveTableModal
                    tables={tables}
                    onClose={() => setIsMoveModalOpen(false)}
                    onMove={handleTableMove}
                />
            )}
        </div>
    );
}

export default Dining;