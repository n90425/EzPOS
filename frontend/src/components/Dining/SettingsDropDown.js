import React, {useState, useEffect, useRef } from "react";
import "./settingDropDown.css";
import { useNavigate } from "react-router-dom";

function SettingsDropDown({showAlert, onTableMove, onTableMerge}){
    // dropdown 상태추가
    const [isOpen, setIsOpen] = useState(false);
    // 드롭다운밖을 마우스클릭할경우 포커스 설정 상태추가
    const dropdownRef = useRef(null);

    // 상태변경
    const toggleDropdown = () => setIsOpen(!isOpen);
    

    // 드롭다운 밖을선택할때 상태를 false로변경
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)){
            setIsOpen(false);
        }
    }

    // 드롭다운 밖을 선택할때 이벤트 추가,삭제
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return() => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);



    // 테이블 편집을 눌렀을때 이동
    const tableNavi = useNavigate();
    const handleEditTable = () => {
        tableNavi("/editDining");
    }


    // 매출요약을 눌렀을때 이동
    const handleSaleSummary= () => {
        tableNavi("/sales-summary");
    }

    return (
        <div className="top-bar">
            <button className="top-bar-button" onClick={handleSaleSummary}>매출요약</button>
            <button className="top-bar-button" onClick={onTableMove}>자리이동</button>
            <button className="top-bar-button" onClick={onTableMerge}>합석</button>
            <button className="top-bar-button">단체 손님 관리</button>
            <button className="top-bar-button">재출력</button>
            <div className="settings-container" ref={dropdownRef}>
                <button className="top-bar-button settings" onClick={toggleDropdown}>
                    <i className="fas fa-cog"></i>
                </button>
                {isOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={handleEditTable}>테이블편집</div>
                        <div className="dropdown-item">공간편집</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SettingsDropDown; 