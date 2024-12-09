/*
 * Listener.ts
 *
 * 
 * Description:
 * This file runs the express server, and listens for all the frontend calls.
 * 
 * Author: Jacob Esparza
 * Date: 12-8-2024
 * Version: 1.0
 * 
 */



import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { exec } from 'child_process';
import logger from '../utils/Logger';

const app = express();
const port = 5000;

// Apply CORS middleware to allow requests from other origins
app.use(cors({
    origin: '*',  // Allow requests from your frontend (adjust if different port)
    methods: ['GET', 'POST'],        // Allow GET and POST requests
    allowedHeaders: ['Content-Type'], // Allow the Content-Type header
}));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle the form submission
app.post('/search', (req: Request, res: Response) => {
    const userInput = req.body.userInput;

    logger.info('Received user input:', userInput, ' from /search');

    // Run Search.js file (assuming Search.js is in the same directory as server.ts)
    exec(`node out/Search.js "${userInput}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Something went wrong');
        }
        
        // Send the generated HTML back to the client
        res.send(stdout); // Assuming stdout is HTML
    });
});

app.post('/rank', (req: Request, res: Response) => {
    const userInput = req.body.userInput;

    logger.info('Received user input:', userInput, ' from /rank');

    // Run Search.js file (assuming Search.js is in the same directory as server.ts)
    exec(`node out/Rate.js "${userInput}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Something went wrong');
        }
        
        // Send the generated HTML back to the client
        res.send(stdout); // Assuming stdout is HTML
    });
});

app.post('/upload', (req: Request, res: Response) => {
    const userInput = req.body.userInput;

    logger.info('Received user input:', userInput, ' from /upload');

    // Run Search.js file (assuming Search.js is in the same directory as server.ts)
    exec(`node out/Upload.js "${userInput}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Something went wrong');
        }
        
        // Send the generated HTML back to the client
        res.send(stdout); // Assuming stdout is HTML
    });
});

app.post('/update', (req: Request, res: Response) => {
    const userInput = req.body.userInput;

    logger.info('Received user input:', userInput, ' from /upload');

    // Run Search.js file (assuming Search.js is in the same directory as server.ts)
    exec(`node out/UpDate.js "${userInput}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Something went wrong');
        }
        
        // Send the generated HTML back to the client
        res.send(stdout); // Assuming stdout is HTML
    });
});

// Route to handle the form submission
app.post('/download', (req: Request, res: Response) => {
    const userInput = req.body.userInput;

    logger.info('Received user input:', userInput, ' from /search');

    // Run Search.js file (assuming Search.js is in the same directory as server.ts)
    exec(`node out/Download.js "${userInput}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Something went wrong');
        }
        
        // Send the generated HTML back to the client
        res.send(stdout); // Assuming stdout is HTML
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
