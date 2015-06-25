using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vNote
    {

        public int ID { get; set; }

        public int LessionID { get; set; }
        public virtual Lession Lession { get; set; }

        public int UserID { get; set; }
        public virtual User User { get; set; }

        public DateTime Time { get; set; }


        public string Content { get; set; }

        public vNote(Note model)
        {
            this.ID = model.ID;
            this.LessionID = model.LessionID;
            this.UserID = model.UserID;
            this.User = model.User;
            this.Lession = model.Lession;
            this.Time = model.Time;
            this.Content = QqhrCitizen.Helpers.HtmlFilter.Instance.SanitizeHtml(Content);
        }
    }
}