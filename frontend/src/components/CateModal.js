import React, { useState } from 'react'
import "../css/catemodal.css";


function CategoryModal({ isOpen, onClose, onSave }){
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
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="카테고리 이름 입력"
                />
                <button onClick={handleSave}>저장</button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default CategoryModal;