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
            return View();
        }

        public ActionResult Channel(int id)
        {
            return View();
        }
	}
}