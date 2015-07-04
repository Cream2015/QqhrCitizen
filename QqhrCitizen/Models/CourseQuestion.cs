using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class CourseQuestion
    {
        /// <summary>
        /// 课程问题 by JX123
        /// </summary>
            public int ID { get; set; }

            public string Content { get; set; }

            public string Answers { get; set; }

            public string Remark { get; set; }

            [StringLength(2)]
            public string RightAnswer { get; set; }

            public DateTime Time { get; set; }

            [ForeignKey("Course")]
            public int CourseID { get; set; }
            public virtual Course Course { get; set; }
    }
}