import React from 'react'

function ItemList({ items }) {
    return (
        <div className="item-list">
            <h2>메뉴</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.manuId}>
                        <span>{item.manuName}</span>
                        <label className="switch">
                            <span className="slider"></span>
                        </label>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default ItemList