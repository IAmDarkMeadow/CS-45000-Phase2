/*
 * packageModel.ts
 * 
 * Description:
 * This file contains the TypeScript interface for module metadata used in the master program.
 * 
 * Author: Jacob Esparza, Brayden Devenport
 * Date: 12-02-2024
 * Version: 2.0
 * 
 */

import archiver from 'archiver';
import path from 'path';
import fs from 'fs-extra';

// From Jacob MakeModule.ts file 
//
// Defininig the TypeScript interface for module metadata
//
export interface ModuleMetadata {
  name: string;         // The name of the module/package
  version: string;      // The version of the module/package
  description: string;  // Description of the module/package (optional)
  s3Location: string;   // Location of the module/package in Amazon S3
  githublink: string;   // The githublink that we used
}

export const zipDirectory = async (sourceDir: string, outPath: string): Promise<void> => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', (err: any) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};