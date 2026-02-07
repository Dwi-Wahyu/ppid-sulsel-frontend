// src/routes/logout/+page.server.ts
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ fetch, cookies }) => {
        const token = cookies.get("access_token");

        if (token) {
            // 1. Beritahu Laravel untuk menghapus token di database
            try {
                await fetch("http://localhost:8000/api/auth/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
            } catch (error) {
                // Log error jika Laravel offline, tapi tetap lanjut hapus cookie
                console.error("Logout API Error:", error);
            }
        }

        // 2. Hapus cookie di SvelteKit
        cookies.delete("access_token", { path: "/" });

        // 3. Arahkan kembali ke halaman login
        throw redirect(303, "/login");
    },
} satisfies Actions;
