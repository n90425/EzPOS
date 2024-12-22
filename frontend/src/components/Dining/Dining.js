import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import "./dining.css";
import { useNavigate, useLocation } from "react-router-dom";
import SettingDropDown from "./SettingsDropDown";
import MoveTableModal from "./MoveTableModal";
import { TableContext } from "./TableContext";
import AlertBar from "./AlertBar";
import axios from "axios";
import useOrderDetail from "../../hooks/useOrderDetail";
import useOrder from "../../hooks/useOrder";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Dining 화면
function Dining() {
    const { tables, fetchTables } = useContext(TableContext);
    const { orderDetails, setOrderDetails } = useOrderDetail();
    const { deleteOrder } = useOrder();

    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isFetching = useRef(false); // 중복 실행 방지용
    const previousTables = useRef([]); // 이전 테이블 상태 추적

    // 특정 테이블 번호(tableNo)에 연결된 주문 정보와 메뉴 이름을 가져온다
    const fetchTableDetails = useCallback(async (tableNo) => {
        try {
            const response = await axios.get(`${BASE_URL}/dining/${tableNo}/details`);
            return response.data || { orderDetails: [], menuNames: [] }; // 데이터가 없을 경우 기본 값 반환
        } catch (error) {
            console.error("Failed to fetch table details:", error);
            return { orderDetails: [], menuNames: [] }; // 에러 발생 시 기본 값 반환
        }
    }, []);

    // 주문 상세 내역을 불러오는 함수
    const fetchDetails = useCallback(async () => {
        if (isFetching.current) return; // 중복 실행 방지
        isFetching.current = true;

        try {
            const updatedDetails = [];
            for (let table of tables) {
                if (table.status === "OCCUPIED") {
                    const response = await fetchTableDetails(table.tableNo);

                    // response가 유효한지 확인
                    if (response && Array.isArray(response.orderDetails)) {
                        if (response.orderDetails.length === 0) {
                            await deleteOrder(table.tableNo);
                        } else {
                            updatedDetails.push({
                                tableNo: table.tableNo,
                                orderDetails: response.orderDetails,
                                menuNames: response.menuNames,
                            });
                        }
                    } else {
                        console.warn(`Invalid response for table ${table.tableNo}:`, response);
                    }
                }
            }

            // 상태 변경 조건 확인 후 업데이트
            setOrderDetails((prevDetails) => {
                // 기존 상태와 새 상태를 비교하여 같으면 업데이트하지 않음
                if (JSON.stringify(prevDetails) !== JSON.stringify(updatedDetails)) {
                    return updatedDetails;
                }
                return prevDetails;
            });
        } catch (error) {
            console.error("Error fetching table details:", error);
        } finally {
            isFetching.current = false;
        }
    }, [tables, fetchTableDetails, deleteOrder, setOrderDetails]);

    // Alert 메시지 표시
    const showAlert = useCallback((message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 3000);
    }, []);

    // 테이블 이동 처리
    const handleTableMove = useCallback(async (sourceTableNo, targetTableNo) => {
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
    }, [fetchTables, showAlert]);

    const handleCreateTable = useCallback(() => navigate("/editDining"), [navigate]);

    const handleOrderTable = useCallback((tableNo) => navigate(`/order/${tableNo}`), [navigate]);

    // 테이블 상태 변화 감지 및 fetchDetails 호출
    useEffect(() => {
        if (Array.isArray(tables) && tables.length > 0) {
            const occupiedTables = tables.filter((table) => table.status === "OCCUPIED");
            const previousOccupiedTables = previousTables.current.filter(
                (table) => table.status === "OCCUPIED"
            );

            // 테이블 상태가 변경된 경우에만 fetchDetails 호출
            if (JSON.stringify(occupiedTables) !== JSON.stringify(previousOccupiedTables)) {
                console.log("Fetching details for tables:", occupiedTables);
                fetchDetails();
            }

            // 현재 테이블 상태 저장
            previousTables.current = tables;
        }
    }, [tables, fetchDetails]);

    // location.state에 따른 테이블 새로고침
    useEffect(() => {
        if (location.state?.refreshTables) {
            fetchTables();
        }
    }, [location.state]);

    // 주문 상세 내역과 메뉴 이름을 표시
    const renderTableDetails = useCallback(({ orderDetails, menuNames }) => {
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
                <div className="total-price"> {totalAmount.toLocaleString()}원 </div>
            </div>
        );
    }, []);

    return (
        <div className="dining-container">
            <AlertBar message={alertMessage} isVisible={isAlertVisible} />

            {tables === null || tables.length === 0 ? (
                <div className="no-table">
                    <p className="dining-no-table-header">아직 등록된 테이블이 없어요</p>
                    <p>우리 가게 테이블을 등록해서 사용해보세요</p>
                    <button className="create-table-button" onClick={handleCreateTable}>
                        테이블 만들기
                    </button>
                </div>
            ) : (
                <div className="table-list">
                    <SettingDropDown showAlert={showAlert} onTableMove={() => setIsMoveModalOpen(true)} />
                    {tables.map((table) => {
                        const tableData =
                            orderDetails.find((data) => data.tableNo === table.tableNo) || {};
                        const { orderDetails: details = [], menuNames = [] } = tableData;

                        return (
                            <div
                                key={table.tableNo}
                                className="table-item"
                                style={{
                                    left: `${table.xPosition}px`,
                                    top: `${table.yPosition}px`,
                                    width: `${table.width}px`,
                                    height: `${table.height}px`,
                                    backgroundColor:
                                        table.status === "EMPTY" ? "white" : table.tableColor,
                                    color: table.status === "EMPTY" ? "gray" : "white",
                                    border: `2px solid ${table.tableColor}`,
                                    position: "absolute",
                                }}
                                onClick={() => handleOrderTable(table.tableNo)}
                            >
                                <div className="table-number">
                                    <p>테이블 {table.tableNo}</p>
                                    {table.status === "OCCUPIED" &&
                                        renderTableDetails({
                                            orderDetails: details,
                                            menuNames,
                                        })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
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
