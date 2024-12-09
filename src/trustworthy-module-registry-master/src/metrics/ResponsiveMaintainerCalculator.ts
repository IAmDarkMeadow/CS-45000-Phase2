import { MetricCalculator } from './MetricCalculator';

interface ResponsiveMaintainerData {
    commitsLastMonth: number;
    avgCommitsPerMonth: number;
    totalCommits: number;
    openIssues: number;
    closedIssues: number;
    totalReleases: number;
    releasesLastYear: number;
}

export class ResponsiveMaintainerCalculator extends MetricCalculator {
    protected data: ResponsiveMaintainerData;

    constructor(data: ResponsiveMaintainerData) {
        super(data);
        this.data = data;
    }

    /**
     * Calculates the Responsive Maintainer metric.
     * @returns a score between 0 and 1.
     */
    calculate(): number {
        if (!this.validateData()) {
            return 0; // Return 0 if data validation fails
        }

        const {
            commitsLastMonth,
            avgCommitsPerMonth,
            openIssues,
            closedIssues,
            releasesLastYear,
        } = this.data;

        // Normalize commits activity score
        const commitActivityScore = avgCommitsPerMonth > 0 ? commitsLastMonth / avgCommitsPerMonth : 0;
        const normalizedCommitActivityScore = Math.min(commitActivityScore, 1);

        // Issue resolution rate
        const totalIssues = openIssues + closedIssues;
        const issueResolutionRate = totalIssues > 0 ? closedIssues / totalIssues : 1;

        // Release frequency score
        const releaseFrequencyScore = releasesLastYear >= 12 ? 1 : releasesLastYear / 12;

        // Combine the metrics
        const responsiveMaintainerScore = (
            (normalizedCommitActivityScore * 0.4) +
            (issueResolutionRate * 0.4) +
            (releaseFrequencyScore * 0.2)
        );

        // Ensure the score is between 0 and 1
        return Number(Math.min(Math.max(responsiveMaintainerScore, 0), 1).toFixed(2));
    }

    /**
     * Validates the input data.
     */
    override validateData(): boolean {
        const {
            commitsLastMonth,
            avgCommitsPerMonth,
            openIssues,
            closedIssues,
            totalCommits,
            totalReleases,
            releasesLastYear,
        } = this.data;

        return (
            super.validateData() &&
            typeof commitsLastMonth === 'number' && commitsLastMonth >= 0 &&
            typeof avgCommitsPerMonth === 'number' && avgCommitsPerMonth >= 0 &&
            typeof openIssues === 'number' && openIssues >= 0 &&
            typeof closedIssues === 'number' && closedIssues >= 0 &&
            typeof totalCommits === 'number' && totalCommits >= 0 &&
            typeof totalReleases === 'number' && totalReleases >= 0 &&
            typeof releasesLastYear === 'number' && releasesLastYear >= 0
        );
    }
}
