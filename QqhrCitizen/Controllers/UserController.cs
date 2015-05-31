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
            if (ModelState.IsValid)
            {
                User user1 = new User();
                user1 = db.Users.Where(u => u.Username == model.Username).SingleOrDefault();
                if (user1 != null)
                {
                    ModelState.AddModelError("", "用户名已有人使用");
                }
                else
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
                        ModelState.AddModelError("", "添加用户失败！");
                    }
                }
            }
            else
            {
                ModelState.AddModelError("", "用户名或密码输入不正确");
            }
            return View(model);
        }

        public ActionResult Login()
        {
            return View();
        }
	}
}