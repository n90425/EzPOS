import React, { useEffect,useState } from 'react';
import getfetch from "../api/fetch";
import "../css/catelist.css";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CategoryList({ categories, setCategories }) {
    // 각 카테고리의 표시 여부(visible 상태)를 토글함
    const toggleVisibility = (index) => {
        const newCategories = [...categories];
        newCategories[index].visible = !newCategories[index].visible;
        setCategories(newCategories);
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await getfetch(`${BASE_URL}/category`);
                // 가져온 데이터에 visible 속성을 추가하여 설정
                const formattedData = data.map((category) => ({
                    ...category,
                    visible: category.visible ?? true, // 초기 visible 값을 설정
                }));
                console.log(data);
                setCategories(formattedData);
            } catch (error) {
                console.error("Table Error", error);
            }
        };
        getCategories();
    }, [setCategories]);

    return (
        <div className="category-list">
            <h2>카테고리</h2>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <span>{category.name}</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={category.visible}
                                onChange={() => toggleVisibility(index)}
                            />
                            <span className="slider"></span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryList;
