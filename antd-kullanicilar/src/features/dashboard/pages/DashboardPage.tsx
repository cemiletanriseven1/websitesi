import React from 'react';
import { Row, Col, Card, Progress, List, Table, Tag, Button, Space, Avatar, Timeline } from 'antd';
import { UserOutlined, TeamOutlined, ShoppingOutlined, HeartOutlined, FileAddOutlined, UploadOutlined, BellOutlined } from '@ant-design/icons';
import { kpis, recentUsers, pendingLeaves, topProducts, announcements } from '../data';
import KpiCard from '../components/KpiCard';
import '../dashboard.css';

export default function DashboardPage() {
    return (
        <div className="dashboard-page">
            {/* KPI SATIRI */}
            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}><KpiCard title="Aktif Kullanıcı" value={kpis.activeUsers} colorClass="kpi-blue" icon={<UserOutlined />} /></Col>
                <Col xs={12} md={6}><KpiCard title="Departman" value={kpis.departments} colorClass="kpi-green" icon={<TeamOutlined />} /></Col>
                <Col xs={12} md={6}><KpiCard title="Ürün" value={kpis.products} colorClass="kpi-purple" icon={<ShoppingOutlined />} /></Col>
                <Col xs={12} md={6}><KpiCard title="Favori" value={kpis.favorites} colorClass="kpi-pink" icon={<HeartOutlined />} /></Col>
            </Row>

            {/* ORTA BLOK */}
            <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                <Col xs={24} lg={16}>
                    <Card title="Aylık Hedef & İlerleme">
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <div className="progress-block">
                                    <div className="progress-title">Yeni Kullanıcı Hedefi</div>
                                    <Progress percent={72} status="active" />
                                    <div className="progress-meta">Hedef 500 · Şu an 360</div>
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <div className="progress-block">
                                    <div className="progress-title">Satış Hedefi</div>
                                    <Progress type="circle" percent={58} />
                                    <div className="progress-meta">Hedef 1.2M ₺ · Şu an 696K ₺</div>
                                </div>
                            </Col>
                        </Row>
                        <div className="mini-legend">
                            <Tag color="blue">Kullanıcı</Tag>
                            <Tag color="purple">Satış</Tag>
                            <Tag>Güncellendi: bugün</Tag>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Hızlı İşlemler">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button block icon={<FileAddOutlined />}>Yeni Kullanıcı Oluştur</Button>
                            <Button block icon={<UploadOutlined />}>CSV ile Kullanıcı İçe Aktar</Button>
                            <Button block icon={<ShoppingOutlined />}>Yeni Ürün Ekle</Button>
                            <Button block icon={<BellOutlined />}>Duyuru Yayınla</Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* ALT GRID */}
            <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                <Col xs={24} lg={12}>
                    <Card title="Son Eklenen Kullanıcılar">
                        <List
                            itemLayout="horizontal"
                            dataSource={recentUsers}
                            renderItem={(u) => (
                                <List.Item actions={[<Tag key="role">{u.role}</Tag>]}>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={u.name}
                                        description={`${u.department} • ${u.email}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Bekleyen İzin Talepleri">
                        <Table
                            size="small"
                            rowKey="id"
                            dataSource={pendingLeaves}
                            pagination={false}
                            columns={[
                                { title: 'Ad', dataIndex: 'name' },
                                { title: 'Tür', dataIndex: 'type' },
                                { title: 'Gün', dataIndex: 'days', align: 'right' },
                                { title: 'Durum', dataIndex: 'status', render: (v: string) => <Tag color="orange">{v}</Tag> }
                            ]}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="En Çok Görüntülenen Ürünler">
                        <Table
                            size="small"
                            rowKey="id"
                            dataSource={topProducts}
                            pagination={false}
                            columns={[
                                { title: 'Ürün', dataIndex: 'name' },
                                { title: 'Kategori', dataIndex: 'category' },
                                { title: 'Görüntülenme', dataIndex: 'views', align: 'right' },
                            ]}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Duyurular">
                        <Timeline
                            items={announcements.map(a => ({
                                color: a.color || 'gray',
                                children: <div><strong>{a.title}</strong><div className="muted">{a.date}</div></div>
                            }))}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
