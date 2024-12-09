export interface DataFetcher {
    URL: string;
    fetchCommits(): Promise<any>; // Updated return type to match the GitHubDataFetcher implementation
    fetchContributors(): Promise<any>; // Updated return type to match the GitHubDataFetcher implementation
    fetchTestingResults(): Promise<any>; // Updated return type to match the GitHubDataFetcher implementation
    fetchDocumentation(): Promise<string>; // Documentation still returns a string
    fetchMaintainerMetrics(): Promise<any>; // Updated return type to match the GitHubDataFetcher implementation
    fetchLicense(): Promise<string>; // Updated return type to match the GitHubDataFetcher implementation
    fetchAllData(): Promise<any[]>; // Adjusted to return any array
}
