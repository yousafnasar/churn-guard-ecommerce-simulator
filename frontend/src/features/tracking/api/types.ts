export interface EventPayload {
    event_time: string;
    event_type: string;
    product_id: number;
    category_id: number;
    category_code: string | null;
    brand: string | null;
    price: number;
    user_id: number;
    user_session: string;
}