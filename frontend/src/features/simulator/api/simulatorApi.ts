import { api } from "../../../shared/lib/api";

export const seedUsers = async (count: number) => {
    const response = await api.post(`/simulator/seed-users?count=${count}`);
    return response.data;
};

export const generateEvents = async (eventsPerUser: number) => {
    const response = await api.post(
        `/simulator/generate-events?events_per_user=${eventsPerUser}`
    );
    return response.data;
};

export const exportCsvUrl = "http://127.0.0.1:8000/events/export";

export const fetchRecentEvents = async () => {
    const response = await api.get("/events/");
    return response.data;
};

export const fetchCustomers = async () => {
    const response = await api.get("/api/customers");
    return response.data;
};

export const simulateCustomer = async (email: string, eventsPerUser = 10) => {
    const response = await api.post("/api/simulate", {
        email,
        events_per_user: eventsPerUser,
    });
    return response.data;
};

export const simulateAllCustomers = async (eventsPerUser = 10) => {
    const response = await api.post("/api/simulate", {
        simulate_all: true,
        events_per_user: eventsPerUser,
    });
    return response.data;
};
export const registerGmailCustomer = async (
    email: string,
    fullName: string
) => {
    const response = await api.post("/api/customers/register", {
        email,
        full_name: fullName,
    });

    return response.data;
};

export const pushCustomerToChurnApp = async (email: string) => {
    const response = await api.post("/api/churn/push", {
        email,
    });

    return response.data;
};