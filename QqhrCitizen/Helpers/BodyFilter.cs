using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace QqhrCitizen.Helpers
{
    public class BodyFilter
    {
        public static string GetHtmlBody(string sHtmlText)
        {
            // 定义正则表达式用来匹配 img 标签
            Regex regImg = new Regex(@"<p[^>]*>[^<]*</p>", RegexOptions.IgnoreCase);

            // 搜索匹配的字符串
            MatchCollection matches = regImg.Matches(sHtmlText);

            int i = 0;

            string ret = "";

            // 取得匹配项列表
            foreach (Match match in matches)
            {
                if(i!=0)
                {
                    ret += match.Value;
                }
                i++;
            }
              

            return ret;
        }
    }
}