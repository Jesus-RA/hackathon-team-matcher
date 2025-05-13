import type { APIRoute } from 'astro';
import { fetchUserProfile, getUserTechnologiesBasedOnRepos } from '@/lib/github';

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile and technologies in parallel
    const [profile, technologies] = await Promise.all([
      fetchUserProfile(username),
      getUserTechnologiesBasedOnRepos(username)
    ]);

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'User not found on GitHub' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        profile,
        technologies: technologies || []
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch GitHub data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
