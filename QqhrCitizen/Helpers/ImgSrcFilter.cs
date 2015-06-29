using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Text.RegularExpressions;

namespace QqhrCitizen.Helpers
{
    public static class ImgSrcFilter
    {
        public static List<string> GetHtmlImageUrlList(string sHtmlText)
        {
            // 定义正则表达式用来匹配 img 标签
            Regex regImg = new Regex(@"<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>", RegexOptions.IgnoreCase);

            // 搜索匹配的字符串
            MatchCollection matches = regImg.Matches(sHtmlText);

            int i = 0;

            var ret = new List<string>();

            // 取得匹配项列表
            foreach (Match match in matches)
            {
                if (match.Groups["imgUrl"].Value[0] == '/' || match.Groups["imgUrl"].Value.IndexOf("http") >= 0)
                    ret.Add(match.Groups["imgUrl"].Value);
            }

            return ret;
        }
    }
}