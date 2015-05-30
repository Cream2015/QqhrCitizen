$(document).ready(function () {
	$('a[data-toggle]').click(function () {
		$('.pop-menu').slideUp();
		var target = $(this).attr('data-toggle');
		var menu = $('#' + target);
		var offset = $(this).find('div').offset();
		menu.css('top', offset.top + 50);
		menu.css('left', offset.left + 2);
		menu.slideDown();
	});
});

$(document).on('click', function (e) {
	if ($(e.target).attr('data-toggle')) return;
	if ($(e.target).hasClass('pop-menu')) return;
	if ($(e.target).hasClass('nav-item')) return;
	if ($(e.target).parents('.pop-menu').length > 0) return;
	$('.pop-menu').slideUp();
});