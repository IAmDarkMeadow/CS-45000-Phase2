
/*
 * packageController.ts
 * 
 * Description:
 * Contains the function createMetaData. 
 * This file contains functions for searching through JSON metadata stored in an S3 bucket.
 * The `fetchAndProcessJsonObjectsConcurrently` function allows for concurrent fetching of objects,
 * and the `SearchJSON` and `ListJSON` functions provide operations to search or list metadata.
 * 
 * Jacob created 'fetchAndProcessJsonObjectsConcurrently functions, also the SearchJson and List JSON functions as well
 * 
 * 
 * 
 * Author: Brayden Devenport, Jacob Esparza
 * Date: 12-02-2024
 * Version: 3.2
 * 
 */


import s3Client from '../config/aws-config.js';               // Importing configured AWS S3 client
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'; // Import necessary AWS commands
import { Request, Response } from 'express';                  // Importing Express Request and Response types
import { uploadModuleMetadata } from '../services/s3Service'; // Importing functioni to upload metadata to S3
import { validationResult } from 'express-validator';         // Importinig valiidationResult to validate incominig request
import * as fs from 'fs';                                     // Importing file system module to read file streams
import logger from "../utils/Logger";                                   

// This is for when the metric code is done. 
// import { calculateAndSaveMetrics } from '../utils/metrics';       // Importing function to calculate and store metrics

// Controller function to create module metadata
export const createMetaData = async (req: Request, res: Response) => {
    //Extract metadate fiields from the request body
  const { name, version, description, s3Location, githublink } = req.body;

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
    githublink,
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

// Function to search through metadata JSON for a given expression
async function SearchJSON(metadata: any, expression: string) {
    try {
        // Create a regex from the expression
        const regex = new RegExp(expression, 'i');  // 'i' for case-insensitive search
        let matches: string[] = [];

        // Recursive function to search through metadata
        function search(obj: any) {
            if (typeof obj === 'string' && regex.test(obj)) {
                matches.push(obj);
            } else if (typeof obj === 'object') {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        search(obj[key]);
                    }
                }
            }
        }

        // Start searching
        search(metadata);

        // Log matches found
        if (matches.length > 0) {

            logger.info('Object:' + metadata.toString());
            if (!metadata || !metadata.name || !metadata.version || !metadata.s3location) {
                logger.warn("Missing data in metadata:", metadata);
                return ''; // Return empty string if metadata is incomplete
            }
        
            logger.info('Object:' + metadata.toString());
        
            // Process the metadata
            const HTML = `
              <tr>
                <td>${metadata.name}</td>
                <td>${metadata.version}</td>
                <td>${metadata.description}</td>
                <td>${metadata.s3location}</td>
              </tr>
            `;
        
            return HTML;
        } else {
            logger.info(`No matches found for "${expression}".`);
        }
    } catch (error) {
        logger.error('Error in RegExpSearch:', error);
    }
}

export async function RegExJSON(metadata: any, expression: string) {
    try {
        // Create a regex from the expression
        const regex = new RegExp(expression, 'i');  // 'i' for case-insensitive search
        let matches: string[] = [];

        // Recursive function to search through metadata
        function search(obj: any) {
            if (typeof obj === 'string' && regex.test(obj)) {
                matches.push(obj);
            } else if (typeof obj === 'object') {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        search(obj[key]);
                    }
                }
            }
        }

        // Start searching
        search(metadata);

        // Log matches found
        if (matches.length > 0) {

            return metadata;

        } else {
            return null;
        }
    } catch (error) {
        logger.error('Error in RegExpSearch:', error);
    }
}

// Function that processes metadata from each JSON object
async function ListJSON(metadata: any) {
    logger.info('Object:' + metadata.toString());
    if (!metadata || !metadata.name || !metadata.version || !metadata.s3location) {
        logger.warn("Missing data in metadata:", metadata);
        return ''; // Return empty string if metadata is incomplete
    }
        
    logger.info('Object:' + metadata.toString());
        
    // Process the metadata
    const HTML = `
        <tr>
        <td>${metadata.name}</td>
        <td>${metadata.version}</td>
        <td>${metadata.description}</td>
        <td>${metadata.s3location}</td>
        <td>${metadata.githublink}</td>
        </tr>
    `;
        
    return HTML;
}

// Function to fetch and process JSON objects concurrently from the S3 bucket
async function fetchAndProcessJsonObjectsConcurrently(bucket: string, prefix: string, ProcessJSON: (jsonContent: any) => void) {
    try {
        // Parameters to list all objects with the given prefix in the bucket
        const listParams = {
            Bucket: bucket,
            Prefix: prefix,
        };
        //HTML variable
        let toReturn = '';

        // Create and send a command to list objects in the bucket
        const listCommand = new ListObjectsV2Command(listParams);
        const listedObjects = await s3Client.send(listCommand);

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            logger.info('No objects found.');
            return;
        }

        // Fetch metadata for each listed object concurrently
        const fetchPromises = listedObjects.Contents.map(async (object) => {
            if (object.Key) {
                logger.info('Fetching object:', object.Key);
                const getParams = {
                    Bucket: bucket,
                    Key: object.Key,
                };
                const getCommand = new GetObjectCommand(getParams);
                const data = await s3Client.send(getCommand);

                // Convert the data Body to a string and parse as JSON
                const jsonContent = JSON.parse(await data.Body?.transformToString() || '{}');
                
                // Process the JSON content with the provided function
                const processedJSON = await ProcessJSON(jsonContent);
                toReturn += processedJSON;
                logger.info("Current HTML: " + toReturn);
            }
        });

        // Execute all fetches concurrently
        await Promise.all(fetchPromises);

        return toReturn;
    } catch (error) {
        logger.error('Error fetching or processing objects:', error);
    }
}

// Function to list all modules in the registry
export function ListModules() {
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, ListJSON);
}

// Function to perform a regular expression search on module metadata
export function RegularExpressionSearch(regex: string) {
    logger.info('Starting RegExp Search');
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    const toDeploy = fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, (jsonContent) => SearchJSON(jsonContent, regex));
    return toDeploy;
}

export function RegularExpressionSearchSingle(regex: string) {
    logger.info('Starting RegExp Single Search');
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    const toDeploy = fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, (jsonContent) => RegExJSON(jsonContent, regex));
    return toDeploy;
}

export const uploadPackage = async (req: Request, res: Response) => {
    return 0
}

logger.info('Results: ', RegularExpressionSearch('test'));