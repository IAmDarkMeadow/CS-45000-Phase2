//debloatService.ts
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile, readFile, mkdir, existsSync, rmdir } from 'fs';
import { rm } from 'fs/promises'; // Updated import
import { zip } from 'zip-a-folder';
import AdmZip from 'adm-zip'; // Import adm-zip
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);
const mkdirAsync = promisify(mkdir);

export const debloatPackage = async (packageBuffer: Buffer): Promise<Buffer> => {
  // Create temporary directories
  const tempDir = join(tmpdir(), `package-${Date.now()}`);
  const outputDir = join(tmpdir(), `output-${Date.now()}`);

  // Ensure directories exist
  await mkdirAsync(tempDir, { recursive: true });
  await mkdirAsync(outputDir, { recursive: true });

  // Write the zip buffer to a file
  const zipPath = join(tempDir, 'package.zip');
  await writeFileAsync(zipPath, packageBuffer);

  // Unzip the package
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tempDir, true);

  // Read package.json
  const packageJsonPath = join(tempDir, 'package.json');
  if (!existsSync(packageJsonPath)) {
    throw new Error('package.json not found in the package.');
  }
  const packageJsonContent = await readFileAsync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  // Determine the entry file
  const entryFile = packageJson.main ? packageJson.main : 'index.js';
  const entryPath = join(tempDir, entryFile);

  // Check if the entry file exists
  if (!existsSync(entryPath)) {
    throw new Error(`Entry file ${entryFile} not found in the package.`);
  }

  // Webpack configuration
  const webpackConfig: webpack.Configuration = {
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
      minimizer: [new TerserPlugin()],
      usedExports: true,
    },
    externals: [nodeExternals()],
  };

  console.log(`Webpack entry point: ${entryPath}`);
  console.log(`Webpack output directory: ${outputDir}`);

  const compiler = webpack(webpackConfig);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        console.error('Webpack Error:', err || stats?.toJson().errors);
        reject(err || stats?.toJson().errors);
      } else {
        resolve(null);
      }
    });
  });

  // Zip the optimized package
  const optimizedZipPath = join(outputDir, 'optimized-package.zip');
  await zipFolder(outputDir, optimizedZipPath);

  // Read the optimized zip file into a buffer
  const optimizedBuffer = await readFileAsync(optimizedZipPath);

  // Clean up temporary directories
  await rm(tempDir, { recursive: true, force: true });
  await rm(outputDir, { recursive: true, force: true });

  return optimizedBuffer;
};

// Helper function to zip a folder
const zipFolder = async (sourceFolder: string, outPath: string) => {
  await zip(sourceFolder, outPath);
};