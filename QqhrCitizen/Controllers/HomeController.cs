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


	}
}