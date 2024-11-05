import { Request, Response } from 'express';
import { debloatPackage } from '../services/debloatService';
import { uploadToS3 } from '../services/s3Service';
import AdmZip from 'adm-zip';

export const uploadPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const debloat = req.query.debloat === 'true';

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    // Validate the uploaded package
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    // Find and parse package.json
    const packageJsonEntry = zipEntries.find((entry) => entry.entryName === 'package.json');
    if (!packageJsonEntry) {
      res.status(400).json({ error: 'Invalid package: package.json not found.' });
      return;
    }

    const packageJsonContent = packageJsonEntry.getData().toString('utf8');
    const packageJson = JSON.parse(packageJsonContent);

    const packageName = packageJson.name;
    const packageVersion = packageJson.version;

    if (!packageName || !packageVersion) {
      res.status(400).json({ error: 'Invalid package: name or version missing in package.json.' });
      return;
    }

    let packageBuffer = req.file.buffer;

    if (debloat) {
      // Debloat the package
      packageBuffer = await debloatPackage(packageBuffer);
    }

    // Upload the package to S3
    const s3Key = `${packageName}/${packageVersion}/package.zip`;

    await uploadToS3(packageBuffer, s3Key);

    res.status(201).json({
      message: 'Package uploaded successfully.',
      package: packageName,
      version: packageVersion,
      debloated: debloat,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
