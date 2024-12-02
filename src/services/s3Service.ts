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

import logger from "../utils/Logger.js"; // For Error handling
import s3Client from '../config/aws-config.js';
import { PutObjectCommand, GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
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

// Funtion to upload the module metadata to S3 as a JSON file

async function uploadModuleMetadata(moduleMetadata: ModuleMetadata): Promise<void> {
    // Get the S3 bucket name from environment variables
    const bucketName = process.env.S3_BUCKET_NAME!; 

    if (!bucketName) {
        // I do not know if this will work without the try/catch commands. 
        logger.error(`S3_BUCKET_NAME is not defined in the environment variables.`, error)
    } 

    // Create a metadata file name based on the module name and version
    const metadataFileName = `ModuleMetadata/${moduleMetadata.name}-${moduleMetadata.version}.json`;

    // Convert the module metadata to JSON string
    const jsonMetadata = JSON.stringify(moduleMetadata, null, 2);

    // Define the parameters for the S3 upload
    const params = {
        Bucket: bucketName,             // S3 bucket name
        Key: metadataFileName,          // S3 object key (filename)
        Body: jsonMetadata,             // Content of the file (JSON)
        ContentType: 'application/json',// Specify content type as JSON
    };

    // Create an S3 PutObjectCommand with the defined parameters
    const command = new PutObjectCommand(params);


    try {

        // Send the upload command to S3
        await s3Client.send(command);

        logger.info(`Successfully uploaded metadata for ${moduleMetadata.name} to S3!`);

    } catch (error) {

        logger.error(`Error uploading metadata for ${moduleMetadata.name}:`, error);
        //throw error;
    }
};