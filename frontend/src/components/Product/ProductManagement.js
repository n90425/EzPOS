import React, { useState } from 'react';
import Sidebar from './ProductSide';
import Category from './Category';
import Item from './Item';
import './product.css';

function ProductManagement() {
    const [showCategoryManagement, setShowCategoryManagement] = useState("category");
    const [showItemManagement, setShowItemManagement] = useState(false); 
    // const [categories, setCategories] = useState([]); // 카테고리 상태
    // const [items, setItems] = useState([]); // 상품 상태

    const handleCategoryClick = () => {
        setShowCategoryManagement(true);
        setShowItemManagement(false); // 상품등록 숨기기
    };

    const handleItemClick = () => {
        setShowItemManagement(true);
        setShowCategoryManagement(false); // 카테고리 숨기기
    };

    return (
        <div className="product-management">
            <Sidebar
                onCategoryClick={handleCategoryClick}
                onItemClick={handleItemClick}
            />
            <div className="main-content">
                {showCategoryManagement && (
                    <Category/>
                )}
                {showItemManagement && (
                    <Item/>
                )}
            </div>
        </div>
    );
}

export default ProductManagement;
