import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/profile';

interface ProfileData {
  name: string;
  github_username: string;
  portfolio: string;
  bio: string;
  technologies: string[];
  interests: string[];
  looking_for: string[];
  projects: {
    name: string;
    url: string;
    description: string;
    technologies: string;
    role: string;
  }[];
}

export const GET: APIRoute = async ({ request, locals }) => {
    const user = await locals.currentUser();
    const auth = await locals.auth();
    const token = auth.getToken();

    return new Response(JSON.stringify({token}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const user = await locals.currentUser();
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not authenticated' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await request.json() as ProfileData;
        
        // Validate required fields
        /*if (!body.github_username) {
            return new Response(JSON.stringify({ error: 'GitHub username is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }*/

        const updateData = {
            clerk_user_id: user.id,
            name: body.name,
            github_username: body.github_username,
            portfolio: body.portfolio,
            bio: body.bio,
        }

        if(body.data_fetched_from_github){
            updateData.data_fetched_from_github = body.data_fetched_from_github;
        }

        // Save to Supabase
        const { error } = await supabase
            .from('user_profiles')
            .upsert(updateData)
            .eq('clerk_user_id', user.id);

        if(error){
            throw error;
        }

        if(body.technologies.length){
            const { error } = await supabase
                .from('user_technologies')
                .upsert(body.technologies.map((technology_id) => ({
                    user_id: user.id,
                    technology_id: technology_id
                })), { ignoreDuplicates: false });

            if(error){
                throw error;
            }
        }

        // TODO: Store these
        // interests: body.interests,
        // looking_for: body.looking_for,
        // projects: body.projects

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify({ message: 'Profile saved successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};