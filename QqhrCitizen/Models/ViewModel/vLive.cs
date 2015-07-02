using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vLive
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string LiveURL { get; set; }

        public DateTime Begin { get; set; }

        public DateTime End { get; set; }

        public vLive() { }

        public vLive(Live model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            this.Description = model.Description;
            this.LiveURL = model.LiveURL;
            this.Begin = model.Begin;
            this.End = model.End;
        }
    }
}