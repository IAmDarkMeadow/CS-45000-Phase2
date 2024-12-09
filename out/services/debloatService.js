"use strict";
/*
 * debloatService.ts
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debloatModule = void 0;
const terser_1 = require("terser");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const Logger_js_1 = __importDefault(require("../utils/Logger.js"));
const EXCLUDED_DIRS = ['test', 'tests', '__tests__', 'docs', 'examples', 'example', 'benchmark', 'benchmarks', 'coverage'];
const EXCLUDED_FILES = ['README.md', 'LICENSE', 'CHANGELOG.md', '.eslintrc', '.prettierrc', 'tsconfig.json', 'webpack.config.js'];
/**
 * Recursively removes excluded directories and files from the specified path
 * @param dirPath - The root directory path to debloat
 */
const debloatModule = (dirPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Logger_js_1.default.info(`Starting debloat process for ${dirPath}`);
        // Recursively traverse the directory
        yield traverseAndClean(dirPath);
        // Do minification after cleaning
        minifyJavaScriptFiles(dirPath);
        Logger_js_1.default.info(`Debloat process completed for ${dirPath}`);
    }
    catch (error) {
        Logger_js_1.default.error(`Error during debloat process: ${error}`);
        throw error;
    }
});
exports.debloatModule = debloatModule;
/**
 * Helper function to traverse directories and remove excluded items
 * @param currentPath - Current directory path in traversal
 */
const traverseAndClean = (currentPath) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield fs_extra_1.default.readdir(currentPath);
    for (const item of items) {
        const itemPath = path_1.default.join(currentPath, item);
        const stats = yield fs_extra_1.default.stat(itemPath);
        if (stats.isDirectory()) {
            if (EXCLUDED_DIRS.includes(item.toLowerCase())) {
                yield fs_extra_1.default.remove(itemPath);
                Logger_js_1.default.info(`Removed directory: ${itemPath}`);
            }
            else {
                // Continue traversing subdirectories
                yield traverseAndClean(itemPath);
            }
        }
        else if (stats.isFile()) {
            if (EXCLUDED_FILES.includes(item)) {
                yield fs_extra_1.default.remove(itemPath);
                Logger_js_1.default.info(`Removed file: ${itemPath}`);
            }
        }
    }
});
const minifyJavaScriptFiles = (dirPath) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield fs_extra_1.default.readdir(dirPath);
    for (const item of items) {
        const itemPath = path_1.default.join(dirPath, item);
        const stats = yield fs_extra_1.default.stat(itemPath);
        if (stats.isDirectory()) {
            yield minifyJavaScriptFiles(itemPath); // Recursively minify in subdirectories
        }
        else if (stats.isFile() && path_1.default.extname(item) === '.js') {
            try {
                const code = yield fs_extra_1.default.readFile(itemPath, 'utf-8');
                const result = yield (0, terser_1.minify)(code);
                if (result.code) {
                    yield fs_extra_1.default.writeFile(itemPath, result.code, 'utf-8');
                    Logger_js_1.default.info(`Minified JavaScript file: ${itemPath}`);
                }
            }
            catch (error) {
                Logger_js_1.default.error(`Error minifying file ${itemPath}: ${error}`);
            }
        }
    }
});
//# sourceMappingURL=debloatService.js.map