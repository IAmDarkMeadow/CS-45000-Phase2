# Package Manager Project Documentation
A custom package manager designed to evaluate and manage packages from different sources, such as npm and GitHub, using key metrics for package quality assessment.

## **Table of Contents**
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Package Scoring Metrics](#package-scoring-metrics)
5. [Important Classes](#important-classes)
   - [URLHandler](#urlhandler-class)
   - [DataFetcherStrategy](#datafetcherstrategy-interface)
   - [GitHubDataFetcher](#githubdatafetcher-class)
   - [NPMDataFetcher](#npmdatafetcher-class)
   - [CalculatorFactory](#calculatorfactory-class)
   - [MetricCalculator](#metriccalculator-abstract-class)
   - [BusFactorCalculator](#busfactorcalculator-class)
   - [CorrectnessCalculator](#correctnesscalculator-class)
   - [LicenseCalculator](#licensecalculator-class)
   - [RampUpCalculator](#rampupcalculator-class)
   - [ResponsiveMaintainerCalculator](#responsivemaintainercalculator-class)
6. [Testing](#testing)
7. [License](#license)
8. [Acknowledgements](#acknowledgments)

## **Introduction**
ACME Corporation's Package Manager is a tool that assesses the quality of node.js and github modules using metrics such as ramp-up time, correctness, bus factor, maintainer responsiveness, and license compatibility. This tool aids ACME's engineers in selecting modules that are well-maintained, reliable, and compliant with the GNU LGPLv2.1 license.

## **Installation**
   - `./run install` should download the packages needed
   - tsc-node might need to be manually installed

## **Usage**
### Example output of ./run {Absolute file location}
`./run URL_FILE`, where URL_FILE is the absolute location of a file consisting of an ASCII-encoded newline-delimited set of URLs.

urls.txt:
```https://github.com/facebook/react
https://github.com/twbs/bootstrap
https://github.com/tensorflow/tensorflow
https://www.npmjs.com/package/lodash
https://www.npmjs.com/package/express
https://www.npmjs.com/package/axios
```

Terminal Input:
`$ ./run C:<pathtofile>/urls.txt`

Terminal Output:
```{"URL":"https://github.com/facebook/react","License":1,"License_Latency":"0.333","BusFactor":1,"BusFactor_Latency":"0.623","Correctness":0.71,"Correctness_Latency":"0.373","RampUp":0.77,"RampUp_Latency":"0.169","ResponsiveMaintainer":0.81,"ResponsiveMaintainer_Latency":"0.369","NetScore":0.9,"NetScore_Latency":"1.867"}
{"URL":"https://github.com/twbs/bootstrap","License":1,"License_Latency":"0.157","BusFactor":0.5,"BusFactor_Latency":"0.818","Correctness":0.71,"Correctness_Latency":"0.457","RampUp":0.64,"RampUp_Latency":"0.160","ResponsiveMaintainer":0.81,"ResponsiveMaintainer_Latency":"0.633","NetScore":0.83,"NetScore_Latency":"2.225"}
{"URL":"https://github.com/tensorflow/tensorflow","License":0.5,"License_Latency":"0.279","BusFactor":1,"BusFactor_Latency":"1.037","Correctness":0.71,"Correctness_Latency":"1.165","RampUp":0.46,"RampUp_Latency":"0.140","ResponsiveMaintainer":0.97,"ResponsiveMaintainer_Latency":"0.768","NetScore":0.62,"NetScore_Latency":"3.390"}
{"URL":"https://www.npmjs.com/package/lodash","License":1,"License_Latency":"0.094","BusFactor":1,"BusFactor_Latency":"0.917","Correctness":0.71,"Correctness_Latency":"0.325","RampUp":0.44,"RampUp_Latency":"0.201","ResponsiveMaintainer":0.39,"ResponsiveMaintainer_Latency":"0.303","NetScore":0.81,"NetScore_Latency":"1.841"}
{"URL":"https://www.npmjs.com/package/express","License":1,"License_Latency":"0.173","BusFactor":1,"BusFactor_Latency":"0.855","Correctness":0.43,"Correctness_Latency":"0.335","RampUp":0,"RampUp_Latency":"0.321","ResponsiveMaintainer":0.94,"ResponsiveMaintainer_Latency":"0.479","NetScore":0.76,"NetScore_Latency":"2.163"}
{"URL":"https://www.npmjs.com/package/axios","License":1,"License_Latency":"0.049","BusFactor":1,"BusFactor_Latency":"0.890","Correctness":0.71,"Correctness_Latency":"0.402","RampUp":0.48,"RampUp_Latency":"0.272","ResponsiveMaintainer":0.96,"ResponsiveMaintainer_Latency":"0.374","NetScore":0.87,"NetScore_Latency":"1.987"}
```

## **Package Scoring Metrics**
   - **Ramp-up Time**: measure documentation completeness using a checklist of topics (installation, usage examples, API documentation, etc.); gather feedback on documentation clarity and completeness from new users. (comprehensive and clear documentation reduces the learning curve for new users)
   - **Correctness**: utilize automated testing results such as pass/fail rates from the module's continuous integration system; analyze open and closed issues related to bugs on the module's issue tracker. (high pass rate in tests and low ratio of unresolved bugs indicates high correctness)
   - **Bus Factor**: use available data on the number of active contributors and commit frequency from the module's repository; assess the distribution of commits among contributors over the last 12 months. (a higher number of active contributors and a more even distribution of commits lower the bus factor risk)
   - **Responsiveness**: track the average time maintainers take to respond to issues and pull requests; monitor the resolution time for critical bugs. (quick response times and active engagement with the community are indicative of a reliable and responsive maintainer)
   - **License Compatibility**: automatically extract the license information using regex from the README or the LICENSE file; check the compatibility of the extracted license with LGPLv2.1. (ensuring license compatibiility is crucial for legal distribution of the software, especially in open-source and self-hosted solutions)

## **Important Classes**
### [**URLHandler Class**](src/URLHandler/URLHandler.ts)
The `URLHandler` class is responsible for handling various URL-related operations in the package evaluation process. It serves as the core utility for parsing, validating, and determining the type of URL being processed, specifically for GitHub or npm sources.

**Key Responsibilities:**
1. URL Parsing:
   The `parseURL()` method takes in a URL string and breaks it down into its protocol, hostname, and pathname components. If the URL is malformed, an error is thrown to ensure the URL is valid.
2. Source Determination:
   The `determineSource()` method inspects the hostname of a parsed URL to classify whether the URL belongs to GitHub or npm. It returns 0 for GitHub and 1 for npm.
3. URL Validation:
   The `validateURL()` method ensures that the input URL is well-formed and matches patterns for either GitHub or npm repositories. If the URL is invalid, it returns false or throws an error.
4. Data Fetcher Strategy:
   The `URLHandler` supports a strategy pattern by utilizing the `DataFetcherStrategy` interface to fetch data for URLs. The `setDataFetcherStrategy()` method allows setting a strategy, and `fetchAllData()` executes the strategy to retrieve relevant data.

### [**DataFetcherStrategy Interface**](src/URLHandler/DataFetcherStrategy.ts)
The `DataFetcherStrategy` interface defines the contract for fetching various types of data from a source. It is designed as part of a strategy pattern that enables flexible and extendable data retrieval mechanisms for different sources such as GitHub and npm. This interface is implemented by specific strategies that define how to fetch details like commits, contributors, testing results, documentation, and license information.

**Key Responsibilities:**
1. Commit Data Retrieval:
   The `fetchCommits()` method retrieves commit history from the given source URL. The implementation for this method will vary based on the source.
2. Contributor Data Retrieval:
   The `fetchContributors()` method retrieves information about contributors to the project.
3. Testing Results Retrieval:
   The `fetchTestingResults()` method fetches test-related data for the project.
4. Documentation Retrieval:
   The `fetchDocumentation()` method fetches test-related data for the project.
5. Maintainer Metrics Retrieval:
   The `fetchMaintainerMetrics()` method gathers information about the maintainers.
6. License Information Retrieval:
   The `fetchLicense()` method retrieves license information for the repository. Ensuring license compatibility (with LGPLv2.1) is a key concern for ACME Corporation.
7. Fetching All Data:
   The `fetchAllData()` method aggregates all available data.

### [**GitHubDataFetcher Class**](src/Data_Fetcher/GitHubDataFetcher.ts)
The `GitHubDataFetcher` class is an implementation of the `DataFetcherStrategy` interface specifically for fetching data from GitHub repositories. This class is responsible for retrieving various types of data from the GitHub GraphQL API, such as commit history, contributor details, testing results, documentation, maintainer metrics, and license information.

**Key Responsibilities:**
1. API Integration:
   The class integrates with the GitHub GraphQL API, using a personal access token to authenticate and fetch data.
2. Commit Data:
   The `fetchCommits()` method retrieves commit history from the default branch of the repository and provides statistics like the number of commits and the average number of changes per commit.
3. Contributor Data:
   The `fetchContributors()` method retrieves the contributors from the repository and calculates the distribution of their contributions, identifying top contributors.
4. Testing Results:
   The `fetchTestingResults()` method collects various testing-related metrics, such as the number of open bugs, pull requests, releases, stars, forks, watchers, and contributors.
5. Documentation:
   The `fetchDocumentation()` method retrieves the README file from the repository to provide documentation about the project.
6. Maintainer Metrics:
   The `fetchMaintainerMetrics()` method tracks the maintainers' activity over the past 12 months by analyzing the number of commits, issues, and releases. It also calculates the number of commits within the last month for more recent activity metrics.
7. License Data:
   The `fetchLicense()` method retrieves the repository's license information via the GitHub GraphQL API. It queries for the license name, SPDX ID, and URL associated with the repository, returning this data in a structured format.

### [**NPMDataFetcher Class**](src/Data_Fetcher/NPMDataFetcher.ts)
The `NPMDataFetcher` class is an implementation of the `DataFetcherStrategy` interface for fetching data from the NPM registry and GitHub repositories linked to NPM packages. This class is responsible for retrieving various types of data, such as package metadata, commit history, contributor details, testing results, documentation, maintainer metrics, and license information.

**Key Responsibilities:**
1. NPM and GitHub Integration:
   The class integrates with the NPM registry to fetch package metadata and, when available, with GitHub repositories linked to the NPM package for more in-depth analysis. The class uses a GitHub personal access token for authenticating requests to GitHub.
2. Package Metadata:
   The `fetchNpmData()` method retrieves the latest package metadata from the NPM registry, such as version information, license, and repository details.
3. Commit Data:
   The `fetchCommits()` method retrieves the commit history from the linked GitHub repository and provides statistics like the number of commits.
4. Contributor Data:
   The `fetchContributors()` method retrieves contributor information from the linked GitHub repository, calculating the distribution of contributions among contributors.
5. Testing Results:
   The `fetchTestingResults()` method collects testing-related metrics from the linked GitHub repository, such as open issues, pull requests, and CI/CD status.
6. Documentation:
   The `fetchDocumentation()` method retrieves the README file from the linked GitHub repository to provide project documentation.
7. Maintainer Metrics:
   The `fetchMaintainerMetrics()` method tracks the maintainers' activity over the past 12 months by analyzing the number of commits, issues, and releases. It also calculates the number of commits within the last month for more recent activity metrics.
8. License Data:
   The `fetchLicense()` method retrieves the package license from the NPM registry. If unavailable, it attempts to retrieve license information from the linked GitHub repository.

### [**CalculatorFactory Class**](src/metrics/CalculatorFactory.ts)
The `CalculatorFactory` class is a factory that generates instances of different metric calculators based on the type of metric being evaluated. This allows for the creation of specific calculators (such as for license compatibility, bus factor, correctness, ramp-up time, or maintainer responsiveness) without directly referencing the concrete classes.

**Key Responsibilities:**
1. Enum-based Type Safety:
   The `CalculatorTypes` enum ensures that the factory handles predefined types of calculators, offering type safety and preventing the instantiation of unsupported calculators.
2. Calculator Creation:
   The `createCalculator()` method is responsible for creating instances of specific calculator classes based on the provided type and data. The method uses a switch statement to match the calculator type and return the appropriate subclass of `MetricCalculator`.
3. Supported Calculators:
   - **License Calculator**: Evaluates the license compatibility of a module.
   - **Bus Factor Calculator**: Measures the project's bus factor, indicating how dependent the project is on a small number of contributors.
   - **Correctness Calculator**: Assesses the correctness of the module.
   - **Ramp-Up Calculator**: Determines the ramp-up time, measuring how quickly a developer can become productive when working with the module.
   - **Responsive Maintainer Calculator**: Evaluates maintainer responsiveness by analyzing commit frequency, issue resolution times, and other activity metrics.
4. Extensibility:
   As the project expands, additional calculators can be added to the `CalculatorTypes` enum and handled within the `createCalculator()` method.

### [**MetricCalculator Abstract Class**](src/metrics/MetricCalculator.ts)
The `MetricCalculator` class serves as an abstract base class for all metric calculators in the project. It defines the fundamental structure and behavior that all subclasses must implement, ensuring consistency across different types of metrics.

**Key Responsibilities:**
1. Data Handling:
   The constructor accepts data required for metric calculation, which is stored in a protected member variable. This data can be specific to the metric being calculated.
2. Abstract Method for Calculation:
   The `calculate()` method is an abstract method that must be implemented by all subclasses. Each subclass defines the specific logic required to compute its respective metric.
3. Data Validation:
   The `validateData()` method provides a basic mechanism for validating the input data before performing calculations. This method can be overridden by subclasses to implement specific validation rules relevant to the metrics they calculate.

### [**BusFactorCalculator Class**](src/metrics/BusFactorCalculator.ts)
The `BusFactorCalculator` class is a concrete implementation of the `MetricCalculator` abstract class that calculates the bus factor metric for a given project. The bus factor indicates the risk associated with the loss of contributors and helps assess project sustainability.

**Key Responsibilities:**
1. Data Structure:
   The class uses a `BusFactorData` interface to define the structure of the data required for calculations, including total contributors, average contributions, and top contributors.
2. Calculating Top Contributor Percentage:
   During construction, the class calculates the percentage of contributions made by the top contributor relative to the total contributions. This information is crucial for assessing the bus factor risk.
3. Bus Factor Calculation:
   The `calculate()` method implements the logic to compute the bus factor score:
   - Returns a score between 0 and 1, where a higher score indicates a lower risk.
   - Evaluates the number of total contributors and the contribution distribution to assess risk levels (high, moderate, or low).
4. Data Validation:
   - The `validateData()` method checks the integrity of the input data, ensuring that the total contributors and top contributor percentage are valid numbers and meet necessary conditions before performing calculations.

### [**CorrectnessCalculator Class**](src/metrics/CorrectnessCalculator.ts)
The `CorrectnessCalculator` class is a concrete implementation of the `MetricCalculator` abstract class that evaluates the correctness metric of a project. This metric assesses the health and stability of the project based on various factors, including bug reports, release frequency, and overall popularity.

**Key Responsibilities:**
1. Data Structure:
   The class uses a `CorrectnessData` interface to define the structure of the data required for calculations, including metrics such as open bugs, pull requests, and release information.
2. Correctness Calculation:
   The `calculate()` method implements the logic to compute the correctness score:
   - Returns a score between 0 and 1, where a higher score indicates better correctness.
   - Considers several factors:
      - Open Bugs Score: Fewer open bugs yield a higher score.
      - Activity Score: More recent releases improve the score.
      - Popularity Score: A higher combined total of stars, forks, and watchers enhances the score.
   - The final score is a weighted combination of these individual scores.
3. Data Validation:
   - The `validateData()` method checks the integrity of the input data, ensuring all metrics are valid numbers and non-negative, which is essential for accurate calculations.

### [**LicenseCalculator Class**](src/metrics/LicenseCalculator.ts)
The `LicenseCalculator` class is a concrete implementation of the `MetricCalculator` abstract class that assesses the licensing compatibility of a project. This metric evaluates the project's license against a predefined set of compatible licenses to determine its openness and usability for potential contributors.

**Key Responsibilities:**
1. License Evaluation:
   The class maintains two arrays to manage licenses:
   - `explicitlyCompatibleLicenses`: Contains licenses deemed fully compatible, such as MIT and GPL variants.
   - `licensesNeedingConsideration`: Includes licenses like Apache-2.0 and BSD variants, which may require additional analysis.
2. License Calculation:
   The `calculate()` method implements the logic to compute the license score:
   - Returns a score between 0 and 1, where:
      - A score of 1 is given for explicitly compatible licenses.
      - A score of 0.5 is assigned to licenses needing consideration.
      - A score of 0 is returned for incompatible licenses.
3. Data Initialization:
   The constructor initializes the license information from the provided data, accommodating various formats (object structure or plain string).
4. Data Validation:
   The `validateData()` method ensures the license information is valid, confirming that it is a non-empty string, which is essential for accurate metric calculations.

### [**RampUpCalculator Class**](src/metrics/RampUpCalculator.ts)
The `RampUpCalculator` class is a concrete implementation of the `MetricCalculator` abstract class that assesses how quickly a new contributor can become productive in a project. It evaluates the project's README content to determine the presence of essential sections and readability, ultimately providing a score that indicates the ease of onboarding new contributors.

**Key Responsibilities:**
1. Data Handling:
   The class constructor initializes the README content from the provided data. It accommodates various formats (object structure or plain string) to ensure flexibility in input.
2. Ramp-up Calculation:
   The `calculate()` method implements the logic to compute the ramp-up score:
   - Returns a score between 0 and 1, where:
      - The score is derived from analyzing the README content for key sections and calculating its readability.
      - The final score is normalized to a range between 0 and 1, representing the project's onboarding efficiency.
3. README Analysis:
   The `analyzeReadme()` method assesses the README content for the presence of crucial sections, such as installation instructions, usage details, and contribution guidelines. It assigns scores based on the number of identified sections.
4. Readability Assessment:
   The `calculateReadability()` method uses the Flesch Reading Ease formula to evaluate the readability of the README content, factoring in sentence length and syllable count to derive a readability score.
5. Data Validation:
   The `validateData()` method ensures the README content is a non-empty string, confirming that it contains useful information for new contributors.

### [**ResponsiveMaintainerCalculator Class**](src/metrics/ResponsiveMaintainerCalculator.ts)
The `ResponsiveMaintainerCalculator` class is a concrete implementation of the `MetricCalculator` abstract class that evaluates how responsive and active the maintainers of a project are. It combines various metrics related to commits, issue resolution, and release frequency to provide a score that indicates the level of maintenance responsiveness.

**Key Responsibilities:**
1. Data Handling:
   The class constructor initializes the data needed to calculate the responsive maintainer metric, ensuring that the input adheres to the expected structure.
2. Responsiveness Calculation:
   The `calculate()` method implements the logic to compute the responsiveness score:
   - The score is based on three main components: commit activity, issue resolution rate, and release frequency, each contributing a specified weight to the final score.
   - The resulting score is normalized to a range between 0 and 1, representing the maintainer's responsiveness.
3. Commit Activity Score:
   The score reflects the recent commit activity relative to the average monthly commits, ensuring that maintainers are currently engaged in the project.
4. Issue Resolution Rate:
   This metric assesses how effectively the maintainers address issues by comparing closed issues to the total number of issues.
5. Release Frequency Score:
   This score evaluates the frequency of releases over the past year, reflecting the maintainer's commitment to keeping the project updated.
6. Data Validation:
   The `validateData()` method ensures all input values are non-negative numbers, confirming that the data is suitable for calculation.

## **Testing**
   - Instructions on running tests.
   - Example:
     ```bash
     npm test
     ```
   - Overview of testing strategies used in the project (unit tests, integration tests, etc.).
      - We used JEST to conduct our unit testing for the metric calculators and calculator factory. This is what is run during ./run test
      -   

## **License**
This project is licensed under the GNU Lesser General Public License v2.1.

## **Acknowledgments**
We would like to thank the ACME Corporation for their support and contributions.
