import { MetricCalculator } from './MetricCalculator';
import { LicenseCalculator } from './LicenseCalculator';
import { BusFactorCalculator } from './BusFactorCalculator';
import { CorrectnessCalculator } from './CorrectnessCalculator';
import { RampUpCalculator } from './RampUpCalculator';
import { ResponsiveMaintainerCalculator } from './ResponsiveMaintainerCalculator';

// Define an enum to manage types of calculators, ensuring type safety and clarity
enum CalculatorTypes {
    License = "License",
    BusFactor = "BusFactor",
    Correctness = "Correctness",
    RampUp = "RampUp",
    ResponsiveMaintainer = "ResponsiveMaintainer",
    // Add more calculator types as our project expands
}

class CalculatorFactory {
    /**
     * Creates and returns an instance of a MetricCalculator subclass based on the type provided.
     * @param type The type of calculator to instantiate.
     * @param data The data required for the calculator.
     * @returns An instance of a subclass of MetricCalculator or undefined if the type is not supported.
     */
    static createCalculator(type: CalculatorTypes, data: any): MetricCalculator | undefined {
        switch (type) {
            case CalculatorTypes.License:
                return new LicenseCalculator(data);
            case CalculatorTypes.BusFactor:
                return new BusFactorCalculator(data);
            case CalculatorTypes.Correctness:
                return new CorrectnessCalculator(data);
            case CalculatorTypes.RampUp:
                return new RampUpCalculator(data);
            case CalculatorTypes.ResponsiveMaintainer:
                return new ResponsiveMaintainerCalculator(data);
            // Implement cases for other types as needed
            default:
                console.error('Unknown Calculator Type');
                return undefined;
        }
    }
}

export { CalculatorFactory, CalculatorTypes };
