import React from 'react';
import { Card, Tag, Empty } from 'antd';
import { useAnnouncements } from '../store';
import './announcements.css';

export default function AnnouncementsPage() {
    const { announcements } = useAnnouncements();

    return (
        <div className="ann-page">
            <h2 className="ann-title">Duyurular</h2>

            {announcements.length === 0 ? (
                <Empty description="Henüz duyuru yok" />
            ) : (
                <div className="ann-grid">
                    {announcements.map(a => (
                        <Card key={a.id} className="ann-card" bordered>
                            <div className="ann-card-head">
                                <Tag color={a.color || 'blue'} className="ann-dot" />
                                <div className="ann-card-title">{a.title}</div>
                            </div>
                            {a.desc && <div className="ann-card-desc">{a.desc}</div>}
                            <div className="ann-card-foot">{a.date}</div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
