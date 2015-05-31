using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class SharedController : BaseController
    {
        // GET: Shared
        public ActionResult Info(string msg)
        {
            ViewBag.Message = msg;
            return View();
        }
    }
}