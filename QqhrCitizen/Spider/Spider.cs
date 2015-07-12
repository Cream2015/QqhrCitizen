using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using QqhrCitizen.Models;
using QqhrCitizen.Helpers;

namespace QqhrCitizen.Spider
{
    public abstract class Spider
    {
        public Spider(string Source, string BaseURL, int Interval = 1000)
        {
            this.Source = Source;
            this.BaseURL = BaseURL;
            this.Interval = Interval;
        }

        private string Source { get; set; }

        private string BaseURL { get; set; }

        private int Interval { get; set; }

        public Task SpiderBegin()
        {
            using (var db = new DB())
            {
                return Task.Factory.StartNew(() =>
                {
                    var html = HttpHelper.HttpGet(BaseURL);
                    var _urls = RegMatchUrl(html);
                    var urls = FilterURL(_urls);
                    foreach (var url in urls)
                    {
                        if (db.SpiderArticles.Any(x => x.URL == url)) continue;
                        Thread.Sleep(Interval);
                        var _html = HttpHelper.HttpGet(url);
                        try
                        {
                            db.SpiderArticles.Add(new SpiderArticle
                            {
                                Time = GetTime(_html),
                                Title = GetTitle(_html),
                                Content = GetContent(_html),
                                Status = SpiderArticleStatus.待审核,
                                NewsID = null,
                                URL = url,
                                Source = Source
                            });
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine(ex.ToString());
                        }
                    }
                    db.SaveChanges();
                });
            }
        }
        protected virtual List<string> FilterURL(List<string> URLs)
        {
            return null;
        }

        protected virtual string GetContent(string Html)
        {
            return null;
        }

        protected virtual string GetTitle(string Html)
        {
            return null;
        }

        protected virtual DateTime GetTime(string Html)
        {
            return DateTime.Now;
        }

        private static List<string> RegMatchUrl(string html)
        {
            List<string> links = new List<string>();
            MatchCollection matches = Regex.Matches(html, "<a(?:\\s+.+?)*?\\s+href=\"([^\"]*?)\".+>(.*?)</a>", RegexOptions.IgnoreCase);
            foreach (Match match in matches)
            {
                string s = match.Groups[1].Value;
                links.Add(s);
            }
            return links;
        }

        protected static string GetMidTxt(string src, string l, string r)
        {
            try
            {
                var begin = src.IndexOf(l) + l.Length;
                var end = src.IndexOf(r);
                return src.Substring(begin, end - begin);
            }
            catch
            {
                return "";
            }
        }
    }
}