using CodeComb.Video;
using QqhrCitizen.Filters;
using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
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
        [ValidateAntiForgeryToken]
        public ActionResult Register(vRegister model)
        {
            if (ModelState.IsValid)
            {
                User user1 = new User();
                user1 = db.Users.Where(u => u.Username == model.Username).SingleOrDefault();
                if (user1 == null)
                {
                    User user = new User { Username = model.Username, Password = Helpers.Encryt.GetMD5(model.Password), RoleAsInt = model.RoleAsInt, Realname = model.Realname, Email = model.Email, Phone = model.Phone, Address = model.Address, Score = 0 };
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
            }
            else
            {
                ModelState.AddModelError("", "您填写的信息有误，请重新填写");
            }
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

        /// <summary>
        ///  得到个人产品信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Product()
        {
            List<Product> products = new List<Models.Product>();
            int uid = CurrentUser.ID;
          //  products = db.Products.Where(x => x.ProductCategory == ProductCategory.作品 && x.TUserID == uid).ToList();
            ViewBag.Products = products;

            User user = db.Users.Find(uid);
            ViewBag.User = user;

            return View();
        }

        /// <summary>
        /// 按页获取用用户的作品
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetUserProducts(int page)
        {
            List<Product> products = new List<Product>();
            List<vProductListModel> _products = new List<vProductListModel>();
            int uid = CurrentUser.ID;
            int index = page * 12;
           // products = db.Products.Where(x => x.ProductCategory == ProductCategory.作品 && x.TUserID == uid).OrderByDescending(p => p.Time).Skip(index).Take(12).ToList();
            foreach (var item in products)
            {
                _products.Add(new vProductListModel(item));
            }
            return Content(Newtonsoft.Json.JsonConvert.SerializeObject(_products));
        }

        /// <summary>
        /// 作品展示
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ProductShow(int id)
        {
            Product product = new Models.Product();
            product = db.Products.Find(id);

            User user = db.Users.Find(CurrentUser.ID);
            ViewBag.User = user;

            ViewBag.Product = new vProduct(product);
            return View();
        }

        [HttpGet]
        public ActionResult ProductEdit(int id)
        {
            Product product = new Models.Product();
            product = db.Products.Find(id);

            User user = db.Users.Find(CurrentUser.ID);
            ViewBag.User = user;

            ViewBag.Product = new vProduct(product);
            return View();
        }

        /// <summary>
        /// 上传视频
        /// </summary>
        /// <param name="ProductID"></param>
        /// <returns></returns>
        public ActionResult VideoUpload(int ProductID, int? InfoID)
        {
            HttpPostedFileBase file = Request.Files[0];
            if (file != null)
            {
                if (InfoID == null)
                {
                    ProductUserInfo info = new ProductUserInfo();
                    info.Time = DateTime.Now;
                    info.ProductID = ProductID;
                    info.Status = ProductUserInfoStatusEnum.审核中;
                    info.AuthorID = CurrentUser.ID;
                    db.ProductUserInfos.Add(info);
                    db.SaveChanges();
                    InfoID = info.ID;
                }


                string random = Helpers.DateHelper.GetTimeStamp();
                Product product = db.Products.Find(ProductID);
                ProductFile productFile = new ProductFile();
                productFile.ProductID = ProductID;
                productFile.FileTypeAsInt = 1;


                string root = "~/ProductFile/" + product.ID + "/";
                var phicyPath = HostingEnvironment.MapPath(root);

                file.SaveAs(phicyPath + random + file.FileName);


                var exten = Path.GetExtension(file.FileName);

                if (!exten.Equals(".flv"))
                {
                    var video = new VideoFile(phicyPath + random + file.FileName);
                    video.Convert(".flv", Quality.Medium).MoveTo(phicyPath + random + ".flv");
                    productFile.Path = "/ProductFile/" + product.ID + "/" + random + ".flv";
                    if (System.IO.File.Exists(phicyPath + random + file.FileName))
                    {
                        //如果存在则删除
                        System.IO.File.Delete(phicyPath + random + file.FileName);
                    }
                }
                else
                {
                    productFile.Path = "/ProductFile/" + product.ID + "/" + random + file.FileName;
                }



                productFile.PUId = InfoID;
                db.ProductFiles.Add(productFile);
                db.SaveChanges();

                return Json(new { filePath = productFile.Path, PUId = InfoID });
            }
            else
            {
                return Json(new { filePath = "" });
            }
        }

        /// <summary>
        ///   上传图片
        /// </summary>
        /// <param name="ProductID"></param>
        /// <returns></returns>
        public ActionResult ImageUpload(int ProductID, int? InfoID)
        {
            HttpPostedFileBase file = Request.Files[0];
            if (file != null)
            {

                if (InfoID == null)
                {
                    ProductUserInfo info = new ProductUserInfo();
                    info.Time = DateTime.Now;
                    info.ProductID = ProductID;
                    info.Status = ProductUserInfoStatusEnum.审核中;
                    info.AuthorID = CurrentUser.ID;
                    db.ProductUserInfos.Add(info);
                    db.SaveChanges();
                    InfoID = info.ID;
                }

                string random = Helpers.DateHelper.GetTimeStamp();
                Product product = db.Products.Find(ProductID);
                ProductFile productFile = new ProductFile();
                productFile.ProductID = ProductID;
                productFile.FileTypeAsInt = 0;
                productFile.Source = SourceEnum.管理员;
                productFile.IsUse = false;

                string root = "~/ProductFile/" + product.ID + "/";
                var phicyPath = HostingEnvironment.MapPath(root);

                file.SaveAs(phicyPath + random + file.FileName);

                productFile.Path = "/ProductFile/" + product.ID + "/" + random + file.FileName;

                productFile.PUId = InfoID;
                db.ProductFiles.Add(productFile);
                db.SaveChanges();

                return Json(new { filePath = productFile.Path, PUId = InfoID });
            }
            else
            {
                return Json(new { filePath = "" });
            }
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult EditProductInfo(string Description, string Title, int ProductID, int? InfoID)
        {
            if (InfoID == null)
            {
                ProductUserInfo info = new ProductUserInfo();
                info.Description = Description;
                info.Title = Title;
                info.ProductID = ProductID;
                info.Time = DateTime.Now;
                info.AuthorID = CurrentUser.ID;
                db.ProductUserInfos.Add(info);
                db.SaveChanges();
            }
            else
            {
                ProductUserInfo info = new ProductUserInfo();
                info = db.ProductUserInfos.Find(InfoID);
                info.Description = Description;
                info.Title = Title;
                info.ProductID = ProductID;
                db.SaveChanges();
            }

            return Redirect("/User/ProductShow/"+ ProductID);
        }


        /// <summary>
        ///  作品申请记录
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ProductEditRecord(int id)
        {
            List<ProductUserInfo> records = new List<ProductUserInfo>();
            records = db.ProductUserInfos.Where(p => p.ProductID == id).OrderByDescending(p=>p.Time).ToList();
            User user = db.Users.Find(CurrentUser.ID);
            ViewBag.User = user;
            return View(records);
        }

        [HttpGet]
        public ActionResult ShowProductUserRecord(int id)
        {
            var record = new ProductUserInfo();
            record = db.ProductUserInfos.Find(id);
            User user = db.Users.Find(CurrentUser.ID);
            ViewBag.User = user;
            return View(new vUserProductInfo(record));
        }

    }
}