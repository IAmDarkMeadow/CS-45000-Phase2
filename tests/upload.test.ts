import { handleUpload, cloneFromRepoInfo } from '../src/services/uploadService';
import { ProcessURL } from '../src/utils/verifyURL';
import { cloneRepository } from '../src/utils/cloneRepo';
import { zipDirectory } from '../src/models/packageModel';
import { uploadToS3, uploadModuleMetadata } from '../src/services/s3Service';
import { debloatModule } from '../src/services/debloatService';
import fs from 'fs-extra';
import path from 'path';

// Mock the dependencies
jest.mock('../src/utils/verifyURL', () => ({
  ProcessURL: jest.fn(),
}));
jest.mock('../src/utils/cloneRepo', () => ({
  cloneRepository: jest.fn(),
}));
jest.mock('../src/models/packageModel', () => ({
  zipDirectory: jest.fn(),
}));
jest.mock('../src/services/s3Service', () => ({
  uploadToS3: jest.fn(),
  uploadModuleMetadata: jest.fn(),
}));
jest.mock('../src/services/debloatService', () => ({
  debloatModule: jest.fn(),
}));

jest.mock('fs-extra', () => ({
  remove: jest.fn(),
  readdir: jest.fn(),
  pathExists: jest.fn(),
}));

describe('handleUpload', () => {
  const tempDir = './temp';
  const githubUrl = 'https://github.com/user/repo';
  const repoInfo = { owner: 'user', repo: 'repo' };
  const clonedPath = `${tempDir}/repo`;
  const zipFileName = 'test-file.zip';
  const bucketName = 'test-bucket';
  const s3Location = 's3://test-bucket/Modules/test-file.zip';

  beforeEach(() => {
    process.env.TEMP_DIR = tempDir;
    process.env.S3_BUCKET_NAME = bucketName;

    // Reset mocks before each test
    jest.clearAllMocks();

    (ProcessURL as jest.Mock).mockResolvedValue(repoInfo);
    (cloneRepository as jest.Mock).mockResolvedValue(clonedPath);
    (zipDirectory as jest.Mock).mockResolvedValue(undefined);
    (uploadToS3 as jest.Mock).mockResolvedValue(s3Location);
    (uploadModuleMetadata as jest.Mock).mockResolvedValue(undefined);
    (debloatModule as jest.Mock).mockResolvedValue(undefined);

    (fs.remove as jest.Mock).mockResolvedValue(undefined);
    (fs.pathExists as jest.Mock).mockResolvedValue(true);
    //(fs.readdir as jest.Mock).mockResolvedValue([zipFileName]);
  });

  it('should handle successful upload without debloat', async () => {
    await expect(handleUpload(githubUrl, false)).resolves.toBeUndefined();

    // Verify that URL processing happened
    expect(ProcessURL).toHaveBeenCalledWith(githubUrl);

    // Verify that repository cloning happened
    expect(cloneRepository).toHaveBeenCalledWith(`https://github.com/${repoInfo.owner}/${repoInfo.repo}.git`, tempDir);

    // Debloat should NOT be called because debloat = false
    expect(debloatModule).not.toHaveBeenCalled();

    // Verify zipDirectory was called
    expect(zipDirectory).toHaveBeenCalledWith(clonedPath, expect.any(String));

    // Verify that uploadToS3 was called
    expect(uploadToS3).toHaveBeenCalledWith(expect.any(String), bucketName, 'Modules');

    // Verify that metadata was uploaded
    expect(uploadModuleMetadata).toHaveBeenCalledWith({
      name: repoInfo.repo,
      version: '1.0.0',
      description: 'Module created from GitHub repository',
      s3Location,
      githublink: githubUrl,
    });

    // Verify cleanup
    expect(fs.remove).toHaveBeenCalledWith(clonedPath);
    expect(fs.remove).toHaveBeenCalledTimes(2); // once for repo and once for zip file
  });

  it('should handle successful upload with debloat', async () => {
    await expect(handleUpload(githubUrl, true)).resolves.toBeUndefined();

    // Debloat should be called now
    expect(debloatModule).toHaveBeenCalledWith(clonedPath);
  });

  it('should throw error if ProcessURL returns invalid info', async () => {
    (ProcessURL as jest.Mock).mockResolvedValueOnce(null);

    await expect(handleUpload(githubUrl, false)).rejects.toThrow('Invalid repository information.');
    expect(debloatModule).not.toHaveBeenCalled();
    expect(uploadToS3).not.toHaveBeenCalled();
  });

  it('should throw error if S3 bucket name is not set', async () => {
    delete process.env.S3_BUCKET_NAME; // remove the bucket name

    await expect(handleUpload(githubUrl, false)).rejects.toThrow('S3_BUCKET_NAME is not set in the environment variables.');
    expect(debloatModule).not.toHaveBeenCalled();
    expect(uploadToS3).not.toHaveBeenCalled();
  });

  it('should handle errors from within the try block and still clean up', async () => {
    (zipDirectory as jest.Mock).mockRejectedValueOnce(new Error('Zipping failed'));

    await expect(handleUpload(githubUrl, false)).rejects.toThrow('Zipping failed');
    // Even if it fails, cleanup should still occur
    expect(fs.remove).toHaveBeenCalledWith(clonedPath);
  });
});

describe('cloneFromRepoInfo', () => {
  const tempDir = './temp';
  const repoInfo = { owner: 'user', repo: 'repo' };

  beforeEach(() => {
    jest.clearAllMocks();
    (cloneRepository as jest.Mock).mockResolvedValue(`${tempDir}/repo`);
  });

  it('should clone a repository', async () => {
    const result = await cloneFromRepoInfo(repoInfo, tempDir);
    expect(result).toBe(`${tempDir}/repo`);
    expect(cloneRepository).toHaveBeenCalledWith(`https://github.com/user/repo.git`, tempDir);
  });

  it('should throw an error for invalid repoInfo', async () => {
    await expect(cloneFromRepoInfo({ owner: '', repo: '' }, tempDir)).rejects.toThrow('Invalid repository information.');
  });
});
