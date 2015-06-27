using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class LearningRecord
    {
        public int ID { set; get; }

        public DateTime Time { get; set; }

        [ForeignKey("Lession")]
        public int LessionID { get; set; }
        public virtual Lession Lession { set; get; }

        [ForeignKey("User")]
        public int UserID { get; set; }

        public virtual User User { get; set; }

        /// <summary>
        /// 视屏学习到那个时间点
        /// </summary>
        public double? VideoTime { set; get; }

 
    }
}