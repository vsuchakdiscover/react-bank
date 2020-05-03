!(function(e) {
  var n;
  if (
    ("function" == typeof define && define.amd && (define(e), (n = !0)),
    "object" == typeof exports && ((module.exports = e()), (n = !0)),
    !n)
  ) {
    var t = window.Cookies,
      o = (window.Cookies = e());
    o.noConflict = function() {
      return (window.Cookies = t), o;
    };
  }
})(function() {
  function f() {
    for (var e = 0, n = {}; e < arguments.length; e++) {
      var t = arguments[e];
      for (var o in t) n[o] = t[o];
    }
    return n;
  }
  function a(e) {
    return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }
  return (function e(u) {
    function c() {}
    function t(e, n, t) {
      if ("undefined" != typeof document) {
        "number" == typeof (t = f({ path: "/" }, c.defaults, t)).expires &&
          (t.expires = new Date(1 * new Date() + 864e5 * t.expires)),
          (t.expires = t.expires ? t.expires.toUTCString() : "");
        try {
          var o = JSON.stringify(n);
          /^[\{\[]/.test(o) && (n = o);
        } catch (e) {}
        (n = u.write
          ? u.write(n, e)
          : encodeURIComponent(String(n)).replace(
              /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
              decodeURIComponent
            )),
          (e = encodeURIComponent(String(e))
            .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
            .replace(/[\(\)]/g, escape));
        var r = "";
        for (var i in t)
          t[i] &&
            ((r += "; " + i), !0 !== t[i] && (r += "=" + t[i].split(";")[0]));
        return (document.cookie = e + "=" + n + r);
      }
    }
    function n(e, n) {
      if ("undefined" != typeof document) {
        for (
          var t = {},
            o = document.cookie ? document.cookie.split("; ") : [],
            r = 0;
          r < o.length;
          r++
        ) {
          var i = o[r].split("="),
            c = i.slice(1).join("=");
          n || '"' !== c.charAt(0) || (c = c.slice(1, -1));
          try {
            var f = a(i[0]);
            if (((c = (u.read || u)(c, f) || a(c)), n))
              try {
                c = JSON.parse(c);
              } catch (e) {}
            if (((t[f] = c), e === f)) break;
          } catch (e) {}
        }
        return e ? t[e] : t;
      }
    }
    return (
      (c.set = t),
      (c.get = function(e) {
        return n(e, !1);
      }),
      (c.getJSON = function(e) {
        return n(e, !0);
      }),
      (c.remove = function(e, n) {
        t(e, "", f(n, { expires: -1 }));
      }),
      (c.defaults = {}),
      (c.withConverter = e),
      c
    );
  })(function() {});
});

// This function gets the message counts from SMC service or get from cookies if
// present and set into message sub-menus
function getMessageCount(cifNumber) {
  var cookieVal = Cookies.get("messageCount");
  var messageCnt = parseInt(escape(cookieVal));

  if (
    cookieVal == null ||
    eval(messageCnt) <= 0 ||
    (!parseInt(cookieVal) && parseInt(cookieVal) != 0)
  ) {
    var xhr = new XMLHttpRequest();

    // Setup our listener to process completed requests
    xhr.onreadystatechange = function() {
      // Only run if the request is complete
      if (xhr.readyState !== 4) return;

      // Process our return data
      if (xhr.status >= 200 && xhr.status < 300) {
        // Successful request
        var responseText = xhr.responseText;
        if (responseText == "") {
          responseText = "0";
        }
        messageCnt = parseInt(escape(responseText));
        // Calls the function to show the message count and
        // notification icon
        showMessageCount(messageCnt);
      } else {
        //Request failed
        showMessageCount(0);
      }
    };

    // Create and send a GET request
    xhr.open("GET", "/bankac/acsmc/MessageCountServlet");
    xhr.setRequestHeader("Content-type", "text/html");
    xhr.send();
  } else {
    // Calls the function to show the message count and notification icon
    showMessageCount(messageCnt);
  }
}

// This function to show the message count and notification icon
function showMessageCount(messageCnt) {
  var desc = messageCnt;

  // Show the message count
  if (messageCnt == 1) {
    desc = messageCnt + " New Message";
  } else if (messageCnt > 1) {
    desc = messageCnt + " New Messages";
  } else {
    // if messageCnt is Undefined
    desc = "0 New Messages";
  }

  document.getElementById("message-trigger").innerHTML = desc;

  // Set the message notification icon
  var exclamationmarkId = document.querySelector("#message-notification-id");

  if (eval(messageCnt) >= 1) {
    exclamationmarkId.style.display = "block";
  } else {
    exclamationmarkId.style.display = "none";
  }
}

getMessageCount();
