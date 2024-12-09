// BusFactorCalculator.test.ts

import { BusFactorCalculator } from '../../src/metrics/BusFactorCalculator';
import { GitHubDataFetcher } from '../../src/Data_Fetcher/GitHubDataFetcher';

jest.mock('../../src/Data_Fetcher/GitHubDataFetcher');

describe('BusFactorCalculator', () => {
    describe('Unit Tests', () => {
        test('should return 0 when there is only one contributor', () => {
            const data = {
                totalMentionableUsers: 1,
                totalActualContributors: 1,
                averageContributions: 100,
                top5Contributors: [
                    { login: 'user1', contributions: 100 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 1,
                },
            };

            const calculator = new BusFactorCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(0);
        });

        test('should return 0.2 when top contributor has ≥80% of contributions', () => {
            const data = {
                totalMentionableUsers: 5,
                totalActualContributors: 5,
                averageContributions: 20,
                top5Contributors: [
                    { login: 'user1', contributions: 85 },
                    { login: 'user2', contributions: 5 },
                    { login: 'user3', contributions: 5 },
                    { login: 'user4', contributions: 3 },
                    { login: 'user5', contributions: 2 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 4,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 1,
                },
            };

            const calculator = new BusFactorCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(0.2);
        });

        test('should return 0.5 when top contributor has ≥50% but <80% of contributions', () => {
            const data = {
                totalMentionableUsers: 4,
                totalActualContributors: 4,
                averageContributions: 25,
                top5Contributors: [
                    { login: 'user1', contributions: 60 },
                    { login: 'user2', contributions: 20 },
                    { login: 'user3', contributions: 10 },
                    { login: 'user4', contributions: 10 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 2,
                    sixToTenContributions: 2,
                    moreThanTenContributions: 0,
                },
            };

            const calculator = new BusFactorCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(0.5);
        });

        test('should return 1 when top contributor has <50% of contributions', () => {
            const data = {
                totalMentionableUsers: 3,
                totalActualContributors: 3,
                averageContributions: 40,
                top5Contributors: [
                    { login: 'user1', contributions: 40 },
                    { login: 'user2', contributions: 40 },
                    { login: 'user3', contributions: 40 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 3,
                },
            };

            const calculator = new BusFactorCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(1);
        });

        test('should return 0 for invalid data', () => {
            const data = {
                totalMentionableUsers: 0,
                totalActualContributors: 0,
                averageContributions: 0,
                top5Contributors: [],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 0,
                },
            };

            const calculator = new BusFactorCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(0);
        });

        test('should handle missing top5Contributors data gracefully', () => {
            const data = {
                totalMentionableUsers: 5,
                totalActualContributors: 5,
                averageContributions: 20,
                top5Contributors: [], // No contributors provided
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 5,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 0,
                },
            };

            const calculator = new BusFactorCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(1); // With topContributorContributions as 0, percentage is 0
        });

        test('should return 0 when totalContributions is zero', () => {
            const data = {
                totalMentionableUsers: 5,
                totalActualContributors: 5,
                averageContributions: 0, // This makes totalContributions zero
                top5Contributors: [
                    { login: 'user1', contributions: 0 },
                    { login: 'user2', contributions: 0 },
                ],
                contributionDistribution: {
                    singleContribution: 5,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 0,
                },
            };

            const calculator = new BusFactorCalculator(data);
            const score = calculator.calculate();

            expect(score).toBe(0);
        });
    });

    describe('Integration Tests with GitHubDataFetcher', () => {
        let gitHubDataFetcherMock: jest.Mocked<GitHubDataFetcher>;

        beforeEach(() => {
            jest.clearAllMocks();
            gitHubDataFetcherMock = new GitHubDataFetcher('https://github.com/mock/repo', 'mockToken') as jest.Mocked<GitHubDataFetcher>;
        });

        test('should correctly calculate bus factor score using data from GitHubDataFetcher (High Risk)', async () => {
            // Mock the data returned by fetchContributors
            gitHubDataFetcherMock.fetchContributors.mockResolvedValueOnce({
                totalMentionableUsers: 5,
                totalActualContributors: 5,
                averageContributions: 20,
                top5Contributors: [
                    { login: 'user1', contributions: 85 },
                    { login: 'user2', contributions: 5 },
                    { login: 'user3', contributions: 5 },
                    { login: 'user4', contributions: 3 },
                    { login: 'user5', contributions: 2 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 4,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 1,
                },
            });

            const contributorsData = await gitHubDataFetcherMock.fetchContributors();

            const calculator = new BusFactorCalculator(contributorsData);
            const score = calculator.calculate();

            // Since the top contributor has ≥80% of contributions, score should be 0.2
            expect(score).toBe(0.2);
            expect(gitHubDataFetcherMock.fetchContributors).toHaveBeenCalledTimes(1);
        });

        test('should correctly calculate bus factor score using data from GitHubDataFetcher (Moderate Risk)', async () => {
            gitHubDataFetcherMock.fetchContributors.mockResolvedValueOnce({
                totalMentionableUsers: 4,
                totalActualContributors: 4,
                averageContributions: 25,
                top5Contributors: [
                    { login: 'user1', contributions: 60 },
                    { login: 'user2', contributions: 20 },
                    { login: 'user3', contributions: 10 },
                    { login: 'user4', contributions: 10 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 2,
                    sixToTenContributions: 2,
                    moreThanTenContributions: 0,
                },
            });

            const contributorsData = await gitHubDataFetcherMock.fetchContributors();

            const calculator = new BusFactorCalculator(contributorsData);
            const score = calculator.calculate();

            // Since the top contributor has ≥50% but <80% of contributions, score should be 0.5
            expect(score).toBe(0.5);
            expect(gitHubDataFetcherMock.fetchContributors).toHaveBeenCalledTimes(1);
        });

        test('should correctly calculate bus factor score using data from GitHubDataFetcher (Low Risk)', async () => {
            gitHubDataFetcherMock.fetchContributors.mockResolvedValueOnce({
                totalMentionableUsers: 3,
                totalActualContributors: 3,
                averageContributions: 40,
                top5Contributors: [
                    { login: 'user1', contributions: 40 },
                    { login: 'user2', contributions: 40 },
                    { login: 'user3', contributions: 40 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 3,
                },
            });

            const contributorsData = await gitHubDataFetcherMock.fetchContributors();

            const calculator = new BusFactorCalculator(contributorsData);
            const score = calculator.calculate();

            // Since the top contributor has <50% of contributions, score should be 1
            expect(score).toBe(1);
            expect(gitHubDataFetcherMock.fetchContributors).toHaveBeenCalledTimes(1);
        });

        test('should return 0 when GitHubDataFetcher returns only one contributor', async () => {
            gitHubDataFetcherMock.fetchContributors.mockResolvedValueOnce({
                totalMentionableUsers: 1,
                totalActualContributors: 1,
                averageContributions: 100,
                top5Contributors: [{ login: 'user1', contributions: 100 }],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 1,
                },
            });

            const contributorsData = await gitHubDataFetcherMock.fetchContributors();

            const calculator = new BusFactorCalculator(contributorsData);
            const score = calculator.calculate();

            expect(score).toBe(0);
            expect(gitHubDataFetcherMock.fetchContributors).toHaveBeenCalledTimes(1);
        });

        test('should handle cases where GitHubDataFetcher returns invalid data', async () => {
            gitHubDataFetcherMock.fetchContributors.mockResolvedValueOnce({
                totalMentionableUsers: 0,
                totalActualContributors: 0,
                averageContributions: 0,
                top5Contributors: [],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 0,
                },
            });

            const contributorsData = await gitHubDataFetcherMock.fetchContributors();

            const calculator = new BusFactorCalculator(contributorsData);
            const score = calculator.calculate();

            expect(score).toBe(0);
            expect(gitHubDataFetcherMock.fetchContributors).toHaveBeenCalledTimes(1);
        });
    });
});