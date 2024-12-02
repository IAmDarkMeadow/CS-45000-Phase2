// test/download.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Download Package', () => {
  // Ensure the package is uploaded before testing download
  beforeAll(async () => {
    // Upload a test package
    // You can use the same code as in the upload test or mock the upload
  });

  it('should download a package successfully', async () => {
    const packageName = 'test-package';
    const packageVersion = '1.0.0';

    const response = await request(app)
      .get(`/download/${packageName}/${packageVersion}`)
      .expect(200);

    expect(response.headers['content-type']).toBe('application/zip');
    expect(response.headers['content-disposition']).toContain(`${packageName}-${packageVersion}.zip`);
  });

  it('should return an error if package does not exist', async () => {
    const packageName = 'non-existent-package';
    const packageVersion = '0.0.1';

    const response = await request(app)
      .get(`/download/${packageName}/${packageVersion}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});
