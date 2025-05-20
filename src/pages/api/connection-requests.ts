import { Astro } from 'astro';
import { supabase } from '@/lib/supabase.js';
import { createConnectionRequest, updateConnectionRequest, getConnectionRequests, checkExistingConnection } from '@/lib/connection_requests.js';

// Types
interface ConnectionRequest {
    id: string;
    requester_user_id: string;
    recipient_user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
    requester: {
        clerk_user_id: string;
        name: string;
        bio: string;
        job_title: string;
        user_technologies: {
            technologies: {
                id: string;
                name: string;
            }[];
        }[];
    };
    recipient: {
        clerk_user_id: string;
        name: string;
        bio: string;
        job_title: string;
        user_technologies: {
            technologies: {
                id: string;
                name: string;
            }[];
        }[];
    };
}

// Get all connection requests for the current user
export async function GET({ request, locals }: Astro.RequestEvent) {
    try {
        const currentUser = await locals.currentUser();
        if (!currentUser) {
            return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
        }

        const requests = await getConnectionRequests(currentUser.id);
        return new Response(JSON.stringify({ data: requests }));
    } catch (error) {
        console.error('Error fetching connection requests:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch connection requests' }), { status: 500 });
    }
}

// Create a new connection request
export async function POST({ request, locals }: Astro.RequestEvent) {
    try {
        const currentUser = await locals.currentUser();
        if (!currentUser) {
            return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
        }

        const { recipient_user_id } = await request.json();
        if (!recipient_user_id) {
            return new Response(JSON.stringify({ error: 'Recipient user ID is required' }), { status: 400 });
        }

        const existingConnection = await checkExistingConnection(currentUser.id, recipient_user_id);
        if (existingConnection) {
            return new Response(JSON.stringify({ error: 'Connection request already exists' }), { status: 400 });
        }

        const requestId = await createConnectionRequest(currentUser.id, recipient_user_id);
        if (!requestId) {
            return new Response(JSON.stringify({ error: 'Failed to create connection request' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, requestId }));
    } catch (error) {
        console.error('Error creating connection request:', error);
        return new Response(JSON.stringify({ error: 'Failed to create connection request' }), { status: 500 });
    }
}