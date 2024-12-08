import {downloadFileS3} from './Download';
import logger from "./utils/Logger" ;
//compares server metadata file hash

//updates are not automatic, and update acts as a repair function
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto'; // You can also use crypto-js if using browser-based code
import * as AWS from 'aws-sdk';
import { Readable } from 'stream';
import { S3Client } from '@aws-sdk/client-s3';

//import { S3Client, GetObjectCommand,ListBucketsCommand,S3  } from '@aws-sdk/client-s3';
// Function to calculate file hash
function calculateFileHash(filePath: string): string {
    if (fs.existsSync(filePath)) {
        const hash = crypto.createHash('SHA256');
        const fileBuffer = fs.readFileSync(filePath); // Read the file as buffer
        hash.update(fileBuffer);
    return hash.digest('hex');
      } else {
        return "2";
      }
    
}
//A
//hallucination
//import * as crc64 from 'crc64'
/*const calculateCRC64 = (filePath: string): string => {

    if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath); // Read file content into buffer
        const hash = crc64(fileBuffer);  // Calculate CRC64 hash
        return hash.toString(16);  // Return as hex string
      } else {
        return "2";
      }
  };*/

// Function to compare local file hash with server file hash (thanks gpt)
async function compareFiles(localFilePath: string, serverFileHash: string ): Promise<boolean> {
    try {
        const localFileHash = calculateFileHash(localFilePath);
        logger.info(`Local file hash: ${localFileHash}, Server file hash: ${serverFileHash}`);
        console.log(`Local file hash: ${localFileHash}, Server file hash: ${serverFileHash}`);
        // Compare local file hash with server file hash
        if (localFileHash !== serverFileHash) {
            logger.info("File has changed. Need to download.");
            console.log("File has changed. Need to download.");
            return true; // File needs to be downloaded
        } else {
            logger.info("File is up to date.");
            console.log("File is up to date.");
            return false; // File is up to date
        }
    } catch (error) {
        logger.error("Error comparing files: ", error);
        console.error("Error comparing files: ", error);
        return false;
    }
}

/*async function getS3FileETag(s3Client: {headObject(fileParams: { Bucket: string; Key: string; }): unknown; send: (arg0: any) => any; },bucket: string, key: string): Promise<string > {
    try {
        const fileParams = { Bucket: bucket, Key: key };
        const headResponse = await s3Client.headObject(fileParams).promise();
        return headResponse.ETag || null; // ETag is returned in double quotes, so remove quotes if needed
    } catch (error) {
        logger.error("Error fetching ETag:", error);
        console.error("Error fetching ETag:", error);
        return '-1';
    }
}*/




export async function compareUpdate(accessKey:string, secretKey:string, bucketName:string, fileKey:string, local:string){
    //may not be needed, but checks config and updates
    AWS.config.update({
        region:'us-east-2',
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });
    let s3Client = new S3Client({
        region:'us-east-2',
        //endpoint:serverLink,
        credentials:{
            accessKeyId:accessKey,
            secretAccessKey:secretKey
        }
    });
    let s3 = new AWS.S3();
    const fileParams = { Bucket: bucketName, Key: fileKey };
    const headResponse = await s3.headObject(fileParams).promise();
    let serverFileHash  = headResponse.ETag;
    if (serverFileHash == undefined)
    serverFileHash = '0';
    serverFileHash.replace("\"", "");
    
    /*const data = await s3.getObject(fileParams).promise();
    */let hash = crypto.createHash('SHA256');
   /* hash.update();
    
    let serverFileHash = hash.digest('hex');
    */
    if (serverFileHash==undefined)
        serverFileHash = '0';
    compareFiles(local, serverFileHash).then(needsDownload => {
        if (needsDownload) {
            downloadFileS3(s3Client,bucketName, fileKey,local);
            logger.info(`Download the file. from ${fileKey} to ${local}`);
            console.log(`Download the file. from ${fileKey} to ${local}`);
        } else {
            logger.info(`No download needed. ${fileKey} to ${local}`);
            console.log(`No download needed. ${fileKey} to ${local}`);
        }
    });
    

}