function initHistory() {

  $.ajax({
    url: '/home/GetHistory',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    error: function (m) {
      var z = m;
    },
    success: function (a) {
      $('#tih').html('');
      if (a.length > 0) {
        var h = '';
        $.each(a, function (n, v) {
          h += '<div class="tis-item">\r';
          //h += '  <div><a href="javascript:;" title="' + v.Title + '" class="tis-title"><span class="tis-type">[' + v.TypeName + ']</span> ' + v.ShortTitle + '</a></div>\r';
          h += '  <div><span class="tis-type">[' + v.TypeName + ']</span></div>\r';
          //console.log(typeof v.IsToday);
          //var s = v.IsToday ? 'style="display:none;"' : '';
          //h += '  <div class="tis-ed" ' + s + '>' + v.EventDateStr + '</div>\r';
          h += '  <div class="tis-ed"><a href="javascript:;" title="' + v.Title + '" class="tis-title">[' + (v.IsToday ? v.EventDateStr.substr(0, 4) : v.EventDateStr) + '] ' + v.ShortTitle + '</a></div>\r';
          h += '  <div class="tis-content" style="color:#fff; font-size:12px;">' + v.Content + '</div>\r';
          h += '</div>\r';
        });
        h += '<div style="height:6px; overflow:hidden;">&nbsp;</div>\r';
        $('#tih').html(h);
        var minHeight = 314;
        $('#tih').height($('#tih').height() < minHeight ? minHeight : $('#tih').height());
        $('.external-scroll').scrollbar({
          //"scrollx": $('.external-scroll_x'),
          "scrolly": $('.external-scroll_y')
        });
      }
    }
  });

}