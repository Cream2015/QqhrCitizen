function Collect(courseid) {
    $.ajax({
        type: 'post',
        async: false,
        url: "/Ajax/AjaxCourse/Collect",
        data: JSON.stringify({ CourseID: courseid }),
        contentType: 'application/json',
        dataType: "text",
        success: function (rs) {
            if (rs) {
                var rs_d = rs.toString().split('|');

                switch (rs_d[0]) {
                    case "-1":
                        parent.Alert(rs_d[1]);
                        break;
                    case "1":
                        parent.Alert(rs_d[1], rs_d[2]);
                        break;
                    case "2":
                        parent.Alert(rs_d[1]);
                        break;
                    case "3":
                        parent.Alert(rs_d[1], function () { GetCourseInfo(courseid); parent.Alert() });
                        break;
                    default:
                        parent.Alert(rs_d[1]);
                        break;
                }
            }
        }
        //,error: function (data) {
        //    Alert("err");
        //}
    });
}

function Attention(courseid) {
    $.ajax({
        type: 'post',
        async: false,
        url: "/Ajax/AjaxCourse/Attention",
        data: JSON.stringify({ CourseID: courseid }),
        contentType: 'application/json',
        dataType: "text",
        success: function (rs) {
            if (rs) {
                var rs_d = rs.toString().split('|');

                switch (rs_d[0]) {
                    case "-1":
                        Alert(rs_d[1]);
                        break;
                    case "1":
                        Alert(rs_d[1], rs_d[2]);
                        break;
                    case "2":
                        Alert(rs_d[1]);
                        break;
                    case "3":
                        Alert(rs_d[1], function () { GetCourseInfo(courseid); Alert() });
                        break;
                    default:
                        Alert(rs_d[1]);
                        break;
                }
            }
        }
        //,error: function (data) {
        //    Alert("err");
        //}
    });
}

