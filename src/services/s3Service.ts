//s3Sercise.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const access_key = process.env.Your_access_key;
const secret_access_key = process.env.Your_Secret_access_key;

const s3Client = new S3Client({
  region: 'us-east-2', // e.g., 'us-east-2'
  credentials: {
    accessKeyId: access_key!,
    secretAccessKey: secret_access_key!,
  },
});

const BUCKET_NAME = 'registry-storage';

export const uploadToS3 = async (fileBuffer: Buffer, key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/zip',
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw error;
  }
};

export const downloadFromS3 = async (key: string): Promise<NodeJS.ReadableStream> => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    if (!data.Body) {
      throw new Error('File not found in S3.');
    }

    return data.Body as NodeJS.ReadableStream;
  } catch (error) {
    console.error('S3 Download Error:', error);
    throw error;
  }
};