"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPackage = exports.createMetaData = void 0;
exports.ListModules = ListModules;
exports.RegularExpressionSearch = RegularExpressionSearch;
const aws_config_js_1 = __importDefault(require("../config/aws-config.js")); // Importing configured AWS S3 client
const client_s3_1 = require("@aws-sdk/client-s3"); // Import necessary AWS commands
const s3Service_1 = require("../services/s3Service"); // Importing functioni to upload metadata to S3
const express_validator_1 = require("express-validator"); // Importinig valiidationResult to validate incominig request
const Logger_1 = __importDefault(require("../utils/Logger"));
// This is for when the metric code is done. 
// import { calculateAndSaveMetrics } from '../utils/metrics';       // Importing function to calculate and store metrics
// Controller function to create module metadata
const createMetaData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Extract metadate fiields from the request body
    const { name, version, description, s3Location, githublink } = req.body;
    // Validate request data 
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // If validation fails, return a 400 Bad Request response with the error details
        return res.status(400).json({ errors: errors.array() });
    }
    // Create an object with the extracted metadata fields
    const moduleData = {
        name, // Name of the module/package
        version, // Version of the module/package
        description, // Description of the module/package (optional)
        s3Location, // Location of the module/package in Amazon S3 (optional)
        githublink,
    };
    try {
        // Upload metadata to S3
        yield (0, s3Service_1.uploadModuleMetadata)(moduleData);
        // Respond with a 201 Created status if upload is successful
        res.status(201).json({ message: `Successfully uploaded metadata for ${name}` });
    }
    catch (error) {
        // If any error occurs during the upload, respond with a 500 Internal Server Error status
        res.status(500).json({ error: `Error uploading metadata for ${name}:` });
    }
});
exports.createMetaData = createMetaData;
// Function to search through metadata JSON for a given expression
function SearchJSON(metadata, expression) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a regex from the expression
            const regex = new RegExp(expression, 'i'); // 'i' for case-insensitive search
            let matches = [];
            // Recursive function to search through metadata
            function search(obj) {
                if (typeof obj === 'string' && regex.test(obj)) {
                    matches.push(obj);
                }
                else if (typeof obj === 'object') {
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
                Logger_1.default.info('Object:' + metadata.toString());
                if (!metadata || !metadata.name || !metadata.version || !metadata.s3location) {
                    Logger_1.default.warn("Missing data in metadata:", metadata);
                    return ''; // Return empty string if metadata is incomplete
                }
                Logger_1.default.info('Object:' + metadata.toString());
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
            }
            else {
                Logger_1.default.info(`No matches found for "${expression}".`);
            }
        }
        catch (error) {
            Logger_1.default.error('Error in RegExpSearch:', error);
        }
    });
}
// Function that processes metadata from each JSON object
function ListJSON(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
// Function to fetch and process JSON objects concurrently from the S3 bucket
function fetchAndProcessJsonObjectsConcurrently(bucket, prefix, ProcessJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Parameters to list all objects with the given prefix in the bucket
            const listParams = {
                Bucket: bucket,
                Prefix: prefix,
            };
            //HTML variable
            let toReturn = '';
            // Create and send a command to list objects in the bucket
            const listCommand = new client_s3_1.ListObjectsV2Command(listParams);
            const listedObjects = yield aws_config_js_1.default.send(listCommand);
            if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
                Logger_1.default.info('No objects found.');
                return;
            }
            // Fetch metadata for each listed object concurrently
            const fetchPromises = listedObjects.Contents.map((object) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (object.Key) {
                    Logger_1.default.info('Fetching object:', object.Key);
                    const getParams = {
                        Bucket: bucket,
                        Key: object.Key,
                    };
                    const getCommand = new client_s3_1.GetObjectCommand(getParams);
                    const data = yield aws_config_js_1.default.send(getCommand);
                    // Convert the data Body to a string and parse as JSON
                    const jsonContent = JSON.parse((yield ((_a = data.Body) === null || _a === void 0 ? void 0 : _a.transformToString())) || '{}');
                    // Process the JSON content with the provided function
                    const processedJSON = yield ProcessJSON(jsonContent);
                    toReturn += processedJSON;
                    Logger_1.default.info("Current HTML: " + toReturn);
                }
            }));
            // Execute all fetches concurrently
            yield Promise.all(fetchPromises);
            return toReturn;
        }
        catch (error) {
            Logger_1.default.error('Error fetching or processing objects:', error);
        }
    });
}
// Function to list all modules in the registry
function ListModules() {
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, ListJSON);
}
// Function to perform a regular expression search on module metadata
function RegularExpressionSearch(regex) {
    Logger_1.default.info('Starting RegExp Search');
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    const toDeploy = fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, (jsonContent) => SearchJSON(jsonContent, regex));
    return toDeploy;
}
const uploadPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return 0;
});
exports.uploadPackage = uploadPackage;
// //
// // The upload Function
// // Will need updated once Debloat, and metrics are done 
// // Need to create savePackageMetadata, uploadToS3, debloatPackage, calculateAndSaveMetrics Next time
// export const uploadPackage = async (req: Request, res: Response) => {
//     // Validate request data using express-validator
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       // If validation fails, return a 400 Bad Request response with the error details
//       return res.status(400).json({ errors: errors.array() });
//     }
//     // Extract information from the request body and file
//     const { name, version, debloat } = req.body;                  
//     let fileKey = req.file?.key;                                    
//     let filePath = req.file?.path;                                 
//     // Debloat features blow
//     // If need to update Debloat 
//     try {
//       // If debloat is set to 'true' and the filePath is available, debloat the package
//       if (debloat === 'true' && filePath) {
//         // Debloat the package using the debloat service
//         const debloatedFilePath = await debloatPackage(filePath);
//         // Re-upload the debloated package to S3
//         const uploadParams = {
//           Bucket: process.env.S3_BUCKET_NAME!,                      // Bucket name from environment variables
//           Key: fileKey!,                                            // Key to identify the package in S3
//           Body: fs.createReadStream(debloatedFilePath),             // Reading the debloated package file as a stream
//         };
//         await uploadToS3(uploadParams);                             // Upload the debloated package to S3
//       }
//       // Save the package metadata to the database or other storage
//       await savePackageMetadata({
//         name,
//         version,
//         s3Key: fileKey!,                                            // Metadata includes the name, version, and S3 key of the package
//       });
//       // Need updated when metric functions are working
//       //
//       // Calculate and store relevant metrics for the package
//       // Perform the analysis on the uploaded package
//       //
//       //await calculateAndSaveMetrics(name, version);                
//       //
//       // Send a success response to the client
//       res.status(201).json({ message: 'Package uploaded successfully' });
//     } catch (error) {
//       // If an error occurs, respond with a 500 Internal Server Error status and an error message
//       res.status(500).json({ error: `Failed to upload package: ${error.message}` });
//     }
//   };
//# sourceMappingURL=packageController.js.map