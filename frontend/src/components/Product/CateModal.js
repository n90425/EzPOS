import React, { useState } from 'react';
import './catemodal.css';

function CategoryModal({ isOpen, onClose, onSave, categories, onDelete, onUpdate }) {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (newCategory.trim()) {
            onSave(newCategory);
            setNewCategory('');
        }
    };

    const handleEdit = (category) => {
        setEditingCategoryId(category.categoryId);
        setEditingCategoryName(category.categoryname);
    };

    const handleUpdate = () => {
        if (editingCategoryName.trim() && editingCategoryId !== null) {
            onUpdate({ categoryId: editingCategoryId, categoryname: editingCategoryName });
            setEditingCategoryId(null);
            setEditingCategoryName('');
        }
    };

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
    };

    return (
        <div className="category-modal-overlay">
            <div className="category-modal-content">
                <h2 className='category-modal-head'>카테고리 관리</h2>
                <ul className="category-modal-list">
                    {categories.map((category) => (
                        <li key={category.categoryId} className="category-modal-item">
                            {editingCategoryId === category.categoryId ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingCategoryName}
                                        onChange={(e) => setEditingCategoryName(e.target.value)}
                                        className="edit-input"
                                    />
                                    <div className="button-group">
                                        <button className="category-save-button" onClick={handleUpdate}>
                                            저장
                                        </button>
                                        <button className="category-cancel-button" onClick={handleCancelEdit}>
                                            취소
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span>{category.categoryname}</span>
                                    <div className="button-group">
                                        <button className="category-edit-button" onClick={() => handleEdit(category)}>
                                            수정
                                        </button>
                                        <button className="category-delete-button" onClick={() => onDelete(category.categoryId)}>
                                            삭제
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="category-add">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="새 카테고리 추가"
                        className="add-input"
                    />
                    <div className="category-modal-actions">
                        <button className="category-save-button" onClick={handleSave}>
                            확인
                        </button>
                        <button className="category-cancel-button" onClick={onClose}>
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryModal;
