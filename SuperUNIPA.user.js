// ==UserScript==
// @name        SuperUNIPA
// @namespace   https://twitter.com/akameco
// @description あのうにぱを少しマシに
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/po/Poa00601A.jsp
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/co/*
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/sp/Spc00101A.jsp
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/km/*
// @include     https://portal.sa.dendai.ac.jp/up/faces/up/jg/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {

    // 要素を削除
    let removeElement = function(dom) {
      dom.parentNode.removeChild(dom);
    };

    let createElement = function(tag,attr,content) {
      let dom = document.createElement(tag);
      for (let key in attr) {
        dom.setAttribute(key,attr[key]);
      }
      if(content){
        dom.textContent = content;
      }
      return dom;
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

      // .linkMarkがあるか確認
      checkTd: function(td) {
        let marks = td.querySelectorAll('.linkMark');
        return marks.length;
      },

      setColum: function(a,i,j) {
        a.innerHTML.match(/;(.+?)&.+?【(.+?)】.*;(.+?)&/);
        let obj = {
          day: day[j],
          priod: i+1+'限',
          sub: RegExp.$1,
          name: RegExp.$2.replace(' ',''),
          place: RegExp.$3
        };
        if (a.innerHTML.match(/.*;(.+?).0単位/)){
          obj.credit = RegExp.$1 + '単位';
        }
        for (let key in obj) {
          console.log(obj[key]);
        }
        // a.innerHTML = obj.sub + ' ' +
        // obj.place + ' '+
        // obj.name + ' ' + 
        // (obj.credit ? obj.credit : '') ;
        a.innerHTML = obj.sub;
      },

      replaceVoid: function() {
        let as = document.getElementsByTagName('a');
        // console.log(as);
        for (let i=0; i < as.length; ++i) {
          // console.log(as[i]);
          if (as[i].getAttribute('href') == '#') {
            as[i].setAttribute('href','javascript:void(0)');
          }
        }
      },

      css: function() {
        let style="\
        td a{\
          font-size:16px;\
          display:block;\
          width:100%;\
          height:100%;\
        }\
        a:hover {\
          background-color:#ffcccc;\
        }\
        ";
        let head = document.getElementsByTagName('head')[0];
        let element = createElement('style',{type:'text/css'},style);
        head.appendChild(element);
      },

      getTimeTable: function() {
        let tbody = Unipa.tbody;
        for (let i=0,tbodyRen=tbody.length; i < tbodyRen; ++i) {
          let tr = tbody[i];
          for (let j=1,trRen=tr.children.length; j < trRen ; ++j) {
            let td = tr.children[j];
            let ren = Unipa.checkTd(td);
            let a = td.querySelectorAll('a');
            for (let x=0; x < ren; ++x) {
              if (a[x]) { Unipa.setColum(a[x],i,j); } 
            }
          }
        }
      },
      init: function() {
        Unipa.setTbody();
        Unipa.css();
      }
    };
    window.onload = function () {
      Unipa.init();
      // Unipa.check();
      Unipa.removeExtraTime();
      Unipa.removeSta();
      Unipa.setTbody();
      // Unipa.check();
      Unipa.getTimeTable();
      Unipa.replaceVoid();
    };
})();   
