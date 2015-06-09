using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vLession
    {
        public int ID { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public int CourseID { get; set; }
        public virtual Course Course { get; set; }
        public DateTime Time { get; set; }
        public string Remark { get; set; }
        public string Path { get; set; }


    }
}