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
using Aspose.Words;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using CodeComb.Video;

namespace QqhrCitizen.Controllers
{
    [Authorize]
    public class AdminController : BaseController
    {

        static string fileServer = "http://218.8.130.134:80/";

         

        // GET: Admin
        public ActionResult Index()
        {
            ViewBag.NewsCount = db.News.Count();
            ViewBag.CourseCount = db.Courses.Count();
            ViewBag.EBookCount = db.EBooks.Count();
            ViewBag.LiveCount = db.Lives.Count();
            if (CurrentUser.Role == Role.Business)
            {
                ViewBag.ProductCount = db.Products.Where(p => p.UserID == CurrentUser.ID).Count();
            }
            else
            {
                ViewBag.ProductCount = db.Products.Count();
            }

            return View();
        }

        #region 类型管理
        /// <summary>
        /// 类型管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult TypeManager(string key, DateTime? Begin, DateTime? End, TypeBelonger type, int p = 0)
        {
            IEnumerable<TypeDictionary> query = db.TypeDictionaries.Where(tp => tp.Belonger == type);
            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(c => c.TypeValue.Contains(key));
            }
            if (Begin.HasValue)
            {
                query = query.Where(c => c.Time >= Begin);
            }
            if (End.HasValue)
            {
                query = query.Where(c => c.Time <= End);
            }

            query = query.OrderByDescending(x => x.Time);
            ViewBag.PageInfo = PagerHelper.Do(ref query, 20, p);
            ViewBag.Type = type;
            return View(query);
        }

        #endregion

