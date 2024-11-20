import React, { useState } from 'react'
import "../css/catemodal.css";


function CategoryModal({ isOpen, onClose, onSave, categories, onDelete }){
    const [newCategory, setNewCategory] = useState('');

    if(!isOpen) return null;

    const handleSave = () => {
        if (newCategory.trim()){
            onSave(newCategory);
            setNewCategory(''); // 입력 초기화
            onClose(); //닫기
        }
    };

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <h2>카테고리 관리</h2>
            <ul className="category-list">
                {categories.map((category) => (
                    <li key={category.categoryId} className="category-item">
                        <span>{category.categoryname}</span>
                        <button
                            className="edit-button"
                            onClick={() => alert(`수정 기능 구현: ${category.categoryname}`)}
                        >
                            수정
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => onDelete(category.categoryId)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="새 카테고리 추가"
            />
            <div className="modal-actions">
                <button onClick={handleSave}>저장</button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    </div>
    );
}

export default CategoryModal;