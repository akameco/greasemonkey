// ==UserScript==
// @name        amazon-TDU-bookSeach
// @namespace   https://twitter.com/akameco
// @description AmazonとTDUMediaセンターの蔵書検索をリンク
// @author      akameco
// @include     http://www.amazon.co.jp/*
// @version     1.00
// @grant       none
// ==/UserScript==

window.onload = function () {
  // カテゴリのチェック
  if(!checkCategory())
    return;
  let isbn = getIsbn();
  // 取得確認
  if(isbn){
    let text = getBookData(isbn);
    createLink(isbn);
    loading();
    //  addStyle();
  }
}

// isbnを取得
function getIsbn() {
  // ASIN=isbn ASINの取得が容易
  document.body.parentNode.innerHTML.match(/name=\"ASIN\" value=\"([0-9A-Z]{10})([\/\-_a-zA-Z0-9]*)/i);
  //var asin = RegExp.$1; 
  return RegExp.$1;
}

// 非同期通信により蔵書情報取得
function getBookData(isbn) {
  let request = new XMLHttpRequest();
  let link = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=' + isbn;
  // 一度allow-any-originを噛ませることでクロスドメイン制限対策
  request.open('GET','http://allow-any-origin.appspot.com/' + link,true);
  request.send(); 
  request.onload = function () {
    // htmlをパースして情報を取得
    parseHtml(request.responseText);
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

// 図書館へのリンク
function createLink(isbn) {
  let div = neoCreate('div',{id:'tdu_link'});
  let link = neoCreate('a',
    {
      href:"http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=" + isbn,
      target: '_blank'
    },
    "図書館検索"
  );
  let p = parent.document.getElementById('btAsinTitle').parentNode;
  div.appendChild(link);
  p.appendChild(div);
}


// エレメント作成
function neoCreate(tag,attr,content) {
  var dom = document.createElement(tag);
  for (var key in attr) {
    dom.setAttribute(key,attr[key]);
  }
  if(content){
    dom.textContent = content;
  }
  return dom;
}

// ロード状態の表示
function loading() {
  let div = document.createElement('div');
  div.setAttribute('id','loading');
  div.textContent = "now loading...";
  let p = parent.document.getElementById('btAsinTitle').parentNode;
  p.appendChild(div);
}

// ロード表示の削除 
function removeLoading() {
  let element = document.getElementById('loading');
  element.parentNode.removeChild(element);
}

// 
function parseHtml(res) {
  let div = document.createElement('div');
  div.innerHTML = res;
  getObj(div);
}

// 状態の表示
function getObj(html) {
  removeLoading();
  let div = document.createElement('div');
  div.setAttribute('id','tduBooks');
  // 要素の調査
  let tbody = html.querySelectorAll('.flst_head')[0].parentNode;
  for (let i=1; i < tbody.children.length; ++i) {
    let element = document.createElement('div');
    let tr = tbody.children[i];
    // 所蔵館
    let plase = tr.children[3].firstChild.firstChild.nodeValue;
    console.log(plase);
    // 状態
    let state = tr.children[8].firstChild.firstChild.nodeValue;
    console.log(state);
    // 返却期限日
    // 配架済 or 貸出中
    if(state == "貸出中"){
      let priod = tr.children[9].firstChild.firstChild.nodeValue;
      console.log(priod);
      element.innerHTML = plase + ":" + state + ":" + priod;
    }else{
      element.innerHTML = plase + ":" + state;
    }
    div.appendChild(element);
  }
  let p = parent.document.getElementById('btAsinTitle').parentNode;
  p.appendChild(div);
} 
