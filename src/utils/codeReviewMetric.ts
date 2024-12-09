/*
* codeReviewMetric.ts*
* Description:
* This module provides functions to calculate the fraction of code introduced
* through pull requests (PRs) that have undergone code reviews with at least
* one approving review. It integrates with the GitHub API to fetch repository
* data and analyze PRs.**
* Author: Brayden Devenport
* Date: 12-08-2024
* Version: 1.0**
*/

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Configuration Interface
 */
interface Config {
    repoUrl: string; // GitHub repository URL
    githubToken?: string; // Optional GitHub token for authenticated requests
}

function parseGitHubUrl(url: string): { owner: string; repo: string } {
    console.log(`Parsing GitHub URL: ${url}`);
    const regex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?(?:\/)?$/;
    const match = url.match(regex);
    if (!match) {
        throw new Error('Invalid GitHub repository URL.');
    }
    const owner = match[1];
    const repo = match[2];
    console.log(`Extracted Owner: ${owner}, Repository: ${repo}`);
    return { owner, repo };
}

/**
 * Fetch all pull requests for the repository
 * @param owner Repository owner
 * @param repo Repository name
 * @param githubToken Optional GitHub token
 * @returns Array of pull requests
 */
async function fetchAllPullRequests(owner: string, repo: string, githubToken?: string): Promise<any[]> {
    console.log(`Fetching all closed pull requests for ${owner}/${repo}`);
    const per_page = 100;
    let page = 1;
    let pullRequests: any[] = [];
    const headers: any = { 'Accept': 'application/vnd.github.v3+json' };
    if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
    }

    while (true) {
        const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=${per_page}&page=${page}`;
        console.log(`Fetching PRs from: ${url}`);
        try {
            const response = await axios.get(url, { headers });
            const data = response.data;
            console.log(`Fetched ${data.length} pull requests from page ${page}`);
            if (data.length === 0) break;
            pullRequests = pullRequests.concat(data);
            if (data.length < per_page) break;
            page += 1;
        } catch (error: any) {
            console.error(`Error fetching pull requests: ${error.message}`);
            throw new Error(`Failed to fetch pull requests: ${error.message}`);
        }
    }

    console.log(`Total pull requests fetched: ${pullRequests.length}`);
    return pullRequests;
}

/**
 * Fetch reviews for a specific pull request
 * @param owner Repository owner
 * @param repo Repository name
 * @param pullNumber Pull request number
 * @param githubToken Optional GitHub token
 * @returns Array of reviews
 */
async function fetchPullRequestReviews(owner: string, repo: string, pullNumber: number, githubToken?: string): Promise<any[]> {
    console.log(`Fetching reviews for PR #${pullNumber}`);
    const headers: any = { 'Accept': 'application/vnd.github.v3+json' };
    if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`;
    try {
        const response = await axios.get(url, { headers });
        console.log(`Fetched ${response.data.length} reviews for PR #${pullNumber}`);
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching reviews for PR #${pullNumber}: ${error.message}`);
        throw new Error(`Failed to fetch reviews for PR #${pullNumber}: ${error.message}`);
    }
}

/**
 * Determine if a pull request has at least one approving review
 * @param reviews Array of reviews
 * @returns boolean
 */
function hasApprovingReview(reviews: any[]): boolean {
    const hasApprove = reviews.some(review => review.state === 'APPROVED');
    console.log(`PR has approving review: ${hasApprove}`);
    return hasApprove;
}

/**
 * Fetch additions for a specific pull request
 * @param owner Repository owner
 * @param repo Repository name
 * @param pullNumber Pull request number
 * @param githubToken Optional GitHub token
 * @returns Number of additions
 */
async function fetchPullRequestAdditions(owner: string, repo: string, pullNumber: number, githubToken?: string): Promise<number> {
    console.log(`Fetching additions for PR #${pullNumber}`);
    const headers: any = { 'Accept': 'application/vnd.github.v3+json' };
    if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
    try {
        const response = await axios.get(url, { headers });
        const additions = response.data.additions;
        console.log(`PR #${pullNumber} has ${additions} additions`);
        return additions;
    } catch (error: any) {
        console.error(`Error fetching additions for PR #${pullNumber}: ${error.message}`);
        throw new Error(`Failed to fetch additions for PR #${pullNumber}: ${error.message}`);
    }
}

