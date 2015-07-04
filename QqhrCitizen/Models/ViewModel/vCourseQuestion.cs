using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vCourseQuestion
    {
        public int ID { get; set; }
        public string Content { get; set; }
        public string Remark { get; set; }

        public string RightAnswer { get; set; }
        public DateTime Time { get; set; }

        public int CourseID { get; set; }
        public Course Course { get; set; }

        public List<string> Answers { set; get; }
        public vCourseQuestion(){}

        public vCourseQuestion(CourseQuestion model)
        {
            this.ID = ID;
            this.Content = model.Content;
            this.RightAnswer = model.RightAnswer;
            this.Remark = model.Remark;
            this.Time = model.Time;
            this.CourseID = model.CourseID;
            this.Course = model.Course;
            this.Answers= model.Answers.Split('|').ToList();
        }
    }
}