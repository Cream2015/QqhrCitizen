using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class NewsController : BaseController
    {
        /// <summary>
        /// 新闻页面 
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            ViewBag.Navigation = db.Navigations.ToList();
            List<News> lstNews = new List<News>();
            lstNews = db.News.OrderByDescending(n => n.Browses).ThenByDescending(n => n.Time).Take(8).ToList();

            
           
            ViewBag.LstNews = lstNews;
            return View();
        }

        #region 新闻显示
        /// <summary>
        /// 新闻显示
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Show(int id)
        {
            ViewBag.Navigation = db.Navigations.ToList();
            News news = new News();
            news = db.News.Find(id);
            news.Browses = news.Browses + 1;
            db.SaveChanges();
            vNews _news = new vNews(news);
            List<News> lstNews = new List<News>();
            lstNews = db.News.Where(n => n.NewsTypeID == news.NewsTypeID && n.ID != id).OrderByDescending(n => n.Browses).ThenByDescending(n => n.Time).Take(8).ToList();
            ViewBag.News = _news;
            ViewBag.LstNews = lstNews;
            return View();
        }
        #endregion

        #region 分页得到新闻
        /// <summary>
        /// 分页得到新闻
        /// </summary>
        /// <param name="page"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult getNews(int page, int tid)
        {
            List<News> lstNews = new List<News>();
            List<vNews> _lstNews = new List<vNews>();
            int index = page * 10;
            if (tid == 0)
            {
                lstNews = db.News.OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
            }
            else
            {
                var inews = db.News.Where(n => n.NewsTypeID == tid);
                var ifnews = db.News.Where(n => n.TypeDictionary.FatherID == tid);
                lstNews = inews.Union(ifnews).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
            }

            foreach (var item in lstNews)
            {
                _lstNews.Add(new vNews(item));
            }

            return Json(_lstNews);
        }
        #endregion

        #region 获取新闻首页的新闻
        /// <summary>
        ///  获取新闻首页的新闻
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getNewsByPage(int page)
        {
            List<News> lstNews = new List<News>();
            List<vNews> _lstNews = new List<vNews>();
            int index = page * 10;

            lstNews = db.News.OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();

            foreach (var item in lstNews)
            {
                _lstNews.Add(new vNews(item));
            }
            return Json(_lstNews,JsonRequestBehavior.AllowGet);
        } 
        #endregion

        #region 发现新闻
        /// <summary>
        /// 发现新闻
        /// </summary>
        /// <returns></returns>
        public ActionResult Discovery(int id)
        {
            ViewBag.Navigation = db.Navigations.ToList();
            List<TypeDictionary> types = new List<TypeDictionary>();
            types = db.TypeDictionaries.Where(t => t.Belonger == TypeBelonger.新闻 && t.FatherID == 0).ToList();
            ViewBag.Tid = id;
            var type = new TypeDictionary();
            if (id != 0)
            {
                type = db.TypeDictionaries.Find(id);
            }
            ViewBag.Type = id;

            ViewBag.Types = types;
            return View();
        }
        #endregion
    }
}