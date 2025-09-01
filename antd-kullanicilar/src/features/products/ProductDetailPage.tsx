import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined, HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { PRODUCTS } from './data';
import { useFavorites } from './favorites';          // ✅
import './products.css';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = PRODUCTS.find(p => p.id === id);
    const { has, toggle } = useFavorites();            // ✅

    if (!product) {
        return (
            <div className="detail-page">
                <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>Geri</Button>
                <div className="detail-missing">Ürün bulunamadı.</div>
            </div>
        );
    }

    const isFav = has(product.id);                     // ✅

    return (
        <div className="detail-page">
            <div className="detail-top">
                <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>Geri</Button>
                <div className="detail-actions">
                    <Button type="primary" className="btn-brand" icon={<ShoppingCartOutlined />}>Sepete Ekle</Button>
                </div>
            </div>

            <div className="detail-hero">
                <div className="detail-hero-imgwrap">
                    {product.img && <img src={product.img} alt={product.title} />}
                    <button
                        className={`fav ${isFav ? 'active' : ''}`}
                        onClick={() => toggle(product.id)}
                        aria-label="Favori"
                        title={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                        {isFav ? <HeartFilled /> : <HeartOutlined />}
                    </button>
                </div>

                <div className="detail-hero-info">
                    <h2>{product.title}</h2>
                    <div className="muted">{product.category} • Stok: {product.stock}</div>
                    <p className="desc">{product.desc || 'Bu ürün hakkında açıklama yakında eklenecek.'}</p>
                    <div className="price-lg">{product.price.toLocaleString('tr-TR')} ₺</div>
                </div>
            </div>
        </div>
    );
}
