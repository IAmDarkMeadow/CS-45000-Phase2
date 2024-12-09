/*
 * Download.ts
 *
 * 
 * Description:
 * This file runs the handleUpload function, which will upload a file to the s3 service, and debloat it.
 * 
 * Author: Jacob Esparza
 * Date: 12-8-2024
 * Version: 1.0
 * 
 */

import { bool } from "aws-sdk/clients/signer";
import { connectToGitHubAndDownloadRepo } from "../UpdateDatabase";
import { RegularExpressionSearchSingle } from "../controllers/packageController";

const userInput: string = process.argv[2]; // Get the user input from the command line argument

if (userInput) {
    //Doesn't work currently
    const toSend = RegularExpressionSearchSingle(userInput);
    //const toReturn = connectToGitHubAndDownloadRepo(toSend);
    console.log(toSend);
} else {
    console.log("<p>No input provided.</p>");
}