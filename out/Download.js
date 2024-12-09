"use strict";
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
/*
 *  Download.ts
 *  Description: Clientside download function to download modules from the server. The two functions
 *  can be broken down as a download from S2 (using a s2client object, bucket name, client, and location
 *   on client.
 *  Second function Zips one location and moves it to another
 *  Author: Grayson DeHerdt
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-02-2024
 *  Version: 0.5
 *
 */
const Logger_1 = __importDefault(require("./utils/Logger"));
var AdmZip = require("adm-zip");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = require("fs");
const zipFile = (downloadPath, zipPath) => {
    const zip = new AdmZip();
    zip.addLocalFile(downloadPath);
    zip.writeZip(zipPath);
    console.log(`File zipped successfully as ${zipPath}`);
    Logger_1.default.info(`File zipped successfully as ${zipPath}`);
};
function downloadFileS3(s3Client, bucketName, fileKey, local) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield s3Client.send(new client_s3_1.ListBucketsCommand({}));
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
            const data = yield s3Client.send(command);
            const readableStream = data.Body;
            const writeStream = (0, fs_1.createWriteStream)(local);
            readableStream.pipe(writeStream);
            writeStream.on('finish', () => {
                //dont wanna leave it open
                Logger_1.default.info(`Downloaded ${fileKey} from ${bucketName} to ${local}`);
            });
            writeStream._destroy;
        }
        catch (error) {
            Logger_1.default.error(`Error downloading ${fileKey} from ${bucketName} to ${local}:`, error);
        }
        let localZip = local + ".zip";
        zipFile(local, localZip);
    });
}
;
//# sourceMappingURL=Download.js.map