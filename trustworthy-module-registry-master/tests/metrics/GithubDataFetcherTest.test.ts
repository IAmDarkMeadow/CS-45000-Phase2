import { GitHubDataFetcher } from '../../src/Data_Fetcher/GitHubDataFetcher';

const URL = 'https://github.com/microsoft/graphrag';
 // Ensure this token has the necessary permissions

describe('GitHubDataFetcher', () => {
    let dataFetcher: GitHubDataFetcher;

    beforeAll(() => {
        dataFetcher = new GitHubDataFetcher(URL, token);
    });

    test('fetchCommits should return correct data', async () => {
        const result = await dataFetcher.fetchCommits();
        expect(result).toHaveProperty('totalCommits');
        expect(result).toHaveProperty('recentCommits');
        expect(result).toHaveProperty('averageChangesPerCommit');
        expect(typeof result.totalCommits).toBe('number');
        expect(Array.isArray(result.recentCommits)).toBe(true);
        expect(typeof result.averageChangesPerCommit).toBe('number');
    });

    test('fetchContributors should return correct data', async () => {
        const result = await dataFetcher.fetchContributors();
        expect(result).toHaveProperty('totalMentionableUsers');
        expect(result).toHaveProperty('totalActualContributors');
        expect(result).toHaveProperty('averageContributions');
        expect(result).toHaveProperty('top5Contributors');
        expect(result).toHaveProperty('contributionDistribution');
        expect(typeof result.totalMentionableUsers).toBe('number');
        expect(typeof result.totalActualContributors).toBe('number');
        expect(typeof result.averageContributions).toBe('number');
        expect(Array.isArray(result.top5Contributors)).toBe(true);
        expect(typeof result.contributionDistribution).toBe('object');
    });

    test('fetchTestingResults should return correct data', async () => {
        const result = await dataFetcher.fetchTestingResults();
        expect(result).toHaveProperty('openBugs');
        expect(result).toHaveProperty('openPullRequests');
        expect(result).toHaveProperty('daysSinceLastRelease');
        expect(result).toHaveProperty('stars');
        expect(result).toHaveProperty('forks');
        expect(result).toHaveProperty('watchers');
        expect(result).toHaveProperty('contributors');
        expect(typeof result.openBugs).toBe('number');
        expect(typeof result.openPullRequests).toBe('number');
        expect(typeof result.daysSinceLastRelease).toBe('number');
        expect(typeof result.stars).toBe('number');
        expect(typeof result.forks).toBe('number');
        expect(typeof result.watchers).toBe('number');
        expect(typeof result.contributors).toBe('number');
    });

    test('fetchDocumentation should return documentation or default message', async () => {
        const result = await dataFetcher.fetchDocumentation();
        expect(typeof result).toBe('string');
        expect(result).toBeTruthy(); // Ensure it’s not an empty string
    });

    test('fetchMaintainerMetrics should return correct data', async () => {
        const result = await dataFetcher.fetchMaintainerMetrics();
        expect(result).toHaveProperty('commitsLastMonth');
        expect(result).toHaveProperty('avgCommitsPerMonth');
        expect(result).toHaveProperty('totalCommits');
        expect(result).toHaveProperty('openIssues');
        expect(result).toHaveProperty('closedIssues');
        expect(result).toHaveProperty('totalReleases');
        expect(result).toHaveProperty('releasesLastYear');
        expect(typeof result.commitsLastMonth).toBe('number');
        expect(typeof result.avgCommitsPerMonth).toBe('number');
        expect(typeof result.totalCommits).toBe('number');
        expect(typeof result.openIssues).toBe('number');
        expect(typeof result.closedIssues).toBe('number');
        expect(typeof result.totalReleases).toBe('number');
        expect(typeof result.releasesLastYear).toBe('number');
    });

    test('fetchLicense should return license information', async () => {
        const result = await dataFetcher.fetchLicense();
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('spdxId');
        expect(result).toHaveProperty('url');
        expect(typeof result.name).toBe('string');
        expect(typeof result.spdxId).toBe('string');
        expect(typeof result.url).toBe('string');
    });

    test('fetchAllData should return all data correctly', async () => {
        const result = await dataFetcher.fetchAllData();
        expect(result).toHaveProperty('commits');
        expect(result).toHaveProperty('contributors');
        expect(result).toHaveProperty('testingResults');
        expect(result).toHaveProperty('documentation');
        expect(result).toHaveProperty('maintainerMetrics');
        expect(result).toHaveProperty('license');

        // Check types of each property to ensure completeness
        expect(result.commits).toHaveProperty('totalCommits');
        expect(result.commits).toHaveProperty('recentCommits');
        expect(result.commits).toHaveProperty('averageChangesPerCommit');

        expect(result.contributors).toHaveProperty('totalMentionableUsers');
        expect(result.contributors).toHaveProperty('totalActualContributors');
        expect(result.contributors).toHaveProperty('averageContributions');
        expect(result.contributors).toHaveProperty('top5Contributors');
        expect(result.contributors).toHaveProperty('contributionDistribution');

        expect(result.testingResults).toHaveProperty('openBugs');
        expect(result.testingResults).toHaveProperty('openPullRequests');
        expect(result.testingResults).toHaveProperty('daysSinceLastRelease');
        expect(result.testingResults).toHaveProperty('stars');
        expect(result.testingResults).toHaveProperty('forks');
        expect(result.testingResults).toHaveProperty('watchers');
        expect(result.testingResults).toHaveProperty('contributors');

        expect(result.documentation).toBeTruthy(); // Ensure documentation is not empty

        expect(result.maintainerMetrics).toHaveProperty('commitsLastMonth');
        expect(result.maintainerMetrics).toHaveProperty('avgCommitsPerMonth');
        expect(result.maintainerMetrics).toHaveProperty('totalCommits');
        expect(result.maintainerMetrics).toHaveProperty('openIssues');
        expect(result.maintainerMetrics).toHaveProperty('closedIssues');
        expect(result.maintainerMetrics).toHaveProperty('totalReleases');
        expect(result.maintainerMetrics).toHaveProperty('releasesLastYear');

        expect(result.license).toHaveProperty('name');
        expect(result.license).toHaveProperty('spdxId');
        expect(result.license).toHaveProperty('url');
    });

    test('fetchData should handle HTTP errors gracefully', async () => {
      // Directly call fetchData to simulate error
      try {
          await dataFetcher['fetchData']('{ invalid query }');
      } catch (e: unknown) {
          if (e instanceof Error) {
              expect(e).toBeInstanceOf(Error);
              expect(e.message).toBe('Failed to fetch data from GitHub API');
          } else {
              // Optionally handle other types of errors or rethrow
              throw new Error('Unexpected error type');
          }
      }
  });

    test('fetchData should handle a successful API response', async () => {
        // Simulate a successful response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ data: 'fake data' }),
            })
        ) as jest.Mock;

        const data = await dataFetcher['fetchData']('{ valid query }');
        expect(data).toEqual({ data: 'fake data' });
    });

    test('fetchCommits should return commit data when commits are present', async () => {
        const mockResponse = {
            data: {
                repository: {
                    defaultBranchRef: {
                        target: {
                            history: {
                                totalCount: 10,
                                edges: [
                                    {
                                        node: {
                                            message: 'Initial commit',
                                            committedDate: '2023-09-01T12:34:56Z',
                                            additions: 5,
                                            deletions: 3,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchCommits();
        expect(result.totalCommits).toBe(10);
        expect(result.recentCommits).toHaveLength(1);
        expect(result.averageChangesPerCommit).toBe(8);
    });

    test('fetchCommits should handle an empty commit history', async () => {
        const mockResponse = {
            data: {
                repository: {
                    defaultBranchRef: {
                        target: {
                            history: {
                                totalCount: 0,
                                edges: [],
                            },
                        },
                    },
                },
            },
        };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchCommits();
        expect(result.totalCommits).toBe(0);
        expect(result.recentCommits).toHaveLength(0);
        expect(result.averageChangesPerCommit).toBeNaN();
    });

    test('fetchTestingResults should calculate days since last release when a release exists', async () => {
        const mockResponse = {
            data: {
                repository: {
                    issues: { totalCount: 5 },
                    pullRequests: { totalCount: 3 },
                    releases: { nodes: [{ publishedAt: '2023-08-01T12:00:00Z' }] },
                    stargazerCount: 100,
                    forkCount: 50,
                    watchers: { totalCount: 10 },
                    mentionableUsers: { totalCount: 5 },
                },
            },
        };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchTestingResults();
        expect(result.daysSinceLastRelease).toBeGreaterThan(0);
    });

    test('fetchTestingResults should handle no releases gracefully', async () => {
        const mockResponse = {
            data: {
                repository: {
                    issues: { totalCount: 5 },
                    pullRequests: { totalCount: 3 },
                    releases: { nodes: [] },
                    stargazerCount: 100,
                    forkCount: 50,
                    watchers: { totalCount: 10 },
                    mentionableUsers: { totalCount: 5 },
                },
            },
        };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchTestingResults();
        expect(result.daysSinceLastRelease).toBeNull();
    });
    test('fetchDocumentation should return README.md text when object is present', async () => {
        const mockResponse = {
            data: {
                repository: {
                    object: { text: 'README.md content' }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchDocumentation();
        expect(result).toBe('README.md content');
    });
    test('fetchDocumentation should return README.txt text when object is missing and object2 is present', async () => {
        const mockResponse = {
            data: {
                repository: {
                    object: null,
                    object2: { text: 'README.txt content' }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchDocumentation();
        expect(result).toBe('README.txt content');
    });

    test('fetchDocumentation should return readme.md text when object and object2 are missing and object3 is present', async () => {
        const mockResponse = {
            data: {
                repository: {
                    object: null,
                    object2: null,
                    object3: { text: 'readme.md content' }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchDocumentation();
        expect(result).toBe('readme.md content');
    });

    test('fetchDocumentation should return readme.md text when object and object2 are missing and object3 is present', async () => {
        const mockResponse = {
            data: {
                repository: {
                    object: null,
                    object2: null,
                    object3: { text: 'readme.md content' }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchDocumentation();
        expect(result).toBe('readme.md content');
    });

    test('fetchDocumentation should return readme.txt text when other objects are missing and object4 is present', async () => {
        const mockResponse = {
            data: {
                repository: {
                    object: null,
                    object2: null,
                    object3: null,
                    object4: { text: 'readme.txt content' }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchDocumentation();
        expect(result).toBe('readme.txt content');
    });
    test('fetchDocumentation should return default message when no README files are found', async () => {
        const mockResponse = {
            data: {
                repository: {
                    object: null,
                    object2: null,
                    object3: null,
                    object4: null
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchDocumentation();
        expect(result).toBe('No README file found.');
    });

    test('fetchCommits should handle no commits', async () => {
        const mockResponse = {
            data: {
                repository: {
                    defaultBranchRef: {
                        target: {
                            history: {
                                totalCount: 0,
                                edges: []
                            }
                        }
                    }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchCommits();
        expect(result.totalCommits).toBe(0);
        expect(result.recentCommits).toHaveLength(0);
        expect(result.averageChangesPerCommit).toBeNaN();
    });

    test('fetchTestingResults should handle no releases gracefully', async () => {
        const mockResponse = {
            data: {
                repository: {
                    issues: { totalCount: 5 },
                    pullRequests: { totalCount: 3 },
                    releases: { nodes: [] }, // No releases
                    stargazerCount: 100,
                    forkCount: 50,
                    watchers: { totalCount: 10 },
                    mentionableUsers: { totalCount: 5 }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchTestingResults();
        expect(result.daysSinceLastRelease).toBeNull();  // No releases, so daysSinceLastRelease should be null
    });
    test('fetchCommits should handle missing defaultBranchRef', async () => {
        const mockResponse = {
            data: {
                repository: {
                    defaultBranchRef: null
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        await expect(dataFetcher.fetchCommits()).rejects.toThrow('Cannot read properties of null (reading \'target\')');
    });

    test('fetchMaintainerMetrics should calculate average commits per month correctly', async () => {
        const mockResponse = {
            data: {
                repository: {
                    defaultBranchRef: {
                        target: {
                            history: { totalCount: 10 } // Commits last month
                        }
                    },
                    object: {
                        history: { totalCount: 120 } // Total commits
                    },
                    issues: { totalCount: 15 },
                    closedIssues: { totalCount: 5 },
                    releases: { totalCount: 4 },
                    recentReleases: { nodes: [], totalCount: 0 }
                }
            }
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        ) as jest.Mock;

        const result = await dataFetcher.fetchMaintainerMetrics();
        expect(result.commitsLastMonth).toBe(10);
        expect(result.totalCommits).toBe(120);
        // Assuming the project has been active for 12 months
        expect(result.avgCommitsPerMonth).toBe(10);
    });

    test('extractRepoDetails should correctly parse the repository owner and name', () => {
        const { repoOwner, repoName } = dataFetcher['extractRepoDetails']();
        expect(repoOwner).toBe('microsoft');
        expect(repoName).toBe('graphrag');
    });

    test('fetchTestingResults should handle repositories with no releases', async () => {
        const mockResponse = {
            data: {
                repository: {
                    issues: { totalCount: 5 },
                    pullRequests: { totalCount: 3 },
                    releases: { nodes: [] },
                    stargazerCount: 100,
                    forkCount: 50,
                    watchers: { totalCount: 10 },
                    mentionableUsers: { totalCount: 5 }
                }
            }
        };
        global.fetch = jest.fn(() =>
            Promise.resolve(new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'Content-type': 'application/json' }
            }))
        ) as jest.Mock;

        const result = await dataFetcher.fetchTestingResults();
        expect(result.daysSinceLastRelease).toBeNull();
    });

    test('fetchLicense should handle repositories with no license information', async () => {
        const mockResponse = {
            data: {
                repository: {
                    licenseInfo: null
                }
            }
        };
        global.fetch = jest.fn(() =>
            Promise.resolve(new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'Content-type': 'application/json' }
            }))
        ) as jest.Mock;

        const result = await dataFetcher.fetchLicense();
        expect(result).toBeNull();
    });

    test('fetchData should handle network errors', async () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

        await expect(dataFetcher['fetchData']('{ query }')).rejects.toThrow('Failed to fetch data from GitHub API');

        expect(console.error).toHaveBeenCalledWith('Error fetching data from GitHub:', expect.any(Error));

        console.error = originalConsoleError; // Restore the original console.error after the test
    });
    test('fetchData should handle an unsuccessful API response', async () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500,
            } as Response)
        ) as jest.Mock;

        await expect(dataFetcher['fetchData']('{ valid query }')).rejects.toThrow('Failed to fetch data from GitHub API');

        expect(console.error).toHaveBeenCalledWith('Error fetching data from GitHub:', expect.any(Error));

        console.error = originalConsoleError;
    });
    test('fetchAllData should handle partial failures', async () => {
        const originalConsoleError = console.error;
        console.error = jest.fn(); // Temporarily replace console.error with a mock function

        jest.spyOn(dataFetcher, 'fetchCommits').mockRejectedValue(new Error('Failed to fetch commits'));
        jest.spyOn(dataFetcher, 'fetchContributors').mockResolvedValue({ totalActualContributors: 5 });
        jest.spyOn(dataFetcher, 'fetchTestingResults').mockResolvedValue({ openBugs: 3 });
        jest.spyOn(dataFetcher, 'fetchDocumentation').mockResolvedValue('Mock documentation');
        jest.spyOn(dataFetcher, 'fetchMaintainerMetrics').mockResolvedValue({ commitsLastMonth: 10 });
        jest.spyOn(dataFetcher, 'fetchLicense').mockResolvedValue({ name: 'MIT License' });

        await expect(dataFetcher.fetchAllData()).rejects.toThrow('Failed to fetch all data from GitHub API');

        expect(console.error).toHaveBeenCalledWith('Error fetching all data:', expect.any(Error));

        console.error = originalConsoleError; // Restore the original console.error after the test
    });
    test('extractRepoDetails should handle invalid URL', () => {
        const invalidURL = 'not a url';
        const dataFetcherWithInvalidURL = new GitHubDataFetcher(invalidURL, token);
        const { repoOwner, repoName } = dataFetcherWithInvalidURL['extractRepoDetails']();
        expect(repoOwner).toBe('not a url');
        expect(repoName).toBeUndefined();
    });


});
