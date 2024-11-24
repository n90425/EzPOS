import React from 'react';

const MenuList = ({ menus, onEditMenu, onDeleteMenu }) => {
    return (
        <div className="menu-list">
            {menus.map((menu) => (
                <div key={menu.menuId} className="menu-item">
                    <h3>{menu.menuName}</h3>
                    <p>Price: {menu.menuPrice}원</p>
                    <p>{menu.menuDescription}</p>
                    <button onClick={() => onEditMenu(menu)}>수정</button>
                    <button onClick={() => onDeleteMenu(menu.menuId)}>삭제</button>
                </div>
            ))}
        </div>
    );
};

export default MenuList;