import React from 'react';
import { Card } from 'antd';
import { RegisterForm } from '../components/RegisterForm';
import '../auth.css';

export const RegisterPage: React.FC = () => (
    <div className="auth-wrap">
        <Card className="auth-card" title="Kayıt Ol">
            <RegisterForm />
        </Card>
    </div>
);
