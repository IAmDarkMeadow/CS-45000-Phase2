import { DataFetcher } from './DataFetcher';

import { DataFetcherStrategy } from '../URLHandler/DataFetcherStrategy';
import { 
    CommitHistoryNode, 
    CommitsResponse, 
    ContributorsResponse, 
    TestingResultsResponse, 
    DocumentationResponse,
    MaintainerMetricsResponse,
    LicenseResponse
} from './Types/GithubTypes';

export class GitHubDataFetcher implements DataFetcherStrategy {
    URL: string;
    private readonly apiEndpoint = 'https://api.github.com/graphql';
    private readonly token: string;

    constructor(URL: string, token: string) {
        this.URL = URL;
        this.token = token;
    }

    private async fetchData<T>(query: string, variables?: any): Promise<T> {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ query, variables })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json() as T;
        } catch (error) {
            console.error('Error fetching data from GitHub:', error);
            throw new Error('Failed to fetch data from GitHub API');
        }
    }

    async fetchCommits(): Promise<any> {
        const query = `
            query($repoOwner: String!, $repoName: String!) {
                repository(owner: $repoOwner, name: $repoName) {
                    defaultBranchRef {
                        target {
                            ... on Commit {
                                history(first: 100) {
                                    totalCount
                                    edges {
                                        node {
                                            message
                                            committedDate
                                            additions
                                            deletions
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const { repoOwner, repoName } = this.extractRepoDetails();
        const data = await this.fetchData<CommitsResponse>(query, { repoOwner, repoName });

        const commits = data.data.repository.defaultBranchRef.target.history.edges;
        const totalCommits = data.data.repository.defaultBranchRef.target.history.totalCount;

        const commitActivity = commits.map(commit => ({
            message: commit.node.message,
            date: commit.node.committedDate,
            changes: commit.node.additions + commit.node.deletions
        }));

        const averageChangesPerCommit = commitActivity.reduce((sum, commit) => sum + commit.changes, 0) / commitActivity.length;

        return {
            totalCommits,
            recentCommits: commitActivity,
            averageChangesPerCommit: Number(averageChangesPerCommit.toFixed(2))
        };
    }

    async fetchContributors(): Promise<any> {
        const query = `
            query($repoOwner: String!, $repoName: String!) {
                repository(owner: $repoOwner, name: $repoName) {
                    mentionableUsers(first: 100) {
                        totalCount
                        nodes {
                            login
                        }
                    }
                    defaultBranchRef {
                        target {
                            ... on Commit {
                                history(first: 100) {
                                    nodes {
                                        author {
                                            user {
                                                login
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const { repoOwner, repoName } = this.extractRepoDetails();
        const data = await this.fetchData<ContributorsResponse>(query, { repoOwner, repoName });

        const commits = data.data.repository.defaultBranchRef.target.history.nodes;

        const actualContributors = new Set<string>();
        const contributionCount: { [key: string]: number } = {};

        commits.forEach(commit => {
            const login = commit.author.user?.login;
            if (login) {
                actualContributors.add(login);
                contributionCount[login] = (contributionCount[login] || 0) + 1;
            }
        });

        const sortedContributors = Array.from(actualContributors).sort((a, b) => contributionCount[b] - contributionCount[a]);

        return {
            totalMentionableUsers: data.data.repository.mentionableUsers.totalCount,
            totalActualContributors: actualContributors.size,
            averageContributions: Number((commits.length / actualContributors.size).toFixed(2)),
            top5Contributors: sortedContributors.slice(0, 5).map(login => ({
                login,
                contributions: contributionCount[login]
            })),
            contributionCount, // ensuring contribution counts
            contributionDistribution: {
                singleContribution: sortedContributors.filter(login => contributionCount[login] === 1).length,
                twoToFiveContributions: sortedContributors.filter(login => contributionCount[login] >= 2 && contributionCount[login] <= 5).length,
                sixToTenContributions: sortedContributors.filter(login => contributionCount[login] >= 6 && contributionCount[login] <= 10).length,
                moreThanTenContributions: sortedContributors.filter(login => contributionCount[login] > 10).length
            }
        };
    }

    async fetchTestingResults(): Promise<any> {
        const query = `
            query($repoOwner: String!, $repoName: String!) {
                repository(owner: $repoOwner, name: $repoName) {
                    issues(states: OPEN, labels: ["bug"]) {
                        totalCount
                    }
                    pullRequests(states: OPEN) {
                        totalCount
                    }
                    releases(last: 1) {
                        nodes {
                            publishedAt
                        }
                    }
                    stargazerCount
                    forkCount
                    watchers {
                        totalCount
                    }
                    mentionableUsers {
                        totalCount
                    }
                }
            }
        `;

        const { repoOwner, repoName } = this.extractRepoDetails();
        const data = await this.fetchData<TestingResultsResponse>(query, { repoOwner, repoName });

        const repo = data.data.repository;
        const currentDate = new Date();
        const lastReleaseDate = repo.releases.nodes[0] ? new Date(repo.releases.nodes[0].publishedAt) : null;
        const daysSinceLastRelease = lastReleaseDate ? Math.floor((currentDate.getTime() - lastReleaseDate.getTime()) / (1000 * 3600 * 24)) : null;

        return {
            openBugs: repo.issues.totalCount,
            openPullRequests: repo.pullRequests.totalCount,
            daysSinceLastRelease,
            stars: repo.stargazerCount,
            forks: repo.forkCount,
            watchers: repo.watchers.totalCount,
            contributors: repo.mentionableUsers.totalCount
        };
    }

    async fetchDocumentation(): Promise<any> {
        const query = `
            query($repoOwner: String!, $repoName: String!) {
                repository(owner: $repoOwner, name: $repoName) {
                    object(expression: "HEAD:README.md") {
                        ... on Blob {
                            text
                        }
                    }
                    object2: object(expression: "HEAD:README.txt") {
                        ... on Blob {
                            text
                        }
                    }
                    object3: object(expression: "HEAD:readme.md") {
                        ... on Blob {
                            text
                        }
                    }
                    object4: object(expression: "HEAD:readme.txt") {
                        ... on Blob {
                            text
                        }
                    }
                }
            }
        `;

        const { repoOwner, repoName } = this.extractRepoDetails();
        const data = await this.fetchData<DocumentationResponse>(query, { repoOwner, repoName });

        return data.data.repository.object?.text ||
            data.data.repository.object2?.text ||
            data.data.repository.object3?.text ||
            data.data.repository.object4?.text ||
            "No README file found.";
    }

    async fetchMaintainerMetrics(): Promise<any> {
        const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
        const query = `
            query($repoOwner: String!, $repoName: String!) {
                repository(owner: $repoOwner, name: $repoName) {
                    defaultBranchRef {
                        target {
                            ... on Commit {
                                history(since: "${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}") {
                                    totalCount
                                }
                            }
                        }
                    }
                    object(expression: "HEAD") {
                        ... on Commit {
                            history {
                                totalCount
                            }
                        }
                    }
                    issues(states: OPEN) {
                        totalCount
                    }
                    closedIssues: issues(states: CLOSED) {
                        totalCount
                    }
                    releases {
                        totalCount
                    }
                    recentReleases: releases(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
                        totalCount
                        nodes {
                            createdAt
                        }
                    }
                }
            }
        `;

        const { repoOwner, repoName } = this.extractRepoDetails();
        const data = await this.fetchData<MaintainerMetricsResponse>(query, { repoOwner, repoName });

        const repo = data.data.repository;
        const commitsLastMonth = repo.defaultBranchRef.target.history.totalCount;
        const totalCommits = repo.object.history.totalCount;
        const openIssues = repo.issues.totalCount;
        const closedIssues = repo.closedIssues.totalCount;
        const totalReleases = repo.releases.totalCount;
        const releasesLastYear = repo.recentReleases.nodes.filter((release: any) =>
            new Date(release.createdAt) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        ).length;

        const avgCommitsPerMonth = Number((totalCommits / (totalCommits / commitsLastMonth)).toFixed(2));

        return {
            commitsLastMonth,
            avgCommitsPerMonth,
            totalCommits,
            openIssues,
            closedIssues,
            totalReleases,
            releasesLastYear
        };
    }

    async fetchLicense(): Promise<any> {
        const query = `
            query($repoOwner: String!, $repoName: String!) {
                repository(owner: $repoOwner, name: $repoName) {
                    licenseInfo {
                        name
                        spdxId
                        url
                    }
                }
            }
        `;

        const { repoOwner, repoName } = this.extractRepoDetails();
        const data = await this.fetchData<LicenseResponse>(query, { repoOwner, repoName });

        return data.data.repository.licenseInfo;
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
            console.error('Error fetching all data:', error);
            throw new Error('Failed to fetch all data from GitHub API');
        }
    }

    private extractRepoDetails() {
        const [repoOwner, repoName] = this.URL.split('/').slice(-2);
        return { repoOwner, repoName };
    }
    
}
