function CastMsg(msg) {
    $(document.body).append("<div class='show_public_tips'><p class='show_public_tips_text'>" + msg + "</p></div>");
    $(".show_public_tips").fadeIn();
    setTimeout(function () {
        $(".show_public_tips").fadeOut();
        setTimeout(function () {
            $(".show_public_tips").remove();
        }, 1000);
    }, 2000);
}