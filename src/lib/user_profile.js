import { supabase } from '@/lib/supabase.js'
import { fetchUserProfile, getUserTechnologiesBasedOnRepos } from '@/lib/github.js';

/**
 * Get data from user_profiles, technologies, positions tables from supabase excluding the given user
 * @param {string} userId - The user's ID to exclude
 * @returns { data, error } Promise Supabase query results
 */
export const getOtherUsersProfileData = async (userId) => {
    let { data, error } = await supabase
        .from('user_profiles')
        .select('clerk_user_id, name, bio, github_username, user_technologies (technologies (id, name ) ), user_interested_positions (positions (id, name)), user_looking_for_positions (positions (id, name), required_people)')
        .neq('clerk_user_id', userId);

    // Map users data
    data = data && data.map(user => {
        const mappedUser = {
            ...user,
            technologies: user.user_technologies.map(t => t.technologies),
            interests: user.user_interested_positions.map(p => p.positions),
            looking_for: user.user_looking_for_positions.map(p => ({
                ...p.positions,
                required_people: p.required_people
            }))
        }

        delete mappedUser.user_technologies;
        delete mappedUser.user_interested_positions;
        delete mappedUser.user_looking_for_positions;

        return mappedUser;
    })

    return { data, error };
}

/**
 * Get data from user_profiles and technologies tables from supabase
 * @returns { data, error } Promise Supabase query results
 */
export const getUsersWithTechnologies = async () => {
    let { data, error } = await supabase
        .from('user_profiles')
        .select('clerk_user_id, name, bio, github_username, user_technologies (technologies (id, name ) ), user_interested_positions (positions (id, name))');

    // Map users data
    data = data && data.map(user => {
        const mappedUser = {
            ...user,
            technologies: user.user_technologies.map(t => t.technologies),
            interests: user.user_interested_positions.map(p => p.positions)
        }

        delete mappedUser.user_technologies;
        delete mappedUser.user_interested_positions;

        return mappedUser;
    })

    return { data, error };
}

/**
 * Get data from user_profiles and technologies tables from supabase
 * @param {string} userId - The user's ID
 * @returns { data, error } Promise Supabase query results
 */
export const getUserProfileData = async (userId) => {
    let { data, error } = await supabase
        .from('user_profiles')
        .select('clerk_user_id, name, github_username, portfolio, bio, user_technologies (technologies (id, name ) ), user_interested_positions (positions (id, name)), user_looking_for_positions (positions (id, name), required_people)')
        .eq('clerk_user_id', userId)
        .single();

    if(error) {
        throw error;
    }

    // Map users data
    data = data && {
        ...data,
        technologies: data.user_technologies.map(t => t.technologies),
        interests: data.user_interested_positions.map(p => p.positions),
        looking_for: data.user_looking_for_positions.map(p => ({
            ...p.positions,
            required_people: p.required_people
        }))
    }

    delete data.user_technologies;
    delete data.user_interested_positions;
    delete data.user_looking_for_positions;

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

export const userProfileExists = async (userId) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('clerk_user_id')
        .eq('clerk_user_id', userId);

    if(error) {
        throw error;
    }

    return data?.length > 0;
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