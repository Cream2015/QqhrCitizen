using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class NewsController : BaseController
    {
        //
        // GET: /News/
        public ActionResult News()
        {
            ViewBag.Title = "nihao";
            return View();
        }
	}
}