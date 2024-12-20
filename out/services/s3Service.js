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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFileS3 = downloadFileS3;
exports.uploadModuleMetadata = uploadModuleMetadata;
exports.uploadToS3 = uploadToS3;
const Logger_1 = __importDefault(require("../utils/Logger")); // For Error handling
const aws_config_1 = __importDefault(require("../config/aws-config"));
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
            yield aws_config_1.default.send(new client_s3_1.ListBucketsCommand({}));
            Logger_1.default.info(`Connection Successful`);
        }
        catch (error) {
            Logger_1.default.error("Error checking S3 connection:", error);
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });
        try {
            const data = yield aws_config_1.default.send(command);
            const readableStream = data.Body;
            const writeStream = (0, fs_1.createWriteStream)(localPath);
            readableStream.pipe(writeStream);
            writeStream.on('finish', () => {
                writeStream._destroy; //dont wanna leave it open
                Logger_1.default.info(`Downloaded ${fileKey} from ${bucketName} to ${localPath}`);
            });
        }
        catch (error) {
            Logger_1.default.error(`Error downloading ${fileKey} from ${bucketName} to ${localPath}:`, error);
        }
    });
}
;
const path_1 = __importDefault(require("path"));
// Funtion to upload the module metadata to S3 as a JSON file
function uploadModuleMetadata(moduleMetadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const bucketName = process.env.S3_BUCKET_NAME;
        if (!bucketName) {
            Logger_1.default.error(`S3_BUCKET_NAME is not defined in the environment variables.`);
            throw new Error('S3_BUCKET_NAME is not defined'); // Ensure the function fails here
        }
        const metadataFileName = `ModuleMetadata/${moduleMetadata.name}-${moduleMetadata.version}.json`;
        const jsonMetadata = JSON.stringify(moduleMetadata, null, 2);
        const params = {
            Bucket: bucketName,
            Key: metadataFileName,
            Body: jsonMetadata,
            ContentType: 'application/json',
        };
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            yield aws_config_1.default.send(command);
            Logger_1.default.info(`Successfully uploaded metadata for ${moduleMetadata.name} to S3!`);
        }
        catch (error) {
            Logger_1.default.error(`Error uploading metadata for ${moduleMetadata.name}:`, error);
            throw error; // rethrow so the promise rejects
        }
    });
}
// Upload to S3 function
function uploadToS3(filePath, bucketName, keyPrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a readable stream from the file path
        const fileStream = (0, fs_1.createReadStream)(filePath);
        const fs = yield Promise.resolve().then(() => __importStar(require('fs')));
        const fileContent = fs.readFileSync(filePath);
        const fileName = path_1.default.basename(filePath);
        const key = `${keyPrefix}/${fileName}`;
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            yield aws_config_1.default.send(command);
            const s3Location = `s3://${bucketName}/Modules/${key}`;
            Logger_1.default.info(`File uploaded successfully to ${s3Location}`);
            return s3Location;
        }
        catch (error) {
            Logger_1.default.error(`Error uploading file to S3:`, error);
            throw error;
        }
    });
}
//# sourceMappingURL=s3Service.js.map