// ==UserScript==
// @name        TwitterProfileExtendFavstar
// @namespace   https://twitter.com/akameco
// @description TwitterのProfileにFavstarへのリンクを追加
// @include     https://twitter.com/*
// @version     1
// @grant       none
// ==/UserScript==

// ISSUE ブラウザのキャッシュのためリロードしないと読み込まれない
// XMLHttpRequestでHTTPリクエストを監視しそれをリスナーに対応付ける
window.onload = function () {
  // get twitter screen name + favstar url
  var getLink = function() {
    var username = document.querySelector(".username>.screen-name").innerHTML.slice(8);
    return 'http://ja.favstar.fm/users/' + username;
  }

  // create link 
  var createLink = function () {
    var a = document.createElement('a');
    var link = getLink();
    var linkText = document.createTextNode(link);
    a.appendChild(linkText);
    a.title = link;
    a.href = link;
    a.target = "_blank";
    var ele = document.querySelector('.profile-card-inner');
    ele.appendChild(a); 
  }
  createLink();
} 
