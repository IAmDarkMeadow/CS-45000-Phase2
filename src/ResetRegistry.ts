/*
 *  ResetRegistry.ts
 *  
 *  All functions are in /src/controllers/resetController.ts
 * 
 *  When I converted this code over to resetController I made it so that it is modular
 *  and you will not need const s3 = new AWS.S3() to make s3 default. 
 *  
 * Description: This is basically a guide to see where I put certian functions from this file
 *  so that if you. I did this to make the project modular and scalar so that it would be easier to decode.
 * 
 *  Author: Jacob Esparza
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-02-2024
 *  Version: 0.5
 *   
 */







import * as AWS from 'aws-sdk';

// Initialize the S3 client
const s3 = new AWS.S3();

// Function to delete all files and folders in a bucket
async function deleteAllObjectsInBucket(bucketName: string): Promise<void> {
  try {
    // List all objects in the bucket
    let isTruncated = true;
    let marker: string | undefined;
    
    while (isTruncated) {
      // Get a list of objects in the bucket
      const params: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        ContinuationToken: marker,
      };

      const listObjectsResponse = await s3.listObjectsV2(params).promise();
      isTruncated = listObjectsResponse.IsTruncated || false;
      marker = listObjectsResponse.NextContinuationToken;

      if (listObjectsResponse.Contents) {
        // Delete all the objects in the current response
        const deleteParams: AWS.S3.DeleteObjectsRequest = {
          Bucket: bucketName,
          Delete: {
            Objects: listObjectsResponse.Contents.map(object => ({ Key: object.Key! })),
          },
        };

        // Perform the deletion
        await s3.deleteObjects(deleteParams).promise();
        console.log(`Deleted ${listObjectsResponse.Contents.length} objects.`);
      }
    }

    console.log('All objects deleted.');
  } catch (error) {
    console.error('Error deleting objects:', error);
  }
}

// Function to create a "folder" in the S3 bucket
async function createFolderInS3(bucketName: string, folderName: string): Promise<void> {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: folderName.endsWith('/') ? folderName : `${folderName}/`, // Ensure the folder name ends with a slash
    Body: '', // The folder is an empty object
  };

  try {
    // Upload an empty object to create the folder
    await s3.putObject(params).promise();
    console.log(`Folder "${folderName}" created successfully in the bucket "${bucketName}".`);
  } catch (error) {
    console.error('Error creating folder:', error);
  }
}

async function ResetRegistry(){
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

ResetRegistry();


