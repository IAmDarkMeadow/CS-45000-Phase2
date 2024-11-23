// debloatService.test.ts
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { debloatPackage } from '../src/services/debloatService';

  // In debloatService.test.ts
jest.mock('zip-a-folder', () => ({
    zip: jest.fn(),
  }));
  test('debloat package functionality', async () => {
  try {
    // Path to your sample package zip file
    const packagePath = path.join(__dirname, '..', 'sample-package.zip');

    // Read the zip file into a buffer
    const packageBuffer = await readFile(packagePath);

    // Call the debloatPackage function
    const optimizedBuffer = await debloatPackage(packageBuffer);

    // Save the optimized buffer to a new zip file
    const optimizedPackagePath = path.join(__dirname, '..', 'optimized-package.zip');
    await writeFile(optimizedPackagePath, optimizedBuffer);

    console.log('Debloat operation completed successfully.');
    console.log(`Optimized package saved to ${optimizedPackagePath}`);
  } catch (error) {
    console.error('Error during debloat operation:', error);
  }

  
});


