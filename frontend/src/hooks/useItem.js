import { useState, useEffect } from "react";
import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useItem = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 메뉴 데이터 가져오기 함수
    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/menu`);
            setItems(response.data); // 서버에서 받아온 데이터 설정
        } catch (err) {
            setError(err);
        }finally {
            setLoading(false);
        }
    };

 // 컴포넌트가 마운트될 때 메뉴 데이터 가져오기
    useEffect(() => {
        fetchItems();
    }, []);

    return { items, setItems, loading, error, fetchItems};
};

export default useItem;