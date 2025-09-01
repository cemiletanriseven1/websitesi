import React from 'react';
import { Input, Select, Modal, Badge, Button, Segmented } from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    HeartFilled,
    PlusOutlined,
    MinusOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';
import './products.css';

type Category = 'Elektronik' | 'Mobilya' | 'Aksesuar';
type Product = {
    id: string;
    title: string;
    price: number;
    category: Category;
    stock: number;
    img?: string;
    desc?: string;
};

const PRODUCTS: Product[] = [
    { id: 'p1', title: 'Dizüstü Bilgisayar', price: 2450, category: 'Elektronik', stock: 5, img: '/assets/products/laptop.jpg', desc: '14\" IPS, 16GB RAM, 512GB SSD' },
    { id: 'p2', title: 'Kablosuz Kulaklık', price: 1850, category: 'Elektronik', stock: 10, img: '/assets/products/earbuds.jpg', desc: 'Aktif gürültü engelleme' },
    { id: 'p3', title: 'Gaming Mouse', price: 600, category: 'Elektronik', stock: 17, img: '/assets/products/mouse.jpg', desc: '16000 DPI, RGB' },
    { id: 'p4', title: 'Mekanik Klavye', price: 950, category: 'Elektronik', stock: 8, img: '/assets/products/keyboard.jpg', desc: 'Kailh Brown switch' },
    { id: 'p5', title: 'Ofis Sandalyesi', price: 2200, category: 'Mobilya', stock: 6, img: '/assets/products/chair.jpg', desc: 'Ergonomik sırt desteği' },
    { id: 'p6', title: 'Çalışma Masası', price: 1700, category: 'Mobilya', stock: 9, img: '/assets/products/desk.jpg', desc: '120×60cm, meşe kaplama' },
    { id: 'p7', title: 'Masa Lambası', price: 350, category: 'Aksesuar', stock: 30, img: '/assets/products/lamp.jpg', desc: 'Ayarlanabilir sıcaklık' },
    { id: 'p8', title: 'USB-C Hub', price: 420, category: 'Aksesuar', stock: 25, img: '/assets/products/hub.jpg', desc: '7-in-1, 4K HDMI' },
];

type CartItem = { product: Product; qty: number };

