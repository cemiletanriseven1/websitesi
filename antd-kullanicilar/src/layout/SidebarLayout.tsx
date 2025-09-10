import React, { useState } from 'react';
import { Layout, Menu, Tabs, Button, Dropdown, type MenuProps } from 'antd';
import {
    AppstoreOutlined, TeamOutlined, SettingOutlined,
    CalendarOutlined, FileTextOutlined, SoundOutlined, ShoppingOutlined,
    UserOutlined, TagsOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, HeartOutlined
} from '@ant-design/icons';
import { useAuth } from '../features/auth';
import { Routes, Route, useNavigate } from 'react-router-dom';

import UserTable from '../table/UserTable';
import ProductTable from '../table/ProductTable';
import ProductsRoutes from '../features/products/ProductsRoutes';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import AnnouncementsRoutes from '../features/announcements/AnnouncementsRoutes';
import { ProductsProvider } from '../features/products/store';
import { AnnouncementsProvider } from '../features/announcements/store';
import { UsersProvider } from '../features/users/store';

import { RolesProvider } from '../features/company/roles/store';
import RolesPage from '../features/company/roles/pages/RolesPage';

import { DepartmentsProvider } from '../features/company/departments/store';
import DepartmentsPage from '../features/company/departments/pages/DepartmentsPage';

import { LeavesProvider } from '../features/company/leaves/store';
import LeavesPage from '../features/company/leaves/pages/LeavesPage';

/** NEW: Belgeler */
import { DocumentsProvider } from '../features/documents/store';
import DocumentsPage from '../features/documents/pages/DocumentsPage';

import './sidebarlayout.css';
import SettingsPage from '../features/settings/SettingsPage';

const { Sider, Content } = Layout;
type View = 'kullanicilar' | 'stok' | 'none';

const PARENT_USERS = 'kullanicilar-menu';
const KEY_USER_LIST = 'kullanici-listesi';
const KEY_STOCK = 'stok';

const PARENT_EMPLOYEES = 'calisanlar';
const KEY_ROLES = 'roller-yetkiler';
const KEY_DEPTS = 'departmanlar';
const KEY_LEAVE = 'izin';

