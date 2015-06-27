using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vStudyRecord
    {
        public int ID { get; set; }


        public int LessionID { get; set; }

        public Lession Lession { set; get; }


        public int UserID { get; set; }

        public User User { get; set; }

        public string Time { get; set; }


        public vStudyRecord() { }

        public vStudyRecord(StudyRecord model)
        {
            this.ID = model.ID;
            this.LessionID = model.ID;
            this.Lession = model.Lession;
            this.UserID = model.UserID;
            this.User = model.User ;
            this.Time = Helpers.Time.ToTimeTip(model.Time);
        }
    }
}