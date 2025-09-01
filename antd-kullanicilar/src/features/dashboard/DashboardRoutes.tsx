import React from 'react';
import { RouteObject } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';

const dashboardRoutes: RouteObject[] = [
    { path: '/', element: <DashboardPage /> },          // ana sayfa
    { path: '/dashboard', element: <DashboardPage /> }, // alternatif
];

export default dashboardRoutes;
