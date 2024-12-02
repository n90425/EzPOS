import React, { useState, useEffect } from 'react';
import ItemHeader from './ItemHead';
import ItemList from './ItemList';
import ItemModal from './ItemModal';
import useItem from '../hooks/useItem'; // useItem 훅 사용
import useCategory from '../hooks/useCategory'; // useCategory 훅 사용

function Item() {
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // 현재 선택한 아이템 정보
    const [selectedCategory, setSelectedCategory] = useState(null);
    const {items, addItem, deleteItem, updateItem, toggleVisibility, loading: itemLoading, error: itemError,} = useItem(); // useItem 훅 사용
    const { categories, loading: categoryLoading, error: categoryError } = useCategory(); // useCategory 훅 사용

    //선택된 카테고리에 따라 메뉴반환
    const filteredItems = selectedCategory ? items.filter((item) => String(item.categoryId) === String(selectedCategory)) : items;
    
   // 모달 열기 (새 아이템 추가 모드)
    const openAddModal = () => {
        setSelectedItem(null); // 선택된 아이템 초기화
        setItemModalOpen(true); // 모달 열기
    };

    // 모달 열기 (아이템 수정 모드)
    const openEditModal = (item) => {
        setSelectedItem(item); // 수정할 아이템 설정
        setItemModalOpen(true); // 모달 열기
    };


    return (
        <div className="item-management">
            <ItemHeader onAddItem={openAddModal} />
            <ItemList 
                categories={categories}
                items={filteredItems} // 필터링된 데이터 전달 
                onDelete={deleteItem} // 삭제 핸들러 전달
                onEdit={openEditModal} // 수정 핸들러 전달
                onToggleVisibility={toggleVisibility} // 사용 여부 토글 핸들러 전달
                onCategorySelect={setSelectedCategory} // 카테고리 선택 핸들러 전달
                selectedCategory={selectedCategory} // 선택된 카테고리 전달 
            />
            <ItemModal
                isOpen={itemModalOpen}
                onClose={() => {setItemModalOpen(false); setSelectedItem(null);}}
                onSave={addItem}
                onUpdate={updateItem}
                selectedItem={selectedItem} //선택된 메뉴정보 전달
                // items={items}
                categories={categories} // useCategory 훅으로 가져온 데이터를 전달
            />
            {itemLoading && <p>Loading items...</p>}
            {itemError && <p>Error loading items: {itemError.message}</p>}
            {categoryLoading && <p>Loading categories...</p>}
            {categoryError && <p>Error loading categories: {categoryError.message}</p>}
        </div>
    );
}

export default Item;
