import React, { useState } from 'react';
import Sidebar from '../components/CateSide';
import Cate from './Category';
import "../css/product.css";

function ProductManagement() {
    const [showCategoryManagement, setShowCategoryManagement] = useState(false); // 카테고리 관리 화면 표시 상태

    return (
        <div className="product-management">
            <Sidebar onCategoryClick={() => setShowCategoryManagement(true)} /> {/* 카테고리 클릭 시 상태 업데이트 */}
            <div className="main-content">
                {showCategoryManagement && <Cate />} {/* 카테고리 상태가 true일 때만 Cate 렌더링 */}
            </div>
        </div>
    );
}

export default ProductManagement;
