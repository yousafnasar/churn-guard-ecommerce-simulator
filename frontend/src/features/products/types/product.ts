export interface Product {
    product_id: number;
    category_id: number;
    category_code: string | null;
    brand: string | null;
    price: number;
}