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
    public class CourseController : BaseController
    {
        //
        // GET: /Course/
        public ActionResult Index()
        {
            string tid = HttpContext.Request.QueryString["tid"].ToString();
            ViewBag.Tid = tid;
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

            var listLessions = db.Lessions.Where(lession => lession.CourseID == id).ToList();
            return View(listLessions);
        }


        /// <summary>
        /// 得到该课时的详细信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult LessionDetails(int id)
        {

            var Lession = db.Lessions.Find(id);
            ViewBag.Lession = Lession;
            return View();
        }
	}
}