export default function ProductsPage() {
    const [q, setQ] = React.useState('');
    const [cat, setCat] = React.useState<'Tümü' | Category>('Tümü');
    const [sort, setSort] = React.useState<'none' | 'fiyatArtan' | 'fiyatAzalan'>('none');

    const [favs, setFavs] = React.useState<Set<string>>(new Set());
    const [cart, setCart] = React.useState<Record<string, CartItem>>({});
    const [detail, setDetail] = React.useState<Product | null>(null);

    const filtered = React.useMemo(() => {
        let arr = PRODUCTS.filter(p =>
            (cat === 'Tümü' || p.category === cat) &&
            (q.trim() === '' || p.title.toLowerCase().includes(q.toLowerCase()))
        );
        if (sort === 'fiyatArtan') arr = arr.slice().sort((a, b) => a.price - b.price);
        if (sort === 'fiyatAzalan') arr = arr.slice().sort((a, b) => b.price - a.price);
        return arr;
    }, [q, cat, sort]);

    const toggleFav = (id: string) =>
        setFavs(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });

    const addToCart = (p: Product) =>
        setCart(prev => {
            const ex = prev[p.id];
            const qty = ex ? ex.qty + 1 : 1;
            return { ...prev, [p.id]: { product: p, qty } };
        });

    const inc = (id: string) =>
        setCart(prev => ({ ...prev, [id]: { ...prev[id], qty: prev[id].qty + 1 } }));

    const dec = (id: string) =>
        setCart(prev => {
            const item = prev[id];
            if (!item) return prev;
            const qty = Math.max(1, item.qty - 1);
            return { ...prev, [id]: { ...item, qty } };
        });

    const removeItem = (id: string) =>
        setCart(prev => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });

    const clearCart = () => setCart({});

    const cartItems = Object.values(cart);
    const total = cartItems.reduce((s, it) => s + it.product.price * it.qty, 0);

    return (
        <div className="products-page">
            {/* Üst filtre barı */}
            <div className="filter-bar">
                <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="Ürün ara…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="filter-search"
                />

                <div className="filter-right">
                    <Select
                        value={cat}
                        onChange={v => setCat(v)}
                        className="filter-select"
                        options={[
                            { value: 'Tümü', label: 'Kategori' },
                            { value: 'Elektronik', label: 'Elektronik' },
                            { value: 'Mobilya', label: 'Mobilya' },
                            { value: 'Aksesuar', label: 'Aksesuar' },
                        ]}
                    />

                    {/* Daha anlaşılır sıralama: ikonlu Segmented */}
                    <div className="segmented-sort">
                        <Segmented
                            value={sort}
                            onChange={(v) => setSort(v as any)}
                            options={[
                                { value: 'none', label: 'Varsayılan' },
                                { value: 'fiyatArtan', label: <span className="seg-lbl"><ArrowUpOutlined /> Artan</span> },
                                { value: 'fiyatAzalan', label: <span className="seg-lbl"><ArrowDownOutlined /> Azalan</span> },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* İçerik: grid + sepet */}
            <div className="products-content">
                <div className="grid">
                    {filtered.map(p => (
                        <div key={p.id} className="card">
                            <div className="card-cover">
                                {/* Ürün görseli */}
                                <img
                                    className="cover-img"
                                    src={p.img}
                                    alt={p.title}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />

                                {/* Favori kalbi her zaman görünür */}
                                <button
                                    className={`fav ${favs.has(p.id) ? 'active' : ''}`}
                                    onClick={() => toggleFav(p.id)}
                                    aria-label="Favorilere ekle"
                                >
                                    {favs.has(p.id) ? <HeartFilled /> : <HeartOutlined />}
                                </button>

                                {/* Hover aksiyonları */}
                                <div className="hover-actions">
                                    <button className="circle" title="Detay" onClick={() => setDetail(p)}><EyeOutlined /></button>
                                    <button className="circle" title="Sepete Ekle" onClick={() => addToCart(p)}><ShoppingCartOutlined /></button>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="title" title={p.title}>{p.title}</div>
                                <div className="sub">{p.category}</div>
                                <div className="price">
                                    <span>{p.price.toLocaleString('tr-TR')} ₺</span>
                                    <Badge count={p.stock} title="Stok" style={{ backgroundColor: '#e9eef5', color: '#334155' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sepet paneli */}
                <aside className="cart">
                    <div className="cart-head">
                        <div className="cart-title">Sepetim</div>
                        <Badge count={cartItems.length} />
                    </div>

                    <div className="cart-body">
                        {cartItems.length === 0 ? (
                            <div className="cart-empty">Sepetiniz boş</div>
                        ) : cartItems.map(({ product, qty }) => (
                            <div key={product.id} className="cart-row">
                                <div className="cart-info">
                                    <div className="cart-name">{product.title}</div>
                                    <div className="cart-price">{product.price.toLocaleString('tr-TR')} ₺</div>
                                </div>
                                <div className="cart-qty">
                                    <Button size="small" onClick={() => dec(product.id)} icon={<MinusOutlined />} />
                                    <span className="q">{qty}</span>
                                    <Button size="small" onClick={() => inc(product.id)} icon={<PlusOutlined />} />
                                </div>
                                <Button size="small" className="cart-remove" onClick={() => removeItem(product.id)} icon={<DeleteOutlined />} />
                            </div>
                        ))}
                    </div>

                    <div className="cart-foot">
                        <div className="cart-total">
                            <span>Toplam</span>
                            <b>{total.toLocaleString('tr-TR')} ₺</b>
                        </div>
                        <div className="cart-actions">
                            <Button onClick={clearCart}>Sepeti Temizle</Button>
                            <Button type="primary" className="btn-brand">Ödeme Yap</Button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Ürün Detay Modalı */}
            <Modal
                title="Ürün Detayı"
                open={!!detail}
                onCancel={() => setDetail(null)}
                footer={[
                    <Button key="close" onClick={() => setDetail(null)}>Kapat</Button>,
                    detail ? <Button key="add" type="primary" className="btn-brand" onClick={() => { addToCart(detail); setDetail(null); }}>Sepete Ekle</Button> : null,
                ]}
                centered
                width={520}
            >
                {detail && (
                    <div className="detail">
                        <div className="detail-img">
                            {detail.img && <img src={detail.img} alt={detail.title} />}
                        </div>
                        <div className="detail-info">
                            <div className="d-title">{detail.title}</div>
                            <div className="d-sub">{detail.category} • Stok: {detail.stock}</div>
                            <div className="d-desc">{detail.desc || 'Bu ürün hakkında açıklama yakında eklenecek.'}</div>
                            <div className="d-price">{detail.price.toLocaleString('tr-TR')} ₺</div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
