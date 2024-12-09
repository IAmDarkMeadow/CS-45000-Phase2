import { MetricCalculator } from './MetricCalculator';

export class LicenseCalculator extends MetricCalculator {
    private explicitlyCompatibleLicenses: string[] = ['MIT', 'GPLv2', 'GPLv3', 'LGPLv2.1', 'LGPLv3'];
    private licensesNeedingConsideration: string[] = ['Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause'];
    private license: string;

    constructor(data: any) {
        super(data);

        if (data?.data?.repository?.licenseInfo?.spdxId) {
            this.license = data.data.repository.licenseInfo.spdxId;
        } else if (data?.spdxId) {
            this.license = data.spdxId;
        } else if (typeof data === 'string') {
            // Handle case where data is the license spdxId as a string
            this.license = data;
        } else {
            this.license = '';
        }
    }

    /**
     * Calculates the license metric.
     * @returns a score between 0 and 1.
     */
    calculate(): number {
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
    override validateData(): boolean {
        return super.validateData() && typeof this.license === 'string' && this.license !== '';
    }
}
