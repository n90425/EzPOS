import React from "react";

// 메뉴선택창에 상단에 카테고리 나열
const CategoryTabs = ([categories, selectTabCategory, onSelectCategory]) => {
    return (
        <div className="category-tabs">
            {categories.map((category) => (
                <button
                    key={category.categoryId}
                    className={category.categoryId===selectTabCategory ? "active" : ""}
                    onclick={() => onSelectCategory(category.categoryId)}
                >
                    {category.categoryname}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;