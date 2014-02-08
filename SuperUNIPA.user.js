// ==UserScript==
// @name        SuperUNIPA
// @namespace   https://twitter.com/akameco
// @description あのうにぱを少しマシに
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/po/Poa00601A.jsp
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/km/Kma00401A.jsp
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/co/Coa00201A.jsp
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/sp/Spc00101A.jsp
// @version     1
// @grant       none
// ==/UserScript==

(function() {

    // 要素を削除
    let removeElement = function(dom) {
      dom.parentNode.removeChild(dom);
    };
    // 曜日
    let day = {
      1: '月',
      2: '火',
      3: '水',
      4: '木',
      5: '金'
    };

    // うにぱオブジェクト
    Unipa = {
      // domへのアクセスは一度だけ
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
        removeElement(date.children[6]);
      },
      getTimeTable: function() {
        let tbody = Unipa.tbody;
        for (let i=0,ren=tbody.length; i < ren; ++i) {
          let tr = tbody[i];
          for (let j=1,renj=tr.children.length; j < renj ; ++j) {
            let td = tr.children[j];
            let a = td.querySelector('a');
            if (a) {
              a.innerHTML.match(/;(.+?)&.+?【(.+?)】.*;(.+?)&.*;(.+?).0単位/);
              let obj = {
                day: day[j],
                priod: i+1+'限',
                sub: RegExp.$1,
                name: RegExp.$2,
                place: RegExp.$3,
                credit: RegExp.$4 + '単位'
              };
              for (let key in obj) {
                console.log(obj[key]);
              }
              a.innerHTML = obj.sub + ' ' +
                            obj.name + ' ' + 
                            obj.place + ' '+
                            obj.credit;
            }
          }
        }
      },
      // デバック用
      check: function() {
        let tbody = Unipa.tbody;
        console.log(tbody);
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
      Unipa.setTbody();
      Unipa.check();
      Unipa.getTimeTable();
    };
})(); 
