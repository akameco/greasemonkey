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
var baseURL = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?';

window.onload = function () {
  main();
}

// main関数
function main() {
  if(checkCategory()){
    createLink();
  }
  let href = document.location.href;
  addStyle();
  create();
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
function createLink() {
  //form#handleBuy div.buying
  //html body.dp div#divsinglecolumnminwidth.singlecolumnminwidth
  let div = document.createElement('div');
  div.setAttribute('id','tdu_link');
  let link = document.createElement('a');
  //link.setAttribute('href', "http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=4774158798");
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

function create() {
  // テスト用のURL
  var url = "http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=4774158798"
  var xhr = new XMLHttpRequest();
  // テスト用のパラメータ
  var str = "isbn_issn=978-4062187640";

  //xhr.open( 'GET', baseURL+str);
  xhr.open('GET',url,true);

  try{
    xhr.onreadystatechange = function () {
      //TODO:statusがどうしても0になる
      //ローカルを参照してるっぽい？キャッシュ対策が必要？
      if(xhr.readyState == 4  && xhr.status == 200){
        alert("ok");
      }
    }
    xhr.send(null);
  }catch(err){
    alert(err);
  }

  // データをリクエスト ボディに含めて送信する
  console.log(xhr.responseText);
  console.log(xhr);
}

function addLibraryLinksToBookPage(isbn){
  // linkの表示場所の起点とするノードを取得
  let btAsinTitleDiv = parent.document.getElementById('btAsinTitle');
  if (btAsinTitleDiv) {
    let div = btAsinTitleDiv.parentNode;
  }
}
// isbn
function getIsbn() {

}
 
