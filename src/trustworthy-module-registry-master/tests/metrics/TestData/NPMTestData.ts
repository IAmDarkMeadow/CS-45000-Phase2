interface Author {
name: string;
}

interface Maintainer {
name: string;
email: string;
}

interface Contributor {
url: string;
name: string;
}

interface Bugs {
url: string;
}

interface Dist {
shasum: string;
tarball: string;
fileCount: number;
integrity: string;
signatures: {
    sig: string;
    keyid: string;
}[];
attestations: {
    url: string;
    provenance: {
    predicateType: string;
    };
};
unpackedSize: number;
}

interface Browser {
[key: string]: string;
}

interface Exports {
[key: string]: {
    types?: {
    default: string;
    require: string;
    };
    browser?: {
    default: string;
    require: string;
    };
    default?: {
    default: string;
    require: string;
    };
};
}

interface Scripts {
fix: string;
test: string;
build: string;
start: string;
prepare: string;
release: string;
version: string;
examples: string;
coveralls: string;
preversion: string;
testKarma: string;
testMocha: string;
postpublish: string;
releaseDry: string;
testEslint: string;
releaseBeta: string;
releaseInfo: string;
testDtslint: string;
testExports: string;
prepareHooks: string;
prepublishOnly: string;
releaseNoNpm: string;
testKarmaServer: string;
testBuildVersion: string;
testKarmaFirefox: string;
releaseBetaNoNpm: string;
releaseChangelogFix: string;
}

interface ReleaseIt {
git: {
    tag: boolean;
    push: boolean;
    commit: boolean;
    commitMessage: string;
    requireCommits: boolean;
    requireCleanWorkingDir: boolean;
};
npm: {
    publish: boolean;
    ignoreVersion: boolean;
};
hooks: {
    afterBump: string;
    beforeInit: string;
    afterRelease: string;
    beforeRelease: string;
};
github: {
    draft: boolean;
    release: boolean;
};
plugins: {
    "@release-it/conventional-changelog": {
    header: string;
    infile: string;
    preset: string;
    };
};
}

interface PackageJson {
name: string;
version: string;
keywords: string[];
author: Author;
license: string;
_id: string;
maintainers: Maintainer[];
contributors: Contributor[];
homepage: string;
bugs: Bugs;
dist: Dist;
main: string;
type: string;
types: string;
unpkg: string;
browser: Browser;
exports: Exports;
gitHead: string;
scripts: Scripts;
typings: string;
_npmUser: {
    name: string;
    email: string;
};
jsdelivr: string;
bundlesize: {
    path: string;
    threshold: string;
}[];
commitlint: {
    rules: {
    headerMaxLength: [number, string, number];
    };
    extends: string[];
};
releaseIt: ReleaseIt;
repository: {
    url: string;
    type: string;
};
_npmVersion: string;
description: string;
directories: Record<string, unknown>;
sideEffects: boolean;
_nodeVersion: string;
dependencies: Record<string, string>;
_hasShrinkwrap: boolean;
devDependencies: Record<string, string>;
_npmOperationalInternal: {
    tmp: string;
    host: string;
};
}

