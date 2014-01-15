// ==UserScript==
// @name        Kasi-time
// @namespace   https://twitter.com/akameco
// @description 不可能を可能にする
// @include     http://www.kasi-time.com/*
// @version     1.00
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
  let element= document.querySelector(".mainkashi");
  // create range
  let rng = document.createRange();
  rng.selectNodeContents(element);
  // add range for the selected regions
  window.getSelection().addRange(rng);
}

function createCopyButton() {
  let button = document.createElement("button");
  button.innerHTML = "全て選択";
  button.addEventListener("click",function(){selectText()},false);
  let frame = document.querySelector("#kashi_flame");
  frame.appendChild(button);
}

window.onload = function () {
  setTimeout(function() {
    enableCopyText(); 
    createCopyButton();
  }, 10);
}  
