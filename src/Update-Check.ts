import {downloadFileS3} from './Download';
import logger from "./utils/Logger" ;
//compares server metadata file hash

//updates are not automatic, and update acts as a repair function
import * as fs from 'fs';
import * as crypto from 'crypto'; // You can also use crypto-js if using browser-based code
import * as AWS from 'aws-sdk';
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

// Function to compare local file hash with server file hash (thanks gpt)
async function compareFiles(localFilePath: string, serverFileHash: string ): Promise<boolean> {
    try {
        const localFileHash = calculateFileHash(localFilePath);
        logger.info(`Local file hash: ${localFileHash}, Server file hash: ${serverFileHash}`);
        // Compare local file hash with server file hash
        if (localFileHash !== serverFileHash) {
            logger.info("File has changed. Need to download.");
            return true; // File needs to be downloaded
        } else {
            logger.info("File is up to date.");
            return false; // File is up to date
        }
    } catch (error) {
        logger.error("Error comparing files: ", error);
        return false;
    }
}

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
    
    let hash = crypto.createHash('SHA256');
  
    if (serverFileHash==undefined)
        serverFileHash = '0';
    compareFiles(local, serverFileHash).then(needsDownload => {
        if (needsDownload) {
            downloadFileS3(s3Client,bucketName, fileKey,local);
            logger.info(`Download the file. from ${fileKey} to ${local}`);
        } else {
            logger.info(`No download needed. ${fileKey} to ${local}`);
        }
    });
    

}