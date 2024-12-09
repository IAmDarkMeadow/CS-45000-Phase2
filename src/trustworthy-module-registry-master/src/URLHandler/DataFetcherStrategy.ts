// src/URLHandler/DataFetcherStrategy.ts

/**
 * @interface DataFetcherStrategy
 * 
 * Strategy interface for fetching various types of data from a source.
 */
export interface DataFetcherStrategy {
    // URL of the source.
    URL: string;

    /**
     * Fetches commit data.
     * 
     * @returns     Commit data as a Promise<any>.
     */
    fetchCommits(): Promise<any>;

    /**
     * Fetches contributor data.
     * 
     * @returns     Contributor data as a Promise<any>.
     */
    fetchContributors(): Promise<any>;

    /**
     * Fetches testing results.
     * 
     * @returns     Testing results as a Promise<any>.
     */
    fetchTestingResults(): Promise<any>;

    /**
     * Fetches documentation.
     * 
     * @returns     Documentation as a Promise<any>.
     */
    fetchDocumentation(): Promise<any>;

    /**
     * Fetches maintainer metrics.
     * 
     * @returns     Maintainer metrics as a Promise<any>.
     */
    fetchMaintainerMetrics(): Promise<any>;

    /**
     * Fetches license information.
     * 
     * @returns     License information as a Promise<any>.
     */
    fetchLicense(): Promise<any>;

    /**
     * Fetches all data using various fetch methods.
     * 
     * @returns     All data as a Promise<any>.
     */
    fetchAllData(): Promise<any>;
}
