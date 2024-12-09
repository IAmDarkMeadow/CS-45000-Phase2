"use strict";
/*
 * test.ts
 *
 *
 * Description:
 *  run test
 *
 * Author: Kameran parker
 * Date: 12-08-2024
 * Version: 1.0
 *
 *
*/
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const Download_1 = require("./Download");
const Update_Check_1 = require("./Update-Check");
//fromEnv()
let s3client = new client_s3_1.S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});
(0, Download_1.downloadFileS3)(s3client, 'registry-storage/Modules/', 'test.txt', './');
console.log('AAAAAAAAAA');
(0, Download_1.downloadFileS3)(s3client, 'registry-storage', 'ModuleMetadata/test-version 1.0.json', "C:/Users/Parimama/Documents/misery/CS-45000-Phase2/test-version 1.0.json");
console.log('BBBBBBBBBB');
(0, Update_Check_1.compareUpdate)('accessKeyId', 'secretAccessKey', 'registry-storage', 'ModuleMetadata/test-version 1.0.json', "C:/Users/Parimama/Documents/misery/CS-45000-Phase2/test-version 1.0.json");
//# sourceMappingURL=test.js.map