export default function SidebarLayout() {
    const { user, openLogin, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<View>('kullanicilar');
    const [openKeys, setOpenKeys] = useState<string[]>([PARENT_USERS, PARENT_EMPLOYEES]);
    const [selectedKey, setSelectedKey] = useState<string>('dashboard');
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [collapsed, setCollapsed] = useState(false);

    const sideItems = [
        { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Kontrol Paneli' },
        {
            key: PARENT_USERS,
            icon: <UserOutlined />,
            label: (
                <span className="menu-label-with">
                    Kullanıcılar/Stok
                    <span className={`chevrons ${openKeys.includes(PARENT_USERS) ? 'open' : ''}`} aria-hidden />
                </span>
            ),
            children: [
                { key: KEY_USER_LIST, icon: <UserOutlined />, label: 'Kullanıcılar' },
                { key: KEY_STOCK, icon: <ShoppingOutlined />, label: 'Stok' },
            ],
        },
        {
            key: PARENT_EMPLOYEES,
            icon: <TeamOutlined />,
            label: (
                <span className="menu-label-with">
                    Çalışanlar
                    <span className={`chevrons ${openKeys.includes(PARENT_EMPLOYEES) ? 'open' : ''}`} aria-hidden />
                </span>
            ),
            children: [
                { key: KEY_DEPTS, icon: <AppstoreOutlined />, label: 'Departmanlar' },
                { key: KEY_ROLES, icon: <TagsOutlined />, label: 'Roller ve Yetkiler' },
                { key: KEY_LEAVE, icon: <CalendarOutlined />, label: 'İzin Yönetimi' },
            ],
        },
        { key: 'belgeler', icon: <FileTextOutlined />, label: 'Belgeler' },
        { key: 'duyurular', icon: <SoundOutlined />, label: 'Duyurular' },
        { key: 'urunler-menu', icon: <ShoppingOutlined />, label: 'Ürünler' },
        { key: 'favoriler-menu', icon: <HeartOutlined />, label: 'Favoriler' },
        { key: 'ayarlar', icon: <SettingOutlined />, label: 'Ayarlar' },
    ];

    const tabItems = [
        { key: 'kullanicilar', label: <span className="top-tab">Kullanıcılar ({userCount})</span> },
        { key: 'stok', label: <span className="top-tab">Stok ({productCount})</span> },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        setSelectedKey(key);

        if (key === 'dashboard') { setActiveTab('none'); navigate('/'); return; }
        if (key === KEY_USER_LIST) {
            setActiveTab('kullanicilar');
            if (!openKeys.includes(PARENT_USERS)) setOpenKeys(p => [...p, PARENT_USERS]);
            navigate('/');
            return;
        }
        if (key === KEY_STOCK) {
            setActiveTab('stok');
            if (!openKeys.includes(PARENT_USERS)) setOpenKeys(p => [...p, PARENT_USERS]);
            navigate('/');
            return;
        }

        if (key === KEY_ROLES) { setActiveTab('none'); if (!openKeys.includes(PARENT_EMPLOYEES)) setOpenKeys(p => [...p, PARENT_EMPLOYEES]); navigate('/roles'); return; }
        if (key === KEY_DEPTS) { setActiveTab('none'); if (!openKeys.includes(PARENT_EMPLOYEES)) setOpenKeys(p => [...p, PARENT_EMPLOYEES]); navigate('/departments'); return; }
        if (key === KEY_LEAVE) { setActiveTab('none'); if (!openKeys.includes(PARENT_EMPLOYEES)) setOpenKeys(p => [...p, PARENT_EMPLOYEES]); navigate('/leaves'); return; }

        if (key === 'urunler-menu') { setActiveTab('none'); navigate('/products'); return; }
        if (key === 'favoriler-menu') { setActiveTab('none'); navigate('/products/favorites'); return; }
        if (key === 'duyurular') { setActiveTab('none'); navigate('/announcements'); return; }
        if (key === 'belgeler') { setActiveTab('none'); navigate('/documents'); return; }
        if (key === 'ayarlar') { setActiveTab('none'); navigate('/settings'); return; }

        setActiveTab('none'); navigate('/');
    };

    /* Tab değişince sol menüde doğru item yansısın */
    const handleTabChange = (k: string) => {
        const view = k as View;
        setActiveTab(view);
        if (!openKeys.includes(PARENT_USERS)) setOpenKeys(p => [...p, PARENT_USERS]);
        setSelectedKey(view === 'kullanicilar' ? KEY_USER_LIST : KEY_STOCK);
    };

    const computedSelectedKeys =
        selectedKey === KEY_USER_LIST || selectedKey === KEY_STOCK
            ? [selectedKey, PARENT_USERS]
            : [KEY_DEPTS, KEY_ROLES, KEY_LEAVE].includes(selectedKey)
                ? [selectedKey, PARENT_EMPLOYEES]
                : [selectedKey];

    const initial = user ? (user.name?.trim()?.charAt(0)?.toUpperCase() || 'K') : '';
    const menuItems: MenuProps['items'] = [{ key: 'logout', icon: <LogoutOutlined />, label: 'Çıkış Yap' }];

    return (
        <RolesProvider>
            <DepartmentsProvider>
                <AnnouncementsProvider>
                    <ProductsProvider>
                        <UsersProvider>
                            <LeavesProvider>
                                <DocumentsProvider>
                                    <Layout className="app-layout">
                                        <Sider
                                            width={232}
                                            collapsedWidth={72}
                                            collapsible
                                            collapsed={collapsed}
                                            trigger={null}
                                            className="sider"
                                        >
                                            <div className="brand">
                                                <span className="brand-text">Şirket Paneli</span>
                                                <Button
                                                    type="text"
                                                    className="sider-toggle"
                                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                                    onClick={() => setCollapsed(!collapsed)}
                                                />
                                            </div>

                                            <Menu
                                                mode="inline"
                                                className="side-menu"
                                                items={sideItems}
                                                selectedKeys={computedSelectedKeys}
                                                openKeys={openKeys}
                                                onOpenChange={(keys) => setOpenKeys(keys as string[])}
                                                onClick={handleMenuClick}
                                                expandIcon={() => null}
                                                inlineCollapsed={collapsed}
                                            />
                                        </Sider>

                                        <Layout className="main">
                                            <div className="topbar">
                                                <div className="topbar-row">
                                                    <div className="topbar-right">
                                                        {user ? (
                                                            <Dropdown
                                                                trigger={['hover']}
                                                                placement="bottomRight"
                                                                arrow
                                                                menu={{ items: menuItems, onClick: ({ key }) => key === 'logout' && logout() }}
                                                            >
                                                                <div className="user-avatar" title={user.name}>{initial}</div>
                                                            </Dropdown>
                                                        ) : (
                                                            <button className="user-btn user-circle" onClick={openLogin} title="Giriş Yap">
                                                                <UserOutlined />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {(selectedKey === KEY_USER_LIST || selectedKey === KEY_STOCK) && (
                                                    <div className="topbar-row topbar-tabs-row">
                                                        <Tabs
                                                            items={tabItems}
                                                            activeKey={activeTab}
                                                            onChange={handleTabChange}
                                                            className="top-tabs"
                                                            centered
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <Content className="content-wrap">
                                                <Routes>
                                                    <Route path="/products/*" element={<ProductsRoutes />} />
                                                    <Route path="/announcements/*" element={<AnnouncementsRoutes />} />
                                                    <Route path="/roles" element={<RolesPage />} />
                                                    <Route path="/departments" element={<DepartmentsPage />} />
                                                    <Route path="/leaves" element={<LeavesPage />} />
                                                    <Route path="/documents" element={<DocumentsPage />} />
                                                    <Route path="/settings" element={<SettingsPage />} />

                                                    <Route
                                                        path="/"
                                                        element={
                                                            selectedKey === 'dashboard' ? (
                                                                <DashboardPage />
                                                            ) : (selectedKey === KEY_USER_LIST || selectedKey === KEY_STOCK) ? (
                                                                activeTab === 'kullanicilar' ? (
                                                                    <UserTable onCountChange={setUserCount} />
                                                                ) : (
                                                                    <ProductTable onCountChange={setProductCount} />
                                                                )
                                                            ) : (
                                                                <div className="content-blank" />
                                                            )
                                                        }
                                                    />
                                                </Routes>
                                            </Content>
                                        </Layout>
                                    </Layout>
                                </DocumentsProvider>
                            </LeavesProvider>
                        </UsersProvider>
                    </ProductsProvider>
                </AnnouncementsProvider>
            </DepartmentsProvider>
        </RolesProvider>
    );
}
