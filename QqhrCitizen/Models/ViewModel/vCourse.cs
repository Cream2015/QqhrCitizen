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
        public virtual TypeDictionary TypeDictionary { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
    
        public int UserID { get; set; }

        public string Username { get; set; }
        public string Time { get; set; }
        public string Remark { get; set; }

        public int AuthorityAsInt { set; get; }

     
    }
}