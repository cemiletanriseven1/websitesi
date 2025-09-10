import React, { useMemo, useState } from 'react';
import {
    Row, Col, Card, Progress, List, Table, Tag, Button, Space, Avatar, Timeline, Modal, Upload, Select, message, Form, Input, InputNumber
} from 'antd';
import {
    UserOutlined, TeamOutlined, ShoppingOutlined, HeartOutlined,
    UploadOutlined, BellOutlined, FileExcelOutlined, FileTextOutlined
} from '@ant-design/icons';
import { kpis, recentUsers, pendingLeaves, topProducts } from '../data';
import KpiCard from '../components/KpiCard';
import '../dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../products/store';
import { useAnnouncements } from '../../announcements/store';
import dayjs from 'dayjs';

type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { addProduct } = useProducts();
    const { announcements, addAnnouncement } = useAnnouncements();

    // ===== Export/Import state =====
    const [exportOpen, setExportOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
    const [exportSource, setExportSource] = useState<'users' | 'products' | 'leaves'>('users');

    // ===== Product create modal =====
    const [createOpen, setCreateOpen] = useState(false);
    const [pForm] = Form.useForm();

    // ===== Announcement create modal =====
    const [annOpen, setAnnOpen] = useState(false);
    const [aForm] = Form.useForm();

    // Dışa aktarılacak veri
    const exportRows = useMemo(() => {
        if (exportSource === 'users') return recentUsers;
        if (exportSource === 'products') return topProducts;
        return pendingLeaves;
    }, [exportSource]);

    const exportCsv = (rows: Record<string, any>[], filename = 'export.csv') => {
        if (!rows.length) {
            message.info('Aktarılacak veri bulunamadı.');
            return;
        }
        const headers = Object.keys(rows[0]);
        const body = rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')).join('\n');
        const csv = [headers.join(','), body].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        message.success('CSV dışa aktarıldı.');
    };

    const handleExport = async () => {
        const filename = `dashboard-${exportSource}.${exportFormat}`;
        if (exportFormat === 'csv') {
            exportCsv(exportRows as any[], filename);
        } else if (exportFormat === 'xlsx') {
            message.info('Excel için projeye `xlsx` paketi ekleyip tamamlayabiliriz.');
        } else if (exportFormat === 'pdf') {
            message.info('PDF için `jspdf` + `autoTable` ile tamamlanır.');
        }
        setExportOpen(false);
    };

    const handleImport = (file: File) => {
        if (file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = () => {
                const text = String(reader.result || '');
                const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
                const headers = headerLine.split(',');
                const data = lines.map(l => {
                    const parts = l.split(',');
                    const obj: Record<string, any> = {};
                    headers.forEach((h, i) => (obj[h] = parts[i]));
                    return obj;
                });
                console.log('İçe aktarılan CSV veri:', data);
                message.success('CSV içe aktarıldı (konsola yazdırıldı).');
            };
            reader.readAsText(file);
            setImportOpen(false);
        } else {
            message.warning('Şimdilik örnek akış CSV içindir. XLSX/PDF için paket ekleyebiliriz.');
        }
        return false as unknown as void;
    };

    const createProduct = async () => {
        const v = await pForm.validateFields();
        const newP = addProduct({
            title: v.title,
            price: Number(v.price),
            category: v.category,
            stock: Number(v.stock),
            img: v.img,
            desc: v.desc,
        });
        message.success('Ürün eklendi');
        setCreateOpen(false);
        pForm.resetFields();
        navigate('/products'); // ürünler sayfasında görün
    };

    const publishAnnouncement = async () => {
        const v = await aForm.validateFields();
        addAnnouncement({
            title: v.title,
            color: v.color || 'blue',
            date: v.date || dayjs().format('DD.MM.YYYY'),
        });
        message.success('Duyuru yayınlandı');
        setAnnOpen(false);
        aForm.resetFields();
        navigate('/announcements');
    };

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
                            {/* Yeni Kullanıcı Oluştur — kaldırıldı */}
                            <Button block icon={<UploadOutlined />} onClick={() => setImportOpen(true)}>CSV ile Kullanıcı İçe Aktar</Button>
                            <Button block icon={<ShoppingOutlined />} onClick={() => setCreateOpen(true)}>Yeni Ürün Ekle</Button>
                            <Button block icon={<BellOutlined />} onClick={() => setAnnOpen(true)}>Duyuru Yayınla</Button>
                            <Button block icon={<FileExcelOutlined />} onClick={() => setExportOpen(true)}>Dışa Aktar</Button>
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

            {/* ========= Modals ========= */}
            {/* Dışa aktar */}
            <Modal
                title="Dışa Aktar"
                open={exportOpen}
                onOk={handleExport}
                onCancel={() => setExportOpen(false)}
                okText="Aktar"
                cancelText="Kapat"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <div style={{ marginBottom: 6 }}>Kaynak:</div>
                        <Select
                            style={{ width: '100%' }}
                            value={exportSource}
                            onChange={(v) => setExportSource(v)}
                            options={[
                                { value: 'users', label: 'Son Eklenen Kullanıcılar' },
                                { value: 'products', label: 'En Çok Görüntülenen Ürünler' },
                                { value: 'leaves', label: 'Bekleyen İzinler' },
                            ]}
                        />
                    </div>
                    <div>
                        <div style={{ marginBottom: 6 }}>Format:</div>
                        <Select
                            style={{ width: '100%' }}
                            value={exportFormat}
                            onChange={(v) => setExportFormat(v)}
                            options={[
                                { value: 'csv', label: 'CSV (hızlı ve basit)' },
                                { value: 'xlsx', label: 'Excel (.xlsx)' },
                                { value: 'pdf', label: 'PDF' },
                            ]}
                        />
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                        Not: CSV hemen çalışır. Excel/PDF için projeye `xlsx` ve `jspdf` eklenebilir.
                    </div>
                </Space>
            </Modal>

            {/* İçe aktar */}
            <Modal title="İçe Aktar" open={importOpen} onCancel={() => setImportOpen(false)} footer={null}>
                <Upload.Dragger multiple={false} beforeUpload={handleImport} accept=".csv,.xlsx,.pdf">
                    <p className="ant-upload-drag-icon"><FileTextOutlined /></p>
                    <p className="ant-upload-text">Dosyanızı buraya sürükleyin ya da tıklayın</p>
                    <p className="ant-upload-hint">CSV, XLSX veya PDF desteklenir.</p>
                </Upload.Dragger>
            </Modal>

            {/* Yeni Ürün */}
            <Modal
                title="Yeni Ürün Ekle"
                open={createOpen}
                onOk={createProduct}
                onCancel={() => setCreateOpen(false)}
                okText="Kaydet"
                cancelText="Sil"
                okButtonProps={{ className: 'btn-brand' }}
                cancelButtonProps={{ className: 'btn-danger-ghost' }}
            >
                <Form layout="vertical" form={pForm}>
                    <Form.Item label="Ürün Adı" name="title" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item label="Kategori" name="category" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'Elektronik', label: 'Elektronik' },
                            { value: 'Mobilya', label: 'Mobilya' },
                            { value: 'Aksesuar', label: 'Aksesuar' },
                        ]} />
                    </Form.Item>
                    <Form.Item label="Fiyat (₺)" name="price" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
                    <Form.Item label="Stok" name="stock" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
                    <Form.Item label="Görsel URL" name="img"><Input placeholder="/assets/products/…" /></Form.Item>
                    <Form.Item label="Açıklama" name="desc"><Input.TextArea rows={3} /></Form.Item>
                </Form>
            </Modal>

            {/* Duyuru yayınla */}
            <Modal
                title="Duyuru Yayınla"
                open={annOpen}
                onOk={publishAnnouncement}
                onCancel={() => setAnnOpen(false)}
                okText="Kaydet"
                cancelText="Sil"
                okButtonProps={{ className: 'btn-brand' }}
                cancelButtonProps={{ className: 'btn-danger-ghost' }}
            >
                <Form layout="vertical" form={aForm}>
                    <Form.Item label="Başlık" name="title" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item label="Tarih (GG.AA.YYYY)" name="date" initialValue={dayjs().format('DD.MM.YYYY')}>
                        <Input placeholder="örn: 12.09.2025" />
                    </Form.Item>
                    <Form.Item label="Renk" name="color" initialValue="blue">
                        <Select options={['blue', 'purple', 'green', 'red', 'orange', 'gold', 'cyan', 'magenta'].map(c => ({ value: c, label: c }))} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
