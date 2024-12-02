/*
 * upload-config.ts
 * 
 * Description:
 * This file is responsible for configuring the fifle upload process using Multer and integrating it with Amazon S3. 
 * 
 * Author: Brayden Devenport
 * Date: 12-01-2024
 * Version: 1.0
 * 
 */

// Importing necessary libraries
//
import { Request } from 'express'; // Import Request type from Express to extend it
import multer from 'multer';  // Middleware for handling file upload
import multerS3 from 'multer-s3'; // Integration of multer with AWS S3 for direct upload
import s3Client from './aws-config'; // AWS S3 client configuration
import logger from '../utils/Logger.js'; //For debug purposes



// Defining a custom interface that extends Express' Request type
// This allows TypeScript to recognize the structure of 'req.body' and prevent errors
interface CustomRequest extends Request {
    body: {
      name: string; // Package name extracted from the request body
      version: string; // Version number extracted from the request body
    };
  }

// Setting up the upload configuration
const upload = multer({
    // Configuring storage to use AWS S3
    storage: multerS3({
      s3: s3Client, 
      bucket: 'registry-storage', 
      // Create a key (file path) for the file in the S3 bucket
      key: function (req: CustomRequest, file, cb) {
        try {
            //
            // Loggin that the key generation process has started
            //
            logger.info('Generating key for the file to be uploaded to S3');

            const packageName = req.body.name; 
            const version = req.body.version; 
            
            // Constructing the file path
            // Modules is folder name in bucket
            const fileName = `Modules/${packageName}/${version}/${file.originalname}`; 

            // Logging successful key generation
            logger.info(`File key generated: ${fileName}`);

            cb(null, fileName); // Pass the file path to multer
        } catch (error) { 
            // Loggiing any errors encountered during key generation
            logger.error(`Error generating file key: `, error);
            cb(error as Error);
        }
      },
    }),
    // Define file filtering rules
    fileFilter: function (req, file, cb) {
        try{ 

            // Logging that file filter is running
            logger.info(`Filtering file: ${file.originalname} with type: ${file.mimetype}`); 

            // Allow only zip files
            if (file.mimetype === 'application/zip') {
                // Log successful file filter check
                logger.info(`File ${file.originalname} is accepted for upload.`);
            
                cb(null, true); // Accept the file
             } else {
                // Log file rejection
                logger.warn(`File ${file.originalname} rejected: Only zip files are allowed.`);

                cb(new Error('Only zip files are allowed')); // Reject other file types
            }
        } catch (error) {

            // Logging any errors encountered during file filtering
            logger.error(`Error filtering file:`,error);

            cb(error as Error);
        }
    },
    // Set limits on the uploaded file
    // Maximum file size: 10 MB
    limits: { fileSize: 10 * 1024 * 1024 }, 
  });
  
  // Log that the upload configuration is successfully set up
  logger.info('Upload configuration initialized successfully');

  // Export the configured upload object
  export default upload;
