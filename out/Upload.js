"use strict";
// src/Upload.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = uploadFileToS3;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs = __importStar(require("fs"));
const Logger_1 = __importDefault(require("./utils/Logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//
//Setting up all the environment variables
//
const access_key = process.env.AWS_ACCESS_KEY_ID;
const secret_access_key = process.env.AWS_SECRET_ACCESS_KEY;
const aws_region = process.env.AWS_REGION;
const s3Client = new client_s3_1.S3Client({
    region: aws_region,
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_access_key,
    },
});
function uploadFileToS3(filePath, key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileStream = fs.createReadStream(filePath);
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
                Body: fileStream,
            };
            yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
            Logger_1.default.info(`Uploaded ${filePath} to s3://${uploadParams.Bucket}/${key}`);
        }
        catch (error) {
            Logger_1.default.error(`Error uploading file to S3: ${error}`);
            throw error;
        }
    });
}
//# sourceMappingURL=Upload.js.map