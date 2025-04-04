!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(
        ((e =
          "undefined" != typeof globalThis ? globalThis : e || self).Artalk =
          {})
      );
})(this, function (e) {
  "use strict";
  var t = Object.defineProperty,
    n = Object.defineProperties,
    s = Object.getOwnPropertyDescriptors,
    i = Object.getOwnPropertySymbols,
    r = Object.prototype.hasOwnProperty,
    o = Object.prototype.propertyIsEnumerable,
    a = (e, n, s) =>
      n in e
        ? t(e, n, { enumerable: !0, configurable: !0, writable: !0, value: s })
        : (e[n] = s),
    l = (e, t) => {
      for (var n in t || (t = {})) r.call(t, n) && a(e, n, t[n]);
      if (i) for (var n of i(t)) o.call(t, n) && a(e, n, t[n]);
      return e;
    },
    c = (e, t) => n(e, s(t)),
    d = (e, t, n) => a(e, "symbol" != typeof t ? t + "" : t, n),
    h = (e, t, n) =>
      new Promise((s, i) => {
        var r = (e) => {
            try {
              a(n.next(e));
            } catch (t) {
              i(t);
            }
          },
          o = (e) => {
            try {
              a(n.throw(e));
            } catch (t) {
              i(t);
            }
          },
          a = (e) =>
            e.done ? s(e.value) : Promise.resolve(e.value).then(r, o);
        a((n = n.apply(e, t)).next());
      });
  class u {
    constructor(e = {}) {
      d(this, "baseUrl", "/api/v2"),
        d(this, "securityData", null),
        d(this, "securityWorker"),
        d(this, "abortControllers", new Map()),
        d(this, "customFetch", (...e) => fetch(...e)),
        d(this, "baseApiParams", {
          credentials: "same-origin",
          headers: {},
          redirect: "follow",
          referrerPolicy: "no-referrer",
        }),
        d(this, "setSecurityData", (e) => {
          this.securityData = e;
        }),
        d(this, "contentFormatters", {
          "application/json": (e) =>
            null === e || ("object" != typeof e && "string" != typeof e)
              ? e
              : JSON.stringify(e),
          "text/plain": (e) =>
            null !== e && "string" != typeof e ? JSON.stringify(e) : e,
          "multipart/form-data": (e) =>
            Object.keys(e || {}).reduce((t, n) => {
              const s = e[n];
              return (
                t.append(
                  n,
                  s instanceof Blob
                    ? s
                    : "object" == typeof s && null !== s
                    ? JSON.stringify(s)
                    : `${s}`
                ),
                t
              );
            }, new FormData()),
          "application/x-www-form-urlencoded": (e) => this.toQueryString(e),
        }),
        d(this, "createAbortSignal", (e) => {
          if (this.abortControllers.has(e)) {
            const t = this.abortControllers.get(e);
            return t ? t.signal : void 0;
          }
          const t = new AbortController();
          return this.abortControllers.set(e, t), t.signal;
        }),
        d(this, "abortRequest", (e) => {
          const t = this.abortControllers.get(e);
          t && (t.abort(), this.abortControllers.delete(e));
        }),
        d(this, "request", (e) =>
          h(this, null, function* () {
            var t = e,
              {
                body: n,
                secure: s,
                path: a,
                type: d,
                query: u,
                format: p,
                baseUrl: g,
                cancelToken: m,
              } = t,
              f = ((e, t) => {
                var n = {};
                for (var s in e)
                  r.call(e, s) && t.indexOf(s) < 0 && (n[s] = e[s]);
                if (null != e && i)
                  for (var s of i(e))
                    t.indexOf(s) < 0 && o.call(e, s) && (n[s] = e[s]);
                return n;
              })(t, [
                "body",
                "secure",
                "path",
                "type",
                "query",
                "format",
                "baseUrl",
                "cancelToken",
              ]);
            const k =
                (("boolean" == typeof s ? s : this.baseApiParams.secure) &&
                  this.securityWorker &&
                  (yield this.securityWorker(this.securityData))) ||
                {},
              y = this.mergeRequestParams(f, k),
              $ = u && this.toQueryString(u),
              v = this.contentFormatters[d || "application/json"],
              w = p || y.format;
            return this.customFetch(
              `${g || this.baseUrl || ""}${a}${$ ? `?${$}` : ""}`,
              c(l({}, y), {
                headers: l(
                  l({}, y.headers || {}),
                  d && "multipart/form-data" !== d ? { "Content-Type": d } : {}
                ),
                signal: (m ? this.createAbortSignal(m) : y.signal) || null,
                body: null == n ? null : v(n),
              })
            ).then((e) =>
              h(this, null, function* () {
                const t = e.clone();
                (t.data = null), (t.error = null);
                const n = w
                  ? yield e[w]()
                      .then((e) => (t.ok ? (t.data = e) : (t.error = e), t))
                      .catch((e) => ((t.error = e), t))
                  : t;
                if ((m && this.abortControllers.delete(m), !e.ok)) throw n;
                return n;
              })
            );
          })
        ),
        Object.assign(this, e);
    }
    encodeQueryParam(e, t) {
      return `${encodeURIComponent(
        e
      )}=${encodeURIComponent("number" == typeof t ? t : `${t}`)}`;
    }
    addQueryParam(e, t) {
      return this.encodeQueryParam(t, e[t]);
    }
    addArrayQueryParam(e, t) {
      return e[t].map((e) => this.encodeQueryParam(t, e)).join("&");
    }
    toQueryString(e) {
      const t = e || {};
      return Object.keys(t)
        .filter((e) => void 0 !== t[e])
        .map((e) =>
          Array.isArray(t[e])
            ? this.addArrayQueryParam(t, e)
            : this.addQueryParam(t, e)
        )
        .join("&");
    }
    addQueryParams(e) {
      const t = this.toQueryString(e);
      return t ? `?${t}` : "";
    }
    mergeRequestParams(e, t) {
      return c(l(l(l({}, this.baseApiParams), e), t || {}), {
        headers: l(
          l(l({}, this.baseApiParams.headers || {}), e.headers || {}),
          (t && t.headers) || {}
        ),
      });
    }
  }
  /**
   * @title Artalk API
   * @version 2.0
   * @license MIT (https://github.com/ArtalkJS/Artalk/blob/master/LICENSE)
   * @baseUrl /api/v2
   * @contact API Support <artalkjs@gmail.com> (https://artalk.js.org)
   *
   * Artalk is a modern comment system based on Golang.
   */ let p = class extends u {
    constructor() {
      super(...arguments),
        d(this, "auth", {
          loginByEmail: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/auth/email/login",
                  method: "POST",
                  body: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          registerByEmail: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/auth/email/register",
                  method: "POST",
                  body: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          sendVerifyEmail: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/auth/email/send",
                  method: "POST",
                  body: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          checkDataMerge: (e = {}) =>
            this.request(
              l(
                {
                  path: "/auth/merge",
                  method: "GET",
                  secure: !0,
                  format: "json",
                },
                e
              )
            ),
          applyDataMerge: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/auth/merge",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "cache", {
          flushCache: (e = {}) =>
            this.request(
              l(
                {
                  path: "/cache/flush",
                  method: "POST",
                  secure: !0,
                  format: "json",
                },
                e
              )
            ),
          warmUpCache: (e = {}) =>
            this.request(
              l(
                {
                  path: "/cache/warm_up",
                  method: "POST",
                  secure: !0,
                  format: "json",
                },
                e
              )
            ),
        }),
        d(this, "captcha", {
          getCaptcha: (e = {}) =>
            this.request(
              l({ path: "/captcha", method: "GET", format: "json" }, e)
            ),
          getCaptchaStatus: (e = {}) =>
            this.request(
              l({ path: "/captcha/status", method: "GET", format: "json" }, e)
            ),
          verifyCaptcha: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/captcha/verify",
                  method: "POST",
                  body: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "comments", {
          getComments: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/comments",
                  method: "GET",
                  query: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          createComment: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/comments",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          getComment: (e, t = {}) =>
            this.request(
              l(
                {
                  path: `/comments/${e}`,
                  method: "GET",
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          updateComment: (e, t, n = {}) =>
            this.request(
              l(
                {
                  path: `/comments/${e}`,
                  method: "PUT",
                  body: t,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                n
              )
            ),
          deleteComment: (e, t = {}) =>
            this.request(
              l(
                {
                  path: `/comments/${e}`,
                  method: "DELETE",
                  secure: !0,
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "conf", {
          conf: (e = {}) =>
            this.request(
              l({ path: "/conf", method: "GET", format: "json" }, e)
            ),
          getSocialLoginProviders: (e = {}) =>
            this.request(
              l(
                { path: "/conf/auth/providers", method: "GET", format: "json" },
                e
              )
            ),
          getDomain: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/conf/domain",
                  method: "GET",
                  query: e,
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "notifies", {
          getNotifies: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/notifies",
                  method: "GET",
                  query: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          markAllNotifyRead: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/notifies/read",
                  method: "POST",
                  body: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          markNotifyRead: (e, t, n = {}) =>
            this.request(
              l(
                { path: `/notifies/${e}/${t}`, method: "POST", format: "json" },
                n
              )
            ),
        }),
        d(this, "pages", {
          getPages: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/pages",
                  method: "GET",
                  query: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          fetchAllPages: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/pages/fetch",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          getPageFetchStatus: (e = {}) =>
            this.request(
              l(
                {
                  path: "/pages/fetch/status",
                  method: "GET",
                  secure: !0,
                  format: "json",
                },
                e
              )
            ),
          logPv: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/pages/pv",
                  method: "POST",
                  body: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          updatePage: (e, t, n = {}) =>
            this.request(
              l(
                {
                  path: `/pages/${e}`,
                  method: "PUT",
                  body: t,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                n
              )
            ),
          deletePage: (e, t = {}) =>
            this.request(
              l(
                {
                  path: `/pages/${e}`,
                  method: "DELETE",
                  secure: !0,
                  format: "json",
                },
                t
              )
            ),
          fetchPage: (e, t = {}) =>
            this.request(
              l(
                {
                  path: `/pages/${e}/fetch`,
                  method: "POST",
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "sendEmail", {
          sendEmail: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/send_email",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "settings", {
          getSettings: (e = {}) =>
            this.request(
              l(
                {
                  path: "/settings",
                  method: "GET",
                  secure: !0,
                  format: "json",
                },
                e
              )
            ),
          applySettings: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/settings",
                  method: "PUT",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          getSettingsTemplate: (e, t = {}) =>
            this.request(
              l(
                {
                  path: `/settings/template/${e}`,
                  method: "GET",
                  secure: !0,
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "sites", {
          getSites: (e = {}) =>
            this.request(
              l(
                { path: "/sites", method: "GET", secure: !0, format: "json" },
                e
              )
            ),
          createSite: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/sites",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          updateSite: (e, t, n = {}) =>
            this.request(
              l(
                {
                  path: `/sites/${e}`,
                  method: "PUT",
                  body: t,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                n
              )
            ),
          deleteSite: (e, t = {}) =>
            this.request(
              l(
                {
                  path: `/sites/${e}`,
                  method: "DELETE",
                  secure: !0,
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "stats", {
          getStats: (e, t, n = {}) =>
            this.request(
              l(
                {
                  path: `/stats/${e}`,
                  method: "GET",
                  query: t,
                  type: "application/json",
                  format: "json",
                },
                n
              )
            ),
        }),
        d(this, "transfer", {
          exportArtrans: (e = {}) =>
            this.request(
              l(
                {
                  path: "/transfer/export",
                  method: "GET",
                  secure: !0,
                  format: "json",
                },
                e
              )
            ),
          importArtrans: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/transfer/import",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                },
                t
              )
            ),
          uploadArtrans: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/transfer/upload",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "multipart/form-data",
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "upload", {
          upload: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/upload",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "multipart/form-data",
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "user", {
          getUser: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/user",
                  method: "GET",
                  query: e,
                  secure: !0,
                  format: "json",
                },
                t
              )
            ),
          updateProfile: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/user",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          login: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/user/access_token",
                  method: "POST",
                  body: e,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          getUserStatus: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/user/status",
                  method: "GET",
                  query: e,
                  secure: !0,
                  format: "json",
                },
                t
              )
            ),
        }),
        d(this, "users", {
          createUser: (e, t = {}) =>
            this.request(
              l(
                {
                  path: "/users",
                  method: "POST",
                  body: e,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                t
              )
            ),
          updateUser: (e, t, n = {}) =>
            this.request(
              l(
                {
                  path: `/users/${e}`,
                  method: "PUT",
                  body: t,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                n
              )
            ),
          deleteUser: (e, t = {}) =>
            this.request(
              l(
                {
                  path: `/users/${e}`,
                  method: "DELETE",
                  secure: !0,
                  format: "json",
                },
                t
              )
            ),
          getUsers: (e, t, n = {}) =>
            this.request(
              l(
                {
                  path: `/users/${e}`,
                  method: "GET",
                  query: t,
                  secure: !0,
                  type: "application/json",
                  format: "json",
                },
                n
              )
            ),
        }),
        d(this, "version", {
          getVersion: (e = {}) =>
            this.request(
              l({ path: "/version", method: "GET", format: "json" }, e)
            ),
        }),
        d(this, "votes", {
          syncVotes: (e = {}) =>
            this.request(
              l(
                {
                  path: "/votes/sync",
                  method: "POST",
                  secure: !0,
                  format: "json",
                },
                e
              )
            ),
          vote: (e, t, n, s = {}) =>
            this.request(
              l(
                {
                  path: `/votes/${e}/${t}`,
                  method: "POST",
                  body: n,
                  type: "application/json",
                  format: "json",
                },
                s
              )
            ),
        });
    }
  };
  const g = (e, t, n) =>
    h(this, null, function* () {
      const s = e.getApiToken && e.getApiToken(),
        i = new Headers(
          l(
            { Authorization: s ? `Bearer ${s}` : "" },
            null == n ? void 0 : n.headers
          )
        );
      i.get("Authorization") || i.delete("Authorization");
      const r = yield fetch(t, c(l({}, n), { headers: i }));
      if (!r.ok) {
        const s = (yield r.json().catch(() => {})) || {};
        let i = !1;
        if (
          (e.handlers &&
            (yield e.handlers.get().reduce(
              (e, t) =>
                h(this, null, function* () {
                  yield e, !0 === s[t.action] && (yield t.handler(s), (i = !0));
                }),
              Promise.resolve()
            )),
          i)
        )
          return g(e, t, n);
        throw (function (e, t) {
          const n = new m();
          return (
            (n.message = t.msg || t.message || "fetch error"),
            (n.code = e),
            (n.data = t),
            console.error(n),
            n
          );
        })(r.status, s);
      }
      return r;
    });
  class m extends Error {
    constructor() {
      super(...arguments),
        d(this, "code", 0),
        d(this, "message", "fetch error"),
        d(this, "data");
    }
  }
  class f extends p {
    constructor(e) {
      super({ baseUrl: e.baseURL, customFetch: (t, n) => g(e, t, n) }),
        d(this, "_opts"),
        (this._opts = e);
    }
    getUserFields() {
      const e = this._opts.userInfo;
      if ((null == e ? void 0 : e.name) && (null == e ? void 0 : e.email))
        return { name: e.name, email: e.email };
    }
  }
  function k() {
    return {
      async: !1,
      breaks: !1,
      extensions: null,
      gfm: !0,
      hooks: null,
      pedantic: !1,
      renderer: null,
      silent: !1,
      tokenizer: null,
      walkTokens: null,
    };
  }
  let y = {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null,
  };
  function $(e) {
    y = e;
  }
  const v = /[&<>"']/,
    w = new RegExp(v.source, "g"),
    b = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    x = new RegExp(b.source, "g"),
    C = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" },
    E = (e) => C[e];
  function S(e, t) {
    if (t) {
      if (v.test(e)) return e.replace(w, E);
    } else if (b.test(e)) return e.replace(x, E);
    return e;
  }
  const T = /(^|[^\[])\^/g;
  function A(e, t) {
    let n = "string" == typeof e ? e : e.source;
    t = t || "";
    const s = {
      replace: (e, t) => {
        let i = "string" == typeof t ? t : t.source;
        return (i = i.replace(T, "$1")), (n = n.replace(e, i)), s;
      },
      getRegex: () => new RegExp(n, t),
    };
    return s;
  }
  function L(e) {
    try {
      e = encodeURI(e).replace(/%25/g, "%");
    } catch (t) {
      return null;
    }
    return e;
  }
  const M = { exec: () => null };
  function P(e, t) {
    const n = e
      .replace(/\|/g, (e, t, n) => {
        let s = !1,
          i = t;
        for (; --i >= 0 && "\\" === n[i]; ) s = !s;
        return s ? "|" : " |";
      })
      .split(/ \|/);
    let s = 0;
    if (
      (n[0].trim() || n.shift(),
      n.length > 0 && !n[n.length - 1].trim() && n.pop(),
      t)
    )
      if (n.length > t) n.splice(t);
      else for (; n.length < t; ) n.push("");
    for (; s < n.length; s++) n[s] = n[s].trim().replace(/\\\|/g, "|");
    return n;
  }
  function I(e, t, n) {
    const s = e.length;
    if (0 === s) return "";
    let i = 0;
    for (; i < s; ) {
      const r = e.charAt(s - i - 1);
      if (r !== t || n) {
        if (r === t || !n) break;
        i++;
      } else i++;
    }
    return e.slice(0, s - i);
  }
  function R(e, t, n, s) {
    const i = t.href,
      r = t.title ? S(t.title) : null,
      o = e[1].replace(/\\([\[\]])/g, "$1");
    if ("!" !== e[0].charAt(0)) {
      s.state.inLink = !0;
      const e = {
        type: "link",
        raw: n,
        href: i,
        title: r,
        text: o,
        tokens: s.inlineTokens(o),
      };
      return (s.state.inLink = !1), e;
    }
    return { type: "image", raw: n, href: i, title: r, text: S(o) };
  }
  class U {
    constructor(e) {
      d(this, "options"),
        d(this, "rules"),
        d(this, "lexer"),
        (this.options = e || y);
    }
    space(e) {
      const t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      const t = this.rules.block.code.exec(e);
      if (t) {
        const e = t[0].replace(/^(?: {1,4}| {0,3}\t)/gm, "");
        return {
          type: "code",
          raw: t[0],
          codeBlockStyle: "indented",
          text: this.options.pedantic ? e : I(e, "\n"),
        };
      }
    }
    fences(e) {
      const t = this.rules.block.fences.exec(e);
      if (t) {
        const e = t[0],
          n = (function (e, t) {
            const n = e.match(/^(\s+)(?:```)/);
            if (null === n) return t;
            const s = n[1];
            return t
              .split("\n")
              .map((e) => {
                const t = e.match(/^\s+/);
                if (null === t) return e;
                const [n] = t;
                return n.length >= s.length ? e.slice(s.length) : e;
              })
              .join("\n");
          })(e, t[3] || "");
        return {
          type: "code",
          raw: e,
          lang: t[2]
            ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1")
            : t[2],
          text: n,
        };
      }
    }
    heading(e) {
      const t = this.rules.block.heading.exec(e);
      if (t) {
        let e = t[2].trim();
        if (/#$/.test(e)) {
          const t = I(e, "#");
          this.options.pedantic
            ? (e = t.trim())
            : (t && !/ $/.test(t)) || (e = t.trim());
        }
        return {
          type: "heading",
          raw: t[0],
          depth: t[1].length,
          text: e,
          tokens: this.lexer.inline(e),
        };
      }
    }
    hr(e) {
      const t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: I(t[0], "\n") };
    }
    blockquote(e) {
      const t = this.rules.block.blockquote.exec(e);
      if (t) {
        let e = I(t[0], "\n").split("\n"),
          n = "",
          s = "";
        const i = [];
        for (; e.length > 0; ) {
          let t = !1;
          const r = [];
          let o;
          for (o = 0; o < e.length; o++)
            if (/^ {0,3}>/.test(e[o])) r.push(e[o]), (t = !0);
            else {
              if (t) break;
              r.push(e[o]);
            }
          e = e.slice(o);
          const a = r.join("\n"),
            l = a
              .replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, "\n    $1")
              .replace(/^ {0,3}>[ \t]?/gm, "");
          (n = n ? `${n}\n${a}` : a), (s = s ? `${s}\n${l}` : l);
          const c = this.lexer.state.top;
          if (
            ((this.lexer.state.top = !0),
            this.lexer.blockTokens(l, i, !0),
            (this.lexer.state.top = c),
            0 === e.length)
          )
            break;
          const d = i[i.length - 1];
          if ("code" === (null == d ? void 0 : d.type)) break;
          if ("blockquote" === (null == d ? void 0 : d.type)) {
            const t = d,
              r = t.raw + "\n" + e.join("\n"),
              o = this.blockquote(r);
            (i[i.length - 1] = o),
              (n = n.substring(0, n.length - t.raw.length) + o.raw),
              (s = s.substring(0, s.length - t.text.length) + o.text);
            break;
          }
          if ("list" !== (null == d ? void 0 : d.type));
          else {
            const t = d,
              r = t.raw + "\n" + e.join("\n"),
              o = this.list(r);
            (i[i.length - 1] = o),
              (n = n.substring(0, n.length - d.raw.length) + o.raw),
              (s = s.substring(0, s.length - t.raw.length) + o.raw),
              (e = r.substring(i[i.length - 1].raw.length).split("\n"));
          }
        }
        return { type: "blockquote", raw: n, tokens: i, text: s };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim();
        const s = n.length > 1,
          i = {
            type: "list",
            raw: "",
            ordered: s,
            start: s ? +n.slice(0, -1) : "",
            loose: !1,
            items: [],
          };
        (n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`),
          this.options.pedantic && (n = s ? n : "[*+-]");
        const r = new RegExp(`^( {0,3}${n})((?:[\t ][^\\n]*)?(?:\\n|$))`);
        let o = !1;
        for (; e; ) {
          let n = !1,
            s = "",
            a = "";
          if (!(t = r.exec(e))) break;
          if (this.rules.block.hr.test(e)) break;
          (s = t[0]), (e = e.substring(s.length));
          let l = t[2]
              .split("\n", 1)[0]
              .replace(/^\t+/, (e) => " ".repeat(3 * e.length)),
            c = e.split("\n", 1)[0],
            d = !l.trim(),
            h = 0;
          if (
            (this.options.pedantic
              ? ((h = 2), (a = l.trimStart()))
              : d
              ? (h = t[1].length + 1)
              : ((h = t[2].search(/[^ ]/)),
                (h = h > 4 ? 1 : h),
                (a = l.slice(h)),
                (h += t[1].length)),
            d &&
              /^[ \t]*$/.test(c) &&
              ((s += c + "\n"), (e = e.substring(c.length + 1)), (n = !0)),
            !n)
          ) {
            const t = new RegExp(
                `^ {0,${Math.min(
                  3,
                  h - 1
                )}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`
              ),
              n = new RegExp(
                `^ {0,${Math.min(
                  3,
                  h - 1
                )}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`
              ),
              i = new RegExp(`^ {0,${Math.min(3, h - 1)}}(?:\`\`\`|~~~)`),
              r = new RegExp(`^ {0,${Math.min(3, h - 1)}}#`),
              o = new RegExp(`^ {0,${Math.min(3, h - 1)}}<[a-z].*>`, "i");
            for (; e; ) {
              const u = e.split("\n", 1)[0];
              let p;
              if (
                ((c = u),
                this.options.pedantic
                  ? ((c = c.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), (p = c))
                  : (p = c.replace(/\t/g, "    ")),
                i.test(c))
              )
                break;
              if (r.test(c)) break;
              if (o.test(c)) break;
              if (t.test(c)) break;
              if (n.test(c)) break;
              if (p.search(/[^ ]/) >= h || !c.trim()) a += "\n" + p.slice(h);
              else {
                if (d) break;
                if (l.replace(/\t/g, "    ").search(/[^ ]/) >= 4) break;
                if (i.test(l)) break;
                if (r.test(l)) break;
                if (n.test(l)) break;
                a += "\n" + c;
              }
              d || c.trim() || (d = !0),
                (s += u + "\n"),
                (e = e.substring(u.length + 1)),
                (l = p.slice(h));
            }
          }
          i.loose ||
            (o ? (i.loose = !0) : /\n[ \t]*\n[ \t]*$/.test(s) && (o = !0));
          let u,
            p = null;
          this.options.gfm &&
            ((p = /^\[[ xX]\] /.exec(a)),
            p && ((u = "[ ] " !== p[0]), (a = a.replace(/^\[[ xX]\] +/, "")))),
            i.items.push({
              type: "list_item",
              raw: s,
              task: !!p,
              checked: u,
              loose: !1,
              text: a,
              tokens: [],
            }),
            (i.raw += s);
        }
        (i.items[i.items.length - 1].raw =
          i.items[i.items.length - 1].raw.trimEnd()),
          (i.items[i.items.length - 1].text =
            i.items[i.items.length - 1].text.trimEnd()),
          (i.raw = i.raw.trimEnd());
        for (let e = 0; e < i.items.length; e++)
          if (
            ((this.lexer.state.top = !1),
            (i.items[e].tokens = this.lexer.blockTokens(i.items[e].text, [])),
            !i.loose)
          ) {
            const t = i.items[e].tokens.filter((e) => "space" === e.type),
              n = t.length > 0 && t.some((e) => /\n.*\n/.test(e.raw));
            i.loose = n;
          }
        if (i.loose)
          for (let e = 0; e < i.items.length; e++) i.items[e].loose = !0;
        return i;
      }
    }
    html(e) {
      const t = this.rules.block.html.exec(e);
      if (t) {
        return {
          type: "html",
          block: !0,
          raw: t[0],
          pre: "pre" === t[1] || "script" === t[1] || "style" === t[1],
          text: t[0],
        };
      }
    }
    def(e) {
      const t = this.rules.block.def.exec(e);
      if (t) {
        const e = t[1].toLowerCase().replace(/\s+/g, " "),
          n = t[2]
            ? t[2]
                .replace(/^<(.*)>$/, "$1")
                .replace(this.rules.inline.anyPunctuation, "$1")
            : "",
          s = t[3]
            ? t[3]
                .substring(1, t[3].length - 1)
                .replace(this.rules.inline.anyPunctuation, "$1")
            : t[3];
        return { type: "def", tag: e, raw: t[0], href: n, title: s };
      }
    }
    table(e) {
      const t = this.rules.block.table.exec(e);
      if (!t) return;
      if (!/[:|]/.test(t[2])) return;
      const n = P(t[1]),
        s = t[2].replace(/^\||\| *$/g, "").split("|"),
        i =
          t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split("\n") : [],
        r = { type: "table", raw: t[0], header: [], align: [], rows: [] };
      if (n.length === s.length) {
        for (const e of s)
          /^ *-+: *$/.test(e)
            ? r.align.push("right")
            : /^ *:-+: *$/.test(e)
            ? r.align.push("center")
            : /^ *:-+ *$/.test(e)
            ? r.align.push("left")
            : r.align.push(null);
        for (let e = 0; e < n.length; e++)
          r.header.push({
            text: n[e],
            tokens: this.lexer.inline(n[e]),
            header: !0,
            align: r.align[e],
          });
        for (const e of i)
          r.rows.push(
            P(e, r.header.length).map((e, t) => ({
              text: e,
              tokens: this.lexer.inline(e),
              header: !1,
              align: r.align[t],
            }))
          );
        return r;
      }
    }
    lheading(e) {
      const t = this.rules.block.lheading.exec(e);
      if (t)
        return {
          type: "heading",
          raw: t[0],
          depth: "=" === t[2].charAt(0) ? 1 : 2,
          text: t[1],
          tokens: this.lexer.inline(t[1]),
        };
    }
    paragraph(e) {
      const t = this.rules.block.paragraph.exec(e);
      if (t) {
        const e =
          "\n" === t[1].charAt(t[1].length - 1) ? t[1].slice(0, -1) : t[1];
        return {
          type: "paragraph",
          raw: t[0],
          text: e,
          tokens: this.lexer.inline(e),
        };
      }
    }
    text(e) {
      const t = this.rules.block.text.exec(e);
      if (t)
        return {
          type: "text",
          raw: t[0],
          text: t[0],
          tokens: this.lexer.inline(t[0]),
        };
    }
    escape(e) {
      const t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: S(t[1]) };
    }
    tag(e) {
      const t = this.rules.inline.tag.exec(e);
      if (t)
        return (
          !this.lexer.state.inLink && /^<a /i.test(t[0])
            ? (this.lexer.state.inLink = !0)
            : this.lexer.state.inLink &&
              /^<\/a>/i.test(t[0]) &&
              (this.lexer.state.inLink = !1),
          !this.lexer.state.inRawBlock &&
          /^<(pre|code|kbd|script)(\s|>)/i.test(t[0])
            ? (this.lexer.state.inRawBlock = !0)
            : this.lexer.state.inRawBlock &&
              /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) &&
              (this.lexer.state.inRawBlock = !1),
          {
            type: "html",
            raw: t[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            block: !1,
            text: t[0],
          }
        );
    }
    link(e) {
      const t = this.rules.inline.link.exec(e);
      if (t) {
        const e = t[2].trim();
        if (!this.options.pedantic && /^</.test(e)) {
          if (!/>$/.test(e)) return;
          const t = I(e.slice(0, -1), "\\");
          if ((e.length - t.length) % 2 == 0) return;
        } else {
          const e = (function (e, t) {
            if (-1 === e.indexOf(t[1])) return -1;
            let n = 0;
            for (let s = 0; s < e.length; s++)
              if ("\\" === e[s]) s++;
              else if (e[s] === t[0]) n++;
              else if (e[s] === t[1] && (n--, n < 0)) return s;
            return -1;
          })(t[2], "()");
          if (e > -1) {
            const n = (0 === t[0].indexOf("!") ? 5 : 4) + t[1].length + e;
            (t[2] = t[2].substring(0, e)),
              (t[0] = t[0].substring(0, n).trim()),
              (t[3] = "");
          }
        }
        let n = t[2],
          s = "";
        if (this.options.pedantic) {
          const e = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);
          e && ((n = e[1]), (s = e[3]));
        } else s = t[3] ? t[3].slice(1, -1) : "";
        return (
          (n = n.trim()),
          /^</.test(n) &&
            (n =
              this.options.pedantic && !/>$/.test(e)
                ? n.slice(1)
                : n.slice(1, -1)),
          R(
            t,
            {
              href: n ? n.replace(this.rules.inline.anyPunctuation, "$1") : n,
              title: s ? s.replace(this.rules.inline.anyPunctuation, "$1") : s,
            },
            t[0],
            this.lexer
          )
        );
      }
    }
    reflink(e, t) {
      let n;
      if (
        (n = this.rules.inline.reflink.exec(e)) ||
        (n = this.rules.inline.nolink.exec(e))
      ) {
        const e = t[(n[2] || n[1]).replace(/\s+/g, " ").toLowerCase()];
        if (!e) {
          const e = n[0].charAt(0);
          return { type: "text", raw: e, text: e };
        }
        return R(n, e, n[0], this.lexer);
      }
    }
    emStrong(e, t, n = "") {
      let s = this.rules.inline.emStrongLDelim.exec(e);
      if (!s) return;
      if (s[3] && n.match(/[\p{L}\p{N}]/u)) return;
      if (
        !(s[1] || s[2] || "") ||
        !n ||
        this.rules.inline.punctuation.exec(n)
      ) {
        const n = [...s[0]].length - 1;
        let i,
          r,
          o = n,
          a = 0;
        const l =
          "*" === s[0][0]
            ? this.rules.inline.emStrongRDelimAst
            : this.rules.inline.emStrongRDelimUnd;
        for (
          l.lastIndex = 0, t = t.slice(-1 * e.length + n);
          null != (s = l.exec(t));

        ) {
          if (((i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6]), !i))
            continue;
          if (((r = [...i].length), s[3] || s[4])) {
            o += r;
            continue;
          }
          if ((s[5] || s[6]) && n % 3 && !((n + r) % 3)) {
            a += r;
            continue;
          }
          if (((o -= r), o > 0)) continue;
          r = Math.min(r, r + o + a);
          const t = [...s[0]][0].length,
            l = e.slice(0, n + s.index + t + r);
          if (Math.min(n, r) % 2) {
            const e = l.slice(1, -1);
            return {
              type: "em",
              raw: l,
              text: e,
              tokens: this.lexer.inlineTokens(e),
            };
          }
          const c = l.slice(2, -2);
          return {
            type: "strong",
            raw: l,
            text: c,
            tokens: this.lexer.inlineTokens(c),
          };
        }
      }
    }
    codespan(e) {
      const t = this.rules.inline.code.exec(e);
      if (t) {
        let e = t[2].replace(/\n/g, " ");
        const n = /[^ ]/.test(e),
          s = /^ /.test(e) && / $/.test(e);
        return (
          n && s && (e = e.substring(1, e.length - 1)),
          (e = S(e, !0)),
          { type: "codespan", raw: t[0], text: e }
        );
      }
    }
    br(e) {
      const t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e) {
      const t = this.rules.inline.del.exec(e);
      if (t)
        return {
          type: "del",
          raw: t[0],
          text: t[2],
          tokens: this.lexer.inlineTokens(t[2]),
        };
    }
    autolink(e) {
      const t = this.rules.inline.autolink.exec(e);
      if (t) {
        let e, n;
        return (
          "@" === t[2]
            ? ((e = S(t[1])), (n = "mailto:" + e))
            : ((e = S(t[1])), (n = e)),
          {
            type: "link",
            raw: t[0],
            text: e,
            href: n,
            tokens: [{ type: "text", raw: e, text: e }],
          }
        );
      }
    }
    url(e) {
      var t, n;
      let s;
      if ((s = this.rules.inline.url.exec(e))) {
        let e, i;
        if ("@" === s[2]) (e = S(s[0])), (i = "mailto:" + e);
        else {
          let r;
          do {
            (r = s[0]),
              (s[0] =
                null !=
                (n =
                  null == (t = this.rules.inline._backpedal.exec(s[0]))
                    ? void 0
                    : t[0])
                  ? n
                  : "");
          } while (r !== s[0]);
          (e = S(s[0])), (i = "www." === s[1] ? "http://" + s[0] : s[0]);
        }
        return {
          type: "link",
          raw: s[0],
          text: e,
          href: i,
          tokens: [{ type: "text", raw: e, text: e }],
        };
      }
    }
    inlineText(e) {
      const t = this.rules.inline.text.exec(e);
      if (t) {
        let e;
        return (
          (e = this.lexer.state.inRawBlock ? t[0] : S(t[0])),
          { type: "text", raw: t[0], text: e }
        );
      }
    }
  }
  const q =
      /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
    _ = /(?:[*+-]|\d{1,9}[.)])/,
    O = A(
      /^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/
    )
      .replace(/bull/g, _)
      .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
      .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
      .replace(/blockquote/g, / {0,3}>/)
      .replace(/heading/g, / {0,3}#{1,6}/)
      .replace(/html/g, / {0,3}<[^\n>]+>\n/)
      .getRegex(),
    D =
      /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
    B = /(?!\s*\])(?:\\.|[^\[\]\\])+/,
    j = A(
      /^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/
    )
      .replace("label", B)
      .replace(
        "title",
        /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
      )
      .getRegex(),
    F = A(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/)
      .replace(/bull/g, _)
      .getRegex(),
    W =
      "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
    z = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
    N = A(
      "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))",
      "i"
    )
      .replace("comment", z)
      .replace("tag", W)
      .replace(
        "attribute",
        / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
      )
      .getRegex(),
    H = A(D)
      .replace("hr", q)
      .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
      .replace("|lheading", "")
      .replace("|table", "")
      .replace("blockquote", " {0,3}>")
      .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
      .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
      .replace(
        "html",
        "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
      )
      .replace("tag", W)
      .getRegex(),
    Q = {
      blockquote: A(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
        .replace("paragraph", H)
        .getRegex(),
      code: /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,
      def: j,
      fences:
        /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      hr: q,
      html: N,
      lheading: O,
      list: F,
      newline: /^(?:[ \t]*(?:\n|$))+/,
      paragraph: H,
      table: M,
      text: /^[^\n]+/,
    },
    V = A(
      "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
    )
      .replace("hr", q)
      .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
      .replace("blockquote", " {0,3}>")
      .replace("code", "(?: {4}| {0,3}\t)[^\\n]")
      .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
      .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
      .replace(
        "html",
        "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
      )
      .replace("tag", W)
      .getRegex(),
    G = c(l({}, Q), {
      table: V,
      paragraph: A(D)
        .replace("hr", q)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("|lheading", "")
        .replace("table", V)
        .replace("blockquote", " {0,3}>")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", W)
        .getRegex(),
    }),
    K = c(l({}, Q), {
      html: A(
        "^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))"
      )
        .replace("comment", z)
        .replace(
          /tag/g,
          "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b"
        )
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: M,
      lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      paragraph: A(D)
        .replace("hr", q)
        .replace("heading", " *#{1,6} *[^\n]")
        .replace("lheading", O)
        .replace("|table", "")
        .replace("blockquote", " {0,3}>")
        .replace("|fences", "")
        .replace("|list", "")
        .replace("|html", "")
        .replace("|tag", "")
        .getRegex(),
    }),
    Z = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    Y = /^( {2,}|\\)\n(?!\s*$)/,
    X = "\\p{P}\\p{S}",
    J = A(/^((?![*_])[\spunctuation])/, "u")
      .replace(/punctuation/g, X)
      .getRegex(),
    ee = A(
      /^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,
      "u"
    )
      .replace(/punct/g, X)
      .getRegex(),
    te = A(
      "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])",
      "gu"
    )
      .replace(/punct/g, X)
      .getRegex(),
    ne = A(
      "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])",
      "gu"
    )
      .replace(/punct/g, X)
      .getRegex(),
    se = A(/\\([punct])/, "gu")
      .replace(/punct/g, X)
      .getRegex(),
    ie = A(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
      .replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
      .replace(
        "email",
        /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
      )
      .getRegex(),
    re = A(z).replace("(?:--\x3e|$)", "--\x3e").getRegex(),
    oe = A(
      "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
    )
      .replace("comment", re)
      .replace(
        "attribute",
        /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
      )
      .getRegex(),
    ae = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,
    le = A(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/)
      .replace("label", ae)
      .replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/)
      .replace(
        "title",
        /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/
      )
      .getRegex(),
    ce = A(/^!?\[(label)\]\[(ref)\]/)
      .replace("label", ae)
      .replace("ref", B)
      .getRegex(),
    de = A(/^!?\[(ref)\](?:\[\])?/)
      .replace("ref", B)
      .getRegex(),
    he = {
      _backpedal: M,
      anyPunctuation: se,
      autolink: ie,
      blockSkip: /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,
      br: Y,
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      del: M,
      emStrongLDelim: ee,
      emStrongRDelimAst: te,
      emStrongRDelimUnd: ne,
      escape: Z,
      link: le,
      nolink: de,
      punctuation: J,
      reflink: ce,
      reflinkSearch: A("reflink|nolink(?!\\()", "g")
        .replace("reflink", ce)
        .replace("nolink", de)
        .getRegex(),
      tag: oe,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      url: M,
    },
    ue = c(l({}, he), {
      link: A(/^!?\[(label)\]\((.*?)\)/)
        .replace("label", ae)
        .getRegex(),
      reflink: A(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace("label", ae)
        .getRegex(),
    }),
    pe = c(l({}, he), {
      escape: A(Z).replace("])", "~|])").getRegex(),
      url: A(
        /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
        "i"
      )
        .replace(
          "email",
          /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/
        )
        .getRegex(),
      _backpedal:
        /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
    }),
    ge = c(l({}, pe), {
      br: A(Y).replace("{2,}", "*").getRegex(),
      text: A(pe.text)
        .replace("\\b_", "\\b_| {2,}\\n")
        .replace(/\{2,\}/g, "*")
        .getRegex(),
    }),
    me = { normal: Q, gfm: G, pedantic: K },
    fe = { normal: he, gfm: pe, breaks: ge, pedantic: ue };
  class ke {
    constructor(e) {
      d(this, "tokens"),
        d(this, "options"),
        d(this, "state"),
        d(this, "tokenizer"),
        d(this, "inlineQueue"),
        (this.tokens = []),
        (this.tokens.links = Object.create(null)),
        (this.options = e || y),
        (this.options.tokenizer = this.options.tokenizer || new U()),
        (this.tokenizer = this.options.tokenizer),
        (this.tokenizer.options = this.options),
        (this.tokenizer.lexer = this),
        (this.inlineQueue = []),
        (this.state = { inLink: !1, inRawBlock: !1, top: !0 });
      const t = { block: me.normal, inline: fe.normal };
      this.options.pedantic
        ? ((t.block = me.pedantic), (t.inline = fe.pedantic))
        : this.options.gfm &&
          ((t.block = me.gfm),
          this.options.breaks ? (t.inline = fe.breaks) : (t.inline = fe.gfm)),
        (this.tokenizer.rules = t);
    }
    static get rules() {
      return { block: me, inline: fe };
    }
    static lex(e, t) {
      return new ke(t).lex(e);
    }
    static lexInline(e, t) {
      return new ke(t).inlineTokens(e);
    }
    lex(e) {
      (e = e.replace(/\r\n|\r/g, "\n")), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        const e = this.inlineQueue[t];
        this.inlineTokens(e.src, e.tokens);
      }
      return (this.inlineQueue = []), this.tokens;
    }
    blockTokens(e, t = [], n = !1) {
      let s, i, r;
      for (
        this.options.pedantic &&
        (e = e.replace(/\t/g, "    ").replace(/^ +$/gm, ""));
        e;

      )
        if (
          !(
            this.options.extensions &&
            this.options.extensions.block &&
            this.options.extensions.block.some(
              (n) =>
                !!(s = n.call({ lexer: this }, e, t)) &&
                ((e = e.substring(s.raw.length)), t.push(s), !0)
            )
          )
        )
          if ((s = this.tokenizer.space(e)))
            (e = e.substring(s.raw.length)),
              1 === s.raw.length && t.length > 0
                ? (t[t.length - 1].raw += "\n")
                : t.push(s);
          else if ((s = this.tokenizer.code(e)))
            (e = e.substring(s.raw.length)),
              (i = t[t.length - 1]),
              !i || ("paragraph" !== i.type && "text" !== i.type)
                ? t.push(s)
                : ((i.raw += "\n" + s.raw),
                  (i.text += "\n" + s.text),
                  (this.inlineQueue[this.inlineQueue.length - 1].src = i.text));
          else if ((s = this.tokenizer.fences(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else if ((s = this.tokenizer.heading(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else if ((s = this.tokenizer.hr(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else if ((s = this.tokenizer.blockquote(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else if ((s = this.tokenizer.list(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else if ((s = this.tokenizer.html(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else if ((s = this.tokenizer.def(e)))
            (e = e.substring(s.raw.length)),
              (i = t[t.length - 1]),
              !i || ("paragraph" !== i.type && "text" !== i.type)
                ? this.tokens.links[s.tag] ||
                  (this.tokens.links[s.tag] = { href: s.href, title: s.title })
                : ((i.raw += "\n" + s.raw),
                  (i.text += "\n" + s.raw),
                  (this.inlineQueue[this.inlineQueue.length - 1].src = i.text));
          else if ((s = this.tokenizer.table(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else if ((s = this.tokenizer.lheading(e)))
            (e = e.substring(s.raw.length)), t.push(s);
          else {
            if (
              ((r = e),
              this.options.extensions && this.options.extensions.startBlock)
            ) {
              let t = 1 / 0;
              const n = e.slice(1);
              let s;
              this.options.extensions.startBlock.forEach((e) => {
                (s = e.call({ lexer: this }, n)),
                  "number" == typeof s && s >= 0 && (t = Math.min(t, s));
              }),
                t < 1 / 0 && t >= 0 && (r = e.substring(0, t + 1));
            }
            if (this.state.top && (s = this.tokenizer.paragraph(r)))
              (i = t[t.length - 1]),
                n && "paragraph" === (null == i ? void 0 : i.type)
                  ? ((i.raw += "\n" + s.raw),
                    (i.text += "\n" + s.text),
                    this.inlineQueue.pop(),
                    (this.inlineQueue[this.inlineQueue.length - 1].src =
                      i.text))
                  : t.push(s),
                (n = r.length !== e.length),
                (e = e.substring(s.raw.length));
            else if ((s = this.tokenizer.text(e)))
              (e = e.substring(s.raw.length)),
                (i = t[t.length - 1]),
                i && "text" === i.type
                  ? ((i.raw += "\n" + s.raw),
                    (i.text += "\n" + s.text),
                    this.inlineQueue.pop(),
                    (this.inlineQueue[this.inlineQueue.length - 1].src =
                      i.text))
                  : t.push(s);
            else if (e) {
              const t = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          }
      return (this.state.top = !0), t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    inlineTokens(e, t = []) {
      let n,
        s,
        i,
        r,
        o,
        a,
        l = e;
      if (this.tokens.links) {
        const e = Object.keys(this.tokens.links);
        if (e.length > 0)
          for (
            ;
            null != (r = this.tokenizer.rules.inline.reflinkSearch.exec(l));

          )
            e.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) &&
              (l =
                l.slice(0, r.index) +
                "[" +
                "a".repeat(r[0].length - 2) +
                "]" +
                l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; null != (r = this.tokenizer.rules.inline.blockSkip.exec(l)); )
        l =
          l.slice(0, r.index) +
          "[" +
          "a".repeat(r[0].length - 2) +
          "]" +
          l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      for (; null != (r = this.tokenizer.rules.inline.anyPunctuation.exec(l)); )
        l =
          l.slice(0, r.index) +
          "++" +
          l.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      for (; e; )
        if (
          (o || (a = ""),
          (o = !1),
          !(
            this.options.extensions &&
            this.options.extensions.inline &&
            this.options.extensions.inline.some(
              (s) =>
                !!(n = s.call({ lexer: this }, e, t)) &&
                ((e = e.substring(n.raw.length)), t.push(n), !0)
            )
          ))
        )
          if ((n = this.tokenizer.escape(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.tag(e)))
            (e = e.substring(n.raw.length)),
              (s = t[t.length - 1]),
              s && "text" === n.type && "text" === s.type
                ? ((s.raw += n.raw), (s.text += n.text))
                : t.push(n);
          else if ((n = this.tokenizer.link(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.reflink(e, this.tokens.links)))
            (e = e.substring(n.raw.length)),
              (s = t[t.length - 1]),
              s && "text" === n.type && "text" === s.type
                ? ((s.raw += n.raw), (s.text += n.text))
                : t.push(n);
          else if ((n = this.tokenizer.emStrong(e, l, a)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.codespan(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.br(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.del(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if ((n = this.tokenizer.autolink(e)))
            (e = e.substring(n.raw.length)), t.push(n);
          else if (this.state.inLink || !(n = this.tokenizer.url(e))) {
            if (
              ((i = e),
              this.options.extensions && this.options.extensions.startInline)
            ) {
              let t = 1 / 0;
              const n = e.slice(1);
              let s;
              this.options.extensions.startInline.forEach((e) => {
                (s = e.call({ lexer: this }, n)),
                  "number" == typeof s && s >= 0 && (t = Math.min(t, s));
              }),
                t < 1 / 0 && t >= 0 && (i = e.substring(0, t + 1));
            }
            if ((n = this.tokenizer.inlineText(i)))
              (e = e.substring(n.raw.length)),
                "_" !== n.raw.slice(-1) && (a = n.raw.slice(-1)),
                (o = !0),
                (s = t[t.length - 1]),
                s && "text" === s.type
                  ? ((s.raw += n.raw), (s.text += n.text))
                  : t.push(n);
            else if (e) {
              const t = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          } else (e = e.substring(n.raw.length)), t.push(n);
      return t;
    }
  }
  class ye {
    constructor(e) {
      d(this, "options"), d(this, "parser"), (this.options = e || y);
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      var s;
      const i = null == (s = (t || "").match(/^\S*/)) ? void 0 : s[0],
        r = e.replace(/\n$/, "") + "\n";
      return i
        ? '<pre><code class="language-' +
            S(i) +
            '">' +
            (n ? r : S(r, !0)) +
            "</code></pre>\n"
        : "<pre><code>" + (n ? r : S(r, !0)) + "</code></pre>\n";
    }
    blockquote({ tokens: e }) {
      return `<blockquote>\n${this.parser.parse(e)}</blockquote>\n`;
    }
    html({ text: e }) {
      return e;
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>\n`;
    }
    hr(e) {
      return "<hr>\n";
    }
    list(e) {
      const t = e.ordered,
        n = e.start;
      let s = "";
      for (let r = 0; r < e.items.length; r++) {
        const t = e.items[r];
        s += this.listitem(t);
      }
      const i = t ? "ol" : "ul";
      return (
        "<" +
        i +
        (t && 1 !== n ? ' start="' + n + '"' : "") +
        ">\n" +
        s +
        "</" +
        i +
        ">\n"
      );
    }
    listitem(e) {
      let t = "";
      if (e.task) {
        const n = this.checkbox({ checked: !!e.checked });
        e.loose
          ? e.tokens.length > 0 && "paragraph" === e.tokens[0].type
            ? ((e.tokens[0].text = n + " " + e.tokens[0].text),
              e.tokens[0].tokens &&
                e.tokens[0].tokens.length > 0 &&
                "text" === e.tokens[0].tokens[0].type &&
                (e.tokens[0].tokens[0].text =
                  n + " " + e.tokens[0].tokens[0].text))
            : e.tokens.unshift({ type: "text", raw: n + " ", text: n + " " })
          : (t += n + " ");
      }
      return (t += this.parser.parse(e.tokens, !!e.loose)), `<li>${t}</li>\n`;
    }
    checkbox({ checked: e }) {
      return (
        "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
      );
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>\n`;
    }
    table(e) {
      let t = "",
        n = "";
      for (let i = 0; i < e.header.length; i++)
        n += this.tablecell(e.header[i]);
      t += this.tablerow({ text: n });
      let s = "";
      for (let i = 0; i < e.rows.length; i++) {
        const t = e.rows[i];
        n = "";
        for (let e = 0; e < t.length; e++) n += this.tablecell(t[e]);
        s += this.tablerow({ text: n });
      }
      return (
        s && (s = `<tbody>${s}</tbody>`),
        "<table>\n<thead>\n" + t + "</thead>\n" + s + "</table>\n"
      );
    }
    tablerow({ text: e }) {
      return `<tr>\n${e}</tr>\n`;
    }
    tablecell(e) {
      const t = this.parser.parseInline(e.tokens),
        n = e.header ? "th" : "td";
      return (
        (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>\n`
      );
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${e}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, tokens: n }) {
      const s = this.parser.parseInline(n),
        i = L(e);
      if (null === i) return s;
      let r = '<a href="' + (e = i) + '"';
      return t && (r += ' title="' + t + '"'), (r += ">" + s + "</a>"), r;
    }
    image({ href: e, title: t, text: n }) {
      const s = L(e);
      if (null === s) return n;
      let i = `<img src="${(e = s)}" alt="${n}"`;
      return t && (i += ` title="${t}"`), (i += ">"), i;
    }
    text(e) {
      return "tokens" in e && e.tokens
        ? this.parser.parseInline(e.tokens)
        : e.text;
    }
  }
  class $e {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
  }
  class ve {
    constructor(e) {
      d(this, "options"),
        d(this, "renderer"),
        d(this, "textRenderer"),
        (this.options = e || y),
        (this.options.renderer = this.options.renderer || new ye()),
        (this.renderer = this.options.renderer),
        (this.renderer.options = this.options),
        (this.renderer.parser = this),
        (this.textRenderer = new $e());
    }
    static parse(e, t) {
      return new ve(t).parse(e);
    }
    static parseInline(e, t) {
      return new ve(t).parseInline(e);
    }
    parse(e, t = !0) {
      let n = "";
      for (let s = 0; s < e.length; s++) {
        const i = e[s];
        if (
          this.options.extensions &&
          this.options.extensions.renderers &&
          this.options.extensions.renderers[i.type]
        ) {
          const e = i,
            t = this.options.extensions.renderers[e.type].call(
              { parser: this },
              e
            );
          if (
            !1 !== t ||
            ![
              "space",
              "hr",
              "heading",
              "code",
              "table",
              "blockquote",
              "list",
              "html",
              "paragraph",
              "text",
            ].includes(e.type)
          ) {
            n += t || "";
            continue;
          }
        }
        const r = i;
        switch (r.type) {
          case "space":
            n += this.renderer.space(r);
            continue;
          case "hr":
            n += this.renderer.hr(r);
            continue;
          case "heading":
            n += this.renderer.heading(r);
            continue;
          case "code":
            n += this.renderer.code(r);
            continue;
          case "table":
            n += this.renderer.table(r);
            continue;
          case "blockquote":
            n += this.renderer.blockquote(r);
            continue;
          case "list":
            n += this.renderer.list(r);
            continue;
          case "html":
            n += this.renderer.html(r);
            continue;
          case "paragraph":
            n += this.renderer.paragraph(r);
            continue;
          case "text": {
            let i = r,
              o = this.renderer.text(i);
            for (; s + 1 < e.length && "text" === e[s + 1].type; )
              (i = e[++s]), (o += "\n" + this.renderer.text(i));
            n += t
              ? this.renderer.paragraph({
                  type: "paragraph",
                  raw: o,
                  text: o,
                  tokens: [{ type: "text", raw: o, text: o }],
                })
              : o;
            continue;
          }
          default: {
            const e = 'Token with "' + r.type + '" type was not found.';
            if (this.options.silent) return console.error(e), "";
            throw new Error(e);
          }
        }
      }
      return n;
    }
    parseInline(e, t) {
      t = t || this.renderer;
      let n = "";
      for (let s = 0; s < e.length; s++) {
        const i = e[s];
        if (
          this.options.extensions &&
          this.options.extensions.renderers &&
          this.options.extensions.renderers[i.type]
        ) {
          const e = this.options.extensions.renderers[i.type].call(
            { parser: this },
            i
          );
          if (
            !1 !== e ||
            ![
              "escape",
              "html",
              "link",
              "image",
              "strong",
              "em",
              "codespan",
              "br",
              "del",
              "text",
            ].includes(i.type)
          ) {
            n += e || "";
            continue;
          }
        }
        const r = i;
        switch (r.type) {
          case "escape":
          case "text":
            n += t.text(r);
            break;
          case "html":
            n += t.html(r);
            break;
          case "link":
            n += t.link(r);
            break;
          case "image":
            n += t.image(r);
            break;
          case "strong":
            n += t.strong(r);
            break;
          case "em":
            n += t.em(r);
            break;
          case "codespan":
            n += t.codespan(r);
            break;
          case "br":
            n += t.br(r);
            break;
          case "del":
            n += t.del(r);
            break;
          default: {
            const e = 'Token with "' + r.type + '" type was not found.';
            if (this.options.silent) return console.error(e), "";
            throw new Error(e);
          }
        }
      }
      return n;
    }
  }
  class we {
    constructor(e) {
      d(this, "options"), d(this, "block"), (this.options = e || y);
    }
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    provideLexer() {
      return this.block ? ke.lex : ke.lexInline;
    }
    provideParser() {
      return this.block ? ve.parse : ve.parseInline;
    }
  }
  d(
    we,
    "passThroughHooks",
    new Set(["preprocess", "postprocess", "processAllTokens"])
  );
  class be {
    constructor(...e) {
      d(this, "defaults", {
        async: !1,
        breaks: !1,
        extensions: null,
        gfm: !0,
        hooks: null,
        pedantic: !1,
        renderer: null,
        silent: !1,
        tokenizer: null,
        walkTokens: null,
      }),
        d(this, "options", this.setOptions),
        d(this, "parse", this.parseMarkdown(!0)),
        d(this, "parseInline", this.parseMarkdown(!1)),
        d(this, "Parser", ve),
        d(this, "Renderer", ye),
        d(this, "TextRenderer", $e),
        d(this, "Lexer", ke),
        d(this, "Tokenizer", U),
        d(this, "Hooks", we),
        this.use(...e);
    }
    walkTokens(e, t) {
      var n, s;
      let i = [];
      for (const r of e)
        switch (((i = i.concat(t.call(this, r))), r.type)) {
          case "table": {
            const e = r;
            for (const n of e.header)
              i = i.concat(this.walkTokens(n.tokens, t));
            for (const n of e.rows)
              for (const e of n) i = i.concat(this.walkTokens(e.tokens, t));
            break;
          }
          case "list": {
            const e = r;
            i = i.concat(this.walkTokens(e.items, t));
            break;
          }
          default: {
            const e = r;
            (
              null ==
              (s =
                null == (n = this.defaults.extensions) ? void 0 : n.childTokens)
                ? void 0
                : s[e.type]
            )
              ? this.defaults.extensions.childTokens[e.type].forEach((n) => {
                  const s = e[n].flat(1 / 0);
                  i = i.concat(this.walkTokens(s, t));
                })
              : e.tokens && (i = i.concat(this.walkTokens(e.tokens, t)));
          }
        }
      return i;
    }
    use(...e) {
      const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return (
        e.forEach((e) => {
          const n = l({}, e);
          if (
            ((n.async = this.defaults.async || n.async || !1),
            e.extensions &&
              (e.extensions.forEach((e) => {
                if (!e.name) throw new Error("extension name required");
                if ("renderer" in e) {
                  const n = t.renderers[e.name];
                  t.renderers[e.name] = n
                    ? function (...t) {
                        let s = e.renderer.apply(this, t);
                        return !1 === s && (s = n.apply(this, t)), s;
                      }
                    : e.renderer;
                }
                if ("tokenizer" in e) {
                  if (!e.level || ("block" !== e.level && "inline" !== e.level))
                    throw new Error(
                      "extension level must be 'block' or 'inline'"
                    );
                  const n = t[e.level];
                  n ? n.unshift(e.tokenizer) : (t[e.level] = [e.tokenizer]),
                    e.start &&
                      ("block" === e.level
                        ? t.startBlock
                          ? t.startBlock.push(e.start)
                          : (t.startBlock = [e.start])
                        : "inline" === e.level &&
                          (t.startInline
                            ? t.startInline.push(e.start)
                            : (t.startInline = [e.start])));
                }
                "childTokens" in e &&
                  e.childTokens &&
                  (t.childTokens[e.name] = e.childTokens);
              }),
              (n.extensions = t)),
            e.renderer)
          ) {
            const t = this.defaults.renderer || new ye(this.defaults);
            for (const n in e.renderer) {
              if (!(n in t)) throw new Error(`renderer '${n}' does not exist`);
              if (["options", "parser"].includes(n)) continue;
              const s = n,
                i = e.renderer[s],
                r = t[s];
              t[s] = (...e) => {
                let n = i.apply(t, e);
                return !1 === n && (n = r.apply(t, e)), n || "";
              };
            }
            n.renderer = t;
          }
          if (e.tokenizer) {
            const t = this.defaults.tokenizer || new U(this.defaults);
            for (const n in e.tokenizer) {
              if (!(n in t)) throw new Error(`tokenizer '${n}' does not exist`);
              if (["options", "rules", "lexer"].includes(n)) continue;
              const s = n,
                i = e.tokenizer[s],
                r = t[s];
              t[s] = (...e) => {
                let n = i.apply(t, e);
                return !1 === n && (n = r.apply(t, e)), n;
              };
            }
            n.tokenizer = t;
          }
          if (e.hooks) {
            const t = this.defaults.hooks || new we();
            for (const n in e.hooks) {
              if (!(n in t)) throw new Error(`hook '${n}' does not exist`);
              if (["options", "block"].includes(n)) continue;
              const s = n,
                i = e.hooks[s],
                r = t[s];
              we.passThroughHooks.has(n)
                ? (t[s] = (e) => {
                    if (this.defaults.async)
                      return Promise.resolve(i.call(t, e)).then((e) =>
                        r.call(t, e)
                      );
                    const n = i.call(t, e);
                    return r.call(t, n);
                  })
                : (t[s] = (...e) => {
                    let n = i.apply(t, e);
                    return !1 === n && (n = r.apply(t, e)), n;
                  });
            }
            n.hooks = t;
          }
          if (e.walkTokens) {
            const t = this.defaults.walkTokens,
              s = e.walkTokens;
            n.walkTokens = function (e) {
              let n = [];
              return (
                n.push(s.call(this, e)), t && (n = n.concat(t.call(this, e))), n
              );
            };
          }
          this.defaults = l(l({}, this.defaults), n);
        }),
        this
      );
    }
    setOptions(e) {
      return (this.defaults = l(l({}, this.defaults), e)), this;
    }
    lexer(e, t) {
      return ke.lex(e, null != t ? t : this.defaults);
    }
    parser(e, t) {
      return ve.parse(e, null != t ? t : this.defaults);
    }
    parseMarkdown(e) {
      return (t, n) => {
        const s = l({}, n),
          i = l(l({}, this.defaults), s),
          r = this.onError(!!i.silent, !!i.async);
        if (!0 === this.defaults.async && !1 === s.async)
          return r(
            new Error(
              "marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."
            )
          );
        if (null == t)
          return r(new Error("marked(): input parameter is undefined or null"));
        if ("string" != typeof t)
          return r(
            new Error(
              "marked(): input parameter is of type " +
                Object.prototype.toString.call(t) +
                ", string expected"
            )
          );
        i.hooks && ((i.hooks.options = i), (i.hooks.block = e));
        const o = i.hooks ? i.hooks.provideLexer() : e ? ke.lex : ke.lexInline,
          a = i.hooks ? i.hooks.provideParser() : e ? ve.parse : ve.parseInline;
        if (i.async)
          return Promise.resolve(i.hooks ? i.hooks.preprocess(t) : t)
            .then((e) => o(e, i))
            .then((e) => (i.hooks ? i.hooks.processAllTokens(e) : e))
            .then((e) =>
              i.walkTokens
                ? Promise.all(this.walkTokens(e, i.walkTokens)).then(() => e)
                : e
            )
            .then((e) => a(e, i))
            .then((e) => (i.hooks ? i.hooks.postprocess(e) : e))
            .catch(r);
        try {
          i.hooks && (t = i.hooks.preprocess(t));
          let e = o(t, i);
          i.hooks && (e = i.hooks.processAllTokens(e)),
            i.walkTokens && this.walkTokens(e, i.walkTokens);
          let n = a(e, i);
          return i.hooks && (n = i.hooks.postprocess(n)), n;
        } catch (c) {
          return r(c);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (
          ((n.message +=
            "\nPlease report this to https://github.com/markedjs/marked."),
          e)
        ) {
          const e =
            "<p>An error occurred:</p><pre>" + S(n.message + "", !0) + "</pre>";
          return t ? Promise.resolve(e) : e;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  }
  const xe = new be();
  function Ce(e, t) {
    return xe.parse(e, t);
  }
  (Ce.options = Ce.setOptions =
    function (e) {
      return xe.setOptions(e), (Ce.defaults = xe.defaults), $(Ce.defaults), Ce;
    }),
    (Ce.getDefaults = k),
    (Ce.defaults = y),
    (Ce.use = function (...e) {
      return xe.use(...e), (Ce.defaults = xe.defaults), $(Ce.defaults), Ce;
    }),
    (Ce.walkTokens = function (e, t) {
      return xe.walkTokens(e, t);
    }),
    (Ce.parseInline = xe.parseInline),
    (Ce.Parser = ve),
    (Ce.parser = ve.parse),
    (Ce.Renderer = ye),
    (Ce.TextRenderer = $e),
    (Ce.Lexer = ke),
    (Ce.lexer = ke.lex),
    (Ce.Tokenizer = U),
    (Ce.Hooks = we),
    (Ce.parse = Ce),
    Ce.options,
    Ce.setOptions,
    Ce.use,
    Ce.walkTokens,
    Ce.parseInline,
    ve.parse,
    ke.lex;
  "undefined" != typeof globalThis
    ? globalThis
    : "undefined" != typeof window
    ? window
    : "undefined" != typeof global
    ? global
    : "undefined" != typeof self && self;
  function Ee(e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, "default")
      ? e.default
      : e;
  }
  var Se = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    },
    Te = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
    },
    Ae = /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    Le = /[&<>"']/g;
  function Me(e) {
    return Se[e];
  }
  function Pe(e) {
    return Te[e];
  }
  function Ie(e) {
    return null == e ? "" : String(e).replace(Le, Me);
  }
  function Re(e) {
    return null == e ? "" : String(e).replace(Ae, Pe);
  }
  Ie.options = Re.options = {};
  var Ue = {
    encode: Ie,
    escape: Ie,
    decode: Re,
    unescape: Re,
    version: "1.0.0-browser",
  };
  var qe = function e(t) {
      for (var n, s, i = Array.prototype.slice.call(arguments, 1); i.length; )
        for (s in (n = i.shift()))
          n.hasOwnProperty(s) &&
            ("[object Object]" === Object.prototype.toString.call(t[s])
              ? (t[s] = e(t[s], n[s]))
              : (t[s] = n[s]));
      return t;
    },
    _e = function (e) {
      return "string" == typeof e ? e.toLowerCase() : e;
    };
  function Oe(e, t) {
    return (e[t] = !0), e;
  }
  var De = function (e) {
      return e.reduce(Oe, {});
    },
    Be = {
      uris: De([
        "background",
        "base",
        "cite",
        "href",
        "longdesc",
        "src",
        "usemap",
      ]),
    },
    je = {
      voids: De([
        "area",
        "br",
        "col",
        "hr",
        "img",
        "wbr",
        "input",
        "base",
        "basefont",
        "link",
        "meta",
      ]),
    },
    Fe = Ue,
    We = _e,
    ze = je,
    Ne =
      /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
    He = /^<\s*\/\s*([\w:-]+)[^>]*>/,
    Qe =
      /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
    Ve = /^</,
    Ge = /^<\s*\//;
  var Ke = Ue,
    Ze = _e,
    Ye = Be,
    Xe = je;
  var Je = qe,
    et = function (e, t) {
      for (
        var n,
          s = (function () {
            var e = [];
            return (
              (e.lastItem = function () {
                return e[e.length - 1];
              }),
              e
            );
          })(),
          i = e;
        e;

      )
        r();
      function r() {
        (n = !0),
          (function () {
            "\x3c!--" === e.substr(0, 4)
              ? (s = e.indexOf("--\x3e")) >= 0 &&
                (t.comment && t.comment(e.substring(4, s)),
                (e = e.substring(s + 3)),
                (n = !1))
              : Ge.test(e)
              ? o(He, l)
              : Ve.test(e) && o(Ne, a);
            var s;
            !(function () {
              if (!n) return;
              var s,
                i = e.indexOf("<");
              i >= 0
                ? ((s = e.substring(0, i)), (e = e.substring(i)))
                : ((s = e), (e = ""));
              t.chars && t.chars(s);
            })();
          })();
        var s = e === i;
        (i = e), s && (e = "");
      }
      function o(t, s) {
        var i = e.match(t);
        i && ((e = e.substring(i[0].length)), i[0].replace(t, s), (n = !1));
      }
      function a(e, n, i, r) {
        var o = {},
          a = We(n),
          l = ze.voids[a] || !!r;
        i.replace(Qe, function (e, t, n, s, i) {
          o[t] =
            void 0 === n && void 0 === s && void 0 === i
              ? void 0
              : Fe.decode(n || s || i || "");
        }),
          l || s.push(a),
          t.start && t.start(a, o, l);
      }
      function l(e, n) {
        var i,
          r = 0,
          o = We(n);
        if (o) for (r = s.length - 1; r >= 0 && s[r] !== o; r--);
        if (r >= 0) {
          for (i = s.length - 1; i >= r; i--) t.end && t.end(s[i]);
          s.length = r;
        }
      }
      l();
    },
    tt = function (e, t) {
      var n,
        s = t || {};
      return (
        a(),
        {
          start: function (e, t, o) {
            var a = Ze(e);
            if (n.ignoring) return void r(a);
            if (-1 === (s.allowedTags || []).indexOf(a)) return void r(a);
            if (s.filter && !s.filter({ tag: a, attrs: t })) return void r(a);
            i("<"),
              i(a),
              Object.keys(t).forEach(function (e) {
                var n = t[e],
                  r = (s.allowedClasses || {})[a] || [],
                  o = (s.allowedAttributes || {})[a] || [],
                  l = Ze(e);
                ("class" === l && -1 === o.indexOf(l)
                  ? (n = n
                      .split(" ")
                      .filter(function (e) {
                        return r && -1 !== r.indexOf(e);
                      })
                      .join(" ")
                      .trim()).length
                  : -1 !== o.indexOf(l) &&
                    (!0 !== Ye.uris[l] ||
                      (function (e) {
                        var t = e[0];
                        if ("#" === t || "/" === t) return !0;
                        var n = e.indexOf(":");
                        if (-1 === n) return !0;
                        var i = e.indexOf("?");
                        if (-1 !== i && n > i) return !0;
                        var r = e.indexOf("#");
                        return (-1 !== r && n > r) || s.allowedSchemes.some(o);
                        function o(t) {
                          return 0 === e.indexOf(t + ":");
                        }
                      })(n))) &&
                  (i(" "),
                  i(e),
                  "string" == typeof n && (i('="'), i(Ke.encode(n)), i('"')));
              }),
              i(o ? "/>" : ">");
          },
          end: function (e) {
            var t = Ze(e);
            -1 !== (s.allowedTags || []).indexOf(t) && !1 === n.ignoring
              ? (i("</"), i(t), i(">"))
              : o(t);
          },
          chars: function (e) {
            !1 === n.ignoring && i(s.transformText ? s.transformText(e) : e);
          },
        }
      );
      function i(t) {
        e.push(t);
      }
      function r(e) {
        Xe.voids[e] ||
          (!1 === n.ignoring
            ? (n = { ignoring: e, depth: 1 })
            : n.ignoring === e && n.depth++);
      }
      function o(e) {
        n.ignoring === e && --n.depth <= 0 && a();
      }
      function a() {
        n = { ignoring: !1, depth: 0 };
      }
    },
    nt = {
      allowedAttributes: {
        a: ["href", "name", "target", "title", "aria-label"],
        iframe: ["allowfullscreen", "frameborder", "src"],
        img: ["src", "alt", "title", "aria-label"],
      },
      allowedClasses: {},
      allowedSchemes: ["http", "https", "mailto"],
      allowedTags: [
        "a",
        "abbr",
        "article",
        "b",
        "blockquote",
        "br",
        "caption",
        "code",
        "del",
        "details",
        "div",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "i",
        "img",
        "ins",
        "kbd",
        "li",
        "main",
        "mark",
        "ol",
        "p",
        "pre",
        "section",
        "span",
        "strike",
        "strong",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "th",
        "thead",
        "tr",
        "u",
        "ul",
      ],
      filter: null,
    };
  function st(e, t, n) {
    var s = [],
      i = !0 === n ? t : Je({}, nt, t),
      r = tt(s, i);
    return et(e, r), s.join("");
  }
  st.defaults = nt;
  const it = Ee(st),
    rt = {
      allowedClasses: {},
      allowedSchemes: ["http", "https", "mailto", "data"],
      allowedTags: [
        "a",
        "abbr",
        "article",
        "b",
        "blockquote",
        "br",
        "caption",
        "code",
        "del",
        "details",
        "div",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "i",
        "img",
        "ins",
        "kbd",
        "li",
        "main",
        "mark",
        "ol",
        "p",
        "pre",
        "section",
        "span",
        "strike",
        "strong",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "th",
        "thead",
        "tr",
        "u",
        "ul",
      ],
      allowedAttributes: {
        "*": ["title", "accesskey"],
        a: ["href", "name", "target", "aria-label", "rel"],
        img: [
          "src",
          "alt",
          "title",
          "atk-emoticon",
          "aria-label",
          "data-src",
          "class",
          "loading",
        ],
        code: ["class"],
        span: ["class", "style"],
      },
      filter: (e) => (
        [
          ["code", /^hljs\W+language-(.*)$/],
          ["span", /^(hljs-.*)$/],
          ["img", /^lazyload$/],
        ].forEach(([t, n]) => {
          e.tag === t &&
            e.attrs.class &&
            !n.test(e.attrs.class) &&
            delete e.attrs.class;
        }),
        "span" === e.tag &&
          e.attrs.style &&
          !/^color:(\W+)?#[0-9a-f]{3,6};?$/i.test(e.attrs.style) &&
          delete e.attrs.style,
        !0
      ),
    };
  function ot(e) {
    return it(e, rt);
  }
  var at = { exports: {} };
  at.exports = (function () {
    function e(e, t) {
      return e((t = { exports: {} }), t.exports), t.exports;
    }
    var t = e(function (e) {
        var t = (e.exports = function () {
          return new RegExp(
            "(?:" + t.line().source + ")|(?:" + t.block().source + ")",
            "gm"
          );
        });
        (t.line = function () {
          return /(?:^|\s)\/\/(.+?)$/gm;
        }),
          (t.block = function () {
            return /\/\*([\S\s]*?)\*\//gm;
          });
      }),
      n = [
        "23AC69",
        "91C132",
        "F19726",
        "E8552D",
        "1AAB8E",
        "E1147F",
        "2980C1",
        "1BA1E6",
        "9FA0A0",
        "F19726",
        "E30B20",
        "E30B20",
        "A3338B",
      ];
    function s(e) {
      return '<span style="color: slategray">' + e + "</span>";
    }
    return function (e, i) {
      void 0 === i && (i = {});
      var r = i.colors;
      void 0 === r && (r = n);
      var o = 0,
        a = {},
        l = new RegExp(
          "(" +
            /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/
              .source +
            "|" +
            /</.source +
            ")|(" +
            t().source +
            ")",
          "gmi"
        );
      return e.replace(l, function (e, t, n) {
        if (n) return s(n);
        if ("<" === t) return "&lt;";
        var i;
        a[t] ? (i = a[t]) : ((i = r[o]), (a[t] = i));
        var l = '<span style="color: #' + i + '">' + t + "</span>";
        return (o = ++o % r.length), l;
      });
    };
  })();
  const lt = Ee(at.exports);
  function ct(e) {
    return lt(e);
  }
  function dt(e) {
    const t = new Ce.Renderer();
    return (
      (t.link = ht(t, t.link)),
      (t.code = ut()),
      (t.image = pt(t, t.image, e)),
      t
    );
  }
  const ht = (e, t) => (n) => {
      const s =
        ((e) => {
          try {
            return new URL(e).origin;
          } catch (t) {
            return "";
          }
        })(n.href) === window.location.origin;
      return t
        .call(e, n)
        .replace(
          /^<a /,
          `<a target="_blank" ${s ? "" : 'rel="noreferrer noopener nofollow"'} `
        );
    },
    ut =
      () =>
      ({ lang: e, text: t }) => {
        const n = e || "plaintext";
        let s = t;
        return (
          window.hljs
            ? n &&
              window.hljs.getLanguage(n) &&
              (s = window.hljs.highlight(n, t).value)
            : (s = ct(t)),
          `<pre rel="${n}">\n<code class="hljs language-${n}">${s.replace(
            /&amp;/g,
            "&"
          )}</code>\n</pre>`
        );
      },
    pt =
      (e, t, { imgLazyLoad: n }) =>
      (s) => {
        const i = t.call(e, s);
        return n
          ? "native" === n || !0 === n
            ? i.replace(/^<img /, '<img class="lazyload" loading="lazy" ')
            : "data-src" === n
            ? i
                .replace(/^<img /, '<img class="lazyload" ')
                .replace("src=", "data-src=")
            : i
          : i;
      };
  let gt,
    mt = [];
  const ft = { gfm: !0, breaks: !0, async: !1 };
  function kt() {
    return gt;
  }
  function yt(e) {
    var t;
    let n = null == (t = kt()) ? void 0 : t.parse(e);
    n ||
      (n = (function (e) {
        return e
          .replace(
            /```\s*([^]+?.*?[^]+?[^]+?)```/g,
            (e, t) => `<pre><code>${ct(t)}</code></pre>`
          )
          .replace(
            /!\[(.*?)\]\((.*?)\)/g,
            (e, t, n) => `<img src="${n}" alt="${t}" />`
          )
          .replace(
            /\[(.*?)\]\((.*?)\)/g,
            (e, t, n) => `<a href="${n}" target="_blank">${t}</a>`
          )
          .replace(/\n/g, "<br>");
      })(e));
    let s = ot(n);
    return (
      mt.forEach((e) => {
        "function" == typeof e && (s = e(s));
      }),
      s
    );
  }
  function $t(...e) {
    const t = (e) => e && "object" == typeof e && e.constructor === Object;
    return e.reduce(
      (e, n) => (
        Object.keys(null != n ? n : {}).forEach((s) => {
          if ("__proto__" === s || "constructor" === s || "prototype" === s)
            return;
          const i = e[s],
            r = n[s];
          Array.isArray(i) && Array.isArray(r)
            ? (e[s] = i.concat(...r))
            : t(i) && t(r)
            ? (e[s] = $t(i, r))
            : (e[s] = r);
        }),
        e
      ),
      {}
    );
  }
  class vt {
    constructor(e) {
      d(this, "loading", !1),
        d(this, "listLastFetch"),
        d(this, "comments", []),
        d(this, "notifies", []),
        d(this, "page"),
        (this.events = e);
    }
    getLoading() {
      return this.loading;
    }
    setLoading(e) {
      this.loading = e;
    }
    getListLastFetch() {
      return this.listLastFetch;
    }
    setListLastFetch(e) {
      this.listLastFetch = e;
    }
    getComments() {
      return this.comments;
    }
    fetchComments(e) {
      this.events.trigger("list-fetch", e);
    }
    findComment(e) {
      return this.comments.find((t) => t.id === e);
    }
    clearComments() {
      (this.comments = []), this.events.trigger("list-loaded", this.comments);
    }
    loadComments(e) {
      this.events.trigger("list-load", e),
        this.comments.push(...e),
        this.events.trigger("list-loaded", this.comments);
    }
    insertComment(e) {
      this.comments.push(e),
        this.events.trigger("comment-inserted", e),
        this.events.trigger("list-loaded", this.comments);
    }
    updateComment(e) {
      (this.comments = this.comments.map((t) => (t.id === e.id ? e : t))),
        this.events.trigger("comment-updated", e),
        this.events.trigger("list-loaded", this.comments);
    }
    deleteComment(e) {
      const t = this.comments.find((t) => t.id === e);
      if (!t) throw new Error(`Comment ${e} not found`);
      (this.comments = this.comments.filter((t) => t.id !== e)),
        this.events.trigger("comment-deleted", t),
        this.events.trigger("list-loaded", this.comments);
    }
    getNotifies() {
      return this.notifies;
    }
    updateNotifies(e) {
      (this.notifies = e),
        this.events.trigger("notifies-updated", this.notifies);
    }
    getPage() {
      return this.page;
    }
    updatePage(e) {
      (this.page = e), this.events.trigger("page-loaded", e);
    }
  }
  function wt(e = "") {
    const t = document.createElement("div");
    return (t.innerHTML = e.trim()), t.firstElementChild || t;
  }
  function bt(e) {
    const t = document.createElement("div");
    t.innerText = e;
    return t.innerHTML;
  }
  function xt(e) {
    const t = RegExp(`[?&]${e}=([^&]*)`).exec(window.location.search);
    return t && decodeURIComponent(t[1].replace(/\+/g, " "));
  }
  function Ct(e, t) {
    const n = (e) => {
        const t = e.getBoundingClientRect(),
          n = window.pageXOffset || document.documentElement.scrollLeft,
          s = window.pageYOffset || document.documentElement.scrollTop;
        return { top: t.top + s, left: t.left + n };
      },
      s = n(e);
    if (!t) return s;
    const i = n(t);
    return { top: s.top - i.top, left: s.left - i.left };
  }
  function Et(e, t) {
    let n = e.toString();
    for (; n.length < t; ) n = `0${n}`;
    return n;
  }
  function St(e, t = (e) => e) {
    try {
      const n = e.getTime(),
        s = new Date().getTime() - n,
        i = Math.floor(s / 864e5);
      if (0 === i) {
        const e = s % 864e5,
          n = Math.floor(e / 36e5);
        if (0 === n) {
          const n = e % 36e5,
            s = Math.floor(n / 6e4);
          if (0 === s) {
            const e = n % 6e4,
              s = Math.round(e / 1e3);
            return s < 10 ? t("now") : `${s} ${t("seconds")}`;
          }
          return `${s} ${t("minutes")}`;
        }
        return `${n} ${t("hours")}`;
      }
      return i < 0
        ? t("now")
        : i < 8
        ? `${i} ${t("days")}`
        : (function (e) {
            const t = Et(e.getDate(), 2),
              n = Et(e.getMonth() + 1, 2);
            return `${Et(e.getFullYear(), 2)}-${n}-${t}`;
          })(e);
    } catch (n) {
      return console.error(n), " - ";
    }
  }
  function Tt() {
    return h(this, null, function* () {
      const e = navigator.userAgent;
      if (
        !navigator.userAgentData ||
        !navigator.userAgentData.getHighEntropyValues
      )
        return e;
      const t = navigator.userAgentData;
      let n = null;
      try {
        n = yield t.getHighEntropyValues(["platformVersion"]);
      } catch (i) {
        return console.error(i), e;
      }
      const s = Number(n.platformVersion.split(".")[0]);
      return "Windows" === t.platform && s >= 13
        ? e.replace(/Windows NT 10.0/, "Windows NT 11.0")
        : "macOS" === t.platform && s >= 11
        ? e.replace(
            /(Mac OS X \d+_\d+_\d+|Mac OS X)/,
            `Mac OS X ${n.platformVersion.replace(/\./g, "_")}`
          )
        : e;
    });
  }
  function At(e) {
    let t;
    try {
      t = new URL(e);
    } catch (n) {
      return !1;
    }
    return "http:" === t.protocol || "https:" === t.protocol;
  }
  function Lt(e) {
    return (
      (t = e.base),
      (n = e.path),
      `${t.replace(/\/$/, "")}/${n.replace(/^\//, "")}`
    );
    var t, n;
  }
  const Mt = {
      placeholder: "Leave a comment",
      noComment: "No Comment",
      send: "Send",
      signIn: "Sign in",
      signUp: "Sign up",
      save: "Save",
      nick: "Nickname",
      email: "Email",
      link: "Website",
      emoticon: "Emoji",
      preview: "Preview",
      uploadImage: "Upload Image",
      uploadFail: "Upload Failed",
      commentFail: "Failed to comment",
      restoredMsg: "Content has been restored",
      onlyAdminCanReply: "Only admin can reply",
      uploadLoginMsg: "Please fill in your name and email to upload",
      counter: "{count} Comments",
      sortLatest: "Latest",
      sortOldest: "Oldest",
      sortBest: "Best",
      sortAuthor: "Author",
      openComment: "Open Comment",
      closeComment: "Close Comment",
      listLoadFailMsg: "Failed to load comments",
      listRetry: "Retry",
      loadMore: "Load More",
      admin: "Admin",
      reply: "Reply",
      voteUp: "Up",
      voteDown: "Down",
      voteFail: "Vote Failed",
      readMore: "Read More",
      actionConfirm: "Confirm",
      collapse: "Collapse",
      collapsed: "Collapsed",
      collapsedMsg: "This comment has been collapsed",
      expand: "Expand",
      approved: "Approved",
      pending: "Pending",
      pendingMsg: "Pending, visible only to commenter.",
      edit: "Edit",
      editCancel: "Cancel Edit",
      delete: "Delete",
      deleteConfirm: "Confirm",
      pin: "Pin",
      unpin: "Unpin",
      seconds: "seconds ago",
      minutes: "minutes ago",
      hours: "hours ago",
      days: "days ago",
      now: "just now",
      adminCheck: "Enter admin password:",
      captchaCheck: "Enter the CAPTCHA to continue:",
      confirm: "Confirm",
      cancel: "Cancel",
      msgCenter: "Messages",
      ctrlCenter: "Dashboard",
      userProfile: "Profile",
      noAccountPrompt: "Don't have an account?",
      haveAccountPrompt: "Already have an account?",
      forgetPassword: "Forget Password",
      resetPassword: "Reset Password",
      changePassword: "Change Password",
      confirmPassword: "Confirm Password",
      passwordMismatch: "Passwords do not match",
      verificationCode: "Verification Code",
      verifySend: "Send Code",
      verifyResend: "Resend",
      waitSeconds: "Wait {seconds}s",
      emailVerified: "Email has been verified",
      password: "Password",
      username: "Username",
      nextStep: "Next Step",
      skipVerify: "Skip verification",
      logoutConfirm: "Are you sure to logout?",
      accountMergeNotice: "Your email has multiple accounts with different id.",
      accountMergeSelectOne:
        "Please select one you want to merge all the data into it.",
      accountMergeConfirm:
        "All data will be merged into one account, the id is {id}.",
      dismiss: "Dismiss",
      merge: "Merge",
      frontend: "Frontend",
      backend: "Backend",
      loading: "Loading",
      loadFail: "Load Failed",
      editing: "Editing",
      editFail: "Edit Failed",
      deleting: "Deleting",
      deleteFail: "Delete Failed",
      reqGot: "Request got",
      reqAborted: "Request timed out or terminated unexpectedly",
      updateMsg: "Please update Artalk {name} to get the best experience!",
      currentVersion: "Current Version",
      ignore: "Ignore",
      open: "Open",
      openName: "Open {name}",
    },
    Pt = "ArtalkI18n",
    It = {
      en: Mt,
      "en-US": Mt,
      "zh-CN": {
        placeholder: "键入内容...",
        noComment: "「此时无声胜有声」",
        send: "发送",
        signIn: "登录",
        signUp: "注册",
        save: "保存",
        nick: "昵称",
        email: "邮箱",
        link: "网址",
        emoticon: "表情",
        preview: "预览",
        uploadImage: "上传图片",
        uploadFail: "上传失败",
        commentFail: "评论失败",
        restoredMsg: "内容已自动恢复",
        onlyAdminCanReply: "仅管理员可评论",
        uploadLoginMsg: "填入你的名字邮箱才能上传哦",
        counter: "{count} 条评论",
        sortLatest: "最新",
        sortOldest: "最早",
        sortBest: "最热",
        sortAuthor: "作者",
        openComment: "打开评论",
        closeComment: "关闭评论",
        listLoadFailMsg: "无法获取评论列表数据",
        listRetry: "点击重新获取",
        loadMore: "加载更多",
        admin: "管理员",
        reply: "回复",
        voteUp: "赞同",
        voteDown: "反对",
        voteFail: "投票失败",
        readMore: "阅读更多",
        actionConfirm: "确认操作",
        collapse: "折叠",
        collapsed: "已折叠",
        collapsedMsg: "该评论已被系统或管理员折叠",
        expand: "展开",
        approved: "已审",
        pending: "待审",
        pendingMsg: "审核中，仅本人可见。",
        edit: "编辑",
        editCancel: "取消编辑",
        delete: "删除",
        deleteConfirm: "确认删除",
        pin: "置顶",
        unpin: "取消置顶",
        seconds: "秒前",
        minutes: "分钟前",
        hours: "小时前",
        days: "天前",
        now: "刚刚",
        adminCheck: "键入密码来验证管理员身份：",
        captchaCheck: "键入验证码继续：",
        confirm: "确认",
        cancel: "取消",
        msgCenter: "通知中心",
        ctrlCenter: "控制中心",
        userProfile: "个人资料",
        noAccountPrompt: "没有账号？",
        haveAccountPrompt: "已有账号？",
        forgetPassword: "忘记密码",
        resetPassword: "重置密码",
        changePassword: "修改密码",
        confirmPassword: "确认密码",
        passwordMismatch: "两次输入的密码不一致",
        verificationCode: "验证码",
        verifySend: "发送验证码",
        verifyResend: "重新发送",
        waitSeconds: "等待 {seconds}秒",
        emailVerified: "邮箱已验证",
        password: "密码",
        username: "用户名",
        nextStep: "下一步",
        skipVerify: "跳过验证",
        logoutConfirm: "确定要退出登录吗？",
        accountMergeNotice: "您的电子邮件下有多个不同 ID 的账户。",
        accountMergeSelectOne: "请选择将所有数据合并到其中的一个。",
        accountMergeConfirm: "所有数据将合并到 ID 为 {id} 的账户中。",
        dismiss: "忽略",
        merge: "合并",
        frontend: "前端",
        backend: "后端",
        loading: "加载中",
        loadFail: "加载失败",
        editing: "修改中",
        editFail: "修改失败",
        deleting: "删除中",
        deleteFail: "删除失败",
        reqGot: "请求响应",
        reqAborted: "请求超时或意外终止",
        updateMsg: "请更新 Artalk {name} 以获得更好的体验！",
        currentVersion: "当前版本",
        ignore: "忽略",
        open: "打开",
        openName: "打开{name}",
      },
    };
  function Rt(e) {
    return (
      (e = e.replace(
        /^([a-zA-Z]+)(-[a-zA-Z]+)?$/,
        (e, t, n) => t.toLowerCase() + (n || "").toUpperCase()
      )),
      It[e] ? It[e] : window[Pt] && window[Pt][e] ? window[Pt][e] : It.en
    );
  }
  let Ut = "en",
    qt = Rt(Ut);
  function _t(e) {
    e !== Ut && ((Ut = e), (qt = "string" == typeof e ? Rt(e) : e));
  }
  function Ot(e, t = {}) {
    let n = (null == qt ? void 0 : qt[e]) || e;
    return (n = n.replace(/\{\s*(\w+?)\s*\}/g, (e, n) => t[n] || "")), bt(n);
  }
  class Dt {
    constructor() {
      d(this, "events", []);
    }
    on(e, t, n = {}) {
      this.events.push(l({ name: e, handler: t }, n));
    }
    off(e, t) {
      t &&
        (this.events = this.events.filter(
          (n) => !(n.name === e && n.handler === t)
        ));
    }
    trigger(e, t) {
      this.events
        .slice(0)
        .filter((t) => t.name === e && "function" == typeof t.handler)
        .forEach((n) => {
          n.once && this.off(e, n.handler), n.handler(t);
        });
    }
  }
  const Bt = {
    el: "",
    pageKey: "",
    pageTitle: "",
    server: "",
    site: "",
    placeholder: "",
    noComment: "",
    sendBtn: "",
    darkMode: !1,
    editorTravel: !0,
    flatMode: "auto",
    nestMax: 2,
    nestSort: "DATE_ASC",
    emoticons:
      "https://cdn.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json",
    vote: !0,
    voteDown: !1,
    uaBadge: !0,
    listSort: !0,
    preview: !0,
    countEl: ".artalk-comment-count",
    pvEl: ".artalk-pv-count",
    statPageKeyAttr: "data-page-key",
    gravatar: {
      mirror: "https://www.gravatar.com/avatar/",
      params: "sha256=1&d=mp&s=240",
    },
    pagination: { pageSize: 20, readMore: !0, autoLoad: !0 },
    heightLimit: { content: 300, children: 400, scrollable: !1 },
    imgUpload: !0,
    reqTimeout: 15e3,
    versionCheck: !0,
    useBackendConf: !0,
    locale: "en",
  };
  function jt(e, t = !1) {
    const n = t ? $t(Bt, e) : e;
    if (n.el && "string" == typeof n.el)
      try {
        const e = document.querySelector(n.el);
        if (!e) throw Error(`Target element "${n.el}" was not found.`);
        n.el = e;
      } catch (s) {
        throw (
          (console.error(s), new Error("Please check your Artalk `el` config."))
        );
      }
    return (
      "" === n.pageKey && (n.pageKey = `${window.location.pathname}`),
      "" === n.pageTitle && (n.pageTitle = `${document.title}`),
      n.server &&
        (n.server = n.server.replace(/\/$/, "").replace(/\/api\/?$/, "")),
      "auto" === n.locale && (n.locale = navigator.language),
      "auto" === n.flatMode &&
        (n.flatMode = window.matchMedia("(max-width: 768px)").matches),
      "number" == typeof n.nestMax &&
        Number(n.nestMax) <= 1 &&
        (n.flatMode = !0),
      n
    );
  }
  function Ft(e, t) {
    return {
      baseURL: `${e.server}/api/v2`,
      siteName: e.site || "",
      pageKey: e.pageKey || "",
      pageTitle: e.pageTitle || "",
      timeout: e.reqTimeout,
      getApiToken: () => (null == t ? void 0 : t.get("user").getData().token),
      userInfo: (null == t ? void 0 : t.get("user").checkHasBasicUserInfo())
        ? {
            name: null == t ? void 0 : t.get("user").getData().name,
            email: null == t ? void 0 : t.get("user").getData().email,
          }
        : void 0,
      handlers: null == t ? void 0 : t.getApiHandlers(),
    };
  }
  function Wt(e, t, n) {
    let s = null;
    const i = () => {
      const i = (() => {
        const n = e.getConf(),
          s = {};
        return (
          t.forEach((e) => {
            s[e] = n[e];
          }),
          s
        );
      })();
      var r, o;
      (null == s ||
        ((r = s), (o = i), !(JSON.stringify(r) === JSON.stringify(o)))) &&
        ((s = i), n(i));
    };
    e.on("mounted", i), e.on("updated", i);
  }
  class zt {
    constructor(e) {
      d(this, "conf"),
        d(this, "data"),
        d(this, "$root"),
        d(this, "events", new Dt()),
        d(this, "mounted", !1),
        d(this, "apiHandlers", null),
        d(this, "getCommentList", this.getCommentNodes),
        d(this, "getCommentDataList", this.getComments),
        (this.conf = e),
        (this.$root = e.el),
        this.$root.classList.add("artalk"),
        (this.$root.innerHTML = ""),
        e.darkMode && this.$root.classList.add("atk-dark-mode"),
        (this.data = new vt(this.events)),
        this.on("mounted", () => {
          this.mounted = !0;
        });
    }
    inject(e, t) {
      this[e] = t;
    }
    get(e) {
      return this[e];
    }
    getApi() {
      return new f(Ft(this.conf, this));
    }
    getApiHandlers() {
      return (
        this.apiHandlers ||
          (this.apiHandlers = (function (e) {
            const t = (function () {
              const e = [];
              return {
                add: (t, n) => {
                  e.push({ action: t, handler: n });
                },
                remove: (t) => {
                  const n = e.findIndex((e) => e.action === t);
                  -1 !== n && e.splice(n, 1);
                },
                get: () => e,
              };
            })();
            return (
              t.add("need_captcha", (t) => e.checkCaptcha(t)),
              t.add("need_login", () => e.checkAdmin({})),
              t
            );
          })(this)),
        this.apiHandlers
      );
    }
    getData() {
      return this.data;
    }
    replyComment(e, t) {
      this.editor.setReply(e, t);
    }
    editComment(e, t) {
      this.editor.setEditComment(e, t);
    }
    fetch(e) {
      this.data.fetchComments(e);
    }
    reload() {
      this.data.fetchComments({ offset: 0 });
    }
    listGotoFirst() {
      this.events.trigger("list-goto-first");
    }
    getCommentNodes() {
      return this.list.getCommentNodes();
    }
    getComments() {
      return this.data.getComments();
    }
    editorShowLoading() {
      this.editor.showLoading();
    }
    editorHideLoading() {
      this.editor.hideLoading();
    }
    editorShowNotify(e, t) {
      this.editor.showNotify(e, t);
    }
    editorResetState() {
      this.editor.resetState();
    }
    showSidebar(e) {
      this.sidebarLayer.show(e);
    }
    hideSidebar() {
      this.sidebarLayer.hide();
    }
    checkAdmin(e) {
      return this.checkerLauncher.checkAdmin(e);
    }
    checkCaptcha(e) {
      return this.checkerLauncher.checkCaptcha(e);
    }
    on(e, t) {
      this.events.on(e, t);
    }
    off(e, t) {
      this.events.off(e, t);
    }
    trigger(e, t) {
      this.events.trigger(e, t);
    }
    $t(e, t = {}) {
      return Ot(e, t);
    }
    setDarkMode(e) {
      this.updateConf({ darkMode: e });
    }
    updateConf(e) {
      (this.conf = $t(this.conf, jt(e, !1))),
        this.mounted && this.events.trigger("updated", this.conf);
    }
    getConf() {
      return this.conf;
    }
    getEl() {
      return this.$root;
    }
    getMarked() {
      return kt();
    }
    watchConf(e, t) {
      Wt(this, e, t);
    }
  }
  function Nt(e, t) {
    let n = e.querySelector(":scope > .atk-loading");
    n ||
      ((n = wt(
        '<div class="atk-loading" style="display: none;">\n      <div class="atk-loading-spinner">\n        <svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>\n      </div>\n    </div>'
      )),
      (null == t ? void 0 : t.transparentBg) &&
        (n.style.background = "transparent"),
      e.appendChild(n)),
      (n.style.display = "");
    const s = n.querySelector(".atk-loading-spinner");
    s &&
      ((s.style.display = "none"),
      window.setTimeout(() => {
        s.isConnected && (s.style.display = "");
      }, 500));
  }
  function Ht(e) {
    const t = e.querySelector(":scope > .atk-loading");
    t && (t.style.display = "none");
  }
  function Qt(e, t) {
    e ? Nt(t) : Ht(t);
  }
  function Vt(e, t = !0, n) {
    let s;
    if (n) {
      const t = n.getBoundingClientRect();
      s =
        e.getBoundingClientRect().top -
        t.top +
        n.scrollTop -
        n.clientHeight / 2 +
        e.clientHeight / 2;
    } else {
      const t = e.getBoundingClientRect();
      s = t.top + window.scrollY - (window.innerHeight / 2 - t.height / 2);
    }
    const i = { top: s, left: 0, behavior: "instant" };
    n ? n.scroll(i) : window.scroll(i);
  }
  function Gt(e, t) {
    !(function (e, t, n = "in") {
      e.classList.add(`atk-fade-${n}`);
      const s = () => {
        e.classList.remove(`atk-fade-${n}`),
          e.removeEventListener("animationend", s);
      };
      e.addEventListener("animationend", s);
    })(e, 0, "in");
  }
  function Kt(e, t, n = '<span class="atk-error-title">Artalk Error</span>') {
    let s = e.querySelector(".atk-error-layer");
    if (null === t) return void (null !== s && s.remove());
    s ||
      ((s = wt(
        `<div class="atk-error-layer">${n}<span class="atk-error-text"></span></div>`
      )),
      e.appendChild(s));
    const i = s.querySelector(".atk-error-text");
    (i.innerHTML = ""),
      null !== t &&
        (t instanceof HTMLElement ? i.appendChild(t) : (i.innerText = t));
  }
  function Zt(e) {
    const t = wt('<div class="atk-checker-iframe-wrap"></div>'),
      n = wt(
        '<iframe class="atk-fade-in" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
      );
    (n.style.display = "none"),
      Nt(t, { transparentBg: !0 }),
      (n.src = e.getOpts().getCaptchaIframeURL()),
      (n.onload = () => {
        (n.style.display = ""), Ht(t);
      }),
      t.append(n);
    const s = wt(
      '<div class="atk-close-btn"><i class="atk-icon atk-icon-close"></i></div>'
    );
    t.append(s), e.hideInteractInput();
    let i = !1;
    return (
      (function t() {
        return h(this, null, function* () {
          var n;
          if (
            (yield ((n = 1e3),
            new Promise((e) => {
              window.setTimeout(() => {
                e(null);
              }, n);
            })),
            i)
          )
            return;
          let s = !1;
          try {
            s = (yield e.getApi().captcha.getCaptchaStatus()).data.is_pass;
          } catch (r) {
            s = !1;
          }
          s ? e.triggerSuccess() : t();
        });
      })(),
      (s.onclick = () => {
        (i = !0), e.cancel();
      }),
      t
    );
  }
  const Yt = {
      request: (e, t) => e.getApi().captcha.verifyCaptcha({ value: t }),
      body: (e) =>
        e.get("iframe")
          ? Zt(e)
          : (function (e) {
              const t = wt(
                `<span><img class="atk-captcha-img" src="${
                  e.get("img_data") || ""
                }">${Ot("captchaCheck")}</span>`
              );
              return (
                (t.querySelector(".atk-captcha-img").onclick = () => {
                  const n = t.querySelector(".atk-captcha-img");
                  e.getApi()
                    .captcha.getCaptcha()
                    .then((e) => {
                      n.setAttribute("src", e.data.img_data);
                    })
                    .catch((e) => {
                      console.error("Failed to get captcha image ", e);
                    });
                }),
                t
              );
            })(e),
      onSuccess(e, t, n, s) {
        e.set("val", n);
      },
      onError(e, t, n, s) {
        s.querySelector(".atk-captcha-img").click(),
          (s.querySelector('input[type="text"]').value = "");
      },
    },
    Xt = {
      inputType: "password",
      request(e, t) {
        return h(this, null, function* () {
          return (yield e.getApi().user.login({
            name: e.getUser().getData().name,
            email: e.getUser().getData().email,
            password: t,
          })).data;
        });
      },
      body: (e) => wt(`<span>${Ot("adminCheck")}</span>`),
      onSuccess(e, t, n, s) {
        e.getUser().update({ is_admin: !0, token: t.token }),
          e.getOpts().onReload();
      },
      onError(e, t, n, s) {},
    };
  class Jt {
    constructor(e) {
      d(this, "$el"),
        d(this, "$content"),
        d(this, "$actions"),
        (this.$el = wt(
          '<div class="atk-layer-dialog-wrap">\n        <div class="atk-layer-dialog">\n          <div class="atk-layer-dialog-content"></div>\n          <div class="atk-layer-dialog-actions"></div>\n        </div>\n      </div>'
        )),
        (this.$actions = this.$el.querySelector(".atk-layer-dialog-actions")),
        (this.$content = this.$el.querySelector(".atk-layer-dialog-content")),
        this.$content.appendChild(e);
    }
    setYes(e) {
      const t = wt(`<button data-action="confirm">${Ot("confirm")}</button>`);
      return (
        (t.onclick = this.onBtnClick(e)), this.$actions.appendChild(t), this
      );
    }
    setNo(e) {
      const t = wt(`<button data-action="cancel">${Ot("cancel")}</button>`);
      return (
        (t.onclick = this.onBtnClick(e)), this.$actions.appendChild(t), this
      );
    }
    onBtnClick(e) {
      return (t) => {
        const n = e(t.currentTarget, this);
        (void 0 !== n && !0 !== n) || this.$el.remove();
      };
    }
  }
  function en(e) {
    return (t) =>
      new Promise((n, s) => {
        const i = t.onCancel;
        t.onCancel = () => {
          i && i(), s(new Error("user canceled the checker"));
        };
        const r = t.onSuccess;
        (t.onSuccess = () => {
          r && r(), n();
        }),
          e(t);
      });
  }
  class tn {
    constructor(e) {
      d(
        this,
        "checkCaptcha",
        en((e) => {
          this.fire(Yt, e, (t) => {
            t.set("img_data", e.img_data), t.set("iframe", e.iframe);
          });
        })
      ),
        d(
          this,
          "checkAdmin",
          en((e) => {
            this.fire(Xt, e);
          })
        ),
        (this.opts = e);
    }
    fire(e, t, n) {
      const s = this.opts
        .getCtx()
        .get("layerManager")
        .create(`checker-${new Date().getTime()}`);
      s.show();
      const i = () => {
          s.destroy();
        },
        r = {};
      let o = !1;
      const a = {
        set: (e, t) => {
          r[e] = t;
        },
        get: (e) => r[e],
        getOpts: () => this.opts,
        getUser: () => this.opts.getCtx().get("user"),
        getApi: () => this.opts.getApi(),
        hideInteractInput: () => {
          o = !0;
        },
        triggerSuccess: () => {
          i(),
            e.onSuccess && e.onSuccess(a, "", "", l),
            t.onSuccess && t.onSuccess();
        },
        cancel: () => {
          i(), t.onCancel && t.onCancel();
        },
      };
      n && n(a);
      const l = wt();
      l.appendChild(e.body(a));
      const c = wt(
        `<input id="check" type="${
          e.inputType || "text"
        }" autocomplete="off" required placeholder="">`
      );
      let d;
      l.appendChild(c),
        setTimeout(() => c.focus(), 80),
        (c.onkeyup = (e) => {
          ("Enter" !== e.key && 13 !== e.keyCode) ||
            (e.preventDefault(),
            s.getEl().querySelector('button[data-action="confirm"]').click());
        });
      const h = new Jt(l);
      h.setYes((n) => {
        const s = c.value.trim();
        d || (d = n.innerText);
        const r = () => {
          (n.innerText = d || ""), n.classList.remove("error");
        };
        return (
          (n.innerText = `${Ot("loading")}...`),
          e
            .request(a, s)
            .then((n) => {
              i(),
                e.onSuccess && e.onSuccess(a, n, s, l),
                t.onSuccess && t.onSuccess();
            })
            .catch((t) => {
              var i;
              (i = String(t.message || String(t))),
                (n.innerText = i),
                n.classList.add("error"),
                e.onError && e.onError(a, t, s, l);
              const o = setTimeout(() => r(), 3e3);
              c.onfocus = () => {
                r(), clearTimeout(o);
              };
            }),
          !1
        );
      }),
        h.setNo(() => (i(), t.onCancel && t.onCancel(), !1)),
        o &&
          ((c.style.display = "none"),
          (h.$el.querySelector(".atk-layer-dialog-actions").style.display =
            "none")),
        s.getEl().append(h.$el),
        t.onMount && t.onMount(h.$el);
    }
  }
  class nn {
    constructor(e) {
      d(this, "$el"), (this.ctx = e);
    }
    get conf() {
      return this.ctx.conf;
    }
    getEl() {
      return this.$el;
    }
  }
  const sn = {
    $header: ".atk-header",
    $name: '.atk-header [name="name"]',
    $email: '.atk-header [name="email"]',
    $link: '.atk-header [name="link"]',
    $textareaWrap: ".atk-textarea-wrap",
    $textarea: ".atk-textarea",
    $bottom: ".atk-bottom",
    $submitBtn: ".atk-send-btn",
    $notifyWrap: ".atk-notify-wrap",
    $bottomLeft: ".atk-bottom-left",
    $stateWrap: ".atk-state-wrap",
    $plugBtnWrap: ".atk-plug-btn-wrap",
    $plugPanelWrap: ".atk-plug-panel-wrap",
  };
  class rn {
    constructor(e) {
      d(this, "$btn"),
        d(this, "$panel"),
        d(this, "editorStateEffectWhen"),
        (this.kit = e);
    }
    useBtn(e = "<div></div>") {
      return (
        (this.$btn = wt(`<span class="atk-plug-btn">${e}</span>`)), this.$btn
      );
    }
    usePanel(e = "<div></div>") {
      return (this.$panel = wt(e)), this.$panel;
    }
    useContentTransformer(e) {
      this.contentTransformer = e;
    }
    usePanelShow(e) {
      this.kit.useEvents().on("panel-show", (t) => {
        t === this && e();
      });
    }
    usePanelHide(e) {
      this.kit.useEvents().on("panel-hide", (t) => {
        t === this && e();
      });
    }
    useEditorStateEffect(e, t) {
      (this.editorStateEffectWhen = e), (this.editorStateEffect = t);
    }
  }
  class on extends rn {
    constructor() {
      super(...arguments), d(this, "isMoved", !1);
    }
    move(e) {
      if (this.isMoved) return;
      this.isMoved = !0;
      const t = this.kit.useUI().$el;
      t.after(wt('<div class="atk-editor-travel-placeholder"></div>'));
      const n = wt("<div></div>");
      e.after(n),
        n.replaceWith(t),
        t.classList.add("atk-fade-in"),
        t.classList.add("editor-traveling");
    }
    back() {
      var e;
      this.isMoved &&
        ((this.isMoved = !1),
        null ==
          (e = this.kit
            .useGlobalCtx()
            .$root.querySelector(".atk-editor-travel-placeholder")) ||
          e.replaceWith(this.kit.useUI().$el),
        this.kit.useUI().$el.classList.remove("editor-traveling"));
    }
  }
  class an {
    constructor(e) {
      d(this, "stateCurt", "normal"),
        d(this, "stateUnmountFn", null),
        (this.editor = e);
    }
    get() {
      return this.stateCurt;
    }
    switch(e, t) {
      var n, s, i, r, o;
      if (
        (this.stateUnmountFn &&
          (this.stateUnmountFn(),
          (this.stateUnmountFn = null),
          null ==
            (s = null == (n = this.editor.getPlugs()) ? void 0 : n.get(on)) ||
            s.back()),
        "normal" !== e && t)
      ) {
        let n = t.$comment;
        this.editor.conf.flatMode || (n = n.querySelector(".atk-footer")),
          null ==
            (r = null == (i = this.editor.getPlugs()) ? void 0 : i.get(on)) ||
            r.move(n);
        const s =
          this.editor.ctx.conf.scrollRelativeTo &&
          this.editor.ctx.conf.scrollRelativeTo();
        Vt(this.editor.getUI().$el, !0, s);
        const a =
          null == (o = this.editor.getPlugs())
            ? void 0
            : o.getPlugs().find((t) => t.editorStateEffectWhen === e);
        a &&
          a.editorStateEffect &&
          (this.stateUnmountFn = a.editorStateEffect(t.comment));
      }
      this.stateCurt = e;
    }
  }
  class ln extends nn {
    constructor(e) {
      super(e),
        d(this, "ui"),
        d(this, "state"),
        (this.ui = (function () {
          const e = wt(
              '<div class="atk-main-editor">\n  <div class="atk-header">\n    <input name="name" class="atk-name" type="text" required="required" />\n    <input name="email" class="atk-email" type="email" required="required" />\n    <input name="link" class="atk-link" type="url" />\n  </div>\n  <div class="atk-textarea-wrap">\n    <textarea class="atk-textarea"></textarea>\n  </div>\n  <div class="atk-plug-panel-wrap" style="display: none"></div>\n  <div class="atk-bottom">\n    <div class="atk-item atk-bottom-left">\n      <span class="atk-state-wrap"></span>\n      <span class="atk-plug-btn-wrap"></span>\n    </div>\n    <div class="atk-item">\n      <button type="button" class="atk-send-btn"></button>\n    </div>\n  </div>\n  <div class="atk-notify-wrap"></div>\n</div>\n'
            ),
            t = { $el: e };
          return (
            Object.entries(sn).forEach(([n, s]) => {
              t[n] = e.querySelector(s);
            }),
            t
          );
        })()),
        (this.$el = this.ui.$el),
        (this.state = new an(this));
    }
    getUI() {
      return this.ui;
    }
    getPlugs() {
      return this.ctx.get("editorPlugs");
    }
    getState() {
      return this.state.get();
    }
    getHeaderInputEls() {
      return {
        name: this.ui.$name,
        email: this.ui.$email,
        link: this.ui.$link,
      };
    }
    getContentFinal() {
      let e = this.getContentRaw();
      const t = this.getPlugs();
      return t && (e = t.getTransformedContent(e)), e;
    }
    getContentRaw() {
      return this.ui.$textarea.value || "";
    }
    getContentMarked() {
      return yt(this.getContentFinal());
    }
    setContent(e) {
      var t;
      (this.ui.$textarea.value = e),
        null == (t = this.getPlugs()) ||
          t.getEvents().trigger("content-updated", e);
    }
    insertContent(e) {
      if (document.selection)
        this.ui.$textarea.focus(),
          (document.selection.createRange().text = e),
          this.ui.$textarea.focus();
      else if (
        this.ui.$textarea.selectionStart ||
        0 === this.ui.$textarea.selectionStart
      ) {
        const t = this.ui.$textarea.selectionStart,
          n = this.ui.$textarea.selectionEnd,
          s = this.ui.$textarea.scrollTop;
        this.setContent(
          this.ui.$textarea.value.substring(0, t) +
            e +
            this.ui.$textarea.value.substring(n, this.ui.$textarea.value.length)
        ),
          this.ui.$textarea.focus(),
          (this.ui.$textarea.selectionStart = t + e.length),
          (this.ui.$textarea.selectionEnd = t + e.length),
          (this.ui.$textarea.scrollTop = s);
      } else this.ui.$textarea.focus(), (this.ui.$textarea.value += e);
    }
    focus() {
      this.ui.$textarea.focus();
    }
    reset() {
      this.setContent(""), this.resetState();
    }
    resetState() {
      this.state.switch("normal");
    }
    setReply(e, t) {
      this.state.switch("reply", { comment: e, $comment: t });
    }
    setEditComment(e, t) {
      this.state.switch("edit", { comment: e, $comment: t });
    }
    showNotify(e, t) {
      !(function (e, t, n) {
        const s = wt(
          `<div class="atk-notify atk-fade-in" style="background-color: ${
            { s: "#57d59f", e: "#ff6f6c", w: "#ffc721", i: "#2ebcfc" }[n]
          }"><span class="atk-notify-content"></span></div>`
        );
        (s.querySelector(".atk-notify-content").innerHTML = bt(t).replace(
          "\n",
          "<br/>"
        )),
          e.appendChild(s);
        const i = () => {
          s.classList.add("atk-fade-out"),
            setTimeout(() => {
              s.remove();
            }, 200);
        };
        let r;
        (r = window.setTimeout(() => {
          i();
        }, 3e3)),
          s.addEventListener("click", () => {
            i(), window.clearTimeout(r);
          });
      })(this.ui.$notifyWrap, e, t);
    }
    showLoading() {
      Nt(this.ui.$el);
    }
    hideLoading() {
      Ht(this.ui.$el);
    }
    submit() {
      const e = () => this.ctx.trigger("editor-submit");
      this.ctx.conf.beforeSubmit ? this.ctx.conf.beforeSubmit(this, e) : e();
    }
  }
  class cn extends nn {
    constructor(e) {
      super(e),
        d(this, "layer"),
        d(this, "$header"),
        d(this, "$closeBtn"),
        d(this, "$iframeWrap"),
        d(this, "$iframe"),
        d(this, "refreshWhenShow", !0),
        d(this, "animTimer"),
        (this.$el = wt(
          '<div class="atk-sidebar-layer">\n  <div class="atk-sidebar-inner">\n    <div class="atk-sidebar-header">\n      <div class="atk-sidebar-close">\n        <i class="atk-icon atk-icon-close-slim"></i>\n      </div>\n    </div>\n    <div class="atk-sidebar-iframe-wrap"></div>\n  </div>\n</div>\n'
        )),
        (this.$header = this.$el.querySelector(".atk-sidebar-header")),
        (this.$closeBtn = this.$header.querySelector(".atk-sidebar-close")),
        (this.$iframeWrap = this.$el.querySelector(".atk-sidebar-iframe-wrap")),
        (this.$closeBtn.onclick = () => {
          this.hide();
        }),
        this.ctx.on("user-changed", () => {
          this.refreshWhenShow = !0;
        });
    }
    show() {
      return h(this, arguments, function* (e = {}) {
        if (
          ((this.$el.style.transform = ""),
          this.initLayer(),
          this.layer.show(),
          this.refreshWhenShow)
        )
          (this.refreshWhenShow = !1),
            (this.$iframeWrap.innerHTML = ""),
            (this.$iframe = this.createIframe(e.view)),
            this.$iframeWrap.append(this.$iframe);
        else {
          const e = this.$iframe,
            t = e.src;
          this.getDarkMode() !== t.includes("&darkMode=1") &&
            this.iframeLoad(
              e,
              t.replace(
                /&darkMode=\d/,
                `&darkMode=${Number(this.getDarkMode())}`
              )
            );
        }
        this.authCheck({ onSuccess: () => this.show(e) }),
          (this.animTimer = setTimeout(() => {
            (this.animTimer = void 0),
              (this.$el.style.transform = "translate(0, 0)"),
              setTimeout(() => {
                this.ctx.getData().updateNotifies([]);
              }, 0),
              this.ctx.trigger("sidebar-show");
          }, 100));
      });
    }
    hide() {
      var e;
      null == (e = this.layer) || e.hide();
    }
    authCheck(e) {
      return h(this, null, function* () {
        const t = (yield this.ctx
          .getApi()
          .user.getUserStatus(l({}, this.ctx.getApi().getUserFields()))).data;
        t.is_admin &&
          !t.is_login &&
          ((this.refreshWhenShow = !0),
          this.ctx.checkAdmin({
            onSuccess: () => {
              setTimeout(() => {
                e.onSuccess();
              }, 500);
            },
            onCancel: () => {
              this.hide();
            },
          }),
          this.hide());
      });
    }
    initLayer() {
      this.layer ||
        ((this.layer = this.ctx
          .get("layerManager")
          .create("sidebar", this.$el)),
        this.layer.setOnAfterHide(() => {
          this.ctx.editorResetState(),
            this.animTimer && clearTimeout(this.animTimer),
            (this.$el.style.transform = ""),
            this.ctx.trigger("sidebar-hide");
        }));
    }
    createIframe(e) {
      const t = wt(
          '<iframe referrerpolicy="strict-origin-when-cross-origin"></iframe>'
        ),
        n = Lt({ base: this.ctx.conf.server, path: "/sidebar/" }),
        s = {
          pageKey: this.conf.pageKey,
          site: this.conf.site || "",
          user: JSON.stringify(this.ctx.get("user").getData()),
          time: +new Date(),
        };
      e && (s.view = e), (s.darkMode = this.getDarkMode() ? "1" : "0");
      const i = new URLSearchParams(s);
      return this.iframeLoad(t, `${n}?${i.toString()}`), t;
    }
    getDarkMode() {
      return "auto" === this.conf.darkMode
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : this.conf.darkMode;
    }
    iframeLoad(e, t) {
      (e.src = t),
        Nt(this.$iframeWrap),
        (e.onload = () => {
          Ht(this.$iframeWrap);
        });
    }
  }
  const dn = (e) => ({
    import: (t) => {
      (function (e, t = "DATE_DESC", n = 2) {
        const s = [];
        e.filter((e) => 0 === e.rid).forEach((t) => {
          const i = { id: t.id, comment: t, children: [], level: 1 };
          (i.parent = i),
            s.push(i),
            (function t(s) {
              const i = e.filter((e) => e.rid === s.id);
              0 !== i.length &&
                (s.level >= n && (s = s.parent),
                i.forEach((e) => {
                  const n = {
                    id: e.id,
                    comment: e,
                    children: [],
                    parent: s,
                    level: s.level + 1,
                  };
                  s.children.push(n), t(n);
                }));
            })(i);
        });
        const i = (n, s) => {
          let i = n.id - s.id;
          return (
            "DATE_ASC" === t
              ? (i = +new Date(n.comment.date) - +new Date(s.comment.date))
              : "DATE_DESC" === t
              ? (i = +new Date(s.comment.date) - +new Date(n.comment.date))
              : "SRC_INDEX" === t
              ? (i = e.indexOf(n.comment) - e.indexOf(s.comment))
              : "VOTE_UP_DESC" === t &&
                (i = s.comment.vote_up - n.comment.vote_up),
            i
          );
        };
        return (
          (function e(t) {
            t.forEach((t) => {
              (t.children = t.children.sort(i)), e(t.children);
            });
          })(s),
          s
        );
      })(t, e.nestSortBy, e.nestMax).forEach((n) => {
        var s;
        const i = e.createCommentNode(n.comment);
        null == (s = e.$commentsWrap) || s.appendChild(i.getEl()),
          i.getRender().playFadeAnim();
        const r = (n, s) => {
          s.children.forEach((s) => {
            const i = t.find((e) => e.id === s.comment.rid),
              o = s.comment,
              a = e.createCommentNode(o, i);
            n.putChild(a), r(a, s);
          });
        };
        r(i, n), i.getRender().checkHeightLimit();
      });
    },
    insert: (t, n) => {
      var s;
      const i = e.createCommentNode(t, n);
      if (0 === t.rid) null == (s = e.$commentsWrap) || s.prepend(i.getEl());
      else {
        const n = e.findCommentNode(t.rid);
        n &&
          (n.putChild(i, "DATE_ASC" === e.nestSortBy ? "append" : "prepend"),
          i.getParents().forEach((e) => {
            e.getRender().heightLimitRemoveForChildren();
          }));
      }
      i.getRender().checkHeightLimit(),
        i.scrollIntoView(),
        i.getRender().playFadeAnim();
    },
  });
  function hn(e, t, n, s) {
    n.is_collapsed && (n.is_allow_reply = !1);
    const i = e.createCommentNode(n, s);
    if (n.visible) {
      const n = i.getEl(),
        s = e.$commentsWrap;
      "append" === t && (null == s || s.append(n)),
        "prepend" === t && (null == s || s.prepend(n)),
        i.getRender().playFadeAnim();
    }
    return i.getRender().checkHeightLimit(), i;
  }
  class un {
    constructor(e) {
      this.options = e;
    }
    getStrategy() {
      return this.options.flatMode
        ? ((e = this.options),
          {
            import: (t) => {
              t.forEach((n) => {
                const s = 0 === n.rid ? void 0 : t.find((e) => e.id === n.rid);
                hn(e, "append", n, s);
              });
            },
            insert: (t, n) => {
              hn(e, "prepend", t, n).scrollIntoView();
            },
          })
        : dn(this.options);
      var e;
    }
    import(e) {
      this.getStrategy().import(e);
    }
    insert(e, t) {
      this.getStrategy().insert(e, t);
    }
  }
  function pn(e, t) {
    t.forEach(({ el: t, max: n, imgCheck: s }) => {
      if (!t) return;
      s && (t.style.maxHeight = `${n + 1}px`);
      let i = !1;
      const r = () => {
        if (i) return;
        if (
          (function (e) {
            return (
              parseFloat(getComputedStyle(e, null).height.replace("px", "")) ||
              0
            );
          })(t) <= n
        )
          return;
        e.scrollable
          ? (function (e) {
              if (!e.el) return;
              if (e.el.classList.contains(fn)) return;
              e.el.classList.add(fn), (e.el.style.height = `${e.max}px`);
            })({ el: t, max: n })
          : (function (e) {
              if (!e.el) return;
              if (!e.max) return;
              if (e.el.classList.contains(gn)) return;
              e.el.classList.add(gn),
                (e.el.style.height = `${e.max}px`),
                (e.el.style.overflow = "hidden");
              const t = wt(
                `<div class="atk-height-limit-btn">${Ot("readMore")}</span>`
              );
              (t.onclick = (t) => {
                t.stopPropagation(),
                  mn(e.el),
                  e.afterExpandBtnClick && e.afterExpandBtnClick(t);
              }),
                e.el.append(t);
            })({
              el: t,
              max: n,
              afterExpandBtnClick: () => {
                var t;
                (i = !0), null == (t = e.afterExpandBtnClick) || t.call(e);
              },
            });
      };
      if ((r(), s)) {
        const e = t.querySelectorAll(".atk-content img");
        0 === e.length && (t.style.maxHeight = ""),
          e.forEach((e) => {
            e.onload = () => r();
          });
      }
    });
  }
  const gn = "atk-height-limit";
  function mn(e) {
    e &&
      e.classList.contains(gn) &&
      (e.classList.remove(gn),
      Array.from(e.children).forEach((e) => {
        e.classList.contains("atk-height-limit-btn") && e.remove();
      }),
      (e.style.height = ""),
      (e.style.maxHeight = ""),
      (e.style.overflow = ""));
  }
  const fn = "atk-height-limit-scroll";
  function kn(e) {
    if (((e.$headerNick = e.$el.querySelector(".atk-nick")), e.data.link)) {
      const t = wt(
        '<a target="_blank" rel="noreferrer noopener nofollow"></a>'
      );
      (t.innerText = e.data.nick),
        (t.href = At(e.data.link) ? e.data.link : `https://${e.data.link}`),
        e.$headerNick.append(t);
    } else e.$headerNick.innerText = e.data.nick;
  }
  function yn(e) {
    (e.$headerBadgeWrap = e.$el.querySelector(".atk-badge-wrap")),
      (e.$headerBadgeWrap.innerHTML = "");
    const t = e.data.badge_name,
      n = e.data.badge_color;
    if (t) {
      const s = wt('<span class="atk-badge"></span>');
      (s.innerText = t.replace("管理员", Ot("admin"))),
        (s.style.backgroundColor = n || ""),
        e.$headerBadgeWrap.append(s);
    } else if (e.data.is_verified) {
      const t = wt(
        `<span class="atk-verified-icon" title="${Ot("emailVerified")}"></span>`
      );
      e.$headerBadgeWrap.append(t);
    }
    if (e.data.is_pinned) {
      const t = wt(`<span class="atk-pinned-badge">${Ot("pin")}</span>`);
      e.$headerBadgeWrap.append(t);
    }
  }
  function $n(e) {
    const t = e.$el.querySelector(".atk-date");
    (t.innerText = e.comment.getDateFormatted()),
      t.setAttribute("data-atk-comment-date", String(+new Date(e.data.date)));
  }
  function vn(e) {
    if (!e.opts.uaBadge && !e.data.ip_region) return;
    let t = e.$header.querySelector("atk-ua-wrap");
    if (
      (t ||
        ((t = wt('<span class="atk-ua-wrap"></span>')), e.$header.append(t)),
      (t.innerHTML = ""),
      e.data.ip_region)
    ) {
      const n = wt('<span class="atk-region-badge"></span>');
      (n.innerText = e.data.ip_region), t.append(n);
    }
    if (e.opts.uaBadge) {
      const { browser: n, os: s } = e.comment.getUserUA();
      if (String(n).trim()) {
        const e = wt('<span class="atk-ua ua-browser"></span>');
        (e.innerText = n), t.append(e);
      }
      if (String(s).trim()) {
        const e = wt('<span class="atk-ua ua-os"></span>');
        (e.innerText = s), t.append(e);
      }
    }
  }
  class wn {
    constructor(e) {
      d(this, "opts"),
        d(this, "$el"),
        d(this, "isLoading", !1),
        d(this, "msgRecTimer"),
        d(this, "msgRecTimerFunc"),
        d(this, "isConfirming", !1),
        d(this, "confirmRecTimer"),
        (this.$el = wt('<span class="atk-common-action-btn"></span>')),
        (this.opts = "object" != typeof e ? { text: e } : e),
        (this.$el.innerText = this.getText()),
        this.opts.adminOnly && this.$el.setAttribute("atk-only-admin-show", "");
    }
    get isMessaging() {
      return !!this.msgRecTimer;
    }
    appendTo(e) {
      return e.append(this.$el), this;
    }
    getText() {
      return "string" == typeof this.opts.text
        ? this.opts.text
        : this.opts.text();
    }
    setClick(e) {
      this.$el.onclick = (t) => {
        if ((t.stopPropagation(), !this.isLoading)) {
          if (this.opts.confirm && !this.isMessaging) {
            const e = () => {
              (this.isConfirming = !1),
                this.$el.classList.remove("atk-btn-confirm"),
                (this.$el.innerText = this.getText());
            };
            if (!this.isConfirming)
              return (
                (this.isConfirming = !0),
                this.$el.classList.add("atk-btn-confirm"),
                (this.$el.innerText =
                  this.opts.confirmText || Ot("actionConfirm")),
                void (this.confirmRecTimer = window.setTimeout(() => e(), 5e3))
              );
            this.confirmRecTimer && window.clearTimeout(this.confirmRecTimer),
              e();
          }
          if (this.msgRecTimer)
            return this.fireMsgRecTimer(), void this.clearMsgRecTimer();
          e();
        }
      };
    }
    updateText(e) {
      e && (this.opts.text = e),
        this.setLoading(!1),
        (this.$el.innerText = this.getText());
    }
    setLoading(e, t) {
      this.isLoading !== e &&
        ((this.isLoading = e),
        e
          ? (this.$el.classList.add("atk-btn-loading"),
            (this.$el.innerText = t || `${Ot("loading")}...`))
          : (this.$el.classList.remove("atk-btn-loading"),
            (this.$el.innerText = this.getText())));
    }
    setError(e) {
      this.setMsg(e, "atk-btn-error");
    }
    setWarn(e) {
      this.setMsg(e, "atk-btn-warn");
    }
    setSuccess(e) {
      this.setMsg(e, "atk-btn-success");
    }
    setMsg(e, t, n, s) {
      this.setLoading(!1),
        t && this.$el.classList.add(t),
        (this.$el.innerText = e),
        this.setMsgRecTimer(() => {
          (this.$el.innerText = this.getText()),
            t && this.$el.classList.remove(t),
            s && s();
        }, n || 2500);
    }
    setMsgRecTimer(e, t) {
      this.fireMsgRecTimer(),
        this.clearMsgRecTimer(),
        (this.msgRecTimerFunc = e),
        (this.msgRecTimer = window.setTimeout(() => {
          e(), this.clearMsgRecTimer();
        }, t));
    }
    fireMsgRecTimer() {
      this.msgRecTimerFunc && this.msgRecTimerFunc();
    }
    clearMsgRecTimer() {
      this.msgRecTimer && window.clearTimeout(this.msgRecTimer),
        (this.msgRecTimer = void 0),
        (this.msgRecTimerFunc = void 0);
    }
  }
  function bn(e) {
    e.opts.vote &&
      ((e.voteBtnUp = new wn(
        () => `${Ot("voteUp")} (${e.data.vote_up || 0})`
      ).appendTo(e.$actions)),
      e.voteBtnUp.setClick(() => {
        e.comment.getActions().vote("up");
      }),
      e.opts.voteDown &&
        ((e.voteBtnDown = new wn(
          () => `${Ot("voteDown")} (${e.data.vote_down || 0})`
        ).appendTo(e.$actions)),
        e.voteBtnDown.setClick(() => {
          e.comment.getActions().vote("down");
        })));
  }
  function xn(e) {
    if (!e.data.is_allow_reply) return;
    const t = wt(`<span>${Ot("reply")}</span>`);
    e.$actions.append(t),
      t.addEventListener("click", (t) => {
        t.stopPropagation(), e.opts.replyComment(e.data, e.$el);
      });
  }
  function Cn(e) {
    const t = new wn({
      text: () => (e.data.is_collapsed ? Ot("expand") : Ot("collapse")),
      adminOnly: !0,
    });
    t.appendTo(e.$actions),
      t.setClick(() => {
        e.comment.getActions().adminEdit("collapsed", t);
      });
  }
  function En(e) {
    const t = new wn({
      text: () => (e.data.is_pending ? Ot("pending") : Ot("approved")),
      adminOnly: !0,
    });
    t.appendTo(e.$actions),
      t.setClick(() => {
        e.comment.getActions().adminEdit("pending", t);
      });
  }
  function Sn(e) {
    const t = new wn({
      text: () => (e.data.is_pinned ? Ot("unpin") : Ot("pin")),
      adminOnly: !0,
    });
    t.appendTo(e.$actions),
      t.setClick(() => {
        e.comment.getActions().adminEdit("pinned", t);
      });
  }
  function Tn(e) {
    const t = new wn({ text: Ot("edit"), adminOnly: !0 });
    t.appendTo(e.$actions),
      t.setClick(() => {
        e.opts.editComment(e.data, e.$el);
      });
  }
  function An(e) {
    const t = new wn({
      text: Ot("delete"),
      confirm: !0,
      confirmText: Ot("deleteConfirm"),
      adminOnly: !0,
    });
    t.appendTo(e.$actions),
      t.setClick(() => {
        e.comment.getActions().adminDelete(t);
      });
  }
  const Ln = {
    Avatar: function (e) {
      const t = e.$el.querySelector(".atk-avatar"),
        n = wt("<img />"),
        s = e.opts.avatarURLBuilder;
      if (((n.src = s ? s(e.data) : e.comment.getGravatarURL()), e.data.link)) {
        const s = wt(
          '<a target="_blank" rel="noreferrer noopener nofollow"></a>'
        );
        (s.href = At(e.data.link) ? e.data.link : `https://${e.data.link}`),
          s.append(n),
          t.append(s);
      } else t.append(n);
    },
    Header: function (e) {
      Object.entries({
        renderNick: kn,
        renderVerifyBadge: yn,
        renderDate: $n,
        renderUABadge: vn,
      }).forEach(([t, n]) => {
        n(e);
      });
    },
    Content: function (e) {
      if (!e.data.is_collapsed)
        return (
          (e.$content.innerHTML = e.comment.getContentMarked()),
          void e.$content.classList.remove("atk-hide", "atk-collapsed")
        );
      e.$content.classList.add("atk-hide", "atk-type-collapsed");
      const t = wt(
        `\n    <div class="atk-collapsed">\n      <span class="atk-text">${Ot(
          "collapsedMsg"
        )}</span>\n      <span class="atk-show-btn">${Ot(
          "expand"
        )}</span>\n    </div>`
      );
      e.$body.insertAdjacentElement("beforeend", t);
      const n = t.querySelector(".atk-show-btn");
      n.addEventListener("click", (t) => {
        t.stopPropagation(),
          e.$content.classList.contains("atk-hide")
            ? ((e.$content.innerHTML = e.comment.getContentMarked()),
              e.$content.classList.remove("atk-hide"),
              Gt(e.$content),
              (n.innerText = Ot("collapse")))
            : ((e.$content.innerHTML = ""),
              e.$content.classList.add("atk-hide"),
              (n.innerText = Ot("expand")));
      });
    },
    ReplyAt: function (e) {
      e.opts.flatMode ||
        0 === e.data.rid ||
        (e.opts.replyTo &&
          ((e.$replyAt = wt(
            '<span class="atk-item atk-reply-at"><span class="atk-arrow"></span><span class="atk-nick"></span></span>'
          )),
          (e.$replyAt.querySelector(
            ".atk-nick"
          ).innerText = `${e.opts.replyTo.nick}`),
          (e.$replyAt.onclick = () => {
            e.comment.getActions().goToReplyComment();
          }),
          e.$headerBadgeWrap.insertAdjacentElement("afterend", e.$replyAt)));
    },
    ReplyTo: function (e) {
      if (!e.opts.flatMode) return;
      if (!e.opts.replyTo) return;
      e.$replyTo = wt(
        `\n    <div class="atk-reply-to">\n      <div class="atk-meta">${Ot(
          "reply"
        )} <span class="atk-nick"></span>:</div>\n      <div class="atk-content"></div>\n    </div>`
      );
      const t = e.$replyTo.querySelector(".atk-nick");
      (t.innerText = `@${e.opts.replyTo.nick}`),
        (t.onclick = () => {
          e.comment.getActions().goToReplyComment();
        });
      let n = yt(e.opts.replyTo.content);
      e.opts.replyTo.is_collapsed && (n = `[${Ot("collapsed")}]`),
        (e.$replyTo.querySelector(".atk-content").innerHTML = n),
        e.$body.prepend(e.$replyTo);
    },
    Pending: function (e) {
      if (!e.data.is_pending) return;
      const t = wt(`<div class="atk-pending">${Ot("pendingMsg")}</div>`);
      e.$body.prepend(t);
    },
    Actions: function (e) {
      Object.entries({
        renderVote: bn,
        renderReply: xn,
        renderCollapse: Cn,
        renderModerator: En,
        renderPin: Sn,
        renderEdit: Tn,
        renderDel: An,
      }).forEach(([t, n]) => {
        n(e);
      });
    },
  };
  class Mn {
    constructor(e) {
      d(this, "comment"),
        d(this, "$el"),
        d(this, "$main"),
        d(this, "$header"),
        d(this, "$headerNick"),
        d(this, "$headerBadgeWrap"),
        d(this, "$body"),
        d(this, "$content"),
        d(this, "$childrenWrap"),
        d(this, "$actions"),
        d(this, "voteBtnUp"),
        d(this, "voteBtnDown"),
        d(this, "$replyTo"),
        d(this, "$replyAt"),
        (this.comment = e);
    }
    get data() {
      return this.comment.getData();
    }
    get opts() {
      return this.comment.getOpts();
    }
    render() {
      var e;
      return (
        (this.$el = wt(
          '<div class="atk-comment-wrap">\n  <div class="atk-comment">\n    <div class="atk-avatar"></div>\n    <div class="atk-main">\n      <div class="atk-header">\n        <span class="atk-item atk-nick"></span>\n        <span class="atk-badge-wrap"></span>\n        <span class="atk-item atk-date"></span>\n      </div>\n      <div class="atk-body">\n        <div class="atk-content"></div>\n      </div>\n      <div class="atk-footer">\n        <div class="atk-actions"></div>\n      </div>\n    </div>\n  </div>\n</div>\n'
        )),
        (this.$main = this.$el.querySelector(".atk-main")),
        (this.$header = this.$el.querySelector(".atk-header")),
        (this.$body = this.$el.querySelector(".atk-body")),
        (this.$content = this.$body.querySelector(".atk-content")),
        (this.$actions = this.$el.querySelector(".atk-actions")),
        this.$el.setAttribute("id", `atk-comment-${this.data.id}`),
        (e = this),
        Object.entries(Ln).forEach(([t, n]) => {
          n(e);
        }),
        this.$childrenWrap && this.$main.append(this.$childrenWrap),
        this.$el
      );
    }
    checkHeightLimit() {
      const e = this.opts.heightLimit;
      if (!e || !e.content || !e.children) return;
      const t = e.content,
        n = e.children;
      pn(
        {
          afterExpandBtnClick: () => {
            const e = this.comment.getChildren();
            1 === e.length && mn(e[0].getRender().$content);
          },
          scrollable: e.scrollable,
        },
        [
          { el: this.$content, max: t, imgCheck: !0 },
          { el: this.$replyTo, max: t, imgCheck: !0 },
          { el: this.$childrenWrap, max: n, imgCheck: !1 },
        ]
      );
    }
    heightLimitRemoveForChildren() {
      this.$childrenWrap && mn(this.$childrenWrap);
    }
    playFadeAnim() {
      Gt(this.comment.getRender().$el);
    }
    playFadeAnimForBody() {
      Gt(this.comment.getRender().$body);
    }
    playFlashAnim() {
      this.$el.classList.remove("atk-flash-once"),
        window.setTimeout(() => {
          this.$el.classList.add("atk-flash-once");
        }, 150);
    }
    getChildrenWrap() {
      return (
        this.$childrenWrap ||
          ((this.$childrenWrap = wt(
            '<div class="atk-comment-children"></div>'
          )),
          this.$main.append(this.$childrenWrap)),
        this.$childrenWrap
      );
    }
    setUnread(e) {
      e
        ? this.$el.classList.add("atk-unread")
        : this.$el.classList.remove("atk-unread");
    }
    setOpenable(e) {
      e
        ? this.$el.classList.add("atk-openable")
        : this.$el.classList.remove("atk-openable");
    }
    setOpenURL(e) {
      this.setOpenable(!0),
        (this.$el.onclick = (t) => {
          t.stopPropagation(), window.open(e);
        });
    }
    setOpenAction(e) {
      this.setOpenable(!0),
        (this.$el.onclick = (t) => {
          t.stopPropagation(), e();
        });
    }
  }
  class Pn {
    constructor(e) {
      d(this, "comment"), (this.comment = e);
    }
    get data() {
      return this.comment.getData();
    }
    get opts() {
      return this.comment.getOpts();
    }
    getApi() {
      return this.comment.getOpts().getApi();
    }
    vote(e) {
      const t =
        "up" === e
          ? this.comment.getRender().voteBtnUp
          : this.comment.getRender().voteBtnDown;
      this.getApi()
        .votes.vote(
          `comment_${e}`,
          this.data.id,
          l({}, this.getApi().getUserFields())
        )
        .then((e) => {
          var t, n;
          (this.data.vote_up = e.data.up),
            (this.data.vote_down = e.data.down),
            null == (t = this.comment.getRender().voteBtnUp) || t.updateText(),
            null == (n = this.comment.getRender().voteBtnDown) ||
              n.updateText();
        })
        .catch((e) => {
          null == t || t.setError(Ot("voteFail")), console.error(e);
        });
    }
    adminEdit(e, t) {
      if (t.isLoading) return;
      t.setLoading(!0, `${Ot("editing")}...`);
      const n = l({}, this.data);
      "collapsed" === e
        ? (n.is_collapsed = !n.is_collapsed)
        : "pending" === e
        ? (n.is_pending = !n.is_pending)
        : "pinned" === e && (n.is_pinned = !n.is_pinned),
        this.getApi()
          .comments.updateComment(this.data.id, l({}, n))
          .then((e) => {
            t.setLoading(!1), this.comment.setData(e.data);
          })
          .catch((e) => {
            console.error(e), t.setError(Ot("editFail"));
          });
    }
    adminDelete(e) {
      e.isLoading ||
        (e.setLoading(!0, `${Ot("deleting")}...`),
        this.getApi()
          .comments.deleteComment(this.data.id)
          .then(() => {
            e.setLoading(!1),
              this.opts.onDelete && this.opts.onDelete(this.comment);
          })
          .catch((t) => {
            console.error(t), e.setError(Ot("deleteFail"));
          }));
    }
    goToReplyComment() {
      const e = window.location.hash,
        t = `#atk-comment-${this.data.rid}`;
      (window.location.hash = t),
        t === e && window.dispatchEvent(new Event("hashchange"));
    }
  }
  class In {
    constructor(e, t) {
      d(this, "$el"),
        d(this, "renderInstance"),
        d(this, "actionInstance"),
        d(this, "data"),
        d(this, "opts"),
        d(this, "parent"),
        d(this, "children", []),
        d(this, "nestCurt"),
        (this.opts = t),
        (this.data = l({}, e)),
        (this.data.date = this.data.date.replace(/-/g, "/")),
        (this.parent = null),
        (this.nestCurt = 1),
        (this.actionInstance = new Pn(this)),
        (this.renderInstance = new Mn(this));
    }
    render() {
      const e = this.renderInstance.render();
      this.$el && this.$el.replaceWith(e),
        (this.$el = e),
        this.opts.onAfterRender && this.opts.onAfterRender();
    }
    getActions() {
      return this.actionInstance;
    }
    getRender() {
      return this.renderInstance;
    }
    getData() {
      return this.data;
    }
    setData(e) {
      (this.data = e), this.render(), this.getRender().playFadeAnimForBody();
    }
    getParent() {
      return this.parent;
    }
    getChildren() {
      return this.children;
    }
    getNestCurt() {
      return this.nestCurt;
    }
    getIsRoot() {
      return 0 === this.data.rid;
    }
    getID() {
      return this.data.id;
    }
    putChild(e, t = "append") {
      (e.parent = this),
        (e.nestCurt = this.nestCurt + 1),
        this.children.push(e);
      const n = this.getChildrenWrapEl(),
        s = e.getEl();
      "append" === t ? n.append(s) : "prepend" === t && n.prepend(s),
        e.getRender().playFadeAnim(),
        e.getRender().checkHeightLimit();
    }
    getChildrenWrapEl() {
      return this.nestCurt >= this.opts.nestMax
        ? this.parent.getChildrenWrapEl()
        : this.getRender().getChildrenWrap();
    }
    getParents() {
      const e = [];
      let t = this.parent;
      for (; t; ) e.push(t), (t = t.getParent());
      return e;
    }
    getEl() {
      if (!this.$el)
        throw new Error("comment element not initialized before `getEl()`");
      return this.$el;
    }
    focus() {
      if (!this.$el)
        throw new Error("comment element not initialized before `focus()`");
      this.getParents().forEach((e) => {
        e.getRender().heightLimitRemoveForChildren();
      }),
        this.scrollIntoView(),
        this.getRender().playFlashAnim();
    }
    scrollIntoView() {
      this.$el &&
        Vt(
          this.$el,
          !1,
          this.opts.scrollRelativeTo && this.opts.scrollRelativeTo()
        );
    }
    remove() {
      var e;
      null == (e = this.$el) || e.remove();
    }
    getGravatarURL() {
      return `${(e = {
        mirror: this.opts.gravatar.mirror,
        params: this.opts.gravatar.params,
        emailHash: this.data.email_encrypted,
      }).mirror.replace(
        /\/$/,
        ""
      )}/${e.emailHash}?${e.params.replace(/^\?/, "")}`;
      var e;
    }
    getContentMarked() {
      return yt(this.data.content);
    }
    getDateFormatted() {
      var e, t;
      const n = new Date(this.data.date);
      return (
        (null == (t = (e = this.opts).dateFormatter) ? void 0 : t.call(e, n)) ||
        St(n, Ot)
      );
    }
    getUserUA() {
      const e = (function (e) {
        const t = window || {},
          n = navigator || {},
          s = String(e || n.userAgent),
          i = {
            os: "",
            osVersion: "",
            engine: "",
            browser: "",
            device: "",
            language: "",
            version: "",
          },
          r = {
            Trident: s.includes("Trident") || s.includes("NET CLR"),
            Presto: s.includes("Presto"),
            WebKit: s.includes("AppleWebKit"),
            Gecko: s.includes("Gecko/"),
          },
          o = {
            Safari: s.includes("Safari"),
            Chrome: s.includes("Chrome") || s.includes("CriOS"),
            IE: s.includes("MSIE") || s.includes("Trident"),
            Edge: s.includes("Edge") || s.includes("Edg"),
            Firefox: s.includes("Firefox") || s.includes("FxiOS"),
            "Firefox Focus": s.includes("Focus"),
            Chromium: s.includes("Chromium"),
            Opera: s.includes("Opera") || s.includes("OPR"),
            Vivaldi: s.includes("Vivaldi"),
            Yandex: s.includes("YaBrowser"),
            Kindle: s.includes("Kindle") || s.includes("Silk/"),
            360: s.includes("360EE") || s.includes("360SE"),
            UC: s.includes("UC") || s.includes(" UBrowser"),
            QQBrowser: s.includes("QQBrowser"),
            QQ: s.includes("QQ/"),
            Baidu: s.includes("Baidu") || s.includes("BIDUBrowser"),
            Maxthon: s.includes("Maxthon"),
            Sogou: s.includes("MetaSr") || s.includes("Sogou"),
            LBBROWSER: s.includes("LBBROWSER"),
            "2345Explorer": s.includes("2345Explorer"),
            TheWorld: s.includes("TheWorld"),
            MIUI: s.includes("MiuiBrowser"),
            Quark: s.includes("Quark"),
            Qiyu: s.includes("Qiyu"),
            Wechat: s.includes("MicroMessenger"),
            Taobao: s.includes("AliApp(TB"),
            Alipay: s.includes("AliApp(AP"),
            Weibo: s.includes("Weibo"),
            Douban: s.includes("com.douban.frodo"),
            Suning: s.includes("SNEBUY-APP"),
            iQiYi: s.includes("IqiyiApp"),
          },
          a = {
            Windows: s.includes("Windows"),
            Linux: s.includes("Linux") || s.includes("X11"),
            macOS: s.includes("Macintosh"),
            Android: s.includes("Android") || s.includes("Adr"),
            Ubuntu: s.includes("Ubuntu"),
            FreeBSD: s.includes("FreeBSD"),
            Debian: s.includes("Debian"),
            "Windows Phone":
              s.includes("IEMobile") || s.includes("Windows Phone"),
            BlackBerry: s.includes("BlackBerry") || s.includes("RIM"),
            MeeGo: s.includes("MeeGo"),
            Symbian: s.includes("Symbian"),
            iOS: s.includes("like Mac OS X"),
            "Chrome OS": s.includes("CrOS"),
            WebOS: s.includes("hpwOS"),
          },
          l = {
            Mobile:
              s.includes("Mobi") || s.includes("iPh") || s.includes("480"),
            Tablet:
              s.includes("Tablet") ||
              s.includes("Pad") ||
              s.includes("Nexus 7"),
          };
        l.Mobile
          ? (l.Mobile = !s.includes("iPad"))
          : o.Chrome && s.includes("Edg")
          ? ((o.Chrome = !1), (o.Edge = !0))
          : t.showModalDialog && t.chrome && ((o.Chrome = !1), (o[360] = !0)),
          (i.device = "PC"),
          (i.language = (() => {
            const e = (n.browserLanguage || n.language).split("-");
            return e[1] && (e[1] = e[1].toUpperCase()), e.join("_");
          })());
        const c = { engine: r, browser: o, os: a, device: l };
        Object.entries(c).forEach(([e, t]) => {
          Object.entries(t).forEach(([t, n]) => {
            !0 === n && (i[e] = t);
          });
        });
        const d = {
          Windows: () => {
            const e = s.replace(/^.*Windows NT ([\d.]+);.*$/, "$1");
            return (
              {
                6.4: "10",
                6.3: "8.1",
                6.2: "8",
                6.1: "7",
                "6.0": "Vista",
                5.2: "XP",
                5.1: "XP",
                "5.0": "2000",
                "10.0": "10",
                "11.0": "11",
              }[e] || e
            );
          },
          Android: () => s.replace(/^.*Android ([\d.]+);.*$/, "$1"),
          iOS: () =>
            s.replace(/^.*OS ([\d_]+) like.*$/, "$1").replace(/_/g, "."),
          Debian: () => s.replace(/^.*Debian\/([\d.]+).*$/, "$1"),
          "Windows Phone": () =>
            s.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, "$2"),
          macOS: () =>
            s.replace(/^.*Mac OS X ([\d_]+).*$/, "$1").replace(/_/g, "."),
          WebOS: () => s.replace(/^.*hpwOS\/([\d.]+);.*$/, "$1"),
        };
        (i.osVersion = ""),
          d[i.os] &&
            ((i.osVersion = d[i.os]()),
            i.osVersion === s && (i.osVersion = ""));
        const h = {
          Safari: () => s.replace(/^.*Version\/([\d.]+).*$/, "$1"),
          Chrome: () =>
            s
              .replace(/^.*Chrome\/([\d.]+).*$/, "$1")
              .replace(/^.*CriOS\/([\d.]+).*$/, "$1"),
          IE: () =>
            s
              .replace(/^.*MSIE ([\d.]+).*$/, "$1")
              .replace(/^.*rv:([\d.]+).*$/, "$1"),
          Edge: () => s.replace(/^.*(Edge|Edg|Edg[A-Z]{1})\/([\d.]+).*$/, "$2"),
          Firefox: () =>
            s
              .replace(/^.*Firefox\/([\d.]+).*$/, "$1")
              .replace(/^.*FxiOS\/([\d.]+).*$/, "$1"),
          "Firefox Focus": () => s.replace(/^.*Focus\/([\d.]+).*$/, "$1"),
          Chromium: () => s.replace(/^.*Chromium\/([\d.]+).*$/, "$1"),
          Opera: () =>
            s
              .replace(/^.*Opera\/([\d.]+).*$/, "$1")
              .replace(/^.*OPR\/([\d.]+).*$/, "$1"),
          Vivaldi: () => s.replace(/^.*Vivaldi\/([\d.]+).*$/, "$1"),
          Yandex: () => s.replace(/^.*YaBrowser\/([\d.]+).*$/, "$1"),
          Kindle: () => s.replace(/^.*Version\/([\d.]+).*$/, "$1"),
          Maxthon: () => s.replace(/^.*Maxthon\/([\d.]+).*$/, "$1"),
          QQBrowser: () => s.replace(/^.*QQBrowser\/([\d.]+).*$/, "$1"),
          QQ: () => s.replace(/^.*QQ\/([\d.]+).*$/, "$1"),
          Baidu: () => s.replace(/^.*BIDUBrowser[\s/]([\d.]+).*$/, "$1"),
          UC: () => s.replace(/^.*UC?Browser\/([\d.]+).*$/, "$1"),
          Sogou: () =>
            s
              .replace(/^.*SE ([\d.X]+).*$/, "$1")
              .replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, "$1"),
          "2345Explorer": () => s.replace(/^.*2345Explorer\/([\d.]+).*$/, "$1"),
          TheWorld: () => s.replace(/^.*TheWorld ([\d.]+).*$/, "$1"),
          MIUI: () => s.replace(/^.*MiuiBrowser\/([\d.]+).*$/, "$1"),
          Quark: () => s.replace(/^.*Quark\/([\d.]+).*$/, "$1"),
          Qiyu: () => s.replace(/^.*Qiyu\/([\d.]+).*$/, "$1"),
          Wechat: () => s.replace(/^.*MicroMessenger\/([\d.]+).*$/, "$1"),
          Taobao: () => s.replace(/^.*AliApp\(TB\/([\d.]+).*$/, "$1"),
          Alipay: () => s.replace(/^.*AliApp\(AP\/([\d.]+).*$/, "$1"),
          Weibo: () => s.replace(/^.*weibo__([\d.]+).*$/, "$1"),
          Douban: () => s.replace(/^.*com.douban.frodo\/([\d.]+).*$/, "$1"),
          Suning: () => s.replace(/^.*SNEBUY-APP([\d.]+).*$/, "$1"),
          iQiYi: () => s.replace(/^.*IqiyiVersion\/([\d.]+).*$/, "$1"),
        };
        return (
          (i.version = ""),
          h[i.browser] &&
            ((i.version = h[i.browser]()), i.version === s && (i.version = "")),
          i.version.indexOf(".") &&
            (i.version = i.version.substring(0, i.version.indexOf("."))),
          "iOS" === i.os && s.includes("iPad")
            ? (i.os = "iPadOS")
            : "Edge" !== i.browser || s.includes("Edg")
            ? "MIUI" === i.browser
              ? (i.os = "Android")
              : ("Chrome" === i.browser && Number(i.version) > 27) ||
                ("Opera" === i.browser && Number(i.version) > 12) ||
                "Yandex" === i.browser
              ? (i.engine = "Blink")
              : void 0 === i.browser && (i.browser = "Unknow App")
            : (i.engine = "EdgeHTML"),
          i
        );
      })(this.data.ua);
      return {
        browser: `${e.browser} ${e.version}`,
        os: `${e.os} ${e.osVersion}`,
      };
    }
    getOpts() {
      return this.opts;
    }
  }
  class Rn {
    constructor(e) {
      d(this, "opts"),
        d(this, "$el"),
        d(this, "$loading"),
        d(this, "$text"),
        d(this, "offset", 0),
        d(this, "total", 0),
        d(this, "origText", "Load More"),
        (this.opts = e),
        (this.origText = this.opts.text || this.origText),
        (this.$el = wt(
          `<div class="atk-list-read-more" style="display: none;">\n      <div class="atk-list-read-more-inner">\n        <div class="atk-loading-icon" style="display: none;"></div>\n        <span class="atk-text">${this.origText}</span>\n      </div>\n    </div>`
        )),
        (this.$loading = this.$el.querySelector(".atk-loading-icon")),
        (this.$text = this.$el.querySelector(".atk-text")),
        (this.$el.onclick = () => {
          this.click();
        });
    }
    get hasMore() {
      return this.total > this.offset + this.opts.pageSize;
    }
    click() {
      this.hasMore && this.opts.onClick(this.offset + this.opts.pageSize),
        this.checkDisabled();
    }
    show() {
      this.$el.style.display = "";
    }
    hide() {
      this.$el.style.display = "none";
    }
    setLoading(e) {
      (this.$loading.style.display = e ? "" : "none"),
        (this.$text.style.display = e ? "none" : "");
    }
    showErr(e) {
      this.setLoading(!1),
        (this.$text.innerText = e),
        this.$el.classList.add("atk-err"),
        window.setTimeout(() => {
          (this.$text.innerText = this.origText),
            this.$el.classList.remove("atk-err");
        }, 2e3);
    }
    update(e, t) {
      (this.offset = e), (this.total = t), this.checkDisabled();
    }
    checkDisabled() {
      this.hasMore ? this.show() : this.hide();
    }
  }
  class Un {
    constructor() {
      d(this, "instance"), d(this, "onReachedBottom", null), d(this, "opt");
    }
    create(e) {
      return (
        (this.opt = e),
        (this.instance = new Rn({
          pageSize: e.pageSize,
          onClick: (t) =>
            h(this, null, function* () {
              e.ctx.fetch({ offset: t });
            }),
          text: Ot("loadMore"),
        })),
        e.readMoreAutoLoad &&
          ((this.onReachedBottom = () => {
            this.instance.hasMore &&
              !this.opt.ctx.getData().getLoading() &&
              this.instance.click();
          }),
          this.opt.ctx.on("list-reach-bottom", this.onReachedBottom)),
        this.instance.$el
      );
    }
    setLoading(e) {
      this.instance.setLoading(e);
    }
    update(e, t) {
      this.instance.update(e, t);
    }
    showErr(e) {
      this.instance.showErr(e);
    }
    next() {
      this.instance.click();
    }
    getHasMore() {
      return this.instance.hasMore;
    }
    getIsClearComments(e) {
      return 0 === e.offset;
    }
    dispose() {
      this.onReachedBottom &&
        this.opt.ctx.off("list-reach-bottom", this.onReachedBottom),
        this.instance.$el.remove();
    }
  }
  class qn {
    constructor(e, t) {
      d(this, "opts"),
        d(this, "total"),
        d(this, "$el"),
        d(this, "$input"),
        d(this, "inputTimer"),
        d(this, "$prevBtn"),
        d(this, "$nextBtn"),
        d(this, "page", 1),
        (this.total = e),
        (this.opts = t),
        (this.$el = wt(
          '<div class="atk-pagination-wrap">\n        <div class="atk-pagination">\n          <div class="atk-btn atk-btn-prev" aria-label="Previous page">\n            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path></svg>\n          </div>\n          <input type="text" class="atk-input" aria-label="Enter the number of page" />\n          <div class="atk-btn atk-btn-next" aria-label="Next page">\n            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path></svg>\n          </div>\n        </div>\n      </div>'
        )),
        (this.$input = this.$el.querySelector(".atk-input")),
        (this.$input.value = `${this.page}`),
        (this.$input.oninput = () => this.input()),
        (this.$input.onkeydown = (e) => this.keydown(e)),
        (this.$prevBtn = this.$el.querySelector(".atk-btn-prev")),
        (this.$nextBtn = this.$el.querySelector(".atk-btn-next")),
        (this.$prevBtn.onclick = () => this.prev()),
        (this.$nextBtn.onclick = () => this.next()),
        this.checkDisabled();
    }
    get pageSize() {
      return this.opts.pageSize;
    }
    get offset() {
      return this.pageSize * (this.page - 1);
    }
    get maxPage() {
      return Math.ceil(this.total / this.pageSize);
    }
    update(e, t) {
      (this.page = Math.ceil(e / this.pageSize) + 1),
        (this.total = t),
        this.setInput(this.page),
        this.checkDisabled();
    }
    setInput(e) {
      this.$input.value = `${e}`;
    }
    input(e = !1) {
      window.clearTimeout(this.inputTimer);
      const t = this.$input.value.trim(),
        n = () => {
          if ("" === t) return void this.setInput(this.page);
          let e = Number(t);
          Number.isNaN(e) || e < 1
            ? this.setInput(this.page)
            : (e > this.maxPage &&
                (this.setInput(this.maxPage), (e = this.maxPage)),
              this.change(e));
        };
      e ? n() : (this.inputTimer = window.setTimeout(() => n(), 800));
    }
    prev() {
      const e = this.page - 1;
      e < 1 || this.change(e);
    }
    next() {
      const e = this.page + 1;
      e > this.maxPage || this.change(e);
    }
    getHasMore() {
      return this.page + 1 <= this.maxPage;
    }
    change(e) {
      (this.page = e),
        this.opts.onChange(this.offset),
        this.setInput(e),
        this.checkDisabled();
    }
    checkDisabled() {
      this.page + 1 > this.maxPage
        ? this.$nextBtn.classList.add("atk-disabled")
        : this.$nextBtn.classList.remove("atk-disabled"),
        this.page - 1 < 1
          ? this.$prevBtn.classList.add("atk-disabled")
          : this.$prevBtn.classList.remove("atk-disabled");
    }
    keydown(e) {
      const t = e.keyCode || e.which;
      if (38 === t) {
        const e = Number(this.$input.value) + 1;
        if (e > this.maxPage) return;
        this.setInput(e), this.input();
      } else if (40 === t) {
        const e = Number(this.$input.value) - 1;
        if (e < 1) return;
        this.setInput(e), this.input();
      } else 13 === t && this.input(!0);
    }
    setLoading(e) {
      e ? Nt(this.$el) : Ht(this.$el);
    }
  }
  class _n {
    constructor() {
      d(this, "instance");
    }
    create(e) {
      return (
        (this.instance = new qn(e.total, {
          pageSize: e.pageSize,
          onChange: (t) =>
            h(this, null, function* () {
              e.ctx.editorResetState(),
                e.ctx.fetch({
                  offset: t,
                  onSuccess: () => {
                    e.ctx.listGotoFirst();
                  },
                });
            }),
        })),
        this.instance.$el
      );
    }
    setLoading(e) {
      this.instance.setLoading(e);
    }
    update(e, t) {
      this.instance.update(e, t);
    }
    next() {
      this.instance.next();
    }
    getHasMore() {
      return this.instance.getHasMore();
    }
    getIsClearComments() {
      return !0;
    }
    dispose() {
      this.instance.$el.remove();
    }
  }
  function On(e) {
    const t = e.getData().getListLastFetch(),
      n = { offset: 0, total: 0 };
    return t
      ? ((n.offset = t.params.offset),
        t.data &&
          (n.total = t.params.flatMode ? t.data.count : t.data.roots_count),
        n)
      : n;
  }
  const Dn = (e) => {
    let t = null;
    e.watchConf(["pagination", "locale"], (n) => {
      const s = e.get("list");
      t && t.dispose(),
        (t = (function (e) {
          return e.pagination.readMore ? new Un() : new _n();
        })(n));
      const { offset: i, total: r } = On(e),
        o = t.create({
          ctx: e,
          pageSize: n.pagination.pageSize,
          total: r,
          readMoreAutoLoad: n.pagination.autoLoad,
        });
      s.$commentsWrap.after(o), null == t || t.update(i, r);
    }),
      e.on("list-loaded", (n) => {
        const { offset: s, total: i } = On(e);
        null == t || t.update(s, i);
      }),
      e.on("list-fetch", (n) => {
        e.getData().getComments().length > 0 &&
          (null == t ? void 0 : t.getIsClearComments(n)) &&
          e.getData().clearComments();
      }),
      e.on("list-failed", () => {
        var e;
        null == (e = null == t ? void 0 : t.showErr) ||
          e.call(t, Ot("loadFail"));
      }),
      e.on("list-fetch", (e) => {
        null == t || t.setLoading(!0);
      }),
      e.on("list-fetched", ({ params: e }) => {
        null == t || t.setLoading(!1);
      });
  };
  class Bn extends nn {
    constructor(e) {
      super(e),
        d(this, "$commentsWrap"),
        d(this, "commentNodes", []),
        (this.$el = wt(
          '<div class="atk-list">\n  <div class="atk-list-header">\n    <div class="atk-comment-count">\n      <div class="atk-text"></div>\n    </div>\n    <div class="atk-right-action">\n      <span data-action="admin-close-comment" class="atk-hide" atk-only-admin-show></span>\n      <span data-action="open-sidebar" class="atk-hide atk-on">\n        <span class="atk-unread-badge" style="display: none"></span>\n        <div class="atk-text"></div>\n      </span>\n    </div>\n  </div>\n  <div class="atk-list-body">\n    <div class="atk-list-comments-wrap"></div>\n  </div>\n  <div class="atk-list-footer">\n    <div class="atk-copyright"></div>\n  </div>\n</div>\n'
        )),
        (this.$commentsWrap = this.$el.querySelector(
          ".atk-list-comments-wrap"
        )),
        Dn(e),
        this.initCrudEvents();
    }
    getCommentsWrapEl() {
      return this.$commentsWrap;
    }
    getCommentNodes() {
      return this.commentNodes;
    }
    getListLayout({ forceFlatMode: e } = {}) {
      return new un({
        $commentsWrap: this.$commentsWrap,
        nestSortBy: this.ctx.conf.nestSort,
        nestMax: this.ctx.conf.nestMax,
        flatMode: "boolean" == typeof e ? e : this.ctx.conf.flatMode,
        createCommentNode: (t, n) => {
          const s = (function (e, t, n, s) {
            const i = new In(t, {
              onAfterRender: () => {
                e.trigger("comment-rendered", i);
              },
              onDelete: (t) => {
                e.getData().deleteComment(t.getID());
              },
              replyTo: n,
              flatMode:
                "boolean" == typeof (null == s ? void 0 : s.forceFlatMode)
                  ? null == s
                    ? void 0
                    : s.forceFlatMode
                  : e.conf.flatMode,
              gravatar: e.conf.gravatar,
              nestMax: e.conf.nestMax,
              heightLimit: e.conf.heightLimit,
              avatarURLBuilder: e.conf.avatarURLBuilder,
              scrollRelativeTo: e.conf.scrollRelativeTo,
              vote: e.conf.vote,
              voteDown: e.conf.voteDown,
              uaBadge: e.conf.uaBadge,
              dateFormatter: e.conf.dateFormatter,
              getApi: () => e.getApi(),
              replyComment: (t, n) => e.replyComment(t, n),
              editComment: (t, n) => e.editComment(t, n),
            });
            return i.render(), i;
          })(this.ctx, t, n, { forceFlatMode: e });
          return this.commentNodes.push(s), s;
        },
        findCommentNode: (e) => this.commentNodes.find((t) => t.getID() === e),
      });
    }
    initCrudEvents() {
      this.ctx.on("list-load", (e) => {
        this.getListLayout().import(e);
      }),
        this.ctx.on("list-loaded", (e) => {
          0 === e.length &&
            ((this.commentNodes = []), (this.$commentsWrap.innerHTML = ""));
        }),
        this.ctx.on("comment-inserted", (e) => {
          var t;
          const n = e.rid
            ? null == (t = this.commentNodes.find((t) => t.getID() === e.rid))
              ? void 0
              : t.getData()
            : void 0;
          this.getListLayout().insert(e, n);
        }),
        this.ctx.on("comment-deleted", (e) => {
          const t = this.commentNodes.find((t) => t.getID() === e.id);
          t
            ? (t.remove(),
              (this.commentNodes = this.commentNodes.filter(
                (t) => t.getID() !== e.id
              )))
            : console.error(`comment node id=${e.id} not found`);
        }),
        this.ctx.on("comment-updated", (e) => {
          const t = this.commentNodes.find((t) => t.getID() === e.id);
          t && t.setData(e);
        });
    }
  }
  let jn, Fn;
  function Wn() {
    return {
      init() {
        (jn = document.body.style.overflow),
          (Fn = document.body.style.paddingRight);
      },
      unlock() {
        (document.body.style.overflow = jn),
          (document.body.style.paddingRight = Fn);
      },
      lock() {
        document.body.style.overflow = "hidden";
        const e = parseInt(
          window
            .getComputedStyle(document.body, null)
            .getPropertyValue("padding-right"),
          10
        );
        document.body.style.paddingRight = `${
          (function () {
            const e = document.createElement("p");
            (e.style.width = "100%"), (e.style.height = "200px");
            const t = document.createElement("div");
            (t.style.position = "absolute"),
              (t.style.top = "0px"),
              (t.style.left = "0px"),
              (t.style.visibility = "hidden"),
              (t.style.width = "200px"),
              (t.style.height = "150px"),
              (t.style.overflow = "hidden"),
              t.appendChild(e),
              document.body.appendChild(t);
            const n = e.offsetWidth;
            t.style.overflow = "scroll";
            let s = e.offsetWidth;
            return (
              n === s && (s = t.clientWidth),
              document.body.removeChild(t),
              n - s
            );
          })() + e || 0
        }px`;
      },
    };
  }
  class zn {
    constructor(e, t) {
      d(this, "allowMaskClose", !0),
        d(this, "onAfterHide"),
        (this.$el = e),
        (this.opts = t);
    }
    setOnAfterHide(e) {
      this.onAfterHide = e;
    }
    setAllowMaskClose(e) {
      this.allowMaskClose = e;
    }
    getAllowMaskClose() {
      return this.allowMaskClose;
    }
    getEl() {
      return this.$el;
    }
    show() {
      this.opts.onShow(), (this.$el.style.display = "");
    }
    hide() {
      this.opts.onHide(),
        (this.$el.style.display = "none"),
        this.onAfterHide && this.onAfterHide();
    }
    destroy() {
      this.opts.onHide(),
        this.$el.remove(),
        this.onAfterHide && this.onAfterHide();
    }
  }
  class Nn {
    constructor() {
      d(this, "$wrap"),
        d(this, "$mask"),
        d(this, "items", []),
        (this.$wrap = wt(
          '<div class="atk-layer-wrap" style="display: none;"><div class="atk-layer-mask"></div></div>'
        )),
        (this.$mask = this.$wrap.querySelector(".atk-layer-mask"));
    }
    createItem(e, t) {
      (t = t || this.createItemElement(e)).setAttribute("data-layer-name", e),
        this.$wrap.appendChild(t);
      const n = new zn(t, {
        onHide: () => this.hideWrap(t),
        onShow: () => this.showWrap(),
      });
      return (
        this.getMask().addEventListener("click", () => {
          n.getAllowMaskClose() && n.hide();
        }),
        this.items.push(n),
        n
      );
    }
    createItemElement(e) {
      const t = document.createElement("div");
      return (
        t.classList.add("atk-layer-item"),
        (t.style.display = "none"),
        this.$wrap.appendChild(t),
        t
      );
    }
    getWrap() {
      return this.$wrap;
    }
    getMask() {
      return this.$mask;
    }
    showWrap() {
      (this.$wrap.style.display = "block"),
        (this.$mask.style.display = "block"),
        this.$mask.classList.add("atk-fade-in"),
        Wn().lock();
    }
    hideWrap(e) {
      this.items
        .map((e) => e.getEl())
        .filter((t) => t !== e && t.isConnected && "none" !== t.style.display)
        .length > 0 || ((this.$wrap.style.display = "none"), Wn().unlock());
    }
  }
  class Hn {
    constructor(e) {
      d(this, "wrap"),
        (this.wrap = new Nn()),
        document.body.appendChild(this.wrap.getWrap()),
        e.on("unmounted", () => {
          this.wrap.getWrap().remove();
        }),
        Wn().init();
    }
    getEl() {
      return this.wrap.getWrap();
    }
    create(e, t) {
      return this.wrap.createItem(e, t);
    }
  }
  const Qn = "ArtalkUser";
  class Vn {
    constructor(e) {
      d(this, "data"), (this.opts = e);
      const t = JSON.parse(window.localStorage.getItem(Qn) || "{}");
      this.data = {
        name: t.name || t.nick || "",
        email: t.email || "",
        link: t.link || "",
        token: t.token || "",
        is_admin: t.is_admin || t.isAdmin || !1,
      };
    }
    getData() {
      return this.data;
    }
    update(e = {}) {
      Object.entries(e).forEach(([e, t]) => {
        this.data[e] = t;
      }),
        window.localStorage.setItem(Qn, JSON.stringify(this.data)),
        this.opts.onUserChanged && this.opts.onUserChanged(this.data);
    }
    logout() {
      this.update({ token: "", is_admin: !1 });
    }
    checkHasBasicUserInfo() {
      return !!this.data.name && !!this.data.email;
    }
  }
  const Gn = {
    i18n(e) {
      _t(e.conf.locale),
        e.watchConf(["locale"], (e) => {
          _t(e.locale);
        });
    },
    user: (e) =>
      new Vn({
        onUserChanged: (t) => {
          e.trigger("user-changed", t);
        },
      }),
    layerManager: (e) => new Hn(e),
    checkerLauncher: (e) =>
      new tn({
        getCtx: () => e,
        getApi: () => e.getApi(),
        onReload: () => e.reload(),
        getCaptchaIframeURL: () =>
          `${e.conf.server}/api/v2/captcha/?t=${+new Date()}`,
      }),
    editor(e) {
      const t = new ln(e);
      return e.$root.appendChild(t.$el), t;
    },
    list(e) {
      const t = new Bn(e);
      return e.$root.appendChild(t.$el), t;
    },
    sidebarLayer: (e) => new cn(e),
    editorPlugs() {},
  };
  function Kn(e) {
    return h(this, null, function* () {
      yield (function (e) {
        return h(this, null, function* () {
          yield Zn({
            opt: e,
            query: "page_comment",
            containers: [e.countEl, "#ArtalkCount"],
          });
        });
      })(e);
      const t = yield (function (e) {
        return h(this, null, function* () {
          if (!e.pvAdd || !e.pageKey) return;
          const t = (yield e.getApi().pages.logPv({
            page_key: e.pageKey,
            page_title: e.pageTitle,
            site_name: e.siteName,
          })).data.pv;
          return { [e.pageKey]: t };
        });
      })(e);
      yield (function (e, t) {
        return h(this, null, function* () {
          yield Zn({
            opt: e,
            query: "page_pv",
            containers: [e.pvEl, "#ArtalkPV"],
            cache: t,
          });
        });
      })(e, t);
    });
  }
  function Zn(e) {
    return h(this, null, function* () {
      const { opt: t } = e;
      let n = e.cache || {};
      const s = (function (e) {
          const t = new Set();
          return (
            new Set(e).forEach((e) => {
              document.querySelectorAll(e).forEach((e) => t.add(e));
            }),
            t
          );
        })(e.containers),
        i = (function (e, t, n, s) {
          const i = Array.from(e)
            .map((e) => e.getAttribute(t) || n)
            .filter((e) => e && "number" != typeof s[e]);
          return [...new Set(i)];
        })(s, t.pageKeyAttr, t.pageKey, n);
      if (i.length > 0) {
        const s = (yield t.getApi().stats.getStats(e.query, {
          page_keys: i.join(","),
          site_name: t.siteName,
        })).data.data;
        n = l(l({}, n), s);
      }
      !(function (e, t, n) {
        e.forEach((e) => {
          const s = e.getAttribute("data-page-key"),
            i = (s && t[s]) || (n && t[n]) || 0;
          e.innerText = `${Number(i)}`;
        });
      })(s, n, t.pageKey);
    });
  }
  const Yn = "ArtalkContent";
  class Xn {
    constructor(e) {
      this.kit = e;
    }
    reqAdd() {
      return h(this, null, function* () {
        return (yield this.kit
          .useApi()
          .comments.createComment(l({}, yield this.getSubmitAddParams()))).data;
      });
    }
    getSubmitAddParams() {
      return h(this, null, function* () {
        const { name: e, email: t, link: n } = this.kit.useUser().getData(),
          s = this.kit.useConf();
        return {
          content: this.kit.useEditor().getContentFinal(),
          name: e,
          email: t,
          link: n,
          rid: 0,
          page_key: s.pageKey,
          page_title: s.pageTitle,
          site_name: s.site,
          ua: yield Tt(),
        };
      });
    }
    postSubmitAdd(e) {
      this.kit.useGlobalCtx().getData().insertComment(e);
    }
  }
  class Jn extends rn {
    constructor(e) {
      super(e),
        d(this, "customs", []),
        d(this, "defaultPreset"),
        (this.defaultPreset = new Xn(this.kit));
      const t = () => this.do();
      this.kit.useMounted(() => {
        this.kit.useGlobalCtx().on("editor-submit", t);
      }),
        this.kit.useUnmounted(() => {
          this.kit.useGlobalCtx().off("editor-submit", t);
        });
    }
    registerCustom(e) {
      this.customs.push(e);
    }
    do() {
      return h(this, null, function* () {
        if ("" === this.kit.useEditor().getContentFinal().trim())
          return void this.kit.useEditor().focus();
        const e = this.customs.find((e) => e.activeCond());
        this.kit.useEditor().showLoading();
        try {
          let t;
          (null == e ? void 0 : e.pre) && e.pre(),
            (t = (null == e ? void 0 : e.req)
              ? yield e.req()
              : yield this.defaultPreset.reqAdd()),
            (null == e ? void 0 : e.post)
              ? e.post(t)
              : this.defaultPreset.postSubmitAdd(t);
        } catch (t) {
          return (
            console.error(t),
            void this.kit
              .useEditor()
              .showNotify(
                `${Ot("commentFail")}: ${t.message || String(t)}`,
                "e"
              )
          );
        } finally {
          this.kit.useEditor().hideLoading();
        }
        this.kit.useEditor().reset(),
          this.kit.useGlobalCtx().trigger("editor-submitted");
      });
    }
  }
  class es extends rn {
    constructor(e) {
      super(e),
        d(this, "emoticons", []),
        d(this, "loadingTask", null),
        d(this, "$grpWrap"),
        d(this, "$grpSwitcher"),
        d(this, "isListLoaded", !1),
        d(this, "isImgLoaded", !1),
        this.kit.useMounted(() => {
          this.usePanel('<div class="atk-editor-plug-emoticons"></div>'),
            this.useBtn(
              `<i aria-label="${Ot(
                "emoticon"
              )}"><svg fill="currentColor"  height="14" viewBox="0 0 14 14" width="14"><path d="m4.26829 5.29294c0-.94317.45893-1.7074 1.02439-1.7074.56547 0 1.02439.76423 1.02439 1.7074s-.45892 1.7074-1.02439 1.7074c-.56546 0-1.02439-.76423-1.02439-1.7074zm4.43903 1.7074c.56546 0 1.02439-.76423 1.02439-1.7074s-.45893-1.7074-1.02439-1.7074c-.56547 0-1.02439.76423-1.02439 1.7074s.45892 1.7074 1.02439 1.7074zm-1.70732 2.73184c-1.51883 0-2.06312-1.52095-2.08361-1.58173l-1.29551.43231c.03414.10244.868 2.51604 3.3798 2.51604 2.51181 0 3.34502-2.41291 3.37982-2.51604l-1.29484-.43573c-.02254.06488-.56683 1.58583-2.08498 1.58583zm7-2.73252c0 3.86004-3.1401 7.00034-7 7.00034s-7-3.1396-7-6.99966c0-3.86009 3.1401-7.00034 7-7.00034s7 3.14025 7 7.00034zm-1.3659 0c0-3.10679-2.5275-5.63442-5.6341-5.63442-3.10663 0-5.63415 2.52832-5.63415 5.6351 0 3.10676 2.52752 5.63446 5.63415 5.63446 3.1066 0 5.6341-2.5277 5.6341-5.63446z"/></svg></i>`
            );
        }),
        this.kit.useUnmounted(() => {}),
        this.useContentTransformer((e) => this.transEmoticonImageText(e)),
        this.usePanelShow(() => {
          (() => {
            h(this, null, function* () {
              yield this.loadEmoticonsData(),
                this.isImgLoaded ||
                  (this.initEmoticonsList(), (this.isImgLoaded = !0)),
                setTimeout(() => {
                  this.changeListHeight();
                }, 30);
            });
          })();
        }),
        this.usePanelHide(() => {
          this.$panel.parentElement.style.height = "";
        }),
        window.setTimeout(() => {
          this.loadEmoticonsData();
        }, 1e3);
    }
    loadEmoticonsData() {
      return h(this, null, function* () {
        this.isListLoaded ||
          (null === this.loadingTask
            ? ((this.loadingTask = (() =>
                h(this, null, function* () {
                  Nt(this.$panel),
                    (this.emoticons = yield this.handleData(
                      this.kit.useConf().emoticons
                    )),
                    Ht(this.$panel),
                    (this.loadingTask = null),
                    (this.isListLoaded = !0);
                }))()),
              yield this.loadingTask)
            : yield this.loadingTask);
      });
    }
    handleData(e) {
      return h(this, null, function* () {
        if (
          (!Array.isArray(e) &&
            ["object", "string"].includes(typeof e) &&
            (e = [e]),
          !Array.isArray(e))
        )
          return (
            Kt(
              this.$panel,
              `[${Ot("emoticon")}] Data must be of Array/Object/String type`
            ),
            Ht(this.$panel),
            []
          );
        const t = (t) => {
            "object" == typeof t &&
              ((t.name && e.find((e) => e.name === t.name)) || e.push(t));
          },
          n = (e) =>
            h(this, null, function* () {
              yield Promise.all(
                e.map((e, s) =>
                  h(this, null, function* () {
                    if ("object" != typeof e || Array.isArray(e)) {
                      if (Array.isArray(e)) yield n(e);
                      else if ("string" == typeof e) {
                        const s = yield this.remoteLoad(e);
                        Array.isArray(s)
                          ? yield n(s)
                          : "object" == typeof s && t(s);
                      }
                    } else t(e);
                  })
                )
              );
            });
        return (
          yield n(e),
          e.forEach((e) => {
            if (this.isOwOFormat(e)) {
              this.convertOwO(e).forEach((e) => {
                t(e);
              });
            } else
              Array.isArray(e) &&
                e.forEach((e) => {
                  t(e);
                });
          }),
          (e = e.filter(
            (e) => "object" == typeof e && !Array.isArray(e) && !!e && !!e.name
          )),
          this.solveNullKey(e),
          this.solveSameKey(e),
          e
        );
      });
    }
    remoteLoad(e) {
      return h(this, null, function* () {
        if (!e) return [];
        try {
          const t = yield fetch(e);
          return yield t.json();
        } catch (t) {
          return (
            Ht(this.$panel),
            console.error("[Emoticons] Load Failed:", t),
            Kt(
              this.$panel,
              `[${Ot("emoticon")}] ${Ot("loadFail")}: ${String(t)}`
            ),
            []
          );
        }
      });
    }
    solveNullKey(e) {
      e.forEach((e) => {
        e.items.forEach((t, n) => {
          t.key || (t.key = `${e.name} ${n + 1}`);
        });
      });
    }
    solveSameKey(e) {
      const t = {};
      e.forEach((e) => {
        e.items.forEach((e) => {
          e.key &&
            "" !== String(e.key).trim() &&
            (t[e.key] ? t[e.key]++ : (t[e.key] = 1),
            t[e.key] > 1 && (e.key = `${e.key} ${t[e.key]}`));
        });
      });
    }
    isOwOFormat(e) {
      try {
        return (
          "object" == typeof e &&
          !!Object.values(e).length &&
          Array.isArray(Object.keys(Object.values(e)[0].container)) &&
          Object.keys(Object.values(e)[0].container[0]).includes("icon")
        );
      } catch (t) {
        return !1;
      }
    }
    convertOwO(e) {
      const t = [];
      return (
        Object.entries(e).forEach(([e, n]) => {
          const s = { name: e, type: n.type, items: [] };
          n.container.forEach((t, n) => {
            const i = t.icon;
            if (/<(img|IMG)/.test(i)) {
              const e = /src=["'](.*?)["']/.exec(i);
              e && e.length > 1 && (t.icon = e[1]);
            }
            s.items.push({ key: t.text || `${e} ${n + 1}`, val: t.icon });
          }),
            t.push(s);
        }),
        t
      );
    }
    initEmoticonsList() {
      (this.$grpWrap = wt('<div class="atk-grp-wrap"></div>')),
        this.$panel.append(this.$grpWrap),
        this.emoticons.forEach((e, t) => {
          const n = wt('<div class="atk-grp" style="display: none;"></div>');
          this.$grpWrap.append(n),
            n.setAttribute("data-index", String(t)),
            n.setAttribute("data-grp-name", e.name),
            n.setAttribute("data-type", e.type),
            e.items.forEach((t) => {
              const s = wt('<span class="atk-item"></span>');
              if (
                (n.append(s),
                t.key &&
                  !new RegExp(`^(${e.name})?\\s?[0-9]+$`).test(t.key) &&
                  s.setAttribute("title", t.key),
                "image" === e.type)
              ) {
                const e = document.createElement("img");
                (e.src = t.val), (e.alt = t.key), s.append(e);
              } else s.innerText = t.val;
              s.onclick = () => {
                "image" === e.type
                  ? this.kit.useEditor().insertContent(`:[${t.key}]`)
                  : this.kit.useEditor().insertContent(t.val || "");
              };
            });
        }),
        this.emoticons.length > 1 &&
          ((this.$grpSwitcher = wt('<div class="atk-grp-switcher"></div>')),
          this.$panel.append(this.$grpSwitcher),
          this.emoticons.forEach((e, t) => {
            const n = wt("<span />");
            (n.innerText = e.name),
              n.setAttribute("data-index", String(t)),
              (n.onclick = () => this.openGrp(t)),
              this.$grpSwitcher.append(n);
          })),
        this.emoticons.length > 0 && this.openGrp(0);
    }
    openGrp(e) {
      var t, n, s;
      Array.from(this.$grpWrap.children).forEach((t) => {
        const n = t;
        n.getAttribute("data-index") !== String(e)
          ? (n.style.display = "none")
          : (n.style.display = "");
      }),
        null == (t = this.$grpSwitcher) ||
          t
            .querySelectorAll("span.active")
            .forEach((e) => e.classList.remove("active")),
        null ==
          (s =
            null == (n = this.$grpSwitcher)
              ? void 0
              : n.querySelector(`span[data-index="${e}"]`)) ||
          s.classList.add("active"),
        this.changeListHeight();
    }
    changeListHeight() {}
    transEmoticonImageText(e) {
      return this.emoticons && Array.isArray(this.emoticons)
        ? (this.emoticons.forEach((t) => {
            "image" === t.type &&
              Object.entries(t.items).forEach(([t, n]) => {
                e = e
                  .split(`:[${n.key}]`)
                  .join(`<img src="${n.val}" atk-emoticon="${n.key}">`);
              });
          }),
          e)
        : e;
    }
  }
  const ts = ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"];
  class ns extends rn {
    constructor(e) {
      super(e),
        d(this, "$imgUploadInput"),
        this.kit.useMounted(() => this.init()),
        this.initDragImg();
    }
    init() {
      (this.$imgUploadInput = document.createElement("input")),
        (this.$imgUploadInput.type = "file"),
        (this.$imgUploadInput.style.display = "none"),
        (this.$imgUploadInput.accept = ts.map((e) => `.${e}`).join(","));
      const e = this.useBtn(
        `<i aria-label="${Ot(
          "uploadImage"
        )}"><svg fill="currentColor"  height="14" viewBox="0 0 14 14" width="14"><path d="m0 1.94444c0-1.074107.870333-1.94444 1.94444-1.94444h10.11116c1.0741 0 1.9444.870333 1.9444 1.94444v10.11116c0 1.0741-.8703 1.9444-1.9444 1.9444h-10.11116c-1.074107 0-1.94444-.8703-1.94444-1.9444zm1.94444-.38888c-.21466 0-.38888.17422-.38888.38888v7.06689l2.33333-2.33333 2.33333 2.33333 3.88888-3.88889 2.3333 2.33334v-5.51134c0-.21466-.1742-.38888-.3888-.38888zm10.49996 8.09977-2.3333-2.33333-3.88888 3.8889-2.33333-2.33334-2.33333 2.33334v.8447c0 .2146.17422.3888.38888.3888h10.11116c.2146 0 .3888-.1742.3888-.3888zm-7.1944-6.54422c-.75133 0-1.36111.60978-1.36111 1.36111 0 .75134.60978 1.36111 1.36111 1.36111s1.36111-.60977 1.36111-1.36111c0-.75133-.60978-1.36111-1.36111-1.36111z"/></svg></i>`
      );
      e.after(this.$imgUploadInput),
        (e.onclick = () => {
          const e = this.$imgUploadInput;
          (e.onchange = () => {
            (() => {
              h(this, null, function* () {
                if (!e.files || 0 === e.files.length) return;
                const t = e.files[0];
                this.uploadImg(t);
              });
            })();
          }),
            e.click();
        }),
        this.kit.useConf().imgUpload ||
          this.$btn.setAttribute("atk-only-admin-show", "");
    }
    initDragImg() {
      const e = (e) => {
          if (e)
            for (let t = 0; t < e.length; t++) {
              const n = e[t];
              this.uploadImg(n);
            }
        },
        t = (e) => {
          e.stopPropagation(), e.preventDefault();
        },
        n = (t) => {
          var n;
          const s = null == (n = t.dataTransfer) ? void 0 : n.files;
          (null == s ? void 0 : s.length) && (t.preventDefault(), e(s));
        },
        s = (t) => {
          var n;
          const s = null == (n = t.clipboardData) ? void 0 : n.files;
          (null == s ? void 0 : s.length) && (t.preventDefault(), e(s));
        };
      this.kit.useMounted(() => {
        this.kit.useUI().$textarea.addEventListener("dragover", t),
          this.kit.useUI().$textarea.addEventListener("drop", n),
          this.kit.useUI().$textarea.addEventListener("paste", s);
      }),
        this.kit.useUnmounted(() => {
          this.kit.useUI().$textarea.removeEventListener("dragover", t),
            this.kit.useUI().$textarea.removeEventListener("drop", n),
            this.kit.useUI().$textarea.removeEventListener("paste", s);
        });
    }
    uploadImg(e) {
      return h(this, null, function* () {
        const t = /[^.]+$/.exec(e.name);
        if (!t || !ts.includes(String(t[0]).toLowerCase())) return;
        if (!this.kit.useUser().checkHasBasicUserInfo())
          return void this.kit
            .useEditor()
            .showNotify(Ot("uploadLoginMsg"), "w");
        let n = "\n";
        "" === this.kit.useUI().$textarea.value.trim() && (n = "");
        const s = `${n}![](Uploading ${e.name}...)`;
        let i;
        this.kit.useEditor().insertContent(s);
        try {
          const t = this.kit.useConf().imgUploader;
          i = t
            ? { public_url: yield t(e) }
            : (yield this.kit.useApi().upload.upload({ file: e })).data;
        } catch (r) {
          console.error(r),
            this.kit
              .useEditor()
              .showNotify(`${Ot("uploadFail")}: ${r.message}`, "e");
        }
        if (i && i.public_url) {
          let e = i.public_url;
          At(e) || (e = Lt({ base: this.kit.useConf().server, path: e })),
            this.kit
              .useEditor()
              .setContent(
                this.kit.useUI().$textarea.value.replace(s, `${n}![](${e})`)
              );
        } else this.kit.useEditor().setContent(this.kit.useUI().$textarea.value.replace(s, ""));
      });
    }
  }
  class ss extends rn {
    constructor(e) {
      super(e),
        d(this, "isPlugPanelShow", !1),
        this.kit.useMounted(() => {
          this.usePanel('<div class="atk-editor-plug-preview"></div>'),
            this.useBtn(
              `<i aria-label="${Ot(
                "preview"
              )}"><svg fill="currentColor"  viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg></i>`
            );
        }),
        this.kit.useUnmounted(() => {}),
        this.kit.useEvents().on("content-updated", (e) => {
          this.isPlugPanelShow && this.updateContent();
        }),
        this.usePanelShow(() => {
          (this.isPlugPanelShow = !0), this.updateContent();
        }),
        this.usePanelHide(() => {
          this.isPlugPanelShow = !1;
        });
    }
    updateContent() {
      this.$panel.innerHTML = this.kit.useEditor().getContentMarked();
    }
  }
  const is = [
    class extends rn {
      constructor(e) {
        super(e);
        const t = () => {
          this.save();
        };
        this.kit.useMounted(() => {
          const e = window.localStorage.getItem(Yn) || "";
          "" !== e.trim() &&
            (this.kit.useEditor().showNotify(Ot("restoredMsg"), "i"),
            this.kit.useEditor().setContent(e)),
            this.kit.useEvents().on("content-updated", t);
        }),
          this.kit.useUnmounted(() => {
            this.kit.useEvents().off("content-updated", t);
          });
      }
      save() {
        window.localStorage.setItem(
          Yn,
          this.kit.useEditor().getContentRaw().trim()
        );
      }
    },
    class extends rn {
      get $inputs() {
        return this.kit.useEditor().getHeaderInputEls();
      }
      constructor(e) {
        super(e);
        const t = {},
          n = {},
          s = (e, t, n) => () => {
            this.kit.useEvents().trigger(e, { field: n, $input: t });
          };
        this.kit.useMounted(() => {
          Object.entries(this.$inputs).forEach(([e, i]) => {
            i.addEventListener("input", (t[e] = s("header-input", i, e))),
              i.addEventListener("change", (n[e] = s("header-change", i, e)));
          });
        }),
          this.kit.useUnmounted(() => {
            Object.entries(this.$inputs).forEach(([e, s]) => {
              s.removeEventListener("input", t[e]),
                s.removeEventListener("change", n[e]);
            });
          });
      }
    },
    class extends rn {
      constructor(e) {
        super(e), d(this, "query", { timer: null, abortFn: null });
        const t = ({ $input: e, field: t }) => {
            "edit" !== this.kit.useEditor().getState() &&
              (this.kit.useUser().update({ [t]: e.value.trim() }),
              ("name" !== t && "email" !== t) || this.fetchUserInfo());
          },
          n = { name: Ot("nick"), email: Ot("email"), link: Ot("link") };
        this.kit.useMounted(() => {
          Object.entries(this.kit.useEditor().getHeaderInputEls()).forEach(
            ([e, t]) => {
              (t.placeholder = n[e]),
                (t.value = this.kit.useUser().getData()[e] || "");
            }
          ),
            this.kit.useEvents().on("header-input", t);
        }),
          this.kit.useUnmounted(() => {
            this.kit.useEvents().off("header-input", t);
          });
      }
      fetchUserInfo() {
        this.kit.useUser().logout(),
          this.query.timer && window.clearTimeout(this.query.timer),
          this.query.abortFn && this.query.abortFn(),
          (this.query.timer = window.setTimeout(() => {
            this.query.timer = null;
            const e = this.kit.useApi(),
              t = "getUserCancelToken";
            (this.query.abortFn = () => e.abortRequest(t)),
              e.user
                .getUser(l({}, e.getUserFields()), { cancelToken: t })
                .then((e) => this.onUserInfoFetched(e.data))
                .catch((e) => {})
                .finally(() => {
                  this.query.abortFn = null;
                });
          }, 400));
      }
      onUserInfoFetched(e) {
        var t;
        e.is_login || this.kit.useUser().logout(),
          this.kit.useGlobalCtx().getData().updateNotifies(e.notifies),
          this.kit.useUser().checkHasBasicUserInfo() &&
            !e.is_login &&
            (null == (t = e.user) ? void 0 : t.is_admin) &&
            this.kit.useGlobalCtx().checkAdmin({ onSuccess: () => {} }),
          e.user &&
            e.user.link &&
            ((this.kit.useUI().$link.value = e.user.link),
            this.kit.useUser().update({ link: e.user.link }));
      }
    },
    class extends rn {
      constructor(e) {
        super(e);
        const t = ({ field: e }) => {
          "link" === e && this.onLinkInputChange();
        };
        this.kit.useMounted(() => {
          this.kit.useEvents().on("header-change", t);
        }),
          this.kit.useUnmounted(() => {
            this.kit.useEvents().off("header-change", t);
          });
      }
      onLinkInputChange() {
        const e = this.kit.useUI().$link.value.trim();
        e &&
          !/^(http|https):\/\//.test(e) &&
          ((this.kit.useUI().$link.value = `https://${e}`),
          this.kit.useUser().update({ link: this.kit.useUI().$link.value }));
      }
    },
    class extends rn {
      constructor(e) {
        super(e);
        const t = (e) => this.onKeydown(e),
          n = () => this.onInput();
        this.kit.useMounted(() => {
          (this.kit.useUI().$textarea.placeholder =
            this.kit.useConf().placeholder || Ot("placeholder")),
            this.kit.useUI().$textarea.addEventListener("keydown", t),
            this.kit.useUI().$textarea.addEventListener("input", n);
        }),
          this.kit.useUnmounted(() => {
            this.kit.useUI().$textarea.removeEventListener("keydown", t),
              this.kit.useUI().$textarea.removeEventListener("input", n);
          }),
          this.kit.useEvents().on("content-updated", () => {
            window.setTimeout(() => {
              this.adaptiveHeightByContent();
            }, 80);
          });
      }
      onKeydown(e) {
        9 === (e.keyCode || e.which) &&
          (e.preventDefault(), this.kit.useEditor().insertContent("\t"));
      }
      onInput() {
        this.kit
          .useEvents()
          .trigger("content-updated", this.kit.useEditor().getContentRaw());
      }
      adaptiveHeightByContent() {
        const e =
          this.kit.useUI().$textarea.offsetHeight -
          this.kit.useUI().$textarea.clientHeight;
        (this.kit.useUI().$textarea.style.height = "0px"),
          (this.kit.useUI().$textarea.style.height = `${
            this.kit.useUI().$textarea.scrollHeight + e
          }px`);
      }
    },
    Jn,
    class extends rn {
      constructor(e) {
        super(e);
        const t = () => {
          this.kit.useEditor().submit();
        };
        this.kit.useMounted(() => {
          (this.kit.useUI().$submitBtn.innerText =
            this.kit.useConf().sendBtn || Ot("send")),
            this.kit.useUI().$submitBtn.addEventListener("click", t);
        }),
          this.kit.useUnmounted(() => {
            this.kit.useUI().$submitBtn.removeEventListener("click", t);
          });
      }
    },
    on,
    class extends rn {
      constructor(e) {
        super(e),
          d(this, "comment"),
          this.useEditorStateEffect(
            "reply",
            (e) => (
              this.setReply(e),
              () => {
                this.cancelReply();
              }
            )
          ),
          this.kit.useEvents().on("mounted", () => {
            const e = this.kit.useDeps(Jn);
            if (!e) throw Error("SubmitPlug not initialized");
            const t = new Xn(this.kit);
            e.registerCustom({
              activeCond: () => !!this.comment,
              req: () =>
                h(this, null, function* () {
                  if (!this.comment)
                    throw new Error("reply comment cannot be empty");
                  return (yield this.kit.useApi().comments.createComment(
                    c(l({}, yield t.getSubmitAddParams()), {
                      rid: this.comment.id,
                      page_key: this.comment.page_key,
                      page_title: void 0,
                      site_name: this.comment.site_name,
                    })
                  )).data;
                }),
              post: (e) => {
                const n = this.kit.useConf();
                e.page_key !== n.pageKey &&
                  window.open(`${e.page_url}#atk-comment-${e.id}`),
                  t.postSubmitAdd(e);
              },
            });
          });
      }
      setReply(e) {
        const t = this.kit.useUI();
        if (!t.$sendReplyBtn) {
          const n = wt(
            `<span class="atk-state-btn"><span class="atk-text-wrap">${Ot(
              "reply"
            )} <span class="atk-text"></span></span><span class="atk-cancel atk-icon-close atk-icon"></span></span>`
          );
          (n.querySelector(".atk-text").innerText = `@${e.nick}`),
            n.addEventListener("click", () => {
              this.kit.useEditor().resetState();
            }),
            t.$stateWrap.append(n),
            (t.$sendReplyBtn = n);
        }
        (this.comment = e), t.$textarea.focus();
      }
      cancelReply() {
        if (!this.comment) return;
        const e = this.kit.useUI();
        e.$sendReplyBtn &&
          (e.$sendReplyBtn.remove(), (e.$sendReplyBtn = void 0)),
          (this.comment = void 0);
      }
    },
    class extends rn {
      constructor(e) {
        super(e),
          d(this, "comment"),
          d(this, "originalSubmitBtnText", "Send"),
          this.useEditorStateEffect(
            "edit",
            (e) => (
              this.edit(e),
              () => {
                this.cancelEdit();
              }
            )
          ),
          this.kit.useMounted(() => {
            const e = this.kit.useDeps(Jn);
            if (!e) throw Error("SubmitPlug not initialized");
            e.registerCustom({
              activeCond: () => !!this.comment,
              req: () =>
                h(this, null, function* () {
                  const e = {
                      content: this.kit.useEditor().getContentFinal(),
                      nick: this.kit.useUI().$name.value,
                      email: this.kit.useUI().$email.value,
                      link: this.kit.useUI().$link.value,
                    },
                    t = this.comment;
                  return (yield this.kit
                    .useApi()
                    .comments.updateComment(t.id, l(l({}, t), e))).data;
                }),
              post: (e) => {
                this.kit.useGlobalCtx().getData().updateComment(e);
              },
            });
          });
      }
      edit(e) {
        const t = this.kit.useUI();
        if (!t.$editCancelBtn) {
          const e = wt(
            `<span class="atk-state-btn"><span class="atk-text-wrap">${Ot(
              "editCancel"
            )}</span><span class="atk-cancel atk-icon-close atk-icon"></span></span>`
          );
          (e.onclick = () => {
            this.kit.useEditor().resetState();
          }),
            t.$stateWrap.append(e),
            (t.$editCancelBtn = e);
        }
        (this.comment = e),
          (t.$header.style.display = "none"),
          (t.$name.value = e.nick || ""),
          (t.$email.value = e.email || ""),
          (t.$link.value = e.link || ""),
          this.kit.useEditor().setContent(e.content),
          t.$textarea.focus(),
          this.updateSubmitBtnText(Ot("save"));
      }
      cancelEdit() {
        if (!this.comment) return;
        const e = this.kit.useUI();
        e.$editCancelBtn &&
          (e.$editCancelBtn.remove(), (e.$editCancelBtn = void 0)),
          (this.comment = void 0);
        const { name: t, email: n, link: s } = this.kit.useUser().getData();
        (e.$name.value = t),
          (e.$email.value = n),
          (e.$link.value = s),
          this.kit.useEditor().setContent(""),
          this.restoreSubmitBtnText(),
          (e.$header.style.display = "");
      }
      updateSubmitBtnText(e) {
        (this.originalSubmitBtnText = this.kit.useUI().$submitBtn.innerText),
          (this.kit.useUI().$submitBtn.innerText = e);
      }
      restoreSubmitBtnText() {
        this.kit.useUI().$submitBtn.innerText = this.originalSubmitBtnText;
      }
    },
    class extends rn {
      constructor(e) {
        super(e);
        const t = () => this.open(),
          n = () => this.close();
        this.kit.useMounted(() => {
          this.kit.useEvents().on("editor-open", t),
            this.kit.useEvents().on("editor-close", n);
        }),
          this.kit.useUnmounted(() => {
            this.kit.useEvents().off("editor-open", t),
              this.kit.useEvents().off("editor-close", n);
          });
      }
      open() {
        var e;
        null ==
          (e = this.kit
            .useUI()
            .$textareaWrap.querySelector(".atk-comment-closed")) || e.remove(),
          (this.kit.useUI().$textarea.style.display = ""),
          (this.kit.useUI().$bottom.style.display = "");
      }
      close() {
        this.kit.useUI().$textareaWrap.querySelector(".atk-comment-closed") ||
          this.kit
            .useUI()
            .$textareaWrap.prepend(
              wt(
                `<div class="atk-comment-closed">${Ot(
                  "onlyAdminCanReply"
                )}</div>`
              )
            ),
          this.kit.useUser().getData().is_admin
            ? ((this.kit.useUI().$textarea.style.display = ""),
              (this.kit.useUI().$bottom.style.display = ""))
            : ((this.kit.useUI().$textarea.style.display = "none"),
              this.kit.useEvents().trigger("panel-close"),
              (this.kit.useUI().$bottom.style.display = "none"));
      }
    },
    es,
    ns,
    ss,
  ];
  class rs {
    constructor(e) {
      this.plugs = e;
    }
    useEditor() {
      return this.plugs.editor;
    }
    useGlobalCtx() {
      return this.plugs.editor.ctx;
    }
    useConf() {
      return this.plugs.editor.ctx.conf;
    }
    useApi() {
      return this.plugs.editor.ctx.getApi();
    }
    useUser() {
      return this.plugs.editor.ctx.get("user");
    }
    useUI() {
      return this.plugs.editor.getUI();
    }
    useEvents() {
      return this.plugs.getEvents();
    }
    useMounted(e) {
      this.useEvents().on("mounted", e);
    }
    useUnmounted(e) {
      this.useEvents().on("unmounted", e);
    }
    useDeps(e) {
      return this.plugs.get(e);
    }
  }
  class os {
    constructor(e) {
      d(this, "plugs", []),
        d(this, "openedPlug", null),
        d(this, "events", new Dt()),
        (this.editor = e);
      let t = !1;
      this.editor.ctx.watchConf(
        ["imgUpload", "emoticons", "preview", "editorTravel", "locale"],
        (e) => {
          t && this.getEvents().trigger("unmounted"),
            this.clear(),
            (function (e) {
              const t = new Map();
              return (
                t.set(ns, e.imgUpload),
                t.set(es, e.emoticons),
                t.set(ss, e.preview),
                t.set(on, e.editorTravel),
                is.filter((e) => !t.has(e) || !!t.get(e))
              );
            })(e).forEach((e) => {
              const t = new rs(this);
              this.plugs.push(new e(t));
            }),
            this.getEvents().trigger("mounted"),
            (t = !0),
            this.loadPluginUI();
        }
      ),
        this.events.on("panel-close", () => this.closePlugPanel());
    }
    getPlugs() {
      return this.plugs;
    }
    getEvents() {
      return this.events;
    }
    clear() {
      (this.plugs = []),
        (this.events = new Dt()),
        this.openedPlug && this.closePlugPanel();
    }
    loadPluginUI() {
      (this.editor.getUI().$plugPanelWrap.innerHTML = ""),
        (this.editor.getUI().$plugPanelWrap.style.display = "none"),
        (this.editor.getUI().$plugBtnWrap.innerHTML = ""),
        this.plugs.forEach((e) => this.loadPluginItem(e));
    }
    loadPluginItem(e) {
      const t = e.$btn;
      if (!t) return;
      this.editor.getUI().$plugBtnWrap.appendChild(t),
        !t.onclick &&
          (t.onclick = () => {
            this.editor
              .getUI()
              .$plugBtnWrap.querySelectorAll(".active")
              .forEach((e) => e.classList.remove("active")),
              e !== this.openedPlug
                ? (this.openPlugPanel(e), t.classList.add("active"))
                : this.closePlugPanel();
          });
      const n = e.$panel;
      n &&
        ((n.style.display = "none"),
        this.editor.getUI().$plugPanelWrap.appendChild(n));
    }
    get(e) {
      return this.plugs.find((t) => t instanceof e);
    }
    openPlugPanel(e) {
      this.plugs.forEach((t) => {
        const n = t.$panel;
        n &&
          (t === e
            ? ((n.style.display = ""), this.events.trigger("panel-show", e))
            : ((n.style.display = "none"),
              this.events.trigger("panel-hide", e)));
      }),
        (this.editor.getUI().$plugPanelWrap.style.display = ""),
        (this.openedPlug = e);
    }
    closePlugPanel() {
      this.openedPlug &&
        ((this.editor.getUI().$plugPanelWrap.style.display = "none"),
        this.events.trigger("panel-hide", this.openedPlug),
        (this.openedPlug = null));
    }
    getTransformedContent(e) {
      let t = e;
      return (
        this.plugs.forEach((e) => {
          e.contentTransformer && (t = e.contentTransformer(t));
        }),
        t
      );
    }
  }
  const as = "2.9.1";
  function ls(e) {
    const t = wt('<span><span class="error-message"></span><br/><br/></span>');
    if (
      ((t.querySelector(".error-message").innerText = `${Ot(
        "listLoadFailMsg"
      )}\n${e.errMsg}`),
      e.retryFn)
    ) {
      const n = wt(`<span style="cursor:pointer;">${Ot("listRetry")}</span>`);
      (n.onclick = () => e.retryFn && e.retryFn()), t.appendChild(n);
    }
    if (e.onOpenSidebar) {
      const n = wt(
        `<span atk-only-admin-show> | <span style="cursor:pointer;">${Ot(
          "openName",
          { name: Ot("ctrlCenter") }
        )}</span></span>`
      );
      t.appendChild(n),
        (n.onclick = () => e.onOpenSidebar && e.onOpenSidebar());
    }
    Kt(e.$err, t);
  }
  let cs = !1;
  let ds;
  function hs(e, t) {
    const n = "atk-dark-mode";
    e.forEach((e) => {
      t ? e.classList.add(n) : e.classList.remove(n);
    });
  }
  const us = [
      (e) => {
        e.watchConf(["imgLazyLoad", "markedOptions"], (t) => {
          !(function (e) {
            try {
              if (!be.name) return;
            } catch (n) {
              return;
            }
            const t = new be();
            t.setOptions(
              l(
                l({ renderer: dt({ imgLazyLoad: e.imgLazyLoad }) }, ft),
                e.markedOptions
              )
            ),
              (gt = t);
          })({
            markedOptions: e.getConf().markedOptions,
            imgLazyLoad: e.getConf().imgLazyLoad,
          });
        }),
          e.watchConf(["markedReplacers"], (e) => {
            var t;
            e.markedReplacers && ((t = e.markedReplacers), (mt = t));
          });
      },
      (e) => {
        const t = e.get("editor"),
          n = new os(t);
        e.inject("editorPlugs", n);
      },
      (e) => {
        const t = () => {
          var t;
          (t = e.get("user").getData().is_admin),
            (function (e) {
              const t = [];
              e.$root
                .querySelectorAll("[atk-only-admin-show]")
                .forEach((e) => t.push(e));
              const n = document.querySelector(".atk-sidebar");
              return (
                n &&
                  n
                    .querySelectorAll("[atk-only-admin-show]")
                    .forEach((e) => t.push(e)),
                t
              );
            })({ $root: e.$root }).forEach((e) => {
              t ? e.classList.remove("atk-hide") : e.classList.add("atk-hide");
            });
        };
        e.on("list-loaded", () => {
          t();
        }),
          e.on("user-changed", (e) => {
            t();
          });
      },
      ...[
        (e) => {
          e.on("list-fetch", (t) => {
            if (e.getData().getLoading()) return;
            e.getData().setLoading(!0);
            const n = l(
              {
                offset: 0,
                limit: e.conf.pagination.pageSize,
                flatMode: e.conf.flatMode,
                paramsModifier: e.conf.listFetchParamsModifier,
              },
              t
            );
            e.getData().setListLastFetch({ params: n });
            const s = {
              limit: n.limit,
              offset: n.offset,
              flat_mode: n.flatMode,
              page_key: e.getConf().pageKey,
              site_name: e.getConf().site,
            };
            n.paramsModifier && n.paramsModifier(s),
              e
                .getApi()
                .comments.getComments(l(l({}, s), e.getApi().getUserFields()))
                .then(({ data: t }) => {
                  e.getData().setListLastFetch({ params: n, data: t }),
                    e.getData().loadComments(t.comments),
                    e.getData().updatePage(t.page),
                    n.onSuccess && n.onSuccess(t),
                    e.trigger("list-fetched", { params: n, data: t });
                })
                .catch((t) => {
                  const s = { msg: t.msg || String(t), data: t.data };
                  throw (
                    (n.onError && n.onError(s),
                    e.trigger("list-failed", s),
                    e.trigger("list-fetched", { params: n, error: s }),
                    t)
                  );
                })
                .finally(() => {
                  e.getData().setLoading(!1);
                });
          });
        },
        (e) => {
          e.on("list-fetch", (t) => {
            const n = e.get("list");
            0 === t.offset && Qt(!0, n.$el);
          }),
            e.on("list-fetched", () => {
              Qt(!1, e.get("list").$el);
            });
        },
        (e) => {
          e.on("comment-rendered", (t) => {
            if (!0 === e.conf.listUnreadHighlight) {
              const n = e.getData().getNotifies(),
                s = n.find((e) => e.comment_id === t.getID());
              s
                ? (t.getRender().setUnread(!0),
                  t.getRender().setOpenAction(() => {
                    window.open(s.read_link),
                      e
                        .getData()
                        .updateNotifies(
                          n.filter((e) => e.comment_id !== t.getID())
                        );
                  }))
                : t.getRender().setUnread(!1);
            }
          }),
            e.on("list-goto", (t) => {
              const n = xt("atk_notify_key");
              n &&
                e
                  .getApi()
                  .notifies.markNotifyRead(t, n)
                  .then(() => {
                    e.getData().updateNotifies(
                      e
                        .getData()
                        .getNotifies()
                        .filter((e) => e.comment_id !== t)
                    );
                  });
            });
        },
        (e) => {
          let t;
          e.on("mounted", () => {
            const n = e.get("list");
            (t = n.$el.querySelector('[data-action="admin-close-comment"]')),
              t.addEventListener("click", () => {
                const t = e.getData().getPage();
                if (!t) throw new Error("Page data not found");
                (t.admin_only = !t.admin_only),
                  (function (e, t) {
                    e.editorShowLoading(),
                      e
                        .getApi()
                        .pages.updatePage(t.id, t)
                        .then(({ data: t }) => {
                          e.getData().updatePage(t);
                        })
                        .catch((t) => {
                          e.editorShowNotify(
                            `${Ot("editFail")}: ${t.message || String(t)}`,
                            "e"
                          );
                        })
                        .finally(() => {
                          e.editorHideLoading();
                        });
                  })(e, t);
              });
          }),
            e.on("page-loaded", (n) => {
              var s, i;
              const r = e.get("editor");
              !0 === (null == n ? void 0 : n.admin_only)
                ? (null == (s = r.getPlugs()) ||
                    s.getEvents().trigger("editor-close"),
                  t && (t.innerText = Ot("openComment")))
                : (null == (i = r.getPlugs()) ||
                    i.getEvents().trigger("editor-open"),
                  t && (t.innerText = Ot("closeComment")));
            }),
            e.on("list-loaded", (t) => {
              e.editorResetState();
            });
        },
        (e) => {
          e.on("list-loaded", () => {
            (() => {
              var t, n;
              const s = e
                .get("list")
                .$el.querySelector(".atk-comment-count .atk-text");
              if (!s) return;
              const i = bt(
                Ot("counter", {
                  count: `${
                    Number(
                      null ==
                        (n =
                          null == (t = e.getData().getListLastFetch())
                            ? void 0
                            : t.data)
                        ? void 0
                        : n.count
                    ) || 0
                  }`,
                })
              );
              s.innerHTML = i.replace(
                /(\d+)/,
                '<span class="atk-comment-count-num">$1</span>'
              );
            })();
          }),
            e.on("comment-inserted", () => {
              const t = e.getData().getListLastFetch();
              (null == t ? void 0 : t.data) && (t.data.count += 1);
            }),
            e.on("comment-deleted", () => {
              const t = e.getData().getListLastFetch();
              (null == t ? void 0 : t.data) && (t.data.count -= 1);
            });
        },
        (e) => {
          let t = null;
          const n = () => {
            if (!t) return;
            const n = e.get("user").getData();
            if (n.name && n.email) {
              t.classList.remove("atk-hide");
              const e = t.querySelector(".atk-text");
              e &&
                (e.innerText = n.is_admin ? Ot("ctrlCenter") : Ot("msgCenter"));
            } else t.classList.add("atk-hide");
          };
          e.watchConf(["locale"], (s) => {
            const i = e.get("list");
            (t = i.$el.querySelector('[data-action="open-sidebar"]')),
              t &&
                ((t.onclick = () => {
                  e.showSidebar();
                }),
                n());
          }),
            e.on("user-changed", (e) => {
              n();
            });
        },
        (e) => {
          let t = null;
          e.on("mounted", () => {
            const n = e.get("list");
            t = n.$el.querySelector(".atk-unread-badge");
          }),
            e.on("notifies-updated", (e) => {
              var n;
              (n = e.length || 0),
                t &&
                  (n > 0
                    ? ((t.innerText = `${Number(n || 0)}`),
                      (t.style.display = "block"))
                    : (t.style.display = "none"));
            });
        },
        (e) => {
          const t = (t) => {
              (e.conf.listFetchParamsModifier = t), e.reload();
            },
            n = (e) => {
              !(function (e) {
                const { $dropdownWrap: t, dropdownList: n } = e;
                if (t.querySelector(".atk-dropdown")) return;
                t.classList.add("atk-dropdown-wrap"),
                  t.append(wt('<span class="atk-arrow-down-icon"></span>'));
                let s = 0;
                const i = (e, t, n, i) => {
                    i(),
                      (s = e),
                      r.querySelectorAll(".active").forEach((e) => {
                        e.classList.remove("active");
                      }),
                      t.classList.add("active"),
                      (r.style.display = "none"),
                      setTimeout(() => {
                        r.style.display = "";
                      }, 80);
                  },
                  r = wt('<ul class="atk-dropdown atk-fade-in"></ul>');
                n.forEach((e, t) => {
                  const [n, o] = e,
                    a = wt('<li class="atk-dropdown-item"><span></span></li>'),
                    l = a.querySelector("span");
                  (l.innerText = n),
                    (l.onclick = () => {
                      i(t, a, n, o);
                    }),
                    r.append(a),
                    t === s && a.classList.add("active");
                }),
                  t.append(r);
              })({
                $dropdownWrap: e,
                dropdownList: [
                  [
                    Ot("sortLatest"),
                    () => {
                      t((e) => {
                        e.sort_by = "date_desc";
                      });
                    },
                  ],
                  [
                    Ot("sortBest"),
                    () => {
                      t((e) => {
                        e.sort_by = "vote";
                      });
                    },
                  ],
                  [
                    Ot("sortOldest"),
                    () => {
                      t((e) => {
                        e.sort_by = "date_asc";
                      });
                    },
                  ],
                  [
                    Ot("sortAuthor"),
                    () => {
                      t((e) => {
                        e.view_only_admin = !0;
                      });
                    },
                  ],
                ],
              });
            };
          e.watchConf(["listSort", "locale"], (t) => {
            const s = e.get("list").$el.querySelector(".atk-comment-count");
            s &&
              (t.listSort
                ? n(s)
                : (function (e) {
                    var t, n;
                    const { $dropdownWrap: s } = e;
                    s.classList.remove("atk-dropdown-wrap"),
                      null == (t = s.querySelector(".atk-arrow-down-icon")) ||
                        t.remove(),
                      null == (n = s.querySelector(".atk-dropdown")) ||
                        n.remove();
                  })({ $dropdownWrap: s }));
          });
        },
        (e) => {
          let t = 0;
          const n = ({ locker: n }) => {
              const s = (function () {
                const e = window.location.hash.match(/#atk-comment-([0-9]+)/);
                let t =
                  e && e[1] && !Number.isNaN(parseFloat(e[1]))
                    ? parseFloat(e[1])
                    : null;
                t || (t = Number(xt("atk_comment")));
                return t || null;
              })();
              s && ((n && t === s) || ((t = s), e.trigger("list-goto", s)));
            },
            s = () => n({ locker: !1 }),
            i = () => n({ locker: !0 });
          e.on("mounted", () => {
            window.addEventListener("hashchange", s), e.on("list-loaded", i);
          }),
            e.on("unmounted", () => {
              window.removeEventListener("hashchange", s),
                e.off("list-loaded", i);
            });
        },
        (e) => {
          e.on("list-goto", (t) =>
            h(this, null, function* () {
              let n = e.getCommentNodes().find((e) => e.getID() === t);
              if (!n) {
                const s = (yield e.getApi().comments.getComment(t)).data;
                e
                  .get("list")
                  .getListLayout({ forceFlatMode: !0 })
                  .insert(s.comment, s.reply_comment),
                  (n = e.getCommentNodes().find((e) => e.getID() === t));
              }
              n && n.focus();
            })
          );
        },
        (e) => {
          e.on("list-loaded", (t) => {
            const n = e.get("list"),
              s = t.length <= 0;
            let i = n.getCommentsWrapEl().querySelector(".atk-list-no-comment");
            s
              ? i ||
                ((i = wt('<div class="atk-list-no-comment"></div>')),
                (i.innerHTML = ot(
                  n.ctx.conf.noComment || n.ctx.$t("noComment")
                )),
                n.getCommentsWrapEl().appendChild(i))
              : null == i || i.remove();
          });
        },
        (e) => {
          e.on("mounted", () => {
            const t = e.get("list").$el.querySelector(".atk-copyright");
            t &&
              (t.innerHTML = `Powered By <a href="https://artalk.js.org" target="_blank" title="Artalk v${as}">Artalk</a>`);
          });
        },
        (e) => {
          let t = null;
          e.on("mounted", () => {
            t = window.setInterval(() => {
              e.get("list")
                .$el.querySelectorAll("[data-atk-comment-date]")
                .forEach((t) => {
                  var n, s;
                  const i = new Date(
                    Number(t.getAttribute("data-atk-comment-date"))
                  );
                  t.innerText =
                    (null == (s = (n = e.getConf()).dateFormatter)
                      ? void 0
                      : s.call(n, i)) || St(i, e.$t);
                });
            }, 3e4);
          }),
            e.on("unmounted", () => {
              t && window.clearInterval(t);
            });
        },
        (e) => {
          e.on("list-fetch", () => {
            Kt(e.get("list").$el, null);
          }),
            e.on("list-failed", (t) => {
              ls({
                $err: e.get("list").$el,
                errMsg: t.msg,
                errData: t.data,
                retryFn: () => e.fetch({ offset: 0 }),
              });
            });
        },
        (e) => {
          let t = null;
          const n = () => {
            null == t || t.disconnect(), (t = null);
          };
          e.on("list-loaded", () => {
            n();
            const s = e.get("list").getCommentsWrapEl().childNodes,
              i = s.length > 2 ? s[s.length - 2] : null;
            i &&
              ("IntersectionObserver" in window
                ? ((s) => {
                    const i =
                      (e.conf.scrollRelativeTo && e.conf.scrollRelativeTo()) ||
                      null;
                    (t = new IntersectionObserver(
                      ([t]) => {
                        t.isIntersecting &&
                          (n(), e.trigger("list-reach-bottom"));
                      },
                      { threshold: 0.9, root: i }
                    )),
                      t.observe(s);
                  })(i)
                : console.warn("IntersectionObserver api not supported"));
          }),
            e.on("unmounted", () => {
              n();
            });
        },
        (e) => {
          const t = () => {
            const t = e.get("list"),
              n = e.conf.scrollRelativeTo && e.conf.scrollRelativeTo();
            (n || window).scroll({ top: Ct(t.$el, n).top, left: 0 });
          };
          e.on("mounted", () => {
            e.on("list-goto-first", t);
          }),
            e.on("unmounted", () => {
              e.off("list-goto-first", t);
            });
        },
      ],
      (e) => {
        e.on("list-fetch", (t) => {
          if (0 !== t.offset) return;
          const n = e.getApi().getUserFields();
          n &&
            e
              .getApi()
              .notifies.getNotifies(n)
              .then((t) => {
                e.getData().updateNotifies(t.data.notifies);
              });
        });
      },
      (e) => {
        e.watchConf(
          [
            "site",
            "pageKey",
            "pageTitle",
            "countEl",
            "pvEl",
            "statPageKeyAttr",
          ],
          (t) => {
            Kn({
              getApi: () => e.getApi(),
              siteName: t.site,
              pageKey: t.pageKey,
              pageTitle: t.pageTitle,
              countEl: t.countEl,
              pvEl: t.pvEl,
              pageKeyAttr: t.statPageKeyAttr,
              pvAdd: "boolean" != typeof e.conf.pvAdd || e.conf.pvAdd,
            });
          }
        );
      },
      (e) => {
        e.watchConf(["apiVersion", "versionCheck"], (t) => {
          const n = e.get("list");
          t.apiVersion &&
            t.versionCheck &&
            !cs &&
            (function (e, t, n) {
              const s = (function (e, t) {
                const n = e.split("."),
                  s = t.split(".");
                for (let i = 0; i < 3; i++) {
                  const e = Number(n[i]),
                    t = Number(s[i]);
                  if (e > t) return 1;
                  if (t > e) return -1;
                  if (!Number.isNaN(e) && Number.isNaN(t)) return 1;
                  if (Number.isNaN(e) && !Number.isNaN(t)) return -1;
                }
                return 0;
              })(t, n);
              if (0 === s) return;
              const i = wt(
                  `<div class="atk-version-check-notice">${Ot("updateMsg", {
                    name: Ot(s < 0 ? "frontend" : "backend"),
                  })} <span class="atk-info">${Ot("currentVersion")}: ${Ot(
                    "frontend"
                  )} ${t} / ${Ot("backend")} ${n}</span></div>`
                ),
                r = wt(`<span class="atk-ignore-btn">${Ot("ignore")}</span>`);
              (r.onclick = () => {
                i.remove(), (cs = !0);
              }),
                i.append(r),
                e.$el.parentElement.prepend(i);
            })(n, as, t.apiVersion);
        });
      },
      (e) => {
        let t;
        const n = (n) => {
          const s = [e.$root, e.get("layerManager").getEl()];
          ds || (ds = window.matchMedia("(prefers-color-scheme: dark)")),
            "auto" === n
              ? (t ||
                  ((t = (e) => hs(s, e.matches)),
                  ds.addEventListener("change", t)),
                hs(s, ds.matches))
              : (t && (ds.removeEventListener("change", t), (t = void 0)),
                hs(s, n));
        };
        e.watchConf(["darkMode"], (e) => n(e.darkMode)),
          e.on("created", () => n(e.conf.darkMode)),
          e.on("unmounted", () => {
            t && (null == ds || ds.removeEventListener("change", t)),
              (t = void 0);
          });
      },
    ],
    ps = new Set([...us]),
    gs = new WeakMap();
  function ms(e) {
    return h(this, null, function* () {
      var t;
      const n = new Set(),
        s = (t) => {
          t.forEach((t) => {
            "function" != typeof t || n.has(t) || (t(e, gs.get(t)), n.add(t));
          });
        };
      s(ps);
      const { data: i } = yield e
        .getApi()
        .conf.conf()
        .catch((t) => {
          throw (
            ((function (e, t) {
              var n;
              let s = "";
              if (null == (n = t.data) ? void 0 : n.err_no_site) {
                const t = {
                  create_name: e.conf.site,
                  create_urls: `${window.location.protocol}//${window.location.host}`,
                };
                s = `sites|${JSON.stringify(t)}`;
              }
              ls({
                $err: e.get("list").$el,
                errMsg: t.msg || String(t),
                errData: t.data,
                retryFn: () => ms(e),
                onOpenSidebar: e.get("user").getData().is_admin
                  ? () => e.showSidebar({ view: s })
                  : void 0,
              });
            })(e, t),
            t)
          );
        });
      let r = { apiVersion: null == (t = i.version) ? void 0 : t.version };
      if (e.conf.useBackendConf) {
        if (!i.frontend_conf)
          throw new Error(
            "The remote backend does not respond to the frontend conf, but `useBackendConf` conf is enabled"
          );
        r = l(
          l({}, r),
          (function (e) {
            const t = [
              "el",
              "pageKey",
              "pageTitle",
              "server",
              "site",
              "pvEl",
              "countEl",
              "statPageKeyAttr",
            ];
            return (
              Object.keys(e).forEach((n) => {
                t.includes(n) && delete e[n],
                  "darkMode" === n && "auto" !== e[n] && delete e[n];
              }),
              e.emoticons &&
                "string" == typeof e.emoticons &&
                ((e.emoticons = e.emoticons.trim()),
                e.emoticons.startsWith("[") || e.emoticons.startsWith("{")
                  ? (e.emoticons = JSON.parse(e.emoticons))
                  : "false" === e.emoticons && (e.emoticons = !1)),
              e
            );
          })(i.frontend_conf)
        );
      }
      e.conf.remoteConfModifier && e.conf.remoteConfModifier(r),
        r.pluginURLs &&
          (yield (function (e, t) {
            return h(this, null, function* () {
              const n = new Set();
              if (!e || !Array.isArray(e)) return n;
              const s = [];
              return (
                e.forEach((e) => {
                  /^(http|https):\/\//.test(e) ||
                    (e = `${t.replace(/\/$/, "")}/${e.replace(/^\//, "")}`),
                    s.push(
                      new Promise((t) => {
                        if (document.querySelector(`script[src="${e}"]`))
                          return void t();
                        const n = document.createElement("script");
                        (n.src = e),
                          document.head.appendChild(n),
                          (n.onload = () => t()),
                          (n.onerror = (e) => {
                            console.error("[artalk] Failed to load plugin", e),
                              t();
                          });
                      })
                    );
                }),
                yield Promise.all(s),
                Object.values(window.ArtalkPlugins || {}).forEach((e) => {
                  "function" == typeof e && n.add(e);
                }),
                n
              );
            });
          })(r.pluginURLs, e.conf.server)
            .then((e) => {
              s(e);
            })
            .catch((e) => {
              console.error("Failed to load plugin", e);
            })),
        e.trigger("created"),
        e.updateConf(r),
        e.trigger("mounted"),
        e.conf.remoteConfModifier || e.fetch({ offset: 0 });
    });
  }
  class fs {
    constructor(e) {
      d(this, "ctx");
      const t = jt(e, !0);
      (this.ctx = new zt(t)),
        Object.entries(Gn).forEach(([e, t]) => {
          const n = t(this.ctx);
          n && this.ctx.inject(e, n);
        }),
        ms(this.ctx);
    }
    getConf() {
      return this.ctx.getConf();
    }
    getEl() {
      return this.ctx.$root;
    }
    update(e) {
      return this.ctx.updateConf(e), this;
    }
    reload() {
      this.ctx.reload();
    }
    destroy() {
      for (this.ctx.trigger("unmounted"); this.ctx.$root.firstChild; )
        this.ctx.$root.removeChild(this.ctx.$root.firstChild);
    }
    on(e, t) {
      this.ctx.on(e, t);
    }
    off(e, t) {
      this.ctx.off(e, t);
    }
    trigger(e, t) {
      this.ctx.trigger(e, t);
    }
    setDarkMode(e) {
      this.ctx.setDarkMode(e);
    }
    static init(e) {
      return new fs(e);
    }
    static use(e, t) {
      ps.add(e), gs.set(e, t);
    }
    static loadCountWidget(e) {
      const t = jt(e, !0);
      Kn({
        getApi: () => new f(Ft(t)),
        siteName: t.site,
        countEl: t.countEl,
        pvEl: t.pvEl,
        pageKeyAttr: t.statPageKeyAttr,
        pvAdd: !1,
      });
    }
    get $root() {
      return this.ctx.$root;
    }
    get conf() {
      return this.ctx.getConf();
    }
  }
  const ks = fs.init,
    ys = fs.use,
    $s = fs.loadCountWidget;
  (e.default = fs),
    (e.init = ks),
    (e.loadCountWidget = $s),
    (e.use = ys),
    Object.defineProperties(e, {
      __esModule: { value: !0 },
      [Symbol.toStringTag]: { value: "Module" },
    });
});
//# sourceMappingURL=Artalk.js.map
