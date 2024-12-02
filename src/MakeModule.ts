/*
 *  MakeModule.ts
 *  Description: This is basically a guide to see where I put certian functions from this file
 *  so that if you. I did this to make the project modular and scalar so that it would be easier to decode.
 * 
 *  Author: Jacob Esparza
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-02-2024
 *  Version: 0.5
 *   
 */


import * as AWS from 'aws-sdk';

// Set up the S3 client
const s3 = new AWS.S3();

//
// interface code is in src/models/packageModel.ts now
//

// Define the module metadata interface
interface ModuleMetadata {
    name: string;
    version: string;
    description: string;
    s3Location: string;
}

//
// uploadModuleMetadata function code is in src/services/s3Service.ts
//

// Function to upload the module metadata to S3 as a JSON file
async function uploadModuleMetadata(moduleMetadata: ModuleMetadata): Promise<void> {
    const bucketName = 'registry-storage';  // Replace with your S3 bucket name

    // Create a metadata file name based on the module name and version
    const metadataFileName = `ModuleMetadata/${moduleMetadata.name}-${moduleMetadata.version}.json`;

    // Convert the module metadata to JSON string
    const jsonMetadata = JSON.stringify(moduleMetadata, null, 2);

    // Define the parameters for the S3 upload
    const params = {
        Bucket: bucketName,
        Key: metadataFileName,  // S3 object key (filename)
        Body: jsonMetadata,  // Content of the file (JSON)
        ContentType: 'application/json',
    };

    try {
        // Upload the file to S3
        await s3.upload(params).promise();
        console.log(`Successfully uploaded metadata for ${moduleMetadata.name} to S3!`);
    } catch (error) {
        console.error(`Error uploading metadata for ${moduleMetadata.name}:`, error);
    }
}


//Testing what he had set up for himself. 
function CreateMetaData(
    name: string,
    version: string,
    description: string,
    s3Location: string)
{
    const moduleData: ModuleMetadata = {
        name: name,
        version: version,
        description: description,
        s3Location: s3Location
    };
    uploadModuleMetadata(moduleData);
}


CreateMetaData('test', 'version 1.0', 'A Test module', 's3://Modules');