        #region 增加类型
        /// <summary>
        /// 增加类型
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public ActionResult AddType(TypeBelonger type)
        {
            List<TypeDictionary> list = db.TypeDictionaries.Where(tp => tp.Belonger == type && tp.FatherID == 0).ToList();
            ViewBag.LastTypes = list;
            ViewBag.Type = type;
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

        [HttpPost]
        public ActionResult AddType(TypeBelonger Belonger, string TypeValue, int NeedAuthorize, int FatherID)
        {
            TypeDictionary temp = db.TypeDictionaries.Where(tp => tp.TypeValue == TypeValue.Trim() && tp.Belonger == Belonger).FirstOrDefault();
            if (temp != null)
            {
                return Redirect("/Admin/AdminMessage?msg=你填写的分类名称已经存在！");
            }
            bool flag = Convert.ToBoolean(NeedAuthorize);
            TypeDictionary type = new TypeDictionary { TypeValue = TypeValue, Belonger = Belonger, NeedAuthorize = flag, FatherID = FatherID, Time = DateTime.Now };
            db.TypeDictionaries.Add(type);
            db.SaveChanges();
            return Redirect("/Admin/TypeManager?type=" + Belonger);
        }
        #endregion

        #region 根据模块得到分类
        /// <summary>
        /// 根据模块得到分类
        /// </summary>
        /// <param name="belonger"></param>
        /// <returns></returns>

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
        [HttpPost]
        public ActionResult TypeDictionaryDelete(int id)
        {
            var TypeDictionary = db.TypeDictionaries.Find(id);
            List<TypeDictionary> lstType = new List<Models.TypeDictionary>();
            lstType = db.TypeDictionaries.Where(td => td.FatherID == id).ToList();
            foreach (var item in lstType)
            {
                db.TypeDictionaries.Remove(item);
            }
            db.TypeDictionaries.Remove(TypeDictionary);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 修改类型字典

        /// <summary>
        ///   修改类型字典
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]

        public ActionResult TypeDictionaryEdit(int id)
        {
            var TypeDictionary = db.TypeDictionaries.Find(id);
            var LstFatherTypeDictionary = new List<TypeDictionary>();
            if (TypeDictionary.FatherID == 0)
            {
                LstFatherTypeDictionary = null;
            }
            else
            {
                LstFatherTypeDictionary = db.TypeDictionaries.Where(td => td.ID == (int)TypeDictionary.FatherID).ToList();
            }
            ViewBag.LstFatherTypeDictionary = LstFatherTypeDictionary;
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

        public ActionResult TypeDictionaryEdit(int id, TypeDictionary model)
        {
            var TypeDictionary = new TypeDictionary();
            TypeDictionary = db.TypeDictionaries.Find(id);
            TypeDictionary.Belonger = model.Belonger;
            TypeDictionary.TypeValue = model.TypeValue;
            TypeDictionary.FatherID = model.FatherID;
            TypeDictionary.NeedAuthorize = model.NeedAuthorize;
            db.SaveChanges();
            return Redirect("/Admin/TypeManager?type=" + TypeDictionary.Belonger);
        }



        public ActionResult UploadNewsImg(HttpPostedFileBase upload)
        {
            string callback = Request.QueryString["CKEditorFuncNum"];
            string imgPath = DateHelper.GetTimeStamp() + Path.GetExtension(upload.FileName);
            string fileName = Path.Combine(Request.MapPath("~/NewsImages"), imgPath);
            upload.SaveAs(fileName);
            string path = "/NewsImages/" + imgPath;
            string url = Request.Url.Host + ":" + Request.Url.Port;
            // 返回“图像”选项卡并显示图片  
            return Content("<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction(" + callback + ",'" + path + "')</script>");

        }
        #endregion

        #region 新闻管理
        /// <summary>
        /// 新闻管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]

        public ActionResult NewsManager(string key, DateTime? Begin, DateTime? End, int p = 0)
        {
            IEnumerable<News> query = db.News.AsEnumerable();
            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(c => c.Title.Contains(key));
            }
            if (Begin.HasValue)
            {
                query = query.Where(c => c.Time >= Begin);
            }
            if (End.HasValue)
            {
                query = query.Where(c => c.Time <= End);
            }
            query = query.OrderByDescending(x => x.Time);
            ViewBag.PageInfo = PagerHelper.Do(ref query, 50, p);
            return View(query);
        }
        #endregion

        #region 增加新闻
        /// <summary>
        ///  增加新闻
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult AddNews()
        {
            List<TypeDictionary> newsTypes = new List<TypeDictionary>();
            newsTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.新闻).ToList();
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
        [ValidateInput(false)]
        public ActionResult AddNews(News model, HttpPostedFileBase file)
        {
            var random = DateHelper.GetTimeStamp();
            var message = "";
            if (file != null)
            {
                string fileName = Path.Combine(Request.MapPath("~/Upload/NewsWord"), random + Path.GetFileName(file.FileName));
                file.SaveAs(fileName);
                NewsWordToHtml(fileName, random);
                message = string.Empty;
                //message = System.IO.File.OpenText(fileName).ReadToEnd();
                var fiepath = Path.Combine(Request.MapPath("~/Upload/NewsWord/" + random), random + ".html");
                using (StreamReader sr = new StreamReader(fiepath, System.Text.Encoding.UTF8))
                {
                    message = sr.ReadToEnd();
                }
                message = BodyFilter.HtmlFilter(message, "/Upload/NewsWord/" + random + "/");
                model.Content = message;
                model.IsWord = true;
            }
            else
            {
                model.IsWord = false;
            }
            model.UserID = CurrentUser.ID;
            model.Time = DateTime.Now;
            model.Browses = 0;
            model.PlaceAsInt = 0;

            if (model.IsHaveImg)
            {
                if (file != null)
                {
                    string[] imgs = Helpers.String.GetHtmlImageUrlList(message);
                    model.FirstImgUrl = "/Upload/NewsWord/" + random + "/" + imgs[0];
                }
                else
                {
                    string[] imgs = Helpers.String.GetHtmlImageUrlList(model.Content);
                    model.FirstImgUrl = imgs[0];
                }

            }
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
        [HttpPost]
        [ValidateSID]

        public ActionResult NewsDelete(int id)
        {
            News news = new News();
            news = db.News.Find(id);
            db.News.Remove(news);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 新闻修改
        /// <summary>
        /// 新闻修改
        /// </summary>
        /// <returns></returns>
        [HttpGet]

        public ActionResult NewsEdit(int id)
        {
            News news = new News();
            List<TypeDictionary> newsTypes = new List<TypeDictionary>();
            news = db.News.Find(id);
            newsTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.新闻).ToList();

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
        [ValidateInput(false)]

        public ActionResult NewsEdit(News model, HttpPostedFileBase file)
        {
            News news = new News();
            news = db.News.Find(model.ID);
            var random = DateHelper.GetTimeStamp();
            var message = "";
            if (file != null)
            {
                string fileName = Path.Combine(Request.MapPath("~/Upload/NewsWord"), random + Path.GetFileName(file.FileName));
                file.SaveAs(fileName);
                NewsWordToHtml(fileName, random);
                message = string.Empty;
                //message = System.IO.File.OpenText(fileName).ReadToEnd();
                var fiepath = Path.Combine(Request.MapPath("~/Upload/NewsWord/" + random), random + ".html");
                using (StreamReader sr = new StreamReader(fiepath, System.Text.Encoding.UTF8))
                {
                    message = sr.ReadToEnd();
                }
                message = BodyFilter.HtmlFilter(message, "/Upload/NewsWord/" + random + "/");
                news.Content = message;
                news.IsWord = true;
            }
            else
            {
                model.IsWord = false;
                news.Content = model.Content;
            }
            if (model.IsHaveImg)
            {
                if (file != null)
                {
                    string[] imgs = Helpers.String.GetHtmlImageUrlList(message);
                    news.FirstImgUrl = "/Upload/NewsWord/" + random + "/" + imgs[0];
                }
                else
                {
                    string[] imgs = Helpers.String.GetHtmlImageUrlList(model.Content);
                    news.FirstImgUrl = imgs[0];
                }

            }
            news.NewsTypeID = model.NewsTypeID;
            news.Title = model.Title;
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

        public ActionResult CourseManager(string key, DateTime? Begin, DateTime? End, int p = 0)
        {


            IEnumerable<Course> query = db.Courses.AsEnumerable();
            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(c => c.Title.Contains(key));
            }
            if (Begin.HasValue)
            {
                query = query.Where(c => c.Time >= Begin);
            }
            if (End.HasValue)
            {
                query = query.Where(c => c.Time <= End);
            }


            //  var list = db.Courses.OrderByDescending(tp => tp.ID).ToPagedList(page, 10);
            query = query.OrderByDescending(x => x.Time);
            ViewBag.PageInfo = PagerHelper.Do(ref query, 50, p);
            return View(query);
        }
        #endregion

        #region 增加课程
        /// <summary>
        ///  增加新闻
        /// </summary>
        /// <returns></returns>
        [HttpGet]

        public ActionResult AddCourse()
        {
            List<TypeDictionary> CourseTypes = new List<TypeDictionary>();
            CourseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.课程).ToList();
            ViewBag.Types = CourseTypes;
            return View();
        }


        [HttpPost]
        [ValidateSID]

        public ActionResult AddCourse(Course model, HttpPostedFileBase file)
        {
            model.UserID = CurrentUser.ID;
            model.Time = DateTime.Now;

            System.IO.Stream stream = file.InputStream;
            byte[] buffer = new byte[stream.Length];
            stream.Read(buffer, 0, (int)stream.Length);
            stream.Close();
            model.Picture = buffer;
            db.Courses.Add(model);

            db.SaveChanges();


            string root = "~/Lessions/" + model.Title + "/";
            var phicyPath = HostingEnvironment.MapPath(root);
            Directory.CreateDirectory(phicyPath);

            return RedirectToAction("CourseManager");
        }
        #endregion

        #region 课程删除
        /// <summary>
        /// 新闻删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]

        public ActionResult CoursesDelete(int id)
        {
            Course course = new Course();
            course = db.Courses.Find(id);
            db.Courses.Remove(course);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 课程修改
        /// <summary>
        /// 新闻修改
        /// </summary>
        /// <returns></returns>
        [HttpGet]

        public ActionResult CoursesEdit(int id)
        {
            Course course = new Course();
            List<TypeDictionary> courseTypes = new List<TypeDictionary>();
            course = db.Courses.Find(id);
            courseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.课程).ToList();

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

        public ActionResult CoursesEdit(Course model)
        {
            Course course = new Course();
            course = db.Courses.Find(model.ID);
            course.CourseTypeID = model.CourseTypeID;
            course.Title = model.Title;
            course.Description = model.Description;
            //course.Authority = model.Authority;
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

        public ActionResult CourseShow(int id)
        {
            CourseQuestion coursequestion = new CourseQuestion();
            List<CourseQuestion> coursequestions = db.CourseQuestions.Where(cq => cq.CourseID == id).ToList();
            List<vCourseQuestion> coursequestionlist = new List<vCourseQuestion>();
            foreach (var item in coursequestions)
            {
                coursequestionlist.Add(new vCourseQuestion(item));
            }
            ViewBag.CourseQuestions = coursequestionlist;
            Course course = new Course();
            course = db.Courses.Find(id);
            ViewBag.Course = course;
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

        public ActionResult LinkManager(string key, DateTime? Begin, DateTime? End, int p = 0)
        {

            IEnumerable<ResourceLink> query = db.ResourceLinks.AsEnumerable();
            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(c => c.Title.Contains(key));
            }
            if (Begin.HasValue)
            {
                query = query.Where(c => c.Time >= Begin);
            }
            if (End.HasValue)
            {
                query = query.Where(c => c.Time <= End);
            }
            query = query.OrderByDescending(x => x.Time);
            ViewBag.PageInfo = PagerHelper.Do(ref query, 50, p);
            return View(query);
        }
        #endregion

        #region 增加地址链接
        /// <summary>
        /// 增加链接
        /// </summary>
        /// <returns></returns>
        [HttpGet]

        public ActionResult AddLink()
        {
            List<TypeDictionary> CourseTypes = new List<TypeDictionary>();
            CourseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.资源链接).ToList();
            ViewBag.Types = CourseTypes;
            return View();
        }


        /// <summary>
        ///  增加地址链接
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
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
        [HttpPost]
        [ValidateSID]
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
            return Content("ok");
        }
        #endregion

        #region 链接修改
        /// <summary>
        ///  链接修改
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]

        public ActionResult LinkEdit(int id)
        {
            List<TypeDictionary> CourseTypes = new List<TypeDictionary>();
            CourseTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.资源链接).ToList();
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

        #region 连接详情
        /// <summary>
        /// 连接详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]

        public ActionResult LinkShow(int id)
        {
            ResourceLink link = new ResourceLink();
            link = db.ResourceLinks.Find(id);
            ViewBag.ResourceLink = new vResourceLink(link);
            return View();
        }
        #endregion

        #region 电子书管理
        /// <summary>
        /// 电子书管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]

        public ActionResult EBookManager(string key, DateTime? Begin, DateTime? End, int p = 0)
        {
            IEnumerable<EBook> query = db.EBooks.AsEnumerable();
            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(c => c.Title.Contains(key));
            }
            if (Begin.HasValue)
            {
                query = query.Where(c => c.Time >= Begin);
            }
            if (End.HasValue)
            {
                query = query.Where(c => c.Time <= End);
            }
            query = query.OrderByDescending(x => x.Time);
            ViewBag.PageInfo = PagerHelper.Do(ref query, 50, p);
            return View(query);
        }
        #endregion

