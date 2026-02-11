import { API_URL } from '$env/static/private';
import type { PageServerLoad, Actions } from './$types';
import type { KategoriInformasi, Skpd, DokumenPublik } from '$lib/types/DokumenPublikTypes';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
    const token = cookies.get('access_token');
    const { id } = params;

    try {
        // Fetch dokumen data
        const dokumenResponse = await fetch(`${API_URL}/admin/dokumen-publik/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        if (!dokumenResponse.ok) {
            throw error(404, 'Dokumen tidak ditemukan');
        }

        const dokumenResult = await dokumenResponse.json();
        const dokumen: DokumenPublik = dokumenResult.data;

        // Fetch kategori list
        const kategoriResponse = await fetch(`${API_URL}/admin/master-data/kategori-informasi`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        let kategoriList: KategoriInformasi[] = [];
        if (kategoriResponse.ok) {
            const kategoriData = await kategoriResponse.json();
            kategoriList = kategoriData.data || [];
        }

        // Fetch SKPD list
        const skpdResponse = await fetch(`${API_URL}/admin/skpd`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        let skpdList: Skpd[] = [];
        if (skpdResponse.ok) {
            const skpdData = await skpdResponse.json();
            skpdList = skpdData.data || [];
        }

        return {
            dokumen,
            kategoriList,
            skpdList
        };
    } catch (err) {
        if (err instanceof Response && err.status === 404) {
            throw err;
        }
        throw error(500, 'Terjadi kesalahan saat memuat data');
    }
};

export const actions: Actions = {
    default: async ({ params, request, cookies, fetch }) => {
        const token = cookies.get('access_token');
        const { id } = params;
        const formData = await request.formData();

        // Check if there's a file upload, if not we need to use regular JSON
        const hasFile = formData.get('file') && (formData.get('file') as File).size > 0;

        try {
            let response;

            if (hasFile) {
                // Use FormData for file upload
                response = await fetch(`${API_URL}/admin/dokumen-publik/${id}`, {
                    method: 'POST', // Laravel uses POST with _method field for file uploads
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    body: (() => {
                        const fd = new FormData();
                        // Add _method for Laravel PUT override
                        fd.append('_method', 'PUT');
                        // Copy all form data
                        for (const [key, value] of formData.entries()) {
                            if (key !== 'file' || (value as File).size > 0) {
                                fd.append(key, value);
                            }
                        }
                        return fd;
                    })()
                });
            } else {
                // Use JSON for updates without file
                const data: Record<string, string> = {};
                for (const [key, value] of formData.entries()) {
                    if (key !== 'file') {
                        data[key] = value as string;
                    }
                }

                response = await fetch(`${API_URL}/admin/dokumen-publik/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            }

            const result = await response.json();

            if (result.success) {
                throw redirect(303, '/admin/dokumen-publik?success=updated');
            } else {
                return {
                    success: false,
                    errors: result.errors || {},
                    message: result.message || 'Terjadi kesalahan saat menyimpan data.'
                };
            }
        } catch (error) {
            if (error instanceof Response && error.status === 303) {
                throw error;
            }
            return {
                success: false,
                errors: {},
                message: 'Terjadi kesalahan saat menyimpan data.'
            };
        }
    }
};
