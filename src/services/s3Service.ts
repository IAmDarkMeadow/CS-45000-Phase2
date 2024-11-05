import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: 'your-region', // e.g., 'us-east-1'
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
});

const BUCKET_NAME = 'your-bucket-name';

export const uploadToS3 = async (fileBuffer: Buffer, key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/zip',
  };

  await s3.putObject(params).promise();
};
