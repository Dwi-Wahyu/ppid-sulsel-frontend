import { API_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type {
    PermohonanInformasiDetailApiResponse,
    SkpdListApiResponse
} from '$lib/types/PermohonanInformasiTypes';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
    const token = cookies.get('access_token');
    const { id } = params;

    try {
        // Fetch permohonan detail
        const permohonanResponse = await fetch(`${API_URL}/admin/permohonan-informasi/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        if (!permohonanResponse.ok) {
            throw new Error('Failed to fetch permohonan detail');
        }

        const permohonanResult: PermohonanInformasiDetailApiResponse =
            await permohonanResponse.json();

        // Fetch SKPD list for disposition
        const skpdResponse = await fetch(`${API_URL}/admin/skpd`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });

        let skpdList: SkpdListApiResponse['data'] = [];
        if (skpdResponse.ok) {
            const skpdResult: SkpdListApiResponse = await skpdResponse.json();
            skpdList = skpdResult.data;
        }

        return {
            permohonan: permohonanResult.data,
            skpdList
        };
    } catch (error) {
        console.error('Error loading permohonan detail:', error);
        throw error;
    }
};

export const actions: Actions = {
    updateStatus: async ({ request, params, cookies, fetch }) => {
        const token = cookies.get('access_token');
        const { id } = params;
        const formData = await request.formData();

        const status = formData.get('status') as string;
        const pesan = formData.get('pesan') as string;
        const file = formData.get('file') as File;

        // Validate required fields
        if (!status) {
            return fail(400, { error: 'Status is required' });
        }

        if (!pesan) {
            return fail(400, { error: 'Pesan is required' });
        }

        // Create multipart form data for API
        const apiFormData = new FormData();
        apiFormData.append('status', status);
        apiFormData.append('pesan', pesan);
        apiFormData.append('_method', 'PUT'); // Laravel method spoofing

        // Add file if provided and not empty
        if (file && file.size > 0) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                return fail(400, { error: 'File size must be less than 10MB' });
            }
            apiFormData.append('file', file);
        }

        try {
            const response = await fetch(`${API_URL}/admin/permohonan-informasi/${id}`, {
                method: 'POST', // Using POST with _method=PUT for multipart/form-data
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                body: apiFormData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                return fail(response.status, {
                    error: result.message || 'Failed to update status'
                });
            }

            return {
                success: true,
                message: result.message || 'Status berhasil diperbarui'
            };
        } catch (error) {
            console.error('Error updating status:', error);
            return fail(500, { error: 'Internal server error' });
        }
    },

    createDisposition: async ({ request, params, cookies, fetch }) => {
        const token = cookies.get('access_token');
        const { id } = params;
        const formData = await request.formData();

        const selectedSkpd = formData.getAll('id_skpd') as string[];
        const pesan = formData.get('pesan') as string;

        // Validate required fields
        if (!selectedSkpd || selectedSkpd.length === 0) {
            return fail(400, { error: 'Pilih minimal satu SKPD' });
        }

        // Create request body
        const requestBody = {
            id_skpd: selectedSkpd,
            pesan: pesan || undefined
        };

        try {
            const response = await fetch(`${API_URL}/admin/permohonan-informasi/${id}/disposisi`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                return fail(response.status, {
                    error: result.message || 'Failed to create disposition'
                });
            }

            return {
                success: true,
                message: result.message || `Disposisi berhasil dibuat ke ${selectedSkpd.length} SKPD`
            };
        } catch (error) {
            console.error('Error creating disposition:', error);
            return fail(500, { error: 'Internal server error' });
        }
    }
};
