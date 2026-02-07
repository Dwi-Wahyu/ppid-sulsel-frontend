export const load = ({ locals }) => {
    // Mengambil data user yang sudah diset di hooks
    return {
        user: locals.user
    };
};
