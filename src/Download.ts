/*
 *  Download.ts
 *  Description: This is basically a guide to see where I put certian functions from this file
 *  so that if you. I did this to make the project modular and scalar so that it would be easier to decode.
 * 
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
import logger from "../src/utils/Logger.js";
//idk how we are storing these yet
const host = 'your-ec2-public-dns';
const username = 'ec2-user'; 
const privateKeyPath = '/path/to/your-key.pem';
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


//
// The DownloadFileS3 is currently in the src/services/s3Service.ts
// 
export async function downloadFileS3(s3Client: { send: (arg0: any) => any; }, bucketName:string, fileKey:string, local:string) {
    

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
        const writeStream = createWriteStream(local);
        readableStream.pipe(writeStream);
        writeStream.on('finish', () => {
            writeStream._destroy  //dont wanna leave it open
            logger.info(`Downloaded ${fileKey} from ${bucketName} to ${local}`)
           });
    } catch (error) {
        logger.error(`Error downloading ${fileKey} from ${bucketName} to ${local}:`, error);
    }
};




//this runs on server
//zips file found after locating through index