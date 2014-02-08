// ==UserScript==
// @name        SuperUNIPA
// @namespace   https://twitter.com/akameco
// @description あのうにぱを少しマシに
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/po/Poa00601A.jsp
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/km/Kma00401A.jsp
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/co/Coa00201A.jsp
// @version     1
// @grant       none
// ==/UserScript==
(function() {

    // 要素を削除する関数
    let removeElement = function(dom) {
      dom.parentNode.removeChild(dom);
    };

    Unipa = {
      _tbody: null,
      get tbody(){
        return this._tbody;
      },
      setTbody: function() {
        this._tbody = document.querySelectorAll('tbody tr.tujoHeight');
      },
      removeExtraTime: function() {
        let tbody = Unipa.tbody;
        for (let i=5,ren=tbody.length; i < ren; ++i) {
          removeElement(tbody[i]);
        }
      },
      removeSta: function() {
        let tbody = Unipa.tbody;
        for (let i=0,ren=tbody.length; i < ren; ++i) {
          let tr = tbody[i];
          removeElement(tr.children[6]);
        }
        let date = document.querySelector('.linknormal thead tr');
        console.log(date.children);
        removeElement(date.children[6]);
      },
      check: function() {
        let tbody = Unipa.tbody;
        console.log(tbody);
        // for (let i=5,ren=tbody.length; i < ren; ++i) {
          // console.log(tbody[i]);
        // }
      },
      init: function() {
        Unipa.setTbody();
      }
    };
    window.onload = function () {
      Unipa.init();
      Unipa.check();
      Unipa.removeExtraTime();
      Unipa.removeSta();
    };
})(); 