export const NPMTestResponse: PackageJson = {
    name: "axios",
    version: "1.7.7",
    keywords: ["xhr", "http", "ajax", "promise", "node"],
    author: { name: "Matt Zabriskie" },
    license: "MIT",
    _id: "axios@1.7.7",
    maintainers: [
        { name: "mzabriskie", email: "mzabriskie@gmail.com" },
        { name: "nickuraltsev", email: "nick.uraltsev@gmail.com" },
        { name: "emilyemorehouse", email: "emilyemorehouse@gmail.com" },
        { name: "jasonsaayman", email: "jasonsaayman@gmail.com" }
    ],
    contributors: [
        { url: "https://github.com/mzabriskie", name: "Matt Zabriskie" },
        { url: "https://github.com/nickuraltsev", name: "Nick Uraltsev" },
        { url: "https://github.com/DigitalBrainJS", name: "Dmitriy Mozgovoy" },
        { url: "https://github.com/jasonsaayman", name: "Jay" },
        { url: "https://github.com/emilyemorehouse", name: "Emily Morehouse" },
        { url: "https://github.com/rubennorte", name: "Rubén Norte" },
        { url: "https://github.com/JustinBeckwith", name: "Justin Beckwith" },
        { url: "https://github.com/codeclown", name: "Martti Laine" },
        { url: "https://github.com/chinesedfan", name: "Xianming Zhong" },
        { url: "https://github.com/RikkiGibson", name: "Rikki Gibson" },
        { url: "https://github.com/remcohaszing", name: "Remco Haszing" },
        { url: "https://github.com/yasuf", name: "Yasu Flores" },
        { url: "https://github.com/carpben", name: "Ben Carp" }
    ],
    homepage: "https://axios-http.com",
    bugs: { url: "https://github.com/axios/axios/issues" },
    dist: {
        shasum: "2f554296f9892a72ac8d8e4c5b79c14a91d0a47f",
        tarball: "https://registry.npmjs.org/axios/-/axios-1.7.7.tgz",
        fileCount: 86,
        integrity:
        "sha512-S4kL7XrjgBmvdGut0sN3yJxqYzrDOnivkBiN0OFs6hLiUam3UPvswUo0kqGyhqUZGEOytHyumEdXsAkgCOUf3Q==",
        signatures: [
        {
            sig: "MEUCIBesf1VS7HIX3EWqPvh1xsuGYdkA51FVuXcFSJ8yQNeWAiEA7uGXS0z1muoi0di1tzA5084qhW1e15f/Wa/O0Il9NHg=",
            keyid: "SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA"
        }
        ],
        attestations: {
        url: "https://registry.npmjs.org/-/npm/v1/attestations/axios@1.7.7",
        provenance: {
            predicateType: "https://slsa.dev/provenance/v1"
        }
        },
        unpackedSize: 2141088
    },
    main: "index.js",
    type: "module",
    types: "index.d.ts",
    unpkg: "dist/axios.min.js",
    browser: {
        "./lib/adapters/http.js": "./lib/helpers/null.js",
        "./lib/platform/node/index.js": "./lib/platform/browser/index.js",
        "./lib/platform/node/classes/FormData.js": "./lib/helpers/null.js"
    },
    exports: {
        ".": {
        types: {
            default: "./index.d.ts",
            require: "./index.d.cts"
        },
        browser: {
            default: "./index.js",
            require: "./dist/browser/axios.cjs"
        },
        default: {
            default: "./index.js",
            require: "./dist/node/axios.cjs"
        }
        },
    },
    gitHead: "5b8a826771b77ab30081d033fdba9ef3b90e439a",
    scripts: {
        fix: "eslint --fix lib/**/*.js",
        test:
        "npm run test:eslint && npm run test:mocha && npm run test:karma && npm run test:dtslint && npm run test:exports",
        build: "gulp clear && cross-env NODE_ENV=production rollup -c -m",
        start: "node ./sandbox/server.js",
        prepare: "husky install && npm run prepare:hooks",
        release: "release-it",
        version: "npm run build && git add dist && git add package.json",
        examples: "node ./examples/server.js",
        coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
        preversion: "gulp version",
        testKarma: "node bin/ssl_hotfix.js cross-env LISTEN_ADDR=:: karma start karma.conf.cjs --single-run",
        testMocha: "node bin/ssl_hotfix.js mocha test/unit/**/*.js --timeout 30000 --exit",
        postpublish: "git push && git push --tags",
        releaseDry: "release-it --dry-run --no-npm",
        testEslint: "node bin/ssl_hotfix.js eslint lib/**/*.js",
        releaseBeta: "release-it --preRelease=beta",
        releaseInfo: "release-it --release-version",
        testDtslint: "dtslint --localTs node_modules/typescript/lib",
        testExports: "node bin/ssl_hotfix.js mocha test/module/test.js --timeout 30000 --exit",
        prepareHooks: 'npx husky set .husky/commit-msg "npx commitlint --edit $1"',
        prepublishOnly: "npm run test:build:version",
        releaseNoNpm: "release-it --no-npm",
        testKarmaServer: "node bin/ssl_hotfix.js cross-env karma start karma.conf.cjs",
        testBuildVersion: "node ./bin/check-build-version.js",
        testKarmaFirefox: "node bin/ssl_hotfix.js cross-env LISTEN_ADDR=:: Browsers=Firefox karma start karma.conf.cjs --single-run",
        releaseBetaNoNpm: "release-it --preRelease=beta --no-npm",
        releaseChangelogFix: "node ./bin/injectContributorsList.js && git add CHANGELOG.md"
    },
    typings: "./index.d.ts",
    _npmUser: { name: "jasonsaayman", email: "jasonsaayman@gmail.com" },
    jsdelivr: "dist/axios.min.js",
    bundlesize: [{ path: "./dist/axios.min.js", threshold: "5kB" }],
    commitlint: {
        rules: { headerMaxLength: [2, "always", 130] },
        extends: ["@commitlint/config-conventional"]
    },
    releaseIt: {
        git: {
        tag: true,
        push: true,
        commit: true,
        commitMessage: "chore(release): v${version}",
        requireCommits: false,
        requireCleanWorkingDir: false
        },
        npm: { publish: false, ignoreVersion: false },
        hooks: {
        afterBump:
            "gulp version --bump ${version} && npm run build && npm run test:build:version && git add ./dist && git add ./package-lock.json",
        beforeInit: "npm test",
        afterRelease: "echo Successfully released ${name} v${version} to ${repo.repository}.",
        beforeRelease: "npm run release:changelog:fix"
        },
        github: { draft: true, release: true },
        plugins: {
        "@release-it/conventional-changelog": {
            header: "# Changelog",
            infile: "CHANGELOG.md",
            preset: "angular"
        }
        }
    },
    repository: { url: "git+https://github.com/axios/axios.git", type: "git" },
    _npmVersion: "10.7.0",
    description: "Promise based HTTP client for the browser and node.js",
    directories: {},
    sideEffects: false,
    _nodeVersion: "18.20.4",
    dependencies: {
        "form-data": "^4.0.0",
        "proxy-from-env": "^1.1.0",
        "follow-redirects": "^1.15.6"
    },
    _hasShrinkwrap: false,
    devDependencies: {
        gulp: "^4.0.2",
        chalk: "^5.3.0",
        husky: "^8.0.3",
        karma: "^6.3.17",
        mocha: "^10.3.0",
        sinon: "^4.5.0",
        eslint: "^8.56.0",
        multer: "^1.4.4",
        rollup: "^2.79.1",
        dtslint: "^4.2.1",
        express: "^4.18.2",
        "dev-null": "^0.1.1",
        "fs-extra": "^10.1.0",
        memoizee: "^0.4.15",
        minimist: "^1.2.8",
        coveralls: "^3.1.1",
        "cross-env": "^7.0.3",
        "gzip-size": "^7.0.0",
        formidable: "^2.1.2",
        "get-stream": "^3.0.0",
        handlebars: "^4.7.8",
        "release-it": "^15.11.0",
        typescript: "^4.9.5",
        "@babel/core": "^7.23.9",
        "body-parser": "^1.20.2",
        "es6-promise": "^4.2.8",
        "karma-sinon": "^1.0.5",
        "jasmine-core": "^2.99.1",
        "pretty-bytes": "^6.1.1",
        "formdata-node": "^5.0.1",
        "karma-jasmine": "^1.1.2",
        "auto-changelog": "^2.4.0",
        "@commitlint/cli": "^17.8.1",
        "stream-throttle": "^0.1.3",
        "@babel/preset-env": "^7.23.9",
        "karma-jasmine-ajax": "^0.1.13",
        "@rollup/plugin-json": "^4.1.0",
        "@rollup/plugin-alias": "^5.1.0",
        "@rollup/plugin-babel": "^5.3.1",
        "karma-sauce-launcher": "^4.3.6",
        "rollup-plugin-terser": "^7.0.2",
        "string-replace-async": "^3.0.2",
        "karma-chrome-launcher": "^3.2.0",
        "karma-safari-launcher": "^1.0.0",
        "terser-webpack-plugin": "^4.2.3",
        "karma-firefox-launcher": "^2.1.2",
        "karma-sourcemap-loader": "^0.3.8",
        "@rollup/plugin-commonjs": "^15.1.0",
        "abortcontroller-polyfill": "^1.7.5",
        "karma-rollup-preprocessor": "^7.0.8",
        "rollup-plugin-bundle-size": "^1.0.3",
        "@rollup/plugin-multi-entry": "^4.1.0",
        "@rollup/plugin-node-resolve": "^9.0.0",
        "rollup-plugin-auto-external": "^2.0.0",
        "istanbul-instrumenter-loader": "^3.0.1",
        "@commitlint/config-conventional": "^17.8.1",
        "@release-it/conventional-changelog": "^5.1.1"
    },
    _npmOperationalInternal: {
        tmp: "tmp/axios_1.7.7_1725141728625_0.14127286155042196",
        host: "s3://npm-registry-packages"
    }
};

