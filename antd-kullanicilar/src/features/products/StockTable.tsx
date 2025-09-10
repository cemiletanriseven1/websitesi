import React, { useEffect } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PRODUCTS, Product } from './data';

type Props = { onCountChange?: (n: number) => void };

export default function StockTable({ onCountChange }: Props) {
    useEffect(() => {
        onCountChange?.(PRODUCTS.length);
    }, [onCountChange]);

    const columns: ColumnsType<Product> = [
        { title: 'Ürün', dataIndex: 'title', key: 'title' },
        { title: 'Kategori', dataIndex: 'category', key: 'category' },
        {
            title: 'Stok',
            dataIndex: 'stock',
            key: 'stock',
            render: (s: number) => <span style={{ color: '#000' }}>{s}</span>,
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: 'Fiyat',
            dataIndex: 'price',
            key: 'price',
            render: (p: number) => `${p.toLocaleString('tr-TR')} ₺`,
            sorter: (a, b) => a.price - b.price,
        },
    ];

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={PRODUCTS}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            size="middle"
        />
    );
}
