"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * s3Sercise.ts
 *
 * Description:
 * Ensure that your AWS credentials are correctly set up.
 *
 * Author: Brayden Devenport
 * Date: 12-01-2024
 * Version: 1.0
 *
 */
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//
//Setting up all the environment variables
//
const access_key = process.env.AWS_ACCESS_KEY_ID;
const secret_access_key = process.env.AWS_SECRET_ACCESS_KEY;
const aws_region = process.env.AWS_REGION;
//
//Setting up the S3Client
//
const s3Client = new client_s3_1.S3Client({
    region: aws_region,
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_access_key,
    },
});
// Export s3Client so that we can just call this to set up S3Client up
exports.default = s3Client;
//# sourceMappingURL=aws-config.js.map