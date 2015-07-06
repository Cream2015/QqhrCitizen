using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vSearchResultModel
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public string URL { get; set; }

        public string Sumamry { set; get; }

        public DateTime Time { set; get; }

        public vSearchResultModel() { }

        public vSearchResultModel(News model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            this.URL = "/News/Show/" + model.ID;
            this.Sumamry = QqhrCitizen.Helpers.HtmlFilter.Instance.SanitizeHtml(model.Sumamry);
            this.Time = model.Time;
        }

        public vSearchResultModel(Course model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            this.URL = "/Course/Show/" + model.ID;
            this.Sumamry = Helpers.String.SubString(model.Description, 50, "...");
            this.Time = model.Time;
        }

        public vSearchResultModel(EBook model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            this.URL = "/EBook/Show/" + model.ID;
            this.Sumamry = Helpers.String.SubString(model.Description, 50, "...");
            this.Time = model.Time;
        }

        public vSearchResultModel(Live model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            if (model.Begin <= DateTime.Now && model.End >= DateTime.Now)
            {
                this.URL = "/Live/Show/" + model.ID;
            }
            else
            {
                this.URL = "/Live/Review/Show/" + model.ID;
            }
            this.Sumamry = Helpers.String.SubString(model.Description,50,"...");
            this.Time = model.Begin;
        }

        public vSearchResultModel(Product model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            this.URL = "/Product/Show/"+model.ID;
            this.Sumamry = Helpers.String.SubString(model.Description,50,"...");
            this.Time = model.Time;
        }
    }
}