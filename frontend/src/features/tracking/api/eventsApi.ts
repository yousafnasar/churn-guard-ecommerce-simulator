import { api } from "../../../shared/lib/api";

export const sendEvent = async (payload: any) => {
    const response = await api.post("/events/", payload);
    return response.data;
};