define('storage', function (require, exports, module) {
  module.exports = {
    // cookie对象
    cookie: {
      get: function (name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = '';
        if (cookieStart > -1) {
          var cookieEnd = document.cookie.indexOf(";", cookieStart);
          if (cookieEnd == -1) {
            cookieEnd = document.cookie.length;
          }
          cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
      },
      set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
          cookieText += ";expires=" + expires.toUTCString();
        }
        if (path) {
          cookieText += ";path=" + path;
        }
        if (domain) {
          cookieText += ";domain=" + domain;
        }
        if (secure) {
          cookieText += ";secure=" + secure;
        }
        document.cookie = cookieText;
      },
      remove: function (name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
      }
    },
    // session对象
    session: {
      set: function (key, value) {
        if (typeof value === 'object')
          value = JSON.stringify(value);
        try {
          sessionStorage.setItem(key, value);
        } catch (e) {
          console.log(e);
          window.$$sessiondata = window.$$sessiondata || {};
          window.$$sessiondata[key] = value;
        }
      },
      get: function (key) {
        var data = sessionStorage.getItem(key) || (window.$$sessiondata ? window.$$sessiondata[key] : null);
        return data || '';
      },
      remove: function (key) {
        try {
          sessionStorage.removeItem(key);
        } catch (e) {
          console.log(e);
          delete window.$$sessiondata[key];
        }
      },
      clear: function () {
        try {
          sessionStorage.clear();
        } catch (e) {
          console.log(e);
          window.$$sessiondata = {};
        }
      }
    }
  }
});