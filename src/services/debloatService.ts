import { promisify } from 'util';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile, readFile, mkdir } from 'fs';
import { zip } from 'zip-a-folder';
import AdmZip from 'adm-zip'; // Import adm-zip
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

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

  // Perform tree shaking and minification using Webpack
  const webpackConfig: webpack.Configuration = {
    mode: 'production',
    entry: join(tempDir, 'index.js'), // Adjust as necessary
    output: {
      path: outputDir,
      filename: 'bundle.js',
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      usedExports: true,
    },
    // Additional configurations may be required
  };

  const compiler = webpack(webpackConfig);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        console.error('Webpack Error:', err || stats?.toJson().errors);
        reject(err || stats?.toJson().errors);
      }
      resolve(null);
    });
  });

  // Zip the optimized package
  const optimizedZipPath = join(outputDir, 'optimized-package.zip');
  await zipFolder(outputDir, optimizedZipPath);

  // Read the optimized zip file into a buffer
  const optimizedBuffer = await readFileAsync(optimizedZipPath);

  return optimizedBuffer;
};

// Helper function to zip a folder
const zipFolder = async (sourceFolder: string, outPath: string) => {
  await zip(sourceFolder, outPath);
};
