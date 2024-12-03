"use strict";
// // src/Debloat.ts
// import * as fs from 'fs-extra';
// import * as path from 'path';
// import AdmZip from 'adm-zip';
// import logger from './utils/Logger';
// export async function debloatDirectory(directoryPath: string): Promise<void> {
//   try {
//     // Remove unnecessary files and directories
//     const itemsToRemove = [
//       'test', 'tests', 'docs', 'examples', '.github', '.git', 'README.md', 'node_modules'
//     ];
//     for (const item of itemsToRemove) {
//       const itemPath = path.join(directoryPath, item);
//       if (await fs.pathExists(itemPath)) {
//         await fs.remove(itemPath);
//         logger.info(`Removed ${itemPath}`);
//       }
//     }
//     // Remove devDependencies from package.json
//     const packageJsonPath = path.join(directoryPath, 'package.json');
//     if (await fs.pathExists(packageJsonPath)) {
//       const packageJson = await fs.readJSON(packageJsonPath);
//       delete packageJson.devDependencies;
//       await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
//       logger.info(`Removed devDependencies from ${packageJsonPath}`);
//     }
//   } catch (error) {
//     logger.error(`Error debloating directory: ${error}`);
//     throw error;
//   }
// }
// export function zipDirectory(sourceDir: string, outPath: string): void {
//   try {
//     const zip = new AdmZip();
//     zip.addLocalFolder(sourceDir);
//     zip.writeZip(outPath);
//     logger.info(`Created zip file at ${outPath}`);
//   } catch (error) {
//     logger.error(`Error creating zip file: ${error}`);
//     throw error;
//   }
// }
//# sourceMappingURL=Debloat.js.map