using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vNews
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }
        public int NewsTypeID { get; set; }
        public TypeDictionary TypeDictionary { get; set; }
        public DateTime Time { get; set; }

        public int UserID { get; set; }

        public int Browses { get; set; }
        public string Username { get; set; }
        public string Sumamry { set; get; }

        public vNews() { }

        public vNews(News model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            this.Content = QqhrCitizen.Helpers.HtmlFilter.Instance.SanitizeHtml(model.Content);
            this.NewsTypeID = model.NewsTypeID;
            this.TypeDictionary = model.TypeDictionary;
            this.Time = model.Time;
            this.UserID = model.UserID;
            this.Username = model.User.Username;
            this.Browses = model.Browses;
            this.Sumamry = QqhrCitizen.Helpers.HtmlFilter.Instance.SanitizeHtml(model.Sumamry);
        }
    }
}