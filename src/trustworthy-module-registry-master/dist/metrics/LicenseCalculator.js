"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseCalculator = void 0;
const MetricCalculator_1 = require("./MetricCalculator");
class LicenseCalculator extends MetricCalculator_1.MetricCalculator {
    constructor(data) {
        super(data);
        this.explicitlyCompatibleLicenses = ['MIT', 'GPLv2', 'GPLv3', 'LGPLv2.1', 'LGPLv3'];
        this.licensesNeedingConsideration = ['Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause'];
        if (data?.data?.repository?.licenseInfo?.spdxId) {
            this.license = data.data.repository.licenseInfo.spdxId;
        }
        else if (data?.spdxId) {
            this.license = data.spdxId;
        }
        else if (typeof data === 'string') {
            // Handle case where data is the license spdxId as a string
            this.license = data;
        }
        else {
            this.license = '';
        }
    }
    /**
     * Calculates the license metric.
     * @returns a score between 0 and 1.
     */
    calculate() {
        if (!this.validateData()) {
            return 0;
        }
        if (this.explicitlyCompatibleLicenses.includes(this.license)) {
            return 1;
        }
        if (this.licensesNeedingConsideration.includes(this.license)) {
            return 0.5;
        }
        return 0;
    }
    /**
     * Validates the input data.
     */
    validateData() {
        return super.validateData() && typeof this.license === 'string' && this.license !== '';
    }
}
exports.LicenseCalculator = LicenseCalculator;
