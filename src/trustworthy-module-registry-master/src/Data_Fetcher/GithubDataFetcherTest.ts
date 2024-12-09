import { GitHubDataFetcher } from './GitHubDataFetcher';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../..', '.env') });

const githubToken = process.env.GITHUB_TOKEN;
const repoUrl = 'https://github.com/facebook/react';

if (!githubToken) {
    console.error('GITHUB_TOKEN is not set in the environment variables');
    process.exit(1);
}

const dataFetcher = new GitHubDataFetcher(repoUrl, githubToken);

async function runTests() {
    console.log('='.repeat(50));
    console.log(`Testing GitHubDataFetcher for ${repoUrl}`);
    console.log('='.repeat(50));

    try {
        // Testing fetchCommits
        console.log('\n1. Testing fetchCommits:');
        const commitsData = await dataFetcher.fetchCommits();
        console.log(`Total Commits: ${commitsData.totalCommits}`);
        console.log(`Average Changes Per Commit: ${commitsData.averageChangesPerCommit}`);
        console.log(`Recent Commits: ${commitsData.recentCommits.length} fetched`);

        // Testing fetchContributors
        console.log('\n2. Testing fetchContributors:');
        const contributorsData = await dataFetcher.fetchContributors();
        console.log(`Total Mentionable Users: ${contributorsData.totalMentionableUsers}`);
        console.log(`Total Actual Contributors (based on analyzed commits): ${contributorsData.totalActualContributors}`);
        console.log(`Average Contributions per Contributor: ${contributorsData.averageContributions}`);
        console.log('Top 5 Contributors:');
        contributorsData.top5Contributors.forEach((contributor: { login: string; contributions: number }) => {
            console.log(`  - ${contributor.login}: ${contributor.contributions} commits`);
        });
        console.log('Contribution Distribution:');
        console.log(`  Single Contribution: ${contributorsData.contributionDistribution.singleContribution}`);
        console.log(`  2-5 Contributions: ${contributorsData.contributionDistribution.twoToFiveContributions}`);
        console.log(`  6-10 Contributions: ${contributorsData.contributionDistribution.sixToTenContributions}`);
        console.log(`  More than 10 Contributions: ${contributorsData.contributionDistribution.moreThanTenContributions}`);

        // Testing fetchTestingResults
        console.log('\n3. Testing fetchTestingResults:');
        const testingData = await dataFetcher.fetchTestingResults();
        console.log(`Open Bugs: ${testingData.openBugs}`);
        console.log(`Open Pull Requests: ${testingData.openPullRequests}`);
        console.log(`Days Since Last Release: ${testingData.daysSinceLastRelease || 'N/A'}`);
        console.log(`Stars: ${testingData.stars}`);
        console.log(`Forks: ${testingData.forks}`);
        console.log(`Watchers: ${testingData.watchers}`);
        console.log(`Contributors: ${testingData.contributors}`);

        // Testing fetchDocumentation
        console.log('\n4. Testing fetchDocumentation:');
        const documentation = await dataFetcher.fetchDocumentation();
        console.log(`Documentation Preview (first 150 characters):`);
        console.log(documentation.substring(0, 150) + '...');

        // Testing fetchMaintainerMetrics
        console.log('\n5. Testing fetchMaintainerMetrics:');
        const metricsData = await dataFetcher.fetchMaintainerMetrics();
        console.log(`Commits Last Month: ${metricsData.commitsLastMonth}`);
        console.log(`Average Commits Per Month: ${metricsData.avgCommitsPerMonth}`);
        console.log(`Total Commits: ${metricsData.totalCommits}`);
        console.log(`Open Issues: ${metricsData.openIssues}`);
        console.log(`Closed Issues: ${metricsData.closedIssues}`);
        console.log(`Total Releases: ${metricsData.totalReleases}`);
        console.log(`Releases in the Last Year: ${metricsData.releasesLastYear}`);

        // Testing fetchLicense
        console.log('\n6. Testing fetchLicense:');
        const licenseData = await dataFetcher.fetchLicense();
        console.log(`License Name: ${licenseData.name || 'N/A'}`);
        console.log(`License SPDX ID: ${licenseData.spdxId || 'N/A'}`);
        console.log(`License URL: ${licenseData.url || 'N/A'}`);

        // Testing fetchAllData
        console.log('\n7. Testing fetchAllData:');
        const allData = await dataFetcher.fetchAllData();
        console.log('All data fetched successfully. Summary:');
        console.log(`- Commits data available: ${allData.commits !== undefined}`);
        console.log(`- Contributors data available: ${allData.contributors !== undefined}`);
        console.log(`- Maintainer metrics available: ${allData.maintainerMetrics !== undefined}`);
        console.log(`- License data available: ${allData.license !== undefined}`);
        console.log(`- Documentation available: ${allData.documentation !== undefined}`);
        console.log(`- Testing results available: ${allData.testingResults !== undefined}`);

    } catch (error) {
        console.error('Error during tests:', error);
    }

    console.log('\n' + '='.repeat(50));
    console.log('Tests completed');
    console.log('='.repeat(50));
}

runTests();