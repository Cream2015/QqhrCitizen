using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class StudyRecord
    {
        public int ID { get; set; }

        [ForeignKey("Lession")]
        public int LessionID { get; set; }
        public virtual Lession Lession { set; get; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public virtual User User { get; set; }

        public DateTime Time { get; set; }
    }
}