/*
 * resetController.ts
 * 
 * Description:
 * This file contains the functions that have connect to the S3 service.
 * This file contains the downloadFileS3 that Grayson created. 
 * It also contains the uploadModuleMetadata that Jacob Esparza created. 
 * 
 * Author: Jacob Esparza, Brayden Devenport
 * Date: 12-02-2024
 * Version: 1.0
 * 
 */



import logger from "../utils/Logger.js"; // For Error handling
import { Request, Response } from 'express';
import s3Client from '../config/aws-config.js';
import { ListObjectsV2Command, DeleteObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export const resetRegistry = async (req: Request, res: Response) => {
  const bucketName = process.env.S3_BUCKET_NAME!;
  const folderNames = ['metadata/', 'packages/'];

  try {
    // Delete all objects in the bucket
    await deleteAllObjectsInBucket(bucketName);

    // Recreate required folders
    for (const folderName of folderNames) {
      await createFolderInS3(bucketName, folderName);
    }

    res.status(200).json({ message: 'Registry reset successfully.' });
  } catch (error) {
    res.status(500).json({ error: `Error resetting registry: ${error.message}` });
  }
};

const deleteAllObjectsInBucket = async (bucketName: string): Promise<void> => {
  try {
    let continuationToken;
    do {
      const listParams = {
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      };
      const listCommand = new ListObjectsV2Command(listParams);
      const data = await s3Client.send(listCommand);

      const objects = data.Contents?.map((obj) => ({ Key: obj.Key! })) || [];
      if (objects.length > 0) {
        const deleteParams = {
          Bucket: bucketName,
          Delete: { Objects: objects },
        };
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await s3Client.send(deleteCommand);
        console.log(`Deleted ${objects.length} objects.`);
      }

      continuationToken = data.NextContinuationToken;
    } while (continuationToken);
  } catch (error) {
    console.error('Error deleting objects:', error);
    throw error;
  }
};

const createFolderInS3 = async (bucketName: string, folderName: string): Promise<void> => {
  const params = {
    Bucket: bucketName,
    Key: folderName,
    Body: '',
  };
  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    console.log(`Folder "${folderName}" created successfully in the bucket "${bucketName}".`);
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};
