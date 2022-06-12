import React from 'react';

const TYPES = [
    "error",
    "default"
]

const Notification = ({message, type}) => {
    if (message === null)
        return null;
    if (type === null || !TYPES.includes(type))
        type = "default";
    const notificationStyle = {
        backgroundColor: (type === "default") ? "lightgrey" : "lightred",
        color: "black",
        border: `3px solid ${(type === 'default') ? "black" : "red"}`,
        padding: "10px",
        margin: "5px",
        fontFamily: "sans-serif",
        textAlign: "center"
    }
    return (
        <div style={notificationStyle}>{message}</div>
    )
}

export default Notification;