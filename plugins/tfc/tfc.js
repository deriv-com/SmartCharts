import { CIQ, $$$ } from '../../js/chartiq';

/**
 * Trade From Chart object (TFC). TFC should be constructed once and associated with an {@link STXChart} (stx)
 * object. It should also be passed a valid {@link CIQ.Account} which can be used for querying and placing orders.
 * The TFC object creates and manages a number of DOM elements which are located in tfc.html.
 *
 * See {@link CIQ.Account} for account data format and loading guidance.
 *
 * See {@tutorial Trade From Chart introduction} for implementation details.
 *
 * @constructor
 * @param {object} config Configuration object
 * @param {object} config.stx     The chart object to enable TFC.
 * @param {object} config.account Valid CIQ.Account object for querying brokerage and placing trades
 * @param {object} [config.chart]   The specific chart (panel) for trading componentry. Defaults to the default chart.
 */
CIQ.TFC = function (config) {
    this.stx = config.stx;
    this.chart = config.chart || config.stx.chart;
    this.construct(config);
    CIQ.I18N.translateUI();
};

/**
 * Holds references to the top level DOM elements that are used with TFC. These elements
 * are appended to the chart container in CIQ.TFC.prototype.construct.
 * @type {Object}
 * @property {HTMLElement} dragLineAbove The draggable line that is above the price (stop or limit)
 * @property {HTMLElement} dragLineCenter The draggable line at the center of a limit/stop order
 * @property {HTMLElement} dragLineBelow The draggable line that is below the price (stop or limit)
 * @property {HTMLElement} limitOrder The limit/stop order widget
 * @property {HTMLElement} otoAbove The OTO widget above the dragLineAbove
 * @property {HTMLElement} otoBelow The OTO widget below the dragLineBelow
 * @property {HTMLElement} ocoOrder The OCO order widget (located below the ocoBelow)
 * @property {HTMLElement} ocoAbove The OCO widget that is the above line
 * @property {HTMLElement} ocoBelow The OCO widget that is the below line
 * @property {HTMLElement} shadeAbove Shading above an OCO
 * @property {HTMLElement} shadeBelow Shading below an OCO
 */
CIQ.TFC.prototype.dom = {
    dragLineAbove: null,
    dragLineCenter: null,
    dragLineBelow: null,
    limitOrder: null,
    otoAbove: null,
    otoBelow: null,
    ocoOrder: null,
    ocoAbove: null,
    ocoBelow: null,
    shadeAbove: null,
    shadeBelow: null,
};


/**
 * Contains references to each type of action. For each action a menu item is specified as "node".
 * The dom array should contain each of the TFC components that are to be enabled for that type of order
 * @type {Object}
 */
CIQ.TFC.prototype.menu = {
    enableShort: { nodes: [], dom: ['limitOrder', 'dragLineCenter'] },
    enableStraddle: { nodes: [], dom: ['ocoOrder', 'ocoAbove', 'ocoBelow', 'dragLineAbove', 'dragLineBelow', 'shadeAbove', 'shadeBelow'] },
    enableStrangle: { nodes: [], dom: ['ocoOrder', 'ocoAbove', 'ocoBelow', 'dragLineAbove', 'dragLineBelow', 'shadeAbove', 'shadeBelow'] },
};

/**
 * Contains references to all of the individual HTML elements that may need to be referenced. Each of these
 * elements would be a sub element of one of the top level elements contained in CIQ.TFC.prototype.dom.
 * @type {Object}
 */
CIQ.TFC.prototype.elements = { };

CIQ.TFC.prototype.isMobileMode = function () {
    return $('.break-sm').length > 0;
};

/**
 * Positions nodes at the given price.
 * @param  {number} price       The price (relative to the y-axis)
 * @param  {array} nodes       An array of nodes to move to the desired location
 * @param  {string} [where]       If either "top" or "bottom", then the node will not be allowed to overlap the noOverlap nodes
 * @param  {array} [noOverlap]   An array of nodes which cannot be overlapped
 * @param  {boolean} [keepOnChart] If true then the nodes will not be allowed to move off the chart
 */
