// ==UserScript==
// @name        Kasi-time
// @namespace   https://twitter.com/akameco
// @description 不可能を可能にする
// @include     http://www.kasi-time.com/*
// @version     1
// @grant       none
// ==/UserScript==

// enable focus text
function enableCopyText() {
  for (let i=0; i < document.body.attributes.length; ++i) {
    document.body.setAttribute(document.body.attributes[i].name,"return true");
  }
  document.getElementById("center").setAttribute("onmousedown","return true");
}

// select all textarea
function selectText() {
  var element= document.querySelector(".mainkashi");
  //var element= document.querySelector(document.body);
  // create range
  var rng = document.createRange();
  rng.selectNodeContents(element);
  // add range for the selected regions
  window.getSelection().addRange(rng);
}

function createCopyButton() {
  selectText();
}

window.onload = function () {
  setTimeout(function() {
    enableCopyText(); 
    createCopyButton();
  }, 10);
}  
