import React from 'react';
import { Outlet } from 'react-router-dom';

const Land = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default Land;