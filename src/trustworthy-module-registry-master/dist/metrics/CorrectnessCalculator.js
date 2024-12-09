"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrectnessCalculator = void 0;
const MetricCalculator_1 = require("./MetricCalculator");
class CorrectnessCalculator extends MetricCalculator_1.MetricCalculator {
    constructor(data) {
        super(data);
        this.data = data;
    }
    /**
     * Calculates the correctness metric.
     * @returns a score between 0 and 1, where a higher score indicates better correctness.
     */
    calculate() {
        if (!this.validateData()) {
            return 0; // Return 0 if data validation fails
        }
        const { openBugs, openPullRequests, daysSinceLastRelease, stars, forks, watchers, contributors, } = this.data;
        // Calculate open bugs score (fewer open bugs is better)
        const openBugsScore = openBugs === 0 ? 1 : 1 / (1 + Math.log(openBugs));
        // Calculate activity score based on days since last release (more recent is better)
        const activityScore = daysSinceLastRelease > 0 ? 1 / (1 + Math.log(daysSinceLastRelease)) : 1;
        // Calculate popularity score (more stars, forks, watchers is better)
        const totalPopularity = stars + forks + watchers;
        const popularityScore = 1 - 1 / (1 + Math.log(1 + totalPopularity));
        // Combine the scores
        const correctnessScore = (openBugsScore * 0.4) + (activityScore * 0.3) + (popularityScore * 0.3);
        // Ensure the score is between 0 and 1
        return Number(Math.min(Math.max(correctnessScore, 0), 1).toFixed(2));
    }
    /**
     * Validates the input data.
     */
    validateData() {
        const { openBugs, openPullRequests, daysSinceLastRelease, stars, forks, watchers, contributors, } = this.data;
        return (super.validateData() &&
            typeof openBugs === 'number' && openBugs >= 0 &&
            typeof openPullRequests === 'number' && openPullRequests >= 0 &&
            typeof daysSinceLastRelease === 'number' && daysSinceLastRelease >= 0 &&
            typeof stars === 'number' && stars >= 0 &&
            typeof forks === 'number' && forks >= 0 &&
            typeof watchers === 'number' && watchers >= 0 &&
            typeof contributors === 'number' && contributors >= 0);
    }
}
exports.CorrectnessCalculator = CorrectnessCalculator;
