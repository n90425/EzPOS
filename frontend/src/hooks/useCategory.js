import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/category`);
        // const formattedCategories = res.data.map((category) => ({
        //     categoryId: category.categoryId || null,
        //     categoryname: category.categoryname || "Unnamed Category",
        //     isVisible: Boolean(category.isvisible), // `isvisible` 변환
        // }));
        setCategories(res.data);
        // console.log(formattedCategories);
        console.log(res.data);
        } catch (err) {
        console.error("Failed to fetch categories: ", err);
        setError(err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    
    return { categories, setCategories, fetchCategories, loading, error };
};
        
export default useCategory;