/*
 * cloneRepo.ts
 *
 * 
 * Description:
 * This file provides a utility function to clone a GitHub repository into a specified
 * temporary directory. It uses the `simple-git` library for Git operations and ensures
 * that the target directory is prepared before cloning.
 * 
 * Author: Brayden Devenport
 * Date: 12-8-2024
 * Version: 1.0
 * 
 */
import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs-extra';

export const cloneRepository = async (repoUrl: string, tempDir: string): Promise<string> => {
  const git: SimpleGit = simpleGit();
  const repoNameMatch = repoUrl.match(/\/([\w-]+)(?:\.git)?$/);
  if (!repoNameMatch) throw new Error('Invalid repository name.');

  const repoName = repoNameMatch[1];
  const clonePath = path.join(tempDir, repoName);

  await fs.ensureDir(tempDir);
  await git.clone(repoUrl, clonePath);

  return clonePath;
};
