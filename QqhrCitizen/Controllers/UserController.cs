using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

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

            User user1 = new User();
            user1 = db.Users.Where(u => u.Username == model.Username).SingleOrDefault();
            if (user1 == null)
            {
                User user = new User { Username = model.Username, Password = Helpers.Encryt.GetMD5(model.Password), Role = Role.User };
                user.Birthday = Convert.ToDateTime("2012-1-1");
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
            else
            {
                ModelState.AddModelError("", "用户名不可用！");
            }
            return View();
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

        [HttpGet]
        public ActionResult Login()
        {
            if (User.Identity.IsAuthenticated == true)
            {
                return Redirect("/");
            }
            return View();
        }
        [HttpPost]
        public ActionResult Login(vLogin model)
        {

            if (ModelState.IsValid)
            {
                User user = new User();
                model.Password = Helpers.Encryt.GetMD5(model.Password);
                user = db.Users.Where(u => u.Username == model.Username && u.Password == model.Password).SingleOrDefault();
                if (user == null)
                {
                    ModelState.AddModelError("", "用户名或密码错误！");
                }
                else
                {
                    FormsAuthentication.SetAuthCookie(model.Username, model.RememberMe);
                    return RedirectToAction("Index", "Home");
                }
            }
            return View(model);
        }
    }
}