CIQ.TFC.prototype.positionAtPrice = function (price, nodes, where, noOverlap, keepOnChart) {
    if (!where) where = 'center';
    let px = this.locationFromPrice(price),
        node;
    for (let i = 0; i < nodes.length; i++) {
        let nodeName = nodes[i];
        if (typeof nodeName === 'string') {
            node = this.dom[nodeName];
        } else {
            node = nodeName;
        }
        let top = null;
        var j,
            oNode;
        if (where == 'center') {
            top = (px - (node.offsetHeight / 2));
        } else if (where == 'top') {
            if (noOverlap) {
                for (j = 0; j < noOverlap.length; j++) {
                    oNode = this.dom[noOverlap[j]];
                    let bottom = CIQ.stripPX(oNode.style.top) + oNode.offsetHeight;
                    if (bottom > px) px = bottom;
                }
            }
            top = Math.round(px) + 1;
        } else if (where == 'bottom') {
            if (noOverlap) {
                for (j = 0; j < noOverlap.length; j++) {
                    oNode = this.dom[noOverlap[j]];
                    top = CIQ.stripPX(oNode.style.top);
                    if (px > top) px = top;
                }
            }
            top = Math.round(px - node.offsetHeight);
        }
        node.removeAttribute('uncentered');
        node.removeAttribute('off-screen');
        if (keepOnChart) {
            if (top < 0) {
                node.setAttribute('uncentered', true);
                if (top < node.offsetHeight / 2 * -1) { node.setAttribute('off-screen', true); }
                top = 0;
            } else if (top + node.offsetHeight > this.chart.panel.height) {
                node.setAttribute('uncentered', true);
                if ((top + node.offsetHeight) - this.chart.panel.height > node.offsetHeight / 2) { node.setAttribute('off-screen', true); }
                top = this.chart.panel.height - node.offsetHeight;
            }
        }
        if (top !== null) node.style.top = `${top}px`;
    }
};

/**
 * Adjust price to ensure it is within the stx.chart.yAxis.minimumPriceTick range
 * param {number} price The price to snap to the closest minimumPriceTick.
 * @return {number} adjusted price conforming to minimumPriceTick
 * @since 16-04-01
 */
CIQ.TFC.prototype.snapPrice = function (price) {
    // snap the limit price to the desired interval if one defined
    let minTick = this.stx.chart.yAxis.minimumPriceTick;
    if (!minTick) minTick = 0.00000001; // maximum # places
    if (minTick) {
        let numToRoundTo = 1 / minTick;
        price = Math.round(price * numToRoundTo) / numToRoundTo;
    }

    return price;
};

CIQ.TFC.prototype.enableShort = function () {
    let which = this.menu.enableShort;
    for (let i = 0; i < which.dom.length; i++) {
        let tradeElementName = which.dom[i];
        this.dom[tradeElementName].style.display = '';
    }
    this.activeTrade = 'short';
    CIQ.swapClassName(this.dom.dragLineAbove, 'green', 'red');
    CIQ.swapClassName(this.dom.dragLineBelow, 'green', 'red');
    CIQ.swapClassName(this.dom.dragLineCenter, 'red', 'green');
    CIQ.unappendClassName(this.dom.limitOrder, 'new-cover-order');
    CIQ.unappendClassName(this.dom.limitOrder, 'new-sell-order');
    CIQ.unappendClassName(this.dom.limitOrder, 'new-buy-order');
    CIQ.appendClassName(this.dom.limitOrder, 'new-short-order');

    CIQ.unappendClassName(this.dom.limitOrder, 'with-stop');
    CIQ.unappendClassName(this.dom.limitOrder, 'with-limit');
    this.centerPrice = this.stx.currentQuote().Close;
    this.positionAtPrice(this.centerPrice, ['limitOrder', 'dragLineCenter']);
    this.elements.dragLineCenterPrice.innerHTML = this.formatPrice(this.centerPrice);

};

/**
 * Enable a straddle order. A straddle is, specifically, an OCO (one cancels the other) to *open* a position. The goal of the straddle is to
 * capture a breakout from a presumed trading range. The resulting position may be either long or short.
 */
