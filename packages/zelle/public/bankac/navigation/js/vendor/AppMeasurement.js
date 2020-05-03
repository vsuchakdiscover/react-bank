/* eslint-disable */
/* Set report suite based on the env cookie*/
var readEnvCookie = function() {
  for (
    var b = "env" + "=", c = document.cookie.split(";"), d = 0;
    d < c.length;
    d++
  ) {
    for (var e = c[d]; " " == e.charAt(0); ) e = e.substring(1, e.length);
    if (0 === e.indexOf(b)) return e.substring(b.length, e.length);
  }
  return null;
};

/* Set Report suite Id dynamically */
if (
  readEnvCookie() ||
  location.hostname.includes("dev") ||
  location.hostname.includes("localhost")
) {
  var s_account = "discoverglobaldev,discoverbankdev";
} else {
  var s_account = "discoverglobalprod,discoverbankprod";
}

/* Adobe Analytics code version: 2.5.0
Copyright 1996-2017 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com */
/************************ ADDITIONAL FEATURES ************************
     Plugins
*/
//var s_codeVersion="DF v2.0|20160713|H25"
if (typeof s_account === "undefined") {
  s_account = "discoverglobaldev";
} /* if report suite isn't defined at the page level, send data to global dev */
var s = s_gi(s_account);
var s_getmcmid = function(c) {
  s.eVar76 = c;
};
var s_getmcaid = function(a) {
  s.eVar77 = a;
};

if (typeof Visitor != "undefined") {
  s.visitor = Visitor.getInstance("0D6C4673527839230A490D45@AdobeOrg");
  s.eVar76 = s.visitor.getMarketingCloudVisitorID(s_getmcmid);
  s.eVar77 = s.visitor.getAnalyticsVisitorID(s_getmcaid);
}
/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
/* Link Tracking Config */
s.trackDownloadLinks = true;
s.trackExternalLinks = true;
s.trackInlineStats = true;
s.linkDownloadFileTypes =
  "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
s.linkInternalFilters =
  "javascript:,discover.com,discovercard.com,mydiscoverbank.com,discoverbank.com,discoverstudentloans.com,discoverpersonalloans.com,dinersclubinfonet.com,discoverfinancial.com,discovernetwork.com,localhost";
s.linkLeaveQueryString = false;
s.linkTrackVars =
  "prop6,eVar6,prop12,eVar12,prop13,prop15,eVar15,prop16,prop17,eVar29,prop32,prop75,eVar76,eVar77,contextData.EVENTS";
s.linkTrackEvents = "None";
s.useForcedLinkTracking = false;

/************************** DFA VARIABLES **************************/
var dfaConfig = {
  CSID: "1531196", // DFA Client Site ID
  SPOTID: "3470633", // DFA Spotlight ID
  tEvar: "eVar39",
  errorEvar: "eVar37",
  timeoutEvent: "event35",
  requestURL:
    "http://fls.doubleclick.net/json?spot=[SPOTID]&src=[CSID]&var=[VAR]&host=integrate.112.2o7.net%2Fdfa_echo%3Fvar%3D[VAR]%26AQE%3D1%26A2S%3D1&ord=[RAND]", // the DFA request URL
  maxDelay: "3000",
  visitCookie: "s_dfa",
  clickThroughParam: "dfaid",
  searchCenterParam: undefined,
  newRsidsProp: undefined
};
/************************** PLUGIN CONFIG SECTION **************************/
/* Page Name Plugin Config */
s.siteID = ""; // leftmost value in pagename
s.defaultPage = ""; // filename to add when none exists
s.queryVarsList = "rocode"; // query parameters to keep
s.pathExcludeDelim = ";"; // portion of the path to exclude
s.pathConcatDelim = "/"; // page name component separator
s.pathExcludeList = ""; // elements to exclude from the path
/*Form Analysis Config */
s.formList =
  "search,loginForm,searchForm,cbbform2,getMore,redirect-form,interceptStoreForm"; /* list for forms to exclude from tracking */
