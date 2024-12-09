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

import { S3Client, GetObjectCommand,ListBucketsCommand  } from '@aws-sdk/client-s3';
import {fromEnv} from '@aws-sdk/credential-provider-env'
import {downloadFileS3} from './Download'
import {compareUpdate} from './Update-Check'
import {AwsCredentialIdentity} from '@smithy/types'

//fromEnv()
let s3client = new S3Client({
    region:'us-east-2',
    credentials:{
        accessKeyId:'',
        secretAccessKey:''
    }
});



downloadFileS3(s3client,'registry-storage/Modules/', 'test.txt','./');


console.log('AAAAAAAAAA');
downloadFileS3(s3client, 'registry-storage', 'ModuleMetadata/test-version 1.0.json', "C:/Users/Parimama/Documents/misery/CS-45000-Phase2/test-version 1.0.json");
console.log('BBBBBBBBBB');
compareUpdate('accessKeyId', 'secretAccessKey', 'registry-storage', 'ModuleMetadata/test-version 1.0.json', "C:/Users/Parimama/Documents/misery/CS-45000-Phase2/test-version 1.0.json");
