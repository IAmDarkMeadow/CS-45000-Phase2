"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Router allows us to define modular, mountable route handlers. 
const express_validator_1 = require("express-validator"); // 
const packageController_1 = require("../controllers/packageController"); //import the uploadPackage functioin from Package Controller
const upload_config_1 = __importDefault(require("../config/upload-config"));
const semver_1 = __importDefault(require("semver"));
//
//Creates an instance of Router to defiine routes speciffic to package operations
//
const router = (0, express_1.Router)();
// Middleware to handle validation errors
const validationHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    next();
};
// Route for uploading a package
router.post('/upload', // URL path for the upload route 
[
    // Middleware for validating request body
    (0, express_validator_1.body)('name').notEmpty().withMessage('Package name is required'), // Ensure 'name' is provided in the request body
    (0, express_validator_1.body)('version').notEmpty().withMessage('Version is required'), // Ensure 'version' is provided in the request body
    (0, express_validator_1.body)('debloat').optional().isBoolean(), // Optional 'debloat' field, must be a boolean if provided
    (0, express_validator_1.body)('version').custom((value) => {
        // Custom validation for 'version' to ensure it adheres to semantic versioning
        if (!semver_1.default.valid(value)) {
            throw new Error('Invalid version format');
        }
        return true;
    }),
], validationHandler, // Middleware to handle validation errors
upload_config_1.default.single('package'), // upload after validation has passed
// Controller function to handle the package upload logic
packageController_1.uploadPackage);
//Allows router to be imported and used in maiin application to ensure modularity
exports.default = router;
//# sourceMappingURL=packageRoutes.js.map