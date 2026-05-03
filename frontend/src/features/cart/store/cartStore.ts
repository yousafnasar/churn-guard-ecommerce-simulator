import { useState } from "react";
import type { Product } from "../../products/types/product";

let cartItemsState: Product[] = [];
let listeners: Array<(items: Product[]) => void> = [];

const notify = () => {
    listeners.forEach((listener) => listener([...cartItemsState]));
};

export const addToCartState = (product: Product) => {
    cartItemsState.push(product);
    notify();
};

export const removeFromCartState = (productId: number) => {
    cartItemsState = cartItemsState.filter((item) => item.product_id !== productId);
    notify();
};

export const useCartStore = () => {
    const [items, setItems] = useState<Product[]>(cartItemsState);

    const subscribe = (listener: (items: Product[]) => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    };

    return {
        items,
        setItems,
        subscribe,
    };
};