CIQ.TFC.prototype.enableStraddle = function () {
    let which = this.menu.enableStraddle;
    for (let i = 0; i < which.dom.length; i++) {
        let tradeElementName = which.dom[i];
        this.dom[tradeElementName].style.display = '';
    }
    this.activeTrade = 'straddle';
    CIQ.swapClassName(this.dom.dragLineAbove, 'green', 'red');
    CIQ.swapClassName(this.dom.dragLineBelow, 'green', 'red');
    CIQ.unappendClassName(this.dom.shadeAbove, 'tfc-neutral');
    CIQ.unappendClassName(this.dom.shadeBelow, 'tfc-neutral');
    CIQ.swapClassName(this.dom.shadeAbove, 'tfc-profit', 'tfc-loss');
    CIQ.swapClassName(this.dom.shadeBelow, 'tfc-profit', 'tfc-loss');
    this.elements.ocoAboveHead.innerHTML = 'Buy Stop';
    this.elements.ocoBelowHead.innerHTML = 'Sell Stop';
    this.centerPrice = this.stx.currentQuote().Close;
    let y = this.stx.pixelFromPriceTransform(this.centerPrice, this.chart.panel);
    this.positionAboveLine(this.stx.valueFromPixelUntransform(y - 50, this.chart.panel));
    this.positionBelowLine(this.stx.valueFromPixelUntransform(y + 50, this.chart.panel));
    this.render();
};

/**
 * Enable a strangle order. A strangle is, specifically, an OCO (one cancels the other) to *open* a position. The goal of the straddle is to
 * profit when a security bounces within a presumed trading range. The resulting position may be either long or short.
 */
CIQ.TFC.prototype.enableStrangle = function () {
    let which = this.menu.enableStrangle;
    for (let i = 0; i < which.dom.length; i++) {
        let tradeElementName = which.dom[i];
        this.dom[tradeElementName].style.display = '';
    }
    this.activeTrade = 'strangle';
    CIQ.swapClassName(this.dom.dragLineAbove, 'red', 'green');
    CIQ.swapClassName(this.dom.dragLineBelow, 'red', 'green');
    CIQ.unappendClassName(this.dom.shadeAbove, 'tfc-neutral');
    CIQ.unappendClassName(this.dom.shadeBelow, 'tfc-neutral');
    CIQ.swapClassName(this.dom.shadeAbove, 'tfc-loss', 'tfc-profit');
    CIQ.swapClassName(this.dom.shadeBelow, 'tfc-loss', 'tfc-profit');
    this.elements.ocoAboveHead.innerHTML = 'Sell Limit';
    this.elements.ocoBelowHead.innerHTML = 'Buy Limit';
    this.centerPrice = this.stx.currentQuote().Close;
    let y = this.stx.pixelFromPriceTransform(this.centerPrice, this.chart.panel);
    this.positionAboveLine(this.stx.valueFromPixelUntransform(y - 50, this.chart.panel));
    this.positionBelowLine(this.stx.valueFromPixelUntransform(y + 50, this.chart.panel));
    this.render();
};


/**
 * Removes the OTO order (stop or limit) that is above the buy/short order.
 */
CIQ.TFC.prototype.removeOTOAbove = function () {
    this.dom.otoAbove.style.display = 'none';
    this.dom.dragLineAbove.style.display = 'none';
    if (this.activeTrade == 'buy') {
        CIQ.unappendClassName(this.dom.limitOrder, 'with-limit');
    } else if (this.activeTrade == 'short') {
        CIQ.unappendClassName(this.dom.limitOrder, 'with-stop');
    } else if (this.activeTrade == 'bracket_sell' || this.activeTrade == 'bracket_cover') {
        if (this.dom.otoBelow.style.display == 'none') this.closeTFC();
    }
};


/**
 * Removes the OTO order that is below the buy/short order.
 */
CIQ.TFC.prototype.removeOTOBelow = function () {
    this.dom.otoBelow.style.display = 'none';
    this.dom.dragLineBelow.style.display = 'none';
    if (this.activeTrade == 'buy') {
        CIQ.unappendClassName(this.dom.limitOrder, 'with-stop');
    } else if (this.activeTrade == 'short') {
        CIQ.unappendClassName(this.dom.limitOrder, 'with-limit');
    } else if (this.activeTrade == 'bracket_sell' || this.activeTrade == 'bracket_cover') {
        if (this.dom.otoAbove.style.display == 'none') this.closeTFC();
    }
};


/**
 * Positions the center line at the requested price. The center line is the line that runs through the middle of a buy,sell,short,cover widget and
 * represents the limit or stop price for the trade.
 * @param  {number} price The price to set the center line
 * @param {boolean} [keepOnChart=true] Optional prevent the node from being displayed off the chart
 */
