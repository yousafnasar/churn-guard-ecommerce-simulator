import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../api/productsApi";
import type { Product } from "../types/product";
import { useTrackEvent } from "../../tracking/hooks/useTrackEvent";
import { addToCartState } from "../../cart/store/cartStore";

export const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { trackProductEvent } = useTrackEvent();

    useEffect(() => {
        const loadProduct = async () => {
            if (!productId) return;

            try {
                const data = await fetchProductById(Number(productId));
                setProduct(data);
                await trackProductEvent("view", data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (!product) return;

        addToCartState(product);
        await trackProductEvent("cart", product);
        alert("Added to cart");
    };

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <h1 className="text-3xl font-bold text-slate-800">{product.brand}</h1>
            <p className="mt-3 text-slate-500">{product.category_code}</p>
            <p className="mt-4 text-2xl font-bold text-slate-900">${product.price}</p>

            <button
                onClick={handleAddToCart}
                className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-white"
            >
                Add to Cart
            </button>
        </div>
    );
};