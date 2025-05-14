import { atom, map } from 'nanostores';
import { fetchUserRepos, getUserTechnologiesBasedOnRepos } from '@/lib/github.js';
//import { getUsersWithTechnologies, haveUserTechnologiesBeenFetched } from '@/lib/user_profile.js';

export const $userProfile = map({
  clerk_user_id: null,
  name: '',
  title: '',
  github_username: '',
  portfolio: '',
  bio: '',
  technologies: [],
  interests: [],
  looking_for: [],
  projects: [],
  technologiesFetched: false,
  profile_exists_in_db: false,
});

export const setGitHubUsername = (username) => {
    $userProfile.setKey('github_username', username);
}

export const hasCompleteProfile = () => {
  return $userProfile.name && $userProfile.github_username;
};

/*export const getMatchingUsers = async () => {
  if (!hasCompleteProfile()) return null;
  
  try {
    const { data, error } = await getUsersWithTechnologies();
    if (error) {
      throw error;
    }
    return data;
  } catch (err) {
    this.error = err;
    return null;
  }
}
*/

// Actions
/*export const fetchTechnologies = async () => {
  try {
    const username = $userProfile.github_username;
    if (!username) return;

    const technologiesFetched = await haveUserTechnologiesBeenFetched(username);
    if (!technologiesFetched) {
      const technologies = await getUserTechnologiesBasedOnRepos(username);
      $userProfile.technologies = technologies;
    }
    this.technologiesFetched = true;
  } catch (error) {
    this.error = error;
  }
}
  */

export const saveProfile = async () => {
  try {
    // TODO: Implement actual profile saving logic
    console.log('Saving profile:', $userProfile);
  } catch (error) {
    this.error = error;
  }
}

export const addTechnology = (technology) => {
  if (!$userProfile.value.technologies.includes(technology)) {
    $userProfile.value.technologies.push(technology);
  }
}

export const setTechnologies = (technologies) => {
  $userProfile.setKey('technologies', technologies);
}

export const removeTechnology = (technologyId) => {
  $userProfile.setKey('technologies', $userProfile.value.technologies.filter(t => t.id !== technologyId));
}

export const addInterest = (interest) => {
  if (!$userProfile.value.interests.includes(interest)) {
    $userProfile.value.interests.push(interest);
  }
}

export const removeInterest = (index) => {
  $userProfile.value.interests.splice(index, 1);
}

export const addLookingFor = (item) => {
  if (!$userProfile.value.looking_for.includes(item)) {
    $userProfile.value.looking_for.push(item);
  }
}

export const removeLookingFor = (index) => {
  $userProfile.value.looking_for.splice(index, 1);
}

export const addProject = (project) => {
  $userProfile.value.projects.push(project);
}

export const removeProject = (index) => {
  $userProfile.value.projects.splice(index, 1);
}