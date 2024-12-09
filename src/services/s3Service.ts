/* 
 * s3Service.ts
 * 
 * Description:
 * This file contains the functions that have connect to the S3 service.
 * This file contains the downloadFileS3 that Grayson created. 
 * It also contains the uploadModuleMetadata that Jacob Esparza created. 
 * 
 * Author: Grayson DeHerdt, Brayden Devenport, Jacob Esparza
 * Date: 12-02-2024
 * Version: 1.1
 * 
 */

import logger from "../utils/Logger"; // For Error handling
import s3Client from '../config/aws-config';
import { PutObjectCommand, GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { createWriteStream, createReadStream } from 'fs';
import { Readable } from 'stream';
import dotenv from 'dotenv'; // For protected enviroment Variables

dotenv.config();


//
// Grayson DeHerdt downloadFileS3 function
// Updated code since I have s3Client function already made in aws-confiig.ts
// All I did was remove (s3Client: { send: (arg0: any) => any; } from function definition
//
export async function downloadFileS3(bucketName:string, fileKey:string, localPath:string) {
    

    try {
        await s3Client.send(new ListBucketsCommand({}));
        logger.info(`Connection Successful`)
      } catch (error) {
        logger.error("Error checking S3 connection:", error);
      }

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
    });

    try {
        const data = await s3Client.send(command);
        const readableStream = data.Body as Readable;
        const writeStream = createWriteStream(localPath);

        readableStream.pipe(writeStream);
        writeStream.on('finish', () => {
            writeStream._destroy  //dont wanna leave it open
            logger.info(`Downloaded ${fileKey} from ${bucketName} to ${localPath}`)
           });
    } catch (error) {
        logger.error(`Error downloading ${fileKey} from ${bucketName} to ${localPath}:`, error);
    }
};


//
// Jacob Esparza's uploadModuleMetadata with some updates based on my packageModel.ts file
//
// Updated by Brayden
//

import { ModuleMetadata } from '../models/packageModel.js';  // Importing the ModuleMetadata interfacce for type safety
import { error } from "console";
import path from "path";

// Funtion to upload the module metadata to S3 as a JSON file

export async function uploadModuleMetadata(moduleMetadata: ModuleMetadata): Promise<void> {
  const bucketName = process.env.S3_BUCKET_NAME!; 

  if (!bucketName) {
      logger.error(`S3_BUCKET_NAME is not defined in the environment variables.`);
      throw new Error('S3_BUCKET_NAME is not defined'); // Ensure the function fails here
  } 

  const metadataFileName = `ModuleMetadata/${moduleMetadata.name}-${moduleMetadata.version}.json`;
  const jsonMetadata = JSON.stringify(moduleMetadata, null, 2);

  const params = {
      Bucket: bucketName,
      Key: metadataFileName,
      Body: jsonMetadata,
      ContentType: 'application/json',
  };

  const command = new PutObjectCommand(params);

  try {
      await s3Client.send(command);
      logger.info(`Successfully uploaded metadata for ${moduleMetadata.name} to S3!`);
  } catch (error) {
      logger.error(`Error uploading metadata for ${moduleMetadata.name}:`, error);
      throw error; // rethrow so the promise rejects
  }
}


// Upload to S3 function

export async function uploadToS3(filePath: string, bucketName: string, keyPrefix: string): Promise<string> {
  // Create a readable stream from the file path
  const fileStream = createReadStream(filePath);
  const fs = await import('fs');
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const key = `${keyPrefix}/${fileName}`;


  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    const s3Location = `s3://${bucketName}/Modules/${key}`;
    logger.info(`File uploaded successfully to ${s3Location}`);
    return s3Location;
  } catch (error) {
    logger.error(`Error uploading file to S3:`, error);
    throw error;
  }
}
 