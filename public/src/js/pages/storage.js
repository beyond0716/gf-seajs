define(function (require, exports, module) {
  var common = require('common');
  var template = require('template');

  function init() {
    var htmlEl=document.documentElement;
    var pEl=document.getElementById('p1');
    var divEl=document.getElementById('div1');

    var colorForm = document.getElementById('colorForm');
    var familyForm = document.getElementById('familyForm');
    var sizeForm = document.getElementById('sizeForm');


    var curnColor=localStorage.getItem('color');
    var curnFamily=localStorage.getItem('family');
    var curnSize=localStorage.getItem('size');

    colorForm.onchange=populateStorage;
    familyForm.onchange=populateStorage;
    sizeForm.onchange=populateStorage;

    if (!curnColor) {
      populateStorage();
    } else {
      setStyles();
    }

    function populateStorage() {
      localStorage.setItem('color', colorForm.value);
      localStorage.setItem('family', familyForm.value);
      localStorage.setItem('size', sizeForm.value);
      setStyles();
    }

    function setStyles() {
      colorForm.value=curnColor;
      familyForm.value=curnFamily;
      sizeForm.value=curnSize;
      htmlEl.style.backgroundColor='#'+curnColor;
      pEl.style.fontFamily=curnFamily;
      divEl.style.fontSize=curnSize;
    }




  }

  $(function () {
    init();
  });
});
