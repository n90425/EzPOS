import React from 'react'

function ItemHead({ onAddItem,onUpdateItem }) {
    return (
        <div className="header">
            <h2>상품등록</h2>
            <div className="status"></div>
            <button onClick={onAddItem} className="add-item">메뉴 추가</button>
        </div>
    )
}

export default ItemHead