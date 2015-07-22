function gotoTop() {
    var $goTopBtn = $('<a id="goTopBtn">返回顶部</a>');
    $('body').append($goTopBtn);
    $goTopBtn.click(function () {
        $('html,body').animate({scrollTop: 0}, 500)
    });
    $(window).on('scroll.YM', function () {
        throttle(scrollHandler, this);
    });
    function scrollHandler() {
        var sTop = $(window).scrollTop();
        sTop > 50 ? $goTopBtn.fadeIn('slow') : $goTopBtn.hide();
    }
    function throttle(method, context) {
        clearTimeout(context.tId);
        context.tId = setTimeout(function () {
            method.call(context);
        }, 200);
    }
}
