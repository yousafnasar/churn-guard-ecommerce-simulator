import { sendEvent } from "../api/eventsApi";
import type { Product } from "../../products/types/product";
import { getOrCreateSessionId, getOrCreateUserId } from "../../../shared/utils/session";

export const useTrackEvent = () => {
    const trackProductEvent = async (
        eventType: string,
        product: Product
    ) => {
        try {
            await sendEvent({
                event_time: new Date().toISOString(),
                event_type: eventType,
                product_id: product.product_id,
                category_id: product.category_id,
                category_code: product.category_code,
                brand: product.brand,
                price: product.price,
                user_id: getOrCreateUserId(),
                user_session: getOrCreateSessionId(),
            });
        } catch (error) {
            console.error("Failed to track event:", error);
        }
    };

    return { trackProductEvent };
};