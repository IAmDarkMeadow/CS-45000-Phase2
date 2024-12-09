"use strict";
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
const esbuild_1 = require("esbuild");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const Logger_js_1 = __importDefault(require("../utils/Logger.js"));
/**
 * Performs tree shaking and minification on the specified directory using esbuild.
 * @param directory - The directory containing the module to optimize.
 * @returns A promise that resolves when debloating is complete.
 */
const debloatModule = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Logger_js_1.default.info(`Starting debloating process for directory: ${directory}`);
        // Define entry point
        let entryPoint = '';
        // Attempt to find entry point from package.json
        const packageJsonPath = path_1.default.join(directory, 'package.json');
        if (yield fs_extra_1.default.pathExists(packageJsonPath)) {
            const packageJson = yield fs_extra_1.default.readJson(packageJsonPath);
            if (packageJson.main) {
                entryPoint = path_1.default.join(directory, packageJson.main);
            }
            else if (packageJson.module) {
                entryPoint = path_1.default.join(directory, packageJson.module);
            }
            else {
                // Default to index.js if main is not specified
                entryPoint = path_1.default.join(directory, 'index.js');
            }
        }
        else {
            // If package.json does not exist, default to index.js
            entryPoint = path_1.default.join(directory, 'index.js');
        }
        // Check if the entry point exists
        if (!(yield fs_extra_1.default.pathExists(entryPoint))) {
            throw new Error(`Entry point not found at ${entryPoint}`);
        }
        // Define output directory
        const outdir = path_1.default.join(directory, 'dist');
        // Ensure output directory is clean
        yield fs_extra_1.default.remove(outdir);
        yield fs_extra_1.default.ensureDir(outdir);
        // Perform the build with esbuild
        yield (0, esbuild_1.build)({
            entryPoints: [entryPoint],
            bundle: true,
            minify: true,
            sourcemap: false,
            treeShaking: true,
            platform: 'node', // Adjust based on your module's target environment
            target: ['es2015'], // Adjust based on your module's target JavaScript version
            outfile: path_1.default.join(outdir, 'bundle.js'),
            logLevel: 'silent', // Suppress esbuild logs; handle logging manually
        });
        Logger_js_1.default.info(`Debloating completed successfully. Output at ${outdir}`);
        // Optionally, you can replace the original files with the debloated bundle
        // For example, replace index.js with the bundle
        // await fs.copy(path.join(outdir, 'bundle.js'), entryPoint, { overwrite: true });
        // Alternatively, you can keep the debloated code in the 'dist' folder
        // and adjust your packaging process to include 'dist' instead of the original source
    }
    catch (error) {
        Logger_js_1.default.error(`Error during debloating process: ${error.message}`);
        throw error;
    }
});
exports.debloatModule = debloatModule;
//# sourceMappingURL=debloatService.js.map