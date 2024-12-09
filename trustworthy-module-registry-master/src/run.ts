#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { URLHandler } from './URLHandler/URLHandler';
import { DataFetcherStrategy } from './URLHandler/DataFetcherStrategy';
import { GitHubDataFetcher } from './Data_Fetcher/GitHubDataFetcher';
import { NPMDataFetcher } from './Data_Fetcher/NPMDataFetcher';
import { CalculatorFactory, CalculatorTypes } from './metrics/CalculatorFactory';

// Define the expected command-line arguments
const args = process.argv.slice(2);
// export GITHUB_TOKEN=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
if (args.length === 0) {
    console.error('Error: No command provided. Use "install", "test", or provide a URL file.');
    process.exit(1);
}

const command = args[0];

switch (command) {
    case 'install':
        installDependencies();
        break;
    case 'test':
        runTests();
        break;
    default:
        const notInRootDir = (
            __dirname.includes("src")
        );
        if (notInRootDir) {
            process.chdir(path.join(__dirname, '..'));
        }

        if (fs.existsSync(command)) {
            processURLs(command);
        } else {
            console.error(`Error: Unknown command or file not found: ${command}`);
            process.exit(1);
        }
        break;
}

function installDependencies() {
    try {
        console.log('Installing dependencies...');
        // Change directory to the root directory (parent of 'src')
        process.chdir(path.join(__dirname, '..'));
        execSync('npm install', { stdio: 'inherit' });
        console.log('Dependencies installed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error installing dependencies:', error);
        process.exit(1);
    }
}

/**
 * Runs the test suite and reports the results.
 */
function runTests() {
    try {
        console.log('Running tests...');
        // Change directory to the root directory (parent of 'src')
        process.chdir(path.join(__dirname, '..'));
        execSync('npm test', { stdio: 'inherit' });
        process.exit(0);
    } catch (error) {
        console.error('Error running tests:', error);
        process.exit(1);
    }
}

/**
 * Processes a file containing URLs and outputs NDJSON with calculated metrics.
 * @param urlFile Path to the file containing URLs.
 */
