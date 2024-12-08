// src/services/uploadService.ts

import { ProcessURL } from '../utils/verifyURL';
import { cloneRepository } from '../utils/cloneRepo';
import { zipDirectory } from '../models/packageModel';
import { uploadModuleMetadata } from './s3Service';
import { uploadToS3 } from './s3Service';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'
import { debloatModule } from './debloatService';

dotenv.config();

/**
 * Handles the entire upload process from receiving a GitHub URL to storing metadata.
 * @param githubUrl - The GitHub repository URL provided by the user.
 * @returns A promise that resolves to the module metadata after successful upload.
 */
export const handleUpload = async (githubUrl: string, debloat: boolean): Promise<void> => {

// Step 1: Validate GitHub URL
    const repoInfo = await ProcessURL(githubUrl);
    if (!repoInfo) {
      throw new Error('Invalid repository information.');
    }
    // Step 2: Clone Repository
    const tempDir = process.env.TEMP_DIR || './temp'; 
    const clonePath = await cloneFromRepoInfo(repoInfo, tempDir);

try{
    // Step 3: debloat
    if (debloat ){
      console.log('Debloating the module...');
      await debloatModule(clonePath);
    }
    // Step 4: Package Module
    const zipFileName = `${uuidv4()}.zip`;
    const zipFilePath = path.join(tempDir, zipFileName);
    await zipDirectory(clonePath, zipFilePath);
    
    // Add the stuff

    // Step 5: Upload to S3
    const bucketName = process.env.S3_BUCKET_NAME!;
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not set in the environment variables.');
    }
    const keyPrefix = 'Modules';
    const s3Location = await uploadToS3(zipFilePath, bucketName, keyPrefix);

    // Step 6: Store Module Metadata

    const moduleMetadata = {
        name: repoInfo.repo || 'unknown', // Use repository name or 'unknown' as a fallback
        version: '1.0.0', // Placeholder for version (adjust as needed)
        description: 'Module created from GitHub repository', // Placeholder description
        s3Location: s3Location,
        githublink: githubUrl,
    };

  // Use createMetaData to upload metadata
    uploadModuleMetadata(moduleMetadata)

  } catch (error) {
    throw error;
  } finally {
    // Step 7: Cleanup
    await fs.remove(clonePath);
    // Remove zip file
    const zipFileName = path.basename(await fs.readdir(tempDir).then(files => files.find(file => file.endsWith('.zip')) || ''));
    const zipFilePath = path.join(tempDir, zipFileName);
    if (await fs.pathExists(zipFilePath)) {
      await fs.remove(zipFilePath);
    }
  }
};


export const cloneFromRepoInfo = async (
  repoInfo: { owner: string; repo: string },
  tempDir: string
): Promise<string> => {
  if (!repoInfo || !repoInfo.owner || !repoInfo.repo) {
    throw new Error('Invalid repository information.');
  }

  // Construct GitHub repository URL from repoInfo
  const repoUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}.git`;

  // Call the cloneRepository function
  const clonePath = await cloneRepository(repoUrl, tempDir);

  return clonePath; // Return the path where the repository was cloned
};