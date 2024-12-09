// LicenseCalculator.test.ts

import { LicenseCalculator } from '../../src/metrics/LicenseCalculator';
import { GitHubDataFetcher } from '../../src/Data_Fetcher/GitHubDataFetcher';

jest.mock('../../src/Data_Fetcher/GitHubDataFetcher');

describe('LicenseCalculator Integration with GitHubDataFetcher', () => {
    let gitHubDataFetcherMock: jest.Mocked<GitHubDataFetcher>;

    beforeEach(() => {
        // Reset the mock before each test
        jest.clearAllMocks();

        // Create a mocked instance of GitHubDataFetcher
        gitHubDataFetcherMock = new GitHubDataFetcher('https://github.com/mock/repo', 'mockToken') as jest.Mocked<GitHubDataFetcher>;
    });

    test('should correctly calculate license score for a compatible license fetched from GitHubDataFetcher', async () => {
        // Arrange
        gitHubDataFetcherMock.fetchLicense.mockResolvedValueOnce({
            name: 'MIT License',
            spdxId: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        });
    
        const licenseData = await gitHubDataFetcherMock.fetchLicense();
        const calculator = new LicenseCalculator(licenseData);
    
        // Act
        const score = calculator.calculate();
    
        // Assert
        expect(score).toBe(1);
        expect(gitHubDataFetcherMock.fetchLicense).toHaveBeenCalledTimes(1);
    });
    
    test('should correctly calculate license score for a license needing consideration fetched from GitHubDataFetcher', async () => {
        // Arrange
        gitHubDataFetcherMock.fetchLicense.mockResolvedValueOnce({
            name: 'Apache License 2.0',
            spdxId: 'Apache-2.0',
            url: 'https://opensource.org/licenses/Apache-2.0'
        });
    
        const licenseData = await gitHubDataFetcherMock.fetchLicense();
        const calculator = new LicenseCalculator(licenseData);
    
        // Act
        const score = calculator.calculate();
    
        // Assert
        expect(score).toBe(0.5);
        expect(gitHubDataFetcherMock.fetchLicense).toHaveBeenCalledTimes(1);
    });

    test('should return 0 when an incompatible license is fetched from GitHubDataFetcher', async () => {
        // Arrange
        gitHubDataFetcherMock.fetchLicense.mockResolvedValueOnce({
            name: 'Proprietary License',
            spdxId: 'Proprietary',
            url: 'http://example.com/proprietary'
        });

        const licenseData = await gitHubDataFetcherMock.fetchLicense();
        const calculator = new LicenseCalculator(licenseData);

        // Act
        const score = calculator.calculate();

        // Assert
        expect(score).toBe(0);
        expect(gitHubDataFetcherMock.fetchLicense).toHaveBeenCalledTimes(1);
    });

    test('should return 0 when license information is missing from GitHubDataFetcher', async () => {
        // Arrange
        gitHubDataFetcherMock.fetchLicense.mockResolvedValueOnce(null);

        const licenseData = await gitHubDataFetcherMock.fetchLicense();
        const calculator = new LicenseCalculator(licenseData);

        // Act
        const score = calculator.calculate();

        // Assert
        expect(score).toBe(0);
        expect(gitHubDataFetcherMock.fetchLicense).toHaveBeenCalledTimes(1);
    });
});