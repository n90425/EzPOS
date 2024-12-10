import React, { useState } from 'react';
import Header from './CateHead';
import CategoryList from './CateList';
import CategoryModal from './CateModal';
import useCategories from '../../hooks/useCategory';
import './catehead.css';
import './catelist.css';

function Category() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 커스텀 훅에서 상태와 함수 가져오기
    const { categories, addCategory, deleteCategory, updateCategory, toggleVisibility, loading, error } = useCategories();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading categories</div>;

    return (
        <div className="cate-management">
            <Header onAddCategory={() => setIsModalOpen(true)} />
            <CategoryList categories={categories} toggleVisibility={toggleVisibility} />
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={addCategory}
                onDelete={deleteCategory}
                onUpdate={updateCategory}
                categories={categories}
            />
        </div>
    );
}

export default Category;
