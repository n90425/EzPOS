import React from 'react';
import './catelist.css';

function CategoryList({ categories, toggleVisibility }) {
    return (
        <div className="category-list">
            <ul>
                <div className='category-head'>
                    <div>카테고리명</div>
                    <div>키오스크 노출</div>
                </div>
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
