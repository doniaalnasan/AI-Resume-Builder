
import { request, tokenStore } from "./client";

export const authApi = {

    //log in
    async login({ email, password, remember = true }) {
        const res = await request("/cv/auth/login", {
            method: "POST",
            body: { email, password },
        });

        const token = res?.data?.access_token;

        if (!token) {
            throw new Error("لم يصل access token من السيرفر");
        }

        tokenStore.set(token, remember);

        return res.data.student;
    },

    // craete new account
    async register({ name, email, password, password_confirmation }) {
        const res = await request("/cv/auth/register", {
            method: "POST",
            body: {
                name,
                email,
                password,
                password_confirmation,
            },
        });

        const token = res?.data?.access_token;

        if (!token) {
            throw new Error("The account has been created, but the access token has not been received.");
        }

        
        tokenStore.set(token, true);

        return res.data.student;
    },

    
    async getProfile() {
        return request("/cv/auth/profile");
    },


    async updateProfile(data) {
        return request("/cv/auth/profile", {
            method: "PATCH",
            body: data,
        });
    },


    forgotPassword: (email) =>
        request("/cv/auth/forgot-password", {
            method: "POST",
            body: { email },
        }),


    resetPassword: ({ email, token, password, password_confirmation }) =>
        request("/cv/auth/reset-password", {
            method: "POST",
            body: {
                email,
                token,
                password,
                password_confirmation,
            },
        }),

        async changePassword({ current_password, password, password_confirmation }) {
        const res = await request("/cv/auth/change-password", {
            method: "POST",
            body: { current_password, password, password_confirmation },
        });

        const token = res?.data?.access_token;
        if (!token) {
            throw new Error("The password has been changed, but no new access token was received.");
        }

        tokenStore.replace(token);
        return res;
    },

    // Log out
    async logout() {
        try {
            await request("/cv/auth/logout", {
                method: "POST",
            });
        } finally {
            tokenStore.clear();
        }
    },
};
