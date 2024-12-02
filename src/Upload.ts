// src/Upload.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import logger from './utils/Logger';
import dotenv from 'dotenv';

dotenv.config();

//
//Setting up all the environment variables
//

const access_key = process.env.AWS_ACCESS_KEY_ID;
const secret_access_key = process.env.AWS_SECRET_ACCESS_KEY;
const aws_region = process.env.AWS_REGION;


const s3Client = new S3Client({
    region: aws_region, 
    credentials: {
      accessKeyId: access_key!,
      secretAccessKey: secret_access_key!,
    },
  });
  

  export async function uploadFileToS3(filePath: string, key: string): Promise<void> {
    try {
      const fileStream = fs.createReadStream(filePath);
  
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: fileStream,
      };
  
      await s3Client.send(new PutObjectCommand(uploadParams));
      logger.info(`Uploaded ${filePath} to s3://${uploadParams.Bucket}/${key}`);
    } catch (error) {
      logger.error(`Error uploading file to S3: ${error}`);
      throw error;
    }
  }