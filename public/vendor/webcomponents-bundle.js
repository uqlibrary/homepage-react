/**
@license @nocompile
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function() {
    /*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 Google as part of the polymer project is also subject to an additional IP
 rights grant found at http://polymer.github.io/PATENTS.txt
*/
    'use strict';
    let v;
    function ba(a) {
        let b = 0;
        return function() {
            return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
        };
    }
    const ca =
        typeof Object.defineProperties === 'function'
            ? Object.defineProperty
            : function(a, b, c) {
                  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
              };
    const da =
        typeof window !== 'undefined' && window === this
            ? this
            : typeof global !== 'undefined' && global != null
            ? global
            : this;
    function ea() {
        ea = function() {};
        da.Symbol || (da.Symbol = ha);
    }
    function ia(a, b) {
        this.a = a;
        ca(this, 'description', { configurable: !0, writable: !0, value: b });
    }
    ia.prototype.toString = function() {
        return this.a;
    };
    var ha = (function() {
        function a(c) {
            if (this instanceof a) throw new TypeError('Symbol is not a constructor');
            return new ia('jscomp_symbol_' + (c || '') + '_' + b++, c);
        }
        var b = 0;
        return a;
    })();
    function ja() {
        ea();
        let a = da.Symbol.iterator;
        a || (a = da.Symbol.iterator = da.Symbol('Symbol.iterator'));
        typeof Array.prototype[a] !== 'function' &&
            ca(Array.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return ma(ba(this));
                },
            });
        ja = function() {};
    }
    function ma(a) {
        ja();
        a = { next: a };
        a[da.Symbol.iterator] = function() {
            return this;
        };
        return a;
    }
    function na(a) {
        const b = typeof Symbol !== 'undefined' && Symbol.iterator && a[Symbol.iterator];
        return b ? b.call(a) : { next: ba(a) };
    }
    function x(a) {
        if (!(a instanceof Array)) {
            a = na(a);
            for (var b, c = []; !(b = a.next()).done; ) c.push(b.value);
            a = c;
        }
        return a;
    }
    let oa;
    if (typeof Object.setPrototypeOf === 'function') oa = Object.setPrototypeOf;
    else {
        let pa;
        a: {
            const qa = { Pa: !0 };
            const ra = {};
            try {
                ra.__proto__ = qa;
                pa = ra.Pa;
                break a;
            } catch (a) {}
            pa = !1;
        }
        oa = pa
            ? function(a, b) {
                  a.__proto__ = b;
                  if (a.__proto__ !== b) throw new TypeError(a + ' is not extensible');
                  return a;
              }
            : null;
    }
    const sa = oa;
    function ta() {
        this.l = !1;
        this.b = null;
        this.Ea = void 0;
        this.a = 1;
        this.Y = 0;
        this.c = null;
    }
    function ua(a) {
        if (a.l) throw new TypeError('Generator is already running');
        a.l = !0;
    }
    ta.prototype.J = function(a) {
        this.Ea = a;
    };
    function xa(a, b) {
        a.c = { Sa: b, Wa: !0 };
        a.a = a.Y;
    }
    ta.prototype.return = function(a) {
        this.c = { return: a };
        this.a = this.Y;
    };
    function Aa(a, b) {
        a.a = 3;
        return { value: b };
    }
    function Ba(a) {
        this.a = new ta();
        this.b = a;
    }
    function Ca(a, b) {
        ua(a.a);
        const c = a.a.b;
        if (c) {
            return Da(
                a,
                'return' in c
                    ? c.return
                    : function (d) {
                          return { value: d, done: !0 };
                      },
                b,
                a.a.return,
            );
        }
        a.a.return(b);
        return Ea(a);
    }
    function Da(a, b, c, d) {
        try {
            const e = b.call(a.a.b, c);
            if (!(e instanceof Object)) throw new TypeError('Iterator result ' + e + ' is not an object');
            if (!e.done) return (a.a.l = !1), e;
            var f = e.value;
        } catch (g) {
            return (a.a.b = null), xa(a.a, g), Ea(a);
        }
        a.a.b = null;
        d.call(a.a, f);
        return Ea(a);
    }
    function Ea(a) {
        for (; a.a.a; ) {
            try {
                var b = a.b(a.a);
                if (b) return (a.a.l = !1), { value: b.value, done: !1 };
            } catch (c) {
                (a.a.Ea = void 0), xa(a.a, c);
            }
        }
        a.a.l = !1;
        if (a.a.c) {
            b = a.a.c;
            a.a.c = null;
            if (b.Wa) throw b.Sa;
            return { value: b.return, done: !0 };
        }
        return { value: void 0, done: !0 };
    }
    function Fa(a) {
        this.next = function(b) {
            ua(a.a);
            a.a.b ? (b = Da(a, a.a.b.next, b, a.a.J)) : (a.a.J(b), (b = Ea(a)));
            return b;
        };
        this.throw = function(b) {
            ua(a.a);
            a.a.b ? (b = Da(a, a.a.b.throw, b, a.a.J)) : (xa(a.a, b), (b = Ea(a)));
            return b;
        };
        this.return = function(b) {
            return Ca(a, b);
        };
        ja();
        this[Symbol.iterator] = function() {
            return this;
        };
    }
    function Ga(a, b) {
        b = new Fa(new Ba(b));
        sa && sa(b, a.prototype);
        return b;
    }
    Array.from ||
        (Array.from = function(a) {
            return [].slice.call(a);
        });
    Object.assign ||
        (Object.assign = function(a) {
            for (var b = [].slice.call(arguments, 1), c = 0, d; c < b.length; c++) {
                if ((d = b[c])) {
                    for (let e = a, f = Object.keys(d), g = 0; g < f.length; g++) {
                        const h = f[g];
                        e[h] = d[h];
                    }
                }
            }
            return a;
        });
    const Ha = setTimeout;
    function Ia() {}
    function Ja(a, b) {
        return function() {
            a.apply(b, arguments);
        };
    }
    function A(a) {
        if (!(this instanceof A)) throw new TypeError('Promises must be constructed via new');
        if (typeof a !== 'function') throw new TypeError('not a function');
        this.I = 0;
        this.za = !1;
        this.C = void 0;
        this.W = [];
        Ka(a, this);
    }
    function La(a, b) {
        for (; a.I === 3; ) a = a.C;
        a.I === 0
            ? a.W.push(b)
            : ((a.za = !0),
              Ma(function() {
                  const c = a.I === 1 ? b.Ya : b.Za;
                  if (c === null) (a.I === 1 ? Na : Oa)(b.va, a.C);
                  else {
                      try {
                          var d = c(a.C);
                      } catch (e) {
                          Oa(b.va, e);
                          return;
                      }
                      Na(b.va, d);
                  }
              }));
    }
    function Na(a, b) {
        try {
            if (b === a) throw new TypeError('A promise cannot be resolved with itself.');
            if (b && (typeof b === 'object' || typeof b === 'function')) {
                const c = b.then;
                if (b instanceof A) {
                    a.I = 3;
                    a.C = b;
                    Pa(a);
                    return;
                }
                if (typeof c === 'function') {
                    Ka(Ja(c, b), a);
                    return;
                }
            }
            a.I = 1;
            a.C = b;
            Pa(a);
        } catch (d) {
            Oa(a, d);
        }
    }
    function Oa(a, b) {
        a.I = 2;
        a.C = b;
        Pa(a);
    }
    function Pa(a) {
        a.I === 2 &&
            a.W.length === 0 &&
            Ma(function() {
                a.za ||
                    (typeof console !== 'undefined' &&
                        console &&
                        console.warn('Possible Unhandled Promise Rejection:', a.C));
            });
        for (let b = 0, c = a.W.length; b < c; b++) La(a, a.W[b]);
        a.W = null;
    }
    function Qa(a, b, c) {
        this.Ya = typeof a === 'function' ? a : null;
        this.Za = typeof b === 'function' ? b : null;
        this.va = c;
    }
    function Ka(a, b) {
        let c = !1;
        try {
            a(
                function(d) {
                    c || ((c = !0), Na(b, d));
                },
                function(d) {
                    c || ((c = !0), Oa(b, d));
                },
            );
        } catch (d) {
            c || ((c = !0), Oa(b, d));
        }
    }
    A.prototype.catch = function(a) {
        return this.then(null, a);
    };
    A.prototype.then = function(a, b) {
        const c = new this.constructor(Ia);
        La(this, new Qa(a, b, c));
        return c;
    };
    A.prototype.finally = function(a) {
        const b = this.constructor;
        return this.then(
            function(c) {
                return b.resolve(a()).then(function() {
                    return c;
                });
            },
            function(c) {
                return b.resolve(a()).then(function() {
                    return b.reject(c);
                });
            },
        );
    };
    function Ra(a) {
        return new A(function(b, c) {
            function d(h, k) {
                try {
                    if (k && (typeof k === 'object' || typeof k === 'function')) {
                        const l = k.then;
                        if (typeof l === 'function') {
                            l.call(
                                k,
                                function(m) {
                                    d(h, m);
                                },
                                c,
                            );
                            return;
                        }
                    }
                    e[h] = k;
                    --f === 0 && b(e);
                } catch (m) {
                    c(m);
                }
            }
            if (!a || typeof a.length === 'undefined') return c(new TypeError('Promise.all accepts an array'));
            var e = Array.prototype.slice.call(a);
            if (e.length === 0) return b([]);
            for (var f = e.length, g = 0; g < e.length; g++) d(g, e[g]);
        });
    }
    function Sa(a) {
        return a && typeof a === 'object' && a.constructor === A
            ? a
            : new A(function(b) {
                  b(a);
              });
    }
    function Ta(a) {
        return new A(function(b, c) {
            c(a);
        });
    }
    function Ua(a) {
        return new A(function(b, c) {
            if (!a || typeof a.length === 'undefined') return c(new TypeError('Promise.race accepts an array'));
            for (let d = 0, e = a.length; d < e; d++) Sa(a[d]).then(b, c);
        });
    }
    var Ma =
        (typeof setImmediate === 'function' &&
            function(a) {
                setImmediate(a);
            }) ||
        function(a) {
            Ha(a, 0);
        }; /*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
    if (!window.Promise) {
        window.Promise = A;
        A.prototype.then = A.prototype.then;
        A.all = Ra;
        A.race = Ua;
        A.resolve = Sa;
        A.reject = Ta;
        const Va = document.createTextNode('');
        const Xa = [];
        new MutationObserver(function() {
            for (var a = Xa.length, b = 0; b < a; b++) Xa[b]();
            Xa.splice(0, a);
        }).observe(Va, { characterData: !0 });
        Ma = function(a) {
            Xa.push(a);
            Va.textContent = Va.textContent.length > 0 ? '' : 'a';
        };
    } /*
 Copyright (C) 2015 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
    (function(a, b) {
        if (!(b in a)) {
            var c = typeof global === typeof c ? window : global;
            let d = 0;
            const e = '' + Math.random();
            const f = '__\u0001symbol@@' + e;
            const g = a.getOwnPropertyNames;
            const h = a.getOwnPropertyDescriptor;
            const k = a.create;
            const l = a.keys;
            const m = a.freeze || a;
            const q = a.defineProperty;
            const H = a.defineProperties;
            const C = h(a, 'getOwnPropertyNames');
            const t = a.prototype;
            const F = t.hasOwnProperty;
            const E = t.propertyIsEnumerable;
            const M = t.toString;
            const y = function (I, u, G) {
                F.call(I, f) || q(I, f, { enumerable: !1, configurable: !1, writable: !1, value: {} });
                I[f]['@@' + u] = G;
            };
            const W = function (I, u) {
                const G = k(I);
                g(u).forEach(function (p) {
                    va.call(u, p) && Wa(G, p, u[p]);
                });
                return G;
            };
            const w = function () {};
            const wa = function (I) {
                return I != f && !F.call(ka, I);
            };
            const fa = function (I) {
                return I != f && F.call(ka, I);
            };
            var va = function (I) {
                const u = '' + I;
                return fa(u) ? F.call(this, u) && this[f]['@@' + u] : E.call(this, I);
            };
            const n = function (I) {
                q(t, I, {
                    enumerable: !1,
                    configurable: !0,
                    get: w,
                    set: function (u) {
                        za(this, I, { enumerable: !1, configurable: !0, writable: !0, value: u });
                        y(this, I, !0);
                    },
                });
                return m((ka[I] = q(a(I), 'constructor', hc)));
            };
            const J = function G(u) {
                if (this instanceof G) throw new TypeError('Symbol is not a constructor');
                return n('__\u0001symbol:'.concat(u || '', e, ++d));
            };
            var ka = k(null);
            var hc = { value: J };
            const hb = function (u) {
                return ka[u];
            };
            var Wa = function (u, G, p) {
                const r = '' + G;
                if (fa(r)) {
                    G = za;
                    if (p.enumerable) {
                        var B = k(p);
                        B.enumerable = !1;
                    } else B = p;
                    G(u, r, B);
                    y(u, r, !!p.enumerable);
                } else q(u, G, p);
                return u;
            };
            const ib = function(u) {
                return g(u)
                    .filter(fa)
                    .map(hb);
            };
            C.value = Wa;
            q(a, 'defineProperty', C);
            C.value = ib;
            q(a, b, C);
            C.value = function(u) {
                return g(u).filter(wa);
            };
            q(a, 'getOwnPropertyNames', C);
            C.value = function(u, G) {
                const p = ib(G);
                p.length
                    ? l(G)
                          .concat(p)
                          .forEach(function(r) {
                              va.call(G, r) && Wa(u, r, G[r]);
                          })
                    : H(u, G);
                return u;
            };
            q(a, 'defineProperties', C);
            C.value = va;
            q(t, 'propertyIsEnumerable', C);
            C.value = J;
            q(c, 'Symbol', C);
            C.value = function(u) {
                u = '__\u0001symbol:'.concat('__\u0001symbol:', u, e);
                return u in t ? ka[u] : n(u);
            };
            q(J, 'for', C);
            C.value = function(u) {
                if (wa(u)) throw new TypeError(u + ' is not a symbol');
                if (
                    F.call(ka, u) &&
                    ((u = u.slice(10)), u.slice(0, 10) === '__\u0001symbol:' && ((u = u.slice(10)), u !== e))
                ) {
                    return (u = u.slice(0, u.length - e.length)), u.length > 0 ? u : void 0;
                }
            };
            q(J, 'keyFor', C);
            C.value = function(u, G) {
                const p = h(u, G);
                p && fa(G) && (p.enumerable = va.call(u, G));
                return p;
            };
            q(a, 'getOwnPropertyDescriptor', C);
            C.value = function(u, G) {
                return arguments.length === 1 || typeof G === 'undefined' ? k(u) : W(u, G);
            };
            q(a, 'create', C);
            C.value = function() {
                const u = M.call(this);
                return u === '[object String]' && fa(this) ? '[object Symbol]' : u;
            };
            q(t, 'toString', C);
            try {
                if (
                    !0 ===
                    k(
                        q({}, '__\u0001symbol:', {
                            get: function() {
                                return q(this, '__\u0001symbol:', { value: !0 })['__\u0001symbol:'];
                            },
                        }),
                    )['__\u0001symbol:']
                ) {
                    var za = q;
                } else throw 'IE11';
            } catch (u) {
                za = function(G, p, r) {
                    const B = h(t, p);
                    delete t[p];
                    q(G, p, r);
                    q(t, p, B);
                };
            }
        }
    })(Object, 'getOwnPropertySymbols');
    (function(a, b) {
        const c = a.defineProperty;
        const d = a.prototype;
        const e = d.toString;
        let f;
        'iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag'
            .split(' ')
            .forEach(function(g) {
                if (!(g in b)) {
                    switch ((c(b, g, { value: b(g) }), g)) {
                        case 'toStringTag':
                            (f = a.getOwnPropertyDescriptor(d, 'toString')),
                                (f.value = function () {
                                    const h = e.call(this);
                                    const k = this != null ? this[b.toStringTag] : this;
                                    return k == null ? h : '[object ' + k + ']';
                                }),
                                c(d, 'toString', f);
                    }
                }
            });
    })(Object, Symbol);
    (function(a, b, c) {
        function d() {
            return this;
        }
        b[a] ||
            (b[a] = function() {
                let e = 0;
                const f = this;
                const g = {
                    next: function() {
                        const h = f.length <= e;
                        return h ? { done: h } : { done: h, value: f[e++] };
                    },
                };
                g[a] = d;
                return g;
            });
        c[a] ||
            (c[a] = function() {
                const e = String.fromCodePoint;
                const f = this;
                let g = 0;
                const h = f.length;
                const k = {
                    next: function() {
                        const l = h <= g;
                        const m = l ? '' : e(f.codePointAt(g));
                        g += m.length;
                        return l ? { done: l } : { done: l, value: m };
                    },
                };
                k[a] = d;
                return k;
            });
    })(
        Symbol.iterator,
        Array.prototype,
        String.prototype,
    ); /*

Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
    const Ya = Object.prototype.toString;
    Object.prototype.toString = function() {
        return void 0 === this ? '[object Undefined]' : this === null ? '[object Null]' : Ya.call(this);
    };
    Object.keys = function(a) {
        return Object.getOwnPropertyNames(a).filter(function(b) {
            return (b = Object.getOwnPropertyDescriptor(a, b)) && b.enumerable;
        });
    };
    ea();
    ja();
    (String.prototype[Symbol.iterator] && String.prototype.codePointAt) ||
        (ea(),
        ja(),
        (String.prototype[Symbol.iterator] = function b() {
            let c;
            const d = this;
            return Ga(b, function(e) {
                e.a == 1 && (c = 0);
                if (e.a != 3) return c < d.length ? (e = Aa(e, d[c])) : ((e.a = 0), (e = void 0)), e;
                c++;
                e.a = 2;
            });
        }));
    ea();
    ja();
    Set.prototype[Symbol.iterator] ||
        (ea(),
        ja(),
        (Set.prototype[Symbol.iterator] = function b() {
            let c;
            const d = this;
            let e;
            return Ga(b, function(f) {
                f.a == 1 &&
                    ((c = []),
                    d.forEach(function(g) {
                        c.push(g);
                    }),
                    (e = 0));
                if (f.a != 3) return e < c.length ? (f = Aa(f, c[e])) : ((f.a = 0), (f = void 0)), f;
                e++;
                f.a = 2;
            });
        }));
    ea();
    ja();
    Map.prototype[Symbol.iterator] ||
        (ea(),
        ja(),
        (Map.prototype[Symbol.iterator] = function b() {
            let c;
            const d = this;
            let e;
            return Ga(b, function(f) {
                f.a == 1 &&
                    ((c = []),
                    d.forEach(function(g, h) {
                        c.push([h, g]);
                    }),
                    (e = 0));
                if (f.a != 3) return e < c.length ? (f = Aa(f, c[e])) : ((f.a = 0), (f = void 0)), f;
                e++;
                f.a = 2;
            });
        })); /*

Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
    const Za = document.createEvent('Event');
    Za.initEvent('foo', !0, !0);
    Za.preventDefault();
    if (!Za.defaultPrevented) {
        const $a = Event.prototype.preventDefault;
        Event.prototype.preventDefault = function() {
            this.cancelable &&
                ($a.call(this),
                Object.defineProperty(this, 'defaultPrevented', {
                    get: function() {
                        return !0;
                    },
                    configurable: !0,
                }));
        };
    }
    const ab = /Trident/.test(navigator.userAgent);
    if (!window.Event || (ab && typeof window.Event !== 'function')) {
        const bb = window.Event;
        window.Event = function(a, b) {
            b = b || {};
            const c = document.createEvent('Event');
            c.initEvent(a, !!b.bubbles, !!b.cancelable);
            return c;
        };
        if (bb) {
            for (const cb in bb) window.Event[cb] = bb[cb];
            window.Event.prototype = bb.prototype;
        }
    }
    if (!window.CustomEvent || (ab && typeof window.CustomEvent !== 'function')) {
        (window.CustomEvent = function (a, b) {
            b = b || {};
            const c = document.createEvent('CustomEvent');
            c.initCustomEvent(a, !!b.bubbles, !!b.cancelable, b.detail);
            return c;
        }),
            (window.CustomEvent.prototype = window.Event.prototype);
    }
    if (!window.MouseEvent || (ab && typeof window.MouseEvent !== 'function')) {
        const db = window.MouseEvent;
        window.MouseEvent = function(a, b) {
            b = b || {};
            const c = document.createEvent('MouseEvent');
            c.initMouseEvent(
                a,
                !!b.bubbles,
                !!b.cancelable,
                b.view || window,
                b.detail,
                b.screenX,
                b.screenY,
                b.clientX,
                b.clientY,
                b.ctrlKey,
                b.altKey,
                b.shiftKey,
                b.metaKey,
                b.button,
                b.relatedTarget,
            );
            return c;
        };
        if (db) for (const eb in db) window.MouseEvent[eb] = db[eb];
        window.MouseEvent.prototype = db.prototype;
    }
    Object.getOwnPropertyDescriptor(Node.prototype, 'baseURI') ||
        Object.defineProperty(Node.prototype, 'baseURI', {
            get: function() {
                const a = (this.ownerDocument || this).querySelector('base[href]');
                return (a && a.href) || window.location.href;
            },
            configurable: !0,
            enumerable: !0,
        }); /*

Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
    let fb;
    let gb;
    const jb = Element.prototype;
    const kb =
        (fb = Object.getOwnPropertyDescriptor(jb, 'attributes')) !== null && void 0 !== fb
            ? fb
            : Object.getOwnPropertyDescriptor(Node.prototype, 'attributes');
    const lb =
        (gb = kb === null || void 0 === kb ? void 0 : kb.get) !== null && void 0 !== gb
            ? gb
            : function () {
                  return this.attributes;
              };
    const mb = Array.prototype.map;
    jb.hasOwnProperty('getAttributeNames') ||
        (jb.getAttributeNames = function() {
            return mb.call(lb.call(this), function(a) {
                return a.name;
            });
        });
    let pb;
    const qb = Element.prototype;
    qb.hasOwnProperty('matches') ||
        (qb.matches = (pb = qb.webkitMatchesSelector) !== null && void 0 !== pb ? pb : qb.msMatchesSelector);
    const rb = Node.prototype.appendChild;
    function sb(a) {
        a = a.prototype;
        a.hasOwnProperty('append') ||
            Object.defineProperty(a, 'append', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function(b) {
                    for (var c = [], d = 0; d < arguments.length; ++d) c[d] = arguments[d];
                    c = na(c);
                    for (d = c.next(); !d.done; d = c.next()) {
                        (d = d.value), rb.call(this, typeof d === 'string' ? document.createTextNode(d) : d);
                    }
                },
            });
    }
    sb(Document);
    sb(DocumentFragment);
    sb(Element);
    let tb;
    let ub;
    const vb = Node.prototype.insertBefore;
    const wb =
        (ub =
            (tb = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild')) === null || void 0 === tb
                ? void 0
                : tb.get) !== null && void 0 !== ub
            ? ub
            : function() {
                  return this.firstChild;
              };
    function xb(a) {
        a = a.prototype;
        a.hasOwnProperty('prepend') ||
            Object.defineProperty(a, 'prepend', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function(b) {
                    for (var c = [], d = 0; d < arguments.length; ++d) c[d] = arguments[d];
                    d = wb.call(this);
                    c = na(c);
                    for (let e = c.next(); !e.done; e = c.next()) {
                        (e = e.value), vb.call(this, typeof e === 'string' ? document.createTextNode(e) : e, d);
                    }
                },
            });
    }
    xb(Document);
    xb(DocumentFragment);
    xb(Element);
    let yb;
    let zb;
    const Ab = Node.prototype.appendChild;
    const Bb = Node.prototype.removeChild;
    const Cb =
        (zb =
            (yb = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild')) === null || void 0 === yb
                ? void 0
                : yb.get) !== null && void 0 !== zb
            ? zb
            : function() {
                  return this.firstChild;
              };
    function Db(a) {
        a = a.prototype;
        a.hasOwnProperty('replaceChildren') ||
            Object.defineProperty(a, 'replaceChildren', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function(b) {
                    for (var c = [], d = 0; d < arguments.length; ++d) c[d] = arguments[d];
                    for (; (d = Cb.call(this)) !== null; ) Bb.call(this, d);
                    c = na(c);
                    for (d = c.next(); !d.done; d = c.next()) {
                        (d = d.value), Ab.call(this, typeof d === 'string' ? document.createTextNode(d) : d);
                    }
                },
            });
    }
    Db(Document);
    Db(DocumentFragment);
    Db(Element);
    let Eb;
    let Fb;
    let Gb;
    let Hb;
    const Ib = Node.prototype.insertBefore;
    const Jb =
        (Fb =
            (Eb = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode')) === null || void 0 === Eb
                ? void 0
                : Eb.get) !== null && void 0 !== Fb
            ? Fb
            : function () {
                  return this.parentNode;
              };
    const Kb =
        (Hb =
            (Gb = Object.getOwnPropertyDescriptor(Node.prototype, 'nextSibling')) === null || void 0 === Gb
                ? void 0
                : Gb.get) !== null && void 0 !== Hb
            ? Hb
            : function() {
                  return this.nextSibling;
              };
    function Lb(a) {
        a = a.prototype;
        a.hasOwnProperty('after') ||
            Object.defineProperty(a, 'after', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function(b) {
                    for (var c = [], d = 0; d < arguments.length; ++d) c[d] = arguments[d];
                    d = Jb.call(this);
                    if (d !== null) {
                        const e = Kb.call(this);
                        c = na(c);
                        for (let f = c.next(); !f.done; f = c.next()) {
                            (f = f.value), Ib.call(d, typeof f === 'string' ? document.createTextNode(f) : f, e);
                        }
                    }
                },
            });
    }
    Lb(CharacterData);
    Lb(Element);
    let Mb;
    let Nb;
    const Ob = Node.prototype.insertBefore;
    const Pb =
        (Nb =
            (Mb = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode')) === null || void 0 === Mb
                ? void 0
                : Mb.get) !== null && void 0 !== Nb
            ? Nb
            : function() {
                  return this.parentNode;
              };
    function Qb(a) {
        a = a.prototype;
        a.hasOwnProperty('before') ||
            Object.defineProperty(a, 'before', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function(b) {
                    for (var c = [], d = 0; d < arguments.length; ++d) c[d] = arguments[d];
                    d = Pb.call(this);
                    if (d !== null) {
                        c = na(c);
                        for (let e = c.next(); !e.done; e = c.next()) {
                            (e = e.value), Ob.call(d, typeof e === 'string' ? document.createTextNode(e) : e, this);
                        }
                    }
                },
            });
    }
    Qb(CharacterData);
    Qb(Element);
    let Rb;
    let Sb;
    const Tb = Node.prototype.removeChild;
    const Ub =
        (Sb =
            (Rb = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode')) === null || void 0 === Rb
                ? void 0
                : Rb.get) !== null && void 0 !== Sb
            ? Sb
            : function() {
                  return this.parentNode;
              };
    function Vb(a) {
        a = a.prototype;
        a.hasOwnProperty('remove') ||
            Object.defineProperty(a, 'remove', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function() {
                    const b = Ub.call(this);
                    b && Tb.call(b, this);
                },
            });
    }
    Vb(CharacterData);
    Vb(Element);
    let Wb;
    let Xb;
    const Yb = Node.prototype.insertBefore;
    const Zb = Node.prototype.removeChild;
    const $b =
        (Xb =
            (Wb = Object.getOwnPropertyDescriptor(Node.prototype, 'parentNode')) === null || void 0 === Wb
                ? void 0
                : Wb.get) !== null && void 0 !== Xb
            ? Xb
            : function() {
                  return this.parentNode;
              };
    function ac(a) {
        a = a.prototype;
        a.hasOwnProperty('replaceWith') ||
            Object.defineProperty(a, 'replaceWith', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function(b) {
                    for (var c = [], d = 0; d < arguments.length; ++d) c[d] = arguments[d];
                    d = $b.call(this);
                    if (d !== null) {
                        c = na(c);
                        for (let e = c.next(); !e.done; e = c.next()) {
                            (e = e.value), Yb.call(d, typeof e === 'string' ? document.createTextNode(e) : e, this);
                        }
                        Zb.call(d, this);
                    }
                },
            });
    }
    ac(CharacterData);
    ac(Element);
    const bc = window.Element.prototype;
    const cc = window.HTMLElement.prototype;
    const dc = window.SVGElement.prototype;
    !cc.hasOwnProperty('classList') ||
        bc.hasOwnProperty('classList') ||
        dc.hasOwnProperty('classList') ||
        Object.defineProperty(
            bc,
            'classList',
            Object.getOwnPropertyDescriptor(cc, 'classList'),
        ); /*

 Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 Google as part of the polymer project is also subject to an additional IP
 rights grant found at http://polymer.github.io/PATENTS.txt
*/
    const ec = document.createElement('style');
    ec.textContent =
        'body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n';
    const fc = document.querySelector('head');
    fc.insertBefore(ec, fc.firstChild);
    const gc = window;
    gc.WebComponents = gc.WebComponents || { flags: {} };
    const ic = document.querySelector('script[src*="webcomponents-bundle"]');
    const jc = /wc-(.+)/;
    const kc = {};
    if (!kc.noOpts) {
        location.search
            .slice(1)
            .split('&')
            .forEach(function(a) {
                a = a.split('=');
                let b;
                a[0] && (b = a[0].match(jc)) && (kc[b[1]] = a[1] || !0);
            });
        if (ic) {
            for (let lc = 0, mc = void 0; (mc = ic.attributes[lc]); lc++) {
                mc.name !== 'src' && (kc[mc.name] = mc.value || !0);
            }
        }
        const nc = {};
        kc.log &&
            kc.log.split &&
            kc.log.split(',').forEach(function(a) {
                nc[a] = !0;
            });
        kc.log = nc;
    }
    gc.WebComponents.flags = kc;
    const oc = kc.shadydom;
    if (oc) {
        gc.ShadyDOM = gc.ShadyDOM || {};
        gc.ShadyDOM.force = oc;
        const pc = kc.noPatch;
        gc.ShadyDOM.noPatch = pc === 'true' ? !0 : pc;
    }
    const qc = kc.register || kc.ce;
    qc &&
        window.customElements &&
        (gc.customElements.forcePolyfill = qc); /*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
    (function() {
        function a() {}
        function b(p, r) {
            if (!p.childNodes.length) return [];
            switch (p.nodeType) {
                case Node.DOCUMENT_NODE:
                    return F.call(p, r);
                case Node.DOCUMENT_FRAGMENT_NODE:
                    return E.call(p, r);
                default:
                    return t.call(p, r);
            }
        }
        const c = typeof HTMLTemplateElement === 'undefined';
        const d = !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment);
        let e = !1;
        /Trident/.test(navigator.userAgent) &&
            (function() {
                function p(z, R) {
                    if (z instanceof DocumentFragment) for (var nb; (nb = z.firstChild); ) B.call(this, nb, R);
                    else B.call(this, z, R);
                    return z;
                }
                e = !0;
                const r = Node.prototype.cloneNode;
                Node.prototype.cloneNode = function(z) {
                    z = r.call(this, z);
                    this instanceof DocumentFragment && (z.__proto__ = DocumentFragment.prototype);
                    return z;
                };
                DocumentFragment.prototype.querySelectorAll = HTMLElement.prototype.querySelectorAll;
                DocumentFragment.prototype.querySelector = HTMLElement.prototype.querySelector;
                Object.defineProperties(DocumentFragment.prototype, {
                    nodeType: {
                        get: function() {
                            return Node.DOCUMENT_FRAGMENT_NODE;
                        },
                        configurable: !0,
                    },
                    localName: { get: function() {}, configurable: !0 },
                    nodeName: {
                        get: function() {
                            return '#document-fragment';
                        },
                        configurable: !0,
                    },
                });
                var B = Node.prototype.insertBefore;
                Node.prototype.insertBefore = p;
                const K = Node.prototype.appendChild;
                Node.prototype.appendChild = function(z) {
                    z instanceof DocumentFragment ? p.call(this, z, null) : K.call(this, z);
                    return z;
                };
                const aa = Node.prototype.removeChild;
                const la = Node.prototype.replaceChild;
                Node.prototype.replaceChild = function(z, R) {
                    z instanceof DocumentFragment ? (p.call(this, z, R), aa.call(this, R)) : la.call(this, z, R);
                    return R;
                };
                Document.prototype.createDocumentFragment = function() {
                    const z = this.createElement('df');
                    z.__proto__ = DocumentFragment.prototype;
                    return z;
                };
                const ya = Document.prototype.importNode;
                Document.prototype.importNode = function(z, R) {
                    R = ya.call(this, z, R || !1);
                    z instanceof DocumentFragment && (R.__proto__ = DocumentFragment.prototype);
                    return R;
                };
            })();
        const f = Node.prototype.cloneNode;
        const g = Document.prototype.createElement;
        const h = Document.prototype.importNode;
        const k = Node.prototype.removeChild;
        const l = Node.prototype.appendChild;
        const m = Node.prototype.replaceChild;
        const q = DOMParser.prototype.parseFromString;
        const H = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML') || {
            get: function () {
                return this.innerHTML;
            },
            set: function (p) {
                this.innerHTML = p;
            },
        };
        const C = Object.getOwnPropertyDescriptor(window.Node.prototype, 'childNodes') || {
            get: function () {
                return this.childNodes;
            },
        };
        var t = Element.prototype.querySelectorAll;
        var F = Document.prototype.querySelectorAll;
        var E = DocumentFragment.prototype.querySelectorAll;
        const M = (function() {
            if (!c) {
                let p = document.createElement('template');
                const r = document.createElement('template');
                r.content.appendChild(document.createElement('div'));
                p.content.appendChild(r);
                p = p.cloneNode(!0);
                return p.content.childNodes.length === 0 || p.content.firstChild.content.childNodes.length === 0 || d;
            }
        })();
        if (c) {
            const y = document.implementation.createHTMLDocument('template');
            let W = !0;
            let w = document.createElement('style');
            w.textContent = 'template{display:none;}';
            const wa = document.head;
            wa.insertBefore(w, wa.firstElementChild);
            a.prototype = Object.create(HTMLElement.prototype);
            const fa = !document.createElement('div').hasOwnProperty('innerHTML');
            a.U = function(p) {
                if (!p.content && p.namespaceURI === document.documentElement.namespaceURI) {
                    p.content = y.createDocumentFragment();
                    for (var r; (r = p.firstChild); ) l.call(p.content, r);
                    if (fa) p.__proto__ = a.prototype;
                    else if (
                        ((p.cloneNode = function(B) {
                            return a.b(this, B);
                        }),
                        W)
                    ) {
                        try {
                            n(p), J(p);
                        } catch (B) {
                            W = !1;
                        }
                    }
                    a.a(p.content);
                }
            };
            const va = {
                option: ['select'],
                thead: ['table'],
                col: ['colgroup', 'table'],
                tr: ['tbody', 'table'],
                th: ['tr', 'tbody', 'table'],
                td: ['tr', 'tbody', 'table'],
            };
            var n = function (p) {
                Object.defineProperty(p, 'innerHTML', {
                    get: function () {
                        return za(this);
                    },
                    set: function (r) {
                        const B = va[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(r) || ['', ''])[1].toLowerCase()];
                        if (B) for (var K = 0; K < B.length; K++) r = '<' + B[K] + '>' + r + '</' + B[K] + '>';
                        y.body.innerHTML = r;
                        for (a.a(y); this.content.firstChild; ) k.call(this.content, this.content.firstChild);
                        r = y.body;
                        if (B) for (K = 0; K < B.length; K++) r = r.lastChild;
                        for (; r.firstChild; ) l.call(this.content, r.firstChild);
                    },
                    configurable: !0,
                });
            };
            var J = function(p) {
                Object.defineProperty(p, 'outerHTML', {
                    get: function() {
                        return '<template>' + this.innerHTML + '</template>';
                    },
                    set: function(r) {
                        if (this.parentNode) {
                            y.body.innerHTML = r;
                            for (r = this.ownerDocument.createDocumentFragment(); y.body.firstChild; ) {
                                l.call(r, y.body.firstChild);
                            }
                            m.call(this.parentNode, r, this);
                        } else {
                            throw Error(
                                "Failed to set the 'outerHTML' property on 'Element': This element has no parent node.",
                            );
                        }
                    },
                    configurable: !0,
                });
            };
            n(a.prototype);
            J(a.prototype);
            a.a = function(p) {
                p = b(p, 'template');
                for (var r = 0, B = p.length, K; r < B && (K = p[r]); r++) a.U(K);
            };
            document.addEventListener('DOMContentLoaded', function() {
                a.a(document);
            });
            Document.prototype.createElement = function() {
                const p = g.apply(this, arguments);
                p.localName === 'template' && a.U(p);
                return p;
            };
            DOMParser.prototype.parseFromString = function() {
                const p = q.apply(this, arguments);
                a.a(p);
                return p;
            };
            Object.defineProperty(HTMLElement.prototype, 'innerHTML', {
                get: function() {
                    return za(this);
                },
                set: function(p) {
                    H.set.call(this, p);
                    a.a(this);
                },
                configurable: !0,
                enumerable: !0,
            });
            const ka = /[&\u00A0"]/g;
            const hc = /[&\u00A0<>]/g;
            const hb = function(p) {
                switch (p) {
                    case '&':
                        return '&amp;';
                    case '<':
                        return '&lt;';
                    case '>':
                        return '&gt;';
                    case '"':
                        return '&quot;';
                    case '\u00a0':
                        return '&nbsp;';
                }
            };
            w = function(p) {
                for (var r = {}, B = 0; B < p.length; B++) r[p[B]] = !0;
                return r;
            };
            const Wa = w(
                'area base br col command embed hr img input keygen link meta param source track wbr'.split(' '),
            );
            const ib = w('style script xmp iframe noembed noframes plaintext noscript'.split(' '));
            var za = function(p, r) {
                p.localName === 'template' && (p = p.content);
                for (
                    var B = '', K = r ? r(p) : C.get.call(p), aa = 0, la = K.length, ya;
                    aa < la && (ya = K[aa]);
                    aa++
                ) {
                    a: {
                        var z = ya;
                        let R = p;
                        const nb = r;
                        switch (z.nodeType) {
                            case Node.ELEMENT_NODE:
                                for (
                                    var Gc = z.localName, ob = '<' + Gc, zh = z.attributes, qe = 0;
                                    (R = zh[qe]);
                                    qe++
                                ) {
                                    ob += ' ' + R.name + '="' + R.value.replace(ka, hb) + '"';
                                }
                                ob += '>';
                                z = Wa[Gc] ? ob : ob + za(z, nb) + '</' + Gc + '>';
                                break a;
                            case Node.TEXT_NODE:
                                z = z.data;
                                z = R && ib[R.localName] ? z : z.replace(hc, hb);
                                break a;
                            case Node.COMMENT_NODE:
                                z = '\x3c!--' + z.data + '--\x3e';
                                break a;
                            default:
                                throw (window.console.error(z), Error('not implemented'));
                        }
                    }
                    B += z;
                }
                return B;
            };
        }
        if (c || M) {
            a.b = function(p, r) {
                const B = f.call(p, !1);
                this.U && this.U(B);
                r && (l.call(B.content, f.call(p.content, !0)), I(B.content, p.content));
                return B;
            };
            var I = function(p, r) {
                if (r.querySelectorAll && ((r = b(r, 'template')), r.length !== 0)) {
                    p = b(p, 'template');
                    for (var B = 0, K = p.length, aa, la; B < K; B++) {
                        (la = r[B]), (aa = p[B]), a && a.U && a.U(la), m.call(aa.parentNode, u.call(la, !0), aa);
                    }
                }
            };
            var u = (Node.prototype.cloneNode = function (p) {
                if (!e && d && this instanceof DocumentFragment) {
                    if (p) var r = G.call(this.ownerDocument, this, !0);
                    else return this.ownerDocument.createDocumentFragment();
                } else {
                    this.nodeType === Node.ELEMENT_NODE &&
                    this.localName === 'template' &&
                    this.namespaceURI == document.documentElement.namespaceURI
                        ? (r = a.b(this, p))
                        : (r = f.call(this, p));
                }
                p && I(r, this);
                return r;
            });
            var G = (Document.prototype.importNode = function(p, r) {
                r = r || !1;
                if (p.localName === 'template') return a.b(p, r);
                const B = h.call(this, p, r);
                if (r) {
                    I(B, p);
                    p = b(B, 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');
                    for (var K, aa = 0; aa < p.length; aa++) {
                        K = p[aa];
                        r = g.call(document, 'script');
                        r.textContent = K.textContent;
                        for (var la = K.attributes, ya = 0, z; ya < la.length; ya++) {
                            (z = la[ya]), r.setAttribute(z.name, z.value);
                        }
                        m.call(K.parentNode, r, K);
                    }
                }
                return B;
            });
        }
        c && (window.HTMLTemplateElement = a);
    })(); /*

Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
    function rc() {}
    rc.prototype.toJSON = function() {
        return {};
    };
    function D(a) {
        a.__shady || (a.__shady = new rc());
        return a.__shady;
    }
    function L(a) {
        return a && a.__shady;
    }
    const N = window.ShadyDOM || {};
    N.Ua = !(!Element.prototype.attachShadow || !Node.prototype.getRootNode);
    const sc = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild');
    N.B = !!(sc && sc.configurable && sc.get);
    N.sa = N.force || !N.Ua;
    N.D = N.noPatch || !1;
    N.aa = N.preferPerformance;
    N.ua = N.D === 'on-demand';
    N.Ia = navigator.userAgent.match('Trident');
    function tc(a) {
        return (a = L(a)) && void 0 !== a.firstChild;
    }
    function O(a) {
        return a instanceof ShadowRoot;
    }
    function uc(a) {
        return (a = (a = L(a)) && a.root) && vc(a);
    }
    const wc = Element.prototype;
    const xc =
        wc.matches ||
        wc.matchesSelector ||
        wc.mozMatchesSelector ||
        wc.msMatchesSelector ||
        wc.oMatchesSelector ||
        wc.webkitMatchesSelector;
    const yc = document.createTextNode('');
    let zc = 0;
    const Ac = [];
    new MutationObserver(function() {
        for (; Ac.length; ) {
            try {
                Ac.shift()();
            } catch (a) {
                throw ((yc.textContent = zc++), a);
            }
        }
    }).observe(yc, { characterData: !0 });
    function Bc(a) {
        Ac.push(a);
        yc.textContent = zc++;
    }
    const Cc = document.contains
        ? function(a, b) {
              return a.__shady_native_contains(b);
          }
        : function(a, b) {
              return a === b || (a.documentElement && a.documentElement.__shady_native_contains(b));
          };
    function Dc(a, b) {
        for (; b; ) {
            if (b == a) return !0;
            b = b.__shady_parentNode;
        }
        return !1;
    }
    function Ec(a) {
        for (let b = a.length - 1; b >= 0; b--) {
            const c = a[b];
            const d = c.getAttribute('id') || c.getAttribute('name');
            d && d !== 'length' && isNaN(d) && (a[d] = c);
        }
        a.item = function(e) {
            return a[e];
        };
        a.namedItem = function(e) {
            if (e !== 'length' && isNaN(e) && a[e]) return a[e];
            for (let f = na(a), g = f.next(); !g.done; g = f.next()) {
                if (((g = g.value), (g.getAttribute('id') || g.getAttribute('name')) == e)) return g;
            }
            return null;
        };
        return a;
    }
    function Fc(a) {
        const b = [];
        for (a = a.__shady_native_firstChild; a; a = a.__shady_native_nextSibling) b.push(a);
        return b;
    }
    function Hc(a) {
        const b = [];
        for (a = a.__shady_firstChild; a; a = a.__shady_nextSibling) b.push(a);
        return b;
    }
    function Ic(a, b, c) {
        c.configurable = !0;
        if (c.value) a[b] = c.value;
        else {
            try {
                Object.defineProperty(a, b, c);
            } catch (d) {}
        }
    }
    function P(a, b, c, d) {
        c = void 0 === c ? '' : c;
        for (const e in b) (d && d.indexOf(e) >= 0) || Ic(a, c + e, b[e]);
    }
    function Jc(a, b) {
        for (const c in b) c in a && Ic(a, c, b[c]);
    }
    function Q(a) {
        const b = {};
        Object.getOwnPropertyNames(a).forEach(function(c) {
            b[c] = Object.getOwnPropertyDescriptor(a, c);
        });
        return b;
    }
    function Kc(a, b) {
        for (var c = Object.getOwnPropertyNames(b), d = 0, e; d < c.length; d++) (e = c[d]), (a[e] = b[e]);
    }
    function Lc(a) {
        return a instanceof Node ? a : document.createTextNode('' + a);
    }
    function Mc(a) {
        for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
        if (b.length === 1) return Lc(b[0]);
        c = document.createDocumentFragment();
        b = na(b);
        for (let d = b.next(); !d.done; d = b.next()) c.appendChild(Lc(d.value));
        return c;
    }
    const Nc = [];
    let Oc;
    function Pc(a) {
        Oc || ((Oc = !0), Bc(Qc));
        Nc.push(a);
    }
    function Qc() {
        Oc = !1;
        for (var a = !!Nc.length; Nc.length; ) Nc.shift()();
        return a;
    }
    Qc.list = Nc;
    function Rc() {
        this.a = !1;
        this.addedNodes = [];
        this.removedNodes = [];
        this.ja = new Set();
    }
    function Sc(a) {
        a.a ||
            ((a.a = !0),
            Bc(function() {
                a.flush();
            }));
    }
    Rc.prototype.flush = function() {
        if (this.a) {
            this.a = !1;
            const a = this.takeRecords();
            a.length &&
                this.ja.forEach(function(b) {
                    b(a);
                });
        }
    };
    Rc.prototype.takeRecords = function() {
        if (this.addedNodes.length || this.removedNodes.length) {
            const a = [{ addedNodes: this.addedNodes, removedNodes: this.removedNodes }];
            this.addedNodes = [];
            this.removedNodes = [];
            return a;
        }
        return [];
    };
    function Tc(a, b) {
        const c = D(a);
        c.Z || (c.Z = new Rc());
        c.Z.ja.add(b);
        const d = c.Z;
        return {
            Ma: b,
            S: d,
            Na: a,
            takeRecords: function() {
                return d.takeRecords();
            },
        };
    }
    function Uc(a) {
        const b = a && a.S;
        b && (b.ja.delete(a.Ma), b.ja.size || (D(a.Na).Z = null));
    }
    function Vc(a, b) {
        const c = b.getRootNode();
        return a
            .map(function(d) {
                let e = c === d.target.getRootNode();
                if (e && d.addedNodes) {
                    if (
                        ((e = [].slice.call(d.addedNodes).filter(function(f) {
                            return c === f.getRootNode();
                        })),
                        e.length)
                    ) {
                        return (
                            (d = Object.create(d)),
                            Object.defineProperty(d, 'addedNodes', { value: e, configurable: !0 }),
                            d
                        );
                    }
                } else if (e) return d;
            })
            .filter(function(d) {
                return d;
            });
    }
    const Wc = /[&\u00A0"]/g;
    const Xc = /[&\u00A0<>]/g;
    function Yc(a) {
        switch (a) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case '\u00a0':
                return '&nbsp;';
        }
    }
    function Zc(a) {
        for (var b = {}, c = 0; c < a.length; c++) b[a[c]] = !0;
        return b;
    }
    const $c = Zc('area base br col command embed hr img input keygen link meta param source track wbr'.split(' '));
    const ad = Zc('style script xmp iframe noembed noframes plaintext noscript'.split(' '));
    function bd(a, b) {
        a.localName === 'template' && (a = a.content);
        for (var c = '', d = b ? b(a) : a.childNodes, e = 0, f = d.length, g = void 0; e < f && (g = d[e]); e++) {
            a: {
                var h = g;
                let k = a;
                const l = b;
                switch (h.nodeType) {
                    case Node.ELEMENT_NODE:
                        k = h.localName;
                        for (var m = '<' + k, q = h.attributes, H = 0, C; (C = q[H]); H++) {
                            m += ' ' + C.name + '="' + C.value.replace(Wc, Yc) + '"';
                        }
                        m += '>';
                        h = $c[k] ? m : m + bd(h, l) + '</' + k + '>';
                        break a;
                    case Node.TEXT_NODE:
                        h = h.data;
                        h = k && ad[k.localName] ? h : h.replace(Xc, Yc);
                        break a;
                    case Node.COMMENT_NODE:
                        h = '\x3c!--' + h.data + '--\x3e';
                        break a;
                    default:
                        throw (window.console.error(h), Error('not implemented'));
                }
            }
            c += h;
        }
        return c;
    }
    const cd = N.B;
    const dd = {
        querySelector: function (a) {
            return this.__shady_native_querySelector(a);
        },
        querySelectorAll: function (a) {
            return this.__shady_native_querySelectorAll(a);
        },
    };
    const ed = {};
    function fd(a) {
        ed[a] = function(b) {
            return b['__shady_native_' + a];
        };
    }
    function gd(a, b) {
        P(a, b, '__shady_native_');
        for (const c in b) fd(c);
    }
    function S(a, b) {
        b = void 0 === b ? [] : b;
        for (let c = 0; c < b.length; c++) {
            const d = b[c];
            const e = Object.getOwnPropertyDescriptor(a, d);
            e && (Object.defineProperty(a, '__shady_native_' + d, e), e.value ? dd[d] || (dd[d] = e.value) : fd(d));
        }
    }
    const hd = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, !1);
    const id = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1);
    const jd = document.implementation.createHTMLDocument('inert');
    function kd(a) {
        for (var b; (b = a.__shady_native_firstChild); ) a.__shady_native_removeChild(b);
    }
    const ld = ['firstElementChild', 'lastElementChild', 'children', 'childElementCount'];
    const md = ['querySelector', 'querySelectorAll', 'append', 'prepend', 'replaceChildren'];
    function nd() {
        let a = ['dispatchEvent', 'addEventListener', 'removeEventListener'];
        window.EventTarget ? S(window.EventTarget.prototype, a) : (S(Node.prototype, a), S(Window.prototype, a));
        cd
            ? S(
                  Node.prototype,
                  'parentNode firstChild lastChild previousSibling nextSibling childNodes parentElement textContent'.split(
                      ' ',
                  ),
              )
            : gd(Node.prototype, {
                  parentNode: {
                      get: function() {
                          hd.currentNode = this;
                          return hd.parentNode();
                      },
                  },
                  firstChild: {
                      get: function() {
                          hd.currentNode = this;
                          return hd.firstChild();
                      },
                  },
                  lastChild: {
                      get: function() {
                          hd.currentNode = this;
                          return hd.lastChild();
                      },
                  },
                  previousSibling: {
                      get: function() {
                          hd.currentNode = this;
                          return hd.previousSibling();
                      },
                  },
                  nextSibling: {
                      get: function() {
                          hd.currentNode = this;
                          return hd.nextSibling();
                      },
                  },
                  childNodes: {
                      get: function() {
                          const b = [];
                          hd.currentNode = this;
                          for (let c = hd.firstChild(); c; ) b.push(c), (c = hd.nextSibling());
                          return b;
                      },
                  },
                  parentElement: {
                      get: function() {
                          id.currentNode = this;
                          return id.parentNode();
                      },
                  },
                  textContent: {
                      get: function() {
                          switch (this.nodeType) {
                              case Node.ELEMENT_NODE:
                              case Node.DOCUMENT_FRAGMENT_NODE:
                                  for (
                                      var b = document.createTreeWalker(this, NodeFilter.SHOW_TEXT, null, !1),
                                          c = '',
                                          d;
                                      (d = b.nextNode());

                                  ) {
                                      c += d.nodeValue;
                                  }
                                  return c;
                              default:
                                  return this.nodeValue;
                          }
                      },
                      set: function(b) {
                          if (typeof b === 'undefined' || b === null) b = '';
                          switch (this.nodeType) {
                              case Node.ELEMENT_NODE:
                              case Node.DOCUMENT_FRAGMENT_NODE:
                                  kd(this);
                                  (b.length > 0 || this.nodeType === Node.ELEMENT_NODE) &&
                                      this.__shady_native_insertBefore(document.createTextNode(b), void 0);
                                  break;
                              default:
                                  this.nodeValue = b;
                          }
                      },
                  },
              });
        S(Node.prototype, 'appendChild insertBefore removeChild replaceChild cloneNode contains'.split(' '));
        S(HTMLElement.prototype, ['parentElement', 'contains']);
        a = {
            firstElementChild: {
                get: function() {
                    id.currentNode = this;
                    return id.firstChild();
                },
            },
            lastElementChild: {
                get: function() {
                    id.currentNode = this;
                    return id.lastChild();
                },
            },
            children: {
                get: function() {
                    const b = [];
                    id.currentNode = this;
                    for (let c = id.firstChild(); c; ) b.push(c), (c = id.nextSibling());
                    return Ec(b);
                },
            },
            childElementCount: {
                get: function() {
                    return this.children ? this.children.length : 0;
                },
            },
        };
        cd
            ? (S(Element.prototype, ld),
              S(Element.prototype, ['previousElementSibling', 'nextElementSibling', 'innerHTML', 'className']),
              S(HTMLElement.prototype, ['children', 'innerHTML', 'className']))
            : (gd(Element.prototype, a),
              gd(Element.prototype, {
                  previousElementSibling: {
                      get: function() {
                          id.currentNode = this;
                          return id.previousSibling();
                      },
                  },
                  nextElementSibling: {
                      get: function() {
                          id.currentNode = this;
                          return id.nextSibling();
                      },
                  },
                  innerHTML: {
                      get: function() {
                          return bd(this, Fc);
                      },
                      set: function(b) {
                          const c = this.localName === 'template' ? this.content : this;
                          kd(c);
                          let d = this.localName || 'div';
                          d =
                              this.namespaceURI && this.namespaceURI !== jd.namespaceURI
                                  ? jd.createElementNS(this.namespaceURI, d)
                                  : jd.createElement(d);
                          d.innerHTML = b;
                          for (b = this.localName === 'template' ? d.content : d; (d = b.__shady_native_firstChild); ) {
                              c.__shady_native_insertBefore(d, void 0);
                          }
                      },
                  },
                  className: {
                      get: function() {
                          return this.getAttribute('class') || '';
                      },
                      set: function(b) {
                          this.setAttribute('class', b);
                      },
                  },
              }));
        S(Element.prototype, 'setAttribute getAttribute hasAttribute removeAttribute focus blur'.split(' '));
        S(Element.prototype, md);
        S(HTMLElement.prototype, ['focus', 'blur']);
        window.HTMLTemplateElement && S(window.HTMLTemplateElement.prototype, ['innerHTML']);
        cd ? S(DocumentFragment.prototype, ld) : gd(DocumentFragment.prototype, a);
        S(DocumentFragment.prototype, md);
        cd ? (S(Document.prototype, ld), S(Document.prototype, ['activeElement'])) : gd(Document.prototype, a);
        S(Document.prototype, ['importNode', 'getElementById']);
        S(Document.prototype, md);
    }
    const od = Q({
        get childNodes() {
            return this.__shady_childNodes;
        },
        get firstChild() {
            return this.__shady_firstChild;
        },
        get lastChild() {
            return this.__shady_lastChild;
        },
        get childElementCount() {
            return this.__shady_childElementCount;
        },
        get children() {
            return this.__shady_children;
        },
        get firstElementChild() {
            return this.__shady_firstElementChild;
        },
        get lastElementChild() {
            return this.__shady_lastElementChild;
        },
        get shadowRoot() {
            return this.__shady_shadowRoot;
        },
    });
    const pd = Q({
        get textContent() {
            return this.__shady_textContent;
        },
        set textContent(a) {
            this.__shady_textContent = a;
        },
        get innerHTML() {
            return this.__shady_innerHTML;
        },
        set innerHTML(a) {
            return (this.__shady_innerHTML = a);
        },
    });
    const qd = Q({
        get parentElement() {
            return this.__shady_parentElement;
        },
        get parentNode() {
            return this.__shady_parentNode;
        },
        get nextSibling() {
            return this.__shady_nextSibling;
        },
        get previousSibling() {
            return this.__shady_previousSibling;
        },
        get nextElementSibling() {
            return this.__shady_nextElementSibling;
        },
        get previousElementSibling() {
            return this.__shady_previousElementSibling;
        },
        get className() {
            return this.__shady_className;
        },
        set className(a) {
            return (this.__shady_className = a);
        },
    });
    function rd(a) {
        for (const b in a) {
            const c = a[b];
            c && (c.enumerable = !1);
        }
    }
    rd(od);
    rd(pd);
    rd(qd);
    const sd = N.B || !0 === N.D;
    const td = sd
        ? function () {}
        : function (a) {
              const b = D(a);
              b.Ka || ((b.Ka = !0), Jc(a, qd));
          };
    const ud = sd
        ? function() {}
        : function(a) {
              const b = D(a);
              b.Ja ||
                  ((b.Ja = !0),
                  Jc(a, od),
                  (window.customElements && window.customElements.polyfillWrapFlushCallback && !N.D) || Jc(a, pd));
          };
    const vd = '__eventWrappers' + Date.now();
    const wd = (function () {
        const a = Object.getOwnPropertyDescriptor(Event.prototype, 'composed');
        return a
            ? function (b) {
                  return a.get.call(b);
              }
            : null;
    })();
    const xd = (function() {
        function a() {}
        let b = !1;
        const c = {
            get capture() {
                b = !0;
                return !1;
            },
        };
        window.addEventListener('test', a, c);
        window.removeEventListener('test', a, c);
        return b;
    })();
    function yd(a) {
        if (a && typeof a === 'object') {
            var b = !!a.capture;
            var c = !!a.once;
            var d = !!a.passive;
            var e = a.O;
        } else (b = !!a), (d = c = !1);
        return { Ga: e, capture: b, once: c, passive: d, Fa: xd ? a : b };
    }
    const zd = {
        blur: !0,
        focus: !0,
        focusin: !0,
        focusout: !0,
        click: !0,
        dblclick: !0,
        mousedown: !0,
        mouseenter: !0,
        mouseleave: !0,
        mousemove: !0,
        mouseout: !0,
        mouseover: !0,
        mouseup: !0,
        wheel: !0,
        beforeinput: !0,
        input: !0,
        keydown: !0,
        keyup: !0,
        compositionstart: !0,
        compositionupdate: !0,
        compositionend: !0,
        touchstart: !0,
        touchend: !0,
        touchmove: !0,
        touchcancel: !0,
        pointerover: !0,
        pointerenter: !0,
        pointerdown: !0,
        pointermove: !0,
        pointerup: !0,
        pointercancel: !0,
        pointerout: !0,
        pointerleave: !0,
        gotpointercapture: !0,
        lostpointercapture: !0,
        dragstart: !0,
        drag: !0,
        dragenter: !0,
        dragleave: !0,
        dragover: !0,
        drop: !0,
        dragend: !0,
        DOMActivate: !0,
        DOMFocusIn: !0,
        DOMFocusOut: !0,
        keypress: !0,
    };
    const Ad = {
        DOMAttrModified: !0,
        DOMAttributeNameChanged: !0,
        DOMCharacterDataModified: !0,
        DOMElementNameChanged: !0,
        DOMNodeInserted: !0,
        DOMNodeInsertedIntoDocument: !0,
        DOMNodeRemoved: !0,
        DOMNodeRemovedFromDocument: !0,
        DOMSubtreeModified: !0,
    };
    function Bd(a) {
        return a instanceof Node ? a.__shady_getRootNode() : a;
    }
    function Cd(a, b) {
        const c = [];
        let d = a;
        for (a = Bd(a); d; ) {
            c.push(d),
                d.__shady_assignedSlot
                    ? (d = d.__shady_assignedSlot)
                    : d.nodeType === Node.DOCUMENT_FRAGMENT_NODE && d.host && (b || d !== a)
                    ? (d = d.host)
                    : (d = d.__shady_parentNode);
        }
        c[c.length - 1] === document && c.push(window);
        return c;
    }
    function Dd(a) {
        a.__composedPath || (a.__composedPath = Cd(a.target, !0));
        return a.__composedPath;
    }
    function Ed(a, b) {
        if (!O) return a;
        a = Cd(a, !0);
        for (var c = 0, d, e = void 0, f, g = void 0; c < b.length; c++) {
            if (((d = b[c]), (f = Bd(d)), f !== e && ((g = a.indexOf(f)), (e = f)), !O(f) || g > -1)) return d;
        }
    }
    function Fd(a) {
        function b(c, d) {
            c = new a(c, d);
            c.__composed = d && !!d.composed;
            return c;
        }
        b.__proto__ = a;
        b.prototype = a.prototype;
        return b;
    }
    const Gd = { focus: !0, blur: !0 };
    function Hd(a) {
        return a.__target !== a.target || a.__relatedTarget !== a.relatedTarget;
    }
    function Id(a, b, c) {
        if ((c = b.__handlers && b.__handlers[a.type] && b.__handlers[a.type][c])) {
            for (
                var d = 0, e;
                (e = c[d]) &&
                (!Hd(a) || a.target !== a.relatedTarget) &&
                (e.call(b, a), !a.__immediatePropagationStopped);
                d++
            );
        }
    }
    function Jd(a) {
        const b = a.composedPath();
        const c = b.map(function (k) {
            return Ed(k, b);
        });
        const d = a.bubbles;
        Object.defineProperty(a, 'currentTarget', {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return g;
            },
        });
        let e = Event.CAPTURING_PHASE;
        Object.defineProperty(a, 'eventPhase', {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return e;
            },
        });
        for (var f = b.length - 1; f >= 0; f--) {
            var g = b[f];
            e = g === c[f] ? Event.AT_TARGET : Event.CAPTURING_PHASE;
            Id(a, g, 'capture');
            if (a.ma) return;
        }
        for (f = 0; f < b.length; f++) {
            g = b[f];
            const h = g === c[f];
            if (h || d) if (((e = h ? Event.AT_TARGET : Event.BUBBLING_PHASE), Id(a, g, 'bubble'), a.ma)) return;
        }
        e = 0;
        g = null;
    }
    function Kd(a, b, c, d, e, f) {
        for (let g = 0; g < a.length; g++) {
            const h = a[g];
            const k = h.type;
            const l = h.capture;
            const m = h.once;
            const q = h.passive;
            if (b === h.node && c === k && d === l && e === m && f === q) return g;
        }
        return -1;
    }
    function Ld(a) {
        Qc();
        return !N.aa && this instanceof Node && !Cc(document, this)
            ? (a.__target || Md(a, this), Jd(a))
            : this.__shady_native_dispatchEvent(a);
    }
    function Nd(a, b, c) {
        let d = yd(c);
        const e = d.capture;
        const f = d.once;
        const g = d.passive;
        let h = d.Ga;
        d = d.Fa;
        if (b) {
            const k = typeof b;
            if (k === 'function' || k === 'object') {
                if (k !== 'object' || (b.handleEvent && typeof b.handleEvent === 'function')) {
                    if (Ad[a]) return this.__shady_native_addEventListener(a, b, d);
                    const l = h || this;
                    if ((h = b[vd])) {
                        if (Kd(h, l, a, e, f, g) > -1) return;
                    } else b[vd] = [];
                    h = function (m) {
                        f && this.__shady_removeEventListener(a, b, c);
                        m.__target || Md(m);
                        if (l !== this) {
                            var q = Object.getOwnPropertyDescriptor(m, 'currentTarget');
                            Object.defineProperty(m, 'currentTarget', {
                                get: function () {
                                    return l;
                                },
                                configurable: !0,
                            });
                            var H = Object.getOwnPropertyDescriptor(m, 'eventPhase');
                            Object.defineProperty(m, 'eventPhase', {
                                configurable: !0,
                                enumerable: !0,
                                get: function () {
                                    return e ? Event.CAPTURING_PHASE : Event.BUBBLING_PHASE;
                                },
                            });
                        }
                        m.__previousCurrentTarget = m.currentTarget;
                        if ((!O(l) && l.localName !== 'slot') || m.composedPath().indexOf(l) != -1) {
                            if (m.composed || m.composedPath().indexOf(l) > -1) {
                                if (Hd(m) && m.target === m.relatedTarget) {
                                    m.eventPhase === Event.BUBBLING_PHASE && m.stopImmediatePropagation();
                                } else if (
                                    m.eventPhase === Event.CAPTURING_PHASE ||
                                    m.bubbles ||
                                    m.target === l ||
                                    l instanceof Window
                                ) {
                                    const C = k === 'function' ? b.call(l, m) : b.handleEvent && b.handleEvent(m);
                                    l !== this &&
                                        (q
                                            ? (Object.defineProperty(m, 'currentTarget', q), (q = null))
                                            : delete m.currentTarget,
                                        H
                                            ? (Object.defineProperty(m, 'eventPhase', H), (H = null))
                                            : delete m.eventPhase);
                                    return C;
                                }
                            }
                        }
                    };
                    b[vd].push({ node: l, type: a, capture: e, once: f, passive: g, lb: h });
                    this.__handlers = this.__handlers || {};
                    this.__handlers[a] = this.__handlers[a] || { capture: [], bubble: [] };
                    this.__handlers[a][e ? 'capture' : 'bubble'].push(h);
                    Gd[a] || this.__shady_native_addEventListener(a, h, d);
                }
            }
        }
    }
    function Od(a, b, c) {
        if (b) {
            let d = yd(c);
            c = d.capture;
            let e = d.once;
            const f = d.passive;
            let g = d.Ga;
            d = d.Fa;
            if (Ad[a]) return this.__shady_native_removeEventListener(a, b, d);
            const h = g || this;
            g = void 0;
            let k = null;
            try {
                k = b[vd];
            } catch (l) {}
            k && ((e = Kd(k, h, a, c, e, f)), e > -1 && ((g = k.splice(e, 1)[0].lb), k.length || (b[vd] = void 0)));
            this.__shady_native_removeEventListener(a, g || b, d);
            g &&
                this.__handlers &&
                this.__handlers[a] &&
                ((a = this.__handlers[a][c ? 'capture' : 'bubble']), (b = a.indexOf(g)), b > -1 && a.splice(b, 1));
        }
    }
    function Pd() {
        for (const a in Gd) {
            window.__shady_native_addEventListener(
                a,
                function (b) {
                    b.__target || (Md(b), Jd(b));
                },
                !0,
            );
        }
    }
    const Qd = Q({
        get composed() {
            void 0 === this.__composed &&
                (wd
                    ? (this.__composed = this.type === 'focusin' || this.type === 'focusout' || wd(this))
                    : !1 !== this.isTrusted && (this.__composed = zd[this.type]));
            return this.__composed || !1;
        },
        composedPath: function() {
            this.__composedPath || (this.__composedPath = Cd(this.__target, this.composed));
            return this.__composedPath;
        },
        get target() {
            return Ed(this.currentTarget || this.__previousCurrentTarget, this.composedPath());
        },
        get relatedTarget() {
            if (!this.__relatedTarget) return null;
            this.__relatedTargetComposedPath || (this.__relatedTargetComposedPath = Cd(this.__relatedTarget, !0));
            return Ed(this.currentTarget || this.__previousCurrentTarget, this.__relatedTargetComposedPath);
        },
        stopPropagation: function() {
            Event.prototype.stopPropagation.call(this);
            this.ma = !0;
        },
        stopImmediatePropagation: function() {
            Event.prototype.stopImmediatePropagation.call(this);
            this.ma = this.__immediatePropagationStopped = !0;
        },
    });
    function Md(a, b) {
        b = void 0 === b ? a.target : b;
        a.__target = b;
        a.__relatedTarget = a.relatedTarget;
        if (N.B) {
            b = Object.getPrototypeOf(a);
            if (!b.hasOwnProperty('__shady_patchedProto')) {
                const c = Object.create(b);
                c.__shady_sourceProto = b;
                P(c, Qd);
                b.__shady_patchedProto = c;
            }
            a.__proto__ = b.__shady_patchedProto;
        } else P(a, Qd);
    }
    const Rd = Fd(Event);
    const Sd = Fd(CustomEvent);
    const Td = Fd(MouseEvent);
    function Ud() {
        if (!wd && Object.getOwnPropertyDescriptor(Event.prototype, 'isTrusted')) {
            const a = function() {
                const b = new MouseEvent('click', { bubbles: !0, cancelable: !0, composed: !0 });
                this.__shady_dispatchEvent(b);
            };
            Element.prototype.click
                ? (Element.prototype.click = a)
                : HTMLElement.prototype.click && (HTMLElement.prototype.click = a);
        }
    }
    const Vd = Object.getOwnPropertyNames(Element.prototype).filter(function(a) {
        return a.substring(0, 2) === 'on';
    });
    const Wd = Object.getOwnPropertyNames(HTMLElement.prototype).filter(function(a) {
        return a.substring(0, 2) === 'on';
    });
    function Xd(a) {
        return {
            set: function(b) {
                const c = D(this);
                const d = a.substring(2);
                c.N || (c.N = {});
                c.N[a] && this.removeEventListener(d, c.N[a]);
                this.__shady_addEventListener(d, b);
                c.N[a] = b;
            },
            get: function() {
                const b = L(this);
                return b && b.N && b.N[a];
            },
            configurable: !0,
        };
    }
    function Yd(a, b) {
        return { index: a, ba: [], ia: b };
    }
    function Zd(a, b, c, d) {
        let e = 0;
        let f = 0;
        let g = 0;
        let h = 0;
        let k = Math.min(b - e, d - f);
        if (e == 0 && f == 0) {
            a: {
                for (g = 0; g < k; g++) if (a[g] !== c[g]) break a;
                g = k;
            }
        }
        if (b == a.length && d == c.length) {
            h = a.length;
            for (var l = c.length, m = 0; m < k - g && $d(a[--h], c[--l]); ) m++;
            h = m;
        }
        e += g;
        f += g;
        b -= h;
        d -= h;
        if (b - e == 0 && d - f == 0) return [];
        if (e == b) {
            for (b = Yd(e, 0); f < d; ) b.ba.push(c[f++]);
            return [b];
        }
        if (f == d) return [Yd(e, b - e)];
        k = e;
        g = f;
        d = d - g + 1;
        h = b - k + 1;
        b = Array(d);
        for (l = 0; l < d; l++) (b[l] = Array(h)), (b[l][0] = l);
        for (l = 0; l < h; l++) b[0][l] = l;
        for (l = 1; l < d; l++) {
            for (m = 1; m < h; m++) {
                if (a[k + m - 1] === c[g + l - 1]) b[l][m] = b[l - 1][m - 1];
                else {
                    var q = b[l - 1][m] + 1;
                    const H = b[l][m - 1] + 1;
                    b[l][m] = q < H ? q : H;
                }
            }
        }
        k = b.length - 1;
        g = b[0].length - 1;
        d = b[k][g];
        for (a = []; k > 0 || g > 0; ) {
            k == 0
                ? (a.push(2), g--)
                : g == 0
                ? (a.push(3), k--)
                : ((h = b[k - 1][g - 1]),
                  (l = b[k - 1][g]),
                  (m = b[k][g - 1]),
                  (q = l < m ? (l < h ? l : h) : m < h ? m : h),
                  q == h
                      ? (h == d ? a.push(0) : (a.push(1), (d = h)), k--, g--)
                      : q == l
                      ? (a.push(3), k--, (d = l))
                      : (a.push(2), g--, (d = m)));
        }
        a.reverse();
        b = void 0;
        k = [];
        for (g = 0; g < a.length; g++) {
            switch (a[g]) {
                case 0:
                    b && (k.push(b), (b = void 0));
                    e++;
                    f++;
                    break;
                case 1:
                    b || (b = Yd(e, 0));
                    b.ia++;
                    e++;
                    b.ba.push(c[f]);
                    f++;
                    break;
                case 2:
                    b || (b = Yd(e, 0));
                    b.ia++;
                    e++;
                    break;
                case 3:
                    b || (b = Yd(e, 0)), b.ba.push(c[f]), f++;
            }
        }
        b && k.push(b);
        return k;
    }
    function $d(a, b) {
        return a === b;
    }
    const ae = Q({ dispatchEvent: Ld, addEventListener: Nd, removeEventListener: Od });
    let be = null;
    function ce() {
        be || (be = window.ShadyCSS && window.ShadyCSS.ScopingShim);
        return be || null;
    }
    function de(a, b, c) {
        const d = ce();
        return d && b === 'class' ? (d.setElementClass(a, c), !0) : !1;
    }
    function ee(a, b) {
        const c = ce();
        c && c.unscopeNode(a, b);
    }
    function fe(a, b) {
        let c = ce();
        if (!c) return !0;
        if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            c = !0;
            for (a = a.__shady_firstChild; a; a = a.__shady_nextSibling) c = c && fe(a, b);
            return c;
        }
        return a.nodeType !== Node.ELEMENT_NODE ? !0 : c.currentScopeForNode(a) === b;
    }
    function ge(a) {
        if (a.nodeType !== Node.ELEMENT_NODE) return '';
        const b = ce();
        return b ? b.currentScopeForNode(a) : '';
    }
    function he(a, b) {
        if (a) {
            for (a.nodeType === Node.ELEMENT_NODE && b(a), a = a.__shady_firstChild; a; a = a.__shady_nextSibling) {
                a.nodeType === Node.ELEMENT_NODE && he(a, b);
            }
        }
    }
    const ie = window.document;
    const je = N.aa;
    const ke = Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected');
    const le = ke && ke.get;
    function me(a) {
        for (var b; (b = a.__shady_firstChild); ) a.__shady_removeChild(b);
    }
    function ne(a) {
        let b = L(a);
        if (b && void 0 !== b.la) for (b = a.__shady_firstChild; b; b = b.__shady_nextSibling) ne(b);
        if ((a = L(a))) a.la = void 0;
    }
    function oe(a) {
        let b = a;
        if (a && a.localName === 'slot') {
            let c = L(a);
            (c = c && c.V) && (b = c.length ? c[0] : oe(a.__shady_nextSibling));
        }
        return b;
    }
    function pe(a, b, c) {
        if ((a = (a = L(a)) && a.Z)) {
            if (b) {
                if (b.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    for (let d = 0, e = b.childNodes.length; d < e; d++) a.addedNodes.push(b.childNodes[d]);
                } else a.addedNodes.push(b);
            }
            c && a.removedNodes.push(c);
            Sc(a);
        }
    }
    const xe = Q({
        get parentNode() {
            let a = L(this);
            a = a && a.parentNode;
            return void 0 !== a ? a : this.__shady_native_parentNode;
        },
        get firstChild() {
            let a = L(this);
            a = a && a.firstChild;
            return void 0 !== a ? a : this.__shady_native_firstChild;
        },
        get lastChild() {
            let a = L(this);
            a = a && a.lastChild;
            return void 0 !== a ? a : this.__shady_native_lastChild;
        },
        get nextSibling() {
            let a = L(this);
            a = a && a.nextSibling;
            return void 0 !== a ? a : this.__shady_native_nextSibling;
        },
        get previousSibling() {
            let a = L(this);
            a = a && a.previousSibling;
            return void 0 !== a ? a : this.__shady_native_previousSibling;
        },
        get childNodes() {
            if (tc(this)) {
                const a = L(this);
                if (!a.childNodes) {
                    a.childNodes = [];
                    for (let b = this.__shady_firstChild; b; b = b.__shady_nextSibling) a.childNodes.push(b);
                }
                var c = a.childNodes;
            } else c = this.__shady_native_childNodes;
            c.item = function(d) {
                return c[d];
            };
            return c;
        },
        get parentElement() {
            let a = L(this);
            (a = a && a.parentNode) && a.nodeType !== Node.ELEMENT_NODE && (a = null);
            return void 0 !== a ? a : this.__shady_native_parentElement;
        },
        get isConnected() {
            if (le && le.call(this)) return !0;
            if (this.nodeType == Node.DOCUMENT_FRAGMENT_NODE) return !1;
            let a = this.ownerDocument;
            if (a === null || Cc(a, this)) return !0;
            for (a = this; a && !(a instanceof Document); ) a = a.__shady_parentNode || (O(a) ? a.host : void 0);
            return !!(a && a instanceof Document);
        },
        get textContent() {
            if (tc(this)) {
                for (var a = [], b = this.__shady_firstChild; b; b = b.__shady_nextSibling) {
                    b.nodeType !== Node.COMMENT_NODE && a.push(b.__shady_textContent);
                }
                return a.join('');
            }
            return this.__shady_native_textContent;
        },
        set textContent(a) {
            if (typeof a === 'undefined' || a === null) a = '';
            switch (this.nodeType) {
                case Node.ELEMENT_NODE:
                case Node.DOCUMENT_FRAGMENT_NODE:
                    if (!tc(this) && N.B) {
                        const b = this.__shady_firstChild;
                        (b != this.__shady_lastChild || (b && b.nodeType != Node.TEXT_NODE)) && me(this);
                        this.__shady_native_textContent = a;
                    } else {
                        me(this),
                            (a.length > 0 || this.nodeType === Node.ELEMENT_NODE) &&
                                this.__shady_insertBefore(document.createTextNode(a));
                    }
                    break;
                default:
                    this.nodeValue = a;
            }
        },
        insertBefore: function(a, b) {
            if (this.ownerDocument !== ie && a.ownerDocument !== ie) return this.__shady_native_insertBefore(a, b), a;
            if (a === this) {
                throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");
            }
            if (b) {
                var c = L(b);
                c = c && c.parentNode;
                if ((void 0 !== c && c !== this) || (void 0 === c && b.__shady_native_parentNode !== this)) {
                    throw Error(
                        "Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.",
                    );
                }
            }
            if (b === a) return a;
            pe(this, a);
            const d = [];
            const e = (c = re(this)) ? c.host.localName : ge(this);
            let f = a.__shady_parentNode;
            if (f) {
                var g = ge(a);
                var h = !!c || !re(a) || (je && void 0 !== this.__noInsertionPoint);
                f.__shady_removeChild(a, h);
            }
            f = !0;
            const k = (!je || (void 0 === a.__noInsertionPoint && void 0 === this.__noInsertionPoint)) && !fe(a, e);
            const l = c && !a.__noInsertionPoint && (!je || a.nodeType === Node.DOCUMENT_FRAGMENT_NODE);
            if (l || k) {
                k && (g = g || ge(a)),
                    he(a, function (m) {
                        l && m.localName === 'slot' && d.push(m);
                        if (k) {
                            let q = g;
                            ce() && (q && ee(m, q), (q = ce()) && q.scopeNode(m, e));
                        }
                    });
            }
            d.length && (se(c), c.c.push.apply(c.c, x(d)), te(c));
            tc(this) &&
                (ue(a, this, b),
                (h = L(this)),
                h.root ? ((f = !1), uc(this) && te(h.root)) : c && this.localName === 'slot' && ((f = !1), te(c)));
            f
                ? ((c = O(this) ? this.host : this),
                  b ? ((b = oe(b)), c.__shady_native_insertBefore(a, b)) : c.__shady_native_appendChild(a))
                : a.ownerDocument !== this.ownerDocument && this.ownerDocument.adoptNode(a);
            return a;
        },
        appendChild: function(a) {
            if (this != a || !O(a)) return this.__shady_insertBefore(a);
        },
        removeChild: function(a, b) {
            b = void 0 === b ? !1 : b;
            if (this.ownerDocument !== ie) return this.__shady_native_removeChild(a);
            if (a.__shady_parentNode !== this) throw Error('The node to be removed is not a child of this node: ' + a);
            pe(this, null, a);
            const c = re(a);
            const d = c && ve(c, a);
            const e = L(this);
            if (tc(this) && (we(a, this), uc(this))) {
                te(e.root);
                var f = !0;
            }
            if (ce() && !b && c && a.nodeType !== Node.TEXT_NODE) {
                const g = ge(a);
                he(a, function(h) {
                    ee(h, g);
                });
            }
            ne(a);
            c && ((b = this.localName === 'slot') && (f = !0), (d || b) && te(c));
            f ||
                ((f = O(this) ? this.host : this),
                ((!e.root && a.localName !== 'slot') || f === a.__shady_native_parentNode) &&
                    f.__shady_native_removeChild(a));
            return a;
        },
        replaceChild: function(a, b) {
            this.__shady_insertBefore(a, b);
            this.__shady_removeChild(b);
            return a;
        },
        cloneNode: function(a) {
            if (this.localName == 'template') return this.__shady_native_cloneNode(a);
            const b = this.__shady_native_cloneNode(!1);
            if (a && b.nodeType !== Node.ATTRIBUTE_NODE) {
                a = this.__shady_firstChild;
                for (var c; a; a = a.__shady_nextSibling) (c = a.__shady_cloneNode(!0)), b.__shady_appendChild(c);
            }
            return b;
        },
        getRootNode: function(a) {
            if (this && this.nodeType) {
                const b = D(this);
                let c = b.la;
                void 0 === c &&
                    (O(this)
                        ? ((c = this), (b.la = c))
                        : ((c = (c = this.__shady_parentNode) ? c.__shady_getRootNode(a) : this),
                          document.documentElement.__shady_native_contains(this) && (b.la = c)));
                return c;
            }
        },
        contains: function(a) {
            return Dc(this, a);
        },
    });
    const ze = Q({
        get assignedSlot() {
            let a = this.__shady_parentNode;
            (a = a && a.__shady_shadowRoot) && ye(a);
            return ((a = L(this)) && a.assignedSlot) || null;
        },
    });
    function Ae(a, b, c) {
        const d = [];
        Be(a, b, c, d);
        return d;
    }
    function Be(a, b, c, d) {
        for (a = a.__shady_firstChild; a; a = a.__shady_nextSibling) {
            var e;
            if ((e = a.nodeType === Node.ELEMENT_NODE)) {
                e = a;
                const f = b;
                const g = c;
                const h = d;
                const k = f(e);
                k && h.push(e);
                g && g(k) ? (e = k) : (Be(e, f, g, h), (e = void 0));
            }
            if (e) break;
        }
    }
    const Ce = {
        get firstElementChild() {
            let a = L(this);
            if (a && void 0 !== a.firstChild) {
                for (a = this.__shady_firstChild; a && a.nodeType !== Node.ELEMENT_NODE; ) {
                    a = a.__shady_nextSibling;
                }
                return a;
            }
            return this.__shady_native_firstElementChild;
        },
        get lastElementChild() {
            let a = L(this);
            if (a && void 0 !== a.lastChild) {
                for (a = this.__shady_lastChild; a && a.nodeType !== Node.ELEMENT_NODE; ) {
                    a = a.__shady_previousSibling;
                }
                return a;
            }
            return this.__shady_native_lastElementChild;
        },
        get children() {
            return tc(this)
                ? Ec(
                      Array.prototype.filter.call(Hc(this), function(a) {
                          return a.nodeType === Node.ELEMENT_NODE;
                      }),
                  )
                : this.__shady_native_children;
        },
        get childElementCount() {
            const a = this.__shady_children;
            return a ? a.length : 0;
        },
    };
    const De = Q(
        ((Ce.append = function (a) {
            for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
            this.__shady_insertBefore(Mc.apply(null, x(b)), null);
        }),
        (Ce.prepend = function (a) {
            for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
            this.__shady_insertBefore(Mc.apply(null, x(b)), this.__shady_firstChild);
        }),
        (Ce.replaceChildren = function (a) {
            for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
            for (; (c = this.__shady_firstChild) !== null; ) this.__shady_removeChild(c);
            this.__shady_insertBefore(Mc.apply(null, x(b)), null);
        }),
        Ce),
    );
    const Ee = Q({
        querySelector: function (a) {
            return (
                Ae(
                    this,
                    function (b) {
                        return xc.call(b, a);
                    },
                    function (b) {
                        return !!b;
                    },
                )[0] || null
            );
        },
        querySelectorAll: function (a, b) {
            if (b) {
                b = Array.prototype.slice.call(this.__shady_native_querySelectorAll(a));
                const c = this.__shady_getRootNode();
                return Ec(
                    b.filter(function (d) {
                        return d.__shady_getRootNode() == c;
                    }),
                );
            }
            return Ec(
                Ae(this, function (d) {
                    return xc.call(d, a);
                }),
            );
        },
    });
    const Fe = N.aa && !N.D ? Kc({}, De) : De;
    Kc(De, Ee);
    const Ge = Q({
        after: function(a) {
            for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
            c = this.__shady_parentNode;
            if (c !== null) {
                const d = this.__shady_nextSibling;
                c.__shady_insertBefore(Mc.apply(null, x(b)), d);
            }
        },
        before: function(a) {
            for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
            c = this.__shady_parentNode;
            c !== null && c.__shady_insertBefore(Mc.apply(null, x(b)), this);
        },
        remove: function() {
            const a = this.__shady_parentNode;
            a !== null && a.__shady_removeChild(this);
        },
        replaceWith: function(a) {
            for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
            c = this.__shady_parentNode;
            if (c !== null) {
                const d = this.__shady_nextSibling;
                c.__shady_removeChild(this);
                c.__shady_insertBefore(Mc.apply(null, x(b)), d);
            }
        },
    });
    const He = window.document;
    function Ie(a, b) {
        if (b === 'slot') (a = a.__shady_parentNode), uc(a) && te(L(a).root);
        else if (a.localName === 'slot' && b === 'name' && (b = re(a))) {
            if (b.a) {
                Je(b);
                let c = a.La;
                const d = Ke(a);
                if (d !== c) {
                    c = b.b[c];
                    const e = c.indexOf(a);
                    e >= 0 && c.splice(e, 1);
                    c = b.b[d] || (b.b[d] = []);
                    c.push(a);
                    c.length > 1 && (b.b[d] = Le(c));
                }
            }
            te(b);
        }
    }
    const Me = Q({
        get previousElementSibling() {
            let a = L(this);
            if (a && void 0 !== a.previousSibling) {
                for (a = this.__shady_previousSibling; a && a.nodeType !== Node.ELEMENT_NODE; ) {
                    a = a.__shady_previousSibling;
                }
                return a;
            }
            return this.__shady_native_previousElementSibling;
        },
        get nextElementSibling() {
            let a = L(this);
            if (a && void 0 !== a.nextSibling) {
                for (a = this.__shady_nextSibling; a && a.nodeType !== Node.ELEMENT_NODE; ) a = a.__shady_nextSibling;
                return a;
            }
            return this.__shady_native_nextElementSibling;
        },
        get slot() {
            return this.getAttribute('slot');
        },
        set slot(a) {
            this.__shady_setAttribute('slot', a);
        },
        get className() {
            return this.getAttribute('class') || '';
        },
        set className(a) {
            this.__shady_setAttribute('class', a);
        },
        setAttribute: function(a, b) {
            this.ownerDocument !== He
                ? this.__shady_native_setAttribute(a, b)
                : de(this, a, b) || (this.__shady_native_setAttribute(a, b), Ie(this, a));
        },
        removeAttribute: function(a) {
            this.ownerDocument !== He
                ? this.__shady_native_removeAttribute(a)
                : de(this, a, '')
                ? this.getAttribute(a) === '' && this.__shady_native_removeAttribute(a)
                : (this.__shady_native_removeAttribute(a), Ie(this, a));
        },
    });
    N.aa ||
        Vd.forEach(function(a) {
            Me[a] = Xd(a);
        });
    const Re = Q({
        attachShadow: function(a) {
            if (!this) throw Error('Must provide a host.');
            if (!a) throw Error('Not enough arguments.');
            if (a.shadyUpgradeFragment && !N.Ia) {
                var b = a.shadyUpgradeFragment;
                b.__proto__ = ShadowRoot.prototype;
                Ne(b, this, a);
                Oe(b, b);
                a = b.__noInsertionPoint ? null : b.querySelectorAll('slot');
                b.__noInsertionPoint = void 0;
                if (a && a.length) {
                    const c = b;
                    se(c);
                    c.c.push.apply(c.c, x(a));
                    te(b);
                }
                b.host.__shady_native_appendChild(b);
            } else b = new Pe(Qe, this, a);
            return (this.__CE_shadowRoot = b);
        },
        get shadowRoot() {
            const a = L(this);
            return (a && a.bb) || null;
        },
    });
    Kc(Me, Re);
    const Se = document.implementation.createHTMLDocument('inert');
    const Te = Q({
        get innerHTML() {
            return tc(this)
                ? bd(this.localName === 'template' ? this.content : this, Hc)
                : this.__shady_native_innerHTML;
        },
        set innerHTML(a) {
            if (this.localName === 'template') this.__shady_native_innerHTML = a;
            else {
                me(this);
                let b = this.localName || 'div';
                b =
                    this.namespaceURI && this.namespaceURI !== Se.namespaceURI
                        ? Se.createElementNS(this.namespaceURI, b)
                        : Se.createElement(b);
                for (N.B ? (b.__shady_native_innerHTML = a) : (b.innerHTML = a); (a = b.__shady_firstChild); ) {
                    this.__shady_insertBefore(a);
                }
            }
        },
    });
    const Ue = Q({
        blur: function() {
            let a = L(this);
            (a = (a = a && a.root) && a.activeElement) ? a.__shady_blur() : this.__shady_native_blur();
        },
    });
    N.aa ||
        Wd.forEach(function(a) {
            Ue[a] = Xd(a);
        });
    const Ve = Q({
        assignedNodes: function(a) {
            if (this.localName === 'slot') {
                let b = this.__shady_getRootNode();
                b && O(b) && ye(b);
                return (b = L(this)) ? (a && a.flatten ? b.V : b.assignedNodes) || [] : [];
            }
        },
        addEventListener: function(a, b, c) {
            if (this.localName !== 'slot' || a === 'slotchange') Nd.call(this, a, b, c);
            else {
                typeof c !== 'object' && (c = { capture: !!c });
                const d = this.__shady_parentNode;
                if (!d) throw Error('ShadyDOM cannot attach event to slot unless it has a `parentNode`');
                c.O = this;
                d.__shady_addEventListener(a, b, c);
            }
        },
        removeEventListener: function(a, b, c) {
            if (this.localName !== 'slot' || a === 'slotchange') Od.call(this, a, b, c);
            else {
                typeof c !== 'object' && (c = { capture: !!c });
                const d = this.__shady_parentNode;
                if (!d) throw Error('ShadyDOM cannot attach event to slot unless it has a `parentNode`');
                c.O = this;
                d.__shady_removeEventListener(a, b, c);
            }
        },
    });
    const We = Q({
        getElementById: function(a) {
            return a === ''
                ? null
                : Ae(
                      this,
                      function(b) {
                          return b.id == a;
                      },
                      function(b) {
                          return !!b;
                      },
                  )[0] || null;
        },
    });
    const Xe = Q({
        get activeElement() {
            let a = N.B ? document.__shady_native_activeElement : document.activeElement;
            if (!a || !a.nodeType) return null;
            let b = !!O(this);
            if (!(this === document || (b && this.host !== a && this.host.__shady_native_contains(a)))) return null;
            for (b = re(a); b && b !== this; ) (a = b.host), (b = re(a));
            return this === document ? (b ? null : a) : b === this ? a : null;
        },
    });
    const Ye = window.document;
    const Ze = Q({
        importNode: function(a, b) {
            if (a.ownerDocument !== Ye || a.localName === 'template') return this.__shady_native_importNode(a, b);
            const c = this.__shady_native_importNode(a, !1);
            if (b) {
                for (a = a.__shady_firstChild; a; a = a.__shady_nextSibling) {
                    (b = this.__shady_importNode(a, !0)), c.__shady_appendChild(b);
                }
            }
            return c;
        },
    });
    const $e = Q({ dispatchEvent: Ld, addEventListener: Nd.bind(window), removeEventListener: Od.bind(window) });
    const af = {};
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'parentElement') && (af.parentElement = xe.parentElement);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'contains') && (af.contains = xe.contains);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'children') && (af.children = De.children);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML') && (af.innerHTML = Te.innerHTML);
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'className') && (af.className = Me.className);
    const bf = {
        EventTarget: [ae],
        Node: [xe, window.EventTarget ? null : ae],
        Text: [ze],
        Comment: [ze],
        CDATASection: [ze],
        ProcessingInstruction: [ze],
        Element: [
            Me,
            De,
            Ge,
            ze,
            !N.B || 'innerHTML' in Element.prototype ? Te : null,
            window.HTMLSlotElement ? null : Ve,
        ],
        HTMLElement: [Ue, af],
        HTMLSlotElement: [Ve],
        DocumentFragment: [Fe, We],
        Document: [Ze, Fe, We, Xe],
        Window: [$e],
        CharacterData: [Ge],
    };
    const cf = N.B ? null : ['innerHTML', 'textContent'];
    function df(a, b, c, d) {
        b.forEach(function(e) {
            return a && e && P(a, e, c, d);
        });
    }
    function ef(a) {
        const b = a ? null : cf;
        let c;
        for (c in bf) df(window[c] && window[c].prototype, bf[c], a, b);
    }
    ['Text', 'Comment', 'CDATASection', 'ProcessingInstruction'].forEach(function(a) {
        const b = window[a];
        const c = Object.create(b.prototype);
        c.__shady_protoIsPatched = !0;
        df(c, bf.EventTarget);
        df(c, bf.Node);
        bf[a] && df(c, bf[a]);
        b.prototype.__shady_patchedProto = c;
    });
    function ff(a) {
        a.__shady_protoIsPatched = !0;
        df(a, bf.EventTarget);
        df(a, bf.Node);
        df(a, bf.Element);
        df(a, bf.HTMLElement);
        df(a, bf.HTMLSlotElement);
        return a;
    }
    const gf = N.ua;
    const hf = N.B;
    function jf(a, b) {
        if (gf && !a.__shady_protoIsPatched && !O(a)) {
            const c = Object.getPrototypeOf(a);
            let d = c.hasOwnProperty('__shady_patchedProto') && c.__shady_patchedProto;
            d || ((d = Object.create(c)), ff(d), (c.__shady_patchedProto = d));
            Object.setPrototypeOf(a, d);
        }
        hf || (b === 1 ? td(a) : b === 2 && ud(a));
    }
    function kf(a, b, c, d) {
        jf(a, 1);
        d = d || null;
        const e = D(a);
        let f = d ? D(d) : null;
        e.previousSibling = d ? f.previousSibling : b.__shady_lastChild;
        if ((f = L(e.previousSibling))) f.nextSibling = a;
        if ((f = L((e.nextSibling = d)))) f.previousSibling = a;
        e.parentNode = b;
        d ? d === c.firstChild && (c.firstChild = a) : ((c.lastChild = a), c.firstChild || (c.firstChild = a));
        c.childNodes = null;
    }
    function ue(a, b, c) {
        jf(b, 2);
        const d = D(b);
        void 0 !== d.firstChild && (d.childNodes = null);
        if (a.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            for (a = a.__shady_native_firstChild; a; a = a.__shady_native_nextSibling) kf(a, b, d, c);
        } else kf(a, b, d, c);
    }
    function we(a, b) {
        const c = D(a);
        b = D(b);
        a === b.firstChild && (b.firstChild = c.nextSibling);
        a === b.lastChild && (b.lastChild = c.previousSibling);
        a = c.previousSibling;
        const d = c.nextSibling;
        a && (D(a).nextSibling = d);
        d && (D(d).previousSibling = a);
        c.parentNode = c.previousSibling = c.nextSibling = void 0;
        void 0 !== b.childNodes && (b.childNodes = null);
    }
    function Oe(a, b) {
        let c = D(a);
        if (b || void 0 === c.firstChild) {
            c.childNodes = null;
            let d = (c.firstChild = a.__shady_native_firstChild);
            c.lastChild = a.__shady_native_lastChild;
            jf(a, 2);
            c = d;
            for (d = void 0; c; c = c.__shady_native_nextSibling) {
                const e = D(c);
                e.parentNode = b || a;
                e.nextSibling = c.__shady_native_nextSibling;
                e.previousSibling = d || null;
                d = c;
                jf(c, 1);
            }
        }
    }
    const lf = Q({
        addEventListener: function(a, b, c) {
            typeof c !== 'object' && (c = { capture: !!c });
            c.O = c.O || this;
            this.host.__shady_addEventListener(a, b, c);
        },
        removeEventListener: function(a, b, c) {
            typeof c !== 'object' && (c = { capture: !!c });
            c.O = c.O || this;
            this.host.__shady_removeEventListener(a, b, c);
        },
    });
    function mf(a, b) {
        P(a, lf, b);
        P(a, Xe, b);
        P(a, Te, b);
        P(a, De, b);
        N.D && !b ? (P(a, xe, b), P(a, We, b)) : N.B || (P(a, qd), P(a, od), P(a, pd));
    }
    var Qe = {};
    let nf = N.deferConnectionCallbacks && document.readyState === 'loading';
    let of;
    function pf(a) {
        const b = [];
        do b.unshift(a);
        while ((a = a.__shady_parentNode));
        return b;
    }
    function Pe(a, b, c) {
        if (a !== Qe) throw new TypeError('Illegal constructor');
        this.a = null;
        Ne(this, b, c);
    }
    function Ne(a, b, c) {
        a.host = b;
        a.mode = c && c.mode;
        Oe(a.host);
        b = D(a.host);
        b.root = a;
        b.bb = a.mode !== 'closed' ? a : null;
        b = D(a);
        b.firstChild = b.lastChild = b.parentNode = b.nextSibling = b.previousSibling = null;
        if (N.preferPerformance) for (; (b = a.host.__shady_native_firstChild); ) a.host.__shady_native_removeChild(b);
        else te(a);
    }
    function te(a) {
        a.T ||
            ((a.T = !0),
            Pc(function() {
                return ye(a);
            }));
    }
    function ye(a) {
        let b;
        if ((b = a.T)) {
            for (var c; a; ) {
                a: {
                    a.T && (c = a), (b = a);
                    a = b.host.__shady_getRootNode();
                    if (O(a) && (b = L(b.host)) && b.da > 0) break a;
                    a = void 0;
                }
            }
            b = c;
        }
        (c = b) && c._renderSelf();
    }
    Pe.prototype._renderSelf = function() {
        const a = nf;
        nf = !0;
        this.T = !1;
        if (this.a) {
            Je(this);
            for (var b = 0, c; b < this.a.length; b++) {
                c = this.a[b];
                var d = L(c);
                var e = d.assignedNodes;
                d.assignedNodes = [];
                d.V = [];
                if ((d.Ba = e)) {
                    for (d = 0; d < e.length; d++) {
                        var f = L(e[d]);
                        f.oa = f.assignedSlot;
                        f.assignedSlot === c && (f.assignedSlot = null);
                    }
                }
            }
            for (b = this.host.__shady_firstChild; b; b = b.__shady_nextSibling) qf(this, b);
            for (b = 0; b < this.a.length; b++) {
                c = this.a[b];
                e = L(c);
                if (!e.assignedNodes.length) {
                    for (d = c.__shady_firstChild; d; d = d.__shady_nextSibling) qf(this, d, c);
                }
                (d = (d = L(c.__shady_parentNode)) && d.root) && (vc(d) || d.T) && d._renderSelf();
                rf(this, e.V, e.assignedNodes);
                if ((d = e.Ba)) {
                    for (f = 0; f < d.length; f++) L(d[f]).oa = null;
                    e.Ba = null;
                    d.length > e.assignedNodes.length && (e.ra = !0);
                }
                e.ra && ((e.ra = !1), sf(this, c));
            }
            c = this.a;
            b = [];
            for (e = 0; e < c.length; e++) {
                (d = c[e].__shady_parentNode), ((f = L(d)) && f.root) || !(b.indexOf(d) < 0) || b.push(d);
            }
            for (c = 0; c < b.length; c++) {
                f = b[c];
                e = f === this ? this.host : f;
                d = [];
                for (f = f.__shady_firstChild; f; f = f.__shady_nextSibling) {
                    if (f.localName == 'slot') for (var g = L(f).V, h = 0; h < g.length; h++) d.push(g[h]);
                    else d.push(f);
                }
                f = Fc(e);
                g = Zd(d, d.length, f, f.length);
                for (var k = (h = 0), l = void 0; h < g.length && (l = g[h]); h++) {
                    for (var m = 0, q = void 0; m < l.ba.length && (q = l.ba[m]); m++) {
                        q.__shady_native_parentNode === e && e.__shady_native_removeChild(q), f.splice(l.index + k, 1);
                    }
                    k -= l.ia;
                }
                k = 0;
                for (l = void 0; k < g.length && (l = g[k]); k++) {
                    for (h = f[l.index], m = l.index; m < l.index + l.ia; m++) {
                        (q = d[m]), e.__shady_native_insertBefore(q, h), f.splice(m, 0, q);
                    }
                }
            }
        }
        if (!N.preferPerformance && !this.Aa) {
            for (b = this.host.__shady_firstChild; b; b = b.__shady_nextSibling) {
                (c = L(b)),
                    b.__shady_native_parentNode !== this.host ||
                        (b.localName !== 'slot' && c.assignedSlot) ||
                        this.host.__shady_native_removeChild(b);
            }
        }
        this.Aa = !0;
        nf = a;
        of && of();
    };
    function qf(a, b, c) {
        const d = D(b);
        const e = d.oa;
        d.oa = null;
        c || (c = (a = a.b[b.__shady_slot || '__catchall']) && a[0]);
        c ? (D(c).assignedNodes.push(b), (d.assignedSlot = c)) : (d.assignedSlot = void 0);
        e !== d.assignedSlot && d.assignedSlot && (D(d.assignedSlot).ra = !0);
    }
    function rf(a, b, c) {
        for (let d = 0, e = void 0; d < c.length && (e = c[d]); d++) {
            if (e.localName == 'slot') {
                const f = L(e).assignedNodes;
                f && f.length && rf(a, b, f);
            } else b.push(c[d]);
        }
    }
    function sf(a, b) {
        b.__shady_native_dispatchEvent(new Event('slotchange'));
        b = L(b);
        b.assignedSlot && sf(a, b.assignedSlot);
    }
    function se(a) {
        a.c = a.c || [];
        a.a = a.a || [];
        a.b = a.b || {};
    }
    function Je(a) {
        if (a.c && a.c.length) {
            for (var b = a.c, c, d = 0; d < b.length; d++) {
                const e = b[d];
                Oe(e);
                let f = e.__shady_parentNode;
                Oe(f);
                f = L(f);
                f.da = (f.da || 0) + 1;
                f = Ke(e);
                a.b[f] ? ((c = c || {}), (c[f] = !0), a.b[f].push(e)) : (a.b[f] = [e]);
                a.a.push(e);
            }
            if (c) for (const g in c) a.b[g] = Le(a.b[g]);
            a.c = [];
        }
    }
    function Ke(a) {
        const b = a.name || a.getAttribute('name') || '__catchall';
        return (a.La = b);
    }
    function Le(a) {
        return a.sort(function(b, c) {
            b = pf(b);
            for (let d = pf(c), e = 0; e < b.length; e++) {
                c = b[e];
                const f = d[e];
                if (c !== f) return (b = Hc(c.__shady_parentNode)), b.indexOf(c) - b.indexOf(f);
            }
        });
    }
    function ve(a, b) {
        if (a.a) {
            Je(a);
            const c = a.b;
            let d;
            for (d in c) {
                for (let e = c[d], f = 0; f < e.length; f++) {
                    let g = e[f];
                    if (Dc(b, g)) {
                        e.splice(f, 1);
                        var h = a.a.indexOf(g);
                        h >= 0 && (a.a.splice(h, 1), (h = L(g.__shady_parentNode)) && h.da && h.da--);
                        f--;
                        g = L(g);
                        if ((h = g.V)) {
                            for (let k = 0; k < h.length; k++) {
                                const l = h[k];
                                const m = l.__shady_native_parentNode;
                                m && m.__shady_native_removeChild(l);
                            }
                        }
                        g.V = [];
                        g.assignedNodes = [];
                        h = !0;
                    }
                }
            }
            return h;
        }
    }
    function vc(a) {
        Je(a);
        return !(!a.a || !a.a.length);
    }
    (function(a) {
        a.__proto__ = DocumentFragment.prototype;
        mf(a, '__shady_');
        mf(a);
        Object.defineProperties(a, {
            nodeType: { value: Node.DOCUMENT_FRAGMENT_NODE, configurable: !0 },
            nodeName: { value: '#document-fragment', configurable: !0 },
            nodeValue: { value: null, configurable: !0 },
        });
        ['localName', 'namespaceURI', 'prefix'].forEach(function(b) {
            Object.defineProperty(a, b, { value: void 0, configurable: !0 });
        });
        ['ownerDocument', 'baseURI', 'isConnected'].forEach(function(b) {
            Object.defineProperty(a, b, {
                get: function() {
                    return this.host[b];
                },
                configurable: !0,
            });
        });
    })(Pe.prototype);
    if (window.customElements && window.customElements.define && N.sa && !N.preferPerformance) {
        const tf = new Map();
        of = function() {
            const a = [];
            tf.forEach(function(d, e) {
                a.push([e, d]);
            });
            tf.clear();
            for (let b = 0; b < a.length; b++) {
                const c = a[b][0];
                a[b][1] ? c.__shadydom_connectedCallback() : c.__shadydom_disconnectedCallback();
            }
        };
        nf &&
            document.addEventListener(
                'readystatechange',
                function() {
                    nf = !1;
                    of();
                },
                { once: !0 },
            );
        const uf = function(a, b, c) {
            let d = 0;
            const e = '__isConnected' + d++;
            if (b || c) {
                (a.prototype.connectedCallback = a.prototype.__shadydom_connectedCallback = function () {
                    nf ? tf.set(this, !0) : this[e] || ((this[e] = !0), b && b.call(this));
                }),
                    (a.prototype.disconnectedCallback = a.prototype.__shadydom_disconnectedCallback = function () {
                        nf ? this.isConnected || tf.set(this, !1) : this[e] && ((this[e] = !1), c && c.call(this));
                    });
            }
            return a;
        };
        const vf = window.customElements.define;
        const wf = function(a, b) {
            const c = b.prototype.connectedCallback;
            const d = b.prototype.disconnectedCallback;
            vf.call(window.customElements, a, uf(b, c, d));
            b.prototype.connectedCallback = c;
            b.prototype.disconnectedCallback = d;
        };
        window.customElements.define = wf;
        Object.defineProperty(window.CustomElementRegistry.prototype, 'define', { value: wf, configurable: !0 });
    }
    function re(a) {
        a = a.__shady_getRootNode();
        if (O(a)) return a;
    }
    function xf(a) {
        this.node = a;
    }
    v = xf.prototype;
    v.addEventListener = function(a, b, c) {
        return this.node.__shady_addEventListener(a, b, c);
    };
    v.removeEventListener = function(a, b, c) {
        return this.node.__shady_removeEventListener(a, b, c);
    };
    v.appendChild = function(a) {
        return this.node.__shady_appendChild(a);
    };
    v.insertBefore = function(a, b) {
        return this.node.__shady_insertBefore(a, b);
    };
    v.removeChild = function(a) {
        return this.node.__shady_removeChild(a);
    };
    v.replaceChild = function(a, b) {
        return this.node.__shady_replaceChild(a, b);
    };
    v.cloneNode = function(a) {
        return this.node.__shady_cloneNode(a);
    };
    v.getRootNode = function(a) {
        return this.node.__shady_getRootNode(a);
    };
    v.contains = function(a) {
        return this.node.__shady_contains(a);
    };
    v.dispatchEvent = function(a) {
        return this.node.__shady_dispatchEvent(a);
    };
    v.setAttribute = function(a, b) {
        this.node.__shady_setAttribute(a, b);
    };
    v.getAttribute = function(a) {
        return this.node.__shady_native_getAttribute(a);
    };
    v.hasAttribute = function(a) {
        return this.node.__shady_native_hasAttribute(a);
    };
    v.removeAttribute = function(a) {
        this.node.__shady_removeAttribute(a);
    };
    v.attachShadow = function(a) {
        return this.node.__shady_attachShadow(a);
    };
    v.focus = function() {
        this.node.__shady_native_focus();
    };
    v.blur = function() {
        this.node.__shady_blur();
    };
    v.importNode = function(a, b) {
        if (this.node.nodeType === Node.DOCUMENT_NODE) return this.node.__shady_importNode(a, b);
    };
    v.getElementById = function(a) {
        if (this.node.nodeType === Node.DOCUMENT_NODE) return this.node.__shady_getElementById(a);
    };
    v.querySelector = function(a) {
        return this.node.__shady_querySelector(a);
    };
    v.querySelectorAll = function(a, b) {
        return this.node.__shady_querySelectorAll(a, b);
    };
    v.assignedNodes = function(a) {
        if (this.node.localName === 'slot') return this.node.__shady_assignedNodes(a);
    };
    v.append = function(a) {
        for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
        return this.node.__shady_append.apply(this.node, x(b));
    };
    v.prepend = function(a) {
        for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
        return this.node.__shady_prepend.apply(this.node, x(b));
    };
    v.after = function(a) {
        for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
        return this.node.__shady_after.apply(this.node, x(b));
    };
    v.before = function(a) {
        for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
        return this.node.__shady_before.apply(this.node, x(b));
    };
    v.remove = function() {
        return this.node.__shady_remove();
    };
    v.replaceWith = function(a) {
        for (var b = [], c = 0; c < arguments.length; ++c) b[c] = arguments[c];
        return this.node.__shady_replaceWith.apply(this.node, x(b));
    };
    da.Object.defineProperties(xf.prototype, {
        activeElement: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                if (O(this.node) || this.node.nodeType === Node.DOCUMENT_NODE) return this.node.__shady_activeElement;
            },
        },
        _activeElement: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.activeElement;
            },
        },
        host: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                if (O(this.node)) return this.node.host;
            },
        },
        parentNode: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_parentNode;
            },
        },
        firstChild: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_firstChild;
            },
        },
        lastChild: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_lastChild;
            },
        },
        nextSibling: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_nextSibling;
            },
        },
        previousSibling: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_previousSibling;
            },
        },
        childNodes: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_childNodes;
            },
        },
        parentElement: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_parentElement;
            },
        },
        firstElementChild: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_firstElementChild;
            },
        },
        lastElementChild: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_lastElementChild;
            },
        },
        nextElementSibling: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_nextElementSibling;
            },
        },
        previousElementSibling: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_previousElementSibling;
            },
        },
        children: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_children;
            },
        },
        childElementCount: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_childElementCount;
            },
        },
        shadowRoot: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_shadowRoot;
            },
        },
        assignedSlot: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_assignedSlot;
            },
        },
        isConnected: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_isConnected;
            },
        },
        innerHTML: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_innerHTML;
            },
            set: function(a) {
                this.node.__shady_innerHTML = a;
            },
        },
        textContent: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_textContent;
            },
            set: function(a) {
                this.node.__shady_textContent = a;
            },
        },
        slot: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_slot;
            },
            set: function(a) {
                this.node.__shady_slot = a;
            },
        },
        className: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.node.__shady_className;
            },
            set: function(a) {
                return (this.node.__shady_className = a);
            },
        },
    });
    function yf(a) {
        Object.defineProperty(xf.prototype, a, {
            get: function() {
                return this.node['__shady_' + a];
            },
            set: function(b) {
                this.node['__shady_' + a] = b;
            },
            configurable: !0,
        });
    }
    Vd.forEach(function(a) {
        return yf(a);
    });
    Wd.forEach(function(a) {
        return yf(a);
    });
    const zf = new WeakMap();
    function Af(a) {
        if (O(a) || a instanceof xf) return a;
        let b = zf.get(a);
        b || ((b = new xf(a)), zf.set(a, b));
        return b;
    }
    if (N.sa) {
        const Bf = N.B
            ? function(a) {
                  return a;
              }
            : function(a) {
                  ud(a);
                  td(a);
                  return a;
              };
        const ShadyDOM = {
            inUse: N.sa,
            patch: Bf,
            isShadyRoot: O,
            enqueue: Pc,
            flush: Qc,
            flushInitial: function(a) {
                !a.Aa && a.T && ye(a);
            },
            settings: N,
            filterMutations: Vc,
            observeChildren: Tc,
            unobserveChildren: Uc,
            deferConnectionCallbacks: N.deferConnectionCallbacks,
            preferPerformance: N.preferPerformance,
            handlesDynamicScoping: !0,
            wrap: N.D ? Af : Bf,
            wrapIfNeeded:
                !0 === N.D
                    ? Af
                    : function(a) {
                          return a;
                      },
            Wrapper: xf,
            composedPath: Dd,
            noPatch: N.D,
            patchOnDemand: N.ua,
            nativeMethods: dd,
            nativeTree: ed,
            patchElementProto: ff,
        };
        window.ShadyDOM = ShadyDOM;
        nd();
        ef('__shady_');
        Object.defineProperty(document, '_activeElement', Xe.activeElement);
        P(Window.prototype, $e, '__shady_');
        N.D ? N.ua && P(Element.prototype, Re) : (ef(), Ud());
        Pd();
        window.Event = Rd;
        window.CustomEvent = Sd;
        window.MouseEvent = Td;
        window.ShadowRoot = Pe;
    } /*

 Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 Google as part of the polymer project is also subject to an additional IP
 rights grant found at http://polymer.github.io/PATENTS.txt
*/
    const Cf = window.Document.prototype.createElement;
    const Df = window.Document.prototype.createElementNS;
    const Ef = window.Document.prototype.importNode;
    const Ff = window.Document.prototype.prepend;
    const Gf = window.Document.prototype.append;
    const Hf = window.DocumentFragment.prototype.prepend;
    const If = window.DocumentFragment.prototype.append;
    const Jf = window.Node.prototype.cloneNode;
    const Kf = window.Node.prototype.appendChild;
    const Lf = window.Node.prototype.insertBefore;
    const Mf = window.Node.prototype.removeChild;
    const Nf = window.Node.prototype.replaceChild;
    const Of = Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent');
    const Pf = window.Element.prototype.attachShadow;
    const Qf = Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML');
    const Rf = window.Element.prototype.getAttribute;
    const Sf = window.Element.prototype.setAttribute;
    const Tf = window.Element.prototype.removeAttribute;
    const Uf = window.Element.prototype.getAttributeNS;
    const Vf = window.Element.prototype.setAttributeNS;
    const Wf = window.Element.prototype.removeAttributeNS;
    const Xf = window.Element.prototype.insertAdjacentElement;
    const Yf = window.Element.prototype.insertAdjacentHTML;
    const Zf = window.Element.prototype.prepend;
    const $f = window.Element.prototype.append;
    const ag = window.Element.prototype.before;
    const bg = window.Element.prototype.after;
    const cg = window.Element.prototype.replaceWith;
    const dg = window.Element.prototype.remove;
    const eg = window.HTMLElement;
    const fg = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML');
    const gg = window.HTMLElement.prototype.insertAdjacentElement;
    const hg = window.HTMLElement.prototype.insertAdjacentHTML;
    const ig = new Set();
    'annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph'
        .split(' ')
        .forEach(function(a) {
            return ig.add(a);
        });
    function jg(a) {
        const b = ig.has(a);
        a = /^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/.test(a);
        return !b && a;
    }
    const kg = document.contains
        ? document.contains.bind(document)
        : document.documentElement.contains.bind(document.documentElement);
    function T(a) {
        const b = a.isConnected;
        if (void 0 !== b) return b;
        if (kg(a)) return !0;
        for (; a && !(a.__CE_isImportDocument || a instanceof Document); ) {
            a = a.parentNode || (window.ShadowRoot && a instanceof ShadowRoot ? a.host : void 0);
        }
        return !(!a || !(a.__CE_isImportDocument || a instanceof Document));
    }
    function lg(a) {
        let b = a.children;
        if (b) return Array.prototype.slice.call(b);
        b = [];
        for (a = a.firstChild; a; a = a.nextSibling) a.nodeType === Node.ELEMENT_NODE && b.push(a);
        return b;
    }
    function mg(a, b) {
        for (; b && b !== a && !b.nextSibling; ) b = b.parentNode;
        return b && b !== a ? b.nextSibling : null;
    }
    function ng(a, b, c) {
        for (let d = a; d; ) {
            if (d.nodeType === Node.ELEMENT_NODE) {
                let e = d;
                b(e);
                const f = e.localName;
                if (f === 'link' && e.getAttribute('rel') === 'import') {
                    d = e.import;
                    void 0 === c && (c = new Set());
                    if (d instanceof Node && !c.has(d)) {
                        for (c.add(d), d = d.firstChild; d; d = d.nextSibling) ng(d, b, c);
                    }
                    d = mg(a, e);
                    continue;
                } else if (f === 'template') {
                    d = mg(a, e);
                    continue;
                }
                if ((e = e.__CE_shadowRoot)) for (e = e.firstChild; e; e = e.nextSibling) ng(e, b, c);
            }
            d = d.firstChild ? d.firstChild : mg(a, d);
        }
    }
    function og() {
        const a = !(pg === null || void 0 === pg || !pg.noDocumentConstructionObserver);
        const b = !(pg === null || void 0 === pg || !pg.shadyDomFastWalk);
        this.X = [];
        this.a = [];
        this.R = !1;
        this.shadyDomFastWalk = b;
        this.jb = !a;
    }
    function qg(a, b, c, d) {
        const e = window.ShadyDom;
        if (a.shadyDomFastWalk && e && e.inUse) {
            if ((b.nodeType === Node.ELEMENT_NODE && c(b), b.querySelectorAll)) {
                for (a = e.nativeMethods.querySelectorAll.call(b, '*'), b = 0; b < a.length; b++) c(a[b]);
            }
        } else ng(b, c, d);
    }
    function rg(a, b) {
        a.R = !0;
        a.X.push(b);
    }
    function sg(a, b) {
        a.R = !0;
        a.a.push(b);
    }
    function tg(a, b) {
        a.R &&
            qg(a, b, function(c) {
                return ug(a, c);
            });
    }
    function ug(a, b) {
        if (a.R && !b.__CE_patched) {
            b.__CE_patched = !0;
            for (var c = 0; c < a.X.length; c++) a.X[c](b);
            for (c = 0; c < a.a.length; c++) a.a[c](b);
        }
    }
    function vg(a, b) {
        const c = [];
        qg(a, b, function(e) {
            return c.push(e);
        });
        for (b = 0; b < c.length; b++) {
            const d = c[b];
            d.__CE_state === 1 ? a.connectedCallback(d) : wg(a, d);
        }
    }
    function xg(a, b) {
        const c = [];
        qg(a, b, function(e) {
            return c.push(e);
        });
        for (b = 0; b < c.length; b++) {
            const d = c[b];
            d.__CE_state === 1 && a.disconnectedCallback(d);
        }
    }
    function yg(a, b, c) {
        c = void 0 === c ? {} : c;
        const d = c.kb;
        const e =
            c.upgrade ||
            function (g) {
                return wg(a, g);
            };
        const f = [];
        qg(
            a,
            b,
            function(g) {
                a.R && ug(a, g);
                if (g.localName === 'link' && g.getAttribute('rel') === 'import') {
                    const h = g.import;
                    h instanceof Node && ((h.__CE_isImportDocument = !0), (h.__CE_registry = document.__CE_registry));
                    h && h.readyState === 'complete'
                        ? (h.__CE_documentLoadHandled = !0)
                        : g.addEventListener('load', function() {
                              const k = g.import;
                              if (!k.__CE_documentLoadHandled) {
                                  k.__CE_documentLoadHandled = !0;
                                  const l = new Set();
                                  d &&
                                      (d.forEach(function(m) {
                                          return l.add(m);
                                      }),
                                      l.delete(k));
                                  yg(a, k, { kb: l, upgrade: e });
                              }
                          });
                } else f.push(g);
            },
            d,
        );
        for (b = 0; b < f.length; b++) e(f[b]);
    }
    function wg(a, b) {
        try {
            const c = b.ownerDocument;
            const d = c.__CE_registry;
            let e = d && (c.defaultView || c.__CE_isImportDocument) ? zg(d, b.localName) : void 0;
            if (e && void 0 === b.__CE_state) {
                e.constructionStack.push(b);
                try {
                    try {
                        if (new e.constructorFunction() !== b) {
                            throw Error('The custom element constructor did not produce the element being upgraded.');
                        }
                    } finally {
                        e.constructionStack.pop();
                    }
                } catch (k) {
                    throw ((b.__CE_state = 2), k);
                }
                b.__CE_state = 1;
                b.__CE_definition = e;
                if (e.attributeChangedCallback && b.hasAttributes()) {
                    const f = e.observedAttributes;
                    for (e = 0; e < f.length; e++) {
                        const g = f[e];
                        const h = b.getAttribute(g);
                        h !== null && a.attributeChangedCallback(b, g, null, h, null);
                    }
                }
                T(b) && a.connectedCallback(b);
            }
        } catch (k) {
            Ag(k);
        }
    }
    og.prototype.connectedCallback = function(a) {
        const b = a.__CE_definition;
        if (b.connectedCallback) {
            try {
                b.connectedCallback.call(a);
            } catch (c) {
                Ag(c);
            }
        }
    };
    og.prototype.disconnectedCallback = function(a) {
        const b = a.__CE_definition;
        if (b.disconnectedCallback) {
            try {
                b.disconnectedCallback.call(a);
            } catch (c) {
                Ag(c);
            }
        }
    };
    og.prototype.attributeChangedCallback = function(a, b, c, d, e) {
        const f = a.__CE_definition;
        if (f.attributeChangedCallback && f.observedAttributes.indexOf(b) > -1) {
            try {
                f.attributeChangedCallback.call(a, b, c, d, e);
            } catch (g) {
                Ag(g);
            }
        }
    };
    function Bg(a, b, c, d) {
        let e = b.__CE_registry;
        if (e && (d === null || d === 'http://www.w3.org/1999/xhtml') && (e = zg(e, c))) {
            try {
                const f = new e.constructorFunction();
                if (void 0 === f.__CE_state || void 0 === f.__CE_definition) {
                    throw Error(
                        "Failed to construct '" +
                            c +
                            "': The returned value was not constructed with the HTMLElement constructor.",
                    );
                }
                if (f.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
                    throw Error(
                        "Failed to construct '" +
                            c +
                            "': The constructed element's namespace must be the HTML namespace.",
                    );
                }
                if (f.hasAttributes()) {
                    throw Error(
                        "Failed to construct '" + c + "': The constructed element must not have any attributes.",
                    );
                }
                if (f.firstChild !== null) {
                    throw Error("Failed to construct '" + c + "': The constructed element must not have any children.");
                }
                if (f.parentNode !== null) {
                    throw Error(
                        "Failed to construct '" + c + "': The constructed element must not have a parent node.",
                    );
                }
                if (f.ownerDocument !== b) {
                    throw Error(
                        "Failed to construct '" + c + "': The constructed element's owner document is incorrect.",
                    );
                }
                if (f.localName !== c) {
                    throw Error("Failed to construct '" + c + "': The constructed element's local name is incorrect.");
                }
                return f;
            } catch (g) {
                return (
                    Ag(g),
                    (b = d === null ? Cf.call(b, c) : Df.call(b, d, c)),
                    Object.setPrototypeOf(b, HTMLUnknownElement.prototype),
                    (b.__CE_state = 2),
                    (b.__CE_definition = void 0),
                    ug(a, b),
                    b
                );
            }
        }
        b = d === null ? Cf.call(b, c) : Df.call(b, d, c);
        ug(a, b);
        return b;
    }
    function Ag(a) {
        const b = a.message;
        const c = a.sourceURL || a.fileName || '';
        const d = a.line || a.lineNumber || 0;
        const e = a.column || a.columnNumber || 0;
        let f = void 0;
        void 0 === ErrorEvent.prototype.initErrorEvent
            ? (f = new ErrorEvent('error', { cancelable: !0, message: b, filename: c, lineno: d, colno: e, error: a }))
            : ((f = document.createEvent('ErrorEvent')),
              f.initErrorEvent('error', !1, !0, b, c, d),
              (f.preventDefault = function() {
                  Object.defineProperty(this, 'defaultPrevented', {
                      configurable: !0,
                      get: function() {
                          return !0;
                      },
                  });
              }));
        void 0 === f.error &&
            Object.defineProperty(f, 'error', {
                configurable: !0,
                enumerable: !0,
                get: function() {
                    return a;
                },
            });
        window.dispatchEvent(f);
        f.defaultPrevented || console.error(a);
    }
    function Cg() {
        const a = this;
        this.C = void 0;
        this.Ca = new Promise(function(b) {
            a.a = b;
        });
    }
    Cg.prototype.resolve = function(a) {
        if (this.C) throw Error('Already resolved.');
        this.C = a;
        this.a(a);
    };
    function Dg(a) {
        const b = document;
        this.S = void 0;
        this.M = a;
        this.a = b;
        yg(this.M, this.a);
        this.a.readyState === 'loading' &&
            ((this.S = new MutationObserver(this.b.bind(this))),
            this.S.observe(this.a, { childList: !0, subtree: !0 }));
    }
    function Eg(a) {
        a.S && a.S.disconnect();
    }
    Dg.prototype.b = function(a) {
        let b = this.a.readyState;
        (b !== 'interactive' && b !== 'complete') || Eg(this);
        for (b = 0; b < a.length; b++) for (let c = a[b].addedNodes, d = 0; d < c.length; d++) yg(this.M, c[d]);
    };
    function U(a) {
        this.fa = new Map();
        this.ga = new Map();
        this.xa = new Map();
        this.na = !1;
        this.qa = new Map();
        this.ea = function(b) {
            return b();
        };
        this.P = !1;
        this.ha = [];
        this.M = a;
        this.ya = a.jb ? new Dg(a) : void 0;
    }
    v = U.prototype;
    v.$a = function(a, b) {
        const c = this;
        if (!(b instanceof Function)) throw new TypeError('Custom element constructor getters must be functions.');
        Fg(this, a);
        this.fa.set(a, b);
        this.ha.push(a);
        this.P ||
            ((this.P = !0),
            this.ea(function() {
                return Gg(c);
            }));
    };
    v.define = function(a, b) {
        const c = this;
        if (!(b instanceof Function)) throw new TypeError('Custom element constructors must be functions.');
        Fg(this, a);
        Hg(this, a, b);
        this.ha.push(a);
        this.P ||
            ((this.P = !0),
            this.ea(function() {
                return Gg(c);
            }));
    };
    function Fg(a, b) {
        if (!jg(b)) throw new SyntaxError("The element name '" + b + "' is not valid.");
        if (zg(a, b)) throw Error("A custom element with name '" + (b + "' has already been defined."));
        if (a.na) throw Error('A custom element is already being defined.');
    }
    function Hg(a, b, c) {
        a.na = !0;
        let d;
        try {
            const e = c.prototype;
            if (!(e instanceof Object)) {
                throw new TypeError("The custom element constructor's prototype is not an object.");
            }
            const f = function(m) {
                const q = e[m];
                if (void 0 !== q && !(q instanceof Function)) {
                    throw Error("The '" + m + "' callback must be a function.");
                }
                return q;
            };
            var g = f('connectedCallback');
            var h = f('disconnectedCallback');
            var k = f('adoptedCallback');
            var l = ((d = f('attributeChangedCallback')) && c.observedAttributes) || [];
        } catch (m) {
            throw m;
        } finally {
            a.na = !1;
        }
        c = {
            localName: b,
            constructorFunction: c,
            connectedCallback: g,
            disconnectedCallback: h,
            adoptedCallback: k,
            attributeChangedCallback: d,
            observedAttributes: l,
            constructionStack: [],
        };
        a.ga.set(b, c);
        a.xa.set(c.constructorFunction, c);
        return c;
    }
    v.upgrade = function(a) {
        yg(this.M, a);
    };
    function Gg(a) {
        if (!1 !== a.P) {
            a.P = !1;
            for (var b = [], c = a.ha, d = new Map(), e = 0; e < c.length; e++) d.set(c[e], []);
            yg(a.M, document, {
                upgrade: function(k) {
                    if (void 0 === k.__CE_state) {
                        const l = k.localName;
                        const m = d.get(l);
                        m ? m.push(k) : a.ga.has(l) && b.push(k);
                    }
                },
            });
            for (e = 0; e < b.length; e++) wg(a.M, b[e]);
            for (e = 0; e < c.length; e++) {
                for (var f = c[e], g = d.get(f), h = 0; h < g.length; h++) wg(a.M, g[h]);
                (f = a.qa.get(f)) && f.resolve(void 0);
            }
            c.length = 0;
        }
    }
    v.get = function(a) {
        if ((a = zg(this, a))) return a.constructorFunction;
    };
    v.whenDefined = function(a) {
        if (!jg(a)) return Promise.reject(new SyntaxError("'" + a + "' is not a valid custom element name."));
        let b = this.qa.get(a);
        if (b) return b.Ca;
        b = new Cg();
        this.qa.set(a, b);
        const c = this.ga.has(a) || this.fa.has(a);
        a = this.ha.indexOf(a) === -1;
        c && a && b.resolve(void 0);
        return b.Ca;
    };
    v.polyfillWrapFlushCallback = function(a) {
        this.ya && Eg(this.ya);
        const b = this.ea;
        this.ea = function(c) {
            return a(function() {
                return b(c);
            });
        };
    };
    function zg(a, b) {
        let c = a.ga.get(b);
        if (c) return c;
        if ((c = a.fa.get(b))) {
            a.fa.delete(b);
            try {
                return Hg(a, b, c());
            } catch (d) {
                Ag(d);
            }
        }
    }
    window.CustomElementRegistry = U;
    U.prototype.define = U.prototype.define;
    U.prototype.upgrade = U.prototype.upgrade;
    U.prototype.get = U.prototype.get;
    U.prototype.whenDefined = U.prototype.whenDefined;
    U.prototype.polyfillDefineLazy = U.prototype.$a;
    U.prototype.polyfillWrapFlushCallback = U.prototype.polyfillWrapFlushCallback;
    function Ig(a, b, c) {
        function d(e) {
            return function(f) {
                for (var g = [], h = 0; h < arguments.length; ++h) g[h] = arguments[h];
                h = [];
                for (var k = [], l = 0; l < g.length; l++) {
                    let m = g[l];
                    m instanceof Element && T(m) && k.push(m);
                    if (m instanceof DocumentFragment) for (m = m.firstChild; m; m = m.nextSibling) h.push(m);
                    else h.push(m);
                }
                e.apply(this, g);
                for (g = 0; g < k.length; g++) xg(a, k[g]);
                if (T(this)) for (g = 0; g < h.length; g++) (k = h[g]), k instanceof Element && vg(a, k);
            };
        }
        void 0 !== c.prepend && (b.prepend = d(c.prepend));
        void 0 !== c.append && (b.append = d(c.append));
    }
    function Jg(a) {
        Document.prototype.createElement = function(b) {
            return Bg(a, this, b, null);
        };
        Document.prototype.importNode = function(b, c) {
            b = Ef.call(this, b, !!c);
            this.__CE_registry ? yg(a, b) : tg(a, b);
            return b;
        };
        Document.prototype.createElementNS = function(b, c) {
            return Bg(a, this, c, b);
        };
        Ig(a, Document.prototype, { prepend: Ff, append: Gf });
    }
    function Kg(a) {
        function b(d) {
            return function(e) {
                for (var f = [], g = 0; g < arguments.length; ++g) f[g] = arguments[g];
                g = [];
                for (var h = [], k = 0; k < f.length; k++) {
                    let l = f[k];
                    l instanceof Element && T(l) && h.push(l);
                    if (l instanceof DocumentFragment) for (l = l.firstChild; l; l = l.nextSibling) g.push(l);
                    else g.push(l);
                }
                d.apply(this, f);
                for (f = 0; f < h.length; f++) xg(a, h[f]);
                if (T(this)) for (f = 0; f < g.length; f++) (h = g[f]), h instanceof Element && vg(a, h);
            };
        }
        const c = Element.prototype;
        void 0 !== ag && (c.before = b(ag));
        void 0 !== bg && (c.after = b(bg));
        void 0 !== cg &&
            (c.replaceWith = function(d) {
                for (var e = [], f = 0; f < arguments.length; ++f) e[f] = arguments[f];
                f = [];
                for (var g = [], h = 0; h < e.length; h++) {
                    let k = e[h];
                    k instanceof Element && T(k) && g.push(k);
                    if (k instanceof DocumentFragment) for (k = k.firstChild; k; k = k.nextSibling) f.push(k);
                    else f.push(k);
                }
                h = T(this);
                cg.apply(this, e);
                for (e = 0; e < g.length; e++) xg(a, g[e]);
                if (h) for (xg(a, this), e = 0; e < f.length; e++) (g = f[e]), g instanceof Element && vg(a, g);
            });
        void 0 !== dg &&
            (c.remove = function() {
                const d = T(this);
                dg.call(this);
                d && xg(a, this);
            });
    }
    function Lg(a) {
        function b(e, f) {
            Object.defineProperty(e, 'innerHTML', {
                enumerable: f.enumerable,
                configurable: !0,
                get: f.get,
                set: function(g) {
                    const h = this;
                    let k = void 0;
                    T(this) &&
                        ((k = []),
                        qg(a, this, function(q) {
                            q !== h && k.push(q);
                        }));
                    f.set.call(this, g);
                    if (k) {
                        for (let l = 0; l < k.length; l++) {
                            const m = k[l];
                            m.__CE_state === 1 && a.disconnectedCallback(m);
                        }
                    }
                    this.ownerDocument.__CE_registry ? yg(a, this) : tg(a, this);
                    return g;
                },
            });
        }
        function c(e, f) {
            e.insertAdjacentElement = function(g, h) {
                const k = T(h);
                g = f.call(this, g, h);
                k && xg(a, h);
                T(g) && vg(a, h);
                return g;
            };
        }
        function d(e, f) {
            function g(h, k) {
                for (var l = []; h !== k; h = h.nextSibling) l.push(h);
                for (k = 0; k < l.length; k++) yg(a, l[k]);
            }
            e.insertAdjacentHTML = function(h, k) {
                h = h.toLowerCase();
                if (h === 'beforebegin') {
                    var l = this.previousSibling;
                    f.call(this, h, k);
                    g(l || this.parentNode.firstChild, this);
                } else if (h === 'afterbegin') (l = this.firstChild), f.call(this, h, k), g(this.firstChild, l);
                else if (h === 'beforeend') (l = this.lastChild), f.call(this, h, k), g(l || this.firstChild, null);
                else if (h === 'afterend') (l = this.nextSibling), f.call(this, h, k), g(this.nextSibling, l);
                else {
                    throw new SyntaxError(
                        'The value provided (' +
                            String(h) +
                            ") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.",
                    );
                }
            };
        }
        Pf &&
            (Element.prototype.attachShadow = function(e) {
                e = Pf.call(this, e);
                if (a.R && !e.__CE_patched) {
                    e.__CE_patched = !0;
                    for (let f = 0; f < a.X.length; f++) a.X[f](e);
                }
                return (this.__CE_shadowRoot = e);
            });
        Qf && Qf.get
            ? b(Element.prototype, Qf)
            : fg && fg.get
            ? b(HTMLElement.prototype, fg)
            : sg(a, function(e) {
                  b(e, {
                      enumerable: !0,
                      configurable: !0,
                      get: function() {
                          return Jf.call(this, !0).innerHTML;
                      },
                      set: function(f) {
                          const g = this.localName === 'template';
                          const h = g ? this.content : this;
                          const k = Df.call(document, this.namespaceURI, this.localName);
                          for (k.innerHTML = f; h.childNodes.length > 0; ) Mf.call(h, h.childNodes[0]);
                          for (f = g ? k.content : k; f.childNodes.length > 0; ) Kf.call(h, f.childNodes[0]);
                      },
                  });
              });
        Element.prototype.setAttribute = function(e, f) {
            if (this.__CE_state !== 1) return Sf.call(this, e, f);
            const g = Rf.call(this, e);
            Sf.call(this, e, f);
            f = Rf.call(this, e);
            a.attributeChangedCallback(this, e, g, f, null);
        };
        Element.prototype.setAttributeNS = function(e, f, g) {
            if (this.__CE_state !== 1) return Vf.call(this, e, f, g);
            const h = Uf.call(this, e, f);
            Vf.call(this, e, f, g);
            g = Uf.call(this, e, f);
            a.attributeChangedCallback(this, f, h, g, e);
        };
        Element.prototype.removeAttribute = function(e) {
            if (this.__CE_state !== 1) return Tf.call(this, e);
            const f = Rf.call(this, e);
            Tf.call(this, e);
            f !== null && a.attributeChangedCallback(this, e, f, null, null);
        };
        Element.prototype.removeAttributeNS = function(e, f) {
            if (this.__CE_state !== 1) return Wf.call(this, e, f);
            const g = Uf.call(this, e, f);
            Wf.call(this, e, f);
            const h = Uf.call(this, e, f);
            g !== h && a.attributeChangedCallback(this, f, g, h, e);
        };
        gg ? c(HTMLElement.prototype, gg) : Xf && c(Element.prototype, Xf);
        hg ? d(HTMLElement.prototype, hg) : Yf && d(Element.prototype, Yf);
        Ig(a, Element.prototype, { prepend: Zf, append: $f });
        Kg(a);
    }
    const Mg = {};
    function Ng(a) {
        function b() {
            const c = this.constructor;
            const d = document.__CE_registry.xa.get(c);
            if (!d) {
                throw Error(
                    'Failed to construct a custom element: The constructor was not registered with `customElements`.',
                );
            }
            let e = d.constructionStack;
            if (e.length === 0) {
                return (
                    (e = Cf.call(document, d.localName)),
                    Object.setPrototypeOf(e, c.prototype),
                    (e.__CE_state = 1),
                    (e.__CE_definition = d),
                    ug(a, e),
                    e
                );
            }
            const f = e.length - 1;
            const g = e[f];
            if (g === Mg) {
                throw Error("Failed to construct '" + d.localName + "': This element was already constructed.");
            }
            e[f] = Mg;
            Object.setPrototypeOf(g, c.prototype);
            ug(a, g);
            return g;
        }
        b.prototype = eg.prototype;
        Object.defineProperty(HTMLElement.prototype, 'constructor', {
            writable: !0,
            configurable: !0,
            enumerable: !1,
            value: b,
        });
        window.HTMLElement = b;
    }
    function Og(a) {
        function b(c, d) {
            Object.defineProperty(c, 'textContent', {
                enumerable: d.enumerable,
                configurable: !0,
                get: d.get,
                set: function(e) {
                    if (this.nodeType === Node.TEXT_NODE) d.set.call(this, e);
                    else {
                        let f = void 0;
                        if (this.firstChild) {
                            const g = this.childNodes;
                            const h = g.length;
                            if (h > 0 && T(this)) {
                                f = Array(h);
                                for (let k = 0; k < h; k++) f[k] = g[k];
                            }
                        }
                        d.set.call(this, e);
                        if (f) for (e = 0; e < f.length; e++) xg(a, f[e]);
                    }
                },
            });
        }
        Node.prototype.insertBefore = function(c, d) {
            if (c instanceof DocumentFragment) {
                var e = lg(c);
                c = Lf.call(this, c, d);
                if (T(this)) for (d = 0; d < e.length; d++) vg(a, e[d]);
                return c;
            }
            e = c instanceof Element && T(c);
            d = Lf.call(this, c, d);
            e && xg(a, c);
            T(this) && vg(a, c);
            return d;
        };
        Node.prototype.appendChild = function(c) {
            if (c instanceof DocumentFragment) {
                var d = lg(c);
                c = Kf.call(this, c);
                if (T(this)) for (var e = 0; e < d.length; e++) vg(a, d[e]);
                return c;
            }
            d = c instanceof Element && T(c);
            e = Kf.call(this, c);
            d && xg(a, c);
            T(this) && vg(a, c);
            return e;
        };
        Node.prototype.cloneNode = function(c) {
            c = Jf.call(this, !!c);
            this.ownerDocument.__CE_registry ? yg(a, c) : tg(a, c);
            return c;
        };
        Node.prototype.removeChild = function(c) {
            const d = c instanceof Element && T(c);
            const e = Mf.call(this, c);
            d && xg(a, c);
            return e;
        };
        Node.prototype.replaceChild = function(c, d) {
            if (c instanceof DocumentFragment) {
                var e = lg(c);
                c = Nf.call(this, c, d);
                if (T(this)) for (xg(a, d), d = 0; d < e.length; d++) vg(a, e[d]);
                return c;
            }
            e = c instanceof Element && T(c);
            const f = Nf.call(this, c, d);
            const g = T(this);
            g && xg(a, d);
            e && xg(a, c);
            g && vg(a, c);
            return f;
        };
        Of && Of.get
            ? b(Node.prototype, Of)
            : rg(a, function(c) {
                  b(c, {
                      enumerable: !0,
                      configurable: !0,
                      get: function() {
                          for (var d = [], e = this.firstChild; e; e = e.nextSibling) {
                              e.nodeType !== Node.COMMENT_NODE && d.push(e.textContent);
                          }
                          return d.join('');
                      },
                      set: function(d) {
                          for (; this.firstChild; ) Mf.call(this, this.firstChild);
                          d != null && d !== '' && Kf.call(this, document.createTextNode(d));
                      },
                  });
              });
    }
    var pg = window.customElements;
    function Pg() {
        let a = new og();
        Ng(a);
        Jg(a);
        Ig(a, DocumentFragment.prototype, { prepend: Hf, append: If });
        Og(a);
        Lg(a);
        a = new U(a);
        document.__CE_registry = a;
        Object.defineProperty(window, 'customElements', { configurable: !0, enumerable: !0, value: a });
    }
    (pg && !pg.forcePolyfill && typeof pg.define === 'function' && typeof pg.get === 'function') || Pg();
    window.__CE_installPolyfill = Pg; /*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
    function Qg() {
        this.end = this.start = 0;
        this.rules = this.parent = this.previous = null;
        this.cssText = this.parsedCssText = '';
        this.atRule = !1;
        this.type = 0;
        this.parsedSelector = this.selector = this.keyframesName = '';
    }
    function Rg(a) {
        const b = (a = a.replace(Sg, '').replace(Tg, ''));
        const c = new Qg();
        c.start = 0;
        c.end = b.length;
        for (let d = c, e = 0, f = b.length; e < f; e++) {
            if (b[e] === '{') {
                d.rules || (d.rules = []);
                const g = d;
                const h = g.rules[g.rules.length - 1] || null;
                d = new Qg();
                d.start = e + 1;
                d.parent = g;
                d.previous = h;
                g.rules.push(d);
            } else b[e] === '}' && ((d.end = e + 1), (d = d.parent || c));
        }
        return Ug(c, a);
    }
    function Ug(a, b) {
        let c = b.substring(a.start, a.end - 1);
        a.parsedCssText = a.cssText = c.trim();
        a.parent &&
            ((c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1)),
            (c = Vg(c)),
            (c = c.replace(Wg, ' ')),
            (c = c.substring(c.lastIndexOf(';') + 1)),
            (c = a.parsedSelector = a.selector = c.trim()),
            (a.atRule = c.indexOf('@') === 0),
            a.atRule
                ? c.indexOf('@media') === 0
                    ? (a.type = Xg)
                    : c.match(Yg) && ((a.type = Zg), (a.keyframesName = a.selector.split(Wg).pop()))
                : (a.type = c.indexOf('--') === 0 ? $g : ah));
        if ((c = a.rules)) for (let d = 0, e = c.length, f = void 0; d < e && (f = c[d]); d++) Ug(f, b);
        return a;
    }
    function Vg(a) {
        return a.replace(/\\([0-9a-f]{1,6})\s/gi, function(b, c) {
            b = c;
            for (c = 6 - b.length; c--; ) b = '0' + b;
            return '\\' + b;
        });
    }
    function bh(a, b, c) {
        c = void 0 === c ? '' : c;
        let d = '';
        if (a.cssText || a.rules) {
            const e = a.rules;
            let f;
            if ((f = e)) (f = e[0]), (f = !(f && f.selector && f.selector.indexOf('--') === 0));
            if (f) {
                f = 0;
                for (let g = e.length, h = void 0; f < g && (h = e[f]); f++) d = bh(h, b, d);
            } else {
                b
                    ? (b = a.cssText)
                    : ((b = a.cssText),
                      (b = b.replace(ch, '').replace(dh, '')),
                      (b = b.replace(eh, '').replace(fh, ''))),
                    (d = b.trim()) && (d = '  ' + d + '\n');
            }
        }
        d && (a.selector && (c += a.selector + ' {\n'), (c += d), a.selector && (c += '}\n\n'));
        return c;
    }
    var ah = 1;
    var Zg = 7;
    var Xg = 4;
    var $g = 1e3;
    var Sg = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim;
    var Tg = /@import[^;]*;/gim;
    var ch = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim;
    var dh = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim;
    var eh = /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim;
    var fh = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim;
    var Yg = /^@[^\s]*keyframes/;
    var Wg = /\s+/g;
    const V = !(window.ShadyDOM && window.ShadyDOM.inUse);
    let gh;
    function hh(a) {
        gh =
            a && a.shimcssproperties
                ? !1
                : V ||
                  !(
                      navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) ||
                      !window.CSS ||
                      !CSS.supports ||
                      !CSS.supports('box-shadow', '0 0 0 var(--foo)')
                  );
    }
    let ih;
    window.ShadyCSS && void 0 !== window.ShadyCSS.cssBuild && (ih = window.ShadyCSS.cssBuild);
    const jh = !(!window.ShadyCSS || !window.ShadyCSS.disableRuntime);
    window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss
        ? (gh = window.ShadyCSS.nativeCss)
        : window.ShadyCSS
        ? (hh(window.ShadyCSS), (window.ShadyCSS = void 0))
        : hh(window.WebComponents && window.WebComponents.flags);
    const X = gh;
    const kh = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
    const lh = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi;
    const mh = /(--[\w-]+)\s*([:,;)]|$)/gi;
    const nh = /(animation\s*:)|(animation-name\s*:)/;
    const oh = /@media\s(.*)/;
    const ph = /\{[^}]*\}/g;
    const qh = new Set();
    function rh(a, b) {
        if (!a) return '';
        typeof a === 'string' && (a = Rg(a));
        b && sh(a, b);
        return bh(a, X);
    }
    function th(a) {
        !a.__cssRules && a.textContent && (a.__cssRules = Rg(a.textContent));
        return a.__cssRules || null;
    }
    function uh(a) {
        return !!a.parent && a.parent.type === Zg;
    }
    function sh(a, b, c, d) {
        if (a) {
            let e = !1;
            let f = a.type;
            if (d && f === Xg) {
                var g = a.selector.match(oh);
                g && (window.matchMedia(g[1]).matches || (e = !0));
            }
            f === ah ? b(a) : c && f === Zg ? c(a) : f === $g && (e = !0);
            if ((a = a.rules) && !e) for (e = 0, f = a.length, g = void 0; e < f && (g = a[e]); e++) sh(g, b, c, d);
        }
    }
    function vh(a, b, c, d) {
        const e = document.createElement('style');
        b && e.setAttribute('scope', b);
        e.textContent = a;
        wh(e, c, d);
        return e;
    }
    let xh = null;
    function yh(a) {
        a = document.createComment(' Shady DOM styles for ' + a + ' ');
        const b = document.head;
        b.insertBefore(a, (xh ? xh.nextSibling : null) || b.firstChild);
        return (xh = a);
    }
    function wh(a, b, c) {
        b = b || document.head;
        b.insertBefore(a, (c && c.nextSibling) || b.firstChild);
        xh ? a.compareDocumentPosition(xh) === Node.DOCUMENT_POSITION_PRECEDING && (xh = a) : (xh = a);
    }
    function Ah(a, b) {
        for (let c = 0, d = a.length; b < d; b++) {
            if (a[b] === '(') c++;
            else if (a[b] === ')' && --c === 0) return b;
        }
        return -1;
    }
    function Bh(a, b) {
        let c = a.indexOf('var(');
        if (c === -1) return b(a, '', '', '');
        let d = Ah(a, c + 3);
        const e = a.substring(c + 4, d);
        c = a.substring(0, c);
        a = Bh(a.substring(d + 1), b);
        d = e.indexOf(',');
        return d === -1 ? b(c, e.trim(), '', a) : b(c, e.substring(0, d).trim(), e.substring(d + 1).trim(), a);
    }
    function Ch(a, b) {
        V ? a.setAttribute('class', b) : window.ShadyDOM.nativeMethods.setAttribute.call(a, 'class', b);
    }
    const Dh =
        (window.ShadyDOM && window.ShadyDOM.wrap) ||
        function(a) {
            return a;
        };
    function Eh(a) {
        let b = a.localName;
        let c = '';
        b
            ? b.indexOf('-') > -1 || ((c = b), (b = (a.getAttribute && a.getAttribute('is')) || ''))
            : ((b = a.is), (c = a.extends));
        return { is: b, ca: c };
    }
    function Fh(a) {
        for (var b = [], c = '', d = 0; d >= 0 && d < a.length; d++) {
            if (a[d] === '(') {
                const e = Ah(a, d);
                c += a.slice(d, e + 1);
                d = e;
            } else a[d] === ',' ? (b.push(c), (c = '')) : (c += a[d]);
        }
        c && b.push(c);
        return b;
    }
    function Gh(a) {
        if (void 0 !== ih) return ih;
        if (void 0 === a.__cssBuild) {
            let b = a.getAttribute('css-build');
            if (b) a.__cssBuild = b;
            else {
                a: {
                    b = a.localName === 'template' ? a.content.firstChild : a.firstChild;
                    if (b instanceof Comment && ((b = b.textContent.trim().split(':')), b[0] === 'css-build')) {
                        b = b[1];
                        break a;
                    }
                    b = '';
                }
                if (b !== '') {
                    const c = a.localName === 'template' ? a.content.firstChild : a.firstChild;
                    c.parentNode.removeChild(c);
                }
                a.__cssBuild = b;
            }
        }
        return a.__cssBuild || '';
    }
    function Hh(a) {
        a = void 0 === a ? '' : a;
        return a !== '' && X ? (V ? a === 'shadow' : a === 'shady') : !1;
    }
    function Ih() {}
    function Jh(a, b) {
        Kh(Lh, a, function(c) {
            Mh(c, b || '');
        });
    }
    function Kh(a, b, c) {
        b.nodeType === Node.ELEMENT_NODE && c(b);
        let d;
        b.localName === 'template' ? (d = (b.content || b._content || b).childNodes) : (d = b.children || b.childNodes);
        if (d) for (b = 0; b < d.length; b++) Kh(a, d[b], c);
    }
    function Mh(a, b, c) {
        if (b) {
            if (a.classList) {
                c
                    ? (a.classList.remove('style-scope'), a.classList.remove(b))
                    : (a.classList.add('style-scope'), a.classList.add(b));
            } else if (a.getAttribute) {
                const d = a.getAttribute('class');
                c
                    ? d && ((b = d.replace('style-scope', '').replace(b, '')), Ch(a, b))
                    : Ch(a, (d ? d + ' ' : '') + 'style-scope ' + b);
            }
        }
    }
    function Nh(a, b, c) {
        Kh(Lh, a, function(d) {
            Mh(d, b, !0);
            Mh(d, c);
        });
    }
    function Oh(a, b) {
        Kh(Lh, a, function(c) {
            Mh(c, b || '', !0);
        });
    }
    function Ph(a, b, c, d, e) {
        const f = Lh;
        e = void 0 === e ? '' : e;
        e === '' &&
            (V || (void 0 === d ? '' : d) === 'shady'
                ? (e = rh(b, c))
                : ((a = Eh(a)), (e = Qh(f, b, a.is, a.ca, c) + '\n\n')));
        return e.trim();
    }
    function Qh(a, b, c, d, e) {
        const f = Rh(c, d);
        c = c ? '.' + c : '';
        return rh(b, function(g) {
            g.c || ((g.selector = g.w = Sh(a, g, a.b, c, f)), (g.c = !0));
            e && e(g, c, f);
        });
    }
    function Rh(a, b) {
        return b ? '[is=' + a + ']' : a;
    }
    function Sh(a, b, c, d, e) {
        const f = Fh(b.selector);
        if (!uh(b)) {
            b = 0;
            for (let g = f.length, h = void 0; b < g && (h = f[b]); b++) f[b] = c.call(a, h, d, e);
        }
        return f
            .filter(function(k) {
                return !!k;
            })
            .join(',');
    }
    function Th(a) {
        return a.replace(Uh, function(b, c, d) {
            d.indexOf('+') > -1 ? (d = d.replace(/\+/g, '___')) : d.indexOf('___') > -1 && (d = d.replace(/___/g, '+'));
            return ':' + c + '(' + d + ')';
        });
    }
    function Vh(a) {
        for (var b = [], c; (c = a.match(Wh)); ) {
            const d = c.index;
            const e = Ah(a, d);
            if (e === -1) throw Error(c.input + " selector missing ')'");
            c = a.slice(d, e + 1);
            a = a.replace(c, '\ue000');
            b.push(c);
        }
        return { wa: a, matches: b };
    }
    function Xh(a, b) {
        const c = a.split('\ue000');
        return b.reduce(function(d, e, f) {
            return d + e + c[f + 1];
        }, c[0]);
    }
    Ih.prototype.b = function(a, b, c) {
        let d = !1;
        a = a.trim();
        const e = Uh.test(a);
        e &&
            ((a = a.replace(Uh, function(h, k, l) {
                return ':' + k + '(' + l.replace(/\s/g, '') + ')';
            })),
            (a = Th(a)));
        const f = Wh.test(a);
        if (f) {
            var g = Vh(a);
            a = g.wa;
            g = g.matches;
        }
        a = a.replace(Yh, ':host $1');
        a = a.replace(Zh, function(h, k, l) {
            d || ((h = $h(l, k, b, c)), (d = d || h.stop), (k = h.Qa), (l = h.value));
            return k + l;
        });
        f && (a = Xh(a, g));
        e && (a = Th(a));
        return (a = a.replace(ai, function(h, k, l, m) {
            return '[dir="' + l + '"] ' + k + m + ', ' + k + '[dir="' + l + '"]' + m;
        }));
    };
    function $h(a, b, c, d) {
        const e = a.indexOf('::slotted');
        a.indexOf(':host') >= 0 ? (a = bi(a, d)) : e !== 0 && (a = c ? ci(a, c) : a);
        c = !1;
        e >= 0 && ((b = ''), (c = !0));
        if (c) {
            var f = !0;
            c &&
                (a = a.replace(di, function(g, h) {
                    return ' > ' + h;
                }));
        }
        return { value: a, Qa: b, stop: f };
    }
    function ci(a, b) {
        a = a.split(/(\[.+?\])/);
        for (var c = [], d = 0; d < a.length; d++) {
            if (d % 2 === 1) c.push(a[d]);
            else {
                let e = a[d];
                if (e !== '' || d !== a.length - 1) (e = e.split(':')), (e[0] += b), c.push(e.join(':'));
            }
        }
        return c.join('');
    }
    function bi(a, b) {
        let c = a.match(ei);
        return (c = (c && c[2].trim()) || '')
            ? c[0].match(fi)
                ? a.replace(ei, function(d, e, f) {
                      return b + f;
                  })
                : c.split(fi)[0] === b
                ? c
                : 'should_not_match'
            : a.replace(':host', b);
    }
    function gi(a) {
        a.selector === ':root' && (a.selector = 'html');
    }
    Ih.prototype.c = function(a) {
        return a.match(':host')
            ? ''
            : a.match('::slotted')
            ? this.b(a, ':not(.style-scope)')
            : ci(a.trim(), ':not(.style-scope)');
    };
    da.Object.defineProperties(Ih.prototype, {
        a: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return 'style-scope';
            },
        },
    });
    var Uh = /:(nth[-\w]+)\(([^)]+)\)/;
    var Zh = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g;
    var fi = /[[.:#*]/;
    var Yh = /^(::slotted)/;
    var ei = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
    var di = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
    var ai = /(.*):dir\((?:(ltr|rtl))\)(.*)/;
    var Wh = /:(?:matches|any|-(?:webkit|moz)-any)/;
    var Lh = new Ih();
    function hi(a, b, c, d, e) {
        this.H = a || null;
        this.b = b || null;
        this.ta = c || [];
        this.F = null;
        this.cssBuild = e || '';
        this.ca = d || '';
        this.a = this.G = this.L = null;
    }
    function ii(a) {
        return a ? a.__styleInfo : null;
    }
    function ji(a, b) {
        return (a.__styleInfo = b);
    }
    hi.prototype.c = function() {
        return this.H;
    };
    hi.prototype._getStyleRules = hi.prototype.c;
    function ki(a) {
        const b =
            this.matches ||
            this.matchesSelector ||
            this.mozMatchesSelector ||
            this.msMatchesSelector ||
            this.oMatchesSelector ||
            this.webkitMatchesSelector;
        return b && b.call(this, a);
    }
    const li = /:host\s*>\s*/;
    const mi = navigator.userAgent.match('Trident');
    function ni() {}
    function oi(a) {
        const b = {};
        const c = [];
        let d = 0;
        sh(
            a,
            function(f) {
                pi(f);
                f.index = d++;
                f = f.v.cssText;
                for (var g; (g = mh.exec(f)); ) {
                    const h = g[1];
                    g[2] !== ':' && (b[h] = !0);
                }
            },
            function(f) {
                c.push(f);
            },
        );
        a.b = c;
        a = [];
        for (const e in b) a.push(e);
        return a;
    }
    function pi(a) {
        if (!a.v) {
            const b = {};
            const c = {};
            qi(a, c) && ((b.K = c), (a.rules = null));
            b.cssText = a.parsedCssText.replace(ph, '').replace(kh, '');
            a.v = b;
        }
    }
    function qi(a, b) {
        let c = a.v;
        if (c) {
            if (c.K) return Object.assign(b, c.K), !0;
        } else {
            c = a.parsedCssText;
            for (var d; (a = kh.exec(c)); ) {
                d = (a[2] || a[3]).trim();
                if (d !== 'inherit' || d !== 'unset') b[a[1].trim()] = d;
                d = !0;
            }
            return d;
        }
    }
    function ri(a, b, c) {
        b &&
            (b =
                b.indexOf(';') >= 0
                    ? si(a, b, c)
                    : Bh(b, function(d, e, f, g) {
                          if (!e) return d + g;
                          (e = ri(a, c[e], c)) && e !== 'initial'
                              ? e === 'apply-shim-inherit' && (e = 'inherit')
                              : (e = ri(a, c[f] || f, c) || f);
                          return d + (e || '') + g;
                      }));
        return (b && b.trim()) || '';
    }
    function si(a, b, c) {
        b = b.split(';');
        for (var d = 0, e, f; d < b.length; d++) {
            if ((e = b[d])) {
                lh.lastIndex = 0;
                if ((f = lh.exec(e))) e = ri(a, c[f[1]], c);
                else if (((f = e.indexOf(':')), f !== -1)) {
                    let g = e.substring(f);
                    g = g.trim();
                    g = ri(a, g, c) || g;
                    e = e.substring(0, f) + g;
                }
                b[d] = e && e.lastIndexOf(';') === e.length - 1 ? e.slice(0, -1) : e || '';
            }
        }
        return b.join(';');
    }
    function ti(a, b) {
        const c = {};
        const d = [];
        sh(
            a,
            function(e) {
                e.v || pi(e);
                let f = e.w || e.parsedSelector;
                b &&
                    e.v.K &&
                    f &&
                    ki.call(b, f) &&
                    (qi(e, c), (e = e.index), (f = parseInt(e / 32, 10)), (d[f] = (d[f] || 0) | (1 << e % 32)));
            },
            null,
            !0,
        );
        return { K: c, key: d };
    }
    function ui(a, b, c, d) {
        b.v || pi(b);
        if (b.v.K) {
            let e = Eh(a);
            a = e.is;
            e = e.ca;
            e = a ? Rh(a, e) : 'html';
            const f = b.parsedSelector;
            let g = !!f.match(li) || (e === 'html' && f.indexOf('html') > -1);
            let h = f.indexOf(':host') === 0 && !g;
            c === 'shady' && ((g = f === e + ' > *.' + e || f.indexOf('html') !== -1), (h = !g && f.indexOf(e) === 0));
            if (g || h) {
                (c = e),
                    h && (b.w || (b.w = Sh(Lh, b, Lh.b, a ? '.' + a : '', e)), (c = b.w || e)),
                    g && e === 'html' && (c = b.w || b.J),
                    d({ wa: c, Xa: h, mb: g });
            }
        }
    }
    function vi(a, b, c) {
        const d = {};
        const e = {};
        sh(
            b,
            function(f) {
                ui(a, f, c, function(g) {
                    ki.call(a._element || a, g.wa) && (g.Xa ? qi(f, d) : qi(f, e));
                });
            },
            null,
            !0,
        );
        return { cb: e, Va: d };
    }
    function wi(a, b, c, d) {
        let e = Eh(b);
        const f = Rh(e.is, e.ca);
        const g = new RegExp('(?:^|[^.#[:])' + (b.extends ? '\\' + f.slice(0, -1) + '\\]' : f) + '($|[.:[\\s>+~])');
        let h = ii(b);
        e = h.H;
        h = h.cssBuild;
        const k = xi(e, d);
        return Ph(
            b,
            e,
            function(l) {
                let m = '';
                l.v || pi(l);
                l.v.cssText && (m = si(a, l.v.cssText, c));
                l.cssText = m;
                if (!V && !uh(l) && l.cssText) {
                    let q = (m = l.cssText);
                    l.Da == null && (l.Da = nh.test(m));
                    if (l.Da) {
                        if (l.ka == null) {
                            l.ka = [];
                            for (var H in k) (q = k[H]), (q = q(m)), m !== q && ((m = q), l.ka.push(H));
                        } else {
                            for (H = 0; H < l.ka.length; ++H) (q = k[l.ka[H]]), (m = q(m));
                            q = m;
                        }
                    }
                    l.cssText = q;
                    l.w = l.w || l.selector;
                    m = '.' + d;
                    H = Fh(l.w);
                    q = 0;
                    for (let C = H.length, t = void 0; q < C && (t = H[q]); q++) {
                        H[q] = t.match(g) ? t.replace(f, m) : m + ' ' + t;
                    }
                    l.selector = H.join(',');
                }
            },
            h,
        );
    }
    function xi(a, b) {
        a = a.b;
        const c = {};
        if (!V && a) {
            for (let d = 0, e = a[d]; d < a.length; e = a[++d]) {
                const f = e;
                const g = b;
                f.l = new RegExp('\\b' + f.keyframesName + '(?!\\B|-)', 'g');
                f.a = f.keyframesName + '-' + g;
                f.w = f.w || f.selector;
                f.selector = f.w.replace(f.keyframesName, f.a);
                c[e.keyframesName] = yi(e);
            }
        }
        return c;
    }
    function yi(a) {
        return function(b) {
            return b.replace(a.l, a.a);
        };
    }
    function zi(a, b) {
        const c = Ai;
        const d = th(a);
        a.textContent = rh(d, function(e) {
            let f = (e.cssText = e.parsedCssText);
            e.v && e.v.cssText && ((f = f.replace(ch, '').replace(dh, '')), (e.cssText = si(c, f, b)));
        });
    }
    da.Object.defineProperties(ni.prototype, {
        a: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return 'x-scope';
            },
        },
    });
    var Ai = new ni();
    const Bi = {};
    const Ci = window.customElements;
    if (Ci && !V && !jh) {
        const Di = Ci.define;
        Ci.define = function(a, b, c) {
            Bi[a] || (Bi[a] = yh(a));
            Di.call(Ci, a, b, c);
        };
    }
    function Ei() {
        this.cache = {};
    }
    Ei.prototype.store = function(a, b, c, d) {
        const e = this.cache[a] || [];
        e.push({ K: b, styleElement: c, G: d });
        e.length > 100 && e.shift();
        this.cache[a] = e;
    };
    function Fi() {}
    const Gi = new RegExp(Lh.a + '\\s*([^\\s]*)');
    function Hi(a) {
        return (a = (a.classList && a.classList.value ? a.classList.value : a.getAttribute('class') || '').match(Gi))
            ? a[1]
            : '';
    }
    function Ii(a) {
        const b = Dh(a).getRootNode();
        return b === a || b === a.ownerDocument ? '' : (a = b.host) ? Eh(a).is : '';
    }
    function Ji(a) {
        for (let b = 0; b < a.length; b++) {
            const c = a[b];
            if (c.target !== document.documentElement && c.target !== document.head) {
                for (let d = 0; d < c.addedNodes.length; d++) {
                    let e = c.addedNodes[d];
                    if (e.nodeType === Node.ELEMENT_NODE) {
                        let f = e.getRootNode();
                        let g = Hi(e);
                        if (
                            g &&
                            f === e.ownerDocument &&
                            ((e.localName !== 'style' && e.localName !== 'template') || Gh(e) === '')
                        ) {
                            Oh(e, g);
                        } else if (f instanceof ShadowRoot) {
                            for (
                                f = Ii(e),
                                    f !== g && Nh(e, g, f),
                                    e = window.ShadyDOM.nativeMethods.querySelectorAll.call(e, ':not(.' + Lh.a + ')'),
                                    g = 0;
                                g < e.length;
                                g++
                            ) {
                                f = e[g];
                                const h = Ii(f);
                                h && Mh(f, h);
                            }
                        }
                    }
                }
            }
        }
    }
    if (!(V || (window.ShadyDOM && window.ShadyDOM.handlesDynamicScoping))) {
        const Ki = new MutationObserver(Ji);
        const Li = function(a) {
            Ki.observe(a, { childList: !0, subtree: !0 });
        };
        if (window.customElements && !window.customElements.polyfillWrapFlushCallback) Li(document);
        else {
            const Mi = function() {
                Li(document.body);
            };
            window.HTMLImports
                ? window.HTMLImports.whenReady(Mi)
                : requestAnimationFrame(function() {
                      if (document.readyState === 'loading') {
                          var a = function() {
                              Mi();
                              document.removeEventListener('readystatechange', a);
                          };
                          document.addEventListener('readystatechange', a);
                      } else Mi();
                  });
        }
        Fi = function() {
            Ji(Ki.takeRecords());
        };
    }
    const Ni = {};
    const Oi = Promise.resolve();
    function Pi(a) {
        if ((a = Ni[a])) {
            (a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0),
                (a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0),
                (a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1);
        }
    }
    function Qi(a) {
        return a._applyShimCurrentVersion === a._applyShimNextVersion;
    }
    function Ri(a) {
        a._applyShimValidatingVersion = a._applyShimNextVersion;
        a._validating ||
            ((a._validating = !0),
            Oi.then(function() {
                a._applyShimCurrentVersion = a._applyShimNextVersion;
                a._validating = !1;
            }));
    }
    const Si = {};
    const Ti = new Ei();
    function Y() {
        this.Y = {};
        this.c = document.documentElement;
        const a = new Qg();
        a.rules = [];
        this.l = ji(this.c, new hi(a));
        this.J = !1;
        this.a = this.b = null;
    }
    v = Y.prototype;
    v.flush = function() {
        Fi();
    };
    v.Ta = function(a) {
        return th(a);
    };
    v.hb = function(a) {
        return rh(a);
    };
    v.prepareTemplate = function(a, b, c) {
        this.prepareTemplateDom(a, b);
        this.prepareTemplateStyles(a, b, c);
    };
    v.prepareTemplateStyles = function(a, b, c) {
        if (!a._prepared && !jh) {
            V || Bi[b] || (Bi[b] = yh(b));
            a._prepared = !0;
            a.name = b;
            a.extends = c;
            Ni[b] = a;
            let d = Gh(a);
            const e = Hh(d);
            c = { is: b, extends: c };
            for (var f = [], g = a.content.querySelectorAll('style'), h = 0; h < g.length; h++) {
                const k = g[h];
                if (k.hasAttribute('shady-unscoped')) {
                    if (!V) {
                        const l = k.textContent;
                        if (!qh.has(l)) {
                            qh.add(l);
                            const m = document.createElement('style');
                            m.setAttribute('shady-unscoped', '');
                            m.textContent = l;
                            document.head.appendChild(m);
                        }
                        k.parentNode.removeChild(k);
                    }
                } else f.push(k.textContent), k.parentNode.removeChild(k);
            }
            f = f.join('').trim() + (Si[b] || '');
            Ui(this);
            if (!e) {
                if ((g = !d)) (g = lh.test(f) || kh.test(f)), (lh.lastIndex = 0), (kh.lastIndex = 0);
                h = Rg(f);
                g && X && this.b && this.b.transformRules(h, b);
                a._styleAst = h;
            }
            g = [];
            X || (g = oi(a._styleAst));
            if (!g.length || X) {
                (h = V ? a.content : null),
                    (b = Bi[b] || null),
                    (d = Ph(c, a._styleAst, null, d, e ? f : '')),
                    (d = d.length ? vh(d, c.is, h, b) : null),
                    (a._style = d);
            }
            a.a = g;
        }
    };
    v.ab = function(a, b) {
        Si[b] = a.join(' ');
    };
    v.prepareTemplateDom = function(a, b) {
        if (!jh) {
            const c = Gh(a);
            V || c === 'shady' || a._domPrepared || ((a._domPrepared = !0), Jh(a.content, b));
        }
    };
    function Vi(a) {
        let b = Eh(a);
        let c = b.is;
        b = b.ca;
        const d = Bi[c] || null;
        let e = Ni[c];
        if (e) {
            c = e._styleAst;
            const f = e.a;
            e = Gh(e);
            b = new hi(c, d, f, b, e);
            ji(a, b);
            return b;
        }
    }
    function Wi(a) {
        !a.a &&
            window.ShadyCSS &&
            window.ShadyCSS.CustomStyleInterface &&
            ((a.a = window.ShadyCSS.CustomStyleInterface),
            (a.a.transformCallback = function(b) {
                a.Ha(b);
            }),
            (a.a.validateCallback = function() {
                requestAnimationFrame(function() {
                    (a.a.enqueued || a.J) && a.flushCustomStyles();
                });
            }));
    }
    function Ui(a) {
        if (!a.b && window.ShadyCSS && window.ShadyCSS.ApplyShim) {
            a.b = window.ShadyCSS.ApplyShim;
            a.b.invalidCallback = Pi;
            var b = !0;
        } else b = !1;
        Wi(a);
        return b;
    }
    v.flushCustomStyles = function() {
        if (!jh) {
            let a = Ui(this);
            if (this.a) {
                const b = this.a.processStyles();
                if ((a || this.a.enqueued) && !Hh(this.l.cssBuild)) {
                    if (X) {
                        if (!this.l.cssBuild) {
                            for (a = 0; a < b.length; a++) {
                                var c = this.a.getStyleForCustomStyle(b[a]);
                                if (c && X && this.b) {
                                    const d = th(c);
                                    Ui(this);
                                    this.b.transformRules(d);
                                    c.textContent = rh(d);
                                }
                            }
                        }
                    } else {
                        Xi(this, b);
                        Yi(this, this.c, this.l);
                        for (a = 0; a < b.length; a++) (c = this.a.getStyleForCustomStyle(b[a])) && zi(c, this.l.L);
                        this.J && this.styleDocument();
                    }
                    this.a.enqueued = !1;
                }
            }
        }
    };
    function Xi(a, b) {
        b = b
            .map(function(c) {
                return a.a.getStyleForCustomStyle(c);
            })
            .filter(function(c) {
                return !!c;
            });
        b.sort(function(c, d) {
            c = d.compareDocumentPosition(c);
            return c & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : c & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 0;
        });
        a.l.H.rules = b.map(function(c) {
            return th(c);
        });
    }
    v.styleElement = function(a, b) {
        if (jh) {
            if (b) {
                ii(a) || ji(a, new hi(null));
                var c = ii(a);
                c.F = c.F || {};
                Object.assign(c.F, b);
                Zi(this, a, c);
            }
        } else if ((c = ii(a) || Vi(a))) {
            if ((a !== this.c && (this.J = !0), b && ((c.F = c.F || {}), Object.assign(c.F, b)), X)) Zi(this, a, c);
            else if ((this.flush(), Yi(this, a, c), c.ta && c.ta.length)) {
                b = Eh(a).is;
                let d;
                a: {
                    if ((d = Ti.cache[b])) {
                        for (var e = d.length - 1; e >= 0; e--) {
                            var f = d[e];
                            b: {
                                var g = c.ta;
                                for (var h = 0; h < g.length; h++) {
                                    var k = g[h];
                                    if (f.K[k] !== c.L[k]) {
                                        g = !1;
                                        break b;
                                    }
                                }
                                g = !0;
                            }
                            if (g) {
                                d = f;
                                break a;
                            }
                        }
                    }
                    d = void 0;
                }
                g = d ? d.styleElement : null;
                e = c.G;
                (f = d && d.G) || ((f = this.Y[b] = (this.Y[b] || 0) + 1), (f = b + '-' + f));
                c.G = f;
                f = c.G;
                h = Ai;
                h = g ? g.textContent || '' : wi(h, a, c.L, f);
                k = ii(a);
                const l = k.a;
                l && !V && l !== g && (l._useCount--, l._useCount <= 0 && l.parentNode && l.parentNode.removeChild(l));
                V
                    ? k.a
                        ? ((k.a.textContent = h), (g = k.a))
                        : h && (g = vh(h, f, a.shadowRoot, k.b))
                    : g
                    ? g.parentNode || (mi && h.indexOf('@media') > -1 && (g.textContent = h), wh(g, null, k.b))
                    : h && (g = vh(h, f, null, k.b));
                g && ((g._useCount = g._useCount || 0), k.a != g && g._useCount++, (k.a = g));
                f = g;
                V ||
                    ((g = c.G),
                    (k = h = a.getAttribute('class') || ''),
                    e && (k = h.replace(new RegExp('\\s*x-scope\\s*' + e + '\\s*', 'g'), ' ')),
                    (k += (k ? ' ' : '') + 'x-scope ' + g),
                    h !== k && Ch(a, k));
                d || Ti.store(b, c.L, f, c.G);
            }
        }
    };
    function Zi(a, b, c) {
        const d = Eh(b).is;
        if (c.F) {
            var e = c.F;
            let f;
            for (f in e) f === null ? b.style.removeProperty(f) : b.style.setProperty(f, e[f]);
        }
        e = Ni[d];
        if (!((!e && b !== a.c) || (e && Gh(e) !== '')) && e && e._style && !Qi(e)) {
            if (Qi(e) || e._applyShimValidatingVersion !== e._applyShimNextVersion) {
                Ui(a), a.b && a.b.transformRules(e._styleAst, d), (e._style.textContent = Ph(b, c.H)), Ri(e);
            }
            V && (a = b.shadowRoot) && (a = a.querySelector('style')) && (a.textContent = Ph(b, c.H));
            c.H = e._styleAst;
        }
    }
    function $i(a, b) {
        return (b = Dh(b).getRootNode().host) ? (ii(b) || Vi(b) ? b : $i(a, b)) : a.c;
    }
    function Yi(a, b, c) {
        let d = $i(a, b);
        let e = ii(d);
        let f = e.L;
        d === a.c || f || (Yi(a, d, e), (f = e.L));
        a = Object.create(f || null);
        d = vi(b, c.H, c.cssBuild);
        b = ti(e.H, b).K;
        Object.assign(a, d.Va, b, d.cb);
        b = c.F;
        for (var g in b) if ((e = b[g]) || e === 0) a[g] = e;
        g = Ai;
        b = Object.getOwnPropertyNames(a);
        for (e = 0; e < b.length; e++) (d = b[e]), (a[d] = ri(g, a[d], a));
        c.L = a;
    }
    v.styleDocument = function(a) {
        this.styleSubtree(this.c, a);
    };
    v.styleSubtree = function(a, b) {
        const c = Dh(a);
        const d = c.shadowRoot;
        const e = a === this.c;
        (d || e) && this.styleElement(a, b);
        if ((a = e ? c : d)) {
            for (
                a = Array.from(a.querySelectorAll('*')).filter(function (f) {
                    return Dh(f).shadowRoot;
                }),
                    b = 0;
                b < a.length;
                b++
            ) {
                this.styleSubtree(a[b]);
            }
        }
    };
    v.Ha = function(a) {
        const b = this;
        const c = Gh(a);
        c !== this.l.cssBuild && (this.l.cssBuild = c);
        if (!Hh(c)) {
            const d = th(a);
            sh(d, function(e) {
                if (V) gi(e);
                else {
                    const f = Lh;
                    e.selector = e.parsedSelector;
                    gi(e);
                    e.selector = e.w = Sh(f, e, f.c, void 0, void 0);
                }
                X && c === '' && (Ui(b), b.b && b.b.transformRule(e));
            });
            X ? (a.textContent = rh(d)) : this.l.H.rules.push(d);
        }
    };
    v.getComputedStyleValue = function(a, b) {
        let c;
        X || (c = (ii(a) || ii($i(this, a))).L[b]);
        return (c = c || window.getComputedStyle(a).getPropertyValue(b)) ? c.trim() : '';
    };
    v.gb = function(a, b) {
        let c = Dh(a).getRootNode();
        let d;
        b ? (d = (typeof b === 'string' ? b : String(b)).split(/\s/)) : (d = []);
        b = c.host && c.host.localName;
        if (!b && (c = a.getAttribute('class'))) {
            c = c.split(/\s/);
            for (let e = 0; e < c.length; e++) {
                if (c[e] === Lh.a) {
                    b = c[e + 1];
                    break;
                }
            }
        }
        b && d.push(Lh.a, b);
        X || ((b = ii(a)) && b.G && d.push(Ai.a, b.G));
        Ch(a, d.join(' '));
    };
    v.Oa = function(a) {
        return ii(a);
    };
    v.fb = function(a, b) {
        Mh(a, b);
    };
    v.ib = function(a, b) {
        Mh(a, b, !0);
    };
    v.eb = function(a) {
        return Ii(a);
    };
    v.Ra = function(a) {
        return Hi(a);
    };
    Y.prototype.flush = Y.prototype.flush;
    Y.prototype.prepareTemplate = Y.prototype.prepareTemplate;
    Y.prototype.styleElement = Y.prototype.styleElement;
    Y.prototype.styleDocument = Y.prototype.styleDocument;
    Y.prototype.styleSubtree = Y.prototype.styleSubtree;
    Y.prototype.getComputedStyleValue = Y.prototype.getComputedStyleValue;
    Y.prototype.setElementClass = Y.prototype.gb;
    Y.prototype._styleInfoForNode = Y.prototype.Oa;
    Y.prototype.transformCustomStyleForDocument = Y.prototype.Ha;
    Y.prototype.getStyleAst = Y.prototype.Ta;
    Y.prototype.styleAstToString = Y.prototype.hb;
    Y.prototype.flushCustomStyles = Y.prototype.flushCustomStyles;
    Y.prototype.scopeNode = Y.prototype.fb;
    Y.prototype.unscopeNode = Y.prototype.ib;
    Y.prototype.scopeForNode = Y.prototype.eb;
    Y.prototype.currentScopeForNode = Y.prototype.Ra;
    Y.prototype.prepareAdoptedCssText = Y.prototype.ab;
    Object.defineProperties(Y.prototype, {
        nativeShadow: {
            get: function() {
                return V;
            },
        },
        nativeCss: {
            get: function() {
                return X;
            },
        },
    });
    const Z = new Y();
    let aj;
    let bj;
    window.ShadyCSS && ((aj = window.ShadyCSS.ApplyShim), (bj = window.ShadyCSS.CustomStyleInterface));
    window.ShadyCSS = {
        ScopingShim: Z,
        prepareTemplate: function(a, b, c) {
            Z.flushCustomStyles();
            Z.prepareTemplate(a, b, c);
        },
        prepareTemplateDom: function(a, b) {
            Z.prepareTemplateDom(a, b);
        },
        prepareTemplateStyles: function(a, b, c) {
            Z.flushCustomStyles();
            Z.prepareTemplateStyles(a, b, c);
        },
        styleSubtree: function(a, b) {
            Z.flushCustomStyles();
            Z.styleSubtree(a, b);
        },
        styleElement: function(a) {
            Z.flushCustomStyles();
            Z.styleElement(a);
        },
        styleDocument: function(a) {
            Z.flushCustomStyles();
            Z.styleDocument(a);
        },
        flushCustomStyles: function() {
            Z.flushCustomStyles();
        },
        getComputedStyleValue: function(a, b) {
            return Z.getComputedStyleValue(a, b);
        },
        nativeCss: X,
        nativeShadow: V,
        cssBuild: ih,
        disableRuntime: jh,
    };
    aj && (window.ShadyCSS.ApplyShim = aj);
    bj && (window.ShadyCSS.CustomStyleInterface = bj);
    (function(a) {
        function b(t) {
            t == '' && (f.call(this), (this.h = !0));
            return t.toLowerCase();
        }
        function c(t) {
            const F = t.charCodeAt(0);
            return F > 32 && F < 127 && [34, 35, 60, 62, 63, 96].indexOf(F) == -1 ? t : encodeURIComponent(t);
        }
        function d(t) {
            const F = t.charCodeAt(0);
            return F > 32 && F < 127 && [34, 35, 60, 62, 96].indexOf(F) == -1 ? t : encodeURIComponent(t);
        }
        function e(t, F, E) {
            function M(ka) {
                va.push(ka);
            }
            let y = F || 'scheme start';
            let W = 0;
            let w = '';
            let wa = !1;
            let fa = !1;
            var va = [];
            a: for (; (void 0 != t[W - 1] || W == 0) && !this.h; ) {
                let n = t[W];
                switch (y) {
                    case 'scheme start':
                        if (n && q.test(n)) (w += n.toLowerCase()), (y = 'scheme');
                        else if (F) {
                            M('Invalid scheme.');
                            break a;
                        } else {
                            w = '';
                            y = 'no scheme';
                            continue;
                        }
                        break;
                    case 'scheme':
                        if (n && H.test(n)) w += n.toLowerCase();
                        else if (n == ':') {
                            this.g = w;
                            w = '';
                            if (F) break a;
                            void 0 !== l[this.g] && (this.A = !0);
                            y =
                                this.g == 'file'
                                    ? 'relative'
                                    : this.A && E && E.g == this.g
                                    ? 'relative or authority'
                                    : this.A
                                    ? 'authority first slash'
                                    : 'scheme data';
                        } else if (F) {
                            void 0 != n && M('Code point not allowed in scheme: ' + n);
                            break a;
                        } else {
                            w = '';
                            W = 0;
                            y = 'no scheme';
                            continue;
                        }
                        break;
                    case 'scheme data':
                        n == '?'
                            ? ((this.o = '?'), (y = 'query'))
                            : n == '#'
                            ? ((this.u = '#'), (y = 'fragment'))
                            : void 0 != n && n != '\t' && n != '\n' && n != '\r' && (this.pa += c(n));
                        break;
                    case 'no scheme':
                        if (E && void 0 !== l[E.g]) {
                            y = 'relative';
                            continue;
                        } else M('Missing scheme.'), f.call(this), (this.h = !0);
                        break;
                    case 'relative or authority':
                        if (n == '/' && t[W + 1] == '/') y = 'authority ignore slashes';
                        else {
                            M('Expected /, got: ' + n);
                            y = 'relative';
                            continue;
                        }
                        break;
                    case 'relative':
                        this.A = !0;
                        this.g != 'file' && (this.g = E.g);
                        if (void 0 == n) {
                            this.i = E.i;
                            this.m = E.m;
                            this.j = E.j.slice();
                            this.o = E.o;
                            this.s = E.s;
                            this.f = E.f;
                            break a;
                        } else if (n == '/' || n == '\\') {
                            n == '\\' && M('\\ is an invalid code point.'), (y = 'relative slash');
                        } else if (n == '?') {
                            (this.i = E.i),
                                (this.m = E.m),
                                (this.j = E.j.slice()),
                                (this.o = '?'),
                                (this.s = E.s),
                                (this.f = E.f),
                                (y = 'query');
                        } else if (n == '#') {
                            (this.i = E.i),
                                (this.m = E.m),
                                (this.j = E.j.slice()),
                                (this.o = E.o),
                                (this.u = '#'),
                                (this.s = E.s),
                                (this.f = E.f),
                                (y = 'fragment');
                        } else {
                            y = t[W + 1];
                            var J = t[W + 2];
                            if (
                                this.g != 'file' ||
                                !q.test(n) ||
                                (y != ':' && y != '|') ||
                                (void 0 != J && J != '/' && J != '\\' && J != '?' && J != '#')
                            ) {
                                (this.i = E.i),
                                    (this.m = E.m),
                                    (this.s = E.s),
                                    (this.f = E.f),
                                    (this.j = E.j.slice()),
                                    this.j.pop();
                            }
                            y = 'relative path';
                            continue;
                        }
                        break;
                    case 'relative slash':
                        if (n == '/' || n == '\\') {
                            n == '\\' && M('\\ is an invalid code point.'),
                                (y = this.g == 'file' ? 'file host' : 'authority ignore slashes');
                        } else {
                            this.g != 'file' && ((this.i = E.i), (this.m = E.m), (this.s = E.s), (this.f = E.f));
                            y = 'relative path';
                            continue;
                        }
                        break;
                    case 'authority first slash':
                        if (n == '/') y = 'authority second slash';
                        else {
                            M("Expected '/', got: " + n);
                            y = 'authority ignore slashes';
                            continue;
                        }
                        break;
                    case 'authority second slash':
                        y = 'authority ignore slashes';
                        if (n != '/') {
                            M("Expected '/', got: " + n);
                            continue;
                        }
                        break;
                    case 'authority ignore slashes':
                        if (n != '/' && n != '\\') {
                            y = 'authority';
                            continue;
                        } else M('Expected authority, got: ' + n);
                        break;
                    case 'authority':
                        if (n == '@') {
                            wa && (M('@ already seen.'), (w += '%40'));
                            wa = !0;
                            for (n = 0; n < w.length; n++) {
                                (J = w[n]),
                                    J == '\t' || J == '\n' || J == '\r'
                                        ? M('Invalid whitespace in authority.')
                                        : J == ':' && this.f === null
                                        ? (this.f = '')
                                        : ((J = c(J)), this.f !== null ? (this.f += J) : (this.s += J));
                            }
                            w = '';
                        } else if (void 0 == n || n == '/' || n == '\\' || n == '?' || n == '#') {
                            W -= w.length;
                            w = '';
                            y = 'host';
                            continue;
                        } else w += n;
                        break;
                    case 'file host':
                        if (void 0 == n || n == '/' || n == '\\' || n == '?' || n == '#') {
                            w.length != 2 || !q.test(w[0]) || (w[1] != ':' && w[1] != '|')
                                ? (w.length != 0 && ((this.i = b.call(this, w)), (w = '')), (y = 'relative path start'))
                                : (y = 'relative path');
                            continue;
                        } else n == '\t' || n == '\n' || n == '\r' ? M('Invalid whitespace in file host.') : (w += n);
                        break;
                    case 'host':
                    case 'hostname':
                        if (n != ':' || fa) {
                            if (void 0 == n || n == '/' || n == '\\' || n == '?' || n == '#') {
                                this.i = b.call(this, w);
                                w = '';
                                y = 'relative path start';
                                if (F) break a;
                                continue;
                            } else {
                                n != '\t' && n != '\n' && n != '\r'
                                    ? (n == '[' ? (fa = !0) : n == ']' && (fa = !1), (w += n))
                                    : M('Invalid code point in host/hostname: ' + n);
                            }
                        } else if (((this.i = b.call(this, w)), (w = ''), (y = 'port'), F == 'hostname')) break a;
                        break;
                    case 'port':
                        if (/[0-9]/.test(n)) w += n;
                        else if (void 0 == n || n == '/' || n == '\\' || n == '?' || n == '#' || F) {
                            w != '' && ((w = parseInt(w, 10)), w != l[this.g] && (this.m = w + ''), (w = ''));
                            if (F) break a;
                            y = 'relative path start';
                            continue;
                        } else {
                            n == '\t' || n == '\n' || n == '\r'
                                ? M('Invalid code point in port: ' + n)
                                : (f.call(this), (this.h = !0));
                        }
                        break;
                    case 'relative path start':
                        n == '\\' && M("'\\' not allowed in path.");
                        y = 'relative path';
                        if (n != '/' && n != '\\') continue;
                        break;
                    case 'relative path':
                        if (void 0 != n && n != '/' && n != '\\' && (F || (n != '?' && n != '#'))) {
                            n != '\t' && n != '\n' && n != '\r' && (w += c(n));
                        } else {
                            n == '\\' && M('\\ not allowed in relative path.');
                            if ((J = m[w.toLowerCase()])) w = J;
                            w == '..'
                                ? (this.j.pop(), n != '/' && n != '\\' && this.j.push(''))
                                : w == '.' && n != '/' && n != '\\'
                                ? this.j.push('')
                                : w != '.' &&
                                  (this.g == 'file' &&
                                      this.j.length == 0 &&
                                      w.length == 2 &&
                                      q.test(w[0]) &&
                                      w[1] == '|' &&
                                      (w = w[0] + ':'),
                                  this.j.push(w));
                            w = '';
                            n == '?' ? ((this.o = '?'), (y = 'query')) : n == '#' && ((this.u = '#'), (y = 'fragment'));
                        }
                        break;
                    case 'query':
                        F || n != '#'
                            ? void 0 != n && n != '\t' && n != '\n' && n != '\r' && (this.o += d(n))
                            : ((this.u = '#'), (y = 'fragment'));
                        break;
                    case 'fragment':
                        void 0 != n && n != '\t' && n != '\n' && n != '\r' && (this.u += n);
                }
                W++;
            }
        }
        function f() {
            this.s = this.pa = this.g = '';
            this.f = null;
            this.m = this.i = '';
            this.j = [];
            this.u = this.o = '';
            this.A = this.h = !1;
        }
        function g(t, F) {
            void 0 === F || F instanceof g || (F = new g(String(F)));
            this.a = t;
            f.call(this);
            e.call(this, this.a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, ''), null, F);
        }
        let h = !1;
        try {
            const k = new URL('b', 'http://a');
            k.pathname = 'c%20d';
            h = k.href === 'http://a/c%20d';
        } catch (t) {}
        if (!h) {
            var l = Object.create(null);
            l.ftp = 21;
            l.file = 0;
            l.gopher = 70;
            l.http = 80;
            l.https = 443;
            l.ws = 80;
            l.wss = 443;
            var m = Object.create(null);
            m['%2e'] = '.';
            m['.%2e'] = '..';
            m['%2e.'] = '..';
            m['%2e%2e'] = '..';
            var q = /[a-zA-Z]/;
            var H = /[a-zA-Z0-9\+\-\.]/;
            g.prototype = {
                toString: function() {
                    return this.href;
                },
                get href() {
                    if (this.h) return this.a;
                    let t = '';
                    if (this.s != '' || this.f != null) t = this.s + (this.f != null ? ':' + this.f : '') + '@';
                    return this.protocol + (this.A ? '//' + t + this.host : '') + this.pathname + this.o + this.u;
                },
                set href(t) {
                    f.call(this);
                    e.call(this, t);
                },
                get protocol() {
                    return this.g + ':';
                },
                set protocol(t) {
                    this.h || e.call(this, t + ':', 'scheme start');
                },
                get host() {
                    return this.h ? '' : this.m ? this.i + ':' + this.m : this.i;
                },
                set host(t) {
                    !this.h && this.A && e.call(this, t, 'host');
                },
                get hostname() {
                    return this.i;
                },
                set hostname(t) {
                    !this.h && this.A && e.call(this, t, 'hostname');
                },
                get port() {
                    return this.m;
                },
                set port(t) {
                    !this.h && this.A && e.call(this, t, 'port');
                },
                get pathname() {
                    return this.h ? '' : this.A ? '/' + this.j.join('/') : this.pa;
                },
                set pathname(t) {
                    !this.h && this.A && ((this.j = []), e.call(this, t, 'relative path start'));
                },
                get search() {
                    return this.h || !this.o || this.o == '?' ? '' : this.o;
                },
                set search(t) {
                    !this.h && this.A && ((this.o = '?'), t[0] == '?' && (t = t.slice(1)), e.call(this, t, 'query'));
                },
                get hash() {
                    return this.h || !this.u || this.u == '#' ? '' : this.u;
                },
                set hash(t) {
                    this.h ||
                        (t
                            ? ((this.u = '#'), t[0] == '#' && (t = t.slice(1)), e.call(this, t, 'fragment'))
                            : (this.u = ''));
                },
                get origin() {
                    let t;
                    if (this.h || !this.g) return '';
                    switch (this.g) {
                        case 'data':
                        case 'file':
                        case 'javascript':
                        case 'mailto':
                            return 'null';
                    }
                    return (t = this.host) ? this.g + '://' + t : '';
                },
            };
            const C = a.URL;
            C &&
                ((g.createObjectURL = function(t) {
                    return C.createObjectURL.apply(C, arguments);
                }),
                (g.revokeObjectURL = function(t) {
                    C.revokeObjectURL(t);
                }));
            a.URL = g;
        }
    })(
        window,
    ); /*

Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
    const cj = window.customElements;
    let dj = !1;
    let ej = null;
    cj.polyfillWrapFlushCallback &&
        cj.polyfillWrapFlushCallback(function(a) {
            ej = a;
            dj && a();
        });
    function fj() {
        window.HTMLTemplateElement.bootstrap && window.HTMLTemplateElement.bootstrap(window.document);
        ej && ej();
        dj = !0;
        window.WebComponents.ready = !0;
        document.dispatchEvent(new CustomEvent('WebComponentsReady', { bubbles: !0 }));
    }
    document.readyState !== 'complete'
        ? (window.addEventListener('load', fj),
          window.addEventListener('DOMContentLoaded', function() {
              window.removeEventListener('load', fj);
              fj();
          }))
        : fj();
}.call(this));

// # sourceMappingURL=webcomponents-bundle.js.map
