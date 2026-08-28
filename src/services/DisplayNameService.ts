import {
    IDisplayNameService,
    IDisplayNameOptions,
    DisplayNameType,
} from '../config/displayNameTypes';
import {
    DISPLAY_NAME_MAPPINGS,
    DEFAULT_DISPLAY_NAME_OPTIONS,
    HIDDEN_CATEGORIES,
    FORMATTING_RULES,
} from '../config/displayNames';

/**
 * Centralized service for managing display name mappings
 * Provides caching, fallback mechanisms, and extensibility
 */
export class DisplayNameService implements IDisplayNameService {
    private cache = new Map<string, string>();
    private missingMappings = new Set<string>();

    /**
     * Get display name for a symbol
     */
    getSymbolDisplayName(symbolCode: string, options?: IDisplayNameOptions): string {
        const opts = { ...DEFAULT_DISPLAY_NAME_OPTIONS, ...options };
        const cacheKey = `symbol:${symbolCode}`;

        if (opts.cacheResults && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        let displayName = DISPLAY_NAME_MAPPINGS.symbols[symbolCode];

        if (!displayName) {
            if (opts.logMissing && !this.missingMappings.has(cacheKey)) {
                console.warn(`Missing symbol display name mapping for: ${symbolCode}`);
                this.missingMappings.add(cacheKey);
            }

            if (opts.fallbackToFormatted) {
                displayName = this.formatRawValue(symbolCode);
            } else {
                displayName = symbolCode;
            }
        }

        if (opts.cacheResults) {
            this.cache.set(cacheKey, displayName);
        }

        return displayName;
    }

    /**
     * Get display name for a market
     */
    getMarketDisplayName(marketCode: string, options?: IDisplayNameOptions): string {
        const opts = { ...DEFAULT_DISPLAY_NAME_OPTIONS, ...options };
        const cacheKey = `market:${marketCode}`;

        if (opts.cacheResults && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        let displayName = DISPLAY_NAME_MAPPINGS.markets[marketCode];

        if (!displayName) {
            if (opts.logMissing && !this.missingMappings.has(cacheKey)) {
                console.warn(`Missing market display name mapping for: ${marketCode}`);
                this.missingMappings.add(cacheKey);
            }

            if (opts.fallbackToFormatted) {
                displayName = this.formatRawValue(marketCode);
                // Apply market-specific formatting rules
                if (FORMATTING_RULES.indices && marketCode.includes('index')) {
                    displayName = FORMATTING_RULES.indices(displayName);
                }
            } else {
                displayName = marketCode;
            }
        }

        if (opts.cacheResults) {
            this.cache.set(cacheKey, displayName);
        }

        return displayName;
    }

    /**
     * Get display name for a submarket
     */
    getSubmarketDisplayName(submarketCode: string, options?: IDisplayNameOptions): string {
        const opts = { ...DEFAULT_DISPLAY_NAME_OPTIONS, ...options };
        const cacheKey = `submarket:${submarketCode}`;

        if (opts.cacheResults && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        let displayName = DISPLAY_NAME_MAPPINGS.submarkets[submarketCode];

        if (!displayName) {
            if (opts.logMissing && !this.missingMappings.has(cacheKey)) {
                console.warn(`Missing submarket display name mapping for: ${submarketCode}`);
                this.missingMappings.add(cacheKey);
            }

            if (opts.fallbackToFormatted) {
                displayName = this.formatRawValue(submarketCode);
            } else {
                displayName = submarketCode;
            }
        }

        if (opts.cacheResults) {
            this.cache.set(cacheKey, displayName);
        }

        return displayName;
    }

    /**
     * Get display name for a subgroup
     */
    getSubgroupDisplayName(subgroupCode: string, options?: IDisplayNameOptions): string {
        const opts = { ...DEFAULT_DISPLAY_NAME_OPTIONS, ...options };
        const cacheKey = `subgroup:${subgroupCode}`;

        // Handle hidden categories
        if (HIDDEN_CATEGORIES.has(subgroupCode)) {
            return '';
        }

        if (opts.cacheResults && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        let displayName = DISPLAY_NAME_MAPPINGS.subgroups[subgroupCode];

        if (!displayName) {
            if (opts.logMissing && !this.missingMappings.has(cacheKey)) {
                console.warn(`Missing subgroup display name mapping for: ${subgroupCode}`);
                this.missingMappings.add(cacheKey);
            }

            if (opts.fallbackToFormatted) {
                displayName = this.formatRawValue(subgroupCode);
            } else {
                displayName = subgroupCode;
            }
        }

        if (opts.cacheResults) {
            this.cache.set(cacheKey, displayName);
        }

        return displayName;
    }

    /**
     * Format raw value into a more readable format
     */
    formatRawValue(rawValue: string): string {
        if (!rawValue) return '';

        return rawValue
            // Replace underscores with spaces
            .replace(/_/g, ' ')
            // Replace hyphens with spaces
            .replace(/-/g, ' ')
            // Convert to title case
            .split(' ')
            .map(word => {
                if (word.length === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ')
            // Clean up extra spaces
            .trim()
            .replace(/\s+/g, ' ');
    }

    /**
     * Add a new mapping dynamically
     */
    addMapping(type: DisplayNameType, code: string, displayName: string): void {
        switch (type) {
            case 'symbol':
                DISPLAY_NAME_MAPPINGS.symbols[code] = displayName;
                break;
            case 'market':
                DISPLAY_NAME_MAPPINGS.markets[code] = displayName;
                break;
            case 'submarket':
                DISPLAY_NAME_MAPPINGS.submarkets[code] = displayName;
                break;
            case 'subgroup':
                DISPLAY_NAME_MAPPINGS.subgroups[code] = displayName;
                break;
        }

        // Clear cache for this item
        const cacheKey = `${type}:${code}`;
        this.cache.delete(cacheKey);
        this.missingMappings.delete(cacheKey);
    }

    /**
     * Clear the cache
     */
    clearCache(): void {
        this.cache.clear();
        this.missingMappings.clear();
    }

    /**
     * Get all missing mappings for debugging
     */
    getMissingMappings(): string[] {
        return Array.from(this.missingMappings);
    }

    /**
     * Get cache statistics
     */
    getCacheStats(): { size: number; missingCount: number } {
        return {
            size: this.cache.size,
            missingCount: this.missingMappings.size,
        };
    }

    /**
     * Batch get display names for multiple items of the same type
     */
    batchGetDisplayNames(
        type: DisplayNameType,
        codes: string[],
        options?: IDisplayNameOptions
    ): Record<string, string> {
        const result: Record<string, string> = {};

        for (const code of codes) {
            switch (type) {
                case 'symbol':
                    result[code] = this.getSymbolDisplayName(code, options);
                    break;
                case 'market':
                    result[code] = this.getMarketDisplayName(code, options);
                    break;
                case 'submarket':
                    result[code] = this.getSubmarketDisplayName(code, options);
                    break;
                case 'subgroup':
                    result[code] = this.getSubgroupDisplayName(code, options);
                    break;
            }
        }

        return result;
    }

    /**
     * Check if a mapping exists for a given code and type
     */
    hasMapping(type: DisplayNameType, code: string): boolean {
        switch (type) {
            case 'symbol':
                return code in DISPLAY_NAME_MAPPINGS.symbols;
            case 'market':
                return code in DISPLAY_NAME_MAPPINGS.markets;
            case 'submarket':
                return code in DISPLAY_NAME_MAPPINGS.submarkets;
            case 'subgroup':
                return code in DISPLAY_NAME_MAPPINGS.subgroups;
            default:
                return false;
        }
    }
}

// Export singleton instance
export const displayNameService = new DisplayNameService();