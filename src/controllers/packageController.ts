/*
 * packageController.ts
 * 
 * Description:
 * This file contains the functions that have connect to the S3 service.
 * This file contains the downloadFileS3 that Grayson created. 
 * It also contains the uploadModuleMetadata that Jacob Esparza created. 
 * 
 * Author: Jacob Esparza, Brayden Devenport
 * Date: 12-02-2024
 * Version: 1.0
 * 
 */






import { Request, Response } from 'express';
import { PackageModel } from '../models/packageModel';
import { uploadModuleMetadata } from '../services/s3Service';
import { validationResult } from 'express-validator';

export const createMetaData = async (req: Request, res: Response) => {
  const { name, version, description, s3Location } = req.body;

  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const moduleData = {
    name,
    version,
    description,
    s3Location,
  };

  try {
    // Save metadata to MongoDB
    const packageDoc = new PackageModel(moduleData);
    await packageDoc.save();

    // Upload metadata to S3
    await uploadModuleMetadata(moduleData);

    res.status(201).json({ message: `Successfully uploaded metadata for ${name}` });
  } catch (error) {
    res.status(500).json({ error: `Error uploading metadata for ${name}: ${error.message}` });
  }
};
