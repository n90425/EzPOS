import React from 'react';

const MenuList = ({ menus, onAddToOrder }) => {
    return (
        <div className="menu-list">
            {menus.map((menu) => (
                // 클릭 시 메뉴 ID를 전달
                <div key={menu.menuId} className="menu-item" onClick={()=>onAddToOrder(menu.menuId)}>  
                    <h3>{menu.menuName}</h3>
                    <p>Price: {menu.menuPrice}원</p>
                    <p>{menu.menuDescription}</p>
                </div>
            ))}
        </div>
    );
};

export default MenuList;