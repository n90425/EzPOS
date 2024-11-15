import React, { useEffect, useState } from 'react';
import getfetch from "../api/fetch";
import Header from './CateHead';
import CategoryList from './CateList';
import CategoryModal from './CateModal';
import "../css/catehead.css";
import "../css/catelist.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Category() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    const handleAddCategory = (newCategory) => {
        setCategories([...categories, { name: newCategory, visible: true }]);
    };

    const toggleVisibility = (index) => {
        const newCategories = [...categories];
        newCategories[index].visible = !newCategories[index].visible;
        setCategories(newCategories);
    };

    // 카테고리를 평탄화하는 함수
    const flattenCategories = (categories) => {
        const flat = [];
    
        const processCategory = (category) => {
            if (!category) return;
            flat.push({
                categoryId: category.categoryId,
                categoryname: category.categoryname,
                visible: category.isvisible === 'Y'
            });
            
            if (category.children && Array.isArray(category.children)) {
                category.children.forEach(child => processCategory(child));
            }
        };
    
        categories.forEach(category => processCategory(category));
        return flat;
    };
    
    
    
    

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await getfetch(`${BASE_URL}/category`);
                console.log("Fetched categories response:", res);
    
                // 데이터가 배열인지 객체인지 확인하고, 적절한 속성에 접근
                const dataToFlatten = Array.isArray(res) ? res : res.data || res.categories || [];
                console.log("Data to flatten:", dataToFlatten);
    
                // 평탄화된 데이터 생성
                const formattedData = flattenCategories(dataToFlatten);
                console.log("Flattened categories:", formattedData);
    
                setCategories(formattedData);
            } catch (error) {
                console.error("Table Error", error);
            }
        };
        getCategories();
    }, []);
    
    
    
    
    

    return (
        <div className="cate-management">
            <Header onAddCategory={() => setIsModalOpen(true)} />
            <CategoryList categories={categories} toggleVisibility={toggleVisibility} />
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(newCategory) => {
                    handleAddCategory(newCategory);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}

export default Category;
