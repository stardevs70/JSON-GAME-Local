/* ============================================================
 * Rich Fruits – 5-reel, 20-payline slot game
 * De-minified and annotated for local development.
 *
 * Major sections:
 *   1. Animation / timer system (aa, ca, ea, q)
 *   2. Asset preloader (ga, ia, ja, ka, la, ma)
 *   3. DOM builder / panel animation (na, oa, pa, sa, ua)
 *   4. Canvas rendering helpers (wa, xa, Ca, Da)
 *   5. Viewport / scaling (La, Ma, Pa, Na)
 *   6. AJAX wrapper (u.w)
 *   7. Reel engine (Za, ab, cb)
 *   8. Audio system (v, x, yb, zb)
 *   9. Event / touch helpers (ib, jb, kb)
 *  10. Sound-prompt dialog (Bb)
 *  11. UI controls / buttons (Fa–Ka, N, Ub)
 *  12. Translations (Kc, Qb, B, Sb, Tb)
 *  13. API response parser (Lc)
 *  14. API call functions (bf=init, fe=start, gf=start_free,
 *      hf=close, show_double, double, select_bonus_symbol)
 *  15. Game-state & win/payline display (ef, lf, nf, ce, jg)
 *  16. Boot sequence (DOMContentLoaded handler)
 *  17. Global variable declarations
 * ============================================================ */

