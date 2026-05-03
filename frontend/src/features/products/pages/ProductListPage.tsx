import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api/productsApi";
import type { Product } from "../types/product";

export const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold text-slate-800">Products</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {products.map((product) => (
                    <div key={product.product_id} className="rounded-xl bg-white p-5 shadow">
                        <h2 className="text-lg font-semibold text-slate-800">
                            {product.brand ?? "No Brand"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">{product.category_code}</p>
                        <p className="mt-3 text-xl font-bold text-slate-900">
                            ${product.price}
                        </p>

                        <Link
                            to={`/products/${product.product_id}`}
                            className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white"
                        >
                            View Product
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};