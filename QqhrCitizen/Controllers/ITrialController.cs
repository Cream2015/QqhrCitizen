using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class ITrialController : BaseController
    {
        // GET: ITrial
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult ShowPicture(int id)
        {
            Models.ITrial itrial = new Models.ITrial();
            itrial = db.ITrials.Find(id);
            return File(itrial.Picture, "image/jpg");
        }
    }
}