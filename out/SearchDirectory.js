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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Initialize S3 Client
const s3 = new aws_sdk_1.default.S3();
function SearchJSON(metadata, expression) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a regex from the expression
            const regex = new RegExp(expression, 'i'); // 'i' for case-insensitive search
            let matches = [];
            // Recursive function to search through metadata
            function search(obj) {
                if (typeof obj === 'string' && regex.test(obj)) {
                    matches.push(obj);
                }
                else if (typeof obj === 'object') {
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            search(obj[key]);
                        }
                    }
                }
            }
            // Start searching
            search(metadata);
            // Log matches found
            if (matches.length > 0) {
                console.log(`Matches for "${expression}":`, matches);
            }
            else {
                console.log(`No matches found for "${expression}".`);
            }
        }
        catch (error) {
            console.error('Error in RegExpSearch:', error);
        }
    });
}
// The Foo function that processes metadata from each JSON object
function ListJSON(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        // Process the metadata as needed
        console.log('Processing metadata:', metadata);
        console.log(metadata.name);
    });
}
function fetchAndProcessJsonObjectsConcurrently(bucket, prefix, ProcessJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listParams = { Bucket: bucket, Prefix: prefix };
            const listedObjects = yield s3.listObjectsV2(listParams).promise();
            if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
                console.log('No objects found.');
                return;
            }
            const fetchPromises = listedObjects.Contents.map((object) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (object.Key) {
                    console.log('Fetching object:', object.Key);
                    const getParams = { Bucket: bucket, Key: object.Key };
                    const data = yield s3.getObject(getParams).promise();
                    const jsonContent = JSON.parse(((_a = data.Body) === null || _a === void 0 ? void 0 : _a.toString()) || '{}');
                    ProcessJSON(jsonContent);
                }
            }));
            // Execute all fetches concurrently
            yield Promise.all(fetchPromises);
        }
        catch (error) {
            console.error('Error fetching or processing objects:', error);
        }
    });
}
function ListModules() {
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, ListJSON);
}
function RegularExpressionSearch(regex) {
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, (jsonContent) => SearchJSON(jsonContent, regex));
}
//# sourceMappingURL=SearchDirectory.js.map