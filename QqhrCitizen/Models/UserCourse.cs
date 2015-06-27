using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class UserCourse
    {
        public int ID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public virtual User User { get; set; }

        [ForeignKey("Course")]
        public int CourseID  { get; set; }

        public virtual Course Course { get; set; }

        public bool IsFinisnCourse  { get; set; }

        public DateTime Time { get; set; }
    }
}