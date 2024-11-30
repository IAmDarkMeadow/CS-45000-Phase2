"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
// Initialize the S3 client
const s3 = new AWS.S3();
// Function to delete all files and folders in a bucket
function deleteAllObjectsInBucket(bucketName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // List all objects in the bucket
            let isTruncated = true;
            let marker;
            while (isTruncated) {
                // Get a list of objects in the bucket
                const params = {
                    Bucket: bucketName,
                    ContinuationToken: marker,
                };
                const listObjectsResponse = yield s3.listObjectsV2(params).promise();
                isTruncated = listObjectsResponse.IsTruncated || false;
                marker = listObjectsResponse.NextContinuationToken;
                if (listObjectsResponse.Contents) {
                    // Delete all the objects in the current response
                    const deleteParams = {
                        Bucket: bucketName,
                        Delete: {
                            Objects: listObjectsResponse.Contents.map(object => ({ Key: object.Key })),
                        },
                    };
                    // Perform the deletion
                    yield s3.deleteObjects(deleteParams).promise();
                    console.log(`Deleted ${listObjectsResponse.Contents.length} objects.`);
                }
            }
            console.log('All objects deleted.');
        }
        catch (error) {
            console.error('Error deleting objects:', error);
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
        try {
            // Upload an empty object to create the folder
            yield s3.putObject(params).promise();
            console.log(`Folder "${folderName}" created successfully in the bucket "${bucketName}".`);
        }
        catch (error) {
            console.error('Error creating folder:', error);
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
ResetRegistry();
//# sourceMappingURL=ResetRegistry.js.map