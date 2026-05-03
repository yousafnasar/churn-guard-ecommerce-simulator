import { useEffect, useState } from "react";
import {
    exportCsvUrl,
    fetchCustomers,
    fetchRecentEvents,
    generateEvents,
    seedUsers,
    simulateAllCustomers,
    simulateCustomer,
    registerGmailCustomer,
    pushCustomerToChurnApp,
} from "../api/simulatorApi";

interface EventItem {
    id: number;
    event_time: string;
    event_type: string;
    product_id: number;
    category_id: number;
    category_code: string | null;
    brand: string | null;
    price: number;
    user_id: number;
    user_session: string;
    customer_email?: string | null;
}

interface CustomerItem {
    email: string;
    full_name: string | null;
    total_events: number;
    last_activity: string | null;
}

export const SimulatorPage = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [customers, setCustomers] = useState<CustomerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [gmailEmail, setGmailEmail] = useState<string | null>(null);
    const [gmailName, setGmailName] = useState<string | null>(null);

    const loadRecentEvents = async () => {
        try {
            const data = await fetchRecentEvents();
            setEvents(Array.isArray(data) ? data.slice(0, 20) : []);
        } catch (error) {
            console.error("Failed to fetch recent events:", error);
            setEvents([]);
        }
    };

    const loadCustomers = async () => {
        try {
            const data = await fetchCustomers();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            setCustomers([]);
        }
    };

    useEffect(() => {
        loadRecentEvents();
        loadCustomers();
    }, []);

    const handleSeedUsers = async () => {
        setLoading(true);
        setMessage("");

        try {
            const result = await seedUsers(20);
            setMessage(result.message || "Users seeded successfully");
            await loadRecentEvents();
        } catch (error) {
            console.error(error);
            setMessage("Failed to seed users");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateEvents = async () => {
        setLoading(true);
        setMessage("");

        try {
            const result = await generateEvents(5);
            setMessage(
                `${result.message || "Events generated successfully"} | Events created: ${result.events_created ?? 0
                }`
            );
            await loadRecentEvents();
        } catch (error) {
            console.error(error);
            setMessage("Failed to generate events");
        } finally {
            setLoading(false);
        }
    };

    const handleSimulateOne = async (email: string) => {
        setLoading(true);
        setMessage("");

        try {
            const result = await simulateCustomer(email, 10);
            setMessage(
                `${result.message || "Simulation completed"} | ${email} | Events created: ${result.events_created ?? 0
                }`
            );
            await loadRecentEvents();
            await loadCustomers();
        } catch (error) {
            console.error(error);
            setMessage("Failed to simulate selected customer");
        } finally {
            setLoading(false);
        }
    };

    const handleSimulateAll = async () => {
        setLoading(true);
        setMessage("");

        try {
            const result = await simulateAllCustomers(10);
            setMessage(
                `${result.message || "Simulation completed"} | Accounts: ${result.accounts_count ?? 0
                } | Events created: ${result.events_created ?? 0}`
            );
            await loadRecentEvents();
            await loadCustomers();
        } catch (error) {
            console.error(error);
            setMessage("Failed to simulate all customers");
        } finally {
            setLoading(false);
        }
    };
    const handleConnectGmailDemo = async () => {
        const email = prompt("Enter Gmail account for simulator:");

        if (!email || !email.includes("@gmail.com")) {
            setMessage("Please enter a valid Gmail address");
            return;
        }

        const name = prompt("Enter customer name:") || "Gmail Customer";

        setLoading(true);
        setMessage("");

        try {
            const result = await registerGmailCustomer(email, name);

            setGmailEmail(email);
            setGmailName(name);

            setMessage(result.message || "Gmail customer connected successfully");

            await loadCustomers();
        } catch (error) {
            console.error(error);
            setMessage("Failed to connect Gmail customer");
        } finally {
            setLoading(false);
        }
    };
    const handlePushToChurnApp = async (email: string) => {
        setLoading(true);
        setMessage("");

        try {
            const result = await pushCustomerToChurnApp(email);

            setMessage(
                `Pushed ${email} to churn app successfully | Status: ${result.status_code ?? "ok"
                }`
            );
        } catch (error) {
            console.error(error);
            setMessage("Failed to push data to churn app");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#D71426] py-10">
            <div className="mx-auto max-w-7xl px-6">
                <h1 className="mb-6 text-3xl font-semibold text-white">
                    Simulator Dashboard
                </h1>

                <div className="rounded-2xl bg-white p-8 shadow-xl">
                    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Connected Gmail Accounts
                            </h2>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleConnectGmailDemo}
                                    disabled={loading}
                                    className="rounded-xl bg-[#D71426] px-4 py-2 text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
                                >
                                    Connect Gmail
                                </button>

                                <button
                                    onClick={loadCustomers}
                                    disabled={loading}
                                    className="rounded-xl border border-[#D71426] px-4 py-2 text-[#D71426] transition hover:bg-red-50 disabled:opacity-50"
                                >
                                    Refresh Accounts
                                </button>
                            </div>
                        </div>

                        {customers.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No Gmail customers found. Seed or add customer accounts from the backend.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {customers.map((customer) => (
                                    <div
                                        key={customer.email}
                                        className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {customer.full_name || "Unnamed Customer"}
                                            </p>
                                            <p className="text-sm text-gray-500">{customer.email}</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Total events: {customer.total_events} | Last activity:{" "}
                                                {customer.last_activity || "No activity yet"}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => handleSimulateOne(customer.email)}
                                                disabled={loading}
                                                className="rounded-xl bg-[#D71426] px-4 py-2 text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
                                            >
                                                Simulate This Customer
                                            </button>

                                            <button
                                                onClick={() => handlePushToChurnApp(customer.email)}
                                                disabled={loading}
                                                className="rounded-xl bg-gray-900 px-4 py-2 text-white shadow-md transition hover:bg-black disabled:opacity-50"
                                            >
                                                Push to Churn App
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-8 flex flex-wrap gap-4">
                        <button
                            onClick={handleSeedUsers}
                            disabled={loading}
                            className="rounded-xl bg-[#D71426] px-5 py-2.5 text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
                        >
                            Seed 20 Users
                        </button>

                        <button
                            onClick={handleGenerateEvents}
                            disabled={loading}
                            className="rounded-xl border border-[#D71426] px-5 py-2.5 text-[#D71426] transition hover:bg-red-50 disabled:opacity-50"
                        >
                            Generate Events
                        </button>

                        <button
                            onClick={handleSimulateAll}
                            disabled={loading}
                            className="rounded-xl bg-gray-900 px-5 py-2.5 text-white shadow-md transition hover:bg-black disabled:opacity-50"
                        >
                            Simulate All Gmail Customers
                        </button>

                        <a
                            href={exportCsvUrl}
                            className="rounded-xl bg-green-600 px-5 py-2.5 text-white shadow-md transition hover:bg-green-700"
                        >
                            Export CSV
                        </a>

                        <button
                            onClick={loadRecentEvents}
                            disabled={loading}
                            className="rounded-xl border border-gray-300 px-5 py-2.5 text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Refresh Events
                        </button>
                    </div>

                    {message && (
                        <div className="mb-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-800">
                            {message}
                        </div>
                    )}

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-md">
                        <div className="border-b px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Recent Events
                            </h2>
                        </div>

                        {events.length === 0 ? (
                            <div className="px-6 py-6 text-slate-500">No events found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3 text-left">ID</th>
                                            <th className="px-4 py-3 text-left">Time</th>
                                            <th className="px-4 py-3 text-left">Type</th>
                                            <th className="px-4 py-3 text-left">Product</th>
                                            <th className="px-4 py-3 text-left">Brand</th>
                                            <th className="px-4 py-3 text-left">Price</th>
                                            <th className="px-4 py-3 text-left">User</th>
                                            <th className="px-4 py-3 text-left">Customer Email</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {events.map((event) => (
                                            <tr
                                                key={event.id}
                                                className="border-t transition hover:bg-red-50"
                                            >
                                                <td className="px-4 py-3">{event.id}</td>
                                                <td className="px-4 py-3 text-xs text-gray-500">
                                                    {event.event_time}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${event.event_type === "view"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : event.event_type === "cart"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : event.event_type === "remove_from_cart"
                                                                    ? "bg-red-200 text-red-800"
                                                                    : event.event_type === "purchase"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : event.event_type === "return"
                                                                            ? "bg-purple-100 text-purple-700"
                                                                            : "bg-gray-100 text-gray-600"
                                                            }`}
                                                    >
                                                        {event.event_type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{event.product_id}</td>
                                                <td className="px-4 py-3">{event.brand ?? "-"}</td>
                                                <td className="px-4 py-3 font-medium">
                                                    ${event.price}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {event.user_id}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {event.customer_email ?? "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};