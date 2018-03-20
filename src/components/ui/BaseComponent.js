import $ from 'jquery';
import { getParents } from './utils';
import CIQ from 'chartiq';
import { claims } from './';

/**
 * Abstract class for WebComponents using this framework
 *
 * Provides a base set of functionality for web components
 *
 * @see {@link WebComponents}
 * @memberof CIQ.UI
 * @namespace BaseComponent
 * @type {HTMLElement}
 */
var BaseComponent=Object.create(HTMLElement.prototype);

/**
 * Locates the nearest UI helper for the given attribute. If none exists then it is created at the topNode.
 * @param  {HTMLElement} node    The node with either stxbind or stxtap attribute
 * @param {string} [binding] The type of binding or helper name being looked for, otherwise the stxbind and then stxtap attributes are queried
 * @param {string} attribute Either "stxtap" or "stxbind". Only required if binding==null.
 * @return {CIQ.UI.Helper}     A UI helper object
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.getHelper=function(node, binding, attribute){
    if(!node) node=this.topNode;
    else node=$(node)[0];
    if(!binding){
        binding=node.getAttribute(attribute);
        if(!binding) return null;
    }
    var helper;
    var paren=binding.indexOf("(");
    var beforeParen=binding.substring(0, paren);
    var period=binding.indexOf(".");
    if(paren==-1 || beforeParen.indexOf(".")!=-1){ // Layout or Layout.Chart or Layout.Chart('blah')
        var helperName=binding;
        if(period!=-1){
            helperName=binding.substring(0, period);
        }
        if(!this.context){
            console.log("No context attached to " + this.tagName + ". A context is required when binding to a helper.");
            return null;
        }
        helper=this.context.getAdvertised(helperName);
    }else{ // bind to nearest web component // chart()
        var f=binding.substring(0, paren);
        var parents=$(node).parents();
        for(var i=0;i<parents.length;i++){
            var component=parents[i];
            if(typeof(component[f])=="function"){
                return component;
            }
        }

    }
    return helper;
};

/**
 * Activates an element that was tapped on via the stxtap attribute. The contents of stxtap
 * should be the name of a class derived from {@link CIQ.UI.Element}, a member function of that
 * class and the arguments.
 *
 * The DOM tree will be searched for an instance of that class. If one cannot be found, then an
 * instance will be created on the spot. The instance itself should attach itself if it wants to be re-used.
 * @param  {HTMLElement} node The node that was tapped
 * @param {Event} e The event that triggered the function
 * @param {Object} [params] Optional object to send as last argument
 * @param {Boolean} [setter] If true then use stxsetget instead of stxtap
 * @memberof CIQ.UI.BaseComponent
 * @private
 */
BaseComponent.activate=function(node, e, params, setter){
    var attribute=setter?"stxsetget":"stxtap";
    var method=CIQ.UI.splitMethod(node.getAttribute(attribute));
    if(!method) return;
    var helperName=method.helperName;
    var f=method.functionName;
    if(setter) f="set" + f;
    // All helper methods take the node that was activated as the first argument
    var argArray=[{node:node,e:e,params:params}].concat(method.args);

    if(helperName){
        var helper=this.getHelper(node, null, attribute);

        if(!helper[f]){
            console.log("Method '" + f + "' not found in helper", helper);
            return;
        }
        helper[f].apply(helper, argArray);
    }else{ // Look for nearest parent web component that contains our desired activation function
        var parents=$(node).parents();
        for(var j=0;j<parents.length;j++){
            var component=parents[j];
            if(typeof(component[f])==="function"){
                component[f].apply(component, argArray);
            }
        }
    }
};

