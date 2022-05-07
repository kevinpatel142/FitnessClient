import React from 'react';

function LogOut() {
    localStorage.clear();
    window.location.href = "/";

    return (
        <></>
    );
}

export default LogOut;