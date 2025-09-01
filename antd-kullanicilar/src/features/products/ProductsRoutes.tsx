import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductsList from './ProductsList';
import ProductDetailPage from './ProductDetailPage';
import FavoritesPage from './FavoritesPage';
import CheckoutPage from './CheckoutPage';

export default function ProductsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ProductsList />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path=":id" element={<ProductDetailPage />} />
        </Routes>
    );
}
