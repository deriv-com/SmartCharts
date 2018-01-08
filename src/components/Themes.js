import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import ContextTag from './ui/ContextTag';

/**
     * Themes web component `<cq-themes>`.
     *
     * This web component has two functions. The first is displaying available themes in a menu.
     * The second is providing a theme dialog for entering a new theme.
     *
     * Built in themes are merely the names of classes that will be added to the top element of the UIContext when
     * selected.
     *
     * @name CIQ.UI.Themes
     * @namespace WebComponents.cq-themes
     * @example
<cq-themes>
    <cq-themes-builtin cq-no-close>
        <template>
            <cq-item></cq-item>
        </template>
    </cq-themes-builtin>
    <cq-themes-custom cq-no-close>
        <template>
            <cq-theme-custom>
                <cq-item>
                    <cq-label></cq-label>
                    <cq-close></cq-close>
                </cq-item>
            </cq-theme-custom>
        </template>
    </cq-themes-custom>
    <cq-separator cq-partial></cq-separator>
    <cq-item stxtap="newTheme()"><cq-plus></cq-plus> New Theme </cq-item>
</cq-themes>
     */
class Themes extends ContextTag {
    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
        this.attached = true;
        this.builtInMenu = $(this).find('cq-themes-builtin');
        this.builtInTemplate = this.builtInMenu.find('template');
        this.customMenu = $(this).find('cq-themes-custom');
        this.customTemplate = this.customMenu.find('template');
    }

    /**
         * @param {Object} params Parameters
         * @param {Object} [params.builtInThemes] Object map of built in theme names, display names
         * @param {Object} [params.defaultTheme] The default built in theme to use
         * @param {Object} [params.nameValueStore] A {@link CIQ.NameValueStore} object for fetching and saving theme state
         * @param {string} [params.id] An optional id, which can be used to disambiguate when multiple charts are on the screen
         * @memberof WebComponents.cq-themes
         */
    initialize(params) {
        this.params = {};
        if (params) this.params = params;
        if (!this.params.customThemes) this.params.customThemes = {};
        if (!this.params.builtInThemes) this.params.builtInThemes = {};
        if (!this.params.nameValueStore) this.params.nameValueStore = new CIQ.NameValueStore();
        this.id = params.id ? (`${params.id}-`) : '';

        let self = this;

        if (this.params.nameValueStore) {
            // Retrieve any custom themes the user has created
            this.params.nameValueStore.get('CIQ.Themes.prototype.custom', (err, result) => {
                if (!err && result) {
                    self.params.customThemes = result;
                }
                // Set the current theme to the last one selected by user
                self.params.nameValueStore.get(`${self.id}CIQ.Themes.prototype.current`, (err, result) => {
                    if (!err && result && result.theme) {
                        self.loadTheme(result.theme);
                    } else {
                        self.loadTheme(self.params.defaultTheme);
                    }
                    self.configureMenu();
                });
            });
        } else {
            this.loadTheme(self.params.defaultTheme);
        }
    }

    /**
         * @param self
         * @param className
         * @alias newTheme
         * @memberof WebComponents.cq-themes
         */
    configureMenu() {
        function loadBuiltIn(self, className) {
            return function (e) {
                self.loadBuiltIn(className);
                if (self.params.callback) {
                    self.params.callback({
                        theme: self.currentTheme,
                    });
                }
                self.persist('current');
            };
        }

        function loadCustom(self, themeName) {
            return function (e) {
                self.loadCustom(themeName);
                if (self.params.callback) {
                    self.params.callback({
                        theme: self.currentTheme,
                    });
                }
                self.persist('current');
            };
        }
        this.builtInMenu.emptyExceptTemplate();
        this.customMenu.emptyExceptTemplate();
        let display,
            newMenuItem;
        let builtInThemes = this.params.builtInThemes;
        for (let className in builtInThemes) {
            display = builtInThemes[className];
            newMenuItem = CIQ.UI.makeFromTemplate(this.builtInTemplate);
            newMenuItem.text(display);
            newMenuItem[0].selectFC = loadBuiltIn(this, className);
            newMenuItem.stxtap(newMenuItem[0].selectFC);
            this.builtInMenu.append(newMenuItem);
        }

        let customThemes = this.params.customThemes;
        for (let themeName in customThemes) {
            display = themeName;
            newMenuItem = CIQ.UI.makeFromTemplate(this.customTemplate);
            newMenuItem.find('cq-label').text(display);
            newMenuItem[0].selectFC = loadCustom(this, themeName);
            newMenuItem.stxtap(newMenuItem[0].selectFC);
            newMenuItem[0].close = (function (self, themeName) {
                return function () {
                    self.removeTheme(themeName);
                };
            }(this, themeName));
            this.customMenu.append(newMenuItem);
        }
    }

    /**
         * @param themeName
         * @alias newTheme
         * @memberof WebComponents.cq-themes
         */
    removeTheme(themeName) {
        let saved = false;
        $('cq-themes').each(function () {
            delete this.params.customThemes[themeName];
            this.configureMenu();
            if (!saved) {
                this.persist();
                saved = true;
            }
        });
    }

    /**
         * @param which
         * @alias persist
         * @memberof WebComponents.cq-themes
         */
    persist(which) {
        if (!this.params.nameValueStore) return;
        if (!which || which === 'current') {
            this.params.nameValueStore.set(`${this.id}CIQ.Themes.prototype.current`, {
                theme: this.currentTheme,
            });
        }
        if (!which || which === 'custom') this.params.nameValueStore.set('CIQ.Themes.prototype.custom', this.params.customThemes);
    }

    /**
         * @alias addCustom
         * @memberof WebComponents.cq-themes
         * @param {object} theme The theme descriptor
         * @param {Themes} initiatingMenu The menu which initially called ThemeDialog. This is used in order to save the new theme as the current theme.
         */
    addCustom(theme, initiatingMenu) {
        this.params.customThemes[theme.name] = theme;
        if (initiatingMenu === this) this.currentTheme = theme.name;
        this.configureMenu();
        this.persist();
    }

    /**
         * @private
         * @param {object} theme
         * @memberOf CIQ.UI.Themes
         */
    reinitializeChart(theme) {
        let stx = this.context.stx;
        stx.styles = {};
        stx.chart.container.style.backgroundColor = '';
        if (theme) {
            let helper = new CIQ.ThemeHelper({
                stx,
            });
            helper.settings = theme.settings;
            helper.update();
        }
        stx.updateListeners('theme');
        stx.changeOccurred('theme');
        if (stx.displayInitialized) {
            stx.headsUpHR();
            stx.clearPixelCache();
            stx.updateListeners('theme');
            stx.draw();
        }
    }

    /**
         * @alias loadTheme
         * @memberof WebComponents.cq-themes
         */
    loadTheme(themeName) {
        if (this.params.customThemes[themeName]) {
            this.loadCustom(themeName);
        } else if (this.params.builtInThemes[themeName]) {
            this.loadBuiltIn(themeName);
        } else {
            this.loadBuiltIn(this.params.defaultTheme);
        }
    }

    /**
         * @alias loadBuiltIn
         * @memberof WebComponents.cq-themes
         */
    loadBuiltIn(className) {
        if (this.currentLoadedBuiltIn) {
            $(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
        }
        $(this.context.topNode).addClass(className);
        this.currentLoadedBuiltIn = this.currentTheme = className;
        this.reinitializeChart();
    }

    /**
         * @alias loadCustom
         * @memberof WebComponents.cq-themes
         */
    loadCustom(themeName) {
        if (this.currentLoadedBuiltIn) {
            $(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
        }
        let theme = this.params.customThemes[themeName];
        if (theme.builtIn) $(this.context.topNode).addClass(theme.builtIn);
        this.currentLoadedBuiltIn = theme.builtIn;
        this.currentTheme = theme.name;
        this.reinitializeChart(theme);
    }

    /**
         * @alias newTheme
         * @memberof WebComponents.cq-themes
         */
    newTheme() {
        let self = this;
        $('cq-theme-dialog').each(function () {
            this.open({
                context: self.context,
                initiatingMenu: self,
            });
        });
    }
}


document.registerElement('cq-themes', Themes);
export default Themes;

