// src/utils/codeReviewMetrics.ts

import { Octokit } from '@octokit/rest';
import path from 'path';
import fs from 'fs-extra';
import logger from './Logger';
import { ModuleMetadata } from '../models/packageModel';

/**
 * Configuration for GitHub API access
 */
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ensure this is set in your environment variables

if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is not defined in environment variables.');
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

/**
 * Fetches all pull requests for a given repository.
 * 
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Array of pull requests
 */
const fetchAllPullRequests = async (owner: string, repo: string) => {
  try {
    const prs = await octokit.paginate(octokit.pulls.list, {
      owner,
      repo,
      state: 'closed',
      per_page: 100,
    });
    return prs;
  } catch (error) {
    logger.error(`Error fetching pull requests: ${error}`);
    return [];
  }
};

/**
 * Determines if a pull request has at least one approved review.
 * 
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param pull_number - PR number
 * @returns Boolean indicating if PR has approved reviews
 */
const hasApprovedReview = async (owner: string, repo: string, pull_number: number): Promise<boolean> => {
  try {
    const reviews = await octokit.paginate(octokit.pulls.listReviews, {
      owner,
      repo,
      pull_number,
      per_page: 100,
    });

    // Check if any review has state 'APPROVED'
    return reviews.some((review: { state: string; }) => review.state === 'APPROVED');
  } catch (error) {
    logger.error(`Error fetching reviews for PR #${pull_number}: ${error}`);
    return false;
  }
};

/**
 * Calculates the total lines of code from PRs with approved reviews.
 * 
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param prs - Array of pull requests
 * @returns Total lines of code added from reviewed PRs
 */
const calculateLOCFromReviewedPRs = async (owner: string, repo: string, prs: any[]): Promise<number> => {
  let totalLOC = 0;

  for (const pr of prs) {
    const { number } = pr;
    const approved = await hasApprovedReview(owner, repo, number);

    if (approved) {
      try {
        const prDetails = await octokit.pulls.get({
          owner,
          repo,
          pull_number: number,
        });

        const additions = prDetails.data.additions || 0;
        totalLOC += additions;
      } catch (error) {
        logger.error(`Error fetching details for PR #${number}: ${error}`);
      }
    }
  }

  return totalLOC;
};

/**
 * Calculates the total lines of code in the repository's default branch.
 * 
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Total lines of code
 */
const calculateTotalLOC = async (owner: string, repo: string): Promise<number> => {
  try {
    // Clone the repository locally to calculate LOC
    const tempDir = path.join(process.env.TEMP_DIR || './temp', `${owner}-${repo}`);
    await fs.ensureDir(tempDir);

    // Clone the repository if not already cloned
    const exists = await fs.pathExists(path.join(tempDir, '.git'));
    if (!exists) {
      logger.info(`Cloning repository ${owner}/${repo} to ${tempDir}`);
      await cloneRepository(`https://github.com/${owner}/${repo}.git`, tempDir);
    }

    // Use a tool like cloc to calculate LOC
    // Ensure cloc is installed on the system
    const { execSync } = require('child_process');
    const output = execSync(`cloc --json ${tempDir}`).toString();
    const clocData = JSON.parse(output);

    // Sum up the LOC across all languages
    let total = 0;
    for (const [language, data] of Object.entries(clocData)) {
      if (language === 'header' || language === 'SUM') continue;
      total += (data as any).code;
    }

    return total;
  } catch (error) {
    logger.error(`Error calculating total LOC: ${error}`);
    return 0;
  }
};

/**
 * Clone repository function (reusing existing cloneRepository)
 */
import { cloneRepository } from './cloneRepo'; // Adjust the path as necessary

/**
 * Calculates the fraction of code introduced through PRs with code reviews.
 * 
 * @param moduleMetadata - Metadata of the module
 * @param packagePath - Local path to the package (cloned repository)
 * @returns The fraction as a number between 0 and 1
 */
export const calculateCodeReviewFraction = async (owner : string, repo : string , packagePath: string): Promise<number> => {
  try {

    if (!owner || !repo) {
      logger.warn('Module metadata lacks owner or repo information.');
      return 0;
    }

    const prs = await fetchAllPullRequests(owner, repo);
    const locReviewed = await calculateLOCFromReviewedPRs(owner, repo, prs);
    const totalLOC = await calculateTotalLOC(owner, repo);

    if (totalLOC === 0) {
      logger.warn('Total LOC is zero. Cannot calculate fraction.');
      return 0;
    }

    const fraction = locReviewed / totalLOC;
    return parseFloat(fraction.toFixed(2)); // Rounded to two decimal places
  } catch (error) {
    logger.error(`Error calculating code review fraction: ${error}`);
    return 0; // In case of error, assume worst case
  }
};
