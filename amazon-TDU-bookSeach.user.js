// ==UserScript==
// @name        amazon-TDU-bookSeach
// @namespace   https://twitter.com/akameco
// @description AmazonとTDUMediaセンターの蔵書検索をリンク
// @author      akameco
// @include     http://www.amazon.co.jp/*
// @include     https://lib.mrcl.dendai.ac.jp/*
// @version     1.00
// @grant       none
// ==/UserScript==
(function () {

    // amazon内情報
    let amazon = {
      // 書籍情報のテキスト
      info: {
        get isbn(){
          // ASIN=isbn ASINの取得が容易
          document.body.parentNode.innerHTML.match(/name=\"ASIN\" value=\"([0-9A-Z]{10})([\/\-_a-zA-Z0-9]*)/i);
          return RegExp.$1;
        },
        get title(){
          return document.getElementById('btAsinTitle').textContent;
        },
        get press(){
          return undefined;
        },
        get price(){
          let text = document.querySelectorAll("#actualPriceValue .priceLarge")[0].textContent;
          // TODO:正規表現
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
        // TODO:状態が分かるようにアニメーションを追加
        loading: function() {
          let div = document.createElement('div');
          div.setAttribute('id','loading');
          div.textContent = "now loading...";
          let p = amazon.node.btAsinTitle;
          p.appendChild(div);
        },

        // ロード表示の削除 
        removeLoading: function() {
          let element = document.getElementById('loading');
          element.parentNode.removeChild(element);
        },

        // 購入依頼のリンク作成
        // TODO:フォームにamazonの情報をぶち込む
        orderLink: function() {
          let p = amazon.node.btAsinTitle;
          let link = "https://lib.mrcl.dendai.ac.jp/webopac/odridf.do?isbn=" + amazon.info.isbn;
          let a = neoCreate('a',{href:link},"購入依頼");
          p.appendChild(a);
        },

        // 各図書館の蔵書状況の表示
        libray: function(html) {
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
            if(library.state == "貸出中"){
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
      // css定義
      style: function() {
        let style = "\
        div#tdu_link{\
          background: #4169E1;\
          width: 180px;\
          display: table;\
          margin: 10px 5px;\
          padding: 5px 2px;\
        }\
        div#tdu_link a{\
          color: #D6FCFF;\
          margin: 10px 5px;\
          font-size: 14px;\
        }\
        div#tdu_link a:hover{\
          color: #6A5ACD;\
        }\
        ";
        let head = document.getElementsByTagName('head')[0];
        let element = window.document.createElement('style');
        element.type = "text/css";
        element.textContent = style;
        head.appendChild(element);
      }
    } 

    let checkHost = {
      "www.amazon.co.jp": function () {
        // カテゴリのチェック
        if(!checkCategory())
          return;
        if(amazon.info.isbn){
          let text = getBookData();
          //addStyle();
          amazon.disp.link();
          console.log(amazon.info.isbn);
          console.log(amazon.info.title);
          console.log(amazon.info.price);
          amazon.disp.loading();
        }
      },
      "lib.mrcl.dendai.ac.jp": function () {
        let loginButton = null;
        let pass=false;
        let form = document.forms[0];
        form.setAttribute("autocomplete","on");
        for (let i=0; formElement=form.getElementsByTagName("input")[i]; ++i){
          if(formElement.type == "password" && formElement.value){
            pass = true; 
            break;
          }
        }
        for (let i=0; formElement=form.getElementsByTagName("input")[i]; ++i){
          if (formElement.type == "image" && pass) {
            loginButton = formElement;
            break;
          }
        }
        if(loginButton){
          loginButton.focus();
          loginButton.click();
        }
      }
    }

    // 非同期通信により蔵書情報取得
    function getBookData() {
      let request = new XMLHttpRequest();
      let link = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=' + amazon.info.isbn;
      // 一度allow-any-originを噛ませることでクロスドメイン制限対策
      request.open('GET','http://allow-any-origin.appspot.com/' + link,true);
      request.send(); 
      request.onload = function () {
        // ロード状態の解除
        amazon.disp.removeLoading();
        // htmlをパースして情報を取得
        parseHtml(request.responseText);
      }
    }

    // カテゴリが合っているか確認
    function checkCategory() {
      let category = document.querySelector('.nav-category-button').firstChild.innerHTML;
      if(category == '本'){
        return true;
      }
      return false;
    }

    // エレメント作成
    function neoCreate(tag,attr,content) {
      let dom = document.createElement(tag);
      for (let key in attr) {
        dom.setAttribute(key,attr[key]);
      }
      if(content){
        dom.textContent = content;
      }
      return dom;
    }

    // 一度divに変換しないとdom操作ができない
    function parseHtml(res) {
      let div = document.createElement('div');
      div.innerHTML = res;
      hasBook(div);
    }

    // 蔵書のページ確認
    function hasBook(html) {
      let element = html.querySelector('.flst_head');
      element != null ? amazon.disp.libray(html) : amazon.disp.orderLink();
    }

    window.onload = function () {
      let host = location.host;
      checkHost[host]();
    }
})(); 
