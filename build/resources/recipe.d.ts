import { Language } from '../api/types.js';
/**
 * Resource URI templates for recipe-related resources
 */
export declare const recipeResourceTemplates: {
    uriTemplate: string;
    name: string;
    description: string;
    mimeType: string;
}[];
/**
 * Handle recipe resource requests
 * @param uri The requested resource URI
 * @param language The language to use for the response
 * @returns The resource contents
 */
export declare function handleRecipeResource(uri: string, language?: Language): Promise<{
    uri: string;
    mimeType: string;
    text: string;
}>;
