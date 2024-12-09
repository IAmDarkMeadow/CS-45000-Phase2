import { calculateMetrics } from "../trustworthy-module-registry-master/src/run";

const userInput: string = process.argv[2]; // Get the user input from the command line argument

if (userInput) {
    const toReturn = calculateMetrics(userInput);
    console.log(toReturn);
} else {
    console.log("<p>No input provided.</p>");
}
