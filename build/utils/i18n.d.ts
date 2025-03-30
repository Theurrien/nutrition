import { Language } from '../api/types.js';
/**
 * Translations for common UI messages and terms
 */
export declare const translations: {
    'error.api': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'error.notFound': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'search.noResults': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'category.fruits': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'category.vegetables': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'category.dairy': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'category.meat': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'category.fish': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'category.grains': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'nutrient.energy': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'nutrient.protein': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'nutrient.fat': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'nutrient.carbohydrates': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'nutrient.fiber': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'nutrient.sodium': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'unit.gram': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'unit.kilogram': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'unit.milligram': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'unit.microgram': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'unit.kilocalorie': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'unit.kilojoule': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'tool.searchFoods.name': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'tool.searchFoods.description': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'tool.getFoodDetails.name': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'tool.getFoodDetails.description': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'tool.calculateRecipeNutrition.name': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
    'tool.calculateRecipeNutrition.description': {
        en: string;
        de: string;
        fr: string;
        it: string;
    };
};
/**
 * Get a translated message
 * @param key Translation key
 * @param language Target language
 * @returns Translated message
 */
export declare function translate(key: keyof typeof translations, language?: Language): string;
/**
 * Format a number according to the locale conventions
 * @param value Number to format
 * @param language Target language
 * @param options Intl.NumberFormat options
 * @returns Formatted number as a string
 */
export declare function formatNumber(value: number, language?: Language, options?: Intl.NumberFormatOptions): string;
/**
 * Format a value with its unit
 * @param value Number value
 * @param unit Unit string
 * @param language Target language
 * @returns Formatted value with unit
 */
export declare function formatValueWithUnit(value: number, unit: string, language?: Language): string;
/**
 * Format a date according to the locale conventions
 * @param date Date to format
 * @param language Target language
 * @param options Intl.DateTimeFormat options
 * @returns Formatted date as a string
 */
export declare function formatDate(date: Date, language?: Language, options?: Intl.DateTimeFormatOptions): string;
