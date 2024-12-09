/*
 * Rate.ts
 *
 * 
 * Description:
 * This file runs the calculateMetrics function, then reutrns the reults to the log to be added as HTML.
 * 
 * Author: Jacob Esparza
 * Date: 12-8-2024
 * Version: 1.0
 * 
 */

import { calculateMetrics } from "../trustworthy-module-registry-master/src/run";

const userInput: string = process.argv[2]; // Get the user input from the command line argument

if (userInput) {
    const toReturn = calculateMetrics(userInput);
    console.log(toReturn);
} else {
    console.log("<p>No input provided.</p>");
}
