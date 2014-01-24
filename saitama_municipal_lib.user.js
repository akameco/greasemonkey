// ==UserScript==
// @name          Saitama Prefectural Library Lookup from Amazon book listings.
// @namespace     http://www.amazon.co.jp
// @description   Saitama Prefectural Library Lookup from Amazon book listings.
// @include       http://*.amazon.*
// ==/UserScript==

// Version 20070430

libsearch(
  'http://www2.lib.city.saitama.jp/STCLIB/servlet/search.result?code_genre1=2&code_value1=',
  '&#x3055;&#x3044;&#x305F;&#x307e;&#x5e02;&#x56F3;&#x66F8;&#x9928;'
);

function libsearch( api, title ) {
  // get ISB10
  document.body.parentNode.innerHTML.match( /\s(4(\d{8}|-[\d-]{9}-)[\dX])/ );
  var isbn = '';
  if ( RegExp.$1!='' ) {
    isbn = RegExp.$1

  // get ISB13
  } else {
    document.body.parentNode.innerHTML.match( /\s(978\-4(\d{8}|-[\d-]{9}-)[\dX])/ );
    if ( RegExp.$1!='' ) {
      isbn = RegExp.$1
    }
  }

  // check library
  var header = document.evaluate( "//b[@class='sans']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
  if ( header ) {
    if ( isbn ) {
      checkLibrary( api, title, isbn, header );
    } else {
      makelink( api, title, '', header, 0 );
    }
  }
}

function checkLibrary( api, title, isbn, header ) {
  GM_xmlhttpRequest(
    {
      method  : "GET",
      url     : api + isbn ,
      headers : {
                  'User-Agent'  : 'Mozilla/4.0 (compatible) Greasemonkey',
                  'Content-type': 'application/x-www-form-urlencoded'
                },
      onload  : function( response ) {
                  makelink( api, title, isbn, header, response.responseText.match(/detail_list/i) );
                }
    }
  );
}

function makelink( api, title, isbn, header, foungflg ) {
  var msg = ( foungflg ) ? '<b>&#x2605;&#x8535;&#x66f8;&#x3042;&#x308A;&#x2605;</b>' : '<b>&#x8535;&#x66f8;&#x306A;&#x3057;...</b>';
  var spl_link = document.createElement( 'a' );
  spl_link.setAttribute( 'target', '_blank' );
  spl_link.setAttribute( 'href', api + isbn );
  spl_link.setAttribute( 'title', 'To Saitama Municipal Library' );
  spl_link.innerHTML = '<br /><span style=\"font-size:14px; color:#ffffff; background-color:#ff0000;\"> &raquo; [' + msg + '] ' + title + '&#x3067;&#x691C;&#x7D22; </span>';
  header.parentNode.insertBefore( spl_link, header.nextSibling );
}

