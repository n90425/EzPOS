import React, { useContext, useEffect, useState } from "react";
import "./dining.css";
import { useNavigate, useLocation } from "react-router-dom";
import SettingDropDown  from "./SettingsDropDown";
import MoveTableModal from "./MoveTableModal";
import MergeTableModal from "./MergeTableModal";
import { TableContext } from "./TableContext";
import AlertBar from "./AlertBar";
import axios from "axios";
import useOrderDetail from "../../hooks/useOrderDetail";
import useOrder from "../../hooks/useOrder";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Dining 화면
function Dining() {
    const {tables, fetchTables} = useContext(TableContext);
    const {orderDetails, setOrderDetails} = useOrderDetail();
    const { deleteOrder } = useOrder();
    
    // Alert 상태
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

     // 테이블 이동 모달 상태
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    // 테이블 합석 모달 상태
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

    // useLocation으로 전달받은 상태
    const location = useLocation();


    // 특정 테이블 번호(tableNo)에 연결된 주문 정보와 메뉴 이름을 가져온다
    const fetchTableDetails = async (tableNo) => {
        
        const response = await axios.get(`${BASE_URL}/dining/${tableNo}/details`);
        return response.data;
    };

    // 주문 상세 내역(orderDetails)과 메뉴 이름(menuNames)을 표시
    const renderTableDetails = ({ orderDetails, menuNames }) => {
        const totalAmount = orderDetails.reduce(
            (acc, detail) => acc + detail.unitPrice * detail.quantity,
            0
        );
        return (
            <div className="dining-order-details">
                {orderDetails.map((detail, index) => (
                    <div key={detail.ordDetailNo} className="dining-order-item">
                        <div className="menu-name">{menuNames[index]}</div>
                        <div className="menu-quantity">{detail.quantity}</div>
                    </div>
                ))}
                {/* 총 금액 표시 */}
                <div className="total-price">
                    {totalAmount.toLocaleString()}원
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const updatedDetails = [];
                for (let table of tables) {
                    if (table.status === "OCCUPIED") {
                        const response = await fetchTableDetails(table.tableNo);
                        if (response) {
                            const orderDetails = response.orderDetails || [];
                            const menuNames = response.menuNames || [];

                            if (orderDetails.length === 0){
                                await deleteOrder(table.tableNo);
                                table.status = "EMPTY";
                            } else {
                                updatedDetails.push({
                                    tableNo: table.tableNo,
                                    orderDetails,
                                    menuNames,
                                });
                            }
                        }
                    }
                }
                setOrderDetails(updatedDetails); // 데이터를 배열로 저장
            } catch (error) {
                console.error("Error fetching table details:", error);
            }
        };
        fetchDetails();
        
    }, [tables]);

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

    const handleTableMerge = async (sourceTableNo, targetTableNo) => {
        try {
            await axios.post(`${BASE_URL}/dining/merge`, {
                sourceTableNo,
                targetTableNo,
            });
            showAlert(`테이블 ${sourceTableNo}번이 ${targetTableNo}번으로 합석이 완료되었습니다.`);
            fetchTables();
        } catch (error) {
            console.error("테이블 합석중 오류:",error.response?.data || error.message);
            showAlert("테이블 합석이 실패했습니다.");
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
                    <SettingDropDown showAlert={showAlert} onTableMove={() => setIsMoveModalOpen(true)} onTableMerge={()=>setIsMergeModalOpen(true)}/>
                    {tables.map((table) => {
                    const tableData  =orderDetails.find((data) => data.tableNo === table.tableNo) || {};
                    const { orderDetails: details = [], menuNames = [] } = tableData ;
                    return (
                        <div
                            key={table.tableNo}
                            className="table-item"
                            style={{
                                left: `${table.xPosition}px`,
                                top: `${table.yPosition}px`,
                                width: `${table.width}px`,
                                height: `${table.height}px`,
                                backgroundColor: table.status === "EMPTY" ? "white" : table.tableColor,
                                color: table.status === "EMPTY" ? "gray" : "white",
                                border: `2px solid ${table.tableColor}`,
                                position: "absolute",
                            }}
                            onClick={() => handleOrderTable(table.tableNo)}
                        >
                            <div className="table-number">
                                <p>테이블 {table.tableNo}</p>
                                {table.status === "OCCUPIED" && renderTableDetails({
                                    orderDetails: details,
                                    menuNames
                                })}
                            </div>
                        </div>
                    );
                })}
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
            {/* 테이블 합석 모달 */}
            {isMergeModalOpen && (
                <MergeTableModal
                    tables={tables}
                    onClose={() => setIsMergeModalOpen(false)}
                    onMerge={handleTableMerge}
                />
            )}
        </div>
    );
}

export default Dining;