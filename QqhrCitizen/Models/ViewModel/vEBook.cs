using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vEBook
    {
        public int ID { get; set; }
  
        public string Title { get; set; }
        public string Description { get; set; }
   
        public int EBookTypeID { get; set; }

        public TypeDictionary TypeDictionary { get; set; }

        public TypeDictionary FatherType { set; get; }

        public DateTime Time { get; set; }

        public int UserID { get; set; }

        public  string Username { get; set; }

        public int FileID { get; set; }

        public File File { get; set; }

        /// <summary>
        /// 浏览数
        /// </summary>
        public int Browses { get; set; }

        public string Sumamry { get; set; }
        
        public vEBook() { }

        public vEBook(EBook model)
        {
            DB db = new DB();
            this.ID = model.ID;
            this.Title = model.Title;
            this.Description = model.Description;
            this.EBookTypeID = model.EBookTypeID;
            this.TypeDictionary = model.TypeDictionary;
            this.FatherType = db.TypeDictionaries.Find(model.TypeDictionary.FatherID);
            this.Time = model.Time;
            this.UserID = model.UserID;
            this.Username = model.User.Username;
            this.FileID = model.FileID;
            this.File = model.File;
            this.Browses = model.Browses;
            this.Sumamry = Helpers.String.SubString(QqhrCitizen.Helpers.HtmlFilter.Instance.SanitizeHtml(model.Description), 100, "...");
        }
    }
}