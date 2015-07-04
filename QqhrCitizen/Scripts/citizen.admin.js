var options = ['A', 'B', 'C', 'D'];

$(document).ready(function () {

    $('.datetime').datetimepicker();
    $("#lsBelonger").change(function () {
        var str = "<option value='0'>无上级类型</option>";
        if ($("#lsBelonger").val() != "") {
            $.getJSON("/Admin/GetTypeByBelonger", { "belonger": $("#lsBelonger").val() }, function (data) {
                for (var i = 0; i < data.length; i++) {
                    str += "<option value='" + data[i].ID + "'>" + data[i].TypeValue + "</option>";
                }
                $("#lsFatherID").html(str);
            });
        }
        $("#lsFatherID").html(str);
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

   
    $("#frmAddManager").submit(function () {
        var password = $("#txtPassword").val();
        var confirm = $("#txtPasswordConfirm").val();
        if (password == "") {
            popMsg("请填写密码!");
            return false;
        }
        if (confirm == "") {
            popMsg("请填写密码重复!");
            return false;
        }
        if (password != confirm) {
            popMsg("两次密码输入不一致！!");
            return false;
        }
        if (password.length < 6) {
            popMsg("密码的长度不够！");
            return false;
        }
        return true;
    });

    
    $("#frmPasswordReset").submit(function () {
        var password = $("#txtPassword").val();
        var confirm = $("#txtPasswordConfirm").val();
        if (password == "") {
            popMsg("请填写密码!");
            return false;
        }
        if (confirm == "") {
            popMsg("请填写密码重复!");
            return false;
        }
        if (password != confirm) {
            popMsg("两次密码输入不一致！!");
            return false;
        }
        if (password.length < 6) {
            popMsg("密码的长度不够！");
            return false;
        }
        return true;
    });

    $("#IsHaveFile").change(function () {
        if ($("#IsHaveFile").val() == "true") {
            $("#file").removeClass("nullable");
        }
        if ($("#IsHaveFile").val() == "false") {
            $("#file").addClass("nullable");
            $("#file").removeClass("error");
        }
    })
    
    $("#frmEditLink").submit(function () {
        if ($("#slEditLink").val() == "true") {
            if ($("#hdIsHaveFile").val() == "false" && $("#fileEditLink").val() == "") {
                $("#fileEditLink").addClass("error");
                return false;
            }
        }
    });

    $("#frmAddQuestion").submit(function () {
        var content = $("#content").text();
        $("#txtcontent").val(content);
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

function closeDialog() {
    $('.dialog').removeClass('active');
    setTimeout(function () {
        $('.dialog').remove();
    }, 200);
}

function postDelete(url, id) {
    $.post(url, function (data) {
        $('#' + id).remove();
        if (data == 'ok' || data == 'OK')
            popMsg('删除成功');
        else
            popMsg(data);
        closeDialog();
    });
}


function deleteDialog(url, id) {
    var html = '<div class="dialog">' +
        '<h3 class="dialog-title">提示</h3>' +
        '<p>您确认要删除这条记录吗？</p>' +
        '<div class="dialog-buttons"><a href="javascript:postDelete(\'' + url + '\', \'' + id + '\')" class="button red">删除</a> <a href="javascript:closeDialog()" class="button blue">取消</a></div>' +
        '</div>';
    var dom = $(html);
    dom.css('margin-left', -(dom.outerWidth() / 2));
    $('body').append(dom);
    setTimeout(function () { dom.addClass('active'); }, 10);
}