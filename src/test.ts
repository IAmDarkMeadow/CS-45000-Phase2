import { S3Client, GetObjectCommand,ListBucketsCommand  } from '@aws-sdk/client-s3';
import {fromEnv} from '@aws-sdk/credential-provider-env'
import {downloadFileS3} from './Download.js'
import {AwsCredentialIdentity} from '@smithy/types'

//fromEnv()
let serverLink = 'ec2-3-144-182-107.us-east-2.compute.amazonaws.com';
let s3client = new S3Client({
    region:'us-east-2',
    endpoint:serverLink,
    credentials:{
        accessKeyId:'',
        secretAccessKey:''
    }
});



downloadFileS3(s3client,'registry-storage/Modules/', 'test.txt','./');