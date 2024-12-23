import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "./header.css"
import { TableContext } from "./Dining/TableContext";

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const location = useLocation();
    const navigate = useNavigate();
    const {fetchTables} = useContext(TableContext);

    useEffect(() => {
        const timer = setInterval(()=> {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []) ;

    const formatTime = (time) => {
        const year = time.getFullYear();
        const month = String(time.getMonth()+1).padStart(2,"0");
        const date = String(time.getDate()).padStart(2,"0");
        const yoil = ["일", "월", "화", "수", "목", "금", "토"];
        const day = yoil[time.getDay()];

        const hour = String(time.getHours()).padStart(2, "0");
        const minute = String(time.getMinutes()).padStart(2, "0");
        const ampm = hour >= 12 ? "오후" : "오전";
        const formattedHours = String(hour % 12 || 12).padStart(2,"0");
    
        return `${year}.${month}.${date} ${day} ${ampm} ${formattedHours}:${minute}`;
    };

    const getPageTitme = () => {
        switch(location.pathname) {
            case "/":
                return "메인페이지";
            case "/sales-summary":
                return "매출리포트";
            case "/sales-history":
                return "판매내역";
            case "/order-history":
                return "주문내역";
            case "/dining":
                return "테이블 관리";
            case "/product-management":
                return "상품관리";
            case "/payment-history":
                return "결제내역";
        };
    }

    useEffect(() => {
        // 페이지 이동 시 테이블 데이터 새로고침
        fetchTables();
    }, [location.key]); // location.key가 변경될 때마다 실행

    return (
        <div className="header-container">
            {location.pathname !== "/" && (
                <button className="back-button" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
            )}
            <div className="header-content">
                <h2>{getPageTitme()}</h2>
                <div className="header-time">{formatTime(currentTime)}</div>
            </div>
        </div>
    );
};

export default Header;