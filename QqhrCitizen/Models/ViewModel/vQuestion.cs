using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vQuestion
    {
        public int ID { get; set; }
        public string Content { get; set; }
        public string Remark { get; set; }

        public string RightAnswer { get; set; }
        public DateTime Time { get; set; }
     
        public int LessionID { get; set; }
        public Lession Lession { get; set; }

        public List<string> Answers { set; get; }
        public vQuestion(){}

        public vQuestion(Question model)
        {
            this.ID = ID;
            this.Content = model.Content;
            this.RightAnswer = model.RightAnswer;
            this.Remark = model.Remark;
            this.Time = model.Time;
            this.LessionID = model.LessionID;
            this.Lession = model.Lession;
            this.Answers= model.Answers.Split('|').ToList();
        }
    }
}