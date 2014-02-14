// ==UserScript==
// @name        Google1YearShow
// @namespace   https://twitter.com/akameco
// @description 検索ツールの期間1年を表示
// @include     https://www.google.co.jp/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==
(function($) {

    let google = {
      isYear: function() {
        return document.URL.match(/tbs=qdr:y/) ? true : false;
      },
      
      createLink: function(url, text) {
        $('#appbar').after('<div id="gmyear"><a href=' + url + '>' + text + '</a></div>');
        let $gmyear = $('#gmyear');
        $('#gmyear a').css({
            'color': '#999999',
            'display':'block',
            'margin': '10px 6px 0 135px'});
        // 'margin': '10px 6px 0 135px'})
        // .hover(function() {
        // $(this).css('color': 'black');
        // },function() {
        // $(this).css('color': '#999999');
        // });   
      }
    };

    $(document).ready(function() {
        let url = document.URL;
        if (google.isYear()) {
          google.createLink(url.replace(/&tbs=qdr:y/,'&tbs=0'),'期間指定なし');
        } else {
          url = url.match(/&tbs=0/) ? url.replace(/&tbs=0/,'&tbs=qdr:y') : url + '&tbs=qdr:y';
          google.createLink(url,'一年以内');
        }
    });
})(jQuery);
 
