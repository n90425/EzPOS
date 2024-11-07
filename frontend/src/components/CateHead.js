import React from 'react';

function Header() {
    return (
        <div className="geader">
            <div className="status">현황 4</div>
            <button>순서 편집</button>
            <button className="add-category">+ 카테고리 추가</button>
        </div>
    )
}

export default Header;