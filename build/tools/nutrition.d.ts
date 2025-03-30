import { Component, ComponentSet, Food, Language, Value } from '../api/types.js';
/**
 * Get all component sets (nutrient groups)
 * @param language Language code
 * @returns Array of component sets
 */
export declare function getComponentSets(language?: Language): Promise<ComponentSet[]>;
/**
 * Get all components (nutrients)
 * @param language Language code
 * @returns Array of components
 */
export declare function getComponents(language?: Language): Promise<Component[]>;
/**
 * Get nutritional values for a specific food
 * @param params Parameters for retrieving values
 * @returns Array of nutritional values
 */
export declare function getNutritionalValues(params: {
    foodId: number;
    componentSetId: number;
    language?: Language;
}): Promise<Value[]>;
/**
 * Compare nutritional values between multiple foods
 * @param params Parameters for comparing values
 * @returns Comparison result with values for each food
 */
export declare function compareNutritionalValues(params: {
    foodIds: number[];
    componentSetId: number;
    language?: Language;
}): Promise<{
    foods: Food[];
    comparisonTable: Record<string, Array<{
        value: number;
        formattedValue: string;
    }>>;
}>;
