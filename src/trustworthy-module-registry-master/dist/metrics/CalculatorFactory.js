"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorTypes = exports.CalculatorFactory = void 0;
const LicenseCalculator_1 = require("./LicenseCalculator");
const BusFactorCalculator_1 = require("./BusFactorCalculator");
const CorrectnessCalculator_1 = require("./CorrectnessCalculator");
const RampUpCalculator_1 = require("./RampUpCalculator");
const ResponsiveMaintainerCalculator_1 = require("./ResponsiveMaintainerCalculator");
// Define an enum to manage types of calculators, ensuring type safety and clarity
var CalculatorTypes;
(function (CalculatorTypes) {
    CalculatorTypes["License"] = "License";
    CalculatorTypes["BusFactor"] = "BusFactor";
    CalculatorTypes["Correctness"] = "Correctness";
    CalculatorTypes["RampUp"] = "RampUp";
    CalculatorTypes["ResponsiveMaintainer"] = "ResponsiveMaintainer";
    // Add more calculator types as our project expands
})(CalculatorTypes || (exports.CalculatorTypes = CalculatorTypes = {}));
class CalculatorFactory {
    /**
     * Creates and returns an instance of a MetricCalculator subclass based on the type provided.
     * @param type The type of calculator to instantiate.
     * @param data The data required for the calculator.
     * @returns An instance of a subclass of MetricCalculator or undefined if the type is not supported.
     */
    static createCalculator(type, data) {
        switch (type) {
            case CalculatorTypes.License:
                return new LicenseCalculator_1.LicenseCalculator(data);
            case CalculatorTypes.BusFactor:
                return new BusFactorCalculator_1.BusFactorCalculator(data);
            case CalculatorTypes.Correctness:
                return new CorrectnessCalculator_1.CorrectnessCalculator(data);
            case CalculatorTypes.RampUp:
                return new RampUpCalculator_1.RampUpCalculator(data);
            case CalculatorTypes.ResponsiveMaintainer:
                return new ResponsiveMaintainerCalculator_1.ResponsiveMaintainerCalculator(data);
            // Implement cases for other types as needed
            default:
                console.error('Unknown Calculator Type');
                return undefined;
        }
    }
}
exports.CalculatorFactory = CalculatorFactory;
