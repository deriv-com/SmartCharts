import StreamManager from "./stream-manager.js";
import Feed from "./feed.js";
import $ from 'jquery';
import '../js/thirdparty/object-observe';
import '../js/thirdparty/webcomponents-lite.min';
import '../js/thirdparty/perfect-scrollbar.jquery';

import {CIQ} from '../js/chartiq';
// import IScroll from '../js/thirdparty/iscroll';
import '../js/componentUI';
import '../js/components';

const _streamManager = StreamManager.buildFor({
    appId: 1,
    language: 'en',
    endpoint: 'wss://frontend.binaryws.com/websockets/v3',
});

var stxx= new CIQ.ChartEngine({container:$("#chartContainer")[0]});

// connect chart to data
// stxx.attachQuoteFeed(quotefeedSimulator,{refreshInterval:1});
stxx.attachQuoteFeed(new Feed(_streamManager, stxx),{refreshInterval: null});

// used to restore layout on startup
function restoreLayout(stx, cb){
    var datum=CIQ.localStorage.getItem("myChartLayout");
    if(datum===null) return;
    stx.importLayout(JSON.parse(datum), {managePeriodicity:true, cb: cb});
}

//save the chart's layout when the symbol or layout changes
function saveLayout(obj){
    var s=JSON.stringify(obj.stx.exportLayout(true));
    CIQ.localStorageSetItem("myChartLayout", s);
}
stxx.callbacks.layout=saveLayout;
stxx.callbacks.symbolChange=saveLayout;

function startUI(){
    const UIContext=new CIQ.UI.Context(stxx, $("*[cq-context]"));

    UIContext.changeSymbol=function(data){
        var stx=this.stx;
        if(this.loader) this.loader.show();
        data.symbol=data.symbol.toUpperCase(); // set a pretty display version

        var self=this;
        stx.newChart(data, null, null, function(err){
            if(self.loader) self.loader.hide();
        });
    };


    UIContext.setLookupDriver(new CIQ.UI.Lookup.Driver.ChartIQ());

    UIContext.UISymbolLookup=$(".ciq-search cq-lookup")[0];
    UIContext.UISymbolLookup.setCallback(function(context, data){
        context.changeSymbol(data);
    });

    var KeystrokeHub=new CIQ.UI.KeystrokeHub($("body"), UIContext, {cb:CIQ.UI.KeystrokeHub.defaultHotKeys});

    if(UIContext.loader) UIContext.loader.show();
    restoreLayout(stxx, function(){
        if(UIContext.loader) UIContext.loader.hide();
    });

    if(!stxx.chart.symbol){
        UIContext.UISymbolLookup.selectItem({symbol:"R_100"}); // load an initial symbol
    }
}

function resizeScreen(){
    $('#chartContainer').css('height', $('.ciq-chart').height()+'px');
    stxx.resizeChart();
}

window.addEventListener('WebComponentsReady', function(e) {
    startUI();
    resizeScreen();
});

$(window).resize(resizeScreen);
