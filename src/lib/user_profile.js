import { supabase } from '@/lib/supabase.js'

/**
 * Get data from user_profiles and technologies tables from supabase
 * @returns { data, error } Promise Supabase query results
 */
export const getUsersWithTechnologies = async () => {
    let { data, error } = await supabase
        .from('user_profiles')
        .select('clerk_user_id, github_username, user_technologies (technologies (id, name ) )');

    // Map users data
    data = data && data.map(user => {
        const mappedUser = {
            ...user,
            technologies: user.user_technologies.map(t => t.technologies)
        }

        delete mappedUser.user_technologies;

        return mappedUser;
    })

    return { data, error };
}

export const haveUserTechnologiesBeenFetched = async (userId) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('technologies_fetched_from_github')
        .eq('clerk_user_id', userId)
        .single();

    if(error) {
        throw error;
    }

    return data?.technologies_fetched_from_github;
}