import { api } from "../../../shared/lib/api";
import type { Product } from "../types/product";

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products/");
    return response.data;
};

export const fetchProductById = async (productId: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${productId}`);
    return response.data;
};