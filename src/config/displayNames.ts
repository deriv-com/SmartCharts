import { IDisplayNameMappings } from './displayNameTypes';

/**
 * Comprehensive display name mappings for symbols, markets, submarkets, and subgroups
 * This configuration provides human-readable names for all raw API values
 * Updated to match exact user specification
 */

export const DISPLAY_NAME_MAPPINGS: IDisplayNameMappings = {
    // Symbol display names - mapping symbol codes to user-friendly names
    symbols: {
        // Major Pairs
        'frxAUDJPY': 'AUD/JPY',
        'frxAUDUSD': 'AUD/USD',
        'frxEURAUD': 'EUR/AUD',
        'frxEURCAD': 'EUR/CAD',
        'frxEURCHF': 'EUR/CHF',
        'frxEURGBP': 'EUR/GBP',
        'frxEURJPY': 'EUR/JPY',
        'frxEURUSD': 'EUR/USD',
        'frxGBPAUD': 'GBP/AUD',
        'frxGBPJPY': 'GBP/JPY',
        'frxGBPUSD': 'GBP/USD',
        'frxUSDCAD': 'USD/CAD',
        'frxUSDCHF': 'USD/CHF',
        'frxUSDJPY': 'USD/JPY',

        // Minor Pairs
        'frxAUDCAD': 'AUD/CAD',
        'frxAUDCHF': 'AUD/CHF',
        'frxAUDNZD': 'AUD/NZD',
        'frxEURNZD': 'EUR/NZD',
        'frxGBPCAD': 'GBP/CAD',
        'frxGBPCHF': 'GBP/CHF',
        'frxGBPNZD': 'GBP/NZD',
        'frxNZDJPY': 'NZD/JPY',
        'frxNZDUSD': 'NZD/USD',
        'frxUSDMXN': 'USD/MXN',
        'frxUSDPLN': 'USD/PLN',

        // Basket indices
        'WLDXAU': 'Gold Basket',
        'WLDAUD': 'AUD Basket',
        'WLDEUR': 'EUR Basket',
        'WLDGBP': 'GBP Basket',
        'WLDUSD': 'USD Basket',

        // Continuous Indices - Volatility
        'R_10': 'Volatility 10 Index',
        'R_25': 'Volatility 25 Index',
        'R_50': 'Volatility 50 Index',
        'R_75': 'Volatility 75 Index',
        'R_100': 'Volatility 100 Index',
        '1HZ10V': 'Volatility 10 (1s) Index',
        '1HZ25V': 'Volatility 25 (1s) Index',
        '1HZ50V': 'Volatility 50 (1s) Index',
        '1HZ75V': 'Volatility 75 (1s) Index',
        '1HZ100V': 'Volatility 100 (1s) Index',
        '1HZ150V': 'Volatility 150 (1s) Index',
        '1HZ250V': 'Volatility 250 (1s) Index',

        // Crash/Boom Indices
        'BOOM300N': 'Boom 300 Index',
        'BOOM500': 'Boom 500 Index',
        'BOOM600': 'Boom 600 Index',
        'BOOM900': 'Boom 900 Index',
        'BOOM1000': 'Boom 1000 Index',
        'CRASH300N': 'Crash 300 Index',
        'CRASH500': 'Crash 500 Index',
        'CRASH600': 'Crash 600 Index',
        'CRASH900': 'Crash 900 Index',
        'CRASH1000': 'Crash 1000 Index',

        // Daily Reset Indices
        'RDBEAR': 'Bear Market Index',
        'RDBULL': 'Bull Market Index',

        // Jump Indices
        'JD10': 'Jump 10 Index',
        'JD25': 'Jump 25 Index',
        'JD50': 'Jump 50 Index',
        'JD75': 'Jump 75 Index',
        'JD100': 'Jump 100 Index',

        // Step Indices - Updated to match actual API symbols
        'stpRNG': 'Step Index 100',
        'stpRNG2': 'Step Index 200',
        'stpRNG3': 'Step Index 300',
        'stpRNG4': 'Step Index 400',
        'stpRNG5': 'Step Index 500',

        // American indices
        'OTC_SPC': 'US 500',
        'OTC_NDX': 'US Tech 100',
        'OTC_DJI': 'Wall Street 30',

        // Asian indices
        'OTC_AS51': 'Australia 200',
        'OTC_HSI': 'Hong Kong 50',
        'OTC_N225': 'Japan 225',

        // European indices
        'OTC_SX5E': 'Euro 50',
        'OTC_FCHI': 'France 40',
        'OTC_GDAXI': 'Germany 40',
        'OTC_AEX': 'Netherlands 25',
        'OTC_SMI': 'Swiss 20',
        'OTC_FTSE': 'UK 100',

        // Cryptocurrencies
        'cryBTCUSD': 'BTC/USD',
        'cryETHUSD': 'ETH/USD',

        // Metals
        'frxXAUUSD': 'Gold/USD',
        'frxXPDUSD': 'Palladium/USD',
        'frxXPTUSD': 'Platinum/USD',
        'frxXAGUSD': 'Silver/USD',

        // Additional Volatility Indices (1s)
        '1HZ200V': 'Volatility 200 (1s) Index',
        '1HZ300V': 'Volatility 300 (1s) Index',

        // Legacy Step Indices mappings (if needed for backward compatibility)
        'STPIDX100': 'Step Index 100',
        'STPIDX200': 'Step Index 200',
        'STPIDX300': 'Step Index 300',
        'STPIDX400': 'Step Index 400',
        'STPIDX500': 'Step Index 500',

        // Additional Jump Indices
        'JD200': 'Jump 200 Index',
        'JD300': 'Jump 300 Index',

        // Additional Daily Reset Indices
        'RDBEAR10': 'Bear Market 10 Index',
        'RDBULL10': 'Bull Market 10 Index',
        'RDBEAR25': 'Bear Market 25 Index',
        'RDBULL25': 'Bull Market 25 Index',

        // Additional Crash/Boom Indices
        'BOOM250': 'Boom 250 Index',
        'CRASH250': 'Crash 250 Index',

        // Additional Forex pairs
        'frxCADJPY': 'CAD/JPY',
        'frxCHFJPY': 'CHF/JPY',
        'frxCADCHF': 'CAD/CHF',
        'frxNZDCAD': 'NZD/CAD',
        'frxNZDCHF': 'NZD/CHF',

        // Additional Cryptocurrencies
        'cryLTCUSD': 'LTC/USD',
        'cryBCHUSD': 'BCH/USD',
        'cryXRPUSD': 'XRP/USD',
        'cryADAUSD': 'ADA/USD',
        'cryDOTUSD': 'DOT/USD',

        // Additional case variations for Step Indices (if needed)
        'STPRNG': 'Step Index 100',
        'STPRNG2': 'Step Index 200',
        'STPRNG3': 'Step Index 300',
        'STPRNG4': 'Step Index 400',
        'STPRNG5': 'Step Index 500',
    },

    // Market display names
    markets: {
        'forex': 'Forex',
        'indices': 'Stock Indices',
        'stocks': 'Stocks',
        'commodities': 'Commodities',
        'cryptocurrency': 'Cryptocurrencies',
        'synthetic_index': 'Derived',
        'basket_index': 'Baskets',
        'energy': 'Energy',
        'metals': 'Metals',
        'agricultural': 'Agricultural',
    },

    // Submarket display names
    submarkets: {
        'major_pairs': 'Major Pairs',
        'minor_pairs': 'Minor Pairs',
        'exotic_pairs': 'Exotic Pairs',
        'smart_fx': 'Smart FX',
        'americas': 'American indices',
        'asia_oceania': 'Asian indices',
        'europe_africa': 'European indices',
        'europe': 'European indices',
        'americas_OTC': 'American indices',
        'asia_oceania_OTC': 'Asian indices',
        'europe_OTC': 'European indices',
        'otc_index': 'OTC Indices',
        'random_index': 'Continuous Indices',
        'random_daily': 'Daily Reset Indices',
        'crash_boom': 'Crash/Boom Indices',
        'crash_index': 'Crash/Boom Indices',
        'jump_index': 'Jump Indices',
        'step_index': 'Step Indices',
        'volatility_indices': 'Volatility Indices',
        'range_break_indices': 'Range Break Indices',
        'forex_basket': 'Forex Basket',
        'commodity_basket': 'Commodities Basket',
        'cryptocurrency_basket': 'Cryptocurrency Basket',
        'energy_basket': 'Energy Basket',
        'precious_metals': 'Precious Metals',
        'base_metals': 'Base Metals',
        'grains': 'Grains',
        'soft_commodities': 'Soft Commodities',
        'livestock': 'Livestock',
        'crypto_usd': 'Cryptocurrencies',
        'non_stable_coin': 'Cryptocurrencies',
        'crypto_non_usd': 'Crypto/Non-USD',
        'us_stocks': 'US Stocks',
        'european_stocks': 'European Stocks',
        'asian_stocks': 'Asian Stocks',
        'metals': 'Metals',
    },

    // Subgroup display names
    subgroups: {
        'none': '',
        'major': 'Major',
        'minor': 'Minor',
        'exotic': 'Exotic',
        'micro': 'Micro',
        'smart': 'Smart',
        'baskets': 'Baskets',
        'commodities_basket': 'Commodities Basket',
        'forex_basket': 'Forex Basket',
        'forex': 'Forex',
        'indices': 'Indices',
        'commodities': 'Commodities',
        'energy': 'Energy',
        'metals': 'Metals',
        'agricultural': 'Agricultural',
        'cryptocurrencies': 'Cryptocurrencies',
        'stocks': 'Stocks',
        'bonds': 'Bonds',
        'etfs': 'ETFs',
        'futures': 'Futures',
        'options': 'Options',
        'cfds': 'CFDs',
        'spread_bets': 'Spread Bets',
        'binary_options': 'Binary Options',
        'multipliers': 'Multipliers',
        'accumulators': 'Accumulators',
        'vanillas': 'Vanillas',
        'turbos': 'Turbos',
        'lookbacks': 'Lookbacks',
        'touch_no_touch': 'Touch/No Touch',
        'ends_between': 'Ends Between/Outside',
        'stays_between': 'Stays Between/Goes Outside',
        'asian_options': 'Asian Options',
        'digits': 'Digits',
        'reset_call_put': 'Reset Call/Put',
        'high_low_ticks': 'High/Low Ticks',
        'only_ups_downs': 'Only Ups/Only Downs',
        'lb_high_low': 'Lookback High/Low',
        'lb_close': 'Lookback Close',
        'run_high_low': 'Run High/Low',
    },

};

/**
 * Default options for display name service
 */
export const DEFAULT_DISPLAY_NAME_OPTIONS = {
    fallbackToFormatted: true,
    logMissing: true,
    cacheResults: true,
};

/**
 * Categories that should be hidden from display (empty string display names)
 */
export const HIDDEN_CATEGORIES = new Set(['none']);

/**
 * Special formatting rules for specific categories
 */
export const FORMATTING_RULES = {
    // Forex pairs should always be uppercase
    forex: (value: string) => value.toUpperCase(),
    // Crypto symbols should have proper casing
    cryptocurrency: (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    // Index names should be title case
    indices: (value: string) => value.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' '),
};