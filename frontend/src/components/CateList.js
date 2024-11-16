import React from 'react';
import "../css/catelist.css";

function CategoryList({ categories, toggleVisibility }) {
    return (
        <div className="category-list">
            <h2>카테고리</h2>
            <ul>
                {categories.length > 0 ? (
                    categories.map((category, index) => (
                        <li key={category.categoryId}> {/* < key={index}> 다니수정*/}
                            <span>{category.categoryname}</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={category.visible}
                                    onChange={() => toggleVisibility(index)}
                                />
                                <span className="slider"></span>
                            </label>
                        </li>
                    ))
                ) : (
                    <p>카테고리를 불러오는 중입니다...</p>
                )}
            </ul>
        </div>
    );
}

export default CategoryList;
