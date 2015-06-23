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
            ViewBag.CourseTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.课程 && x.FatherID != null).Take(5).ToList();
            ViewBag.Courses = db.Courses.OrderByDescending(x => x.Time).Take(6).ToList();
            ViewBag.NewsTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.新闻 && x.FatherID != null).Take(5).ToList();
            ViewBag.News = GetTop5News();
            ViewBag.MoreNews = db.News.OrderByDescending(x => x.Time).Take(10).ToList();
            ViewBag.BookTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.电子书 && x.FatherID == null).Take(6).ToList();
            ViewBag.Books = db.EBooks.OrderByDescending(x => x.Time).Take(10).ToList();
            ViewBag.Lives = db.Lives.OrderByDescending(x => x.End).Take(5).ToList();
            return View();
        }

        public ActionResult Search(string key)
        {
            List<News> lstNews = new List<News>();
            List<Course> lstCourse = new List<Course>();
            List<EBook> lstEBook = new List<EBook>();
            lstNews = db.News.Where(n => n.Title.Contains(key) || n.Content.Contains(key)).ToList();
            lstCourse = db.Courses.Where(c => c.Title.Contains(key)).ToList();
            lstEBook = db.EBooks.Where(eb => eb.Title.Contains(key)).ToList();
            ViewBag.LstNews = lstNews;
            ViewBag.LstCourse = lstCourse;
            ViewBag.LstEBook = lstEBook;
            ViewBag.Key = key;
            return View();
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
            else if (type == "ebook")
            {
                var result = db.EBooks.Where(e => e.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
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
    }
}