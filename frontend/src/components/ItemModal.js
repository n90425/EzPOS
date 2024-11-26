import React, { useState } from 'react';
import "../css/catemodal.css";

function ItemModal({ isOpen, onClose, onSave, items, onDelete, onUpdate }) {
    const [newItem, setNewItem] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingItemName, setEditingItemName] = useState('');

    if (!isOpen) return null;

    // 새로운 카테고리 저장
    const handleSave = () => {
        if (newItem.trim()) {
            onSave(newItem);
            setNewItem(''); // 입력 초기화
        }
    };

    // 수정 모드로 전환
    const handleEdit = (item) => {
        setEditingItemId(item.menuId);
        setEditingItemName(item.menuname);
    };

    // 수정된 메뉴 저장
    const handleUpdate = () => {
        if (setEditingItemName.trim() && setEditingItemId !== null) {
            onUpdate({ categoryId: editingItemId, categoryname: editingItemName });
            setEditingItemId(null); // 수정 모드 종료
            setEditingItemName('');
        }
    };

    // 수정 취소
    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditingItemName('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>카테고리 관리</h2>
                <ul className="menu-list">
                    {items.map((item) => (
                        <li key={item.menuId} className="menu-item">
                            {editingItemId === item.menuId ? (
                                // 수정 중인 항목
                                <>
                                    <input
                                        type="text"
                                        value={editingItemName}
                                        onChange={(e) => setEditingItemName(e.target.value)}
                                    />
                                    <button className="save-button" onClick={handleUpdate}>저장</button>
                                    <button className="cancel-button" onClick={handleCancelEdit}>취소</button>
                                </>
                            ) : (
                                // 일반 항목
                                <>
                                    <span>{item.menuname}</span>
                                    <button className="edit-button" onClick={() => handleEdit(item)}>수정</button>
                                    <button className="delete-button"onClick={() => onDelete(item.menuId)}>삭제</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="새 메뉴 추가"
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

export default ItemModal;
