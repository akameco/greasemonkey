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

    /*
     * ユーティリティ関数
     */
    // エレメント作成
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
    // パラメータ登録
    let setParam = function(name,value) {  
      let input = createElement('input',{
          "name": name,
          "value": value
      });
      return input;
    };

    /*
     * amazon
     */
    let amazon = {
      info: {
        _isbn: '',
        _title: '',
        _press: '',
        _response: '',
        _btAsinTitle: '',
        _res: null,
        setIsbn: function () {
          document.body.parentNode.innerHTML.match(/name=\"ASIN\" value=\"([0-9A-Z]{10})([\/\-_a-zA-Z0-9]*)/i);
          this._isbn = RegExp.$1;
        },
        get isbn() {
          return this._isbn;
        },
        setTitle: function() {
          this._title = document.getElementById('btAsinTitle').firstChild.textContent;
        },
        get title() {
          return this._title;
        },
        setPress: function() {
          document.body.innerHTML.match(/出版社:<\/b> (.+?)\(/);
          this._press = RegExp.$1;
        },
        get press() {
          return this._press;
        },
        setPrice: function() {
          let text = document.querySelectorAll('#actualPriceValue .priceLarge')[0].textContent;
          this._price = text.replace(/￥ /,"").replace("\n","").replace(",","");
        },
        get price() {
          return this._price; 
        },
        setBtAsinTitle: function() {
          this._btAsinTitle = document.getElementById('btAsinTitle').parentNode;

        },
        get btAsinTitle() {
          return this._btAsinTitle;
        },
        setRes: function(response) {
          // 一度ノードに変換しないとdom操作ができない
          let html = document.createElement('div');
          html.innerHTML = response;
          this._res = html;
        },
        get res() {
          return this._res;
        }
      },

      /*
       * 初期化
       */
      init: function() {
        amazon.info.setIsbn();
        amazon.info.setTitle();
        amazon.info.setPress();
        amazon.info.setPrice();
        amazon.info.setBtAsinTitle();
      },

      // 図書館情報
      library: {
        // 自大学の場所だけカラーリングを設定
        setPlace: function() {
          localStorage.removeItem('place');
          let places = ['千住','千葉','鳩山'];
          if(localStorage.getItem('place') == null){
            let div = createElement('div',{id:'selectLib'});
            // TODO: 文章の作成
            let text = createElement('div',{id: 'readme'},
              'インストール感謝なのです。' + 
              'このプラグインはアマゾンと図書館を連携し便利に\n' +
              'ここに文章をいれよう！\n' +
              'まず自分が通っている大学の場所を設定してね\n' +
              '何か不具合が合ったら赤芽まで\n'
              );
            for (let i=0; i < places.length; ++i) {
              let element = createElement('a',{href:'javascript:void(0)'},places[i]);
              element.addEventListener('click',function (event) {
                  localStorage.setItem('place',event.target.text);
                  // 現在表示されているものを削除
                  let p = document.querySelector('.parseasinTitle').children;
                  let len = p.length;
                  for (let j=1; j < len; ++j){
                    amazon.info.btAsinTitle.removeChild(p[1]);
                  }
                  // 再描写
                  amazon.disp.link();
                  let e = amazon.info.res.querySelector('.flst_head');
                  if(e != null){
                    amazon.disp.libLink();
                  }else{
                    amazon.disp.orderLink();
                  }
              },false);
              div.appendChild(element);
            }
            amazon.info.btAsinTitle.appendChild(text);
            amazon.info.btAsinTitle.appendChild(div);
          }
        },
        // 図書館の場所
        get home(){
          return localStorage.getItem('place');
        } 
      },

      // 表示
      disp: {
        // 図書館へのリンク
        link: function() {
          let div = createElement('div',{id:'tdu_link'});
          let link = createElement('a',{
              href: 'https://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn=' + amazon.info.isbn + '&title=' + encodeURIComponent(amazon.info.title) + '&press=' + encodeURIComponent(amazon.info.press) + '&price=' + amazon.info.price,
              target: '_blank'},
            '図書館検索'
          );
          div.appendChild(link);
          amazon.info.btAsinTitle.appendChild(div);
        },

        // ロード状態の表示
        loading: function() {
          let div = createElement('div',{id:'loading'},'NOW LOADING...');
          amazon.info.btAsinTitle.appendChild(div);
        },

        // ロード表示の削除 
        removeLoading: function() {
          let element = document.getElementById('loading');
          element.parentNode.removeChild(element);
        },

        // 購入依頼のリンク作成
        orderLink: function() {
          // let link = "javascript:void(0)";
          let link = 'https://lib.mrcl.dendai.ac.jp/webopac/odridf.do?isbn=' + amazon.info.isbn + '&title=' + encodeURIComponent(amazon.info.title) + '&press=' + encodeURIComponent(amazon.info.press) + '&price=' + amazon.info.price;
          let a = createElement('a',{href: link,id: 'order'},'購入依頼');
          amazon.info.btAsinTitle.appendChild(a);
        },

        // 各図書館の蔵書状況の表示
        libLink: function() {
          let div = createElement('div',{id:'tduBooks'});
          // 要素の調査
          let tbody = amazon.info.res.querySelectorAll('.flst_head')[0].parentNode;
          for (let i=1,len = tbody.children.length; i < len; ++i) {
            let element = createElement('div');
            let tr = tbody.children[i];
            // 所蔵館・状態・返却期限日(配架済 or 貸出中)
            let library = {
              place: tr.children[3].firstChild.firstChild.nodeValue,
              state: tr.children[8].firstChild.firstChild.nodeValue,
              priod: tr.children[9].firstChild.firstChild.nodeValue
            };
            if(library.place == amazon.library.home){
              element.setAttribute('id','myhome'); 
            }
            if(library.state == '貸出中'){
              element.innerHTML = library.place + ' ' + library.state + ' ' + '返却期限 ' + library.priod;
            }else{
              element.innerHTML = library.place + ' ' + library.state;
            }
            div.appendChild(element);
          }
          amazon.info.btAsinTitle.appendChild(div);
        }
      },

      // 関数定義
      checkCategory: function() {
        let category = document.querySelector('.nav-category-button').firstChild.innerHTML;
        if(category == '本'){
          return true;
        }
        return false;
      },

      // 蔵書のページ確認
      page: function (response) {
        amazon.info.setRes(response);
        let element = amazon.info.res.querySelector('.flst_head');
        if (element != null) {
          amazon.disp.libLink();
        }else{
          amazon.disp.orderLink();
        }  
      },

      // HTTPRequestにより蔵書情報取得
      getLib: function () {
        let request = new XMLHttpRequest();
        let link = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do?isbn_issn=' + amazon.info.isbn;
        // 一度allow-any-originを噛ませることでクロスドメイン制限対策
        request.open('GET','http://allow-any-origin.appspot.com/' + link,true);
        request.send(); 
        request.onload = function () {
          // ロード状態の解除
          amazon.disp.removeLoading();
          amazon.library.setPlace();
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
          padding: 2px 15px\
        }\
        #myhome {\
          color:#009900;\
          font-weight: bold;\
        }\
        #order {\
          display: table;\
          font-size: 16px;\
          margin: 5px 15px;\
          padding: 2px 15px\
        }\
        #readme{\
          display: table;\
          font-size: 16px;\
          margin: 1px 1px;\
          padding: 2px 15px;\
        }\
        ";
        let head = document.getElementsByTagName('head')[0];
        let element = window.document.createElement('style');
        element.type = "text/css";
        element.textContent = style;
        head.appendChild(element);
      },

      open: function() {
        // カテゴリのチェック
        if(!amazon.checkCategory()){
          return;
        }
        if(amazon.info.isbn){
          amazon.getLib();
          amazon.disp.link();
          amazon.disp.loading();
          amazon.style();
        }
      }
    }; 

    /*
     *  電機大学図書館
     */
    let library = {

      // URLをオブジェクトにして返却
      get parames() {
        if(1 < document.location.search.length){
          let parameters = document.location.search.substring(1).split('&');
          let result = {};
          for (let i=0; i < parameters.length; ++i) {
            let element = parameters[i].split('=');
            result[decodeURIComponent(element[0])] = decodeURIComponent(element[1]);
          }
          return result;
        }
        return null;
      },
      // 自動ログイン
      open: function () {
        let loginbutton = null;
        let pass=false;
        let form = document.forms[0];
        form.setAttribute('autocomplete','on');
        for (let j=0; formelement=form.getElementsByTagName('input')[j]; ++j){
          if(formelement.type == 'password' && formelement.value){
            pass = true; 
            break;
          }
        }
        for (let j=0; formelement=form.getElementsByTagName('input')[j]; ++j){
          if (formelement.type == 'image' && pass) {
            loginbutton = formelement;
            break;
          }
        }
        if(loginbutton){
          loginbutton.focus();
          loginbutton.click();
        }
      },

      // formのactionにパラメータ追加
      setForm: function() {
        let form = document.forms[0];
        form.action = '/webopac/odridf.do' + location.search;
        library.open();
      },

      checkHasBook: function() {
        let err = document.body.innerHTML.match('指定された条件に該当する資料がありませんでした');
        if (err) {
          orderODR();
        }
      },  

      // システムメッセージが表示されたか確認
      checkErr: function() {
        let err = document.body.innerHTML.match('OP-2010-E');
        if(err){
          // リダイレクトする
          let url = 'http://lib.mrcl.dendai.ac.jp/webopac/ctlsrh.do'+document.location.search;
          window.open(url,'_self');
        }else{
          library.input();
        }
      },

      // フォームに自動入力
      input: function () {
        let tds = document.querySelectorAll('table.opt_frame tbody tr td input');
        let values = {
          'bibtr': library.parames['title'],
          'bibpb': library.parames['press'],
          'isbn' : library.parames['isbn'],
          'bibpr': library.parames['price']
        };
        for (let i=0; i < tds.length; ++i) {
          let td = tds[i].getAttribute('name');
          for(let name in values){
            if(td == name){
              tds[i].value = values[name];
            }
          }
        }
      },

      // isbnのみか他のパラメータがあるかチェック
      checkParam: function() {
        let parameters = document.location.search.substring(1).split('&');
        if(parameters.length < 4){
          return false;
        }
        return true;
      },

      start: {
        '/webopac/ctlsrh.do': function () {
          if(library.checkParam()){
            library.checkHasBook();
          }
        },
        '/webopac/odridf.do': function () {
          library.checkErr();
        },
        '/webopac/odrexm.do': function () {
          if(library.checkParam()) { 
            library.setForm();
          }else{
            library.open();
          }
        },
        '/webopac/rsvexm.do':function () {
          library.open();
        }
      }
    };

    // urlを確認
    let checkHost = {
      'www.amazon.co.jp': function () {
        amazon.init();
        amazon.open();
      },
      'lib.mrcl.dendai.ac.jp': function () {
        let path = window.location.pathname;
        library.start[path]();
      }       
    };

    window.onload = function () {
      let host = document.location.host;
      try{
        let f = checkHost[host];
        if(f == undefined) return;
        f();
      }catch(err){
        console.log(err);
      } 
      return;
    };

    function orderODR() {
      var w;
      document.svcodrform.action='https://' + location.host + '/webopac/odrexm.do' + location.search;
      document.svcodrform.mode.value='new';
      document.svcodrform.reqType.value='_NEW';
      document.svcodrform.loginType.value='once';
      w = window.open('','_self');
      document.svcodrform.submit();
      w.focus();
    }
})();  
