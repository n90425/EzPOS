import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleCategories, setVisibleCategories] = useState([]); // 활성화된 카테고리


    // 카테고리 데이터 가져오기
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/category`);
            setCategories(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Failed to fetch categories: ", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []); // 빈 의존성 배열

     // 카테고리 추가
    const addCategory = async (newCategoryName) => {
        try {
            await axios.post(`${BASE_URL}/category`, { categoryname: newCategoryName });
            fetchCategories(); // 새 데이터 반영
        } catch (error) {
            console.error("Failed to add new category:", error);
        }
    };

  // 카테고리 삭제
    const deleteCategory = async (categoryId) => {
        try {
            await axios.post(`${BASE_URL}/deletecategory`, { category_id: categoryId });
            fetchCategories(); // 삭제 후 업데이트
            alert("카테고리가 성공적으로 삭제되었습니다.");
        } catch (error) {
            // 서버에서 반환된 에러 메시지 확인
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message || "카테고리 삭제 중 문제가 발생했습니다.");
            } else {
                console.error("Failed to delete category:", error);
                alert("카테고리 삭제 중 문제가 발생했습니다.");
            }
        }
    };


    // 카테고리 수정
    const updateCategory = async (updatedCategory) => {
        try {
            await axios.post(`${BASE_URL}/updatecategory`, updatedCategory);
            fetchCategories(); // 수정 후 업데이트
        } catch (error) {
            console.error("Failed to update category:", error);
        }
    };

    // 사용 여부 토글
    const toggleVisibility = async (categoryId, isVisible) => {
        try {
            await axios.post(`${BASE_URL}/category/toggle-visibility`, {
                categoryId,
                isVisible,
            });
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.categoryId === categoryId
                        ? { ...category, isVisible }
                        : category
                )
            );
        } catch (error) {
            console.error("Failed to toggle visibility:", error);
        }
    };


    // 활성화된 카테고리만 가져오기
    const fetchVisibleCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/category/visibility`);
            setVisibleCategories(res.data); // 활성화된 카테고리 설정
            console.log("Fetched visible categories:", res.data);
        } catch (err) {
            console.error("Failed to fetch visible categories:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []); // 빈 의존성 배열


     // 처음 마운트될 때만 카테고리 전체 데이터를 가져옴
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    
    return { categories, setCategories, fetchCategories, fetchVisibleCategories, visibleCategories, addCategory, deleteCategory, updateCategory, toggleVisibility, loading, error };
};



        
export default useCategory;

