using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class AdminController : Controller
    {

        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        #region 后台管理登陆
        /// <summary>
        /// 后台管理登陆
        /// </summary>
        /// <returns></returns>
        [Filters.BaseAuth(Roles = "Admin")]
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        } 
        #endregion

      
        [HttpPost]
        public ActionResult Login(vAdminModel model)
        {
            return View();
        }
    }
}