import React from 'react';
import { Input, Select, Segmented, Button, Modal, Badge } from 'antd';
import {
    SearchOutlined, EyeOutlined, ShoppingCartOutlined, HeartOutlined, HeartFilled,
    ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import './products.css';
import { useProducts, Product, Category } from './store';
import { useFavorites } from './favorites';
import { useNavigate } from 'react-router-dom';

type CartItem = { product: Product; qty: number };

export default function FavoritesPage() {
    const { products } = useProducts();
    const { favs, has, toggle } = useFavorites();
    const navigate = useNavigate();

    const [q, setQ] = React.useState('');
    const [cat, setCat] = React.useState<'Tümü' | Category>('Tümü');
    const [sort, setSort] = React.useState<'none' | 'fiyatArtan' | 'fiyatAzalan'>('none');

    const [cart, setCart] = React.useState<Record<string, CartItem>>({});
    const [detail, setDetail] = React.useState<Product | null>(null);

    const filtered = React.useMemo(() => {
        let arr = products.filter(p =>
            favs.has(p.id) &&
            (cat === 'Tümü' || p.category === cat) &&
            (q.trim() === '' || p.title.toLowerCase().includes(q.toLowerCase()))
        );
        if (sort === 'fiyatArtan') arr = arr.slice().sort((a, b) => a.price - b.price);
        if (sort === 'fiyatAzalan') arr = arr.slice().sort((a, b) => b.price - a.price);
        return arr;
    }, [q, cat, sort, products, favs]);

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
            const it = prev[id]; if (!it) return prev;
            const qty = Math.max(1, it.qty - 1);
            return { ...prev, [id]: { ...it, qty } };
        });

    const removeItem = (id: string) =>
        setCart(prev => { const c = { ...prev }; delete c[id]; return c; });

    const clearCart = () => setCart({});

    const cartItems = Object.values(cart);
    const total = cartItems.reduce((s, it) => s + it.product.price * it.qty, 0);

    React.useEffect(() => {
        try { localStorage.setItem('cart', JSON.stringify(cart)); } catch { }
    }, [cart]);

    return (
        <div className="products-page favorites">
            <div className="filter-bar">
                <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="Favorilerde ara…"
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

            <div className="products-content">
                {/* Grid */}
                <div className="grid">
                    {filtered.map(p => (
                        <div key={p.id} className="card">
                            <div className="card-cover">
                                {p.img && <img className="cover-img" src={p.img} alt={p.title} />}
                                <button className={`fav ${has(p.id) ? 'active' : ''}`} onClick={() => toggle(p.id)} aria-label="Favoriler">
                                    {has(p.id) ? <HeartFilled /> : <HeartOutlined />}
                                </button>
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
                                    <span style={{ color: '#000' }}>Stok: {p.stock}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sepet paneli — Ürünler sayfasıyla aynı düzen */}
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
                                    <Button size="small" onClick={() => dec(product.id)}>-</Button>
                                    <span className="q">{qty}</span>
                                    <Button size="small" onClick={() => inc(product.id)}>+</Button>
                                </div>
                                <Button size="small" className="cart-remove" onClick={() => removeItem(product.id)}>Sil</Button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-foot">
                        <div className="cart-total"><span>Toplam</span><b>{total.toLocaleString('tr-TR')} ₺</b></div>
                        <div className="cart-actions">
                            <Button onClick={clearCart}>Sepeti Temizle</Button>
                            <Button
                                type="primary"
                                className="btn-brand"
                                onClick={() => navigate('/products/checkout', { state: { cart } })}
                            >
                                Ödeme Yap
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Detay modalı */}
            <Modal open={!!detail} onCancel={() => setDetail(null)} footer={null} title={detail?.title}>
                {detail ? (
                    <div>
                        <div className="muted">{detail.category} • Stok: {detail.stock}</div>
                        <p style={{ marginTop: 8 }}>{detail.desc || 'Açıklama yakında.'}</p>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}
