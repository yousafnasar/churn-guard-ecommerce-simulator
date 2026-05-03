import { useEffect } from "react";
import { removeFromCartState, useCartStore } from "../store/cartStore";
import { useTrackEvent } from "../../tracking/hooks/useTrackEvent";

export const CartPage = () => {
    const { items, setItems, subscribe } = useCartStore();
    const { trackProductEvent } = useTrackEvent();

    useEffect(() => {
        const unsubscribe = subscribe(setItems);
        return unsubscribe;
    }, []);

    const handleRemove = async (productId: number) => {
        const product = items.find((item) => item.product_id === productId);
        if (!product) return;

        removeFromCartState(productId);
        await trackProductEvent("remove_from_cart", product);
    };

    if (items.length === 0) {
        return <p className="text-slate-600">Your cart is empty.</p>;
    }

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold text-slate-800">Cart</h1>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.product_id}
                        className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
                    >
                        <div>
                            <h2 className="font-semibold text-slate-800">{item.brand}</h2>
                            <p className="text-sm text-slate-500">{item.category_code}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold">${item.price}</span>
                            <button
                                onClick={() => handleRemove(item.product_id)}
                                className="rounded-lg bg-red-500 px-3 py-2 text-white"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};