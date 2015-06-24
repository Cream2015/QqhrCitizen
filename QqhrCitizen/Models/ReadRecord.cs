using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class ReadRecord
    {
        public int ID { get; set; }

        [ForeignKey("EBook")]
        public int EBookID { get; set; }
        public virtual EBook EBook { set; get; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public virtual User User { get; set; }

        public DateTime Time { get; set; }

    }
}