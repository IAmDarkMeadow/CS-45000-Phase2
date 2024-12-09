// CorrectnessCalculator.test.ts

import { CorrectnessCalculator } from '../../src/metrics/CorrectnessCalculator';
import { GitHubDataFetcher } from '../../src/Data_Fetcher/GitHubDataFetcher';

jest.mock('../../src/Data_Fetcher/GitHubDataFetcher');

describe('CorrectnessCalculator', () => {
    describe('Unit Tests', () => {
        test('should return 0.96 when openBugs is 0, daysSinceLastRelease is 0, and high popularity', () => {
            const data = {
                openBugs: 0,
                openPullRequests: 10,
                daysSinceLastRelease: 0,
                stars: 1000,
                forks: 500,
                watchers: 300,
                contributors: 50,
            };

            const calculator = new CorrectnessCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(0.96);
        });

        test('should return lower score when openBugs > 0', () => {
            const data = {
                openBugs: 100,
                openPullRequests: 10,
                daysSinceLastRelease: 30,
                stars: 1000,
                forks: 500,
                watchers: 300,
                contributors: 50,
            };

            const calculator = new CorrectnessCalculator(data);
            const score = calculator.calculate();

            // Calculate expected score
            const openBugsScore = 1 / (1 + Math.log(100));
            const activityScore = 1 / (1 + Math.log(30));
            const totalPopularity = 1000 + 500 + 300;
            const popularityScore = 1 - 1 / (1 + Math.log(1 + totalPopularity));
            const expectedScore = (openBugsScore * 0.4) + (activityScore * 0.3) + (popularityScore * 0.3);

            expect(score).toBe(Number(expectedScore.toFixed(2)));
        });

        test('should handle daysSinceLastRelease === 0', () => {
            const data = {
                openBugs: 10,
                openPullRequests: 5,
                daysSinceLastRelease: 0,
                stars: 500,
                forks: 200,
                watchers: 100,
                contributors: 20,
            };

            const calculator = new CorrectnessCalculator(data);
            const score = calculator.calculate();

            const openBugsScore = 1 / (1 + Math.log(10));
            const activityScore = 1; // Since daysSinceLastRelease === 0
            const totalPopularity = 500 + 200 + 100;
            const popularityScore = 1 - 1 / (1 + Math.log(1 + totalPopularity));
            const expectedScore = (openBugsScore * 0.4) + (activityScore * 0.3) + (popularityScore * 0.3);

            expect(score).toBe(Number(expectedScore.toFixed(2)));
        });

        test('should handle totalPopularity === 0', () => {
            const data = {
                openBugs: 10,
                openPullRequests: 5,
                daysSinceLastRelease: 10,
                stars: 0,
                forks: 0,
                watchers: 0,
                contributors: 1,
            };

            const calculator = new CorrectnessCalculator(data);
            const score = calculator.calculate();

            const openBugsScore = 1 / (1 + Math.log(10));
            const activityScore = 1 / (1 + Math.log(10));
            const totalPopularity = 0;
            const popularityScore = 0; // Since totalPopularity === 0
            const expectedScore = (openBugsScore * 0.4) + (activityScore * 0.3) + (popularityScore * 0.3);

            expect(score).toBe(Number(expectedScore.toFixed(2)));
        });

        test('should return 0 when data is invalid', () => {
            const data = {
                openBugs: -1, // Invalid
                openPullRequests: 5,
                daysSinceLastRelease: 10,
                stars: 100,
                forks: 50,
                watchers: 20,
                contributors: 5,
            };

            const calculator = new CorrectnessCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(0);
        });

        test('should handle extremely high values', () => {
            const data = {
                openBugs: 1000000,
                openPullRequests: 500000,
                daysSinceLastRelease: 10000,
                stars: 10000000,
                forks: 5000000,
                watchers: 2000000,
                contributors: 100000,
            };

            const calculator = new CorrectnessCalculator(data);
            const score = calculator.calculate();

            const openBugsScore = 1 / (1 + Math.log(1000000));
            const activityScore = 1 / (1 + Math.log(10000));
            const totalPopularity = 10000000 + 5000000 + 2000000;
            const popularityScore = 1 - 1 / (1 + Math.log(1 + totalPopularity));
            const expectedScore = (openBugsScore * 0.4) + (activityScore * 0.3) + (popularityScore * 0.3);

            expect(score).toBe(Number(expectedScore.toFixed(2)));
        });

        test('should handle zero values for all parameters', () => {
            const data = {
                openBugs: 0,
                openPullRequests: 0,
                daysSinceLastRelease: 0,
                stars: 0,
                forks: 0,
                watchers: 0,
                contributors: 0,
            };

            const calculator = new CorrectnessCalculator(data);
            const score = calculator.calculate();

            const openBugsScore = 1; // Since openBugs === 0
            const activityScore = 1; // Since daysSinceLastRelease === 0
            const totalPopularity = 0;
            const popularityScore = 0; // Since totalPopularity === 0
            const expectedScore = (openBugsScore * 0.4) + (activityScore * 0.3) + (popularityScore * 0.3);

            expect(score).toBe(Number(expectedScore.toFixed(2)));
        });
    });

    describe('Integration Tests with GitHubDataFetcher', () => {
        let gitHubDataFetcherMock: jest.Mocked<GitHubDataFetcher>;

        beforeEach(() => {
            jest.clearAllMocks();
            gitHubDataFetcherMock = new GitHubDataFetcher('https://github.com/mock/repo', 'mockToken') as jest.Mocked<GitHubDataFetcher>;
        });

        test('should handle zero open bugs and daysSinceLastRelease from GitHubDataFetcher', async () => {
            gitHubDataFetcherMock.fetchTestingResults.mockResolvedValueOnce({
                openBugs: 0,
                openPullRequests: 10,
                daysSinceLastRelease: 0,
                stars: 1000,
                forks: 500,
                watchers: 300,
                contributors: 50,
            });

            const testingResults = await gitHubDataFetcherMock.fetchTestingResults();

            const calculator = new CorrectnessCalculator(testingResults);
            const score = calculator.calculate();

            expect(score).toBe(0.96);
            expect(gitHubDataFetcherMock.fetchTestingResults).toHaveBeenCalledTimes(1);
        });

        test('should handle zero open bugs and daysSinceLastRelease from GitHubDataFetcher', async () => {
            gitHubDataFetcherMock.fetchTestingResults.mockResolvedValueOnce({
                openBugs: 0,
                openPullRequests: 10,
                daysSinceLastRelease: 0,
                stars: 1000,
                forks: 500,
                watchers: 300,
                contributors: 50,
            });

            const testingResults = await gitHubDataFetcherMock.fetchTestingResults();

            const calculator = new CorrectnessCalculator(testingResults);
            const score = calculator.calculate();

            expect(score).toBe(.96);
            expect(gitHubDataFetcherMock.fetchTestingResults).toHaveBeenCalledTimes(1);
        });

        test('should return 0 when GitHubDataFetcher returns invalid data', async () => {
            gitHubDataFetcherMock.fetchTestingResults.mockResolvedValueOnce({
                openBugs: -10, // Invalid
                openPullRequests: 5,
                daysSinceLastRelease: -15, // Invalid
                stars: -500, // Invalid
                forks: -200, // Invalid
                watchers: -100, // Invalid
                contributors: -20, // Invalid
            });

            const testingResults = await gitHubDataFetcherMock.fetchTestingResults();

            const calculator = new CorrectnessCalculator(testingResults);
            const score = calculator.calculate();

            expect(score).toBe(0);
            expect(gitHubDataFetcherMock.fetchTestingResults).toHaveBeenCalledTimes(1);
        });
    });
});