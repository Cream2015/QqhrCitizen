using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 课程资源 by JX123
    /// </summary>
    public class Course
    {
        public int ID { get; set; }
        [ForeignKey("TypeDictionary")]
        public int CourseTypeID { get; set; }
        public virtual TypeDictionary TypeDictionary { get; set; }
        [StringLength(100)]
        public string Title { get; set; }
        public string Description { get; set; }
        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }
        public DateTime Time { get; set; }
        public string Remark { get; set; }

        public int AuthorityAsInt { set; get; }

        public int Browses { get; set; }

        [NotMapped]
        public Authority Authority
        {
            set { AuthorityAsInt = (int)value; }
            get { return (Authority)AuthorityAsInt; }
        }

        /// <summary>
        ///   学分
        /// </summary>
        public int Credit { get; set; }
    }
}