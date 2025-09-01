import React, { useState } from 'react';
import { Layout, Menu, Tabs, Button, Dropdown, type MenuProps } from 'antd';
import {
    AppstoreOutlined, TeamOutlined, SettingOutlined,
    CalendarOutlined, FileTextOutlined, SoundOutlined, ShoppingOutlined,
    UserOutlined, DownOutlined, TagsOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, HeartOutlined
} from '@ant-design/icons';
import { useAuth } from '../features/auth';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserTable from '../table/UserTable';
import ProductTable from '../table/ProductTable';
import ProductsRoutes from '../features/products/ProductsRoutes';
import DashboardPage from '../features/dashboard/pages/DashboardPage'; // ✅ dashboard
import './sidebarlayout.css';

const { Sider, Content } = Layout;
type View = 'kullanicilar' | 'stok' | 'none';

export default function SidebarLayout() {
    const { user, openLogin, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<View>('kullanicilar');
    const [openKeys, setOpenKeys] = useState<string[]>(['kullanici-yonetimi']);
    const [selectedKey, setSelectedKey] = useState<string>('dashboard'); // ✅ başlangıç: dashboard
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [collapsed, setCollapsed] = useState(false);

    const sideItems = [
        { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
        {
            key: 'kullanici-yonetimi',
            icon: <TeamOutlined />,
            label: <span className="menu-label-with">Kullanıcı Yönetimi <DownOutlined className="menu-drop" /></span>,
            children: [
                { key: 'kullanicilar', icon: <UserOutlined />, label: 'Kullanıcılar' },
                { key: 'roller-yetkiler', icon: <TagsOutlined />, label: 'Roller ve Yetkiler' },
            ],
        },
        { key: 'departmanlar', icon: <AppstoreOutlined />, label: 'Departmanlar' },
        { key: 'izin', icon: <CalendarOutlined />, label: 'İzin Yönetimi' },
        { key: 'belgeler', icon: <FileTextOutlined />, label: 'Belgeler' },
        { key: 'duyurular', icon: <SoundOutlined />, label: 'Duyurular' },
        { key: 'urunler-menu', icon: <ShoppingOutlined />, label: 'Ürünler' },
        { key: 'favoriler-menu', icon: <HeartOutlined />, label: 'Favoriler' },
        { key: 'ayarlar', icon: <SettingOutlined />, label: 'Ayarlar' },
    ];

    const tabItems = [
        { key: 'kullanicilar', label: <span className="top-tab">Kullanıcılar ({userCount})</span> },
        { key: 'stok', label: <span className="top-tab">Stok Durumu ({productCount})</span> },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        setSelectedKey(key);

        if (key === 'dashboard') {
            setActiveTab('none');
            navigate('/'); // ✅ dashboard ana rota
            return;
        }

        if (key === 'kullanicilar') {
            setActiveTab('kullanicilar');
            if (!openKeys.includes('kullanici-yonetimi')) setOpenKeys(prev => [...prev, 'kullanici-yonetimi']);
            navigate('/');
            return;
        }

        if (key === 'roller-yetkiler') {
            setActiveTab('none');
            if (!openKeys.includes('kullanici-yonetimi')) setOpenKeys(prev => [...prev, 'kullanici-yonetimi']);
            navigate('/');
            return;
        }

        if (key === 'urunler-menu') {
            setActiveTab('none');
            navigate('/products'); // ✅ Ürün listesi
            return;
        }

        if (key === 'favoriler-menu') {
            setActiveTab('none');
            navigate('/products/favorites'); // ✅ Favoriler
            return;
        }

        // diğer menüler şimdilik boş sayfa
        setActiveTab('none');
        navigate('/');
    };

    const computedSelectedKeys =
        selectedKey === 'kullanicilar' || selectedKey === 'roller-yetkiler'
            ? [selectedKey, 'kullanici-yonetimi']
            : [selectedKey];

    const initial = user ? (user.name?.trim()?.charAt(0)?.toUpperCase() || 'K') : '';
    const menuItems: MenuProps['items'] = [{ key: 'logout', icon: <LogoutOutlined />, label: 'Çıkış Yap' }];

    return (
        <Layout className="app-layout">
            <Sider width={260} collapsedWidth={80} collapsible collapsed={collapsed} trigger={null} className="sider">
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
                />
            </Sider>

            <Layout className="main">
                {/* Üst bar */}
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

                    {selectedKey === 'kullanicilar' && (
                        <div className="topbar-row topbar-tabs-row">
                            <Tabs
                                items={tabItems}
                                activeKey={activeTab}
                                onChange={(k) => setActiveTab(k as View)}
                                className="top-tabs"
                                centered
                            />
                        </div>
                    )}
                </div>

                <Content className="content-wrap">
                    <Routes>
                        {/* Products feature routing */}
                        <Route path="/products/*" element={<ProductsRoutes />} />

                        {/* Ana rota: dashboard veya kullanıcılar sekmeleri */}
                        <Route
                            path="/"
                            element={
                                selectedKey === 'dashboard' ? (
                                    <DashboardPage />                              // ✅ Dashboard görünür
                                ) : selectedKey === 'kullanicilar' ? (
                                    activeTab === 'kullanicilar' ? (
                                        <UserTable onCountChange={setUserCount} />
                                    ) : (
                                        <ProductTable onCountChange={setProductCount} />
                                    )
                                ) : (
                                    <div className="content-blank" />             // diğer menüler: şimdilik boş
                                )
                            }
                        />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}
