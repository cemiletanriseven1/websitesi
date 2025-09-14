import React, { useEffect, useMemo, useState } from "react";
import {
    Card,
    Form,
    Input,
    Switch,
    Button,
    Space,
    message,
    Divider,
    Row,
    Col,
    Select,
    Typography,
    Modal,
    Progress,
    Tabs,
    Avatar,
} from "antd";

const { Title, Text } = Typography;

type Theme = "light" | "dark";
type Lang = "tr" | "en";

type SettingsValues = {
    displayName: string;
    email: string;
    emailNotif: boolean;
    theme: Theme;
    language: Lang;
    currentPass?: string;
    newPass?: string;
    newPass2?: string;
};

const LS_KEY = "app.settings.v1";

function getInitial(name?: string) {
    if (!name) return "U";
    const first = name.trim().charAt(0).toUpperCase();
    return first || "U";
}

export default function SettingsPage() {
    const [form] = Form.useForm<SettingsValues>();
    const [saving, setSaving] = useState(false);
    const [pwdStrength, setPwdStrength] = useState(0);
    const [brandColor, setBrandColor] = useState<string>("#1677ff"); // Kaydet butonunun mavisi

    const defaults: SettingsValues = useMemo(
        () => ({
            displayName: "Kullanıcı",
            email: "ornek@firma.com",
            emailNotif: true,
            theme: (localStorage.getItem("theme") as Theme) || "light",
            language: "tr",
        }),
        []
    );

    // ilk yüklemede localStorage'dan oku
    useEffect(() => {
        const raw = localStorage.getItem(LS_KEY);
        const saved: Partial<SettingsValues> | null = raw ? JSON.parse(raw) : null;
        const initial = { ...defaults, ...(saved || {}) };
        form.setFieldsValue(initial);
        document.body.dataset.theme = initial.theme; // ilk anda uygula
    }, [defaults, form]);

    // Tema ve Görünen Ad'ı canlı izle
    const themeWatch = Form.useWatch("theme", form);
    const displayNameWatch = Form.useWatch("displayName", form);

    useEffect(() => {
        if (themeWatch) {
            document.body.dataset.theme = themeWatch as Theme;
            localStorage.setItem("theme", themeWatch as string);
        }
    }, [themeWatch]);

    // Kaydet butonunun gerçek mavi rengini yakala ve sekmelere uygula
    useEffect(() => {
        // Sayfadaki .btn-dark (primary) butonun arka plan rengini al
        const btn = document.querySelector(".btn-dark") as HTMLElement | null;
        if (btn) {
            const cs = getComputedStyle(btn);
            // Önce background-color, yoksa color kullan
            const bg = cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)"
                ? cs.backgroundColor
                : cs.color || "#1677ff";
            setBrandColor(bg);
        }
    }, []);

    const onFinish = async (vals: SettingsValues) => {
        setSaving(true);
        try {
            const toSave: SettingsValues = {
                displayName: vals.displayName,
                email: vals.email,
                emailNotif: vals.emailNotif,
                theme: vals.theme,
                language: vals.language,
            };
            localStorage.setItem(LS_KEY, JSON.stringify(toSave));
            localStorage.setItem("theme", vals.theme);
            message.success("Ayarlar kaydedildi");
            form.resetFields(["currentPass", "newPass", "newPass2"]);
            setPwdStrength(0);
        } catch {
            message.error("Ayarlar kaydedilemedi");
        } finally {
            setSaving(false);
        }
    };

    const onCancel = () => {
        if (form.isFieldsTouched()) {
            Modal.confirm({
                title: "Değişiklikler iptal edilsin mi?",
                content: "Kaydedilmemiş değişiklikler silinecek.",
                okText: "Evet",
                cancelText: "Vazgeç",
                onOk: () => {
                    const raw = localStorage.getItem(LS_KEY);
                    const saved: Partial<SettingsValues> | null = raw
                        ? JSON.parse(raw)
                        : null;
                    form.resetFields();
                    form.setFieldsValue({ ...defaults, ...(saved || {}) });
                    setPwdStrength(0);
                },
            });
        } else {
            form.resetFields();
        }
    };

    // basit şifre gücü hesaplama
    const calcStrength = (p?: string) => {
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s += 25;
        if (/[A-Z]/.test(p)) s += 25;
        if (/[a-z]/.test(p)) s += 15;
        if (/\d/.test(p)) s += 20;
        if (/[^A-Za-z0-9]/.test(p)) s += 15;
        return Math.min(100, s);
    };

    return (
        <Card title="Ayarlar" className="users-card">
            {/* Aktif tab rengi = buton mavisi */}
            <style>{`
        .brand-tabs .ant-tabs-ink-bar {
          background: var(--brand, #1677ff);
        }
        .brand-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: var(--brand, #1677ff);
        }
        .brand-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
          color: var(--brand, #1677ff);
        }
      `}</style>

            <Form<SettingsValues>
                form={form}
                layout="vertical"
                initialValues={defaults}
                onFinish={onFinish}
                requiredMark={false}
            >
                <div
                    className="brand-tabs"
                    style={{ ["--brand" as any]: brandColor } as React.CSSProperties}
                >
                    <Tabs
                        defaultActiveKey="profile"
                        items={[
                            {
                                key: "profile",
                                label: "Profil & Tercihler",
                                children: (
                                    <>
                                        <Row gutter={[24, 8]}>
                                            <Col xs={24} md={14}>
                                                <Title level={5} style={{ marginBottom: 8 }}>
                                                    Profil Bilgileri
                                                </Title>
                                                <Form.Item
                                                    label="Kullanıcı Adı"
                                                    name="displayName"
                                                    rules={[
                                                        { required: true, message: "Görünen ad gerekli" },
                                                    ]}
                                                >
                                                    <Input placeholder="Görünen ad" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="E-posta"
                                                    name="email"
                                                    rules={[
                                                        { required: true, message: "E-posta gerekli" },
                                                        { type: "email", message: "Geçerli bir e-posta giriniz" },
                                                    ]}
                                                >
                                                    <Input placeholder="ornek@firma.com" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="E-posta Bildirimleri"
                                                    name="emailNotif"
                                                    valuePropName="checked"
                                                    tooltip="Sipariş, sistem ve duyuru bildirimleri"
                                                >
                                                    <Switch className="switch-brand" />
                                                </Form.Item>

                                                <Divider />

                                                <Title level={5} style={{ marginBottom: 8 }}>
                                                    Tercihler
                                                </Title>

                                                <Row gutter={16}>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item label="Tema" name="theme">
                                                            <Select
                                                                options={[
                                                                    { label: "Açık", value: "light" },
                                                                    { label: "Koyu", value: "dark" },
                                                                ]}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item label="Dil" name="language">
                                                            <Select
                                                                options={[
                                                                    { label: "Türkçe", value: "tr" },
                                                                    { label: "English", value: "en" },
                                                                ]}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            {/* Avatar Önizleme */}
                                            <Col xs={24} md={10}>
                                                <Card size="small">
                                                    <Title level={5} style={{ marginBottom: 12 }}>
                                                        Profil Önizleme
                                                    </Title>
                                                    <Space
                                                        direction="vertical"
                                                        size={16}
                                                        align="center"
                                                        style={{ width: "100%" }}
                                                    >
                                                        <Avatar
                                                            size={72}
                                                            style={{ background: "var(--brand, #1677ff)" }}
                                                        >
                                                            {getInitial(displayNameWatch as string)}
                                                        </Avatar>
                                                        <div style={{ textAlign: "center" }}>
                                                            <Text strong>
                                                                {(displayNameWatch as string) || "Kullanıcı"}
                                                            </Text>
                                                            <br />
                                                            <Text type="secondary">
                                                                {form.getFieldValue("email") || "ornek@firma.com"}
                                                            </Text>
                                                        </div>
                                                    </Space>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </>
                                ),
                            },
                            {
                                key: "security",
                                label: "Güvenlik",
                                children: (
                                    <>
                                        <Title level={5} style={{ marginBottom: 8 }}>
                                            Şifre Değiştir
                                        </Title>
                                        <Row gutter={[24, 8]}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Mevcut Şifre"
                                                    name="currentPass"
                                                    rules={[
                                                        { required: true, message: "Mevcut şifrenizi giriniz" },
                                                    ]}
                                                >
                                                    <Input.Password />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Yeni Şifre"
                                                    name="newPass"
                                                    rules={[
                                                        { required: true, message: "Yeni şifre gerekli" },
                                                        { min: 8, message: "En az 8 karakter" },
                                                        {
                                                            pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                                                            message: "Harf ve rakam içermeli",
                                                        },
                                                    ]}
                                                >
                                                    <Input.Password
                                                        onChange={(e) =>
                                                            setPwdStrength(calcStrength(e.target.value))
                                                        }
                                                    />
                                                </Form.Item>

                                                <Progress
                                                    percent={pwdStrength}
                                                    showInfo={false}
                                                    status={pwdStrength < 50 ? "exception" : "active"}
                                                    style={{ marginTop: -8, marginBottom: 8 }}
                                                />

                                                <Form.Item
                                                    label="Yeni Şifre (Tekrar)"
                                                    name="newPass2"
                                                    dependencies={["newPass"]}
                                                    rules={[
                                                        { required: true, message: "Yeni şifreyi tekrar giriniz" },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || getFieldValue("newPass") === value)
                                                                    return Promise.resolve();
                                                                return Promise.reject(
                                                                    new Error("Şifreler eşleşmiyor")
                                                                );
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Input.Password />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                                ),
                            },
                        ]}
                    />
                </div>

                <Divider />
                <Form.Item>
                    <Space wrap>
                        <Button className="btn-danger-ghost" onClick={onCancel}>
                            İptal
                        </Button>
                        <Button
                            type="primary"
                            className="btn-dark"
                            htmlType="submit"
                            loading={saving}
                        >
                            Kaydet
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
}
