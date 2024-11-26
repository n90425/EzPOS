import React from "react";

function ItemList({ items = [] }) {
    return (
        <div className="item-list">
            <ul>
                {items.map((item) => (
                    <li key={item.menuId}> {/* 고유한 key prop 추가 */}
                        <span>{item.menuname}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default ItemList;
