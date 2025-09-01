import React from 'react';
import { Card } from 'antd';
import { LoginForm } from '../components/LoginForm';
import '../auth.css';

export const LoginPage: React.FC = () => (
    <div className="auth-wrap">
        <Card className="auth-card" title="Giriş Yap">
            <LoginForm />
        </Card>
    </div>
);
