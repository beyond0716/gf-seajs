var express = require('express');
var config = require('config');
var router = express.Router();

function setPageRoute(route,renderPath) {
  router.get(route,function (req, res, next) {
    return res.render(renderPath,{
      path: config.static.path
    })
  })
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});


setPageRoute('/test','test');

setPageRoute('/rev','rev');

router.get('/ajax', function(req, res, next) {
  res.render('ajax', { title: 'Ajax' });
});

router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Form' });
});

router.get('/storage', function(req, res, next) {
  res.render('storage', { title: 'storage' });
});

router.get('/indexedDB', function(req, res, next) {
  res.render('indexedDB', { title: 'indexedDB' });
});

module.exports = router;
