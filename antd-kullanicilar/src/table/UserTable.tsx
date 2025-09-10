import React, { useMemo, useState } from 'react';
import { Table, Button, Space, Popconfirm, Input, Card, Form, Input as AntInput, Select, Drawer, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExclamationCircleOutlined, DeleteOutlined, EyeOutlined, EditOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

import { recentUsers } from '../features/dashboard/data';
import './tablo.css';

export type User = {
    id: string;
    name: string;
    email: string;
    plan: 'Aylık' | 'Yıllık' | 'Ücretsiz';
    roleId?: string;
    departmentId?: string;
};

type Props = { onCountChange?: (n: number) => void };

const UserTable: React.FC<Props> = ({ onCountChange }) => {
    const extra = recentUsers.slice(0, 5).map((u, i) => ({
        id: `ru-${i}`,
        name: u.name,
        email: u.email,
        plan: (i % 3 === 0 ? 'Yıllık' : i % 2 === 0 ? 'Ücretsiz' : 'Aylık') as User['plan'],
    }));

    const [data, setData] = useState<User[]>(() => ([
        { id: 'u1', name: 'Ayşe Yılmaz', email: 'ayse.yilmaz@example.com', plan: 'Yıllık' },
        { id: 'u2', name: 'Mehmet Demir', email: 'mehmet.demir@example.com', plan: 'Aylık' },
        { id: 'u3', name: 'Elif Kara', email: 'elif.kara@example.com', plan: 'Ücretsiz' },
        { id: 'u4', name: 'Can Acar', email: 'can.acar@example.com', plan: 'Aylık' },
        ...extra,
    ]));

    const [q, setQ] = useState('');
    const [editingId, setEditingId] = useState<string>('');
    const [form] = Form.useForm();

    const [addOpen, setAddOpen] = useState(false);
    const [addForm] = Form.useForm();
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailUser, setDetailUser] = useState<User | null>(null);

    React.useEffect(() => { onCountChange?.(data.length); }, [data.length, onCountChange]);

    const isEditing = (u: User) => u.id === editingId;
    const edit = (u: User) => {
        form.setFieldsValue({ name: u.name, email: u.email, plan: u.plan });
        setEditingId(u.id);
    };
    const cancel = () => setEditingId('');

    const save = async (id: string) => {
        const row = (await form.validateFields()) as Partial<User>;
        setData(prev => prev.map(it => it.id === id ? { ...it, ...row } : it));
        setEditingId('');
    };

    const handleSil = (id: string) => setData(prev => prev.filter(it => it.id !== id));

    const filtered: User[] = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return data;
        return data.filter((u) =>
            u.name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s) ||
            u.plan.toLowerCase().includes(s)
        );
    }, [q, data]);

    const planOptions = [
        { value: 'Aylık', label: 'Aylık' },
        { value: 'Yıllık', label: 'Yıllık' },
        { value: 'Ücretsiz', label: 'Ücretsiz' },
    ] as const;

    const columns: ColumnsType<User> = [
        {
            title: 'Ad',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name, 'tr'),
            render: (_: any, r) =>
                isEditing(r) ? (
                    <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true, message: 'Ad gerekli' }]}>
                        <AntInput />
                    </Form.Item>
                ) : r.name,
        },
        {
            title: 'E-posta',
            dataIndex: 'email',
            key: 'email',
            render: (_: any, r) =>
                isEditing(r) ? (
                    <Form.Item name="email" style={{ margin: 0 }} rules={[{ required: true, type: 'email', message: 'Geçerli e-posta' }]}>
                        <AntInput />
                    </Form.Item>
                ) : <a href={`mailto:${r.email}`}>{r.email}</a>,
        },
        {
            title: 'Abonelik',
            dataIndex: 'plan',
            key: 'plan',
            filters: planOptions.map(p => ({ text: p.label, value: p.value })),
            onFilter: (v, r) => r.plan === v,
            render: (_: any, r) =>
                isEditing(r) ? (
                    <Form.Item name="plan" style={{ margin: 0 }} rules={[{ required: true }]}>
                        <Select options={planOptions as any} />
                    </Form.Item>
                ) : (
                    <span className="plan-text">{r.plan}</span>
                ),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            align: 'right',
            render: (_: any, r) =>
                isEditing(r) ? (
                    <Space>
                        <Button className="btn-brand" type="primary" icon={<SaveOutlined />} onClick={() => save(r.id)}>
                            Kaydet
                        </Button>
                        <Button className="btn-danger-ghost" onClick={cancel} icon={<CloseOutlined />}>
                            İptal
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Button className="btn-dark" icon={<EyeOutlined />} onClick={() => { setDetailUser(r); setDetailOpen(true); }}>Detay</Button>
                        <Button className="btn-mustard" icon={<EditOutlined />} onClick={() => edit(r)}>Düzenle</Button>
                        <Popconfirm title="Kullanıcı silinsin mi?" onConfirm={() => handleSil(r.id)}>
                            <Button className="btn-danger-ghost" icon={<DeleteOutlined />}>Sil</Button>
                        </Popconfirm>
                    </Space>
                )
        }

    ];

    return (
        <Card className="users-card"
            title={(
                <Input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="Ara: ad, e-posta, plan…"
                    style={{ width: 280 }}
                />
            )}
            extra={<Button className="btn-dark" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>Kullanıcı Ekle</Button>}
        >
            <Form form={form} component={false}>
                <Table<User>
                    rowKey="id"
                    columns={columns}
                    dataSource={filtered}
                    pagination={{ pageSize: 7, showSizeChanger: false }}
                    size="middle"
                />
            </Form>

            <Modal title="Kullanıcı Detayı" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} centered width={420}>
                {detailUser && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>Ad:</b> {detailUser.name}</div>
                        <div><b>E-posta:</b> {detailUser.email}</div>
                        <div><b>Abonelik:</b> {detailUser.plan}</div>
                    </div>
                )}
            </Modal>

            <Drawer title="Kullanıcı Ekle" open={addOpen} onClose={() => setAddOpen(false)} width={440} destroyOnClose footer={null}>
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={(vals: Omit<User, 'id' | 'roleId' | 'departmentId'>) => {
                        const id = String(Date.now());
                        setData(prev => [...prev, { id, ...vals }]); // ✅ typo fix
                        setAddOpen(false);
                    }}
                    initialValues={{ plan: 'Aylık' }}
                >
                    <Form.Item name="name" label="Ad Soyad" rules={[{ required: true, message: 'Ad gerekli' }]}><AntInput /></Form.Item>
                    <Form.Item name="email" label="E-posta" rules={[{ required: true, type: 'email', message: 'Geçerli e-posta gerekli' }]}><AntInput /></Form.Item>
                    <Form.Item name="plan" label="Abonelik" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: 'Aylık', label: 'Aylık' },
                                { value: 'Yıllık', label: 'Yıllık' },
                                { value: 'Ücretsiz', label: 'Ücretsiz' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button className="btn-danger-ghost" onClick={() => setAddOpen(false)}>İptal</Button>
                            <Button type="primary" className="btn-brand" onClick={() => addForm.submit()}>Kaydet</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        </Card>
    );
};

export default UserTable;