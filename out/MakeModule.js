"use strict";
/*
 *  MakeModule.ts
 *
 *  Interface got moved to /src/models/packageModels
 *  uploadModuleMetadata function got moved to /src/service/s3Service.ts
 *
 *  Description: This is basically a guide to see where I put certian functions from this file
 *  so that if you. I did this to make the project modular and scalar so that it would be easier to decode.
 *
 *  Author: Jacob Esparza
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-02-2024
 *  Version: 0.5
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
// Set up the S3 client
const s3 = new AWS.S3();
//
// uploadModuleMetadata function code is in src/services/s3Service.ts
//
// Function to upload the module metadata to S3 as a JSON file
function uploadModuleMetadata(moduleMetadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const bucketName = 'registry-storage'; // Replace with your S3 bucket name
        // Create a metadata file name based on the module name and version
        const metadataFileName = `ModuleMetadata/${moduleMetadata.name}-${moduleMetadata.version}.json`;
        // Convert the module metadata to JSON string
        const jsonMetadata = JSON.stringify(moduleMetadata, null, 2);
        // Define the parameters for the S3 upload
        const params = {
            Bucket: bucketName,
            Key: metadataFileName, // S3 object key (filename)
            Body: jsonMetadata, // Content of the file (JSON)
            ContentType: 'application/json',
        };
        try {
            // Upload the file to S3
            yield s3.upload(params).promise();
            console.log(`Successfully uploaded metadata for ${moduleMetadata.name} to S3!`);
        }
        catch (error) {
            console.error(`Error uploading metadata for ${moduleMetadata.name}:`, error);
        }
    });
}
//Testing what he had set up for himself. 
function CreateMetaData(name, version, description, s3Location) {
    const moduleData = {
        name: name,
        version: version,
        description: description,
        s3Location: s3Location
    };
    uploadModuleMetadata(moduleData);
}
CreateMetaData('test', 'version 1.0', 'A Test module', 's3://Modules');
//# sourceMappingURL=MakeModule.js.map