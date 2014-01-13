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
}
window.onload = function () {
  setTimeout(function() {
    submit_form()
  }, 10);
}
