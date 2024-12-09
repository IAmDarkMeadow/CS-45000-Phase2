import { CalculatorFactory, CalculatorTypes } from '../../src/metrics/CalculatorFactory';
import { LicenseCalculator } from '../../src/metrics/LicenseCalculator';
import { BusFactorCalculator } from '../../src/metrics/BusFactorCalculator';
import { CorrectnessCalculator } from '../../src/metrics/CorrectnessCalculator';
import { RampUpCalculator } from '../../src/metrics/RampUpCalculator';
import { ResponsiveMaintainerCalculator } from '../../src/metrics/ResponsiveMaintainerCalculator';
import { MetricCalculator } from '../../src/metrics/MetricCalculator';

describe('CalculatorFactory', () => {
    describe('createCalculator', () => {
        it('should return an instance of LicenseCalculator when License type is requested', () => {
            const data = {
                spdxId: 'LGPL-2.1',
            };
            const calculator = CalculatorFactory.createCalculator(CalculatorTypes.License, data);

            expect(calculator).toBeInstanceOf(LicenseCalculator);
            expect(calculator).toBeInstanceOf(MetricCalculator);
        });

        it('should return an instance of BusFactorCalculator when BusFactor type is requested', () => {
            const data = {
                totalMentionableUsers: 5,
                totalActualContributors: 5,
                averageContributions: 20,
                top5Contributors: [
                    { login: 'user1', contributions: 30 },
                    { login: 'user2', contributions: 25 },
                    { login: 'user3', contributions: 20 },
                    { login: 'user4', contributions: 15 },
                    { login: 'user5', contributions: 10 },
                ],
                contributionDistribution: {
                    singleContribution: 0,
                    twoToFiveContributions: 0,
                    sixToTenContributions: 0,
                    moreThanTenContributions: 5,
                },
            };

            const calculator = CalculatorFactory.createCalculator(CalculatorTypes.BusFactor, data);

            expect(calculator).toBeInstanceOf(BusFactorCalculator);
            expect(calculator).toBeInstanceOf(MetricCalculator);
        });

        it('should return an instance of CorrectnessCalculator when Correctness type is requested', () => {
            const data = {
                openBugs: 2,
                openPullRequests: 5,
                daysSinceLastRelease: 30,
                stars: 100,
                forks: 50,
                watchers: 25,
                contributors: 10,
            };

            const calculator = CalculatorFactory.createCalculator(CalculatorTypes.Correctness, data);

            expect(calculator).toBeInstanceOf(CorrectnessCalculator);
            expect(calculator).toBeInstanceOf(MetricCalculator);
        });

        it('should return an instance of RampUpCalculator when RampUp type is requested', () => {
            const data = {
                readmeContent: `
                    # Project Title

                    ## Installation

                    Instructions on how to install.

                    ## Usage

                    Examples of how to use the project.

                    ## Contributing

                    Guidelines for contributing.

                    ## License

                    MIT License.
                `,
            };
            const calculator = CalculatorFactory.createCalculator(CalculatorTypes.RampUp, data);

            expect(calculator).toBeInstanceOf(RampUpCalculator);
            expect(calculator).toBeInstanceOf(MetricCalculator);
        });

        it('should return an instance of ResponsiveMaintainerCalculator when ResponsiveMaintainer type is requested', () => {
            const data = {
                commitsLastMonth: 20,
                avgCommitsPerMonth: 20,
                totalCommits: 240,
                openIssues: 10,
                closedIssues: 90,
                totalReleases: 12,
                releasesLastYear: 12,
            };
            const calculator = CalculatorFactory.createCalculator(CalculatorTypes.ResponsiveMaintainer, data);

            expect(calculator).toBeInstanceOf(ResponsiveMaintainerCalculator);
            expect(calculator).toBeInstanceOf(MetricCalculator);
        });

        it('should return undefined for an unsupported calculator type', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const calculator = CalculatorFactory.createCalculator("OtherType" as CalculatorTypes, {});

            expect(calculator).toBeUndefined();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown Calculator Type');

            consoleErrorSpy.mockRestore();
        });
    });
});