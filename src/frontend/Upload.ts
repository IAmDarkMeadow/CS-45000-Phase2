import { bool } from "aws-sdk/clients/signer";
import { handleUpload } from "../services/uploadService";

const userInput: string = process.argv[2]; // Get the user input from the command line argument

if (userInput) {
    const toReturn = handleUpload(userInput, true);
    console.log(toReturn);
} else {
    console.log("<p>No input provided.</p>");
}
