using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class BaseController : Controller
    {
        public DB db = new DB();

        public BaseController() { }

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);
            List<TypeDictionary> newsTypes = new List<TypeDictionary>();
            List<vTypeDictionary> _newsTypes = new List<vTypeDictionary>();
            List<News> news = new List<News>();
            List<vNews> _news = new List<vNews>();
            List<TypeDictionary> courseTypes = new List<TypeDictionary>();
            List<vTypeDictionary> _courseTypes = new List<vTypeDictionary>();

            List<ResourceLink> nflinks = new List<ResourceLink>();

            newsTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.News).ToList();
            foreach (var type in newsTypes)
            {
                _newsTypes.Add(new vTypeDictionary(type));
            }

            courseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.Course).ToList();
            foreach (var type in courseTypes)
            {
                _courseTypes.Add(new vTypeDictionary(type));
            }

            #region 最新5条消息
            news = db.News.OrderByDescending(n => n.Time).Take(5).ToList();
            foreach (var item in news)
            {
                _news.Add(new vNews(item));
            }
            #endregion

            nflinks = db.ResourceLinks.Where(l => l.IsHaveFile == false).OrderByDescending(l => l.Time).Take(12).ToList();


            ViewBag.NewsTypes = _newsTypes;
            ViewBag.CourseTypes = _courseTypes;
            ViewBag.News = _news;
            ViewBag.NfLinks = nflinks;
            if (requestContext.HttpContext.User != null && requestContext.HttpContext.User.Identity.IsAuthenticated)
            {
                ViewBag.CurrentUser = (from u in db.Users
                                       where u.Username == requestContext.HttpContext.User.Identity.Name
                                       select u).Single();

                ViewBag.SID = requestContext.HttpContext.Session["SID"].ToString();
                CurrentUser = ViewBag.CurrentUser;
            }
            else
            {
                ViewBag.CurrentUser = null;
            }
        }


        public User CurrentUser { get; set; }


        public ActionResult Message(string msg)
        {
            return RedirectToAction("Info", "Shared", new { msg = msg });
        }
	}
}