CIQ.TFC.prototype.positionCenterLine = function (price, keepOnChart) {
    if (keepOnChart !== false) keepOnChart = true;
    this.centerPrice = price;
    this.positionAtPrice(this.centerPrice, ['limitOrder', 'dragLineCenter'], 'center', null, keepOnChart);
    this.elements.dragLineCenterPrice.innerHTML = this.formatPrice(this.centerPrice);
    this.positionBelowLine(Math.min(this.centerPrice, this.belowPrice));
    this.positionAboveLine(Math.max(this.centerPrice, this.abovePrice));
};

/**
 * Positions the "above line" which is the top line in an OCO or OTO order. For OTO orders, it is made sure that the above element does not
 * overlap the order element, but does allow the above line to slide underneath.
 * @param  {number} price The price to set the above line
 */
CIQ.TFC.prototype.positionAboveLine = function (price, keepOnChart) {
    if (keepOnChart !== false) keepOnChart = true;
    if (isNaN(price)) return;
    this.abovePrice = this.snapPrice(price);
    if (this.abovePrice < this.centerPrice) this.abovePrice = this.centerPrice;
    this.positionAtPrice(this.abovePrice, ['dragLineAbove'], 'center', null, keepOnChart);
    this.elements.dragLineAbovePrice.innerHTML = this.formatPrice(this.abovePrice);
    if (this.activeTrade == 'short' || this.activeTrade == 'buy') {
        this.positionAtPrice(this.abovePrice, ['otoAbove'], 'bottom', ['limitOrder'], keepOnChart);
    } else if (this.activeTrade == 'strangle' || this.activeTrade == 'straddle') {
        this.positionAtPrice(this.abovePrice, ['ocoAbove'], 'bottom', null, keepOnChart);
    } else if (this.activeTrade == 'bracket_sell') {
        this.positionAtPrice(this.abovePrice, ['otoAbove'], 'bottom', null, keepOnChart);
    } else if (this.activeTrade == 'bracket_cover') {
        this.positionAtPrice(this.abovePrice, ['otoAbove'], 'bottom', null, keepOnChart);
    }
};

/**
 * Positions the "below line" which is the bottom line in an OCO or OTO order. For OTO orders, it is made sure that the below element does not
 * overlap the order element, but does allow the below line to slide underneath.
 * @param  {number} price The price to set the below line
 */
CIQ.TFC.prototype.positionBelowLine = function (price, keepOnChart) {
    if (keepOnChart !== false) keepOnChart = true;
    if (isNaN(price)) return;
    this.belowPrice = this.snapPrice(price);
    if (this.belowPrice > this.centerPrice) this.belowPrice = this.centerPrice;
    this.positionAtPrice(this.belowPrice, ['dragLineBelow'], 'center', null, keepOnChart);
    this.elements.dragLineBelowPrice.innerHTML = this.formatPrice(this.belowPrice);
    if (this.activeTrade == 'buy' || this.activeTrade == 'short') {
        this.positionAtPrice(this.belowPrice, ['otoBelow'], 'top', ['limitOrder'], keepOnChart);
    } else if (this.activeTrade == 'strangle' || this.activeTrade == 'straddle') {
        this.positionAtPrice(this.belowPrice, ['ocoBelow'], 'top', null, keepOnChart);
        this.dom.ocoOrder.style.top = this.dom.ocoBelow.style.top;
    } else if (this.activeTrade == 'bracket_sell' || this.activeTrade == 'bracket_cover') {
        this.positionAtPrice(this.belowPrice, ['otoBelow'], 'top', null, keepOnChart);
        this.dom.limitOrder.style.top = `${CIQ.stripPX(this.dom.otoBelow.style.top) + this.dom.otoBelow.clientHeight}px`;
    }
};

/**
 * Places the currently enabled elements along their y axis depending on the prices that have been set. This gets called whenever
 * the screen is panned, zoomed or resized because the placement is relative to the size of the chart itself. It also ensures
 * that the shaded areas do not extend past the top and bottom of the chart panel.
 */
CIQ.TFC.prototype.render = function () {
    if (this.activeTrade == 'buy' || this.activeTrade == 'short') {
        this.positionCenterLine(this.centerPrice);
        this.positionAboveLine(this.abovePrice);
        this.positionBelowLine(this.belowPrice);
    } else if (this.activeTrade == 'straddle' || this.activeTrade == 'strangle') {
        this.positionAboveLine(this.abovePrice);
        this.positionBelowLine(this.belowPrice);
    }
    if (this.activeTrade == 'straddle' || this.activeTrade == 'strangle') {
        this.dom.shadeAbove.style.top = '0px';
        this.dom.shadeAbove.style.bottom = `${this.chart.panel.height - this.locationFromPrice(this.abovePrice)}px`;
        this.dom.shadeBelow.style.top = `${this.locationFromPrice(this.belowPrice)}px`;
        this.dom.shadeBelow.style.bottom = '0px';
    }
    // this.renderTrades();
    // this.renderOpenOrders();
};