function GetCourseInfo(courseid) {
    $.ajax({
        type: 'post',
        url: "/Ajax/AjaxCourse/GetCourseInfo",
        data: JSON.stringify({ CourseID: courseid }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (result) {

            var info1 = $("#info1");
            var info2 = $("#info2");
            var info3 = $("#info3");
            var star = $("#star");

            $("#info1").html("学习人次：0");
            $("#info2").html("已被0人加入到课表");
            $("#info3").html("0人关注了该课程");


            //var date = eval("(" + result + ")")
            if (result) {
                //alert(result)
                //$.each(date, function (index, item) {
                //alert(result.StarLevels);

                var _totalcoursetime = "";
                //if (result.TotalCourseTime > 0) {
                //    _totalcoursetime = result.TotalCourseTime + "课时/";
                //}


                $("#info1").html(_totalcoursetime + "学习人次：" + result.LearningCnt)
                $("#info2").html("已被" + result.PutInCnt + "人加入到课表")
                $("#info3").html(result.PACnt + "人关注了该课程")

                $('#star').removeClass();
                $('#star').addClass("star");

                if (result.StarLevels > 0) {
                    $('#star').addClass("star" + result.StarLevels + "0");
                }
                else {
                    $('#star').addClass("star0");
                }
                //alert(item.StarLevels);
                //})
            }
        }
        //,error: function (errorMsg) {
        //    alert("err");
        //}
    });
}

function GetMightLikeCourse(courseid) {

    $.ajax({
        type: 'post',
        async: false,
        data: JSON.stringify({ CourseID: courseid }),
        url: "/Ajax/AjaxCourse/GetMightLikeCourse",
        contentType: 'application/json; charset=utf-8',
        dataType: "text",
        success: function (result) {
            $('#slide_courselikebyuser').html(result)
        }
        //,error: function (errorMsg) {
        //    alert("err");
        //}
    });
}

function GetWareRecordsDataInCourse(courseid) {
    $.ajax({
        type: 'post',
        async: false,
        url: "/Ajax/AjaxCourse/GetWareRecords",
        data: JSON.stringify({ CourseID: courseid }),
        contentType: 'application/json',
        dataType: "text",
        success: function (result) {
            $('#feed_learningactivitybycourse').append(result)
        }
        //,error: function (errorMsg) {
        //    Alert("err");
        //}
    });
}

function GetWareRecordsDataInIndex() {
    $.ajax({
        type: 'get',
        async: false,
        url: "/Ajax/AjaxCourse/GetCourseRecords",
        contentType: 'application/json',
        dataType: "text",
        success: function (result) {
            $('#feed_learningactivity').append(result)
        }
        //,error: function (errorMsg) {
        //    Alert("err");
        //}
    });
}

function LoadRecord(CourseId) {
    $.ajax({
        type: 'post',
        async: false,
        data: JSON.stringify({ CourseID: CourseId }),
        url: "/Ajax/AjaxCourse/LoadRecord",
        contentType: 'application/json',
        dataType: "text",
        success: function (result) {
            if (result) {
                var rs_d = result.toString().split('|');
                switch (rs_d[0]) {
                    case "1"://学习记录

                        var _target = "";
                        if (rs_d[4] == 5) {
                            _target = "target='_blank'";
                        }
                        $('#Record').empty();
                        $('#Record').append('<p>最后一次学习时间：' + rs_d[2] + '</p>');
                        $('#Record').append('<p>最后学习的课件：' + rs_d[1] + '</p>');
                        $('#Record').append('<p style="text-align: center; border-top: 1px solid #ccc; padding-top: 20px;"><a ' + _target + ' href="/' + rs_d[3] + '" class="btn btn-big btn-orange" style="width: 150px;" target="_blank">继续学习</a></p>');
                        $('#Record').show();
                        break;
                    case "2": //外部课程
                        $('#Record').empty();
                        //$('#Record').append('<p>' + rs_d[2] + '</p>');
                        //$('#Record').append('<p>外部课程</p>');
                        $('#Record').append('<p style="text-align: center; border-top: 1px solid #ccc; padding-top: 20px;"><a target="_blank" href="' + rs_d[1] + '" class="btn btn-big btn-orange" style="width: 150px;" target="_blank">开始学习</a></p>');
                        break;
                    case "3": //没学习记录
                        var _target = "";
                        if (rs_d[3] == 5) {
                            _target = "target='_blank'";
                        }
                        $('#Record').empty();
                        $('#Record').append('<p> 开始学习课件：' + rs_d[1] + '</p>');
                        $('#Record').append('<p style="text-align: center; border-top: 1px solid #ccc; padding-top: 20px;"><a ' + _target + ' href="/' + rs_d[2] + '" class="btn btn-big btn-orange" style="width: 150px;" target="_blank">开始学习</a></p>');
                        break;
                    default:
                        $('#Record').empty();
                        $('#Record').hide();
                        break;

                }


                //<div class="d-courseaction well">
                //<p>最后一次学习时间：2014-02-08 
                //</p>
                //<p>最后学习的课件：甜蜜花园插画房门小挂牌</p>
                //<p style="text-align: center; border-top: 1px solid #ccc; padding-top: 20px;">
                //    <a href="/course/player?courseid=" class="btn btn-big btn-orange" style="width: 150px;">继续学习</a>
                //        </p></div>

            }
        }
        //,error: function (errorMsg) {
        //    Alert("err");
        //}
    });

}

function framereload() {
    var url = $("#CommentFrame").attr("src");
    $("#CommentFrame").attr("src", url);
}

function CreateRecord(CourseId) {
    $.ajax({
        type: 'post',
        async: false,
        data: JSON.stringify({ CourseID: CourseId }),
        url: "/Ajax/AjaxCourse/CreateRecord",
        contentType: 'application/json'
    });
}

function LoadCourse(CourseId) {
    GetCourseInfo(CourseId);
    LoadRecord(CourseId);
    //CreateRecord(CourseId);
    GetMightLikeCourse(CourseId);
    GetWareRecordsDataInCourse(CourseId);
    GetWareInfo(CourseId);
}


function GetWareInfo(courseid) {
    $.ajax({
        type: 'post',
        url: "/Ajax/AjaxWare/GetWareInfo",
        data: JSON.stringify({ CourseId: courseid }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (result) {
            if (result) {
                if (result.length > 0) {
                    $.each(result, function (index, ware) {
                        var course = "";
                        var sign = "";
                        if (ware.CourseTime != null) {
                            course = ware.CourseTime + "课时";
                        }
                        sign = ware.LearningCnt + "人学过";
                        $('#Ware_' + ware.Id).find('.hour').html(course);
                        $('#Ware_' + ware.Id).find('.sign').html(sign);
                    })
                }
            }
        }
        //,error: function (errorMsg) {
        //    alert("err");
        //}
    });
}


function SetStar(CourseId, star) {

    $.ajax({

        type: "post",

        url: "/ajax/AjaxCourse/SetLevel",
        data: { CourseId: CourseId, level: star },
        beforeSend: function (XMLHttpRequest) {
            //ShowLoading();
        },
        success: function (data, textStatus) {

            var rst = $.parseJSON(data);
            if (rst.Result == 1) {
                Alert(rst.Msg);
                $('#pushStar').remove();

                $('#star').removeClass();
                $('#star').addClass("star");
                $('#star').addClass("star" + rst.Star + '0');
            }
            else if (rst.Result == -99) {
                Alert(rst.Msg, "location.href='" + rst.Link + "'");
            }
            else if (rst.Result == -1) {
                Alert(rst.Msg);
                $('#pushStar').remove();
            }
            else {
                Alert("评价失败，请稍后尝试。");
            }
        },

        complete: function (XMLHttpRequest, textStatus) {

            //HideLoading();
        },
        error: function () {

            //请求出错处理
        }
    });
}