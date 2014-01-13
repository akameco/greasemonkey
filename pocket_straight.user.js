// ==UserScript==
// @name        pocket_straight
// @namespace   https://twitter.com/akameco
// @description auto click submit
// @include     https://getpocket.com/edit?url=*
// @version     1.0
// @grant       none
// ==/UserScript==

function submit_form() {
  var submit;
  for(var input, i=0; input = document.getElementsByTagName("input")[i]; i++){
    if(input.type == "submit"){
      submit = input;
      break;
    }
  }
  submit.click(); 
  // リダイレクトがうざいので0.1秒経過後自動で閉じる
  // TODO:formを操作するのではなくhttpリクエスト に対応させたい
  setTimeout(function() { window.close(); }, 100);
}
window.onload = function () {
  setTimeout(function() {
    submit_form()
  }, 10);
}
