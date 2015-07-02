using QqhrCitizen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class LiveController : BaseController
    {
        //
        // GET: /Index/
        public ActionResult Index()
        {
            ViewBag.LiveList = db.Lives.ToList();
            return View();
        }

        public ActionResult Channel(int id)
        {
            ViewBag.ChananelID = id;
            return View();
        }


        #region 视频缩略图
        /// <summary>
        /// 视频缩略图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult ShowPicture(int id)
        {
            Live live = new Live();
            live = db.Lives.Find(id);
            return File(live.Picture, "image/jpg");
        }
        #endregion



        public ActionResult Show(int id=0)
        {
            if(id!=0)
            {
                Live live = new Live();
                live = db.Lives.Find(id);
                ViewBag.ShowLive = live;
            }
            else
            {
                Live live = new Live();
                live.LiveURL="rtmp://218.8.130.128:1935/Live/Video1";
                live.Title = "测试";
                ViewBag.ShowLive = live;
            }
            ViewBag.LiveID = id;
            return View();
        }


        public ActionResult Player(string source,string type)
        {
            ViewBag.Source = source;
            ViewBag.Type = type;

            return View();
        }
	}
}