/**
 * Returns the price given the location (top) of a node. Adjusts for panel position in the chart.
 * It will adjust to ensure it is within the stx.chart.yAxis.minimumPriceTick range
 * @param  {number} y The location of the node (assumed to be included in a holder that is aligned with the chart panel)
 * @return {number}   The price represented by that y position
 */
CIQ.TFC.prototype.priceFromLocation = function (y) {
    let price = this.stx.valueFromPixelUntransform(y + this.chart.panel.top, this.chart.panel);

    return this.snapPrice(price);
};

/**
 * Returns the y-position for a node given the price
 * @param  {number} p The requested price
 * @return {number}   The y-position (within the chart panel)
 */
CIQ.TFC.prototype.locationFromPrice = function (p) {
    return this.stx.pixelFromPriceTransform(p, this.chart.panel) - this.chart.panel.top;
};

/**
 * Called from an CIQ.safeDrag operation when the center line has been grabbed. Recalculates the center price and repositions the center elements.
 * @param  {Event} e A JS event from a CIQ.safeDrag operation (displacementY is expected)
 */
CIQ.TFC.prototype.dragCenterLine = function (e) {
    if (!CIQ.hasClassName(this.dom.dragLineCenter, 'dragging')) return;
    if (this.activeTrade == 'bracket_cover' || this.activeTrade == 'bracket_sell') return;	// prevent an error if the order portion of bracket is grabbed
    let newTop = this.initialPosition + e.displacementY;
    let newCenter = newTop + (this.dom.dragLineCenter.offsetHeight / 2);
    let newPrice = this.priceFromLocation(newCenter);
    this.positionCenterLine(newPrice);
};

/**
 * Called from an CIQ.safeDrag operation when the above line has been grabbed. Recalculates the above price and repositions the above elements.
 * @param  {Event} e A JS event from a CIQ.safeDrag operation (displacementY is expected)
 */
CIQ.TFC.prototype.dragAboveLine = function (e) {
    let newTop = this.initialPosition + e.displacementY;
    let newCenter = newTop + (this.dom.dragLineAbove.offsetHeight / 2);
    let newPrice = this.priceFromLocation(newCenter);
    if (this.activeTrade == 'buy' || this.activeTrade == 'short' || this.activeTrade == 'bracket_sell' || this.activeTrade == 'bracket_cover') {
        if (newPrice < this.centerPrice) newPrice = this.centerPrice;
    } else if (this.activeTrade == 'strangle' || this.activeTrade == 'straddle') {
        let currentPrice = this.stx.currentQuote().Close;
        if (newPrice < currentPrice) newPrice = currentPrice;	// straddle/strangle cannot be inside current market price
    }
    this.positionAboveLine(newPrice);
    this.render();
};

/**
 * Called from an CIQ.safeDrag operation when the below line has been grabbed. Recalculates the below price and repositions the below elements.
 * @param  {Event} e A JS event from a CIQ.safeDrag operation (displacementY is expected)
 */
CIQ.TFC.prototype.dragBelowLine = function (e) {
    let newTop = this.initialPosition + e.displacementY;
    let newCenter = newTop + (this.dom.dragLineBelow.offsetHeight / 2);
    let newPrice = this.priceFromLocation(newCenter);
    if (this.activeTrade == 'buy' || this.activetrade == 'short' || this.activeTrade == 'bracket_sell' || this.activeTrade == 'bracket_cover') {
        if (newPrice > this.centerPrice) newPrice = this.centerPrice;
    } else if (this.activeTrade == 'strangle' || this.activeTrade == 'straddle') {
        let currentPrice = this.stx.currentQuote().Close;
        if (newPrice > currentPrice) newPrice = currentPrice;	// straddle/strangle cannot be inside current market price
    }
    this.positionBelowLine(newPrice);
    this.render();
};

/**
 * Hides all of the top level widgets contained in CIQ.TFC.prototype.dom. This is called when closing the TFC.
 */
