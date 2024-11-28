import React from "react";
import "./alertBar.css"

function AlertBar({message, isVisible}) {
    return (
        <div className={`alert-bar ${isVisible ? 'visible': ''}`}>
            {message}
        </div>
    );
}

export default AlertBar;