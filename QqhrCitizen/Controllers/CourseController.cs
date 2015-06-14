using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class CourseController : BaseController
    {
        //
        // GET: /Course/
        public ActionResult Index()
        {
            string tid = HttpContext.Request.QueryString["tid"].ToString();
            ViewBag.Tid = tid;
            var type = new TypeDictionary();
            if (tid != "0")
            {
                int id = Convert.ToInt32(tid);
                type = db.TypeDictionaries.Find(id);
            }
            ViewBag.Type = type.TypeValue;
            return View();
        }

        #region 分页得到课程
        /// <summary>
        /// 分页得到课程
        /// </summary>
        /// <param name="page"></param>
        /// <param name="tid"></param>
        /// <returns></returns>
        public ActionResult getCourses(int page, int tid)
        {
            List<Course> lstCourse = new List<Course>();
            List<vCourse> _lstCourse = new List<vCourse>();
            int index = page * 10;
            if (tid == 0)
            {
                lstCourse = db.Courses.OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
            }
            else
            {
                var icourses = db.Courses.Where(c => c.CourseTypeID == tid);
                var ifcourses = db.Courses.Where(n => n.TypeDictionary.FatherID == tid);
                lstCourse = icourses.Union(ifcourses).OrderByDescending(n => n.Time).Skip(index).Take(10).ToList();
            }

            foreach (var item in lstCourse)
            {
                _lstCourse.Add(new vCourse(item));
            }

            return Json(_lstCourse);
        }
        #endregion


        /// <summary>
        /// 得到该课程详细课时信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]

        public ActionResult Show(int id)
        {
            var Course = db.Courses.Find(id);
            var listLessions = db.Lessions.Where(lession => lession.CourseID == id).ToList();

            ViewBag.Lessions = listLessions;
            ViewBag.Course = Course;
            return View();
        }


        /// <summary>
        /// 得到该课时的详细信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult LessionDetails(int id)
        {
            var questions = new List<vQuestion>();
            Lession Lession = db.Lessions.Find(id);
            ViewBag.Lession = Lession;
            var listNote = db.Notes.Where(note => note.LessionID == Lession.ID).ToList();
            ViewBag.ListNote = listNote;
            var listQuestions = db.Questions.Where(question => question.LessionID == id).ToList();
            foreach (var item in listQuestions)
            {
                questions.Add(new vQuestion(item));
            }
            ViewBag.Questions = questions;
            return View();
        }

        /// <summary>
        /// 添加课时笔记
        /// </summary>
        /// <param name="note"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult AddNote(Note note)
        {
            note.Time = DateTime.Now;
            note.UserID = CurrentUser.ID;
            db.Notes.Add(note);
            db.SaveChanges();
            return Redirect("LessionDetails/" + note.LessionID);
        }

        public ActionResult PlayLession(int id)
        {
            Lession lession = new Lession();
            lession = db.Lessions.Find(id);
            return File("/Lessions/"+lession.Path, lession.ContentType);
        }
    }
}