        #region 增加电子书
        /// <summary>
        ///   增加电子书
        /// </summary>
        /// <returns></returns>
        [HttpGet]

        public ActionResult AddEBook()
        {
            List<TypeDictionary> EBookTypes = new List<TypeDictionary>();
            EBookTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.电子书).ToList();
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

        public ActionResult AddEBook(EBook model, HttpPostedFileBase file, HttpPostedFileBase file1)
        {
            var random = DateHelper.GetTimeStamp();
            int fileId = 0;
            if (file != null)
            {
                string fileName = Path.Combine(Request.MapPath("~/Upload/EBook"), random + Path.GetExtension(file.FileName));
                file.SaveAs(fileName);
                Models.File _file = new Models.File();
                _file.FileTypeID = model.EBookTypeID;
                _file.Path = random + Path.GetExtension(file.FileName);
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
                Ebook.Author = model.Author;

                System.IO.Stream stream = file1.InputStream;
                byte[] buffer = new byte[stream.Length];
                stream.Read(buffer, 0, (int)stream.Length);
                stream.Close();
                Ebook.Picture = buffer;

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
        [HttpPost]
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
            return Content("ok");
        }

        #endregion

        #region 电子书详情
        /// <summary>
        ///  电子书详情
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

        #region 电子书修改
        /// <summary>
        /// 电子书修改
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]

