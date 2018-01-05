import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import ContextTag from './UI/ContextTag';

/**
 * Views web component `<cq-views>`.
 *
 * This web component has two functions. The first is displaying available views in a menu.
 * The second is providing a views dialog for entering a new view.
 *
 * @name CIQ.UI.Views
 * @namespace WebComponents.cq-views
 */
class Views extends ContextTag {
    attachedCallback() {
        if (this.attached) return;
        ContextTag.attachedCallback.apply(this);
        this.attached = true;
    }

    /**
     * Initialize a views menu
     *
     * @param {Object} params Optional parameters to control behavior of the menu
     * @param {Object} [params.viewObj={views:[]}] Specify the object which contains the "views" objects.  If omitted, will create one.
     * @param {CIQ.NameValueStore} [params.nameValueStore=CIQ.NameValueStore] Specify the storage class.  If omitted, will use  {@link CIQ.NameValueStore}. See example for storage class function signatures and CB requirements.
     * @param {Object} [params.renderCB=null] Optional callback executed on menu after rendering.  Takes the menu as argument.
     * @param {Object} [params.cb] Get a callback when the nameValueStore has retrieved the data.
     * @memberof WebComponents.cq-views
     * @constructor
     * @example
     *  //
        // To have the views web component menus use a different storage function,
        // just add it to the 'parameters.nameValueStore' like so:

        $("cq-views").each(function(){
            this.initialize({nameValueStore: new MyNameValueStore()});
        });

        //And make sure you create your own MyNameValueStore functions in the following format:

         MyNameValueStore=function(){
         };

         MyNameValueStore.prototype.set=function(field, value, cb){
           // Add code here to send the view object ('value') to your repository and store under a key of 'field'
          if(cb) cb(errorCode);
         };

         MyNameValueStore.prototype.get=function(field, cb){
          // Add code here to get the views object for key 'field' from your repository and rerun it in the callback.
          if(cb) cb(errorCode, yourViewObject);
         };

         MyNameValueStore.prototype.remove=function(field, cb){
          // Add code here to remove the view object under the key 'field' from your repository
          if(cb) cb(errorCode);
         };
     *
     * @since 3.0.7 params.cb added to signature.
     * @since TBC ViewMenu helper has been deprecated. Please call $("cq-views")[0].initialize() now.
     *
     */
    initialize(params) {
        this.params = params || {};
        if (!this.params.viewObj) {
            this.params.viewObj = {
                views: [],
            };
        }
        if (!this.params.nameValueStore) this.params.nameValueStore = new CIQ.NameValueStore();
        if (!this.params.template) this.params.template = 'template[cq-view]';
        this.params.template = this.node.find(this.params.template);
        this.params.template.detach();
        let self = this;
        this.params.nameValueStore.get('stx-views', (err, obj) => {
            if (!err && obj) self.params.viewObj.views = obj;
            if (self.params.cb) self.params.cb.call(self);
            self.renderMenu();
        });
    }


    /**
     * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
     * CIQ.UI.ViewsMenu for processing stxtap attributes, or you can call renderMenu() to automatically
     * generate the menu.
     * @memberof WebComponents.cq-views
     */
    renderMenu() {
        let menu = $(this.node);
        let self = this;
        let stx = self.context.stx;

        function remove(i) {
            return function (e) {
                e.stopPropagation();
                let saved = false;
                $('cq-views').each(function () {
                    this.params.viewObj.views.splice(i, 1);
                    if (!saved) {
                        this.params.nameValueStore.set('stx-views', self.params.viewObj.views);
                        saved = true;
                    }
                    this.renderMenu();
                });
            };
        }

        function enable(i) {
            return function (e) {
                e.stopPropagation();
                self.uiManager.closeMenu();
                if (self.context.loader) self.context.loader.show();
                let layout = CIQ.first(self.params.viewObj.views[i]);

                function importLayout() {
                    stx.importLayout(self.params.viewObj.views[i][layout], true, true);
                    if (stx.changeCallback) stx.changeCallback(stx, 'layout');
                    stx.dispatch('layout', {
                        stx,
                    });
                    if (self.context.loader) self.context.loader.hide();
                }
                setTimeout(importLayout, 10);
            };
        }

        menu.find('cq-views-content cq-item').remove();
        for (let v = 0; v < this.params.viewObj.views.length; v++) {
            let view = CIQ.first(self.params.viewObj.views[v]);
            if (view === 'recent') continue;
            let item = CIQ.UI.makeFromTemplate(this.params.template);
            let label = item.find('cq-label');
            let removeView = item.find('div');

            if (label.length) {
                label.addClass(`view-name-${view}`);
                label.prepend(view); // don't use text(); it wipes out anything else embedded in the item
            }
            if (removeView.length) removeView.stxtap(remove(v));
            item.stxtap(enable(v));
            menu.find('cq-views-content').append(item);
        }

        let addNew = menu.find('cq-view-save');
        if (addNew) {
            let context = this.context;
            addNew.stxtap(() => {
                $('cq-view-dialog').each(function () {
                    $(this).find('input').val('');
                    this.open({
                        context,
                    });
                });
            });
        }
        if (this.params.renderCB) this.params.renderCB(menu);
    }
}

export default Views;
CIQ.UI.Views = document.registerElement('cq-views', Views);
