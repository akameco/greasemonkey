// ==UserScript==
// @name        UnipaSkip
// @namespace   https://twitter.com/akameco
// @description 自動ログイン
// @include     https://portal.sa.dendai.ac.jp/up/faces/login/Com00505A.jsp
// @version     1
// @grant       none
// ==/UserScript==

function loginUnipa() {
  var loginButton = null;
  // forms has only 1  
  var form = document.forms[0];
  // set autocomplete ON
  form.setAttribute("autocomplete","on");

  // look for input type=image
  for (j=0; formElement=form.getElementsByTagName("input")[j]; ++j){
    if (formElement.type == "image") {
      loginButton = formElement;
      break;
    }
  }

  if(loginButton){
    loginButton.focus();
    loginButton.click();
  }
}

window.onload = function () {
  setTimeout(function() {
    loginUnipa();
  }, 10);
}
