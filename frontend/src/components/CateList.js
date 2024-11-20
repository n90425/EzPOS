import React from 'react';
import "../css/catelist.css";

function CategoryList({ categories, toggleVisibility }) {
    return (
        <div className="category-list">
            <h2>카테고리</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.categoryId}> {/* 고유한 key */}
                        <span>{category.categoryname}</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={category.visible ?? false} //초기값 설정
                                onChange={() => toggleVisibility(category.categoryId)}
                            />
                            <span className="slider"></span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryList;
