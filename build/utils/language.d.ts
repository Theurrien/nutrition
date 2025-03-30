import { Language } from '../api/types.js';
/**
 * Default language to use when none is specified
 */
export declare const DEFAULT_LANGUAGE: Language;
/**
 * All supported languages
 */
export declare const SUPPORTED_LANGUAGES: Language[];
/**
 * Set a user's language preference
 * @param userId User identifier
 * @param language Preferred language
 */
export declare function setUserLanguagePreference(userId: string, language: Language): void;
/**
 * Get a user's language preference
 * @param userId User identifier
 * @returns The user's preferred language or the default language
 */
export declare function getUserLanguagePreference(userId: string): Language;
/**
 * Detect the language from a text input
 * @param text Text to analyze for language detection
 * @returns Detected language code or default language if detection fails
 */
export declare function detectLanguage(text: string): Language;
/**
 * Validate if a language is supported
 * @param language Language code to validate
 * @returns True if the language is supported, false otherwise
 */
export declare function isLanguageSupported(language: string): language is Language;
