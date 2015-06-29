using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class ViewPagerController : BaseController
    {
        // GET: ViewPager
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowPicture(int id)
        {
            Models.Viewpager view = new Models.Viewpager();
            view = db.Viewpagers.Find(id);
            return File(view.Picture, "image/jpg");
        }
    }
}