s.trackFormList = false;
s.trackPageName = true;
s.useCommerce = false;
s.varUsed = "prop9";
s.eventList = "";
s.usePlugins = true;
function s_doPlugins(s) {
  /* capture code version - includes AppMeasurement version, MCID version and Target version */
  var s_codeVersion =
    "DF 4.0 20181018 " +
    "-AM:" +
    s.version +
    "-MCID:" +
    (typeof visitor != "undefined"
      ? visitor.version
      : typeof _satellite != "undefined" && _satellite.getVisitorId() != null
      ? _satellite.getVisitorId().version
      : "NA") +
    "-Target:" +
    (typeof adobe != "undefined" ? adobe.target.VERSION : "NA");
  /* detect and overwrite credit card numbers in URL */
  s.pageURL = ("" + s.wd.location).toLowerCase();
  if (s.pageURL.search(/6(?:011|5[0-9]{2})[ -+]?[0-9]{12}/g) > 0) {
    s.pageURL = s.pageURL.replace(
      /6(?:011|5[0-9]{2})[ -+]?[0-9]{12}/g,
      "{credit_card}"
    );
  }
  s.referrer = document.referrer;
  if (s.referrer.search(/6(?:011|5[0-9]{2})[ -+]?[0-9]{12}/g) > 0) {
    s.referrer = s.referrer.replace(
      /6(?:011|5[0-9]{2})[ -+]?[0-9]{12}/g,
      "{credit_card}"
    );
  }

  /*External Campaign tracking*/
  if (!s.campaign) {
    s.campaign = s.getQueryParam("cmpgnid");
  }
  if (s_account.indexOf("discoverbank") != -1) {
    if (!s.campaign) {
      s.campaign = s.getQueryParam("campaingID,priceCde,sourceCde");
    }
  }
  s.campaign = s.getValOnce(s.campaign, "s_campaign", 0);
  /* external campaign stacking */
  s.eVar30 = s.crossVisitParticipation(
    s.campaign,
    "s_ev30",
    "30",
    "5",
    ">",
    "",
    0
  );

  /* featured content/internal campaign tracking */
  if (!s.eVar1) {
    s.eVar1 = s.getQueryParam("scmpgn,tmclk");
  }
  s.eVar1 = s.getValOnce(s.eVar1, "s_v1", 0);

  /* web targeting click-throughs */
  if (!s.list2) {
    s.list2 = s.getQueryParam("wtclk");
    if (s.list2) {
      s.events = s.apl(s.events, "event59", ",", 2);
    }
  }

  /* balance transfers click-throughs */
  if (!s.list3) {
    s.list3 = s.getQueryParam("btclk");
    if (s.list3) {
      s.events = s.apl(s.events, "event67", ",", 2);
    }
  }

  /* non-promotional link tracking */
  if (!s.prop1) {
    s.prop1 = s.getQueryParam("lnk,icmpgn");
  }

  /* link tracking stacking */
  if (!s.eVar31) {
    s.eVar31 = s.crossVisitParticipation(
      s.getQueryParam("icmpgn,scmpgn"),
      "s_ev31",
      "1",
      "5",
      ">",
      "",
      0
    );
  }

  /* cross site tracking */
  if (!s.eVar25) {
    s.eVar25 = s.getQueryParam("intlink");
  }

  /* Call Page Name Plugin to auto-generate page names based on URL */
  if (!s.pageName) {
    s.pageName = s.getPageName();
    if (s.pageName == "" || s.pageName == "index.html") {
      s.pageName = "home";
    } /* if on the homepage, set the page name to home regardless of if the path is / or /index.html */
    /* To Remove the index.html from the pagename */
    if (s.pageName.indexOf("index.html") > -1) {
      s.pageName = s.pageName.substring(0, s.pageName.length - 11);
    }
  }

  /* s.channelExtract - assign site section and subsection based on URL */
  if (!s.server) {
    /* site */
    s.server = s.channelExtract("/", 1, s.pageName);
    s.server = s.server.substring(0, s.server.length - 1);
  }
  if (!s.channel) {
    /* site section */
    s.channel = s.channelExtract("/", 2, s.pageName);
    s.channel = s.channel.substring(0, s.channel.length - 1);
  }
  if (!s.prop2) {
    /* site subsection */
    s.prop2 = s.channelExtract("/", 3, s.pageName);
    s.prop2 = s.prop2.substring(0, s.prop2.length - 1);
  }
  if (!s.hier1) {
    /* hierarchy */
    s.hier1 = s.channelExtract(
      "/",
      s.pageName.replace(/[^\/]/g, "").length,
      s.pageName
    );
    s.hier1 = s.hier1.replace(/\//gi, "|");
    s.hier1 = s.hier1.substring(0, s.hier1.length - 1);
  }

  /*if error page, pre-append "Error" to the URL and send that in as the pagename*/
  if (s.pageType == "errorPage") {
    s.pageName = "Error:" + s.wd.location;
  }

  /* copy site section props to eVars */
  if (!s.eVar2) s.eVar2 = "D=c2";
  if (!s.eVar13) s.eVar13 = "D=server";
  if (!s.eVar14) s.eVar14 = "D=channel";
  if (!s.eVar22) s.eVar22 = "D=pageName";

  /* Get previous page name */
  s.prop13 = s.getPreviousValue(s.pageName, "gpv_p5", "");
  s.eVar26 = "D=c13";
  /* percent page viewed */
  var ppv = s.getPercentPageViewed();
  s.prop30 = ppv[1];
  if (!s.prop13 || s.prop13 == "no value") s.prop26 = "";

  /* Page URL, user agent, and page title */
  s.prop11 = "D=g";
  s.prop14 = "D=User-Agent";
  s.prop18 = window.document.title;

  /* Code Version */
  if (!s.prop75) s.prop75 = s_codeVersion;

  /* Insight visitor ID cookie read */
  s.prop12 = s.Util.cookieRead("v1st");
  s.eVar12 = "D=c12";

  /* Discover Cards cardmember (dfsedskey) and Discover Bank (cif) visitor ID cookie read */
  if (!s.eVar15) {
    if (s_account.indexOf("discoverbank") != -1 && s.Util.cookieRead("cif")) {
      s.eVar15 = s.Util.cookieRead("cif");
    } else {
      s.eVar15 = s.Util.cookieRead("dfsedskey");
    }
  }
  s.eVar15 = s.getAndPersistValue(s.eVar15, "v15", 365);
  if (!s.eVar6) {
    if (s.eVar15) {
      s.eVar6 = "Customer";
    } else {
      s.eVar6 = "Prospect";
    }
  }
  s.prop6 = "D=v6";
  s.prop15 = "D=v15";

  // Setting eVar15 as Customer ID in Marketing Cloud if defined
  /*
        if (s.eVar15){
    	if (typeof Visitor != 'undefined') {
    		visitor.setCustomerIDs({
   				"customerid":{
       		    "id":s.eVar15,
        		"authState":Visitor.AuthState.AUTHENTICATED
       	}
    	});
  	}
        }
       */
  /* Tool usage */
  if (s.eVar4) {
    s.prop4 = "D=v4";
    s.events = s.apl(s.events, "event8", ",", 2);
  }

  /* Internal Search */
  if (!s.eVar3) {
    s.eVar3 = s.getQueryParam("q");
  }
  if (s.eVar3) {
    s.eVar3 = s.prop3 = s.eVar3.toLowerCase();
    s.prop3 = s.getAndPersistValue(
      s.prop3,
      "c3",
      0
    ); /* persist prop3 to do breakdown on results clicked */
    s.eVar27 = omn_getSearchType(
      "proxystylesheet"
    ); /* public vs. private search type */
    s.prop27 = "D=v27";
    if (s.eVar28) {
      s.prop28 = "D=v28";
    }
  }
  s.eVar3 = s.getValOnce(s.eVar3, "s_v3", 0);
  if (s.eVar3) {
    s.events = s.apl(s.events, "event21", ",", 2);
  }
  if (!s.eVar23) {
    s.eVar23 = s.getQueryParam("gcmpgn"); /* search result clicked */
  }
  if (s.eVar23) {
    /* search result clicked logic */
    s.eVar23 = s.eVar23.toLowerCase();
    if (s.eVar23.indexOf("sro") != -1) {
      s.eVar24 = "QuickResult";
    } else if (s.eVar23.indexOf("gsap") != -1) {
      s.eVar24 = "KeyMatch";
    } else if (s.eVar23.indexOf("gsan") != -1) {
      s.eVar24 = "RegularResult";
    } else {
      s.eVar24 = "UnknownResult";
    }
    s.prop23 = "D=v23";
    s.prop24 = "D=v24";
    s.prop3 = s.getAndPersistValue(
      s.prop3,
      "c3",
      0
    ); /* persist search term for breakdown */
    s.eVar27 = omn_getSearchType("srchC"); /* public vs. private search type */
    s.prop27 = "D=v27";
  }

  /* add prodView event with event3 is set */
  if ((s.events + ",").indexOf("event3,") > -1) {
    s.events = s.apl(s.events, "prodView", ",", 2);
  }

  /* Form Analysis */
  s.setupFormAnalysis();

  /* Shop Discover Search Term */
  if (!s.eVar52 && s.pageName.indexOf("shopdiscover") > -1) {
    s.eVar52 = s.getQueryParam("s");
  }

  /* read sitecatalyst visitor ID cookie */
  if (!s.prop25) {
    s.prop25 = s.Util.cookieRead("s_vi");
  }

  /* T&T Integration */
  //s.tnt=s.trackTNT();

  /* put report suite ID(s) in a prop */
  s.prop26 = s_account;

  /* time parting */
  s.prop16 = s.getTimeParting("h", "-6"); /* hour of day */
  s.prop17 = s.getTimeParting("d", "-6"); /* day of week */
  s.eVar29 =
    s.getTimeParting("j", "-6") +
    " " +
    s.getTimeParting("h", "-6"); /* date and time */
  //s.contextData['hitTime_d'] = s.getHitTime('ts');
  //s.contextData['hitTime_t'] = s.getHitTime('tt');

  /* Debug Query String - This will return the entire query string and place its contents into a prop.  Used for Insight Analytics */
  s.prop20 = window.location.search;

  /* External Campaigns Combined - This will return all external campaign query string parameters and assign to an eVar.  Expires after visit */
  if (!s.eVar57) {
    s.eVar57 = s.getQueryParam("dmscmpgn").toUpperCase();
    s.prop57 = "D=v57";
  }
  if (!s.eVar57) {
    s.eVar57 = s.getQueryParam("dmscmpgn,cmpgn,cmpgnid,vcmpgn,smpgn,asmpgn");
  }

  /* DMP Transaction ID */
  if (!s.prop19) {
    s.prop19 = s.getQueryParam("omtxid");
  }

  /* Campaign */
  if (!s.eVar51) {
    s.eVar51 = s.getQueryParam("cpn");
  }
  /* Source Id */
  if (!s.eVar52) {
    s.eVar52 = s.getQueryParam("srcid");
  }

  /* Email Clickthrough Variables */
  if (!s.eVar15 && !isNaN(s.getQueryParam("ekey"))) {
    s.eVar15 = s.getQueryParam("ekey");
    s.prop15 = "D=v15";
  }
  if (!s.eVar64) {
    s.eVar64 = s.getQueryParam("OFFRCD");
    s.prop64 = "D=v64";
  }
  if (!s.prop60) {
    s.prop60 = s.getQueryParam("edm");
  }
  if (!s.prop62) {
    s.prop62 = s.getQueryParam("dmsdate");
  }
  if (!s.prop63) {
    s.prop63 = s
      .getQueryParam("dmscmpgn")
      .toUpperCase()
      .split("_", 2)
      .join("_");
  }
  if (!s.eVar65) {
    s.eVar65 = s.getQueryParam("emailstat");
    s.prop65 = "D=v65";
  }
  if (!s.prop61) {
    s.prop61 = s.getQueryParam("msgid");
  }

  /* Capture the Browser Width and Height */
  if (!s.prop29) {
    s.prop29 =
      document.documentElement.clientWidth +
      " x " +
      document.documentElement.clientHeight;
  }

  /* Capture the URL without Query string parameters */
  var stemURL = location.href.indexOf("?");
  var stemURLlength = location.href.length;
  if (!s.prop22) {
    if (stemURL > -1) {
      s.prop22 = location.href.slice(0, stemURL);
    } else {
      s.prop22 = location.href.slice(0, stemURLlength);
    }
  }
  /*
	var stemRef = s.referrer.indexOf("?");
	var stemRefLength = s.referrer.length;
	if (!s.eVar78){
		if(stemRef > -1){
				s.eVar78= s.referrer.slice(0,stemRef);}
		else {
			s.eVar78= s.referrer.slice(0,stemRefLength);}
	}
        */

  //Writes events string into context data - used for Processing Rules
  s.contextData["EVENTS"] = s.events ? s.events + "," : "";

  /* Analytics View port */
  var analyticsViewport = function() {
    var viewPortResult,
      scrWidth = window.innerWidth;
    return (viewPortResult =
      scrWidth > 991
        ? "View Port:Wide"
        : scrWidth <= 991 && scrWidth > 729
        ? "View Port:Middle"
        : "View Port:Narrow");
  };
  /*Set View Port */
  if (!s.prop32) {
    s.prop32 = analyticsViewport();
  }
  /*Optimizely Integration Code */
  if (
    window.optimizely &&
    typeof window.optimizely.get === "function" &&
    window.optimizely.get("custom/adobeIntegrator")
  ) {
    window.optimizely.get("custom/adobeIntegrator").assignCampaigns(s);
  }
}
s.doPlugins = s_doPlugins;
/************************** COMMON FUNCTIONS *************************/
function omn_getSearchType(qsParam) {
  var tmp_searchType = s.getQueryParam(qsParam);
  if (tmp_searchType == "internet_cm_private_fe") {
    return "PrivateSite";
  } else if (tmp_searchType == "internet_cm_fe") {
    return "PublicSite";
  } else {
    return "UnknownSearchType";
  }
}

/************************** PLUGINS SECTION *************************/
/*
 * Utility: AppMeasurement Compatibility v1.1
 * Define deprecated H-code s properties and methods used by legacy plugins
 */
s.wd = window;
s.fl = new Function("x", "l", "" + "return x?(''+x).substring(0,l):x");
s.pt = new Function(
  "x",
  "d",
  "f",
  "a",
  "" +
    "var s=this,t=x,z=0,y,r,l='length';while(t){y=t.indexOf(d);y=y<0?t[l" +
    "]:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d[l];t=x.subs" +
    "tring(z,x[l]);t=z<x[l]?t:''}return''"
);
s.rep = new Function(
  "x",
  "o",
  "n",
  "" +
    "var a=new Array,i=0,j;if(x){if(x.split)a=x.split(o);else if(!o)for(" +
    "i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){" +
    "j=x.indexOf(o,i);a[a.length]=x.substring(i,j<0?x.length:j);i=j;if(i" +
    ">=0)i+=o.length}}x='';j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.joi" +
    "n)x=a.join(n);else for(i=1;i<j;i++)x+=n+a[i]}}return x"
);
s.ape = new Function(
  "x",
  "" +
    "var s=this,h='0123456789ABCDEF',f='+~!*()\\'',i,c=s.charSet,n,l,e,y" +
    "='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComp" +
    "onent(x);for(i=0;i<f.length;i++){n=f.substring(i,i+1);if(x.indexOf(" +
    "n)>=0)x=s.rep(x,n,'%'+n.charCodeAt(0).toString(16).toUpperCase())}}" +
    "else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.sub" +
    "string(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=" +
    "h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='" +
    "+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+','%2" +
    "B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0)" +
    "{i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.subst" +
    "ring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+x.subst" +
    "ring(i);i=x.indexOf('%',i)}}}return x"
);
s.epa = new Function(
  "x",
  "" +
    "var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Fu" +
    "nction('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unescape" +
    "(x)}return y');return tcf(x)}else return unescape(x)}return y"
);
s.parseUri = new Function(
  "u",
  "" +
    "if(u){u=u+'';u=u.indexOf(':')<0&&u.indexOf('//')!=0?(u.indexOf('/')" +
    "==0?'/':'//')+u:u}u=u?u+'':window.location.href;var e,a=document.cr" +
    "eateElement('a'),l=['href','protocol','host','hostname','port','pat" +
    "hname','search','hash'],p,r={href:u,toString:function(){return this" +
    ".href}};a.setAttribute('href',u);for(e=1;e<l.length;e++){p=l[e];r[p" +
    "]=a[p]||''}delete a;p=r.pathname||'';if(p.indexOf('/')!=0)r.pathnam" +
    "e='/'+p;return r"
);
s.gtfs = new Function(
  "" +
    "var w=window,l=w.location,d=document,u;if(!l.origin)l.origin=l.prot" +
    "ocol+'//'+l.hostname+(l.port?':'+l.port:'');u=l!=w.parent.location?" +
    "d.referrer:d.location;return{location:s.parseUri(u)}"
);
/*
 * Partner Plugin: DFA Check 1.0 - Restrict DFA calls to once a visit, per report suite, per click
 * through. Used in conjunction with VISTA. Deduplicates SCM hits.
 */

s.partnerDFACheck = new Function(
  "cfg",
  "" +
    "var s=this,c=cfg.visitCookie,src=cfg.clickThroughParam,scp=cfg.searchCenterParam,p=cfg.newRsidsProp,tv=cfg.tEvar,dl=',',cr,nc,q,g,gs,i,j,k,fnd,v=1,t=new Date,cn=0,ca=new Array,aa=new Array,cs=new A" +
    "rray;t.setTime(t.getTime()+1800000);cr=s.c_r(c);if(cr){v=0;}ca=s.split(cr,dl);if(s.un)aa=s.split(s.un,dl);else aa=s.split(s.account,dl);for(i=0;i<aa.length;i++){fnd = 0;for(j=0;j<ca.length;j++){if(aa[i] == ca[j]){fnd=1;}}if(!fnd){cs[cn" +
    "]=aa[i];cn++;}}if(cs.length){for(k=0;k<cs.length;k++){nc=(nc?nc+dl:'')+cs[k];}cr=(cr?cr+dl:'')+nc;s.vpr(p,nc);v=1;}if(s.wd)q=s.wd.location.search.toLowerCase();else q=s.w.location.search.toLowerCase();q=s.repl(q,'?','&');g=q.indexOf('&'+src.toLow" +
    "erCase()+'=');gs=(scp)?q.indexOf('&'+scp.toLowerCase()+'='):-1;if(g>-1){s.vpr(p,cr);v=1;}else if(gs>-1){v=0;s.vpr(tv,'SearchCenter Visitors');}if(!s.c_w(c,cr,t)){s.c_w(c,cr,0);}if(!s.c_r(c)){v=0;}r" +
    "eturn v>=1;"
);

/*
 * Utility Function: vpr - set the variable vs with value v
 */
s.vpr = new Function(
  "vs",
  "v",
  "if(typeof(v)!='undefined' && vs){var s=this; eval('s.'+vs+'=\"'+v+'\"')}"
);
/*
 *  Plug-in: crossVisitParticipation v1.7 - stacks values from
 *  specified variable in cookie and returns value
 */
s.crossVisitParticipation = new Function(
  "v",
  "cn",
  "ex",
  "ct",
  "dl",
  "ev",
  "dv",
  "" +
    "var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var" +
    " ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l" +
    "ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i" +
    "f(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape(" +
    "v);var arry=new Array(),a=new Array(),c=s.c_r(cn),g=0,h=new Array()" +
    ";if(c&&c!=''){arry=s.split(c,'],[');for(q=0;q<arry.length;q++){z=ar" +
    "ry[q];z=s.repl(z,'[','');z=s.repl(z,']','');z=s.repl(z,\"'\",'');arry" +
    "[q]=s.split(z,',')}}var e=new Date();e.setFullYear(e.getFullYear()+" +
    "5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[arry.len" +
    "gth-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new Date(" +
    ").getTime()];var start=arry.length-ct<0?0:arry.length-ct;var td=new" +
    " Date();for(var x=start;x<arry.length;x++){var diff=Math.round((td." +
    "getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arry[x][0" +
    "]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{delim:','," +
    "front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.join(h,{deli" +
    "m:dl});if(ce)s.c_w(cn,'');return r;"
);
/*
 * Plugin Utility: Replace v1.0
 */
s.repl = new Function(
  "x",
  "o",
  "n",
  "" +
    "var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x." +
    "substring(i+o.length);i=x.indexOf(o,i+l)}return x"
);

/*
 * Plugin: getTimeParting 3.1a - MODIFIED TO RETURN DATE STAMP by s.vertrees
 */
s.getTimeParting = new Function(
  "t",
  "z",
  "y",
  "l",
  "" +
    "var s=this,d,A,B,C,D,U,W,X,Y,Z;d=new Date();A=d.getFullYear();if(A=" +
    "='2011'){B='13';C='06'}if(A=='2012'){B='11';C='04'}if(A=='2013'){B=" +
    "'10';C='03'}if(A=='2014'){B='09';C='02'}if(A=='2015'){B='08';C='01'" +
    "}if(A=='2016'){B='13';C='06'}if(A=='2017'){B='12';C='05'}if(!B||!C)" +
    "{B='29';C='25'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;D=new Date('1/1/2000" +
    "');if(D.getDay()!=6||D.getMonth()!=0){return'Data Not Available'}el" +
    "se{z=z?z:'0';z=parseFloat(z);B=new Date(B);C=new Date(C);W=new Date" +
    "();if(W>B&&W<C&&l!='0'){z=z+1}W=W.getTime()+(W.getTimezoneOffset()*" +
    "60000);W=new Date(W+(3600000*z));X=['Sunday','Monday','Tuesday','We" +
    "dnesday','Thursday','Friday','Saturday'];B=W.getHours();C=W.getMinu" +
    "tes();if(C<10){C='0'+C};D=W.getDay();Z=X[D];U='AM';A='weekday';X='0" +
    "0';if(C>30){X='30'}if(B>=12){U='PM';B=B-12};if(B==0){B=12};if(D==6|" +
    "|D==0){A='weekend'}var dayOfMonth=W.getDate();var monthOfYear=W.g" +
    "etMonth()+1;var thisYear=W.getFullYear();W=B+':'+X+U;if(y&&y!=Y){re" +
    "turn'Data Not Available'}else{if(t){if(t=='h'){return W}if(t=='m'){" +
    "return B+':'+C+' '+U}if(t=='d'){return Z}if(t=='w'){return A}if(t==" +
    "'f'){return B+':'+C+' '+U+' - '+Z}if(t=='j'){return monthOfYear+'/'" +
    "+dayOfMonth+'/'+thisYear;}}else{return Z+', '+W}}}"
);

s.getHitTime = function(t) {
  var s = this,
    d,
    B,
    C,
    D,
    E,
    F,
    H,
    W;
  d = new Date();
  W = new Date();
  H = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
  B = W.getHours();
  if (B < 10) {
    B = "0" + B;
  }
  C = W.getMinutes();
  if (C < 10) {
    C = "0" + C;
  }
  F = W.getSeconds();
  if (F < 10) {
    F = "0" + F;
  }
  var dayOfMonth = W.getDate();
  if (dayOfMonth < 10) {
    dayOfMonth = "0" + dayOfMonth;
  }
  var monthOfYear = W.getMonth() + 1;
  var fullMonth = monthOfYear;
  if (fullMonth < 10) {
    fullMonth = "0" + fullMonth;
  }
  var thisYear = W.getFullYear();
  if (t) {
    if (t == "ts") {
      return (
        thisYear +
        "-" +
        fullMonth +
        "-" +
        dayOfMonth +
        " " +
        B +
        ":" +
        C +
        ":" +
        F +
        " " +
        H
      );
    } else if (t == "tt") {
      return B + ":" + C + ":" + F + " " + H;
    }
  } else {
    return "undefined Date";
  }
};
/*
/*
 * Function p_fo(x,y)
 */
s.p_fo = new Function(
  "n",
  "" +
    "var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]=" +
    "new Object;return 1;}else {return 0;}"
);
/*
 *	getQueryParam v2.5 - H-code and AppMeasurement Compatible
 */
s.getQueryParam = new Function(
  "p",
  "d",
  "u",
  "h",
  "" +
    "var s=this,v='',i,j,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:(s.wd?s.w" +
    "d.location:window.location));while(p){i=p.indexOf(',');i=i<0?p.leng" +
    "th:i;t=s.p_gpv(p.substring(0,i),u+'',h);if(t){t=t.indexOf('#')>-1?t" +
    ".substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i==p." +
    "length?i:i+1)}return v"
);
s.p_gpv = new Function(
  "k",
  "u",
  "h",
  "" +
    "var s=this,v='',q;j=h==1?'#':'?';i=u.indexOf(j);if(k&&i>-1){q=u.sub" +
    "string(i+1);v=s.pt(q,'&','p_gvf',k)}return v"
);
s.p_gvf = new Function(
  "t",
  "k",
  "" +
    "if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T" +
    "rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s." +
    "epa?s.epa(v):s.unescape(v);}return''"
);
/*
 * Plugin: getValOnce_v1.11
 */
s.getValOnce = new Function(
  "v",
  "c",
  "e",
  "t",
  "" +
    "var s=this,a=new Date,v=v?v:'',c=c?c:'s_gvo',e=e?e:0,i=t=='m'?6000" +
    "0:86400000,k=s.c_r(c);if(v){a.setTime(a.getTime()+e*i);s.c_w(c,v,e" +
    "==0?0:a);}return v==k?'':v"
);
/*
 * Cookie Combining Utility v.5
 */
if (!s.__ccucr) {
  s.c_rr = s.c_r;
  s.__ccucr = true;
  function c_r(k) {
    var s = this,
      d = new Date(),
      v = s.c_rr(k),
      c = s.c_rspers(),
      i,
      m,
      e;
    if (v) return v;
    k = s.escape ? s.escape(k) : encodeURIComponent(k);
    i = c.indexOf(" " + k + "=");
    c = i < 0 ? s.c_rr("s_sess") : c;
    i = c.indexOf(" " + k + "=");
    m = i < 0 ? i : c.indexOf("|", i);
    e = i < 0 ? i : c.indexOf(";", i);
    m = m > 0 ? m : e;
    v =
      i < 0
        ? ""
        : s.unescape
        ? s.unescape(c.substring(i + 2 + k.length, m < 0 ? c.length : m))
        : decodeURIComponent(
            c.substring(i + 2 + k.length, m < 0 ? c.length : m)
          );
    return v;
  }
  function c_rspers() {
    var s = this,
      cv = s.c_rr("s_pers"),
      date = new Date().getTime(),
      expd = null,
      cvarr = [],
      vcv = "";
    if (!cv) return vcv;
    cvarr = cv.split(";");
    for (var i = 0, l = cvarr.length; i < l; i++) {
      expd = cvarr[i].match(/\|([0-9]+)$/);
      if (expd && parseInt(expd[1]) >= date) {
        vcv += cvarr[i] + ";";
      }
    }
    return vcv;
  }
  s.c_rspers = c_rspers;
  s.c_r = s.cookieRead = c_r;
}
if (!s.__ccucw) {
  s.c_wr = s.c_w;
  s.__ccucw = true;
  function c_w(k, v, e) {
    var s = this,
      d = new Date(),
      ht = 0,
      pn = "s_pers",
      sn = "s_sess",
      pc = 0,
      sc = 0,
      pv,
      sv,
      c,
      i,
      t,
      f;
    d.setTime(d.getTime() - 60000);
    if (s.c_rr(k)) s.c_wr(k, "", d);
    k = s.escape ? s.escape(k) : encodeURIComponent(k);
    pv = s.c_rspers();
    i = pv.indexOf(" " + k + "=");
    if (i > -1) {
      pv = pv.substring(0, i) + pv.substring(pv.indexOf(";", i) + 1);
      pc = 1;
    }
    sv = s.c_rr(sn);
    i = sv.indexOf(" " + k + "=");
    if (i > -1) {
      sv = sv.substring(0, i) + sv.substring(sv.indexOf(";", i) + 1);
      sc = 1;
    }
    d = new Date();
    if (e) {
      if (e == 1)
        (e = new Date()),
          (f = e.getYear()),
          e.setYear(f + 5 + (f < 1900 ? 1900 : 0));
      if (e.getTime() > d.getTime()) {
        pv +=
          " " +
          k +
          "=" +
          (s.escape ? s.escape(v) : encodeURIComponent(v)) +
          "|" +
          e.getTime() +
          ";";
        pc = 1;
      }
    } else {
      sv +=
        " " + k + "=" + (s.escape ? s.escape(v) : encodeURIComponent(v)) + ";";
      sc = 1;
    }
    sv = sv.replace(/%00/g, "");
    pv = pv.replace(/%00/g, "");
    if (sc) s.c_wr(sn, sv, 0);
    if (pc) {
      t = pv;
      while (t && t.indexOf(";") != -1) {
        var t1 = parseInt(t.substring(t.indexOf("|") + 1, t.indexOf(";")));
        t = t.substring(t.indexOf(";") + 1);
        ht = ht < t1 ? t1 : ht;
      }
      d.setTime(ht);
      s.c_wr(pn, pv, d);
    }
    return v == s.c_r(s.unescape ? s.unescape(k) : decodeURIComponent(k));
  }
  s.c_w = s.cookieWrite = c_w;
}
/*
 * Plugin Utility: apl v1.1
 */
s.apl = new Function(
  "l",
  "v",
  "d",
  "u",
  "" +
    "var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a." +
    "length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas" +
    "e()));}}if(!m)l=l?l+d+v:v;return l"
);
/*
 * s.join: 1.0 - Joins an array into a string
 */
s.join = new Function(
  "v",
  "p",
  "" +
    "var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back" +
    ":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0" +
    ";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el" +
    "se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;"
);
/*
 * Utility Function: split v1.5 (JS 1.0 compatible)
 */
s.split = new Function(
  "l",
  "d",
  "" +
    "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x" +
    "++]=l.substring(0,i);l=l.substring(i+d.length);}return a"
);
/*
 * Plugin: getPageName v2.1 - parse URL and return
 */
s.getPageName = new Function(
  "u",
  "" +
    "var s=this,v=u?u:''+s.wd.location,x=v.indexOf(':'),y=v.indexOf('/'," +
    "x+4),z=v.indexOf('?'),c=s.pathConcatDelim,e=s.pathExcludeDelim,g=s." +
    "queryVarsList,d=s.siteID,n=d?d:'',q=z<0?'':v.substring(z+1),p=v.sub" +
    "string(y+1,q?z:v.length);z=p.indexOf('#');p=z<0?p:s.fl(p,z);x=e?p.i" +
    "ndexOf(e):-1;p=x<0?p:s.fl(p,x);p+=!p||p.charAt(p.length-1)=='/'?s.d" +
    "efaultPage:'';y=c?c:'/';while(p){x=p.indexOf('/');x=x<0?p.length:x;" +
    "z=s.fl(p,x);if(!s.pt(s.pathExcludeList,',','p_c',z))n+=n?y+z:z;p=p." +
    "substring(x+1)}y=c?c:'?';while(g){x=g.indexOf(',');x=x<0?g.length:x" +
    ";z=s.fl(g,x);z=s.pt(q,'&','p_c',z);if(z){n+=n?y+z:z;y=c?c:'&'}g=g.s" +
    "ubstring(x+1)}return n"
);
s.p_c = new Function(
  "v",
  "c",
  "" +
    "var x=v.indexOf('=');return c.toLowerCase()==v.substring(0,x<0?v.le" +
    "ngth:x).toLowerCase()?v:0"
);
/*
 * Plugin: channelExtract : 1.0 - returns site section based on delimiter
 */
s.channelExtract = new Function(
  "d",
  "p",
  "u",
  "pv",
  "" +
    "var s=this,v='';u=u?u:(s.pageURL?s.pageURL:s.wd.location);if(u=='f'" +
    ")u=s.gtfs().location;u=u+'';li=u.lastIndexOf(d);if(li>0){u=u.substr" +
    "ing(0,li);var i,n,a=s.split(u,d),al=a.length;if(al<p){if(pv==1) p=a" +
    "l;else return '';}for(i=0;i<p;i++){n=a[i];v=v+n+d;}return v}return " +
    "'';"
);
/*
 * Plugin: Form Analysis 2.1 (Success, Error, Abandonment)
 */
s.setupFormAnalysis = new Function(
  "" +
    "var s=this;if(!s.fa){s.fa=new Object;var f=s.fa;f.ol=s.wd.onload;s." +
    "wd.onload=s.faol;f.uc=s.useCommerce;f.vu=s.varUsed;f.vl=f.uc?s.even" +
    "tList:'';f.tfl=s.trackFormList;f.fl=s.formList;f.va=new Array('',''" +
    ",'','')}"
);
s.sendFormEvent = new Function(
  "t",
  "pn",
  "fn",
  "en",
  "" +
    "var s=this,f=s.fa;t=t=='s'?t:'e';f.va[0]=pn;f.va[1]=fn;f.va[3]=t=='" +
    "s'?'Success':en;s.fasl(t);f.va[1]='';f.va[3]='';"
);
s.faol = new Function(
  "e",
  "" +
    "var s=s_c_il[" +
    s._in +
    "],f=s.fa,r=true,fo,fn,i,en,t,tf;if(!e)e=s.wd." +
    "event;f.os=new Array;if(f.ol)r=f.ol(e);if(s.d.forms&&s.d.forms.leng" +
    "th>0){for(i=s.d.forms.length-1;i>=0;i--){fo=s.d.forms[i];fn=fo.name" +
    ";tf=f.tfl&&s.pt(f.fl,',','ee',fn)||!f.tfl&&!s.pt(f.fl,',','ee',fn);" +
    "if(tf){f.os[fn]=fo.onsubmit;fo.onsubmit=s.faos;f.va[1]=fn;f.va[3]='" +
    "No Data Entered';for(en=0;en<fo.elements.length;en++){el=fo.element" +
    "s[en];t=el.type;if(t&&t.toUpperCase){t=t.toUpperCase();var md=el.on" +
    "mousedown,kd=el.onkeydown,omd=md?md.toString():'',okd=kd?kd.toStrin" +
    "g():'';if(omd.indexOf('.fam(')<0&&okd.indexOf('.fam(')<0){el.s_famd" +
    "=md;el.s_fakd=kd;el.onmousedown=s.fam;el.onkeydown=s.fam}}}}}f.ul=s" +
    ".wd.onunload;s.wd.onunload=s.fasl;}return r;"
);
s.faos = new Function(
  "e",
  "" +
    "var s=s_c_il[" +
    s._in +
    "],f=s.fa,su;if(!e)e=s.wd.event;if(f.vu){s[f.v" +
    "u]='';f.va[1]='';f.va[3]='';}su=f.os[this.name];return su?su(e):tru" +
    "e;"
);
s.fasl = new Function(
  "e",
  "" +
    "var s=s_c_il[" +
    s._in +
    "],f=s.fa,a=f.va,l=s.wd.location,ip=s.trackPag" +
    "eName,p=s.pageName;if(a[1]!=''&&a[3]!=''){a[0]=!p&&ip?l.host+l.path" +
    "name:a[0]?a[0]:p;if(!f.uc&&a[3]!='No Data Entered'){if(e=='e')a[2]=" +
    "'Error';else if(e=='s')a[2]='Success';else a[2]='Abandon'}else a[2]" +
    "='';var tp=ip?a[0]+':':'',t3=e!='s'?':('+a[3]+')':'',ym=!f.uc&&a[3]" +
    "!='No Data Entered'?tp+a[1]+':'+a[2]+t3:tp+a[1]+t3,ltv=s.linkTrackV" +
    "ars,lte=s.linkTrackEvents,up=s.usePlugins;if(f.uc){s.linkTrackVars=" +
    "ltv=='None'?f.vu+',events':ltv+',events,'+f.vu;s.linkTrackEvents=lt" +
    "e=='None'?f.vl:lte+','+f.vl;f.cnt=-1;if(e=='e')s.events=s.pt(f.vl,'" +
    ",','fage',2);else if(e=='s')s.events=s.pt(f.vl,',','fage',1);else s" +
    ".events=s.pt(f.vl,',','fage',0)}else{s.linkTrackVars=ltv=='None'?f." +
    "vu:ltv+','+f.vu}s[f.vu]=ym;s.usePlugins=false;var faLink=new Object" +
    "();faLink.href='#';s.tl(faLink,'o','Form Analysis');s[f.vu]='';s.us" +
    "ePlugins=up}return f.ul&&e!='e'&&e!='s'?f.ul(e):true;"
);
s.fam = new Function(
  "e",
  "" +
    "var s=s_c_il[" +
    s._in +
    "],f=s.fa;if(!e) e=s.wd.event;var o=s.trackLas" +
    "tChanged,et=e.type.toUpperCase(),t=this.type.toUpperCase(),fn=this." +
    "form.name,en=this.name,sc=false;if(document.layers){kp=e.which;b=e." +
    "which}else{kp=e.keyCode;b=e.button}et=et=='MOUSEDOWN'?1:et=='KEYDOW" +
    "N'?2:et;if(f.ce!=en||f.cf!=fn){if(et==1&&b!=2&&'BUTTONSUBMITRESETIM" +
    "AGERADIOCHECKBOXSELECT-ONEFILE'.indexOf(t)>-1){f.va[1]=fn;f.va[3]=e" +
    "n;sc=true}else if(et==1&&b==2&&'TEXTAREAPASSWORDFILE'.indexOf(t)>-1" +
    "){f.va[1]=fn;f.va[3]=en;sc=true}else if(et==2&&kp!=9&&kp!=13){f.va[" +
    "1]=fn;f.va[3]=en;sc=true}if(sc){nface=en;nfacf=fn}}if(et==1&&this.s" +
    "_famd)return this.s_famd(e);if(et==2&&this.s_fakd)return this.s_fak" +
    "d(e);"
);
s.ee = new Function(
  "e",
  "n",
  "" + "return n&&n.toLowerCase?e.toLowerCase()==n.toLowerCase():false;"
);
s.fage = new Function(
  "e",
  "a",
  "" + "var s=this,f=s.fa,x=f.cnt;x=x?x+1:1;f.cnt=x;return x==a?e:'';"
);
/* Plugin: getPreviousValue 1.1 (Minified) */
s.getPreviousValue = function(v, c, el) {
  var s = this,
    t = new Date(),
    i,
    j,
    r = "",
    f = 1;
  c = c ? c : "s_gpv";
  t.setTime(t.getTime() + 18e5);
  if (el) {
    f = 0;
    i = el.split(",");
    j = s.events ? s.events.split(",") : "";
    for (var x = 0, il = i.length; x < il; x++) {
      for (var y = 0, jl = j.length; y < jl; y++)
        if (i[x] == j[y]) {
          f = 1;
          break;
        }
      if (f == 1) break;
    }
  }
  if (f == 1) {
    if (s.c_r(c)) r = s.c_r(c);
    v ? s.c_w(c, v, t) : s.c_w(c, "no value", t);
  }
  return r;
};
/*
 * Utility manageVars v1.4 - clear variable values (requires split 1.5)
 */
s.manageVars = new Function(
  "c",
  "l",
  "f",
  "" +
    "var s=this,vl,la,vla;l=l?l:'';f=f?f:1 ;if(!s[c])return false;vl='pa" +
    "geName,purchaseID,channel,server,pageType,campaign,state,zip,events" +
    ",products,transactionID';for(var n=1;n<76;n++){vl+=',prop'+n+',eVar" +
    "'+n+',hier'+n;}if(l&&(f==1||f==2)){if(f==1){vl=l;}if(f==2){la=s.spl" +
    "it(l,',');vla=s.split(vl,',');vl='';for(x in la){for(y in vla){if(l" +
    "a[x]==vla[y]){vla[y]='';}}}for(y in vla){vl+=vla[y]?','+vla[y]:'';}" +
    "}s.pt(vl,',',c,0);return true;}else if(l==''&&f==1){s.pt(vl,',',c,0" +
    ");return true;}else{return false;}"
);
s.clearVars = new Function("t", "var s=this;s[t]='';");
s.lowercaseVars = new Function(
  "t",
  "" +
    "var s=this;if(s[t]&&t!='events'){s[t]=s[t].toString();if(s[t].index" +
    "Of('D=')!=0){s[t]=s[t].toLowerCase();}}"
);
/*
 * Plugin: getAndPersistValue 0.3 - get a value on every page
 */
s.getAndPersistValue = new Function(
  "v",
  "c",
  "e",
  "" +
    "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if(" +
    "v)s.c_w(c,v,e?a:0);return s.c_r(c);"
);
/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
/*s.trackingServer="discoverfinancial.d1.sc.omtrdc.net"*/
/*
 * Plugin: getPercentPageViewed 2.0 (Minified)
 */
s.handlePPVevents = function() {
  if (!s_c_il) return;
  for (var i = 0, scill = s_c_il.length; i < scill; i++)
    if (
      typeof s_c_il[i] != "undefined" &&
      s_c_il[i]._c &&
      s_c_il[i]._c == "s_c"
    ) {
      var s = s_c_il[i];
      break;
    }
  if (!s) return;
  if (!s.getPPVid) return;
  var dh = Math.max(
      Math.max(s.d.body.scrollHeight, s.d.documentElement.scrollHeight),
      Math.max(s.d.body.offsetHeight, s.d.documentElement.offsetHeight),
      Math.max(s.d.body.clientHeight, s.d.documentElement.clientHeight)
    ),
    vph =
      window.innerHeight ||
      (s.d.documentElement.clientHeight || s.d.body.clientHeight),
    st =
      window.pageYOffset ||
      (window.document.documentElement.scrollTop ||
        window.document.body.scrollTop),
    vh = st + vph,
    pv = Math.min(Math.round((vh / dh) * 100), 100),
    c = "";
  if (
    !s.c_r("s_tp") ||
    decodeURIComponent(s.c_r("s_ppv").split(",")[0]) != s.getPPVid ||
    (s.ppvChange == "1" && (s.c_r("s_tp") && dh != s.c_r("s_tp")))
  ) {
    s.c_w("s_tp", dh);
    s.c_w("s_ppv", "");
  } else c = s.c_r("s_ppv");
  var a = c && c.indexOf(",") > -1 ? c.split(",", 4) : [],
    id = a.length > 0 ? a[0] : escape(s.getPPVid),
    cv = a.length > 1 ? parseInt(a[1]) : 0,
    p0 = a.length > 2 ? parseInt(a[2]) : pv,
    cy = a.length > 3 ? parseInt(a[3]) : 0,
    cn =
      pv > 0
        ? id + "," + (pv > cv ? pv : cv) + "," + p0 + "," + (vh > cy ? vh : cy)
        : "";
  s.c_w("s_ppv", cn);
};
s.getPercentPageViewed = function(pid, change) {
  var s = this,
    ist = !s.getPPVid ? true : false;
  pid = pid ? pid : s.pageName ? s.pageName : document.location.href;
  s.ppvChange = change ? change : "1";
  if (
    typeof s.linkType != "undefined" &&
    s.linkType != "0" &&
    s.linkType != "" &&
    s.linkType != "e"
  )
    return "";
  var v = s.c_r("s_ppv"),
    a = v.indexOf(",") > -1 ? v.split(",", 4) : [];
  if (a && a.length < 4) {
    for (var i = 3; i > 0; i--) a[i] = i < a.length ? a[i - 1] : "";
    a[0] = "";
  }
  if (a) a[0] = unescape(a[0]);
  if (!s.getPPVid || s.getPPVid != pid) {
    s.getPPVid = pid;
    s.c_w("s_ppv", escape(s.getPPVid));
    s.handlePPVevents();
  }
  if (ist)
    if (window.addEventListener) {
      window.addEventListener("load", s.handlePPVevents, false);
      window.addEventListener("click", s.handlePPVevents, false);
      window.addEventListener("scroll", s.handlePPVevents, false);
      window.addEventListener("resize", s.handlePPVevents, false);
    } else if (window.attachEvent) {
      window.attachEvent("onload", s.handlePPVevents);
      window.attachEvent("onclick", s.handlePPVevents);
      window.attachEvent("onscroll", s.handlePPVevents);
      window.attachEvent("onresize", s.handlePPVevents);
    }
  return pid != "-" ? a : a[1];
};

/************************** DFA Integration *************************/
//s.maxDelay = dfaConfig.maxDelay;
//s.loadModule("Integrate")
//s.Integrate.onLoad=function(s,m) {
//      var dfaCheck = s.partnerDFACheck(dfaConfig);
//      if (dfaCheck) {
//            s.Integrate.add("DFA");
//            s.Integrate.DFA.tEvar=dfaConfig.tEvar;
//            s.Integrate.DFA.errorEvar=dfaConfig.errorEvar;
//            s.Integrate.DFA.timeoutEvent=dfaConfig.timeoutEvent;
//            s.Integrate.DFA.CSID=dfaConfig.CSID;
//            s.Integrate.DFA.SPOTID=dfaConfig.SPOTID;
//            s.Integrate.DFA.get(dfaConfig.requestURL);
//            s.Integrate.DFA.setVars=function(s,p) {
//                  if (window[p.VAR]) { // got a response
//                        if(!p.ec) { // no errors
//                              s[p.tEvar]="DFA-"+(p.lis?p.lis:0)+"-"+(p.lip?p.lip:0)+"-"+(p.lastimp?p.lastimp:0)+"-"+(p.lastimptime?p.lastimptime:0)+"-"+(p.lcs?p.lcs:0)+"-"+(p.lcp?p.lcp:0)+"-"+(p.lastclk?p.lastclk:0)+"-"+(p.lastclktime?p.lastclktime:0)
//                        } else if (p.errorEvar) { // got an error response, track
//                              s[p.errorEvar] = p.ec;
//                        }
//                  } else if (p.timeoutEvent) { // empty response or timeout
//                        s.events = ((!s.events || s.events == '') ? '' : (s.events + ',')) + p.timeoutEvent; // timeout event
//                  }
//            }
//      }
//
//
//}

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/
/*s.trackingServer="discoverfinancial.d1.sc.omtrdc.net"*/

/* Info for First Party cookies, uncomment once deployed */
s.visitorNamespace = "discoverfinancial";
s.trackingServer = "metrics.discover.com";
s.trackingServerSecure = "smetrics.discover.com";

/****************************** MODULES *****************************/
/* Module: Integrate */
function AppMeasurement_Module_Integrate(l) {
  var c = this;
  c.s = l;
  var e = window;
  e.s_c_in || ((e.s_c_il = []), (e.s_c_in = 0));
  c._il = e.s_c_il;
  c._in = e.s_c_in;
  c._il[c._in] = c;
  e.s_c_in++;
  c._c = "s_m";
  c.list = [];
  c.add = function(d, b) {
    var a;
    b || (b = "s_Integrate_" + d);
    e[b] || (e[b] = {});
    a = c[d] = e[b];
    a.a = d;
    a.e = c;
    a._c = 0;
    a._d = 0;
    void 0 == a.disable && (a.disable = 0);
    a.get = function(b, d) {
      var f = document,
        h = f.getElementsByTagName("HEAD"),
        k;
      if (
        !a.disable &&
        (d || (v = "s_" + c._in + "_Integrate_" + a.a + "_get_" + a._c),
        a._c++,
        (a.VAR = v),
        (a.CALLBACK = "s_c_il[" + c._in + "]." + a.a + ".callback"),
        a.delay(),
        (h = h && 0 < h.length ? h[0] : f.body))
      )
        try {
          (k = f.createElement("SCRIPT")),
            (k.type = "text/javascript"),
            k.setAttribute("async", "async"),
            (k.src = c.c(a, b)),
            0 > b.indexOf("[CALLBACK]") &&
              (k.onload = k.onreadystatechange = function() {
                a.callback(e[v]);
              }),
            h.firstChild ? h.insertBefore(k, h.firstChild) : h.appendChild(k);
        } catch (l) {}
    };
    a.callback = function(b) {
      var c;
      if (b) for (c in b) Object.prototype[c] || (a[c] = b[c]);
      a.ready();
    };
    a.beacon = function(b) {
      var d = "s_i_" + c._in + "_Integrate_" + a.a + "_" + a._c;
      a.disable || (a._c++, (d = e[d] = new Image()), (d.src = c.c(a, b)));
    };
    a.script = function(b) {
      a.get(b, 1);
    };
    a.delay = function() {
      a._d++;
    };
    a.ready = function() {
      a._d--;
      a.disable || l.delayReady();
    };
    c.list.push(d);
  };
  c._g = function(d) {
    var b,
      a = (d ? "use" : "set") + "Vars";
    for (d = 0; d < c.list.length; d++)
      if ((b = c[c.list[d]]) && !b.disable && b[a])
        try {
          b[a](l, b);
        } catch (e) {}
  };
  c._t = function() {
    c._g(1);
  };
  c._d = function() {
    var d, b;
    for (d = 0; d < c.list.length; d++)
      if ((b = c[c.list[d]]) && !b.disable && 0 < b._d) return 1;
    return 0;
  };
  c.c = function(c, b) {
    var a, e, g, f;
    "http" != b.toLowerCase().substring(0, 4) && (b = "http://" + b);
    l.ssl && (b = l.replace(b, "http:", "https:"));
    c.RAND = Math.floor(1e13 * Math.random());
    for (a = 0; 0 <= a; )
      (a = b.indexOf("[", a)),
        0 <= a &&
          ((e = b.indexOf("]", a)),
          e > a &&
            ((g = b.substring(a + 1, e)),
            2 < g.length && "s." == g.substring(0, 2)
              ? (f = l[g.substring(2)]) || (f = "")
              : ((f = "" + c[g]),
                f != c[g] && parseFloat(f) != c[g] && (g = 0)),
            g &&
              (b =
                b.substring(0, a) + encodeURIComponent(f) + b.substring(e + 1)),
            (a = e)));
    return b;
  };
}

/*
 Start ActivityMap Module
 The following module enables ActivityMap tracking in Adobe Analytics. ActivityMap
 allows you to view data overlays on your links and content to understand how
 users engage with your web site. If you do not intend to use ActivityMap, you
 can remove the following block of code from your AppMeasurement.js file.
 Additional documentation on how to configure ActivityMap is available at:
 https://marketing.adobe.com/resources/help/en_US/analytics/activitymap/getting-started-admins.html
*/
function AppMeasurement_Module_ActivityMap(f) {
  function g(a, d) {
    var b, c, n;
    if (a && d && (b = e.c[d] || (e.c[d] = d.split(","))))
      for (n = 0; n < b.length && (c = b[n++]); )
        if (-1 < a.indexOf(c)) return null;
    p = 1;
    return a;
  }
  function q(a, d, b, c, e) {
    var g, h;
    if (a.dataset && (h = a.dataset[d])) g = h;
    else if (a.getAttribute)
      if ((h = a.getAttribute("data-" + b))) g = h;
      else if ((h = a.getAttribute(b))) g = h;
    if (
      !g &&
      f.useForcedLinkTracking &&
      e &&
      ((g = ""), (d = a.onclick ? "" + a.onclick : ""))
    ) {
      b = d.indexOf(c);
      var l, k;
      if (0 <= b) {
        for (b += 10; b < d.length && 0 <= "= \t\r\n".indexOf(d.charAt(b)); )
          b++;
        if (b < d.length) {
          h = b;
          for (l = k = 0; h < d.length && (";" != d.charAt(h) || l); )
            l
              ? d.charAt(h) != l || k
                ? (k = "\\" == d.charAt(h) ? !k : 0)
                : (l = 0)
              : ((l = d.charAt(h)), '"' != l && "'" != l && (l = 0)),
              h++;
          if ((d = d.substring(b, h)))
            (a.e = new Function(
              "s",
              "var e;try{s.w." + c + "=" + d + "}catch(e){}"
            )),
              a.e(f);
        }
      }
    }
    return g || (e && f.w[c]);
  }
  function r(a, d, b) {
    var c;
    return (
      (c = e[d](a, b)) && (p ? ((p = 0), c) : g(k(c), e[d + "Exclusions"]))
    );
  }
  function s(a, d, b) {
    var c;
    if (
      a &&
      !(
        1 === (c = a.nodeType) &&
        (c = a.nodeName) &&
        (c = c.toUpperCase()) &&
        t[c]
      ) &&
      (1 === a.nodeType && (c = a.nodeValue) && (d[d.length] = c),
      b.a ||
        b.t ||
        b.s ||
        !a.getAttribute ||
        ((c = a.getAttribute("alt"))
          ? (b.a = c)
          : (c = a.getAttribute("title"))
          ? (b.t = c)
          : "IMG" == ("" + a.nodeName).toUpperCase() &&
            (c = a.getAttribute("src") || a.src) &&
            (b.s = c)),
      (c = a.childNodes) && c.length)
    )
      for (a = 0; a < c.length; a++) s(c[a], d, b);
  }
  function k(a) {
    if (null == a || void 0 == a) return a;
    try {
      return a
        .replace(
          RegExp(
            "^[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+",
            "mg"
          ),
          ""
        )
        .replace(
          RegExp(
            "[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+$",
            "mg"
          ),
          ""
        )
        .replace(
          RegExp(
            "[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]{1,}",
            "mg"
          ),
          " "
        )
        .substring(0, 254);
    } catch (d) {}
  }
  var e = this;
  e.s = f;
  var m = window;
  m.s_c_in || ((m.s_c_il = []), (m.s_c_in = 0));
  e._il = m.s_c_il;
  e._in = m.s_c_in;
  e._il[e._in] = e;
  m.s_c_in++;
  e._c = "s_m";
  e.c = {};
  var p = 0,
    t = { SCRIPT: 1, STYLE: 1, LINK: 1, CANVAS: 1 };
  e._g = function() {
    var a,
      d,
      b,
      c = f.contextData,
      e = f.linkObject;
    (a = f.pageName || f.pageURL) &&
      (d = r(e, "link", f.linkName)) &&
      (b = r(e, "region")) &&
      ((c["a.activitymap.page"] = a.substring(0, 255)),
      (c["a.activitymap.link"] = 128 < d.length ? d.substring(0, 128) : d),
      (c["a.activitymap.region"] = 127 < b.length ? b.substring(0, 127) : b),
      (c["a.activitymap.pageIDType"] = f.pageName ? 1 : 0));
  };
  e.link = function(a, d) {
    var b;
    if (d) b = g(k(d), e.linkExclusions);
    else if (
      (b = a) &&
      !(b = q(a, "sObjectId", "s-object-id", "s_objectID", 1))
    ) {
      var c, f;
      (f = g(k(a.innerText || a.textContent), e.linkExclusions)) ||
        (s(a, (c = []), (b = { a: void 0, t: void 0, s: void 0 })),
        (f = g(k(c.join("")))) ||
          (f = g(k(b.a ? b.a : b.t ? b.t : b.s ? b.s : void 0))) ||
          !(c = (c = a.tagName) && c.toUpperCase ? c.toUpperCase() : "") ||
          ("INPUT" == c || ("SUBMIT" == c && a.value)
            ? (f = g(k(a.value)))
            : "IMAGE" == c && a.src && (f = g(k(a.src)))));
      b = f;
    }
    return b;
  };
  e.region = function(a) {
    for (var d, b = e.regionIDAttribute || "id"; a && (a = a.parentNode); ) {
      if ((d = q(a, b, b, b))) return d;
      if ("BODY" == a.nodeName) return "BODY";
    }
  };
}
/* End ActivityMap Module */
/*
  ************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************
AppMeasurement for JavaScript version: 2.5.0
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.adobe.com/marketing-cloud.html
*/
function AppMeasurement(r) {
  var a = this;
  a.version = "2.5.0";
  var k = window;
  k.s_c_in || ((k.s_c_il = []), (k.s_c_in = 0));
  a._il = k.s_c_il;
  a._in = k.s_c_in;
  a._il[a._in] = a;
  k.s_c_in++;
  a._c = "s_c";
  var p = k.AppMeasurement;
  p || (p = null);
  var n = k,
    m,
    s;
  try {
    for (
      m = n.parent, s = n.location;
      m &&
      m.location &&
      s &&
      "" + m.location != "" + s &&
      n.location &&
      "" + m.location != "" + n.location &&
      m.location.host == s.host;

    )
      (n = m), (m = n.parent);
  } catch (u) {}
  a.F = function(a) {
    try {
      console.log(a);
    } catch (b) {}
  };
  a.Ma = function(a) {
    return "" + parseInt(a) == "" + a;
  };
  a.replace = function(a, b, d) {
    return !a || 0 > a.indexOf(b) ? a : a.split(b).join(d);
  };
  a.escape = function(c) {
    var b, d;
    if (!c) return c;
    c = encodeURIComponent(c);
    for (b = 0; 7 > b; b++)
      (d = "+~!*()'".substring(b, b + 1)),
        0 <= c.indexOf(d) &&
          (c = a.replace(
            c,
            d,
            "%" +
              d
                .charCodeAt(0)
                .toString(16)
                .toUpperCase()
          ));
    return c;
  };
  a.unescape = function(c) {
    if (!c) return c;
    c = 0 <= c.indexOf("+") ? a.replace(c, "+", " ") : c;
    try {
      return decodeURIComponent(c);
    } catch (b) {}
    return unescape(c);
  };
  a.wb = function() {
    var c = k.location.hostname,
      b = a.fpCookieDomainPeriods,
      d;
    b || (b = a.cookieDomainPeriods);
    if (
      c &&
      !a.Ea &&
      !/^[0-9.]+$/.test(c) &&
      ((b = b ? parseInt(b) : 2),
      (b = 2 < b ? b : 2),
      (d = c.lastIndexOf(".")),
      0 <= d)
    ) {
      for (; 0 <= d && 1 < b; ) (d = c.lastIndexOf(".", d - 1)), b--;
      a.Ea = 0 < d ? c.substring(d) : c;
    }
    return a.Ea;
  };
  a.c_r = a.cookieRead = function(c) {
    c = a.escape(c);
    var b = " " + a.d.cookie,
      d = b.indexOf(" " + c + "="),
      f = 0 > d ? d : b.indexOf(";", d);
    c =
      0 > d
        ? ""
        : a.unescape(b.substring(d + 2 + c.length, 0 > f ? b.length : f));
    return "[[B]]" != c ? c : "";
  };
  a.c_w = a.cookieWrite = function(c, b, d) {
    var f = a.wb(),
      e = a.cookieLifetime,
      g;
    b = "" + b;
    e = e ? ("" + e).toUpperCase() : "";
    d &&
      "SESSION" != e &&
      "NONE" != e &&
      ((g = "" != b ? parseInt(e ? e : 0) : -60)
        ? ((d = new Date()), d.setTime(d.getTime() + 1e3 * g))
        : 1 == d &&
          ((d = new Date()),
          (g = d.getYear()),
          d.setYear(g + 5 + (1900 > g ? 1900 : 0))));
    return c && "NONE" != e
      ? ((a.d.cookie =
          a.escape(c) +
          "=" +
          a.escape("" != b ? b : "[[B]]") +
          "; path=/;" +
          (d && "SESSION" != e ? " expires=" + d.toUTCString() + ";" : "") +
          (f ? " domain=" + f + ";" : "")),
        a.cookieRead(c) == b)
      : 0;
  };
  a.L = [];
  a.ia = function(c, b, d) {
    if (a.Fa) return 0;
    a.maxDelay || (a.maxDelay = 250);
    var f = 0,
      e = new Date().getTime() + a.maxDelay,
      g = a.d.visibilityState,
      h = ["webkitvisibilitychange", "visibilitychange"];
    g || (g = a.d.webkitVisibilityState);
    if (g && "prerender" == g) {
      if (!a.ja)
        for (a.ja = 1, d = 0; d < h.length; d++)
          a.d.addEventListener(h[d], function() {
            var c = a.d.visibilityState;
            c || (c = a.d.webkitVisibilityState);
            "visible" == c && ((a.ja = 0), a.delayReady());
          });
      f = 1;
      e = 0;
    } else d || (a.p("_d") && (f = 1));
    f &&
      (a.L.push({ m: c, a: b, t: e }),
      a.ja || setTimeout(a.delayReady, a.maxDelay));
    return f;
  };
  a.delayReady = function() {
    var c = new Date().getTime(),
      b = 0,
      d;
    for (a.p("_d") ? (b = 1) : a.xa(); 0 < a.L.length; ) {
      d = a.L.shift();
      if (b && !d.t && d.t > c) {
        a.L.unshift(d);
        setTimeout(a.delayReady, parseInt(a.maxDelay / 2));
        break;
      }
      a.Fa = 1;
      a[d.m].apply(a, d.a);
      a.Fa = 0;
    }
  };
  a.setAccount = a.sa = function(c) {
    var b, d;
    if (!a.ia("setAccount", arguments))
      if (((a.account = c), a.allAccounts))
        for (
          b = a.allAccounts.concat(c.split(",")),
            a.allAccounts = [],
            b.sort(),
            d = 0;
          d < b.length;
          d++
        )
          (0 != d && b[d - 1] == b[d]) || a.allAccounts.push(b[d]);
      else a.allAccounts = c.split(",");
  };
  a.foreachVar = function(c, b) {
    var d,
      f,
      e,
      g,
      h = "";
    e = f = "";
    if (a.lightProfileID)
      (d = a.P),
        (h = a.lightTrackVars) && (h = "," + h + "," + a.na.join(",") + ",");
    else {
      d = a.g;
      if (a.pe || a.linkType)
        (h = a.linkTrackVars),
          (f = a.linkTrackEvents),
          a.pe &&
            ((e = a.pe.substring(0, 1).toUpperCase() + a.pe.substring(1)),
            a[e] && ((h = a[e].Nb), (f = a[e].Mb)));
      h && (h = "," + h + "," + a.H.join(",") + ",");
      f && h && (h += ",events,");
    }
    b && (b = "," + b + ",");
    for (f = 0; f < d.length; f++)
      (e = d[f]),
        (g = a[e]) &&
          (!h || 0 <= h.indexOf("," + e + ",")) &&
          (!b || 0 <= b.indexOf("," + e + ",")) &&
          c(e, g);
  };
  a.r = function(c, b, d, f, e) {
    var g = "",
      h,
      l,
      k,
      q,
      m = 0;
    "contextData" == c && (c = "c");
    if (b) {
      for (h in b)
        if (
          !(Object.prototype[h] || (e && h.substring(0, e.length) != e)) &&
          b[h] &&
          (!d || 0 <= d.indexOf("," + (f ? f + "." : "") + h + ","))
        ) {
          k = !1;
          if (m)
            for (l = 0; l < m.length; l++)
              h.substring(0, m[l].length) == m[l] && (k = !0);
          if (
            !k &&
            ("" == g && (g += "&" + c + "."),
            (l = b[h]),
            e && (h = h.substring(e.length)),
            0 < h.length)
          )
            if (((k = h.indexOf(".")), 0 < k))
              (l = h.substring(0, k)),
                (k = (e ? e : "") + l + "."),
                m || (m = []),
                m.push(k),
                (g += a.r(l, b, d, f, k));
            else if (("boolean" == typeof l && (l = l ? "true" : "false"), l)) {
              if ("retrieveLightData" == f && 0 > e.indexOf(".contextData."))
                switch (((k = h.substring(0, 4)), (q = h.substring(4)), h)) {
                  case "transactionID":
                    h = "xact";
                    break;
                  case "channel":
                    h = "ch";
                    break;
                  case "campaign":
                    h = "v0";
                    break;
                  default:
                    a.Ma(q) &&
                      ("prop" == k
                        ? (h = "c" + q)
                        : "eVar" == k
                        ? (h = "v" + q)
                        : "list" == k
                        ? (h = "l" + q)
                        : "hier" == k &&
                          ((h = "h" + q), (l = l.substring(0, 255))));
                }
              g += "&" + a.escape(h) + "=" + a.escape(l);
            }
        }
      "" != g && (g += "&." + c);
    }
    return g;
  };
  a.usePostbacks = 0;
  a.zb = function() {
    var c = "",
      b,
      d,
      f,
      e,
      g,
      h,
      l,
      k,
      q = "",
      m = "",
      n = (e = "");
    if (a.lightProfileID)
      (b = a.P),
        (q = a.lightTrackVars) && (q = "," + q + "," + a.na.join(",") + ",");
    else {
      b = a.g;
      if (a.pe || a.linkType)
        (q = a.linkTrackVars),
          (m = a.linkTrackEvents),
          a.pe &&
            ((e = a.pe.substring(0, 1).toUpperCase() + a.pe.substring(1)),
            a[e] && ((q = a[e].Nb), (m = a[e].Mb)));
      q && (q = "," + q + "," + a.H.join(",") + ",");
      m && ((m = "," + m + ","), q && (q += ",events,"));
      a.events2 && (n += ("" != n ? "," : "") + a.events2);
    }
    if (a.visitor && a.visitor.getCustomerIDs) {
      e = p;
      if ((g = a.visitor.getCustomerIDs()))
        for (d in g)
          Object.prototype[d] ||
            ((f = g[d]),
            "object" == typeof f &&
              (e || (e = {}),
              f.id && (e[d + ".id"] = f.id),
              f.authState && (e[d + ".as"] = f.authState)));
      e && (c += a.r("cid", e));
    }
    a.AudienceManagement &&
      a.AudienceManagement.isReady() &&
      (c += a.r("d", a.AudienceManagement.getEventCallConfigParams()));
    for (d = 0; d < b.length; d++) {
      e = b[d];
      g = a[e];
      f = e.substring(0, 4);
      h = e.substring(4);
      g ||
        ("events" == e && n
          ? ((g = n), (n = ""))
          : "marketingCloudOrgID" == e &&
            a.visitor &&
            (g = a.visitor.marketingCloudOrgID));
      if (g && (!q || 0 <= q.indexOf("," + e + ","))) {
        switch (e) {
          case "customerPerspective":
            e = "cp";
            break;
          case "marketingCloudOrgID":
            e = "mcorgid";
            break;
          case "supplementalDataID":
            e = "sdid";
            break;
          case "timestamp":
            e = "ts";
            break;
          case "dynamicVariablePrefix":
            e = "D";
            break;
          case "visitorID":
            e = "vid";
            break;
          case "marketingCloudVisitorID":
            e = "mid";
            break;
          case "analyticsVisitorID":
            e = "aid";
            break;
          case "audienceManagerLocationHint":
            e = "aamlh";
            break;
          case "audienceManagerBlob":
            e = "aamb";
            break;
          case "authState":
            e = "as";
            break;
          case "pageURL":
            e = "g";
            255 < g.length &&
              ((a.pageURLRest = g.substring(255)), (g = g.substring(0, 255)));
            break;
          case "pageURLRest":
            e = "-g";
            break;
          case "referrer":
            e = "r";
            break;
          case "vmk":
          case "visitorMigrationKey":
            e = "vmt";
            break;
          case "visitorMigrationServer":
            e = "vmf";
            a.ssl && a.visitorMigrationServerSecure && (g = "");
            break;
          case "visitorMigrationServerSecure":
            e = "vmf";
            !a.ssl && a.visitorMigrationServer && (g = "");
            break;
          case "charSet":
            e = "ce";
            break;
          case "visitorNamespace":
            e = "ns";
            break;
          case "cookieDomainPeriods":
            e = "cdp";
            break;
          case "cookieLifetime":
            e = "cl";
            break;
          case "variableProvider":
            e = "vvp";
            break;
          case "currencyCode":
            e = "cc";
            break;
          case "channel":
            e = "ch";
            break;
          case "transactionID":
            e = "xact";
            break;
          case "campaign":
            e = "v0";
            break;
          case "latitude":
            e = "lat";
            break;
          case "longitude":
            e = "lon";
            break;
          case "resolution":
            e = "s";
            break;
          case "colorDepth":
            e = "c";
            break;
          case "javascriptVersion":
            e = "j";
            break;
          case "javaEnabled":
            e = "v";
            break;
          case "cookiesEnabled":
            e = "k";
            break;
          case "browserWidth":
            e = "bw";
            break;
          case "browserHeight":
            e = "bh";
            break;
          case "connectionType":
            e = "ct";
            break;
          case "homepage":
            e = "hp";
            break;
          case "events":
            n && (g += ("" != g ? "," : "") + n);
            if (m)
              for (h = g.split(","), g = "", f = 0; f < h.length; f++)
                (l = h[f]),
                  (k = l.indexOf("=")),
                  0 <= k && (l = l.substring(0, k)),
                  (k = l.indexOf(":")),
                  0 <= k && (l = l.substring(0, k)),
                  0 <= m.indexOf("," + l + ",") && (g += (g ? "," : "") + h[f]);
            break;
          case "events2":
            g = "";
            break;
          case "contextData":
            c += a.r("c", a[e], q, e);
            g = "";
            break;
          case "lightProfileID":
            e = "mtp";
            break;
          case "lightStoreForSeconds":
            e = "mtss";
            a.lightProfileID || (g = "");
            break;
          case "lightIncrementBy":
            e = "mti";
            a.lightProfileID || (g = "");
            break;
          case "retrieveLightProfiles":
            e = "mtsr";
            break;
          case "deleteLightProfiles":
            e = "mtsd";
            break;
          case "retrieveLightData":
            a.retrieveLightProfiles && (c += a.r("mts", a[e], q, e));
            g = "";
            break;
          default:
            a.Ma(h) &&
              ("prop" == f
                ? (e = "c" + h)
                : "eVar" == f
                ? (e = "v" + h)
                : "list" == f
                ? (e = "l" + h)
                : "hier" == f && ((e = "h" + h), (g = g.substring(0, 255))));
        }
        g &&
          (c += "&" + e + "=" + ("pev" != e.substring(0, 3) ? a.escape(g) : g));
      }
      "pev3" == e && a.e && (c += a.e);
    }
    return c;
  };
  a.D = function(a) {
    var b = a.tagName;
    if (
      "undefined" != "" + a.Sb ||
      ("undefined" != "" + a.Ib && "HTML" != ("" + a.Ib).toUpperCase())
    )
      return "";
    b = b && b.toUpperCase ? b.toUpperCase() : "";
    "SHAPE" == b && (b = "");
    b &&
      (("INPUT" == b || "BUTTON" == b) && a.type && a.type.toUpperCase
        ? (b = a.type.toUpperCase())
        : !b && a.href && (b = "A"));
    return b;
  };
  a.Ia = function(a) {
    var b = k.location,
      d = a.href ? a.href : "",
      f,
      e,
      g;
    f = d.indexOf(":");
    e = d.indexOf("?");
    g = d.indexOf("/");
    d &&
      (0 > f || (0 <= e && f > e) || (0 <= g && f > g)) &&
      ((e =
        a.protocol && 1 < a.protocol.length
          ? a.protocol
          : b.protocol
          ? b.protocol
          : ""),
      (f = b.pathname.lastIndexOf("/")),
      (d =
        (e ? e + "//" : "") +
        (a.host ? a.host : b.host ? b.host : "") +
        ("/" != d.substring(0, 1)
          ? b.pathname.substring(0, 0 > f ? 0 : f) + "/"
          : "") +
        d));
    return d;
  };
  a.M = function(c) {
    var b = a.D(c),
      d,
      f,
      e = "",
      g = 0;
    return b &&
      ((d = c.protocol),
      (f = c.onclick),
      !c.href ||
      ("A" != b && "AREA" != b) ||
      (f && d && !(0 > d.toLowerCase().indexOf("javascript")))
        ? f
          ? ((e = a.replace(
              a.replace(
                a.replace(a.replace("" + f, "\r", ""), "\n", ""),
                "\t",
                ""
              ),
              " ",
              ""
            )),
            (g = 2))
          : "INPUT" == b || "SUBMIT" == b
          ? (c.value
              ? (e = c.value)
              : c.innerText
              ? (e = c.innerText)
              : c.textContent && (e = c.textContent),
            (g = 3))
          : "IMAGE" == b && c.src && (e = c.src)
        : (e = a.Ia(c)),
      e)
      ? { id: e.substring(0, 100), type: g }
      : 0;
  };
  a.Qb = function(c) {
    for (var b = a.D(c), d = a.M(c); c && !d && "BODY" != b; )
      if ((c = c.parentElement ? c.parentElement : c.parentNode))
        (b = a.D(c)), (d = a.M(c));
    (d && "BODY" != b) || (c = 0);
    c &&
      ((b = c.onclick ? "" + c.onclick : ""),
      0 <= b.indexOf(".tl(") || 0 <= b.indexOf(".trackLink(")) &&
      (c = 0);
    return c;
  };
  a.Hb = function() {
    var c,
      b,
      d = a.linkObject,
      f = a.linkType,
      e = a.linkURL,
      g,
      h;
    a.oa = 1;
    d || ((a.oa = 0), (d = a.clickObject));
    if (d) {
      c = a.D(d);
      for (b = a.M(d); d && !b && "BODY" != c; )
        if ((d = d.parentElement ? d.parentElement : d.parentNode))
          (c = a.D(d)), (b = a.M(d));
      (b && "BODY" != c) || (d = 0);
      if (d && !a.linkObject) {
        var l = d.onclick ? "" + d.onclick : "";
        if (0 <= l.indexOf(".tl(") || 0 <= l.indexOf(".trackLink(")) d = 0;
      }
    } else a.oa = 1;
    !e && d && (e = a.Ia(d));
    e &&
      !a.linkLeaveQueryString &&
      ((g = e.indexOf("?")), 0 <= g && (e = e.substring(0, g)));
    if (!f && e) {
      var m = 0,
        q = 0,
        n;
      if (a.trackDownloadLinks && a.linkDownloadFileTypes)
        for (
          l = e.toLowerCase(),
            g = l.indexOf("?"),
            h = l.indexOf("#"),
            0 <= g ? 0 <= h && h < g && (g = h) : (g = h),
            0 <= g && (l = l.substring(0, g)),
            g = a.linkDownloadFileTypes.toLowerCase().split(","),
            h = 0;
          h < g.length;
          h++
        )
          (n = g[h]) &&
            l.substring(l.length - (n.length + 1)) == "." + n &&
            (f = "d");
      if (
        a.trackExternalLinks &&
        !f &&
        ((l = e.toLowerCase()),
        a.La(l) &&
          (a.linkInternalFilters ||
            (a.linkInternalFilters = k.location.hostname),
          (g = 0),
          a.linkExternalFilters
            ? ((g = a.linkExternalFilters.toLowerCase().split(",")), (m = 1))
            : a.linkInternalFilters &&
              (g = a.linkInternalFilters.toLowerCase().split(",")),
          g))
      ) {
        for (h = 0; h < g.length; h++) (n = g[h]), 0 <= l.indexOf(n) && (q = 1);
        q ? m && (f = "e") : m || (f = "e");
      }
    }
    a.linkObject = d;
    a.linkURL = e;
    a.linkType = f;
    if (a.trackClickMap || a.trackInlineStats)
      (a.e = ""),
        d &&
          ((f = a.pageName),
          (e = 1),
          (d = d.sourceIndex),
          f || ((f = a.pageURL), (e = 0)),
          k.s_objectID && ((b.id = k.s_objectID), (d = b.type = 1)),
          f &&
            b &&
            b.id &&
            c &&
            (a.e =
              "&pid=" +
              a.escape(f.substring(0, 255)) +
              (e ? "&pidt=" + e : "") +
              "&oid=" +
              a.escape(b.id.substring(0, 100)) +
              (b.type ? "&oidt=" + b.type : "") +
              "&ot=" +
              c +
              (d ? "&oi=" + d : "")));
  };
  a.Ab = function() {
    var c = a.oa,
      b = a.linkType,
      d = a.linkURL,
      f = a.linkName;
    b &&
      (d || f) &&
      ((b = b.toLowerCase()),
      "d" != b && "e" != b && (b = "o"),
      (a.pe = "lnk_" + b),
      (a.pev1 = d ? a.escape(d) : ""),
      (a.pev2 = f ? a.escape(f) : ""),
      (c = 1));
    a.abort && (c = 0);
    if (a.trackClickMap || a.trackInlineStats || a.ActivityMap) {
      var b = {},
        d = 0,
        e = a.cookieRead("s_sq"),
        g = e ? e.split("&") : 0,
        h,
        l,
        k,
        e = 0;
      if (g)
        for (h = 0; h < g.length; h++)
          (l = g[h].split("=")),
            (f = a.unescape(l[0]).split(",")),
            (l = a.unescape(l[1])),
            (b[l] = f);
      f = a.account.split(",");
      h = {};
      for (k in a.contextData)
        k &&
          !Object.prototype[k] &&
          "a.activitymap." == k.substring(0, 14) &&
          ((h[k] = a.contextData[k]), (a.contextData[k] = ""));
      a.e = a.r("c", h) + (a.e ? a.e : "");
      if (c || a.e) {
        c && !a.e && (e = 1);
        for (l in b)
          if (!Object.prototype[l])
            for (k = 0; k < f.length; k++)
              for (
                e &&
                  ((g = b[l].join(",")),
                  g == a.account &&
                    ((a.e += ("&" != l.charAt(0) ? "&" : "") + l),
                    (b[l] = []),
                    (d = 1))),
                  h = 0;
                h < b[l].length;
                h++
              )
                (g = b[l][h]),
                  g == f[k] &&
                    (e &&
                      (a.e +=
                        "&u=" +
                        a.escape(g) +
                        ("&" != l.charAt(0) ? "&" : "") +
                        l +
                        "&u=0"),
                    b[l].splice(h, 1),
                    (d = 1));
        c || (d = 1);
        if (d) {
          e = "";
          h = 2;
          !c &&
            a.e &&
            ((e = a.escape(f.join(",")) + "=" + a.escape(a.e)), (h = 1));
          for (l in b)
            !Object.prototype[l] &&
              0 < h &&
              0 < b[l].length &&
              ((e +=
                (e ? "&" : "") + a.escape(b[l].join(",")) + "=" + a.escape(l)),
              h--);
          a.cookieWrite("s_sq", e);
        }
      }
    }
    return c;
  };
  a.Bb = function() {
    if (!a.Lb) {
      var c = new Date(),
        b = n.location,
        d,
        f,
        e = (f = d = ""),
        g = "",
        h = "",
        l = "1.2",
        k = a.cookieWrite("s_cc", "true", 0) ? "Y" : "N",
        m = "",
        p = "";
      if (
        c.setUTCDate &&
        ((l = "1.3"), (0).toPrecision && ((l = "1.5"), (c = []), c.forEach))
      ) {
        l = "1.6";
        f = 0;
        d = {};
        try {
          (f = new Iterator(d)),
            f.next &&
              ((l = "1.7"),
              c.reduce &&
                ((l = "1.8"),
                l.trim &&
                  ((l = "1.8.1"),
                  Date.parse &&
                    ((l = "1.8.2"), Object.create && (l = "1.8.5")))));
        } catch (r) {}
      }
      d = screen.width + "x" + screen.height;
      e = navigator.javaEnabled() ? "Y" : "N";
      f = screen.pixelDepth ? screen.pixelDepth : screen.colorDepth;
      g = a.w.innerWidth ? a.w.innerWidth : a.d.documentElement.offsetWidth;
      h = a.w.innerHeight ? a.w.innerHeight : a.d.documentElement.offsetHeight;
      try {
        a.b.addBehavior("#default#homePage"), (m = a.b.Rb(b) ? "Y" : "N");
      } catch (s) {}
      try {
        a.b.addBehavior("#default#clientCaps"), (p = a.b.connectionType);
      } catch (t) {}
      a.resolution = d;
      a.colorDepth = f;
      a.javascriptVersion = l;
      a.javaEnabled = e;
      a.cookiesEnabled = k;
      a.browserWidth = g;
      a.browserHeight = h;
      a.connectionType = p;
      a.homepage = m;
      a.Lb = 1;
    }
  };
  a.Q = {};
  a.loadModule = function(c, b) {
    var d = a.Q[c];
    if (!d) {
      d = k["AppMeasurement_Module_" + c]
        ? new k["AppMeasurement_Module_" + c](a)
        : {};
      a.Q[c] = a[c] = d;
      d.eb = function() {
        return d.ib;
      };
      d.jb = function(b) {
        if ((d.ib = b))
          (a[c + "_onLoad"] = b), a.ia(c + "_onLoad", [a, d], 1) || b(a, d);
      };
      try {
        Object.defineProperty
          ? Object.defineProperty(d, "onLoad", { get: d.eb, set: d.jb })
          : (d._olc = 1);
      } catch (f) {
        d._olc = 1;
      }
    }
    b && ((a[c + "_onLoad"] = b), a.ia(c + "_onLoad", [a, d], 1) || b(a, d));
  };
  a.p = function(c) {
    var b, d;
    for (b in a.Q)
      if (
        !Object.prototype[b] &&
        (d = a.Q[b]) &&
        (d._olc && d.onLoad && ((d._olc = 0), d.onLoad(a, d)), d[c] && d[c]())
      )
        return 1;
    return 0;
  };
  a.Db = function() {
    var c = Math.floor(1e13 * Math.random()),
      b = a.visitorSampling,
      d = a.visitorSamplingGroup,
      d =
        "s_vsn_" +
        (a.visitorNamespace ? a.visitorNamespace : a.account) +
        (d ? "_" + d : ""),
      f = a.cookieRead(d);
    if (b) {
      b *= 100;
      f && (f = parseInt(f));
      if (!f) {
        if (!a.cookieWrite(d, c)) return 0;
        f = c;
      }
      if (f % 1e4 > b) return 0;
    }
    return 1;
  };
  a.R = function(c, b) {
    var d, f, e, g, h, l;
    for (d = 0; 2 > d; d++)
      for (f = 0 < d ? a.Aa : a.g, e = 0; e < f.length; e++)
        if (((g = f[e]), (h = c[g]) || c["!" + g])) {
          if (!b && ("contextData" == g || "retrieveLightData" == g) && a[g])
            for (l in a[g]) h[l] || (h[l] = a[g][l]);
          a[g] = h;
        }
  };
  a.Va = function(c, b) {
    var d, f, e, g;
    for (d = 0; 2 > d; d++)
      for (f = 0 < d ? a.Aa : a.g, e = 0; e < f.length; e++)
        (g = f[e]), (c[g] = a[g]), b || c[g] || (c["!" + g] = 1);
  };
  a.vb = function(a) {
    var b,
      d,
      f,
      e,
      g,
      h = 0,
      l,
      k = "",
      m = "";
    if (
      a &&
      255 < a.length &&
      ((b = "" + a),
      (d = b.indexOf("?")),
      0 < d &&
        ((l = b.substring(d + 1)),
        (b = b.substring(0, d)),
        (e = b.toLowerCase()),
        (f = 0),
        "http://" == e.substring(0, 7)
          ? (f += 7)
          : "https://" == e.substring(0, 8) && (f += 8),
        (d = e.indexOf("/", f)),
        0 < d &&
          ((e = e.substring(f, d)),
          (g = b.substring(d)),
          (b = b.substring(0, d)),
          0 <= e.indexOf("google")
            ? (h = ",q,ie,start,search_key,word,kw,cd,")
            : 0 <= e.indexOf("yahoo.co") && (h = ",p,ei,"),
          h && l)))
    ) {
      if ((a = l.split("&")) && 1 < a.length) {
        for (f = 0; f < a.length; f++)
          (e = a[f]),
            (d = e.indexOf("=")),
            0 < d && 0 <= h.indexOf("," + e.substring(0, d) + ",")
              ? (k += (k ? "&" : "") + e)
              : (m += (m ? "&" : "") + e);
        k && m ? (l = k + "&" + m) : (m = "");
      }
      d = 253 - (l.length - m.length) - b.length;
      a = b + (0 < d ? g.substring(0, d) : "") + "?" + l;
    }
    return a;
  };
  a.ab = function(c) {
    var b = a.d.visibilityState,
      d = ["webkitvisibilitychange", "visibilitychange"];
    b || (b = a.d.webkitVisibilityState);
    if (b && "prerender" == b) {
      if (c)
        for (b = 0; b < d.length; b++)
          a.d.addEventListener(d[b], function() {
            var b = a.d.visibilityState;
            b || (b = a.d.webkitVisibilityState);
            "visible" == b && c();
          });
      return !1;
    }
    return !0;
  };
  a.ea = !1;
  a.J = !1;
  a.lb = function() {
    a.J = !0;
    a.j();
  };
  a.ca = !1;
  a.V = !1;
  a.hb = function(c) {
    a.marketingCloudVisitorID = c;
    a.V = !0;
    a.j();
  };
  a.fa = !1;
  a.W = !1;
  a.mb = function(c) {
    a.visitorOptedOut = c;
    a.W = !0;
    a.j();
  };
  a.Z = !1;
  a.S = !1;
  a.Xa = function(c) {
    a.analyticsVisitorID = c;
    a.S = !0;
    a.j();
  };
  a.ba = !1;
  a.U = !1;
  a.Za = function(c) {
    a.audienceManagerLocationHint = c;
    a.U = !0;
    a.j();
  };
  a.aa = !1;
  a.T = !1;
  a.Ya = function(c) {
    a.audienceManagerBlob = c;
    a.T = !0;
    a.j();
  };
  a.$a = function(c) {
    a.maxDelay || (a.maxDelay = 250);
    return a.p("_d")
      ? (c &&
          setTimeout(function() {
            c();
          }, a.maxDelay),
        !1)
      : !0;
  };
  a.da = !1;
  a.I = !1;
  a.xa = function() {
    a.I = !0;
    a.j();
  };
  a.isReadyToTrack = function() {
    var c = !0,
      b = a.visitor,
      d,
      f,
      e;
    a.ea || a.J || (a.ab(a.lb) ? (a.J = !0) : (a.ea = !0));
    if (a.ea && !a.J) return !1;
    b &&
      b.isAllowed() &&
      (a.ca ||
        a.marketingCloudVisitorID ||
        !b.getMarketingCloudVisitorID ||
        ((a.ca = !0),
        (a.marketingCloudVisitorID = b.getMarketingCloudVisitorID([a, a.hb])),
        a.marketingCloudVisitorID && (a.V = !0)),
      a.fa ||
        a.visitorOptedOut ||
        !b.isOptedOut ||
        ((a.fa = !0),
        (a.visitorOptedOut = b.isOptedOut([a, a.mb])),
        a.visitorOptedOut != p && (a.W = !0)),
      a.Z ||
        a.analyticsVisitorID ||
        !b.getAnalyticsVisitorID ||
        ((a.Z = !0),
        (a.analyticsVisitorID = b.getAnalyticsVisitorID([a, a.Xa])),
        a.analyticsVisitorID && (a.S = !0)),
      a.ba ||
        a.audienceManagerLocationHint ||
        !b.getAudienceManagerLocationHint ||
        ((a.ba = !0),
        (a.audienceManagerLocationHint = b.getAudienceManagerLocationHint([
          a,
          a.Za
        ])),
        a.audienceManagerLocationHint && (a.U = !0)),
      a.aa ||
        a.audienceManagerBlob ||
        !b.getAudienceManagerBlob ||
        ((a.aa = !0),
        (a.audienceManagerBlob = b.getAudienceManagerBlob([a, a.Ya])),
        a.audienceManagerBlob && (a.T = !0)),
      (c = a.ca && !a.V && !a.marketingCloudVisitorID),
      (b = a.Z && !a.S && !a.analyticsVisitorID),
      (d = a.ba && !a.U && !a.audienceManagerLocationHint),
      (f = a.aa && !a.T && !a.audienceManagerBlob),
      (e = a.fa && !a.W),
      (c = c || b || d || f || e ? !1 : !0));
    a.da || a.I || (a.$a(a.xa) ? (a.I = !0) : (a.da = !0));
    a.da && !a.I && (c = !1);
    return c;
  };
  a.o = p;
  a.u = 0;
  a.callbackWhenReadyToTrack = function(c, b, d) {
    var f;
    f = {};
    f.qb = c;
    f.pb = b;
    f.nb = d;
    a.o == p && (a.o = []);
    a.o.push(f);
    0 == a.u && (a.u = setInterval(a.j, 100));
  };
  a.j = function() {
    var c;
    if (a.isReadyToTrack() && (a.kb(), a.o != p))
      for (; 0 < a.o.length; ) (c = a.o.shift()), c.pb.apply(c.qb, c.nb);
  };
  a.kb = function() {
    a.u && (clearInterval(a.u), (a.u = 0));
  };
  a.fb = function(c) {
    var b,
      d,
      f = p,
      e = p;
    if (!a.isReadyToTrack()) {
      b = [];
      if (c != p) for (d in ((f = {}), c)) f[d] = c[d];
      e = {};
      a.Va(e, !0);
      b.push(f);
      b.push(e);
      a.callbackWhenReadyToTrack(a, a.track, b);
      return !0;
    }
    return !1;
  };
  a.xb = function() {
    var c = a.cookieRead("s_fid"),
      b = "",
      d = "",
      f;
    f = 8;
    var e = 4;
    if (!c || 0 > c.indexOf("-")) {
      for (c = 0; 16 > c; c++)
        (f = Math.floor(Math.random() * f)),
          (b += "0123456789ABCDEF".substring(f, f + 1)),
          (f = Math.floor(Math.random() * e)),
          (d += "0123456789ABCDEF".substring(f, f + 1)),
          (f = e = 16);
      c = b + "-" + d;
    }
    a.cookieWrite("s_fid", c, 1) || (c = 0);
    return c;
  };
  a.t = a.track = function(c, b) {
    var d,
      f = new Date(),
      e =
        "s" +
        (Math.floor(f.getTime() / 108e5) % 10) +
        Math.floor(1e13 * Math.random()),
      g = f.getYear(),
      g =
        "t=" +
        a.escape(
          f.getDate() +
            "/" +
            f.getMonth() +
            "/" +
            (1900 > g ? g + 1900 : g) +
            " " +
            f.getHours() +
            ":" +
            f.getMinutes() +
            ":" +
            f.getSeconds() +
            " " +
            f.getDay() +
            " " +
            f.getTimezoneOffset()
        );
    a.visitor &&
      a.visitor.getAuthState &&
      (a.authState = a.visitor.getAuthState());
    a.p("_s");
    a.fb(c) ||
      (b && a.R(b),
      c && ((d = {}), a.Va(d, 0), a.R(c)),
      a.Db() &&
        !a.visitorOptedOut &&
        (a.analyticsVisitorID || a.marketingCloudVisitorID || (a.fid = a.xb()),
        a.Hb(),
        a.usePlugins && a.doPlugins && a.doPlugins(a),
        a.account &&
          (a.abort ||
            (a.trackOffline &&
              !a.timestamp &&
              (a.timestamp = Math.floor(f.getTime() / 1e3)),
            (f = k.location),
            a.pageURL || (a.pageURL = f.href ? f.href : f),
            a.referrer ||
              a.Wa ||
              ((f = a.Util.getQueryParam("adobe_mc_ref", null, null, !0)),
              (a.referrer =
                f || void 0 === f
                  ? void 0 === f
                    ? ""
                    : f
                  : n.document.referrer)),
            (a.Wa = 1),
            (a.referrer = a.vb(a.referrer)),
            a.p("_g")),
          a.Ab() &&
            !a.abort &&
            (a.visitor &&
              !a.supplementalDataID &&
              a.visitor.getSupplementalDataID &&
              (a.supplementalDataID = a.visitor.getSupplementalDataID(
                "AppMeasurement:" + a._in,
                a.expectSupplementalData ? !1 : !0
              )),
            a.Bb(),
            (g += a.zb()),
            a.Gb(e, g),
            a.p("_t"),
            (a.referrer = "")))),
      c && a.R(d, 1));
    a.abort = a.supplementalDataID = a.timestamp = a.pageURLRest = a.linkObject = a.clickObject = a.linkURL = a.linkName = a.linkType = k.s_objectID = a.pe = a.pev1 = a.pev2 = a.pev3 = a.e = a.lightProfileID = 0;
  };
  a.za = [];
  a.registerPreTrackCallback = function(c) {
    for (var b = [], d = 1; d < arguments.length; d++) b.push(arguments[d]);
    "function" == typeof c
      ? a.za.push([c, b])
      : a.debugTracking &&
        a.F("DEBUG: Non function type passed to registerPreTrackCallback");
  };
  a.cb = function(c) {
    a.wa(a.za, c);
  };
  a.ya = [];
  a.registerPostTrackCallback = function(c) {
    for (var b = [], d = 1; d < arguments.length; d++) b.push(arguments[d]);
    "function" == typeof c
      ? a.ya.push([c, b])
      : a.debugTracking &&
        a.F("DEBUG: Non function type passed to registerPostTrackCallback");
  };
  a.bb = function(c) {
    a.wa(a.ya, c);
  };
  a.wa = function(c, b) {
    if ("object" == typeof c)
      for (var d = 0; d < c.length; d++) {
        var f = c[d][0],
          e = c[d][1];
        e.unshift(b);
        if ("function" == typeof f)
          try {
            f.apply(null, e);
          } catch (g) {
            a.debugTracking && a.F(g.message);
          }
      }
  };
  a.tl = a.trackLink = function(c, b, d, f, e) {
    a.linkObject = c;
    a.linkType = b;
    a.linkName = d;
    e && ((a.l = c), (a.A = e));
    return a.track(f);
  };
  a.trackLight = function(c, b, d, f) {
    a.lightProfileID = c;
    a.lightStoreForSeconds = b;
    a.lightIncrementBy = d;
    return a.track(f);
  };
  a.clearVars = function() {
    var c, b;
    for (c = 0; c < a.g.length; c++)
      if (
        ((b = a.g[c]),
        "prop" == b.substring(0, 4) ||
          "eVar" == b.substring(0, 4) ||
          "hier" == b.substring(0, 4) ||
          "list" == b.substring(0, 4) ||
          "channel" == b ||
          "events" == b ||
          "eventList" == b ||
          "products" == b ||
          "productList" == b ||
          "purchaseID" == b ||
          "transactionID" == b ||
          "state" == b ||
          "zip" == b ||
          "campaign" == b)
      )
        a[b] = void 0;
  };
  a.tagContainerMarker = "";
  a.Gb = function(c, b) {
    var d,
      f = a.trackingServer;
    d = "";
    var e = a.dc,
      g = "sc.",
      h = a.visitorNamespace;
    f
      ? a.trackingServerSecure && a.ssl && (f = a.trackingServerSecure)
      : (h ||
          ((h = a.account),
          (f = h.indexOf(",")),
          0 <= f && (h = h.substring(0, f)),
          (h = h.replace(/[^A-Za-z0-9]/g, ""))),
        d || (d = "2o7.net"),
        (e = e ? ("" + e).toLowerCase() : "d1"),
        "2o7.net" == d &&
          ("d1" == e ? (e = "112") : "d2" == e && (e = "122"), (g = "")),
        (f = h + "." + e + "." + g + d));
    d = a.ssl ? "https://" : "http://";
    e =
      (a.AudienceManagement && a.AudienceManagement.isReady()) ||
      0 != a.usePostbacks;
    d +=
      f +
      "/b/ss/" +
      a.account +
      "/" +
      (a.mobile ? "5." : "") +
      (e ? "10" : "1") +
      "/JS-" +
      a.version +
      (a.Kb ? "T" : "") +
      (a.tagContainerMarker ? "-" + a.tagContainerMarker : "") +
      "/" +
      c +
      "?AQB=1&ndh=1&pf=1&" +
      (e ? "callback=s_c_il[" + a._in + "].doPostbacks&et=1&" : "") +
      b +
      "&AQE=1";
    a.cb(d);
    a.tb(d);
    a.ka();
  };
  a.Ua = /{(%?)(.*?)(%?)}/;
  a.Ob = RegExp(a.Ua.source, "g");
  a.ub = function(c) {
    if ("object" == typeof c.dests)
      for (var b = 0; b < c.dests.length; ++b) {
        var d = c.dests[b];
        if ("string" == typeof d.c && "aa." == d.id.substr(0, 3))
          for (var f = d.c.match(a.Ob), e = 0; e < f.length; ++e) {
            var g = f[e],
              h = g.match(a.Ua),
              k = "";
            "%" == h[1] && "timezone_offset" == h[2]
              ? (k = new Date().getTimezoneOffset())
              : "%" == h[1] && "timestampz" == h[2] && (k = a.yb());
            d.c = d.c.replace(g, a.escape(k));
          }
      }
  };
  a.yb = function() {
    var c = new Date(),
      b = new Date(6e4 * Math.abs(c.getTimezoneOffset()));
    return (
      a.k(4, c.getFullYear()) +
      "-" +
      a.k(2, c.getMonth() + 1) +
      "-" +
      a.k(2, c.getDate()) +
      "T" +
      a.k(2, c.getHours()) +
      ":" +
      a.k(2, c.getMinutes()) +
      ":" +
      a.k(2, c.getSeconds()) +
      (0 < c.getTimezoneOffset() ? "-" : "+") +
      a.k(2, b.getUTCHours()) +
      ":" +
      a.k(2, b.getUTCMinutes())
    );
  };
  a.k = function(a, b) {
    return (Array(a + 1).join(0) + b).slice(-a);
  };
  a.ta = {};
  a.doPostbacks = function(c) {
    if ("object" == typeof c)
      if (
        (a.ub(c),
        "object" == typeof a.AudienceManagement &&
          "function" == typeof a.AudienceManagement.isReady &&
          a.AudienceManagement.isReady() &&
          "function" == typeof a.AudienceManagement.passData)
      )
        a.AudienceManagement.passData(c);
      else if ("object" == typeof c && "object" == typeof c.dests)
        for (var b = 0; b < c.dests.length; ++b) {
          var d = c.dests[b];
          "object" == typeof d &&
            "string" == typeof d.c &&
            "string" == typeof d.id &&
            "aa." == d.id.substr(0, 3) &&
            ((a.ta[d.id] = new Image()),
            (a.ta[d.id].alt = ""),
            (a.ta[d.id].src = d.c));
        }
  };
  a.tb = function(c) {
    a.i || a.Cb();
    a.i.push(c);
    a.ma = a.C();
    a.Sa();
  };
  a.Cb = function() {
    a.i = a.Eb();
    a.i || (a.i = []);
  };
  a.Eb = function() {
    var c, b;
    if (a.ra()) {
      try {
        (b = k.localStorage.getItem(a.pa())) && (c = k.JSON.parse(b));
      } catch (d) {}
      return c;
    }
  };
  a.ra = function() {
    var c = !0;
    (a.trackOffline && a.offlineFilename && k.localStorage && k.JSON) ||
      (c = !1);
    return c;
  };
  a.Ja = function() {
    var c = 0;
    a.i && (c = a.i.length);
    a.q && c++;
    return c;
  };
  a.ka = function() {
    if (a.q && (a.B && a.B.complete && a.B.G && a.B.va(), a.q)) return;
    a.Ka = p;
    if (a.qa) a.ma > a.O && a.Qa(a.i), a.ua(500);
    else {
      var c = a.ob();
      if (0 < c) a.ua(c);
      else if ((c = a.Ga())) (a.q = 1), a.Fb(c), a.Jb(c);
    }
  };
  a.ua = function(c) {
    a.Ka || (c || (c = 0), (a.Ka = setTimeout(a.ka, c)));
  };
  a.ob = function() {
    var c;
    if (!a.trackOffline || 0 >= a.offlineThrottleDelay) return 0;
    c = a.C() - a.Pa;
    return a.offlineThrottleDelay < c ? 0 : a.offlineThrottleDelay - c;
  };
  a.Ga = function() {
    if (0 < a.i.length) return a.i.shift();
  };
  a.Fb = function(c) {
    if (a.debugTracking) {
      var b = "AppMeasurement Debug: " + c;
      c = c.split("&");
      var d;
      for (d = 0; d < c.length; d++) b += "\n\t" + a.unescape(c[d]);
      a.F(b);
    }
  };
  a.gb = function() {
    return a.marketingCloudVisitorID || a.analyticsVisitorID;
  };
  a.Y = !1;
  var t;
  try {
    t = JSON.parse('{"x":"y"}');
  } catch (w) {
    t = null;
  }
  t && "y" == t.x
    ? ((a.Y = !0),
      (a.X = function(a) {
        return JSON.parse(a);
      }))
    : k.$ && k.$.parseJSON
    ? ((a.X = function(a) {
        return k.$.parseJSON(a);
      }),
      (a.Y = !0))
    : (a.X = function() {
        return null;
      });
  a.Jb = function(c) {
    var b, d, f;
    a.gb() &&
      2047 < c.length &&
      ("undefined" != typeof XMLHttpRequest &&
        ((b = new XMLHttpRequest()),
        "withCredentials" in b ? (d = 1) : (b = 0)),
      b ||
        "undefined" == typeof XDomainRequest ||
        ((b = new XDomainRequest()), (d = 2)),
      b &&
        ((a.AudienceManagement && a.AudienceManagement.isReady()) ||
          0 != a.usePostbacks) &&
        (a.Y ? (b.Ba = !0) : (b = 0)));
    !b && a.Ta && (c = c.substring(0, 2047));
    !b &&
      a.d.createElement &&
      (0 != a.usePostbacks ||
        (a.AudienceManagement && a.AudienceManagement.isReady())) &&
      (b = a.d.createElement("SCRIPT")) &&
      "async" in b &&
      ((f = (f = a.d.getElementsByTagName("HEAD")) && f[0] ? f[0] : a.d.body)
        ? ((b.type = "text/javascript"),
          b.setAttribute("async", "async"),
          (d = 3))
        : (b = 0));
    b ||
      ((b = new Image()),
      (b.alt = ""),
      b.abort ||
        "undefined" === typeof k.InstallTrigger ||
        (b.abort = function() {
          b.src = p;
        }));
    b.Da = function() {
      try {
        b.G && (clearTimeout(b.G), (b.G = 0));
      } catch (a) {}
    };
    b.onload = b.va = function() {
      a.bb(c);
      b.Da();
      a.sb();
      a.ga();
      a.q = 0;
      a.ka();
      if (b.Ba) {
        b.Ba = !1;
        try {
          a.doPostbacks(a.X(b.responseText));
        } catch (d) {}
      }
    };
    b.onabort = b.onerror = b.Ha = function() {
      b.Da();
      (a.trackOffline || a.qa) && a.q && a.i.unshift(a.rb);
      a.q = 0;
      a.ma > a.O && a.Qa(a.i);
      a.ga();
      a.ua(500);
    };
    b.onreadystatechange = function() {
      4 == b.readyState && (200 == b.status ? b.va() : b.Ha());
    };
    a.Pa = a.C();
    if (1 == d || 2 == d) {
      var e = c.indexOf("?");
      f = c.substring(0, e);
      e = c.substring(e + 1);
      e = e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/, "");
      1 == d
        ? (b.open("POST", f, !0), b.send(e))
        : 2 == d && (b.open("POST", f), b.send(e));
    } else if (((b.src = c), 3 == d)) {
      if (a.Na)
        try {
          f.removeChild(a.Na);
        } catch (g) {}
      f.firstChild ? f.insertBefore(b, f.firstChild) : f.appendChild(b);
      a.Na = a.B;
    }
    b.G = setTimeout(function() {
      b.G &&
        (b.complete
          ? b.va()
          : (a.trackOffline && b.abort && b.abort(), b.Ha()));
    }, 5e3);
    a.rb = c;
    a.B = k["s_i_" + a.replace(a.account, ",", "_")] = b;
    if ((a.useForcedLinkTracking && a.K) || a.A)
      a.forcedLinkTrackingTimeout || (a.forcedLinkTrackingTimeout = 250),
        (a.ha = setTimeout(a.ga, a.forcedLinkTrackingTimeout));
  };
  a.sb = function() {
    if (a.ra() && !(a.Oa > a.O))
      try {
        k.localStorage.removeItem(a.pa()), (a.Oa = a.C());
      } catch (c) {}
  };
  a.Qa = function(c) {
    if (a.ra()) {
      a.Sa();
      try {
        k.localStorage.setItem(a.pa(), k.JSON.stringify(c)), (a.O = a.C());
      } catch (b) {}
    }
  };
  a.Sa = function() {
    if (a.trackOffline) {
      if (!a.offlineLimit || 0 >= a.offlineLimit) a.offlineLimit = 10;
      for (; a.i.length > a.offlineLimit; ) a.Ga();
    }
  };
  a.forceOffline = function() {
    a.qa = !0;
  };
  a.forceOnline = function() {
    a.qa = !1;
  };
  a.pa = function() {
    return a.offlineFilename + "-" + a.visitorNamespace + a.account;
  };
  a.C = function() {
    return new Date().getTime();
  };
  a.La = function(a) {
    a = a.toLowerCase();
    return 0 != a.indexOf("#") &&
      0 != a.indexOf("about:") &&
      0 != a.indexOf("opera:") &&
      0 != a.indexOf("javascript:")
      ? !0
      : !1;
  };
  a.setTagContainer = function(c) {
    var b, d, f;
    a.Kb = c;
    for (b = 0; b < a._il.length; b++)
      if ((d = a._il[b]) && "s_l" == d._c && d.tagContainerName == c) {
        a.R(d);
        if (d.lmq)
          for (b = 0; b < d.lmq.length; b++) (f = d.lmq[b]), a.loadModule(f.n);
        if (d.ml)
          for (f in d.ml)
            if (a[f])
              for (b in ((c = a[f]), (f = d.ml[f]), f))
                !Object.prototype[b] &&
                  ("function" != typeof f[b] ||
                    0 > ("" + f[b]).indexOf("s_c_il")) &&
                  (c[b] = f[b]);
        if (d.mmq)
          for (b = 0; b < d.mmq.length; b++)
            (f = d.mmq[b]),
              a[f.m] &&
                ((c = a[f.m]),
                c[f.f] &&
                  "function" == typeof c[f.f] &&
                  (f.a ? c[f.f].apply(c, f.a) : c[f.f].apply(c)));
        if (d.tq) for (b = 0; b < d.tq.length; b++) a.track(d.tq[b]);
        d.s = a;
        break;
      }
  };
  a.Util = {
    urlEncode: a.escape,
    urlDecode: a.unescape,
    cookieRead: a.cookieRead,
    cookieWrite: a.cookieWrite,
    getQueryParam: function(c, b, d, f) {
      var e,
        g = "";
      b || (b = a.pageURL ? a.pageURL : k.location);
      d = d ? d : "&";
      if (!c || !b) return g;
      b = "" + b;
      e = b.indexOf("?");
      if (0 > e) return g;
      b = d + b.substring(e + 1) + d;
      if (
        !f ||
        !(0 <= b.indexOf(d + c + d) || 0 <= b.indexOf(d + c + "=" + d))
      ) {
        e = b.indexOf("#");
        0 <= e && (b = b.substr(0, e) + d);
        e = b.indexOf(d + c + "=");
        if (0 > e) return g;
        b = b.substring(e + d.length + c.length + 1);
        e = b.indexOf(d);
        0 <= e && (b = b.substring(0, e));
        0 < b.length && (g = a.unescape(b));
        return g;
      }
    }
  };
  a.H = "supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL customerPerspective referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(
    " "
  );
  a.g = a.H.concat(
    "purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(
      " "
    )
  );
  a.na = "timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(
    " "
  );
  a.P = a.na.slice(0);
  a.Aa = "account allAccounts debugTracking visitor visitorOptedOut trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData usePostbacks registerPreTrackCallback registerPostTrackCallback AudienceManagement".split(
    " "
  );
  for (m = 0; 250 >= m; m++)
    76 > m && (a.g.push("prop" + m), a.P.push("prop" + m)),
      a.g.push("eVar" + m),
      a.P.push("eVar" + m),
      6 > m && a.g.push("hier" + m),
      4 > m && a.g.push("list" + m);
  m = "pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest marketingCloudOrgID".split(
    " "
  );
  a.g = a.g.concat(m);
  a.H = a.H.concat(m);
  a.ssl = 0 <= k.location.protocol.toLowerCase().indexOf("https");
  a.charSet = "UTF-8";
  a.contextData = {};
  a.offlineThrottleDelay = 0;
  a.offlineFilename = "AppMeasurement.offline";
  a.Pa = 0;
  a.ma = 0;
  a.O = 0;
  a.Oa = 0;
  a.linkDownloadFileTypes =
    "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
  a.w = k;
  a.d = k.document;
  try {
    if (((a.Ta = !1), navigator)) {
      var v = navigator.userAgent;
      if (
        "Microsoft Internet Explorer" == navigator.appName ||
        0 <= v.indexOf("MSIE ") ||
        (0 <= v.indexOf("Trident/") && 0 <= v.indexOf("Windows NT 6"))
      )
        a.Ta = !0;
    }
  } catch (x) {}
  a.ga = function() {
    a.ha && (k.clearTimeout(a.ha), (a.ha = p));
    a.l && a.K && a.l.dispatchEvent(a.K);
    a.A &&
      ("function" == typeof a.A
        ? a.A()
        : a.l && a.l.href && (a.d.location = a.l.href));
    a.l = a.K = a.A = 0;
  };
  a.Ra = function() {
    a.b = a.d.body;
    a.b
      ? ((a.v = function(c) {
          var b, d, f, e, g;
          if (
            !(
              (a.d && a.d.getElementById("cppXYctnr")) ||
              (c && c["s_fe_" + a._in])
            )
          ) {
            if (a.Ca)
              if (a.useForcedLinkTracking)
                a.b.removeEventListener("click", a.v, !1);
              else {
                a.b.removeEventListener("click", a.v, !0);
                a.Ca = a.useForcedLinkTracking = 0;
                return;
              }
            else a.useForcedLinkTracking = 0;
            a.clickObject = c.srcElement ? c.srcElement : c.target;
            try {
              if (
                !a.clickObject ||
                (a.N && a.N == a.clickObject) ||
                !(
                  a.clickObject.tagName ||
                  a.clickObject.parentElement ||
                  a.clickObject.parentNode
                )
              )
                a.clickObject = 0;
              else {
                var h = (a.N = a.clickObject);
                a.la && (clearTimeout(a.la), (a.la = 0));
                a.la = setTimeout(function() {
                  a.N == h && (a.N = 0);
                }, 1e4);
                f = a.Ja();
                a.track();
                if (f < a.Ja() && a.useForcedLinkTracking && c.target) {
                  for (
                    e = c.target;
                    e &&
                    e != a.b &&
                    "A" != e.tagName.toUpperCase() &&
                    "AREA" != e.tagName.toUpperCase();

                  )
                    e = e.parentNode;
                  if (
                    e &&
                    ((g = e.href),
                    a.La(g) || (g = 0),
                    (d = e.target),
                    c.target.dispatchEvent &&
                      g &&
                      (!d ||
                        "_self" == d ||
                        "_top" == d ||
                        "_parent" == d ||
                        (k.name && d == k.name)))
                  ) {
                    try {
                      b = a.d.createEvent("MouseEvents");
                    } catch (l) {
                      b = new k.MouseEvent();
                    }
                    if (b) {
                      try {
                        b.initMouseEvent(
                          "click",
                          c.bubbles,
                          c.cancelable,
                          c.view,
                          c.detail,
                          c.screenX,
                          c.screenY,
                          c.clientX,
                          c.clientY,
                          c.ctrlKey,
                          c.altKey,
                          c.shiftKey,
                          c.metaKey,
                          c.button,
                          c.relatedTarget
                        );
                      } catch (m) {
                        b = 0;
                      }
                      b &&
                        ((b["s_fe_" + a._in] = b.s_fe = 1),
                        c.stopPropagation(),
                        c.stopImmediatePropagation &&
                          c.stopImmediatePropagation(),
                        c.preventDefault(),
                        (a.l = c.target),
                        (a.K = b));
                    }
                  }
                }
              }
            } catch (n) {
              a.clickObject = 0;
            }
          }
        }),
        a.b && a.b.attachEvent
          ? a.b.attachEvent("onclick", a.v)
          : a.b &&
            a.b.addEventListener &&
            (navigator &&
              ((0 <= navigator.userAgent.indexOf("WebKit") &&
                a.d.createEvent) ||
                (0 <= navigator.userAgent.indexOf("Firefox/2") &&
                  k.MouseEvent)) &&
              ((a.Ca = 1),
              (a.useForcedLinkTracking = 1),
              a.b.addEventListener("click", a.v, !0)),
            a.b.addEventListener("click", a.v, !1)))
      : setTimeout(a.Ra, 30);
  };
  a.Ra();
  r
    ? a.setAccount(r)
    : a.F("Error, missing Report Suite ID in AppMeasurement initialization");
  a.loadModule("ActivityMap");
}
function s_gi(r) {
  var a,
    k = window.s_c_il,
    p,
    n,
    m = r.split(","),
    s,
    u,
    t = 0;
  if (k)
    for (p = 0; !t && p < k.length; ) {
      a = k[p];
      if ("s_c" == a._c && (a.account || a.oun))
        if (a.account && a.account == r) t = 1;
        else
          for (
            n = a.account ? a.account : a.oun,
              n = a.allAccounts ? a.allAccounts : n.split(","),
              s = 0;
            s < m.length;
            s++
          )
            for (u = 0; u < n.length; u++) m[s] == n[u] && (t = 1);
      p++;
    }
  t || (a = new AppMeasurement(r));
  return a;
}
AppMeasurement.getInstance = s_gi;
window.s_objectID || (window.s_objectID = 0);
function s_pgicq() {
  var r = window,
    a = r.s_giq,
    k,
    p,
    n;
  if (a)
    for (k = 0; k < a.length; k++)
      (p = a[k]),
        (n = s_gi(p.oun)),
        n.setAccount(p.un),
        n.setTagContainer(p.tagContainerName);
  r.s_giq = 0;
}
s_pgicq();
