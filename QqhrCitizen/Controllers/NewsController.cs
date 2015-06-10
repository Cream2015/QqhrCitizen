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
            return View();
        }

        #region MyRegion
        /// <summary>
        /// 新闻显示
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Show(int id)
        {
            News news = new News();
            news = db.News.Find(id);
            vNews _news = new vNews(news);
            List<News> lstNews = new List<News>();
            lstNews = db.News.Where(n =>n.NewsTypeID ==news.NewsTypeID && n.ID!=id).OrderByDescending(n=>n.Time).Take(8).ToList();
            ViewBag.News = _news;
            ViewBag.LstNews = lstNews;
            return View();
        } 
        #endregion
	}
}