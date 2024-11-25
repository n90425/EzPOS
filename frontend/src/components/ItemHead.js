import React from 'react'

function ItemHead({ onAddItem }) {
    return (
        <div className="header">
            <div className="status"> ItemHead</div>
            <button onClick={onAddItem} className="add-item">메뉴 관리</button>
        </div>
    )
}

export default ItemHead