import React from 'react';
import { Input, Select, Badge, Button } from 'antd';
import {
    SearchOutlined, EyeOutlined, ShoppingCartOutlined,
    HeartOutlined, HeartFilled
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './products.css';
import { useProducts, Product, Category } from './store';   // ⬅️ store'dan al
import { useFavorites } from './favorites';

type CartItem = { product: Product; qty: number };

export default function ProductsList() {
    const { products } = useProducts();                       // ⬅️ dinamik liste
    const [q, setQ] = React.useState('');
    const [cat, setCat] = React.useState<'Tümü' | Category>('Tümü');
    const [sort, setSort] = React.useState<'none' | 'fiyatArtan' | 'fiyatAzalan'>('none');
    const [cart, setCart] = React.useState<Record<string, CartItem>>({});
    const { has, toggle } = useFavorites();
    const navigate = useNavigate();

    const filtered = React.useMemo(() => {
        let arr = products.filter(p =>
            (cat === 'Tümü' || p.category === cat) &&
            (q.trim() === '' || p.title.toLowerCase().includes(q.toLowerCase()))
        );
        if (sort === 'fiyatArtan') arr = arr.slice().sort((a, b) => a.price - b.price);
        if (sort === 'fiyatAzalan') arr = arr.slice().sort((a, b) => b.price - a.price);
        return arr;
    }, [q, cat, sort, products]);                               // ⬅️ products dependency

    const addToCart = (p: Product) =>
        setCart(prev => {
            const ex = prev[p.id];
            const qty = ex ? ex.qty + 1 : 1;
            return { ...prev, [p.id]: { product: p, qty } };
        });

    const inc = (id: string) => setCart(prev => ({ ...prev, [id]: { ...prev[id], qty: prev[id].qty + 1 } }));
    const dec = (id: string) => setCart(prev => {
        const it = prev[id]; if (!it) return prev;
        const qty = Math.max(1, it.qty - 1);
        return { ...prev, [id]: { ...it, qty } };
    });
    const removeItem = (id: string) => setCart(prev => { const c = { ...prev }; delete c[id]; return c; });
    const clearCart = () => setCart({});

    const cartItems = Object.values(cart);
    const total = cartItems.reduce((s, it) => s + it.product.price * it.qty, 0);

    React.useEffect(() => {
        try { localStorage.setItem('cart', JSON.stringify(cart)); } catch { }
    }, [cart]);

    return (
        <div className="products-page">
            <div className="filter-bar">
                <Input allowClear prefix={<SearchOutlined />} placeholder="Ürün ara…" value={q} onChange={e => setQ(e.target.value)} className="filter-search" />
                <div className="filter-right">
                    <Select value={cat} onChange={v => setCat(v)} className="filter-select"
                        options={[{ value: 'Tümü', label: 'Kategori' }, { value: 'Elektronik', label: 'Elektronik' }, { value: 'Mobilya', label: 'Mobilya' }, { value: 'Aksesuar', label: 'Aksesuar' }]} />
                    <Select value={sort} onChange={v => setSort(v)} className="filter-select filter-select-sort"
                        options={[{ value: 'none', label: 'Sırala' }, { value: 'fiyatArtan', label: 'Fiyat (Artan)' }, { value: 'fiyatAzalan', label: 'Fiyat (Azalan)' }]} />
                </div>
            </div>

            <div className="products-content">
                <div className="grid">
                    {filtered.map(p => (
                        <div key={p.id} className="card">
                            <div className="card-cover">
                                {p.img && <img className="cover-img" src={p.img} alt={p.title} />}
                                <button className={`fav ${has(p.id) ? 'active' : ''}`} onClick={() => toggle(p.id)} aria-label="Favorilere ekle">
                                    {has(p.id) ? <HeartFilled /> : <HeartOutlined />}
                                </button>
                                <div className="hover-actions">
                                    <Link to={`/products/${p.id}`} className="circle" title="Detay"><EyeOutlined /></Link>
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

                <aside className="cart">
                    <div className="cart-head"><div className="cart-title">Sepetim</div><Badge count={cartItems.length} /></div>
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
                            <Button type="primary" className="btn-brand" onClick={() => navigate('/products/checkout', { state: { cart } })}>
                                Ödeme Yap
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