(function() {

    /* ----------------------------------------------------------
     * 1. requestAnimationFrame polyfill & timer/scheduler system
     * ---------------------------------------------------------- */
    (function() {
        for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
            var c = (new Date).getTime(),
                f = Math.max(0, 16 - (c - a)),
                h = window.setTimeout(function() {
                    b(c + f)
                }, f);
            a = c + f;
            return h
        });
        window.cancelAnimationFrame || (window.cancelAnimationFrame =
            function(a) {
                clearTimeout(a)
            })
    })();

    function aa() {
        this.oa = this.d = null;
        this.Ca = {};
        this.Ld = null;
        return this
    }
    aa.prototype = {};

    function ba() {
        for (var a = "", b = 0; 7 > b; b++) a += "0123456789ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz" [Math.floor(60 * Math.random())];
        return a
    }

    function ca(a) {
        a.Ld = requestAnimationFrame(function() {
            ca(a)
        });
        da(a);
        ea(a)
    }

    function ea(a) {
        for (var b in a.Ca)
            if (a.Ca.hasOwnProperty(b)) {
                var c = a.Ca[b];
                c.Ja && a.d < c.Ja || (c.Ja = !1, c.h(), c.Nd || fa(a, b))
            }
    }

    function da(a) {
        var b = (new Date).getTime();
        a.oa = null == a.oa ? 0 : b - a.d;
        a.d = b
    }

    function fa(a, b) {
        b && a.Ca[b] && delete a.Ca[b]
    }

    function q(a, b, c, d) {
        for (var e = ba(); e in a.Ca;) e = ba();
        a.Ca[e] = {
            h: b,
            Ja: d ? (new Date).getTime() + d : 0,
            Nd: c || !1
        };
        return e
    };

    /* ----------------------------------------------------------
     * 2. Asset preloader – collects image/CSS URLs, loads them
     *    sequentially, updates progress bar (ga, ia, ja, ka, la, ma)
     * ---------------------------------------------------------- */
    function ga() {
        this.be = document.location.protocol + "//" + document.location.host;
        return this
    }
    ga.prototype = {};

    function ia(a) {
        var b = r,
            c = [],
            d = document.styleSheets;
        if (b && b.length) {
            var e = [],
                f = Array.prototype.slice.call(document.getElementsByTagName("img")),
                e = e.concat(f);
            b && (e = e.concat(b));
            b = [];
            for (f = 0; e[f]; f++) {
                var h = e[f].src;
                h && b.push(ja(a, h))
            }
            b.length && (c = c.concat(b))
        }
        for (e = 0; d[e]; e++) {
            a: {
                b = d[e];
                if ("object" === typeof b && b.cssRules && (b = b.cssRules, 0 < b.length)) {
                    f = b;
                    break a
                }
                f = []
            }
            b = a;h = [];
            if (f.length)
                for (var n = 0; f[n]; n++) {
                    var m;
                    a: {
                        m = f[n];
                        if ("object" === typeof m && (m = m.style) && m.backgroundImage && "none" !== m.backgroundImage &&
                            "initial" !== m.backgroundImage && -1 === m.backgroundImage.indexOf("data:image") && (m = m.backgroundImage, -1 !== m.indexOf("url("))) {
                            m = ja(b, m);
                            break a
                        }
                        m = !1
                    }
                    m && h.push(m)
                }
            b = h;b.length && (c = c.concat(b))
        }
        a = c;
        c = [];
        for (d = 0; a[d]; d++) e = a[d], -1 === c.indexOf(e) && c.push(e);
        return c
    }

    function ja(a, b) {
        var c = a.be;
        b = b.replace('url("', "");
        b = b.replace("url(", "");
        b = b.replace('")', "");
        for (b = b.replace(")", ""); 0 <= b.indexOf("../");) b = b.replace("../", "");
        if (-1 === b.indexOf("http")) {
            var d = "/";
            b[0] == d && (d = "");
            b = c + d + b
        }
        return b
    };

    function ka(a, b) {
        this.p = a;
        this.links = b;
        this.Wc = this.fb = this.fc = 0;
        this.A = !1;
        return this
    }
    ka.prototype = {
        ub: function() {
            this.Wc = 100 / this.links.length
        }
    };

    function la(a, b) {
        "function" === typeof b && (a.A = b);
        a.ub();
        var c = a.p.W;
        if (c && 1 === c.nodeType)
            if (c = getComputedStyle(c, null).maxWidth) a.fc = "none" === c ? 0 : parseInt(c);
            else throw Error("Max width processing element not found");
        else throw Error("Can not find progress element");
        ma(a)
    }

    function ma(a) {
        if (0 < a.links.length) {
            var b = a.links[0],
                c = new Image;
            c.addEventListener("error", function() {
                console.warn("[Preloader] Failed to load:", b);
                a.fb += a.Wc;
                a.links.shift();
                ma(a)
            }, !1);
            c.addEventListener("load", function() {
                a.fb += a.Wc;
                100 < a.fb && (a.fb = 100);
                var b = a.p.W;
                b && a.fc && (b.style.width = a.fb / 100 * a.fc + "px");
                a.links.shift();
                ma(a)
            }, !1);
            c.src = b
        } else "function" === typeof a.A && a.A()
    };

    /* ----------------------------------------------------------
     * 3. DOM builder / panel animation (na, oa, pa, ra, sa, ua)
     * ---------------------------------------------------------- */
    function na(a, b, c, d, e, f, h, n, m) {
        this.he = a;
        this.W = this.i = !1;
        this.kb = b;
        this.La = d;
        this.jb = c;
        this.Ka = e;
        this.Fb = h;
        this.Ya = n;
        this.Hb = m;
        this.od = f;
        this.qc = null;
        return this
    }
    na.prototype = {
        createElement: function(a, b, c, d) {
            a = document.createElement(a);
            var e, f = "";
            b && (a.id = b);
            c && (a.className = c);
            if (d) {
                if ("object" === typeof d) 1 === d.nodeType ? e = d : f = "Expected element with nodeType - 1. Received argument with nodeType - " + d.nodeType;
                else if ("string" === typeof d) {
                    if ((e = document.getElementById(d)) || (e = Array.prototype.slice.call(document.getElementsByClassName(d))), !e || "object" === typeof e && 0 === e.length) f = "Undefined parent element."
                } else f = "Unexpected argument received.";
                if (f) throw Error(f);
                if (0 < e.length)
                    for (b = 0; b < e.length; b++) c = a.cloneNode(!0), e[b].appendChild(c);
                else e.appendChild(a)
            }
            return a
        },
        Cb: function() {
            var a = this.i;
            a && (a.parentNode.removeChild(a), this.i = !1)
        }
    };

    function oa(a) {
        if (a.i) {
            var b = parseFloat(a.i.style.height) || a.i.offsetHeight,
                c = parseFloat(a.i.style.opacity);
            if ((parseFloat(a.i.style.width) || a.i.offsetWidth) === a.La && b === a.Ka && c === a.Ya) return !0
        }
        return !1
    }

    function pa(a, b, c) {
        b || (b = a.he);
        if ("object" === typeof b)
            for (var d = 0; d < b.length; d++) {
                var e = b[d];
                c = e.parentElement || c;
                if (!c) throw Error("Unknown parent element");
                var f = a.createElement(e.F, e.D, e.zd, c);
                e.parentElement && (a.i = f);
                e.Kc && (a.W = f);
                e.Ta && (f.innerHTML = e.Ta);
                e.attributeName && f.setAttribute(e.attributeName, e.xe);
                e.pa && pa(a, e.pa, f)
            }
    }

    function ra(a, b, c, d) {
        if (a.i) a.i.style.width = b + a.od, a.i.style.height = c + a.od, a.i.style.opacity = d;
        else throw Error("Unknown parent element");
    }

    function sa(a, b, c, d, e, f) {
        if (a.i) {
            var h = !1,
                n = !1,
                m = !1,
                g = f.oa,
                l = parseFloat(a.i.style.width) || a.i.offsetWidth,
                k = parseFloat(a.i.style.height) || a.i.offsetHeight,
                p = parseFloat(a.i.style.opacity),
                l = l + b * g * e,
                k = k + c * g * e,
                p = p + d * g * e;
            0 < e ? (l >= a.La && (l = a.La, h = !0), k >= a.Ka && (k = a.Ka, n = !0), p >= a.Ya && (p = a.Ya, m = !0)) : (l <= a.kb && (l = a.kb, h = !0), k <= a.jb && (k = a.jb, n = !0), p <= a.Fb && (p = a.Fb, m = !0));
            ra(a, l, k, p);
            h && n && m ? ta(a) : a.qc = q(f, function() {
                sa(a, b, c, d, e, f)
            }, !1, !1)
        }
    }

    function ua(a, b, c) {
        var d = (a.La - a.kb) / a.Hb,
            e = (a.Ka - a.jb) / a.Hb,
            f = (a.Ya - a.Fb) / a.Hb;
        1 === c ? ra(a, a.kb, a.jb, a.Fb) : ra(a, a.La, a.Ka, a.Ya);
        sa(a, d, e, f, c, b)
    }

    function ta(a) {
        "function" === typeof a.A && (a.A(), a.A = !1)
    }

    function va(a, b) {
        "function" === typeof b && (a.A = b)
    };

    /* ----------------------------------------------------------
     * 4. Canvas rendering helpers (wa, xa, za, Aa, Ba, Ca, Da)
     * ---------------------------------------------------------- */
    function wa(a, b, c) {
        this.canvas = a;
        this.R = this.canvas.getContext("2d");
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.sd = b;
        this.rd = c;
        return this
    }
    wa.prototype = {};

    function xa(a, b, c, d, e) {
        var f = ya,
            h = f.R,
            n = a + 20,
            m = b - 7;
        a += 70;
        b += 13;
        za(f, n, m, 50, 20, c[0], e);
        for (var g = 0; g < c.length; g++) {
            h.save();
            h.beginPath();
            h.globalAlpha = e;
            h.strokeStyle = c[g];
            h.lineWidth = 1;
            Aa(f, [
                [n + g, m + g],
                [a - g, m + g],
                [a - g, b - g],
                [n + g, b - g],
                [n + g, m + g]
            ]);
            h.stroke();
            h.closePath();
            h.restore();
            var l = c.length,
                l = {
                    x: n + l,
                    y: m + l,
                    a: a - n - 2 * l,
                    b: b - m - 2 * l
                };
            za(f, l.x, l.y, l.a, l.b, "#001A00", e);
            var k = d,
                p = f.R;
            p.save();
            p.beginPath();
            p.fillStyle = "#ddd";
            p.textAlign = "center";
            p.textBaseline = "middle";
            p.font = "16px MyriadPro-Cond";
            p.fillText(k +
                "", l.x + l.a / 2, l.y + l.b / 2, 46);
            p.closePath();
            p.restore()
        }
    }

    function za(a, b, c, d, e, f, h) {
        a = a.R;
        a.save();
        a.beginPath();
        a.globalAlpha = h;
        a.fillStyle = f;
        a.fillRect(b, c, d, e);
        a.closePath();
        a.restore()
    }

    function Aa(a, b) {
        var c = a.R;
        c.moveTo(b[0][0], b[0][1]);
        for (var d = 1, e; d < b.length; d++) e = b[d], c.lineTo(e[0], e[1])
    }

    function Ba(a, b, c) {
        for (var d = ya, e = 2 * a.length, f = d.R, h = 0; h < a.length; h++) {
            var n = a[h],
                m = b,
                g = e - 2 * h;
            f.save();
            f.beginPath();
            !1 !== c && (f.globalAlpha = c);
            f.strokeStyle = n;
            f.lineWidth = g;
            f.lineCap = "round";
            Aa(d, m);
            f.stroke();
            f.closePath();
            f.restore()
        }
    }

    function Ca(a, b, c) {
        var d = ya,
            e, f, h;
        a ? e = a : h = "Expecting image in params! ";
        if (b) {
            if (c) {
                c = b.y;
                f = d.rd || d.height;
                var n = c + a.height;
                b = {
                    ba: 0,
                    M: 0,
                    aa: a.width,
                    B: a.height,
                    x: b.x,
                    y: c,
                    a: a.width,
                    b: a.height
                };
                0 >= n || c >= f ? a = !1 : (0 > c && 0 < n ? (b.M = -c, b.B = a.height + c, b.y = 0, b.b = b.B) : c < f && n > f && (b.M = 0, b.B = a.height - (n - f), b.b = b.B), a = b)
            } else a = b;
            f = a
        } else h += "Expecting chords in params!";
        if (h) throw Error(h);
        d.R.save();
        d.R.beginPath();
        d.R.drawImage(e, f.ba, f.M, f.aa, f.B, f.x, d.sd + f.y, f.a, f.b);
        d.R.closePath();
        d.R.restore()
    }

    function Da(a) {
        var b = ya,
            c = {},
            c = a ? a : {
                x: 0,
                y: 0,
                a: b.width,
                b: b.height
            };
        b.R.clearRect(c.x, c.y, c.a, c.b)
    };
    /* ----------------------------------------------------------
     * 11. UI controls / buttons (Fa–Ka, N, Ub)
     * ---------------------------------------------------------- */
    var Ea = !0;

    function Fa(a, b, c) {
        this.Q = a;
        this.N = b;
        this.Vc = c;
        return this
    }
    Fa.prototype = {
        m: function() {
            return this.Q.classList.contains("active")
        }
    };

    function Ga(a, b) {
        if (a.N && a.N.i) {
            var c = a.N.i;
            b && "block" !== c.style.display ? c.style.display = "block" : b || "none" === c.style.display || (c.style.display = "none")
        }
    }

    function Ha(a, b) {
        va(a.N, function() {
            Ea = !0
        });
        Ga(a, !0);
        ua(a.N, b, 1)
    }

    function Ia(a, b) {
        va(a.N, function() {
            Ga(a, !1)
        });
        ua(a.N, b, -1)
    }

    function Ja(a, b) {
        var c = s;
        a.N && a.N.i && (!0 !== b || oa(a.N) ? !1 === b && oa(a.N) && Ia(a, c) : Ha(a, c))
    }

    function Ka(a, b) {
        if (1 === a.Q.nodeType) {
            if (!0 === b && !1 === a.m()) return a.Q.classList.add("active"), !0;
            if (!1 === b && !0 === a.m()) return a.Q.classList.remove("active"), !0
        }
        return !1
    };

    /* ----------------------------------------------------------
     * 5. Viewport / scaling (La, Ma, Pa, Na, Oa, Qa, Ra)
     * ---------------------------------------------------------- */
    function La(a, b, c, d) {
        this.pd = a;
        this.bb = b;
        this.md = c;
        this.wc = d;
        this.Pa = "";
        this.Jb = null;
        a = document.getElementById("viewport");
        a || (a = document.getElementsByName("viewport")[0], a || (b = document.getElementsByTagName("head")[0], a = document.createElement("meta"), a.name = "viewport", b.appendChild(a)), a.id = "viewport");
        this.Jb = a;
        a = document.getElementsByTagName("html")[0];
        this.Pa = a.hasAttribute("data-device") ? a.getAttribute("data-device") : "desktop"
    }
    La.prototype = {};

    function Ma(a) {
        var b;
        b = Na().gb;
        var c = (("portrait" === Oa() ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height)) / b).toFixed(2);
        a.Jb && (a.Jb.removeAttribute("content"), a.Jb.setAttribute("content", "width=" + b + ",initial-scale=" + c + ",minimum-scale=" + c + ",maximum-scale=" + c + ",user-scalable=no,minimal-ui,target-densitydpi=device-dpi,shrink-to-fit=no"), a.pd.style.width = b);
        Pa(a);
        window.scrollTo(0, 0)
    }

    function Qa(a, b) {
        if ("number" !== typeof a || "number" !== typeof b) throw Error("Parameters must be integer.");
        return a / b
    }

    function Ra(a, b) {
        "string" === typeof a && (a = document.getElementById(a));
        if (a)
            for (var c = ["-moz-", "-webkit-", "-o-", "-ms-", ""], d = 0; d < c.length; d++) a.style[c[d] + "transform"] = "scale(" + b + ")"
    }

    function Oa() {
        return 180 === window.orientation || 0 === window.orientation ? "portrait" : "landscape"
    }

    function Pa(a) {
        var b, c, d, e;
        if ("desktop" === a.Pa) {
            var f = Na();
            e = Qa(window.innerWidth, f.gb);
            f = Qa(window.innerHeight, f.Ab);
            b = a.pd;
            1 > e || 1 > f ? (d = e, f < e && (d = f), Ra(b, d), b.className = "originalSize") : (Ra(b, 1), b.className = "scaledSize")
        }
        if (a.bb) {
            e = a.bb;
            d = e.offsetWidth;
            e = e.offsetHeight;
            var h = 100,
                f = a.md.offsetTop + a.md.offsetHeight;
            b = a.wc.offsetTop;
            "portrait" === Oa() && (h = 0);
            b -= f;
            c = a.wc.offsetWidth - h;
            h = Qa(b, e);
            d = Qa(c, d);
            d = Math.min(h, d);
            Ra(a.bb, d);
            a.bb && (a.bb.style.top = parseInt(f + (b - e * d) / 2) + "px")
        }
    }

    function Na() {
        var a = Math.max(screen.width, screen.height) / Math.min(screen.width, screen.height);
        return "undefined" === typeof window.orientation ? {
            gb: 1054,
            Ab: 748
        } : 180 === window.orientation || 0 === window.orientation ? {
            gb: 819,
            Ab: 200
        } : 1.5 < a ? {
            gb: 1200,
            Ab: 100
        } : {
            gb: 1054,
            Ab: 100
        }
    };
    /* ----------------------------------------------------------
     * 6. AJAX wrapper (u.w) – sends POST/GET to mock API server
     * ---------------------------------------------------------- */
    var u = {
        tb: !1,
        qe: 19E3,
        w: function(a) {
            console.log(a);
            console.log(document.cookie);
            u.tb = !0;
            var b = u.vd(),
                c, d, e, f, h, n, m, g, l, k;
            g = a.url;
            l = a.method;
            k = a.ha;
            h = a.Y;
            n = a.Z;
            f = a.fa;
            m = a.ga;
            l = l.toLowerCase();
            if (k) {
                if ("object" == typeof k) {
                    c = [];
                    for (d in k) k.hasOwnProperty(d) && (e = k[d], c.push(d + "=" + encodeURI(e)));
                    k = c.join("&")
                }
                "get" == l && (g += -1 === g.indexOf("?") ? "?" + k : "&" + k)
            }
            b.open(l, g, !0);
            "post" == l ? (b.setRequestHeader("Method", "POST " + g + " HTTP/1.1"), b.setRequestHeader("Content-type", "application/x-www-form-urlencoded")) :
                k = null;
            b.onreadystatechange = function() {
                if (4 == b.readyState) {
                    u.tb = !1;
                    if (200 == b.status) "function" === typeof n && n(b);
                    else {
                        try {
                            b.abort()
                        } catch (c) {}
                        "function" === typeof m && m(b, a)
                    }
                    "function" == typeof f && f(b)
                }
            };
            "function" == typeof h && h(b);
            b.timeout = u.qe;
            window.onbeforeunload = function() {
                try {
                    b.abort()
                } catch (a) {}
            };
            b.send(k);
            return b
        },
        vd: function() {
            var a;
            try {
                a = new XMLHttpRequest
            } catch (b) {
                try {
                    a = new ActiveXObject("Msxml2.XMLHTTP")
                } catch (c) {
                    try {
                        a = new ActiveXObject("Microsoft.XMLHTTP")
                    } catch (d) {
                        throw Error("Error creating _Ajax request");
                    }
                }
            }
            return a
        }
    };

    function Sa(a, b, c, d) {
        this.g = a;
        this.j = b;
        this.Xd = c;
        this.n = d;
        this.eb = this.zb = this.G = !1
    }
    Sa.prototype = {
        addListener: function(a, b, c) {
            var d = this;
            this.G && this.G.addEventListener(a.Xa, function() {
                function e() {
                    d.G.removeEventListener(a.Ib, e, !1);
                    d.G.removeEventListener(a.dc, e, !1);
                    c()
                }
                b();
                d.G.addEventListener(a.Ib, e, !1);
                d.G.addEventListener(a.dc, e, !1)
            }, !1)
        }
    };

    function Ta(a, b) {
        if (a.G) {
            var c = a.G.classList;
            b && !c.contains("sLLAct") ? c.add("sLLAct") : !b && c.contains("sLLAct") && c.remove("sLLAct")
        }
    }

    function Va(a, b, c) {
        b && (a.G = document.createElement("div"), a.G.id = c, a.G.className = "sLL", a.zb = document.createElement("div"), a.zb.className = "sLLACWR", a.eb = document.createElement("span"), a.eb.className = "sLLAC", a.zb.appendChild(a.eb), a.G.appendChild(a.zb), b.appendChild(a.G), a.G.style.top = a.g[0][1] + -17 + "px")
    };

    function Wa(a, b, c, d, e, f, h) {
        this.yb = a;
        this.height = a.height;
        this.width = a.width;
        this.rc = b;
        this.we = c;
        this.cb = d;
        this.Qd = e;
        this.Rd = f;
        this.Ec = h;
        this.lb = null
    }
    Wa.prototype = {};

    function Xa(a, b) {
        if (1 === a.lb.nodeType) {
            a.lb.innerHTML = "";
            for (var c in a.rc)
                if (a.rc.hasOwnProperty(c)) {
                    var d = c,
                        e = a.rc[c] * b,
                        f = document.createElement("div");
                    f.className = "pTITValWr";
                    f.innerHTML = '<div class="pTITValL"><div class="pTITCnt"><span class="pTITCntStr">' + d + '</span></div></div><div class="pTITValR"><div class="pTITVal"><span class="pTITValStr">' + e + "</span></div></div>";
                    a.lb.insertBefore(f, a.lb.firstChild)
                }
        }
    };
    /* ----------------------------------------------------------
     * 7. Reel engine (Za, ab, cb) – reel strip positioning,
     *    spin animation, stop sequence
     * ---------------------------------------------------------- */
    var Ya = [0, 300, 600, 900, 1200];

    function Za(a, b, c, d, e) {
        this.x = a.x;
        this.y = a.y;
        this.a = a.a;
        this.b = a.b;
        this.Ga = d;
        this.state = 0;
        this.oe = b;
        this.Ed = c;
        this.s = [];
        this.l = this.S = 0;
        this.C = [];
        this.ta = 0;
        this.la = [];
        this.Sa = !1;
        this.K = this.speed = 0;
        this.V = {
            frames: 0,
            l: 0
        };
        this.xd = e;
        this.sc = !1
    }
    Za.prototype = {
        H: function() {
            this.speed = 0;
            this.la = [];
            this.Sa = !1;
            this.K = 0;
            this.V.frames = 0;
            this.V.l = 0;
            this.sc = !1
        }
    };

    function ab(a) {
        for (var b = a.ta, c = 0; c < a.la.length; c++) {
            var d = bb(b + c, a.s.length);
            a.s[d] !== a.la[c] && (a.s[d] = a.la[c])
        }
    }

    function cb(a, b) {
        for (; 0 != a.K;) {
            var c;
            b ? (a.S = bb(a.S - 1, a.s.length), a.C.length && (a.C.length -= 1), c = a.s[a.S], a.C.unshift(c)) : (a.S = bb(a.S + 1, a.s.length), a.C.splice(0, 1), c = a.s[bb(a.S + (a.C.length - 1), a.s.length)], a.C.push(c));
            a.K -= 1
        }
    }

    function bb(a, b) {
        a >= b ? a %= b : 0 > a && (a <= -b && (a %= b), a += b);
        return a
    };

    function db(a) {
        this.id = a.id;
        this.count = a.count;
        this.line = a.line;
        this.pos = a.pos;
        this.sym = a.sym;
        this.win = a.win;
        this.free = a.free;
        this.lines = a.lines;
        return this
    }
    db.prototype = {};

    function eb(a) {
        this.pe = a;
        this.ld = 0;
        return this
    }
    eb.prototype = {
        Ha: function() {},
        da: function() {},
        H: function() {}
    };

    function fb(a) {
        var b = s.d;
        return b >= a.ld + a.pe ? (a.ld = b, !0) : !1
    };

    function gb(a, b) {
        this.jd = a;
        this.Ga = b;
        this.Gb = {};
        this.kc = hb();
        return this
    }
    gb.prototype = {
        Ha: function() {
            var a = this.kc;
            a.Ba += 1;
            a.c = a.ma * Math.cos(a.Za * a.Ba + a.ma) + a.ma;
            var a = {},
                b = 1 - this.kc.c;
            a.a = parseInt(this.jd * b);
            a.b = parseInt(this.Ga * b);
            a.x = (this.jd - a.a) / 2;
            a.y = (this.Ga - a.b) / 2;
            this.Gb = a
        },
        H: function() {
            this.kc = hb()
        }
    };

    function hb() {
        return {
            Ba: 30.6,
            Ae: 1,
            ma: 0.08,
            ad: 0.01,
            Za: 0.1,
            c: 0
        }
    };

    /* ----------------------------------------------------------
     * 8. Audio system (v, x, yb, zb) – play/stop sounds
     * 9. Event / touch helpers (ib, jb, kb)
     * ---------------------------------------------------------- */
    function ib() {
        this.dc = this.move = this.Ib = this.Xa = this.click = "";
        "ontouchstart" in window ? (this.Xa = this.click = "touchstart", this.Ib = "touchend", this.move = "touchmove") : (this.click = "click", this.Xa = "mousedown", this.Ib = "mouseup", this.move = "mousemove", this.dc = "mouseleave");
        return this
    }
    ib.prototype = {};

    function jb(a, b, c, d, e) {
        this.U = document.getElementById(a);
        this.vc = document.getElementById(b);
        this.Ea = {};
        this.v = c;
        this.T = !1;
        this.Oa = "";
        this.de = 0.1;
        this.qb = {
            frame: 0,
            Tc: 0,
            Yd: 200
        };
        this.vb = {
            Zd: "",
            qd: "",
            Sc: ""
        };
        a = " Webkit Moz O ms Khtml".split(" ");
        for (b = 0; b < a.length; b++)
            if (void 0 !== document.documentElement.style[a[b] + "AnimationName"]) {
                a = a[b];
                this.vb.Zd = a;
                this.vb.qd = a + "Animation";
                this.vb.Sc = "-" + a.toLowerCase() + "-";
                break
            } this.ed = d;
        this.Ac = e
    }
    jb.prototype = {};

    function kb(a, b) {
        if (b) {
            "function" === typeof a.ed && a.ed();
            a.T = b;
            lb(a, !1);
            a.U.innerHTML = b.text;
            var c = a.U ? parseInt(a.U.offsetWidth) || 1 : 1,
                d = a.U.parentNode ? parseInt(a.U.parentNode.offsetWidth) || 1 : 1;
            a.U.style.left = parseInt(d) + "px";
            lb(a, !0);
            var e = d,
                f = function() {
                    e -= a.de * a.v.oa;
                    a.U.style.left = parseInt(e) + "px";
                    var b = a.T;
                    !b || "jackpot" !== b.type && "bonus" !== b.type || (b = a.qb, a.v.d - b.Tc >= b.Yd && (b.frame = 2 === b.frame ? 1 : 2, b.Tc = a.v.d, a.vc.className = "s" + a.qb.frame));
                    e <= -c ? (a.Oa = !1, "function" === typeof a.Ac && a.Ac(), b = a.T.start +
                        a.T.repeat, b < a.T.stop && a.v.d <= a.T.stop ? a.T.start = b : a.T.o = !1, a.U.style.visibility = "hidden", a.Ea[a.T.id] = a.T, a.T = !1, a.qb.frame = 0, a.vc.className = "s" + a.qb.frame, mb(a)) : a.Oa = q(a.v, f, !1, 0)
                };
            f()
        }
    }

    function lb(a, b) {
        var c = a.U.style.visibility;
        b && "visible" !== c ? a.U.style.visibility = "visible" : b || "hidden" === c || (a.U.style.visibility = "hidden")
    }

    function nb(a, b) {
        b && (a.Oa && (fa(a.v, a.Oa), a.Oa = !1), b.start <= a.v.d ? (a.U.style.visibility = "visible", kb(a, b)) : a.Oa = q(a.v, function() {
            mb(a)
        }, !1, b.start - a.v.d))
    }

    function mb(a) {
        if (!a.T) {
            var b, c;
            for (c in a.Ea)
                if (a.Ea.hasOwnProperty(c)) {
                    var d = a.Ea[c];
                    d.o && d.text && (!b || b.start > d.start) && (b = d)
                } nb(a, b)
        }
    };
    var ob = !1,
        pb = !1,
        qb = null,
        rb = null,
        sb = 0;

    function v(a, b, c, d, e) {
        this.P = a;
        this.oc = b;
        this.ve = c;
        this.Qc = d;
        this.Od = e
    }
    var tb;
    v.prototype = {};

    function x(a, b) {
        if (ob && a) {
            a.P.paused || ub(a.P);
            a.Qc && (vb(a, b), wb(a.P));
            try {
                a.P.currentTime = a.oc, setTimeout(function() {
                    a.P.play()
                }, 1)
            } catch (c) {
                a.Qc && xb()
            }
        }
    }

    function yb(a) {
        var b = document.getElementsByTagName("audio");
        a = (a || 0) + 1;
        (b = b[a]) && zb(b, a)
    }

    function vb(a, b) {
        pb = !0;
        qb = a;
        rb = b;
        sb = a.oc + a.ve
    }

    function xb() {
        qb && ub(qb.P);
        pb = !1;
        rb = qb = null;
        sb = 0
    }

    function ub(a) {
        if (a) try {
            a.pause()
        } catch (b) {}
    }

    function zb(a, b) {
        document.addEventListener(tb.Xa, function() {
            document.removeEventListener(tb.Xa, arguments.callee, !1);
            a.addEventListener("canplaythrough", function() {
                a.removeEventListener("canplaythrough", arguments.callee, !1);
                yb(b)
            }, !1);
            a.load()
        }, !1)
    }

    function wb(a) {
        a && !a.hasAttribute("data-progressLnr") && (a.addEventListener("timeupdate", function() {
            if (pb) {
                if (pb && qb) {
                    var a = qb;
                    if (!sb || a.P.currentTime >= sb) {
                        ub(a.P);
                        if ("function" === typeof rb) var c = rb;
                        a.Od ? (a.P.currentTime = a.oc, a.P.play()) : xb();
                        c && c()
                    }
                }
            } else try {
                ub(this)
            } catch (d) {}
        }, !1), a.setAttribute("data-progressLnr", "true"))
    }

    function Ab() {
        for (var a = document.getElementsByTagName("audio"), b = 0; a[b]; b += 1) {
            var c = a[b];
            c && c.parent && c.parent.removeChild(c)
        }
    }
    window.setGameSoundsVolume = function(a) {
        var b = document.getElementsByTagName("audio");
        if ("number" !== typeof a && (a = parseFloat(a), "number" !== typeof a)) throw Error("Type of argument must be number!");
        for (var c = 0; b[c]; c++) b[c].volume = a;
        return "Volume changed to " + a
    };

    /* ----------------------------------------------------------
     * 10. Sound-prompt dialog (Bb) – "Turn on sounds?" Yes/No
     * ---------------------------------------------------------- */
    function Bb(a, b, c) {
        if (!b || !c) throw Error("0001");
        this.v = b;
        this.Cc = c;
        this.p = a;
        "phone" === document.getElementsByTagName("html")[0].getAttribute("data-device") && (this.p.kb = 621, this.p.La = 621, this.p.jb = 245, this.p.Ka = 245);
        this.W = a.W;
        this.Kb = {
            f: null,
            h: null
        };
        this.Bb = {
            f: null,
            h: null
        }
    }
    Bb.prototype = {
        show: function(a, b, c) {
            this.H();
            pa(this.p);
            this.p.W.innerHTML = a;
            null === this.Kb.f && Cb(this, !0);
            null === this.Bb.f && Cb(this, !1);
            Db(this, b || {}, this.Kb);
            Db(this, c, this.Bb);
            ua(this.p, this.v, 1)
        },
        H: function() {
            this.Bb.f = null;
            this.Kb.f = null;
            this.p.Cb()
        },
        Mb: function(a) {
            var b = this;
            "function" === typeof a.h && a.f.addEventListener(b.Cc.click, function() {
                a.f.removeEventListener(b.Cc.click, arguments.callee, !1);
                a.h()
            }, !1)
        }
    };

    function Eb(a) {
        va(a.p, function() {
            a.H()
        });
        ua(a.p, a.v, -1)
    }

    function Fb(a, b) {
        b.innerHTML = a;
        b.parentNode.style.display = "block"
    }

    function Cb(a, b) {
        var c = "msgNoBtn",
            d = a.Bb;
        !0 === b && (c = "msgYesBtn", d = a.Kb);
        c = document.getElementById(c);
        if (c.nodeType && 1 === c.nodeType) d.f = c;
        else throw Error("Can not find button");
    }

    function Db(a, b, c) {
        if ("object" === typeof b) {
            Fb(b.na || "Ok", c.f);
            var d = b.h;
            c.h = function() {
                "function" == typeof d && d();
                Eb(a)
            }
        } else c.h = null, c.f.parentNode.style.display = "none";
        a.Mb(c)
    };

    function Gb(a, b, c) {
        this.za = document.getElementsByTagName("audio")[0];
        this.p = a;
        if (this.p) a = getComputedStyle(this.p.W, !1), a = parseInt(a.maxWidth) || 100;
        else throw Error("Element max width not set");
        this.maxWidth = a;
        this.A = b;
        this.Fc = c;
        this.Zc = null;
        return this
    }
    Gb.prototype = {};

    function Hb(a, b) {
        99 <= b ? "function" === typeof a.A && a.A() : a.Zc = requestAnimationFrame(function() {
            Ib(a)
        })
    }

    function Ib(a) {
        var b = Jb(a.za);
        a.p.W.style.width = a.maxWidth / 100 * b + "px";
        Hb(a, b)
    }

    function Jb(a) {
        for (var b = 100 / (parseInt(a.duration) || 0), c = 0, d = 0; d < a.buffered.length; d++) c += a.buffered.end(d) - a.buffered.start(d);
        return parseInt(c * b) || 0
    }

    function Kb(a) {
        setTimeout(function() {
            5 >= Jb(a.za) && (cancelAnimationFrame(a.Zc), "function" === typeof a.Fc && a.Fc())
        }, 1E4)
    }

    function Lb() {
        var a = Mb;
        if (a.za)
            if (Ib(a), Kb(a), -1 < navigator.userAgent.toLowerCase().indexOf("android")) {
                a.za.volume = 1E-4;
                a.za.play();
                var b = a.za;
                b.addEventListener("play", function() {
                    b.removeEventListener("play", arguments.callee, !1);
                    b.pause();
                    b.volume = 1
                }, !1)
            } else a.za.load();
        else Hb(a, 100)
    };

    function Nb(a, b, c) {
        var d = a - Math.floor(91 * Math.random()) + 10;
        0 > d && (d = 0);
        this.hb = d;
        this.hc = a;
        this.step = 0;
        this.tc = document.getElementById(c);
        this.gc = 0;
        this.Vb = document.getElementById(b)
    }
    Nb.prototype = {
        ub: function() {
            this.step = (this.hc - this.hb) / 4E4
        }
    };

    function Ob(a, b) {
        var c = "active";
        b || (c = "disabled");
        a.tc.className !== c && (a.tc.className = c)
    }

    function Pb(a) {
        var b = s.oa;
        1E3 < b || (a.hb += a.step * b);
        a.Vb && (parseInt(a.hb) / 100).toFixed(2) != a.Vb.textContent && (a.Vb.textContent = (parseInt(a.hb) / 100).toFixed(2))
    };

    function y(a) {
        this.Gd = a;
        this.f = null;
        this.c = 0;
        return this
    }
    y.prototype = {};

    function A(a, b, c, d) {
        a.c != b && (a.c = b);
        c && (b = (b / 100).toFixed(2));
        d && (b += d);
        d = b;
        if (!a.f || a.f && !document.body.contains(a.f)) a.f = a.Gd();
        if (a = a.f) a.innerHTML = d
    };
    var Qb = {},
        Rb = void 0;

    function B(a, b) {
        b || (b = Rb);
        return Qb[b] && Qb[b][a] ? Qb[b][a] : "en" !== b && Qb.en && Qb.en[a] ? Qb.en[a] : ""
    }

    function Sb(a) {
        Tb(a);
        for (var b = [], c = document.getElementsByTagName("*"), d = 0, e = c.length; d < e; d++) c[d].getAttribute("data-trw") && b.push(c[d]);
        for (c = 0; c < b.length; c++)
            if (d = b[c], e = d.getAttribute("data-trw")) e = B(e, a), !1 !== e && d && 1 === d.nodeType && (d.innerHTML = e)
    }

    function Tb(a) {
        if (a && Qb[a]) {
            Rb = a;
            if (window.localStorage) try {
                localStorage.setItem("uAL", a)
            } catch (b) {}
            var c = new Date;
            c.setTime(c.getTime() + 31536E6);
            document.cookie = "dj_lang=" + a + ("; expires=" + c.toGMTString()) + "; path=/"
        }
    };

    function Ub(a, b, c) {
        this.sa = !1;
        this.Pb = 100;
        this.cc = 0;
        this.rb = !1;
        this.nb = {
            ob: -1,
            Ke: 0,
            Le: 0,
            Me: 1,
            ze: 0,
            l: 0
        };
        this.Ob = a;
        this.xc = b;
        this.yc = c;
        this.A = !1;
        this.ib = "flipped"
    }
    Ub.prototype = {};

    function Vb(a, b) {
        !1 !== a.rb && (fa(b, a.rb), a.rb = !1)
    }

    function Wb() {
        var a = s,
            b = D;
        Vb(b, a);
        b.cc = a.d;
        b.rb = q(a, function() {
            if (a.d > b.cc + b.Pb) {
                var c = b.yc.classList;
                c.contains("su0") ? (c.add("su00"), c.remove("su0")) : (c.add("su0"), c.remove("su00"));
                b.cc = a.d
            }
        }, !0, !1)
    }

    function Xb(a) {
        for (var b = ["-moz-", "-webkit-", "-ms-", "-o-", ""], c = 0; c < b.length; c++) a.Ob.style[b[c] + "transform"] = "matrix(" + a.nb.ob + ", 0, 0, 1, 0, 0)"
    }

    function Yb(a) {
        var b = "block",
            c = "none";
        0 < a.nb.ob && (b = "none", c = "block");
        var d = a.yc;
        d.style.display !== b && (d.style.display = b);
        a = a.xc;
        a.style.display !== c && (a.style.display = c)
    }

    function Zb(a, b) {
        var c = 0.0075 * b.oa,
            d = a.Ob.classList.contains(a.ib) ? 1 : -1;
        Yb(a);
        a.nb.ob = function(b) {
            b = a.nb.ob + b; - 1 > b ? b = -1 : 1 < b && (b = 1);
            return b
        }(c * d);
        Xb(a);
        1 === Math.abs(a.nb.ob) ? "function" === typeof a.A && (a.A(), a.A = !1) : q(b, function() {
            Zb(a, b)
        }, !1, !1)
    }

    function $b(a) {
        var b = D,
            c = s,
            d = b.Ob.classList;
        a && !d.contains(b.ib) ? d.add(b.ib) : !a && d.contains(b.ib) && d.remove(b.ib);
        Zb(b, c)
    }

    function ac(a) {
        var b = D;
        "function" === typeof a && (b.A = a)
    };

    function bc(a, b, c) {
        this.sb = a;
        this.Fd = b;
        this.Lb = "fSEnable";
        this.Ub = "fSDis";
        !(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) || "standalone" in window.navigator && window.navigator.standalone || -1 !== window.navigator.userAgent.toLowerCase().indexOf("android") || (this.Mb(c), cc(this), dc(this));
        return this
    }
    bc.prototype = {
        Mb: function(a) {
            var b = this;
            this.sb && this.sb.addEventListener(a, function() {
                if (ec()) document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
                else {
                    var a = b.Fd;
                    a || (a = document.documentElement);
                    a.requestFullscreen ? a.requestFullscreen() : a.msRequestFullscreen ? a.msRequestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() :
                        a.webkitRequestFullscreen && a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
                }
            }, !1)
        }
    };

    function ec() {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement
    }

    function cc(a) {
        function b() {
            dc(a)
        }
        document.addEventListener("fullscreenchange", b, !1);
        document.addEventListener("webkitfullscreenchange", b, !1);
        document.addEventListener("mozfullscreenchange", b, !1);
        document.addEventListener("MSFullscreenChange", b, !1)
    }

    function dc(a) {
        var b = ec();
        if (a.sb) {
            var c = a.sb.classList;
            b && !c.contains(a.Lb) ? (c.remove(a.Ub), c.add(a.Lb)) : b || c.contains(a.Ub) || (c.remove(a.Lb), c.add(a.Ub))
        }
    };

    function fc(a, b, c, d, e, f, h) {
        this.c = a;
        this.wd = b;
        this.Sb = c.toUpperCase().split(" ");
        this.Gc = d;
        this.J = {
            Ma: 1,
            Jc: 70,
            Va: 0
        };
        this.Vd = 2E3;
        this.ua = this.va = 0.01;
        a = document.createElement("canvas");
        a.style.zIndex = 9999999;
        a.style.position = "absolute";
        a.style.top = 0;
        a.style.left = 0;
        a.style.backgroundColor = "rgba(0, 0, 0, 1)";
        a.style.opacity = ".9";
        b = document.getElementById("gameSection");
        gc(this, a, b);
        b.appendChild(a);
        this.ra = a;
        a = document.getElementsByTagName("html")[0].getAttribute("data-device");
        this.Ud = "desktop" === a ?
            8 : 3;
        this.Td = "desktop" === a ? 400 : 150;
        this.L = [];
        this.$ = [];
        this.ec = null;
        this.Yc = 0;
        this.Md = "/static/resources/images/jackpot/j-ims.json";
        this.Xc = {
            a: 830,
            b: 552
        };
        this.ka = {
            Ba: 11,
            ad: 0.06,
            ma: 2,
            Za: 0.1,
            c: 0,
            Db: !1
        };
        this.ja = {
            c: 0.1,
            step: 0.03
        };
        this.Dc = this.q = null;
        this.kd = this.Rc = this.Nc = !1;
        this.fd = e;
        this.nd = f;
        this.Ic = h
    }
    fc.prototype = {
        Cb: function(a) {
            fa(a, this.ec);
            this.ra.parentNode.removeChild(this.ra)
        }
    };

    function hc(a) {
        1 > a.ja.c ? a.ja.c += a.ja.step : 1 < a.ja.c && (a.ja.c = 1)
    }

    function ic(a) {
        a = a.ka;
        if (!0 !== a.Db) {
            a.Ba++;
            var b = a.ma * Math.exp(-a.ad * a.Ba) * Math.cos(a.Za * a.Ba + a.ma),
                c = b;
            0 > b && (c *= -1);
            0.001 >= c && (b = 0, a.Db = !0);
            a.c = 1 + b
        }
    }

    function jc(a) {
        var b = a.c / 100;
        11 > b && (b = 11);
        b > a.c && (b = a.c);
        a.c -= b
    }

    function lc(a) {
        a.ra.addEventListener(a.Gc, function() {
            this.removeEventListener(a.Gc, arguments.callee, !1);
            "function" === typeof a.fd && a.fd();
            a.Rc = !0
        }, !1)
    }

    function mc(a, b, c) {
        a.save();
        a.fillStyle = "rgba(255, 255, 255, " + c + ")";
        a.font = "24px MyriadPro-Cond,Tahoma,Geneva,sans-serif";
        a.textAlign = "center";
        a.textBaseline = "middle";
        a.fillText("Click to Start Transfer Win...", b.xb, b.wb + 220);
        a.restore()
    }

    function nc(a, b, c, d) {
        for (var e = parseFloat(a.c / 100).toFixed(2).toString(), f = e.length - 1, h = (53 * f + 18) / 2, n, m = h; e[f];) {
            var g = "." === e[f] ? {
                x: 561,
                y: 0,
                a: 18,
                b: 75
            } : 0 <= e[f] && 10 > e[f] ? {
                x: 53 * e[f],
                y: 0,
                a: 53,
                b: 75
            } : !1;
            if (g) {
                m -= g.a;
                n = parseInt(d[f].l);
                var l = a,
                    k = m,
                    p = c,
                    t = b;
                n = 220 + p.ac + n;
                t.save();
                t.translate(p.xb, p.wb);
                t.scale(l.ka.c, l.ka.c);
                t.drawImage(l.Dc, g.x, g.y, g.a, g.b, k, n, g.a, g.b);
                t.restore()
            }
            f--
        }
        d = a.wd;
        e = 289 + c.ac;
        b.save();
        b.translate(c.xb, c.wb);
        b.scale(a.ka.c, a.ka.c);
        b.globalCompositeOperation = "lighten";
        b.fillStyle =
            "rgba(54,209,255, .5)";
        b.font = "54px MyriadPro-BoldCond,Tahoma,Geneva,sans-serif";
        b.textAlign = "left";
        b.textBaseline = "alphabetic";
        b.fillText(d, h, e);
        b.restore()
    }

    function oc(a, b) {
        function c() {
            var a = {
                xb: d.va / 2,
                wb: d.ua / 2,
                Jd: d.Xc.a / -2,
                ac: d.Xc.b / -2
            };
            gc(d, d.ra);
            if (e + h < b.d) {
                e = b.d;
                for (var l = 0; l < d.q.length; l++) pc(d.q[l])
            }
            k.forEach(function(a) {
                a.Lc++;
                a.l = a.ma * Math.cos(a.Za * a.Lc + a.ma)
            });
            m.clearRect(0, 0, n.width, n.height);
            if (!d.Rc) !0 === d.ka.Db && 1 === d.ja.c && (l = 1 - (b.d - f) / 1E3, 0 > l && (f = b.d, l = 1), mc(m, a, l));
            else if (d.c) jc(d), 0 === d.c && "function" === typeof d.nd && d.nd();
            else if (!g.pc) g.pc = b.d;
            else if (g.pc + g.ue < b.d && (l = (d.ra.style.opacity || 1) - g.c, d.ra.style.opacity = l, 0.05 >= l)) {
                "function" ===
                typeof d.Ic && d.Ic();
                return
            }
            d.ec = q(b, c, !1, 0);
            m.save();
            ic(d);
            hc(d);
            d.kd || !0 !== d.ka.Db || 1 !== d.ja.c || (lc(d), d.kd = !0);
            m.globalAlpha = d.ja.c;
            qc(d, m, a);
            nc(d, m, a, k);
            m.restore()
        }
        for (var d = a, e = b.d, f = b.d, h = 200, n = a.ra, m = n.getContext("2d"), g = {
                ue: 3E3,
                c: 0.01,
                pc: 0
            }, l = parseFloat(d.c / 100).toFixed(2).toString().length, k = [], p = 0; p < l; p++) k.push(new rc(0, k.length));
        c()
    }

    function qc(a, b, c) {
        for (var d = 0; d < a.q.length; d++) {
            var e = a.q[d];
            b.save();
            b.translate(c.xb, c.wb);
            b.scale(a.ka.c, a.ka.c);
            if (e.te) {
                var f = e;
                f.xa += 7E-4 * f.Wa;
                0.99 >= f.xa && -1 === f.Wa ? (f.xa = 0.99, f.Wa = 1) : 1.15 <= f.xa && 1 === f.Wa && (f.xa = 1.15, f.Wa = -1);
                b.scale(e.xa, e.xa)
            }
            var f = e.a / 2,
                h = e.b / 2;
            b.translate(c.Jd + e.x + f, c.ac + e.y + h);
            if (e.se) {
                var n = e;
                n.ya -= 0.06 * (Math.random() + 0.5 - 1);
                0.5 > n.ya ? n.ya = 0.5 : 0.9 < n.ya && (n.ya = 0.9);
                b.globalAlpha = e.ya
            }
            e.bd && (n = e, n.Qa += n.bd, 360 <= n.Qa && (n.Qa %= 360), b.rotate(e.Qa));
            b.drawImage(e.X, e.a * e.e, 0,
                e.a, e.b, -f, -h, e.a, e.b);
            b.restore()
        }
    }

    function sc(a) {
        var b = u;
        b && (b.w ? b.w : b.De)({
            Y: function(b) {
                b.addEventListener("progress", function(b) {
                    b.lengthComputable && (a.Yc = Math.ceil(b.loaded / b.total * 100))
                }, !1)
            },
            Z: function(b) {
                var d = {};
                try {
                    d = JSON.parse(b.responseText)
                } catch (e) {
                    throw Error("Can not convert the answer into JSON format!");
                }
                var f = 0,
                    h = 0,
                    n;
                for (n in d) d.hasOwnProperty(n) && (b = new Image, b.addEventListener("load", function() {
                    a.Nc = ++f === h
                }, !1), b.src = d[n], d[n] = b, f += 1);
                h = f;
                f = 0;
                a.q = d
            },
            method: "GET",
            url: a.Md
        })
    }

    function tc(a) {
        var b = s;

        function c() {
            if (h + d.Vd < b.d && d.q && d.Nc && d.J.Va === d.Sb.length - 1 && d.J.Ma >= d.J.Jc) {
                var a = d;
                a.Dc = a.q.digits;
                a.q = [new uc(141, 0, 533, 552, a.q.backRay, !0, 0.002, !0), new uc(123, 314, 183, 77, a.q.lChips, !1, !1, !1), new uc(522, 314, 183, 77, a.q.rChips, !1, !1, !1), new uc(0, 209, 130, 80, a.q.lStars, !1, !1, !1), new uc(700, 209, 130, 80, a.q.rStars, !1, !1, !1), new uc(278, 308, 269, 165, a.q.rouletteBack, !1, !1, !1), new uc(278, 308, 269, 165, a.q.rouletteNeon, !1, !1, !1), new uc(58, 124, 712, 286, a.q.fixBack, !1, !1, !1), new uc(64,
                    287, 45, 45, a.q.dice, !1, 0.01, !1), new uc(77, 302, 45, 45, a.q.dice, !1, -0.02, !1), new uc(719, 287, 45, 45, a.q.dice, !1, -0.01, !1), new uc(706, 302, 45, 45, a.q.dice, !1, 0.02, !1)];
                oc(d, b)
            } else {
                if (b.d > e + f) {
                    a = d;
                    if (a.L.length < a.Ud) {
                        var m = new vc(Math.random() * d.va, d.ua);
                        m.Hc = 10 * Math.floor(360 * Math.random() / 10);
                        m.O.y = -3 * Math.random() - 8;
                        m.O.x = 10 * Math.random() - 5;
                        m.size = 7;
                        m.mc = 0.97;
                        m.$b = 0.1;
                        a.L.push(m)
                    }
                    e = b.d
                }
                var a = d,
                    g = a.ra,
                    m = g.getContext("2d"),
                    l = [];
                gc(a, g);
                m.fillStyle = "rgba(0, 0, 0, .1)";
                m.fillRect(0, 0, a.va, a.ua);
                g = a.Yc / 100 *
                    a.va;
                m.save();
                m.beginPath();
                m.lineWidth = 3;
                m.strokeStyle = "#fff";
                m.moveTo(0, 2);
                m.lineTo(g, 2);
                m.stroke();
                m.closePath();
                m.restore();
                var g = a.va / 2,
                    k = a.ua / 2,
                    p = Math.floor(200 * Math.random() + 100);
                m.beginPath();
                m.save();
                p = m.createRadialGradient(g, k + (300 * Math.random() - 100), 0.1, g, k + (300 * Math.random() - 100), p);
                p.addColorStop(0.1, "rgba(255,255,255," + (0.5 * Math.random() + 0.5) + ")");
                p.addColorStop(0.8, "hsla(" + 10 * Math.floor(360 * Math.random() / 10) + ", 100%, 50%, " + (0.5 * Math.random() + 0.5) + ")");
                p.addColorStop(1, "hsla(" + 10 *
                    Math.floor(360 * Math.random() / 10) + ", 100%, 50%, 0.1)");
                m.textAlign = "center";
                m.textBaseline = "middle";
                a.J.Ma < a.J.Jc ? a.J.Ma += 2.5 : a.J.Va < a.Sb.length - 1 && (a.J.Ma = 1, a.J.Va += 1);
                m.font = parseInt(a.J.Ma) + "px MyriadPro-BoldCond,Tahoma,Geneva,sans-serif";
                m.fillStyle = p;
                m.fillText(a.Sb[a.J.Va], g, k);
                m.restore();
                m.closePath();
                for (g = 0; g < a.L.length; g++)
                    if (a.L[g].update(), a.L[g].ic(m), k = a.L[g].u.y < 2 * a.ua / 3 ? 1 >= 100 * Math.random() : !1, a.L[g].u.y < a.ua / 5 || 0 <= a.L[g].O.y || k || 0 >= a.L[g].u.x || a.L[g].u.x > a.va) {
                        for (var k = a.L[g], p =
                                10 * Math.random() + 80, t = [], w = 0; w < p; w++) {
                            var z = new wc(k.u),
                                H = Math.random() * Math.PI * 2,
                                C = Math.cos(Math.random() * Math.PI / 2) * (Math.floor(6 * Math.random()) + 15);
                            z.O.x = Math.cos(H) * C;
                            z.O.y = Math.sin(H) * C;
                            z.size = 6;
                            z.$b = 0.05;
                            z.jc = 0.91;
                            z.mc = 0.05 * Math.random() + 0.93;
                            z.Wb = !0;
                            z.color = k.Hc;
                            t.push(z)
                        }
                        a.$ = a.$.concat(t)
                    } else l.push(a.L[g]);
                a.L = l;
                l = [];
                for (g = 0; g < a.$.length; g++) a.$[g].update(), 0.1 <= a.$[g].alpha && 1 <= a.$[g].size && (a.$[g].ic(m), l.push(a.$[g]));
                for (a.$ = l; a.$.length > a.Td;) a.$.shift();
                d.ec = q(b, c, !1, 0)
            }
        }
        var d = a,
            e =
            0,
            f = 800,
            h = b.d;
        c()
    }

    function gc(a, b, c) {
        c || (c = document.getElementById("gameSection"));
        var d = c.offsetWidth;
        c = c.offsetHeight;
        a.va !== d && (b.width = a.va = d);
        a.ua !== c && (b.height = a.ua = c)
    }

    function rc(a, b) {
        this.l = 0;
        this.Lc = 4 * b
    }
    rc.prototype = {
        ma: 5,
        Za: 0.15
    };

    function uc(a, b, c, d, e, f, h, n) {
        this.x = a;
        this.y = b;
        this.a = c;
        this.b = d;
        this.X = e;
        this.e = 0;
        this.se = f;
        this.bd = h;
        this.te = n;
        this.Qa = this.ya = 0;
        this.Wa = this.xa = 1;
        this.Bc = this.X.width / this.a
    }
    uc.prototype = {};

    function pc(a) {
        1 < a.Bc && (a.e += 1, a.e >= a.Bc && (a.e = 0))
    }

    function wc(a) {
        this.u = {
            x: a ? a.x : 0,
            y: a ? a.y : 0
        };
        this.O = {
            x: 0,
            y: 0
        };
        this.mc = 1.5;
        this.size = 2;
        this.jc = 1;
        this.$b = 0;
        this.Wb = !1;
        this.alpha = 1;
        this.color = this.Ad = 0
    }
    wc.prototype.update = function() {
        this.O.x *= this.jc;
        this.O.y *= this.jc;
        this.O.y += this.$b;
        this.u.x += this.O.x;
        this.u.y += this.O.y;
        this.size *= this.mc;
        this.alpha -= this.Ad
    };
    wc.prototype.ic = function(a) {
        if (0.1 <= this.alpha && 1 <= this.size) {
            a.save();
            a.globalAlpha = 0.7 * Math.random() + 0.3;
            a.globalCompositeOperation = "lighter";
            var b = this.u.x,
                c = this.u.y,
                b = a.createRadialGradient(b, c, 0.1, b, c, this.size / 2);
            b.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
            b.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
            b.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");
            a.fillStyle = b;
            a.beginPath();
            a.arc(this.u.x, this.u.y, this.Wb ? Math.random() * this.size : this.size, 0, 2 * Math.PI,
                !0);
            a.closePath();
            a.fill();
            a.restore()
        }
    };

    function vc(a, b) {
        wc.apply(this, [{
            x: a,
            y: b
        }]);
        this.Hc = 0
    }
    vc.prototype = new wc;
    vc.prototype.ic = function(a) {
        if (0.1 <= this.alpha && 1 <= this.size) {
            a.save();
            a.globalCompositeOperation = "lighter";
            var b = this.u.x,
                c = this.u.y,
                b = a.createRadialGradient(b, c, 0.1, b, c, this.size / 2);
            b.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
            b.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");
            a.fillStyle = b;
            a.beginPath();
            a.arc(this.u.x, this.u.y, this.Wb ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, 2 * Math.PI, !0);
            a.closePath();
            a.fill();
            a.restore()
        }
    };

    function xc(a) {
        this.ia = "";
        this.mb = "casino";
        this.Pc = this.Oc = 0;
        this.bc = !1;
        this.cd = a;
        return this
    }
    xc.prototype = {
        ea: function(a) {
            if (0 !== this.ia.length || 0 !== a) this.ia += a
        },
        $d: function() {
            0 < this.ia.length && (this.ia = this.ia.substring(0, this.ia.length - 1))
        },
        ge: function() {
            this.bc && this.w(this.ia / 100, this.mb)
        },
        w: function(a, b) {
            "function" === typeof this.cd && this.cd(a, b)
        }
    };

    function yc(a) {
        var b = document.getElementById("clcInfWr");
        if (1 === b.nodeType) a && "block" !== b.style.display ? b.style.display = "block" : a || "none" === b.style.display || (b.style.display = "none");
        else throw Error("Element not found!");
    }

    function Ac(a) {
        "casino" === a.mb ? (document.getElementById("clcTrToCs").className = "actTr", document.getElementById("clcTrToAc").className = "") : "account" === a.mb && (document.getElementById("clcTrToCs").className = "", document.getElementById("clcTrToAc").className = "actTr")
    }

    function Bc(a) {
        var b = a.ia;
        if (3 > b.length)
            for (var c = 3 - b.length; 0 < c; c--) b = "0" + b;
        for (c = 1; 9 >= c; c++) {
            var d = document.getElementById("clcD" + c);
            d.className = "clcDspDgt";
            var e = b[b.length - c];
            "undefined" !== typeof e && (d.className += " clcDN" + e)
        }
        b = parseInt(a.ia);
        c = document.getElementById("clcOkBtn").classList;
        b && !c.contains("clcOkAct") ? (c.add("clcOkAct"), a.bc = !0) : !b && c.contains("clcOkAct") && (c.remove("clcOkAct"), a.bc = !1)
    }

    function Cc() {
        for (var a = Dc.click, b = Ec, c = [{
                id: "clcBtn1",
                c: 1,
                h: b.ea
            }, {
                id: "clcBtn2",
                c: 2,
                h: b.ea
            }, {
                id: "clcBtn3",
                c: 3,
                h: b.ea
            }, {
                id: "clcBtnDel",
                c: "",
                h: b.$d
            }, {
                id: "clcBtn4",
                c: 4,
                h: b.ea
            }, {
                id: "clcBtn5",
                c: 5,
                h: b.ea
            }, {
                id: "clcBtn6",
                c: 6,
                h: b.ea
            }, {
                id: "clcBtn0",
                c: 0,
                h: b.ea
            }, {
                id: "clcBtn7",
                c: 7,
                h: b.ea
            }, {
                id: "clcBtn8",
                c: 8,
                h: b.ea
            }, {
                id: "clcBtn9",
                c: 9,
                h: b.ea
            }, {
                id: "clcOkBtn",
                c: "OK",
                h: b.ge
            }], d = 0; d < c.length; d++) {
            var e = c[d];
            document.getElementById(e.id).addEventListener(a, function(a) {
                return function() {
                    a.h.call(b, a.c);
                    Bc(b)
                }
            }(e), !1)
        }
    }

    function Fc() {
        for (var a = Dc.click, b = Ec, c = [{
                id: "clcTrToCs",
                dir: "casino"
            }, {
                id: "clcTrToAc",
                dir: "account"
            }], d = 0; d < c.length; d++) {
            var e = c[d];
            document.getElementById(e.id).addEventListener(a, function(a) {
                return function() {
                    b.mb = a;
                    Ac(b)
                }
            }(e.dir), !1)
        }
    };

    function Gc() {
        this.Uc = "brPHid";
        this.Ua = "swipeUse";
        var a = window.navigator.userAgent.toLowerCase();
        this.Qb = "iOS" === (/(iphone|ipod|ipad) os ([8-9]|10|11|12|13_\d_\d)/.test(a) ? "iOS" : /android/.test(a) ? "android" : "") ? this.Kd : !1
    }
    Gc.prototype = {
        Kd: function() {
            return 90 === Math.abs(window.orientation) && 7 <= Math.abs(document.body.offsetHeight - window.innerHeight) ? !0 : !1
        }
    };

    function Hc(a, b, c) {
        b = b.classList;
        c && !b.contains(a.Ua) ? b.add(a.Ua) : !c && b.contains(a.Ua) && b.remove(a.Ua)
    }

    function Ic() {
        var a = Jc,
            b;
        b = document.getElementById(a.Uc);
        b || (b = document.createElement("div"), b.id = a.Uc, document.body.appendChild(b));
        a.Qb() ? b.classList.contains(a.Ua) || Hc(a, b, !0) : b.classList.contains(a.Ua) && (window.scrollTo(0, 0), document.body.scrollTop = 0, Hc(a, b, !1))
    };
    /* ----------------------------------------------------------
     * 12. Translations (Kc, Qb, B, Sb, Tb)
     *     English UI strings for all 28 games
     * ---------------------------------------------------------- */
    var Kc = {
        en: {
            langName: "English",
            BookOfWinners: "Book of Winners",
            CasinoAndStars: "Casino and Stars",
            CasinoWorld: "Casino World",
            FireFrenzy: "Fire Frenzy",
            FireRage: "Fire Rage",
            Hearts: "Hearts",
            IceLegend: "Ice Legend",
            KingOfJewels: "King of Jewels",
            MagicSecret: "Magic Secret",
            PiratesFortune: "Pirates Fortune",
            RiddleOfTheSphinx: "Riddle of the Sphinx",
            Robinson: "Robinson",
            RollOfRamses: "Roll of Ramses",
            SavannaQueen: "Savanna Queen",
            ScatterWins: "Scatter Wins",
            SevensOnFire: "Sevens on Fire",
            SnowWhite: "Snow White",
            TripleDiamond: "Triple Diamond",
            TropicalFruit: "Tropical Fruit",
            UltraSevenHot: "Ultra Seven Hot",
            GatesOfAvalon: "Gates of Avalon",
            Money: "Money",
            Mariner: "Mariner",
            LuckyLadyGlamor: "Lucky Lady Glamor",
            Nautilus: "Nautilus",
            Bananas: "Bananas",
            CrazyBarmen: "Crazy Barmen",
            GoldenHarvest: "Golden Harvest",
            RichFruits: "RichFruits",
            menu: "MENU",
            help: "HELP",
            topJP: "JACKPOT",
            topBon: "BONUS",
            infoWelcome: "Welcome!!!",
            elTicket: "E-Ticket",
            win: "WIN",
            bet: "BET",
            credit: "CREDIT",
            credits: "CREDITS",
            insurance: "INSURANCE",
            gamble: "GAMBLE",
            maxBet: "MAXBET",
            auto: "AUTO",
            betOnLine: "BET ON PAYLINE",
            lines: "PAYLINES",
            denTop: "1 CREDIT=",
            denom: "DENOMINATION",
            transCash: "CASH TRANSFER",
            powBy: "",
            lang: "LANGUAGE",
            welcomeMessage: "{white}Welcome! {white}Enjoy our games. {magenta}Good Luck!",
            loadPrepare: "Preparing to load the files...",
            loadGraphDataLoad: "Loading of image files",
            initialization: "Initialization...",
            yes: "Yes",
            no: "No",
            loadingAudio: "Loading of audio...",
            doubleOrCollect: "TAKE YOUR WIN OR TRY TO DOUBLE IT!",
            drawingComplete: "DRAWING COMPLETED! PLACE YOUR BETS!",
            chargeExtra: "Additionally credited",
            selectLines: "SELECT LINES",
            selectBets: "SELECT BETS",
            company: "",
            soundLoadError: "Sounds loading error. Repeat action?",
            requestError: "Error of data sending. Repeat action?",
            unknownSid: "Unknown session id. Game will be reloaded in 5 seconds.",
            takeWin: "TAKE WIN",
            spin: "SPIN",
            start: "START",
            stop: "STOP",
            reload: "Reload",
            askActSound: "Would you like to turn on the sounds?",
            ios8Problem: "Audio is not supported by IOS 8. Game is available without sounds.",
            ok: "Ok",
            gmbAmnt: "AMOUNT",
            gmbWin: "COLOR GAMBLE",
            gmbWinSuit: "SUIT GAMBLE",
            prevCards: "PREVIOUS CARDS",
            red: "RED",
            black: "BLACK",
            seltd: "SELECTED",
            winMoreFG: "YOU WON MORE",
            freeGames: "FREE GAMES",
            featureWin: "WIN",
            played: "PLAYED",
            spExSym: "WITH SPECIAL EXTRA SYMBOL",
            minScatters: "for 3 or more symbols",
            min3Scatters: "for 3 symbols",
            subsFor: "SUBSTITUTION OF ALL SYMBOLS",
            prizeMlt: "Prize multiplied",
            mltpr: "Multiplier",
            mltprX3: "with win multiplier",
            subsWithSym: 'with <span class="subSym123"></span> substituting',
            robSymDesc: "Symbol will be substitute for all symbols except for scatter symbol",
            fridaySymDesc: "Substitutes for all symbols during the <span>free spin feature</span> except for the scatter symbol",
            pyramidSymDesc: "Substitutes for all symbols during free games",
            respin: "Respin",
            diamSymDesc: "Substitutes for all symbols",
            gameError: "Unknown error. Game will be reloaded.",
            retToGame: "BACK TO GAME",
            waitSec: "Wait...",
            inCas: "IN CASINO",
            inAcc: "IN ACCOUNT",
            balance: "BALANCE",
            trCsh: "CASH TRANSFER",
            payTbl: "PAYOUT TABLE",
            snd: "SOUNDS",
            gameSets: "GAME SETTINGS",
            gmSnd: "SOUND",
            sndOn: "on",
            sndOff: "off",
            extraStage: "EXTRA STAGE",
            clear: "SCRATCH OFF",
            freeDrawingComplete: "Drawing completed!",
            visualizations: "Visualizations",
            freeDraw: "Continue drawing.",
            visualizationsShowed: "visualizations shown",
            back: "BACK",
            next: "NEXT",
            choose: "CHOOSE",
            tckSeries: "SERIES",
            slots: "VIDEO SLOTS",
            tables: "TABLE GAMES",
            lotto: "SHORT SLOTS",
            getGames: "Getting of game list...",
            playNow: "PLAY NOW!",
            play: "PLAY",
            insCode: "Enter code:",
            noPrivateMode: "Please disable a private mode of browser.",
            sendReqError: "Data sending error. Please repeat...",
            wrongSymbols: "Wrong symbols used",
            longCode: "Code is too long, check it.",
            shortCode: "Code is too short, check it",
            scatter: "SCATTER",
            page: "Page",
            creditsWon: "CREDITS WON",
            congratulations: "CONGRATULATIONS! YOU WON JACKPOT"
        }
    };

    /* ----------------------------------------------------------
     * 13. API response parser (Lc) – extracts settings, win_table,
     *     bars, credit, jackpot, bonus from server JSON response
     * ---------------------------------------------------------- */
    function Lc(a) {
        var b;
        if (a.responseText)
            if ("object" !== typeof a.responseText) try {
                b = JSON.parse(a.responseText)
            } catch (c) {
                throw Error("Can not convert the answer into JSON format!");
            } else b = a.responseText;
            else throw Error("No expected data in answer, or wrong answer.");
        a = b;
        b = [];
        "string" === typeof a ? b.push({
            id: -1,
            text: a
        }) : "object" === typeof a && "object" === typeof a.error && b.push(a.error);
        var d;
        d = a && a.redirect ? !0 : !1;
        if (!d) {
            if ("object" === typeof a.result && "object" === typeof a.result[0]) {
                var e = a.result[0];
                d = e.info;
                e.error && b.push(e.error);
                "undefined" !== typeof d && "undefined" !== typeof d.denominations && (Mc = d.denominations);
                if (e.data && "object" === typeof e.data) {
                    e = e.data;
                    if (null != e.settings) {
                        var f = e.settings,
                            h = f.max_bet;
                        Nc = f.min_bet;
                        Oc = h;
                        h = f.max_lines;
                        Pc = f.min_lines;
                        Qc = h
                    }
                    if (null != e.win_table) {
                        h = e.win_table;
                        f = document.getElementById("optPanPTTabCont");
                        f.innerHTML = "";
                        var h = Rc(h).Eb,
                            n = 0,
                            m = [{
                                X: r[5],
                                wa: {
                                    2: Sc,
                                    3: Tc,
                                    4: Uc,
                                    5: Vc
                                },
                                qa: !1
                            }, {
                                X: r[6],
                                wa: {
                                    2: Wc,
                                    3: Xc,
                                    4: Uc,
                                    5: Yc
                                },
                                qa: !1
                            }, {
                                X: r[7],
                                wa: {
                                    2: Wc,
                                    3: Zc,
                                    4: Uc,
                                    5: Yc
                                },
                                qa: !1
                            }, {
                                X: r[8],
                                wa: {
                                    2: Xc,
                                    3: Tc,
                                    4: Uc,
                                    5: Yc
                                },
                                qa: !1
                            }, {
                                X: r[9],
                                wa: {
                                    3: Zc,
                                    4: Uc,
                                    5: $c
                                },
                                qa: !1
                            }, {
                                X: r[10],
                                wa: {
                                    3: ad,
                                    4: Uc,
                                    5: $c
                                },
                                qa: !1
                            }, {
                                X: r[11],
                                wa: {
                                    2: Tc,
                                    3: Wc,
                                    4: Uc,
                                    5: $c
                                },
                                qa: !1
                            }, {
                                X: r[12],
                                wa: {
                                    3: Sc,
                                    4: Uc,
                                    5: Vc
                                },
                                qa: !1
                            }];
                        E = {};
                        for (var g in h)
                            if (h.hasOwnProperty(g)) {
                                var l = m[n];
                                if (!l) break;
                                E[g] = new Wa(l.X, h[g].win, l.wa, h[g].scatter || !1, h[g].jocker || !1, h[g].jokerFree || !1, l.qa);
                                var k = E[g],
                                    p = g,
                                    t = F,
                                    l = "optPanPTTabCont",
                                    w = document.createElement("div");
                                w.className = "payTableItem payTblSym" + p + (k.cb ? " scatterSym" : "") + (k.Qd ? " jokerSym" : "") + (k.Rd ? " jokerFreeSym" :
                                    "");
                                w.innerHTML = '<div class="pTIWr"><div class="pTILS"><div class="pTIImg"></div><div class="pTIFrame"></div></div><div class="pTIRS"><div class="pTITable"></div></div></div>';
                                if (p = w.getElementsByClassName("pTIImg")[0]) {
                                    var z = k,
                                        H = document.createElement("img");
                                    H.src = z.yb.src;
                                    p.appendChild(H)
                                }
                                k.lb = w.getElementsByClassName("pTITable")[0];
                                Xa(k, t);
                                if (k.cb) {
                                    if (k = w.getElementsByClassName("pTIWr")[0]) t = document.createElement("div"), t.className = "pTIAddInfo", k.appendChild(t);
                                    if (k = w.getElementsByClassName("pTILS")[0]) t =
                                        document.createElement("div"), t.className = "pTIScrStr", t.innerHTML = "<span>" + B("scatter") + "</span>", k.appendChild(t)
                                }(l = document.getElementById(l)) && l.appendChild(w);
                                E[g].cb && "function" === typeof bd.Id && bd.Id();
                                n++
                            }
                        "ontouchstart" in window && (g = document.createElement("div"), g.id = "optPanPTScroll", f.appendChild(g))
                    }
                    if ("undefined" !== typeof e.bars) {
                        g = e.bars;
                        f = e.bars_free || !1;
                        G = [];
                        var h = 0,
                            n = bd.ye || 0,
                            C;
                        for (C in g) g.hasOwnProperty(C) && (m = Rc(g[C]).nc, l = !1, f && (l = Rc(f[C]).nc), m = new Za({
                                x: 0 + 162 * h,
                                y: n,
                                a: 148,
                                b: 444
                            },
                            m, l, 148, 1.776), G.push(m), h++)
                    }
                    "undefined" !== typeof e.last ? cd(e.last, !0) : cd(e, !1)
                }
                if ("undefined" !== typeof d && d && ("undefined" !== typeof d.jackpot && "undefined" !== typeof d.bonus && (g = d.jackpot, f = d.min_bet_jackpot, C = d.bonus, e = d.min_bet_bonus, 0 === dd.length && (dd[0] = new Nb(g, "jpCount", "jp"), dd[1] = new Nb(C, "bonCount", "bonus"), ed()), h = dd[0], h.hc = g, h.ub(), dd[0].gc = f || 0, g = dd[1], g.hc = C, g.ub(), dd[1].gc = e || 0), "undefined" !== typeof d.jackpot_win && (fd = d.jackpot_win), "undefined" !== typeof d.currency && (I = d.currency), "undefined" !==
                        typeof d.credit && (gd = d.credit, C = hd(), A(id, J(C), !1), A(jd, C, !0, I)), "undefined" !== typeof d.insurance && (kd = C = d.insurance, A(ld, J(C), !1), A(md, C, !0, I)), "undefined" !== typeof d.messages)) {
                    d = d.messages;
                    for (var qa in d)
                        if (d.hasOwnProperty(qa) && (C = d[qa], e = nd, C.id)) {
                            g = C.id;
                            g in e.Ea && delete e.Ea[g];
                            f = e.Ea;
                            h = 1E3 * C.repeat || 1;
                            n = void 0;
                            if (n = C.text || "") {
                                n = n.split("{");
                                m = "";
                                for (l = 0; l < n.length; l++)
                                    if ("" !== n[l]) {
                                        w = n[l].split("}");
                                        m += "<span ";
                                        if (-1 < w[0].indexOf("blink")) {
                                            z = e;
                                            k = w[0];
                                            k = k.replace("blink(", "");
                                            k = k.replace(")",
                                                "");
                                            p = k.split(",");
                                            t = [];
                                            for (H = k = 0; H < p.length; H++) {
                                                var ha = p[H];
                                                ha - 0 == ha && 0 < ("" + ha).trim().length ? (t.push({
                                                    Ja: +ha
                                                }), k += +ha) : (t.push({
                                                    Rb: ha,
                                                    re: +p[++H]
                                                }), k += +p[H])
                                            }
                                            p = "ba" + Math.random().toString(36).substr(2, 5);
                                            z = "@" + z.vb.Sc + "keyframes " + p + " { ";
                                            for (ha = H = 0; H < t.length; H++) {
                                                var $a = t[H],
                                                    kc = ha,
                                                    ha = ha + 100 / (k / ($a.re || $a.Ja));
                                                "undefined" === typeof $a.Ja ? (z += "" + Math.round(kc) + "%{color: " + $a.Rb + ";}", z += "" + Math.round(ha - 1) + "%{color: " + $a.Rb + ";}") : z += "100%{color: " + t[H - 1].Rb + ";}"
                                            }
                                            t = z += "}";
                                            (z = document.getElementsByTagName("style")[0]) ?
                                            z.innerHTML += t: (z = document.createElement("style"), z.innerHTML = t, document.getElementsByTagName("head")[0].appendChild(z));
                                            m += 'style="animation: ' + (p + " " + k + "ms linear infinite") + ';">'
                                        } else m += 'style="color:' + w[0] + "; text-shadow: 0 0 2px " + w[0] + '">';
                                        m += w[1] + "</span>"
                                    } n = m
                            } else n = "";
                            f[g] = {
                                repeat: h,
                                text: n,
                                stop: C.stop ? e.v.d + 1E3 * C.stop : e.v.d,
                                start: C.start ? e.v.d + 1E3 * C.start : e.v.d,
                                o: C.active,
                                type: C.type,
                                id: C.id
                            }
                        } mb(nd)
                }
            }
            Ec && "undefined" !== typeof a.userBalance && "undefined" !== typeof a.championBalance && (Ec.Oc =
                a.userBalance, Ec.Pc = a.championBalance, qa = Ec, a = document.getElementById("clcInCasVal"), document.getElementById("clcInAccVal").innerHTML = qa.Oc || 0, a.innerHTML = qa.Pc || 0);
            if (b.length) a: {
                for (qa = 0; qa < b.length; qa++)
                    if ("unknown sid" === b[qa].text) {
                        pd();
                        qd.show(B("unknownSid"), {
                            na: B("reload"),
                            h: rd
                        });
                        q(s, rd, !1, 5E3);
                        break a
                    } throw Error(JSON.stringify(b));
            }
        }
    }

    function cd(a, b) {
        if ("undefined" !== typeof a.state) {
            var c = a.state;
            K != c && (K = c)
        }
        "undefined" !== typeof a.bonus_symbol && (sd = a.bonus_symbol);
        "undefined" !== typeof a.free_count && (td = a.free_count);
        "undefined" !== typeof a.free_played && (ud = a.free_played);
        if ("undefined" !== typeof a.symbols) {
            var c = a.symbols,
                c = Rc(c).Eb,
                d;
            for (d in c)
                if (c.hasOwnProperty(d)) {
                    var e = vd(c[d]),
                        f = G[d - 1];
                    f.la = e;
                    f.ta = c[d].pos - 1
                } if (b)
                for (d = 0; d < G.length; d++) c = G[d], wd(c), ab(c), c.C.length = 5, c.S = bb(c.ta - 5, c.s.length), c.K = 5, cb(c)
        }
        "undefined" !== typeof a.lines &&
            xd(a.lines);
        "undefined" !== typeof a.den && yd(a.den);
        "undefined" !== typeof a.bet && zd(a.bet / L);
        "undefined" !== typeof a.card && (Ad = a.card);
        "undefined" !== typeof a["double"] && (d = a["double"], "undefined" !== typeof d.step && (Bd = d.step));
        "undefined" !== typeof a.double_hist && (Cd = a.double_hist);
        "undefined" !== typeof a.win && (d = a.win, K === Dd ? (Ed = d, M = 0) : M = d);
        "undefined" !== typeof a.log && Fd(a.log)
    };

    function Gd() {
        id = new y(function() {
            return document.getElementById("creditBlock").getElementsByClassName("fieldCount")[0]
        });
        jd = new y(function() {
            return document.getElementById("creditBlock").getElementsByClassName("fieldRealCount")[0]
        });
        ld = new y(function() {
            return document.getElementById("insBlock").getElementsByClassName("fieldCount")[0]
        });
        md = new y(function() {
            return document.getElementById("insBlock").getElementsByClassName("fieldRealCount")[0]
        });
        Hd = new y(function() {
            return document.getElementById("betBlock").getElementsByClassName("wbCountSp")[0]
        });
        Id = new y(function() {
            return document.getElementById("betBlock").getElementsByClassName("fieldRealCount")[0]
        });
        Jd = new y(function() {
            return document.getElementById("plLnsCnt")
        });
        Kd = new y(function() {
            return document.getElementById("winBlock").getElementsByClassName("wbCountSp")[0]
        });
        Ld = new y(function() {
            return document.getElementById("winBlock").getElementsByClassName("fieldRealCount")[0]
        });
        Md = new y(function() {
            return document.getElementById("gmbACnt")
        });
        Nd = new y(function() {
            return document.getElementById("gmbWCnt")
        });
        Od = new y(function() {
            return document.getElementById("gmbWX2Cnt")
        });
        Pd = new y(function() {
            return document.getElementById("bSLineCnt")
        });
        Qd = new y(function() {
            return document.getElementById("bSBOL")
        });
        Rd = new y(function() {
            return document.getElementById("bSBOLReal")
        });
        Sd = new y(function() {
            return document.getElementById("bSBOLCur")
        });
        Td = new y(function() {
            return document.getElementById("bSDenReal")
        });
        Ud = new y(function() {
            return document.getElementById("bSDenCur")
        })
    }
    var id, jd, ld, md, Hd, Id, Jd, Kd, Ld, Md, Nd, Od, Pd, Qd, Rd, Sd, Td, Ud;
    var Vd = [];

    function N(a, b, c) {
        this.f = document.getElementById(b);
        this.Q = document.getElementById(c);
        this.Nb = this.o = !1;
        this.name = a;
        this.Da = !1;
        Vd.push(this)
    }
    N.prototype = {
        m: function() {
            return Wd()
        }
    };

    function Xd(a) {
        a.o = !1;
        a.Q && (a.Q.className = "disabled")
    }

    function Yd(a) {
        a.o = !0;
        a.Q && (a.Q.className = "active")
    }

    function O(a, b) {
        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
    }
    var P = new N("spin", "spinBtnStr", "spinBtn");
    O(P, {
        Da: 32,
        $a: 1,
        Na: 2,
        Yb: 3,
        ab: 4,
        Zb: 5,
        Xb: 6,
        I: 1,
        je: function() {
            P.Ra(B("spin"));
            P.I = P.$a
        },
        me: function() {
            P.Ra(B("takeWin"));
            P.I = P.Na
        },
        ke: function() {
            P.Ra(B("start"));
            P.I = P.Yb
        },
        le: function() {
            P.Ra(B("stop"));
            P.I = P.ab
        },
        ne: function() {
            P.Ra(B("takeWin"));
            P.I = P.Zb
        },
        ie: function() {
            P.Ra(B("start"));
            P.I = P.Xb
        },
        Ia: function(a) {
            switch (a) {
                case P.$a:
                    P.je();
                    break;
                case P.Na:
                    P.me();
                    break;
                case P.Yb:
                    P.ke();
                    break;
                case P.ab:
                    P.le();
                    break;
                case P.Zb:
                    P.ne();
                    break;
                case P.Xb:
                    P.ie()
            }
        },
        Ra: function(a) {
            document.getElementById("spinBtnStr").innerHTML =
                a.toUpperCase()
        },
        k: function() {
            if (P.I === P.$a) {
                Zd();
                Q();
                var a;
                a = hd();
                if ($d() > a) {
                    var b;
                    b: {
                        b = R;
                        for (var c = ae.length - 1; 0 <= c; c--)
                            if (ae[c] * b * L <= a) {
                                zd(ae[c]);
                                b = !0;
                                break b
                            } zd(Nc);b = !1
                    }
                    if (!1 === b && (b = J(hd()), b >= Pc ? (xd(b), b = !0) : (xd(Pc), b = !1), !b)) b: for (b = Nc * Pc, c = be(); 0 <= c; c--) {
                        var d = Mc[c];
                        if (b * d <= a) {
                            yd(d);
                            break b
                        }
                    }
                    ce();
                    a = !1
                } else a = !0;
                if (!1 !== a) {
                    K != de && (K = de);
                    for (a = 0; a < G.length; a++) b = G[a], b.H(), wd(b), b.state = 1;
                    Bd = 0;
                    ee();
                    fe();
                    ge();
                    he("");
                    x(ie)
                }
            } else if (P.I === P.Na) je();
            else if (P.I === P.Yb) ke();
            else if (P.I === P.ab) {
                for (a =
                    0; a < G.length; a++) G[a].Sa = !0;
                Xd(P)
            } else P.I === P.Zb ? le.Je() : P.I === P.Xb && me()
        },
        m: function() {
            return P.I === P.Na ? 0 < M && 10 !== ne : Wd()
        }
    });
    var oe = new N("maxBet", "maxBetStr", "maxBetBtn");
    O(oe, {
        Da: 77,
        k: function() {
            oe.o && pe()
        }
    });
    var qe = new N("auto", "autoStr", "autoBtn");
    O(qe, {
        Da: 65,
        k: function() {
            qe.o && (re = !re, !0 === re ? (x(S), P.k()) : Xd(qe), qe.uc(re))
        },
        Tb: function() {
            re = !1;
            qe.uc(re)
        },
        uc: function(a) {
            if (this.f) {
                var b = this.f.classList;
                a && !b.contains("autoOn") ? b.add("autoOn") : !a && b.contains("autoOn") && b.remove("autoOn")
            }
        },
        m: function() {
            return (re || !re && qe.Pd() && K === Dd && 0 === M) && (!T || !oa(T))
        },
        Pd: function() {
            return F * L * R * 2 <= gd
        }
    });
    var se = new N("gamble", "gambleStr", "gambleBtn");
    O(se, {
        Da: 71,
        k: function() {
            se.o && (xb(), x(S), te())
        },
        $c: function(a) {
            var b = se.Q;
            if (b && 1 === b.nodeType) {
                se.dd || (se.dd = b.parentNode);
                var c = se.dd;
                "playBtns" !== b.parentNode.id && "landscape" === a ? (a = document.getElementById("playBtns"), b.parentNode.removeChild(b), a.insertBefore(b, a.lastChild)) : b.parentNode.id !== c && "portrait" === a && (b.parentNode.removeChild(b), c.insertBefore(b, c.lastChild))
            }
        },
        m: function() {
            return K === de && 0 < M && !1 === re && 5 > Bd
        }
    });
    var ue = new N("helpOpen", "helpBtnStrWr", "helpBtnStrWr");
    O(ue, {
        Da: 79,
        k: function() {
            ue.o && (xb(), x(S), ve())
        },
        m: function() {
            return K === Dd && 0 === M && (!T || !oa(T))
        }
    });
    var we = new N("optClose", "optPanClsBtnStr", "optPanClsBtn");
    O(we, {
        Da: 79,
        k: function() {
            we.o && (xb(), x(S), xe())
        },
        m: function() {
            return T && oa(T)
        }
    });
    var ye = new N("menuBtn", "menuBtnStr", "menuBtn");
    O(ye, {
        Nb: !0,
        k: function() {
            function a() {
                v && "function" === typeof Ab && Ab();
                setTimeout(function() {
                    pa(ze);
                    Ae(B("waitSec"));
                    rd()
                }, 500)
            }
            xb();
            ob ? x(S, a) : a()
        },
        m: function() {
            return !0
        }
    });
    var Be = new N("gmbChsRCStrWr", "gmbChsRCStrWr", "gmbChsRC");
    O(Be, {
        k: function() {
            Be.o && (x(S), he(""), Be.t(!0), Ce({
                color: 1
            }))
        },
        t: function(a) {
            var b = Be.f.classList;
            a && !b.contains("sld") ? b.add("sld") : !a && b.contains("sld") && b.remove("sld")
        },
        m: function() {
            return K === De && 0 < M && 5 > Bd && D.sa
        }
    });
    var Ee = new N("gmbChsBCStrWr", "gmbChsBCStrWr", "gmbChsBC");
    O(Ee, {
        k: function() {
            Ee.o && (x(S), he(""), Ee.t(!0), Ce({
                color: 2
            }))
        },
        t: function(a) {
            var b = Ee.f.classList;
            a && !b.contains("sld") ? b.add("sld") : !a && b.contains("sld") && b.remove("sld")
        },
        m: function() {
            return K === De && 0 < M && 5 > Bd && D.sa
        }
    });
    var Fe = new N("smlBtnHrtsWr", "smlBtnHrtsWr", "smlBtnHrts");
    O(Fe, {
        k: function() {
            Fe.o && (x(S), he(""), Fe.t(!0), Ce({
                suit: 3
            }))
        },
        t: function(a) {
            if (null !== Fe.f) {
                var b = Fe.f.classList;
                a && !b.contains("sld") ? b.add("sld") : !a && b.contains("sld") && b.remove("sld")
            }
        },
        m: function() {
            return K === De && 0 < M && 5 > Bd && D.sa
        }
    });
    var Ge = new N("smlBtnDmndWr", "smlBtnDmndWr", "smlBtnDmnd");
    O(Ge, {
        k: function() {
            Ge.o && (x(S), he(""), Ge.t(!0), Ce({
                suit: 4
            }))
        },
        t: function(a) {
            if (null !== Ge.f) {
                var b = Ge.f.classList;
                a && !b.contains("sld") ? b.add("sld") : !a && b.contains("sld") && b.remove("sld")
            }
        },
        m: function() {
            return K === De && 0 < M && 5 > Bd && D.sa
        }
    });
    var He = new N("smlBtnClbsWr", "smlBtnClbsWr", "smlBtnClbs");
    O(He, {
        k: function() {
            He.o && (x(S), he(""), He.t(!0), Ce({
                suit: 2
            }))
        },
        t: function(a) {
            if (null !== He.f) {
                var b = He.f.classList;
                a && !b.contains("sld") ? b.add("sld") : !a && b.contains("sld") && b.remove("sld")
            }
        },
        m: function() {
            return K === De && 0 < M && 5 > Bd && D.sa
        }
    });
    var Ie = new N("smlBtnSpdsWr", "smlBtnSpdsWr", "smlBtnSpds");
    O(Ie, {
        k: function() {
            Ie.o && (x(S), he(""), Ie.t(!0), Ce({
                suit: 1
            }))
        },
        t: function(a) {
            if (null !== Ie.f) {
                var b = Ie.f.classList;
                a && !b.contains("sld") ? b.add("sld") : !a && b.contains("sld") && b.remove("sld")
            }
        },
        m: function() {
            return K === De && 0 < M && 5 > Bd && D.sa
        }
    });
    var Je = new N("bSLineMinStr", "bSLineMin", "bSLineMin");
    O(Je, {
        k: function() {
            Je.o && (x(S), R -= 1, R < Pc && (R = Qc), A(Pd, R, !1), Ke(), Zd(), Q(), Le(!0), Me = q(s, function() {
                Ne(R)
            }, !1, 5E3))
        },
        m: function() {
            return Oe()
        }
    });
    var Pe = new N("bSLinePlusStr", "bSLinePlus", "bSLinePlus");
    O(Pe, {
        k: function() {
            Pe.o && (x(S), R += 1, R > Qc && (R = Pc), A(Pd, R, !1), Ke(), Zd(), Q(), Le(!0), Me = q(s, function() {
                Ne(R)
            }, !1, 5E3))
        },
        m: function() {
            return Oe()
        }
    });
    var Qe = new N("bSBetMinStr", "bSBetMin", "bSBetMin");
    O(Qe, {
        k: function() {
            if (Qe.o) {
                x(S);
                var a = ae.indexOf(F); - 1 === a && (a = 0);
                a -= 1;
                0 > a && (a = ae.length - 1);
                (F = ae[a]) || (F = Oc || 1);
                A(Qd, F, !1);
                A(Rd, F * L, !0);
                A(Sd, I);
                Ke();
                Le(!1)
            }
        },
        m: function() {
            return Oe()
        }
    });
    var Re = new N("bSBetPlusStr", "bSBetPlus", "bSBetPlus");
    O(Re, {
        k: function() {
            if (Qe.o) {
                x(S);
                var a = ae.indexOf(F); - 1 === a && (a = 0);
                a += 1;
                a >= ae.length && (a = 0);
                (F = ae[a]) || (F = Nc || 1);
                A(Qd, F, !1);
                A(Rd, F * L, !0);
                A(Sd, I);
                Ke();
                Le(!1)
            }
        },
        m: function() {
            return Oe()
        }
    });
    var Se = new N("bSDenMinStr", "bSDenMin", "bSDenMin");
    O(Se, {
        k: function() {
            x(S);
            var a = be(),
                a = a - 1;
            0 > a && (a = Mc.length - 1);
            (L = Mc[a]) || (L = Mc[Mc.length - 1] || 1);
            A(Td, L, !0);
            A(Ud, I);
            A(Rd, F * L, !0);
            Te();
            Ke()
        },
        m: function() {
            return Oe()
        }
    });
    var Ue = new N("bSDenPlusStr", "bSDenPlus", "bSDenPlus");
    O(Ue, {
        k: function() {
            if (Ue.o) {
                x(S);
                var a = be(),
                    a = a + 1;
                a >= Mc.length && (a = 0);
                (L = Mc[a]) || (L = Mc[0] || 1);
                A(Td, L, !0);
                A(Ud, I);
                A(Rd, F * L, !0);
                Te();
                Ke()
            }
        },
        m: function() {
            return Oe()
        }
    });
    var Ve = new N("sndPnlSlider", "sndPnlSlider", "sndPnl");
    O(Ve, {
        Nb: !0,
        k: function() {
            Mb && (ob = !ob, We())
        },
        m: function() {
            return !0 === Mb && ob
        }
    });

    function Wd() {
        return K === Dd && gd >= Nc && (!T || !oa(T)) && 0 === M && !1 === re
    }

    function Oe() {
        return K === Dd && gd >= Nc && T && oa(T) && 0 === M && !1 === re
    }

    function Xe() {
        for (var a = 0; a < Vd.length; a++) !1 === Vd[a].Nb && Xd(Vd[a])
    }

    function ee() {
        for (var a = 0; a < Vd.length; a++) Vd[a].m() ? Yd(Vd[a]) : Xd(Vd[a])
    }

    function Ye(a, b) {
        "ontouchstart" in window ? b.f.addEventListener(a, function(a) {
            var d = a.timeStamp;
            if (d - Ze < $e) return a.preventDefault(), !1;
            Ze = d;
            b.k()
        }, !1) : b.f.addEventListener(a, b.k, !1)
    }

    function af() {
        for (var a = Dc, b = 0, c = Vd.length; b < c; b++) {
            var d = Vd[b];
            d.f && Ye(a.click, d)
        }
        window.addEventListener("keyup", function(a) {
            for (var b = a.keyCode || a.which, c = 0; Vd[c]; c++) {
                var d = Vd[c];
                if (d.Da === b && d.o) {
                    d.k();
                    a.preventDefault();
                    break
                }
            }
        }, !1)
    };
    var U = 0;

    /* ----------------------------------------------------------
     * 14. API call functions
     *     bf  = init          fe  = start (spin)
     *     gf  = start_free    hf  = close
     *     show_double, double, select_bonus_symbol
     * ---------------------------------------------------------- */
    function bf() {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        app: cf,
                        func: "init",
                        id: U
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                Lc(a);
                ef()
            },
            ga: function(a, b) {
                ff(b)
            }
        });
        U += 1
    }

    function fe() {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        app: cf,
                        func: "start",
                        id: U,
                        par: {
                            bet: F * L,
                            den: L,
                            lines: R
                        }
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                Lc(a);
                P.Ia(P.ab);
                Yd(P)
            },
            ga: function(a, b) {
                ff(b)
            }
        });
        U += 1
    }

    function gf() {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        app: cf,
                        func: "start_free",
                        id: U
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                Lc(a);
                P.Ia(P.ab);
                Yd(P);
                he('<span style="color: yellow;">' + ud + '</span><span style="color:red;">/</span><span style="color: yellow;">' + td + '</span> <span style="color: white;">' + B("freeGames") + " " + B("played") + "</span>")
            },
            ga: function(a, b) {
                ff(b)
            }
        });
        U += 1
    }

    function hf() {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        app: cf,
                        func: "close",
                        id: U
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                jf = !1;
                Lc(a)
            },
            ga: function(a, b) {
                ff(b)
            }
        });
        U += 1
    }

    function kf() {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        app: cf,
                        func: "show_double",
                        id: U
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                Lc(a);
                lf()
            },
            ga: function(a, b) {
                ff(b)
            }
        });
        U += 1
    }

    function mf(a) {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        app: cf,
                        func: "double",
                        id: U,
                        par: a
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                Lc(a);
                D.xc.className = "c" + Ad;
                ac(nf);
                Vb(D, s);
                $b(!0)
            },
            ga: function(a, c) {
                ff(c)
            }
        });
        U += 1
    }

    function me() {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        app: cf,
                        func: "select_bonus_symbol",
                        id: U
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                Lc(a)
            },
            ga: function(a, b) {
                ff(b)
            }
        });
        U += 1
    }

    function of() {
        u.w({
            method: "POST",
            url: localStorage.getItem("slnk"),
            ha: JSON.stringify({
                query: {
                    1: {
                        func: "info",
                        id: U
                    }
                },
                sid: localStorage.getItem("gsid")
            }),
            fa: function() {},
            Y: function() {
                df()
            },
            Z: function(a) {
                Lc(a)
            },
            ga: function() {}
        });
        U += 1
    }

    function pf(a, b) {
        Ec && (yc(!0), u.w({
            method: "GET",
            url: "/play/game_transfer/",
            ha: {
                type: a,
                amount: b
            },
            fa: function() {
                yc(!1)
            },
            Y: function() {
                df()
            },
            Z: function(a) {
                0 < b && (Lc(a), q(s, function() {
                    !1 === u.tb && of()
                }, !1, !1))
            },
            ga: function() {}
        }));
        U += 1
    }

    function qf(a) {
        u.w({
            method: "POST",
            url: "/play/api_error/",
            ha: {
                error: JSON.stringify({
                    appNum: rf,
                    message: a.Ce || "",
                    url: a.url || "",
                    line: a.Be,
                    device: navigator.userAgent.toString()
                })
            },
            fa: function() {},
            Y: function() {},
            Z: function() {},
            ga: function() {}
        })
    };

    function sf() {
        tf();
        /(iphone|ipod|ipad) os 8/.test(navigator.userAgent.toLowerCase()) && "standalone" in window.navigator && window.navigator.standalone ? (pd(), qd.show(B("ios8Problem"), {
            na: B("ok"),
            h: function() {
                uf()
            }
        })) : (pd(), qd.show(B("askActSound"), {
            na: B("yes"),
            h: function() {
                Ae(B("loadingAudio"));
                vf()
            }
        }, {
            na: B("no"),
            h: function() {
                uf()
            }
        }))
    }

    function wf() {
        ob = !0;
        var a = Dc;
        if (s && a) tb = a;
        else throw Error("Timer or device events not set");
        yb();
        xf = new v(V, 0.23, 0.19, !0, !1);
        S = new v(V, 1.16, 0.17, !0, !1);
        yf = new v(V, 2.1, 10, !0, !0);
        zf = new v(V, 12.95, 1.05, !0, !0);
        Af = new v(V, 14.77, 0.6, !0, !1);
        Bf = new v(V, 16, 0.74, !0, !1);
        Cf = new v(V, 17.5, 1.5, !0, !1);
        new v(V, 19.75, 0.9, !0, !1);
        Df = new v(V, 21.4, 10, !0, !0);
        new v(V, 32.25, 0.73, !0, !1);
        Tc = new v(V, 33.75, 0.8, !0, !1);
        Xc = new v(V, 35.33, 0.83, !0, !1);
        Zc = new v(V, 36.95, 1, !0, !1);
        ad = new v(V, 38.73, 1.1, !0, !1);
        Wc = new v(V, 40.58, 1.53, !0,
            !1);
        Sc = new v(V, 42.83, 1.2, !0, !1);
        Uc = new v(V, 44.75, 2, !0, !1);
        Vc = new v(V, 47.47, 3.47, !0, !1);
        $c = new v(V, 51.75, 3.75, !0, !1);
        Yc = new v(V, 56.3, 3.5, !0, !1);
        Ef = new v(V, 60.55, 0.2, !0, !1);
        ie = new v(V, 61.49, 9.95, !0, !0);
        Ff = new v(V, 72.18, 10, !0, !0);
        Gf = new v(V, 82.98, 18.4, !0, !1);
        Hf = new v(If, 0, 0.4, !1, !1);
        Mb = !0;
        uf()
    }

    function Jf() {
        pd();
        qd.show(B("soundLoadError"), {
            na: B("yes"),
            h: function() {
                Ae(B("loadingAudio"));
                vf()
            }
        }, {
            na: B("no"),
            h: function() {
                uf()
            }
        })
    }

    function uf() {
        var a = document.getElementById("wrapper");
        a && (a.style.visibility = "visible");
        Ae(B("initialization"));
        bd && "function" === typeof Kf && Kf();
        Lf();
        W.lc = new gb(148, 148);
        Mf();
        a = new na(!1, 0, 405, 826, 405, "px", 1, 1, 300);
        a.i = document.getElementById("gmbP");
        a.W = document.getElementById("gmbPBRsWr");
        Nf = a;
        X = !1;
        bf()
    }

    /* ----------------------------------------------------------
     * 15. Game-state & win/payline display (ef, lf, nf, ce, jg)
     * ---------------------------------------------------------- */
    function ef() {
        bd && "function" === typeof Of && Of();
        va(ze, function() {
            ze.Cb();
            Pf();
            Qf()
        });
        if (K === Dd || K === De) ud = td = 0, Rf = !1, Sf = 0, Tf = sd = !1, Ed = M;
        if (K === Uf && 0 < ud || K === de && 0 < td && td === ud) Vf(), Wf();
        Q();
        af();
        Xe();
        A(Kd, J(Ed), !1);
        A(Ld, Xf(Ed, !1) + I, !1);
        A(Hd, J($d()), !1);
        A(Id, Xf($d(), !1) + I, !1);
        document.getElementById("clcSect") && document.getElementById("optItemTrCh") && (Ec = new xc(pf), Cc(), Fc(), Ac(Ec), Bc(Ec));
        Yf();
        bc && new bc(document.getElementById("fSBtn"), document.getElementById("gameOverlay"), Dc.click);
        q(s, function() {
            ua(ze,
                s, -1)
        }, !1, 50)
    }

    function lf() {
        q(s, function() {
            Zf()
        }, !1, Nf.Hb || 500)
    }

    function nf() {
        var a = J(M);
        0 < a ? x(Cf) : x(Bf);
        A(Kd, a);
        A(Ld, Xf(M, !1) + I, !1);
        A(Md, a);
        A(Nd, 2 * a);
        A(Od, 4 * a);
        $f(Ad);
        q(s, function() {
            ac(ag);
            $b(!1)
        }, !1, 1500)
    }

    function ag() {
        Zf()
    }

    function Te() {
        A(id, J(hd()), !1);
        A(ld, J(kd), !1)
    }

    function bg() {
        cg(0)
    }

    function dg() {
        cg(1)
    }

    function eg() {
        Qf()
    }

    function fg() {
        gg() && Q();
        hg();
        Le(!1);
        oa(Nf) && (Vb(D, s), ua(Nf, s, -1));
        X && oa(X) && (va(X, function() {
            ig(X.i, !1)
        }), ua(X, s, -1))
    }

    function ce() {
        Q();
        Le(!0);
        Pf();
        Me = q(s, function() {
            Ne(R)
        }, !1, 5E3);
        A(Hd, J($d()), !1);
        A(Id, Xf($d(), !1) + I, !1);
        qe.Tb();
        ee()
    }

    function jg() {
        var a = new fc(fd, I, B("congratulations"), Dc.click, function() {
            x(yf)
        }, function() {
            fd = 0;
            xb();
            var a = hd();
            A(id, J(a), !1);
            A(jd, a, !0, I)
        }, function() {
            a.Cb(s);
            ee();
            a = null
        });
        sc(a);
        tc(a);
        q(s, function() {
            x(Gf)
        }, !1, 50)
    }
    window.onblur = function() {
        !0 === ob && (ob = !1, We())
    };
    window.onerror = function(a, b, c) {
        kg(a, b, c);
        return !0
    };
    /* ----------------------------------------------------------
     * 16. Boot sequence – DOMContentLoaded handler
     *     translations → viewport → asset preload → sound prompt
     *     → init API call → game UI visible
     * ---------------------------------------------------------- */
    document.addEventListener("DOMContentLoaded", function() {
        "object" === typeof Kc && (Qb = Kc);
        a: {
            var a;a = ("; " + document.cookie).split("; dj_lang=");a = 2 === a.length ? a.pop().split(";").shift() : !1;
            if (!1 !== a && Qb[a]) Tb(a);
            else {
                if (window.localStorage) {
                    a = "";
                    try {
                        a = localStorage.getItem("uAL")
                    } catch (b) {}
                    if (a) {
                        Tb(a);
                        break a
                    }
                }
                Tb("en")
            }
        }
        Sb();
        lg();
        window.scrollTo(0, 0);
        mg();
        ng();
        qd = new Bb(new na([{
            F: "section",
            D: "userMessage",
            parentElement: "gameOverlay",
            pa: [{
                F: "span",
                D: "msgTopText",
                Ta: B("company")
            }, {
                F: "div",
                D: "msgTextWr",
                pa: [{
                    F: "span",
                    D: "msgText",
                    Ta: "",
                    Kc: !0
                }]
            }, {
                F: "div",
                D: "msgNoBtnWr",
                pa: [{
                    F: "span",
                    D: "msgNoBtn",
                    Ta: B("no")
                }]
            }, {
                F: "div",
                D: "msgYesBtnWr",
                pa: [{
                    F: "span",
                    D: "msgYesBtn",
                    Ta: B("yes")
                }]
            }]
        }], 364, 167, 364, 167, "px", 0, 1, 300), s, Dc);
        og();
        ca(s);
        Gd();
        a = document.getElementById("barsCanvas");
        a.setAttribute("width", 796);
        a.setAttribute("height", 444);
        ya = new wa(a, 0, 444);
        nd = new jb("msgAreaStr", "jpbWrapper", s, bg, dg)
    }, !1);
    /* ----------------------------------------------------------
     * 17. Global variable declarations
     *     rf = app ID (153), r = symbol image paths
     * ---------------------------------------------------------- */
    var V = document.getElementById("commonSounds"),
        If = document.getElementById("barStpSnd"),
        pg = {},
        S, Cf, Bf, yf, Gf, xf, zf, Af, Df, Tc, Xc, Zc, ad, Wc, Sc, Uc, Vc, $c, Yc, Ef, ie, Ff, Hf;
    var rf = 153,
        r = ["/static/games/slots/rich-fruits/style/images/symbols/symbols-big-win-symbols-sprite.png", "/static/games/slots/rich-fruits/style/images/symbols/fire-frame-animation.png", "/static/games/slots/rich-fruits/style/images/symbols/big-win-animation.png", "/static/games/slots/rich-fruits/style/images/symbols/7-animation.jpg", "/static/games/slots/rich-fruits/style/images/symbols/star-animation.jpg"];

    function Kf() {
        var a = r[0];
        r[0] = void 0;
        var b = document.createElement("canvas"),
            c = b.getContext("2d");
        b.width = 148;
        b.height = 148;
        for (var d = [], e = a.width, f = 0; e > 148 * f;) {
            c.clearRect(0, 0, 148, 148);
            c.drawImage(a, 148 * f, 0, 148, 148, 0, 0, 148, 148);
            var h = b.toDataURL(),
                n = new Image;
            n.src = h;
            d.push(n);
            f += 1
        }
        r = r.concat(d)
    }

    function Of() {
        W.Bd = qg();
        W.ud = rg();
        W.ce = sg();
        W.fe = tg();
        ug()
    }

    function qg() {
        var a = new eb(50);
        a.ca = r[1];
        a.Fa = a.ca.width / 148;
        a.e = 0;
        a.dir = 1;
        a.Ha = function() {
            fb(this) && (this.e += this.dir, this.e >= this.Fa - 1 ? this.dir = -1 : 6 >= this.e && -1 === this.dir && (this.dir = 1))
        };
        a.da = function(b) {
            var c = W.lc.Gb,
                c = {
                    ba: c.x,
                    M: c.y,
                    aa: c.a,
                    B: c.b,
                    x: b.x,
                    y: b.y,
                    a: b.a,
                    b: b.b
                };
            Ca(b.hd.yb, c, !1);
            c = {
                ba: b.a * this.e,
                M: 0,
                aa: b.a,
                B: b.b,
                x: b.x,
                y: b.y,
                a: b.a,
                b: b.b
            };
            Ca(a.ca, c, !1)
        };
        a.H = function() {
            this.e = 0;
            this.dir = 1
        };
        return a
    }

    function rg() {
        var a = new eb(30);
        a.ca = r[2];
        a.Fa = a.ca.width / 148;
        a.e = 0;
        a.Ha = function() {
            fb(this) && (this.e += 1, this.e >= this.Fa && (this.e = 0))
        };
        a.da = function(b, c) {
            var d = {
                ba: b.a * this.e,
                M: 0,
                aa: b.a,
                B: b.b,
                x: b.x,
                y: b.y,
                a: b.a,
                b: b.b
            };
            Ca(a.ca, d, !1);
            d = W.lc.Gb;
            d = {
                ba: d.x,
                M: d.y,
                aa: d.a,
                B: d.b,
                x: b.x,
                y: b.y,
                a: b.a,
                b: b.b
            };
            Ca(r[c + 11], d, !1)
        };
        a.H = function() {
            this.e = 0
        };
        return a
    }

    function sg() {
        var a = new eb(50);
        a.ca = r[3];
        a.Fa = a.ca.width / 148;
        a.e = 0;
        a.Ha = function() {
            fb(this) && (this.e += 1, this.e >= this.Fa && (this.e = 0))
        };
        a.da = function(b) {
            Ca(a.ca, {
                ba: b.a * this.e,
                M: 0,
                aa: b.a,
                B: b.b,
                x: b.x,
                y: b.y,
                a: b.a,
                b: b.b
            }, !1)
        };
        a.H = function() {
            this.e = 0
        };
        return a
    }

    function tg() {
        var a = new eb(50);
        a.ca = r[4];
        a.Fa = a.ca.width / 148;
        a.e = 0;
        a.Ha = function() {
            fb(this) && (this.e += 1, this.e >= this.Fa && (this.e = 0))
        };
        a.da = function(b) {
            Ca(a.ca, {
                ba: b.a * this.e,
                M: 0,
                aa: b.a,
                B: b.b,
                x: b.x,
                y: b.y,
                a: b.a,
                b: b.b
            }, !1)
        };
        a.H = function() {
            this.e = 0
        };
        return a
    }

    function ug() {
        function a(a) {
            return function(b) {
                1 === a ? W.ce.da(b) : 8 === a ? W.fe.da(b) : 4 > b.zc ? W.Bd.da(b) : W.ud.da(b, a)
            }
        }
        for (var b in E)
            if (E.hasOwnProperty(b)) {
                var c = E[b];
                c.pb = {};
                c.pb.da = a(parseInt(b))
            }
    }
    var bd = {};
    var de = "main",
        Dd = "close",
        De = "double",
        Uf = "free",
        cf = rf,
        Dc = new ib,
        s = new aa,
        ya = !1,
        D = new Ub(document.getElementById("gmbChsResC"), document.getElementById("gmbChsResCBack"), document.getElementById("gmbChsResCFront")),
        vg = document.getElementById("infoStr"),
        nd = null,
        wg = 0,
        R = 1,
        xg = [],
        F = 1,
        ae = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100],
        Mc = [],
        L = 1,
        dd = [],
        fd = 0,
        gd = 0,
        kd = 0,
        Nc = 1,
        Oc = 1,
        Pc = 1,
        Qc = 1,
        E = {},
        G = [],
        K = Dd,
        jf = !1,
        sd = !1,
        td = 0,
        Sf = 0,
        ud = 0,
        Rf = !1,
        Cd = [],
        Bd = 0,
        Ad = 0,
        Ed = 0,
        M = 0,
        yg = 0,
        Y = [],
        zg = !1,
        Z = 0,
        Tf = !1,
        Ag = !1,
        Bg = 0,
        $ = [],
        re = !1,
        W = {},
        ne = 0,
        Cg = 0,
        Me = !1,
        Nf = !1,
        X = !1,
        T = !1,
        Jc = !1,
        Dg = !1,
        Ze = 0,
        $e = 500;

    function mg() {
        if ("ontouchstart" in window) {
            var a = document.getElementById("gameOverlay"),
                b = null;
            a.addEventListener("touchstart", function(a) {
                b = a.touches[0].clientY
            }, !1);
            a.addEventListener("touchmove", function(a) {
                if ("optPanPTScroll" === a.target.id) {
                    var d = document.getElementById("optPanPTTabCont"),
                        e = a.touches[0].clientY;
                    d.scrollTop -= e - b;
                    b = e
                }
                a.preventDefault()
            }, !1)
        }
    }

    function ng() {
        var a = new La(document.getElementById("gameSection"), document.getElementById("gM"), document.getElementById("jpbWrapper"), document.getElementById("gB")),
            b;
        "desktop" !== a.Pa ? (b = function() {
            setTimeout(function() {
                Ma(a);
                "phone" === a.Pa && (se.$c(Oa()), Jc && "function" === typeof Jc.Qb && Ic());
                window.scrollTo(1, 1)
            }, 300)
        }, Ma(a), "phone" === a.Pa && se.$c(Oa())) : (b = function() {
            Pa(a)
        }, Pa(a));
        window.addEventListener("resize", b, !1);
        "desktop" !== a.Pa && window.addEventListener("orientationchange", function() {
            setTimeout(function() {
                window.scrollTo(1,
                    1);
                document.body.scrollTop = 1;
                document.body.scrollLeft = 1
            }, 400)
        }, !1)
    }

    function Eg() {
        for (var a = 0; a < r.length; a++) {
            var b = r[a];
            r[a] = new Image;
            r[a].src = b
        }
    }

    function Fg() {
        var a = document.getElementById("loadMenuBtnStr");
        a && 1 === a.nodeType && a.addEventListener(Dc.click, rd, !1)
    }

    function og() {
        var a = new ga;
        ze = new na([{
            F: "section",
            D: "loader",
            zd: "panels",
            parentElement: "gameOverlay",
            pa: [{
                F: "div",
                D: "loadMenuBtn",
                pa: [{
                    F: "span",
                    D: "loadMenuBtnStr"
                }]
            }, {
                F: "div",
                D: "lmb",
                pa: [{
                    F: "div",
                    D: "pl",
                    Kc: !0
                }, {
                    F: "span",
                    D: "pi",
                    Ta: B("loadPrepare")
                }]
            }]
        }], 100, 0, 100, 100, "%", 0, 1, 500);
        pa(ze);
        Fg();
        Eg();
        a = ia(a);
        a = new ka(ze, a);
        Ae(B("loadGraphDataLoad"));
        la(a, function() {
            sf()
        })
    }

    function tf() {
        q(s, function() {
            Jc = new Gc;
            "function" === typeof Jc.Qb && function() {
                Ic();
                Gg = q(s, arguments.callee, !1, 500)
            }()
        }, !1, 1E3)
    }

    function Ae(a) {
        var b = document.getElementById("pi");
        b && (b.innerHTML = a)
    }

    function pd() {
        var a = qd;
        a && a.p && a.p.qc && (fa(a.v, a.p.qc), ta(a.p))
    }

    function vf() {
        Mb = new Gb(ze, wf, Jf);
        Lb()
    }

    function df() {
        wg = s.d
    }

    function ff(a) {
        pd();
        qd.show(B("requestError"), {
            na: B("yes"),
            h: function() {
                u.w(a)
            }
        }, {
            na: B("no"),
            h: function() {
                document.location.reload(!1)
            }
        })
    }

    function ed() {
        for (var a = 0; a < dd.length; a++) Pb(dd[a]);
        s.d >= wg + 2E4 && (u.tb || of());
        q(s, function() {
            ed()
        }, !1, 0)
    }

    function Pf() {
        for (var a = $d(), b = 0; b < dd.length; b++) {
            var c = dd[b];
            a >= c.gc ? Ob(c, !0) : Ob(c, !1)
        }
    }

    function hd() {
        var a = gd;
        M && K === Dd && (a -= M);
        fd && (a -= fd);
        return a
    }

    function pe() {
        zd(Oc);
        xd(Qc);
        Zd();
        Q();
        Le(!0);
        Me = q(s, function() {
            Ne(R)
        }, !1, 5E3);
        Pf();
        A(Hd, J($d()), !1);
        A(Id, Xf($d(), !1) + I, !1);
        x(xf)
    }

    function J(a) {
        return parseInt(a / L)
    }

    function Rc(a) {
        if ("object" == typeof a) {
            var b = {},
                c = [],
                d = [],
                e;
            for (e in a) a.hasOwnProperty(e) && c.push(e);
            c.sort(function(a, b) {
                return a - b
            });
            for (e = 0; e < c.length; e++) {
                var f = c[e],
                    h = a[f];
                b[f] = h;
                d.push(h)
            }
            return {
                Eb: b,
                Ie: c,
                nc: d
            }
        }
        throw Error("Expected argument must be an object.");
    }

    function wd(a) {
        a.s = K === Uf && 0 < ud || 0 !== td && td === ud ? a.Ed : a.oe
    }

    function vd(a) {
        a = Rc(a).Eb;
        var b = [],
            c;
        for (c in a) a.hasOwnProperty(c) && (c = parseInt(c), isNaN(c) || b.push(parseInt(a[c], 10)));
        return b
    }

    function xd(a) {
        a = parseInt(a);
        isNaN(a) && (a = Qc);
        R = a < Pc ? Pc : a > Qc ? Qc : a;
        A(Jd, R, !1)
    }

    function yd(a) {
        var b = Mc.indexOf(a);
        a && -1 !== b || (a = be(), a += 1, a >= Mc.length && (a = 0), a = Mc[a] || 1);
        L = a;
        Te()
    }

    function be() {
        var a = Mc.indexOf(L); - 1 === a && (a = 0);
        return a
    }

    function zd(a) {
        isNaN(a) && (a = Oc);
        F = a < Nc ? Nc : a > Oc ? Oc : a
    }

    function Vf() {
        Ed = M;
        for (var a in Y)
            if (Y.hasOwnProperty(a)) {
                var b = Y[a].win;
                b && (Ed -= b)
            }
    }

    function Fd(a) {
        a = Rc(a).Eb;
        Y = [];
        for (var b in a)
            if (a.hasOwnProperty(b)) {
                var c = new db(a[b]);
                c && Y.push(c)
            } Hg()
    }

    function Hg() {
        $ = {};
        for (var a = 0; a < Y.length; a++) {
            var b = Y[a];
            if (5 === b.id) break;
            if (3 !== b.id)
                for (var c in b.pos)
                    if (b.pos.hasOwnProperty(c)) {
                        var d = b.pos[c],
                            e = null,
                            f;
                        for (f in d) d.hasOwnProperty(f) && (e = +f);
                        var d = c,
                            h = e,
                            d = d - 1,
                            h = h - 1,
                            d = $[d] && $[d][h] ? $[d][h] : void 0;
                        (h = G[c - 1].C[e - 1]) && h.length ? (h = 0, 5 === b.id && (h = 1), d && d.length || (d = []), d[h] = {
                            gd: b.sym,
                            count: b.count
                        }, Ig(c, e, d)) : d && d.length ? Ig(c, e, [{
                            gd: b.sym,
                            count: b.count
                        }, d[1]]) : Ig(c, e, {
                            gd: b.sym,
                            count: b.count
                        })
                    }
        }
    }

    function Ig(a, b, c) {
        a -= 1;
        b -= 1;
        $[a] || ($[a] = {});
        var d = 0;
        $[a][b] && $[a][b].count && (d = $[a][b].count);
        d < c.count && ($[a][b] = c)
    }

    function Xf(a, b) {
        var c = a / 100;
        0 == c % 1 && b || (c = c.toFixed(2));
        return c
    }

    function cg(a) {
        var b = 0;
        a && (b = 1);
        for (a = 0; a < dd.length; a++) {
            var c = dd[a].tc;
            c && (c.style.opacity = b)
        }
    }

    function ge() {
        function a() {
            var e = 0,
                f = 0,
                h = 0,
                n = 1E3 > s.oa ? s.oa : 50;
            c && (f = s.d - c);
            for (var m = 0; m < G.length; m++) {
                var g = !1,
                    l = G[m];
                l.Sa && 0 !== m && h++;
                if (0 !== l.state && (e++, 5 > l.state)) {
                    l.l += parseInt(n * l.xd) * l.speed;
                    a: {
                        if (0 <= l.l) {
                            if (l.l >= l.Ga) {
                                g = 1;
                                break a
                            }
                        } else if (l.l <= -l.Ga) {
                            g = -1;
                            break a
                        }
                        g = !1
                    }
                    if (g) {
                        var k = parseInt(l.l / l.Ga);
                        0 > k && (k *= -1);
                        l.K = k;
                        l.l %= l.Ga
                    }
                }
                if (0 !== l.state)
                    if (1 === l.state) k = l, k.speed += 0.002 * n, 1 <= k.speed && (k.speed = 1, k.state = 2);
                    else if (2 === l.state) l.la.length && (c || (c = s.d), f >= b[m - h] || l.Sa) && (l.state = 4, k = l,
                    k.S = 0 <= k.l ? bb(k.ta + 4, k.s.length) : bb(k.ta - 4, k.s.length), 3 <= k.K && (k.K = 1), ab(l));
                else if (3 !== l.state)
                    if (4 === l.state) {
                        a: {
                            var k = l,
                                p = void 0,
                                t = void 0,
                                w = void 0;
                            if (0 <= k.l) {
                                if (w = k.S, t = bb(k.ta, k.s.length), p = k.S - k.K, 0 > p && w < t && (w += k.s.length, p = w - k.K), w >= t && p < t) {
                                    k.K = w - t + 1;
                                    k = !0;
                                    break a
                                }
                            } else if (0 > k.l && (w = k.S, t = bb(k.ta - 1, k.s.length), p = k.S + k.K, p > k.s.length && w > t && (w -= k.s.length, p = bb(p, k.s.length)), w <= t && p > t)) {
                                k.K = t - (w - 1);
                                k = !0;
                                break a
                            }
                            k = !1
                        }
                        if (k) {
                            l.state = 5;
                            l.l = 0;
                            l.V.frames = 0;
                            d++;
                            d === G.length && (Xd(P), xb());
                            if (pg.ae) {
                                k =
                                    G.length - 1;
                                p = 0;
                                t = !1;
                                for (w = 0; w <= m; w += 1)
                                    for (var z = G[w], H = 0; H < z.la.length; H += 1)
                                        if (E[z.la[H]].cb) {
                                            w === m && (t = !0);
                                            p += 1;
                                            break
                                        } k = t && 3 <= p + (k - m) ? p : !1
                            } else k = !1;
                            if (!1 !== k) switch (k) {
                                case 1:
                                    x(pg.ae);
                                    break;
                                case 2:
                                    x(pg.Ee);
                                    break;
                                case 3:
                                    x(pg.Fe);
                                    break;
                                case 4:
                                    x(pg.Ge);
                                    break;
                                case 5:
                                    x(pg.He);
                                    break;
                                default:
                                    throw Error("USC");
                            } else Hf && x(Hf)
                        }
                    }
                else 5 === l.state && (Dg && (l.l = l.V.l = l.state = 0), k = l, k.V.frames++, k.V.l = 50 * Math.exp(-0.3 * k.V.frames) * Math.cos(0.5 * k.V.frames + 50), 0.05 >= Math.abs(k.V.l) && (k.V.l = 0, k.state = 0));
                g && cb(l,
                    1 === g);
                Jg(l, m)
            }
            0 < e ? q(s, a, !1, 0) : q(s, eg, !1, 0)
        }
        var b = Ya,
            c = !1,
            d = 0;
        a()
    }

    function Mf() {
        var a = document.getElementById("barsCanvasWr"),
            b = a.offsetLeft,
            c = a.offsetTop;
        document.getElementById("lLWr").addEventListener(Dc.click, function(a) {
            var e = a.layerX - b;
            a = a.layerY - c;
            for (var f = 0; f < G.length; f++) {
                var h = G[f];
                if (h.x <= e && e <= h.x + h.a && h.y <= a && a <= h.y + h.b) {
                    0 < h.state && 4 > h.state && (h.Sa = !0);
                    break
                }
            }
        }, !1)
    }

    function Kg() {
        for (var a = 0; a < G.length; a++)
            if (0 !== G[a].state) return !0;
        return !1
    }

    function Q() {
        Da();
        for (var a = 0; a < G.length; a++) Jg(G[a], a)
    }

    function Jg(a, b) {
        for (var c = a.C, d = 0; d < c.length; d++) {
            var e = 148 * (d - 1),
                f = Lg(a, E[c[d]], b),
                e = parseInt(a.y + e + a.l + a.V.l);
            Da({
                x: a.x,
                y: e,
                a: 148,
                b: 148
            });
            Ca(f, {
                ba: 0,
                M: 0,
                aa: 148,
                B: 148,
                x: a.x,
                y: e,
                a: 148,
                b: 148
            }, !0)
        }
    }

    function Wf() {
        var a = document.getElementById("barsArea");
        null !== a && (a = a.classList, a.contains("freeStt") || a.add("freeStt"))
    }

    function ke() {
        ee();
        gg() && Q();
        Le(!1);
        if (X && oa(X)) Wf(), Rf = !0, Sf = td, va(X, function() {
            ig(X.i, !1);
            ke()
        }), ua(X, s, -1);
        else {
            for (var a = 0; a < G.length; a++) {
                var b = G[a];
                b.H();
                wd(b);
                b.state = 1
            }
            gf();
            pg.Dd ? x(pg.Dd) : x(ie);
            bd && "function" === typeof bd.Cd ? bd.Cd() : ge()
        }
    }

    function Mg() {
        A(id, J(hd()), !1);
        A(ld, J(kd), !1);
        var a, b = !1,
            c = J($d());
        Hd.c !== c && (b = !0);
        Jd.c !== R && (a = !0, Zd(), Q(), Me = q(s, function() {
            Ne(R)
        }, !1, 5E3), A(Jd, R, !1));
        if (a || b) A(Hd, c, !1), A(Id, Xf($d(), !1) + I, !1), Le(a), Pf()
    }

    function $d() {
        return F * R * L
    }

    function Lf() {
        var a = [{
            g: [
                [0, 240],
                [764, 240]
            ],
            n: [143, 278],
            j: ["#000", "#FFFF25", "#fff"],
            r: [2, 2, 2, 2, 2]
        }, {
            g: [
                [0, 50],
                [764, 50]
            ],
            n: [143, 76],
            j: ["#7B1F46", "#D6377A", "#BE316C"],
            r: [1, 1, 1, 1, 1]
        }, {
            g: [
                [0, 376],
                [764, 376]
            ],
            n: [143, 421],
            j: ["#392B92", "#644BFF", "#5942E2"],
            r: [3, 3, 3, 3, 3]
        }, {
            g: [
                [0, 9],
                [58, 9],
                [396, 353],
                [711, 33],
                [764, 33]
            ],
            n: [143, 26],
            j: ["#6F6E15", "#FFFD31", "#DEDC2B"],
            r: [1, 2, 3, 2, 1]
        }, {
            g: [
                [0, 417],
                [55, 417],
                [396, 67],
                [732, 412],
                [764, 412]
            ],
            n: [143, 470],
            j: ["#632F62", "#E76DE6", "#C95FC8"],
            r: [3, 2, 1, 2, 3]
        }, {
            g: [
                [0, 160],
                [113, 160],
                [241, 30],
                [506, 30],
                [653, 182],
                [764, 182]
            ],
            n: [143, 191],
            j: ["#226922", "#4DF14F", "#44D646"],
            r: [2, 1, 1, 1, 2]
        }, {
            g: [
                [0, 278],
                [24, 278],
                [84, 216],
                [238, 374],
                [555, 374],
                [713, 210],
                [764, 210]
            ],
            n: [143, 319],
            j: ["#1F406B", "#4B99FF", "#4288E2"],
            r: [2, 3, 3, 3, 2]
        }, {
            g: [
                [0, 89],
                [319, 89],
                [583, 361],
                [764, 361]
            ],
            n: [143, 114],
            j: ["#664728", "#EAA35D", "#CF9052"],
            r: [1, 1, 2, 3, 3]
        }, {
            g: [
                [0, 334],
                [228, 334],
                [481, 74],
                [764, 74]
            ],
            n: [143, 380],
            j: ["#2C513D", "#65BB8D", "#5AA67D"],
            r: [3, 3, 2, 1, 1]
        }, {
            g: [
                [0, 198],
                [109, 198],
                [224, 78],
                [538, 400],
                [764, 400]
            ],
            n: [143, 232],
            j: ["#2E3E84",
                "#516CE7", "#4860CD"
            ],
            r: [2, 1, 2, 3, 3]
        }, {
            g: [
                [791, 235],
                [653, 235],
                [537, 353],
                [395, 210],
                [247, 362],
                [119, 232],
                [28, 232]
            ],
            n: [755, 267],
            j: ["#626262", "#BEBEBE", "#ABABAB"],
            r: [2, 3, 2, 3, 2]
        }, {
            g: [
                [791, 199],
                [648, 199],
                [538, 83],
                [395, 227],
                [247, 76],
                [117, 211],
                [28, 211]
            ],
            n: [755, 233],
            j: ["#194620", "#2B7B38", "#266D32"],
            r: [2, 1, 2, 1, 2]
        }, {
            g: [
                [791, 46],
                [677, 46],
                [548, 177],
                [395, 21],
                [240, 177],
                [102, 40],
                [28, 40]
            ],
            n: [755, 67],
            j: ["#653534", "#E97A78", "#D16E6C"],
            r: [1, 2, 1, 2, 1]
        }, {
            g: [
                [791, 373],
                [671, 373],
                [549, 249],
                [396, 404],
                [239, 244],
                [120, 368],
                [28,
                    368
                ]
            ],
            n: [755, 422],
            j: ["#3C1061", "#8925DF", "#7921C6"],
            r: [3, 2, 3, 2, 3]
        }, {
            g: [
                [791, 161],
                [505, 161],
                [395, 49],
                [264, 186],
                [28, 186]
            ],
            n: [755, 192],
            j: ["#69581E", "#F2CB46", "#D2B03D"],
            r: [2, 2, 1, 2, 2]
        }, {
            g: [
                [791, 277],
                [501, 277],
                [394, 384],
                [266, 253],
                [28, 253]
            ],
            n: [755, 318],
            j: ["#6F0000", "#FF0000", "#DD0000"],
            r: [2, 2, 3, 2, 2]
        }, {
            g: [
                [791, 8],
                [572, 8],
                [395, 188],
                [239, 28],
                [28, 28]
            ],
            n: [755, 25],
            j: ["#524829", "#BCA55E", "#A79253"],
            r: [1, 1, 2, 1, 1]
        }, {
            g: [
                [791, 420],
                [578, 420],
                [395, 234],
                [235, 399],
                [28, 399]
            ],
            n: [755, 476],
            j: ["#2B2B2B", "#626262", "#575757"],
            r: [3, 3, 2, 3, 3]
        }, {
            g: [
                [791, 90],
                [694, 90],
                [581, 207],
                [213, 207],
                [81, 74],
                [28, 74]
            ],
            n: [755, 114],
            j: ["#181757", "#3733C4", "#312DAD"],
            r: [1, 2, 2, 2, 1]
        }, {
            g: [
                [791, 336],
                [700, 336],
                [584, 218],
                [207, 218],
                [84, 346],
                [28, 346]
            ],
            n: [755, 382],
            j: ["#2C7171", "#4BBEBE", "#41A5A5"],
            r: [3, 2, 2, 2, 3]
        }];
        xg = [];
        for (var b = Math.ceil(a.length / 2), c = 0; c < a.length; c++) {
            for (var d = a[c], e = 0; e < d.g.length; e++) d.g[e][0] += 0, d.g[e][1] += 8;
            e = "lSLL";
            c >= b && (e = "rSLL");
            d = new Sa(d.g, d.j, d.r, d.n);
            Va(d, document.getElementById(e), "lL" + c);
            d.addListener(Dc, function(a) {
                return function() {
                    Ne(a,
                        !0)
                }
            }(d), function() {
                Zd();
                Q()
            });
            xg.push(d)
        }
    }

    function Qf() {
        if (K !== de && K !== Uf && !Ng || 0 === Y.length) Og();
        else {
            for (var a = [], b = 0; b < Y.length; b++) {
                var c = Y[b];
                c.line && a.push(c.line - 1)
            }
            for (b = 0; b < xg.length; b++) Ta(xg[b], -1 !== a.indexOf(b));
            zg = q(s, Pg, !0, 0)
        }
    }

    function gg() {
        if (zg || Y.length) {
            fa(s, zg);
            zg = !1;
            Y = [];
            $ = [];
            Z = Bg = 0;
            Ag = Tf = !1;
            for (var a in W)
                if (W.hasOwnProperty(a)) {
                    var b = W[a];
                    "function" === typeof b.H && b.H()
                } return !0
        }
        return !1
    }

    function hg() {
        K !== Dd && (K = Dd, jf = !0, hf())
    }

    function he(a) {
        vg.innerHTML = a
    }

    function Pg() {
        Da();
        var a = Y[Z];
        if (a)
            if (3 === a.id) xb(), gg(), Tf = !0, Qg(a), Q(), q(s, function() {
                Rg(a)
            }, !1, 500);
            else {
                var b = 1.1 - (s.d - Ag) / Sg(),
                    c;
                for (c in W)
                    if (W.hasOwnProperty(c)) {
                        var d = W[c];
                        "function" === typeof d.Ha && d.Ha(s.d)
                    } c = 3 < G.length;
                Tg(!1, !1, a);
                Tg(!0, !1, a);
                Ug(a, b);
                Tg(!0, !0, a, c);
                Vg(a, b, c);
                Wg()
            }
    }

    function Qg(a) {
        a = a.pos;
        for (var b = 0; b < G.length; b++) "object" === typeof a[b + 1] && (G[b].sc = !0)
    }

    function Rg(a) {
        var b = a.pos,
            c = E[sd],
            d;
        for (d in b)
            if (b.hasOwnProperty(d))
                for (var e = G[+d - 1], f = 1; f < e.C.length - 1; f++)
                    if (e.C[f] !== sd) {
                        e.C[f] = sd;
                        b = e.y + (f - 1) * c.height;
                        Da({
                            x: e.x,
                            y: b,
                            a: c.width,
                            b: c.height
                        });
                        Ca(c.yb, {
                            ba: 0,
                            M: 0,
                            aa: c.width,
                            B: c.height,
                            x: e.x,
                            y: b,
                            a: c.width,
                            b: c.height
                        }, !1);
                        q(s, function() {
                            Rg(a)
                        }, !1, 500);
                        x(Ef);
                        return
                    } Xg(a);
        Qf()
    }

    function Xg(a) {
        for (var b = a.lines, c = +a.win / +b, d = {}, e = 0; e < b; e++) {
            var f = xg[e],
                h = {},
                n;
            for (n in a.pos)
                if (a.pos.hasOwnProperty(n)) {
                    var m = f.Xd[+n - 1];
                    h[n] = {};
                    h[n][m] = !0
                } d[e + 1] = {
                count: a.count,
                id: 1,
                line: e + 1,
                pos: h,
                sym: a.sym,
                win: c
            }
        }
        Fd(d)
    }

    function Ug(a, b) {
        var c = a.line ? xg[a.line - 1] : !1;
        c && Ba(c.j, c.g, b)
    }

    function Wg() {
        var a = Sg();
        Ag || (Ag = s.d - Sg(), Z = -1);
        ob && 0 > Z ? Yg() : (!ob || 0 < Bg) && Ag + a <= s.d && Yg()
    }

    function Yg() {
        Z += 1;
        Ag = s.d;
        Z >= Y.length && (Z = 0, Bg += 1);
        if (Ng && 5 === Y[Z].id) {
            var a = Y.slice(Z + 1);
            gg();
            Y = a;
            a = G[Ng.bar - 1];
            a.H();
            var b = Ng.symbols;
            Ng = void 0;
            yg = 0;
            var c = vd(b);
            a.la = c;
            a.ta = b.pos - 1;
            Q();
            a.state = 1;
            a.Sa = !0;
            ge();
            Hg()
        } else 0 === Bg ? (a = Y[Z], 3 !== a.id && (Ed += a.win, Ed > M && (Ed = M), A(Kd, J(Ed), !1), A(Ld, Xf(Ed, !1) + I, !1), a && (yg += a.win), he(J(yg) + " " + B("creditsWon"))), ob && Zg()) : 1 === Bg && 0 === Z && (yg = 0, Og())
    }

    function Zg() {
        var a = Y[Z],
            b = E[a.sym],
            a = !1 !== sd && !0 === Tf && pg.ee ? pg.ee : b.we[a.count],
            b = 6 === Y[Z].id;
        if (!a && !b) a = Tc;
        else if (b || !a.P || 4 !== a.P.readyState) a = [Vc, $c, Yc], a = a[Math.floor(Math.random() * a.length)];
        x(a, Yg)
    }

    function Sg() {
        return (K === Uf || K === de) && 0 < td && 0 < ud && !1 === Tf && !1 === sd || !0 === Tf ? 500 : 1E3
    }

    function Tg(a, b, c, d) {
        for (var e = 0; e < G.length; e++)
            for (var f = G[e], h = 1, n = f.C.length - 1; h < n; h++) {
                var m = f.C[h],
                    g = E[m],
                    l = 0,
                    k = h - 1,
                    p;
                if (c && 6 === Y[Z].id) g.pb.da({
                    x: f.x,
                    y: f.y + k * g.height,
                    a: g.width,
                    b: g.height,
                    zc: 0,
                    td: e,
                    hd: g,
                    Wd: m,
                    Sd: k
                }), e + 1 === G.length && h + 1 === n && "function" === typeof bd.yd && bd.yd();
                else if (a && $[e] && $[e][k]) {
                    if (l = c.pos, p = e + 1, b || !l[p] || !l[p][h])
                        if (!b || l[p] && l[p][h]) {
                            var t = $[e][k].count,
                                l = f.y + k * g.height;
                            !0 === b && (d && Da({
                                x: f.x,
                                y: l,
                                a: g.width,
                                b: g.height
                            }), t = c.count);
                            p = W.lc.Gb;
                            p = {
                                ba: p.x,
                                M: p.y,
                                aa: p.a,
                                B: p.b,
                                x: f.x,
                                y: l,
                                a: g.width,
                                b: g.height
                            };
                            g.pb ? g.pb.da({
                                x: f.x,
                                y: l,
                                a: g.width,
                                b: g.height,
                                zc: t,
                                td: e,
                                hd: g,
                                Wd: m,
                                Sd: k
                            }) : (m = Lg(f, g, e), Ca(m, p, !1))
                        }
                } else a || "undefined" !== typeof $[e] && "undefined" !== typeof $[e][k] || (l = f.y + k * g.height, p = {
                    ba: 0,
                    M: 0,
                    aa: g.width,
                    B: g.height,
                    x: f.x,
                    y: l,
                    a: g.width,
                    b: g.height
                }, m = Lg(f, g, e), Ca(m, p, !1), m = f.x, k = ya, p = m, t = g.width, g = g.height, "undefined" == typeof m && (l = p = 0, t = k.width, g = k.height), za(k, p, l, t, g, "#440000", 0.5))
            }
    }

    function Lg(a, b, c) {
        return !0 === Tf && b.Ec && !1 === a.sc ? b.Ec : "function" === typeof b.Hd ? b.Hd(c) : b.yb
    }

    function Vg(a, b, c) {
        var d = a.pos,
            e = !1;
        if (d) {
            var f = a.line ? xg[a.line - 1] : !1;
            f || (f = xg[0]);
            if (!c && a.line) xa(f.n[0], f.n[1], f.j, J(a.win), b);
            else
                for (var h in d)
                    if (d.hasOwnProperty(h)) {
                        c = h - 1;
                        for (var n in d[h])
                            if (d[h].hasOwnProperty(n)) {
                                for (var m = n - 1, g = G[c].x, l = G[c].y + 148 * m, k = f.j, p = g + 3, t = l + 3, w = g + 148 - 3, z = l + 3, H = g + 148 - 3, C = l + 148 - 3, qa = g + 3, ha = l + 148 - 3, $a = b, kc = ya, Ua = kc.R, dh = 2 * k.length, zc = 0; zc < k.length; zc++) {
                                    var od = dh - 2 * zc;
                                    Ua.save();
                                    Ua.beginPath();
                                    Ua.globalAlpha = $a;
                                    Ua.strokeStyle = k[zc];
                                    Ua.lineWidth = od;
                                    Aa(kc, [
                                        [p - od / 2,
                                            t
                                        ],
                                        [w, z],
                                        [H, C],
                                        [qa, ha],
                                        [p, t - od / 2]
                                    ]);
                                    Ua.stroke();
                                    Ua.closePath();
                                    Ua.restore()
                                }
                                e || (0 === m && (l += 142), a.win && xa(g, l, f.j, J(a.win), b), e = !0)
                            }
                    }
        }
    }

    function je() {
        xb();
        if (0 === ne) {
            he("");
            fg();
            gd += M;
            ne = 1;
            var a = 0.005 * L;
            Cg = M / 1E4;
            Cg < a && (Cg = a);
            $g();
            x(yf)
        } else ne = 10, x(zf);
        ee()
    }

    function $g() {
        M -= s.oa * Cg * ne;
        0 < M ? q(s, function() {
            $g()
        }, !1, !1) : (xb(), Cg = ne = Ed = M = 0, Og());
        var a = hd();
        A(Kd, J(M), !1);
        A(Ld, Xf(M, !1) + I, !1);
        A(id, J(a), !1);
        A(jd, a, !0, I)
    }

    function Le(a) {
        for (var b = 0; b < xg.length; b++) {
            var c = xg[b],
                d = F;
            c.eb && (c.eb.innerHTML = d);
            b < R ? (Ta(c, !0), !0 === a && ah(c)) : Ta(c, !1)
        }
    }

    function ah(a, b) {
        if ("undefined" === typeof b) b = 1;
        else if (0 >= b) return;
        if ("number" === typeof a)
            for (var c = 0; c < a; c++) {
                var d = xg[c];
                d && Ba(d.j, d.g, b)
            } else "object" === typeof a && a.j && a.g && Ba(a.j, a.g, b)
    }

    function Ne(a, b) {
        function c() {
            var c = 1 - (s.d - d) / 777;
            b && 0 >= c && (d = s.d, c = 1);
            0 < c && K === Dd ? (Q(), ah(a, c)) : (Zd(), Q())
        }
        if (!Kg() && !zg) {
            Zd();
            var d = s.d;
            c();
            Me = q(s, c, !0, !1)
        }
    }

    function Zd() {
        !1 !== Me && (fa(s, Me), Me = !1)
    }

    function bh() {
        var a = document.getElementById("gmbPBRsWr");
        if (null !== a) {
            a.innerHTML = "";
            for (var b = Rc(Cd).nc, c = 0; c < b.length; c++) $f(b[c], a)
        }
    }

    function $f(a, b) {
        b || (b = document.getElementById("gmbPBRsWr"));
        if (b) {
            10 <= b.children.length && b.removeChild(b.lastChild);
            var c = document.createElement("div");
            c.className = "prevCardItem c" + a;
            var d = document.createElement("div");
            d.className = "prevCardItemFrame";
            c.appendChild(d);
            b.insertBefore(c, b.firstChild)
        }
    }

    function te() {
        K !== De && (kf(), K != De && (K = De));
        gg() && Q();
        Xe();
        bh();
        var a = J(M);
        A(Md, a);
        A(Nd, 2 * a);
        A(Od, 4 * a);
        x(Af);
        ua(Nf, s, 1);
        X && oa(X) && (va(X, function() {
            ig(X.i, !1)
        }), ua(X, s, -1))
    }

    function Zf() {
        Be.t(!1);
        Ee.t(!1);
        Fe.t(!1);
        Ge.t(!1);
        He.t(!1);
        Ie.t(!1);
        0 < M && K === De ? 5 <= Bd ? je() : (he(B("doubleOrCollect")), x(Df), D.sa = !0, D.Pb = 100, Wb(), ee()) : (P.Ia(P.$a), va(Nf, Og), Vb(D, s), ua(Nf, s, -1))
    }

    function Ce(a) {
        D.Pb = 50;
        D.sa = !1;
        Xe();
        mf(a)
    }

    function ig(a, b) {
        1 === a.nodeType && (!0 === b && "block" !== a.style.display ? a.style.display = "block" : !1 === b && "none" !== a.style.display && (a.style.display = "none"))
    }

    function Og() {
        if (K === de) {
            var a;
            0 != td && td === ud ? (Sf = ud, a = Rf = !0) : a = !1;
            a || (P.Ia(P.Na), re ? (P.k(), P.k()) : (he(B("doubleOrCollect")), x(Ff), ee()))
        } else K === De ? oa(Nf) ? Zf() : (P.Ia(P.Na), te(), lf()) : K === Uf ? Rf ? td - Sf ? Rf = !1 : ud < td && ke() : re && (qe.Tb(), Xd(qe)) : (P.Ia(P.$a), gg() && Q(), hg(), Le(!1), yg = 0, he(B("drawingComplete")), ch())
    }

    function ch() {
        jf ? (Xe(), q(s, ch, !1, 50)) : 0 < fd ? (Xe(), qe.Tb(), jg()) : re ? P.k() : ee()
    }

    function rd() {
        var a = "/menu/";
        if (window.localStorage) {
            var b = window.localStorage.getItem("back_url");
            b && (a = b)
        }
        var c;
        try {
            c = window.self !== window.top
        } catch (d) {
            c = !0
        }
        c && parent ? parent.location.href = b : document.location.assign(b);
        Jc = !1;
        fa(s, Gg);
        document.location.assign(a)
    }

    function kg(a, b, c) {
        window.onerror = function() {};
        Xe();
        qf({
            msg: a,
            url: b,
            line: c
        });
        pd();
        qd.show(B("gameError"), {
            na: B("ok"),
            h: rd
        });
        q(s, rd, !1, 5E3)
    }

    function ve() {
        Xe();
        !1 === T && (T = new na(!1, 100, 100, 100, 100, "%", 0, 1, 300), T.i = document.getElementById("optPanWr"), T.W = document.getElementById("optPanCont"));
        va(T, function() {
            ee()
        });
        Ec && Ec.w(0, Ec.mb);
        eh();
        A(Td, L, !0);
        A(Ud, I);
        A(Qd, F, !1);
        A(Rd, F * L, !0);
        A(Sd, I);
        A(Pd, R, !1);
        ig(T.i, !0);
        q(s, function() {
            ua(T, s, 1)
        }, !1, 1)
    }

    function xe() {
        Xe();
        va(T, function() {
            ig(T.i, !1);
            ee()
        });
        Mg();
        q(s, function() {
            ua(T, s, -1)
        }, !1, 1)
    }

    function eh() {
        for (var a in E) E.hasOwnProperty(a) && Xa(E[a], E[a].cb ? F * R : F)
    }

    function fh(a, b) {
        var c = !1;
        "optPanPTTab" === b && (c = eh);
        c = new Fa(document.getElementById(a), new na(!1, 100, 100, 100, 100, "%", 0, 1, 300), c);
        c.N.i = document.getElementById(b);
        c.N.W = document.getElementById(b + "Cont");
        c.Q.classList.add("inUse");
        return c
    }

    function Yf() {
        function a(a) {
            if (!a.m() && Ea) {
                Ea = !1;
                for (var b = 0; b < d.length; b++) {
                    var c = d[b];
                    Ka(c, !1) && Ja(c, !1)
                }
                Ka(a, !0);
                Ja(a, !0);
                "function" === typeof a.Vc && a.Vc()
            }
        }
        var b = ["optItemGmSts", "optItemLng", "optItemSnd", "optItemInf"],
            c = ["optPanGSTab", "optPanLTab", "optPanSTab", "optPanPTTab"];
        Ec && (b.push("optItemTrCh"), c.push("optPanTCTab"));
        for (var d = [], e = 0; e < b.length; e++) d.push(fh(b[e], c[e]));
        for (b = 0; b < d.length; b++) c = d[b], c.Q.addEventListener(Dc.click, function(b) {
            return function() {
                a(b)
            }
        }(c), !1);
        a(d[0])
    }

    function We() {
        ob ? (Yd(Ve), Y.length && -1 < Z && 0 === Bg && !1 !== zg && Zg()) : (Xd(Ve), xb())
    }

    function lg() {
        if (Kc) {
            var a = document.getElementById("lngIcns"),
                b = function(a, b) {
                    var c = '<div class="lngIcn"><div class="lngIcnTop"><div class="lngFlag"></div></div><div class="lngIcnBot"><div class="lngStrWr"><span class="lngStr">' + a + "</span></div></div></div>",
                        d = document.createElement("div");
                    d.className = "lngIcnWr " + b;
                    d.innerHTML = c;
                    return d
                },
                c = function(a, b, c) {
                    a.addEventListener(Dc.click, function() {
                        var d = a.classList;
                        if (!d.contains("active")) {
                            for (var e = Array.prototype.slice.call(document.getElementsByClassName("lngIcnWr")),
                                    f = 0; f < e.length; f++) {
                                var h = e[f].classList;
                                h.contains("active") && h.remove("active")
                            }
                            d.add("active");
                            document.getElementById("optItemLangIco").className = c;
                            Sb(b)
                        }
                    }, !1)
                },
                d;
            for (d in Kc)
                if (Kc.hasOwnProperty(d)) {
                    var e = "" + d,
                        f = e + "Lng",
                        h = b(Kc[d].langName, f);
                    a.appendChild(h);
                    c(h, e, f);
                    Rb === e && (h.className += " active", document.getElementById("optItemLangIco").className = f)
                }
        }
    }

    function Ke() {
        var a = $d();
        A(Hd, J(a), !1);
        A(Id, Xf(a) + I, !1)
    }
    var le = {},
        Ec, qd, I, Mb, ze, Gg, Ng;
    window.countAndShowFPS = function(a) {
        function b() {
            countAndShowFPS.Aa || (countAndShowFPS.Aa = []);
            for (var a = (new Date).getTime(), b = 0; b < countAndShowFPS.Aa.length; b++)
                if (0 < countAndShowFPS.Aa.length && 1E3 <= a - countAndShowFPS.Aa[0]) countAndShowFPS.Aa.shift();
                else break;
            c.innerHTML = "fps: " + countAndShowFPS.Aa.length;
            countAndShowFPS.Aa.push(a)
        }
        var c = document.getElementById("fps");
        if (!c) {
            var d = document.getElementById("gameSection"),
                c = document.createElement("div");
            c.id = "fps";
            d.appendChild(c)
        }
        a ? (countAndShowFPS.Mc =
            q(s, b, !0, 0), c.style.display = "block") : (fa(s, countAndShowFPS.Mc), countAndShowFPS.Mc = null, c.style.display = "none")
    };
}());