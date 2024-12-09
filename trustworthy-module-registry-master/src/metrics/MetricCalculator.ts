export abstract class MetricCalculator {
    protected data: any;

    constructor(data: any) {
        this.data = data;
    }

    /**
     * Abstract method to calculate a metric.
     * Must be implemented by all subclasses.
     */
    abstract calculate(): number;

    /**
     * A method to validate data if necessary before calculation.
     * This can be overridden by subclasses if specific validation is needed.
     */
    validateData(): boolean {
        // Basic validation logic (can be extended in subclasses)
        return this.data != null;
    }
}
