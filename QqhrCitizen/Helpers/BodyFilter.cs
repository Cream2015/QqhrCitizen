using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace QqhrCitizen.Helpers
{
    public class BodyFilter
    {
        public static string HtmlFilter(string src, string ImageUrl)
        {
            try
            {
                var tmp = GetMidTxt(src, "<body>", "</body>");
                tmp = PopTxt(tmp, "</p>");
                tmp = tmp.Replace("<img src=\"", "<img src=\"" + ImageUrl);
                tmp = tmp.Replace("</div>", "");
                return tmp;
            }
            catch
            {
                return src;
            }
        }

        public static string PopTxt(string src, string txt)
        {
            var begin = src.IndexOf(txt) + txt.Length;
            return src.Substring(begin);
        }

        public static string GetMidTxt(string src, string l, string r)
        {
            try
            {
                var begin = src.IndexOf(l) + l.Length;
                var count = src.IndexOf(r) - begin;
                return src.Substring(begin, count);
            }
            catch
            {
                return "";
            }
        }
    }
}