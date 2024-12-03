"use strict";
/*
 * upload-config.ts
 *
 * Description:
 * This file is responsible for configuring the fifle upload process using Multer
 * and integrating it with Amazon S3.
 *
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
const Logger_js_1 = __importDefault(require("../utils/Logger.js")); //For debug purposes
// Setting up the upload configuration
const upload = (0, multer_1.default)({
    // Configuring storage to use AWS S3
    storage: (0, multer_s3_1.default)({
        s3: aws_config_1.default,
        bucket: 'registry-storage',
        // Create a key (file path) for the file in the S3 bucket
        key: function (req, file, cb) {
            try {
                //
                // Loggin that the key generation process has started
                //
                Logger_js_1.default.info('Generating key for the file to be uploaded to S3');
                const packageName = req.body.name;
                const version = req.body.version;
                // Constructing the file path
                // Modules is folder name in bucket
                const fileName = `Modules/${packageName}/${version}/${file.originalname}`;
                // Logging successful key generation
                Logger_js_1.default.info(`File key generated: ${fileName}`);
                cb(null, fileName); // Pass the file path to multer
            }
            catch (error) {
                // Loggiing any errors encountered during key generation
                Logger_js_1.default.error(`Error generating file key: `, error);
                cb(error);
            }
        },
    }),
    // Define file filtering rules
    fileFilter: function (req, file, cb) {
        try {
            // Logging that file filter is running
            Logger_js_1.default.info(`Filtering file: ${file.originalname} with type: ${file.mimetype}`);
            // Allow only zip files
            if (file.mimetype === 'application/zip') {
                // Log successful file filter check
                Logger_js_1.default.info(`File ${file.originalname} is accepted for upload.`);
                cb(null, true); // Accept the file
            }
            else {
                // Log file rejection
                Logger_js_1.default.warn(`File ${file.originalname} rejected: Only zip files are allowed.`);
                cb(new Error('Only zip files are allowed')); // Reject other file types
            }
        }
        catch (error) {
            // Logging any errors encountered during file filtering
            Logger_js_1.default.error(`Error filtering file:`, error);
            cb(error);
        }
    },
    // Set limits on the uploaded file
    // Maximum file size: 10 MB
    limits: { fileSize: 10 * 1024 * 1024 },
});
// Log that the upload configuration is successfully set up
Logger_js_1.default.info('Upload configuration initialized successfully');
// Export the configured upload object
exports.default = upload;
//# sourceMappingURL=upload-config.js.map