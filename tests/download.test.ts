import { downloadFileS3 } from '../src/Download';
import logger from '../src/utils/Logger';
import { GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import * as fs from 'fs';

// Mock adm-zip
jest.mock('adm-zip', () => {
  return jest.fn().mockImplementation(() => {
    return {
      addLocalFile: jest.fn(),
      writeZip: jest.fn()
    };
  });
});

jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    createWriteStream: jest.fn().mockImplementation(() => {
      const stream = new (require('stream').Writable)({
        write(_chunk: any, _encoding: any, callback: () => void) {
          callback();
        },
      });
      process.nextTick(() => {
        stream.emit('finish');
      });
      return stream;
    }),
  };
});

jest.mock('../src/utils/Logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const s3ClientMock = {
  send: jest.fn(),
};

describe('downloadFileS3 Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should download a file from S3 successfully, log success messages, and zip the file', async () => {
    s3ClientMock.send.mockImplementationOnce(async (command) => {
      if (command instanceof ListBucketsCommand) {
        return { Buckets: [{ Name: 'test-bucket' }] };
      }
    });

    const mockStream = new Readable();
    mockStream.push('file content');
    mockStream.push(null);

    s3ClientMock.send.mockImplementationOnce(async (command) => {
      if (command instanceof GetObjectCommand) {
        return { Body: mockStream };
      }
    });

    await downloadFileS3(s3ClientMock, 'my-bucket', 'my-file.txt', 'local-file.txt');

    expect(logger.info).toHaveBeenCalledWith('Connection Successful');
    expect(logger.info).toHaveBeenCalledWith('Downloaded my-file.txt from my-bucket to local-file.txt');
    expect(logger.info).toHaveBeenCalledWith('File zipped successfully as local-file.txt.zip');
  });

  it('should log an error if S3 connection fails', async () => {
    s3ClientMock.send.mockRejectedValueOnce(new Error('Connection failed'));
    await downloadFileS3(s3ClientMock, 'my-bucket', 'my-file.txt', 'local-file.txt');
    expect(logger.error).toHaveBeenCalledWith('Error checking S3 connection:', expect.any(Error));
  });

  it('should log an error if file download fails', async () => {
    s3ClientMock.send.mockImplementationOnce(async (command) => {
      if (command instanceof ListBucketsCommand) {
        return { Buckets: [{ Name: 'test-bucket' }] };
      }
    });

    s3ClientMock.send.mockRejectedValueOnce(new Error('File not found'));
    await downloadFileS3(s3ClientMock, 'my-bucket', 'non-existent-file.txt', 'local-file.txt');

    expect(logger.error).toHaveBeenCalledWith(
      'Error downloading non-existent-file.txt from my-bucket to local-file.txt:',
      expect.any(Error)
    );
  });
});
