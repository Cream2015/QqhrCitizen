using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 课程问题 by JX123
    /// </summary>
    public class Question
    {
        public int ID { get; set; }
        public string Content { get; set; }
        public string Answers { get; set; }
        public string Remark { get; set; }
        [StringLength(2)]
        public string RightAnswer { get; set; }
        public DateTime Time { get; set; }
        [ForeignKey("Lession")]
        public int LessionID { get; set; }
        public virtual Lession Lession { get; set; }
    }
}