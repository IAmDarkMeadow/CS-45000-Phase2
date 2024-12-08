// src/utils/cloneRepo.ts
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
