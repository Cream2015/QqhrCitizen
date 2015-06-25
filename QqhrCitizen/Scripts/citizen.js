var lock = false;
var page = 0;
var tid = "";
var options = ['A', 'B', 'C', 'D'];


function resize() {
    $('.main').width($(window).width() - 280);
}

$(window).resize(function () {
    resize();
});

//加载新闻
function LoadNews() {
    if (lock) {
        return;
    }
    else {
        lock = true;
        $(".loadMore").text("正在加载~~");
        $.ajax({
            url: "/News/getNews",
            type: "post",
            data: { "page": page, "tid": tid },
        }).done(function (data) {
            var str = "";
            console.log(data);
            for (var i = 0 ; i < data.length; i++) {
                str += '<div class="item"><div class="title"><a href="/News/Show/' + data[i].ID + '" target="_blank">' + data[i].Title + '</a></div><div class="desc">' + data[i].Sumamry + '</div><div class="add"></div><div class="cover"> <a href="/News/Show/' + data[i].ID + '" target="_blank"><img class="imgCoursePicM" src="' + data[i].FirstImgUrl + '"></a></div></div>';
            }
            $(".lstNews").append(str);
            if (data.length == 10) {
                lock = false;
                page++;
                $(".loadMore").text("下拉加载更多！");
            } else {
                $(".loadMore").text("没有更多数据了！");
            }
        });
    }
}

//加载课程
function LoadCourses() {
    if (lock) {
        return;
    }
    else {
        lock = true;
        $(".loadMore").text("正在加载~~");
        $.ajax({
            url: "/Course/getCourses",
            type: "get",
            data: { "page": page, "tid": tid },
        }).done(function (data) {
            var str = "";
            for (var i = 0 ; i < data.length; i++) {
                str += '<div class="item"><div class="title"><a href="/Course/Show/' + data[i].ID + '" target="_blank">' + data[i].Title + '</a></div><div class="desc">' + data[i].Sumamry + '</div><div class="add"></div><div class="cover"> <a href="/Course/Show/' + data[i].ID + '" target="_blank"><img class="imgCoursePicM" src="/Course/ShowPicture/' + data[i].ID + '"></a></div></div>';
            }
            $(".lstCourse").append(str);
            if (data.length == 10) {
                lock = false;
                page++;
                $(".loadMore").text("下拉加载更多！");
            } else {
                $(".loadMore").text("没有更多数据了！");
            }
        });
    }
}

// 加载图书
function LoadEBooks() {
    if (lock) {
        return;
    }
    else {
        lock = true;
        $(".loadMore").text("正在加载~~");
        $.ajax({
            url: "/EBook/getEBookes",
            type: "post",
            data: { "page": page, "tid": tid },
        }).done(function (data) {
            var str ="";
            for (var i = 0 ; i < data.length; i++) {
                str += '<div class="item"><div class="title"><a href="/Ebook/WordShow/' + data[i].ID + '" target="_blank">' + data[i].Title + '</a></div><div class="desc">' + data[i].Sumamry + '</div><div class="add"></div><div class="cover"> <a href="/Ebook/WordShow/' + data[i].ID + '" target="_blank"><img class="imgCoursePicM" src="/Ebook/ShowPicture/' + data[i].ID + '"></a></div></div>';
            }
            $(".lstEBook").append(str);
            if (data.length == 10) {
                lock = false;
                page++;
                $(".loadMore").text("下拉加载更多！");
            } else {
                $(".loadMore").text("没有更多数据了！");
            }
        });
    }
}

// 加载搜索结果
function LoadSearchRessult() {
    if (lock) {
        return;
    }
    else {
        lock = true;
        $(".loadMore").text("正在加载~~");
        $.ajax({
            url: "/Home/GetSearchResultMore",
            type: "get",
            data: { "type": $("#hdType").val(), "key": $("#hdKey").val(), "page": page },
        }).done(function (data) {
            var str = "";
            for (var i = 0 ; i < data.length; i++) {
                str += "<div class='Q-pList'><h2><a  href='" + data[i].URL + "' style='color:#000;' class='show'>" + data[i].Title + " </a></h2><p class='sub_title'>时间：" + moment(data[i].Time).format("YYYY-MM-DD HH:mm:ss") + "</p><p>" + data[i].Sumamry + "</p></div>";
            }
            $(".result").append(str);
            if (data.length == 10) {
                lock = false;
                page++;
                $(".loadMore").text("下拉加载更多！");
            } else {
                $(".loadMore").text("没有更多数据了！");
            }
        });
    }
}

