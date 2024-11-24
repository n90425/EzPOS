import React from "react";

const Menu = ({menus, onAddtoOrder}) => {
    return (
        <div className="menu-grid">
            {menus.map(menu => (
                <div
                    key={menu.menuId}
                    className="menu-card"
                    onClick={() => onAddtoOrder(menu)}
                >
                    <h3>{menu.menuName}</h3>
                    <p>{menu.menuPrice}</p>
                </div>
            ))}
        </div>
    )
}

export default Menu;