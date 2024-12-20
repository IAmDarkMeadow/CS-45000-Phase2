/*
 * Search.ts
 *
 * 
 * Description:
 * This file runs the Reg Exp Search function, then returns the output to the log to out converted to HTML.
 * 
 * Author: Jacob Esparza
 * Date: 12-8-2024
 * Version: 1.0
 * 
 */

import { RegularExpressionSearch } from "../controllers/packageController";

const userInput: string = process.argv[2]; // Get the user input from the command line argument

if (userInput) {
    const toReturn = RegularExpressionSearch(userInput);
    console.log(toReturn);
} else {
    console.log("<p>No input provided.</p>");
}
