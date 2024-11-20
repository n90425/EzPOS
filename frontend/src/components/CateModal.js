import React, { useState } from 'react';
import "../css/catemodal.css";

function CategoryModal({ isOpen, onClose, onSave, categories, onDelete, onUpdate }) {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    if (!isOpen) return null;

    // 새로운 카테고리 저장
    const handleSave = () => {
        if (newCategory.trim()) {
            onSave(newCategory);
            setNewCategory(''); // 입력 초기화
        }
    };

    // 수정 모드로 전환
    const handleEdit = (category) => {
        setEditingCategoryId(category.categoryId);
        setEditingCategoryName(category.categoryname);
    };

    // 수정된 카테고리 저장
    const handleUpdate = () => {
        if (editingCategoryName.trim() && editingCategoryId !== null) {
            onUpdate({ categoryId: editingCategoryId, categoryname: editingCategoryName });
            setEditingCategoryId(null); // 수정 모드 종료
            setEditingCategoryName('');
        }
    };

    // 수정 취소
    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>카테고리 관리</h2>
                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category.categoryId} className="category-item">
                            {editingCategoryId === category.categoryId ? (
                                // 수정 중인 항목
                                <>
                                    <input
                                        type="text"
                                        value={editingCategoryName}
                                        onChange={(e) => setEditingCategoryName(e.target.value)}
                                    />
                                    <button className="save-button" onClick={handleUpdate}>저장</button>
                                    <button className="cancel-button" onClick={handleCancelEdit}>취소</button>
                                </>
                            ) : (
                                // 일반 항목
                                <>
                                    <span>{category.categoryname}</span>
                                    <button className="edit-button" onClick={() => handleEdit(category)}>수정</button>
                                    <button className="delete-button"onClick={() => onDelete(category.categoryId)}>삭제</button>
                                </>
                            )}
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
                    <button className="save-button" onClick={handleSave}>
                        추가
                    </button>
                    <button className="close-button" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryModal;
