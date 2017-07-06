define('helpApp', function (require, exports, module) {
  var $ = require('jquery'),
      template = require('template'),
      api = require('api'),
      public = require('public');
  iscroll = require('iscroll');
  var articlesQuery = {
    mailType: 1,
    category: 1,
    pageIndex: 1,
    pageSize: 20,
    sortTypes: 2,
    publishToClient: 1
  };
  var isAll = false;
  var localArticles = JSON.parse(localStorage.getItem('articles'));

  function init() {
    if (!localArticles) {
      getArticles(articlesQuery);
    } else {
      renderHTML(localArticles);
    }
  }

  function bindEvent() {
    var myScroll,
        pullDown,
        pullUp,
        pullDownFlag,
        pullUpFlag,
        list;

    function pullDownAction() {
      articlesQuery.pageIndex = 1;
      isAll = false;
      pullUp.innerHTML = "上拉加载更多…";
      $.when(api.help.getArticles(articlesQuery))
          .done(function (json) {
            var articles = json.message.articles;
            renderHTML(articles);
            if (articles.length < articlesQuery.pageSize) {
              $("#pullUp").hide();
            }
            setTimeout(function () {
              myScroll.refresh();
            }, 0);
          });
    }

    function pullUpAction() {
      articlesQuery.pageIndex += 1;
      $.when(api.help.getArticles(articlesQuery))
          .done(function (json) {
            var articles = json.message.articles;
            if (articles.length < articlesQuery.pageSize) {
              isAll = true;
            }
            renderHTML(articles,1);
            setTimeout(function () {
              myScroll.refresh();
            }, 0);
          });
    }

    function positionJudge() {
      if (this.y > 40) {
        pullDown.innerHTML = "放开刷新页面";
        pullDownFlag = 1;
      } else if (this.y < (this.maxScrollY - 40)) {
        pullUp.innerHTML = "放开更新页面";
        pullUpFlag = 1;
      }
    }

    function action() {
      if (pullDownFlag == 1) {
        pullDownAction();
        pullDown.innerHTML = "下拉刷新…";
        pullDownFlag = 0;
      } else if (pullUpFlag == 1) {
        pullUpAction();
        pullUp.innerHTML = "上拉加载更多…";
        pullUpFlag = 0;
        if (isAll) {
          pullUp.innerHTML = "没有了…";
        }
      }
    }

    function loaded() {
      $("#qa-list").css({"minHeight": "880px"});
      pullDown = document.getElementById('pullDown');
      pullUp = document.getElementById('pullUp');
      list = document.getElementById('qa-list');
      myScroll = new IScroll('#wrapper', {probeType: 3, mouseWheel: true, click: true});
      myScroll.on('scroll', positionJudge);
      myScroll.on('scrollEnd', action);
    }

    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
    window.onload = loaded();
  }

  function getArticles(query) {
    $.when(api.help.getArticles(query))
        .done(function (json) {
          var articles = json.message.articles;
          localStorage.setItem('articles', JSON.stringify(articles));
          renderHTML(articles);
          if (articles.length < query.pageSize) {
            $("#pullUp").hide();
          }
        });
  }

  function renderHTML(data, type) {
    var listHtml = '';
    data.forEach(function (item) {
      listHtml += '<li><a href="/article?id=' + item.id + '">' + item.title + '</a></li>';
    });
    if (type) {
      $("#qa-list").append(listHtml);
    } else {
      $("#qa-list").html(listHtml);
    }
  }

  $(function () {
    init();
    bindEvent();
  });
});