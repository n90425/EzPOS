import React from 'react';
import "../css/catelist.css";

function CategoryList({ categories, toggleVisibility }) {
    return (
        <div className="category-list">
            <h2>카테고리</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.categoryId}
                        className={category.isVisible ? "visible-category" : "hidden-category"}
                    > 
                        <span>{category.categoryname}</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={category.isVisible}
                                onChange={() => toggleVisibility(category.categoryId, !category.isVisible)}
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
