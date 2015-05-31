﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 课时的课程 by JX123
    /// </summary>

    public class Lession
    {
        public int ID { get; set; }
        [StringLength(50)]
        public string Title { get; set; }
        public string Description { get; set; }
        [ForeignKey("Course")]
        public int CourseID { get; set; }
        public virtual Course Course{ get; set; }
        public DateTime Time { get; set; }
        public string Remark { get; set; }
        public string Path { get; set; }
        //[ForeignKey("User")]
        //public int UserID { get; set; }
        //public virtual User User { get; set; }
    }
}