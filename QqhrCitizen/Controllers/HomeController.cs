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

        //
        // GET: /Home/
        public ActionResult Index()
        {

            List<News> news = new List<News>();
            List<vNews> _news = new List<vNews>();

            List<Course> courses = new List<Course>();
            List<vCourse> _courses = new List<vCourse>();

            List<EBook> books = new List<EBook>();
            List<vEBook> _books = new List<vEBook>();

            List<ResourceLink> nflinks = new List<ResourceLink>();
            List<ResourceLink> flinks = new List<ResourceLink>();
            List<vResourceLink> vflinks = new List<vResourceLink>();

            #region 最新5条新闻
            news = db.News.OrderByDescending(n => n.Time).Take(10).ToList();
            foreach (var item in news)
            {
                item.Title = Helpers.String.SubString(item.Title, 22, "");
                _news.Add(new vNews(item));
            }
            #endregion

            #region 最新的5门课程
            courses = db.Courses.OrderByDescending(c => c.Time).Take(10).ToList();
            foreach (var item in courses)
            {
                item.Title = Helpers.String.SubString(item.Title, 22, "");
                _courses.Add(new vCourse(item));
            }
            #endregion

            #region 最新的5门图书
            books = db.EBooks.OrderByDescending(c => c.Time).Take(10).ToList();
            foreach (var item in books)
            {
                item.Title = Helpers.String.SubString(item.Title, 22, "");
                _books.Add(new vEBook(item));
            }
            #endregion

            #region 资源连接
            nflinks = db.ResourceLinks.Where(l => l.IsHaveFile == false).OrderByDescending(l => l.Time).Take(12).ToList();
            flinks = db.ResourceLinks.Where(l => l.IsHaveFile == true).OrderByDescending(l => l.Time).Take(12).ToList();
            foreach (var item in flinks)
            {
                vflinks.Add(new vResourceLink(item));
            }
            #endregion

            ViewBag.News = _news;
            ViewBag.Courses = _courses;
            ViewBag.EBooks = _books;
            ViewBag.NfLinks = nflinks;
            ViewBag.FLinks = vflinks;
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
        public ActionResult SearchResultMore(string type,string key)
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
                return Json(_result,JsonRequestBehavior.AllowGet);
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