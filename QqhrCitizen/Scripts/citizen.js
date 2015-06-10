var lock = false;
var page = 0;
var tid = "";


function LoadNews() {
    if (lock) {
        return;
    }
    else {
        lock = true;
        $.ajax({
            url: "/News/getNews",
            type: "post",
            data: { "page": page, "tid": tid },
        }).done(function (data) {
            console.log(data);
            var str = "";
            for (var i = 0 ; i < data.length; i++) {
                str += "<div><a href='/News/Show/"+data[i].ID+"'>"+data[i].Title+" </a> <span>"+moment(data[i].Time).format("YYYY-mm-DD HH:mm:ss")+"</span></div>";
            }
            console.log(str);
            $(".lstNews").append(str);
            if (data.length == 10) {
                lock = false;
                page++;
            }
        });
    }
}

function Load() {
    if ($(".lstNews").length > 0) {
        LoadNews();
    }
}

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

	Load();

	$(window).scroll(
    function () {
        totalheight = parseFloat($(window).height())
           + parseFloat($(window).scrollTop());
        if ($(document).height() <= totalheight) {
            Load();
        }
    });
	
});

$(document).on('click', function (e) {
	if ($(e.target).attr('data-toggle')) return;
	if ($(e.target).hasClass('pop-menu')) return;
	if ($(e.target).hasClass('nav-item')) return;
	if ($(e.target).parents('.pop-menu').length > 0) return;
	$('.pop-menu').slideUp();
});