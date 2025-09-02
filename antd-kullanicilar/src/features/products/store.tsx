import React from 'react';

export type Category = 'Elektronik' | 'Mobilya' | 'Aksesuar';
export type Product = {
    id: string;
    title: string;
    price: number;
    category: Category;
    stock: number;
    img?: string;
    desc?: string;
};

const initialProducts: Product[] = [
    { id: 'p1', title: 'Dizüstü Bilgisayar', price: 2450, category: 'Elektronik', stock: 5, img: '/assets/products/laptop.jpg', desc: '14" IPS, 16GB RAM, 512GB SSD' },
    { id: 'p2', title: 'Kablosuz Kulaklık', price: 1850, category: 'Elektronik', stock: 10, img: '/assets/products/earbuds.jpg', desc: 'Aktif gürültü engelleme' },
    { id: 'p3', title: 'Gaming Mouse', price: 600, category: 'Elektronik', stock: 17, img: '/assets/products/mouse.jpg', desc: '16000 DPI, RGB' },
    { id: 'p4', title: 'Mekanik Klavye', price: 950, category: 'Elektronik', stock: 8, img: '/assets/products/keyboard.jpg', desc: 'Kailh Brown switch' },
    { id: 'p5', title: 'Ofis Sandalyesi', price: 2200, category: 'Mobilya', stock: 6, img: '/assets/products/chair.jpg', desc: 'Ergonomik sırt desteği' },
    { id: 'p6', title: 'Çalışma Masası', price: 1700, category: 'Mobilya', stock: 9, img: '/assets/products/desk.jpg', desc: '120×60cm, meşe kaplama' },
    { id: 'p7', title: 'Masa Lambası', price: 350, category: 'Aksesuar', stock: 30, img: '/assets/products/lamp.jpg', desc: 'Ayarlanabilir sıcaklık' },
    { id: 'p8', title: 'USB-C Hub', price: 420, category: 'Aksesuar', stock: 25, img: '/assets/products/hub.jpg', desc: '7-in-1, 4K HDMI' },
];

type ProductsCtx = {
    products: Product[];
    addProduct: (p: Omit<Product, 'id'>) => Product;
};

const Ctx = React.createContext<ProductsCtx | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = React.useState<Product[]>(initialProducts);

    const addProduct = (p: Omit<Product, 'id'>) => {
        const id = `p${Date.now()}`;
        const newProd: Product = { id, ...p };
        setProducts(prev => [newProd, ...prev]);
        return newProd;
    };

    return <Ctx.Provider value={{ products, addProduct }}>{children}</Ctx.Provider>;
}

export function useProducts() {
    const v = React.useContext(Ctx);
    if (!v) throw new Error('useProducts must be used within ProductsProvider');
    return v;
}
