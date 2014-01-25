// ==UserScript==
// @name        amazon-TDU-bookSeach
// @namespace   https://twitter.com/akameco
// @description AmazonとTDUMediaセンターの蔵書検索をリンク
// @author      akameco
// @include     http://www.amazon.co.jp/*
// @version     1.00
// @grant       none
// ==/UserScript==

// ベースURL
//var baseURL = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?';

window.onload = function () {
  // カテゴリのチェック
  if(!checkCategory())
    return;
  var isbn = getIsbn();
  // 取得確認
  if(isbn){
    getBookData(isbn);
    createLink(isbn);
    addStyle();
  }
}

function getIsbn() {
  // HTMLでなければ終了
  //if(document.contentType != 'text/html')
  //  return;
  // ASINを見つけるよ
  document.body.parentNode.innerHTML.match(/name=\"ASIN\" value=\"([0-9A-Z]{10})([\/\-_a-zA-Z0-9]*)/i);
  // ASINが見つからなければ終了
  if (RegExp.$1 == '')
    return;
  // asinを変数に代入
  var asin = RegExp.$1; 
  return asin;
}

function getBookData(isbn) {
  let request = new XMLHttpRequest();
  let link = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=' + isbn;
  console.log(link);
  request.open('GET','http://allow-any-origin.appspot.com/' + link,true);
  request.send(); 
  if (request.status === 200) {
    console.log(request.responseText);
  }
}

// css定義
// TODO:スタイルをサイトに合うように
function addStyle() {
  let style = "\
  div#tdu_link{\
    background: #4169E1;\
    width: 180px;\
    display: table;\
    margin: 10px 5px;\
    padding: 5px 2px;\
  }\
  div#tdu_link a{\
    color: #D6FCFF;\
    margin: 10px 5px;\
    font-size: 14px;\
  }\
  div#tdu_link a:hover{\
    color: #6A5ACD;\
  }\
  ";
  let head = document.getElementsByTagName('head')[0];
  let element = head.appendChild(window.document.createElement('style'));
  element.type = "text/css";
  element.textContent = style;
}

// カテゴリが合っているか確認
// TODO:カテゴリチェックをurlでする関数に変更
function checkCategory() {
  let category = document.querySelector('.nav-category-button').firstChild.innerHTML;
  if(category == '本'){
    return true;
  }
  return false;
}

// createelement
function createLink(isbn) {
  let div = document.createElement('div');
  div.setAttribute('id','tdu_link');
  let link = document.createElement('a');
  link.setAttribute('href', "http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=" + isbn);
  link.setAttribute('target','_blank');
  link.textContent = 'メディセン検索するのんな';
  link.addEventListener("click",showLink,false);
  // linkの表示場所の起点とするノードを取得
  let btAsinTitleDiv = parent.document.getElementById('btAsinTitle');
  let p = btAsinTitleDiv.parentNode;
  div.appendChild(link);
  p.appendChild(div);
}

// TODO:蔵書ごとにlinkをつくる
function showLink() {
} 

//function create() {
//  var url = "http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?"
//  //isbn_issn=4774158798
//  //var xhr = new XMLHttpRequest();
//  //var google = "https://www.google.co.jp/";
//  //var str = "isbn_issn=978-4774158792";
//  //var time = new Date().getTime();
//  //var url = baseURL + str + "&t=" + time;
//
//}

function addLibraryLinksToBookPage(isbn){
  // linkの表示場所の起点とするノードを取得
  let btAsinTitleDiv = parent.document.getElementById('btAsinTitle');
  if (btAsinTitleDiv) {
    let div = btAsinTitleDiv.parentNode;
  }
} 
