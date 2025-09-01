import React from 'react';
import { Card, Space, Statistic } from 'antd';

type KpiCardProps = {
    title: string;
    value: number | string;
    /** ör: 'kpi-blue' | 'kpi-green' | 'kpi-purple' | 'kpi-pink' */
    colorClass?: string;
    /** <UserOutlined /> gibi bir icon JSX’i */
    icon?: React.ReactNode;
};

export default function KpiCard({ title, value, colorClass = 'kpi-blue', icon }: KpiCardProps) {
    return (
        <Card className="kpi-card">
            <Space align="center">
                <div className={`kpi-icon ${colorClass}`}>{icon}</div>
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    );
}
