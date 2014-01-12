// ==UserScript==
// @name         RemovePRfeedly
// @namespace    https://twitter.com/akameco
// @version      2014-01-12
// @include      https://feedly.com/index.html#my
// @include      https://cloud.feedly.com/#latest
// @include      https://cloud.feedly.com/#subscription*
// @include      https://cloud.feedly.com/#category*
// @grant        none
// ==/UserScript==
(function () {
  document.body.addEventListener("DOMNodeInserted",function (e) {
    let element = e.target;
    if (!element.className.contains('u0Entry')) return;
    if (element.attributes.getNamedItem('data-title').value.toUpperCase().match(/^(PR:|AD:|\[PR\])/)) {
      element.click();
      var inline = document.querySelectorAll('.inlineFrame')[0];
      inline.parentNode.removeChild(inline);
    }     
  },false);
})();