// 加载新闻首页的新闻
function LoadIndexNews() {
    if (lock) {
        return;
    }
    else {
        lock = true;
        $(".loadMore").text("正在加载~~");
        $.ajax({
            url: "/News/getNewsByPage",
            type: "get",
            data: { "page": page },
        }).done(function (data) {
            var str = "";
            for (var i = 0 ; i < data.length; i++) {
                str += '<div class="item"><div class="title"><a href="/News/Show/' + data[i].ID + '" target="_blank">' + data[i].Title + '</a></div><div class="info"><span class="date">' + moment(data[i].Time).format("YYYY-MM-DD HH:mm:ss") + '</span> <span class="from"></span><span class="view">浏览次数: ' + data[i].Browses + '</span></div><div class="desc txt-justify"><p>' + data[i].Sumamry + '</p></div></div>';
                //str += "<div class='Q-pList'><h2><a  href='" + data[i].URL + "' style='color:#000;' class='show'>" + data[i].Title + " </a></h2><p class='sub_title'>时间：" + moment(data[i].Time).format("YYYY-MM-DD HH:mm:ss") + "</p><p>" + data[i].Sumamry + "</p></div>";
            }
            $("#lstNews").append(str);
            if (data.length == 10) {
                lock = false;
                page++;
                $(".loadMore").text("下拉加载更多！");
            } else {
                $(".loadMore").text("没有更多数据了！");
            }
        });
    }
}

function Load() {
    if ($(".lstNews").length > 0) {
        LoadNews();
    }
    if ($(".lstCourse").length > 0) {
        LoadCourses();
    }
    if ($(".lstEBook").length > 0) {
        LoadEBooks();
    }
    if ($(".result").length > 0) {
        LoadSearchRessult();
    }

    ///新闻首页加载新闻
    if ($("#lstNews").length > 0) {
        LoadIndexNews();
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

    $("#frmAddNote").submit(function () {
        var userid = $("#userId").val();
        if (userid == "") {
            CastMsg("请先登录，在添加笔记");
            return false;
        }
        return true;
    })

    $("#btnAnswerQuestion").click(function () {
        var userid = $("#userId").val();
        if (userid == "") {
            CastMsg("请先登录，在添加回答问题");
            return false;
        }
        var str = "";
        var answers = $(".answer:checked");
        var count = 0;
        var rate = 1.0;
        var questionCount = 0;
        $.each(answers, function (i, item) {
            var answer = $(item).val();
            var rightAnswer = $(item).parents(".question").children(".roghtanswer").val();
            if (options[answer] != rightAnswer) {
                str = str + "第" + (i + 1) + "题错误，答案应该是" + rightAnswer + "  ";
                questionCount++;
            }
            else {
                str = str + "第" + (i + 1) + "题正确" + "  ";
                count++;
                questionCount++;
            }

        });
        rate = rate * (count * 1.0 / questionCount);
        $.post("/Course/RecordScore", { lid: $("#LessionID").val(), rate: rate }, function (data) {
            CastMsg("记录回答记录成功！");
        })
        $(".warning").html(str);
    });



});

$(document).on('click', function (e) {
    if ($(e.target).attr('data-toggle')) return;
    if ($(e.target).hasClass('pop-menu')) return;
    if ($(e.target).hasClass('nav-item')) return;
    if ($(e.target).parents('.pop-menu').length > 0) return;
    $('.pop-menu').slideUp();
});

function learnLession(data) {
    var authority = $("#hdPlayAuthority").val();
    var user = $("#hdCurrentuser").val();
    if (authority == '1' && user == '') {
        CastMsg("该视屏需要登录之后查看！");
        return false;
    }
    window.location.href = "/Course/LessionDetails/"+data;
}