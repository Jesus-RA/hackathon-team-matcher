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
            job_title: body.job_title,
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

        // Delete all existing records first
        await Promise.all([
            supabase.from('user_technologies').delete().eq('user_id', user.id),
            supabase.from('user_interested_positions').delete().eq('user_id', user.id),
            supabase.from('user_looking_for_positions').delete().eq('user_id', user.id)
        ]);

        // Insert new records
        const operations = [];

        if(body.technologies.length){
            operations.push(
                supabase
                    .from('user_technologies')
                    .insert(body.technologies.map((technology_id) => ({
                        user_id: user.id,
                        technology_id: technology_id
                    })))
            );
        }

        if(body.interests.length){
            operations.push(
                supabase
                    .from('user_interested_positions')
                    .insert(body.interests.map((interest_id) => ({
                        user_id: user.id,
                        position_id: interest_id
                    })))
            );
        }

        if(body.looking_for.length){
            operations.push(
                supabase
                    .from('user_looking_for_positions')
                    .insert(body.looking_for.map((position) => ({
                        user_id: user.id,
                        position_id: position.position_id,
                        required_people: position.required_people
                    })))
            );
        }

        // Execute all operations in parallel
        const results = await Promise.all(operations);

        // Check for any errors
        const errors = results.filter(result => result.error);
        if(errors.length > 0) {
            throw errors[0].error;
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