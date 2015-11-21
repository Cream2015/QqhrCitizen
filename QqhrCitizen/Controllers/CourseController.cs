﻿using QqhrCitizen.Filters;
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
            List<Course> LstNewCourse = new List<Course>();
            List<TypeDictionary> LstHotType = new List<TypeDictionary>();
            List<vCourse> _LstNewCourse = new List<vCourse>();
            List<TypeDictionary> LstType = new List<TypeDictionary>();

            List<Course> LstHotCourse = new List<Course>();
            List<vCourse> _LstHotCourse = new List<vCourse>();

            List<StudyRecord> records = new List<StudyRecord>();
            List<vStudyRecord> LstRecord = new List<vStudyRecord>();
            records = db.StudyRecords.OrderByDescending(sr => sr.Time).DistinctBy(x => new { x.UserID }).Take(12).ToList();

            LstHotCourse = db.Courses.OrderByDescending(c => c.Browses).Take(12).ToList();

            LstNewCourse = db.Courses.OrderByDescending(c => c.Time).Take(12).ToList();
            foreach (var item in LstNewCourse)
            {
                _LstNewCourse.Add(new vCourse(item));
            }

            foreach (var item in records)
            {
                LstRecord.Add(new vStudyRecord(item));
            }

            foreach (var item in LstHotCourse)
            {
                _LstHotCourse.Add(new vCourse(item));
            }

            LstHotType = db.Courses.OrderByDescending(c => c.Browses).Select(x => x.TypeDictionary).DistinctBy(x => new { x.ID }).Take(20).ToList();


            ViewBag.LstNewCourse = _LstNewCourse;
            ViewBag.LstHotType = LstHotType;
            ViewBag.LstRecord = LstRecord;
            ViewBag.LstHotCourse = _LstHotCourse;
            ViewBag.Navigation = db.Navigations.ToList();
            return View();
        }

        #region 分页得到课程
        /// <summary>
        /// 分页得到课程
        /// </summary>
        /// <param name="page"></param>
        /// <param name="tid"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getCourses(int page, int? tid)
        {
            List<Course> lstCourse = new List<Course>();
            List<vCourse> _lstCourse = new List<vCourse>();
            int index = page * 10;
            if (tid == 0 || tid == null)
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
            return Json(_lstCourse, JsonRequestBehavior.AllowGet);
            //return Content(Newtonsoft.Json.JsonConvert.SerializeObject(_lstCourse));
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
            List<vLession> lessions = new List<vLession>();

            List<StudyRecord> records = new List<StudyRecord>();
            List<vStudyRecord> LstRecord = new List<vStudyRecord>();

            records = db.StudyRecords.Where(sr => sr.Lession.CourseID == id).OrderByDescending(sr => sr.Time).DistinctBy(x => new { x.UserID }).Take(8).ToList();
            foreach (var item in records)
            {
                LstRecord.Add(new vStudyRecord(item));
            }
            ViewBag.Navigation = db.Navigations.ToList();
            var Course = db.Courses.Find(id);
            Course.Browses += 1;
            db.SaveChanges();

            //课程下面的课时
            var listLessions = db.Lessions.Where(lession => lession.CourseID == id).OrderBy(l => l.Time).ToList();
            foreach (var item in listLessions)
            {
                vLession vlession = new vLession(item);
                lessions.Add(vlession);
            }

            //相关的课程
            var lstCourse = db.Courses.Where(c => c.CourseTypeID == Course.CourseTypeID && c.ID != id).OrderByDescending(n => n.Browses).ThenByDescending(n => n.Time).Take(8).ToList();
            ViewBag.Lessions = lessions;
            ViewBag.Course = Course;
            ViewBag.lstCourse = lstCourse;
            ViewBag.LstRecord = LstRecord;
            ViewBag.LstCourse = lstCourse;
            ViewBag.Navigation = db.Navigations.ToList();
            return View();
        }


        /// <summary>
        /// 得到该课时的详细信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AccessToLession]
        public ActionResult LessionDetails(int id, int route = 1)
        {
            bool flag = false;
            var vLessions = new List<vLession>();
            var vNotes = new List<vNote>();
            Lession Lession = db.Lessions.Find(id);
            if (Lession.Path.Contains(".htm") || Lession.Path.Contains(".html"))
            {
                flag = true;
            }
            StudyRecord record = new StudyRecord();
            if (CurrentUser != null)
            {
                UserCourse userCourse = new UserCourse();
                record.LessionID = id;
                record.UserID = CurrentUser.ID;
                record.Time = DateTime.Now;

                db.StudyRecords.Add(record);

                userCourse = db.UserCourses.Where(uc => uc.UserID == CurrentUser.ID && uc.CourseID == Lession.CourseID).FirstOrDefault();
                if (userCourse == null)
                {
                    userCourse = new UserCourse();
                    userCourse.UserID = CurrentUser.ID;
                    userCourse.CourseID = Lession.CourseID;
                    userCourse.Time = DateTime.Now;
                    userCourse.IsFinisnCourse = false;
                    db.UserCourses.Add(userCourse);
                }
                else
                {
                    userCourse.Time = DateTime.Now;
                }
                var listNote = db.Notes.Where(note => note.LessionID == Lession.ID && note.UserID == CurrentUser.ID).OrderByDescending(n => n.Time).ToList();
                foreach (var item in listNote)
                {
                    vNotes.Add(new vNote(item));
                }

                ViewBag.ListNote = vNotes;
            }

            var questions = new List<vQuestion>();
            var lessions = new List<Lession>();
            Lession = db.Lessions.Find(id);
            Lession.Browses = Lession.Browses + 1;

            db.SaveChanges();
            ViewBag.Lession = Lession;
            var listQuestions = db.Questions.Where(question => question.LessionID == id).ToList();
            lessions = db.Lessions.Where(l => l.CourseID == Lession.CourseID).ToList();
            foreach (var item in listQuestions)
            {
                questions.Add(new vQuestion(item));
            }
            foreach (var item in lessions)
            {
                vLessions.Add(new vLession(item));
            }
            ViewBag.Questions = questions;
            ViewBag.Lessions = vLessions;
            ViewBag.Flag = flag;
            ViewBag.RouteCount = Lession.Route;
            ViewBag.CurrentRoute = route;
            return View("LessionDetails");
        }

        /// <summary>
        /// 得到该课时的详细信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AccessToLession]
        public ActionResult BeginCourse(int id,int route=1)
        {
            bool flag2 = false;
            var vLessions = new List<vLession>();
            var vNotes = new List<vNote>();
            Lession Lession = db.Lessions.Find(id);
            if (Lession.Path.Contains(".htm") || Lession.Path.Contains(".html"))
            {
                flag2 = true;
            }
            StudyRecord record = new StudyRecord();
            if (CurrentUser != null)
            {
                UserCourse userCourse = new UserCourse();
                record.LessionID = id;
                record.UserID = CurrentUser.ID;
                record.Time = DateTime.Now;

                db.StudyRecords.Add(record);

                userCourse = db.UserCourses.Where(uc => uc.UserID == CurrentUser.ID && uc.CourseID == Lession.CourseID).FirstOrDefault();
                if (userCourse == null)
                {
                    userCourse = new UserCourse();
                    userCourse.UserID = CurrentUser.ID;
                    userCourse.CourseID = Lession.CourseID;
                    userCourse.Time = DateTime.Now;
                    userCourse.IsFinisnCourse = false;
                    db.UserCourses.Add(userCourse);
                }
                else
                {
                    userCourse.Time = DateTime.Now;
                }
                bool flag = false;
                var temp = new LearningRecord();
                temp = db.LearningRecords.Where(sr => sr.UserID == CurrentUser.ID && sr.Lession.CourseID == Lession.CourseID).OrderByDescending(t => t.Time).FirstOrDefault();
                if (temp != null)
                {
                    id = temp.LessionID;
                    flag = true;
                }

                var listNote = db.Notes.Where(note => note.LessionID == Lession.ID && note.UserID == CurrentUser.ID).OrderByDescending(n => n.Time).ToList();
                foreach (var item in listNote)
                {
                    vNotes.Add(new vNote(item));
                }

                ViewBag.ListNote = vNotes;
            }

            var questions = new List<vQuestion>();
            var lessions = new List<Lession>();
            Lession = db.Lessions.Find(id);
            Lession.Browses = Lession.Browses + 1;

            db.SaveChanges();
            ViewBag.Lession = Lession;
            var listQuestions = db.Questions.Where(question => question.LessionID == id).ToList();
            lessions = db.Lessions.Where(l => l.CourseID == Lession.CourseID).ToList();
            foreach (var item in listQuestions)
            {
                questions.Add(new vQuestion(item));
            }
            foreach (var item in lessions)
            {
                vLessions.Add(new vLession(item));
            }
            ViewBag.Questions = questions;
            ViewBag.Lessions = vLessions;
            ViewBag.Flag = flag2;
            ViewBag.RouteCount = Lession.Route;
            ViewBag.CurrentRoute = route;
            return View("LessionDetails");
        }


        /// <summary>
        /// 添加课时笔记
        /// </summary>
        /// <param name="note"></param>
        /// <returns></returns>
        [ValidateSID]
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult AddNote(string content, int lid)
        {
            Note note = new Note();
            note.Time = DateTime.Now;
            note.UserID = CurrentUser.ID;
            note.Content = content;
            note.LessionID = lid;
            db.Notes.Add(note);
            db.SaveChanges();
            return Json(new vNote(note));
        }

        #region 播放课时视屏
        /// <summary>
        /// 播放课时视屏
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult PlayLession(int id)
        {
            Lession lession = new Lession();
            lession = db.Lessions.Find(id);
            return File("/Lessions/" + lession.Path, lession.ContentType);
        }
        #endregion


        /// <summary>
        /// 记录答题分数
        /// </summary>
        /// <param name="lid"></param>
        /// <param name="rate"></param>
        /// <returns></returns>
        public ActionResult RecordScore(int lid, double rate)
        {
            LessionScore lessionScore = new LessionScore();
            lessionScore = db.LessionScores.Where(ls => ls.LessionId == lid && ls.UserId == CurrentUser.ID).FirstOrDefault();

            if (lessionScore == null)
            {
                lessionScore = new LessionScore();
                lessionScore.UserId = CurrentUser.ID;
                lessionScore.LessionId = lid;
                lessionScore.Rate = rate;
                lessionScore.Time = DateTime.Now;
                if (rate >= 0.6)
                {
                    lessionScore.IsPassTest = true;
                }
                else
                {
                    lessionScore.IsPassTest = false;
                }
                db.LessionScores.Add(lessionScore);
            }
            else
            {
                lessionScore.Time = DateTime.Now;
                if (rate >= 0.6 && lessionScore.IsPassTest == false)
                {
                    lessionScore.IsPassTest = true;
                }
            }
            db.SaveChanges();
            return Content("ok");
        }


        /// <summary>
        /// 显示课程截图
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult ShowPicture(int id)
        {
            Course course = new Course();
            course = db.Courses.Find(id);
            if (course.Picture == null)
            {
                var path = Server.MapPath("~/Images/book.jpg");
                return File(path, "image/jpg");
                //return Content(path);
            }
            else
            {
                return File(course.Picture, "image/jpg");
            }

        }


        /// <summary>
        /// 课程列表显示
        /// </summary>
        /// <returns></returns>
        public ActionResult Discovery(int? id)
        {
            List<TypeDictionary> types = new List<TypeDictionary>();
            types = db.TypeDictionaries.Where(t => t.Belonger == TypeBelonger.课程 && t.FatherID == 0).OrderBy(t => t.PID).ToList();
            ViewBag.Tid = id;
            var type = new TypeDictionary();
            if (id != 0 && id != null)
            {
                type = db.TypeDictionaries.Find(id);
            }
            ViewBag.Type = id;
            ViewBag.Navigation = db.Navigations.ToList();
            ViewBag.Types = types;
            return View();
        }


        /// <summary>
        /// 关闭浏览器记录学习进度
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult LearningRecord(int id)
        {
            Lession Lession = new Lession();
            Lession = db.Lessions.Find(id);
            if (User.Identity.IsAuthenticated)
            {
                LearningRecord record = db.LearningRecords.Where(sr => sr.UserID == CurrentUser.ID && sr.Lession.CourseID == Lession.CourseID).FirstOrDefault();
                if (record == null)
                {
                    record = new Models.LearningRecord();
                    record.UserID = CurrentUser.ID;
                    record.LessionID = id;
                    record.Time = DateTime.Now;
                    db.LearningRecords.Add(record);
                }
                else
                {
                    record.LessionID = id;
                    record.Time = DateTime.Now;
                }

                db.SaveChanges();
            }
            return Content("");
        }

        /// <summary>
        /// 课程测试
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Test(int id)
        {
            List<LessionScore> scores = new List<LessionScore>();
            scores = db.LessionScores.Where(ls => ls.Lession.CourseID == id && ls.UserId == CurrentUser.ID).ToList();
            if (scores == null)
            {
                return Redirect("/Shared/Info?msg=请完成课时的测试在进行总测试");
            }
            foreach (var item in scores)
            {
                if (!item.IsPassTest)
                    return Redirect("/Shared/Info?msg=请完成课时的测试在进行总测试");
            }
            List<CourseQuestion> questions = new List<CourseQuestion>();
            questions = db.CourseQuestions.Where(cq => cq.CourseID == id).ToList();
            ViewBag.Questions = questions;
            ViewBag.CourseID = id;
            return View();
        }

        #region 综合测试
        /// <summary>
        /// 综合测试
        /// </summary>
        /// <param name="cid"></param>
        /// <param name="rate"></param>
        /// <returns></returns>
        public ActionResult DoTest(int cid, double rate)
        {
            Course course = new Course();
            course = db.Courses.Find(cid);
            if (rate > 0.6)
            {
                UserCourse userCourse = db.UserCourses.Where(uc => uc.UserID == CurrentUser.ID && uc.CourseID == cid).FirstOrDefault();
                userCourse.IsFinisnCourse = true;
                userCourse.Time = DateTime.Now;
                Models.User user = new User();
                user = db.Users.Find(CurrentUser.ID);
                user.Score += course.Credit;
                db.SaveChanges();
            }
            return View();
        }
        #endregion


    }
}