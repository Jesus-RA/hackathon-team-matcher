// src/pages/api/connection-requests/[id].ts
import { supabase } from '@/lib/supabase.js';
import { updateConnectionRequest, deleteConnectionRequest } from '@/lib/connection_requests.js';

export async function PUT({ request, locals, params }) {
    try {
        const currentUser = await locals.currentUser();
        if (!currentUser) {
            return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
        }

        const { id } = params;
        const { status } = await request.json();
        if (!id || !status) {
            return new Response(JSON.stringify({ error: 'Request ID and status are required' }), { status: 400 });
        }

        // Only allow updating requests where the current user is the recipient
        const connectionRequest = await supabase
            .from('connection_requests')
            .select()
            .eq('id', id)
            .eq('recipient_user_id', currentUser.id)
            .single();

        if (connectionRequest.error) {
            return new Response(JSON.stringify({ error: 'Request not found or unauthorized' }), { status: 404 });
        }

        const success = await updateConnectionRequest(id, status);
        if (!success) {
            return new Response(JSON.stringify({ error: 'Failed to update connection request' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }));
    } catch (error) {
        console.error('Error updating connection request:', error);
        return new Response(JSON.stringify({ error: 'Failed to update connection request' }), { status: 500 });
    }
}

export const DELETE = async ({ request, locals, params }) => {
    try {
        const currentUser = await locals.currentUser();
        if (!currentUser) {
            return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
        }

        const { id } = params;
        if (!id) {
            return new Response(JSON.stringify({ error: 'Request ID is required' }), { status: 400 });
        }

        // Only allow deleting requests where the current user is the requester
        const { data: connectionRequest, error: requestError } = await supabase
            .from('connection_requests')
            .select()
            .eq('id', id)
            .eq('requester_user_id', currentUser.id)
            .single();

        if (requestError || !connectionRequest) {
            return new Response(JSON.stringify({ error: 'Request not found or unauthorized' }), { status: 404 });
        }

        const success = await deleteConnectionRequest(id);
        if (!success) {
            return new Response(JSON.stringify({ error: 'Failed to delete connection request' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }));
    } catch (error) {
        console.error('Error deleting connection request:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete connection request' }), { status: 500 });
    }
};