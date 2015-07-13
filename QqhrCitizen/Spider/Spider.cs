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
        public Spider(string Source, string BaseURL, Encoding Encoding, int Interval = 1000)
        {
            this.Source = Source;
            this.BaseURL = BaseURL;
            this.Interval = Interval;
            this.Encoding = Encoding;
        }

        private Encoding Encoding { get; set; }

        private string Source { get; set; }

        private string BaseURL { get; set; }

        private int Interval { get; set; }

        public Task SpiderBegin()
        {
            return Task.Factory.StartNew(() =>
            {
                using (var db = new DB())
                {
                    System.Diagnostics.Debug.WriteLine("正在获取：" + BaseURL);
                    var html = HttpHelper.HttpGet(BaseURL, Encoding);
                    var _urls = RegMatchUrl(html);
                    System.Diagnostics.Debug.WriteLine("获得URL：" + _urls.Count);
                    var urls = FilterURL(_urls);
                    System.Diagnostics.Debug.WriteLine("过滤后剩余：" + urls.Count);
                    foreach (var url in urls)
                    {
                        System.Diagnostics.Debug.WriteLine("正在抓取：" + url);
                        if (db.SpiderArticles.Any(x => x.URL == url)) continue;
                        Thread.Sleep(Interval);
                        var _html = HttpHelper.HttpGet(url, Encoding);
                        try
                        {
                            db.SpiderArticles.Add(new SpiderArticle
                            {
                                Time = GetTime(_html),
                                Title = GetTitle(_html),
                                Content = GetContent(_html, url),
                                Status = SpiderArticleStatus.待审核,
                                NewsID = null,
                                URL = url,
                                Source = Source
                            });
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine(ex.ToString());
                        }
                    }
                }
            });
        }
        protected virtual List<string> FilterURL(List<string> URLs)
        {
            return null;
        }

        protected virtual string GetContent(string Html, string URL = null)
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
            MatchCollection matches = Regex.Matches(html, "href\\s*=\\s*(?:[\"'](?<1>[^\"']*)[\"']|(?<1>\\S+))", RegexOptions.IgnoreCase);
            for (var i = 0; i < matches.Count; i++)
            {
                string s = matches[i].Groups[1].Value;
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