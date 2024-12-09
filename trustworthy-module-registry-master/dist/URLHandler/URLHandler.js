"use strict";
// src/URLHandler/URLHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLHandler = void 0;
/**
 * @class URLHandler
 *
 * Class that takes care of handling URLs.
 */
class URLHandler {
    /**
     * Initializing constructor.
     *
     * @param       strategy        The DataFetcherStrategy instance to set.
     */
    constructor(strategy) {
        this.dataFetcherStrategy = strategy;
    }
    /**
     * Parses a URL into its components (protocol, hostname, pathname).
     *
     * @param       url     URL to parse.
     * @returns     Array of parsed URL components [protocol, hostname, pathname].
     * @throws      Error if URL is invalid.
     */
    parseURL(url) {
        try {
            const urlObj = new URL(url);
            return [urlObj.protocol, urlObj.hostname, urlObj.pathname];
        }
        catch (error) {
            if (error instanceof Error) {
                console.log("Error message:", error.message);
            }
            else {
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
    determineSource(urlComponents) {
        const hostname = urlComponents[1];
        const sourceMap = {
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
    validateURL(url) {
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
    getDataFetcherStrategy() {
        return this.dataFetcherStrategy;
    }
    /**
     * Sets a new data fetcher strategy.
     *
     * @param       strategy        The DataFetcherStrategy instance to set.
     */
    setDataFetcherStrategy(strategy) {
        this.dataFetcherStrategy = strategy;
    }
    /**
     * Fetches all of the data using the current data fetcher strategy.
     *
     * @returns     Promise resolving to the data fetched using the strategy.
     */
    fetchAllData() {
        if (!this.dataFetcherStrategy) {
            throw new Error('Data fetcher strategy not set.');
        }
        return this.dataFetcherStrategy.fetchAllData();
    }
}
exports.URLHandler = URLHandler;
