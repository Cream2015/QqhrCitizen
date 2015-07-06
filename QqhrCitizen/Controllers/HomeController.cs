using QqhrCitizen.Filters;
using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class HomeController : BaseController
    {
        private List<News> GetTop5News()
        {
            var ret = new List<News>();
            var i = 0;
            foreach (var n in db.News.AsNoTracking())
            {
                if (n.ImgUrl.Count > 0)
                {
                    ret.Add(n);
                    if (ret.Count > 5)
                        break;
                }
            }
            return ret;
        }

        //
        // GET: /Home/
        public ActionResult Index()
        {
            List<TypeDictionary> courseTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.课程 && x.FatherID == 0).Take(5).ToList();
            foreach (var item in courseTypes)
            {
                item.TypeValue = item.TypeValue.Substring(0, 4);
            }
            ViewBag.CourseTypes = courseTypes;

            ViewBag.Courses = db.Courses.OrderByDescending(x => x.Time).Take(6).ToList();
            ViewBag.NewsTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.新闻 && x.FatherID == 0).Take(5).ToList();
            ViewBag.News = GetTop5News();
            ViewBag.MoreNews = db.News.OrderByDescending(x => x.Time).Take(10).ToList();
            ViewBag.BookTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.电子书 && x.FatherID == 0).Take(6).ToList();
            ViewBag.Books = db.EBooks.OrderByDescending(x => x.Time).Take(10).ToList();
            ViewBag.Lives = db.Lives.OrderByDescending(x => x.End).Take(5).ToList();
            ViewBag.TextLinks = db.ResourceLinks.Where(x => !x.IsHaveFile).ToList();
            ViewBag.ImgLinks = db.ResourceLinks.Where(x => x.IsHaveFile).ToList();
            ViewBag.Pictures = db.Viewpagers.OrderBy(x => x.Priority).ToList();

            ViewBag.Location = db.News.Where(n => n.PlaceAsInt == 0).OrderByDescending(n => n.Time).Take(10).ToList();
            ViewBag.Native = db.News.Where(n => n.PlaceAsInt == 1).OrderByDescending(n => n.Time).Take(10).ToList();
            ViewBag.Menus = db.Menus.ToList();
            var joke = (from j in db.Jokes
                        orderby Guid.NewGuid() ascending
                        select j).FirstOrDefault();
            if (joke == null) ViewBag.Joke = "";
            else ViewBag.Joke = joke.Content;
            return View();
        }

        [ValidateAntiForgeryToken]
        public ActionResult Search(string key)
        {
            List<string> hots = (List<string>)HttpContext.Application["hots"];
            if (hots == null)
            {
                hots = new List<string>();
            }
            int newsCount = db.News.Where(n => n.Title.Contains(key) || n.Content.Contains(key)).OrderByDescending(n => n.Time).Count();
            int courseCount = db.Courses.Where(c => c.Title.Contains(key)).OrderByDescending(c => c.Time).Count();
            int ebookCount = db.EBooks.Where(eb => eb.Title.Contains(key)).OrderByDescending(e => e.Time).Count();
            int liveCount = db.Lives.Where(eb => eb.Title.Contains(key)).OrderByDescending(e => e.Begin).Count();
            int productCount = db.Courses.Where(eb => eb.Title.Contains(key)).OrderByDescending(e => e.Time).Count();

            if (!hots.Contains(key))
            {
                if (hots.Count < 10)
                {
                    hots.Add(key);
                }
                else
                {
                    hots.RemoveAt(0);
                    hots.Add(key);
                }
            }

            HttpContext.Application["hots"] = hots;
            ViewBag.NewsCount = newsCount;
            ViewBag.CourseCount = courseCount;
            ViewBag.EBookCount = ebookCount;
            ViewBag.LiveCount = liveCount;
            ViewBag.ProductCount = productCount;
            ViewBag.Key = key;
            ViewBag.Hots = HttpContext.Application["hots"];
            return View("SearchResult");
        }

        [HttpGet]
        public ActionResult SearchResultMore(string type, string key)
        {
            ViewBag.Type = type;
            ViewBag.Key = key;
            return View();
        }

        [HttpGet]
        public ActionResult GetSearchResultMore(string type, string key, int page)
        {
            int index = page * 10;
            if (type == "news")
            {
                var result = db.News.Where(n => n.Title.Contains(key) || n.Content.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "course")
            {
                var result = db.Courses.Where(c => c.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "ebook")
            {
                var result = db.EBooks.Where(e => e.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "live")
            {
                var result = db.Lives.Where(e => e.Title.Contains(key)).OrderByDescending(n => n.Begin).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "product")
            {
                var result = db.Products.Where(e => e.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }

            return Json(null);
        }

        public ActionResult Test()
        {
            return View();
        }


        public ActionResult Msg()
        {
            return View();
        }


        public ActionResult Test1()
        {
            return View();
        }


    }
}