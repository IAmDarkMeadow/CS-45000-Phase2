// ResponsiveMaintainerCalculator.test.ts

import { ResponsiveMaintainerCalculator } from '../../src/metrics/ResponsiveMaintainerCalculator';
import { GitHubDataFetcher } from '../../src/Data_Fetcher/GitHubDataFetcher';

jest.mock('../../src/Data_Fetcher/GitHubDataFetcher');

describe('ResponsiveMaintainerCalculator', () => {
    let gitHubDataFetcherMock: jest.Mocked<GitHubDataFetcher>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a mocked instance of GitHubDataFetcher
        gitHubDataFetcherMock = new GitHubDataFetcher('https://github.com/mock/repo', 'mockToken') as jest.Mocked<GitHubDataFetcher>;
    });

    test('should calculate responsiveness score with ideal data', () => {
        const data = {
            openIssues: 10,
            closedIssues: 90,
            commitsLastMonth: 20,
            totalCommits: 240, // Average 20 commits per month
            avgCommitsPerMonth: 20,
            releasesLastYear: 12,
            totalReleases: 12,
        };

        const calculator = new ResponsiveMaintainerCalculator(data);
        const score = calculator.calculate();

        // Expected calculations:
        // Issue Closure Rate = 90 / (90 + 10) = 0.9
        // Commit Activity Ratio = 20 / 20 = 1
        // Release Frequency = 12 / 12 = 1
        // Responsiveness Score = (0.9 * 0.4) + (1 * 0.4) + (1 * 0.2) = 0.36 + 0.4 + 0.2 = 0.96

        expect(score).toBeCloseTo(0.96);
    });

    test('should calculate responsiveness score with moderate data', () => {
        const data = {
            openIssues: 50,
            closedIssues: 50,
            commitsLastMonth: 14,
            totalCommits: 240, // Average 20 commits per month
            avgCommitsPerMonth: 20,
            releasesLastYear: 6,
            totalReleases: 12,
        };

        const calculator = new ResponsiveMaintainerCalculator(data);
        const score = calculator.calculate();

        // Expected calculations:
        // Issue Closure Rate = 50 / (50 + 50) = 0.5
        // Commit Activity Ratio = 14 / 20 = 0.7
        // Release Frequency = 6 / 12 = 0.5
        // Responsiveness Score = (0.5 * 0.4) + (0.7 * 0.4) + (0.5 * 0.2) = 0.2 + 0.28 + 0.1 = 0.58

        expect(score).toBeCloseTo(0.58);
    });

    test('should return 0 when data is missing or zero activity', () => {
        const data = {
            openIssues: 100,
            closedIssues: 0,
            commitsLastMonth: 0,
            totalCommits: 0,
            avgCommitsPerMonth: 0,
            releasesLastYear: 0,
            totalReleases: 0,
        };

        const calculator = new ResponsiveMaintainerCalculator(data);
        const score = calculator.calculate();

        // Expected calculations:
        // Issue Closure Rate = 0 / (0 + 100) = 0
        // Commit Activity Ratio = 0 / 0 = 0 (handled gracefully)
        // Release Frequency = 0 / 12 = 0
        // Responsiveness Score = (0 * 0.4) + (0 * 0.4) + (0 * 0.2) = 0

        expect(score).toBeCloseTo(0);
    });

    test('should handle invalid data gracefully', () => {
        const data = {
            openIssues: NaN,
            closedIssues: NaN,
            commitsLastMonth: NaN,
            totalCommits: NaN,
            avgCommitsPerMonth: NaN,
            releasesLastYear: NaN,
            totalReleases: NaN,
        };

        const calculator = new ResponsiveMaintainerCalculator(data as any);
        const score = calculator.calculate();

        expect(score).toBe(0);
    });

    describe('Integration with GitHubDataFetcher', () => {
        test('should correctly calculate responsiveness score using data from GitHubDataFetcher', async () => {
            gitHubDataFetcherMock.fetchMaintainerMetrics.mockResolvedValueOnce({
                commitsLastMonth: 20,
                avgCommitsPerMonth: 20,
                totalCommits: 240,
                openIssues: 10,
                closedIssues: 90,
                totalReleases: 12,
                releasesLastYear: 12,
            });

            const maintainerMetricsData = await gitHubDataFetcherMock.fetchMaintainerMetrics();

            const calculator = new ResponsiveMaintainerCalculator(maintainerMetricsData);
            const score = calculator.calculate();

            // Expected calculations are the same as the first unit test
            expect(score).toBeCloseTo(0.96);
            expect(gitHubDataFetcherMock.fetchMaintainerMetrics).toHaveBeenCalledTimes(1);
        });

        test('should handle missing data from GitHubDataFetcher', async () => {
            gitHubDataFetcherMock.fetchMaintainerMetrics.mockResolvedValueOnce({
                commitsLastMonth: NaN,
                avgCommitsPerMonth: NaN,
                totalCommits: NaN,
                openIssues: NaN,
                closedIssues: NaN,
                totalReleases: NaN,
                releasesLastYear: NaN,
            });

            const maintainerMetricsData = await gitHubDataFetcherMock.fetchMaintainerMetrics();

            const calculator = new ResponsiveMaintainerCalculator(maintainerMetricsData as any);
            const score = calculator.calculate();

            expect(score).toBe(0);
            expect(gitHubDataFetcherMock.fetchMaintainerMetrics).toHaveBeenCalledTimes(1);
        });
    });
});