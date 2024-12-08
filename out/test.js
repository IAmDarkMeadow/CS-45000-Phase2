"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const Download_js_1 = require("./Download.js");
//fromEnv()
let serverLink = 'ec2-3-144-182-107.us-east-2.compute.amazonaws.com';
let s3client = new client_s3_1.S3Client({
    region: 'us-east-2',
    endpoint: serverLink,
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});
(0, Download_js_1.downloadFileS3)(s3client, 'registry-storage/Modules/', 'test.txt', './');
//# sourceMappingURL=test.js.map