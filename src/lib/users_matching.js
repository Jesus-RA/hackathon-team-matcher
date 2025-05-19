const WEIGHTS = {
    SHARED_TECHNOLOGIES: 0.5,
    INTERESTS: 0.2,
    LOOKING_FOR: 0.2,
    PROJECTS: 0.1,
}

const MAX_POSSIBLE_SCORE_BY_CRITERIA = {
    SHARED_TECHNOLOGIES: 5,
    INTERESTS: 5,
    LOOKING_FOR: 5,
    PROJECTS: 5,
}

export const calculateMatchingScore = (userA, userB)  => {
    const shared_technologies_score = scoreSharedTechnologies(userA, userB);
    const interests_score = scoreInterests(userA, userB);
    const looking_for_score = scoreLookingFor(userA, userB);
    
    //const max_possible_score = (WEIGHTS.SHARED_TECHNOLOGIES * MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES) + (WEIGHTS.INTERESTS * MAX_POSSIBLE_SCORE_BY_CRITERIA.INTERESTS) + (WEIGHTS.LOOKING_FOR * MAX_POSSIBLE_SCORE_BY_CRITERIA.LOOKING_FOR);
    // Calculate max possible score based on weights and max possible score by criteria
    const max_possible_score = Object.entries(WEIGHTS).reduce((maxScore, [key, value]) => {
        return maxScore + (value * MAX_POSSIBLE_SCORE_BY_CRITERIA[key]);
    }, 0);

    const total_score = (shared_technologies_score * WEIGHTS.SHARED_TECHNOLOGIES) + (interests_score * WEIGHTS.INTERESTS) + (looking_for_score * WEIGHTS.LOOKING_FOR);

    const total_percentage = (total_score / max_possible_score) * 100

    const categories = [
        {
            name: 'Shared technologies',
            score: shared_technologies_score,
            max_score: MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES,
            percentage: (shared_technologies_score / MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES) * 100,
        },
        {
            name: 'My interests',
            score: interests_score,
            max_score: MAX_POSSIBLE_SCORE_BY_CRITERIA.INTERESTS,
            percentage: (interests_score / MAX_POSSIBLE_SCORE_BY_CRITERIA.INTERESTS) * 100,
        },
        {
            name: 'I am looking for',
            score: looking_for_score,
            max_score: MAX_POSSIBLE_SCORE_BY_CRITERIA.LOOKING_FOR,
            percentage: (looking_for_score / MAX_POSSIBLE_SCORE_BY_CRITERIA.LOOKING_FOR) * 100,
        }
    ];

    return {
        total_score,
        total_percentage,
        categories,
    }
}

export const scoreSharedTechnologies = (userA, userB) => {
    const POINTS_CRITERIA_BY_MATCHED_TECHNOLOGIES = {
        0: 0,
        1: 1,
        2: 3,
        3: MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES,
    }

    // Create users sets from technologies names
    const userATechnologies = new Set(userA.technologies.map(t => t.name));
    const userBTechnologies = new Set(userB.technologies.map(t => t.name));
    
    const sharedTechnologies = userATechnologies.intersection(userBTechnologies);

    return POINTS_CRITERIA_BY_MATCHED_TECHNOLOGIES[sharedTechnologies.size] ?? MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES;
}

/**
 * Score user A interests based on the matched positions the user B is looking for.
 * In other words, how many positions the user A is interested in working on are also the ones the user B is looking for.
 * @param {Object} userA - User A data
 * @param {Object} userB - User B data
 * @returns {number} Score based on the number of positions matched
 */
export const scoreInterests = (userA, userB) => {
    const POINTS_CRITERIA_BY_MATCHED_INTERESTS = {
        0: 0,
        1: 1,
        2: 3,
        3: MAX_POSSIBLE_SCORE_BY_CRITERIA.INTERESTS,
    }

    const userAInterests = new Set(userA.interests.map(t => t.name));
    const userBLookingFor = new Set(userB.looking_for.map(t => t.name));
    console.log({userAInterests, userBLookingFor})
    
    const matchedPositions = userAInterests.intersection(userBLookingFor);

    return POINTS_CRITERIA_BY_MATCHED_INTERESTS[matchedPositions.size] ?? MAX_POSSIBLE_SCORE_BY_CRITERIA.INTERESTS;
}

/**
 * Score user A looking for based on the matched positions the user B is interested in working on.
 * In other words, how many positions the user A is looking for are also the ones the user B is interested in working on.
 * @param {Object} userA - User A data
 * @param {Object} userB - User B data
 * @returns {number} Score based on the number of positions matched
 */
export const scoreLookingFor = (userA, userB) => {
    const POINTS_CRITERIA_BY_MATCHED_LOOKING_FOR = {
        0: 0,
        1: 1,
        2: 3,
        3: MAX_POSSIBLE_SCORE_BY_CRITERIA.LOOKING_FOR,
    }

    const userALookingFor = new Set(userA.looking_for.map(t => t.name));
    const userBInterests = new Set(userB.interests.map(t => t.name));
    console.log({userALookingFor, userBInterests})
    
    const matchedPositions = userALookingFor.intersection(userBInterests);

    return POINTS_CRITERIA_BY_MATCHED_LOOKING_FOR[matchedPositions.size] ?? MAX_POSSIBLE_SCORE_BY_CRITERIA.LOOKING_FOR;
}