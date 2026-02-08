import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, url }) => {
    try {
        const search = url.searchParams.get('search') || '';
        const page = url.searchParams.get('page') || '1';

        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        queryParams.append('page', page);

        const response = await fetch(`${API_URL}/public/skpd?${queryParams.toString()}`, {
            headers: {
                Accept: 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            // Laravel pagination returns data inside result.data object
            const paginationData = result.data || {};

            return {
                skpds: paginationData.data || [],
                pagination: {
                    current_page: paginationData.current_page || 1,
                    last_page: paginationData.last_page || 1,
                    next_page_url: paginationData.next_page_url || null,
                    prev_page_url: paginationData.prev_page_url || null
                },
                search
            };
        }

        return {
            skpds: [],
            pagination: { current_page: 1, last_page: 1, next_page_url: null, prev_page_url: null },
            search: ''
        };
    } catch (error) {
        console.error('Error loading PPID Pelaksana data:', error);
        return {
            skpds: [],
            pagination: { current_page: 1, last_page: 1, next_page_url: null, prev_page_url: null },
            search: ''
        };
    }
};
