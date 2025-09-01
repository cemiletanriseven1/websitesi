import React from 'react';
import { Form, Input, Button } from 'antd';
import { useAuth } from '../AuthContext';

const onlyDigits = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isDigit = /[0-9]/.test(e.key);
    if (!isDigit) e.preventDefault();
};

export const RegisterForm: React.FC = () => {
    const { register, openLogin } = useAuth();

    return (
        <>
            <Form
                layout="vertical"
                onFinish={(v: { name: string; email: string; password: string; phone: string; tc: string }) =>
                    register(v.name, v.email)
                }
            >
                <Form.Item
                    name="name"
                    label="Ad Soyad"
                    rules={[
                        { required: true, message: 'Ad Soyad zorunludur' },
                        { min: 2, message: 'En az 2 karakter' },
                    ]}
                >
                    <Input placeholder="Ad Soyad" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-posta"
                    rules={[
                        { required: true, message: 'E-posta zorunludur' },
                        { type: 'email', message: 'Geçerli e-posta girin' },
                    ]}
                >
                    <Input placeholder="E-posta" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Şifre"
                    rules={[
                        { required: true, message: 'Şifre zorunludur' },
                        { min: 6, message: 'En az 6 karakter' },
                    ]}
                >
                    <Input.Password placeholder="Şifre" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Telefon"
                    rules={[
                        { required: true, message: 'Telefon zorunludur' },
                        {
                            pattern: /^05\d{9}$/,
                            message: 'Telefon 05XXXXXXXXX formatında ve 11 hane olmalı',
                        },
                    ]}
                >
                    <Input
                        placeholder="05XXXXXXXXX"
                        maxLength={11}
                        inputMode="numeric"
                        onKeyPress={onlyDigits}
                    />
                </Form.Item>

                <Form.Item
                    name="tc"
                    label="TC Kimlik No"
                    rules={[
                        { required: true, message: 'TC Kimlik No zorunludur' },
                        { pattern: /^\d{11}$/, message: 'TC Kimlik No 11 haneli olmalı' },
                    ]}
                >
                    <Input
                        placeholder="TC Kimlik No"
                        maxLength={11}
                        inputMode="numeric"
                        onKeyPress={onlyDigits}
                    />
                </Form.Item>

                <Button htmlType="submit" className="auth-primary">Kayıt Ol</Button>
            </Form>

            <div className="auth-switch">
                Zaten hesabın var mı? <button className="link" onClick={openLogin}>Giriş Yap</button>
            </div>
        </>
    );
};
