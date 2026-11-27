const BASE_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;
const TOKEN_KEY = "access_token";

// Access Token
export const tokenStore = {
    get: () => {
        return (
            localStorage.getItem(TOKEN_KEY) ||
            sessionStorage.getItem(TOKEN_KEY)
        );
    },

    set: (token, remember = true) => {

        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);


        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, token);
    },


    replace: (token) => {
        const wasSession =
            !localStorage.getItem(TOKEN_KEY) &&
            sessionStorage.getItem(TOKEN_KEY);
        (wasSession ? sessionStorage : localStorage).setItem(TOKEN_KEY, token);
    },

    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
    },
};

// Handling API Errors
export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

const buildUrl = (path) => {
    const baseUrl = (BASE_URL ?? "").replace(/\/+$/, "");
    const endpoint = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${endpoint}`;
};


const extractMessage = (data) => {
    if (!data) return null;

    if (data.errors && typeof data.errors === "object") {
        const first = Object.values(data.errors).flat()[0];
        if (first) return String(first);
    }

    return typeof data.message === "string" ? data.message : null;
};

const handleUnauthorized = (res, path) => {
    if (res.status === 401 && !path.split("?")[0].endsWith("/change-password")) {
        tokenStore.clear();
    }
};

async function send(path, { method = "GET", body, signal, headers: extra } = {}) {
    const headers = { Accept: "application/json", ...extra };

    const token = tokenStore.get();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const isForm = body instanceof FormData;
    if (body && !isForm) {
        headers["Content-Type"] = "application/json";
    }

    try {
        return await fetch(buildUrl(path), {
            method,
            headers,
            signal,
            body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
        });
    } catch (err) {
        if (err?.name === "AbortError") throw err;
        throw new ApiError("Unable to connect to the server; please check your internet connection.", 0, null);
    }
}


export async function request(path, options) {
    const res = await send(path, options);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        handleUnauthorized(res, path);
        throw new ApiError(
            extractMessage(data) || "An unexpected error occurred",
            res.status,
            data
        );
    }

    return data;
}

export async function requestBlob(path, options = {}) {
    const res = await send(path, {
        ...options,
        headers: { Accept: "*/*", ...options.headers },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        handleUnauthorized(res, path);
        throw new ApiError(
            extractMessage(data) || "Unable to load the file",
            res.status,
            data
        );
    }

    return res.blob();
}