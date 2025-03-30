import { Language } from '../api/types.js';
/**
 * Resource URI templates for food-related resources
 */
export declare const foodResourceTemplates: {
    uriTemplate: string;
    name: string;
    description: string;
    mimeType: string;
}[];
/**
 * Handle food resource requests
 * @param uri The requested resource URI
 * @param language The language to use for the response
 * @returns The resource contents
 */
export declare function handleFoodResource(uri: string, language?: Language): Promise<{
    uri: string;
    mimeType: string;
    text: string;
}>;
