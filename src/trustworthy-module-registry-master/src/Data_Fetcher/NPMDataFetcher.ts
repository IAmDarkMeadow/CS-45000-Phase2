// src/Data_Fetcher/NPMDataFetcher.ts

import { DataFetcherStrategy } from '../URLHandler/DataFetcherStrategy';
import { GitHubDataFetcher } from './GitHubDataFetcher';
import { NPMResponse } from './Types/NPMResponse';

export class NPMDataFetcher implements DataFetcherStrategy {
    URL: string;
    packageName: string;
    apiEndpoint: string;
    private readonly token: string;

    constructor(URL: string, token: string) {
        this.URL = URL;
        this.token = token;
        this.packageName = this.extractPackageName(URL);
        this.apiEndpoint = `https://registry.npmjs.org/${this.packageName}/latest`;
    }

    private extractPackageName(url: string): string {
        const match = url.match(/\/package\/(.*)/);
        if (match && match[1]) {
            return match[1];
        } else {
            throw new Error('Invalid npm package URL.');
        }
    }

    private async fetchNpmData(): Promise<NPMResponse> {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json() as NPMResponse;
        } catch (error) {
            console.error('Error fetching data from npm:', error);
            throw new Error('Failed to fetch data from npm registry');
        }
    }
    
    private async getGitHubUrl(): Promise<string> {
        const npmData = await this.fetchNpmData();
        const repositoryUrl = npmData.repository?.url;
        if (repositoryUrl && repositoryUrl.includes('github.com')) {
            // Extract GitHub URL
            const githubUrl = repositoryUrl.replace(/^git\+/, '').replace(/\.git$/, '');
            return githubUrl;
        } else {
            throw new Error('GitHub repository URL not found in npm package data.');
        }
    }

    async fetchCommits(): Promise<any> {
        try {
            const githubUrl = await this.getGitHubUrl();
            const githubFetcher = new GitHubDataFetcher(githubUrl, this.token);
            return await githubFetcher.fetchCommits();
        } 
        catch (error) {
            throw new Error(`${this.packageName} does not have a linked github repository.`);
        }
    }

    async fetchContributors(): Promise<any> {
        const githubUrl = await this.getGitHubUrl();
        const githubFetcher = new GitHubDataFetcher(githubUrl, this.token);
        return await githubFetcher.fetchContributors();
    }

    async fetchTestingResults(): Promise<any> {
        try {
            const githubUrl = await this.getGitHubUrl();
            const githubFetcher = new GitHubDataFetcher(githubUrl, this.token);
            return await githubFetcher.fetchTestingResults();
        }
        catch (error) {
            throw new Error(`${this.packageName} does not have a linked github repository.`);
        }
    }

    async fetchDocumentation(): Promise<any> {
        try {
            const githubUrl = await this.getGitHubUrl();
            const githubFetcher = new GitHubDataFetcher(githubUrl, this.token);
            return await githubFetcher.fetchDocumentation();
        }
        catch (error) {
            throw new Error(`${this.packageName} does not have a linked github repository.`);
        }
    }

    async fetchMaintainerMetrics(): Promise<any> {
        try {
            const githubUrl = await this.getGitHubUrl();
            const githubFetcher = new GitHubDataFetcher(githubUrl, this.token);
            return await githubFetcher.fetchMaintainerMetrics();
        }
        catch (error) {
            throw new Error(`${this.packageName} does not have a linked github repository.`);
        }
    }

    async fetchLicense(): Promise<any> {
        try {
            const npmData = await this.fetchNpmData();
            if (npmData.license) {
                // Format the license data to match GitHubDataFetcher's format
                return {
                    name: npmData.license,
                    spdxId: npmData.license,
                    url: `https://spdx.org/licenses/${npmData.license}.html`
                };
            } else {
                // Fallback to GitHub
                const githubUrl = await this.getGitHubUrl();
                const githubFetcher = new GitHubDataFetcher(githubUrl, this.token);
                return await githubFetcher.fetchLicense();
            }
        }
        catch (error) {
            throw new Error(`Unable to get license for ${this.packageName}.`);
        }
    }

    async fetchAllData(): Promise<any> {
        try {
            const [commits, contributors, testingResults, documentation, maintainerMetrics, license] = await Promise.all([
                this.fetchCommits(),
                this.fetchContributors(),
                this.fetchTestingResults(),
                this.fetchDocumentation(),
                this.fetchMaintainerMetrics(),
                this.fetchLicense()
            ]);

            return {
                commits,
                contributors,
                testingResults,
                documentation,
                maintainerMetrics,
                license
            };
        } catch (error) {
            throw new Error('Failed to fetch all data for npm package');
        }
    }
}
