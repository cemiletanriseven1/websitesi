// src/features/documents/pages/DocumentsPage.tsx
import React from "react";
import { Card, Table, Tag, Upload, message, Space, Button, Input, Popconfirm, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileAddOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useDocuments } from "../store";
import "../../dashboard/dashboard.css";
import "../../../table/tablo.css";

export default function DocumentsPage() {
    const { documents, add, remove } = useDocuments();
    const [q, setQ] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const [detailOpen, setDetailOpen] = React.useState(false);
    const [detail, setDetail] = React.useState<null | {
        id: string; title: string; category: string; owner: string; date: string;
    }>(null);

    const filtered = React.useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return documents;
        return documents.filter(d =>
            d.title.toLowerCase().includes(s) ||
            d.category.toLowerCase().includes(s) ||
            d.owner.toLowerCase().includes(s) ||
            d.date.toLowerCase().includes(s)
        );
    }, [q, documents]);

    const uploadProps = {
        multiple: false,
        beforeUpload: (file: File) => {
            add({
                title: file.name.replace(/\.[^.]+$/, ''),
                category: "Genel",
                owner: "Siz",
                date: new Date().toLocaleDateString('tr-TR'),
            });
            message.success("Belge eklendi");
            setOpen(false);
            return false as unknown as void;
        }
    };

    const cols: ColumnsType<any> = [
        { title: "Belge", dataIndex: "title", key: "title" },
        { title: "Kategori", dataIndex: "category", key: "category", render: (v: string) => <Tag>{v}</Tag> },
        { title: "Sahip", dataIndex: "owner", key: "owner" },
        { title: "Tarih", dataIndex: "date", key: "date" },
        {
            title: "İşlemler",
            key: "actions",
            align: "right",
            render: (_: any, r) => (
                <Space>
                    <Button className="btn-mustard" icon={<EyeOutlined />} onClick={() => { setDetail(r); setDetailOpen(true); }}>
                        Görüntüle
                    </Button>
                    <Popconfirm title="Belge silinsin mi?" onConfirm={() => remove(r.id)}>
                        <Button className="btn-danger-ghost" icon={<DeleteOutlined />}>Sil</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <Card
                className="users-card documents-card"
                title={
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Input
                            placeholder="Ara: ad, kategori, sahip…"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            style={{ width: 280 }}
                            allowClear
                        />
                    </div>
                }
                extra={
                    <Button type="primary" className="btn-brand" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                        Belge Ekle
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    columns={cols}
                    dataSource={filtered}
                    pagination={{ pageSize: 5, showSizeChanger: false }}
                    size="middle"
                />
            </Card>

            <Modal
                title="Belge Ekle"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Upload.Dragger
                    {...uploadProps}
                    accept=".pdf,.doc,.docx,.xlsx,.csv,.txt"
                    maxCount={1}
                    className="doc-dragger"
                >
                    <p className="ant-upload-drag-icon"><FileAddOutlined /></p>
                    <p className="ant-upload-text">Belgenizi buraya sürükleyin ya da tıklayın</p>
                    <p className="ant-upload-hint">PDF/Office dosyaları desteklenir.</p>
                </Upload.Dragger>
            </Modal>

            <Modal
                title="Belge Detayı"
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={null}
                centered
            >
                {detail && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>Başlık:</b> {detail.title}</div>
                        <div><b>Kategori:</b> {detail.category}</div>
                        <div><b>Sahip:</b> {detail.owner}</div>
                        <div><b>Tarih:</b> {detail.date}</div>
                    </div>
                )}
            </Modal>
        </>
    );
}
