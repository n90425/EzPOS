import { useState, useEffect, useCallback } from "react";
import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useItem = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleItem, setVisibleItem] = useState([]); // 활성화된 메뉴

    // 메뉴 데이터 가져오기
    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/menu`);
            setItems(response.data); // 서버에서 받아온 데이터 설정
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []); // 빈 의존성 배열

    //메뉴 추가 
    const addItem = async (newItem) => {
        try {
            const formattedItem = {
                ...newItem,
                categoryId : newItem.categoryId,
            };
            const response = await axios.post(`${BASE_URL}/menu`, formattedItem);
            setItems((prevItems) => [...prevItems,response.data]);
        }catch (error) {
            console.error("Failed to add new item:", error);
        }
    };

    // 메뉴 삭제
    const deleteItem = async (menuId) => {
        try {
            await axios.post(`${BASE_URL}/deletemenu`, { menuId });
            setItems((prevItems) => prevItems.filter((item) => item.menuId !== menuId));
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    // 메뉴 수정
    const updateItem = async (updatedItem) => {
        try {
            const response = await axios.post(`${BASE_URL}/updatemenu`, updatedItem);
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.menuId === response.data.menuId ? response.data : item
                )
            );
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };

    // 메뉴 사용 여부 토글
    const toggleVisibility = async (menuId, isVisible) => {
        try {
            await axios.post(`${BASE_URL}/menu/toggle-visibility`, { menuId, isVisible });
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.menuId === menuId ? { ...item, isVisible } : item
                )
            );
        } catch (error) {
            console.error("Failed to toggle visibility:", error);
        }
    };


    // 활성화된 카테고리만 가져오기
    const fetchVisibleItem = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/menu/visibility`);
            setVisibleItem(res.data); // 활성화된 메뉴 설정
        } catch (err) {
            console.error("Failed to fetch visible item:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []); // 빈 의존성 배열

    // 처음 마운트될 때 메뉴 데이터를 가져옴
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return { items, setItems,  fetchVisibleItem, visibleItem, fetchItems, addItem, deleteItem, updateItem, toggleVisibility, loading, error,};
};

export default useItem;