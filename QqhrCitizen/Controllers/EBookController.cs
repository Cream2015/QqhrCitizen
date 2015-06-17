using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;

namespace QqhrCitizen.Controllers
{
    public class EBookController : BaseController
    {
        // GET: EBook
        public ActionResult Index()
        {
            string tid = HttpContext.Request.QueryString["tid"].ToString();
            ViewBag.Tid = tid;
            var lstBooks = db.EBooks.OrderByDescending(b => b.Browses).Take(8).ToList();
            var type = new TypeDictionary();
            if (tid != "0")
            {
                int id = Convert.ToInt32(tid);
                type = db.TypeDictionaries.Find(id);
            }
            ViewBag.Type = type.TypeValue;
            ViewBag.EBooks = lstBooks;
            return View();
        }

        #region 分页获取图书
        /// <summary>
        ///   分页获取图书
        /// </summary>
        /// <param name="page"></param>
        /// <param name="tid"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult getEBookes(int page, int tid)
        {
            List<EBook> lstEBook = new List<EBook>();
            List<vEBook> _lstEBook = new List<vEBook>();
            int index = page * 10;
            if (tid == 0)
            {
                lstEBook = db.EBooks.OrderByDescending(eb => eb.Time).Skip(index).Take(10).ToList();
            }
            else
            {
                var iebook = db.EBooks.Where(eb => eb.EBookTypeID == tid);
                var ifbook = db.EBooks.Where(eb => eb.TypeDictionary.FatherID == tid);
                lstEBook = iebook.Union(ifbook).OrderByDescending(eb => eb.Time).Skip(index).Take(10).ToList();
            }

            foreach (var item in lstEBook)
            {
                _lstEBook.Add(new vEBook(item));
            }

            return Json(_lstEBook);
        }
        #endregion



        #region 电子书下载
        /// <summary>
        /// 电子书下载
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Download(int id)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(id);
            var path = Server.MapPath("~/Upload/" + book.File.Path);
            return File(path,book.File.ContentType, Url.Encode(book.File.FileName));
        }
        #endregion


        #region 显示图书信息
        /// <summary>
        /// 显示图书信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Show(int id)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(id);
            book.Browses += 1;
            db.SaveChanges();
            ViewBag.Ebook = new vEBook(book);

            List<EBook> lstEBook  = new List<EBook>();
            lstEBook = db.EBooks.Where(b => b.EBookTypeID == book.EBookTypeID && b.ID != id).OrderByDescending(b => b.Time).Take(8).ToList();
            ViewBag.EBooks = lstEBook;
            return View();
        } 
        #endregion


        public ActionResult WordShow(int id)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(id);
            ViewBag.EBook  = book;
            string host = Request.Url.Host;
            string port = Request.Url.Port.ToString();
            ViewBag.Address = host + ":" + port;
            return View();
        }
    }
} 