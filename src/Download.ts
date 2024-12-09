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




//Basic download script, needs true source and download location
//this runs on the client
//EC2


import { NodeSSH } from 'node-ssh';
import * as fs from 'fs';

import logger from "./utils/Logger";
var AdmZip = require("adm-zip");
//idk how we are storing these yet
//const remoteFilePath = '/path/to/remote/file';
//const localFilePath = './downloaded-file';

//export async function downloadFileEC2 (remoteFilePath:string, localFilePath:string) {
//    const ssh = new NodeSSH();
//    try {
//        await ssh.connect({
//            host,
//            username,
//            privateKey: privateKeyPath,
//        });
//
//        const remoteFile = await ssh.getFile(localFilePath, remoteFilePath);
//        console.log(`Downloaded ${remoteFilePath} to ${localFilePath}`);
//    } catch (error) {
//        console.error('Error downloading file:', error);
//    } finally {
//        ssh.dispose();
//    }
//};




import { S3Client, GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

//const bucketName = 'your-bucket-name'; what the bucket is
//const fileKey = 'your-file.txt'; the file name
//const localPath = './your-file.txt'; where to send (can be ./ or full path)
//const s3Client = new S3Client({ region: 'your-region' });


//need to have a active S3Client unit set up like
//const s3Client = new S3Client({ region: 'your-region' });
//const s3client = new S3Client({region:'region', credentals: 'credentals'}) etc etc

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




//this runs on server
//zips file found after locating through index


