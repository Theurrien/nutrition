import { DEFAULT_LANGUAGE } from './language.js';
/**
 * Translations for common UI messages and terms
 */
export const translations = {
    // Common messages
    'error.api': {
        en: 'Swiss Nutrition Database API error',
        de: 'Schweizer Nährwertdatenbank API-Fehler',
        fr: 'Erreur de l\'API de la base de données suisse sur les nutriments',
        it: 'Errore dell\'API della banca dati svizzera dei nutrienti'
    },
    'error.notFound': {
        en: 'Food not found',
        de: 'Lebensmittel nicht gefunden',
        fr: 'Aliment non trouvé',
        it: 'Cibo non trovato'
    },
    'search.noResults': {
        en: 'No foods found matching your search criteria',
        de: 'Keine Lebensmittel gefunden, die Ihren Suchkriterien entsprechen',
        fr: 'Aucun aliment correspondant à vos critères de recherche n\'a été trouvé',
        it: 'Nessun cibo trovato corrispondente ai tuoi criteri di ricerca'
    },
    // Food categories
    'category.fruits': {
        en: 'Fruits',
        de: 'Früchte',
        fr: 'Fruits',
        it: 'Frutta'
    },
    'category.vegetables': {
        en: 'Vegetables',
        de: 'Gemüse',
        fr: 'Légumes',
        it: 'Verdura'
    },
    'category.dairy': {
        en: 'Dairy products',
        de: 'Milchprodukte',
        fr: 'Produits laitiers',
        it: 'Latticini'
    },
    'category.meat': {
        en: 'Meat',
        de: 'Fleisch',
        fr: 'Viande',
        it: 'Carne'
    },
    'category.fish': {
        en: 'Fish',
        de: 'Fisch',
        fr: 'Poisson',
        it: 'Pesce'
    },
    'category.grains': {
        en: 'Grains and cereals',
        de: 'Getreide und Cerealien',
        fr: 'Grains et céréales',
        it: 'Grani e cereali'
    },
    // Nutrient names
    'nutrient.energy': {
        en: 'Energy',
        de: 'Energie',
        fr: 'Énergie',
        it: 'Energia'
    },
    'nutrient.protein': {
        en: 'Protein',
        de: 'Protein',
        fr: 'Protéines',
        it: 'Proteine'
    },
    'nutrient.fat': {
        en: 'Fat',
        de: 'Fett',
        fr: 'Matières grasses',
        it: 'Grassi'
    },
    'nutrient.carbohydrates': {
        en: 'Carbohydrates',
        de: 'Kohlenhydrate',
        fr: 'Glucides',
        it: 'Carboidrati'
    },
    'nutrient.fiber': {
        en: 'Dietary fiber',
        de: 'Ballaststoffe',
        fr: 'Fibres alimentaires',
        it: 'Fibre alimentari'
    },
    'nutrient.sodium': {
        en: 'Sodium',
        de: 'Natrium',
        fr: 'Sodium',
        it: 'Sodio'
    },
    // Units
    'unit.gram': {
        en: 'gram',
        de: 'Gramm',
        fr: 'gramme',
        it: 'grammo'
    },
    'unit.kilogram': {
        en: 'kilogram',
        de: 'Kilogramm',
        fr: 'kilogramme',
        it: 'chilogrammo'
    },
    'unit.milligram': {
        en: 'milligram',
        de: 'Milligramm',
        fr: 'milligramme',
        it: 'milligrammo'
    },
    'unit.microgram': {
        en: 'microgram',
        de: 'Mikrogramm',
        fr: 'microgramme',
        it: 'microgrammo'
    },
    'unit.kilocalorie': {
        en: 'kcal',
        de: 'kcal',
        fr: 'kcal',
        it: 'kcal'
    },
    'unit.kilojoule': {
        en: 'kJ',
        de: 'kJ',
        fr: 'kJ',
        it: 'kJ'
    },
    // Tool names and descriptions
    'tool.searchFoods.name': {
        en: 'search_foods',
        de: 'search_foods',
        fr: 'search_foods',
        it: 'search_foods'
    },
    'tool.searchFoods.description': {
        en: 'Search for foods in the Swiss Nutrition Database',
        de: 'Suche nach Lebensmitteln in der Schweizer Nährwertdatenbank',
        fr: 'Recherche d\'aliments dans la base de données suisse sur les nutriments',
        it: 'Cerca alimenti nella banca dati svizzera dei nutrienti'
    },
    'tool.getFoodDetails.name': {
        en: 'get_food_details',
        de: 'get_food_details',
        fr: 'get_food_details',
        it: 'get_food_details'
    },
    'tool.getFoodDetails.description': {
        en: 'Get detailed information about a specific food',
        de: 'Detaillierte Informationen zu einem bestimmten Lebensmittel erhalten',
        fr: 'Obtenir des informations détaillées sur un aliment spécifique',
        it: 'Ottieni informazioni dettagliate su un alimento specifico'
    },
    'tool.calculateRecipeNutrition.name': {
        en: 'calculate_recipe_nutrition',
        de: 'calculate_recipe_nutrition',
        fr: 'calculate_recipe_nutrition',
        it: 'calculate_recipe_nutrition'
    },
    'tool.calculateRecipeNutrition.description': {
        en: 'Calculate nutritional values for a recipe',
        de: 'Nährwerte für ein Rezept berechnen',
        fr: 'Calculer les valeurs nutritionnelles d\'une recette',
        it: 'Calcola i valori nutrizionali per una ricetta'
    }
};
/**
 * Get a translated message
 * @param key Translation key
 * @param language Target language
 * @returns Translated message
 */
export function translate(key, language = DEFAULT_LANGUAGE) {
    const translation = translations[key];
    if (!translation) {
        return key;
    }
    return translation[language] || translation[DEFAULT_LANGUAGE];
}
/**
 * Format a number according to the locale conventions
 * @param value Number to format
 * @param language Target language
 * @param options Intl.NumberFormat options
 * @returns Formatted number as a string
 */
export function formatNumber(value, language = DEFAULT_LANGUAGE, options) {
    const localeMap = {
        en: 'en-US',
        de: 'de-CH',
        fr: 'fr-CH',
        it: 'it-CH'
    };
    return new Intl.NumberFormat(localeMap[language], options).format(value);
}
/**
 * Format a value with its unit
 * @param value Number value
 * @param unit Unit string
 * @param language Target language
 * @returns Formatted value with unit
 */
export function formatValueWithUnit(value, unit, language = DEFAULT_LANGUAGE) {
    const formattedValue = formatNumber(value, language);
    // Translate unit if it's a common one
    const unitKey = `unit.${unit.toLowerCase()}`;
    if (translations[unitKey]) {
        unit = translate(unitKey, language);
    }
    return `${formattedValue} ${unit}`;
}
/**
 * Format a date according to the locale conventions
 * @param date Date to format
 * @param language Target language
 * @param options Intl.DateTimeFormat options
 * @returns Formatted date as a string
 */
export function formatDate(date, language = DEFAULT_LANGUAGE, options) {
    const localeMap = {
        en: 'en-US',
        de: 'de-CH',
        fr: 'fr-CH',
        it: 'it-CH'
    };
    return new Intl.DateTimeFormat(localeMap[language], options).format(date);
}
//# sourceMappingURL=i18n.js.map