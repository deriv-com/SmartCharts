import { displayNameService } from '../services/DisplayNameService';
import { IDisplayNameOptions } from '../config/displayNameTypes';

/**
 * Utility functions for getting display names
 * These provide convenient access to the DisplayNameService
 */

/**
 * Get display name for a symbol with default options
 */
export const getSymbolDisplayName = (symbolCode: string, options?: IDisplayNameOptions): string => {
    return displayNameService.getSymbolDisplayName(symbolCode, options);
};

/**
 * Get display name for a market with default options
 */
export const getMarketDisplayName = (marketCode: string, options?: IDisplayNameOptions): string => {
    return displayNameService.getMarketDisplayName(marketCode, options);
};

/**
 * Get display name for a submarket with default options
 */
export const getSubmarketDisplayName = (submarketCode: string, options?: IDisplayNameOptions): string => {
    return displayNameService.getSubmarketDisplayName(submarketCode, options);
};

/**
 * Get display name for a subgroup with default options
 */
export const getSubgroupDisplayName = (subgroupCode: string, options?: IDisplayNameOptions): string => {
    return displayNameService.getSubgroupDisplayName(subgroupCode, options);
};

/**
 * Format a raw value into a readable format
 */
export const formatRawValue = (rawValue: string): string => {
    return displayNameService.formatRawValue(rawValue);
};

/**
 * Get display names for a complete symbol object
 * Returns an object with all display names for easy destructuring
 */
export const getSymbolDisplayNames = (symbol: {
    symbol?: string;
    market?: string;
    submarket?: string;
    subgroup?: string;
}, options?: IDisplayNameOptions) => {
    return {
        symbolDisplayName: symbol.symbol ? getSymbolDisplayName(symbol.symbol, options) : '',
        marketDisplayName: symbol.market ? getMarketDisplayName(symbol.market, options) : '',
        submarketDisplayName: symbol.submarket ? getSubmarketDisplayName(symbol.submarket, options) : '',
        subgroupDisplayName: symbol.subgroup ? getSubgroupDisplayName(symbol.subgroup, options) : '',
    };
};

/**
 * Get a formatted category path for a symbol
 * Returns: "Market > Submarket > Subgroup" or similar
 */
export const getSymbolCategoryPath = (symbol: {
    market?: string;
    submarket?: string;
    subgroup?: string;
}, options?: IDisplayNameOptions): string => {
    const parts: string[] = [];
    
    if (symbol.market) {
        parts.push(getMarketDisplayName(symbol.market, options));
    }
    
    if (symbol.submarket) {
        parts.push(getSubmarketDisplayName(symbol.submarket, options));
    }
    
    if (symbol.subgroup) {
        const subgroupName = getSubgroupDisplayName(symbol.subgroup, options);
        if (subgroupName) { // Skip empty subgroups (hidden categories)
            parts.push(subgroupName);
        }
    }
    
    return parts.join(' > ');
};

/**
 * Get a short category path for a symbol (market and submarket only)
 * Returns: "Market > Submarket"
 */
export const getShortCategoryPath = (symbol: {
    market?: string;
    submarket?: string;
}, options?: IDisplayNameOptions): string => {
    const parts: string[] = [];
    
    if (symbol.market) {
        parts.push(getMarketDisplayName(symbol.market, options));
    }
    
    if (symbol.submarket) {
        parts.push(getSubmarketDisplayName(symbol.submarket, options));
    }
    
    return parts.join(' > ');
};

/**
 * Check if a symbol should be hidden based on its categories
 */
export const shouldHideSymbol = (symbol: {
    market?: string;
    submarket?: string;
    subgroup?: string;
}): boolean => {
    // A symbol should be hidden if any of its categories result in empty display names
    // (which happens for hidden categories)
    if (symbol.subgroup) {
        const subgroupName = getSubgroupDisplayName(symbol.subgroup);
        if (!subgroupName) {
            return true;
        }
    }
    
    return false;
};

/**
 * Get all display names with caching enabled for better performance
 */
export const getCachedDisplayNames = (symbol: {
    symbol?: string;
    market?: string;
    submarket?: string;
    subgroup?: string;
}) => {
    const options: IDisplayNameOptions = {
        cacheResults: true,
        fallbackToFormatted: true,
        logMissing: false, // Don't log in production usage
    };
    
    return getSymbolDisplayNames(symbol, options);
};

/**
 * Get display names with logging enabled for debugging
 */
export const getDebugDisplayNames = (symbol: {
    symbol?: string;
    market?: string;
    submarket?: string;
    subgroup?: string;
}) => {
    const options: IDisplayNameOptions = {
        cacheResults: false,
        fallbackToFormatted: true,
        logMissing: true,
    };
    
    return getSymbolDisplayNames(symbol, options);
};

/**
 * Batch process multiple symbols to get their display names efficiently
 */
export const batchGetSymbolDisplayNames = (symbols: Array<{
    symbol?: string;
    market?: string;
    submarket?: string;
    subgroup?: string;
}>, options?: IDisplayNameOptions) => {
    return symbols.map(symbol => ({
        ...symbol,
        ...getSymbolDisplayNames(symbol, options),
    }));
};

/**
 * Search for symbols by display name (case-insensitive)
 */
export const searchSymbolsByDisplayName = (
    symbols: Array<{ symbol: string; [key: string]: any }>,
    searchTerm: string,
    options?: IDisplayNameOptions
): Array<{ symbol: string; [key: string]: any }> => {
    if (!searchTerm.trim()) {
        return symbols;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return symbols.filter(symbol => {
        const displayName = getSymbolDisplayName(symbol.symbol, options);
        return displayName.toLowerCase().includes(lowerSearchTerm);
    });
};

/**
 * Group symbols by their market display name
 */
export const groupSymbolsByMarket = (
    symbols: Array<{ market?: string; [key: string]: any }>,
    options?: IDisplayNameOptions
): Record<string, Array<{ market?: string; [key: string]: any }>> => {
    const groups: Record<string, Array<{ market?: string; [key: string]: any }>> = {};
    
    symbols.forEach(symbol => {
        if (symbol.market) {
            const marketDisplayName = getMarketDisplayName(symbol.market, options);
            if (!groups[marketDisplayName]) {
                groups[marketDisplayName] = [];
            }
            groups[marketDisplayName].push(symbol);
        }
    });
    
    return groups;
};

/**
 * Group symbols by their submarket display name
 */
export const groupSymbolsBySubmarket = (
    symbols: Array<{ submarket?: string; [key: string]: any }>,
    options?: IDisplayNameOptions
): Record<string, Array<{ submarket?: string; [key: string]: any }>> => {
    const groups: Record<string, Array<{ submarket?: string; [key: string]: any }>> = {};
    
    symbols.forEach(symbol => {
        if (symbol.submarket) {
            const submarketDisplayName = getSubmarketDisplayName(symbol.submarket, options);
            if (!groups[submarketDisplayName]) {
                groups[submarketDisplayName] = [];
            }
            groups[submarketDisplayName].push(symbol);
        }
    });
    
    return groups;
};