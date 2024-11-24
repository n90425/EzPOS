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
    //data 가져오기
    useEffect(() => {
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

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.post(`${BASE_URL}/deletecategory`, { category_id: categoryId });
            setCategories(categories.filter((cat) => cat.categoryId !== categoryId));
            alert('카테고리가 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert('카테고리 삭제에 실패했습니다.');
        }
    };

    //카테고리 수정
    const handleUpdateCategory = async (updatedCategory) => {
        try {
            const response =await axios.post(`${BASE_URL}/updatecategory`, updatedCategory);
            console.log('카테고리 업데이트 성공 ', response.data);

        //성공시 서버에서 수정된 데이터로 업데이트
        const updatedCategories = categories.map((category) =>
            category.categoryId === updatedCategory.categoryId ? response.data : category
        );
        setCategories(updatedCategories);

        }catch (error){
            console.error('카테고리 업데이트 실패:', error);
            alert('카테고리 업데이트에 실패했습니다.')
        }
    };


    return (
        <div className="cate-management">
            <Header onAddCategory={() => setIsModalOpen(true)} />
            <CategoryList categories={categories} toggleVisibility={toggleVisibility} />
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddCategory}
                onDelete={handleDeleteCategory}
                onUpdate={handleUpdateCategory} //수정로직 전달
                categories={categories}         // 데이터를 모달로 전달
            />
        </div>
    );
}

export default Category;
