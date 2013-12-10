// ==UserScript==
// @name        AntennaSiteSkip
// @namespace   https://twitter.com/akameco
// @description いいぜアンテナサイトに飛ぶってならまずはそのふざけた幻想をぶち殺す
// @include     http://2ch-c.net/*
// @include     http://newser.cc/*
// @include     http://get2ch.net/*
// @include     http://the-3rd.net/*
// @include     http://matomeantena.com/*
// @include     http://moudamepo.com/*
// @include     http://newmofu.doorblog.jp/*
// @include     http://blog-news.doorblog.jp/*
// @include     http://nullpoantenna.com/*
// @include     http://newpuru.doorblog.jp/*
// @include     http://besttrendnews.net/*
// @include     http://suomi-neito.com/*
// @include     http://2ch.logpo.jp/*
// @include     http://anaguro.yanen.org/*
// @include     http://a.anipo.jp/*
// @include     http://katuru.com/*
// @version     1
// @grant       none
// ==/UserScript==

// 対応サイト
// しぃアンテナ(*ﾟーﾟ)
// News人
// 2GET
// The 3rd
// ワロタあんてな
// だめぽアンテナ
// にゅーもふ
// ぶろにゅー
// ヌルポあんてな
// にゅーぷる
// Best Trend News
// スオミネイト
// Logpo!2ch
// アナグロあんてな
// アンテナ速報
// 勝つるあんてな！

(function (){

  function doOpen() {
    let host = location.host;
    switch(host){
      case "2ch-c.net":
        skip2chcnet();
        break;
      case "newser.cc":
        skipNewser();
        break;
      case  "get2ch.net":
        skipGet2ch();
        break;
      case "the-3rd.net":
        skipthe3rd();
        break;
      case "matomeantena.com":
        skipMatomeantena();
        break;
      case "moudamepo.com":
        skipMoudamepo();
        break;
      case "newmofu.doorblog.jp":
        skipNewmofu();
        break;
      case "blog-news.doorblog.jp":
        skipBlognews();
        break;
      case "nullpoantenna.com":
        skipNullpoantenna();
        break;
      case "newpuru.doorblog.jp":
        skipNewpuru()
        break;
      case "besttrendnews.net":
        skipBesttrendnews();
        break;
      case "suomi-neito.com":
        skipSuomi();
        break;
      case "2ch.logpo.jp":
        skipLogPo();
        break;
      case "anaguro.yanen.org":
        skipAnaguro();
        break;
      case "a.anipo.jp":
        skipAanipo();
        break;
      case "katuru.com":
        skipKaturu();
        break;
      default:
        console.log("not match");
        break;
    }
  }

  window.onload = function () {
    // 行くでw
    setTimeout(function() {
      doOpen(); 
    }, 100);
    // もーいっかい！
    setTimeout(function() { 
      doOpen(); 
    }, 500);
    // 今度こそ！
    setTimeout(function() {
      doOpen(); 
    }, 1000);
    // てゆーかこの繰り返し意味あるかわからん
  }


  

  // targetを取得 
  function getTarget(path) {
    return document.querySelectorAll(path)[0];
  }

  // targetsを取得 
  function getTargets(path) {
    return document.querySelectorAll(path);
  }

  // window.openは_self固定 
  function wopen(target) {
    window.open(target,'_self').focus();
  }

  // リンクがclassで指定されているサイト
  function skipClass(select) {
    let target = getTarget(select).getAttribute('href');
    wopen(target);
  }

  // しぃアンテナ(*ﾟーﾟ)
  // http://2ch-c.net/*
  function skip2chcnet() {
    let target = document.getElementById('pickup').getAttribute('href');
    wopen(target);
  }

  // 2GET
  //http://get2ch.net/*
  function skipGet2ch() {
    skipClass('.pickup a');
  }

  // News人
  // http://newser.cc/*
  function skipNewser() {
    let targets = getTargets('td.news-link a');
    for (let i=0; i < targets.length; i++) {
      if(targets[i].getAttribute('style') != null){
        wopen(targets[i]);
      }
    }
  }

  // The 3rd
  // http://the-3rd.net/*
  function skipthe3rd() {
    let targets = getTargets('div#content.wrap div#l_col a');
    for (let i=0; i < targets.length; i++) {
      if(targets[i].childNodes[1].childNodes[3].getAttribute('style') != null) {
        wopen(targets[i]);
      }
    }
  }

  // ワロタあんてな
  // http://matomeantena.com/*
  function skipMatomeantena() {
    skipClass('.rss_link > a');
  }

  // にゅーもふ
  // http://newmofu.doorblog.jp/*
  function skipNewmofu() {
    skipClass('.title_link a');
  }

  // だめぽアンテナ
  // http://moudamepo.com/*
  function skipMoudamepo() {
    skipClass('.headline_pkup a');
  }

  // ぶろにゅー
  // http://blog-news.doorblog.jp/
  function skipBlognews() {
    skipClass('.title_link');
  }

  //ぬるぽあんてな
  //http://nullpoantenna.com/*
  function skipNullpoantenna() {
    let target = getTarget('.rss_link').firstChild.getAttribute('href');
    wopen(target);
  }

  // にゅーぷる
  //http://newpuru.doorblog.jp/*
  function skipNewpuru() {
    skipClass('.titleLink');
  }

  // best trend news
  // http://besttrendnews.net/*
  function skipBesttrendnews() {
    let target = getTarget('.select').firstChild.getAttribute('href');
    wopen(target);
  }

  // スオミネイト
  // http://suomi-neito.com/*
  function skipSuomi() {
    let target = getTarget('.pickup').firstChild.innerHTML;
    wopen(target);
  }

  // LogPo!2ch
  // http://2ch.logpo.jp/*
  function skipLogPo() {
    skipClass('.caption a');
  }
  
  // アナグロあんてな
  // http://anaguro.yanen.org/*
  function skipAnaguro() {
    skipClass('.title a');
  }

  // アンテナ速報
  // http://a.anipo.jp/*
  function skipAanipo() {
    let targets = getTargets('#tbody tr');
    for (let i=0; i < targets.length; i++) {
      if(targets[i].getAttribute('style') != null){
        let target = targets[i].querySelectorAll('a')[0].getAttribute('href');
        wopen(target);
      }
    }
  }

  // 勝つるあんてな
  // http://katuru.com/*
  function skipKaturu() {
    skipClass('.rss_center_div a');
  }

})();
