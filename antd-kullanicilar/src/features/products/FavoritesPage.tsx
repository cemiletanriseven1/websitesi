import React from 'react';
import { Badge } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, HeartFilled } from '@ant-design/icons';
import { PRODUCTS } from './data';
import { useFavorites } from './favorites';
import { Link } from 'react-router-dom';
import './products.css'; // ✅ düzeltildi

export default function FavoritesPage() {
    const { favs } = useFavorites();
    const list = PRODUCTS.filter(p => favs.has(p.id));

    return (
        <div className="products-page">
            <div className="filter-bar">
                <div style={{ fontWeight: 700 }}>Favoriler ({list.length})</div>
            </div>

            <div className="products-content">
                <div className="grid">
                    {list.map(p => (
                        <div key={p.id} className="card">
                            <div className="card-cover">
                                {p.img && <img className="cover-img" src={p.img} alt={p.title} />}
                                <button className="fav active" aria-label="Favori"><HeartFilled /></button>
                                <div className="hover-actions">
                                    <Link to={`/products/${p.id}`} className="circle" title="Detay"><EyeOutlined /></Link>
                                    <button className="circle" title="Sepete Ekle"><ShoppingCartOutlined /></button>
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
                    {list.length === 0 && (
                        <div style={{ gridColumn: '1/-1', color: '#6b7280' }}>Henüz favori ürün yok.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