/**
 * Fetch code frequency data for the repository
 * This provides weekly additions and deletions.
 * @param owner Repository owner
 * @param repo Repository name
 * @param githubToken Optional GitHub token
 * @returns Total additions over the repository's history
 */
async function fetchCodeFrequency(owner: string, repo: string, githubToken?: string): Promise<number> {
    console.log(`Fetching code frequency for ${owner}/${repo}`);
    const headers: any = { 'Accept': 'application/vnd.github.v3+json' };
    if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`;
    try {
        let response;
        // The GitHub API might take time to generate stats; handle 202 status
        while (true) {
            response = await axios.get(url, { headers });
            if (response.status === 202) {
                console.log('GitHub is generating the statistics. Waiting for 3 seconds before retrying...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                break;
            }
        }
        const data = response.data; // Array of [timestamp, additions, deletions]
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format received for code frequency.');
        }
        console.log(`Fetched code frequency data with ${data.length} entries.`);
        let totalAdditions = 0;
        data.forEach(([timestamp, additions, deletions]: [number, number, number]) => {
            totalAdditions += additions;
        });
        console.log(`Total additions over the repository's history: ${totalAdditions}`);
        return totalAdditions;
    } catch (error: any) {
        console.error(`Error fetching code frequency: ${error.message}`);
        throw new Error(`Failed to fetch code frequency: ${error.message}`);
    }
}

/**
 * Calculate the fraction of code introduced through PRs with code reviews
 * @param config Configuration object
 * @returns Fraction as a number between 0 and 1
 */
export async function computeCodeReviewMetric(config: Config): Promise<number> {
    console.log('Starting computation of Code Review Metric...');
    const { owner, repo } = parseGitHubUrl(config.repoUrl);
    const pullRequests = await fetchAllPullRequests(owner, repo, config.githubToken);

    let reviewedAdditions = 0;

    console.log('Processing each pull request for reviews and additions...');
    // Process each pull request
    for (const pr of pullRequests) {
        const prNumber = pr.number;
        console.log(`\nProcessing PR #${prNumber}: "${pr.title}" by ${pr.user.login}`);
        const reviews = await fetchPullRequestReviews(owner, repo, prNumber, config.githubToken);
        if (hasApprovingReview(reviews)) {
            const additions = await fetchPullRequestAdditions(owner, repo, prNumber, config.githubToken);
            reviewedAdditions += additions;
            console.log(`Accumulated additions after PR #${prNumber}: ${reviewedAdditions}`);
        } else {
            console.log(`PR #${prNumber} does not have an approving review. Skipping additions.`);
        }
    }

    // Fetch total lines of code using Code Frequency API
    const totalAdditions = await fetchCodeFrequency(owner, repo, config.githubToken);

    if (totalAdditions === 0) {
        console.log('Total additions are 0. Returning 1.0 as per specification.');
        return 1.0; // If no code, return 1.0
    }

    // Ensure the fraction does not exceed 1 due to approximation
    const fraction = Math.min(reviewedAdditions / totalAdditions, 1.0);
    console.log(`\nFinal Computed Fraction: ${fraction}`);
    return fraction;
}

/**
 * Example Usage
 * (Uncomment the following lines to test the metric)
 */

(async () => {
    const config: Config = {
        repoUrl: 'https://github.com/octocat/Hello-World', // Replace with your repository URL
        githubToken: process.env.GITHUB_TOKEN, // Ensure you have GITHUB_TOKEN in your .env file
    };

    console.log('Starting Code Review Metric computation...');
    try {
        const fraction = await computeCodeReviewMetric(config);
        console.log(`\nFraction of code introduced through PRs with code reviews: ${fraction}`);
    } catch (error) {
        console.error(`Error computing Code Review Metric: ${(error as Error).message}`);
    }
})();
