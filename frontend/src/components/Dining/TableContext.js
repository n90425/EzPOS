import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const TableContext = createContext();

export const TableProvider = ({children}) => {
    const [tables, setTables] = useState([]);

    const fetchTables = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/dining`);
            setTables(res.data);
        } catch(error){
            console.error("테이블 데이터를 불러오는중 오류 발생 TableContext: ", error);
            setTables([]); // 에러 시 빈 배열로 초기화
        }
    };

    return (
        <TableContext.Provider value={{ tables, setTables, fetchTables }}>
            {children}
        </TableContext.Provider>
    
    )
}