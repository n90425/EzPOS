import React, { useState } from 'react';
import axios from "axios";
import ItemHeader from './ItemHead'
import ItemList from './ItemList'
import ItemModal from './ItemModal'

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Item() {
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [items, setItems] = useState([]);

    const handleAddItem = async (newItemName) => {
        try {
            const response = await axios.post(`${BASE_URL}/item`,{
                itemname : newItemName,
            });

            const newItem = response.data;

            setItems([...items, newItem]);
        }catch (error) {
            console.error('Failed to add new category:', error);
        }
    };

    const handleDeleteItem = async (menuId) => {
        try {
            const response = await axios.post(`${BASE_URL}/deleteitem`, { menu_id: menuId });
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleUpdateItem = async (updatedItem) => {
        try {
            const response = await axios.post(`${BASE_URL}/updateitem`, updatedItem);
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    return (
        <div className="intem-management">
            <ItemHeader onAddItem={() => setItemModalOpen(true)}/>
            <ItemList items={items} />
            <ItemModal
                isOpen={itemModalOpen}
                onClose={() => setItemModalOpen(false)}
                onSave={handleAddItem}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
                items={items}
            />
        </div>
    );
}

export default Item