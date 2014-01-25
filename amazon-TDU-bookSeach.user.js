// ==UserScript==
// @name        amazon-TDU-bookSeach
// @namespace   https://twitter.com/akameco
// @description AmazonとTDUMediaセンターの蔵書検索をリンク
// @author      akameco
// @include     http://www.amazon.co.jp/*
// @include     https://lib.mrcl.dendai.ac.jp/webopac/odrexm.do
// @version     1.00
// @grant       none
// ==/UserScript==

window.onload = function () {
  var host = location.host;
  checkHost[host]();
}

var checkHost = {
  "www.amazon.co.jp": function () {
    // カテゴリのチェック
    if(!checkCategory())
      return;
    var isbn = getIsbn();
    if(isbn){
      var text = getBookData(isbn);
      createLink(isbn);
      loading();
      //  addStyle();
    }
  },
  "lib.mrcl.dendai.ac.jp": function () {
    var loginButton = null;
    var pass=false;
    var form = document.forms[0];
    form.setAttribute("autocomplete","on");
    if(document.querySelectorAll('.err_cmt').length == 1) {
      return;
    }
    for (let i=0; formElement=form.getElementsByTagName("input")[i]; ++i){
      if(formElement.type == "password" && formElement.value){
        pass = true; 
        break;
      }
    }
    for (let i=0; formElement=form.getElementsByTagName("input")[i]; ++i){
      if (formElement.type == "image" && pass) {
        loginButton = formElement;
        break;
      }
    }
    if(loginButton){
      loginButton.focus();
      loginButton.click();
    }
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
  var request = new XMLHttpRequest();
  var link = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=' + isbn;
  // 一度allow-any-originを噛ませることでクロスドメイン制限対策
  request.open('GET','http://allow-any-origin.appspot.com/' + link,true);
  request.send(); 
  request.onload = function () {
    // htmlをパースして情報を取得
    parseHtml(request.responseText);
  }
}

// カテゴリが合っているか確認
function checkCategory() {
  var category = document.querySelector('.nav-category-button').firstChild.innerHTML;
  if(category == '本'){
    return true;
  }
  return false;
}

// 図書館へのリンク
function createLink(isbn) {
  var div = neoCreate('div',{id:'tdu_link'});
  var link = neoCreate('a',
    {
      href:"http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=" + isbn,
      target: '_blank'
    },
    "図書館検索"
  );
  var p = parent.document.getElementById('btAsinTitle').parentNode;
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
  var div = document.createElement('div');
  div.setAttribute('id','loading');
  div.textContent = "now loading...";
  var p = parent.document.getElementById('btAsinTitle').parentNode;
  p.appendChild(div);
}

// ロード表示の削除 
function removeLoading() {
  var element = document.getElementById('loading');
  element.parentNode.removeChild(element);
}

// 
function parseHtml(res) {
  var div = document.createElement('div');
  div.innerHTML = res;
  getObj(div);
}

// 状態の表示
function getObj(html) {
  removeLoading();
  var div = document.createElement('div');
  div.setAttribute('id','tduBooks');
  // 要素の調査
  var tbody = html.querySelectorAll('.flst_head')[0].parentNode;
  for (let i=1; i < tbody.children.length; ++i) {
    var element = document.createElement('div');
    var tr = tbody.children[i];
    // 所蔵館・状態・返却期限日(配架済 or 貸出中)
    var library = {
      plase: tr.children[3].firstChild.firstChild.nodeValue,
      state: tr.children[8].firstChild.firstChild.nodeValue,
      priod: tr.children[9].firstChild.firstChild.nodeValue
    }
    if(library.state == "貸出中"){
      element.innerHTML = library.plase + " " + library.state + " " + "返却期限 " + library.priod;
    }else{
      element.innerHTML = library.plase + " " + library.state;
    }
    div.appendChild(element);
  }
  var p = parent.document.getElementById('btAsinTitle').parentNode;
  p.appendChild(div);
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
    color: #D6FCFF;\
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
