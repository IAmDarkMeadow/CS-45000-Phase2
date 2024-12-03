"use strict";
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
exports.debloatPackage = void 0;
//debloatService.ts
const util_1 = require("util");
const os_1 = require("os");
const path_1 = require("path");
const fs_1 = require("fs");
const promises_1 = require("fs/promises"); // Updated import
const zip_a_folder_1 = require("zip-a-folder");
const adm_zip_1 = __importDefault(require("adm-zip")); // Import adm-zip
const webpack_1 = __importDefault(require("webpack"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const readFileAsync = (0, util_1.promisify)(fs_1.readFile);
const mkdirAsync = (0, util_1.promisify)(fs_1.mkdir);
const debloatPackage = (packageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    // Create temporary directories
    const tempDir = (0, path_1.join)((0, os_1.tmpdir)(), `package-${Date.now()}`);
    const outputDir = (0, path_1.join)((0, os_1.tmpdir)(), `output-${Date.now()}`);
    // Ensure directories exist
    yield mkdirAsync(tempDir, { recursive: true });
    yield mkdirAsync(outputDir, { recursive: true });
    // Write the zip buffer to a file
    const zipPath = (0, path_1.join)(tempDir, 'package.zip');
    yield writeFileAsync(zipPath, packageBuffer);
    // Unzip the package
    const zip = new adm_zip_1.default(zipPath);
    zip.extractAllTo(tempDir, true);
    // Read package.json
    const packageJsonPath = (0, path_1.join)(tempDir, 'package.json');
    if (!(0, fs_1.existsSync)(packageJsonPath)) {
        throw new Error('package.json not found in the package.');
    }
    const packageJsonContent = yield readFileAsync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    // Determine the entry file
    const entryFile = packageJson.main ? packageJson.main : 'index.js';
    const entryPath = (0, path_1.join)(tempDir, entryFile);
    // Check if the entry file exists
    if (!(0, fs_1.existsSync)(entryPath)) {
        throw new Error(`Entry file ${entryFile} not found in the package.`);
    }
    // Webpack configuration
    const webpackConfig = {
        mode: 'production',
        entry: entryPath,
        output: {
            path: outputDir,
            filename: 'bundle.js',
            libraryTarget: 'commonjs2',
        },
        target: 'node',
        optimization: {
            minimize: true,
            minimizer: [new terser_webpack_plugin_1.default()],
            usedExports: true,
        },
        externals: [(0, webpack_node_externals_1.default)()],
    };
    console.log(`Webpack entry point: ${entryPath}`);
    console.log(`Webpack output directory: ${outputDir}`);
    const compiler = (0, webpack_1.default)(webpackConfig);
    yield new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err || (stats === null || stats === void 0 ? void 0 : stats.hasErrors())) {
                console.error('Webpack Error:', err || (stats === null || stats === void 0 ? void 0 : stats.toJson().errors));
                reject(err || (stats === null || stats === void 0 ? void 0 : stats.toJson().errors));
            }
            else {
                resolve(null);
            }
        });
    });
    // Zip the optimized package
    const optimizedZipPath = (0, path_1.join)(outputDir, 'optimized-package.zip');
    yield zipFolder(outputDir, optimizedZipPath);
    // Read the optimized zip file into a buffer
    const optimizedBuffer = yield readFileAsync(optimizedZipPath);
    // Clean up temporary directories
    yield (0, promises_1.rm)(tempDir, { recursive: true, force: true });
    yield (0, promises_1.rm)(outputDir, { recursive: true, force: true });
    return optimizedBuffer;
});
exports.debloatPackage = debloatPackage;
// Helper function to zip a folder
const zipFolder = (sourceFolder, outPath) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, zip_a_folder_1.zip)(sourceFolder, outPath);
});
//# sourceMappingURL=debloatService.js.map