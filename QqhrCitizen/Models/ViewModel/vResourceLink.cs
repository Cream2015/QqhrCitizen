using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vResourceLink
    {
        public int ID { get; set; }

        public string Title { get; set; }
        public string URL { get; set; }
        public DateTime Time { get; set; }

        public int LinkTypeID { get; set; }
        public TypeDictionary TypeDictionary { get; set; }
        public bool IsHaveFile { get; set; }

        public int FileID { get; set; }

        public File File { set; get; }
        public int UserID { get; set; }

        public string Username { get; set; }

        public vResourceLink() { }

        public vResourceLink(ResourceLink model)
        {
            DB db =new DB();
            this.ID = model.ID;
            this.Title = model.Title;
            this.URL =  model.URL;
            this.Time = model.Time;
            this.LinkTypeID = model.LinkTypeID;
            this.TypeDictionary = model.TypeDictionary;
            this.IsHaveFile = model.IsHaveFile;
            this.FileID = model.FileID;
            if(IsHaveFile)
            {
                File = db.Files.Find(model.FileID);
            }
            this.UserID = model.UserID;
            this.Username = model.User.Username;
        }
    }
}