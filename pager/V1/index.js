function createPager(currentPage, maxPager, onChange, pagerContainer, isMinClick) {

    if (!onChange) {
        onChange = function(currentPage) {

        };
    }
    pagerContainer.empty();

    function pVisible(item, isV) {
        isV ? item.show() : item.hide();
    }

    function addActive(li) {
        li.addClass('active');
        li.siblings().removeClass('active');
    }

    function getActive(pagerContainer) {

        return $('.active', pagerContainer);
    }

    function getActivePage(pagerContainer) {

        return parseInt(getActive(pagerContainer).attr('value'));
    }
    (

        function(currentPage, maxPager, onChange, pagerContainer, isMinClick) {
            var $ul = $('<ul class="pager"></ul>');
            var $pre = $('<li class="pre">上一页</li>');
            var $next = $('<li class="next">下一页</li>');
            var $first = $('<li class="first" value="1">1</li>');
            var $max = $('<li class="max" value="' + maxPager + '">' + maxPager + '</li>');
            var $np1 = $('<li>...</li>');
            var $np2 = $('<li>...</li>');

            $ul.append($pre);
            $ul.append($first);
            $ul.append($np1);


            var prePage = isMinClick ?
                (currentPage == 2 ? (currentPage) : (currentPage == maxPager - 1 ? maxPager - 3 : (currentPage - 1))) :
                (maxPager == currentPage ? (currentPage - 3) : currentPage + 1);
            var nextPage =
                isMinClick ?
                ((currentPage == 2 ? (currentPage + 2) : (currentPage == maxPager - 1 ? currentPage : (currentPage + 1)))) :
                ((maxPager == currentPage ? (currentPage - 1) : currentPage + 3));
            pVisible($np1, prePage > 2);
            pVisible($np2, nextPage < (maxPager - 1));

            for (var i = prePage; i <= nextPage; i++) {

                if (i <= 1) {
                    continue;
                }
                if (i >= maxPager) {
                    continue;
                }
                var $li = $('<li class="pager-item"></li>');
                $li.html(i);
                $li.attr('value', i);
                $ul.append($li);
                $li.click(function() {
                    var value = parseInt($(this).attr('value'));
                    var _currentPage = getActivePage(pagerContainer);
                    if (value == _currentPage) {
                        return;
                    }
                    createPager(value, maxPager, onChange, pagerContainer, true);
                    onChange(value, getActive(pagerContainer));

                });
            }
            $ul.append($np2);
            if (maxPager > 1) {
                $ul.append($max);
            }
            $max.click(function() {
                var _currentPage = getActivePage(pagerContainer);
                if (_currentPage == maxPager) {
                    return;
                }
                createPager(maxPager, maxPager, onChange, pagerContainer);
                onChange(maxPager, getActive(pagerContainer));
            });

            $first.click(function() {
                var _currentPage = getActivePage(pagerContainer);
                if (_currentPage == 1) {
                    return;

                }
                createPager(1, maxPager, onChange, pagerContainer);
                onChange(1, getActive(pagerContainer));
            });

            $pre.click(function() {
                var activeIndex = getActivePage(pagerContainer);
                var _currentPage = activeIndex - 1;
                if (activeIndex <= 1) {
                    return;
                }
                createPager(_currentPage, maxPager, onChange, pagerContainer, _currentPage == 1 ? false : true);
                onChange(_currentPage, getActive(pagerContainer));
            });
            $next.click(function() {
                var activeIndex = getActivePage(pagerContainer);
                var _currentPage = activeIndex + 1;
                if (activeIndex >= maxPager) {
                    return;
                }
                createPager(_currentPage, maxPager, onChange, pagerContainer, _currentPage == maxPager ? false : true);
                onChange(_currentPage, getActive(pagerContainer));
            });
            $ul.append($next);
            pagerContainer.append($ul);

            addActive($('li[value=' + currentPage + ']', pagerContainer));
        })(currentPage, maxPager, onChange, pagerContainer, isMinClick);
}


var xPager = (function() {

    var members = {

        /*
         @pagerContainer jq对象
         @currentPage    当前页数
         @maxPager       最大页数
         @onChange       页面变化事件function(currentPageIndex,$me){}
        */
        render: function(pagerContainer, currentPage, maxPager, onChange) {
            createPager(currentPage, maxPager, onChange, pagerContainer);
        }
    }
    return members;
})();