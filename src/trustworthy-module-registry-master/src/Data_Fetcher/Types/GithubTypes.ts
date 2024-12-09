// Define export interfaces for the expected data structures
export interface CommitHistoryNode {
    message: string;
    committedDate: string;
    additions: number;
    deletions: number;
}

export interface CommitsResponse {
    data: {
        repository: {
            defaultBranchRef: {
                target: {
                    history: {
                        totalCount: number;
                        edges: { node: CommitHistoryNode }[];
                    };
                };
            };
        };
    };
}

export interface ContributorsResponse {
    data: {
        repository: {
            mentionableUsers: {
                totalCount: number;
                nodes: { login: string }[];
            };
            defaultBranchRef: {
                target: {
                    history: {
                        nodes: { author: { user: { login: string } } }[];
                    };
                };
            };
        };
    };
}

export interface TestingResultsResponse {
    data: {
        repository: {
            issues: { totalCount: number };
            pullRequests: { totalCount: number };
            releases: { nodes: { publishedAt: string }[] };
            stargazerCount: number;
            forkCount: number;
            watchers: { totalCount: number };
            mentionableUsers: { totalCount: number };
        };
    };
}

export interface DocumentationResponse {
    data: {
        repository: {
            object?: { text: string };
            object2?: { text: string };
            object3?: { text: string };
            object4?: { text: string };
        };
    };
}

export interface MaintainerMetricsResponse {
    data: {
        repository: {
            defaultBranchRef: {
                target: {
                    history: { totalCount: number };
                };
            };
            object: {
                history: { totalCount: number };
            };
            issues: { totalCount: number };
            closedIssues: { totalCount: number };
            releases: { totalCount: number };
            recentReleases: {
                nodes: { createdAt: string }[];
                totalCount: number;
            };
        };
    };
}

export interface LicenseResponse {
    data: {
        repository: {
            licenseInfo: {
                name: string;
                spdxId: string;
                url: string;
            };
        };
    };
}