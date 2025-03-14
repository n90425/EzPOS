import "./tableSelectionModal.css";
import { useState, useEffect } from "react";

function TableSelectionModal ({title, tables, onClose, onConfirm}) {
    const [selectedTables, setSelectedTables] = useState([]);
    

    const handleTableClick = (tableNo) => {
        if (selectedTables.includes(tableNo)) {
            // 이미 선택된 테이블 클릭 시 선택 해제
            setSelectedTables(selectedTables.filter((t) => t !== tableNo));
        } else if (selectedTables.length < 2) {
            setSelectedTables([...selectedTables, tableNo]);
        }
    };

    // 테이블 두개가 선택되면 이동 실행
    useEffect(() => {
        if(selectedTables.length === 2) {
            const [sourceTableNo, targetTableNo] = selectedTables;
            // 이동이나 합석실행
            onConfirm(sourceTableNo, targetTableNo);
            // 선택 초기화
            setSelectedTables([]);
            onClose();
        }
    }, [selectedTables, onConfirm, onClose]);


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h5>{title}</h5>
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TableSelectionModal;