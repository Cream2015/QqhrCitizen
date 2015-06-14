using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class LessionScore
    {
        public int ID { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public virtual User User { set; get; }

        [ForeignKey("Lession")]
        public int LessionId { get; set; }

        public virtual Lession Lession { get; set; }

        public double Rate { get; set; }
    }
}