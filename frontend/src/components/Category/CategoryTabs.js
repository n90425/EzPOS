import React from "react";
import "./categoryTab.css"

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="category-tabs">
            {categories.map((category) => (
            <button
                key={category.categoryId}
                className={category.categoryId === selectedCategory ? "active" : ""}
                onClick={() => onSelectCategory(category.categoryId)}
            >
            {category.categoryname}
            </button>
        ))}
        </div>
    );
};

export default CategoryTabs;

