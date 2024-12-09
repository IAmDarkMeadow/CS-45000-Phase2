import { uploadModuleMetadata } from '../src/services/s3Service';
import s3Client from '../src/config/aws-config';
import logger from '../src/utils/Logger';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ModuleMetadata } from '../src/models/packageModel';

jest.mock('../src/config/aws-config', () => ({
  send: jest.fn(),
}));

jest.mock('../src/utils/Logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('uploadModuleMetadata', () => {
  it('should upload module metadata successfully', async () => {
    // Adjusted to match the ModuleMetadata interface
    const moduleMetadata: ModuleMetadata = {
      name: 'test-module',
      version: '1.0.0',
      description: 'A test module for demonstration purposes.',
      s3Location: 's3://my-bucket/path/to/object',
      githublink: 'https://github.com/username/repo'
    };

    process.env.S3_BUCKET_NAME = 'my-bucket';

    (s3Client.send as jest.Mock).mockResolvedValueOnce({}); // Simulate a successful put

    await uploadModuleMetadata(moduleMetadata);

    expect(logger.info).toHaveBeenCalledWith('Successfully uploaded metadata for test-module to S3!');
    expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it('should log error if bucket name is not defined', async () => {
    const moduleMetadata: ModuleMetadata = {
      name: 'test-module',
      version: '1.0.0',
      description: 'A test module for demonstration purposes.',
      s3Location: 's3://my-bucket/path/to/object',
      githublink: 'https://github.com/username/repo'
    };

    delete process.env.S3_BUCKET_NAME; // ensure it's undefined

    await expect(uploadModuleMetadata(moduleMetadata)).rejects.toBeTruthy();
    expect(logger.error).toHaveBeenCalledWith(
      'S3_BUCKET_NAME is not defined in the environment variables.'
    );
  });

  it('should log error if upload fails', async () => {
    const moduleMetadata: ModuleMetadata = {
      name: 'test-module',
      version: '1.0.0',
      description: 'A test module for demonstration purposes.',
      s3Location: 's3://my-bucket/path/to/object',
      githublink: 'https://github.com/username/repo'
    };

    process.env.S3_BUCKET_NAME = 'my-bucket';
    (s3Client.send as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

    await expect(uploadModuleMetadata(moduleMetadata)).rejects.toThrow('Upload failed');
    expect(logger.error).toHaveBeenCalledWith(
      `Error uploading metadata for test-module:`,
      expect.any(Error)
    );
  });
});
