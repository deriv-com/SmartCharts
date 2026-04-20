/**
 * Temporary type overrides for @deriv/api-types to handle API breaking changes
 * TODO: Remove this file once @deriv/api-types package is updated with new property names
 */

import { ActiveSymbols as OriginalActiveSymbols } from '@deriv/api-types';

// Override the ActiveSymbols type to include new property names
export type ActiveSymbolsItem = Omit<OriginalActiveSymbols[0], 'pip' | 'symbol' | 'symbol_type'> & {
    pip_size: number;
    underlying_symbol: string;
    underlying_symbol_type: string;
    // Keep old properties for backward compatibility during transition
    pip?: number;
    symbol?: string;
    symbol_type?: string;
};

export type ActiveSymbols = ActiveSymbolsItem[];