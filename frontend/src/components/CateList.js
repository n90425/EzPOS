import React from 'react';
import "../css/catelist.css";

function CategoryList({ categories, setCategories }) {
    // 각 카테고리의 표시 여부(visible 상태)를 토글함
    const toggleVisibility = (index) => {
        const newCategories = [...categories];
        newCategories[index].visible = !newCategories[index].visible;
        setCategories(newCategories);
    };

    return (
        <div className="category-list">
            <h2>카테고리</h2>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <span>{category.name}</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={category.visible}
                                onChange={() => toggleVisibility(index)}
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
