import React, { useEffect,useState } from 'react';
import getfetch from "../api/fetch";
import Header from './CateHead';
import CategoryList from './CateList';
import CategoryModal from './CateModal';
import "../css/catehead.css";
import "../css/catelist.css";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Category() {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [categories, setCategories] = useState([]);

    // 모달에서 저장한 카테고리를 카테고리 리스트에 추가
    const handleAddCategory = (newCategory) => {
        setCategories([...categories, { name: newCategory, visible: true }]);
    };

    // 카테고리 표시 여부를 토글하는 함수
    const toggleVisibility = (index) => {
        const newCategories = [...categories];
        newCategories[index].visible = !newCategories[index].visible;
        setCategories(newCategories);
    };


    
    // useEffect(() => {
    //     const getCategories = async () => {
    //         try {
    //             const data = await getfetch(`${BASE_URL}/category`);
    //             setCategories(data);
    //         } catch (error) {
    //             console.error("Table Error", error);
    //         }
    //     };
    //     getCategories();
    // }, []);


    return (
        <div className="cate-management">
            {/* Header 부분 */}
            <Header onAddCategory={() => setIsModalOpen(true)} />

            {/* CategoryList 부분 */}
            <CategoryList
                categories={categories}
                toggleVisibility={toggleVisibility}
            />

            {/* 모달 컴포넌트 */}
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
