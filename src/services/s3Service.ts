/*
 * s3Service.ts
 * 
 * Description:
 * This file contains the downloadFileS3 that Grayson created. Basic download script with error for no connect, 
 * needs true source and download location this runs on the client
 * 
 * Author: Grayson DeHerdt, Brayden Devenport
 * Date: 12-02-2024
 * Version: 1.0
 * 
 */

import logger from "../utils/Logger.js";
import s3Client from '../config/aws-config.js';
import { GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';


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

//this runs on server
//zips file found after locating through index