        public ActionResult EBookEdit(int id)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(id);
            ViewBag.EBook = book;

            List<TypeDictionary> EBookTypes = new List<TypeDictionary>();
            EBookTypes = db.TypeDictionaries.Where(td => td.FatherID == 0 && td.Belonger == TypeBelonger.电子书).ToList();
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

                string fileName = Path.Combine(Request.MapPath("~/Upload"), DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName));
                file.SaveAs(fileName);
                _file.Path = DateHelper.GetTimeStamp() + Path.GetFileName(file.FileName);
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

        public ActionResult AddLession(Lession model, HttpPostedFileBase file)
        {
            var temp = db.Lessions.Where(l => l.CourseID == model.CourseID && l.Title == model.Title).FirstOrDefault();
            if (temp != null)
            {
                return Redirect("/Admin/AdminMessage?msg=该课时已经存在！");
            }

            var radom = DateHelper.GetTimeStamp();
            var course = db.Courses.Find(model.CourseID);
            string root = "~/Lessions/" + course.Title + "/";
            var phicyPath = HostingEnvironment.MapPath(root);

            file.SaveAs(phicyPath + file.FileName);

            var exten = Path.GetExtension(file.FileName);

            if (!exten.Equals(".flv"))
            {
                var video = new VideoFile(phicyPath + file.FileName);
                video.Convert(".flv", Quality.Medium).MoveTo(phicyPath + radom + ".flv");
                model.Path = fileServer + "Lessions/" + course.Title + "/" + radom + ".flv";
                if (System.IO.File.Exists(phicyPath + file.FileName))
                {
                    //如果存在则删除
                    System.IO.File.Delete(phicyPath + file.FileName);
                }
            }
            else
            {
                model.Path = fileServer + "Lessions/" + course.Title + "/" + file.FileName;
            }
           // model.Path = fileServer + "Lessions/" + course.Title + "/" + file.FileName;
            model.Time = DateTime.Now;
            model.ContentType = file.ContentType;
            model.Browses = 0;

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
        [HttpPost]
        [ValidateSID]
        public ActionResult LessionDelete(int id)
        {
            Lession lession = new Lession();
            lession = db.Lessions.Find(id);
            var path = Server.MapPath("~/" + lession.Path.Replace(fileServer, ""));
            System.IO.File.Delete(path);
            db.Lessions.Remove(lession);
            db.SaveChanges();
            return Content("ok");

        }
        #endregion

        #region 课时编辑
        /// <summary>
        ///  课时编辑
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]

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

        public ActionResult LessionEdit(Lession model, HttpPostedFileBase file)
        {
            Lession lession = db.Lessions.Find(model.ID);
            Course course = db.Courses.Find(lession.CourseID);
            string path = "";
            if (file != null)
            {
                var oldPath = Server.MapPath("~/" + lession.Path.Replace(fileServer, ""));
                System.IO.File.Delete(oldPath);

                string root = "~/Lessions/" + course.Title + "/";
                var phicyPath = HostingEnvironment.MapPath(root);
                file.SaveAs(phicyPath + file.FileName);

                path = fileServer + "Lessions/" + course.Title + "/" + file.FileName;
                lession.Path = path;
            }
            lession.Title = model.Title;
            lession.Description = model.Description;
            lession.Remark = model.Remark;
            db.SaveChanges();
            return Redirect("/Admin/CourseShow/" + lession.CourseID);
        }
        #endregion

        #region 课时显示
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
        [HttpGet]
        [ValidateSID]
        public ActionResult QuestionDelete(int id)
        {
            Question question = new Question();
            question = db.Questions.Find(id);
            db.Questions.Remove(question);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 增加问题
        /// <summary>
        /// 增加问题
        /// </summary>
        /// <param name="lid"></param>
        /// <returns></returns>
        [HttpGet]

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
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public ActionResult AddQuestion(Question model)
        {
            var options = Request.Params.GetValues("option");
            string Answers = "";
            for (int i = 0; i < options.Count(); i++)
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
            return Redirect("/Admin/LessionShow/" + model.LessionID);
        }

        #endregion

        #region 显示问题
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
        #endregion

        #region 管理员管理
        /// <summary>
        ///  管理员管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ManagerManage(int page = 1)
        {
            var list = db.Users.Where(u => u.RoleAsInt > 0).OrderBy(u => u.ID).ToPagedList(page, 10);
            return View(list);
        }
        #endregion

        #region 增加管理员
        /// <summary>
        ///  增加管理员
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult AddManager()
        {
            return View();
        }
        #endregion

        #region 增加管理员
        /// <summary>
        /// 增加管理员
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult AddManager(User model)
        {
            model.Password = Helpers.Encryt.GetMD5(model.Password);
            db.Users.Add(model);
            db.SaveChanges();
            return Redirect("/Admin/ManagerManage");
        }
        #endregion

        #region 管理员删除
        /// <summary>
        ///  删除管理员
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        public ActionResult ManagerDelete(int id)
        {
            User user = new User();
            user = db.Users.Find(id);
            db.Users.Remove(user);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 管理员展示
        /// <summary>
        ///  管理员展示
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult ManagerShow(int id)
        {
            User user = new User();
            user = db.Users.Find(id);
            ViewBag.User = user;
            return View();
        }
        #endregion

        #region 管理员密码重置
        /// <summary>
        ///  管理员密码重置
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult UpdateManagerPwd(int id)
        {
            User user = new User();
            user = db.Users.Find(id);
            ViewBag.User = user;
            return View();
        }
        #endregion

        #region 管理员密码重置
        /// <summary>
        ///  管理员密码重置
        /// </summary>
        /// <param name="password"></param>
        /// <param name="uid"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        public ActionResult UpdateManagerPwd(string password, int uid)
        {
            User user = new Models.User();
            user = db.Users.Find(uid);
            user.Password = Helpers.Encryt.GetMD5(password);
            db.SaveChanges();
            return Redirect("/Admin/ManagerManage");
        }
        #endregion

        #region 角色重置

        /// <summary>
        ///  角色重置
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult RoleUpdate(int id)
        {
            User user = new User();
            user = db.Users.Find(id);
            ViewBag.User = user;
            return View();
        }
        #endregion

        #region 执行角色重置
        /// <summary>
        ///  执行角色重置
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        public ActionResult RoleUpdate(Role role, int uid)
        {
            User user = new Models.User();
            user = db.Users.Find(uid);
            user.Role = role;
            db.SaveChanges();
            return Redirect("/Admin/ManagerManage");
        }
        #endregion

        #region 管理员消息
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
        #endregion

        #region Word转换Html
        private string NewsWordToHtml(string wordFileName, string fileName)
        {
            Aspose.Words.Document d = new Aspose.Words.Document(wordFileName);
            string filePhysicalPath = "/Upload/NewsWord/" + fileName + "/";
            string filepath = Server.MapPath(filePhysicalPath);

            if (!Directory.Exists(filePhysicalPath))
            {
                Directory.CreateDirectory(filepath);
                d.Save(Server.MapPath(filePhysicalPath + fileName + ".html"), SaveFormat.Html);
                return Server.MapPath(filePhysicalPath + fileName + ".html");
            }
            else
            {
                return Server.MapPath(".." + filePhysicalPath + fileName + ".html");
            }
        }
        #endregion

        #region 首页轮播管理
        /// <summary>
        ///  首页轮播管理
        /// </summary>
        /// <returns></returns>
        public ActionResult ViwepagerManager()
        {
            ViewBag.Viwepagers = db.Viewpagers.ToList();
            return View();
        }
        #endregion

        #region 增加轮播
        [HttpGet]
        public ActionResult AddViwepager()
        {
            return View();
        }
        [HttpPost]
        [ValidateSID]
        [ValidateInput(false)]
        public ActionResult AddViwepager(Viewpager model, HttpPostedFileBase file)
        {

            System.IO.Stream stream = file.InputStream;
            byte[] buffer = new byte[stream.Length];
            stream.Read(buffer, 0, (int)stream.Length);
            stream.Close();
            model.Picture = buffer;
            db.Viewpagers.Add(model);

            db.SaveChanges();
            return RedirectToAction("ViwepagerManager");
        }
        #endregion

        #region 展示轮播详细
        [HttpGet]
        public ActionResult ViwepagerShow(int id)
        {
            ViewBag.ViwepagerShow = db.Viewpagers.Find(id);
            return View();
        }
        #endregion

        #region 修改轮播
        [HttpGet]
        public ActionResult ViwepagerEdit(int id)
        {
            ViewBag.ViwepaherShow = db.Viewpagers.Find(id);
            return View();
        }

        /// <summary>
        /// 轮播修改
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public ActionResult ViwepagerkEdit(Viewpager model, HttpPostedFileBase file)
        {
            Viewpager viewpager = new Viewpager();
            viewpager = db.Viewpagers.Find(model.ID);
            if (file != null)
            {
                System.IO.Stream stream = file.InputStream;
                byte[] buffer = new byte[stream.Length];
                stream.Read(buffer, 0, (int)stream.Length);
                stream.Close();
                model.Picture = buffer;
                viewpager.Picture = model.Picture;
            }
            
            viewpager.Title = model.Title;
            viewpager.Subtitle = model.Subtitle;
            viewpager.Url = model.Url;
            viewpager.Priority = model.Priority;
           

            db.SaveChanges();
            return RedirectToAction("ViwepagerManager");
        }
        #endregion

        #region 删除轮播
        // <summary>
        /// 删除轮播
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult ViwepagerDelete(int id)
        {
            Viewpager viewpager = db.Viewpagers.Find(id);
            db.Viewpagers.Remove(viewpager);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 导航管理
        /// <summary>
        /// 导航管理
        /// </summary>
        /// <returns></returns>
        public ActionResult NavigationManager()
        {
            ViewBag.Navigations = db.Navigations.ToList();
            return View();
        }
        #endregion

        #region 增加导航
        /// <summary>
        /// 增加导航
        /// </summary>
        /// <returns></returns>
        public ActionResult AddNavigation()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult AddNavigation(Navigation model)
        {
            Navigation nav = new Navigation();
            nav.Title = model.Title;
            nav.Url = model.Url;
            nav.Nav_Id = "Null";
            nav.Km_st_Id = "Null";

            db.Navigations.Add(nav);
            db.SaveChanges();
            return RedirectToAction("NavigationManager");
        }
        #endregion

        #region 展示导航详细
        public ActionResult NavigationShow(int id)
        {
            ViewBag.Navigation = db.Navigations.Find(id);
            return View();
        }
        #endregion

        #region 导航删除
        public ActionResult NavigationDelete(int id)
        {
            Navigation navigation = db.Navigations.Find(id);
            db.Navigations.Remove(navigation);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region
        public ActionResult NavigationEdit(int id)
        {
            ViewBag.NavigationShow = db.Navigations.Find(id);
            return View();
        }

        [HttpPost]
        [ValidateSID]
        [ValidateInput(false)]
        public ActionResult NavigationEdit(Navigation model)
        {
            Navigation navigation = new Navigation();
            navigation = db.Navigations.Find(model.ID);
            navigation.Title = model.Title;
            navigation.Url = model.Url == null ? "Null" : model.Url;
            db.SaveChanges();
            return RedirectToAction("NavigationManager");
        }
        #endregion

        #region 笑话管理
        public ActionResult JokeManager()
        {
            ViewBag.JokeShow = db.Jokes.ToList();
            return View();
        }

        #endregion

        #region 笑话增加
        public ActionResult AddJoke()
        {
            return View();
        }

        [HttpPost]
        [ValidateSID]
        [ValidateInput(false)]
        public ActionResult AddJoke(Joke model)
        {
            model.Time = DateTime.Now;
            db.Jokes.Add(model);
            db.SaveChanges();
            return RedirectToAction("JokeManager");
        }
        #endregion

        #region 笑话删除
        public ActionResult JokeDelete(int id)
        {
            Joke joke = db.Jokes.Find(id);
            db.Jokes.Remove(joke);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 笑话修改
        public ActionResult JokeEdit(int id)
        {
            ViewBag.JokeShow = db.Jokes.Find(id);
            return View();
        }

        [HttpPost]
        [ValidateSID]
        [ValidateInput(false)]
        public ActionResult JokeEdit(Joke model)
        {
            Joke joke = new Joke();
            joke = db.Jokes.Find(model.ID);
            joke.Content = model.Content;
            db.SaveChanges();
            return RedirectToAction("JokeManager");
        }
        #endregion

        #region 直播管理

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult AddLive()
        {
            return View();
        }

        #region 增加直播
        /// <summary>
        /// 增加直播
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddLive(Live model, HttpPostedFileBase file)
        {
            if (file != null)
            {
                System.IO.Stream stream = file.InputStream;
                byte[] buffer = new byte[stream.Length];
                stream.Read(buffer, 0, (int)stream.Length);
                stream.Close();
                model.Picture = buffer;
                db.Lives.Add(model);
                db.SaveChanges();
                return Redirect("/Admin/LiveManager");
            }
            else
            {
                return Redirect("/Admin/AdminMessage?msg=你填写信息不正确，请重新填写！");
            }
        }
        #endregion

        #region 直播管理
        /// <summary>
        ///  直播管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult LiveManager(string key, DateTime? Begin, DateTime? End, int p = 0)
        {
            IEnumerable<Live> query = db.Lives.AsEnumerable();
            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(c => c.Title.Contains(key));
            }
            if (Begin.HasValue)
            {
                query = query.Where(c => c.Begin >= Begin);
            }
            if (End.HasValue)
            {
                query = query.Where(c => c.End <= End);
            }

            query = query.OrderByDescending(x => x.ID);
            ViewBag.PageInfo = PagerHelper.Do(ref query, 20, p);

            return View(query);
        }
        #endregion

        #region 直播删除
        /// <summary>
        /// 直播删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        public ActionResult LiveDelete(int id)
        {
            Live live = db.Lives.Find(id);
            db.Lives.Remove(live);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion

        #region 直播信息展示
        /// <summary>
        ///  直播信息展示
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult LiveShow(int id)
        {
            Live live = db.Lives.Find(id);
            ViewBag.Live = new vLive(live);
            return View();
        }
        #endregion

        /// <summary>
        /// 直播编辑
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult LiveEdit(int id)
        {
            Live live = db.Lives.Find(id);
            ViewBag.Live = live;
            return View();
        }

        #region 直播编辑
        /// <summary>
        /// 直播编辑 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LiveEdit(Live model, HttpPostedFileBase file)
        {
            Live live = db.Lives.Find(model.ID);
            if (file != null)
            {
                System.IO.Stream stream = file.InputStream;
                byte[] buffer = new byte[stream.Length];
                stream.Read(buffer, 0, (int)stream.Length);
                stream.Close();
                live.Picture = buffer;
            }
            live.Title = model.Title;
            live.Description = model.Description;
            live.Begin = model.Begin;
            live.End = model.End;
            live.LiveURL = model.LiveURL;
            live.NeedAuthorize = model.NeedAuthorize;
            db.SaveChanges();
            return Redirect("/Admin/LiveManager");
        }
        #endregion

        /// <summary>
        ///  增加直播完成之后的视屏
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult AddLiveVideo(int id)
        {
            ViewBag.LiveID = id;
            return View();
        }

        public ActionResult AddLiveVideo(int LiveID, HttpPostedFileBase file)
        {
            if (file != null)
            {
                string random = Helpers.DateHelper.GetTimeStamp();
                Live live = db.Lives.Find(LiveID);

                if (live.Path != null)
                {
                    var phicy = HostingEnvironment.MapPath(live.Path);
                    if (System.IO.File.Exists(phicy))
                    {
                        //如果存在则删除
                        System.IO.File.Delete(phicy);
                    }
                }


                string root = "~/LiveFile/";
                var phicyPath = HostingEnvironment.MapPath(root);

                file.SaveAs(phicyPath + random + file.FileName);


                live.Path = "/LiveFile/" + random + file.FileName;
            }
            else
            {
                return Redirect("/Admin/AdminMessage?msg=请上传文件内容");
            }
            return Redirect("/Admin/LiveShow/" + LiveID);
        }



        #endregion


        /// <summary>
        /// I实验管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ITrialManager()
        {
            ViewBag.ITrials = db.ITrials.OrderByDescending(i => i.Time).ToList();
            return View();
        }

        [HttpGet]
        public ActionResult AddITrial()
        {

            return View();
        }

        /// <summary>
        /// 执行增加I实验
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult AddITrial(ITrial model, HttpPostedFileBase file)
        {
            System.IO.Stream stream = file.InputStream;
            byte[] buffer = new byte[stream.Length];
            stream.Read(buffer, 0, (int)stream.Length);
            stream.Close();
            model.Picture = buffer;
            model.Time = DateTime.Now;
            db.ITrials.Add(model);
            db.SaveChanges();
            return Redirect("/Admin/ITrialManager");
        }

        /// <summary>
        ///   显示I实验
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ITrialShow(int id)
        {
            ViewBag.ITrial = db.ITrials.Find(id);
            return View();
        }

        [HttpGet]
        public ActionResult ITrialEdit(int id)
        {
            ViewBag.ITrial = db.ITrials.Find(id);
            return View();
        }


        /// <summary>
        /// 执行修改
        /// </summary>
        /// <param name="model"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ITrialEdit(ITrial model, HttpPostedFileBase file)
        {

            ITrial itrial = db.ITrials.Find(model.ID);
            itrial.Title = model.Title;
            itrial.Description = model.Description;
            itrial.URL = model.URL;
            itrial.Priority = model.Priority;
            if (file != null)
            {
                System.IO.Stream stream = file.InputStream;
                byte[] buffer = new byte[stream.Length];
                stream.Read(buffer, 0, (int)stream.Length);
                stream.Close();
                itrial.Picture = buffer;
            }
            db.SaveChanges();
            return Redirect("/Admin/ITrialManager");
        }


        /// <summary>
        /// 产品管理
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ProductManager(string key, DateTime? Begin, DateTime? End, int p = 0)
        {
            IEnumerable<Product> query = db.Products.AsEnumerable();
            if (CurrentUser.Role == Role.Business)
            {
                query = query.Where(c => c.UserID == CurrentUser.ID);
            }
            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(c => c.Title.Contains(key));
            }
            if (Begin.HasValue)
            {
                query = query.Where(c => c.Time >= Begin);
            }
            if (End.HasValue)
            {
                query = query.Where(c => c.Time <= End);
            }
            query = query.OrderByDescending(x => x.Time);
            ViewBag.PageInfo = PagerHelper.Do(ref query, 50, p);
            return View(query);
        }

        [HttpGet]
        public ActionResult AddProduct()
        {
            return View();
        }

        [HttpPost]
        public ActionResult AddProduct(Product model)
        {
            model.UserID = CurrentUser.ID;
            model.Time = DateTime.Now;
            db.Products.Add(model);
            db.SaveChanges();

            string root = "~/ProductFile/" + model.Title + "/";
            var phicyPath = HostingEnvironment.MapPath(root);
            Directory.CreateDirectory(phicyPath);

            return Redirect("/Admin/ProductManager");
        }

        [HttpGet]
        public ActionResult ProductShow(int id)
        {
            Product product = db.Products.Find(id);
            ViewBag.Product = new vProduct(product);
            return View();
        }

        [HttpGet]
        public ActionResult AddProductImage(int id)
        {
            ViewBag.ProductID = id;
            return View();
        }

        /// <summary>
        /// 增加图片
        /// </summary>
        /// <param name="ProductID"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddProductImage(int ProductID, HttpPostedFileBase file)
        {
            if (file != null)
            {
                string random = Helpers.DateHelper.GetTimeStamp();
                Product product = db.Products.Find(ProductID);
                ProductFile productFile = new ProductFile();
                productFile.ProductID = ProductID;
                productFile.FileTypeAsInt = 0;

                string root = "~/ProductFile/" + product.Title + "/";
                var phicyPath = HostingEnvironment.MapPath(root);

                file.SaveAs(phicyPath + random + file.FileName);

                productFile.Path = "/ProductFile/" + product.Title + "/" + random + file.FileName;

                db.ProductFiles.Add(productFile);
                db.SaveChanges();

                return Redirect("/Admin/ProductShow/" + ProductID);
            }
            else
            {
                return Redirect("/Admin/AdminMessage?msg=你没有选择图片文件");
            }
        }

        [HttpGet]
        public ActionResult AddProductVideo(int id)
        {
            ViewBag.ProductID = id;
            return View();
        }

        /// <summary>
        /// 增加视屏
        /// </summary>
        /// <param name="ProductID"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddProductVideo(int ProductID, HttpPostedFileBase file)
        {
            if (file != null)
            {
                string random = Helpers.DateHelper.GetTimeStamp();
                Product product = db.Products.Find(ProductID);
                ProductFile productFile = new ProductFile();
                productFile.ProductID = ProductID;
                productFile.FileTypeAsInt = 1;

                string root = "~/ProductFile/" + product.Title + "/";
                var phicyPath = HostingEnvironment.MapPath(root);

                file.SaveAs(phicyPath + random + file.FileName);

                productFile.Path = "/ProductFile/" + product.Title + "/" + random + file.FileName;

                db.ProductFiles.Add(productFile);
                db.SaveChanges();

                return Redirect("/Admin/ProductShow/" + ProductID);
            }
            else
            {
                return Redirect("/Admin/AdminMessage?msg=你没有选择视频文件");
            }
        }

        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        public ActionResult ProductDelete(int id)
        {
            List<ProductFile> files = new List<ProductFile>();
            files = db.ProductFiles.Where(pf => pf.ProductID == id).ToList();
            Product product = new Product();
            product = db.Products.Find(id);
            foreach (var item in files)
            {
                db.ProductFiles.Remove(item);
            }
            db.Products.Remove(product);
            db.SaveChanges();
            string root = "~/ProductFile/" + product.Title + "/";
            var phicyPath = HostingEnvironment.MapPath(root);

            DirectoryInfo di = new DirectoryInfo(phicyPath);
            di.Delete(true);

            return Content("ok");
        }

        [HttpGet]
        public ActionResult ProductEdit(int id)
        {
            ViewBag.Product = db.Products.Find(id);
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ProductEdit(Product model)
        {
            Product product = db.Products.Find(model.ID);
            product.Title = model.Title;
            product.Description = model.Description;
            product.Price = model.Price;
            db.SaveChanges();
            return Redirect("/Admin/ProductShow/" + model.ID);
        }

        [HttpPost]
        [ValidateSID]
        public ActionResult ProductImageDelete(int id)
        {
            ProductFile productFile = db.ProductFiles.Find(id);
            var phicyPath = HostingEnvironment.MapPath(productFile.Path);
            db.ProductFiles.Remove(productFile);
            db.SaveChanges();
            if (System.IO.File.Exists(phicyPath))
            {
                //如果存在则删除
                System.IO.File.Delete(phicyPath);
            }

            return Content("ok");
        }

        [HttpPost]
        [ValidateSID]
        public ActionResult ProductVideoDelete(int id)
        {
            ProductFile productFile = db.ProductFiles.Find(id);
            var phicyPath = HostingEnvironment.MapPath(productFile.Path);
            db.ProductFiles.Remove(productFile);
            db.SaveChanges();
            if (System.IO.File.Exists(phicyPath))
            {
                //如果存在则删除
                System.IO.File.Delete(phicyPath);
            }

            return Content("ok");
        }

        #region 增加课程测试
        /// <summary>
        /// 增加问题
        /// </summary>
        /// <param name="lid"></param>
        /// <returns></returns>
        [HttpGet]

        public ActionResult AddCourseQuestion(int Cid)
        {
            ViewBag.CourseID = Cid;
            return View();
        }
        #endregion

        #region 增加课程测试
        /// <summary>
        /// 增加问题
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>

        [HttpPost]
        [ValidateInput(false)]
        [ValidateAntiForgeryToken]
        public ActionResult AddCourseQuestion(CourseQuestion model)
        {
            var options = Request.Params.GetValues("option");
            string Answers = "";
            for (int i = 0; i < options.Count(); i++)
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
            db.CourseQuestions.Add(model);
            db.SaveChanges();
            return Redirect("/Admin/CourseShow/" + model.CourseID);
        }
        #endregion


        #region 删除课程测试
        /// <summary>
        /// 删除问题
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateSID]
        public ActionResult CourseQuestionDelete(int id)
        {
            CourseQuestion coursequestion = new CourseQuestion();
            coursequestion = db.CourseQuestions.Find(id);
            db.CourseQuestions.Remove(coursequestion);
            db.SaveChanges();
            return Content("ok");
        }
        #endregion
    }
}