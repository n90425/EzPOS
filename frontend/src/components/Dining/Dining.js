import React, { useContext, useEffect, useState } from "react";
import "./dining.css";
import { useNavigate, useLocation } from "react-router-dom";
import SettingDropDown  from "./SettingsDropDown";
import MoveTableModal from "./MoveTableModal";
import { TableContext } from "./TableContext";
import AlertBar from "./AlertBar";
import axios from "axios";
import useOrder from "./../../hooks/useOrder";
import useOrderDetail from "../../hooks/useOrderDetail";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Dining 화면

function Dining() {
    const {tables, fetchTables} = useContext(TableContext);
    const { orderNo, fetchOrder } = useOrder();
    const {orderDetails, fetchOrderDetails} = useOrderDetail();
    const totalAmount = orderDetails.reduce((acc, item) => acc + item.totalAmount, 0);
    
    
    // Alert 상태
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

     // 테이블 이동 모달 상태
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    
    // useLocation으로 전달받은 상태
    const location = useLocation();


    // // 테이블 정보를 가져오는 useEffect
    // useEffect(() => {
    //     fetchTables(); // 테이블 정보 가져오기
    // }, []);

    // // 주문 상세 정보를 가져오는 useEffect
    // useEffect(() => {
    //     console.log(fetchOrder)
    //     if (tables && tables.length > 0) {
    //         tables.forEach((table) => {
    //             fetchOrderDetails(table.orderNo); // 각 테이블의 주문번호로 상세 정보 가져오기
    //         });
    //     }
    // }, [tables]);
    useEffect(() => {
        // location.state에서 전달받은 refreshTables가 true라면 fetchTables 호출
        if (location.state?.refreshTables) {
            fetchTables();
        }
    }, [location.state]);

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
                                    <p>테이블 {table.tableNo}</p>
                                    <div className="dining-order-item">
                                        {orderDetails
                                        .filter((detail)=>detail.orderNo === table.orderNo)
                                        .map((detail) => (
                                            <div key={detail.ordDetailNo} className="dining-order-item">
                                                <div className="dining-order-info">
                                                    <p>{detail.menuName}</p>
                                                    <p>{detail.quantity}</p>
                                                    <p>{totalAmount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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