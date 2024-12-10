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

            {/* 현재 선택한 카테고리 표시 */}
            <div className="selected-category">
                {selectedCategory
                    ? `선택된 카테고리: ${categories.find((cat) => cat.categoryId === selectedCategory)?.categoryname || "알 수 없음"}`
                    : "전체 카테고리"}
            </div>


            {/* 메뉴 리스트 */}
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
                <tbody>
                    {items.map((item) => (
                        <tr key={item.menuId}>
                            <td><input type="checkbox" /></td>
                            <td>{item.image ? <img src={item.image} alt={item.menuName} /> : "이미지 없음"}</td>
                            <td>{categories.find((cat) => cat.categoryId === item.categoryId)?.categoryname || "없음"}</td> 
                            <td>{item.menuName || "이름 없음"}</td> {/* 메뉴 이름 */}
                            <td>{item.menuPrice ? `${item.menuPrice}원` : "가격 없음"}</td> {/* 메뉴 가격 */}
                            <td>{item.stock || "없음"}</td> {/* 재고 수량 */}
                            <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={item.isVisible || false}
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
    );
}

export default ItemList;
