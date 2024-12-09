/*
 * debloatService.ts
 *
 * Place Holder file
 * 
 * 
 * Description:
 * This module provides functionality to "debloat" a directory by removing
 * unnecessary or excluded files and directories and minifying JavaScript files
 * for optimized storage and performance. It is designed to work recursively
 * through a directory structure, ensuring all nested files and folders are
 * processed.
 * 
 * 
 * 
 * 
 * 
 * 
*/


import { build } from 'esbuild';
import path from 'path';
import fs from 'fs-extra';
import logger from '../utils/Logger.js';

/**
 * Performs tree shaking and minification on the specified directory using esbuild.
 * @param directory - The directory containing the module to optimize.
 * @returns A promise that resolves when debloating is complete.
 */
export const debloatModule = async (directory: string): Promise<void> => {
  try {
    logger.info(`Starting debloating process for directory: ${directory}`);

    // Define entry point
    let entryPoint = '';

    // Attempt to find entry point from package.json
    const packageJsonPath = path.join(directory, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      if (packageJson.main) {
        entryPoint = path.join(directory, packageJson.main);
      } else if (packageJson.module) {
        entryPoint = path.join(directory, packageJson.module);
      } else {
        // Default to index.js if main is not specified
        entryPoint = path.join(directory, 'index.js');
      }
    } else {
      // If package.json does not exist, default to index.js
      entryPoint = path.join(directory, 'index.js');
    }

    // Check if the entry point exists
    if (!(await fs.pathExists(entryPoint))) {
      throw new Error(`Entry point not found at ${entryPoint}`);
    }

    // Define output directory
    const outdir = path.join(directory, 'dist');

    // Ensure output directory is clean
    await fs.remove(outdir);
    await fs.ensureDir(outdir);

    // Perform the build with esbuild
    await build({
      entryPoints: [entryPoint],
      bundle: true,
      minify: true,
      sourcemap: false,
      treeShaking: true,
      platform: 'node', // Adjust based on your module's target environment
      target: ['es2015'], // Adjust based on your module's target JavaScript version
      outfile: path.join(outdir, 'bundle.js'),
      logLevel: 'silent', // Suppress esbuild logs; handle logging manually
    });

    logger.info(`Debloating completed successfully. Output at ${outdir}`);

    // Optionally, you can replace the original files with the debloated bundle
    // For example, replace index.js with the bundle
    // await fs.copy(path.join(outdir, 'bundle.js'), entryPoint, { overwrite: true });

    // Alternatively, you can keep the debloated code in the 'dist' folder
    // and adjust your packaging process to include 'dist' instead of the original source

  } catch (error) {
    logger.error(`Error during debloating process: ${(error as Error).message}`);
    throw error;
  }
};