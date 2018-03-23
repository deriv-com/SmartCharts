!(function(e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports, require("mobx"), require("react"), require("react-dom"))
        : "function" == typeof define && define.amd
          ? define(["exports", "mobx", "react", "react-dom"], t)
          : t((e.mobxReact = {}), e.mobx, e.React, e.ReactDOM)
})(this, function(e, t, n, r) {
    "use strict"
    function o(e) {
        function n(n, r, o, i, a, s) {
            for (var c = arguments.length, u = Array(c > 6 ? c - 6 : 0), p = 6; p < c; p++)
                u[p - 6] = arguments[p]
            return t.untracked(function() {
                if (((i = i || "<<anonymous>>"), (s = s || o), null == r[o])) {
                    if (n) {
                        var t = null === r[o] ? "null" : "undefined"
                        return new Error(
                            "The " +
                                a +
                                " `" +
                                s +
                                "` is marked as required in `" +
                                i +
                                "`, but its value is `" +
                                t +
                                "`."
                        )
                    }
                    return null
                }
                return e.apply(void 0, [r, o, i, a, s].concat(u))
            })
        }
        var r = n.bind(null, !1)
        return (r.isRequired = n.bind(null, !0)), r
    }
    function i(e, t) {
        return (
            "symbol" === e ||
            ("Symbol" === t["@@toStringTag"] ||
                ("function" == typeof Symbol && t instanceof Symbol))
        )
    }
    function a(e) {
        var t = void 0 === e ? "undefined" : _(e)
        return Array.isArray(e) ? "array" : e instanceof RegExp ? "object" : i(t, e) ? "symbol" : t
    }
    function s(e) {
        var t = a(e)
        if ("object" === t) {
            if (e instanceof Date) return "date"
            if (e instanceof RegExp) return "regexp"
        }
        return t
    }
    function c(e, n) {
        return o(function(r, o, i, c, u) {
            return t.untracked(function() {
                if (e && a(r[o]) === n.toLowerCase()) return null
                var c = void 0
                switch (n) {
                    case "Array":
                        c = t.isObservableArray
                        break
                    case "Object":
                        c = t.isObservableObject
                        break
                    case "Map":
                        c = t.isObservableMap
                        break
                    default:
                        throw new Error("Unexpected mobxType: " + n)
                }
                var p = r[o]
                if (!c(p)) {
                    var l = s(p),
                        f = e ? " or javascript `" + n.toLowerCase() + "`" : ""
                    return new Error(
                        "Invalid prop `" +
                            u +
                            "` of type `" +
                            l +
                            "` supplied to `" +
                            i +
                            "`, expected `mobx.Observable" +
                            n +
                            "`" +
                            f +
                            "."
                    )
                }
                return null
            })
        })
    }
    function u(e, n) {
        return o(function(r, o, i, a, s) {
            for (var u = arguments.length, p = Array(u > 5 ? u - 5 : 0), l = 5; l < u; l++)
                p[l - 5] = arguments[l]
            return t.untracked(function() {
                if ("function" != typeof n)
                    return new Error(
                        "Property `" +
                            s +
                            "` of component `" +
                            i +
                            "` has invalid PropType notation."
                    )
                var t = c(e, "Array")(r, o, i)
                if (t instanceof Error) return t
                for (var u = r[o], l = 0; l < u.length; l++)
                    if (
                        (t = n.apply(void 0, [u, l, i, a, s + "[" + l + "]"].concat(p))) instanceof
                        Error
                    )
                        return t
                return null
            })
        })
    }
    function p(e) {
        return !(e.prototype && e.prototype.render)
    }
    function l(e, t, r) {
        var o,
            i,
            a =
                "inject-" +
                (t.displayName || t.name || (t.constructor && t.constructor.name) || "Unknown")
        r && (a += "-with-" + r)
        var s = ((i = o = (function(r) {
            function o() {
                var e, t, n, r
                j(this, o)
                for (var i = arguments.length, a = Array(i), s = 0; s < i; s++) a[s] = arguments[s]
                return (
                    (t = n = C(
                        this,
                        (e = o.__proto__ || Object.getPrototypeOf(o)).call.apply(
                            e,
                            [this].concat(a)
                        )
                    )),
                    (n.storeRef = function(e) {
                        n.wrappedInstance = e
                    }),
                    (r = t),
                    C(n, r)
                )
            }
            return (
                P(o, r),
                k(o, [
                    {
                        key: "render",
                        value: function() {
                            var r = {}
                            for (var o in this.props)
                                this.props.hasOwnProperty(o) && (r[o] = this.props[o])
                            var i = e(this.context.mobxStores || {}, r, this.context) || {}
                            for (var a in i) r[a] = i[a]
                            return p(t) || (r.ref = this.storeRef), n.createElement(t, r)
                        }
                    }
                ]),
                o
            )
        })(n.Component)),
        (o.displayName = a),
        i)
        return N(s, t), (s.wrappedComponent = t), Object.defineProperties(s, V), s
    }
    function f(e) {
        return function(t, n) {
            return (
                e.forEach(function(e) {
                    if (!(e in n)) {
                        if (!(e in t))
                            throw new Error(
                                "MobX injector: Store '" +
                                    e +
                                    "' is not available! Make sure it is provided by some Provider"
                            )
                        n[e] = t[e]
                    }
                }),
                n
            )
        }
    }
    function d() {
        var e = void 0
        if ("function" == typeof arguments[0])
            return (
                (e = arguments[0]),
                function(t) {
                    var n = l(e, t)
                    return (n.isMobxInjector = !1), (n = g(n)), (n.isMobxInjector = !0), n
                }
            )
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
        return (
            (e = f(t)),
            function(n) {
                return l(e, n, t.join("-"))
            }
        )
    }
    function y(e) {
        if (r.findDOMNode)
            try {
                return r.findDOMNode(e)
            } catch (e) {
                return null
            }
        return null
    }
    function b(e) {
        var t = y(e)
        t && J && J.set(t, e),
            Q.emit({
                event: "render",
                renderTime: e.__$mobRenderEnd - e.__$mobRenderStart,
                totalTime: Date.now() - e.__$mobRenderStart,
                component: e,
                node: t
            })
    }
    function h() {
        if ("undefined" == typeof WeakMap)
            throw new Error("[mobx-react] tracking components is not supported in this browser.")
        F || (F = !0)
    }
    function v(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            r = e[t],
            o = ee[t],
            i = r
                ? !0 === n
                  ? function() {
                        o.apply(this, arguments), r.apply(this, arguments)
                    }
                  : function() {
                        r.apply(this, arguments), o.apply(this, arguments)
                    }
                : o
        e[t] = i
    }
    function m(e, t) {
        if (O(e, t)) return !0
        if (
            "object" !== (void 0 === e ? "undefined" : _(e)) ||
            null === e ||
            "object" !== (void 0 === t ? "undefined" : _(t)) ||
            null === t
        )
            return !1
        var n = Object.keys(e),
            r = Object.keys(t)
        if (n.length !== r.length) return !1
        for (var o = 0; o < n.length; o++)
            if (!hasOwnProperty.call(t, n[o]) || !O(e[n[o]], t[n[o]])) return !1
        return !0
    }
    function O(e, t) {
        return e === t ? 0 !== e || 1 / e == 1 / t : e !== e && t !== t
    }
    function g(e, t) {
        if ("string" == typeof e) throw new Error("Store names should be provided as array")
        if (Array.isArray(e))
            return (
                Y ||
                    ((Y = !0),
                    console.warn(
                        'Mobx observer: Using observer to inject stores is deprecated since 4.0. Use `@inject("store1", "store2") @observer ComponentClass` or `inject("store1", "store2")(observer(componentClass))` instead of `@observer(["store1", "store2"]) ComponentClass`'
                    )),
                t
                    ? d.apply(null, e)(g(t))
                    : function(t) {
                          return g(e, t)
                      }
            )
        var r = e
        if (
            (!0 === r.isMobxInjector &&
                console.warn(
                    "Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"
                ),
            !(
                "function" != typeof r ||
                (r.prototype && r.prototype.render) ||
                r.isReactClass ||
                n.Component.isPrototypeOf(r)
            ))
        ) {
            var o, i
            return g(
                ((i = o = (function(e) {
                    function t() {
                        return (
                            j(this, t),
                            C(
                                this,
                                (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
                            )
                        )
                    }
                    return (
                        P(t, e),
                        k(t, [
                            {
                                key: "render",
                                value: function() {
                                    return r.call(this, this.props, this.context)
                                }
                            }
                        ]),
                        t
                    )
                })(n.Component)),
                (o.displayName = r.displayName || r.name),
                (o.contextTypes = r.contextTypes),
                (o.propTypes = r.propTypes),
                (o.defaultProps = r.defaultProps),
                i)
            )
        }
        if (!r) throw new Error("Please pass a valid component to 'observer'")
        return w(r.prototype || r), (r.isMobXReactObserver = !0), r
    }
    function w(e) {
        v(e, "componentWillMount", !0),
            ["componentDidMount", "componentWillUnmount", "componentDidUpdate"].forEach(function(
                t
            ) {
                v(e, t)
            }),
            e.shouldComponentUpdate || (e.shouldComponentUpdate = ee.shouldComponentUpdate)
    }
    var x = "default" in n ? n.default : n,
        _ =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function(e) {
                      return typeof e
                  }
                : function(e) {
                      return e &&
                          "function" == typeof Symbol &&
                          e.constructor === Symbol &&
                          e !== Symbol.prototype
                          ? "symbol"
                          : typeof e
                  },
        j = ((function() {
            function e(e) {
                this.value = e
            }
            function t(t) {
                function n(o, i) {
                    try {
                        var a = t[o](i),
                            s = a.value
                        s instanceof e
                            ? Promise.resolve(s.value).then(
                                  function(e) {
                                      n("next", e)
                                  },
                                  function(e) {
                                      n("throw", e)
                                  }
                              )
                            : r(a.done ? "return" : "normal", a.value)
                    } catch (e) {
                        r("throw", e)
                    }
                }
                function r(e, t) {
                    switch (e) {
                        case "return":
                            o.resolve({ value: t, done: !0 })
                            break
                        case "throw":
                            o.reject(t)
                            break
                        default:
                            o.resolve({ value: t, done: !1 })
                    }
                    ;(o = o.next) ? n(o.key, o.arg) : (i = null)
                }
                var o, i
                ;(this._invoke = function(e, t) {
                    return new Promise(function(r, a) {
                        var s = { key: e, arg: t, resolve: r, reject: a, next: null }
                        i ? (i = i.next = s) : ((o = i = s), n(e, t))
                    })
                }),
                    "function" != typeof t.return && (this.return = void 0)
            }
            "function" == typeof Symbol &&
                Symbol.asyncIterator &&
                (t.prototype[Symbol.asyncIterator] = function() {
                    return this
                }),
                (t.prototype.next = function(e) {
                    return this._invoke("next", e)
                }),
                (t.prototype.throw = function(e) {
                    return this._invoke("throw", e)
                }),
                (t.prototype.return = function(e) {
                    return this._invoke("return", e)
                })
        })(),
        function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }),
        k = (function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n]
                    ;(r.enumerable = r.enumerable || !1),
                        (r.configurable = !0),
                        "value" in r && (r.writable = !0),
                        Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        })(),
        P = function(e, t) {
            if ("function" != typeof t && null !== t)
                throw new TypeError(
                    "Super expression must either be null or a function, not " + typeof t
                )
            ;(e.prototype = Object.create(t && t.prototype, {
                constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 }
            })),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : (e.__proto__ = t))
        },
        C = function(e, t) {
            if (!e)
                throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                )
            return !t || ("object" != typeof t && "function" != typeof t) ? e : t
        },
        S = (function() {
            function e() {
                j(this, e), (this.listeners = [])
            }
            return (
                k(e, [
                    {
                        key: "on",
                        value: function(e) {
                            var t = this
                            return (
                                this.listeners.push(e),
                                function() {
                                    var n = t.listeners.indexOf(e)
                                    ;-1 !== n && t.listeners.splice(n, 1)
                                }
                            )
                        }
                    },
                    {
                        key: "emit",
                        value: function(e) {
                            this.listeners.forEach(function(t) {
                                return t(e)
                            })
                        }
                    }
                ]),
                e
            )
        })(),
        M = {
            childContextTypes: !0,
            contextTypes: !0,
            defaultProps: !0,
            displayName: !0,
            getDefaultProps: !0,
            mixins: !0,
            propTypes: !0,
            type: !0
        },
        E = {
            name: !0,
            length: !0,
            prototype: !0,
            caller: !0,
            callee: !0,
            arguments: !0,
            arity: !0
        },
        R = Object.defineProperty,
        T = Object.getOwnPropertyNames,
        I = Object.getOwnPropertySymbols,
        A = Object.getOwnPropertyDescriptor,
        D = Object.getPrototypeOf,
        U = D && D(Object),
        N = function e(t, n, r) {
            if ("string" != typeof n) {
                if (U) {
                    var o = D(n)
                    o && o !== U && e(t, o, r)
                }
                var i = T(n)
                I && (i = i.concat(I(n)))
                for (var a = 0; a < i.length; ++a) {
                    var s = i[a]
                    if (!(M[s] || E[s] || (r && r[s]))) {
                        var c = A(n, s)
                        try {
                            R(t, s, c)
                        } catch (e) {}
                    }
                }
                return t
            }
            return t
        },
        W = c(!1, "Array"),
        L = u.bind(null, !1),
        $ = c(!1, "Map"),
        q = c(!1, "Object"),
        B = c(!0, "Array"),
        X = u.bind(null, !0),
        H = c(!0, "Object"),
        G = Object.freeze({
            observableArray: W,
            observableArrayOf: L,
            observableMap: $,
            observableObject: q,
            arrayOrObservableArray: B,
            arrayOrObservableArrayOf: X,
            objectOrObservableObject: H
        }),
        K = { mobxStores: H }
    Object.seal(K)
    var V = {
            contextTypes: {
                get: function() {
                    return K
                },
                set: function(e) {
                    console.warn(
                        "Mobx Injector: you are trying to attach `contextTypes` on an component decorated with `inject` (or `observer`) HOC. Please specify the contextTypes on the wrapped component instead. It is accessible through the `wrappedComponent`"
                    )
                },
                configurable: !0,
                enumerable: !1
            },
            isMobxInjector: { value: !0, writable: !0, configurable: !0, enumerable: !0 }
        },
        F = !1,
        z = !1,
        Y = !1,
        J = "undefined" != typeof WeakMap ? new WeakMap() : void 0,
        Q = new S(),
        Z = new S(),
        ee = {
            componentWillMount: function() {
                function e(e) {
                    var n = this[e],
                        r = new t.Atom("reactive " + e)
                    Object.defineProperty(this, e, {
                        configurable: !0,
                        enumerable: !0,
                        get: function() {
                            return r.reportObserved(), n
                        },
                        set: function(e) {
                            s || m(n, e)
                                ? (n = e)
                                : ((n = e), (a = !0), r.reportChanged(), (a = !1))
                        }
                    })
                }
                var r = this
                if (!0 !== z) {
                    var o =
                            this.displayName ||
                            this.name ||
                            (this.constructor &&
                                (this.constructor.displayName || this.constructor.name)) ||
                            "<component>",
                        i =
                            (this._reactInternalInstance &&
                                this._reactInternalInstance._rootNodeID) ||
                            (this._reactInternalFiber && this._reactInternalFiber._debugID),
                        a = !1,
                        s = !1
                    e.call(this, "props"), e.call(this, "state")
                    var c = this.render.bind(this),
                        u = null,
                        p = !1,
                        l = function() {
                            p = !1
                            var e = void 0,
                                n = void 0
                            if (
                                (u.track(function() {
                                    F && (r.__$mobRenderStart = Date.now())
                                    try {
                                        n = t.extras.allowStateChanges(!1, c)
                                    } catch (t) {
                                        e = t
                                    }
                                    F && (r.__$mobRenderEnd = Date.now())
                                }),
                                e)
                            )
                                throw (Z.emit(e), e)
                            return n
                        }
                    this.render = function() {
                        return (
                            (u = new t.Reaction(o + "#" + i + ".render()", function() {
                                if (
                                    !p &&
                                    ((p = !0),
                                    "function" == typeof r.componentWillReact &&
                                        r.componentWillReact(),
                                    !0 !== r.__$mobxIsUnmounted)
                                ) {
                                    var e = !0
                                    try {
                                        ;(s = !0),
                                            a || n.Component.prototype.forceUpdate.call(r),
                                            (e = !1)
                                    } finally {
                                        ;(s = !1), e && u.dispose()
                                    }
                                }
                            })),
                            (u.reactComponent = r),
                            (l.$mobx = u),
                            (r.render = l),
                            l()
                        )
                    }
                }
            },
            componentWillUnmount: function() {
                if (
                    !0 !== z &&
                    (this.render.$mobx && this.render.$mobx.dispose(),
                    (this.__$mobxIsUnmounted = !0),
                    F)
                ) {
                    var e = y(this)
                    e && J && J.delete(e), Q.emit({ event: "destroy", component: this, node: e })
                }
            },
            componentDidMount: function() {
                F && b(this)
            },
            componentDidUpdate: function() {
                F && b(this)
            },
            shouldComponentUpdate: function(e, t) {
                return (
                    z &&
                        console.warn(
                            "[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side."
                        ),
                    this.state !== t || !m(this.props, e)
                )
            }
        },
        te = g(function(e) {
            var t = e.children,
                n = e.inject,
                r = e.render,
                o = t || r
            if (void 0 === o) return null
            if (!n) return o()
            var i = d(n)(o)
            return x.createElement(i, null)
        })
    te.displayName = "Observer"
    var ne = function(e, t, n, r, o) {
        var i = "children" === t ? "render" : "children"
        if ("function" == typeof e[t] && "function" == typeof e[i])
            return new Error("Invalid prop,do not use children and render in the same time in`" + n)
        if ("function" != typeof e[t] && "function" != typeof e[i])
            return new Error(
                "Invalid prop `" +
                    o +
                    "` of type `" +
                    _(e[t]) +
                    "` supplied to `" +
                    n +
                    "`, expected `function`."
            )
    }
    te.propTypes = { render: ne, children: ne }
    var re,
        oe,
        ie = { children: !0, key: !0, ref: !0 },
        ae = ((oe = re = (function(e) {
            function t() {
                return (
                    j(this, t),
                    C(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                )
            }
            return (
                P(t, e),
                k(t, [
                    {
                        key: "render",
                        value: function() {
                            return n.Children.only(this.props.children)
                        }
                    },
                    {
                        key: "getChildContext",
                        value: function() {
                            var e = {},
                                t = this.context.mobxStores
                            if (t) for (var n in t) e[n] = t[n]
                            for (var r in this.props)
                                ie[r] ||
                                    "suppressChangedStoreWarning" === r ||
                                    (e[r] = this.props[r])
                            return { mobxStores: e }
                        }
                    },
                    {
                        key: "componentWillReceiveProps",
                        value: function(e) {
                            if (
                                (Object.keys(e).length !== Object.keys(this.props).length &&
                                    console.warn(
                                        "MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children"
                                    ),
                                !e.suppressChangedStoreWarning)
                            )
                                for (var t in e)
                                    ie[t] ||
                                        this.props[t] === e[t] ||
                                        console.warn(
                                            "MobX Provider: Provided store '" +
                                                t +
                                                "' has changed. Please avoid replacing stores as the change might not propagate to all children"
                                        )
                        }
                    }
                ]),
                t
            )
        })(n.Component)),
        (re.contextTypes = { mobxStores: H }),
        (re.childContextTypes = { mobxStores: H.isRequired }),
        oe)
    if (!n.Component) throw new Error("mobx-react requires React to be available")
    if (!t.extras) throw new Error("mobx-react requires mobx to be available")
    "function" == typeof r.unstable_batchedUpdates &&
        t.extras.setReactionScheduler(r.unstable_batchedUpdates)
    if (
        "object" ===
        ("undefined" == typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__
            ? "undefined"
            : _(__MOBX_DEVTOOLS_GLOBAL_HOOK__))
    ) {
        var se = { spy: t.spy, extras: t.extras },
            ce = { renderReporter: Q, componentByNodeRegistery: J, trackComponents: h }
        __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobxReact(ce, se)
    }
    ;(e.propTypes = G),
        (e.PropTypes = G),
        (e.onError = function(e) {
            return Z.on(e)
        }),
        (e.observer = g),
        (e.Observer = te),
        (e.renderReporter = Q),
        (e.componentByNodeRegistery = J),
        (e.trackComponents = h),
        (e.useStaticRendering = function(e) {
            z = e
        }),
        (e.Provider = ae),
        (e.inject = d),
        Object.defineProperty(e, "__esModule", { value: !0 })
})