CIQ.TFC.prototype.hideAllDOM = function () {
    for (let componentName in this.dom) {
        let component = this.dom[componentName];
        component.style.display = 'none';
    }
};

/**
 * Formats a price according to the conventions used on the y-axis. This should ensure that trade prices are always the same
 * number of decimal places as the security currently trades. It will further ensure that decimal places do not exceed
 * this.tradability.maxDecimalPlaces
 * @param  {number} price The price to format
 * @return {string}       The price formatted as text, fixed to the appropriate number of decimal places
 */
CIQ.TFC.prototype.formatPrice = function (price) {
    let p = price.toString();
    if (this.tradability && (this.tradability.maxDecimalPlaces || this.tradability.maxDecimalPlaces === 0)) {
        p = price.toFixed(this.tradability.maxDecimalPlaces);
    } else if (this.stx.chart.yAxis.priceFormatter && !this.stx.chart.isComparison) {
        // use the formatter as long as it is not a comparison, otherwise it will have '%' signs
        p = this.stx.chart.yAxis.priceFormatter(this.stx, this.chart.panel, price);
    } else {
        p = this.stx.formatYAxisPrice(price, this.chart.panel);
    }
    return p;
};

/**
 * Start method for a drag operation. Callback from CIQ.safeDrag
 * @param  {Event} e    The mouse or touch event
 * @param  {HTMLElement} node The element that is being dragged
 */
CIQ.TFC.prototype.startDrag = function (e, node) {
    this.initialPosition = CIQ.stripPX(node.style.top);
    this.stx.modalBegin();
    CIQ.appendClassName(node, 'dragging');
};

/**
 * End method for a drag operation. Callback from CIQ.safeDrag
 * @param  {Event} e    The mouse or touch event
 * @param  {HTMLElement} node The element that was dragged
 */
CIQ.TFC.prototype.endDrag = function (e, node) {
    this.stx.modalEnd();
    CIQ.unappendClassName(node, 'dragging');
};


/**
 * This constructs the Trade From the Chart object. It is called from the actual object constructor. Within, we instantiate all
 * of the components that can be used in TFC and we set up all of the event handlers. TFC makes use of the "CIQ.safe" event handlers
 * to seamlessly handle both touch and mouse events through one interface.
 * @param {object} config Configuration object
 * @param {object} config.stx     The chart object to enable TFC.
 * @param {object} config.account Valid CIQ.Account object for querying brokerage and placing trades
 * @param {object} [config.chart]   The specific chart (panel) for trading componentry. Defaults to the default chart.
 * @param {boolean} [config.skipConfirms] If set to true then there will be no confirm messages. Pressing buy or sell buttons will place a trade!
 */
