import React from "react";
import './itemlist.css';

function ItemList({ items = [], categories = [], onDelete, onEdit, onToggleVisibility, onCategorySelect, selectedCategory }) {
    return (
        <div className="item-list">
            {/* 카테고리 버튼 */}
            <div className="category-buttons">
                <button
                    className={!selectedCategory ? "active" : ""}
                    onClick={() => onCategorySelect(null)}
                >
                    전체
                </button>
                {categories.map((category) => (
                    <button
                        key={category.categoryId}
                        className={selectedCategory === category.categoryId ? "active" : ""}
                        onClick={() => onCategorySelect(category.categoryId)}   //카테고리 버튼 클릭
                    >
                        {category.categoryname}
                    </button>
                ))}
            </div>


            {/* 메뉴 리스트 */}
            <div className="itemList-table-container">
                <table className="item-table">
                    <thead>
                        <tr>
                            <th>선택</th>
                            <th>이미지</th>
                            <th>카테고리</th>
                            <th>상품명</th>
                            <th>가격</th>
                            <th>품절표시</th>
                            <th>사용여부</th>
                            <th>수정</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody className="itemlist-tbody">
                        {items.map((item) => (
                            <tr key={item.menuId}>
                                <td><input type="checkbox" /></td>
                                <td>{item.image ? <img src={item.image} alt={item.menuName} /> : "이미지 없음"}</td>
                                <td>{categories.find((cat) => cat.categoryId === item.categoryId)?.categoryname || "없음"}</td> 
                                <td>{item.menuName || "이름 없음"}</td> {/* 메뉴 이름 */}
                                <td>{item.menuPrice ? `${item.menuPrice.toLocaleString()}원` : "가격 없음"}</td> {/* 메뉴 가격 */}
                                <td>{item.stock || "없음"}</td> {/* 재고 수량 */}
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={item.isVisible}
                                            onChange={() => onToggleVisibility(item.menuId, !item.isVisible)} // 상태 변경 핸들러
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </td>
                                <td><button onClick={() => onEdit(item)}>수정</button></td>
                                <td><button onClick={() => onDelete(item.menuId)}>삭제</button></td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default ItemList;
