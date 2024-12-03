"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer")); // Middleware for handling file upload
const multer_s3_1 = __importDefault(require("multer-s3")); // Integration of multer with AWS S3 for direct upload
const aws_config_1 = __importDefault(require("./aws-config")); // AWS S3 client configuration
// Setting up the upload configuration
const upload = (0, multer_1.default)({
    // Configuring storage to use AWS S3
    storage: (0, multer_s3_1.default)({
        s3: aws_config_1.default,
        bucket: 'registry-storage',
        // Create a key (file path) for the file in the S3 bucket
        key: function (req, file, cb) {
            const packageName = req.body.name;
            const version = req.body.version;
            // Construct the file path
            const fileName = `${packageName}/${version}/${file.originalname}`;
            cb(null, fileName); // Pass the file path to multer
        },
    }),
    // Define file filtering rules
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/zip') {
            // Allow only zip files
            cb(null, true); // Accept the file
        }
        else {
            cb(new Error('Only zip files are allowed')); // Reject other file types
        }
    },
    // Set limits on the uploaded file
    limits: { fileSize: 50 * 1024 * 1024 }, // Maximum file size: 50 MB
});
// Export the configured upload object
exports.default = upload;
//# sourceMappingURL=upload-config.js.map