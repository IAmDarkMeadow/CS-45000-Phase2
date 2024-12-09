"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricCalculator = void 0;
class MetricCalculator {
    constructor(data) {
        this.data = data;
    }
    /**
     * A method to validate data if necessary before calculation.
     * This can be overridden by subclasses if specific validation is needed.
     */
    validateData() {
        // Basic validation logic (can be extended in subclasses)
        return this.data != null;
    }
}
exports.MetricCalculator = MetricCalculator;
