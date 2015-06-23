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
            /*string tid =HttpContext.Request.QueryString["tid"].ToString();*/
             List<News> lstNews = new List<News>();
             lstNews = db.News.OrderByDescending(n => n.Browses).ThenByDescending(n=>n.Time).Take(8).ToList();
             /*ViewBag.Tid = tid;
            var type = new TypeDictionary();
            if (tid != "0")
            {
                int id = Convert.ToInt32(tid);
                type = db.TypeDictionaries.Find(id);
            }
            ViewBag.Type = type.TypeValue;*/
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
            News news = new News();
            news = db.News.Find(id);
            news.Browses = news.Browses + 1;
            db.SaveChanges();
            vNews _news = new vNews(news);
            List<News> lstNews = new List<News>();
            lstNews = db.News.Where(n =>n.NewsTypeID ==news.NewsTypeID && n.ID!=id).OrderByDescending(n=>n.Browses).ThenByDescending(n=>n.Time).Take(8).ToList();
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


        getNewsByPage
    }
}