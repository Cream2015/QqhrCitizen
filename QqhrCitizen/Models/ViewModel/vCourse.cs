using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vCourse
    {
        public int ID { get; set; }

        public int CourseTypeID { get; set; }
        public TypeDictionary TypeDictionary { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
    
        public int UserID { get; set; }

        public string Username { get; set; }
        public DateTime Time { get; set; }
        public string Remark { get; set; }

        public List<CourseQuestion> CourseQuestions { get; set; }


        public List<Lession> Lessions { set; get; }

        public string Sumamry { get; set; }

        public int Browses { get; set; }

        public vCourse() { }

        public vCourse(Course model)
        {
            DB db = new DB();
            this.ID = model.ID;
            this.CourseTypeID = model.CourseTypeID;
            this.TypeDictionary = model.TypeDictionary;
            this.Title = model.Title;
            this.Description = model.Description;
            this.UserID = model.UserID;
            this.Username = model.User.Username;
            this.Time = model.Time;
            this.Remark = model.Remark;
           // this.AuthorityAsInt = model.AuthorityAsInt;
            this.Browses = model.Browses;
            Lessions = (from l in db.Lessions where l.CourseID == model.ID select l).ToList();
            this.Sumamry = Helpers.String.SubString(QqhrCitizen.Helpers.HtmlFilter.Instance.SanitizeHtml(model.Description), 50, "...");
        }

    }
}