export const NPMResponse2 = {
    "name": "axios",
    "version": "1.7.7",
    "keywords": [
    "xhr",
    "http",
    "ajax",
    "promise",
    "node"
    ],
    "author": {
    "name": "Matt Zabriskie"
    },
    "license": "MIT",
    "_id": "axios@1.7.7",
    "maintainers": [
    {
        "name": "mzabriskie",
        "email": "mzabriskie@gmail.com"
    },
    {
        "name": "nickuraltsev",
        "email": "nick.uraltsev@gmail.com"
    },
    {
        "name": "emilyemorehouse",
        "email": "emilyemorehouse@gmail.com"
    },
    {
        "name": "jasonsaayman",
        "email": "jasonsaayman@gmail.com"
    }
    ],
    "contributors": [
    {
        "url": "https://github.com/mzabriskie",
        "name": "Matt Zabriskie"
    },
    {
        "url": "https://github.com/nickuraltsev",
        "name": "Nick Uraltsev"
    },
    {
        "url": "https://github.com/DigitalBrainJS",
        "name": "Dmitriy Mozgovoy"
    },
    {
        "url": "https://github.com/jasonsaayman",
        "name": "Jay"
    },
    {
        "url": "https://github.com/emilyemorehouse",
        "name": "Emily Morehouse"
    },
    {
        "url": "https://github.com/rubennorte",
        "name": "Rubén Norte"
    },
    {
        "url": "https://github.com/JustinBeckwith",
        "name": "Justin Beckwith"
    },
    {
        "url": "https://github.com/codeclown",
        "name": "Martti Laine"
    },
    {
        "url": "https://github.com/chinesedfan",
        "name": "Xianming Zhong"
    },
    {
        "url": "https://github.com/RikkiGibson",
        "name": "Rikki Gibson"
    },
    {
        "url": "https://github.com/remcohaszing",
        "name": "Remco Haszing"
    },
    {
        "url": "https://github.com/yasuf",
        "name": "Yasu Flores"
    },
    {
        "url": "https://github.com/carpben",
        "name": "Ben Carp"
    }
    ],
    "homepage": "https://axios-http.com",
    "bugs": {
    "url": "https://github.com/axios/axios/issues"
    },
    "dist": {
    "shasum": "2f554296f9892a72ac8d8e4c5b79c14a91d0a47f",
    "tarball": "https://registry.npmjs.org/axios/-/axios-1.7.7.tgz",
    "fileCount": 86,
    "integrity": "sha512-S4kL7XrjgBmvdGut0sN3yJxqYzrDOnivkBiN0OFs6hLiUam3UPvswUo0kqGyhqUZGEOytHyumEdXsAkgCOUf3Q==",
    "signatures": [
        {
        "sig": "MEUCIBesf1VS7HIX3EWqPvh1xsuGYdkA51FVuXcFSJ8yQNeWAiEA7uGXS0z1muoi0di1tzA5084qhW1e15f/Wa/O0Il9NHg=",
        "keyid": "SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA"
        }
    ],
    "attestations": {
        "url": "https://registry.npmjs.org/-/npm/v1/attestations/axios@1.7.7",
        "provenance": {
        "predicateType": "https://slsa.dev/provenance/v1"
        }
    },
    "unpackedSize": 2141088
    },
    "main": "index.js",
    "type": "module",
    "types": "index.d.ts",
    "unpkg": "dist/axios.min.js",
    "browser": {
    "./lib/adapters/http.js": "./lib/helpers/null.js",
    "./lib/platform/node/index.js": "./lib/platform/browser/index.js",
    "./lib/platform/node/classes/FormData.js": "./lib/helpers/null.js"
    },
    "exports": {
    ".": {
        "types": {
        "default": "./index.d.ts",
        "require": "./index.d.cts"
        },
        "browser": {
        "default": "./index.js",
        "require": "./dist/browser/axios.cjs"
        },
        "default": {
        "default": "./index.js",
        "require": "./dist/node/axios.cjs"
        }
    },
    "./unsafe/*": "./lib/*",
    "./package.json": "./package.json",
    "./unsafe/utils.js": "./lib/utils.js",
    "./lib/adapters/xhr.js": "./lib/adapters/xhr.js",
    "./lib/adapters/http.js": "./lib/adapters/http.js",
    "./unsafe/core/settle.js": "./lib/core/settle.js",
    "./unsafe/adapters/xhr.js": "./lib/adapters/xhr.js",
    "./unsafe/adapters/http.js": "./lib/adapters/http.js",
    "./unsafe/helpers/buildURL.js": "./lib/helpers/buildURL.js",
    "./unsafe/core/buildFullPath.js": "./lib/core/buildFullPath.js",
    "./unsafe/helpers/combineURLs.js": "./lib/helpers/combineURLs.js",
    "./unsafe/helpers/isAbsoluteURL.js": "./lib/helpers/isAbsoluteURL.js"
    },
    "gitHead": "5b8a826771b77ab30081d033fdba9ef3b90e439a",
    "scripts": {
    "fix": "eslint --fix lib/**/*.js",
    "test": "npm run test:eslint && npm run test:mocha && npm run test:karma && npm run test:dtslint && npm run test:exports",
    "build": "gulp clear && cross-env NODE_ENV=production rollup -c -m",
    "start": "node ./sandbox/server.js",
    "prepare": "husky install && npm run prepare:hooks",
    "release": "release-it",
    "version": "npm run build && git add dist && git add package.json",
    "examples": "node ./examples/server.js",
    "coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    "preversion": "gulp version",
    "test:karma": "node bin/ssl_hotfix.js cross-env LISTEN_ADDR=:: karma start karma.conf.cjs --single-run",
    "test:mocha": "node bin/ssl_hotfix.js mocha test/unit/**/*.js --timeout 30000 --exit",
    "postpublish": "git push && git push --tags",
    "release:dry": "release-it --dry-run --no-npm",
    "test:eslint": "node bin/ssl_hotfix.js eslint lib/**/*.js",
    "release:beta": "release-it --preRelease=beta",
    "release:info": "release-it --release-version",
    "test:dtslint": "dtslint --localTs node_modules/typescript/lib",
    "test:exports": "node bin/ssl_hotfix.js mocha test/module/test.js --timeout 30000 --exit",
    "prepare:hooks": "npx husky set .husky/commit-msg \"npx commitlint --edit $1\"",
    "prepublishOnly": "npm run test:build:version",
    "release:no-npm": "release-it --no-npm",
    "test:karma:server": "node bin/ssl_hotfix.js cross-env karma start karma.conf.cjs",
    "test:build:version": "node ./bin/check-build-version.js",
    "test:karma:firefox": "node bin/ssl_hotfix.js cross-env LISTEN_ADDR=:: Browsers=Firefox karma start karma.conf.cjs --single-run",
    "release:beta:no-npm": "release-it --preRelease=beta --no-npm",
    "release:changelog:fix": "node ./bin/injectContributorsList.js && git add CHANGELOG.md"
    },
    "typings": "./index.d.ts",
    "_npmUser": {
    "name": "jasonsaayman",
    "email": "jasonsaayman@gmail.com"
    },
    "jsdelivr": "dist/axios.min.js",
    "bundlesize": [
    {
        "path": "./dist/axios.min.js",
        "threshold": "5kB"
    }
    ],
    "commitlint": {
    "rules": {
        "header-max-length": [
        2,
        "always",
        130
        ]
    },
    "extends": [
        "@commitlint/config-conventional"
    ]
    },
    "release-it": {
    "git": {
        "tag": true,
        "push": true,
        "commit": true,
        "commitMessage": "chore(release): v${version}",
        "requireCommits": false,
        "requireCleanWorkingDir": false
    },
    "npm": {
        "publish": false,
        "ignoreVersion": false
    },
    "hooks": {
        "after:bump": "gulp version --bump ${version} && npm run build && npm run test:build:version && git add ./dist && git add ./package-lock.json",
        "before:init": "npm test",
        "after:release": "echo Successfully released ${name} v${version} to ${repo.repository}.",
        "before:release": "npm run release:changelog:fix"
    },
    "github": {
        "draft": true,
        "release": true
    },
    "plugins": {
        "@release-it/conventional-changelog": {
        "header": "# Changelog",
        "infile": "CHANGELOG.md",
        "preset": "angular"
        }
    }
    },
    "repository": {
    "url": "git+https://github.com/axios/axios.git",
    "type": "git"
    },
    "_npmVersion": "10.7.0",
    "description": "Promise based HTTP client for the browser and node.js",
    "directories": {},
    "sideEffects": false,
    "_nodeVersion": "18.20.4",
    "dependencies": {
    "form-data": "^4.0.0",
    "proxy-from-env": "^1.1.0",
    "follow-redirects": "^1.15.6"
    },
    "_hasShrinkwrap": false,
    "devDependencies": {
    "gulp": "^4.0.2",
    "chalk": "^5.3.0",
    "husky": "^8.0.3",
    "karma": "^6.3.17",
    "mocha": "^10.3.0",
    "sinon": "^4.5.0",
    "eslint": "^8.56.0",
    "multer": "^1.4.4",
    "rollup": "^2.79.1",
    "dtslint": "^4.2.1",
    "express": "^4.18.2",
    "dev-null": "^0.1.1",
    "fs-extra": "^10.1.0",
    "memoizee": "^0.4.15",
    "minimist": "^1.2.8",
    "coveralls": "^3.1.1",
    "cross-env": "^7.0.3",
    "gzip-size": "^7.0.0",
    "formidable": "^2.1.2",
    "get-stream": "^3.0.0",
    "handlebars": "^4.7.8",
    "release-it": "^15.11.0",
    "typescript": "^4.9.5",
    "@babel/core": "^7.23.9",
    "body-parser": "^1.20.2",
    "es6-promise": "^4.2.8",
    "karma-sinon": "^1.0.5",
    "jasmine-core": "^2.99.1",
    "pretty-bytes": "^6.1.1",
    "formdata-node": "^5.0.1",
    "karma-jasmine": "^1.1.2",
    "auto-changelog": "^2.4.0",
    "@commitlint/cli": "^17.8.1",
    "stream-throttle": "^0.1.3",
    "@babel/preset-env": "^7.23.9",
    "karma-jasmine-ajax": "^0.1.13",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-alias": "^5.1.0",
    "@rollup/plugin-babel": "^5.3.1",
    "karma-sauce-launcher": "^4.3.6",
    "rollup-plugin-terser": "^7.0.2",
    "string-replace-async": "^3.0.2",
    "karma-chrome-launcher": "^3.2.0",
    "karma-safari-launcher": "^1.0.0",
    "terser-webpack-plugin": "^4.2.3",
    "karma-firefox-launcher": "^2.1.2",
    "karma-sourcemap-loader": "^0.3.8",
    "@rollup/plugin-commonjs": "^15.1.0",
    "abortcontroller-polyfill": "^1.7.5",
    "karma-rollup-preprocessor": "^7.0.8",
    "rollup-plugin-bundle-size": "^1.0.3",
    "@rollup/plugin-multi-entry": "^4.1.0",
    "@rollup/plugin-node-resolve": "^9.0.0",
    "rollup-plugin-auto-external": "^2.0.0",
    "istanbul-instrumenter-loader": "^3.0.1",
    "@commitlint/config-conventional": "^17.8.1",
    "@release-it/conventional-changelog": "^5.1.1"
    },
    "_npmOperationalInternal": {
    "tmp": "tmp/axios_1.7.7_1725141728625_0.14127286155042196",
    "host": "s3://npm-registry-packages"
    }
};

export const testCommitsData = {
    totalCommits: 1578,
    recentCommits: [
    {
        message: 'chore: remove IE logo; initialise dropping support for IE (#6619)',
        date: '2024-09-29T11:13:14Z',
        changes: 4
    },
    {
        message: 'fix: updated stream aborted error message to be more clear (#6615)',
        date: '2024-09-28T11:04:22Z',
        changes: 4
    }
    ]
}