import { expect } from 'chai';
import {
    getSymbolDisplayName,
    getMarketDisplayName,
    getSubmarketDisplayName,
    getSubgroupDisplayName,
    formatRawValue,
    getSymbolDisplayNames,
    getSymbolCategoryPath,
    getShortCategoryPath,
    shouldHideSymbol,
    getCachedDisplayNames,
    getDebugDisplayNames,
    batchGetSymbolDisplayNames,
    searchSymbolsByDisplayName,
    groupSymbolsByMarket,
    groupSymbolsBySubmarket
} from '../displayNameUtils';

describe('displayNameUtils', () => {
    describe('getSymbolDisplayName', () => {
        it('should return display name for known symbol', () => {
            const result = getSymbolDisplayName('R_10');
            expect(result).to.equal('Volatility 10 Index');
        });

        it('should return formatted name for unknown symbol', () => {
            const result = getSymbolDisplayName('test_symbol');
            expect(result).to.equal('Test Symbol');
        });

        it('should handle empty string', () => {
            const result = getSymbolDisplayName('');
            expect(result).to.equal('');
        });

        it('should respect fallback options', () => {
            const result = getSymbolDisplayName('unknown_symbol', { fallbackToFormatted: false });
            expect(result).to.equal('unknown_symbol');
        });
    });

    describe('getMarketDisplayName', () => {
        it('should return display name for known market', () => {
            const result = getMarketDisplayName('forex');
            expect(result).to.equal('Forex');
        });

        it('should return formatted name for unknown market', () => {
            const result = getMarketDisplayName('test_market');
            expect(result).to.equal('Test Market');
        });

        it('should handle empty string', () => {
            const result = getMarketDisplayName('');
            expect(result).to.equal('');
        });
    });

    describe('getSubmarketDisplayName', () => {
        it('should return display name for known submarket', () => {
            const result = getSubmarketDisplayName('major_pairs');
            expect(result).to.equal('Major Pairs');
        });

        it('should return formatted name for unknown submarket', () => {
            const result = getSubmarketDisplayName('test_submarket');
            expect(result).to.equal('Test Submarket');
        });
    });

    describe('getSubgroupDisplayName', () => {
        it('should return display name for known subgroup', () => {
            const result = getSubgroupDisplayName('synthetics');
            expect(result).to.equal('Synthetics');
        });

        it('should return empty string for hidden categories', () => {
            const result = getSubgroupDisplayName('none');
            expect(result).to.equal('');
        });

        it('should return formatted name for unknown subgroup', () => {
            const result = getSubgroupDisplayName('test_subgroup');
            expect(result).to.equal('Test Subgroup');
        });
    });

    describe('formatRawValue', () => {
        it('should format underscores to spaces and title case', () => {
            const result = formatRawValue('test_raw_value');
            expect(result).to.equal('Test Raw Value');
        });

        it('should format hyphens to spaces and title case', () => {
            const result = formatRawValue('test-raw-value');
            expect(result).to.equal('Test Raw Value');
        });

        it('should handle empty string', () => {
            const result = formatRawValue('');
            expect(result).to.equal('');
        });

        it('should clean up extra spaces', () => {
            const result = formatRawValue('test__double__underscore');
            expect(result).to.equal('Test Double Underscore');
        });
    });

    describe('getSymbolDisplayNames', () => {
        it('should return all display names for a symbol object', () => {
            const symbol = {
                symbol: 'R_10',
                market: 'synthetic_index',
                submarket: 'continuous_indices',
                subgroup: 'synthetics'
            };
            
            const result = getSymbolDisplayNames(symbol);
            
            expect(result.symbolDisplayName).to.equal('Volatility 10 Index');
            expect(result.marketDisplayName).to.equal('Synthetic Indices');
            expect(result.submarketDisplayName).to.equal('Continuous Indices');
            expect(result.subgroupDisplayName).to.equal('Synthetics');
        });

        it('should handle partial symbol object', () => {
            const symbol = {
                symbol: 'R_10',
                market: 'synthetic_index'
            };
            
            const result = getSymbolDisplayNames(symbol);
            
            expect(result.symbolDisplayName).to.equal('Volatility 10 Index');
            expect(result.marketDisplayName).to.equal('Synthetic Indices');
            expect(result.submarketDisplayName).to.equal('');
            expect(result.subgroupDisplayName).to.equal('');
        });
    });

    describe('getSymbolCategoryPath', () => {
        it('should return full category path', () => {
            const symbol = {
                market: 'synthetic_index',
                submarket: 'continuous_indices',
                subgroup: 'synthetics'
            };
            
            const result = getSymbolCategoryPath(symbol);
            expect(result).to.equal('Synthetic Indices > Continuous Indices > Synthetics');
        });

        it('should skip hidden subgroups', () => {
            const symbol = {
                market: 'forex',
                submarket: 'major_pairs',
                subgroup: 'none'
            };
            
            const result = getSymbolCategoryPath(symbol);
            expect(result).to.equal('Forex > Major Pairs');
        });

        it('should handle partial paths', () => {
            const symbol = {
                market: 'forex'
            };
            
            const result = getSymbolCategoryPath(symbol);
            expect(result).to.equal('Forex');
        });
    });

    describe('getShortCategoryPath', () => {
        it('should return market and submarket path', () => {
            const symbol = {
                market: 'forex',
                submarket: 'major_pairs'
            };
            
            const result = getShortCategoryPath(symbol);
            expect(result).to.equal('Forex > Major Pairs');
        });

        it('should handle market only', () => {
            const symbol = {
                market: 'forex'
            };
            
            const result = getShortCategoryPath(symbol);
            expect(result).to.equal('Forex');
        });
    });

    describe('shouldHideSymbol', () => {
        it('should return true for symbols with hidden subgroups', () => {
            const symbol = {
                market: 'forex',
                submarket: 'major_pairs',
                subgroup: 'none'
            };
            
            const result = shouldHideSymbol(symbol);
            expect(result).to.be.true;
        });

        it('should return false for symbols with visible subgroups', () => {
            const symbol = {
                market: 'synthetic_index',
                submarket: 'continuous_indices',
                subgroup: 'synthetics'
            };
            
            const result = shouldHideSymbol(symbol);
            expect(result).to.be.false;
        });

        it('should return false for symbols without subgroups', () => {
            const symbol = {
                market: 'forex',
                submarket: 'major_pairs'
            };
            
            const result = shouldHideSymbol(symbol);
            expect(result).to.be.false;
        });
    });

    describe('getCachedDisplayNames', () => {
        it('should return display names with caching enabled', () => {
            const symbol = {
                symbol: 'R_10',
                market: 'synthetic_index'
            };
            
            const result = getCachedDisplayNames(symbol);
            
            expect(result.symbolDisplayName).to.equal('Volatility 10 Index');
            expect(result.marketDisplayName).to.equal('Synthetic Indices');
        });
    });

    describe('getDebugDisplayNames', () => {
        it('should return display names with logging enabled', () => {
            const originalWarn = console.warn;
            let loggedMessage = '';
            console.warn = (message: string) => { loggedMessage = message; };
            
            const symbol = {
                symbol: 'UNKNOWN_SYMBOL',
                market: 'synthetic_index'
            };
            
            const result = getDebugDisplayNames(symbol);
            
            expect(result.symbolDisplayName).to.equal('Unknown Symbol');
            expect(result.marketDisplayName).to.equal('Synthetic Indices');
            expect(loggedMessage).to.include('Missing symbol display name mapping');
            
            console.warn = originalWarn;
        });
    });

    describe('batchGetSymbolDisplayNames', () => {
        it('should return display names for multiple symbols', () => {
            const symbols = [
                { symbol: 'R_10', market: 'synthetic_index' },
                { symbol: 'R_25', market: 'synthetic_index' }
            ];
            
            const result = batchGetSymbolDisplayNames(symbols);
            
            expect(result).to.have.length(2);
            expect(result[0].symbolDisplayName).to.equal('Volatility 10 Index');
            expect(result[1].symbolDisplayName).to.equal('Volatility 25 Index');
        });

        it('should handle empty array', () => {
            const result = batchGetSymbolDisplayNames([]);
            expect(result).to.be.an('array').that.is.empty;
        });
    });

    describe('searchSymbolsByDisplayName', () => {
        it('should find symbols by display name match', () => {
            const symbols = [
                { symbol: 'R_10' },
                { symbol: 'R_25' },
                { symbol: 'EURUSD' }
            ];
            
            const results = searchSymbolsByDisplayName(symbols, 'volatility');
            expect(results).to.have.length(2);
            expect(results.some(r => r.symbol === 'R_10')).to.be.true;
            expect(results.some(r => r.symbol === 'R_25')).to.be.true;
        });

        it('should return all symbols for empty search term', () => {
            const symbols = [
                { symbol: 'R_10' },
                { symbol: 'R_25' }
            ];
            
            const results = searchSymbolsByDisplayName(symbols, '');
            expect(results).to.have.length(2);
        });

        it('should be case insensitive', () => {
            const symbols = [{ symbol: 'R_10' }];
            const results = searchSymbolsByDisplayName(symbols, 'VOLATILITY');
            expect(results).to.have.length(1);
        });
    });

    describe('groupSymbolsByMarket', () => {
        it('should group symbols by market display name', () => {
            const symbols = [
                { symbol: 'R_10', market: 'synthetic_index' },
                { symbol: 'R_25', market: 'synthetic_index' },
                { symbol: 'EURUSD', market: 'forex' }
            ];
            
            const grouped = groupSymbolsByMarket(symbols);
            
            expect(grouped).to.be.an('object');
            expect(grouped['Synthetic Indices']).to.have.length(2);
            expect(grouped['Forex']).to.have.length(1);
        });

        it('should handle empty array', () => {
            const grouped = groupSymbolsByMarket([]);
            expect(grouped).to.be.an('object');
            expect(Object.keys(grouped)).to.have.length(0);
        });
    });

    describe('groupSymbolsBySubmarket', () => {
        it('should group symbols by submarket display name', () => {
            const symbols = [
                { symbol: 'R_10', submarket: 'continuous_indices' },
                { symbol: 'R_25', submarket: 'continuous_indices' },
                { symbol: 'EURUSD', submarket: 'major_pairs' }
            ];
            
            const grouped = groupSymbolsBySubmarket(symbols);
            
            expect(grouped).to.be.an('object');
            expect(grouped['Continuous Indices']).to.have.length(2);
            expect(grouped['Major Pairs']).to.have.length(1);
        });

        it('should handle symbols without submarket', () => {
            const symbols = [
                { symbol: 'R_10', submarket: 'continuous_indices' },
                { symbol: 'TEST' }
            ];
            
            const grouped = groupSymbolsBySubmarket(symbols);
            
            expect(grouped['Continuous Indices']).to.have.length(1);
            expect(Object.keys(grouped)).to.have.length(1);
        });
    });
});