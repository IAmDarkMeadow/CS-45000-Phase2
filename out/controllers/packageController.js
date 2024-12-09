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
exports.ListModules = ListModules;
exports.RegularExpressionSearch = RegularExpressionSearch;
const aws_config_js_1 = __importDefault(require("../config/aws-config.js")); // Importing configured AWS S3 client
const client_s3_1 = require("@aws-sdk/client-s3"); // Import necessary AWS commands
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
                console.log(`Matches for "${expression}":`, matches);
            }
            else {
                console.log(`No matches found for "${expression}".`);
            }
        }
        catch (error) {
            console.error('Error in RegExpSearch:', error);
        }
    });
}
// Function that processes metadata from each JSON object
function ListJSON(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        // Process the metadata as needed
        console.log('Processing metadata:', metadata);
        console.log(metadata.name);
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
            // Create and send a command to list objects in the bucket
            const listCommand = new client_s3_1.ListObjectsV2Command(listParams);
            const listedObjects = yield aws_config_js_1.default.send(listCommand);
            if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
                console.log('No objects found.');
                return;
            }
            // Fetch metadata for each listed object concurrently
            const fetchPromises = listedObjects.Contents.map((object) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (object.Key) {
                    console.log('Fetching object:', object.Key);
                    const getParams = {
                        Bucket: bucket,
                        Key: object.Key,
                    };
                    const getCommand = new client_s3_1.GetObjectCommand(getParams);
                    const data = yield aws_config_js_1.default.send(getCommand);
                    // Convert the data Body to a string and parse as JSON
                    const jsonContent = JSON.parse((yield ((_a = data.Body) === null || _a === void 0 ? void 0 : _a.transformToString())) || '{}');
                    // Process the JSON content with the provided function
                    ProcessJSON(jsonContent);
                }
            }));
            // Execute all fetches concurrently
            yield Promise.all(fetchPromises);
        }
        catch (error) {
            console.error('Error fetching or processing objects:', error);
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
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, (jsonContent) => SearchJSON(jsonContent, regex));
}
//# sourceMappingURL=packageController.js.map