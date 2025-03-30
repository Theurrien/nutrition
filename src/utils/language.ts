import { Language } from '../api/types.js';

/**
 * Default language to use when none is specified
 */
export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * All supported languages
 */
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'de', 'fr', 'it'];

/**
 * User language preferences storage (in-memory for now)
 */
const userLanguagePreferences = new Map<string, Language>();

/**
 * Set a user's language preference
 * @param userId User identifier
 * @param language Preferred language
 */
export function setUserLanguagePreference(userId: string, language: Language): void {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported language: ${language}. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }
  userLanguagePreferences.set(userId, language);
}

/**
 * Get a user's language preference
 * @param userId User identifier
 * @returns The user's preferred language or the default language
 */
export function getUserLanguagePreference(userId: string): Language {
  return userLanguagePreferences.get(userId) || DEFAULT_LANGUAGE;
}

/**
 * Detect the language from a text input
 * @param text Text to analyze for language detection
 * @returns Detected language code or default language if detection fails
 */
export function detectLanguage(text: string): Language {
  // This is a very basic implementation
  // In a production environment, you'd use a proper language detection library
  
  const normalizedText = text.toLowerCase();
  
  // German keywords
  const germanKeywords = ['apfel', 'brot', 'milch', 'käse', 'wasser', 'zucker', 'salz', 'gemüse', 'obst'];
  
  // French keywords
  const frenchKeywords = ['pomme', 'pain', 'lait', 'fromage', 'eau', 'sucre', 'sel', 'légume', 'fruit'];
  
  // Italian keywords
  const italianKeywords = ['mela', 'pane', 'latte', 'formaggio', 'acqua', 'zucchero', 'sale', 'verdura', 'frutta'];
  
  // Count matches for each language
  let germanCount = germanKeywords.filter(word => normalizedText.includes(word)).length;
  let frenchCount = frenchKeywords.filter(word => normalizedText.includes(word)).length;
  let italianCount = italianKeywords.filter(word => normalizedText.includes(word)).length;
  
  // Get the language with the highest count
  if (germanCount > frenchCount && germanCount > italianCount) {
    return 'de';
  } else if (frenchCount > germanCount && frenchCount > italianCount) {
    return 'fr';
  } else if (italianCount > germanCount && italianCount > frenchCount) {
    return 'it';
  }
  
  // Default to English if no clear match
  return DEFAULT_LANGUAGE;
}

/**
 * Validate if a language is supported
 * @param language Language code to validate
 * @returns True if the language is supported, false otherwise
 */
export function isLanguageSupported(language: string): language is Language {
  return SUPPORTED_LANGUAGES.includes(language as Language);
}