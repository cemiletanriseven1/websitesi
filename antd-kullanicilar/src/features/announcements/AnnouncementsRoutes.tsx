import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnnouncementsPage from './pages/AnnouncementsPage';

export default function AnnouncementsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AnnouncementsPage />} />
        </Routes>
    );
}
