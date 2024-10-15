// RampUpCalculator.test.ts

import { RampUpCalculator } from '../../src/metrics/RampUpCalculator';
import { GitHubDataFetcher } from '../../src/Data_Fetcher/GitHubDataFetcher';

jest.mock('../../src/Data_Fetcher/GitHubDataFetcher');

describe('RampUpCalculator', () => {
    let gitHubDataFetcherMock: jest.Mocked<GitHubDataFetcher>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a mocked instance of GitHubDataFetcher
        gitHubDataFetcherMock = new GitHubDataFetcher('https://github.com/mock/repo', 'mockToken') as jest.Mocked<GitHubDataFetcher>;
    });

    test('should calculate ramp-up score with a comprehensive README', () => {
        const readmeContent = `
            # Project Title

            ## Installation

            Instructions on how to install.

            ## Usage

            Examples of how to use the project.

            ## Contributing

            Guidelines for contributing.

            ## License

            MIT License.

            ## Examples

            Some examples.

            ## Tutorial

            Step-by-step tutorial.
        `;

        const data = {
            readmeContent,
        };

        const calculator = new RampUpCalculator(data);
        const score = calculator.calculate();

        // Expected calculations:
        // Matched Sections: 6 (Installation, Usage, Contributing, License, Examples, Tutorial)
        // Total Sections: 11
        // Section Score Ratio: 6 / 11 = 0.54
        // Readability Score: Calculated based on content
        // Final Score: (Section Score * 0.6) + (Readability Score * 0.4)

        expect(score).toBeGreaterThan(0.5);
    });

    test('should calculate lower ramp-up score with a minimal README', () => {
        const readmeContent = `
            # Project Title

            This is a project.
        `;

        const data = {
            readmeContent,
        };

        const calculator = new RampUpCalculator(data);
        const score = calculator.calculate();

        // Since the README lacks key sections, expect a lower score
        expect(score).toBeLessThan(0.5);
    });

    test('should return 0 when README is missing or empty', () => {
        const data = {
            readmeContent: '',
        };

        const calculator = new RampUpCalculator(data);
        const score = calculator.calculate();

        expect(score).toBe(0);
    });

    test('should handle invalid data gracefully', () => {
        const data = {
            readmeContent: null,
        };

        const calculator = new RampUpCalculator(data as any);
        const score = calculator.calculate();

        expect(score).toBe(0);
    });

    describe('Integration with GitHubDataFetcher', () => {
        test('should correctly calculate ramp-up score using data from GitHubDataFetcher', async () => {
            gitHubDataFetcherMock.fetchDocumentation.mockResolvedValueOnce(`
                # Project Title

                ## Installation

                Steps to install.

                ## Usage

                How to use.

                ## Contributing

                Guidelines.

                ## License

                MIT License.

                ## Examples

                Some examples.

                ## Tutorial

                Step-by-step tutorial.
            `);

            const readmeContent = await gitHubDataFetcherMock.fetchDocumentation();

            const calculator = new RampUpCalculator({ readmeContent });
            const score = calculator.calculate();

            // Adjusted expectation based on actual calculation
            expect(score).toBeGreaterThan(0.5);
            expect(gitHubDataFetcherMock.fetchDocumentation).toHaveBeenCalledTimes(1);
        });

        test('should handle missing README from GitHubDataFetcher', async () => {
            gitHubDataFetcherMock.fetchDocumentation.mockResolvedValueOnce('No README file found.');

            const readmeContent = await gitHubDataFetcherMock.fetchDocumentation();

            const calculator = new RampUpCalculator({ readmeContent });
            const score = calculator.calculate();

            expect(score).toBe(0);
            expect(gitHubDataFetcherMock.fetchDocumentation).toHaveBeenCalledTimes(1);
        });
    });

    test('should cover syllables adjustment when syllables become zero', () => {
        const readmeContent = 'the';
        const data = { readmeContent };
        const calculator = new RampUpCalculator(data);

        const score = calculator.calculate();

        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
    });
});