import React from "react";
import { Card, Form, Input, Select, Button, Row, Col, Statistic } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LeaveTable from "../components/LeaveTable";
import { useLeaves } from "../store";
import "../../../dashboard/dashboard.css";
import "../../../../table/tablo.css";

export default function LeavesPage() {
    const { add, leaves } = useLeaves();
    const [form] = Form.useForm();

    const counts = React.useMemo(() => {
        const total = leaves.length;
        const approved = leaves.filter(l => l.status === "Onaylandı").length;
        const pending = leaves.filter(l => l.status === "Bekliyor").length;
        const rejected = leaves.filter(l => l.status === "Reddedildi").length;
        return { total, approved, pending, rejected };
    }, [leaves]);

    return (
        <div className="dashboard-page">
            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}><Card><Statistic title="Toplam Talep" value={counts.total} /></Card></Col>
                <Col xs={12} md={6}><Card><Statistic title="Onaylanan" value={counts.approved} /></Card></Col>
                <Col xs={12} md={6}><Card><Statistic title="Bekleyen" value={counts.pending} /></Card></Col>
                <Col xs={12} md={6}><Card><Statistic title="Reddedilen" value={counts.rejected} /></Card></Col>
            </Row>

            <Card style={{ marginTop: 12 }}
                title="Yeni İzin Talebi"
                extra={
                    <Form
                        form={form}
                        layout="inline"
                        onFinish={(v) => {
                            add({
                                name: v.name,
                                department: v.department,
                                type: v.type,
                                days: Number(v.days),
                                start: v.start,
                                status: "Bekliyor"
                            });
                            form.resetFields();
                        }}
                    >
                        <Form.Item name="name" rules={[{ required: true }]}><Input placeholder="Ad Soyad" /></Form.Item>
                        <Form.Item name="department" rules={[{ required: true }]}><Input placeholder="Departman" /></Form.Item>
                        <Form.Item name="type" rules={[{ required: true }]}>
                            <Select placeholder="Tür" style={{ minWidth: 140 }}
                                options={["Yıllık", "Hastalık", "Ücretsiz", "İdari"].map(x => ({ value: x, label: x }))} />
                        </Form.Item>
                        <Form.Item name="days" rules={[{ required: true }]}><Input placeholder="Gün" inputMode="numeric" /></Form.Item>
                        <Form.Item name="start" rules={[{ required: true }]}><Input placeholder="Başlangıç (GG.AA.YYYY)" /></Form.Item>
                        <Form.Item><Button className="btn-dark" htmlType="submit" icon={<PlusOutlined />}>Ekle</Button></Form.Item>
                    </Form>
                }
            >
                <LeaveTable />
            </Card>
        </div>
    );
}
