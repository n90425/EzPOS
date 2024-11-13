import React, { useEffect, useState } from "react";
import getfetch from "../../api/fetch";
import "./dining.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Dining() {
    const [tables, setTables] = useState(null); // 초기 상태를 null로 설정
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const getTables = async () => {
            try {
                const data = await getfetch(`${BASE_URL}/dining`);
                setTables(data);
            } catch (error) {
                console.error("Table Error", error);
            } finally {
                setIsLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
            }
        };
        getTables();
    }, []);

    const tableNavi = useNavigate();
    const handleCreateTable = () => {
        tableNavi("/editDining");
    };

    return (
        <div className="dining-container">
            {isLoading ? ( // 로딩 중일 때 로딩 메시지 표시
                <p></p>
            ) : tables === null || tables.length === 0 ? ( // 데이터가 없을 때 안내 메시지 표시
                <div className="no-table">
                    <p className="dining-no-table-header">아직 등록된 테이블이 없어요</p>
                    <p>우리 가게 테이블을 등록해서 사용해보세요</p>
                    <button className="create-table-button" onClick={handleCreateTable}>테이블 만들기</button>
                </div>
            ) : (
                
                <div className="table-list">
                    {tables.map(table => (
                        <li key={table.tableNo}>
                            {table.tableNo}
                        </li>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dining;
