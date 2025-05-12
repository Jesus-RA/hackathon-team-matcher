import { supabase } from '@/lib/supabase.js'
import { fetchUserProfile, getUserTechnologiesBasedOnRepos } from '@/lib/github.js';

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

/**
 * Get data from user_profiles and technologies tables from supabase
 * @param {string} userId - The user's ID
 * @returns { data, error } Promise Supabase query results
 */
export const getUserWithTechnologies = async (userId) => {
    let { data, error } = await supabase
        .from('user_profiles')
        .select('clerk_user_id, github_username, portfolio, bio, user_technologies (technologies (id, name ) )')
        .eq('clerk_user_id', userId)
        .single();

    if(error) {
        throw error;
    }

    // Map users data
    data = data && {
        ...data,
        technologies: data.user_technologies.map(t => t.technologies)
    }

    delete data.user_technologies;

    return data;
}

export const haveUserDataBeenFetchedFromGithub = async (userId) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('data_fetched_from_github')
        .eq('clerk_user_id', userId)
        .single();

    if(error) {
        throw error;
    }

    return data?.data_fetched_from_github;
}

export const getUserTechnologies = async (userId) => {
    const { data, error } = await supabase
        .from('user_technologies')
        .select('technologies (id, name)')
        .eq('user_id', userId);
    console.log({data})

    if(error) {
        throw error;
    }

    return data?.map( t => t.technologies);
}

/**
 * Get user profile data from DB or GitHub
 * @param {object} user - The currently logged in user object
 * @returns {Promise<object>} - The user profile data
 */
export const getUserProfile = async (user) => {
    const profileData = {
        name: user?.fullName ?? '',
        github_username: user.username ?? '',
        portfolio: '',
        bio: '',
        technologies: [],
        data_fetched_from_github: false,
    };
    
    const userDataAlreadyFetchedFromGithub = await haveUserDataBeenFetchedFromGithub(user.id);

    if(userDataAlreadyFetchedFromGithub){// If user data has been fetched from github before, get it from DB
        const profile = await getUserWithTechnologies(user.id);
        console.log({profile})
        profileData.technologies = profile?.technologies;
        profileData.github_username = profile?.github_username;
        profileData.portfolio = profile?.portfolio;
        profileData.bio = profile?.bio;

    } else if(profileData.github_username){ // If user data has not been fetched from github before, fetch it from github (logged in for the first time)
        profileData.data_fetched_from_github = true;

        const [profile, technologies] = await Promise.all([
            fetchUserProfile(profileData.github_username),
            getUserTechnologiesBasedOnRepos(profileData.github_username)
        ]);

        profileData.portfolio = profile?.blog;
        profileData.bio = profile?.bio;
        profileData.technologies = technologies;
    }

    return profileData;
}