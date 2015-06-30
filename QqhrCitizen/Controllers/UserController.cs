﻿using QqhrCitizen.Filters;
using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
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
            ViewBag.Navigation = db.Navigations.ToList();
            return View();
        }

        #region 注册
        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        public ActionResult Register(vRegister model)
        {

            User user1 = new User();
            user1 = db.Users.Where(u => u.Username == model.Username).SingleOrDefault();
            if (user1 == null)
            {
                User user = new User { Username = model.Username, Password = Helpers.Encryt.GetMD5(model.Password), Role = Role.User, Realname = model.Realname, Email = model.Email, Phone = model.Phone, Address = model.Address, Score = 0 };
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
            ViewBag.Navigation = db.Navigations.ToList();
            return View();
        }
        #endregion

        [HttpGet]
        public ActionResult Login()
        {
            ViewBag.Navigation = db.Navigations.ToList();
            if (User.Identity.IsAuthenticated == true)
            {
                return Redirect("/");
            }
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
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
            else
            {
                ModelState.AddModelError("", "登陆信息错误请重新填写！");
            }
            return View(model);
        }

        #region Show
        /// <summary>
        /// Show
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        public ActionResult Show(int id)
        {
            User user = new User();
            user = db.Users.Find(id);
            ViewBag.user = new vUser(user);
            return View();
        }
        #endregion

        #region 修改个人信息
        /// <summary>
        /// 修改个人信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public ActionResult Edit(int id)
        {
            ViewBag.Navigation = db.Navigations.ToList();
            User user = db.Users.Find(id);
            ViewBag.user = user;
            List<SelectListItem> ListSex = new List<SelectListItem>();
            ListSex.Add(new SelectListItem { Text = "女", Value = "0", Selected = user.SexAsInt == 0 ? true : false });
            ListSex.Add(new SelectListItem { Text = "男", Value = "1", Selected = user.SexAsInt == 1 ? true : false });
            ViewBag.Sex = ListSex;
            return View();
        }
        #endregion

        #region 修改个人信息
        /// <summary>
        /// 修改个人信息
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [ValidateSID]
        public ActionResult Edit(vUserEdit model, HttpPostedFileBase file)
        {
            User user = db.Users.Find(model.ID);
            if (ModelState.IsValid)
            {
                FormsAuthentication.SetAuthCookie(model.Username, false);
                ViewBag.user = user;
                user.Username = model.Username;
                user.Age = model.Age;
                user.Sex = model.Sex;
                user.Phone = model.Phone;
                user.Address = model.Address;
                user.Birthday = model.Birthday;
                user.Email = model.Email;
                user.Realname = model.Realname;
                if (file != null)
                {
                    System.IO.Stream stream = file.InputStream;
                    byte[] buffer = new byte[stream.Length];
                    stream.Read(buffer, 0, (int)stream.Length);
                    stream.Close();
                    user.Picture = buffer;
                }
                db.SaveChanges();
                return RedirectToAction("Show/" + model.ID);
            }
            else
            {
                ModelState.AddModelError("", "修改的信息输入错误!");
            }
            ViewBag.user = user;
            return View(model);
        }
        #endregion


        #region 修改个人密码信息
        /// <summary>
        /// 修改个人密码信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public ActionResult PwdEdit(int id)
        {
            User user = db.Users.Find(id);
            ViewBag.user = new vUserPwdEdit(user);
            ViewBag.Navigation = db.Navigations.ToList();
            return View();
        }

        #endregion

        #region 修改个人密码信息
        /// <summary>
        /// 修改个人密码信息
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [ValidateSID]
        public ActionResult PwdEdit(vUserPwdEdit model)
        {
            User user = db.Users.Find(model.ID);
            if (ModelState.IsValid)
            {

                if (!string.IsNullOrEmpty(model.Password))
                {
                    if (!user.Password.Equals(Helpers.Encryt.GetMD5(model.Password)))
                    {
                        return Redirect("/Shared/Info?msg=" + "您输入原始密码错误！");
                    }
                    else
                    {
                        user.Password = Helpers.Encryt.GetMD5(model.PasswordNew);
                        db.SaveChanges();
                        return RedirectToAction("Show/" + model.ID);
                    }
                }
                else
                {
                    db.SaveChanges();
                    return RedirectToAction("Show/" + model.ID);
                }
            }
            else
            {
                ModelState.AddModelError("", "修改的信息输入错误!");
            }
            ViewBag.user = new vUserPwdEdit(user);
            return View(model);
        }
        #endregion

        #region 注销

        /// <summary>
        ///  注销 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ValidateSID]
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }
        #endregion


        [Authorize]
        public ActionResult ShowPicture(int id)
        {
            User user = new User();
            user = db.Users.Find(id);
            return File(user.Picture, "image/jpg");
        }

        [Authorize]
        public ActionResult StudyHistory(int id)
        {
            ViewBag.Navigation = db.Navigations.ToList();
            User user = new User();
            user = db.Users.Find(id);
            ViewBag.user = new vUser(user);
            List<StudyRecord> records = new List<StudyRecord>();
            records = db.StudyRecords.Where(sr => sr.UserID == CurrentUser.ID).OrderByDescending(sr => sr.Time).ToList();


            int courseSum = db.UserCourses.Where(us => us.UserID == CurrentUser.ID).DistinctBy(x => new { x.CourseID }).Count();
            int score = CurrentUser.Score;
            int noteSum = db.Notes.Where(n => n.UserID == CurrentUser.ID).Count();

            ViewBag.CourseSum = courseSum;
            ViewBag.Score = score;
            ViewBag.NoteSum = noteSum;
            ViewBag.Records = records;
            return View();
        }

        [Authorize]
        public ActionResult HistoryCourse(int id)
        {
            ViewBag.Navigation = db.Navigations.ToList();
            User user = new User();
            user = db.Users.Find(id);
            List<UserCourse> lstCourse = db.UserCourses.Where(us => us.UserID == CurrentUser.ID).DistinctBy(x => new { x.CourseID }).OrderByDescending(us => us.Time).ToList();
            ViewBag.user = new vUser(user);
            int courseSum = db.UserCourses.Where(us => us.UserID == CurrentUser.ID).DistinctBy(x => new { x.CourseID }).Count();
            int score = CurrentUser.Score;
            int noteSum = db.Notes.Where(n => n.UserID == CurrentUser.ID).Count();

            ViewBag.CourseSum = courseSum;
            ViewBag.Score = score;
            ViewBag.NoteSum = noteSum;
            ViewBag.LstCourse = lstCourse;
            return View();
        }


        public ActionResult CourseNote(int id)
        {
            ViewBag.Navigation = db.Navigations.ToList();
            User user = new User();
            user = db.Users.Find(id);
            ViewBag.user = new vUser(user);
            List<Note> notes = new List<Note>();
            notes = db.Notes.Where(n => n.UserID == id).OrderByDescending(n => n.Time).ToList();
            int courseSum = db.UserCourses.Where(us => us.UserID == CurrentUser.ID).DistinctBy(x => new { x.CourseID }).Count();
            int score = CurrentUser.Score;
            int noteSum = db.Notes.Where(n => n.UserID == CurrentUser.ID).Count();

            ViewBag.CourseSum = courseSum;
            ViewBag.Score = score;
            ViewBag.NoteSum = noteSum;
            ViewBag.Notes = notes;
            return View();
        }
    }
}