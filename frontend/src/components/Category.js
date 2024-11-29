import React, { useState } from 'react';
import axios from "axios";
import Header from './CateHead';
import CategoryList from './CateList';
import CategoryModal from './CateModal';
import useCategories from '../hooks/useCategory';
import "../css/catehead.css";
import "../css/catelist.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Category() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 커스텀 훅에서 상태와 함수 가져오기
    const { categories, setCategories, fetchCategories, loading, error } = useCategories();


    const handleAddCategory = async (newCategoryName) => {
        try {
            await axios.post(`${BASE_URL}/category`, {
                categoryname: newCategoryName,
            });
            fetchCategories(); // 새 데이터 반영
        } catch (error) {
            console.error('Failed to add new category:', error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.post(`${BASE_URL}/deletecategory`, { category_id: categoryId });
            fetchCategories(); // 삭제 후 업데이트
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleUpdateCategory = async (updatedCategory) => {
        try {
            await axios.post(`${BASE_URL}/updatecategory`, updatedCategory);
            fetchCategories(); // 수정 후 업데이트
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };


    // 사용 여부 토글
    const handleToggleVisibility = async (categoryId, isVisible) => {
        try {
            await axios.post(`${BASE_URL}/category/toggle-visibility`, {
                categoryId,
                isVisible,
            });
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.categoryId === categoryId
                        ? { ...category, isVisible }
                        : category
                )
            );
        } catch (error) {
            console.error("Failed to toggle visibility:", error);
        }
    };
    


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading categories</div>;

    return (
        <div className="cate-management">
            <Header onAddCategory={() => setIsModalOpen(true)} />
            <CategoryList categories={categories} toggleVisibility={handleToggleVisibility} />
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddCategory}
                onDelete={handleDeleteCategory}
                onUpdate={handleUpdateCategory}
                categories={categories}
            />
        </div>
    );
}

export default Category;
