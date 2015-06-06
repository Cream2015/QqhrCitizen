using QqhrCitizen.Filters;
using QqhrCitizen.Models.ViewModel;
using QqhrCitizen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace QqhrCitizen.Controllers
{
    public class AdminController : BaseController
    {

        // GET: Admin
        [BaseAuth(Roles = "Admin")]
        public ActionResult Index()
        {
            return View();
        }

        #region 后台管理登陆
        /// <summary>
        /// 后台管理登陆
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }
        #endregion


        #region 执行登陆
        /// <summary>
        /// 执行登陆
        /// </summary>
        /// <param name="username"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Login(string username, string pwd)
        {
            pwd = Helpers.Encryt.GetMD5(pwd);
            User user = db.Users.Where(u => u.Username == username && u.Password == pwd && u.RoleAsInt == 1).FirstOrDefault();
            if (user == null)
            {
                return RedirectToAction("Login");
            }
            else
            {
                FormsAuthentication.SetAuthCookie(username, false);
                return RedirectToAction("Index", "Admin");
            }
        }
        #endregion


        #region 注销

        /// <summary>
        ///  注销 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Admin", "Home");
        }
        #endregion
    }
}