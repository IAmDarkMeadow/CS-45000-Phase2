// src/URLHandler/URLHandler.ts

import { DataFetcherStrategy } from './DataFetcherStrategy';

/**
 * @class URLHandler
 * 
 * Class that takes care of handling URLs.
 */
export class URLHandler {
    dataFetcherStrategy?: DataFetcherStrategy; 

    /**
     * Initializing constructor.
     * 
     * @param       strategy        The DataFetcherStrategy instance to set.
     */
    constructor(strategy?: DataFetcherStrategy) {
        this.dataFetcherStrategy = strategy;
    }

    /**
     * Parses a URL into its components (protocol, hostname, pathname).
     *
     * @param       url     URL to parse.
     * @returns     Array of parsed URL components [protocol, hostname, pathname].
     * @throws      Error if URL is invalid.
     */
    public parseURL(url: string): string[] {
        try {
            const urlObj = new URL(url);
            return [urlObj.protocol, urlObj.hostname, urlObj.pathname];
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error message:", error.message);
            } else {
                console.log("Unknown error occurred:", error);
            }
            // Re-throw the error to propagate it
            throw error;
        }
    }

    /**
     * Determines if the URL is for GitHub or npm based on the hostname.
     * 
     * @param       urlComponents      Array of URL components obtained from parseURL().
     * @returns     0 if URL is GitHub, 1 if URL is npm.
     */
    public determineSource(urlComponents: string[]): number {
        const hostname = urlComponents[1];
    
        const sourceMap: { [key: string]: number } = {
            'github.com': 0,
            'www.npmjs.com': 1
        };
    
        if (hostname in sourceMap) {
            return sourceMap[hostname];
        }
        throw new Error(`Unsupported URL source for: ${hostname}`);
    }

    /**
     * Validates whether the URL is well-formed and matches GitHub or npm patterns.
     * 
     * @param       url     The URL string to validate.
     * @returns     True if the URL is valid and belongs to GitHub or npm, false otherwise.
     */
    public validateURL(url: string): boolean {
        // General URL pattern validation (basic URL validation).
        const urlPattern = /^(https?:\/\/)?([\w.-]+)+(\.[a-z]{2,})(\/[\w.-]*)*\/?$/i;
    
        // Check if the URL doesn't match the general URL pattern.
        if (!urlPattern.test(url)) {
            throw new Error('Invalid URL format.');
        }

        // Initialize regex patterns for GitHub and npm URLs.
        const githubPattern = /^https:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+(\/)?$/;
        const npmPattern = /^https:\/\/www\.npmjs\.com\/package\/[\w.-]+(\/)?$/;

        // Return true if the URL matches either the GitHub or npm pattern.
        return githubPattern.test(url) || npmPattern.test(url);
    }

    /**
     * Gets the current data fetcher strategy.
     * 
     * @returns     The current DataFetcherStrategy instance.
     */
    public getDataFetcherStrategy(): DataFetcherStrategy | undefined {
        return this.dataFetcherStrategy;
    }

    /**
     * Sets a new data fetcher strategy.
     * 
     * @param       strategy        The DataFetcherStrategy instance to set. 
     */
    public setDataFetcherStrategy(strategy: DataFetcherStrategy): void {
        this.dataFetcherStrategy = strategy;
    }

    /**
     * Fetches all of the data using the current data fetcher strategy.
     * 
     * @returns     Promise resolving to the data fetched using the strategy.
     */
    public fetchAllData(): Promise<any> {
        if (!this.dataFetcherStrategy) {
            throw new Error('Data fetcher strategy not set.');
        }
        return this.dataFetcherStrategy.fetchAllData();
    }
}
