// ==UserScript==
// @name        Amalib_TDU
// @namespace   https://twitter.com/akameco
// @description 図書館乞食捗るよ！
// @author      akameco
// @include     http://www.amazon.co.jp/*
// @include     http://lib.mrcl.dendai.ac.jp/*
// @include     https://lib.mrcl.dendai.ac.jp/*
// @version     1.00
// @grant       none
// ==/UserScript==
(function () {
    // エレメント作成用ユーティリティ関数
    var neoCreate = function(tag,attr,content) {
      let dom = document.createElement(tag);
      for (let key in attr) {
        dom.setAttribute(key,attr[key]);
      }
      if(content){
        dom.textContent = content;
      }
      return dom;
    };

    // amazon
    let amazon = {
      // 書籍情報のテキスト
      info: {
        get isbn(){
          // ASIN=isbn ASINの取得が容易
          document.body.parentNode.innerHTML.match(/name=\"ASIN\" value=\"([0-9A-Z]{10})([\/\-_a-zA-Z0-9]*)/i);
          return RegExp.$1;
        },
        get title(){
          return document.getElementById('btAsinTitle').firstChild.textContent;
        },
        get press(){
          let e = document.body.innerHTML.match(/出版社:<\/b> (.+?)\(/);
          return RegExp.$1;
        },
        get price(){
          let text = document.querySelectorAll("#actualPriceValue .priceLarge")[0].textContent;
          return text.replace(/￥ /,"").replace("\n","").replace(",","");
        }
      },

      // ノードの特定
      node: {
        get btAsinTitle(){
          return document.getElementById('btAsinTitle').parentNode;
        }
      },

      // 表示
      disp: {
        // 図書館へのリンク
        link: function() {
          let div = neoCreate('div',{id:'tdu_link'});
          let link = neoCreate('a',
            {
              href:"http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=" + amazon.info.isbn,
              target: '_blank'
            },
            "図書館検索"
          );
          let p = amazon.node.btAsinTitle;
          div.appendChild(link);
          p.appendChild(div);
        },

        // ロード状態の表示
        loading: function() {
          let div = document.createElement('div');
          div.setAttribute('id','loading');
          div.textContent = "NOW LOADING...";
          let p = amazon.node.btAsinTitle;
          p.appendChild(div);
        },

        // ロード表示の削除 
        removeLoading: function() {
          let element = document.getElementById('loading');
          element.parentNode.removeChild(element);
        },

        // 購入依頼のリンク作成
        orderLink: function() {
          let p = amazon.node.btAsinTitle;
          let link = "https://lib.mrcl.dendai.ac.jp/webopac/odridf.do?isbn=" + amazon.info.isbn + "&title=" + encodeURIComponent(amazon.info.title) + "&press=" + encodeURIComponent(amazon.info.press) + "&price=" + amazon.info.price;

          let a = neoCreate('a',{href: link},"購入依頼");
          p.appendChild(a);
        },
        // 自大学の場所をカラーリング
        get home(){
          //let plase = ['千住','鳩山','千葉'];
          return '千住';
        }, 
        // 各図書館の蔵書状況の表示
        library: function(html) {
          let div = neoCreate('div',{id:'tduBooks'});
          // 要素の調査
          let tbody = html.querySelectorAll('.flst_head')[0].parentNode;
          for (let i=1; i < tbody.children.length; ++i) {
            let element = neoCreate('div');
            let tr = tbody.children[i];
            // 所蔵館・状態・返却期限日(配架済 or 貸出中)
            let library = {
              plase: tr.children[3].firstChild.firstChild.nodeValue,
              state: tr.children[8].firstChild.firstChild.nodeValue,
              priod: tr.children[9].firstChild.firstChild.nodeValue
            }
            console.log(library.plase);
            if(library.plase == amazon.disp.home)
              element.setAttribute('id','myhome');
            if(library.state == '貸出中'){
              element.innerHTML = library.plase + " " + library.state + " " + "返却期限 " + library.priod;
            }else{
              element.innerHTML = library.plase + " " + library.state;
            }
            div.appendChild(element);
          }
          let p = amazon.node.btAsinTitle;
          p.appendChild(div);
        }
      },

      // カテゴリ確認
      category: function() {
        let category = document.querySelector('.nav-category-button').firstChild.innerHTML;
        if(category == '本'){
          return true;
        }
        return false;
      },

      // 蔵書のページ確認
      page: function (res) {
        // 一度ノードに変換しないとdom操作ができない
        let html = document.createElement('div');
        html.innerHTML = res;
        let element = html.querySelector('.flst_head');
        element != null ? amazon.disp.library(html) : amazon.disp.orderLink();
      },

      // 非同期通信により蔵書情報取得
      getLib: function () {
        let request = new XMLHttpRequest();
        let link = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=' + amazon.info.isbn;
        // 一度allow-any-originを噛ませることでクロスドメイン制限対策
        request.open('GET','http://allow-any-origin.appspot.com/' + link,true);
        request.send(); 
        request.onload = function () {
          // ロード状態の解除
          amazon.disp.removeLoading();
          // htmlをパースして情報を取得
          amazon.page(request.responseText);
        }
      },

      // css定義
      style: function() {
        let style = "\
        #tduBooks{\
          background: none;\
          color: #666;\
          font-size: 16px;\
          display:table;\
          margin: 0 15px 0;\
        }\
        #tduBooks div{\
          margin: 0px 15px;\
        }\
        div#tdu_link{\
          display: table;\
          margin: 2px 0 2px;\
        }\
        div#tdu_link a{\
          margin: 10px 5px;\
          font-size: 16px;\
        }\
        #loading{\
          display: table;\
          font-size: 16px;\
          color: #666;\
          margin: 0px 15px;\
        }\
        #myhome {\
          color:#009900;\
          font-weight: bold;\
        }\
        ";
        let head = document.getElementsByTagName('head')[0];
        let element = window.document.createElement('style');
        element.type = "text/css";
        element.textContent = style;
        head.appendChild(element);
      },

      open: function () {
        // カテゴリのチェック
        if(!amazon.category())
          return;
        if(amazon.info.isbn){
          amazon.getLib();
          amazon.disp.link();
          amazon.disp.loading();
          amazon.style();
        }
      }
    } 

    // 図書館用
    let library = {
      open: function () {
        let loginbutton = null;
        let pass=false;
        let form = document.forms[0];
        form.setAttribute("autocomplete","on");
        for (let j=0; formelement=form.getElementsByTagName("input")[j]; ++j){
          if(formelement.type == "password" && formelement.value){
            pass = true; 
            break;
          }
        }
        for (let j=0; formelement=form.getElementsByTagName("input")[j]; ++j){
          if (formelement.type == "image" && pass) {
            loginbutton = formelement;
            break;
          }
        }
        if(loginbutton){
          loginbutton.focus();
          loginbutton.click();
        }
      },
      get path() {
        return window.location.pathname;
      },
      get search(){
        if(1 < document.location.search.length){
          let parameters = document.location.search.substring(1).split('&');
          var result = new Object();
          for (let i=0; i < parameters.length; ++i) {
            let element = parameters[i].split('=');
            result[decodeURIComponent(element[0])] = decodeURIComponent(element[1]);
          }
          return result;
        }
        return null;
      },
      input: function () {
        let tds = document.querySelectorAll('table.opt_frame tbody tr td input');
        let values = {
          "bibtr": library.search['title'],
          "bibpb": library.search['press'],
          "isbn": library.search['isbn'],
          "bibpr": library.search['price']
        };
        for (let i=0; i < tds.length; ++i) {
          let td = tds[i].getAttribute('name');
          for(let name in values)
            if(td == name)
            tds[i].value = values[name];
        }
      },

      // pathごとにメソッドの起動を変える
      init: {
        "/webopac/ctlsrh.do": function () {

        },
        "/webopac/odridf.do": function () {
          library.input();
        },
        "/webopac/odrexm.do": function () {
          library.open();
        }
      }
    };

    // urlを確認
    let checkHost = {
      "www.amazon.co.jp": function () {
        amazon.open();
      },
      "lib.mrcl.dendai.ac.jp": function () {
        library.init[library.path]();
      }       
    }

    window.onload = function () {
      let host = location.host;
      checkHost[host]();
    }
})();
