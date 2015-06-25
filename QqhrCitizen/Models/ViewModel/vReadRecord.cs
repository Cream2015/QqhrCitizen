using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vReadRecord
    {
        public int ID { get; set; }

       
        public int EBookID { get; set; }
        public EBook EBook { set; get; }

        
        public int UserID { get; set; }

        public User User { get; set; }

        public string Time { get; set; }


        public vReadRecord() { }

        public vReadRecord(ReadRecord model)
        {
            this.ID = model.ID;
            this.EBookID = model.EBookID;
            this.EBook = model.EBook;
            this.UserID = model.UserID;
            this.User = model.User;
            this.Time = Helpers.Time.ToTimeTip(model.Time);
        }
    }
}