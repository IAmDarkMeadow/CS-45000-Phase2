/*
 * packageRoutes.ts
 * 
 * Description:
 * This file defines the Express router for handling package uploads. It includes validation for 
 * the package metadata and handles the uploading of packages to Amazon S3.
 * 
 * Author: Brayden Devenport
 * Date: 12-01-2024
 * Version: 1.0
 * 
 */


import { Router, Request, Response, NextFunction } from 'express';                                // Router allows us to define modular, mountable route handlers. 
import { body, validationResult } from 'express-validator';                        // 
import { uploadPackage } from '../controllers/packageController';//import the uploadPackage functioin from Package Controller
import upload from '../config/upload-config';
import semver from 'semver';


//
//Creates an instance of Router to defiine routes speciffic to package operations
//
const router = Router();

// Middleware to handle validation errors
const validationHandler = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  };


// Route for uploading a package
router.post(
    '/upload', // URL path for the upload route 

    
    [
      // Middleware for validating request body
      body('name').notEmpty().withMessage('Package name is required'), // Ensure 'name' is provided in the request body
      body('version').notEmpty().withMessage('Version is required'), // Ensure 'version' is provided in the request body
      body('debloat').optional().isBoolean(), // Optional 'debloat' field, must be a boolean if provided
      body('version').custom((value) => {
        // Custom validation for 'version' to ensure it adheres to semantic versioning
        if (!semver.valid(value)) {
          throw new Error('Invalid version format');
        }
        return true;
      }),
    ],
    validationHandler, // Middleware to handle validation errors

    upload.single('package'), // upload after validation has passed

    // Controller function to handle the package upload logic
    // UploadPackage is called below
    // 
    
    //uploadPackage 
);


//Allows router to be imported and used in maiin application to ensure modularity
export default router;
