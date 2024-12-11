import React, { createContext, useContext } from "react";
import useItem from "../hooks/useItem"; // 아이템 관련 훅
import useCategory from "../hooks/useCategory"; // 카테고리 관련 훅

const ItemCategoryContext = createContext();

export const ItemCategoryProvider = ({ children }) => {
    const itemState = useItem();
    const categoryState = useCategory();

    return (
        <ItemCategoryContext.Provider value={{ itemState, categoryState }}>
        {children}
        </ItemCategoryContext.Provider>
    );
};

export const useItemCategoryContext = () => useContext(ItemCategoryContext);
