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

// GitHub API base URL
import simpleGit from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';
import {handleUpload} from './services/uploadService'

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
    throw new Error(`Error fetching the latest release for ${repo}: ${error}`);
  }
}

// Function to download the repository (clone or download ZIP)
/*async function downloadRepo(owner: string, repo: string, latestVersion: string): Promise<void> {
  try {
    // Clone the repository using git (you could also use 'git archive' to download a ZIP of the repo)
    const repoUrl = `https://github.com/${owner}/${repo}.git`;

    console.log(`Cloning repository ${repoUrl}...`);
    const git = simpleGit();
    const downloadPath = path.join(__dirname, `${repo}-${latestVersion}`);
    
    // Check if the directory already exists, if so, delete it
    if (fs.existsSync(downloadPath)) {
      fs.rmdirSync(downloadPath, { recursive: true });
    }

    // Clone the repository to the current directory with the latest version tag
    await git.clone(repoUrl, downloadPath, ['--branch', latestVersion]);
    console.log(`Repository cloned to ${downloadPath}`);
  } catch (error) {
    throw new Error(`Error downloading the repository: ${error}`);
  }
}
*/
// Function to connect to GitHub and get the latest version and download the repo
export async function connectToGitHubAndDownloadRepo(ProcessJSON: ModuleMetadata): Promise<void> {
   let repoUrl = ProcessJSON.githublink;
   
  try {
    // Extract repo details from the provided URL
    const { owner, repo } = extractRepoDetails(repoUrl);

    // Get the latest release version
    const latestVersion = await getLatestRelease(owner, repo);
    console.log(`Latest version of ${repo}: ${latestVersion}`);
    if (latestVersion != ProcessJSON.version) {

    // Download the repository using the latest version tag
        await handleUpload(repoUrl,false);
    }
  else console.log('Latest version matches!')
  } catch (error) {
    console.error('Error:', error);
  }
}




// Example usage: Provide the GitHub repository URL


// Function to search for a repository by name and get the latest release version
/*export async function searchRepoAndGetLatestVersion( ProcessJSON: (jsonContent: any) => void): Promise<void> {
  repoName = ProcessJSON.repoUrl;
  
    try {
    // Step 1: Search for repositories by name
    const searchResponse = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
      params: {
        q: repoName,
        sort: 'stars', // Optional: sort by stars, can be modified
        order: 'desc',
      },
    });

    // Step 2: Check if repositories were found
    const repos = searchResponse.data.items;
    if (repos.length === 0) {
      console.log(`No repositories found with the name "${repoName}"`);
      return;
    }

    // Step 3: Iterate through the repositories and fetch the latest release for each
    for (const repo of repos) {
      const { full_name, name } = repo;

      console.log(`Found repository: ${name}`);

      // Step 4: Fetch the releases for the found repository
      const releasesResponse = await axios.get(`${GITHUB_API_URL}/repos/${full_name}/releases`);
      const releases = releasesResponse.data;

      if (releases.length === 0) {
        console.log(`No releases found for repository "${name}"`);
        continue;
      }

      // Step 5: Get the latest release (the first one in the list is the latest)
      const latestRelease = releases[0];
      console.log(`Latest release for "${name}" is version "${latestRelease.tag_name}"`);
      console.log(`Release URL: ${latestRelease.html_url}`);

      // Optionally, you can stop after finding the first match
      return;
    }

    // If no releases were found in any repositories
    console.log(`No releases found for the repository "${repoName}"`);
  } catch (error) {
    console.error('Error searching for repositories or fetching releases:', error);
  }
}

// Example usage: Search for a repo with the name "express" and check the latest version
searchRepoAndGetLatestVersion('express');*/
