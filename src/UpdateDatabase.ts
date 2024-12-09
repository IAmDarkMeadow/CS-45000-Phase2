/*
 *  UpdateDatabase.ts
 *  Description: Intended to update the server's database per user request
 *  by first comparing module version from the git version
 *  then using external upload function.
 *  input is json header object used to communicate file details within the server
 *  Two functions are here that arent exported, extractRepoDetails and getLatestRelease
 *  first extracts details from link for gitapi to use, and second
 *  finds the latest release to compare to our version
 *  Author: Grayson DeHerdt
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-09-2024
 *  Version: 0.5
 *   
 */


import * as AWS from 'aws-sdk';
import axios from 'axios';
import {ModuleMetadata} from './models/packageModel'
import {handleUpload} from './services/uploadService'
import logger from "./utils/Logger";

//Made by: Grayson DeHerdt
//Function: Intended to update the server's database per user request
//by first comparing module version from the git version
//then using external upload function.
//input is json header object used to communicate file details within the server


// GitHub API base URL
const GITHUB_API_URL = 'https://api.github.com';

// Function to extract the repo name and owner from a GitHub URL
function extractRepoDetails(repoUrl: string): { owner: string, repo: string } {
  const regex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = repoUrl.match(regex);

  if (!match) {
    logger.info("Invalid GitHub URL");
    throw new Error('Invalid GitHub URL');
  }

  return { owner: match[1], repo: match[2] };
}

// Function to get the latest release version of a repository
async function getLatestRelease(owner: string, repo: string): Promise<string> {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/releases/latest`);
    const latestRelease = response.data;

    return latestRelease.tag_name; // Get the latest release version
  } catch (error) {
    logger.info('Error fetching the latest release');
    throw new Error(`Error fetching the latest release for ${repo}: ${error}`);
  }
}

// Function to connect to GitHub and get the latest version and download the repo
export async function connectToGitHubAndDownloadRepo(ProcessJSON: ModuleMetadata): Promise<void> {
   let repoUrl = ProcessJSON.githublink;
   
  try {
    // Extract repo details from the provided URL
    const { owner, repo } = extractRepoDetails(repoUrl);

    // Get the latest release version
    const latestVersion = await getLatestRelease(owner, repo);
    logger.info(`Latest version of ${repo}: ${latestVersion}`);
    if (latestVersion != ProcessJSON.version) {

    // Download the repository using the latest version tag
        await handleUpload(repoUrl,false);
    }
  else logger.info('Latest version matches!')
  } catch (error) {
    logger.info('Error:', error);
  }
}