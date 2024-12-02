/*
 * packageModel.ts
 * 
 * Description:
 * This file will download all necessary packages to the machine being used to run the master program
 * 
 * Author: Jacob Esparza, Brayden Devenport
 * Date: 12-02-2024
 * Version: 2.0
 * 
 */

import mongoose from 'mongoose'; //Importing mongoose for MongoDB interaction

// From Jacob MakeModule.ts file 
//
// Defininig the TypeScript interface for module metadata
//
interface ModuleMetadata {
  name: string;         // The name of the module/package
  version: string;      // The version of the module/package
  description: string;  // Description of the module/package (optional)
  s3Location: string;   // Location of the module/package in Amazon S3
}

//
// Note: This code is not from Jacobs MakeModule.ts file
// New code
//

// Defining the Mongoose Schema for the package model
const PackageSchema = new mongoose.Schema<ModuleMetadata>({
  name: { type: String, required: true },       // Name is required
  version: { type: String, required: true },    // Version is required
  description: String,                          // Optional description of the package
  s3Location: String,                           // Optional location of the package in S3
});

//
// Creating a compound index on `name` and `version` to inforce uniqueness
//
PackageSchema.index({ name: 1, version: 1 }, { unique: true });

// Creating and exporting the Mongoose model
export const PackageModel = mongoose.model<ModuleMetadata>('Package', PackageSchema);
