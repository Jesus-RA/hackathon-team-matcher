const BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
}

/**
 * Fetches the user's repositories from GitHub
 * @param {string} username - The GitHub username
 * @returns {Promise<Array<{id: number, name: string, description: string}>>} - The user's repositories
 */
export const fetchUserRepos = async (username) => {
    if(!username) {
        throw Error('username is required');
    }

    try{
        const url = new URL(`${BASE_URL}/users/${username}/repos`);
        url.searchParams.append('type', 'order');
        url.searchParams.append('sort', 'created');
        url.searchParams.append('direction', 'desc');

        // const response = await fetch(`${BASE_URL}/users/${username}/repos?type=owner`);
        const response = await fetch(url.toString(), { headers });
        const repos = await response.json();

        return repos.map(({id, name, description}) => ({
            id,
            name,
            description
        }))
    }catch(error) {
        console.error(error);
        console.log({error});
    }

    return [];
}

/**
 * Fetches the user's profile from GitHub
 * @param {string} username - The GitHub username
 * @returns {Promise<{id: number, blog: string, public_repos: number, followers: number, created_at: string}>} - The user's profile
 */
export const fetchUserProfile = async (username) => {
    if(!username) {
        throw Error('username is required');
    }

    try{
        const response = await fetch(`${BASE_URL}/users/${username}`, { headers });
        const { id, blog, public_repos, followers, created_at } = await response.json();

        return {
            id,
            blog,
            public_repos,
            followers,
            created_at,
        }
    } catch (error) {
        console.error(error);
        console.log({error});
    }

    return null;
}

/**
 * Fetches the programming languages used in a repository from GitHub
 * @param {string} username - The GitHub username
 * @param {string} repository - The repository name
 * @returns {Promise<Array<string>>} - The programming languages used in the repository
 */
export const fetchRepoProgrammingLanguages = async (username, repository) => {
    if(!repository) {
        throw Error('repository is required');
    }

    if(!username) {
        throw Error('username is required');
    }

    try{
        const response = await fetch(`${BASE_URL}/repos/${username}/${repository}/languages`, { headers });
        const data = await response.json();
        return Object.keys(data);
    }catch(error) {
        console.error(error);
        console.log({error});
    }

    return [];
}

/**
 * Fetches the programming languages used in a user's repositories from GitHub
 * @param {string} username - The GitHub username
 * @returns {Promise<Array<string>>} - The programming languages used in the user's repositories
 */
export const getUserTechnologiesBasedOnRepos = async (username) => {
    const repos = await fetchUserRepos(username);

    if(!repos) {
        return [];
    }

    const technologies = await Promise.all(repos.map(async (repo) => {
        try{
            const languages = await fetchRepoProgrammingLanguages(username, repo.name);

            return languages;
        } catch(error) {
            console.error(error);
            console.log({error});

            return [];
        }
    })).then((languagesArr) => languagesArr.flat());

    return [...new Set(technologies)];
}