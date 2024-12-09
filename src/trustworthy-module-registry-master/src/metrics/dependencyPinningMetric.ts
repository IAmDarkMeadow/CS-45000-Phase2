/*
 *  dependencyPinningMetric.ts
 *
 * Description:
 * This module calculates the "Dependency Pinning Metric," which measures the fraction of 
 * dependencies in a `package.json` file that are pinned to specific major and minor versions.
 * Pinned versions are versions locked to a specific `major.minor` combination (e.g., `1.2.x`).
 * 
 * Author: Brayden Devenport
 * Date: 12-08-2024
 * Version: 1.0
 * 
 * 
*/

import axios from 'axios';
import dotenv from 'dotenv';
import semver from 'semver';



dotenv.config();

/**
 * Configuration Interface
 */
interface Config {
    repoUrl: string; // GitHub repository URL
    githubToken?: string; // Optional GitHub token for authenticated requests
}

/**
 * Extract owner and repo name from GitHub URL
 * @param url GitHub repository URL
 * @returns { owner, repo }
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } {
    logger.info(`Parsing GitHub URL: ${url}`);
    const regex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?(?:\/)?$/;
    const match = url.match(regex);
    if (!match) {
        throw new Error('Invalid GitHub repository URL.');
    }
    const owner = match[1];
    const repo = match[2];
    logger.info(`Extracted Owner: ${owner}, Repository: ${repo}`);
    return { owner, repo };
}

/**
 * Fetch package.json content from GitHub repository
 * @param owner Repository owner
 * @param repo Repository name
 * @param githubToken Optional GitHub token
 * @returns Parsed package.json object
 */
async function fetchPackageJson(owner: string, repo: string, githubToken?: string): Promise<any> {
    logger.info(`Fetching package.json for ${owner}/${repo}`);
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/package.json`;
    const headers: any = { 'Accept': 'application/vnd.github.v3.raw' };
    if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
    }

    try {
        const response = await axios.get(url, { headers });
        logger.info(`Successfully fetched package.json`);
        return response.data;
    } catch (error: any) {
        logger.error(`Error fetching package.json: ${error.message}`);
        throw new Error(`Failed to fetch package.json: ${error.message}`);
    }
}

/**
 * Determine if a version string is pinned to a specific major and minor version
 * @param version Version string from package.json
 * @returns boolean indicating if version is pinned appropriately
 */
function isVersionPinned(version: string): boolean {
    // Parse the version range using semver
    const range = new semver.Range(version);
    // Check if the range is a single exact version
    if (range.set.length === 1 && range.set[0].length === 1) {
        const comparator = range.set[0][0];
        if (comparator.operator === '' || comparator.operator === '=' ) {
            // Exact version is considered pinned
            logger.info(`Version "${version}" is exactly pinned to "${comparator.semver}"`);
            return true;
        }
    }

    // Check if the range allows updates beyond the major.minor
    // For example, "^1.2.3" allows <2.0.0, which is not strictly pinned to 1.2.x
    // Similarly, "~1.2.3" allows <1.3.0, which pins to 1.2.x
    // We'll consider "~" as pinned and "^" as not strictly pinned
    const firstComparator = range.set[0][0];
    if ((firstComparator.operator as string) === '~') {
        logger.info(`Version "${version}" is pinned with "~" to "${firstComparator.semver.major}.${firstComparator.semver.minor}.x"`);
        return true;
    }

    logger.info(`Version "${version}" is not strictly pinned.`);
    return false;
}

/**
 * Calculate the fraction of dependencies pinned to their specific major+minor version
 * @param packageJson Parsed package.json object
 * @returns Fraction as a number between 0 and 1
 */
function calculatePinningFraction(packageJson: any): number {
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    const allDependencies = { ...dependencies, ...devDependencies };
    const total = Object.keys(allDependencies).length;

    logger.info(`Total dependencies (including devDependencies): ${total}`);

    if (total === 0) {
        
        return 1.0;
    }

    let pinnedCount = 0;

    for (const dep in allDependencies) {
        const version = allDependencies[dep];
        logger.info(`\nProcessing dependency: ${dep}, version: "${version}"`);
        if (isVersionPinned(version)) {
            pinnedCount += 1;
            logger.info(`Dependency "${dep}" is properly pinned.`);
        } else {
            logger.info(`Dependency "${dep}" is not properly pinned.`);
        }
    }

    const fraction = pinnedCount / total;
    return fraction;
}

/**
 * Main function to compute the dependency pinning metric
 * @param config Configuration object
 * @returns Fraction of pinned dependencies
 */
export async function computeDependencyPinningMetric(config: Config): Promise<number> {
    logger.info('Starting computation of Dependency Pinning Metric...');
    const { owner, repo } = parseGitHubUrl(config.repoUrl);
try {
    const packageJson = await fetchPackageJson(owner, repo, config.githubToken);
    const fraction = calculatePinningFraction(packageJson);
    logger.info(`\nFinal Pinning Fraction: ${fraction}`);
    return fraction;
} catch (error: any) {
    if (error.message.includes('404')) {
        logger.error(`package.json not found in the repository ${owner}/${repo}. Ensure that the repository contains a package.json file at its root.`);
    }
    throw error; // Re-throw the error after logging
}
}



// A logger function that I can use for the metric function. 
import { createLogger, format, transports } from 'winston';


dotenv.config();

const logPath = process.env.LOG_FILE || './default.log';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: logPath, options: { flags: 'a' } })
    ],
});

export default logger;

