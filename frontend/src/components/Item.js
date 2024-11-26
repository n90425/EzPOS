import React, { useState, useEffect } from 'react';
import axios from "axios";
import ItemHeader from './ItemHead';
import ItemList from './ItemList';
import ItemModal from './ItemModal';
import useCategory from '../hooks/useCategory'; // useCategory 훅 임포트

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Item() {
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const { categories, loading: categoryLoading, error: categoryError } = useCategory(); // useCategory 훅 사용

    //모든 메뉴 가져오기
    const fetchItems = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/menu`);
            console.log('Fetched items:', response.data);
    
            // 서버 응답 데이터 변환 (필요 시)
            const formattedItems = response.data.map((item) => ({
                menuId: item.menuId,
                menuname: item.menuName || "Unnamed Item",
            }));
            setItems(formattedItems); // 변환된 데이터로 상태 설정
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }
    };
    
    useEffect(() => {
        fetchItems();
    }, []);


    // 새로운 아이템 추가
    const handleAddItem = async (newItem) => {
        try {
            const response = await axios.post(`${BASE_URL}/item`, newItem);

            const newItemData = response.data;
            setItems([...items, newItemData]);
        } catch (error) {
            console.error('Failed to add new item:', error);
        }
    };

    // 아이템 삭제
    const handleDeleteItem = async (menuId) => {
        try {
            await axios.post(`${BASE_URL}/deleteitem`, { menu_id: menuId });
            setItems(items.filter((item) => item.menuId !== menuId));
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    // 아이템 수정
    const handleUpdateItem = async (updatedItem) => {
        try {
            const response = await axios.post(`${BASE_URL}/updateitem`, updatedItem);

            const updatedItemData = response.data;
            setItems(
                items.map((item) =>
                    item.menuId === updatedItemData.menuId ? updatedItemData : item
                )
            );
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    return (
        <div className="item-management">
            <ItemHeader onAddItem={() => setItemModalOpen(true)} />
            <ItemList items={items} />
            <ItemModal
                isOpen={itemModalOpen}
                onClose={() => setItemModalOpen(false)}
                onSave={handleAddItem}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
                items={items}
                categories={categories} // useCategory 훅으로 가져온 데이터를 전달
            />
            {categoryLoading && <p>Loading categories...</p>}
            {categoryError && <p>Error loading categories: {categoryError.message}</p>}
        </div>
    );
}

export default Item;
