import { atom, map } from 'nanostores';
import { fetchUserRepos, getUserTechnologiesBasedOnRepos } from '@/lib/github.js';
//import { getUsersWithTechnologies, haveUserTechnologiesBeenFetched } from '@/lib/user_profile.js';

export const $userProfile = map({
  clerk_user_id: null,
  name: '',
  job_title: '',
  github_username: '',
  email: '',
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
  } catch (error) {
    this.error = error;
  }
}

export const addTechnology = (technology) => {
  if (!$userProfile.value.technologies.find(t => t.id === technology.id)) {
    $userProfile.setKey('technologies', [...$userProfile.value.technologies, technology]);
  }
}

export const setTechnologies = (technologies) => {
  $userProfile.setKey('technologies', technologies);
}

export const removeTechnology = (technologyId) => {
  $userProfile.setKey('technologies', $userProfile.value.technologies.filter(t => t.id !== technologyId));
}

export const addInterest = (interest) => {
  if (!$userProfile.value.interests.find(item => item.name === interest.name)) {
    $userProfile.setKey('interests', [...$userProfile.value.interests, interest]);
  }
}

export const removeInterest = (interestId) => {
  const filteredInterests = $userProfile.value.interests.filter(interest => interest.id !== interestId);
  $userProfile.setKey('interests', filteredInterests)
}

export const addLookingFor = (position) => {
  if (!$userProfile.value.looking_for.find(p => p.id === position.id)) {
    $userProfile.setKey('looking_for', [...$userProfile.value.looking_for, {
      id: position.id,
      name: position.name,
      required_people: position.required_people || 1
    }]);
  }
}

export const removeLookingFor = (positionId) => {
  const filteredPositions = $userProfile.value.looking_for.filter(position => position.id !== positionId);
  $userProfile.setKey('looking_for', filteredPositions);
}

export const addProject = (project) => {
  $userProfile.value.projects.push(project);
}

export const removeProject = (index) => {
  $userProfile.value.projects.splice(index, 1);
}