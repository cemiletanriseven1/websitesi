import React from "react";
import { Card, Form, Input, Switch, Button, Space, message } from "antd";

export default function SettingsPage() {
    const [form] = Form.useForm();

    const onFinish = (vals: any) => {
        message.success('Ayarlar kaydedildi');
        form.resetFields(['currentPass', 'newPass', 'newPass2']);
    };

    return (
        <Card title="Ayarlar" className="users-card">
            <Form
                form={form}
                layout="vertical"
                initialValues={{ emailNotif: true }}
                onFinish={onFinish}
                requiredMark={false}
            >
                <Form.Item label="Kullanıcı Adı" name="displayName" rules={[{ required: true, message: 'Görünen ad gerekli' }]}>
                    <Input placeholder="Görünen ad" />
                </Form.Item>

                <Form.Item label="E-posta" name="email" rules={[{ required: true, type: 'email', message: 'Geçerli bir e-posta giriniz' }]}>
                    <Input placeholder="ornek@firma.com" />
                </Form.Item>

                <Form.Item label="E-posta Bildirimleri" name="emailNotif" valuePropName="checked">
                    {/* mavi: site rengi */}
                    <Switch className="switch-brand" />
                </Form.Item>

                <div style={{ fontWeight: 700, marginTop: 8, marginBottom: 8 }}>Şifre Değiştir</div>
                <Form.Item label="Mevcut Şifre" name="currentPass" rules={[{ required: true, message: 'Mevcut şifrenizi giriniz' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="Yeni Şifre" name="newPass" rules={[{ required: true, min: 6, message: 'En az 6 karakter' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Yeni Şifre (Tekrar)"
                    name="newPass2"
                    dependencies={['newPass']}
                    rules={[
                        { required: true, message: 'Yeni şifreyi tekrar giriniz' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPass') === value) return Promise.resolve();
                                return Promise.reject(new Error('Şifreler eşleşmiyor'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button className="btn-danger-ghost" onClick={() => form.resetFields()}>İptal</Button>
                        <Button type="primary" className="btn-dark" htmlType="submit">Kaydet</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
}
