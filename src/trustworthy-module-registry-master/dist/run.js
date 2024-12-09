#!/usr/bin/env ts-node
"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMetrics = calculateMetrics;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const URLHandler_1 = require("./URLHandler/URLHandler");
const GitHubDataFetcher_1 = require("./Data_Fetcher/GitHubDataFetcher");
const NPMDataFetcher_1 = require("./Data_Fetcher/NPMDataFetcher");
const CalculatorFactory_1 = require("./metrics/CalculatorFactory");
// The new metrics for phase 2 imported below
const codeReviewMetric_1 = require("./metrics/codeReviewMetric");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Define the expected command-line arguments
const args = process.argv.slice(2);

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
        const notInRootDir = (__dirname.includes("src"));
        if (notInRootDir) {
            process.chdir(path.join(__dirname, '..'));
        }
        if (fs.existsSync(command)) {
            processURLs(command);
        }
        else {
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
        (0, child_process_1.execSync)('npm install', { stdio: 'inherit' });
        console.log('Dependencies installed successfully.');
        process.exit(0);
    }
    catch (error) {
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
        (0, child_process_1.execSync)('npm test', { stdio: 'inherit' });
        process.exit(0);
    }
    catch (error) {
        console.error('Error running tests:', error);
        process.exit(1);
    }
}
/**
 * Processes a file containing URLs and outputs NDJSON with calculated metrics.
 * @param urlFile Path to the file containing URLs.
 */
