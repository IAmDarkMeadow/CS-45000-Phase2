/*
 * packageController.ts
 * 
 * Description:
 * This file contains the controller responsible for handling requests related to package metadata.
 * Specifically, it handles creating new metadata entries by validating the incoming data, and 
 * then uploading the metadata as a JSON file to an Amazon S3 bucket. This controller is part of
 * the module registry system, which allows users to manage module metadata in the cloud.
 * 
 * Author: Brayden Devenport
 * Date: 12-02-2024
 * Version: 2.0
 * 
 */






import { Request, Response } from 'express';                  // Importing Express Request and Response types
import { uploadModuleMetadata } from '../services/s3Service'; // Importing functioni to upload metadata to S3
import { validationResult } from 'express-validator';         // Importinig valiidationResult to validate incominig request


// Controller function to create module metadata
export const createMetaData = async (req: Request, res: Response) => {
    //Extract metadate fiields from the request body
  const { name, version, description, s3Location } = req.body;

  // Validate request data 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If validation fails, return a 400 Bad Request response with the error details
    return res.status(400).json({ errors: errors.array() });
  }

  // Create an object with the extracted metadata fields
  const moduleData = {
    name,          // Name of the module/package
    version,       // Version of the module/package
    description,   // Description of the module/package (optional)
    s3Location,    // Location of the module/package in Amazon S3 (optional)
  };

  try {
    // Upload metadata to S3
    await uploadModuleMetadata(moduleData);

    // Respond with a 201 Created status if upload is successful
    res.status(201).json({ message: `Successfully uploaded metadata for ${name}` });
  } catch (error) {
    // If any error occurs during the upload, respond with a 500 Internal Server Error status
    res.status(500).json({ error: `Error uploading metadata for ${name}:` });
  }
};
