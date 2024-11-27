import React from "react";
import "../css/itemlist.css";

function ItemList({ items = [], onDelete }) {
    return (
        <div className="item-list">
            <table className="item-table">
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>이미지</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>재고수량</th>
                        <th>품절표시</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.menuId}>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>
                                <div className="item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.menuname} />
                                    ) : (
                                        <span>이미지 없음</span>
                                    )}
                                </div>
                            </td>
                            <td>{item.menuname}</td>
                            <td>{item.price}원</td>
                            <td>{item.stock || "없음"}</td>
                            <td>
                                <label className="switch">
                                    <input type="checkbox" checked={item.soldOut || false} />
                                    <span className="slider"></span>
                                </label>
                            </td>
                            <td>
                                <button className="delete-button" onClick={() => onDelete(item.menuId)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ItemList;
