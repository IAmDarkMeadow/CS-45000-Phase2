/*
 * debloatService.ts
 *
 * 
 * 
 * Description:
 * This module provides functionality to "debloat" a directory by removing
 * unnecessary or excluded files and directories and minifying JavaScript files
 * for optimized storage and performance. It is designed to work recursively
 * through a directory structure, ensuring all nested files and folders are
 * processed.
 * 
 * Author: Brayden Devenport
 * Date: 12-8-2024
 * Version: 1.0
 * 
 */



import { minify } from 'terser';
import path from 'path';
import fs from 'fs-extra';
import logger from '../utils/Logger.js';



const EXCLUDED_DIRS = ['test', 'tests', '__tests__', 'docs', 'examples', 'example', 'benchmark', 'benchmarks', 'coverage'];
const EXCLUDED_FILES = ['README.md', 'LICENSE', 'CHANGELOG.md', '.eslintrc', '.prettierrc', 'tsconfig.json', 'webpack.config.js'];

/**
 * Recursively removes excluded directories and files from the specified path
 * @param dirPath - The root directory path to debloat
 */

export const debloatModule = async (dirPath: string): Promise<void> => {
  try {

    logger.info(`Starting debloat process for ${dirPath}`);

    // Recursively traverse the directory
    await traverseAndClean(dirPath);

    // Do minification after cleaning

    minifyJavaScriptFiles(dirPath)


    logger.info(`Debloat process completed for ${dirPath}`);
  } catch (error) {

    logger.error(`Error during debloat process: ${error}`);
    throw error;
  }
};

/**
 * Helper function to traverse directories and remove excluded items
 * @param currentPath - Current directory path in traversal
 */

const traverseAndClean = async (currentPath: string): Promise<void> => {

  const items = await fs.readdir(currentPath);

  for (const item of items) {
    const itemPath = path.join(currentPath, item);
    const stats = await fs.stat(itemPath);

    if (stats.isDirectory()) {

      if (EXCLUDED_DIRS.includes(item.toLowerCase())) {


        await fs.remove(itemPath);
        logger.info(`Removed directory: ${itemPath}`);
      } else {
        // Continue traversing subdirectories
 
        await traverseAndClean(itemPath);
      }
    } else if (stats.isFile()) {

      if (EXCLUDED_FILES.includes(item)) {

        await fs.remove(itemPath);
        logger.info(`Removed file: ${itemPath}`);
      }
    }
  }
};


const minifyJavaScriptFiles = async (dirPath: string): Promise<void> => {
 
  const items = await fs.readdir(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = await fs.stat(itemPath);

    if (stats.isDirectory()) {
     
      await minifyJavaScriptFiles(itemPath); // Recursively minify in subdirectories
    } else if (stats.isFile() && path.extname(item) === '.js') {
    
      try {
        const code = await fs.readFile(itemPath, 'utf-8');
        const result = await minify(code);

        if (result.code) {
     
          await fs.writeFile(itemPath, result.code, 'utf-8');
          logger.info(`Minified JavaScript file: ${itemPath}`);
        }
      } catch (error) {
   
        logger.error(`Error minifying file ${itemPath}: ${error}`);
      }
    }
  }
};

