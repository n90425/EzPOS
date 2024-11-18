import React, { useContext } from "react";
import "./dining.css";
import { useNavigate } from "react-router-dom";
import SettingDropDown  from "./SettingsDropDown";
import { TableContext } from "./TableContext";


function Dining() {
    const {tables} = useContext(TableContext); // 초기 상태를 null로 설정

    // 테이블만들기 이동 navi
    const tableNavi = useNavigate();
    const handleCreateTable = () => {
        tableNavi("/editDining");
    };

    return (
        <div className="dining-container">
            <div>
                <SettingDropDown/>
            </div>

            {tables === null || tables.length === 0 ? ( // 데이터가 없을 때 안내 메시지 표시
                <div className="no-table">
                    <p className="dining-no-table-header">아직 등록된 테이블이 없어요</p>
                    <p>우리 가게 테이블을 등록해서 사용해보세요</p>
                    <button className="create-table-button" onClick={handleCreateTable}>테이블 만들기</button>
                </div>
            ) : (
                <div className="table-list">
                    {tables.map((table)=> (
                        <div
                            key={table.tableNo}
                            className="table-item"
                            style={{
                                left: `${table.xPosition}px`,
                                top: `${table.yPosition}px`,
                                width: `${table.width}px`,
                                height: `${table.height}px`,
                                backgroundColor: table.tableColor,
                                border: table.tableColor, // 되나안되나 화면으로 확인해야함
                                position: "absolute",
                            }}
                        >
                            <div className="table-number">테이블 {table.tableNo}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dining;
