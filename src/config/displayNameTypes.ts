/**
 * TypeScript interfaces for the display name mapping system
 */

export interface ISymbolDisplayNames {
    [symbolCode: string]: string;
}

export interface IMarketDisplayNames {
    [marketCode: string]: string;
}

export interface ISubmarketDisplayNames {
    [submarketCode: string]: string;
}

export interface ISubgroupDisplayNames {
    [subgroupCode: string]: string;
}

export interface IDisplayNameMappings {
    symbols: ISymbolDisplayNames;
    markets: IMarketDisplayNames;
    submarkets: ISubmarketDisplayNames;
    subgroups: ISubgroupDisplayNames;
}

export interface IDisplayNameOptions {
    fallbackToFormatted?: boolean;
    logMissing?: boolean;
    cacheResults?: boolean;
}

export type DisplayNameType = 'symbol' | 'market' | 'submarket' | 'subgroup';

export interface IDisplayNameService {
    getSymbolDisplayName(symbolCode: string, options?: IDisplayNameOptions): string;
    getMarketDisplayName(marketCode: string, options?: IDisplayNameOptions): string;
    getSubmarketDisplayName(submarketCode: string, options?: IDisplayNameOptions): string;
    getSubgroupDisplayName(subgroupCode: string, options?: IDisplayNameOptions): string;
    formatRawValue(rawValue: string): string;
    addMapping(type: DisplayNameType, code: string, displayName: string): void;
    clearCache(): void;
}