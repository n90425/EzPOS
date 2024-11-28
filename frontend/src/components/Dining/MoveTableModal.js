import React, { useEffect, useState } from "react";

function MoveTableModal({tables, onClose, onMove}) {
    const [selectedTables, setSelectedTables] = useState([]);

    const handleTableClick = (tableNo) => {
        if (isMovingTable) {
            // 테이블 이동 모드일 때
            if (selectedTables.includes(tableNo)) {
                // 이미 선택된 테이블 클릭 시 선택 해제
                setSelectedTables(selectedTables.filter((t) => t !== tableNo));
            } else if (selectedTables.length < 2) {
                setSelectedTables([...selectedTables, tableNo]);
            }
    
            // 두 개의 테이블이 선택되면 이동 처리
            if (selectedTables.length === 1) {
                const [sourceTableNo, targetTableNo] = [selectedTables[0], tableNo];
                handleTableMove(sourceTableNo, targetTableNo);
                setIsMovingTable(false);
                setSelectedTables([]);
            }
        } else {
            // 이동 모드가 아닐 때, 테이블을 선택해서 주문 페이지로 이동
            handleOrderTable(tableNo);
        }
    };

    // 테이블 두개가 선택되면 이동 실행
    useEffect(() => {
        if(selectedTables.length === 2) {
            const [sourceTableNo, targetTableNo] = selectedTables;
            // 이동실행
            onMove(sourceTableNo, targetTableNo);
            // 선택 초기화
            setSelectedTables([]);
            onClose();
        }
    }, [selectedTables, onMove, onClose]);


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>이동할 테이블을 선택하세요</h2>
                    <button className="close-button" onClick={onClose}>닫기</button>
                </div>
                <div className="table-grid">
                    {tables.map((table) => (
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
                                onClick={()=> handleTableClick(table.tableNo)}
                        >
                            <div className="table-number">{`테이블 ${table.tableNo}`}</div>
                                {table.currentOrderNo && (
                                    <div className="table-detail">
                                        <p>{`주문번호: ${table.currentOrderNo}`}</p>
                                        <p>{`${table.totalPrice}원`}</p>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MoveTableModal;