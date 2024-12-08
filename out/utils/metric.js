"use strict";
/*
 * metric.ts
 * OUTLINE NO USABLE CODE
 * Description:
 * This file is currently just an outline, it does not contain anyworking Metric functions yet
 *
 *
 *
 *
 * Author: Brayden Devenport
 * Date: 12-02-2024
 * Version: 1.0
 *
 */
/*
import { PackageModel } from '../models/packageModel';
import { getPackageJsonFromS3 } from '../services/s3Service';
import semver from 'semver';

export const calculateAndSaveMetrics = async (name: string, version: string) => {
  // Get package.json
  const packageJson = await getPackageJsonFromS3(name, version);
  const dependencies = packageJson.dependencies;

  // Calculate metrics
  const dependencyPinningScore = calculateDependencyPinning(dependencies);
  const codeReviewScore = await calculateCodeReviewFraction(name, version);

  // Update package metrics
  await PackageModel.updateOne(
    { name, version },
    {
      $set: {
        metrics: {
          dependencyPinningScore,
          codeReviewScore,
        },
      },
    }
  );
};

const calculateDependencyPinning = (dependencies: { [key: string]: string }): number => {
  if (!dependencies || Object.keys(dependencies).length === 0) {
    return 1.0;
  }

  let pinnedCount = 0;
  const totalDependencies = Object.keys(dependencies).length;

  for (const depVersion of Object.values(dependencies)) {
    if (isPinnedToMinor(depVersion)) {
      pinnedCount++;
    }
  }

  return pinnedCount / totalDependencies;
};

const isPinnedToMinor = (versionRange: string): boolean => {
  const semverRange = new semver.Range(versionRange);
  return semverRange.set.every((comparators) =>
    comparators.every((comp) => comp.operator === '' && comp.semver.minor !== null)
  );
};

const calculateCodeReviewFraction = async (name: string, version: string): Promise<number> => {
  // Placeholder implementation
  // In reality, you would integrate with your version control system
  return 0.8;
};
*/
//# sourceMappingURL=metric.js.map