async function processURLs(urlFile) {
    try {
        const urls = fs.readFileSync(urlFile, 'utf8').split('\n').filter(line => line.trim() !== '');
        for (const url of urls) {
            try {
                const metrics = await calculateMetrics(url.trim());
                console.log(JSON.stringify(metrics));
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error processing URL ${url}:`, error.message);
                }
                else {
                    console.error(`Error processing URL ${url}:`, error);
                }
            }
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error reading URL file:', error);
        process.exit(1);
    }
}
/**
 * Calculates the required metrics for a given URL.
 * @param url The URL to process.
 * @returns An object containing the URL and calculated metrics.
 */
async function calculateMetrics(url) {
    const startTime = Date.now();
    const urlHandler = new URLHandler_1.URLHandler(); // Initialize without a strategy
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
    let dataFetcher;
    if (sourceType === 0) {
        dataFetcher = new GitHubDataFetcher_1.GitHubDataFetcher(url, githubToken || '');
    }
    else if (sourceType === 1) {
        dataFetcher = new NPMDataFetcher_1.NPMDataFetcher(url, githubToken || '');
    }
    else {
        throw new Error('Unsupported URL source.');
    }
    // Set the data fetcher strategy in URLHandler
    urlHandler.setDataFetcherStrategy(dataFetcher);
    // Get the data fetcher strategy
    const strategy = urlHandler.getDataFetcherStrategy();
    if (!strategy) {
        throw new Error('Data fetcher strategy is not set.');
    }
    const config = {
        repoUrl: url,
        githubToken: process.env.GITHUB_TOKEN
    };
    const metrics = {
        URL: url,
    };
    // License
    const licenseStart = Date.now();
    const licenseData = await dataFetcher.fetchLicense();
    const licenseCalculator = CalculatorFactory_1.CalculatorFactory.createCalculator(CalculatorFactory_1.CalculatorTypes.License, licenseData);
    const licenseScore = licenseCalculator ? licenseCalculator.calculate() : 0;
    const licenseLatency = Number(((Date.now() - licenseStart) / 1000).toFixed(3));
    metrics.License = licenseScore;
    metrics.License_Latency = licenseLatency;
    // Bus Factor
    const busFactorStart = Date.now();
    const busFactorData = await dataFetcher.fetchContributors();
    const busFactorCalculator = CalculatorFactory_1.CalculatorFactory.createCalculator(CalculatorFactory_1.CalculatorTypes.BusFactor, busFactorData);
    const busFactorScore = busFactorCalculator ? busFactorCalculator.calculate() : 0;
    const busFactorLatency = Number(((Date.now() - busFactorStart) / 1000).toFixed(3));
    metrics.BusFactor = busFactorScore;
    metrics.BusFactor_Latency = busFactorLatency;
    // Correctness
    const correctnessStart = Date.now();
    const correctnessData = await dataFetcher.fetchTestingResults();
    const correctnessCalculator = CalculatorFactory_1.CalculatorFactory.createCalculator(CalculatorFactory_1.CalculatorTypes.Correctness, correctnessData);
    const correctnessScore = correctnessCalculator ? correctnessCalculator.calculate() : 0;
    const correctnessLatency = Number(((Date.now() - correctnessStart) / 1000).toFixed(3));
    metrics.Correctness = correctnessScore;
    metrics.Correctness_Latency = correctnessLatency;
    // Ramp Up
    const rampUpStart = Date.now();
    const rampUpData = await dataFetcher.fetchDocumentation();
    const rampUpCalculator = CalculatorFactory_1.CalculatorFactory.createCalculator(CalculatorFactory_1.CalculatorTypes.RampUp, rampUpData);
    const rampUpScore = rampUpCalculator ? rampUpCalculator.calculate() : 0;
    const rampUpLatency = Number(((Date.now() - rampUpStart) / 1000).toFixed(3));
    metrics.RampUp = rampUpScore;
    metrics.RampUp_Latency = rampUpLatency;
    // Responsive Maintainer
    const responsiveMaintainerStart = Date.now();
    const responsiveMaintainerData = await dataFetcher.fetchMaintainerMetrics();
    const responsiveMaintainerCalculator = CalculatorFactory_1.CalculatorFactory.createCalculator(CalculatorFactory_1.CalculatorTypes.ResponsiveMaintainer, responsiveMaintainerData);
    const responsiveMaintainerScore = responsiveMaintainerCalculator ? responsiveMaintainerCalculator.calculate() : 0;
    const responsiveMaintainerLatency = Number(((Date.now() - responsiveMaintainerStart) / 1000).toFixed(3));
    metrics.ResponsiveMaintainer = responsiveMaintainerScore;
    metrics.ResponsiveMaintainer_Latency = responsiveMaintainerLatency;
    // New Metric 1 Dependencyy Pinnning Metric
    // const DependencyPinningMetricStart = Date.now();
    // const DependencyPinningMetric = await computeDependencyPinningMetric(config)
    // const DependencyPinningMetricLatency = Number(((Date.now() - DependencyPinningMetricStart) / 1000).toFixed(3));
    // metrics.DependencyPinningMetric = DependencyPinningMetric;
    // metrics.DependencyPinningMetric_Latency = DependencyPinningMetricLatency
    // New metric 2 Code review Metric
    const CodeReviewMetricStart = Date.now();
    const CodeReviewMetric = await (0, codeReviewMetric_1.computeCodeReviewMetric)(config);
    const CodeReviewMetricLatency = Number(((Date.now() - CodeReviewMetricStart) / 1000).toFixed(3));
    metrics.CodeReviewMetric = CodeReviewMetric;
    metrics.CodeReviewMetric_Latency = CodeReviewMetricLatency;
    // Calculate NetScore
    const netScore = Number(((licenseScore * 0.4) +
        (busFactorScore * 0.1) +
        (correctnessScore * 0.1) +
        (rampUpScore * 0.1) +
        (responsiveMaintainerScore * 0.1) +
        (CodeReviewMetric * 0.1)
    // (DependencyPinningMetric * 0.1)
    ).toFixed(2));
    const totalLatency = Number(((Date.now() - startTime) / 1000).toFixed(3));
    metrics.NetScore = netScore;
    metrics.NetScore_Latency = totalLatency;
    return metrics;
}
