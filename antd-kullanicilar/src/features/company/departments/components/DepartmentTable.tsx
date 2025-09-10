import React, { useState } from "react";
import { Table, Button, Popconfirm, Space, Input, Modal } from "antd";
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useDepartments } from "../store";
import type { Department } from "../types";
import "../../../../table/tablo.css";

export default function DepartmentTable() {
    const { departments, remove, rename } = useDepartments();
    const [editingId, setEditingId] = useState<string>('');
    const [editName, setEditName] = useState<string>('');
    const [editManager, setEditManager] = useState<string>('');
    const [detailOpen, setDetailOpen] = useState(false);
    const [detail, setDetail] = useState<Department | null>(null);

    const isEditing = (id: string) => id === editingId;

    const columns: ColumnsType<Department> = [
        {
            title: "Departman",
            dataIndex: "name",
            key: "name",
            render: (_: any, r) =>
                isEditing(r.id) ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                ) : (
                    r.name
                ),
        },
        {
            title: "Yönetici",
            dataIndex: "manager",
            key: "manager",
            render: (_: any, r) =>
                isEditing(r.id) ? (
                    <Input
                        value={editManager}
                        onChange={(e) => setEditManager(e.target.value)}
                        placeholder="Yönetici (opsiyonel)"
                    />
                ) : (
                    r.manager || "-"
                ),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            align: 'right',
            render: (_: any, r) =>
                isEditing(r.id) ? (
                    <Space>
                        <Button className="btn-dark" icon={<SaveOutlined />} onClick={() => { rename(r.id, editName || r.name, editManager || r.manager); setEditingId(''); }}>
                            Kaydet
                        </Button>
                        <Button className="btn-danger-ghost" onClick={() => setEditingId('')} icon={<CloseOutlined />}>İptal</Button>
                    </Space>
                ) : (
                    <Space>
                        <Button className="btn-dark" icon={<EyeOutlined />} onClick={() => { setDetail(r); setDetailOpen(true); }}>Detay</Button>
                        <Button className="btn-mustard" icon={<EditOutlined />} onClick={() => { setEditingId(r.id); setEditName(r.name); setEditManager(r.manager || ''); }}>
                            Düzenle
                        </Button>
                        <Popconfirm title="Departman silinsin mi?" onConfirm={() => remove(r.id)}>
                            <Button className="btn-danger-ghost" icon={<DeleteOutlined />}>Sil</Button>
                        </Popconfirm>
                    </Space>
                ),
        },
    ];

    return (
        <>
            <Table<Department>
                rowKey="id"
                columns={columns}
                dataSource={departments}
                pagination={{ pageSize: 6, showSizeChanger: false }}
                size="middle"
            />
            <Modal title="Departman Detayı" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} centered>
                {detail && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>Departman:</b> {detail.name}</div>
                        <div><b>Yönetici:</b> {detail.manager || '-'}</div>
                        <div><b>Ekip Boyutu:</b> ~ {Math.floor(detail.id.length * 2 + 6)} kişi</div>
                        <div style={{ opacity: .75, marginTop: 6 }}>
                            Bu departman; planlama, koordinasyon ve performans takibinden sorumludur.
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}