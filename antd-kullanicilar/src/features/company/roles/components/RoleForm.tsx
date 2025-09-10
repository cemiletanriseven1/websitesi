import React, { useState } from "react";
import { Card, Form, Input, Checkbox, Space, Button } from "antd";
import { useRoles } from "../store";
import type { Permission } from "../types";
import { ALL_PERMISSIONS } from "../types"; // ✅ ekledik

// const ALL: Permission[] = [ ... ] yerine tek kaynaktan çekelim
const ALL: Permission[] = ALL_PERMISSIONS; // ✅

export default function RoleForm() {
    const { addRole } = useRoles();
    const [selected, setSelected] = useState<Permission[]>([]);
    const [form] = Form.useForm();

    return (
        <Card className="roles-card" title="Yeni Rol Ekle" style={{ marginBottom: 16 }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={(vals: { name: string }) => {
                    addRole({ name: vals.name, permissions: selected });
                    setSelected([]);
                    form.resetFields();
                }}
            >
                <Form.Item
                    name="name"
                    label="Rol Adı"
                    rules={[{ required: true, message: "Rol adı gerekli" }]}
                >
                    <Input placeholder="Örn: İK Uzmanı" />
                </Form.Item>

                <Form.Item label="Yetkiler">
                    <div className="perm-grid">
                        {ALL.map(p => (
                            <Checkbox
                                key={p}
                                checked={selected.includes(p)}
                                onChange={e => {
                                    if (e.target.checked) setSelected(prev => [...prev, p]);
                                    else setSelected(prev => prev.filter(x => x !== p));
                                }}
                            >
                                {p}
                            </Checkbox>
                        ))}
                    </div>
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button className="btn-danger-ghost" onClick={() => { setSelected([]); form.resetFields(); }}>
                            Temizle
                        </Button>
                        <Button className="btn-dark" type="primary" htmlType="submit">
                            Ekle
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
}
