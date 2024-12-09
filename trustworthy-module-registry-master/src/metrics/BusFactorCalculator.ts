import { MetricCalculator } from './MetricCalculator';

interface BusFactorData {
    totalMentionableUsers: number;
    totalActualContributors: number;
    averageContributions: number;
    top5Contributors: Array<{ login: string; contributions: number }>;
    contributionDistribution: {
        singleContribution: number;
        twoToFiveContributions: number;
        sixToTenContributions: number;
        moreThanTenContributions: number;
    };
}

export class BusFactorCalculator extends MetricCalculator {
    private totalContributors: number;
    private topContributorPercentage: number;
    private totalContributions: number;

    constructor(data: BusFactorData) {
        super(data);

        // Extract total actual contributors
        this.totalContributors = data.totalActualContributors;

        // Calculate total contributions
        const totalContributions = data.averageContributions * this.totalContributors;

        // Get the contributions of the top contributor
        const topContributorContributions = data.top5Contributors[0]?.contributions || 0;

        // Calculate the percentage of contributions made by the top contributor
        this.topContributorPercentage = totalContributions > 0 ? topContributorContributions / totalContributions : 0;

        // For handling cases where totalContributions is 0
        this.totalContributions = data.averageContributions * this.totalContributors;
    }

    /**
     * Calculates the bus factor metric.
     * @returns a score between 0 and 1, where a higher score indicates a lower bus factor risk.
     */
    calculate(): number {
        if (!this.validateData()) {
            return 0; // Return 0 if data validation fails
        }

        // High bus factor risk if only one contributor, or no contributions at all
        if (this.totalContributors <= 1 || this.totalContributions === 0) {
            return 0;
        }

        // Assess bus factor risk based on the percentage of contributions by the top contributor
        if (this.topContributorPercentage >= 0.8) {
            return 0.2; // High risk
        } else if (this.topContributorPercentage >= 0.5) {
            return 0.5; // Moderate risk
        } else {
            return 1; // Low risk
        }
    }

    /**
     * Validates the input data.
     */
    override validateData(): boolean {
        return (
            super.validateData() &&
            typeof this.totalContributors === 'number' &&
            this.totalContributors > 0 &&
            typeof this.totalContributions === 'number' &&
            this.totalContributions >= 0 &&
            typeof this.topContributorPercentage === 'number' &&
            this.topContributorPercentage >= 0
        );
    }    
}