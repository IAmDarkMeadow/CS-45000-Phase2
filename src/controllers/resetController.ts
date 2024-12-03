/*
 * resetController.ts
 * 
 * Description:
 * This file contains functions that reset an S3 bucket by deleting all objects and recreating necessary folders.
 * The S3 client is configured centrally and imported for consistency.
 * The function was created by Jacob Esparza then Brayden Devenport made it modular. 
 * 
 * Author: Jacob Esparza, Brayden Devenport
 * Date: 12-02-2024
 * Version: 2.0
 * 
 */



import logger from "../utils/Logger.js"; // For Error handling
import { Request, Response } from 'express';
import s3Client from '../config/aws-config.js';
import { ListObjectsV2Command, DeleteObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';

// Function to delete all files and folders in a bucket
async function deleteAllObjectsInBucket(bucketName: string): Promise<void> {
    try {
      // List all objects in the bucket
      let isTruncated = true;
      let marker: string | undefined;
      
      while (isTruncated) {
        // Get a list of objects in the bucket
        const listparams = {
          Bucket: bucketName,
          ContinuationToken: marker,
        };

        //
        // Updated code to make the code modular from ResetRegistry.ts
        //
        const listCommand = new ListObjectsV2Command(listparams);
        const listObjectsResponse = await s3Client.send(listCommand); // Send command to get objects
        
        // Check if there are objects to delete
        if (listObjectsResponse.Contents && listObjectsResponse.Contents.length > 0) {

          // Delete all the objects in the current response
          //
          // Updated code
          //
          const deleteParams = {
            Bucket: bucketName,
            Delete: {
              Objects: listObjectsResponse.Contents.map(object => ({ Key: object.Key! })),
            },
          };
  
          // Perform the deletion
          const deleteCommand = new DeleteObjectsCommand(deleteParams);
          await s3Client.send(deleteCommand); // Send command to delete objects
          console.log(`Deleted ${listObjectsResponse.Contents.length} objects.`);
        }

        isTruncated = listObjectsResponse.IsTruncated || false;
        marker = listObjectsResponse.NextContinuationToken;
      }
  
      console.log('All objects deleted.');
    } catch (error) {
      console.error('Error deleting objects:', error);
      throw error;
    }
  }
// Function to create a "folder" in the S3 bucket
async function createFolderInS3(bucketName: string, folderName: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: folderName.endsWith('/') ? folderName : `${folderName}/`, // Ensure the folder name ends with a slash
      Body: '', // The folder is an empty object
    };

    // Updated code
    const command = new PutObjectCommand(params);
  
    try {

      // Send Command to create the folder
      await s3Client.send(command);
      console.log(`Folder "${folderName}" created successfully in the bucket "${bucketName}".`);
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error; // Throw error to fbe handled by calling function
    }
  }
export async function ResetRegistry (){
    // Usage example:
    const bucketName = 'registry-storage';
    const folderName = 'ModuleMetadata'; // Name of the folder you want to create
    const folderName2 = 'Modules'; // Name of the folder you want to create

    try {
        // First, delete all objects in the bucket
        await deleteAllObjectsInBucket(bucketName);
    
        // Then, create the first folder
        await createFolderInS3(bucketName, folderName);
    
        // Finally, create the second folder
        await createFolderInS3(bucketName, folderName2);
    
        console.log('All operations completed successfully.');
      } catch (error) {
        console.error('Error in operations:', error);
      }
}