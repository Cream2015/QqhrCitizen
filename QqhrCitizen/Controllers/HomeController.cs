using QqhrCitizen.Filters;
using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class HomeController : BaseController
    {
        private List<News> GetTop5News()
        {
            var ret = new List<News>();
            foreach (var n in db.News.AsNoTracking().OrderBy(n => n.Priority).ThenByDescending(n => n.Browses))
            {
                if (n.ImgUrl.Count > 0)
                {
                    ret.Add(n);
                    if (ret.Count > 5)
                        break;
                }
            }
            return ret;
        }

        //
        // GET: /Home/
        public ActionResult Index()
        {
            //  List<TypeDictionary> courseTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.课程 && x.FatherID == 0).OrderBy(x => x.PID).Take(5).ToList();
            //foreach (var item in courseTypes)
            //{
            //    if (item.TypeValue.Length > 4)
            //    {
            //        item.TypeValue = item.TypeValue.Substring(0, 4);
            //    }
            //}
            //ViewBag.CourseTypes = courseTypes;

            ///市民学习子类
            List<TypeDictionary> CourseTypes = new List<TypeDictionary>();
            CourseTypes = db.TypeDictionaries.Where(td => td.FatherID == 186).OrderBy(x => x.PID).ThenByDescending(x => x.Time).Take(35).ToList();
            ViewBag.CourseTypes = CourseTypes;


            ///证书学习子类
            List<TypeDictionary> CertificateTypes = new List<TypeDictionary>();
            CertificateTypes = db.TypeDictionaries.Where(td => td.FatherID == 3).OrderBy(x => x.PID).ThenByDescending(x => x.Time).Take(9).ToList();
            ViewBag.CertificateTypes = CertificateTypes;

            ///学历学习子类
            List<TypeDictionary> EducationTypes = new List<TypeDictionary>();
            EducationTypes = db.TypeDictionaries.Where(td => td.FatherID == 29).OrderBy(x => x.PID).ThenByDescending(x => x.Time).Take(9).ToList();
            ViewBag.EducationTypes = EducationTypes;

            ///专题学习子类
            List<TypeDictionary> SubjectTypes = new List<TypeDictionary>();
            SubjectTypes = db.TypeDictionaries.Where(td => td.FatherID == 128).OrderBy(x => x.PID).ThenByDescending(x => x.Time).Take(9).ToList();
            ViewBag.SubjectTypes = SubjectTypes;

            ViewBag.Courses = db.Courses.Where(c => c.CourseTypeID == 186 || c.TypeDictionary.FatherID == 186).OrderBy(x => x.Priority).ThenByDescending(x => x.Time).Take(8).ToList();

            ViewBag.NewsTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.新闻 && x.FatherID == 0).Take(5).ToList();
            ViewBag.News = GetTop5News();
            ViewBag.MoreNews = db.News.OrderByDescending(x => x.Time).Take(10).ToList();
            ViewBag.BookTypes = db.TypeDictionaries.Where(x => x.Belonger == TypeBelonger.电子书 && x.FatherID == 0).Take(6).ToList();
            ViewBag.Books = db.EBooks.OrderByDescending(x => x.Time).Take(10).ToList();
            ViewBag.Lives = db.Lives.OrderByDescending(x => x.End).Take(5).ToList();
            ViewBag.TextLinks = db.ResourceLinks.Where(x => !x.IsHaveFile).ToList();
            ViewBag.ImgLinks = db.ResourceLinks.Where(x => x.IsHaveFile).ToList();
            ViewBag.Pictures = db.Viewpagers.OrderBy(x => x.Priority).ToList();

            ViewBag.Location = db.News.Where(n => n.PlaceAsInt == 0).OrderByDescending(n => n.Time).Take(10).ToList();
            ViewBag.Native = db.News.Where(n => n.PlaceAsInt == 1).OrderByDescending(n => n.Time).Take(10).ToList();
            ViewBag.Menus = db.Menus.ToList();


            return View();
        }

        [ValidateAntiForgeryToken]
        public ActionResult Search(string key)
        {
            List<string> hots = (List<string>)HttpContext.Application["hots"];
            if (hots == null)
            {
                hots = new List<string>();
            }
            int newsCount = db.News.Where(n => n.Title.Contains(key) || n.Content.Contains(key)).OrderByDescending(n => n.Time).Count();
            int courseCount = db.Courses.Where(c => c.Title.Contains(key)).Count();
            //int courseCount = db.Lessions.Where(l => l.Course.Title.Contains(key) || l.Title.Contains(key)).DistinctBy(l => l.CourseID).Count();
            int lessionCount = db.Lessions.Where(l => l.Title.Contains(key)).Count();
            int ebookCount = db.EBooks.Where(eb => eb.Title.Contains(key)).OrderByDescending(e => e.Time).Count();
            int liveCount = db.Lives.Where(l => l.Title.Contains(key)).OrderByDescending(e => e.Begin).Count();
            int productCount = db.Products.Where(p => p.Title.Contains(key)).OrderByDescending(e => e.Time).Count();


            if (!hots.Contains(key))
            {
                if (hots.Count < 10)
                {
                    hots.Add(key);
                }
                else
                {
                    hots.RemoveAt(0);
                    hots.Add(key);
                }
            }

            HttpContext.Application["hots"] = hots;
            ViewBag.NewsCount = newsCount;
            ViewBag.CourseCount = courseCount;
            ViewBag.EBookCount = ebookCount;
            ViewBag.LiveCount = liveCount;
            ViewBag.ProductCount = productCount;
            ViewBag.LessionCount = lessionCount;
            ViewBag.Key = key;

            ViewBag.Hots = HttpContext.Application["hots"];
            return View("SearchResult");
        }

        [HttpGet]
        public ActionResult SearchResultMore(string type, string key)
        {
            ViewBag.Type = type;
            ViewBag.Key = key;
            return View();
        }

        [HttpGet]
        public ActionResult GetSearchResultMore(string type, string key, int page)
        {
            int index = page * 10;
            if (type == "news")
            {
                var result = db.News.Where(n => n.Title.Contains(key) || n.Content.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "lession")
            {
                var result = db.Lessions.Where(n => n.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "course")
            {
                //List<int> courseIds = db.Lessions.Where(l => l.Course.Title.Contains(key) || l.Title.Contains(key)).DistinctBy(l => l.CourseID).OrderByDescending(x => x.Time).Skip(index).Take(10).Select(x => x.CourseID).ToList();
                var result = db.Courses.Where(c => c.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                //var result = new List<Course>();
                //foreach (int item in courseIds)
                //{
                //    Course course = new Course();
                //    course = db.Courses.Find(item);
                //    result.Add(course);
                //}
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "ebook")
            {
                var result = db.EBooks.Where(e => e.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "live")
            {
                var result = db.Lives.Where(e => e.Title.Contains(key)).OrderByDescending(n => n.Begin).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            if (type == "product")
            {
                var result = db.Products.Where(e => e.Title.Contains(key)).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
                List<vSearchResultModel> _result = new List<vSearchResultModel>();
                foreach (var item in result)
                {
                    _result.Add(new vSearchResultModel(item));
                }
                return Json(_result, JsonRequestBehavior.AllowGet);
            }

            return Json(null);
        }

        public ActionResult Test()
        {
            return View();
        }


        public ActionResult Msg()
        {
            return View();
        }


        public ActionResult Test1()
        {
            return View();
        }


    }
}