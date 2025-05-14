const WEIGHTS = {
    SHARED_TECHNOLOGIES: 1,
    INTERESTS: 0.2,
    PROJECTS: 0.2,
}

const MAX_POSSIBLE_SCORE_BY_CRITERIA = {
    SHARED_TECHNOLOGIES: 5,
    INTERESTS: 5,
    PROJECTS: 5,
}

export const calculateMatchingScore = (userA, userB)  => {
    const shared_technologies_score = scoreSharedTechnologies(userA, userB);
    
    const max_possible_score = (WEIGHTS.SHARED_TECHNOLOGIES * MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES);
    const total_score = (shared_technologies_score * WEIGHTS.SHARED_TECHNOLOGIES);
    const total_percentage = (total_score / max_possible_score) * 100

    const categories = [
        {
            name: 'Shared Technologies',
            score: shared_technologies_score,
            max_score: MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES,
            percentage: (shared_technologies_score / MAX_POSSIBLE_SCORE_BY_CRITERIA.SHARED_TECHNOLOGIES) * 100,
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