import React from 'react';
import './catehead.css';

function Header( { onAddCategory }) {
    return (
        <div className="header">
            <div className="status">현황</div>
            <button>순서 편집</button>
            <button onClick={onAddCategory} className="add-category">카테고리 관리</button>
        </div>
    )
}

export default Header;