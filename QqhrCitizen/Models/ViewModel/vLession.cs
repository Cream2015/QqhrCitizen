using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vLession
    {
        public int ID { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public int CourseID { get; set; }
        public Course Course { get; set; }
        public DateTime Time { get; set; }
        public string Remark { get; set; }
        public string ContentType { set; get; }
        public List<Question> Questions { get; set; }

        public int Browses { set; get; }
        public double Rate { set; get; }
        public vLession() { }

        public vLession(Lession model)
        {
            DB db = new DB();
            this.ID = model.ID;
            this.Title = model.Title;
            this.Description = model.Description;
            this.CourseID = model.CourseID;
            this.Course = model.Course;
            this.Time = model.Time;
            this.Remark = model.Remark;
            this.Questions = db.Questions.Where(c => c.LessionID == model.ID).ToList();
            this.Browses = model.Browses;
        }

        public void SetDate(int uid)
        {
            DB db = new DB();
            LessionScore lessionScore = db.LessionScore.Where(ls => ls.UserId == uid && ls.LessionId == this.ID).OrderByDescending(ls => ls.ID).FirstOrDefault();
            if (lessionScore == null)
            {
                this.Rate = 0;
            }
            else
            {
                this.Rate = lessionScore.Rate;
            }
        }
    }
}