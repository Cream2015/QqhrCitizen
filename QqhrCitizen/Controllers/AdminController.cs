using QqhrCitizen.Filters;
using QqhrCitizen.Models.ViewModel;
using QqhrCitizen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using PagedList;
using System.IO;
using QqhrCitizen.Helpers;

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


        #region 类型管理
        /// <summary>
        /// 类型管理
        /// </summary>
        /// <returns></returns>
        [BaseAuth(Roles = "Admin")]
        [HttpGet]
        public ActionResult TypeManager(int page = 1)
        {
            var list = db.TypeDictionaries.OrderByDescending(tp => tp.ID).ToPagedList(page, 10);
            return View(list);
        }
        
        #endregion

        #region 增加类型
        /// <summary>
        /// 增加类型
        /// </summary>
        /// <returns></returns>
        [BaseAuth(Roles = "Admin")]
        [HttpGet]
        public ActionResult AddType()
        {
            return View();
        } 
        #endregion

        #region 增加分类
        /// <summary>
        /// 增加分类
        /// </summary>
        /// <param name="Belonger"></param>
        /// <param name="TypeValue"></param>
        /// <param name="NeedAuthorize"></param>
        /// <param name="FatherID"></param>
        /// <returns></returns>
        [BaseAuth(Roles = "Admin")]
        [HttpPost]
        public ActionResult AddType(TypeBelonger Belonger, string TypeValue, int NeedAuthorize, int FatherID)
        {
            bool flag =  Convert.ToBoolean(NeedAuthorize);
            TypeDictionary type = new TypeDictionary { TypeValue = TypeValue, Belonger = Belonger, NeedAuthorize = flag, FatherID = FatherID, Time = DateTime.Now };
            db.TypeDictionaries.Add(type);
            db.SaveChanges();
            return RedirectToAction("TypeManager");
        } 
        #endregion


        #region 根据模块得到分类
        /// <summary>
        /// 根据模块得到分类
        /// </summary>
        /// <param name="belonger"></param>
        /// <returns></returns>
        [BaseAuth(Roles = "Admin")]
        [HttpGet]
        public ActionResult GetTypeByBelonger(TypeBelonger belonger)
        {
            List<TypeDictionary> TypeDictionaries = new List<TypeDictionary>();
            TypeDictionaries = db.TypeDictionaries.Where(td => td.Belonger == belonger && td.FatherID==0).ToList();
            return Json(TypeDictionaries,JsonRequestBehavior.AllowGet);
        } 
        #endregion


        #region 删除分类字典 一条数据
        /// <summary>
        /// 删除分类字典一条数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ValidateSID]
        [HttpGet]
        public ActionResult TypeDictionaryDelete(int id)
        {
            var TypeDictionary = db.TypeDictionaries.Find(id);
            db.TypeDictionaries.Remove(TypeDictionary);
            db.SaveChanges();
            return RedirectToAction("TypeManager");
        } 
        #endregion


        #region MyReg修改类型字典ion

        /// <summary>
        ///   修改类型字典
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles="Admin")]
        public ActionResult TypeDictionaryEdit(int id)
        {
            var TypeDictionary = db.TypeDictionaries.Find(id);
            return View(TypeDictionary);
        } 
        #endregion


        #region 执行修改类型字典
        /// <summary>
        /// 执行修改类型字典
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modle"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        [BaseAuth(Roles = "Admin")]
        public ActionResult TypeDictionaryEdit(int id, TypeDictionary model)
        {
            var TypeDictionary = new TypeDictionary();
            TypeDictionary = db.TypeDictionaries.Find(id);
            TypeDictionary.Belonger = model.Belonger;
            TypeDictionary.TypeValue = model.TypeValue;
            TypeDictionary.FatherID = model.FatherID;
            TypeDictionary.NeedAuthorize = model.NeedAuthorize;
            db.SaveChanges();
            return RedirectToAction("TypeManager");
        } 
        #endregion


        #region 新闻管理 
        /// <summary>
        /// 新闻管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles="Admin")]
        public ActionResult NewsManager(int page = 1)
        {
            var list = db.News.OrderByDescending(tp => tp.ID).ToPagedList(page, 10);
            return View(list);
        } 
        #endregion

        #region 增加新闻
        /// <summary>
        ///  增加新闻
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult AddNews()
        {
            List<TypeDictionary> newsTypes = new List<TypeDictionary>();
            newsTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.News).ToList();
            ViewBag.Types = newsTypes;
            return View();
        } 
        #endregion


        #region 分类根据父节点得到子节点
        /// <summary>
        ///  分类根据父节点得到子节点
        /// </summary>
        /// <param name="father"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetChildrenTypeByFather(int father)
        {
            var types = db.TypeDictionaries.Where(tp => tp.FatherID == father).ToList();
            return Json(types, JsonRequestBehavior.AllowGet);
        }
        #endregion



        #region 增加新闻
        /// <summary>
        /// 增加新闻
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        [BaseAuth(Roles="Admin")]
        public ActionResult AddNews(News model)
        {
            model.UserID = CurrentUser.ID;
            model.Time = DateTime.Now;
            model.Browses = 0;
            db.News.Add(model);
            db.SaveChanges();
            return RedirectToAction("NewsManager");
        }
        
        #endregion

        #region 新闻删除
        /// <summary>
        /// 新闻删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ValidateSID]
        [BaseAuth(Roles = "Admin")]
        public ActionResult NewsDelete(int id)
        {
            News news = new News();
            news = db.News.Find(id);
            db.News.Remove(news);
            db.SaveChanges();
            return RedirectToAction("NewsManager");
        } 
        #endregion


        #region 新闻修改
        /// <summary>
        /// 新闻修改
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult NewsEdit(int id)
        {
            News news = new News();
            List<TypeDictionary> newsTypes = new List<TypeDictionary>();
            news = db.News.Find(id);
            newsTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.News).ToList();

            var second = new List<TypeDictionary>();
            second = db.TypeDictionaries.Where(td => td.FatherID == news.TypeDictionary.FatherID).ToList();

            ViewBag.Second = second;
            ViewBag.News = news;
            ViewBag.Types = newsTypes;
            return View();
        } 
        #endregion


        #region 执行修改新闻
        /// <summary>
        /// 执行修改新闻
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        [BaseAuth(Roles = "Admin")]
        public ActionResult NewsEdit(News model)
        {
            News news = new News();
            news = db.News.Find(model.ID);
            news.NewsTypeID = model.NewsTypeID;
            news.Title = model.Title;
            news.Content = model.Content;
            db.SaveChanges();
            return RedirectToAction("NewsManager"); 
        } 
        #endregion

        #region 新闻详细信息
        /// <summary>
        ///  新闻详细信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult NewsShow(int id)
        {
            News news = new News();
            news = db.News.Find(id);
            ViewBag.News = news;
            return View();
        } 
        #endregion

        #region 课程管理
        /// <summary>
        /// 新闻管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult CoursesManager(int page = 1)
        {
            var list = db.Courses.OrderByDescending(tp => tp.ID).ToPagedList(page, 10);
            return View(list);
        }
        #endregion

        #region 增加课程
        /// <summary>
        ///  增加新闻
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult AddCourses()
        {
            List<TypeDictionary> CourseTypes = new List<TypeDictionary>();
            CourseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.Course).ToList();
            ViewBag.Types = CourseTypes;
            return View();
        }
        #endregion

        [HttpPost]
        [ValidateSID]
        [BaseAuth(Roles = "Admin")]
        public ActionResult AddCourses(Course model)
        {
            model.UserID = CurrentUser.ID;
            model.Time = DateTime.Now;
            db.Courses.Add(model);
            db.SaveChanges();
            return RedirectToAction("CoursesManager");
        }

        #region 课程删除
        /// <summary>
        /// 新闻删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ValidateSID]
        [BaseAuth(Roles = "Admin")]
        public ActionResult CoursesDelete(int id)
        {
            Course course = new Course();
            course = db.Courses.Find(id);
            db.Courses.Remove(course);
            db.SaveChanges();
            return RedirectToAction("CoursesManager");
        }
        #endregion

        #region 课程修改
        /// <summary>
        /// 新闻修改
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult CoursesEdit(int id)
        {
            Course course = new Course();
            List<TypeDictionary> courseTypes = new List<TypeDictionary>();
            course = db.Courses.Find(id);
            courseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.Course).ToList();

            var second = new List<TypeDictionary>();
            second = db.TypeDictionaries.Where(td => td.FatherID == course.TypeDictionary.FatherID).ToList();

            ViewBag.Second = second;
            ViewBag.Course = course;
            ViewBag.Types = courseTypes;
            return View();
        }
        #endregion
        #region 执行修改课程
        /// <summary>
        /// 执行修改新闻
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        [BaseAuth(Roles = "Admin")]
        public ActionResult CoursesEdit(Course model)
        {
            Course course = new Course();
            course = db.Courses.Find(model.ID);
            course.CourseTypeID = model.CourseTypeID;
            course.Title = model.Title;
            course.Description = model.Description;
            db.SaveChanges();
            return RedirectToAction("CoursesManager");
        }
        #endregion

        #region 课程详细信息
        /// <summary>
        ///  新闻详细信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult CourseShow(int id)
        {
            Course course = new Course();
            course = db.Courses.Find(id);
            ViewBag.Course = course;
            return View();
        }
        #endregion


        #region MyRegion
        /// <summary>
        /// 资源链接
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles="Admin")]
        public ActionResult LinkManager(int page = 1)
        {
            var list = db.ResourceLinks.OrderByDescending(tp => tp.ID).ToPagedList(page, 10);
            return View(list);
        } 
        #endregion

        /// <summary>
        /// 增加链接
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles="Admin")]
        public ActionResult AddLink()
        {
            List<TypeDictionary> CourseTypes = new List<TypeDictionary>();
            CourseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.ResourceLink).ToList();
            ViewBag.Types = CourseTypes;
            return View();
        }

        #region 增加地址链接
        /// <summary>
        ///  增加地址链接
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [BaseAuth(Roles = "Admin")]
        [ValidateSID]
        public ActionResult AddLink(ResourceLink model, HttpPostedFileBase file)
        {
            int fileId = 0;
            if (model.IsHaveFile)
            {
                string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName));
                file.SaveAs(fileName);
                Models.File _file = new Models.File();
                _file.FileTypeID = model.LinkTypeID;
                _file.Path = DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName);
                _file.Time = DateTime.Now;
                _file.ContentType = file.ContentType;
                _file.FileName = file.FileName;
                _file.FileSize = file.ContentLength.ToString();
                db.Files.Add(_file);
                db.SaveChanges();
                fileId = _file.ID;
            }
            ResourceLink link = new ResourceLink();
            link.IsHaveFile = model.IsHaveFile;
            link.LinkTypeID = model.LinkTypeID;
            link.Time = DateTime.Now;
            link.Title = model.Title;
            link.URL = model.URL;
            link.UserID = CurrentUser.ID;
            link.FileID = fileId;
            db.ResourceLinks.Add(link);
            db.SaveChanges();
            return RedirectToAction("LinkManager");
        } 
        #endregion

        #region 链接删除
        /// <summary>
        /// 链接删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult LinkDelete(int id)
        {
            ResourceLink link = new ResourceLink();
            link = db.ResourceLinks.Find(id);
            db.ResourceLinks.Remove(link);
            if (link.IsHaveFile)
            {
                Models.File file = new Models.File();
                file = db.Files.Find(link.FileID);
                var path = Server.MapPath("~/Upload/" + file.Path);
                System.IO.File.Delete(path);
                db.Files.Remove(file);
            }
            db.SaveChanges();
            return RedirectToAction("LinkManager");
        } 
        #endregion

        #region 链接修改
        /// <summary>
        ///  链接修改
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult LinkEdit(int id)
        {
            List<TypeDictionary> CourseTypes = new List<TypeDictionary>();
            CourseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.ResourceLink).ToList();
            ViewBag.Types = CourseTypes;
            ResourceLink link = new ResourceLink();
            link = db.ResourceLinks.Find(id);
            ViewBag.ResourceLink = new vResourceLink(link);
            return View();
        } 
        #endregion


        #region 链接修改
        /// <summary>
        /// 链接修改
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        public ActionResult LinkEdit(ResourceLink model, HttpPostedFileBase file)
        {

            int fileId = 0;
            if (file != null && model.IsHaveFile)
            {
                if (model.FileID != 0)
                {
                    string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName));
                    file.SaveAs(fileName);
                    Models.File _file = new Models.File();
                    _file = db.Files.Find(model.FileID);
                    _file.FileTypeID = model.LinkTypeID;
                    _file.Path = DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName);
                    _file.ContentType = file.ContentType;
                    _file.FileName = file.FileName;
                    _file.FileSize = file.ContentLength.ToString();
                    db.SaveChanges();
                    fileId = _file.ID;
                }
                else
                {
                    string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName));
                    file.SaveAs(fileName);
                    Models.File _file = new Models.File();
                    _file.FileTypeID = model.LinkTypeID;
                    _file.Path = DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName);
                    _file.Time = DateTime.Now;
                    _file.ContentType = file.ContentType;
                    _file.FileName = file.FileName;
                    _file.FileSize = file.ContentLength.ToString();
                    db.Files.Add(_file);
                    db.SaveChanges();
                    fileId = _file.ID;
                }
            }
            if (!model.IsHaveFile)
            {
                if (model.FileID != 0)
                {
                    Models.File _file = new Models.File();
                    _file = db.Files.Find(model.FileID);
                    var path = Server.MapPath("~/Upload/" + _file.Path);
                    System.IO.File.Delete(path);
                    db.Files.Remove(_file);
                    db.SaveChanges();
                    fileId = 0;
                }
            }
            ResourceLink link = new ResourceLink();
            link = db.ResourceLinks.Find(model.ID);
            link.IsHaveFile = model.IsHaveFile;
            link.LinkTypeID = model.LinkTypeID;
            link.Title = model.Title;
            link.URL = model.URL;
            link.FileID = fileId;
            db.SaveChanges();
            return RedirectToAction("LinkManager");
        }

        #endregion

        public ActionResult LinkShow(int id)
        {
            ResourceLink link = new ResourceLink();
            link = db.ResourceLinks.Find(id);
            ViewBag.ResourceLink = new vResourceLink(link);
            return View();
        }
    }
}