import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from './CateHead';
import CategoryList from './CateList';
import CategoryModal from './CateModal';
import "../css/catehead.css";
import "../css/catelist.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Category() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const toggleVisibility = (categoryId) => {
        const newCategories = categories.map((category) =>
            category.categoryId === categoryId
                ? { ...category, visible: !category.visible }
                : category
        );
        setCategories(newCategories);
    };


    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/category`);

                console.log("resdDate 가져오기: ", res.data);
    
                // 데이터 변환 (isvisible → visible 변환)
                const formattedCategories = res.data.map((category) => ({
                    categoryId: category.categoryId || null,
                    categoryname: category.categoryname || "Unnamed Category",
                    visible: category.isvisible === "Y", // isvisible을 boolean 값으로 변환
                }));

                console.log("Formatted Categories: ", formattedCategories);
                setCategories(formattedCategories);
            } catch (error) {
                console.error("Table Error", error);
            }
        };
        getCategories();
    }, []);


     // 새 카테고리 추가 - POST 요청 후 상태 업데이트
    const handleAddCategory = async (newCategoryName) => {
        try {
            const response = await axios.post(`${BASE_URL}/category`,{
                categoryname : newCategoryName,
            });

            const newCategory = response.data;
            console.log(newCategory);

            setCategories([...categories, newCategory]);
        }catch (error) {
            console.error('Failed to add new category:', error);
        }
    };



    return (
        <div className="cate-management">
            <Header onAddCategory={() => setIsModalOpen(true)} />
            <CategoryList categories={categories} toggleVisibility={toggleVisibility} />
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(newCategoryName) => {
                    handleAddCategory(newCategoryName);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}

export default Category;
