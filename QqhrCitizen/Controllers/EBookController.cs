using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using Aspose.Words;
using System.IO;
using System.Web;

namespace QqhrCitizen.Controllers
{
    public class EBookController : BaseController
    {
        // GET: EBook
        public ActionResult Index()
        {


            List<EBook> HotBooks = new List<EBook>();
            List<EBook> NewBooks = new List<EBook>();

            List<ReadRecord> lstRecord = new List<ReadRecord>();
            List<vReadRecord> _lstRecord = new List<vReadRecord>();
            List<TypeDictionary> lstHotType = new List<TypeDictionary>();


            HotBooks = db.EBooks.OrderByDescending(b => b.Browses).Take(10).ToList();
            NewBooks = db.EBooks.OrderByDescending(b => b.Time).Take(12).ToList();
            lstRecord = db.ReadRecords.OrderByDescending(r => r.Time).Take(8).ToList();

            foreach (var item in lstRecord)
            {
                _lstRecord.Add(new vReadRecord(item));
            }
            lstHotType = db.EBooks.OrderByDescending(c => c.Browses).Select(x => x.TypeDictionary).DistinctBy(x => new { x.ID }).ToList();
            ViewBag.HotBooks = HotBooks;
            ViewBag.NewBooks = NewBooks;
            ViewBag.LstRecord = _lstRecord;
            ViewBag.LstHotType = lstHotType;
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
            return File(path, book.File.ContentType, Url.Encode(book.File.FileName));
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
            ReadRecord recored = new ReadRecord();
            if (CurrentUser != null)
            {
                recored.EBookID = id;
                recored.UserID = CurrentUser.ID;
                recored.Time = DateTime.Now;
                db.ReadRecords.Add(recored);
            }


            List<EBook> LstNewEBook = new List<EBook>();
            List<TypeDictionary> lstType = new List<TypeDictionary>();
            List<ReadRecord> lstRecord = new List<ReadRecord>();
            List<vReadRecord> _lstRecord = new List<vReadRecord>();
            List<EBook> lstInterestBook = new List<EBook>();


            var Ebook = db.EBooks.Find(id);
            Ebook.Browses += 1;
            db.SaveChanges();
            LstNewEBook = db.EBooks.OrderByDescending(c => c.Time).Take(12).ToList();
            lstType = db.TypeDictionaries.Where(tp => tp.FatherID == Ebook.TypeDictionary.FatherID && tp.ID != Ebook.TypeDictionary.ID).ToList();
            lstRecord = db.ReadRecords.Where(r => r.EBookID == id).OrderByDescending(r => r.Time).Take(8).ToList();
            lstInterestBook = db.EBooks.Where(e => e.EBookTypeID == Ebook.EBookTypeID && e.ID != Ebook.ID).OrderByDescending(e => e.Browses).Take(5).ToList();
            foreach (var item in lstRecord)
            {
                _lstRecord.Add(new vReadRecord(item));
            }
            ViewBag.LstRecord = _lstRecord;
            ViewBag.LstNewEBook = LstNewEBook;
            ViewBag.Ebook = Ebook;
            ViewBag.LstType = lstType;
            ViewBag.LstInterestBook = lstInterestBook;
            return View();
        }
        #endregion

        #region 图书截图
        /// <summary>
        /// 图书截图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult ShowPicture(int id)
        {
            EBook book = new EBook();
            book = db.EBooks.Find(id);
            return File(book.Picture, "image/jpg");
        }
        #endregion


        /// <summary>
        ///  发现电子书
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Discovery(int id)
        {
            List<TypeDictionary> types = new List<TypeDictionary>();
            types = db.TypeDictionaries.Where(t => t.Belonger == TypeBelonger.电子书 && t.FatherID == 0).ToList();
            ViewBag.Tid = id;
            var type = new TypeDictionary();
            if (id != 0)
            {
                type = db.TypeDictionaries.Find(id);
            }
            ViewBag.Type = id;

            ViewBag.Types = types;
            return View();
        }

        public ActionResult Read(int id)
        {
            var Ebook = db.EBooks.Find(id);
            if (Ebook.FileID.ToString() != "null")
            {
                var File = db.Files.Find(Ebook.FileID);
                Ebook.Browses += 1;
                db.SaveChanges();
                System.IO.FileInfo file = new System.IO.FileInfo(File.FileName);
                if (file.Extension == ".doc" || file.Extension == ".docx")
                {
                    ViewBag.FileLoad = WordToPdf(Server.MapPath("~/Upload/EBook" + File.Path), file.Name);
                }
                else
                {
                    ViewBag.FileLoad = "../Upload/EBook" + File.Path;
                }
            }
            else
            {
                ViewBag.FileLoad = "../Upload/1.pdf";
            }
            ViewBag.Ebook = Ebook;
            return View();
        }

        private string WordToPdf(string wordFileLoad, string fileName)
        {
            Aspose.Words.Document d = new Aspose.Words.Document(wordFileLoad);
            string filePhysicalPath = "/Upload/EBook/" + fileName + "/";
            string filepath = Server.MapPath(filePhysicalPath);
            string setfileload = "../" + filePhysicalPath + fileName + ".pdf";
            if (!Directory.Exists(filePhysicalPath))
            {
                Directory.CreateDirectory(filepath);
                //d.Save(Server.MapPath(setfileload), SaveFormat.Html);
                d.Save(Server.MapPath(filePhysicalPath + fileName + ".pdf"), SaveFormat.Pdf);
                return setfileload;
            }
            else
            {
                return ".." + filePhysicalPath + fileName + ".pdf";
            }
        }

    }
}