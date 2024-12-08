/*
 *  SearchDirectory.ts
 *  
 *  All function code is copied over to /src/controllers/packageController.ts for modluarity.
 *  I moved every function into and updated the code so that it works now with 'import s3Client from '../config/aws-config.js';'
 * 
 *  Description: This is basically a guide to see where I put certian functions from this file
 *  so that if you. I did this to make the project modular and scalar so that it would be easier to decode.
 * 
 *  Author: Jacob Esparza
 *  Edit/Notes: Brayden Devenport
 *  Date: 12-02-2024
 *  Version: 0.5
 *   
 */




import AWS from 'aws-sdk';

// Initialize S3 Client
const s3 = new AWS.S3();

//
// All code below is over on /scr/controllers/packageController.ts
//

async function SearchJSON(metadata: any, expression: string) {
    try {
        // Create a regex from the expression
        const regex = new RegExp(expression, 'i');  // 'i' for case-insensitive search
        let matches: string[] = [];

        // Recursive function to search through metadata
        function search(obj: any) {
            if (typeof obj === 'string' && regex.test(obj)) {
                matches.push(obj);
            } else if (typeof obj === 'object') {
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
        } else {
            console.log(`No matches found for "${expression}".`);
        }
    } catch (error) {
        console.error('Error in RegExpSearch:', error);
    }
}

// The Foo function that processes metadata from each JSON object
async function ListJSON(metadata: any) {
    // Process the metadata as needed
    console.log('Processing metadata:', metadata);
    console.log(metadata.name);
}

async function fetchAndProcessJsonObjectsConcurrently(bucket: string, prefix: string, ProcessJSON: (jsonContent: any) => void) {
    try {
      const listParams = { Bucket: bucket, Prefix: prefix };
      const listedObjects = await s3.listObjectsV2(listParams).promise();
  
      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log('No objects found.');
        return;
      }
  
      const fetchPromises = listedObjects.Contents.map(async (object) => {
        if (object.Key) {
          console.log('Fetching object:', object.Key);
          const getParams = { Bucket: bucket, Key: object.Key };
          const data = await s3.getObject(getParams).promise();
          const jsonContent = JSON.parse(data.Body?.toString() || '{}');
          ProcessJSON(jsonContent);
        }
      });
  
      // Execute all fetches concurrently
      await Promise.all(fetchPromises);
    } catch (error) {
      console.error('Error fetching or processing objects:', error);
    }
}


function ListModules(){
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, ListJSON);
}

function RegularExpressionSearch(regex: string){
    const bucketName = 'registry-storage';
    const prefix = 'ModuleMetadata/';
    fetchAndProcessJsonObjectsConcurrently(bucketName, prefix, (jsonContent) => SearchJSON(jsonContent, regex));
}
