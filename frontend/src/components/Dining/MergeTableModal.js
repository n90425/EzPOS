import React, { useEffect, useState } from "react";

function MergeTableModal({tables, onClose, onMerge}) {
    const [selectedTables, setSelectedTables] = useState([]);

    const handleTableClick = (tableNo) => {
        if(selectedTables.includes(tableNo)){
            setSelectedTables(selectedTables.filter((t) => t!=tableNo));
        } else if(selectedTables.length < 2){
            setSelectedTables([...selectedTables, tableNo]);
        }
    };

    useEffect(()=> {
        if(selectedTables.length === 2){
            const [sourceTableNo, targetTableNo] = selectedTables;

            onMerge(sourceTableNo, targetTableNo);
            setSelectedTables([]);
            onClose();
        }
    }, [selectedTables, onMerge, onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h5>합석할 테이블을 선택하세요</h5>
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

export default MergeTableModal;