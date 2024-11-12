//s3Sercise.ts
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const access_key = process.env.Your_access_key;
const secret_access_key = process.env.Your_Secret_access_key;

const s3 = new AWS.S3({
  region: 'us-east-2', // e.g., 'us-east-1'
  accessKeyId: access_key,
  secretAccessKey: secret_access_key,
});

//Updated with BUCKET_Name

const BUCKET_NAME = 'registry-storage';

export const uploadToS3 = async (fileBuffer: Buffer, key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/zip',
  };

  await s3.putObject(params).promise();
};
