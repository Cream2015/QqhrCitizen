using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Spider
{
    public class PeopleSpider : Spider
    {
        public PeopleSpider() : base("人民网", "http://edu.people.com.cn/", Encoding.GetEncoding("gb2312")) { }

        protected override List<string> FilterURL(List<string> URLs)
        {
            var ret = URLs.Where(x => x.IndexOf("/n/20") >= 0).Where(x => x.IndexOf("http") < 0).ToList();
            for (var i = 0; i < ret.Count; i++)
                ret[i] = "http://edu.people.com.cn" + ret[i];
            return ret;
        }
        
        protected override string GetContent(string Html, string URL)
        {
            return "<div>" + GetMidTxt(Html, "<div id=\"p_content\" class=\"clearfix\">", "<div class=\"diwen_ad\">");
        }

        protected override string GetTitle(string Html)
        {
            return GetMidTxt(Html, "<title>", "--教育--人民网");
        }
    }
}
