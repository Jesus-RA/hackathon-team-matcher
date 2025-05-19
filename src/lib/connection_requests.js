import { supabase } from './supabase.js';

/**
 * Create a connection request between two users
 * @param {string} requesterUserId - The ID of the user who is sending the request
 * @param {string} recipientUserId - The ID of the user who is receiving the request
 * @returns {Promise<boolean>} - True if the request was created successfully, false otherwise
 */
export const createConnectionRequest = async (requesterUserId, recipientUserId) => {
    const { data, error } = await supabase
        .from('connection_requests')
        .insert({
            requester_user_id: requesterUserId,
            recipient_user_id: recipientUserId,
            status: 'pending'
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};

/**
 * Update a connection request
 * @param {string} requestId - The ID of the request to update
 * @param {string} status - The new status of the request
 * @returns {Promise<any>} - The updated request
 */
export const updateConnectionRequest = async (requestId, status) => {
    const { error } = await supabase
        .from('connection_requests')
        .update({
            status,
        })
        .eq('id', requestId);
    

    if (error) throw error;

    return true;
};

/**
 * Get all connection requests for a user
 * @param {string} userId - The ID of the user to get requests for
 * @returns {Promise<any>} - The connection requests
 */
export const getConnectionRequests = async (userId) => {
    // Get both sent and received requests
    const { data: sentRequests, error: sentError } = await supabase
        .from('connection_requests')
        .select(`
            *,
            requester:requester_user_id (
                clerk_user_id,
                name,
                job_title,
                bio,
                user_technologies (technologies (id, name))
            ),
            recipient:recipient_user_id (
                clerk_user_id,
                name,
                job_title,
                bio,
                user_technologies (technologies (id, name))
            )
        `)
        .or(`requester_user_id.eq.${userId},recipient_user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (sentError) throw sentError;
    return sentRequests;
};

/**
 * Check if a connection request already exists between two users
 * @param {string} requesterUserId - The ID of the user who is sending the request
 * @param {string} recipientUserId - The ID of the user who is receiving the request
 * @returns {Promise<any>} - The connection request if it exists, null otherwise
 */
export const checkExistingConnection = async (requesterUserId, recipientUserId) => {
    const { data, error } = await supabase
        .from('connection_requests')
        .select('id, status')
        .or(`and(requester_user_id.eq.${requesterUserId},recipient_user_id.eq.${recipientUserId}),and(requester_user_id.eq.${recipientUserId},recipient_user_id.eq.${requesterUserId})`)
        .single();

    if (error) return null;
    return data;
};


export const deleteConnectionRequest = async (requestId) => {
    const { error } = await supabase
        .from('connection_requests')
        .delete()
        .eq('id', requestId);

    if (error) return false;

    return true;
}