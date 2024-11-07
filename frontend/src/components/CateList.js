import React, { useState } from 'react';
import CategoryModal from '../components/CateModal';

function CategoryList(){
    const [categories, setCategories] = useState([
        { name: '고기', visible: true},
        { name: '식사', visible: true},
        { name: '주류', visible: true}
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    //각 카테고리의 표시 여부(visible 상태)를 토글함
    const toggleVisibility = (index) => {
        const newCategories = [...categories];
        newCategories[index].visible = !newCategories[index].visible;
        setCategories(newCategories);
    }

    // 모달에서 저장한 카테고리를 카테고리리스트에 추가
    const handleAddCategory = (newCategory) => {
        setCategories([...categories, { name: newCategory, visible: true }]);
    };

    return(
        <div className="vategory-list">
            <h2>카테고리</h2>
            <button onClick = {() => setIsModalOpen(true)}>+ 카테고리 추가</button>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <span>{category.name}</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={category.visible}
                                onChange={() => toggleVisibility(index)}
                            />
                            <span className="slider"></span>
                        </label>
                    </li>
                ))}
            </ul>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddCategory}
            />    
        </div>
    );
}

export default CategoryList;