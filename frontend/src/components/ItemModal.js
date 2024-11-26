import React, { useState } from "react";
import "../css/catemodal.css";

function ItemModal({ isOpen, onClose, onSave, items = [], onDelete, onUpdate, categories = [] }) {
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        categoryId: null,
        taxIncluded: true, // 기본값: 과세
    });
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingItem, setEditingItem] = useState({});

    if (!isOpen) return null;

    // 새로운 메뉴 저장
    const handleSave = () => {
        if (newItem.name.trim() && newItem.price && newItem.categoryId) {
            onSave(newItem);
            setNewItem({ name: "", price: "", categoryId: null, taxIncluded: true }); // 입력 초기화
        } else {
            alert("모든 필드를 입력해주세요!");
        }
    };

    // 수정 모드로 전환
    const handleEdit = (item) => {
        setEditingItemId(item.menuId);
        setEditingItem({
            name: item.menuname,
            price: item.price,
            categoryId: item.categoryId,
            taxIncluded: item.taxIncluded,
        });
    };

    // 수정된 메뉴 저장
    const handleUpdate = () => {
        if (editingItem.name.trim() && editingItem.price && editingItem.categoryId) {
            onUpdate({ ...editingItem, menuId: editingItemId });
            setEditingItemId(null); // 수정 모드 종료
            setEditingItem({});
        } else {
            alert("모든 필드를 입력해주세요!");
        }
    };

    // 수정 취소
    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditingItem({});
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>메뉴 관리</h2>
                <ul className="menu-list">
                    {items.map((item) => (
                        <li key={item.menuId} className="menu-item">
                            {editingItemId === item.menuId ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingItem.name}
                                        onChange={(e) =>
                                            setEditingItem({ ...editingItem, name: e.target.value })
                                        }
                                        placeholder="메뉴 이름"
                                    />
                                    <input
                                        type="number"
                                        value={editingItem.price}
                                        onChange={(e) =>
                                            setEditingItem({ ...editingItem, price: e.target.value })
                                        }
                                        placeholder="가격"
                                    />
                                    <select
                                        value={editingItem.categoryId || ""}
                                        onChange={(e) =>
                                            setEditingItem({ ...editingItem, categoryId: e.target.value })
                                        }
                                    >
                                        <option value="">카테고리 선택</option>
                                        {categories.map((category) => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.categoryname}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="save-button" onClick={handleUpdate}>
                                        저장
                                    </button>
                                    <button className="cancel-button" onClick={handleCancelEdit}>
                                        취소
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>{item.menuname} ({item.price}원) - {item.categoryName}</span>
                                    <button className="edit-button" onClick={() => handleEdit(item)}>
                                        수정
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => onDelete(item.menuId)}
                                    >
                                        삭제
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="new-item-form">
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="메뉴 이름"
                    />
                    <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="가격"
                    />
                    <select
                        value={newItem.categoryId || ""}
                        onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    >
                        <option value="">카테고리 선택</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryname}
                            </option>
                        ))}
                    </select>
                </div>
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
