import { expect } from 'chai';
import { DisplayNameService } from '../DisplayNameService';

describe('DisplayNameService', () => {
    let service: DisplayNameService;

    beforeEach(() => {
        service = new DisplayNameService();
        service.clearCache(); // Clear cache before each test
    });

    describe('getSymbolDisplayName', () => {
        it('should return display name for known symbol', () => {
            const result = service.getSymbolDisplayName('R_10');
            expect(result).to.equal('Volatility 10 Index');
        });

        it('should return raw symbol for unknown symbol with fallback disabled', () => {
            const result = service.getSymbolDisplayName('UNKNOWN_SYMBOL', { fallbackToFormatted: false });
            expect(result).to.equal('UNKNOWN_SYMBOL');
        });

        it('should return formatted name for unknown symbol with fallback enabled', () => {
            const result = service.getSymbolDisplayName('test_symbol', { fallbackToFormatted: true });
            expect(result).to.equal('Test Symbol');
        });

        it('should cache results when caching is enabled', () => {
            const options = { cacheResults: true };
            const result1 = service.getSymbolDisplayName('R_10', options);
            const result2 = service.getSymbolDisplayName('R_10', options);
            
            expect(result1).to.equal(result2);
            expect(service.getCacheStats().size).to.be.greaterThan(0);
        });

        it('should log missing mappings when enabled', () => {
            let loggedMessage = '';
            const originalWarn = console.warn;
            console.warn = (message: string) => { loggedMessage = message; };

            service.getSymbolDisplayName('MISSING_SYMBOL', { logMissing: true });
            
            expect(loggedMessage).to.include('Missing symbol display name mapping for: MISSING_SYMBOL');
            console.warn = originalWarn;
        });
    });

    describe('getMarketDisplayName', () => {
        it('should return display name for known market', () => {
            const result = service.getMarketDisplayName('forex');
            expect(result).to.equal('Forex');
        });

        it('should return formatted name for unknown market with fallback', () => {
            const result = service.getMarketDisplayName('test_market', { fallbackToFormatted: true });
            expect(result).to.equal('Test Market');
        });

        it('should apply formatting rules for indices', () => {
            const result = service.getMarketDisplayName('indices', { fallbackToFormatted: true });
            expect(result).to.equal('Stock Indices'); // Should match actual mapping
        });
    });

    describe('getSubmarketDisplayName', () => {
        it('should return display name for known submarket', () => {
            const result = service.getSubmarketDisplayName('major_pairs');
            expect(result).to.equal('Major Pairs');
        });

        it('should return formatted name for unknown submarket', () => {
            const result = service.getSubmarketDisplayName('minor_pairs', { fallbackToFormatted: true });
            expect(result).to.equal('Minor Pairs');
        });
    });

    describe('getSubgroupDisplayName', () => {
        it('should return display name for known subgroup', () => {
            const result = service.getSubgroupDisplayName('synthetics');
            expect(result).to.equal('Synthetics');
        });

        it('should return empty string for hidden categories', () => {
            const result = service.getSubgroupDisplayName('none');
            expect(result).to.equal('');
        });

        it('should return formatted name for unknown subgroup', () => {
            const result = service.getSubgroupDisplayName('test_subgroup', { fallbackToFormatted: true });
            expect(result).to.equal('Test Subgroup');
        });
    });

    describe('formatRawValue', () => {
        it('should format underscores to spaces and title case', () => {
            const result = service.formatRawValue('test_raw_value');
            expect(result).to.equal('Test Raw Value');
        });

        it('should format hyphens to spaces and title case', () => {
            const result = service.formatRawValue('test-raw-value');
            expect(result).to.equal('Test Raw Value');
        });

        it('should handle empty string', () => {
            const result = service.formatRawValue('');
            expect(result).to.equal('');
        });

        it('should clean up extra spaces', () => {
            const result = service.formatRawValue('test__double__underscore');
            expect(result).to.equal('Test Double Underscore');
        });
    });

    describe('addMapping', () => {
        it('should add new symbol mapping', () => {
            service.addMapping('symbol', 'NEW_SYMBOL', 'New Symbol Display Name');
            const result = service.getSymbolDisplayName('NEW_SYMBOL');
            expect(result).to.equal('New Symbol Display Name');
        });

        it('should add new market mapping', () => {
            service.addMapping('market', 'new_market', 'New Market');
            const result = service.getMarketDisplayName('new_market');
            expect(result).to.equal('New Market');
        });

        it('should clear cache when adding mapping', () => {
            service.getSymbolDisplayName('R_10', { cacheResults: true });
            expect(service.getCacheStats().size).to.be.greaterThan(0);
            
            service.addMapping('symbol', 'R_10', 'Updated Name');
            // Cache should be cleared for this specific item
            const result = service.getSymbolDisplayName('R_10');
            expect(result).to.equal('Updated Name');
        });
    });

    describe('batchGetDisplayNames', () => {
        it('should return display names for multiple symbols', () => {
            const codes = ['R_10', 'R_25', 'UNKNOWN'];
            const result = service.batchGetDisplayNames('symbol', codes);
            
            expect(result['R_10']).to.equal('Volatility 10 Index');
            expect(result['R_25']).to.equal('Volatility 25 Index');
            expect(result['UNKNOWN']).to.equal('UNKNOWN');
        });

        it('should return display names for multiple markets', () => {
            const codes = ['forex', 'synthetic_index'];
            const result = service.batchGetDisplayNames('market', codes);
            
            expect(result['forex']).to.equal('Forex');
            expect(result['synthetic_index']).to.equal('Derived');
        });
    });

    describe('hasMapping', () => {
        it('should return true for existing symbol mapping', () => {
            const result = service.hasMapping('symbol', 'R_10');
            expect(result).to.be.true;
        });

        it('should return false for non-existing symbol mapping', () => {
            const result = service.hasMapping('symbol', 'NON_EXISTING');
            expect(result).to.be.false;
        });

        it('should return true for existing market mapping', () => {
            const result = service.hasMapping('market', 'forex');
            expect(result).to.be.true;
        });
    });

    describe('clearCache', () => {
        it('should clear all cached results', () => {
            service.getSymbolDisplayName('R_10', { cacheResults: true });
            expect(service.getCacheStats().size).to.be.greaterThan(0);
            
            service.clearCache();
            expect(service.getCacheStats().size).to.equal(0);
        });
    });

    describe('getMissingMappings', () => {
        it('should track missing mappings when logging is enabled', () => {
            const originalWarn = console.warn;
            console.warn = () => {}; // Suppress console output
            
            service.getSymbolDisplayName('MISSING1', { logMissing: true });
            service.getMarketDisplayName('MISSING2', { logMissing: true });
            
            const missing = service.getMissingMappings();
            expect(missing).to.include('symbol:MISSING1');
            expect(missing).to.include('market:MISSING2');
            
            console.warn = originalWarn;
        });
    });

    describe('getCacheStats', () => {
        it('should return correct cache statistics', () => {
            const originalWarn = console.warn;
            console.warn = () => {}; // Suppress console output
            
            service.getSymbolDisplayName('R_10', { cacheResults: true });
            service.getSymbolDisplayName('MISSING', { logMissing: true });
            
            const stats = service.getCacheStats();
            expect(stats.size).to.equal(1);
            expect(stats.missingCount).to.equal(1);
            
            console.warn = originalWarn;
        });
    });
});