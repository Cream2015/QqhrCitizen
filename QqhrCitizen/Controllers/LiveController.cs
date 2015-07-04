using QqhrCitizen.Filters;
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
            ViewBag.LiveList = db.Lives.Where(l => l.End > DateTime.Now).OrderByDescending(l => l.Begin).ToList();
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


        [HttpGet]
        [AccessToLive]
        public ActionResult Show(int id = 0)
        {
            if (id != 0)
            {
                Live live = new Live();
                live = db.Lives.Find(id);
                ViewBag.ShowLive = live;
            }
            else
            {
                Live live = new Live();
                live.LiveURL = "rtmp://218.8.130.128:1935/Live/Video1";
                live.Title = "测试";
                ViewBag.ShowLive = live;
            }
            ViewBag.LiveID = id;
            return View();
        }


        public ActionResult Player(string source, string type)
        {
            ViewBag.Source = source;
            ViewBag.Type = type;

            return View();
        }

        /// <summary>
        /// 得到正在进行 或即将进行的直播
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetLivesByPage(int page)
        {
            List<Live> lives = new List<Live>();
            int index = page * 12;
            lives = db.Lives.Where(l => l.End > DateTime.Now).OrderByDescending(l => l.Begin).Skip(index).Take(12).ToList();
            return Json(lives, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 得到往期回顾
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetReviewLivesByPage(int page)
        {
            List<Live> lives = new List<Live>();
            int index = page * 12;
            lives = db.Lives.Where(l => l.End < DateTime.Now).OrderByDescending(l => l.Begin).Skip(index).Take(12).ToList();
            return Json(lives, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Review()
        {
            return View();
        }

        [HttpGet]
        [AccessToLive]
        public ActionResult ReviewShow(int id)
        {
            Live live = db.Lives.Find(id);
            ViewBag.Live = live;
            return View();
        }
    }
}