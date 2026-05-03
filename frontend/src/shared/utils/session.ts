export const getOrCreateUserId = (): number => {
    const stored = localStorage.getItem("dummy_user_id");
    if (stored) return Number(stored);

    const id = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("dummy_user_id", String(id));
    return id;
};

export const getOrCreateSessionId = (): string => {
    const stored = sessionStorage.getItem("dummy_user_session");
    if (stored) return stored;

    const id = crypto.randomUUID();
    sessionStorage.setItem("dummy_user_session", id);
    return id;
};