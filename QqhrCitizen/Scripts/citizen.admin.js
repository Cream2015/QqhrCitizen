var options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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
        var index = parseInt(optionIndex) + 1;
        $("#txtOptionIndex").val(index);
        var option = options[index];

        var str = "<tr><td><input type='text' class='textbox w-0-6' value='" + option + "' disabled='disabled' /></td><td><input type='text' class='textbox w-3' name='option' /></td></tr>";
            
        $("#lstOption").append(str);
    });
}); 