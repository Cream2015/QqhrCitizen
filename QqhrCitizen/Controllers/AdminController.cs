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
            bool flag = Convert.ToBoolean(NeedAuthorize);
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
            TypeDictionaries = db.TypeDictionaries.Where(td => td.Belonger == belonger && td.FatherID == 0).ToList();
            return Json(TypeDictionaries, JsonRequestBehavior.AllowGet);
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
        [BaseAuth(Roles = "Admin")]
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
        [BaseAuth(Roles = "Admin")]
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
        [BaseAuth(Roles = "Admin")]
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
        public ActionResult CourseManager(int page = 1)
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
        public ActionResult AddCourse()
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
        public ActionResult AddCourse(Course model)
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
            return RedirectToAction("CourseManager");
        }
        #endregion

        #region 课程详细信息
        /// <summary>
        ///  新闻详细信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles="Admin")]
        public ActionResult CourseShow(int id)
        {
            Course course = new Course();
            course = db.Courses.Find(id);
            ViewBag.Course = new vCourse(course);
            return View();
        }
        #endregion

       
        #region 资源链接
        /// <summary>
        /// 资源链接
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
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
        [BaseAuth(Roles = "Admin")]
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
                string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName));
                file.SaveAs(fileName);
                Models.File _file = new Models.File();
                _file.FileTypeID = model.LinkTypeID;
                _file.Path = DateHelper.GetTimeStamp()  + Path.GetExtension(file.FileName);
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
        [HttpPost]
        [BaseAuth(Roles = "Admin")]
        public ActionResult LinkEdit(ResourceLink model, HttpPostedFileBase file)
        {

            int fileId = 0;
            if (file != null && model.IsHaveFile)
            {
                if (model.FileID != 0)
                {
                    string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName));
                    file.SaveAs(fileName);
                    Models.File _file = new Models.File();
                    _file = db.Files.Find(model.FileID);
                    _file.FileTypeID = model.LinkTypeID;
                    _file.Path = DateHelper.GetTimeStamp()  + Path.GetExtension(file.FileName);
                    _file.ContentType = file.ContentType;
                    _file.FileName = file.FileName;
                    _file.FileSize = file.ContentLength.ToString();
                    db.SaveChanges();
                    fileId = _file.ID;
                }
                else
                {
                    string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName));
                    file.SaveAs(fileName);
                    Models.File _file = new Models.File();
                    _file.FileTypeID = model.LinkTypeID;
                    _file.Path = DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName);
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

        #region 连接详情
        /// <summary>
        /// 连接详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult LinkShow(int id)
        {
            ResourceLink link = new ResourceLink();
            link = db.ResourceLinks.Find(id);
            ViewBag.ResourceLink = new vResourceLink(link);
            return View();
        }
        #endregion


        #region 图书管理
        /// <summary>
        /// 图书管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult EBookManager(int page = 1)
        {
            var list = db.EBooks.OrderByDescending(tp => tp.ID).ToPagedList(page, 10);
            return View(list);
        }
        #endregion


        #region 增加图书
        /// <summary>
        ///   增加图书
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult AddEBook()
        {
            List<TypeDictionary> EBookTypes = new List<TypeDictionary>();
            EBookTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.EBook).ToList();
            ViewBag.Types = EBookTypes;
            return View();
        }
        #endregion


        #region 增加电子书

        /// <summary>
        ///  增加电子书
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [BaseAuth(Roles = "Admin")]
        public ActionResult AddEBook(EBook model, HttpPostedFileBase file)
        {
            int fileId = 0;
            if (file != null)
            {
                string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName));
                file.SaveAs(fileName);
                Models.File _file = new Models.File();
                _file.FileTypeID = model.EBookTypeID;
                _file.Path = DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName);
                _file.Time = DateTime.Now;
                _file.ContentType = file.ContentType;
                _file.FileName = file.FileName;
                _file.FileSize = file.ContentLength.ToString();
                db.Files.Add(_file);
                db.SaveChanges();
                fileId = _file.ID;

                EBook Ebook = new EBook();
                Ebook.Browses = 0;
                Ebook.Title = model.Title;
                Ebook.Description = model.Description;
                Ebook.EBookTypeID = model.EBookTypeID;
                Ebook.FileID = fileId;
                Ebook.Time = DateTime.Now;
                Ebook.UserID = CurrentUser.ID;
                db.EBooks.Add(Ebook);
                db.SaveChanges();
                return RedirectToAction("EBookManager");
            }
            else
            {
                return Redirect("/Admin/AdminMessage?msg=文件不能为空");
            }

        }

        #endregion


        #region 删除电子书
        /// <summary>
        /// 删除电子书
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ValidateSID]
        public ActionResult EBookDelete(int id)
        {
            EBook book = new EBook();
            Models.File file = new Models.File();
            book = db.EBooks.Find(id);
            file = db.Files.Find(book.FileID);
            var path = Server.MapPath("~/Upload/" + file.Path);
            System.IO.File.Delete(path);
            db.Files.Remove(file);
            db.EBooks.Remove(book);
            db.SaveChanges();
            return RedirectToAction("EBookManager");
        }

        #endregion


        #region 图书详情
        /// <summary>
        ///  图书详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult EBookShow(int id)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(id);
            ViewBag.EBook = new vEBook(book);
            return View();
        }
        #endregion


        #region 图书修改
        /// <summary>
        /// 图书修改
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles="Admin")]
        public ActionResult EBookEdit(int id)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(id);
            ViewBag.EBook = book;

            List<TypeDictionary> EBookTypes = new List<TypeDictionary>();
            EBookTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.EBook).ToList();
            ViewBag.Types = EBookTypes;

            var second = new List<TypeDictionary>();
            second = db.TypeDictionaries.Where(td => td.FatherID == book.TypeDictionary.FatherID).ToList();

            ViewBag.Second = second;
            return View();
        }
        #endregion

        #region 修改电子书
        /// <summary>
        ///  修改电子书
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [BaseAuth(Roles = "Admin")]
        public ActionResult EBookEdit(EBook model, HttpPostedFileBase file)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(model.ID);
            book.Title = model.Title;
            book.Description = model.Description;
            book.EBookTypeID = model.EBookTypeID;
            if (file != null)
            {
                Models.File _file = new Models.File();
                _file = db.Files.Find(book.FileID);
                var path = Server.MapPath("~/Upload/" + _file.Path);
                System.IO.File.Delete(path);

                string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp()+ Path.GetExtension(file.FileName));
                file.SaveAs(fileName);
                _file.Path =DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName);
                _file.ContentType = file.ContentType;
                _file.FileName = file.FileName;
                _file.FileSize = file.ContentLength.ToString();
            }
            db.SaveChanges();

            return RedirectToAction("EBookManager");
        } 
        #endregion


        #region 增加课程
        /// <summary>
        /// 增加课程
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles="Admin")]
        public ActionResult AddLession(int id)
        {
            Course course = new Course();
            course = db.Courses.Find(id);
            ViewBag.Course = course;
            return View();
        }
        #endregion


        #region 创建课时
        /// <summary>
        /// 创建课时
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [BaseAuth(Roles="Admin")]
        public ActionResult AddLession(Lession model, HttpPostedFileBase file)
        {
            string fileName = Path.Combine(Request.MapPath("~/Lessions"), DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName));
            file.SaveAs(fileName);
            var path = DateHelper.GetTimeStamp()+ Path.GetExtension(file.FileName);

            model.Path = path;
            model.Time = DateTime.Now;
            db.Lessions.Add(model);
            db.SaveChanges();
            return Redirect("/Admin/CourseShow/" + model.CourseID);
        } 
        #endregion

 
        #region 课程删除
        /// <summary>
        /// 课程删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [ValidateSID]
        public ActionResult LessionDelete(int id)
        {
            Lession lession = new Lession();
            lession = db.Lessions.Find(id);
            var path = Server.MapPath(lession.Path);
            System.IO.File.Delete(path);
            db.Lessions.Remove(lession);
            db.SaveChanges();
            return Redirect("/Admin/CourseShow/"+lession.CourseID);
        } 
        #endregion


        #region 课时编辑
        /// <summary>
        ///  课时编辑
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult LessionEdit(int id)
        {
            Lession lession = new Lession();
            lession = db.Lessions.Find(id);
            ViewBag.Lession = lession;
            return View();
        } 
        #endregion


        #region 课时修改
        /// <summary>
        ///  课时修改
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [BaseAuth(Roles="Admin")]
        public ActionResult LessionEdit(Lession model, HttpPostedFileBase file)
        {
            Lession lession = db.Lessions.Find(model.ID);
            string path = "";
            if (file != null)
            {
                path = Server.MapPath(lession.Path);
                System.IO.File.Delete(path);

                string fileName = Path.Combine(Request.MapPath("~/Lessions"), DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName));
                file.SaveAs(fileName);
                path = DateHelper.GetTimeStamp() + Path.GetExtension(file.FileName);
                lession.Path = path;
            }
            lession.Title = model.Title;
            lession.Description = model.Description;
            lession.Remark = model.Remark;
            db.SaveChanges();
            return Redirect("/Admin/CourseShow/" + lession.CourseID);
        } 
        #endregion



        #region LessionShow
        /// <summary>
        /// 课程显示
        /// </summary>
        /// <returns></returns>
        public ActionResult LessionShow(int id)
        {
            Lession lession = new Lession();
            lession = db.Lessions.Find(id);
            ViewBag.Lession = new vLession(lession);
            return View();
        }
        #endregion


        #region 删除问题
        /// <summary>
        /// 删除问题
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult QuestionDelete(int id)
        {
            Question question = new Question();
            question = db.Questions.Find(id);
            db.Questions.Remove(question);
            db.SaveChanges();
            return Redirect("/Admin/LessionShow/" + question.LessionID);
        } 
        #endregion


        #region 增加问题
        /// <summary>
        /// 增加问题
        /// </summary>
        /// <param name="lid"></param>
        /// <returns></returns>
        [HttpGet]
        [BaseAuth(Roles = "Admin")]
        public ActionResult AddQuestion(int lid)
        {
            ViewBag.LessionID = lid;
            return View();
        } 
        #endregion


        #region 增加问题
        /// <summary>
        /// 增加问题
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [BaseAuth(Roles = "Admin")]
        public ActionResult AddQuestion(Question model)
        {
            var options = Request.Params.GetValues("option");
            string Answers = "";
            for (int i=0;i<options.Count();i++)
            {
                if (i == options.Count() - 1)
                {
                    Answers += options[i];
                }
                else
                {
                    Answers += options[i] + "|";
                }
            }

            model.Answers = Answers;
            model.Time = DateTime.Now;
            db.Questions.Add(model);
            db.SaveChanges();
            return Redirect("/Admin/LessionShow/"+model.LessionID);
        }
        
        #endregion

        /// <summary>
        /// 显示问题
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult QuestionShow(int id)
        {
            Question question = new Question();
            question = db.Questions.Find(id);
            ViewBag.Question = new vQuestion(question);
            return View();
        }

        /// <summary>
        ///  消息
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult AdminMessage(string msg)
        {
            ViewBag.Msg = msg;
            return View();
        }
    }
}