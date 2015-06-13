var options = ['A', 'B', 'C', 'D'];

$(document).ready(function () {
    $("#lsBelonger").change(function () {
        if ($("#lsBelonger").val() != "") {
            $.getJSON("/Admin/GetTypeByBelonger", { "belonger": $("#lsBelonger").val() }, function (data) {
                var str = "<option value='0'>无上级类型</option>";
                for (var i = 0; i < data.length; i++) {
                    str += "<option value='" + data[i].ID + "'>" + data[i].TypeValue + "</option>";
                }
                $("#lsFatherID").html(str);
            });
        }
    });


    $("#lsOneType").change(function () {
        if ($("#lsOneType").val() != 0) {
            $.getJSON("/Admin/GetChildrenTypeByFather", { "father": $("#lsOneType ").val() }, function (data) {
                var str = "";
                for (var i = 0; i < data.length; i++) {
                    str += "<option value='" + data[i].ID + "'>" + data[i].TypeValue + "</option>";
                }
                $("#lsSecondType").html(str);
            });
        }
    });

    $("#btnAddOption").click(function () {
        var optionIndex = $("#txtOptionIndex").val();
        if (parseInt(optionIndex) >= 3) {
            popMsg("最多添加四个选项");
            return;
        }
        var index = parseInt(optionIndex) + 1;
        $("#txtOptionIndex").val(index);
        var option = options[index];

        var str = "<tr class='trAnswer'><td><input type='text' class='textbox w-0-6' value='" + option + "' disabled='disabled' /></td><td><input type='text' class='textbox w-3' name='option' /></td><td><a href='javascript:void(0);' class='btnDeltr'>删除</a></td></tr></tr>";
        $("#lstOption").append(str);
        //  答案删除行
        $('.btnDeltr').unbind().click(function () {
            $(this).parents('.trAnswer').remove();
            var optionIndex = $("#txtOptionIndex").val();
            var index = parseInt(optionIndex) - 1;
            $("#txtOptionIndex").val(index);
            var option = options[index];
        });

        
    });


    $("form").submit(function (e) {
        $.each($(this).find("input[type='text']"), function (i, item) {
            if ($(item).val() == "" && $(item).attr("name") != "undefined" && $(item).attr('class').indexOf('nullable') < 0) {
                $(item).addClass('error');
                e.preventDefault();
                return false;
            }
            else {
                return true;
            }
        });

        $.each($(this).find("select"), function (i, item) {
            if ($(item).val() == "" && $(item).attr("name") != "undefined" && $(item).attr('class').indexOf('nullable') < 0) {
                $(item).addClass('error');
                e.preventDefault();
                return false;
            }
            else {
                return true;
            }
        });

        $.each($(this).find("input[type='file']"), function (i, item) {
            if ($(item).val() == "" && $(item).attr("name") != "undefined" && $(item).attr('class').indexOf('nullable') < 0) {
                $(item).addClass('error');
                e.preventDefault();
                return false;
            }
            else {
                return true;
            }
        });
    });

    $('input').focus(function () {
        $(this).removeClass('error');
    });

    $('select').focus(function () {
        $(this).removeClass('error');
    });

   
});


function popMsg(txt) {
    var msg = $('<div class="msg hide">' + txt + '</div>');
    msg.css('left', '50%');
    $('body').append(msg);
    msg.css('margin-left', '-' + parseInt(msg.outerWidth() / 2) + 'px');
    msg.removeClass('hide');
    setTimeout(function () {
        msg.addClass('hide');
        setTimeout(function () {
            msg.remove();
        }, 400);
    }, 2600);
}


