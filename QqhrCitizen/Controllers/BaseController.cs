using QqhrCitizen.Models;
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