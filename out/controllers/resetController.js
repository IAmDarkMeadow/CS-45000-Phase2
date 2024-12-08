"use strict";
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
exports.ResetRegistry = ResetRegistry;
const aws_config_js_1 = __importDefault(require("../config/aws-config.js"));
const client_s3_1 = require("@aws-sdk/client-s3");
// Function to delete all files and folders in a bucket
function deleteAllObjectsInBucket(bucketName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // List all objects in the bucket
            let isTruncated = true;
            let marker;
            while (isTruncated) {
                // Get a list of objects in the bucket
                const listparams = {
                    Bucket: bucketName,
                    ContinuationToken: marker,
                };
                //
                // Updated code to make the code modular from ResetRegistry.ts
                //
                const listCommand = new client_s3_1.ListObjectsV2Command(listparams);
                const listObjectsResponse = yield aws_config_js_1.default.send(listCommand); // Send command to get objects
                // Check if there are objects to delete
                if (listObjectsResponse.Contents && listObjectsResponse.Contents.length > 0) {
                    // Delete all the objects in the current response
                    //
                    // Updated code
                    //
                    const deleteParams = {
                        Bucket: bucketName,
                        Delete: {
                            Objects: listObjectsResponse.Contents.map(object => ({ Key: object.Key })),
                        },
                    };
                    // Perform the deletion
                    const deleteCommand = new client_s3_1.DeleteObjectsCommand(deleteParams);
                    yield aws_config_js_1.default.send(deleteCommand); // Send command to delete objects
                    console.log(`Deleted ${listObjectsResponse.Contents.length} objects.`);
                }
                isTruncated = listObjectsResponse.IsTruncated || false;
                marker = listObjectsResponse.NextContinuationToken;
            }
            console.log('All objects deleted.');
        }
        catch (error) {
            console.error('Error deleting objects:', error);
            throw error;
        }
    });
}
// Function to create a "folder" in the S3 bucket
function createFolderInS3(bucketName, folderName) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: bucketName,
            Key: folderName.endsWith('/') ? folderName : `${folderName}/`, // Ensure the folder name ends with a slash
            Body: '', // The folder is an empty object
        };
        // Updated code
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            // Send Command to create the folder
            yield aws_config_js_1.default.send(command);
            console.log(`Folder "${folderName}" created successfully in the bucket "${bucketName}".`);
        }
        catch (error) {
            console.error('Error creating folder:', error);
            throw error; // Throw error to fbe handled by calling function
        }
    });
}
function ResetRegistry() {
    return __awaiter(this, void 0, void 0, function* () {
        // Usage example:
        const bucketName = 'registry-storage';
        const folderName = 'ModuleMetadata'; // Name of the folder you want to create
        const folderName2 = 'Modules'; // Name of the folder you want to create
        try {
            // First, delete all objects in the bucket
            yield deleteAllObjectsInBucket(bucketName);
            // Then, create the first folder
            yield createFolderInS3(bucketName, folderName);
            // Finally, create the second folder
            yield createFolderInS3(bucketName, folderName2);
            console.log('All operations completed successfully.');
        }
        catch (error) {
            console.error('Error in operations:', error);
        }
    });
}
//# sourceMappingURL=resetController.js.map