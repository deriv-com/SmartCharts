import { expect } from 'chai';
import { 
    DISPLAY_NAME_MAPPINGS, 
    DEFAULT_DISPLAY_NAME_OPTIONS, 
    HIDDEN_CATEGORIES, 
    FORMATTING_RULES 
} from '../displayNames';

describe('Display Name Configuration', () => {
    describe('DISPLAY_NAME_MAPPINGS structure validation', () => {
        it('should have all required top-level properties', () => {
            expect(DISPLAY_NAME_MAPPINGS).to.have.property('symbols');
            expect(DISPLAY_NAME_MAPPINGS).to.have.property('markets');
            expect(DISPLAY_NAME_MAPPINGS).to.have.property('submarkets');
            expect(DISPLAY_NAME_MAPPINGS).to.have.property('subgroups');
        });

        it('should have symbols as an object', () => {
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.be.an('object');
            expect(Object.keys(DISPLAY_NAME_MAPPINGS.symbols).length).to.be.greaterThan(0);
        });

        it('should have markets as an object', () => {
            expect(DISPLAY_NAME_MAPPINGS.markets).to.be.an('object');
            expect(Object.keys(DISPLAY_NAME_MAPPINGS.markets).length).to.be.greaterThan(0);
        });

        it('should have submarkets as an object', () => {
            expect(DISPLAY_NAME_MAPPINGS.submarkets).to.be.an('object');
            expect(Object.keys(DISPLAY_NAME_MAPPINGS.submarkets).length).to.be.greaterThan(0);
        });

        it('should have subgroups as an object', () => {
            expect(DISPLAY_NAME_MAPPINGS.subgroups).to.be.an('object');
            expect(Object.keys(DISPLAY_NAME_MAPPINGS.subgroups).length).to.be.greaterThan(0);
        });
    });

    describe('symbol mappings', () => {
        it('should contain volatility indices', () => {
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('R_10');
            expect(DISPLAY_NAME_MAPPINGS.symbols['R_10']).to.equal('Volatility 10 Index');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('R_25');
            expect(DISPLAY_NAME_MAPPINGS.symbols['R_25']).to.equal('Volatility 25 Index');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('R_50');
            expect(DISPLAY_NAME_MAPPINGS.symbols['R_50']).to.equal('Volatility 50 Index');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('R_75');
            expect(DISPLAY_NAME_MAPPINGS.symbols['R_75']).to.equal('Volatility 75 Index');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('R_100');
            expect(DISPLAY_NAME_MAPPINGS.symbols['R_100']).to.equal('Volatility 100 Index');
        });

        it('should contain step indices', () => {
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('stpRNG');
            expect(DISPLAY_NAME_MAPPINGS.symbols['stpRNG']).to.equal('Step Index');
        });

        it('should contain boom and crash indices', () => {
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('BOOM1000');
            expect(DISPLAY_NAME_MAPPINGS.symbols['BOOM1000']).to.equal('Boom 1000 Index');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('CRASH1000');
            expect(DISPLAY_NAME_MAPPINGS.symbols['CRASH1000']).to.equal('Crash 1000 Index');
        });

        it('should contain major forex pairs', () => {
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('frxEURUSD');
            expect(DISPLAY_NAME_MAPPINGS.symbols['frxEURUSD']).to.equal('EUR/USD');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('frxGBPUSD');
            expect(DISPLAY_NAME_MAPPINGS.symbols['frxGBPUSD']).to.equal('GBP/USD');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('frxUSDJPY');
            expect(DISPLAY_NAME_MAPPINGS.symbols['frxUSDJPY']).to.equal('USD/JPY');
        });

        it('should contain cryptocurrencies', () => {
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('cryBTCUSD');
            expect(DISPLAY_NAME_MAPPINGS.symbols['cryBTCUSD']).to.equal('Bitcoin');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('cryETHUSD');
            expect(DISPLAY_NAME_MAPPINGS.symbols['cryETHUSD']).to.equal('Ethereum');
        });

        it('should contain commodities', () => {
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('frxXAUUSD');
            expect(DISPLAY_NAME_MAPPINGS.symbols['frxXAUUSD']).to.equal('Gold/USD');
            
            expect(DISPLAY_NAME_MAPPINGS.symbols).to.have.property('frxXAGUSD');
            expect(DISPLAY_NAME_MAPPINGS.symbols['frxXAGUSD']).to.equal('Silver/USD');
        });

        it('should have all symbol values as non-empty strings', () => {
            Object.entries(DISPLAY_NAME_MAPPINGS.symbols).forEach(([key, value]) => {
                expect(key).to.be.a('string').that.is.not.empty;
                expect(value).to.be.a('string').that.is.not.empty;
            });
        });
    });

    describe('market mappings', () => {
        it('should contain major markets', () => {
            expect(DISPLAY_NAME_MAPPINGS.markets).to.have.property('forex');
            expect(DISPLAY_NAME_MAPPINGS.markets['forex']).to.equal('Forex');
            
            expect(DISPLAY_NAME_MAPPINGS.markets).to.have.property('synthetic_index');
            expect(DISPLAY_NAME_MAPPINGS.markets['synthetic_index']).to.equal('Derived');
            
            expect(DISPLAY_NAME_MAPPINGS.markets).to.have.property('commodities');
            expect(DISPLAY_NAME_MAPPINGS.markets['commodities']).to.equal('Commodities');
            
            expect(DISPLAY_NAME_MAPPINGS.markets).to.have.property('indices');
            expect(DISPLAY_NAME_MAPPINGS.markets['indices']).to.equal('Stock Indices');
            
            expect(DISPLAY_NAME_MAPPINGS.markets).to.have.property('cryptocurrency');
            expect(DISPLAY_NAME_MAPPINGS.markets['cryptocurrency']).to.equal('Cryptocurrencies');
        });

        it('should have all market values as non-empty strings', () => {
            Object.entries(DISPLAY_NAME_MAPPINGS.markets).forEach(([key, value]) => {
                expect(key).to.be.a('string').that.is.not.empty;
                expect(value).to.be.a('string').that.is.not.empty;
            });
        });
    });

    describe('submarket mappings', () => {
        it('should contain forex submarkets', () => {
            expect(DISPLAY_NAME_MAPPINGS.submarkets).to.have.property('major_pairs');
            expect(DISPLAY_NAME_MAPPINGS.submarkets['major_pairs']).to.equal('Major Pairs');
            
            expect(DISPLAY_NAME_MAPPINGS.submarkets).to.have.property('minor_pairs');
            expect(DISPLAY_NAME_MAPPINGS.submarkets['minor_pairs']).to.equal('Minor Pairs');
            
            expect(DISPLAY_NAME_MAPPINGS.submarkets).to.have.property('exotic_pairs');
            expect(DISPLAY_NAME_MAPPINGS.submarkets['exotic_pairs']).to.equal('Exotic Pairs');
        });

        it('should contain synthetic index submarkets', () => {
            expect(DISPLAY_NAME_MAPPINGS.submarkets).to.have.property('continuous_indices');
            expect(DISPLAY_NAME_MAPPINGS.submarkets['continuous_indices']).to.equal('Continuous Indices');
            
            expect(DISPLAY_NAME_MAPPINGS.submarkets).to.have.property('daily_reset_indices');
            expect(DISPLAY_NAME_MAPPINGS.submarkets['daily_reset_indices']).to.equal('Daily Reset Indices');
            
            expect(DISPLAY_NAME_MAPPINGS.submarkets).to.have.property('crash_boom');
            expect(DISPLAY_NAME_MAPPINGS.submarkets['crash_boom']).to.equal('Crash/Boom');
        });

        it('should have all submarket values as non-empty strings', () => {
            Object.entries(DISPLAY_NAME_MAPPINGS.submarkets).forEach(([key, value]) => {
                expect(key).to.be.a('string').that.is.not.empty;
                expect(value).to.be.a('string').that.is.not.empty;
            });
        });
    });

    describe('subgroup mappings', () => {
        it('should contain major subgroups', () => {
            expect(DISPLAY_NAME_MAPPINGS.subgroups).to.have.property('forex');
            expect(DISPLAY_NAME_MAPPINGS.subgroups['forex']).to.equal('Forex');
            
            expect(DISPLAY_NAME_MAPPINGS.subgroups).to.have.property('indices');
            expect(DISPLAY_NAME_MAPPINGS.subgroups['indices']).to.equal('Indices');
            
            expect(DISPLAY_NAME_MAPPINGS.subgroups).to.have.property('commodities');
            expect(DISPLAY_NAME_MAPPINGS.subgroups['commodities']).to.equal('Commodities');
            
            expect(DISPLAY_NAME_MAPPINGS.subgroups).to.have.property('cryptocurrencies');
            expect(DISPLAY_NAME_MAPPINGS.subgroups['cryptocurrencies']).to.equal('Cryptocurrencies');
        });

        it('should have hidden category for none', () => {
            expect(DISPLAY_NAME_MAPPINGS.subgroups).to.have.property('none');
            expect(DISPLAY_NAME_MAPPINGS.subgroups['none']).to.equal('');
        });

        it('should have all subgroup keys as non-empty strings', () => {
            Object.entries(DISPLAY_NAME_MAPPINGS.subgroups).forEach(([key, value]) => {
                expect(key).to.be.a('string').that.is.not.empty;
                expect(value).to.be.a('string'); // Value can be empty for hidden categories
            });
        });
    });

    describe('DEFAULT_DISPLAY_NAME_OPTIONS', () => {
        it('should have expected default options', () => {
            expect(DEFAULT_DISPLAY_NAME_OPTIONS).to.have.property('fallbackToFormatted');
            expect(DEFAULT_DISPLAY_NAME_OPTIONS.fallbackToFormatted).to.be.true;
            
            expect(DEFAULT_DISPLAY_NAME_OPTIONS).to.have.property('logMissing');
            expect(DEFAULT_DISPLAY_NAME_OPTIONS.logMissing).to.be.true;
            
            expect(DEFAULT_DISPLAY_NAME_OPTIONS).to.have.property('cacheResults');
            expect(DEFAULT_DISPLAY_NAME_OPTIONS.cacheResults).to.be.true;
        });
    });

    describe('HIDDEN_CATEGORIES', () => {
        it('should be a Set', () => {
            expect(HIDDEN_CATEGORIES).to.be.instanceOf(Set);
        });

        it('should contain none category', () => {
            expect(HIDDEN_CATEGORIES.has('none')).to.be.true;
        });

        it('should have at least one hidden category', () => {
            expect(HIDDEN_CATEGORIES.size).to.be.greaterThan(0);
        });
    });

    describe('FORMATTING_RULES', () => {
        it('should be an object', () => {
            expect(FORMATTING_RULES).to.be.an('object');
        });

        it('should contain formatting functions', () => {
            expect(FORMATTING_RULES).to.have.property('forex');
            expect(FORMATTING_RULES.forex).to.be.a('function');
            
            expect(FORMATTING_RULES).to.have.property('cryptocurrency');
            expect(FORMATTING_RULES.cryptocurrency).to.be.a('function');
            
            expect(FORMATTING_RULES).to.have.property('indices');
            expect(FORMATTING_RULES.indices).to.be.a('function');
        });

        it('should format forex values correctly', () => {
            const result = FORMATTING_RULES.forex('eurusd');
            expect(result).to.equal('EURUSD');
        });

        it('should format cryptocurrency values correctly', () => {
            const result = FORMATTING_RULES.cryptocurrency('BITCOIN');
            expect(result).to.equal('Bitcoin');
        });

        it('should format indices values correctly', () => {
            const result = FORMATTING_RULES.indices('stock_index');
            expect(result).to.equal('Stock Index');
        });
    });

    describe('data consistency', () => {
        it('should not have duplicate values in symbol mappings', () => {
            const values = Object.values(DISPLAY_NAME_MAPPINGS.symbols);
            const uniqueValues = [...new Set(values)];
            expect(values.length).to.equal(uniqueValues.length);
        });

        it('should not have duplicate values in market mappings', () => {
            const values = Object.values(DISPLAY_NAME_MAPPINGS.markets);
            const uniqueValues = [...new Set(values)];
            expect(values.length).to.equal(uniqueValues.length);
        });

        it('should not have duplicate values in submarket mappings', () => {
            const values = Object.values(DISPLAY_NAME_MAPPINGS.submarkets);
            const uniqueValues = [...new Set(values)];
            expect(values.length).to.equal(uniqueValues.length);
        });

        it('should not have duplicate non-empty values in subgroup mappings', () => {
            const values = Object.values(DISPLAY_NAME_MAPPINGS.subgroups).filter(v => v !== '');
            const uniqueValues = [...new Set(values)];
            expect(values.length).to.equal(uniqueValues.length);
        });
    });

    describe('coverage validation', () => {
        it('should have comprehensive coverage of symbols', () => {
            const symbolCount = Object.keys(DISPLAY_NAME_MAPPINGS.symbols).length;
            expect(symbolCount).to.be.greaterThan(80); // Should have at least 80 symbol mappings
        });

        it('should have reasonable coverage of markets', () => {
            const marketCount = Object.keys(DISPLAY_NAME_MAPPINGS.markets).length;
            expect(marketCount).to.be.greaterThan(8); // Should have at least 8 market mappings
        });

        it('should have comprehensive coverage of submarkets', () => {
            const submarketCount = Object.keys(DISPLAY_NAME_MAPPINGS.submarkets).length;
            expect(submarketCount).to.be.greaterThan(25); // Should have at least 25 submarket mappings
        });

        it('should have reasonable coverage of subgroups', () => {
            const subgroupCount = Object.keys(DISPLAY_NAME_MAPPINGS.subgroups).length;
            expect(subgroupCount).to.be.greaterThan(15); // Should have at least 15 subgroup mappings
        });
    });
});