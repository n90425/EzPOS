import {React, useEffect, useState } from "react";
import Draggable from "react-draggable";
import getfetch from "../../api/fetch";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function NewDining({tables, setTables, textSize}) {
    const handleAddTable = () => {
        const newTable = {
            id : tables.length + 1,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            tableColor: "blue"
        };
        setTables([...tables, newTable]);
    };

    return (
        <div className="grid-area">
        {tables.map((table) => (
            <Draggable
                key={table.id}
                defaultPosition={{ x: table.x, y: table.y }}
                onStop={(e, data) => {
                    const updatedTables = tables.map((t) =>
                        t.id === table.id ? { ...t, x: data.x, y: data.y } : t
                    );
                    setTables(updatedTables);
                }}
            >
                <div
                    className="table-item"
                    style={{
                        width: table.width,
                        height: table.height,
                        fontSize: textSize === "large" ? "1.5em" : "1em",
                    }}
                >
                    테이블 {table.id}
                </div>
            </Draggable>
        ))}
        <button className="add-table-button" onClick={handleAddTable}>
            <span className="add-icon">+</span> 테이블 추가
        </button>
    </div>
);
}

export default NewDining;