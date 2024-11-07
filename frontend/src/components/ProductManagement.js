import React from 'react';
import Sidebar from '../components/CateSide';
import Header from '../components/CateHead';
import CategoryList from '../components/CateList';

function ProductManagement() {
    return (
        <div className="product-management">
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <CategoryList />
                </div>
        </div>
    );
}

export default ProductManagement;