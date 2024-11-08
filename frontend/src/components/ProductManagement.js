import React, { useState } from 'react';
import Sidebar from '../components/CateSide';
import Header from '../components/CateHead';
import CategoryList from '../components/CateList';
import CategoryModal from '../components/CateModal';
import "../css/product.css";

function ProductManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [categories, setCategories] = useState([
        { name: '고기', visible: true },
        { name: '식사', visible: true },
        { name: '주류', visible: true }
    ]);

    // 모달에서 저장한 카테고리를 카테고리 리스트에 추가
    const handleAddCategory = (newCategory) => {
        setCategories([...categories, { name: newCategory, visible: true }]);
    };

    return (
        <div className="product-management">
            <Sidebar />
            <div className="main-content">
                {/* Header에 모달 상태와 핸들러 전달 */}
                <Header onAddCategory={() => setIsModalOpen(true)} />
                <CategoryList 
                    categories={categories} 
                    setCategories={setCategories} 
                />
                {/* 모달 컴포넌트 */}
                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddCategory}
                />
            </div>
        </div>
    );
}

export default ProductManagement;
