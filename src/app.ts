// src/app.ts

import express, { Request, Response } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs-extra';
import axios from 'axios';
import simpleGit from 'simple-git';
import { debloatDirectory, zipDirectory } from './Debloat';
import { uploadFileToS3 } from './Upload';
import logger from './utils/Logger';
import AdmZip from 'adm-zip';


const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 3000;

// Route to handle file uploads
app.post('/upload', upload.single('package'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;  // No return value for the function
      }
  
      const originalFilePath = req.file.path;
      const debloatedDir = path.join(__dirname, 'temp', req.file.filename);
  
      // Extract the uploaded zip file
      await fs.ensureDir(debloatedDir);
      const zip = new AdmZip(originalFilePath);
      zip.extractAllTo(debloatedDir, true);
  
      // Debloat the directory
      await debloatDirectory(debloatedDir);
  
      // Create a new zip file
      const debloatedZipPath = path.join('debloated-packages', req.file.filename + '.zip');
      zipDirectory(debloatedDir, debloatedZipPath);
  
      // Upload to S3
      const s3Key = `packages/${path.basename(debloatedZipPath)}`;
      await uploadFileToS3(debloatedZipPath, s3Key);
  
      // Clean up
      await fs.remove(originalFilePath);
      await fs.remove(debloatedDir);
      await fs.remove(debloatedZipPath);
  
      res.status(200).json({ message: 'Upload successful' });
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Route to handle repository URLs
app.post('/upload-repo', express.json(), async (req: Request, res: Response) => {
    try {
      const repoUrl = req.body.repoUrl;
      if (!repoUrl) {
        res.status(400).send('No repository URL provided.');
        return;  // No return value for the function
      }
  
      const tempDir = path.join(__dirname, 'temp', 'repo-' + Date.now());
      await fs.ensureDir(tempDir);
  
      // Clone the repository
      const git = simpleGit();
      await git.clone(repoUrl, tempDir);
  
      // Debloat the directory
      await debloatDirectory(tempDir);
  
      // Create a zip file
      const debloatedZipPath = path.join('debloated-packages', 'repo-' + Date.now() + '.zip');
      zipDirectory(tempDir, debloatedZipPath);
  
      // Upload to S3
      const s3Key = `packages/${path.basename(debloatedZipPath)}`;
      await uploadFileToS3(debloatedZipPath, s3Key);
  
      // Clean up
      await fs.remove(tempDir);
      await fs.remove(debloatedZipPath);
  
      res.status(200).json({ message: 'Upload repo successful' });
    } catch (error) {
      console.error('Upload Repo Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Simple form for testing (optional)
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>Upload Package</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="package" />
      <button type="submit">Upload</button>
    </form>
    <h1>Upload Repository</h1>
    <form action="/upload-repo" method="post">
      <input type="text" name="repoUrl" placeholder="Repository URL" />
      <button type="submit">Upload</button>
    </form>
  `);
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
