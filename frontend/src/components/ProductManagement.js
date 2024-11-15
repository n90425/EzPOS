import React, { useState } from 'react';
import Sidebar from '../components/CateSide';
import Category from '../components/Category';
import "../css/product.css";

function ProductManagement() {
    const [showCategoryManagement, setShowCategoryManagement] = useState(false);
    const [categories, setCategories] = useState([]); // 상태 선언

    return (
        <div className="product-management">
            <Sidebar onCategoryClick={() => setShowCategoryManagement(true)} />
            <div className="main-content">
                {showCategoryManagement && (
                    <Category
                        categories={categories}
                        setCategories={setCategories} // setCategories를 prop으로 전달
                    />
                )}
            </div>
        </div>
    );
}

export default ProductManagement;
