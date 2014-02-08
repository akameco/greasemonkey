// ==UserScript==
// @name        SEIFUKU
// @namespace   https://twitter.com/akameco
// @description 我らがズヴィズダーの光を、あまねく世界に
// @include     http://www.nicovideo.jp/watch/*
// @version     1
// @grant       none
// ==/UserScript==
(function() {
    // 要素作成
    let createElement = function(tag,attr,content){
      let dom = document.createElement(tag);
      for (let key in attr) {
        dom.setAttribute(key,attr[key]);
      }
      if(content){
        dom.textContent = content;
      }
      return dom;
    };

    let Nico = {
      // setButton 
      setButton: function () {
        console.log("test");
        let button = createElement('a',{id:'seifuku_button'},'征服');
        let p = document.getElementById('videoHeaderTagList').parent;
        console.log(p);
        p.appendChild(button);
        console.log(button);
      },
      // ボタンが押された時のアニメーション
      animetion: function () {
      }
    };
    try{
      window.onload = function() {
        Nico.setButton();
      };
    }catch(err){
      console.log(err);
    }
})(); 
