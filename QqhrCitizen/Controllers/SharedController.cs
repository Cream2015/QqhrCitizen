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

        public ActionResult Error()
        {
            return View();
        }
        #region MyRegion
        /// <summary>
        /// 访问受限时跳转
        /// </summary>
        /// <returns></returns>
        public ActionResult AccessDenied()
        {
            return Message("您没有权限执行本操作！");
        } 
        #endregion

        
    }
}