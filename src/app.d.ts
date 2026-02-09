// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// Definisi user
			user: {
				id: number;
				name: string;
				username: string;
				email: string;
				id_skpd: string | null;
				skpd: {
					id_skpd: string;
					nm_skpd: string;
				} | null;
			} | null;
			token: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
