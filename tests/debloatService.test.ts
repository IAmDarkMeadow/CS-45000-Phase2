import { debloatModule } from '../src/services/debloatService';
import logger from '../src/utils/Logger';
import path from 'path';
import * as fs from 'fs-extra';
import { build } from 'esbuild';

jest.mock('../src/utils/Logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('fs-extra', () => ({
  pathExists: jest.fn(),
  readJson: jest.fn(),
  remove: jest.fn(),
  ensureDir: jest.fn(),
  copy: jest.fn(),
}));

jest.mock('esbuild', () => ({
  build: jest.fn(),
}));

describe('debloatModule Tests', () => {
  const directory = '/fake/dir';
  const packageJsonPath = path.join(directory, 'package.json');
  const defaultEntryPoint = path.join(directory, 'index.js');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should debloat module successfully using package.json main field', async () => {
    // Mock fs and esbuild calls
    (fs.pathExists as jest.Mock).mockImplementation(async (p: string) => {
      if (p === packageJsonPath) return true; // package.json exists
      if (p === path.join(directory, 'main.js')) return true; // main file exists
      return false;
    });
    (fs.readJson as jest.Mock).mockResolvedValue({ main: 'main.js' });
    (fs.remove as jest.Mock).mockResolvedValue(undefined);
    (fs.ensureDir as jest.Mock).mockResolvedValue(undefined);
    (build as jest.Mock).mockResolvedValue({});

    await debloatModule(directory);

    expect(logger.info).toHaveBeenCalledWith(`Starting debloating process for directory: ${directory}`);
    expect(logger.info).toHaveBeenCalledWith(`Debloating completed successfully. Output at ${path.join(directory, 'dist')}`);
    expect(build).toHaveBeenCalledWith(expect.objectContaining({
      entryPoints: [path.join(directory, 'main.js')],
      outfile: path.join(directory, 'dist', 'bundle.js'),
    }));
  });

  it('should use index.js if package.json does not exist', async () => {
    (fs.pathExists as jest.Mock).mockImplementation(async (p: string) => {
      if (p === packageJsonPath) return false; // No package.json
      if (p === defaultEntryPoint) return true; // index.js exists
      return false;
    });
    (fs.remove as jest.Mock).mockResolvedValue(undefined);
    (fs.ensureDir as jest.Mock).mockResolvedValue(undefined);
    (build as jest.Mock).mockResolvedValue({});

    await debloatModule(directory);

    expect(logger.info).toHaveBeenCalledWith(`Starting debloating process for directory: ${directory}`);
    expect(logger.info).toHaveBeenCalledWith(`Debloating completed successfully. Output at ${path.join(directory, 'dist')}`);
    expect(build).toHaveBeenCalledWith(expect.objectContaining({
      entryPoints: [defaultEntryPoint],
    }));
  });

  it('should throw an error if entry point is not found', async () => {
    (fs.pathExists as jest.Mock).mockResolvedValue(false); 
    // package.json does not exist AND index.js does not exist

    await expect(debloatModule(directory)).rejects.toThrow(`Entry point not found at ${defaultEntryPoint}`);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error during debloating process: Entry point not found'),
    );
  });

  it('should log and throw error if esbuild fails', async () => {
    (fs.pathExists as jest.Mock).mockImplementation(async (p: string) => {
      if (p === packageJsonPath) return true;
      if (p === path.join(directory, 'main.js')) return true;
      return false;
    });
    (fs.readJson as jest.Mock).mockResolvedValue({ main: 'main.js' });
    (fs.remove as jest.Mock).mockResolvedValue(undefined);
    (fs.ensureDir as jest.Mock).mockResolvedValue(undefined);

    (build as jest.Mock).mockRejectedValue(new Error('Build failed'));

    await expect(debloatModule(directory)).rejects.toThrow('Build failed');

    expect(logger.error).toHaveBeenCalledWith(
      'Error during debloating process: Build failed'
    );
  });
});
