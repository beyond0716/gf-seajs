define('helpDetail', function (require, exports, module) {
  var $ = require('jquery'),
      template = require('template'),
      api = require('api'),
      public = require('public');

  var articlesQuery={
    mailType: 1,
    category: 1,
    pageIndex: 1,
    pageSize: 15,
    sortTypes: 2,
    publishToWeb: 1
  };
  var pageCount=1,
      qaType=1;

  function init() {
    $("#center-list-inner").hide();
    $("#center-detail-inner").show();
    getArticle({id: getId()});
  }

  function bindEvent() {
    $("#left-menu").on("click", 'li', function () {
      $(this).addClass("curn").siblings().removeClass("curn");
      var title=$(this).text();
      $("#list-title .txt").text(title);
      $("#center-detail-inner").hide();
      $("#center-list-inner").show();
      var tagid = $(this).attr('tagid');
      qaType=title=='最新问题' || title=='热门问题' ? 1 : 2;
      articlesQuery.pageIndex=1;
      articlesQuery.tagId=tagid;
      articlesQuery.sortTypes=title=='最新问题' ? 1 : 2;
      getArticles(articlesQuery);
    });

    $("#pagination").on("mouseover", 'li.btn-quickprev', function () {
      $(this).toggleClass('fa-ellipsis-h fa-angle-double-left');
    });

    $("#pagination").on("mouseout", 'li.btn-quickprev', function () {
      $(this).toggleClass('fa-ellipsis-h fa-angle-double-left');
    });

    $("#pagination").on("mouseover", 'li.btn-quicknext', function () {
      $(this).toggleClass('fa-ellipsis-h fa-angle-double-right');
    });

    $("#pagination").on("mouseout", 'li.btn-quicknext', function () {
      $(this).toggleClass('fa-ellipsis-h fa-angle-double-right');
    });

    $("#pagination").on("click", 'li', function (event) {
      var target=event.target;
      var newpage=Number(target.textContent);
      if(target.className.indexOf('more')!==-1){
        if(target.className.indexOf('quickprev')!==-1){
          newpage=articlesQuery.pageIndex-5;
          if(newpage<1){
            newpage=1;
          }
        }else if(target.className.indexOf('quicknext')!==-1){
          newpage=articlesQuery.pageIndex+5;
          if(newpage>pageCount){
            newpage=pageCount;
          }
        }
      }
      articlesQuery.pageIndex=newpage;
      getArticles(articlesQuery);
    });

    $("#pagination").on("click", '.btn-prev', function () {
      articlesQuery.pageIndex-=1;
      var newpage=articlesQuery.pageIndex;
      if(newpage < 1){
        articlesQuery.pageIndex = 1;
      }
      getArticles(articlesQuery);
    });

    $("#pagination").on("click", '.btn-next', function () {
      articlesQuery.pageIndex+=1;
      var newpage=articlesQuery.pageIndex;
      if(newpage>pageCount){
        articlesQuery.pageIndex = pageCount;
      }
      getArticles(articlesQuery);
    });
  }

  // 获取文章列表
  function getArticles(query) {
    $.when(api.help.getArticles(query))
        .done(function (json) {
          var articles = json.message.articles,
              listHtml = '',
              newArticles=[];
          if(qaType==1 && query.pageIndex==2){
            newArticles=articles.slice(0,5);
          }else{
            newArticles=articles.slice(0);
          }
          newArticles.forEach(function (item) {
            listHtml += '<li><a href="/article?id=' + item.id + '" target="_blank">' + item.title + '</a></li>';
          });
          $("#qa-list").html(listHtml);
          var total=json.message.total;
          if(qaType==1 && total>20){
            total=20;
          }
          var currentPage=query.pageIndex ? query.pageIndex : 1;
          var pageSize=query.pageSize ? query.pageSize : 15;
          pageCount=Math.ceil(total/pageSize);
          var pageHtml=public.pagination(currentPage,pageSize,total);
          $('#pagination').html(pageHtml);
        });
  }

  // 获取文章id
  function getId() {
    var url = location.search;
    if (url.indexOf("?") != -1) {
      var urlStr = url.substr(1);
      var urlArr = urlStr.split("=");
      return urlArr[1];
    }
  }

  // 读取文章内容
  function getArticle(data) {
    $.when(api.help.getArticle(data))
        .done(function (json) {
          var article=json.message;
          $("#detail-title .txt").html(article.title);
          $("#qa-detail").html(article.body);
        });
  }

  $(function () {
    init();
    bindEvent();
  });
});