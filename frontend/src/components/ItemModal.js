import React, { useEffect, useState } from "react";
import "../css/itemmodal.css"; // ItemModal 전용 CSS

function ItemModal({ isOpen, onClose, onSave, onUpdate, selectedItem, categories = [] }) {
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        categoryId: "",
        taxIncluded: true,
        displayStock: false,
    });


    // selectedItem이 변경될때 초기화
    useEffect(() => {
        if (selectedItem) {
            setNewItem({
                name: selectedItem.menuName || "",
                price: selectedItem.menuPrice || "",
                categoryId: selectedItem.categoryId || "",
                taxIncluded: selectedItem.taxIncluded || true,
                displayStock: selectedItem.displayStock || false,
            });
        } else {
            // 새 상품 추가시 초기값 설정
            setNewItem({
                name: "",
                price: "",
                categoryId: "",
                taxIncluded: true,
                displayStock: false,
            });
        }
    }, [selectedItem]);


    if (!isOpen) return null;

    const handleSave = () => {
        // 입력값 검증
        if (!newItem.name || !newItem.price || !newItem.categoryId) {
            alert("모든 필드를 입력해주세요!");
            return;
        }

        // 백엔드 요구 사항에 맞게 데이터 변환
        const itemToSave = {
            menuName: newItem.name, // 'name'을 'menuName'으로 변경
            menuPrice: newItem.price, // 'price'를 'menuPrice'로 변경
            categoryId: newItem.categoryId,
            taxIncluded: newItem.taxIncluded,
            displayStock: newItem.displayStock,
        };


        // 수정 모드인지 확인
        if (selectedItem) {
            onUpdate({ ...selectedItem, ...itemToSave }); // 수정
        } else {
            onSave(itemToSave); // 새로 추가
        }

        // 입력값 초기화 및 모달 닫기
        onClose();


        // // 변환된 데이터 전달
        // onSave(itemToSave);

        // // 입력값 초기화
        // setNewItem({
        //     name: "",
        //     price: "",
        //     categoryId: "",
        //     taxIncluded: true,
        //     displayStock: false,
        // });
    };

    return (
        <div className="item-modal-overlay">
            <div className="item-modal-content">
                <div className="item-modal-header">
                    <h2>{selectedItem ? "상품수정" :"새 상품 추가"}</h2>
                </div>
                <div className="item-modal-body">
                    <div className="form-group">
                        <label>상품 이름*</label>
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) =>
                                setNewItem({ ...newItem, name: e.target.value })
                            }
                            placeholder="상품 이름"
                        />
                    </div>
                    <div className="form-group">
                        <label>카테고리*</label>
                        <select
                            value={newItem.categoryId}
                            onChange={(e) =>
                                setNewItem({ ...newItem, categoryId: e.target.value })
                            }
                        >
                            <option value="">카테고리 선택</option>
                            {categories.map((category) => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>기본 가격*</label>
                        <input
                            type="number"
                            value={newItem.price}
                            onChange={(e) =>
                                setNewItem({ ...newItem, price: e.target.value })
                            }
                            placeholder="가격"
                        />
                    </div>
                    <div className="form-group">
                        <label>세금</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="tax"
                                    checked={newItem.taxIncluded}
                                    onChange={() =>
                                        setNewItem({ ...newItem, taxIncluded: true })
                                    }
                                />
                                과세
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tax"
                                    checked={!newItem.taxIncluded}
                                    onChange={() =>
                                        setNewItem({ ...newItem, taxIncluded: false })
                                    }
                                />
                                비과세
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={newItem.displayStock}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, displayStock: e.target.checked })
                                }
                            />
                            품절 표시
                        </label>
                    </div>
                </div>
                <div className="item-modal-footer">
                    <button className="item-save-button" onClick={handleSave}>
                        확인
                    </button>
                    <button className="item-cancel-button" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemModal;

