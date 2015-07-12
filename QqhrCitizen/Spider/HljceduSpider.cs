using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Spider
{
    public class HljceduSpider : Spider
    {
        public HljceduSpider() : base("黑龙江社区教育网", "http://www.hljcedu.com/site/sqzx.html", Encoding.UTF8) { }

        protected override List<string> FilterURL(List<string> URLs)
        {
            var ret = URLs.Where(x => x.IndexOf("/detail/") >= 0 && x.IndexOf("http") < 0).ToList();
            for (var i = 0; i < ret.Count; i++)
                ret[i] = "http://www.hljcedu.com/" + ret[i];
            return ret;
        }

        protected override string GetContent(string Html, string URL)
        {
            return GetMidTxt(Html, "<div class=TRS_Editor>", "<div id=\"content_editor\">")
                .Replace("<div class=TRS_Editor>", "")
                .Replace("src=\"./", "src=\"http://www.hljcedu.com/");
        }

        protected override string GetTitle(string Html)
        {
            return GetMidTxt(Html, "<title>", "--黑龙江社区教育网</title>");
        }
    }
}
