import React from 'react';
import './catehead.css';

function Header( { onAddCategory }) {
    return (
        <div className="header">
            <div className="status"></div>
            <button onClick={onAddCategory} className="add-category">카테고리 관리</button>
        </div>
    )
}

export default Header;