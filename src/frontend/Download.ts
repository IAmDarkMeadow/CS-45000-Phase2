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
import { handleUpload } from "../services/uploadService";

const userInput: string = process.argv[2]; // Get the user input from the command line argument

if (userInput) {
    const toReturn = handleUpload(userInput, true);
    console.log(toReturn);
} else {
    console.log("<p>No input provided.</p>");
}