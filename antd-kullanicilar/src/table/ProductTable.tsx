import React, { useMemo, useState } from 'react';
import { Table, Card, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import './tablo.css';

export interface Product {
    key: string;
    ad: string;
    adet: number; // sayı
}

type Props = { onCountChange?: (n: number) => void };

const ProductTable: React.FC<Props> = ({ onCountChange }) => {
    const [data] = useState<Product[]>([
        { key: 'p1', ad: 'Klavye', adet: 42 },
        { key: 'p2', ad: 'Mouse', adet: 7 },
        { key: 'p3', ad: 'Monitör', adet: 0 },
        { key: 'p4', ad: 'USB Hub', adet: 19 },
    ]);
    const [q, setQ] = useState('');

    React.useEffect(() => { onCountChange?.(data.length); }, [data.length]);

    const toplamAdet = useMemo(() => data.reduce((t, p) => t + p.adet, 0), [data]);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return data;
        return data.filter(p => p.ad.toLowerCase().includes(s) || String(p.adet).includes(s));
    }, [q, data]);

    const columns: ColumnsType<Product> = [
        { title: 'Ürün', dataIndex: 'ad', key: 'ad', sorter: (a, b) => a.ad.localeCompare(b.ad, 'tr') },
        { title: 'Stok (adet)', dataIndex: 'adet', key: 'adet', sorter: (a, b) => a.adet - b.adet },
    ];

    return (
        <Card
            className="users-card"
            title={
                <div className="table-header">
                    <div className="left">
                        <Input
                            allowClear
                            placeholder={`Ürün veya adet ara… (Toplam: ${toplamAdet})`}
                            prefix={<SearchOutlined />}
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            style={{ width: 320 }}
                        />
                    </div>
                    <div className="right" />
                </div>
            }
        >
            <Table<Product>
                rowKey="key"
                columns={columns}
                dataSource={filtered}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                size="middle"
            />
        </Card>
    );
};

export default ProductTable;
