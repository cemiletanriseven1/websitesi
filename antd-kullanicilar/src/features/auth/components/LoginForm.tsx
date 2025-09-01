import React from 'react';
import { Form, Input, Button } from 'antd';
import { useAuth } from '../AuthContext';

export const LoginForm: React.FC = () => {
    const { login, openRegister } = useAuth();

    return (
        <>
            <Form
                layout="vertical"
                onFinish={(vals: { email: string; password: string }) => login(vals.email)}
            >
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

                <Button htmlType="submit" className="auth-primary">Giriş Yap</Button>
            </Form>

            <div className="auth-switch">
                Hesabın yok mu? <button className="link" onClick={openRegister}>Kayıt Ol</button>
            </div>
        </>
    );
};
