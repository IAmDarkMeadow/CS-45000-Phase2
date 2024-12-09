// test/upload.test.ts
import request from 'supertest';
import app from '../src/app';
import path from 'path';

jest.mock('../services/s3Service', () => ({
  uploadToS3: jest.fn().mockResolvedValue(undefined),
}));

describe('Upload Package', () => {
  it('should upload a package successfully without debloat', async () => {
    const packagePath = path.join(__dirname, 'test-packages', 'valid-package.zip');
    const response = await request(app)
      .post('/upload?debloat=false')
      .attach('file', packagePath);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Package uploaded successfully.');
    expect(response.body.debloated).toBe(false);
  });

  it('should upload and debloat a package successfully', async () => {
    const packagePath = path.join(__dirname, 'test-packages', 'valid-package.zip');
    const response = await request(app)
      .post('/upload?debloat=true')
      .attach('file', packagePath);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Package uploaded successfully.');
    expect(response.body.debloated).toBe(true);
  });

  it('should return an error if no file is uploaded', async () => {
    const response = await request(app)
      .post('/upload?debloat=false');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file uploaded.');
  });

  it('should return an error if package.json is missing', async () => {
    const packagePath = path.join(__dirname, 'test-packages', 'invalid-package.zip');
    const response = await request(app)
      .post('/upload?debloat=false')
      .attach('file', packagePath);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid package: package.json not found.');
  });
});