CIQ.TFC.prototype.construct = function (){
    let container = $$$('.tfc.container');
    this.holder = this.stx.chart.panel.holder;
    this.dom.dragLineAbove = $$$('.drag-price-line', container).cloneNode(true);
    this.dom.dragLineCenter = $$$('.drag-price-line', container).cloneNode(true);
    this.dom.dragLineBelow = $$$('.drag-price-line', container).cloneNode(true);
    this.dom.limitOrder = $$$('.stx-limit-order', container).cloneNode(true);
    this.dom.otoAbove = $$$('.OTO.stx-stop', container).cloneNode(true);
    this.dom.otoBelow = $$$('.OTO.stx-stop', container).cloneNode(true);
    this.dom.ocoOrder = $$$('.stx-oco-order', container).cloneNode(true);
    this.dom.ocoAbove = $$$('.oco.tfc-oco-above', container).cloneNode(true);
    this.dom.ocoBelow = $$$('.oco.tfc-oco-below', container).cloneNode(true);
    this.dom.shadeAbove = $$$('.tfc-shade', container).cloneNode(true);
    this.dom.shadeBelow = $$$('.tfc-shade', container).cloneNode(true);

    this.elements.ocoAboveHead = $$$('.stx-head', this.dom.ocoAbove);
    this.elements.ocoBelowHead = $$$('.stx-head', this.dom.ocoBelow);
    this.elements.dragLineAbovePrice = $$$('.tfc-price', this.dom.dragLineAbove);
    this.elements.dragLineCenterPrice = $$$('.tfc-price', this.dom.dragLineCenter);
    this.elements.dragLineBelowPrice = $$$('.tfc-price', this.dom.dragLineBelow);
    this.elements.removeOTOAbove = $$$('.stx-btn.stx-ico .stx-ico-close', this.dom.otoAbove);
    this.elements.removeOTOBelow = $$$('.stx-btn.stx-ico .stx-ico-close', this.dom.otoBelow);

    CIQ.safeClickTouch(this.elements.removeOTOAbove, () => this.removeOTOAbove());
    CIQ.safeClickTouch(this.elements.removeOTOBelow, () => this.removeOTOBelow());

    const modalBegin = () => {
        if (this.stx.grabbingScreen) return;
        this.stx.editingAnnotation = true;
        this.stx.modalBegin();
    };
    const modalEnd = () => {
        this.stx.modalEnd();
        this.stx.editingAnnotation = false;
    };

    const startDrag = (e, node) => {
        this.initialPosition = CIQ.stripPX(node.style.top);
        this.stx.modalBegin();
        CIQ.appendClassName(node, 'dragging');
    };
    const endDrag = (e, node) => {
        this.stx.modalEnd();
        CIQ.unappendClassName(node, 'dragging');
    };

    for (let componentName in this.dom) {
        let component = this.dom[componentName];
        this.holder.appendChild(component);
        if (!(componentName in { shadeAbove: true, shadeBelow: true })) {
            CIQ.safeMouseOver(component, modalBegin);
            CIQ.safeMouseOut(component, modalEnd);
        }
    }

    CIQ.safeDrag(
        this.dom.dragLineCenter,
        (e) => this.startDrag(e, this.dom.dragLineCenter),
        (e) => this.dragCenterLine(e),
        (e) => endDrag(e, this.dom.dragLineCenter),
    );
    CIQ.safeDrag(
        this.dom.limitOrder,
        (e) => this.startDrag(e, this.dom.dragLineCenter),
        (e) => this.dragCenterLine(e),
        (e) => endDrag(e, this.dom.dragLineCenter),
    );
    CIQ.safeDrag(
        this.dom.dragLineAbove,
        (e) => this.startDrag(e, this.dom.dragLineAbove),
        (e) => this.dragAboveLine(e),
        (e) => endDrag(e, this.dom.dragLineAbove),
    );
    CIQ.safeDrag(
        this.dom.ocoAbove,
        (e) => this.startDrag(e, this.dom.dragLineAbove),
        (e) => this.dragAboveLine(e),
        (e) => endDrag(e, this.dom.dragLineAbove),
    );
    CIQ.safeDrag(
        this.dom.otoAbove,
        (e) => this.startDrag(e, this.dom.dragLineAbove),
        (e) => this.dragAboveLine(e),
        (e) => endDrag(e, this.dom.dragLineAbove),
    );
    CIQ.safeDrag(
        this.dom.dragLineBelow,
        (e) => this.startDrag(e, this.dom.dragLineBelow),
        (e) => this.dragBelowLine(e),
        (e) => endDrag(e, this.dom.dragLineBelow),
    );
    CIQ.safeDrag(
        this.dom.ocoOrder,
        (e) => this.startDrag(e, this.dom.dragLineBelow),
        (e) => this.dragBelowLine(e),
        (e) => endDrag(e, this.dom.dragLineBelow),
    );
    CIQ.safeDrag(
        this.dom.ocoBelow,
        (e) => this.startDrag(e, this.dom.dragLineBelow),
        (e) => this.dragBelowLine(e),
        (e) => endDrag(e, this.dom.dragLineBelow),
    );
    CIQ.safeDrag(
        this.dom.otoBelow,
        (e) => this.startDrag(e, this.dom.dragLineBelow),
        (e) => this.dragBelowLine(e),
        (e) => endDrag(e, this.dom.dragLineBelow),
    );

    CIQ.ChartEngine.prototype.append('draw', () => {
        this.positionAboveLine(this.abovePrice);
        this.positionBelowLine(this.belowPrice);
        this.positionAtPrice(this.centerPrice, ['limitOrder', 'dragLineCenter']);
        this.dom.shadeAbove.style.top = '0px';
        this.dom.shadeAbove.style.bottom = `${this.chart.panel.height - this.locationFromPrice(this.abovePrice)}px`;
        this.dom.shadeBelow.style.top = `${this.locationFromPrice(this.belowPrice)}px`;
        this.dom.shadeBelow.style.bottom = '0px';
    });
};
