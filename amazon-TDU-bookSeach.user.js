// ==UserScript==
// @name        amazon-TDU-bookSeach
// @namespace   https://twitter.com/akameco
// @description AmazonとTDUMediaセンターの蔵書検索をリンク
// @author      akameco
// @include     http://www.amazon.co.jp/*
// @version     1.00
// @grant       none
// ==/UserScript==


// TODO:ibsnを利用

// tduオブジェクトを定義
var tdu = tdu ? tdu : new Object();
// とりあえず簡易検索ページへのリンク
tdu.mediacenter = 'http://lib.mrcl.dendai.ac.jp/wwwopac.html';


window.onload = function () {
  main();
}

// main関数
function main() {
  console.log(tdu.mediacenter);
  if(checkCategory()){
    createLink();
  }
  var href = document.location.href;
  addStyle();
}

// css定義
// TODO:スタイルをサイトに合うように
function addStyle() {
  var style = "\
  div#tdu_link{\
    background: #4169E1;\
    width: 180px;\
    display: table;\
    margin: 10px 5px;\
    padding: 5px 2px;\
  }\
  div#tdu_link a{\
    background:#4169E1;\
    color: #1E90FF;\
    margin: 10px 5px;\
    font-size: 14px;\
  }\
  div#tdu_link a:hover{\
    color: #6A5ACD;\
  }\
  ";
  var head = document.getElementsByTagName('head')[0];
  var element = head.appendChild(window.document.createElement('style'));
  element.type = "text/css";
  element.textContent = style;
}

// カテゴリが合っているか確認
// TODO:カテゴリチェックをurlでする関数に変更
function checkCategory() {
  var category = document.querySelector('.nav-category-button').firstChild.innerHTML;
  if(category == '本'){
    return true;
  }
  return false;
}

// createelement
function createLink() {
  var div = document.createElement('div');
  div.setAttribute('id','tdu_link');
  var link = document.createElement('a');
  link.setAttribute('href','http://lib.mrcl.dendai.ac.jp/wwwopac.html');
  link.setAttribute('target','_blank');
  link.textContent = 'メディセン検索するのんな';
  link.addEventListener("click",showLink,false);
  var p = document.querySelectorAll('.buying')[1];
  div.appendChild(link);
  p.appendChild(div);
}

// TODO:蔵書ごとにlinkをつくる
function showLink() {
} 

