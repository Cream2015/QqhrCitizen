using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace QqhrCitizen.Spider
{
    public class McaSpider : Spider
    {
        public McaSpider() : base("中国民政部", "http://www.mca.gov.cn/article/zwgk/dfxx/ttxx/", Encoding.UTF8) { }

        protected override List<string> FilterURL(List<string> URLs)
        {
            var ret = URLs.Where(x => x.IndexOf("/article/zwgk/dfxx/ttxx/") >= 0).ToList();
            for (var i = 0; i < ret.Count; i++)
                ret[i] = "http://www.mca.gov.cn/article/zwgk/dfxx/ttxx/" + ret[i];
            return ret;
        }

        protected override string GetContent(string Html, string URL)
        {
            return GetMidTxt(Html, "<div id=\"zoom\" class=\"content\">", "<script>currentpage=1;</script>")
                .Replace("<P><P>", "<br />");
        }

        protected override string GetTitle(string Html)
        {
            return GetMidTxt(Html, "<title>", "-中华人民共和国民政部</title>");
        }
    }
}