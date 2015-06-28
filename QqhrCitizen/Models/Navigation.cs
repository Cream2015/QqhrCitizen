using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Text;
using System.Text.RegularExpressions;

namespace QqhrCitizen.Models
{
    public class Navigation
    {
        public int ID { set; get; }

        public string Title { set; get; }

        public string Url { get; set; }

        /// <summary>
        ///   a标签ID
        /// </summary>
        public string Nav_Id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string Km_st_Id { get; set; }
    }
}