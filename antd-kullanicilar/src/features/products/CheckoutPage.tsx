import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Form, Input, Select, Radio, Card, Button, Divider, Typography
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './products.css';

type CartRow = { id: string; title: string; price: number; qty: number; img?: string };

const { Title, Text } = Typography;

function loadCartFromStorage(): CartRow[] {
    try {
        const raw = localStorage.getItem('cart');
        if (!raw) return [];
        const obj = JSON.parse(raw) as Record<string, { product: any; qty: number }>;
        return Object.values(obj).map(({ product, qty }) => ({
            id: product.id,
            title: product.title,
            price: product.price,
            qty,
            img: product.img,
        }));
    } catch {
        return [];
    }
}

export default function CheckoutPage() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // ProductsList -> navigate('/products/checkout', { state: { cart } })
    const location = useLocation() as any;
    const cartFromNav: Record<string, { product: any; qty: number }> | undefined =
        location?.state?.cart;

    const cart: CartRow[] = React.useMemo(() => {
        if (cartFromNav) {
            const mapped = Object.values(cartFromNav).map(({ product, qty }) => ({
                id: product.id,
                title: product.title,
                price: product.price,
                qty,
                img: product.img,
            }));
            // yedekle
            try { localStorage.setItem('cart', JSON.stringify(cartFromNav)); } catch { }
            return mapped;
        }
        return loadCartFromStorage();
    }, [cartFromNav]);

    const [shipping, setShipping] = React.useState<'std' | 'fast' | 'store'>('std');
    const [payMethod, setPayMethod] = React.useState<'card' | 'cod' | 'eft'>('card');
    const [agree, setAgree] = React.useState(false);

    const productsTotal = cart.reduce((s, r) => s + r.price * r.qty, 0);
    const shippingCost = shipping === 'std' ? 49.9 : shipping === 'fast' ? 89.9 : 0;
    const grand = productsTotal + shippingCost;

    const onFinish = (values: any) => {
        if (!agree) {
            return form.validateFields(['agree']);
        }
        console.log('Sipariş verildi:', { values, cart, shipping, payMethod, total: grand });
    };

    return (
        <div className="checkout-wrap">
            {/* SOL: Teslimat & Ödeme */}
            <div className="checkout-main">
                <Card className="checkout-card" title="Teslimat & Ödeme">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        initialValues={{ city: undefined, district: undefined }}
                    >
                        <Title level={5} className="section-title">Adres Bilgisi</Title>

                        <div className="grid-2">
                            <Form.Item
                                label="* Ad Soyad"
                                name="name"
                                rules={[{ required: true, message: 'Ad Soyad zorunludur' }]}
                            >
                                <Input placeholder="Ad Soyad" />
                            </Form.Item>

                            <Form.Item
                                label="* Telefon"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Telefon zorunludur' },
                                    { pattern: /^0\d{10}$/, message: '0XXXXXXXXXX formatında olmalı' },
                                ]}
                            >
                                <Input placeholder="05XXXXXXXXX" maxLength={11} />
                            </Form.Item>
                        </div>

                        <div className="grid-2">
                            <Form.Item label="* İl" name="city" rules={[{ required: true, message: 'İl seçiniz' }]}>
                                <Select
                                    placeholder="İl seçin"
                                    options={[
                                        { value: 'İstanbul', label: 'İstanbul' },
                                        { value: 'Ankara', label: 'Ankara' },
                                        { value: 'İzmir', label: 'İzmir' },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item label="* İlçe" name="district" rules={[{ required: true, message: 'İlçe seçiniz' }]}>
                                <Select placeholder="İlçe" options={[{ value: 'Merkez', label: 'Merkez' }]} />
                            </Form.Item>
                        </div>

                        <div className="grid-2">
                            <Form.Item
                                label="* Adres"
                                name="address"
                                className="col-span-1"
                                rules={[{ required: true, message: 'Adres zorunludur' }]}
                            >
                                <Input.TextArea rows={3} placeholder="Mahalle, cadde, no, daire…" />
                            </Form.Item>

                            <Form.Item
                                label="Posta Kodu"
                                name="zip"
                                rules={[{ len: 5, message: '5 haneli posta kodu' }]}
                            >
                                <Input placeholder="PK" maxLength={5} />
                            </Form.Item>
                        </div>

                        <Divider />

                        <Title level={5} className="section-title">Kargo Seçimi</Title>
                        <Form.Item name="shipping">
                            <Radio.Group
                                value={shipping}
                                onChange={(e) => setShipping(e.target.value)}
                                className="radio-stack"
                            >
                                <Radio value="std">Standart (2–4 gün) — <b>₺49,90</b></Radio>
                                <Radio value="fast">Hızlı (1–2 gün) — <b>₺89,90</b></Radio>
                                <Radio value="store">Mağazadan Teslim — <b>₺0,00</b></Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Divider />

                        <Title level={5} className="section-title">Ödeme Yöntemi</Title>
                        <Form.Item name="payMethod">
                            <Radio.Group
                                value={payMethod}
                                onChange={(e) => setPayMethod(e.target.value)}
                                className="radio-stack"
                            >
                                <Radio value="card">Kredi/Banka Kartı</Radio>
                                <Radio value="cod">Kapıda Ödeme</Radio>
                                <Radio value="eft">EFT/Havale</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {payMethod === 'card' && (
                            <>
                                <Form.Item
                                    label="* Kart Üzerindeki İsim"
                                    name="cardName"
                                    rules={[{ required: true, message: 'Zorunlu alan' }]}
                                >
                                    <Input placeholder="AD SOYAD" />
                                </Form.Item>

                                <Form.Item
                                    label="* Kart Numarası"
                                    name="cardNumber"
                                    rules={[
                                        { required: true, message: 'Zorunlu alan' },
                                        { pattern: /^\d{16}$/, message: '16 haneli sayı giriniz' },
                                    ]}
                                >
                                    <Input placeholder="1111222233334444" maxLength={16} />
                                </Form.Item>

                                <div className="grid-2">
                                    <Form.Item
                                        label="* SKT (AA/YY)"
                                        name="exp"
                                        rules={[{ required: true, message: 'Zorunlu alan' }]}
                                    >
                                        <Input placeholder="08/27" maxLength={5} />
                                    </Form.Item>
                                    <Form.Item
                                        label="* CVV"
                                        name="cvv"
                                        rules={[{ required: true, message: 'Zorunlu alan' }]}
                                    >
                                        <Input placeholder="123" maxLength={4} />
                                    </Form.Item>
                                </div>
                            </>
                        )}

                        <Form.Item
                            name="agree"
                            valuePropName="checked"
                            rules={[{
                                validator: (_, v) => v ? Promise.resolve() : Promise.reject(new Error('Sözleşmeyi onaylayın'))
                            }]}
                        >
                            <Radio checked={agree} onChange={(e) => setAgree(e.target.checked)}>
                                Ön bilgilendirme formu ve mesafeli satış sözleşmesini okudum, onaylıyorum.
                            </Radio>
                        </Form.Item>

                        {/* --- Butonlar & Toplam --- */}
                        <div className="checkout-actions">
                            <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
                                Geri
                            </Button>

                            <div className="checkout-actions-right">
                                <span className="grand-inline">
                                    Genel Toplam: {grand.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </span>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="btn-brand"
                                    disabled={!agree}
                                >
                                    Ödemeyi Tamamla
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>

            {/* SAĞ: Sipariş Özeti */}
            <aside className="checkout-summary">
                <Card>
                    <Title level={5} style={{ marginBottom: 12 }}>Sipariş Özeti</Title>

                    {cart.length === 0 ? (
                        <Text type="secondary">Sepetiniz boş.</Text>
                    ) : (
                        <div className="summary-items">
                            {cart.map(row => (
                                <div key={row.id} className="summary-row">
                                    <div className="summary-info">
                                        <div className="summary-name">{row.title}</div>
                                        <div className="summary-meta">
                                            Adet: {row.qty} • {row.price.toLocaleString('tr-TR')} ₺
                                        </div>
                                    </div>
                                    <div className="summary-line-total">
                                        {(row.price * row.qty).toLocaleString('tr-TR')} ₺
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Divider />

                    <div className="summary-totals">
                        <div className="row"><span>Ürünler</span><b>{productsTotal.toLocaleString('tr-TR')} ₺</b></div>
                        <div className="row"><span>Kargo</span><b>{shippingCost.toLocaleString('tr-TR')} ₺</b></div>
                        <div className="row grand"><span>Genel Toplam</span><b>{grand.toLocaleString('tr-TR')} ₺</b></div>
                    </div>
                </Card>
            </aside>
        </div>
    );
}