/**
 * We need to attach a safeClickTouch
 * @param  {HTMLElement}   node The element to attach a tap event to
 * @param  {Function} cb   The callback when tapped
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.makeTap=function(node, cb){
    node.selectFC=cb;
    $(node).stxtap(cb);
};

/**
 * Set bindings for a node that has been created dynamically. The attribute can be either "stxbind", "stxtap" or "stxsetget".
 *
 * In the case of stxsetget, a "set" and "get" will be prepended to the bound method.
 * <Helper>.getXxxxx() will be called once during this initialization. That method should set up a binding.
 *
 * When tapping (or changing value in the case of an input field) <Helper>.setXxxx() will be called.
 *
 * bindings in web components will search for the nearest parent component that contains the expected function:
 * @example
 * stxtap="tool('gartley')" // Will look for the next parent with method "tool"
 *
 * To explicitly target a web component, use a prefix
 * @example
 * stxtap="DrawingToolbar.tool('gartley')"
 *
 * @param  {HTMLElement} node      The node to bind
 * @param {Object} [params] Optional parameters that will be passed as final argument
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.bind=function(node, params){
    node=$(node)[0]; // If jquery, convert to raw HTMLElement
    var helper;
    var binding=node.getAttribute("stxbind");
    var tap=node.getAttribute("stxtap");
    var setget=node.getAttribute("stxsetget");

    // One way binding
    function bindHelper(helper){
        var method;
        var paren=binding.indexOf("(");
        method=binding.substring(binding.indexOf(".")+1);
        if(paren!==-1){
            method=binding.substring(0, paren);
        }
        helper[method](node);
    }
    if(binding && binding!==""){
        helper=this.getHelper(node, binding, "stxbind");
        bindHelper(helper);
    }

    // "tap" binding
    var self=this;
    function closure(node){
        return function(e){
            self.e=e;
            self.activate(node, e, params, false);
        };
    }
    if(tap && tap!==""){
        if(node.tagName=="INPUT" && (node.type==="text" || node.type==="number")){
            this.inputEntry(node, closure(node));
        }else{
            this.makeTap(node, closure(node));
        }
    }

    // Setter/Getter binding
    function setGetHelper(helper){
        function createSetter(){
            return function(e){
                self.e=e;
                self.activate(node, e, params, true);
            };
        }
        var method=CIQ.UI.splitMethod(setget);
        if(!method){
            console.log("Syntax error " + setget);
            return;
        }
        var argArray=[node].concat(method.args).concat(params);
        if(helper) helper["get" + method.functionName].apply(helper, argArray);
        if(node.type==="text" || node.type==="number"){
            self.inputEntry(node, createSetter());
        }else{
            self.makeTap(node, createSetter());
        }
    }
    if(setget){
        helper=this.getHelper(node, setget, "stxsetget");
        setGetHelper(helper);
    }
};

BaseComponent.scheduledBindings=[];
BaseComponent.timeout=null;

/**
 * Static method. Gets called once and only once per DOM processing cycle, and only
 * if it's been triggered by a call to scheduledForBinding.
 * @private
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.nextTick=function(){
    if(!CIQ.UI.release) return; // UI hasn't started yet
    clearTimeout(BaseComponent.timeout);
    var scheduledBindings=BaseComponent.scheduledBindings;
    // We traverse through the bindings backwards which ensures that we attempt to bind to the closest
    // web component ancestor to the actual binding.
    for(var i=scheduledBindings.length-1;i>=0;i--){
        var binding=scheduledBindings[i];
        if(binding.node.ciqAlreadyBound) continue; // a node can only be bound once in it's lifetime
        binding.contextTag.bind.call(binding.contextTag, binding.node);
        binding.node.ciqAlreadyBound=true;
    }
};

/**
 * Schedules a node to be processed for binding. The binding will occur in the next tick, in order
 * to provide time for the DOM to be completed.
 * @param  {HTMLElement} node The node to be bound
 * @memberof CIQ.UI.BaseComponent
 * @private
 */
BaseComponent.scheduleForBinding=function(node){
    BaseComponent.scheduledBindings.push({node:node, contextTag:this});

    // This ensures that one and only one nextTick event will occur
    if(BaseComponent.timeout) clearTimeout(BaseComponent.timeout);
    BaseComponent.timeout=setTimeout(BaseComponent.nextTick, 0);
};

/**
 * Travels the DOM tree and locates stxbind attributes. UI elements can use these to configure menus or dialogs.
 * To effect reverse binding, set the value of the stxbind attribute to a Helper class name and data element. For instance "Layout.chartStyle".
 * The Helper element will seek out all children with "stxtap" attribution and examine the arguments to that function call for a match.
 * @param {HTMLElement} [traverseNode] Specify the node to traverse. Defaults to topNode for the context.
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.buildReverseBindings=function(){
    if(CIQ.UI.bypassBindings) return;
    var traverseNode=this;
    var acceptFunc=function(node) {
        if ( node.hasAttribute("stxbind") ||
            node.hasAttribute("stxtap") ||
            node.hasAttribute("stxsetget")) {
            return NodeFilter.FILTER_ACCEPT;
        }
    };

    var walker = document.createNodeIterator(
        traverseNode,
        NodeFilter.SHOW_ELEMENT,
        CIQ.isIE?acceptFunc:{acceptNode:acceptFunc},
        false
    );

    var node;

    node = walker.nextNode();
    while(node) {
        this.scheduleForBinding(node);
        node = walker.nextNode();
    }
};

/**
 * We need to attach an input entry event
 * @param  {HTMLElement}   node The element to attach input entry event to
 * @param  {Function} cb   The callback when entered
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.inputEntry=function(node, cb){
    $(node).on("keypress", function(e){
        switch(e.which){
            case 13:
            case 9:
                cb();
        }
    });
};

/**
 * Claim any keystrokes that come in. Once claimed, any keystrokes
 * that come in will be passed to the helper. It can then choose
 * to capture or propagate the keystrokes. This allows a helper to capture
 * keystrokes even if it doesn't have mouse focus.
 * @param {CIQ.UI.Helper} helper A helper of ContextTag
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.addClaim=function(helper){
    claims.push({helper: helper});
};

/**
 * Remove a claim on keystrokes.
 * @param  {CIQ.UI.Helper} helper Helper or ContextTag
 * @memberof CIQ.UI.BaseComponent
 */
BaseComponent.removeClaim=function(helper){
    for(var i=0;i<claims.length;i++){
        if(claims[i].helper===helper){
            claims.splice(i,1);
            return;
        }
    }
};

/**
 * Convience function that creates an array of injections for the component and sets a variable of node equal to self.
 * @kind function
 * @memberof CIQ.UI.BaseComponent
 * @private
 */
BaseComponent.createdCallback=function(){
    this.node=$(this);
};

/**
 * Called automatically when a tag is instantiated
 * @kind function
 * @memberof CIQ.UI.BaseComponent
 * @private
 */
BaseComponent.attachedCallback=function(){
    if(this.attached) return;
    this.buildReverseBindings();
    this.attached=true;
};

/**
 * Called automatically when a tag is removed from the DOM.
 * @kind function
 * @memberOf CIQ.UI.BaseComponent
 * @private
 */
BaseComponent.detachedCallback=function() {
    this.attached = false;
};

export default BaseComponent;
