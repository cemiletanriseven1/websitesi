import React from "react";
import { Card, Form, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DepartmentTable from "../components/DepartmentTable";
import { useDepartments } from "../store";
import { useRoles } from "../../roles/store";
import "../../../../table/tablo.css";

export default function DepartmentsPage() {
    const { add } = useDepartments();
    const { can } = useRoles();
    const [form] = Form.useForm();
    const canWrite = can("departments.write");

    return (
        <Card
            title="Departmanlar"
            extra={
                canWrite && (
                    <Form
                        form={form}
                        layout="inline"
                        onFinish={(vals) => {
                            add({ name: vals.name, manager: vals.manager });
                            form.resetFields();
                        }}
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: "Departman adı gerekli" }]}
                        >
                            <Input placeholder="Yeni departman adı" />
                        </Form.Item>
                        <Form.Item name="manager">
                            <Input placeholder="Yönetici (opsiyonel)" />
                        </Form.Item>
                        <Form.Item>
                            <Button className="btn-dark" htmlType="submit" icon={<PlusOutlined />}>
                                Ekle
                            </Button>
                        </Form.Item>
                    </Form>
                )
            }
        >
            <DepartmentTable />
            {!canWrite && (
                <div style={{ marginTop: 8, opacity: 0.7 }}>
                    Bu alanda değişiklik yapma yetkiniz yok.
                </div>
            )}
        </Card>
    );
}
