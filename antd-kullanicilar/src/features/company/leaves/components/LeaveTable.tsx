import React, { useState } from "react";
import { Table, Space, Button, Popconfirm, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLeaves } from "../store";
import type { Leave, LeaveStatus } from "../store";
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../../../table/tablo.css";

const statusClass = (s: LeaveStatus) =>
    s === "Onaylandı" ? "status-chip status--approved"
        : s === "Reddedildi" ? "status-chip status--rejected"
            : "status-chip status--pending";


export default function LeaveTable() {
    const { leaves, update, remove } = useLeaves();
    const [editingId, setEditingId] = useState<string>('');
    const [status, setStatus] = useState<LeaveStatus>('Bekliyor');

    const isEditing = (id: string) => id === editingId;

    const columns: ColumnsType<Leave> = [
        { title: "Ad", dataIndex: "name", key: "name" },
        { title: "Departman", dataIndex: "department", key: "department" },
        { title: "Tür", dataIndex: "type", key: "type" },
        { title: "Gün", dataIndex: "days", key: "days", align: "right" },
        { title: "Başlangıç", dataIndex: "start", key: "start" },
        {
            title: "Durum",
            dataIndex: "status",
            key: "status",
            render: (v: LeaveStatus, r) =>
                isEditing(r.id) ? (
                    <Select
                        style={{ minWidth: 140 }}
                        value={status}
                        onChange={(val: LeaveStatus) => setStatus(val)}
                        options={["Bekliyor", "Onaylandı", "Reddedildi"].map(s => ({ value: s, label: s }))}
                    />
                ) : (
                    <span className={statusClass(v)}>
                        <span className="dot" />
                        {v}
                    </span>
                ),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            align: 'right',
            render: (_: any, r) =>
                isEditing(r.id) ? (
                    <Space>
                        <Button className="btn-dark" icon={<SaveOutlined />} onClick={() => { update(r.id, { status }); setEditingId(''); }}>
                            Kaydet
                        </Button>
                        <Button className="btn-danger-ghost" onClick={() => setEditingId('')} icon={<CloseOutlined />}>İptal</Button>
                    </Space>
                ) : (
                    <Space>
                        <Button className="btn-mustard" icon={<EditOutlined />} onClick={() => { setEditingId(r.id); setStatus(r.status); }}>
                            Düzenle
                        </Button>
                        <Popconfirm title="Talep silinsin mi?" onConfirm={() => remove(r.id)}>
                            <Button className="btn-danger-ghost" icon={<DeleteOutlined />}>Sil</Button>
                        </Popconfirm>
                    </Space>
                )
        }
    ];

    return (
        <Table<Leave>
            rowKey="id"
            columns={columns}
            dataSource={leaves}
            pagination={{ pageSize: 7, showSizeChanger: false }}
            size="middle"
        />
    );
}