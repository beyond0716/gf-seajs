define('pagination', function (require, exports, module) {
  module.exports = function (currentPage, pageSize, total) {
    var pageCount = Math.ceil(total / pageSize),
        str = '';
    if (pageCount <= 1) {
      return str;
    }
    str = '<button type="button" class="btn-prev">上一页</button>' +
        '<ul class="pager">';
    if (currentPage == 1) {
      str += '<li class="active">1</li>';
    } else {
      str += '<li>1</li>';
    }
    var array = [];
    var pagerCount = 7;
    var showPrevMore = false;
    var showNextMore = false;
    if (pageCount > pagerCount) {
      if (currentPage > pagerCount - 3) {
        showPrevMore = true;
        str += '<li class="more btn-quickprev fa fa-ellipsis-h"></li>';
      }
      if (currentPage < pageCount - 3) {
        showNextMore = true;
      }
    }
    if (showPrevMore && !showNextMore) {
      var startPage = pageCount - (pagerCount - 2);
      for (var i = startPage; i < pageCount; i++) {
        array.push(i);
      }

    } else if (showPrevMore && showNextMore) {
      var offset = Math.floor(pagerCount / 2) - 1;
      for (var i = currentPage - offset; i <= currentPage + offset; i++) {
        array.push(i);
      }
    } else if (!showPrevMore && showNextMore) {
      for (var i = 2; i < pagerCount; i++) {
        array.push(i);
      }
    } else {
      for (var i = 2; i < pageCount; i++) {
        array.push(i);
      }
    }
    for (var i = 0; i < array.length; i++) {
      if (currentPage == array[i]) {
        str += '<li class="active">' + array[i] + '</li>';
        continue;
      } else {
        str += '<li>' + array[i] + '</li>';
      }
    }
    if (pageCount > pagerCount) {
      if (currentPage < pageCount - 3) {
        str += '<li class="more btn-quicknext fa fa-ellipsis-h"></li>';
      }
    }
    if (pageCount == 1) {
      str += '';
    } else {
      if (currentPage == pageCount) {
        str += '<li class="active">' + pageCount + '</li>';
      } else {
        str += '<li>' + pageCount + '</li>';
      }
    }
    str = str + '</ul>' +
        '<button type="button" class="btn-next">下一页</button>';
    return str;
  };
});