import { RegularExpressionSearch } from "../controllers/packageController";

const userInput: string = process.argv[2]; // Get the user input from the command line argument

if (userInput) {
    const toReturn = RegularExpressionSearch(userInput);
    console.log(toReturn);
} else {
    console.log("<p>No input provided.</p>");
}
