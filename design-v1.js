interface Symbol { // from active_symbols
    "allow_forward_starting": 1,
    "display_name": "Australian Index",
    "exchange_is_open": 1,
    "is_trading_suspended": 0,
    "market": "indices",
    "market_display_name": "Indices",
    "pip": "0.01",
    "submarket": "asia_oceania",
    "submarket_display_name": "Asia/Oceania",
    "symbol": "AS51",
    "symbol_type": "stockindex"
 };

interface ChartExtension {
	mount(chart) { }
	unMount() { }
};

class SymbolSelector extends ChartExtension {
	static get EVENT_CHANGED() { return 'market-change';}
	static get EVENT_OPENED() { }
	static get EVENT_CLOSED() { }

	contructor({
		active_symbols?: Symbol[]
	});
	set symbols(Symbol[]);
	get symbols(): Symbol[];

	set selectedSymbol(symbol: Symbol) { }
	get selectedSymbol() : Symbol { }
	
	get isOpen() : boolean { }
	get query() : string { }
	set query() { }
	
	open() { }
	close() { }
};

// ************** usage ***************
const ms = new MarketSelector();
ms.on(
	MarketSelector.EVENT_CHANGED, 
	({symbol, symbolName}) => {}
);
ms.on(MarketSelector.EVENT_OPENED, () => {
	ms.query = "AUD/";
});

if(ms.isOpen) { ms.close(); };
chart.addExension(ms);
//---------------------------------------
interface ContractType {
	"barrier": "+0.3229",
	"barrier_category": "american",
	"barriers": 1,
	"contract_category": "touchnotouch",
	"contract_category_display": "Touch/No Touch",
	"contract_display": "does not touch",
	"contract_type": "NOTOUCH",
	"exchange_name": "RANDOM",
	"expiry_type": "intraday",
	"market": "volidx",
	"max_contract_duration": "1d",
	"min_contract_duration": "2m",
	"sentiment": "low_vol",
	"start_type": "spot",
	"submarket": "random_index",
	"underlying_symbol": "R_50"
};
class ContractTypeSelector extends ChartExtension {
	static get EVENT_CHANGED() { return 'trade-type-change';}
	static get EVENT_OPENED() { }
	static get EVENT_CLOSED() { }

	contructor({
		symbol_code?: string
	});
	set symbolCode(string) { }
	get symbolCode() : string { }

	get contractTypes() : ContractType[] { }

	set selectedContractType(contractType: ContractType) { }
	get selectedContractType() : ContractType { }
	
	get isOpen() : boolean { }
	
	open() { }
	close() { }
};

//---------------------------------------
class Barrier {
	static get EVENT_CHANGED() { return 'event-barrier-cahnge'; }

	static get SHADE_NONE() { return 0; }
	static get SHADE_UP() { return 1; }
	static get SHADE_DOWN() { return 2; }
	static get SHADE_BETWEEN() { return 2; }
	static get SHADE_OUTSIDE() { return 3; }

	constructor({
		relative = false,
		draggable = false,
		shade = Barrier.SHADE_NONE,
	})

	get value() : number {}
	set value(number) {}
	get value2() : number? {}
	set value2(number?) {}

	get relative() : boolean {}
	set relative() : boolean {}

	get draggable() : boolean {}
	set draggable() : boolean {}

	set shade(number) { }
	get shade() : number { }	
}

// usage
const barrier = new Barrier();
barrier.state = Barrier.STATE_DRAGABBLE;
barrier.on(Barrier.EVENT_CHANGED, b => {
	console.log(b.value, b.value2);
})

class Drawer extends ChartExtension {
	addBarrier(barrier: Barrier) { }
	get barriers() : Barrier[]
};


const chart = BinaryChartiq.addNewChart(...);
const drawer = new Drawer();
chart.addExension(drawer);
chart.removeExtension(drawer);



