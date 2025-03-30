import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { NutritionApiClient } from '../api/client.js';
import { formatValueWithUnit, translate } from '../utils/i18n.js';
import { DEFAULT_LANGUAGE } from '../utils/language.js';
import { getFoodDetails } from './foods.js';
// Create an instance of the API client
const apiClient = new NutritionApiClient();
/**
 * Get all component sets (nutrient groups)
 * @param language Language code
 * @returns Array of component sets
 */
export async function getComponentSets(language = DEFAULT_LANGUAGE) {
    try {
        return await apiClient.getSets(language);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Get all components (nutrients)
 * @param language Language code
 * @returns Array of components
 */
export async function getComponents(language = DEFAULT_LANGUAGE) {
    try {
        return await apiClient.getComponents(language);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Get nutritional values for a specific food
 * @param params Parameters for retrieving values
 * @returns Array of nutritional values
 */
export async function getNutritionalValues(params) {
    const { foodId, componentSetId, language = DEFAULT_LANGUAGE } = params;
    try {
        // First get the DBID from the food ID if they're different
        let dbid = foodId;
        try {
            dbid = await apiClient.getFoodDBID(foodId);
        }
        catch {
            // If getFoodDBID fails, use the original foodId as the DBID
            dbid = foodId;
        }
        const valuesParams = {
            DBID: dbid,
            componentsetid: componentSetId,
            lang: language
        };
        const values = await apiClient.getFoodValues(valuesParams);
        if (!values || values.length === 0) {
            throw new McpError(ErrorCode.InvalidRequest, `No nutritional values found for food ID ${foodId} with component set ID ${componentSetId}`);
        }
        return values;
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Compare nutritional values between multiple foods
 * @param params Parameters for comparing values
 * @returns Comparison result with values for each food
 */
export async function compareNutritionalValues(params) {
    const { foodIds, componentSetId, language = DEFAULT_LANGUAGE } = params;
    if (!foodIds || foodIds.length < 2) {
        throw new McpError(ErrorCode.InvalidParams, 'At least two food IDs are required for comparison');
    }
    try {
        // Get food details for all foods
        const foodsPromises = foodIds.map(foodId => getFoodDetails({ foodId, language }));
        const foods = await Promise.all(foodsPromises);
        // Get nutritional values for all foods
        const valuesPromises = foodIds.map(foodId => getNutritionalValues({ foodId, componentSetId, language }));
        const valuesArrays = await Promise.all(valuesPromises);
        // Build comparison table
        const comparisonTable = {};
        // Get the complete set of components across all foods
        const allComponents = new Set();
        valuesArrays.forEach(valueArray => {
            valueArray.forEach(value => {
                allComponents.add(value.component.name);
            });
        });
        // Initialize the comparison table with empty arrays for each component
        allComponents.forEach(componentName => {
            comparisonTable[componentName] = [];
        });
        // Fill in the values for each food
        valuesArrays.forEach(valueArray => {
            // Create a map of component name to value for this food
            const componentValueMap = new Map();
            valueArray.forEach(value => {
                componentValueMap.set(value.component.name, value);
            });
            // For each component in the complete set
            allComponents.forEach(componentName => {
                const value = componentValueMap.get(componentName);
                if (value) {
                    const numValue = typeof value.value === 'string'
                        ? parseFloat(value.value)
                        : value.value;
                    const unitString = typeof value.unit === 'string'
                        ? value.unit
                        : value.unit.name;
                    comparisonTable[componentName].push({
                        value: numValue,
                        formattedValue: formatValueWithUnit(numValue, unitString, language)
                    });
                }
                else {
                    // If this food doesn't have a value for this component, add a placeholder
                    comparisonTable[componentName].push({
                        value: 0,
                        formattedValue: '-'
                    });
                }
            });
        });
        return {
            foods,
            comparisonTable
        };
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        if (error instanceof Error) {
            throw new McpError(ErrorCode.InternalError, `${translate('error.api', language)}: ${error.message}`);
        }
        throw error;
    }
}
//# sourceMappingURL=nutrition.js.map