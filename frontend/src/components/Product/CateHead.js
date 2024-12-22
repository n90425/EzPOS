import React from 'react';
import './catehead.css';

function Header( { onAddCategory }) {
    return (
        <div className="header">
            <h2>카테고리</h2>
            <div className="status"></div>
            <button onClick={onAddCategory} className="add-item add-category">카테고리 관리</button>
        </div>
    )
}

export default Header;