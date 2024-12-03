"use strict";
/*
 * s3Service.ts
 *
 * Description:
 * This file contains the functions that have connect to the S3 service.
 * This file contains the downloadFileS3 that Grayson created.
 * It also contains the uploadModuleMetadata that Jacob Esparza created.
 *
 * Author: Grayson DeHerdt, Brayden Devenport, Jacob Esparza
 * Date: 12-02-2024
 * Version: 1.1
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
exports.downloadFileS3 = downloadFileS3;
exports.uploadModuleMetadata = uploadModuleMetadata;
const Logger_js_1 = __importDefault(require("../utils/Logger.js")); // For Error handling
const aws_config_js_1 = __importDefault(require("../config/aws-config.js"));
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = require("fs");
const dotenv_1 = __importDefault(require("dotenv")); // For protected enviroment Variables
dotenv_1.default.config();
//
// Grayson DeHerdt downloadFileS3 function
// Updated code since I have s3Client function already made in aws-confiig.ts
// All I did was remove (s3Client: { send: (arg0: any) => any; } from function definition
//
function downloadFileS3(bucketName, fileKey, localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield aws_config_js_1.default.send(new client_s3_1.ListBucketsCommand({}));
            Logger_js_1.default.info(`Connection Successful`);
        }
        catch (error) {
            Logger_js_1.default.error("Error checking S3 connection:", error);
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });
        try {
            const data = yield aws_config_js_1.default.send(command);
            const readableStream = data.Body;
            const writeStream = (0, fs_1.createWriteStream)(localPath);
            readableStream.pipe(writeStream);
            writeStream.on('finish', () => {
                writeStream._destroy; //dont wanna leave it open
                Logger_js_1.default.info(`Downloaded ${fileKey} from ${bucketName} to ${localPath}`);
            });
        }
        catch (error) {
            Logger_js_1.default.error(`Error downloading ${fileKey} from ${bucketName} to ${localPath}:`, error);
        }
    });
}
;
const console_1 = require("console");
// Funtion to upload the module metadata to S3 as a JSON file
function uploadModuleMetadata(moduleMetadata) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the S3 bucket name from environment variables
        const bucketName = process.env.S3_BUCKET_NAME;
        if (!bucketName) {
            // I do not know if this will work without the try/catch commands. 
            Logger_js_1.default.error(`S3_BUCKET_NAME is not defined in the environment variables.`, console_1.error);
        }
        // Create a metadata file name based on the module name and version
        const metadataFileName = `ModuleMetadata/${moduleMetadata.name}-${moduleMetadata.version}.json`;
        // Convert the module metadata to JSON string
        const jsonMetadata = JSON.stringify(moduleMetadata, null, 2);
        // Define the parameters for the S3 upload
        const params = {
            Bucket: bucketName, // S3 bucket name
            Key: metadataFileName, // S3 object key (filename)
            Body: jsonMetadata, // Content of the file (JSON)
            ContentType: 'application/json', // Specify content type as JSON
        };
        // Create an S3 PutObjectCommand with the defined parameters
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            // Send the upload command to S3
            yield aws_config_js_1.default.send(command);
            Logger_js_1.default.info(`Successfully uploaded metadata for ${moduleMetadata.name} to S3!`);
        }
        catch (error) {
            Logger_js_1.default.error(`Error uploading metadata for ${moduleMetadata.name}:`, error);
            throw error;
        }
    });
}
;
//# sourceMappingURL=s3Service.js.map