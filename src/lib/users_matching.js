export const calculateMatchingScore = (userA, userB)  => {
    const shared_technologies_score = scoreSharedTechnologies(userA, userB);

    return {
        shared_technologies_score,
    }
}

export const scoreSharedTechnologies = (userA, userB) => {
    const MAX_POINTS = 5;
    const POINTS_CRITERIA_BY_MATCHED_TECHNOLOGIES = {
        0: 0,
        1: 1,
        2: 3,
        3: MAX_POINTS
    }

    // Create users sets from technologies names
    const userATechnologies = new Set(userA.technologies.map(t => t.name));
    const userBTechnologies = new Set(userB.technologies.map(t => t.name));
    
    const sharedTechnologies = userATechnologies.intersection(userBTechnologies);

    return POINTS_CRITERIA_BY_MATCHED_TECHNOLOGIES[sharedTechnologies.size] ?? MAX_POINTS;
}