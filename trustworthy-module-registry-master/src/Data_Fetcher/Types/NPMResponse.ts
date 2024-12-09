export type NPMResponse = {
    name: string;
    version: string;
    description: string;
    main: string;
    exports: {
        ".": {
        types: {
            require: string;
            default: string;
        };
        browser: {
            require: string;
            default: string;
        };
        default: {
            require: string;
            default: string;
        };
        };
        "./lib/adapters/http.js": string;
        "./lib/adapters/xhr.js": string;
        "./unsafe/*": string;
        "./unsafe/core/settle.js": string;
        "./unsafe/core/buildFullPath.js": string;
        "./unsafe/helpers/isAbsoluteURL.js": string;
        "./unsafe/helpers/buildURL.js": string;
        "./unsafe/helpers/combineURLs.js": string;
        "./unsafe/adapters/http.js": string;
        "./unsafe/adapters/xhr.js": string;
        "./unsafe/utils.js": string;
        "./package.json": string;
    };
    type: string;
    types: string;
    scripts: Record<string, string>
    repository: {
        type: string;
        url: string;
    };
    keywords: string[];
    author: {
        name: string;
    };
    license: string;
    bugs: {
        url: string;
    };
    homepage: string;
    devDependencies: {
        [key: string]: string;
    };
    browser: Record<string, string>;
    jsdelivr: string;
    unpkg: string;
    typings: string;
    dependencies: {
        [key: string]: string;
    };
    bundlesize: {
        path: string;
        threshold: string;
    }[];

    // refactor as its own type
    contributors: Contributor[];
    sideEffects: boolean;
    releaseIt: {
        git: {
        commitMessage: string;
        push: boolean;
        commit: boolean;
        tag: boolean;
        requireCommits: boolean;
        requireCleanWorkingDir: boolean;
        };
        github: {
        release: boolean;
        draft: boolean;
        };
        npm: {
        publish: boolean;
        ignoreVersion: boolean;
        };
        plugins: {
        [key: string]: {
            preset: string;
            infile: string;
            header: string;
        };
        };
        hooks: {
        beforeInit: string;
        afterBump: string;
        beforeRelease: string;
        afterRelease: string;
        };
    };
    commitlint: {
        rules: {
        "header-max-length": [number, string, number];
        };
        extends: string[];
    };
    _id: string;
    gitHead: string;
    _nodeVersion: string;
    _npmVersion: string;
    dist: {
        integrity: string;
        shasum: string;
        tarball: string;
        fileCount: number;
        unpackedSize: number;
        attestations: {
        url: string;
        provenance: {
            predicateType: string;
        };
        };
        signatures: {
        keyid: string;
        sig: string;
        }[];
    };
    _npmUser: {
        name: string;
        email: string;
    };
    directories: Record<string, unknown>;
    maintainers: {
        name: string;
        email: string;
    }[];
    _npmOperationalInternal: {
        host: string;
        tmp: string;
    };
    _hasShrinkwrap: boolean;
};
  
export type Contributor = {
    name: string;
    url: string | null;
}