import React, { useMemo, useState } from 'react';
import { Table, Card, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useProducts } from '../features/products/store';
import './tablo.css';

type Row = { key: string; ad: string; adet: number; kategori?: string; };
type Props = { onCountChange?: (n: number) => void };

const ProductTable: React.FC<Props> = ({ onCountChange }) => {
    const { products } = useProducts();
    const rows: Row[] = useMemo(
        () => products.map(p => ({ key: p.id, ad: p.title, adet: Number(p.stock ?? 0), kategori: p.category })),
        [products]
    );

    const [q, setQ] = useState('');
    React.useEffect(() => { onCountChange?.(rows.length); }, [rows.length, onCountChange]);

    const toplamAdet = useMemo(() => rows.reduce((t, p) => t + p.adet, 0), [rows]);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return rows;
        return rows.filter(p =>
            p.ad.toLowerCase().includes(s) ||
            String(p.adet).includes(s) ||
            (p.kategori?.toLowerCase() || '').includes(s)
        );
    }, [q, rows]);

    // ... imports aynı

    const columns: ColumnsType<Row> = [
        { title: 'Ürün', dataIndex: 'ad', key: 'ad', sorter: (a, b) => a.ad.localeCompare(b.ad, 'tr') },
        {
            title: 'Stok',
            dataIndex: 'adet',
            key: 'adet',
            sorter: (a, b) => a.adet - b.adet,
            render: (v: number) => {
                const cls = v === 0 ? 'badge-num badge-num--zero' : v < 10 ? 'badge-num badge-num--low' : 'badge-num badge-num--ok';
                return <span className={cls}>{v}</span>;
            }
        },
        { title: 'Kategori', dataIndex: 'kategori', key: 'kategori' },
    ];

    return (
        <Card
            className="users-card stock-table"
            title={
                <div className="table-header">
                    <div className="left">
                        <Input
                            allowClear
                            placeholder={`Ürün/kat. veya adet ara… (Toplam stok: ${toplamAdet})`}
                            prefix={<SearchOutlined />}
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            style={{ width: 360 }}
                        />
                    </div>
                    <div className="right" />
                </div>
            }
        >
            <Table<Row>
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