async function processURLs(urlFile: string) {
    try {
        const urls = fs.readFileSync(urlFile, 'utf8').split('\n').filter(line => line.trim() !== '');
        for (const url of urls) {
            try {
                const metrics = await calculateMetrics(url.trim());
                console.log(JSON.stringify(metrics));
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Error processing URL ${url}:`, error.message);
                } else {
                    console.error(`Error processing URL ${url}:`, error);
                }
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error reading URL file:', error);
        process.exit(1);
    }
}

/**
 * Calculates the required metrics for a given URL.
 * @param url The URL to process.
 * @returns An object containing the URL and calculated metrics.
 */
async function calculateMetrics(url: string): Promise<any> {
    const startTime = Date.now();
    const urlHandler = new URLHandler(); // Initialize without a strategy

    if (!urlHandler.validateURL(url)) {
        throw new Error('Invalid URL format.');
    }

    const urlComponents = urlHandler.parseURL(url);
    const sourceType = urlHandler.determineSource(urlComponents);

    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
        console.error('GITHUB_TOKEN is not set in the environment variables');
        process.exit(1);
    }

    // Initialize the appropriate data fetcher strategy
    let dataFetcher: DataFetcherStrategy;
    if (sourceType === 0) {
        dataFetcher = new GitHubDataFetcher(url, githubToken || '');
    } else if (sourceType === 1) {
        dataFetcher = new NPMDataFetcher(url, githubToken || '');
    } else {
        throw new Error('Unsupported URL source.');
    }

    // Set the data fetcher strategy in URLHandler
    urlHandler.setDataFetcherStrategy(dataFetcher);

    // Get the data fetcher strategy
    const strategy = urlHandler.getDataFetcherStrategy();
    if (!strategy) {
        throw new Error('Data fetcher strategy is not set.');
    }

    // Fetch data and calculate metrics
    interface Metrics {
        URL: string;
        License?: number;
        License_Latency?: number;
        BusFactor?: number;
        BusFactor_Latency?: number;
        Correctness?: number;
        Correctness_Latency?: number;
        RampUp?: number;
        RampUp_Latency?: number;
        ResponsiveMaintainer?: number;
        ResponsiveMaintainer_Latency?: number;
        NetScore?: number;
        NetScore_Latency?: number;
    }

    const metrics: Metrics = {
        URL: url,
    };

    // License
    const licenseStart = Date.now();
    const licenseData = await dataFetcher.fetchLicense();
    const licenseCalculator = CalculatorFactory.createCalculator(CalculatorTypes.License, licenseData);
    const licenseScore = licenseCalculator ? licenseCalculator.calculate() : 0;
    const licenseLatency = Number(((Date.now() - licenseStart) / 1000).toFixed(3));
    metrics.License = licenseScore;
    metrics.License_Latency = licenseLatency;

    // Bus Factor
    const busFactorStart = Date.now();
    const busFactorData = await dataFetcher.fetchContributors();
    const busFactorCalculator = CalculatorFactory.createCalculator(CalculatorTypes.BusFactor, busFactorData);
    const busFactorScore = busFactorCalculator ? busFactorCalculator.calculate() : 0;
    const busFactorLatency = Number(((Date.now() - busFactorStart) / 1000).toFixed(3));
    metrics.BusFactor = busFactorScore;
    metrics.BusFactor_Latency = busFactorLatency;

    // Correctness
    const correctnessStart = Date.now();
    const correctnessData = await dataFetcher.fetchTestingResults();
    const correctnessCalculator = CalculatorFactory.createCalculator(CalculatorTypes.Correctness, correctnessData);
    const correctnessScore = correctnessCalculator ? correctnessCalculator.calculate() : 0;
    const correctnessLatency = Number(((Date.now() - correctnessStart) / 1000).toFixed(3));
    metrics.Correctness = correctnessScore;
    metrics.Correctness_Latency = correctnessLatency;

    // Ramp Up
    const rampUpStart = Date.now();
    const rampUpData = await dataFetcher.fetchDocumentation();
    const rampUpCalculator = CalculatorFactory.createCalculator(CalculatorTypes.RampUp, rampUpData);
    const rampUpScore = rampUpCalculator ? rampUpCalculator.calculate() : 0;
    const rampUpLatency = Number(((Date.now() - rampUpStart) / 1000).toFixed(3));
    metrics.RampUp = rampUpScore;
    metrics.RampUp_Latency = rampUpLatency;

    // Responsive Maintainer
    const responsiveMaintainerStart = Date.now();
    const responsiveMaintainerData = await dataFetcher.fetchMaintainerMetrics();
    const responsiveMaintainerCalculator = CalculatorFactory.createCalculator(CalculatorTypes.ResponsiveMaintainer, responsiveMaintainerData);
    const responsiveMaintainerScore = responsiveMaintainerCalculator ? responsiveMaintainerCalculator.calculate() : 0;
    const responsiveMaintainerLatency = Number(((Date.now() - responsiveMaintainerStart) / 1000).toFixed(3));
    metrics.ResponsiveMaintainer = responsiveMaintainerScore;
    metrics.ResponsiveMaintainer_Latency = responsiveMaintainerLatency;

    // Calculate NetScore
    const netScore = Number((
        (licenseScore * 0.5) +
        (busFactorScore * 0.1) +
        (correctnessScore * 0.15) +
        (rampUpScore * 0.15) +
        (responsiveMaintainerScore * 0.1)
    ).toFixed(2));
    const totalLatency = Number(((Date.now() - startTime) / 1000).toFixed(3));

    metrics.NetScore = netScore;
    metrics.NetScore_Latency = totalLatency;

    return metrics;
}
