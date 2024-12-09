/*
 *  Download.ts
 *  Description: Clientside download function to download modules from the server. The two functions 
 *  can be broken down as a download from S2 (using a s2client object, bucket name, client, and location
 *   on client.
 *  Second function Zips one location and moves it to another
 *  Author: Grayson DeHerdt
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-02-2024
 *  Version: 0.5
 *   
 */
import logger from "./utils/Logger";
var AdmZip = require("adm-zip");

import { S3Client, GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const zipFile = (downloadPath:string, zipPath:string) => {
  const zip = new AdmZip();
  zip.addLocalFile(downloadPath);
  zip.writeZip(zipPath);
  console.log(`File zipped successfully as ${zipPath}`);
  logger.info(`File zipped successfully as ${zipPath}`);
};
export async function downloadFileS3(s3Client: {send: (arg0: any) => any; }, bucketName:string, fileKey:string, local:string) {
    
    try {
        await s3Client.send(new ListBucketsCommand({}));
        logger.info(`Connection Successful`);
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
        const writeStream = createWriteStream(local);
        readableStream.pipe(writeStream);
        writeStream.on('finish', () => {
             //dont wanna leave it open
            logger.info(`Downloaded ${fileKey} from ${bucketName} to ${local}`);
           });
           writeStream._destroy;
    } catch (error) {
        logger.error(`Error downloading ${fileKey} from ${bucketName} to ${local}:`, error);
    }
    let localZip = local + ".zip";
    zipFile(local, localZip);
};
