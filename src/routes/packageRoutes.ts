/*
 * packageRoutes.ts
 * 
 * Description:
 * This will handle the upload logic by defining a route that maps HTTP requests to their corresponding controller functions.
 * 
 * Author: Brayden Devenport
 * Date: 12-01-2024
 * Version: 1.0
 * 
 */

//Router allows us to define modular, mountable route handlers. 
import { Router } from 'express';
//import the uploadPackage functioin from Package Controller
import { uploadPackage } from '../controllers/packageController';

//
//Creates an instance of Router to defiine routes speciffic to package operations
//
const router = Router();

router.post('/upload', uploadPackage);


//Allows router to be imported and used in maiin application to ensure modularity
export default router;
