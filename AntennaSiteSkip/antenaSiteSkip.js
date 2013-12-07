// ==UserScript==
// @name        AntennaSiteSkip
// @namespace   https://twitter.com/akameco
// @description いいぜアンテナサイトに飛ぶってならまずはそのふざけた幻想をぶち殺す
// @include     http://2ch-c.net/*
// @include     http://matomeantena.com/*
// @include     http://moudamepo.com/*
// @include     http://newmofu.doorblog.jp/*
// @include     http://newser.cc/*
// @include     http://the-3rd.net/*
// @include     http://get2ch.net/*
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
// ワロタあんてな
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

  // しぃアンテナ(*ﾟーﾟ)
  // http://2ch-c.net/*
  function skip2chcnet() {
    let target = document.getElementById('pickup').getAttribute('href');
    window.open(target,'_self').focus(); 
  }

  // 2GET
  //http://get2ch.net/*
  function skipGet2ch() {
    let target = document.querySelectorAll('.pickup a')[0].getAttribute('href');
    window.open(target,'_self').focus(); 
  }

  // News人
  // http://newser.cc/*
  function skipNewser() {
    let target = document.querySelectorAll('td.news-link a');
    for (let i=0; i < target.length; i++) {
      if(target[i].getAttribute('style') != null){
        window.open(target[i],'_self').focus();
      }
    }
  }

  // The 3rd
  // http://the-3rd.net/*
  function skipthe3rd() {
    let target = document.querySelectorAll('div#content.wrap div#l_col a');
    for (let i=0; i < target.length; i++) {
      if(target[i].childNodes[1].childNodes[3].getAttribute('style') != null) {
        window.open(target[i],'_self').focus();
      }
    }
  }

  // ワロタあんてな
  // http://matomeantena.com/*
  function skipMatomeantena() {
    let target = document.querySelectorAll('.rss_link > a')[0].getAttribute('href');
    window.open(target,"_self").focus();
  }

  // にゅーもふ
  // http://newmofu.doorblog.jp/*
  function skipNewmofu() {
    let target = document.querySelectorAll('.title_link a')[0].getAttribute('href');
    window.open(target,'_self').focus();
  }

  // だめぽアンテナ
  // http://moudamepo.com/*
  function skipMoudamepo() {
    let target = document.querySelectorAll('.headline_pkup a')[0].getAttribute("href");
    window.open(target,"_self").focus();
  }

  // ぶろにゅー
  // http://blog-news.doorblog.jp/
  function skipBlognews() {
    let target = document.querySelectorAll('.title_link')[0].getAttribute('href');
    window.open(target,'_self').focus();
  }

  //ぬるぽあんてな
  //http://nullpoantenna.com/*
  function skipNullpoantenna() {
    let target = document.querySelectorAll('.rss_link')[0].firstChild.getAttribute('href');
    window.open(target,'_self').focus();
  }

  // にゅーぷる
  //http://newpuru.doorblog.jp/*
  function skipNewpuru() {
    let target = document.querySelectorAll('.titleLink')[0].getAttribute('href');
    window.open(target,'_self').focus();
  }

  // best trend news
  // http://besttrendnews.net/*
  function skipBesttrendnews() {
    let target = document.querySelectorAll('.select')[0].firstChild.getAttribute('href');
    window.open(target,'_self').focus();
  }

  // スオミネイト
  // http://suomi-neito.com/*
  function skipSuomi() {
    let target = document.querySelectorAll('.pickup')[0].firstChild.innerHTML;
    window.open(target,'_self').focus();
  }

  // LogPo!2ch
  // http://2ch.logpo.jp/*
  function skipLogPo() {
    let target = document.querySelectorAll('.caption a')[0].getAttribute('href');
    window.open(target,'_self').focus();
  }
  
  // アナグロあんてな
  // http://anaguro.yanen.org/*
  function skipAnaguro() {
    let target = document.querySelectorAll('.title a')[0].getAttribute('href');
    window.open(target,'_self').focus();
  }

  // アンテナ速報
  // http://a.anipo.jp/*
  function skipAanipo() {
    let target = document.querySelectorAll('#tbody tr');
    for (let i=0; i < target.length; i++) {
      if(target[i].getAttribute('style') != null){
        let link = target[i].querySelectorAll('a')[0].getAttribute('href');
        window.open(link,'_self').focus();
      }
    }
  }

  // 勝つるあんてな
  // http://katuru.com/*
  function skipKaturu() {
    let target = document.querySelectorAll('.rss_center_div a')[0].getAttribute('href');
    window.open(target,'_self').focus();
  }

})();
