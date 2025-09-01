import React, { useMemo, useState } from 'react';
import { Table, Button, Space, Popconfirm, Input, Card, Form, Input as AntInput, Select, Drawer, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExclamationCircleOutlined, DeleteOutlined, EyeOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import './tablo.css';

export type UserRole = 'Yönetici' | 'Editör' | 'Üye';
export interface User { key: string; ad: string; email: string; rol: UserRole; }
type Props = { onCountChange?: (n: number) => void };

const UserTable: React.FC<Props> = ({ onCountChange }) => {
    const [data, setData] = useState<User[]>([
        { key: '1', ad: 'Ayşe Yılmaz', email: 'ayse.yilmaz@example.com', rol: 'Yönetici' },
        { key: '2', ad: 'Mehmet Demir', email: 'mehmet.demir@example.com', rol: 'Editör' },
        { key: '3', ad: 'Elif Kara', email: 'elif.kara@example.com', rol: 'Üye' },
        { key: '4', ad: 'Can Acar', email: 'can.acar@example.com', rol: 'Üye' },
    ]);
    const [q, setQ] = useState('');
    const [editingKey, setEditingKey] = useState<string>('');
    const [form] = Form.useForm();

    // Drawer: Kullanıcı Ekle
    const [addOpen, setAddOpen] = useState(false);
    const [addForm] = Form.useForm();

    // Modal: Detay
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailUser, setDetailUser] = useState<User | null>(null);

    React.useEffect(() => { onCountChange?.(data.length); }, [data.length]);

    const isEditing = (r: User) => r.key === editingKey;
    const edit = (r: User) => { form.setFieldsValue({ ad: r.ad, email: r.email, rol: r.rol }); setEditingKey(r.key); };
    const cancel = () => setEditingKey('');
    const save = async (key: string) => {
        const row = (await form.validateFields()) as Omit<User, 'key'>;
        setData(prev => prev.map(it => it.key === key ? { ...it, ...row } : it)); setEditingKey('');
    };
    const handleSil = (key: string) => setData(prev => prev.filter(it => it.key !== key));

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase(); if (!s) return data;
        return data.filter(u =>
            u.ad.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.rol.toLowerCase().includes(s)
        );
    }, [q, data]);

    const columns: ColumnsType<User> = [
        {
            title: 'Ad', dataIndex: 'ad', key: 'ad',
            sorter: (a, b) => a.ad.localeCompare(b.ad, 'tr'),
            render: (_: any, r) => isEditing(r)
                ? <Form.Item name="ad" style={{ margin: 0 }} rules={[{ required: true, message: 'Ad gerekli' }]}><AntInput /></Form.Item>
                : r.ad
        },
        {
            title: 'E-posta', dataIndex: 'email', key: 'email',
            render: (_: any, r) => isEditing(r)
                ? <Form.Item name="email" style={{ margin: 0 }} rules={[{ required: true, type: 'email', message: 'Geçerli e-posta' }]}><AntInput /></Form.Item>
                : <a href={`mailto:${r.email}`}>{r.email}</a>
        },
        {
            title: 'Rol', dataIndex: 'rol', key: 'rol',
            filters: [{ text: 'Yönetici', value: 'Yönetici' }, { text: 'Editör', value: 'Editör' }, { text: 'Üye', value: 'Üye' }],
            onFilter: (v, r) => r.rol === v,
            render: (_: any, r) => isEditing(r)
                ? <Form.Item name="rol" style={{ margin: 0 }} rules={[{ required: true }]}><Select options={[{ value: 'Yönetici' }, { value: 'Editör' }, { value: 'Üye' }]} /></Form.Item>
                : <span className="role-text">{r.rol}</span>
        },
        {
            title: 'İşlemler', key: 'actions', align: 'right',
            render: (_, r) => {
                const editable = isEditing(r);
                return editable ? (
                    <Space>
                        <Button type="primary" icon={<SaveOutlined />} onClick={() => save(r.key)}>Kaydet</Button>
                        <Button icon={<CloseOutlined />} onClick={cancel}>İptal</Button>
                    </Space>
                ) : (
                    <Space>
                        <Button className="btn-dark" icon={<EyeOutlined />} onClick={() => { setDetailUser(r); setDetailOpen(true); }}>Detay</Button>
                        <Button className="btn-mustard" icon={<EditOutlined />} onClick={() => edit(r)}>Düzenle</Button>
                        <Popconfirm
                            title="Kullanıcıyı sil"
                            description={`“${r.ad}” silinsin mi?`}
                            okText="Evet" cancelText="Vazgeç"
                            icon={<ExclamationCircleOutlined />}
                            onConfirm={() => handleSil(r.key)}
                        >
                            <Button className="btn-danger-ghost" icon={<DeleteOutlined />}>Sil</Button>
                        </Popconfirm>
                    </Space>
                );
            }
        },
    ];

    return (
        <Card
            className="users-card"
            title={
                <div className="table-header">
                    <div className="left">
                        <Input allowClear placeholder="Ara: ad, e-posta, rol…" prefix={<SearchOutlined />}
                            value={q} onChange={e => setQ(e.target.value)} style={{ width: 320 }} />
                    </div>
                    <div className="right">
                        <Button className="btn-dark" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>Kullanıcı Ekle</Button>
                    </div>
                </div>
            }
        >
            <Form form={form} component={false}>
                <Table<User>
                    rowKey="key"
                    columns={columns}
                    dataSource={filtered}
                    pagination={{ pageSize: 5, showSizeChanger: false }}
                    size="middle"
                />
            </Form>

            {/* Detay Modal — ortada küçük kare */}
            <Modal
                title="Kullanıcı Detayı"
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={null}
                centered
                width={420}
            >
                {detailUser && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>Ad:</b> {detailUser.ad}</div>
                        <div><b>E-posta:</b> {detailUser.email}</div>
                        <div><b>Rol:</b> {detailUser.rol}</div>
                    </div>
                )}
            </Modal>

            {/* Kullanıcı Ekle — Drawer (değişmedi) */}
            <Drawer
                title="Kullanıcı Ekle"
                open={addOpen}
                onClose={() => setAddOpen(false)}
                width={440}
                destroyOnClose
                footer={null}
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={(vals) => {
                        const k = String(Date.now());
                        setData(prev => [...prev, { key: k, ad: vals.ad, email: vals.email, rol: vals.rol }]);
                        setAddOpen(false);
                    }}
                    initialValues={{ rol: 'Üye' }}
                >
                    <Form.Item name="ad" label="Ad Soyad" rules={[{ required: true, message: 'Ad gerekli' }]}><AntInput /></Form.Item>
                    <Form.Item name="email" label="E-posta" rules={[{ required: true, type: 'email', message: 'Geçerli e-posta gerekli' }]}><AntInput /></Form.Item>
                    <Form.Item name="rol" label="Rol" rules={[{ required: true }]}><Select options={[{ value: 'Yönetici' }, { value: 'Editör' }, { value: 'Üye' }]} /></Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => setAddOpen(false)}>Vazgeç</Button>
                            <Button type="primary" onClick={() => addForm.submit()}>Ekle</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        </Card>
    );
};

export default UserTable;
