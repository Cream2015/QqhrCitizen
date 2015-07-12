using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Spider
{
    public class MoeSpider : Spider
    {
        public MoeSpider() : base("中国教育部", "http://www.moe.gov.cn/jyb_xwfb/s5148/", Encoding.UTF8) { }

        protected override List<string> FilterURL(List<string> URLs)
        {
            var ret = URLs.Where(x => x.IndexOf("./20") >= 0).ToList();
            for (var i = 0; i < ret.Count; i++)
                ret[i] = "http://www.moe.gov.cn/jyb_xwfb/s5148/" + ret[i].Replace("./", "");
            return ret;
        }

        private string GetURLUp(string URL)
        {
            var length = URL.LastIndexOf('/');
            return URL.Substring(0, length + 1);
        }

        protected override string GetContent(string Html, string URL)
        {
            return GetMidTxt(Html, "<div class=TRS_Editor>", "<div id=\"content_editor\">")
                .Replace("<div class=TRS_Editor>", "")
                .Replace("src=\"./", "src=\"" + GetURLUp(URL));
        }

        protected override string GetTitle(string Html)
        {
            return GetMidTxt(Html, "<title>", " - 中华人民共和国教育部政府门户网站</title>");
        }
    }
}
