﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QqhrCitizen.Helpers;

namespace QqhrCitizen.Spider
{
    public class ApclcSpider : Spider
    {
        public ApclcSpider() : base("享学网", "http://www.apclc.com/indexsjxw.asp", Encoding.UTF8) { }

        protected override List<string> FilterURL(List<string> URLs)
        {
            var ret = URLs.Where(x => x.IndexOf("viewsjxw.asp?unid=") >= 0).ToList();
            for (var i = 0; i < ret.Count; i++)
                ret[i] = "http://www.apclc.com/" + ret[i];
            return ret;
        }

        protected override string GetContent(string Html, string URL)
        {
            return GetMidTxt(Html, "<span id=\"ContentBody\" class=\"font14 fontST color2 content\" style=\"display:block;padding:0px 30px\">", "</span><br><br>")
                .Replace("src=\"../", "src=\"http://www.apclc.com/");
        }

        protected override string GetTitle(string Html)
        {
            return GetMidTxt(Html, "<title>", "_新闻_享学网-中国社区教育信息平台</title>");
        }
    }
}
