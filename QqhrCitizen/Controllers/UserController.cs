using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class UserController : BaseController
    {
        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Register(vRegister model)
        {
            User user = new User { Username = model.Username, Password = Helper.Encryt.GetMD5(model.Password), Role = Role.User };
            db.Users.Add(user);
            int result = db.SaveChanges();
            if (result > 0)
            {
                return RedirectToAction("Login");
            }
            else
            {
                return Message("注册失败，请重新注册");
            }
       
        }
       
        public ActionResult CheckName(string username)
        {
                User user1 = new User();
                user1 = db.Users.Where(u => u.Username == username).SingleOrDefault();
                if (user1 != null)
                {
                    return Content("NO");
                }
                else
                {
                    return Content("OK");
                }
        }
       

        public ActionResult Login()
        {
            return View();
        }
	}
}