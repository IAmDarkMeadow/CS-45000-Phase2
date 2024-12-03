"use strict";
/*
 *  Download.ts
 *  Description: This is basically a guide to see where I put certian functions from this file
 *  so that if you. I did this to make the project modular and scalar so that it would be easier to decode.
 *
 *  Author: Grayson DeHerdt
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-02-2024
 *  Version: 0.5
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
const Logger_js_1 = __importDefault(require("../src/utils/Logger.js"));
//idk how we are storing these yet
const host = 'your-ec2-public-dns';
const username = 'ec2-user';
const privateKeyPath = '/path/to/your-key.pem';
//const remoteFilePath = '/path/to/remote/file';
//const localFilePath = './downloaded-file';
//export async function downloadFileEC2 (remoteFilePath:string, localFilePath:string) {
//    const ssh = new NodeSSH();
//    try {
//        await ssh.connect({
//            host,
//            username,
//            privateKey: privateKeyPath,
//        });
//
//        const remoteFile = await ssh.getFile(localFilePath, remoteFilePath);
//        console.log(`Downloaded ${remoteFilePath} to ${localFilePath}`);
//    } catch (error) {
//        console.error('Error downloading file:', error);
//    } finally {
//        ssh.dispose();
//    }
//};
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = require("fs");
//const bucketName = 'your-bucket-name'; what the bucket is
//const fileKey = 'your-file.txt'; the file name
//const localPath = './your-file.txt'; where to send (can be ./ or full path)
//const s3Client = new S3Client({ region: 'your-region' });
//need to have a active S3Client unit set up like
//const s3Client = new S3Client({ region: 'your-region' });
//const s3client = new S3Client({region:'region', credentals: 'credentals'}) etc etc
//
// The DownloadFileS3 is currently in the src/services/s3Service.ts
// 
function downloadFileS3(s3Client, bucketName, fileKey, local) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield s3Client.send(new client_s3_1.ListBucketsCommand({}));
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
            const data = yield s3Client.send(command);
            const readableStream = data.Body;
            const writeStream = (0, fs_1.createWriteStream)(local);
            readableStream.pipe(writeStream);
            writeStream.on('finish', () => {
                writeStream._destroy; //dont wanna leave it open
                Logger_js_1.default.info(`Downloaded ${fileKey} from ${bucketName} to ${local}`);
            });
        }
        catch (error) {
            Logger_js_1.default.error(`Error downloading ${fileKey} from ${bucketName} to ${local}:`, error);
        }
    });
}
;
//this runs on server
//zips file found after locating through index
//# sourceMappingURL=Download.js.map