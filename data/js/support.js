/*
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
  /** version */
  var version = '3.7.3';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document|DocumentFragment} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));


/* modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-adownload-animation-apng-applicationcache-atobbtoa-audio-backgroundcliptext-backgroundsize-bgpositionxy-bgrepeatspace_bgrepeatround-blobconstructor-bloburls-blobworkers-borderimage-borderradius-boxshadow-boxsizing-canvas-canvastext-capture-contenteditable-contextmenu-cssanimations-csscolumns-cssfilters-cssgradients-csspointerevents-csspseudoanimations-csspseudotransitions-cssresize-csstransforms-csstransforms3d-csstransitions-datalistelem-dataset-datauri-details-directory-displaytable-ellipsis-fileinput-filereader-filesystem-flexbox-flexboxlegacy-flexboxtweener-fontface-formattribute-formvalidation-framed-fullscreen-getusermedia-input-localizednumber-localstorage-mathml-mediaqueries-opacity-outputelem-picture-placeholder-progressbar_meter-rgba-supports-svg-svgasimg-template-textareamaxlength-textshadow-time-touchevents-unicode-unknownelements-urlparser-userselect-video-webaudio-webgl-setclasses !*/
!function(e,t,n){function r(e,t){return typeof e===t}function a(){var e,t,n,a,i,o,s;for(var d in y)if(y.hasOwnProperty(d)){if(e=[],t=y[d],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(a=r(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)o=e[i],s=o.split("."),1===s.length?Modernizr[s[0]]=a:(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=a),A.push((a?"":"no-")+s.join("-"))}}function i(e){var t=C.className,n=Modernizr._config.classPrefix||"";if(S&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),S?C.className.baseVal=t:C.className=t)}function o(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):S?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function s(){var e=t.body;return e||(e=o(S?"svg":"body"),e.fake=!0),e}function d(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function u(e,n,r,a){var i,d,u,l,c="modernizr",f=o("div"),p=s();if(parseInt(r,10))for(;r--;)u=o("div"),u.id=a?a[r]:c+(r+1),f.appendChild(u);return i=o("style"),i.type="text/css",i.id="s"+c,(p.fake?p:f).appendChild(i),p.appendChild(f),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),f.id=c,p.fake&&(p.style.background="",p.style.overflow="hidden",l=C.style.overflow,C.style.overflow="hidden",C.appendChild(p)),d=n(f,e),p.fake?(p.parentNode.removeChild(p),C.style.overflow=l,C.offsetHeight):f.parentNode.removeChild(f),!!d}function l(e,t){if("object"==typeof e)for(var n in e)j(e,n)&&l(n,e[n]);else{e=e.toLowerCase();var r=e.split("."),a=Modernizr[r[0]];if(2==r.length&&(a=a[r[1]]),"undefined"!=typeof a)return Modernizr;t="function"==typeof t?t():t,1==r.length?Modernizr[r[0]]=t:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=t),i([(t&&0!=t?"":"no-")+r.join("-")]),Modernizr._trigger(e,t)}return Modernizr}function c(e,t){return!!~(""+e).indexOf(t)}function f(e,t){return function(){return e.apply(t,arguments)}}function p(e,t,n){var a;for(var i in e)if(e[i]in t)return n===!1?e[i]:(a=t[e[i]],r(a,"function")?f(a,n||t):a);return!1}function m(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function g(t,r){var a=t.length;if("CSS"in e&&"supports"in e.CSS){for(;a--;)if(e.CSS.supports(m(t[a]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];a--;)i.push("("+m(t[a])+":"+r+")");return i=i.join(" or "),u("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function v(e,t,a,i){function s(){l&&(delete $.style,delete $.modElem)}if(i=r(i,"undefined")?!1:i,!r(a,"undefined")){var u=g(e,a);if(!r(u,"undefined"))return u}for(var l,f,p,m,v,h=["modernizr","tspan"];!$.style;)l=!0,$.modElem=o(h.shift()),$.style=$.modElem.style;for(p=e.length,f=0;p>f;f++)if(m=e[f],v=$.style[m],c(m,"-")&&(m=d(m)),$.style[m]!==n){if(i||r(a,"undefined"))return s(),"pfx"==t?m:!0;try{$.style[m]=a}catch(b){}if($.style[m]!=v)return s(),"pfx"==t?m:!0}return s(),!1}function h(e,t,n,a,i){var o=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+U.join(o+" ")+o).split(" ");return r(t,"string")||r(t,"undefined")?v(s,t,a,i):(s=(e+" "+N.join(o+" ")+o).split(" "),p(s,t,n))}function b(e,t,r){return h(e,n,n,t,r)}var A=[],y=[],T={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){y.push({name:e,fn:t,options:n})},addAsyncTest:function(e){y.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=T,Modernizr=new Modernizr,Modernizr.addTest("applicationcache","applicationCache"in e),Modernizr.addTest("blobconstructor",function(){try{return!!new Blob}catch(e){return!1}},{aliases:["blob-constructor"]}),Modernizr.addTest("svg",!!t.createElementNS&&!!t.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect),Modernizr.addTest("webaudio",function(){var t="webkitAudioContext"in e,n="AudioContext"in e;return Modernizr._config.usePrefixes?t||n:n});var x="CSS"in e&&"supports"in e.CSS,w="supportsCSS"in e;Modernizr.addTest("supports",x||w),Modernizr.addTest("picture","HTMLPictureElement"in e),Modernizr.addTest("filereader",!!(e.File&&e.FileList&&e.FileReader)),Modernizr.addTest("localstorage",function(){var e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return!1}}),Modernizr.addTest("urlparser",function(){var e;try{return e=new URL("http://modernizr.com/"),"http://modernizr.com/"===e.href}catch(t){return!1}}),Modernizr.addTest("atobbtoa","atob"in e&&"btoa"in e,{aliases:["atob-btoa"]}),Modernizr.addTest("framed",e.location!=top.location);var C=t.documentElement;Modernizr.addTest("contextmenu","contextMenu"in C&&"HTMLMenuItemElement"in e);var S="svg"===C.nodeName.toLowerCase();Modernizr.addTest("audio",function(){var e=o("audio"),t=!1;try{(t=!!e.canPlayType)&&(t=new Boolean(t),t.ogg=e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),t.mp3=e.canPlayType('audio/mpeg; codecs="mp3"').replace(/^no$/,""),t.opus=e.canPlayType('audio/ogg; codecs="opus"')||e.canPlayType('audio/webm; codecs="opus"').replace(/^no$/,""),t.wav=e.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),t.m4a=(e.canPlayType("audio/x-m4a;")||e.canPlayType("audio/aac;")).replace(/^no$/,""))}catch(n){}return t}),Modernizr.addTest("canvas",function(){var e=o("canvas");return!(!e.getContext||!e.getContext("2d"))}),Modernizr.addTest("canvastext",function(){return Modernizr.canvas===!1?!1:"function"==typeof o("canvas").getContext("2d").fillText}),Modernizr.addTest("contenteditable",function(){if("contentEditable"in C){var e=o("div");return e.contentEditable=!0,"true"===e.contentEditable}}),Modernizr.addTest("video",function(){var e=o("video"),t=!1;try{(t=!!e.canPlayType)&&(t=new Boolean(t),t.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),t.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),t.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""),t.vp9=e.canPlayType('video/webm; codecs="vp9"').replace(/^no$/,""),t.hls=e.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/,""))}catch(n){}return t}),Modernizr.addTest("webanimations","animate"in o("div")),Modernizr.addTest("webgl",function(){var t=o("canvas"),n="probablySupportsContext"in t?"probablySupportsContext":"supportsContext";return n in t?t[n]("webgl")||t[n]("experimental-webgl"):"WebGLRenderingContext"in e}),Modernizr.addTest("adownload",!e.externalHost&&"download"in o("a")),Modernizr.addTest("csspointerevents",function(){var e=o("a").style;return e.cssText="pointer-events:auto","auto"===e.pointerEvents}),Modernizr.addTest("rgba",function(){var e=o("a").style;return e.cssText="background-color:rgba(150,255,150,.5)",(""+e.backgroundColor).indexOf("rgba")>-1}),Modernizr.addTest("outputelem","value"in o("output")),Modernizr.addTest("progressbar",o("progress").max!==n),Modernizr.addTest("meter",o("meter").max!==n),Modernizr.addTest("template","content"in o("template")),Modernizr.addTest("time","valueAsDate"in o("time")),Modernizr.addTest("unknownelements",function(){var e=o("a");return e.innerHTML="<xyz></xyz>",1===e.childNodes.length}),Modernizr.addTest("capture","capture"in o("input")),Modernizr.addTest("fileinput",function(){if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/))return!1;var e=o("input");return e.type="file",!e.disabled}),Modernizr.addTest("formattribute",function(){var e,n=o("form"),r=o("input"),a=o("div"),i="formtest"+(new Date).getTime(),s=!1;n.id=i;try{r.setAttribute("form",i)}catch(d){t.createAttribute&&(e=t.createAttribute("form"),e.nodeValue=i,r.setAttributeNode(e))}return a.appendChild(n),a.appendChild(r),C.appendChild(a),s=n.elements&&1===n.elements.length&&r.form==n,a.parentNode.removeChild(a),s}),Modernizr.addTest("placeholder","placeholder"in o("input")&&"placeholder"in o("textarea")),Modernizr.addTest("textareamaxlength",!!("maxLength"in o("textarea")));var k=o("input"),B="autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),z={};Modernizr.input=function(t){for(var n=0,r=t.length;r>n;n++)z[t[n]]=!!(t[n]in k);return z.list&&(z.list=!(!o("datalist")||!e.HTMLDataListElement)),z}(B),Modernizr.addTest("datalistelem",Modernizr.input.list);var P=T._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];T._prefixes=P,Modernizr.addTest("cssgradients",function(){for(var e,t="background-image:",n="gradient(linear,left top,right bottom,from(#9f9),to(white));",r="",a=0,i=P.length-1;i>a;a++)e=0===a?"to ":"",r+=t+P[a]+"linear-gradient("+e+"left top, #9f9, white);";Modernizr._config.usePrefixes&&(r+=t+"-webkit-"+n);var s=o("a"),d=s.style;return d.cssText=r,(""+d.backgroundImage).indexOf("gradient")>-1}),Modernizr.addTest("opacity",function(){var e=o("a").style;return e.cssText=P.join("opacity:.55;"),/^0.55$/.test(e.opacity)});var E="search tel url email datetime date month week time datetime-local number range color".split(" "),L={};Modernizr.inputtypes=function(e){for(var r,a,i,o=e.length,s="1)",d=0;o>d;d++)k.setAttribute("type",r=e[d]),i="text"!==k.type&&"style"in k,i&&(k.value=s,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(r)&&k.style.WebkitAppearance!==n?(C.appendChild(k),a=t.defaultView,i=a.getComputedStyle&&"textfield"!==a.getComputedStyle(k,null).WebkitAppearance&&0!==k.offsetHeight,C.removeChild(k)):/^(search|tel)$/.test(r)||(i=/^(url|email)$/.test(r)?k.checkValidity&&k.checkValidity()===!1:k.value!=s)),L[e[d]]=!!i;return L}(E);var R=T.testStyles=u;Modernizr.addTest("mathml",function(){var e;return R("#modernizr{position:absolute;display:inline-block}",function(t){t.innerHTML+="<math><mfrac><mi>xx</mi><mi>yy</mi></mfrac></math>",e=t.offsetHeight>t.offsetWidth}),e}),Modernizr.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var r=["@media (",P.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");R(r,function(e){n=9===e.offsetTop})}return n}),Modernizr.addTest("unicode",function(){var e,t=o("span"),n=o("span");return R("#modernizr{font-family:Arial,sans;font-size:300em;}",function(r){t.innerHTML=S?"妇":"&#5987;",n.innerHTML=S?"☆":"&#9734;",r.appendChild(t),r.appendChild(n),e="offsetWidth"in t&&t.offsetWidth!==n.offsetWidth}),e}),R("#modernizr{display: table; direction: ltr}#modernizr div{display: table-cell; padding: 10px}",function(e){var t,n=e.childNodes;t=n[0].offsetLeft<n[1].offsetLeft,Modernizr.addTest("displaytable",t,{aliases:["display-table"]})},2);var _=function(){var e=navigator.userAgent,t=e.match(/applewebkit\/([0-9]+)/gi)&&parseFloat(RegExp.$1),n=e.match(/w(eb)?osbrowser/gi),r=e.match(/windows phone/gi)&&e.match(/iemobile\/([0-9])+/gi)&&parseFloat(RegExp.$1)>=9,a=533>t&&e.match(/android/gi);return n||a||r}();_?Modernizr.addTest("fontface",!1):R('@font-face {font-family:"font";src:url("https://")}',function(e,n){var r=t.getElementById("smodernizr"),a=r.sheet||r.styleSheet,i=a?a.cssRules&&a.cssRules[0]?a.cssRules[0].cssText:a.cssText||"":"",o=/src/i.test(i)&&0===i.indexOf(n.split(" ")[0]);Modernizr.addTest("fontface",o)}),Modernizr.addTest("details",function(){var e,t=o("details");return"open"in t?(R("#modernizr details{display:block}",function(n){n.appendChild(t),t.innerHTML="<summary>a</summary>b",e=t.offsetHeight,t.open=!0,e=e!=t.offsetHeight}),e):!1}),Modernizr.addTest("formvalidation",function(){var t=o("form");if(!("checkValidity"in t&&"addEventListener"in t))return!1;if("reportValidity"in t)return!0;var n,r=!1;return Modernizr.formvalidationapi=!0,t.addEventListener("submit",function(t){(!e.opera||e.operamini)&&t.preventDefault(),t.stopPropagation()},!1),t.innerHTML='<input name="modTest" required="required" /><button></button>',R("#modernizr form{position:absolute;top:-99999em}",function(e){e.appendChild(t),n=t.getElementsByTagName("input")[0],n.addEventListener("invalid",function(e){r=!0,e.preventDefault(),e.stopPropagation()},!1),Modernizr.formvalidationmessage=!!n.validationMessage,t.getElementsByTagName("button")[0].click()}),r}),Modernizr.addTest("localizednumber",function(){if(!Modernizr.inputtypes.number)return!1;if(!Modernizr.formvalidation)return!1;var e,n=o("div"),r=s(),a=function(){return C.insertBefore(r,C.firstElementChild||C.firstChild)}();n.innerHTML='<input type="number" value="1.0" step="0.1"/>';var i=n.childNodes[0];a.appendChild(n),i.focus();try{t.execCommand("InsertText",!1,"1,1")}catch(d){}return e="number"===i.type&&1.1===i.valueAsNumber&&i.checkValidity(),a.removeChild(n),r.fake&&a.parentNode.removeChild(a),e});var M=function(){var t=e.matchMedia||e.msMatchMedia;return t?function(e){var n=t(e);return n&&n.matches||!1}:function(t){var n=!1;return u("@media "+t+" { #modernizr { position: absolute; } }",function(t){n="absolute"==(e.getComputedStyle?e.getComputedStyle(t,null):t.currentStyle).position}),n}}();T.mq=M,Modernizr.addTest("mediaqueries",M("only all"));var O="Moz O ms Webkit",N=T._config.usePrefixes?O.toLowerCase().split(" "):[];T._domPrefixes=N,Modernizr.addTest("fileinputdirectory",function(){var e=o("input"),t="directory";if(e.type="file",t in e)return!0;for(var n=0,r=N.length;r>n;n++)if(N[n]+t in e)return!0;return!1});var j;!function(){var e={}.hasOwnProperty;j=r(e,"undefined")||r(e.call,"undefined")?function(e,t){return t in e&&r(e.constructor.prototype[t],"undefined")}:function(t,n){return e.call(t,n)}}(),T._l={},T.on=function(e,t){this._l[e]||(this._l[e]=[]),this._l[e].push(t),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},T._trigger=function(e,t){if(this._l[e]){var n=this._l[e];setTimeout(function(){var e,r;for(e=0;e<n.length;e++)(r=n[e])(t)},0),delete this._l[e]}},Modernizr._q.push(function(){T.addTest=l}),Modernizr.addAsyncTest(function(){if(!Modernizr.canvas)return!1;var e=new Image,t=o("canvas"),n=t.getContext("2d");e.onload=function(){l("apng",function(){return"undefined"==typeof t.getContext?!1:(n.drawImage(e,0,0),0===n.getImageData(0,0,1,1).data[3])})},e.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg=="}),Modernizr.addTest("svgasimg",t.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")),Modernizr.addAsyncTest(function(){function e(){var e=new Image;e.onerror=function(){l("datauri",!0),Modernizr.datauri=new Boolean(!0),Modernizr.datauri.over32kb=!1},e.onload=function(){l("datauri",!0),Modernizr.datauri=new Boolean(!0),Modernizr.datauri.over32kb=1==e.width&&1==e.height};for(var t="R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";t.length<33e3;)t="\r\n"+t;e.src="data:image/gif;base64,"+t}-1!==navigator.userAgent.indexOf("MSIE 7.")&&setTimeout(function(){l("datauri",!1)},10);var t=new Image;t.onerror=function(){l("datauri",!1)},t.onload=function(){1==t.width&&1==t.height?e():l("datauri",!1)},t.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="}),Modernizr.addAsyncTest(function(){function t(){l("blobworkers",!1),n()}function n(){d&&a.revokeObjectURL(d),s&&s.terminate(),u&&clearTimeout(u)}try{var r=e.BlobBuilder,a=e.URL;Modernizr._config.usePrefix&&(r=r||e.MozBlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.OBlobBuilder,a=a||e.MozURL||e.webkitURL||e.MSURL||e.OURL);var i,o,s,d,u,c="Modernizr",f="this.onmessage=function(e){postMessage(e.data)}";try{i=new Blob([f],{type:"text/javascript"})}catch(p){}i||(o=new r,o.append(f),i=o.getBlob()),d=a.createObjectURL(i),s=new Worker(d),s.onmessage=function(e){l("blobworkers",c===e.data),n()},s.onerror=t,u=setTimeout(t,200),s.postMessage(c)}catch(p){t()}});var U=T._config.usePrefixes?O.split(" "):[];T._cssomPrefixes=U;var I=function(t){var r,a=P.length,i=e.CSSRule;if("undefined"==typeof i)return n;if(!t)return!1;if(t=t.replace(/^@/,""),r=t.replace(/-/g,"_").toUpperCase()+"_RULE",r in i)return"@"+t;for(var o=0;a>o;o++){var s=P[o],d=s.toUpperCase()+"_"+r;if(d in i)return"@-"+s.toLowerCase()+"-"+t}return!1};T.atRule=I,Modernizr.addTest("dataset",function(){var e=o("div");return e.setAttribute("data-a-b","c"),!(!e.dataset||"c"!==e.dataset.aB)});var V={elem:o("modernizr")};Modernizr._q.push(function(){delete V.elem});var $={style:V.elem.style};Modernizr._q.unshift(function(){delete $.style});var H=T.testProp=function(e,t,r){return v([e],n,t,r)};Modernizr.addTest("textshadow",H("textShadow","1px 1px")),T.testAllProps=h;var W=T.prefixed=function(e,t,n){return 0===e.indexOf("@")?I(e):(-1!=e.indexOf("-")&&(e=d(e)),t?h(e,t,n):h(e,"pfx"))};Modernizr.addTest("fullscreen",!(!W("exitFullscreen",t,!1)&&!W("cancelFullScreen",t,!1))),Modernizr.addTest("filesystem",!!W("requestFileSystem",e));var q=W("URL",e,!1);q=q&&e[q],Modernizr.addTest("bloburls",q&&"revokeObjectURL"in q&&"createObjectURL"in q),Modernizr.addTest("getusermedia",!!W("getUserMedia",navigator)),T.testAllProps=b,Modernizr.addTest("cssanimations",b("animationName","a",!0)),Modernizr.addTest("csspseudoanimations",function(){var t=!1;if(!Modernizr.cssanimations||!e.getComputedStyle)return t;var n=["@",Modernizr._prefixes.join("keyframes csspseudoanimations { from { font-size: 10px; } }@").replace(/\@$/,""),'#modernizr:before { content:" "; font-size:5px;',Modernizr._prefixes.join("animation:csspseudoanimations 1ms infinite;"),"}"].join("");return Modernizr.testStyles(n,function(n){t="10px"===e.getComputedStyle(n,":before").getPropertyValue("font-size")}),t}),Modernizr.addTest("backgroundcliptext",function(){return b("backgroundClip","text")}),Modernizr.addTest("bgpositionxy",function(){return b("backgroundPositionX","3px",!0)&&b("backgroundPositionY","5px",!0)}),Modernizr.addTest("bgrepeatround",b("backgroundRepeat","round")),Modernizr.addTest("bgrepeatspace",b("backgroundRepeat","space")),Modernizr.addTest("backgroundsize",b("backgroundSize","100%",!0)),Modernizr.addTest("borderimage",b("borderImage","url() 1",!0)),Modernizr.addTest("borderradius",b("borderRadius","0px",!0)),Modernizr.addTest("boxshadow",b("boxShadow","1px 1px",!0)),Modernizr.addTest("boxsizing",b("boxSizing","border-box",!0)&&(t.documentMode===n||t.documentMode>7)),function(){Modernizr.addTest("csscolumns",function(){var e=!1,t=b("columnCount");try{(e=!!t)&&(e=new Boolean(e))}catch(n){}return e});for(var e,t,n=["Width","Span","Fill","Gap","Rule","RuleColor","RuleStyle","RuleWidth","BreakBefore","BreakAfter","BreakInside"],r=0;r<n.length;r++)e=n[r].toLowerCase(),t=b("column"+n[r]),("breakbefore"===e||"breakafter"===e||"breakinside"==e)&&(t=t||b(n[r])),Modernizr.addTest("csscolumns."+e,t)}(),Modernizr.addTest("ellipsis",b("textOverflow","ellipsis")),Modernizr.addTest("cssfilters",function(){if(Modernizr.supports)return b("filter","blur(2px)");var e=o("a");return e.style.cssText=P.join("filter:blur(2px); "),!!e.style.length&&(t.documentMode===n||t.documentMode>9)}),Modernizr.addTest("flexbox",b("flexBasis","1px",!0)),Modernizr.addTest("flexboxlegacy",b("boxDirection","reverse",!0)),Modernizr.addTest("flexboxtweener",b("flexAlign","end",!0)),Modernizr.addTest("cssresize",b("resize","both",!0)),Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&b("transform","scale(1)",!0)}),Modernizr.addTest("csstransforms3d",function(){var e=!!b("perspective","1px",!0),t=Modernizr._config.usePrefixes;if(e&&(!t||"webkitPerspective"in C.style)){var n,r="#modernizr{width:0;height:0}";Modernizr.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}",R(r+n,function(t){e=7===t.offsetWidth&&18===t.offsetHeight})}return e}),Modernizr.addTest("csstransitions",b("transition","all",!0)),Modernizr.addTest("csspseudotransitions",function(){var t=!1;if(!Modernizr.csstransitions||!e.getComputedStyle)return t;var n='#modernizr:before { content:" "; font-size:5px;'+Modernizr._prefixes.join("transition:0s 100s;")+"}#modernizr.trigger:before { font-size:10px; }";return Modernizr.testStyles(n,function(n){e.getComputedStyle(n,":before").getPropertyValue("font-size"),n.className+="trigger",t="5px"===e.getComputedStyle(n,":before").getPropertyValue("font-size")}),t}),Modernizr.addTest("userselect",b("userSelect","none",!0)),a(),i(A),delete T.addTest,delete T.addAsyncTest;for(var F=0;F<Modernizr._q.length;F++)Modernizr._q[F]();e.Modernizr=Modernizr}(window,document);
