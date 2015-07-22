var ww = $(window).width(),
wh = $(window).height(),
rNear = $('.r-near'),
rFar = $('.r-far');

$( window ).resize(function() {
	ww = $(window).width()
	wh = $(window).height()
});

$('.wrap').mousemove(function(e) {
	var cX = parseInt(e.clientX - ww/2),
	cY = parseInt(e.clientY - wh/2);
	rNear.css({marginLeft: (cX*100)/500, marginTop: (cY*100)/500});
	rFar.css({marginLeft: -(cX*100)/5000, marginTop: -(cY*100)/5000});
});
// http://ava.pmang.com/event/20141125/index.nwz?type=event3
