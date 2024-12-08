/*
 * s3Sercise.ts
 * 
 * Description:
 * Ensure that your AWS credentials are correctly set up.
 * 
 * Author: Brayden Devenport
 * Date: 12-01-2024
 * Version: 1.0
 * 
 */
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

//
//Setting up all the environment variables
//

const access_key = process.env.AWS_ACCESS_KEY_ID;
const secret_access_key = process.env.AWS_SECRET_ACCESS_KEY;
const aws_region = process.env.AWS_REGION;

//
//Setting up the S3Client
//

const s3Client = new S3Client({
  region: aws_region, 
  credentials: {
    accessKeyId: access_key!,
    secretAccessKey: secret_access_key!,
  },
});

// Export s3Client so that we can just call this to set up S3Client up
export default s3Client;
